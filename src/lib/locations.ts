export interface CCNLocation {
  id: string;
  city: string;
  country: string;
  flag: string;
  status: "selected" | "in_development" | "future";
}

export const CCN_LOCATIONS: CCNLocation[] = [
  { id: "miami", city: "Miami", country: "USA", flag: "🇺🇸", status: "selected" },
  { id: "belfast", city: "Belfast", country: "N. Ireland, UK", flag: "🇬🇧", status: "selected" },
  { id: "kingston", city: "Kingston", country: "Jamaica", flag: "🇯🇲", status: "selected" },
  { id: "bristol", city: "Bristol", country: "England, UK", flag: "🇬🇧", status: "selected" },
  { id: "budapest", city: "Budapest", country: "Hungary", flag: "🇭🇺", status: "selected" },
  { id: "pisa", city: "Pisa", country: "Italy", flag: "🇮🇹", status: "selected" },
  { id: "berlin", city: "Berlin", country: "Germany", flag: "🇩🇪", status: "selected" },
  { id: "nairobi", city: "Nairobi", country: "Kenya", flag: "🇰🇪", status: "selected" },
  { id: "potsdam", city: "Potsdam", country: "Germany", flag: "🇩🇪", status: "selected" },
  { id: "jakarta", city: "Jakarta", country: "Indonesia", flag: "🇮🇩", status: "selected" },
  { id: "tampa", city: "Tampa", country: "Florida, US", flag: "🇺🇸", status: "selected" },
  { id: "lima", city: "Lima", country: "Peru", flag: "🇵🇪", status: "in_development" },
  { id: "sao-paulo", city: "São Paulo", country: "Brazil", flag: "🇧🇷", status: "in_development" },
  { id: "colorado-springs", city: "Colorado Springs", country: "Colorado, US", flag: "🇺🇸", status: "in_development" },
  { id: "ny-5boros", city: "NY — 5 Boros", country: "New York, US", flag: "🇺🇸", status: "future" },
];

export const getLocationById = (id: string) =>
  CCN_LOCATIONS.find((l) => l.id === id) ?? CCN_LOCATIONS[0];
