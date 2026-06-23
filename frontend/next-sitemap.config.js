/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://baghaei.com',
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/dashboard/*', '/status', '/maintenance'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin', '/api'] },
    ],
  },
}
