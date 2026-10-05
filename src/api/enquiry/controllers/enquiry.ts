import { factories } from '@strapi/strapi';
import { allow } from '../../../utils/rate-limit';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default factories.createCoreController('api::enquiry.enquiry', () => ({
  async create(ctx) {
    if (!allow(`enquiry:${ctx.request.ip}`, 5, 60 * 60 * 1000)) {
      return ctx.tooManyRequests('Too many enquiries, please try again later');
    }
    const input = { ...(ctx.request.body?.data || {}) };

    // Honeypot: pretend success, save nothing
    if (input.website) return ctx.send({ data: { ok: true } }, 200);

    const name = String(input.name || '').trim();
    const email = String(input.email || '').trim();
    const message = String(input.message || '').trim();
    if (!name || !message || !EMAIL.test(email)) {
      return ctx.badRequest('name, a valid email and message are required');
    }

    delete input.internalNotes;
    delete input.status;
    delete input.source;
    delete input.website;
    ctx.request.body = {
      data: {
        ...input,
        name: name.slice(0, 120),
        email,
        message: message.slice(0, 5000),
        status: 'new',
        source: 'website',
      },
    };
    return super.create(ctx);
  },
}));
