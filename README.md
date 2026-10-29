# SafeRoute – Intelligent Route Safety and Emergency Assistance Platform

A responsive React web application built with **Vite**, **Tailwind CSS**, **React Router**, **Leaflet**, and **OpenStreetMap**. SafeRoute empowers pedestrians, cyclists, and drivers to travel informed by integrating real-time community hazard notices, nearby emergency facilities, and multi-corridor route comparison—all while strictly adhering to safety ethics, clear data attribution, and neutral, non-fabricated metrics.

---

## 🌟 Key Features

1. **13 Connected Pages**: Seamless client-side routing via React Router without page reloads.
2. **Interactive Leaflet Mapping**: Real OpenStreetMap tiles with custom SVG markers, dynamic layer controls, and route polylines.
3. **OSRM Route Engine & Fallback Geometry**: Calculates driving, walking, and cycling corridors with distances and durations.
4. **Nominatim Geocoding**: Real-time address and landmark search with debouncing and respectful usage throttling.
5. **Community Hazard Reporting**: Report poor lighting, road blockages, accidents, and hazards with map pinpointing and severity badges.
6. **4-Stage Status Tracking**: `Reported` → `Community Confirmed` → `Verified` → `Resolved` with defined lifecycle rules.
7. **Safe Places Directory**: 1-click discovery and routing to nearby Hospitals, Police Stations, 24/7 Pharmacies, and Fuel Stations.
8. **Emergency Center & SOS**: Confirmation-guarded emergency dispatch hotlines (911, 112, 999, 100), location sharing (Web Share API & clipboard fallback), and personal emergency contact management.
9. **Neutral Route Comparison**: Side-by-side metric inspection without arbitrary subjective safety scores.
10. **Light & Dark Mode**: Persistent theme selection with automatic document styling.
11. **Mobile-First Responsive Design**: Fixed bottom navigation bar for thumb-friendly mobile travel.

---

## 🧭 Page Structure

| # | Page | Route | Description |
|---|------|-------|-------------|
| 1 | **Landing Page** | `/` | Hero section, interactive map preview, Route Awareness, Community Reports, Emergency Assistance, and How It Works guide. |
| 2 | **Home Dashboard** | `/dashboard` | Time-of-day greeting, quick search, recent routes, live safety ticker, and nearby services. |
| 3 | **Route Planner** | `/planner` | Start (with GPS button) and destination search, travel modes (driving/walking/cycling), and time preferences. |
| 4 | **Route Results** | `/routes` | Multi-route corridor presentation (Route A, B, C) with map highlighting and safety factor popovers. |
| 5 | **Route Comparison** | `/compare` | Side-by-side table comparing distance, duration, hazard count, and emergency service proximity. |
| 6 | **Live Navigation** | `/navigation` | Turn guidance banner, live coordinate tracking, simulation mode, and prominent Emergency SOS shortcut. |
| 7 | **Safety Map** | `/safety-map` | Fullscreen interactive map with floating layer toggles (Reports, Hospitals, Police, Pharmacies, Fuel). |
| 8 | **Report an Issue** | `/report` | Community reporting form with category chips, severity selectors, and interactive map coordinate picker. |
| 9 | **Community Reports** | `/community-reports` | Searchable and filterable feed with status tabs, category filters, sorting, and +1 confirmation action. |
| 10 | **My Reports** | `/my-reports` | User's own submissions with visual status progression timeline. |
| 11 | **Safe Places** | `/safe-places` | Directory of verified emergency and public support facilities with live distance sorting and 1-click routing. |
| 12 | **Emergency Center** | `/emergency` | Confirmation-protected emergency hotline, location sharing, nearest hospital/police finder, and contact CRUD. |
| 13 | **Settings** | `/settings` | Light/Dark theme toggle, notification preferences, location permission explainer, and localStorage manager. |

---

## 🛡️ Safety & Ethics Compliance

Per Section 23 of the project development specification:
- **No False Safety Guarantees**: Routes and corridors are described with informational factors, never guaranteed as objectively "safe".
- **Zero Fabricated Sensors**: No fake optical lux meters, live crime rates, or imaginary congestion indices.
- **Transparent Attribution**: All reports and facilities clearly state whether sourced from OpenStreetMap, OSRM, or local community submissions.
- **No Autonomous Dispatch**: Emergency assistance features clearly state that web applications cannot directly dispatch responders without telecommunications carrier calls.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite 8, JavaScript (ES Modules)
- **Styling**: Tailwind CSS v4, PostCSS, Custom Leaflet CSS
- **Routing**: React Router DOM v7
- **Maps**: Leaflet 1.9, React Leaflet 5, OpenStreetMap
- **External Services**: OSRM Routing API, OpenStreetMap Nominatim Geocoding API, Browser Geolocation API
- **Icons**: Lucide React
- **Persistence**: Safe `localStorage` with versioned fallback data

---

## 🚀 Getting Started

```bash
# Navigate to the project directory
cd /Users/sadasiva/.gemini/antigravity/scratch/saferoute

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
