# Deploying to AWS

This file provides comprehensive guidance for deploying applications to Amazon Web Services (AWS).

## Overview

This guide covers deployment strategies for our applications on AWS, including containerized applications, serverless functions, and infrastructure as code.

## Prerequisites

### AWS Account Setup
- AWS account with appropriate permissions
- AWS CLI installed and configured
- IAM user with programmatic access
- MFA enabled for security

### Required Tools
```bash
# Install AWS CLI
# macOS
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Windows
# Download and install from https://aws.amazon.com/cli/

# Install other tools
pip install boto3
npm install -g aws-cdk
```

### Configure AWS CLI
```bash
# Configure AWS credentials
aws configure

# Enter your credentials:
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region name: us-east-1
# Default output format: json

# Verify configuration
aws sts get-caller-identity
```

## Container Deployment with ECS

### Prepare Docker Image

#### Dockerfile Example
```dockerfile
# Multi-stage build for Python FastAPI
FROM python:3.11-slim as builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

FROM python:3.11-slim
WORKDIR /app

# Copy dependencies from builder stage
COPY --from=builder /root/.local /root/.local
COPY . .

# Make sure scripts in .local are usable
ENV PATH=/root/.local/bin:$PATH

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Build and Push to ECR
```bash
# Create ECR repository
aws ecr create-repository --repository-name my-app

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

# Build and tag image
docker build -t my-app .
docker tag my-app:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app:latest

# Push image
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app:latest
```

### ECS Cluster Setup

#### Create ECS Cluster
```bash
# Create cluster
aws ecs create-cluster --cluster-name my-app-cluster

# Create task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

#### Task Definition (task-definition.json)
```json
{
  "family": "my-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789012:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "my-app",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/my-app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "postgresql://user:pass@rds-endpoint:5432/dbname"
        }
      ],
      "secrets": [
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:ssm:us-east-1:123456789012:parameter/my-app/jwt-secret"
        }
      ]
    }
  ]
}
```

#### Create ECS Service
```bash
# Create service
aws ecs create-service \
  --cluster my-app-cluster \
  --service-name my-app-service \
  --task-definition my-app:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345],securityGroups=[sg-12345],assignPublicIp=ENABLED}"
```

## Infrastructure as Code with CDK

### CDK Project Setup
```bash
# Initialize CDK project
mkdir my-app-infrastructure
cd my-app-infrastructure
cdk init app --language typescript

# Install dependencies
npm install @aws-cdk/aws-ecs @aws-cdk/aws-ec2 @aws-cdk/aws-rds @aws-cdk/aws-elasticloadbalancingv2
```

### CDK Stack Example
```typescript
import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as rds from '@aws-cdk/aws-rds';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';

export class MyAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'MyAppVpc', {
      maxAzs: 2,
      natGateways: 1
    });

    // RDS Database
    const database = new rds.DatabaseInstance(this, 'MyAppDatabase', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_14
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      credentials: rds.Credentials.fromGeneratedSecret('postgres'),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
      },
      deletionProtection: false // Set to true for production
    });

    // ECS Cluster
    const cluster = new ecs.Cluster(this, 'MyAppCluster', {
      vpc
    });

    // Task Definition
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'MyAppTask', {
      memoryLimitMiB: 512,
      cpu: 256
    });

    const container = taskDefinition.addContainer('MyAppContainer', {
      image: ecs.ContainerImage.fromRegistry('123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app:latest'),
      environment: {
        DATABASE_URL: `postgresql://postgres:${database.secret?.secretValueFromJson('password')}@${database.instanceEndpoint.hostname}:5432/postgres`
      },
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'my-app'
      })
    });

    container.addPortMappings({
      containerPort: 8000
    });

    // ECS Service
    const service = new ecs.FargateService(this, 'MyAppService', {
      cluster,
      taskDefinition,
      desiredCount: 2
    });

    // Load Balancer
    const lb = new elbv2.ApplicationLoadBalancer(this, 'MyAppLB', {
      vpc,
      internetFacing: true
    });

    const listener = lb.addListener('Listener', {
      port: 80,
      defaultAction: elbv2.ListenerAction.fixedResponse(404)
    });

    listener.addTargets('MyAppTargets', {
      port: 8000,
      targets: [service],
      healthCheckPath: '/health'
    });

    // Output the load balancer URL
    new cdk.CfnOutput(this, 'LoadBalancerURL', {
      value: `http://${lb.loadBalancerDnsName}`
    });
  }
}
```

### Deploy with CDK
```bash
# Bootstrap CDK (first time only)
cdk bootstrap

# Synthesize CloudFormation template
cdk synth

# Deploy the stack
cdk deploy

# Destroy when needed
cdk destroy
```

## Serverless Deployment with Lambda

### Serverless Framework Setup
```bash
# Install Serverless Framework
npm install -g serverless

# Create new serverless project
serverless create --template aws-python3 --path my-serverless-app
cd my-serverless-app
```

### Serverless Configuration (serverless.yml)
```yaml
service: my-serverless-app

frameworkVersion: '3'

provider:
  name: aws
  runtime: python3.9
  region: us-east-1
  stage: ${opt:stage, 'dev'}
  environment:
    STAGE: ${self:provider.stage}
    REGION: ${self:provider.region}
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - dynamodb:Query
            - dynamodb:Scan
            - dynamodb:GetItem
            - dynamodb:PutItem
            - dynamodb:UpdateItem
            - dynamodb:DeleteItem
          Resource: !GetAtt UsersTable.Arn

