/**
 * Seed data for SafeRoute – Andhra Pradesh, India Edition
 * All locations and emergency infrastructure correspond to Andhra Pradesh, India.
 */

// Default center: Vijayawada / Amaravati Capital Region, Andhra Pradesh
export const DEFAULT_MAP_CENTER = [16.5062, 80.6480];
export const DEFAULT_MAP_ZOOM = 13;

export const INITIAL_COMMUNITY_REPORTS = [
  {
    id: "REP-5012",
    category: "Poor Lighting",
    title: "Street lights non-functional along MG Road service stretch",
    description: "Pedestrian walkway dimly lit past 8 PM near the canal side. Caution advised for evening pedestrians and cyclists.",
    locationName: "MG Road near Sub-Collector Office, Vijayawada, AP",
    coordinates: [16.5085, 80.6382],
    severity: "Medium",
    status: "Community Confirmed",
    reportedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    confirmations: 8,
    reportedIncorrectCount: 0,
    imageUrl: null,
    isDemo: true,
    author: "Ravi Kumar V.",
    timeline: [
      { status: "Reported", timestamp: new Date(Date.now() - 3600000 * 6).toISOString(), note: "Report submitted via SafeRoute" },
      { status: "Community Confirmed", timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), note: "Confirmed by 8 local travelers" }
    ]
  },
  {
    id: "REP-5028",
    category: "Road Blockage",
    title: "Culvert repair and road diversions near Benz Circle",
    description: "Ongoing drainage infrastructure works. Traffic diverted to the single left lane. Expect minor delays during peak hours.",
    locationName: "Benz Circle Junction, Vijayawada, AP",
    coordinates: [16.4984, 80.6552],
    severity: "High",
    status: "Verified",
    reportedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    confirmations: 16,
    reportedIncorrectCount: 0,
    imageUrl: null,
    isDemo: true,
    author: "Srinivas Rao",
    timeline: [
      { status: "Reported", timestamp: new Date(Date.now() - 3600000 * 14).toISOString(), note: "Report submitted" },
      { status: "Community Confirmed", timestamp: new Date(Date.now() - 3600000 * 10).toISOString(), note: "12 confirmations logged" },
      { status: "Verified", timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), note: "Municipal road work verified" }
    ]
  },
  {
    id: "REP-5034",
    category: "Dangerous Road",
    title: "Unmarked speed breakers on Bandar Road bypass",
    description: "Freshly laid bitumen without white thermoplastic markings. Reduced vehicle speed advised after sunset.",
    locationName: "Bandar Road near Kanuru, Vijayawada, AP",
    coordinates: [16.4862, 80.6815],
    severity: "Medium",
    status: "Reported",
    reportedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    confirmations: 4,
    reportedIncorrectCount: 0,
    imageUrl: null,
    isDemo: true,
    author: "Ananya Reddy",
    timeline: [
      { status: "Reported", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), note: "Report submitted" }
    ]
  }
];

