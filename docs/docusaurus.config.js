// @ts-check

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'NotionBridge',
  tagline: 'Easily automate Notion',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://squidiis.github.io',
  baseUrl: '/NotionBridge/',

  organizationName: 'Squidiis',
  projectName: 'NotionBridge',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',                 
          routeBasePath: 'docs',        
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/Squidiis/NotionBridge/edit/main/docs/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/Squidiis/NotionBridge/edit/main/docs/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    navbar: {
      title: 'NotionBridge',
      logo: {
        alt: 'NotionBridge Logo',
        src: 'img/logo-light.svg',
        srcDark: 'img/logo-dark.svg',
        href: '/NotionBridge/docs',     // Navbar-Link korrekt gesetzt
      },
      items: [
        {to: '/NotionBridge/blog', label: 'Blog', position: 'left'},  // Auch hier korrekter Pfad
        {
          href: 'https://github.com/Squidiis/NotionBridge',
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
              label: 'Introduction',
              to: '/NotionBridge/docs',    // Vollständiger Pfad
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Issues',
              href: 'https://github.com/Squidiis/NotionBridge/issues',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/3sZhp3q6bD',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/NotionBridge/blog',    // Vollständiger Pfad
            },
            {
              label: 'GitHub',
              href: 'https://github.com/Squidiis/NotionBridge',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} NotionBridge. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
