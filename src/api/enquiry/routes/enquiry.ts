import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::enquiry.enquiry', {
  only: ['find', 'findOne', 'create'],
});
