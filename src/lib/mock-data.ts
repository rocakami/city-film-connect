export type Status = "active" | "inactive" | "pending" | "blocked";

export interface Member {
  id: string;
  name: string;
  email: string;
  plan: "Premium" | "Individual" | "Student" | "Organization";
  country: string;
  flag: string;
  joinedOn: string;
  status: Status;
  locationId: string;
}

export interface Sponsor {
  id: string;
  name: string;
  email: string;
  contactName: string;
  contactRole: string;
  tier: "Platinum" | "Gold" | "Silver" | "Bronze";
  status: Status;
  joinedOn: string;
  locationId: string;
}

export interface FilmSubmission {
  id: string;
  title: string;
  director: string;
  category: string;
  country: string;
  flag: string;
  submittedOn: string;
  status: "Under Review" | "Accepted" | "Rejected" | "Withdrawn";
  locationId: string;
  submittedBy?: string; // email of member who submitted
  synopsis?: string;
}

export interface CCNEvent {
  id: string;
  name: string;
  date: string;
  venue: string;
  city: string;
  category: string;
  registrations: number;
  capacity: number;
  status: "Upcoming" | "Completed" | "Cancelled";
  locationId: string;
}

const LOCS = [
  "miami", "belfast", "kingston", "bristol", "budapest",
  "pisa", "berlin", "nairobi", "potsdam", "jakarta", "tampa",
];

const pickLoc = (i: number) => LOCS[i % LOCS.length];

export const MEMBERS: Member[] = [
  { id: "MEM-1001", name: "Sarah Johnson", email: "sarah.johnson@email.com", plan: "Premium", country: "United States", flag: "🇺🇸", joinedOn: "May 29, 2024", status: "active", locationId: "miami" },
  { id: "MEM-1002", name: "Michael Brown", email: "michael.brown@email.com", plan: "Individual", country: "United Kingdom", flag: "🇬🇧", joinedOn: "May 27, 2024", status: "active", locationId: "belfast" },
  { id: "MEM-1003", name: "Aisha Khan", email: "aisha.khan@email.com", plan: "Student", country: "Canada", flag: "🇨🇦", joinedOn: "May 26, 2024", status: "active", locationId: "miami" },
  { id: "MEM-1004", name: "James Rodriguez", email: "james.rodriguez@email.com", plan: "Individual", country: "Spain", flag: "🇪🇸", joinedOn: "May 25, 2024", status: "active", locationId: "pisa" },
  { id: "MEM-1005", name: "Priya Sharma", email: "priya.sharma@email.com", plan: "Premium", country: "India", flag: "🇮🇳", joinedOn: "May 24, 2024", status: "active", locationId: "jakarta" },
  { id: "MEM-1006", name: "David Wilson", email: "david.wilson@creativestudio.com", plan: "Organization", country: "Australia", flag: "🇦🇺", joinedOn: "May 23, 2024", status: "active", locationId: "berlin" },
  { id: "MEM-1007", name: "Emily Davis", email: "emily.davis@email.com", plan: "Student", country: "France", flag: "🇫🇷", joinedOn: "May 22, 2024", status: "active", locationId: "bristol" },
  { id: "MEM-1008", name: "Daniel Lee", email: "daniel.lee@email.com", plan: "Individual", country: "South Korea", flag: "🇰🇷", joinedOn: "May 21, 2024", status: "inactive", locationId: "tampa" },
  { id: "MEM-1009", name: "Laura Bennett", email: "laura.bennett@email.com", plan: "Premium", country: "Italy", flag: "🇮🇹", joinedOn: "May 20, 2024", status: "pending", locationId: "pisa" },
  { id: "MEM-1010", name: "Film House Co.", email: "info@filmhouse.com", plan: "Organization", country: "UAE", flag: "🇦🇪", joinedOn: "May 19, 2024", status: "active", locationId: "nairobi" },
  { id: "MEM-1011", name: "Ana Costa", email: "ana.costa@email.com", plan: "Individual", country: "Portugal", flag: "🇵🇹", joinedOn: "May 18, 2024", status: "pending", locationId: "belfast" },
  { id: "MEM-1012", name: "Hiroshi Tanaka", email: "h.tanaka@email.com", plan: "Premium", country: "Japan", flag: "🇯🇵", joinedOn: "May 17, 2024", status: "active", locationId: "kingston" },
];

export const SPONSORS: Sponsor[] = [
  { id: "SPN-1", name: "Bright Vision Co.", email: "info@brightvision.com", contactName: "Sarah Johnson", contactRole: "CEO", tier: "Platinum", status: "active", joinedOn: "May 29, 2024", locationId: "miami" },
  { id: "SPN-2", name: "Film House Co.", email: "contact@filmhouse.com", contactName: "Michael Brown", contactRole: "Director", tier: "Gold", status: "active", joinedOn: "May 27, 2024", locationId: "belfast" },
  { id: "SPN-3", name: "Creative Tech Solutions", email: "hello@creativetech.com", contactName: "Aisha Khan", contactRole: "Marketing Head", tier: "Silver", status: "active", joinedOn: "May 26, 2024", locationId: "miami" },
  { id: "SPN-4", name: "Media Connect", email: "partnerships@mediaconnect.com", contactName: "James Rodriguez", contactRole: "Partnerships Manager", tier: "Gold", status: "active", joinedOn: "May 25, 2024", locationId: "pisa" },
  { id: "SPN-5", name: "Inspire Films", email: "contact@inspirefilms.com", contactName: "Priya Sharma", contactRole: "Co-Founder", tier: "Silver", status: "active", joinedOn: "May 24, 2024", locationId: "jakarta" },
  { id: "SPN-6", name: "NextGen Studios", email: "hi@nextgen.com", contactName: "Marc Allen", contactRole: "VP", tier: "Platinum", status: "pending", joinedOn: "May 22, 2024", locationId: "berlin" },
  { id: "SPN-7", name: "Visionary Media", email: "hello@visionary.com", contactName: "Lina Park", contactRole: "CEO", tier: "Gold", status: "pending", joinedOn: "May 20, 2024", locationId: "tampa" },
];

