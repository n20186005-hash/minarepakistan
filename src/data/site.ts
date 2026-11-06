// Single source of truth for Minar-e-Pakistan attraction facts.
// Used by the homepage and the topic-page system so figures stay in sync.

export const DOMAIN = 'minarepakistan.com';

export const d = {
  fullName: 'Minar-e-Pakistan',
  shortName: 'Minar-e-Pakistan',
  urduName: 'مینارِ پاکستان',
  city: 'Lahore',
  region: 'Punjab',
  country: 'Pakistan',
  countryCode: 'PK',
  postal: '54000',
  lat: 31.5925,
  lng: 74.3146,
  mapsUrl: 'https://maps.app.goo.gl/wK9FiYQgEEFcchqu9',
  mapsEmbed: 'https://www.google.com/maps?q=Minar-e-Pakistan,Lahore,Pakistan&output=embed',
  plusCode: 'H8V5+2Q',
  nearby1: 'Lahore Fort',
  nearby2: 'Badshahi Mosque',
  govtUrl: 'https://www.tourism.gov.pk/',
  punjabUrl: 'https://www.punjab.gov.pk/',
  rating: 4.6,
  reviews: 20729,
  // Sync month for ratings / review snapshot. Update when re-verified.
  syncMonth: 'October 2026'
};

// Short, factual name of the surrounding park (avoid conflating monument / park / museum).
export const PARK_NAME = 'Iqbal Park';

// Open Graph image. Real Wikimedia Commons photograph — image binaries cannot be bundled
// in this repo, so we reference a stable Wikimedia thumbnail URL for social previews.
export const OG_IMAGE =
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Minar-e-Pakistan%2C_Lahore.jpg/1280px-Minar-e-Pakistan%2C_Lahore.jpg';