functions:
  api:
    handler: handler.main
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
      - http:
          path: /
          method: ANY
          cors: true

resources:
  Resources:
    UsersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: users-${self:provider.stage}
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        BillingMode: PAY_PER_REQUEST

plugins:
  - serverless-python-requirements
  - serverless-offline

custom:
  pythonRequirements:
    dockerizePip: true
```

### Lambda Handler (handler.py)
```python
import json
import boto3
from fastapi import FastAPI, HTTPException
from mangum import Mangum

app = FastAPI(title="Serverless API")

# DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users-dev')  # Use environment variable in production

@app.get("/")
def read_root():
    return {"message": "Hello from Lambda!"}

@app.get("/users/{user_id}")
def get_user(user_id: str):
    try:
        response = table.get_item(Key={'id': user_id})
        if 'Item' not in response:
            raise HTTPException(status_code=404, detail="User not found")
        return response['Item']
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/users")
def create_user(user: dict):
    try:
        table.put_item(Item=user)
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Lambda handler
handler = Mangum(app)

def main(event, context):
    return handler(event, context)
```

### Deploy Serverless Application
```bash
# Install dependencies
pip install -r requirements.txt

# Deploy to AWS
serverless deploy

# Deploy specific function
serverless deploy function -f api

# View logs
serverless logs -f api -t

# Remove deployment
serverless remove
```

## Database Setup on AWS

### RDS PostgreSQL
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier myapp-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 14.6 \
  --allocated-storage 20 \
  --storage-type gp2 \
  --master-username postgres \
  --master-user-password MySecurePassword123 \
  --vpc-security-group-ids sg-12345 \
  --db-subnet-group-name default-vpc-12345 \
  --backup-retention-period 7 \
  --multi-az false \
  --publicly-accessible true

# Create database
psql -h myapp-db.cluster-xyz.us-east-1.rds.amazonaws.com -U postgres -c "CREATE DATABASE myapp;"
```

### DynamoDB Setup
```bash
# Create DynamoDB table
aws dynamodb create-table \
  --table-name Users \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

## Environment Management

### Parameter Store for Secrets
```bash
# Store secrets in Parameter Store
aws ssm put-parameter \
  --name "/myapp/prod/database-password" \
  --value "MySecurePassword123" \
  --type "SecureString"

aws ssm put-parameter \
  --name "/myapp/prod/jwt-secret" \
  --value "MyJWTSecret123" \
  --type "SecureString"

# Retrieve parameter
aws ssm get-parameter \
  --name "/myapp/prod/database-password" \
  --with-decryption
```

### Environment-Specific Deployments
```bash
# Deploy to different stages
serverless deploy --stage dev
serverless deploy --stage staging
serverless deploy --stage prod

# CDK with different environments
cdk deploy --context environment=dev
cdk deploy --context environment=prod
```

## Monitoring and Logging

### CloudWatch Setup
```typescript
// Add to CDK stack
import * as logs from '@aws-cdk/aws-logs';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';

// Log Group
const logGroup = new logs.LogGroup(this, 'MyAppLogs', {
  logGroupName: '/aws/ecs/my-app',
  retention: logs.RetentionDays.ONE_WEEK
});

// CloudWatch Dashboard
const dashboard = new cloudwatch.Dashboard(this, 'MyAppDashboard', {
  dashboardName: 'MyApp-Monitoring'
});

// Add widgets
dashboard.addWidgets(
  new cloudwatch.GraphWidget({
    title: 'ECS Service CPU Utilization',
    left: [service.metricCpuUtilization()],
    width: 12
  })
);
```

### Application Insights
```bash
# Enable Application Insights
aws application-insights create-application \
  --resource-group-name "my-app-resources" \
  --auto-config-enabled \
  --cwe-monitor-enabled \
  --auto-create
```

## CI/CD Pipeline

### GitHub Actions for AWS Deployment
```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1
    
    - name: Build, tag, and push image to Amazon ECR
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        ECR_REPOSITORY: my-app
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
    
    - name: Deploy to ECS
      run: |
        aws ecs update-service \
          --cluster my-app-cluster \
          --service my-app-service \
          --task-definition my-app:${{ github.run_number }}
```

## Security Best Practices

### IAM Roles and Policies
- Use least privilege principle
- Create separate roles for different services
- Enable MFA for administrative access
- Regularly rotate access keys

### Network Security
- Use VPC with private subnets
- Configure security groups properly
- Enable VPC Flow Logs
- Use WAF for web applications

### Data Encryption
- Enable encryption at rest for RDS
- Use SSL/TLS for data in transit
- Encrypt sensitive environment variables
- Use AWS KMS for key management

## Cost Optimization

### Monitoring Costs
```bash
# Set up billing alerts
aws budgets create-budget \
  --account-id 123456789012 \
  --budget file://budget.json
```

### Optimization Strategies
- Use appropriate instance sizes
- Implement auto-scaling
- Use Spot instances for non-critical workloads
- Monitor and optimize data transfer costs
- Use CloudWatch for resource monitoring

## Troubleshooting

### Common Issues
- Check CloudWatch logs for application errors
- Verify security group rules
- Ensure IAM permissions are correct
- Check VPC configuration
- Monitor resource limits and quotas

### Debugging Tools
```bash
# ECS service status
aws ecs describe-services --cluster my-app-cluster --services my-app-service

# Task logs
aws logs get-log-events \
  --log-group-name /ecs/my-app \
  --log-stream-name ecs/my-app/task-id

# Lambda function logs
aws logs tail /aws/lambda/my-function --follow
```