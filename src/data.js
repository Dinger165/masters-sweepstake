export const PLAYERS = [
  { name: "Scottie Scheffler", country: "USA", odds: 500, tier: "fav" },
  { name: "Rory McIlroy", country: "NIR", odds: 1000, tier: "fav" },
  { name: "Bryson DeChambeau", country: "USA", odds: 1000, tier: "fav" },
  { name: "Jon Rahm", country: "ESP", odds: 1200, tier: "fav" },
  { name: "Ludvig Åberg", country: "SWE", odds: 1400, tier: "fav" },
  { name: "Xander Schauffele", country: "USA", odds: 1400, tier: "fav" },
  { name: "Min Woo Lee", country: "AUS", odds: 3500, tier: "cont" },
  { name: "Cameron Young", country: "USA", odds: 2350, tier: "cont" },
  { name: "Tommy Fleetwood", country: "ENG", odds: 2500, tier: "cont" },
  { name: "Matt Fitzpatrick", country: "ENG", odds: 2600, tier: "cont" },
  { name: "Collin Morikawa", country: "USA", odds: 3100, tier: "cont" },
  { name: "Justin Rose", country: "ENG", odds: 3600, tier: "cont" },
  { name: "Jordan Spieth", country: "USA", odds: 3800, tier: "cont" },
  { name: "Brooks Koepka", country: "USA", odds: 3800, tier: "cont" },
  { name: "Hideki Matsuyama", country: "JPN", odds: 3900, tier: "cont" },
  { name: "Robert MacIntyre", country: "SCO", odds: 4000, tier: "cont" },
  { name: "Viktor Hovland", country: "NOR", odds: 4000, tier: "cont" },
  { name: "Shane Lowry", country: "IRL", odds: 4500, tier: "cont" },
  { name: "Chris Gotterup", country: "USA", odds: 4300, tier: "cont" },
  { name: "Russell Henley", country: "USA", odds: 4200, tier: "cont" },
  { name: "Patrick Reed", country: "USA", odds: 4400, tier: "cont" },
  { name: "Tyrrell Hatton", country: "ENG", odds: 5500, tier: "long" },
  { name: "Patrick Cantlay", country: "USA", odds: 5500, tier: "long" },
  { name: "Akshay Bhatia", country: "USA", odds: 5500, tier: "long" },
  { name: "Si Woo Kim", country: "KOR", odds: 5500, tier: "long" },
  { name: "Sepp Straka", country: "AUT", odds: 6000, tier: "long" },
  { name: "Joaquin Niemann", country: "CHI", odds: 6000, tier: "long" },
  { name: "Sam Burns", country: "USA", odds: 6500, tier: "long" },
  { name: "Justin Thomas", country: "USA", odds: 6500, tier: "long" },
  { name: "Corey Conners", country: "CAN", odds: 6500, tier: "long" },
  { name: "Jason Day", country: "AUS", odds: 6500, tier: "long" },
  { name: "Adam Scott", country: "AUS", odds: 6500, tier: "long" },
  { name: "Sungjae Im", country: "KOR", odds: 7000, tier: "long" },
  { name: "Marco Penge", country: "ENG", odds: 7000, tier: "long" },
  { name: "Jacob Bridgeman", country: "USA", odds: 7500, tier: "long" },
  { name: "Gary Woodland", country: "USA", odds: 7500, tier: "long" },
  { name: "Nicolai Hojgaard", country: "DEN", odds: 8000, tier: "long" },
  { name: "Cameron Smith", country: "AUS", odds: 8000, tier: "long" },
  { name: "Sahith Theegala", country: "USA", odds: 8000, tier: "long" },
  { name: "Tom McKibbin", country: "NIR", odds: 9000, tier: "big" },
  { name: "Tony Finau", country: "USA", odds: 10000, tier: "big" },
  { name: "Keegan Bradley", country: "USA", odds: 10000, tier: "big" },
  { name: "Wyndham Clark", country: "USA", odds: 10000, tier: "big" },
  { name: "Will Zalatoris", country: "USA", odds: 12000, tier: "big" },
  { name: "Tom Kim", country: "KOR", odds: 12000, tier: "big" },
  { name: "Ben Griffin", country: "USA", odds: 12000, tier: "big" },
  { name: "Rasmus Neergaard-Petersen", country: "DEN", odds: 15000, tier: "big" },
  { name: "Casey Jarvis", country: "RSA", odds: 20000, tier: "big" },
  { name: "Naoyuki Kataoka", country: "JPN", odds: 25000, tier: "big" },
]

export const BASE_POINTS = [100, 80, 65, 50, 40, 30, 22, 16, 10, 6]

export function calcScore(odds, position) {
  if (!position || position > 10) return 0
  const multiplier = odds / 100
  return Math.round(BASE_POINTS[position - 1] * multiplier)
}

export function getMultiplier(odds) {
  return (odds / 100).toFixed(0) + 'x'
}

export function formatOdds(odds) {
  return '+' + odds.toLocaleString()
}

export function ordinal(n) {
  if (!n) return '—'
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export const TIER_LABELS = {
  fav: 'Favourites',
  cont: 'Contenders',
  long: 'Longshots',
  big: 'Big outsiders',
}

export const TIER_ORDER = ['fav', 'cont', 'long', 'big']

export const ENTRY_FEE = 20
export const PICKS_PER_ENTRY = 5
