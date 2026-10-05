import { allow } from '../../../utils/rate-limit';

export default {
  async find(ctx: any) {
    if (!allow(`search:${ctx.request.ip}`, 60, 60_000)) return ctx.tooManyRequests('Too many requests');
    const q = String(ctx.query.q || '').trim();
    if (q.length < 2) return ctx.badRequest('q must be at least 2 characters');
    const type = ctx.query.type ? String(ctx.query.type) : undefined;
    if (type && !['tour', 'destination', 'category'].includes(type)) return ctx.badRequest('invalid type');
    const limit = Math.min(Math.max(parseInt(String(ctx.query.limit), 10) || 10, 1), 20);
    const data = await strapi.service('api::search.search').search(q, type, limit);
    return { data, meta: { total: data.length } };
  },
};