export const INITIAL_SAFE_PLACES = [
  {
    id: "SP-AP-101",
    name: "AIIMS Mangalagiri (All India Institute of Medical Sciences)",
    category: "Hospitals",
    type: "Super Specialty & Trauma Center",
    address: "NH-16, Mangalagiri, Guntur District, Andhra Pradesh 522503",
    coordinates: [16.4382, 80.5678],
    phone: "+91 8645 280000",
    openingHours: "Open 24 hours / 7 days",
    hasEmergencyRoom: true,
    services: ["24/7 Level 1 Trauma Care", "Emergency Medicine", "ICU / Critical Care"],
    isDemo: true
  },
  {
    id: "SP-AP-102",
    name: "Government General Hospital (GGH) Vijayawada",
    category: "Hospitals",
    type: "Government General Hospital",
    address: "Hanumanpet, Near Railway Station, Vijayawada, Andhra Pradesh 520003",
    coordinates: [16.5165, 80.6288],
    phone: "+91 866 2577772",
    openingHours: "Open 24 hours",
    hasEmergencyRoom: true,
    services: ["24/7 Emergency Casualty", "Trauma Unit", "Blood Bank"],
    isDemo: true
  },
  {
    id: "SP-AP-103",
    name: "Manipal Hospital Vijayawada",
    category: "Hospitals",
    type: "Multi-Speciality Hospital",
    address: "Sector 6, Tadepalli, Guntur / Vijayawada, Andhra Pradesh 522501",
    coordinates: [16.4876, 80.6085],
    phone: "+91 866 6464646",
    openingHours: "Open 24 hours",
    hasEmergencyRoom: true,
    services: ["Emergency Trauma", "Cardiology", "Stroke Response Unit"],
    isDemo: true
  },
  {
    id: "SP-AP-201",
    name: "Vijayawada City Police Commissionerate",
    category: "Police Stations",
    type: "Police Headquarters & Assistance Desk",
    address: "Bunder Road, Suryaraopet, Vijayawada, Andhra Pradesh 520002",
    coordinates: [16.5098, 80.6312],
    phone: "100",
    openingHours: "Open 24 hours daily",
    services: ["24/7 Police Assistance", "Emergency Control Room", "Dial 112 / 100 Desk"],
    isDemo: true
  },
  {
    id: "SP-AP-202",
    name: "Andhra Pradesh Disha Police Station",
    category: "Police Stations",
    type: "Specialized Women & Citizen Safety Station",
    address: "MG Road, Vijayawada, Andhra Pradesh 520010",
    coordinates: [16.5034, 80.6482],
    phone: "+91 866 2488888",
    openingHours: "24 hours dedicated support desk",
    services: ["Disha SOS Response", "Women & Child Safety", "Victim Assistance"],
    isDemo: true
  },
  {
    id: "SP-AP-203",
    name: "Machavaram Police Station",
    category: "Police Stations",
    type: "Local Police Station",
    address: "Eluru Road, Machavaram, Vijayawada, Andhra Pradesh 520004",
    coordinates: [16.5188, 80.6575],
    phone: "+91 866 2576666",
    openingHours: "24 hours emergency desk",
    services: ["Patrol Dispatch", "Public Safety", "Emergency Assistance"],
    isDemo: true
  },
  {
    id: "SP-AP-301",
    name: "Apollo Pharmacy 24/7",
    category: "Pharmacies",
    type: "24-Hour Pharmacy",
    address: "Benz Circle, MG Road, Vijayawada, Andhra Pradesh 520010",
    coordinates: [16.4992, 80.6545],
    phone: "+91 866 2484444",
    openingHours: "Open 24 hours",
    services: ["Prescription Medicines", "Emergency First Aid Supplies", "Life Support Drugs"],
    isDemo: true
  },
  {
    id: "SP-AP-302",
    name: "MedPlus 24/7 Pharmacy",
    category: "Pharmacies",
    type: "24-Hour Pharmacy",
    address: "Near Besant Road, Governorpet, Vijayawada, Andhra Pradesh 520002",
    coordinates: [16.5115, 80.6258],
    phone: "+91 866 2435555",
    openingHours: "Open 24 hours",
    services: ["General Medicines", "First Aid", "Surgical Supplies"],
    isDemo: true
  },
  {
    id: "SP-AP-401",
    name: "Indian Oil 24h Swarna Auto Fuel Station",
    category: "Fuel Stations",
    type: "24/7 Service Station",
    address: "NH-16, Benz Circle Corridor, Vijayawada, Andhra Pradesh 520008",
    coordinates: [16.4942, 80.6610],
    phone: "+91 866 2471111",
    openingHours: "Open 24 hours",
    services: ["Well-lit forecourt", "Air & Water Assistance", "Emergency Phone Access"],
    isDemo: true
  },
  {
    id: "SP-AP-501",
    name: "Pandit Nehru Bus Station (PNBS) & Police Outpost",
    category: "Public Institutions",
    type: "Major Transit Hub",
    address: "National Highway 65, Vijayawada, Andhra Pradesh 520013",
    coordinates: [16.5118, 80.6185],
    phone: "+91 866 2572222",
    openingHours: "24 hours operational",
    services: ["Staffed 24/7 Helpdesk", "APSRTC Security", "CCTV Monitored Safe Zones"],
    isDemo: true
  }
];

export const INITIAL_EMERGENCY_CONTACTS = [];

export const REPORT_CATEGORIES = [
  { value: "Suspicious Activity", label: "Suspicious Activity", icon: "EyeAlert", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { value: "Poor Lighting", label: "Poor Lighting", icon: "Moon", color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
  { value: "Road Blockage", label: "Road Blockage", icon: "Construction", color: "text-orange-700 bg-orange-50 border-orange-200" },
  { value: "Dangerous Road", label: "Dangerous Road", icon: "AlertTriangle", color: "text-rose-800 bg-rose-50 border-rose-200" },
  { value: "Accident", label: "Accident", icon: "CarFront", color: "text-red-700 bg-red-50 border-red-200" },
  { value: "Stray Animal", label: "Stray Animal", icon: "Footprints", color: "text-yellow-800 bg-yellow-50 border-yellow-200" },
  { value: "Flooded Area", label: "Flooded Area", icon: "Waves", color: "text-blue-700 bg-blue-50 border-blue-200" },
  { value: "Other", label: "Other Concern", icon: "HelpCircle", color: "text-stone-700 bg-stone-50 border-stone-200" }
];

export const SEVERITY_LEVELS = [
  { value: "Low", label: "Low", description: "Minor awareness item", color: "text-stone-700 bg-stone-100 border-stone-200" },
  { value: "Medium", label: "Medium", description: "Notable hazard requiring attention", color: "text-amber-800 bg-amber-100 border-amber-300" },
  { value: "High", label: "High", description: "Significant hazard or obstruction", color: "text-orange-900 bg-orange-100 border-orange-300" },
  { value: "Critical", label: "Critical", description: "Immediate danger or road blocked", color: "text-rose-900 bg-rose-100 border-rose-300" }
];
