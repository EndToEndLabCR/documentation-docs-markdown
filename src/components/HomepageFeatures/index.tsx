import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Contributors welcomed",
    Svg: require("@site/static/img/github-circle.svg").default,
    description: <>Learn more about getting started in our community.</>,
  },
  {
    title: "Join us on Discord",
    Svg: require("@site/static/img/discord-circle.svg").default,
    description: <>Chat with us on Discord to ask questions and share ideas.</>,
  },
  {
    title: "Join us on Youtube",
    Svg: require("@site/static/img/youtube-circle.svg").default,
    description: <>Chat with us on Youtube to ask questions and share ideas.</>,
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
