const fs = require('fs');

const bayOfBengalBeaches = [
  { name: "Puri Beach", state: "Odisha", lat: 19.7983, lon: 85.8245 },
  { name: "Chandrabhaga Beach", state: "Odisha", lat: 19.8765, lon: 86.0945 },
  { name: "Gopalpur Beach", state: "Odisha", lat: 19.2586, lon: 84.9052 },
  { name: "Digha Beach", state: "West Bengal", lat: 21.6270, lon: 87.5080 },
  { name: "Mandarmani Beach", state: "West Bengal", lat: 21.6560, lon: 87.6500 },
  { name: "Tajpur Beach", state: "West Bengal", lat: 21.6340, lon: 87.6370 },
  { name: "Rushikonda Beach", state: "Andhra Pradesh", lat: 17.7833, lon: 83.3850 },
  { name: "Yarada Beach", state: "Andhra Pradesh", lat: 17.6580, lon: 83.2670 },
  { name: "Kakinada Beach", state: "Andhra Pradesh", lat: 16.9891, lon: 82.2475 },
  { name: "Radhanagar Beach", state: "Andaman", lat: 11.9845, lon: 92.9550 }
];

const beachesRaw = fs.readFileSync('src/data/beaches.json', 'utf8');
const beaches = JSON.parse(beachesRaw);

const removeDuplicates = (beachesList) => {
  const map = new Map();
  beachesList.forEach(b => {
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
const removedCount = beaches.length - uniqueBeaches.length;

const existingFirstNames = new Set(
  uniqueBeaches.map(b => b.name.trim().split(" ")[0].toLowerCase())
);

const filteredNewBeaches = bayOfBengalBeaches.filter(b => {
  const firstWord = b.name.trim().split(" ")[0].toLowerCase();
  return !existingFirstNames.has(firstWord);
});

const beachesToAdd = filteredNewBeaches.slice(0, removedCount);
const enrichedBeaches = beachesToAdd.map(b => ({
  ...b,
  crowd: "moderate",
  waveHeight: 1.2,
  temp: 30,
  popularity: "medium"
}));

const finalBeaches = [...uniqueBeaches, ...enrichedBeaches];

// Re-assign IDs
finalBeaches.forEach((b, idx) => {
  b.id = idx + 1;
});

fs.writeFileSync('src/data/beaches.json', JSON.stringify(finalBeaches, null, 2));
console.log(`Original count: ${beaches.length}`);
console.log(`Unique count: ${uniqueBeaches.length}`);
console.log(`Added count: ${enrichedBeaches.length}`);
console.log(`Final count: ${finalBeaches.length}`);
