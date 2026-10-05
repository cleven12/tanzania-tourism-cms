import type { Core } from '@strapi/strapi';

const PUBLIC_PERMISSIONS: Record<string, string[]> = {
  'api::tour.tour': ['find', 'findOne'],
  'api::destination.destination': ['find', 'findOne'],
  'api::category.category': ['find', 'findOne'],
  'api::testimonial.testimonial': ['find', 'findOne'],
  'api::site-setting.site-setting': ['find'],
  'api::enquiry.enquiry': ['create'],
  'api::search.search': ['find'],
  'api::sitemap.sitemap': ['find'],
};

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    if (!role) return;
    const permQuery = strapi.db.query('plugin::users-permissions.permission');
    for (const [uid, actions] of Object.entries(PUBLIC_PERMISSIONS)) {
      if (!strapi.controller(uid as any)) continue;
      for (const a of actions) {
        const action = `${uid}.${a}`;
        const exists = await permQuery.findOne({ where: { action, role: role.id } });
        if (!exists) await permQuery.create({ data: { action, role: role.id } });
      }
    }
  },
};
