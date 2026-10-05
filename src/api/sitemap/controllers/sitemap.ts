const list = (uid: string) =>
  strapi.documents(uid as any).findMany({
    status: 'published',
    fields: ['slug', 'updatedAt'],
    limit: 5000,
  });

export default {
  async find() {
    const [tours, destinations, categories] = await Promise.all([
      list('api::tour.tour'),
      list('api::destination.destination'),
      list('api::category.category'),
    ]);
    const slim = (rows: any[]) => rows.map((r) => ({ slug: r.slug, updatedAt: r.updatedAt }));
    return { tours: slim(tours), destinations: slim(destinations), categories: slim(categories) };
  },
};
