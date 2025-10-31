module.exports = {
  tutorialSidebar: [
    'README',
    {
      type: 'category',
      label: '01 - Introduction',
      items: [
        '01-introduction/what-is-endtoendlabcr',
        '01-introduction/vision-and-mission',
        '01-introduction/how-to-use-this-docs',
      ],
    },
    {
      type: 'category',
      label: '02 - Tech Stack',
      items: [
        {
          type: 'category',
          label: 'Docker',
          items: [
            '02-tech-stack/docker/getting-started',
            '02-tech-stack/docker/best-practices',
            '02-tech-stack/docker/troubleshooting',
          ],
        },
        {
          type: 'category',
          label: 'Python',
          items: [
            '02-tech-stack/python/dependency-management',
            '02-tech-stack/python/testing-in-python',
          ],
        },
        {
          type: 'category',
          label: 'Frontend',
          items: [
            '02-tech-stack/frontend/javascript-and-typescript',
          ],
        },
        {
          type: 'category',
          label: 'Git and GitHub',
          items: [
            '02-tech-stack/git-and-github/branching-strategy',
            '02-tech-stack/git-and-github/code-review-guidelines',
            '02-tech-stack/git-and-github/github-actions',
          ],
        },
        {
          type: 'category',
          label: 'Tools',
          items: [
            '02-tech-stack/tools/postman',
            '02-tech-stack/tools/api-documentation-tools',
            '02-tech-stack/tools/productivity-tools',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '03 - Organizational Best Practices',
      items: [
        '03-organizational-best-practices/coding-guidelines',
        '03-organizational-best-practices/code-comments-and-docstrings',
      ],
    },
    {
      type: 'category',
      label: '04 - Projects',
      link: {
        type: 'generated-index',
      },
      items: [],
    },
    {
      type: 'category',
      label: '05 - Guides and Tutorials',
      link: {
        type: 'generated-index',
      },
      items: [],
    },
    {
      type: 'category',
      label: '06 - FAQ and Troubleshooting',
      link: {
        type: 'generated-index',
      },
      items: [],
    },
    {
      type: 'category',
      label: '07 - Architecture and Patterns',
      link: {
        type: 'generated-index',
      },
      items: [],
    },
    {
      type: 'category',
      label: '08 - Install and Setup',
      link: {
        type: 'generated-index',
      },
      items: [],
    },
  ],
};
