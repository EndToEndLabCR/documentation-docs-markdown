module.exports = {
  title: "Documentation",
  tagline: "Awesome Docs Powered by Docusaurus",
  url: "https://EndToEndLabCR.github.io",
  baseUrl: "/documentation-docs-markdown/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/logo.svg",
  organizationName: "EndToEndLabCR",
  projectName: "documentation-docs-markdown",

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/EndToEndLabCR/documentation-docs-markdown/tree/main/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Documentation',
      logo: {
        alt: 'EndToEndLabCR Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'README',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/EndToEndLabCR/documentation-docs-markdown',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/EndToEndLabCR',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} EndToEndLabCR. Built with Docusaurus.`,
    },
  },
};
