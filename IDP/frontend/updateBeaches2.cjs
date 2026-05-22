const fs = require('fs');

const realBeaches = [
  // User provided list
  { name: "Alibaug Beach", state: "Maharashtra", lat: 18.6400, lon: 72.8700 },
  { name: "Aksa Beach", state: "Maharashtra", lat: 19.1800, lon: 72.7900 },
  { name: "Anjarle Beach", state: "Maharashtra", lat: 17.8500, lon: 73.1000 },
  { name: "Bordi Beach", state: "Maharashtra", lat: 20.1200, lon: 72.7400 },
  { name: "Chivla Beach", state: "Maharashtra", lat: 16.0500, lon: 73.4800 },
  { name: "Dapoli Beach", state: "Maharashtra", lat: 17.7600, lon: 73.1900 },
  { name: "Diveagar Beach", state: "Maharashtra", lat: 18.1700, lon: 72.9900 },
  { name: "Ganpatipule Beach", state: "Maharashtra", lat: 17.1400, lon: 73.2600 },
  { name: "Guhagar Beach", state: "Maharashtra", lat: 17.4800, lon: 73.2000 },

  { name: "Bekal Beach", state: "Kerala", lat: 12.3900, lon: 75.0300 },
  { name: "Cherai Beach", state: "Kerala", lat: 10.1400, lon: 76.1800 },
  { name: "Kappad Beach", state: "Kerala", lat: 11.3800, lon: 75.7100 },
  { name: "Kozhikode Beach", state: "Kerala", lat: 11.2500, lon: 75.7800 },
  { name: "Marari Beach", state: "Kerala", lat: 9.6000, lon: 76.3000 },
  { name: "Payyambalam Beach", state: "Kerala", lat: 11.8700, lon: 75.3600 },

  { name: "Karwar Beach", state: "Karnataka", lat: 14.8000, lon: 74.1200 },
  { name: "Kaup Beach", state: "Karnataka", lat: 13.3400, lon: 74.7300 },
  { name: "Malpe Beach", state: "Karnataka", lat: 13.3500, lon: 74.7000 },
  { name: "Murudeshwar Beach", state: "Karnataka", lat: 14.0900, lon: 74.4800 },

  { name: "Baga Beach", state: "Goa", lat: 15.5600, lon: 73.7500 },
  { name: "Calangute Beach", state: "Goa", lat: 15.5500, lon: 73.7600 },
  { name: "Colva Beach", state: "Goa", lat: 15.2700, lon: 73.9200 },
  { name: "Morjim Beach", state: "Goa", lat: 15.6300, lon: 73.7300 },

  { name: "Puri Beach", state: "Odisha", lat: 19.8000, lon: 85.8200 },
  { name: "Gopalpur Beach", state: "Odisha", lat: 19.2600, lon: 84.9000 },
  { name: "Chandrabhaga Beach", state: "Odisha", lat: 19.8800, lon: 86.0900 },

  { name: "Digha Beach", state: "West Bengal", lat: 21.6200, lon: 87.5000 },
  { name: "Mandarmani Beach", state: "West Bengal", lat: 21.6500, lon: 87.6500 },
  { name: "Shankarpur Beach", state: "West Bengal", lat: 21.6200, lon: 87.5500 },

  { name: "Rushikonda Beach", state: "Andhra Pradesh", lat: 17.7800, lon: 83.3800 },
  { name: "Yarada Beach", state: "Andhra Pradesh", lat: 17.6500, lon: 83.2600 },

  { name: "Mahabalipuram Beach", state: "Tamil Nadu", lat: 12.6200, lon: 80.1900 },
  { name: "Rameswaram Beach", state: "Tamil Nadu", lat: 9.2800, lon: 79.3100 },

  { name: "Radhanagar Beach", state: "Andaman", lat: 11.9800, lon: 92.9500 },
  { name: "Wandoor Beach", state: "Andaman", lat: 11.6200, lon: 92.6100 },

  // Additional Real Indian Beaches to ensure >= 100
  { name: "Palolem Beach", state: "Goa", lat: 15.0100, lon: 74.0200 },
  { name: "Anjuna Beach", state: "Goa", lat: 15.5800, lon: 73.7400 },
  { name: "Vagator Beach", state: "Goa", lat: 15.6000, lon: 73.7300 },
  { name: "Arambol Beach", state: "Goa", lat: 15.6800, lon: 73.7000 },
  { name: "Majorda Beach", state: "Goa", lat: 15.3100, lon: 73.9000 },
  { name: "Cavelossim Beach", state: "Goa", lat: 15.1700, lon: 73.9400 },
  { name: "Agonda Beach", state: "Goa", lat: 15.0400, lon: 73.9800 },
  { name: "Benaulim Beach", state: "Goa", lat: 15.2600, lon: 73.9200 },
  { name: "Candolim Beach", state: "Goa", lat: 15.5100, lon: 73.7600 },
  { name: "Sinquerim Beach", state: "Goa", lat: 15.4900, lon: 73.7600 },
  { name: "Varca Beach", state: "Goa", lat: 15.2200, lon: 73.9300 },
  
  { name: "Kovalam Beach", state: "Kerala", lat: 8.4000, lon: 76.9700 },
  { name: "Varkala Beach", state: "Kerala", lat: 8.7300, lon: 76.7000 },
  { name: "Muzhappilangad Beach", state: "Kerala", lat: 11.7900, lon: 75.4500 },
  { name: "Kappil Beach", state: "Kerala", lat: 8.7600, lon: 76.6800 },
  
  { name: "Om Beach", state: "Karnataka", lat: 14.5100, lon: 74.3100 },
  { name: "Half Moon Beach", state: "Karnataka", lat: 14.5200, lon: 74.3200 },
  { name: "Paradise Beach", state: "Karnataka", lat: 14.5300, lon: 74.3300 },
  { name: "Kudle Beach", state: "Karnataka", lat: 14.5300, lon: 74.3100 },
  { name: "Gokarna Beach", state: "Karnataka", lat: 14.5400, lon: 74.3100 },
  { name: "Panambur Beach", state: "Karnataka", lat: 12.9300, lon: 74.8000 },
  { name: "Tannirbhavi Beach", state: "Karnataka", lat: 12.8900, lon: 74.8000 },
  { name: "Surathkal Beach", state: "Karnataka", lat: 13.0000, lon: 74.7800 },
  
  { name: "Marina Beach", state: "Tamil Nadu", lat: 13.0400, lon: 80.2800 },
  { name: "Elliot's Beach", state: "Tamil Nadu", lat: 13.0000, lon: 80.2700 },
  { name: "Dhanushkodi Beach", state: "Tamil Nadu", lat: 9.2300, lon: 79.4100 },
  { name: "Kanyakumari Beach", state: "Tamil Nadu", lat: 8.0700, lon: 77.5400 },
  { name: "Covelong Beach", state: "Tamil Nadu", lat: 12.7800, lon: 80.2500 },
  
  { name: "Auroville Beach", state: "Pondicherry", lat: 11.9700, lon: 79.8500 },
  { name: "Serenity Beach", state: "Pondicherry", lat: 11.9600, lon: 79.8400 },
  { name: "Promenade Beach", state: "Pondicherry", lat: 11.9300, lon: 79.8300 },
  { name: "Paradise Beach", state: "Pondicherry", lat: 11.8800, lon: 79.8100 },
  
  { name: "Tithal Beach", state: "Gujarat", lat: 20.6000, lon: 72.8900 },
  { name: "Mandvi Beach", state: "Gujarat", lat: 22.8200, lon: 69.3400 },
  { name: "Dumas Beach", state: "Gujarat", lat: 21.0800, lon: 72.7100 },
  { name: "Shivrajpur Beach", state: "Gujarat", lat: 22.3300, lon: 68.9500 },
  
  { name: "Juhu Beach", state: "Maharashtra", lat: 19.0900, lon: 72.8200 },
  { name: "Versova Beach", state: "Maharashtra", lat: 19.1300, lon: 72.8100 },
  { name: "Gorai Beach", state: "Maharashtra", lat: 19.2400, lon: 72.7800 },
  { name: "Marve Beach", state: "Maharashtra", lat: 19.1800, lon: 72.7900 },
  { name: "Tarkarli Beach", state: "Maharashtra", lat: 16.0300, lon: 73.4700 },
  { name: "Karde Beach", state: "Maharashtra", lat: 17.8100, lon: 73.1300 },
  { name: "Harihareshwar Beach", state: "Maharashtra", lat: 18.0100, lon: 73.0100 },
  { name: "Shrivardhan Beach", state: "Maharashtra", lat: 18.0500, lon: 73.0100 },
  { name: "Kashid Beach", state: "Maharashtra", lat: 18.4300, lon: 72.9000 },
  { name: "Murud Beach", state: "Maharashtra", lat: 18.3300, lon: 72.9600 },
  
  { name: "Bheemunipatnam Beach", state: "Andhra Pradesh", lat: 17.8900, lon: 83.4500 },
  { name: "Manginapudi Beach", state: "Andhra Pradesh", lat: 16.2300, lon: 81.1900 },
  { name: "Suryalanka Beach", state: "Andhra Pradesh", lat: 15.8200, lon: 80.5100 },
  { name: "Kalingapatnam Beach", state: "Andhra Pradesh", lat: 18.3300, lon: 84.1200 },
  { name: "Ramakrishna Beach", state: "Andhra Pradesh", lat: 17.7100, lon: 83.3200 },
  
  { name: "Elephant Beach", state: "Andaman", lat: 12.0000, lon: 92.9500 },
  { name: "Vijaynagar Beach", state: "Andaman", lat: 12.0100, lon: 93.0000 },
  { name: "Kalapathar Beach", state: "Andaman", lat: 11.9700, lon: 93.0100 },
  { name: "Laxmanpur Beach", state: "Andaman", lat: 11.8300, lon: 92.9800 },
  { name: "Bharatpur Beach", state: "Andaman", lat: 11.8400, lon: 93.0200 },
  { name: "Sitapur Beach", state: "Andaman", lat: 11.8100, lon: 93.0300 }
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

const filtered = realBeaches.filter(b => {
  const key = b.name.trim().split(" ")[0].toLowerCase();
  return !existing.has(key);
});

const enriched = filtered.map(b => ({
  ...b,
  crowd: "moderate",
  waveHeight: 1.2,
  temp: 30,
  popularity: "high",
  sustainabilityScore: Math.floor(Math.random() * (95 - 75 + 1)) + 75 // Realistic random score
}));

const finalBeaches = [...uniqueBeaches, ...enriched];

// Re-assign IDs
finalBeaches.forEach((b, idx) => {
  b.id = idx + 1;
});

fs.writeFileSync('src/data/beaches.json', JSON.stringify(finalBeaches, null, 2));
console.log(`Original count: ${beaches.length}`);
console.log(`Unique existing count: ${uniqueBeaches.length}`);
console.log(`Filtered new real beaches added: ${enriched.length}`);
console.log(`Final count: ${finalBeaches.length}`);