export const FILMS: FilmSubmission[] = [
  { id: "FILM-1001", title: "City Lights", director: "Sarah Johnson", category: "Short Film", country: "United States", flag: "🇺🇸", submittedOn: "May 29, 2024", status: "Under Review", locationId: "miami", submittedBy: "member@ccn.org", synopsis: "A story of hope and resilience set in the heart of a bustling metropolis." },
  { id: "FILM-1002", title: "Beyond Borders", director: "Sarah Johnson", category: "Documentary", country: "United States", flag: "🇺🇸", submittedOn: "May 22, 2024", status: "Accepted", locationId: "miami", submittedBy: "member@ccn.org" },
  { id: "FILM-1003", title: "Echoes of Time", director: "Sarah Johnson", category: "Short Film", country: "United States", flag: "🇺🇸", submittedOn: "May 10, 2024", status: "Under Review", locationId: "miami", submittedBy: "member@ccn.org" },
  { id: "FILM-1004", title: "The Last Frame", director: "James Lee", category: "Feature Film", country: "Canada", flag: "🇨🇦", submittedOn: "May 27, 2024", status: "Rejected", locationId: "miami" },
  { id: "FILM-1005", title: "Voices Unheard", director: "Aisha Khan", category: "Documentary", country: "United Kingdom", flag: "🇬🇧", submittedOn: "May 26, 2024", status: "Accepted", locationId: "belfast" },
  { id: "FILM-1006", title: "Parallel Roads", director: "Luca Bianchi", category: "Short Film", country: "Italy", flag: "🇮🇹", submittedOn: "May 25, 2024", status: "Under Review", locationId: "pisa" },
  { id: "FILM-1007", title: "Rising Tides", director: "Daniel Kim", category: "Feature Film", country: "South Korea", flag: "🇰🇷", submittedOn: "May 24, 2024", status: "Accepted", locationId: "tampa" },
  { id: "FILM-1008", title: "Silent Dreams", director: "Maria Silva", category: "Short Film", country: "Brazil", flag: "🇧🇷", submittedOn: "May 23, 2024", status: "Rejected", locationId: "berlin" },
];

export const EVENTS: CCNEvent[] = [
  { id: "EVT-1001", name: "Global Film Festival 2024", date: "Jun 15 – 20, 2024", venue: "Lincoln Center", city: "New York, USA", category: "Film Festival", registrations: 1250, capacity: 1500, status: "Upcoming", locationId: "miami" },
  { id: "EVT-1002", name: "Innovation Lab Partnership", date: "Jun 25 – 27, 2024", venue: "BFI Southbank", city: "London, UK", category: "Industry Event", registrations: 680, capacity: 800, status: "Upcoming", locationId: "bristol" },
  { id: "EVT-1003", name: "Youth Film Camp 2024", date: "Jul 10 – 12, 2024", venue: "TIFF Lightbox", city: "Toronto, Canada", category: "Workshop", registrations: 320, capacity: 400, status: "Upcoming", locationId: "belfast" },
  { id: "EVT-1004", name: "Screenwriters Meetup", date: "Jul 18, 2024", venue: "Regal Cinemas LA Live", city: "Los Angeles, USA", category: "Networking", registrations: 85, capacity: 100, status: "Upcoming", locationId: "tampa" },
  { id: "EVT-1005", name: "Documentary Showcase", date: "Aug 5 – 7, 2024", venue: "ACMI", city: "Melbourne, AU", category: "Film Screening", registrations: 210, capacity: 300, status: "Upcoming", locationId: "berlin" },
  { id: "EVT-1006", name: "Cinematography Masterclass", date: "Aug 14, 2024", venue: "VFS Campus", city: "Vancouver, CA", category: "Workshop", registrations: 40, capacity: 50, status: "Upcoming", locationId: "jakarta" },
  { id: "EVT-1007", name: "Leadership Summit", date: "May 20 – 22, 2024", venue: "Dubai Opera", city: "Dubai, UAE", category: "Conference", registrations: 950, capacity: 1000, status: "Completed", locationId: "nairobi" },
  { id: "EVT-1008", name: "Indie Film Night", date: "May 11, 2024", venue: "The Castro Theatre", city: "San Francisco, USA", category: "Film Screening", registrations: 120, capacity: 150, status: "Completed", locationId: "miami" },
];

export const FILM_CATEGORIES = [
  "Feature Film", "Documentary", "Short Film", "Animation", "Student Film", "Experimental",
];

export const EVENT_CATEGORIES = [
  "Film Festival", "Workshop", "Networking", "Film Screening", "Conference", "Industry Event", "Panel Discussion",
];
