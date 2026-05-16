export type Watch = {
  slug: string;
  img: string;
  tag: string;
  name: string;
  price: string;
  collection: "Limited Edition" | "Exclusive" | "Golden";
  movement: string;
  case: string;
  crystal: string;
  water: string;
  desc: string;
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const make = (w: Omit<Watch, "slug">): Watch => ({ ...w, slug: slugify(w.name) });

export const WATCHES: Watch[] = [
  make({ img: "cropped-Leonardo_Phoenix_A_luxurious_and_sophisticated_image_featuring_1.jpg", tag: "Limited Edition · 01", name: "MysticReaper", price: "₹ 25,99,999", collection: "Limited Edition", movement: "Automatic · 48h reserve", case: "44mm · 18k Rose Gold", crystal: "Sapphire · AR Coated", water: "10 ATM", desc: "A mystical chronograph with skeletonised dial, hand-finished bridges and a midnight-black guilloché backdrop — engineered for the bold collector." }),
  make({ img: "cropped-Leonardo_Phoenix_A_luxurious_and_sophisticated_image_featuring_2.jpg", tag: "Limited Edition · 02", name: "PhantomPulse", price: "₹ 40,00,000", collection: "Limited Edition", movement: "Automatic · 60h reserve", case: "42mm · Titanium DLC", crystal: "Sapphire · Dual AR", water: "10 ATM", desc: "Phantom Pulse fuses a stealth titanium case with a luminous trident hand — a quiet powerhouse for connoisseurs of restraint." }),
  make({ img: "cropped-Leonardo_Phoenix_A_luxurious_and_sophisticated_image_featuring_3.jpg", tag: "Limited Edition · 03", name: "QuantumPhantom", price: "₹ 65,00,000", collection: "Limited Edition", movement: "Tourbillon · Manual", case: "43mm · 18k White Gold", crystal: "Sapphire · AR Coated", water: "5 ATM", desc: "A flying tourbillon framed in white gold — an heirloom-grade demonstration of Italian haute horlogerie." }),
  make({ img: "cropped-watch_ankit.jpg", tag: "Limited Edition · 04", name: "InfernoKnight", price: "₹ 72,00,000", collection: "Limited Edition", movement: "Automatic Chrono · 72h", case: "45mm · Forged Carbon", crystal: "Sapphire · AR Coated", water: "20 ATM", desc: "Forged carbon and molten copper accents — a tribute to the Maserati GT's racing soul." }),
  make({ img: "4.jpg", tag: "Exclusive · 01", name: "NightVigilante", price: "₹ 12,00,000", collection: "Exclusive", movement: "Automatic · 42h", case: "42mm · Stainless Steel", crystal: "Sapphire", water: "10 ATM", desc: "An understated companion for after-hours — matte black case with a softly luminous dial." }),
  make({ img: "5.jpg", tag: "Exclusive · 02", name: "GoldenEclipse", price: "₹ 10,99,999", collection: "Exclusive", movement: "Automatic · 42h", case: "41mm · 18k Yellow Gold PVD", crystal: "Sapphire", water: "5 ATM", desc: "A solar-flare dial finished by hand, set in warm gold — an elegant statement for daylight." }),
  make({ img: "6.jpg", tag: "Exclusive · 03", name: "CeruleanShade", price: "₹ 5,99,999", collection: "Exclusive", movement: "Automatic · 38h", case: "40mm · Stainless Steel", crystal: "Sapphire", water: "10 ATM", desc: "A sunburst cerulean dial reminiscent of the Adriatic — bright, lively and effortlessly versatile." }),
  make({ img: "7.jpg", tag: "Exclusive · 04", name: "RubyPhoenix", price: "₹ 1,90,000", collection: "Exclusive", movement: "Quartz Chrono", case: "44mm · Steel · Rose PVD", crystal: "Mineral · AR", water: "5 ATM", desc: "A vivid ruby accent against deep onyx — bold proportions for the modern gentleman." }),
  make({ img: "11.jpg", tag: "Golden · 01", name: "Eclipse Chrono", price: "₹ 1,15,00,000", collection: "Golden", movement: "Automatic Chrono · 60h", case: "44mm · 18k Gold", crystal: "Sapphire · Dual AR", water: "10 ATM", desc: "A blackened sub-dial chronograph wrapped in solid gold — heritage proportions, modern precision." }),
  make({ img: "12.jpg", tag: "Golden · 02", name: "Regal Cascade", price: "₹ 2,39,00,000", collection: "Golden", movement: "Perpetual Calendar", case: "42mm · 18k Yellow Gold", crystal: "Sapphire", water: "5 ATM", desc: "A perpetual calendar masterpiece — moonphase, leap year and day/date displayed with regal restraint." }),
  make({ img: "13.jpg", tag: "Golden · 03", name: "Golden Voyager", price: "₹ 1,23,00,000", collection: "Golden", movement: "GMT · Automatic", case: "43mm · 18k Gold", crystal: "Sapphire · AR Coated", water: "10 ATM", desc: "A dual-time GMT for the well-travelled — built for first-class lounges and grand boulevards." }),
  make({ img: "14.jpg", tag: "Golden · 04", name: "Midnight Radiance", price: "₹ 3,12,50,000", collection: "Golden", movement: "Minute Repeater", case: "44mm · 18k Rose Gold", crystal: "Sapphire", water: "3 ATM", desc: "A chiming minute repeater housed in rose gold — the pinnacle of the Maserati horological atelier." }),
];

export const watchBySlug = (slug: string) => WATCHES.find((w) => w.slug === slug);
export const watchesByCollection = (c: Watch["collection"]) =>
  WATCHES.filter((w) => w.collection === c);
export const imgUrl = (name: string) => `/maserati/${name}`;