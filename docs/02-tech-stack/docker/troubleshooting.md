# Docker Troubleshooting

This file provides solutions to common Docker issues and troubleshooting techniques.

## Common Issues

### Container Won't Start

**Problem**: Container exits immediately
**Solutions**:
- Check container logs: `docker logs container_id`
- Verify the command is correct
- Ensure proper permissions
- Check if ports are already in use

### Image Build Failures

**Problem**: Docker build fails
**Solutions**:
- Review Dockerfile syntax
- Check file paths and permissions
- Verify base image availability
- Clear Docker cache: `docker builder prune`

### Performance Issues

**Problem**: Slow container performance
**Solutions**:
- Increase allocated resources
- Optimize image size
- Use volume mounts for data
- Monitor resource usage

## Debugging Commands

```bash
# View container logs
docker logs -f container_name

# Execute commands in running container
docker exec -it container_name /bin/bash

# Inspect container details
docker inspect container_name

# View resource usage
docker stats

# Remove unused resources
docker system prune
```

## Network Issues

- Check port mappings
- Verify network connectivity
- Review firewall settings
- Test with `docker network ls`

## Storage Problems

- Monitor disk space
- Clean up unused volumes
- Use `docker volume prune`
- Check mount permissions