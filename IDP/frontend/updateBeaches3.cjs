const fs = require('fs');

const moreBeaches = [
  { name: "Sengamal Beach", state: "Tamil Nadu", lat: 9.2400, lon: 79.2800 },
  { name: "Sothavilai Beach", state: "Tamil Nadu", lat: 8.1100, lon: 77.4600 },
  { name: "Somnath Beach", state: "Gujarat", lat: 20.8800, lon: 70.4000 },
  { name: "Beypore Beach", state: "Kerala", lat: 11.1600, lon: 75.8000 },
  { name: "Maravanthe Beach", state: "Karnataka", lat: 13.7100, lon: 74.6300 },
  { name: "Nivati Beach", state: "Maharashtra", lat: 15.9300, lon: 73.5100 }
];

const beachesRaw = fs.readFileSync('src/data/beaches.json', 'utf8');
const beaches = JSON.parse(beachesRaw);

const removeDuplicates = (beachesList) => {
  const map = new Map();
  beachesList.forEach(b => {
    if (!b.name) return;
    const key = b.name.trim().split(" ")[0].toLowerCase();
    if (!map.has(key)) {
      map.set(key, b);
    } else {
      const existing = map.get(key);
      if ((b.sustainabilityScore || 0) > (existing.sustainabilityScore || 0)) {
        map.set(key, b);
      }
    }
  });
  return Array.from(map.values());
};

const uniqueBeaches = removeDuplicates(beaches);

const existing = new Set(
  uniqueBeaches.map(b => b.name.trim().split(" ")[0].toLowerCase())
);

const filtered = moreBeaches.filter(b => {
  const key = b.name.trim().split(" ")[0].toLowerCase();
  return !existing.has(key);
});

const enriched = filtered.map(b => ({
  ...b,
  crowd: "low",
  waveHeight: 1.0,
  temp: 29,
  popularity: "medium",
  sustainabilityScore: Math.floor(Math.random() * (95 - 75 + 1)) + 75
}));

const finalBeaches = [...uniqueBeaches, ...enriched];

finalBeaches.forEach((b, idx) => {
  b.id = idx + 1;
});

fs.writeFileSync('src/data/beaches.json', JSON.stringify(finalBeaches, null, 2));
console.log(`Original count: ${beaches.length}`);
console.log(`Unique existing count: ${uniqueBeaches.length}`);
console.log(`Filtered new real beaches added: ${enriched.length}`);
console.log(`Final count: ${finalBeaches.length}`);
