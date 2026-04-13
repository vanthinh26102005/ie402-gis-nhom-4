# 🗺️ Tourism Intelligence Map Platform

A production-ready GIS web application for exploring Vietnam's tourist destinations, services, and administrative boundaries. Built with modern technologies focusing on scalability, performance, and real-world usability.

![Tech Stack](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![Tech Stack](https://img.shields.io/badge/PostGIS-336791?style=flat&logo=postgresql&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white)

## ✨ Features

- **Interactive Map** — Leaflet-based map with smooth zoom/pan, OpenStreetMap tiles
- **Dynamic Data Loading** — Bounding box queries, no full-dataset loading
- **Clustering** — Supercluster-powered point clustering that expands on zoom
- **Layer Control** — Toggle provinces, roads, places, services, heatmap
- **Search & Filter** — Debounced search, category/type filters, rating slider
- **Sidebar + Map UX** — Click sidebar → fly to map; click marker → highlight in list
- **Heatmap Layer** — Tourist density visualization
- **Geolocation** — Detect user location, show nearby places
- **Featured Places** — Business-logic-ready featured flag with priority sorting
- **Responsive Popups** — Rich detail popups with ratings, categories, descriptions
- **Redis Caching** — Query result caching for performance
- **Swagger API Docs** — Auto-generated REST API documentation

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Next.js App   │────▶│   NestJS API     │────▶│  PostGIS    │
│   (Port 3000)   │     │   (Port 4000)    │     │  Database   │
│                 │     │                  │     └─────────────┘
│  • Leaflet Map  │     │  • /api/geo/*    │            │
│  • React Query  │     │  • Swagger docs  │     ┌─────────────┐
│  • Zustand      │     │  • Validation    │────▶│   Redis     │
│  • Supercluster │     │  • Caching       │     │   Cache     │
└─────────────────┘     └──────────────────┘     └─────────────┘
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, TypeScript, TailwindCSS v4, React Query, Zustand, Leaflet, Supercluster |
| **Backend** | NestJS 11, Prisma ORM, class-validator, Swagger |
| **Database** | PostgreSQL 16 + PostGIS 3.4 |
| **Cache** | Redis 7 |
| **Infra** | Docker Compose |

## 📁 Project Structure

```
ie402-gis-nhom-4/
├── BE/                          # NestJS Backend
│   ├── src/
│   │   ├── main.ts              # Bootstrap, CORS, Swagger
│   │   ├── app.module.ts        # Root module
│   │   ├── database/            # Prisma DatabaseService
│   │   └── geo/                 # Geo module
│   │       ├── geo.controller.ts
│   │       ├── geo.service.ts
│   │       ├── geo.module.ts
│   │       └── dto/             # Request validation DTOs
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── seed.ts              # Seed data (45 places, 8 provinces, etc.)
│   ├── docker-compose.yml       # PostGIS + Redis
│   └── package.json
│
├── FE/                          # Next.js Frontend
│   ├── app/
│   │   ├── layout.tsx           # Root layout with QueryProvider
│   │   ├── page.tsx             # Map page (sidebar + map)
│   │   └── globals.css
│   ├── components/
│   │   ├── map/
│   │   │   ├── MapView.tsx      # Leaflet map with all layers
│   │   │   └── LayerControl.tsx # Layer toggles + geolocation
│   │   ├── sidebar/
│   │   │   ├── Sidebar.tsx      # Main sidebar with tabs
│   │   │   └── PlaceCard.tsx    # Place list item
│   │   └── filters/
│   │       ├── SearchBox.tsx    # Debounced search input
│   │       └── FilterPanel.tsx  # Category, type, rating filters
│   ├── hooks/                   # React Query hooks
│   ├── stores/                  # Zustand stores
│   ├── types/                   # TypeScript definitions
│   ├── lib/                     # API client
│   └── providers/               # QueryProvider
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **Docker Desktop** (for PostgreSQL + Redis)

```bash
node -v && npm -v && docker -v
```

### 1. Start Infrastructure

```bash
cd BE
docker compose up -d
```

This starts:
- **PostGIS** on port `5432` (user: `gis_user`, password: `gis_password`, db: `gis_db`)
- **Redis** on port `6379`

Verify:
```bash
docker compose ps
```

### 2. Setup Backend

```bash
cd BE
npm install
npx prisma generate
npx prisma db push          # Create tables
npm run seed                 # Seed with tourism data
npm run dev                  # Start on port 4000
```

Verify:
- API: http://localhost:4000/api/geo/stats
- Swagger: http://localhost:4000/api/docs

### 3. Setup Frontend

```bash
cd FE
npm install
npm run dev                  # Start on port 3000
```

Open http://localhost:3000 — you should see the Tourism Intelligence Map!

## 📡 API Endpoints

All endpoints are prefixed with `/api/geo/`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/provinces` | All provinces with polygon boundaries |
| GET | `/places` | Places with bbox, category, search, rating filters |
| GET | `/places/:id` | Single place detail |
| GET | `/places/nearby?lng=&lat=&radius=` | Nearby places with distance |
| GET | `/places/categories` | List of all categories |
| GET | `/places/trending` | Featured + high-rated places |
| GET | `/roads` | Roads with optional type filter |
| GET | `/services` | Services with bbox and type filters |
| GET | `/services/types` | List of all service types |
| GET | `/stats` | Database entity counts |

### Bbox Query Example
```
GET /api/geo/places?minLng=106.5&minLat=10.5&maxLng=107.0&maxLat=11.0&category=temple&limit=50
```

## 🗄️ Database Schema

| Table | Key Fields | Spatial |
|-------|-----------|---------|
| **provinces** | name, name_en, geometry (Polygon JSON) | ✅ |
| **places** | name, category, rating, featured, longitude, latitude | ✅ coordinate indexes |
| **roads** | name, type, geometry (LineString JSON) | ✅ |
| **services** | name, type, longitude, latitude | ✅ coordinate indexes |

### Seed Data
- 8 Vietnamese provinces (HCMC, Hanoi, Da Nang, Khanh Hoa, Lam Dong, Quang Ninh, Hue, Quang Nam)
- 45 tourist places across 8 categories
- 10 major roads
- 28 services (hotels, restaurants, hospitals, etc.)

## 🎨 UI Features

- **Split Layout**: 380px sidebar + full-width map
- **Place Cards**: Category icons, ratings, featured badges
- **Map Popups**: Rich detail with name, category, description, address
- **Cluster Markers**: Color-coded by count (blue < 10, amber < 50, red 50+)
- **Category Colors**: Each category has a distinct color and emoji
- **Loading Skeletons**: Animated placeholders during data fetch
- **Layer Toggles**: Visual switches for each map layer

## ⚙️ Environment Variables

### Backend (`BE/.env`)
```env
DATABASE_URL="postgresql://gis_user:gis_password@localhost:5432/gis_db?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

### Frontend (`FE/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 🧪 Development Commands

```bash
# Backend
cd BE
npm run dev              # Start with hot-reload
npm run build            # Production build
npm run seed             # Re-seed database
npx prisma studio        # Database GUI

# Frontend
cd FE
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # ESLint
```

## 🛑 Shutting Down

```bash
# Stop frontend/backend: Ctrl+C in their terminals

# Stop Docker services
cd BE
docker compose down

# To also remove data volumes:
docker compose down -v
```

## 📋 Troubleshooting

| Issue | Solution |
|-------|---------|
| Docker not running | Start Docker Desktop, wait for "Running" status |
| Port 5432 in use | Stop other PostgreSQL instances or change port in docker-compose |
| Backend ECONNREFUSED | Ensure Docker containers are running: `docker compose ps` |
| Frontend can't reach API | Check `NEXT_PUBLIC_API_URL` in `FE/.env.local` matches backend URL |
| Empty map | Run `npm run seed` in BE/ to populate the database |
| Prisma error | Run `npx prisma generate` then `npx prisma db push` |
