import { createStrapi, compileStrapi } from '@strapi/strapi';

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const li = (arr: string[]) => arr.map((text) => ({ text }));
const seo = (title: string, desc: string, kw: string) => ({
  metaTitle: title.slice(0, 60),
  metaDescription: desc.slice(0, 160),
  keywords: kw,
  focusKeyword: kw.split(',')[0],
  schemaType: 'TouristTrip',
});

const days = (items: [string, string, string?][]) =>
  items.map(([title, description, accommodation], i) => ({ dayNumber: i + 1, title, description, accommodation }));

const faqs = (dur: number) => [
  { question: 'What is the best time to go?', answer: 'Tanzania is a year-round destination; the dry seasons (June-October and January-February) are generally best.' },
  { question: 'Is this trip suitable for first-time travellers?', answer: `Yes. Our guides handle logistics so a ${dur}-day trip is easy to enjoy even on your first visit.` },
  { question: 'Can the itinerary be customised?', answer: 'Absolutely. Send us an enquiry and we will tailor dates, pace and accommodation to you.' },
];

const inc = ['Airport transfers', 'Professional English-speaking guide', 'Accommodation as per itinerary', 'Meals as specified', 'Park and conservation fees'];
const exc = ['International flights', 'Travel insurance', 'Visa fees', 'Tips and gratuities', 'Personal items'];

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';
  try {
    const existing = await app.documents('api::tour.tour').count({});
    if (existing > 0) {
      console.log('Seed skipped: tours already exist.');
      return;
    }
    const create = (uid: any, data: any) => app.documents(uid).create({ data, status: 'published' });

    const cats: Record<string, string> = {};
    for (const [name, description] of [
      ['Kilimanjaro', 'Climb Africa\'s highest peak by the best routes.'],
      ['Safari', 'Wildlife safaris across Tanzania\'s famous parks.'],
      ['Zanzibar', 'Beaches, spice farms and Stone Town culture.'],
      ['Day Trips', 'Short excursions from Arusha, Moshi and Zanzibar.'],
    ]) {
      cats[name] = (await create('api::category.category', { name, slug: slugify(name), description })).documentId;
    }

    const dests: Record<string, string> = {};
    const coords: Record<string, [number, number]> = {
      Serengeti: [-2.3333, 34.8333],
      Kilimanjaro: [-3.0674, 37.3556],
      Zanzibar: [-6.1659, 39.2026],
    };
    for (const [name, region, summary] of [
      ['Serengeti', 'Northern Tanzania', 'Endless plains and the great wildebeest migration.'],
      ['Kilimanjaro', 'Kilimanjaro Region', 'The roof of Africa at 5,895 m.'],
      ['Zanzibar', 'Indian Ocean', 'Spice island with white-sand beaches and historic Stone Town.'],
    ]) {
      dests[name] = (
        await create('api::destination.destination', {
          name, slug: slugify(name), region, summary,
          latitude: coords[name][0], longitude: coords[name][1],
          description: `${summary}\n\nExplore ${name} with local expert guides.`,
          seo: seo(`${name} Tours & Travel Guide`, summary, `${name.toLowerCase()} tours`),
        })
      ).documentId;
    }

    const tours: any[] = [
      {
        title: 'Kilimanjaro Machame Route 7 Days', cat: 'Kilimanjaro', dest: 'Kilimanjaro', d: 7, price: 1890, diff: 'challenging', featured: true,
        summary: 'The scenic "Whiskey route" to the summit of Mount Kilimanjaro.',
        hl: ['Summit Uhuru Peak at sunrise', 'Diverse climate zones', 'Barranco Wall scramble'],
        it: [['Machame Gate to Machame Camp', 'Hike through lush rainforest.', 'Camp'], ['Machame to Shira Camp', 'Ascend to the moorland plateau.', 'Camp'], ['Shira to Barranco via Lava Tower', 'Acclimatisation day at altitude.', 'Camp'], ['Barranco to Karanga', 'Climb the Barranco Wall.', 'Camp'], ['Summit push', 'Midnight start to Uhuru Peak, descend to Mweka.', 'Camp']],
      },
      {
        title: 'Serengeti Big Five Safari 5 Days', cat: 'Safari', dest: 'Serengeti', d: 5, price: 1650, diff: 'easy', featured: true,
        summary: 'Game drives through Tarangire, Serengeti and Ngorongoro Crater.',
        hl: ['Big Five game viewing', 'Ngorongoro Crater floor drive', 'Optional balloon safari'],
        it: [['Arusha to Tarangire', 'Elephants and baobabs.', 'Tented lodge'], ['Tarangire to Serengeti', 'Cross the plains into the Serengeti.', 'Tented camp'], ['Full day Serengeti', 'Dawn and dusk game drives.', 'Tented camp'], ['Serengeti to Ngorongoro', 'Drive to the crater rim.', 'Lodge'], ['Crater and return', 'Descend into the crater then return to Arusha.']],
      },
      {
        title: 'Zanzibar Beach & Stone Town 4 Days', cat: 'Zanzibar', dest: 'Zanzibar', d: 4, price: 720, diff: 'easy', featured: false,
        summary: 'Relax on white-sand beaches and explore historic Stone Town.',
        hl: ['Stone Town walking tour', 'Spice farm visit', 'Snorkelling at Mnemba'],
        it: [['Arrival and Stone Town', 'Guided heritage walk through the old town.', 'Beach resort'], ['Spice tour', 'Visit a spice farm and local market.', 'Beach resort'], ['Mnemba snorkelling', 'Boat trip to Mnemba Atoll.', 'Beach resort'], ['Departure', 'Free morning then airport transfer.']],
      },
      {
        title: 'Materuni Waterfall & Coffee Day Trip', cat: 'Day Trips', dest: 'Kilimanjaro', d: 1, price: 85, diff: 'easy', featured: false,
        summary: 'Hike to Materuni waterfall and roast Chagga coffee on Kilimanjaro\'s slopes.',
        hl: ['Materuni waterfall swim', 'Traditional coffee tasting', 'Chagga village lunch'],
        it: [['Moshi to Materuni', 'Hike to the waterfall, lunch in the village and coffee roasting.']],
      },
    ];
    for (const t of tours) {
      await create('api::tour.tour', {
        title: t.title, slug: slugify(t.title), summary: t.summary,
        description: `${t.summary}\n\nA carefully planned ${t.d}-day experience with expert local guides.`,
        durationDays: t.d, priceFrom: t.price, currency: 'USD', difficulty: t.diff, featured: t.featured,
        highlights: li(t.hl), inclusions: li(inc), exclusions: li(exc),
        itinerary: days(t.it), faqs: faqs(t.d),
        category: cats[t.cat], destination: dests[t.dest],
        seo: seo(t.title, t.summary, t.title.toLowerCase()),
      });
    }

    const first = (await app.documents('api::tour.tour').findMany({ limit: 2 })) as any[];
    await create('api::testimonial.testimonial', { author: 'Sarah M.', country: 'United Kingdom', rating: 5, quote: 'Our Kilimanjaro climb was flawlessly organised. The guides were superb.', tour: first[0]?.documentId });
    await create('api::testimonial.testimonial', { author: 'Jonas K.', country: 'Germany', rating: 5, quote: 'The best safari experience of our lives. We saw all of the Big Five!', tour: first[1]?.documentId });

    const ss: any = app.documents('api::site-setting.site-setting');
    const cur = await ss.findFirst({});
    const data = {
      siteName: 'Tanzania Tourism', tagline: 'Discover Tanzania with local experts',
      contactEmail: 'info@example.com', contactPhone: '+255 700 000 000', whatsapp: '+255700000000',
      address: 'Arusha, Tanzania', facebook: 'https://facebook.com/', instagram: 'https://instagram.com/', youtube: 'https://youtube.com/',
      seo: seo('Tanzania Tours, Safaris & Kilimanjaro Treks', 'Book Kilimanjaro climbs, Serengeti safaris and Zanzibar holidays with local experts.', 'tanzania tours'),
    };
    if (cur) await ss.update({ documentId: cur.documentId, data });
    else await ss.create({ data });
    console.log('Seed complete.');
  } finally {
    await app.destroy();
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
