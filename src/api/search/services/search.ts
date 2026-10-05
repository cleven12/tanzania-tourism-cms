type Kind = 'tour' | 'destination' | 'category';

const CONFIG: Record<Kind, { uid: string; title: string; body: string[] }> = {
  tour: { uid: 'api::tour.tour', title: 'title', body: ['description'] },
  destination: { uid: 'api::destination.destination', title: 'name', body: ['description'] },
  category: { uid: 'api::category.category', title: 'name', body: ['description'] },
};

export default () => ({
  async search(q: string, type: Kind | undefined, limit: number) {
    const kinds = (type ? [type] : Object.keys(CONFIG)) as Kind[];
    const needle = q.toLowerCase();
    const scored: { score: number; item: any }[] = [];
    for (const kind of kinds) {
      const c = CONFIG[kind];
      const hasSummary = kind !== 'category';
      const fields = [c.title, ...(hasSummary ? ['summary'] : []), ...c.body];
      const rows: any[] = await strapi.documents(c.uid as any).findMany({
        status: 'published',
        filters: { $or: fields.map((f) => ({ [f]: { $containsi: q } })) },
        limit: 50,
      });
      for (const r of rows) {
        const t = String(r[c.title] || '');
        const s = String(r.summary || '');
        const score = t.toLowerCase().includes(needle) ? 3 : s.toLowerCase().includes(needle) ? 2 : 1;
        const summary = s || String(r.description || '').slice(0, 200);
        scored.push({ score, item: { type: kind, title: t, slug: r.slug, summary } });
      }
    }
    return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((x) => x.item);
  },
});
