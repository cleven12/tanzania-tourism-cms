export default {
  routes: [
    { method: 'GET', path: '/sitemap', handler: 'sitemap.find', config: { auth: false } },
  ],
};
