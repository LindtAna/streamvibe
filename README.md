# StreamVibe Go

![React](https://img.shields.io/badge/React-19.1.1-blue.svg)
![React Router](https://img.shields.io/badge/React_Router-7.13.2-blue.svg)
![Axios](https://img.shields.io/badge/Axios-1.14.0-purple.svg)
![gin-gonic/gin](https://img.shields.io/badge/gin--gonic/gin-v1.12.0-green.svg)
![golang-jwt](https://img.shields.io/badge/golang--jwt-v5.3.1-orange.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-mongo--driver_v2.5.0-green.svg)
![argon2id](https://img.shields.io/badge/argon2id-secure-blue.svg)
![TMDB API](https://img.shields.io/badge/TMDB-API-red.svg)


Web-Plattform zum Entdecken und Verwalten von Filmen und Serien mit personalisierten Empfehlungen, Suchfunktion, Merkliste und Bewertungsmöglichkeit, realisiert mit einem Go-Backend and React-Frontend.

---

## Inhaltsverzeichnis

- [Über das Projekt](#über-das-projekt)
- [Features](#features)
- [Technologie-Stack](#technologie-stack)
- [Repository-Struktur](#repository-struktur)
- [Umgebungsvariablen](#umgebungsvariablen)
- [API-Dokumentation](#api-dokumentation)
- [Datenbank-Schema](#datenbank-schema)
- [Architektur](#architektur)
- [Sicherheit & Authentifizierung](#sicherheit--authentifizierung)
- [Deployment](#deployment)
- [UI-Design](#ui-design)
- [Roadmap](#roadmap)

---

##  Über das Projekt
**StreamVibe Go**  ist eine moderne Web-Plattform zum Entdecken, Durchsuchen und Verwalten von Filmen und Serien. Die Anwendung bietet personalisierte Empfehlungen basierend auf Nutzervorlieben, eine umfassende Suchfunktion sowie eine Merkliste zur Verwaltung interessanter Inhalte.
Das Projekt kombiniert ein Go-Backend (Gin Framework) mit einem React-Frontend und nutzt die TMDB-API als primäre Datenquelle. Die Architektur ist auf Skalierbarkeit, Performance und Benutzerfreundlichkeit ausgelegt.

**Live Demo:**  [https://streamvibe-go.vercel.app](https://streamvibe-go.vercel.app)

---

##  Features

### **Kernfunktionen**

- **Film- und Serien-Katalog** – Durchsuchen von Inhalten nach Genres, Bewertungen und Veröffentlichungsdatum
- **Personalisierte Empfehlungen** – Genre-basierte Vorschläge für angemeldete Nutzer
- **Echtzeit-Suche** – Multi-Search über Filme und Serien mit Caching-Mechanismus
- **Merkliste** – Speichern interessanter Inhalte zur späteren Ansicht
- **Benutzerbewertungen** – Eigene Reviews mit 5‑Sterne‑Rating-System
- **Trailer-Integration** – YouTube-Video-Player für Film-/Serien-Trailer
- **Responsive Design** – Optimiert für Desktop, Tablet und Mobile

### **Admin-Funktionen (Optional)**

- **KI-gestützte Review-Analyse** – Automatische Sentiment-Klassifizierung via OpenAI
- **Verwaltung redaktioneller Inhalte**


## Technologie-Stack

### Frontend

| Technologie | Version | Verwendung |
|------------|---------|------------|
| React | 19.1.1 | Framework |
| React Router | 7.13.2 | Navigation & Routing |
| Sass (SCSS) | - | Styling / Custom Design System |
| Swiper | 12.1.2 | Slider‑Komponenten |
| React Player | 2.16.0 | Video‑Playback |
| classnames | 2.5.1 | Dynamische CSS‑Klassen |
| Axios | 1.14.0 | HTTP‑Client |
| Vite | 7.1.0 | Build‑Tool & Dev‑Server |

### Backend

| Technologie | Version | Verwendung |
|------------|---------|------------|
| Gin | - | Go Web Framework |
| MongoDB | mongo-driver v2.5.0 | Datenbank |
| JWT | golang-jwt/jwt v5.3.1 | Authentifizierung |
| bcrypt | golang.org/x/crypto | Passwort‑Hashing |
| CORS | gin-contrib/cors 1.7.6 | Cross‑Origin‑Konfiguration |
| godotenv | 1.5.1 | Umgebungsvariablen |
| validator | v10.30.1 | Validierung |

### Externe APIs

| API | Verwendung |
|-----|------------|
| TMDB API | Haupt‑Datenquelle für Film‑/Serieninformationen |
| OpenAI API (optional) | KI‑gestützte Review‑Analyse |


##  Repository-Struktur
```
streamvibe/
├── client/streamvibe-client/
│   ├── public/
│   │   └── favicons/           # App-Icons verschiedener Größen
│   ├── src/
│   │   ├── api/                # Axios-Konfiguration & API-Services
│   │   ├── app/
│   │   │   ├── components/     # Wiederverwendbare UI-Komponenten
│   │   │   │   ├── Badge/
│   │   │   │   ├── Button/
│   │   │   │   ├── Checkbox/
│   │   │   │   ├── Collections/
│   │   │   │   ├── CollectionsSeries/
│   │   │   │   ├── Field/
│   │   │   │   ├── Hero/
│   │   │   │   ├── Icon/
│   │   │   │   ├── MovieCard/
│   │   │   │   ├── RatingView/
│   │   │   │   ├── Select/
│   │   │   │   ├── SerieCard/
│   │   │   │   ├── Slider/
│   │   │   │   ├── SliderNavigation/
│   │   │   │   ├── Tabs/
│   │   │   │   ├── Tags/
│   │   │   │   └── Videoplayer/
│   │   │   ├── layouts/        # Layout-Komponenten
│   │   │   │   ├── Header/
│   │   │   │   │   ├── BurgerButton/
│   │   │   │   │   ├── Header/
│   │   │   │   │   ├── Logo/
│   │   │   │   │   └── SearchBar/
│   │   │   │   └── Section/
│   │   │   ├── modals/         # Dialog-Komponenten
│   │   │   │   ├── AddReview/
│   │   │   │   └── Authentication/
│   │   │   │       └── UserLogin/
│   │   │   ├── pages/          # Seitenkomponenten
│   │   │   │   ├── home/
│   │   │   │   ├── movie-page/
│   │   │   │   ├── movies-page/
│   │   │   │   ├── saved-page/
│   │   │   │   ├── search-page/
│   │   │   │   ├── serie-page/
│   │   │   │   ├── series-page/
│   │   │   │   └── support-page/
│   │   │   ├── Layout.jsx
│   │   │   └── RequiredAuth.jsx
│   │   ├── assets/
│   │   │   ├── fonts/          # WOFF2-Schriftarten (Manrope)
│   │   │   ├── icons/          # SVG-Icons
│   │   │   └── (Bilder)        # Banner & andere Assets
│   │   ├── context/            # React Context (AuthProvider)
│   │   ├── hooks/              # Custom Hooks
│   │   │   ├── useAuth.jsx
│   │   │   ├── useAxiosPrivate.jsx
│   │   │   ├── useFetch.js
│   │   │   └── useSearchCache.js
│   │   ├── styles/             # Globale Styles & Helpers
│   │   │   ├── helpers/
│   │   │   │   ├── constants.scss
│   │   │   │   ├── functions.scss
│   │   │   │   ├── media.scss
│   │   │   │   └── mixins.scss
│   │   │   ├── fonts.scss
│   │   │   ├── globals.scss
│   │   │   ├── utils.scss
│   │   │   ├── variables.scss
│   │   │   └── index.scss
│   │   └── main.jsx            # App-Entry-Point
│   ├── App.jsx                 # Routing-Konfiguration
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── server/streamvibemoviesserver/
    ├── controllers/            # Request-Handler
    │   ├── admin_openai_review_optional_controller.go
    │   ├── movie_controller.go
    │   ├── search_controller.go
    │   ├── support_controller.go
    │   ├── tmdb_movie_controller.go
    │   ├── tmdb_serie_controller.go
    │   ├── user_controller.go
    │   └── watchlist_controller.go
    ├── database/               # DB-Verbindung
    │   └── database_connection.go
    ├── middleware/             # Middleware (Auth)
    │   └── auth_middleware.go
    ├── models/                 # Datenmodelle
    │   ├── movie_model.go
    │   ├── search_model.go
    │   ├── support_model.go
    │   ├── tmdb_movie_model.go
    │   ├── tmdb_serie_model.go
    │   └── user_model.go
    ├── routes/                 # Route-Definitionen
    │   ├── protected_routes.go
    │   └── unprotected_routes.go
    ├── utils/                  # Hilfsfunktionen
    │   ├── tmdb_recomendations_util.go
    │   ├── tmdb_search_util.go
    │   ├── tmdb_serie_util.go
    │   ├── tmdb_util.go
    │   └── token_util.go
    ├── .env.example
    ├── go.mod
    ├── go.sum
    └── main.go                 # Server-Entry-Point
 ```


##  Umgebungsvariablen

### Backend (`/server/streamvibemoviesserver/.env`)
```env
# Datenbank
DATABASE_NAME=streamvibe
MONGODB_URI=mongodb+srv://...

# JWT-Secrets
SECRET_KEY=<access_token_secret>
SECRET_KEY_REFRESH_TOKEN=<refresh_token_secret>

# TMDB API
TMDB_API_KEY=<bearer_token>

# OpenAI (optional)
OPENAI_API_KEY=<api_key>
BASE_PROMPT_TEMPLATE=Return a response using one of these words: {rankings}...

# Server-Konfiguration
ENV=production
ALLOWED_ORIGINS=https://example.com,https://www.example.com

# Empfehlungen
RECOMMENDED_MOVIE_LIMIT=20
```

### Frontend 
(`/client/streamvibe-client/.env.production`)
```env
VITE_API_BASE_URL=https://streamvibe.onrender.com
```

(`/client/streamvibe-client/.env.development`)
```env
VITE_API_BASE_URL=http://localhost:8080
```
---

##  API-Dokumentation

### Öffentliche Endpunkte

#### Filme & Serien (TMDB)

```http
GET /movie/:tmdb_id              # Film-Details
GET /serie/:tmdb_id              # Serien-Details
GET /home-collections            # Homepage Film-Sammlungen
GET /home-collections-series     # Homepage Serien-Sammlungen
GET /movies-page-collections     # Film-Seite nach Genres
GET /series-page-collections     # Serien-Seite nach Genres
GET /search?q=<query>&page=<n>   # Multi-Search
```

#### Datenbank-Filme (Redaktions-Tipps)
```http
GET  /db-movies                   # Alle DB-Filme
GET  /db-movie/:db_id             # Einzelner DB-Film
```

#### Authentifizierung
```http
POST /register                    # Benutzerregistrierung
POST /login                       # Login (setzt JWT-Cookies)
POST /logout                      # Logout (löscht Cookies)
POST /refresh                     # Token-Refresh
```

#### Sonstiges
```http
GET  /genres                      # Alle Genre-Kategorien
POST /support                     # Support-Anfrage erstellen
```

#### Geschützte Endpunkte (erfordern JWT)
```http
POST   /addreview/:tmdb_id        # Bewertung hinzufügen
POST   /watchlist/:tmdb_id        # Film/Serie zur Merkliste
DELETE /watchlist/:tmdb_id        # Aus Merkliste entfernen
GET    /watchlist                 # Merkliste abrufen
GET    /recommendedmovies         # Personalisierte Film-Empfehlungen
GET    /recommendedseries         # Personalisierte Serien-Empfehlungen
```
---

## Datenbank-Schema

### Collections
#### Benutzer(user_model)
```go
{
  _id: ObjectId,
  user_id: string,              // Hex-String von ObjectId
  user_name: string,
  email: string,
  password: string,             // bcrypt-Hash
  role: "USER" | "ADMIN",
  created_at: Date,
  updated_at: Date,
  token: string,                // JWT Access Token
  refresh_token: string,        // JWT Refresh Token
  favourite_genres: [
    { genre_id: int, genre_name: string }
  ],
  watchlist: [string]           // Array von TMDB-IDs
}
```
#### Filme(movie_model) - Redaktions-Tipps
```go
{
  db_id: string,
  title: string,
  poster_path: string,          // URL
  youtube_id: string,
  release_date: string,
  original_language: string,
  director: { name: string, profile_path: string },
  screenwriter: { name: string, profile_path: string },
  genre: [{ genre_id: int, genre_name: string }],
  overview: string,
  admin_review: string
}
```
#### Bewertungen(UserReview)
```go
{
  _id: ObjectId,
  review_id: ObjectId,
  user_id: string,
  user_name: string,
  country: string,
  rating: int,                  // 1-5
  text: string,
  created_at: Date,
  movie_id: string,             // TMDB-ID (optional)
  serie_id: string              // TMDB-ID (optional)
}
```
#### Genres(Genre)
```go
{
  genre_id: int,
  genre_name: string
}
```
#### Support Anfrage(support_model)
```go
{
  _id: ObjectId,
  first_name: string,
  last_name: string,
  email: string,
  phone: string,
  message: string,
  created_at: Date
}
```
#### Rankings (für KI-Review-Analyse)
```go
{
  _id: ObjectId,
  first_name: string,
  last_name: string,
  email: string,
  phone: string,
  message: string,
  created_at: Date
}
```
---

##  Architektur

### System-Architektur
```
┌───────────────────────────────────────────────────────────────────┐
│                   Frontend (React + Vite)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐         │
│  │   Pages      │  │  Components  │  │     Context      │         │
│  │              │  │              │  │   (Global State) │         │
│  │ - HomePage   │  │ - Header     │  │                  │         │
│  │ - Movies     │  │ - Hero       │  │ - AuthProvider   │         │
│  │ - Series     │  │ - Collections│  │   (User/Auth)    │         │
│  │ - MoviePage  │  │ - MovieCard  │  │                  │         │
│  │ - SeriePage  │  │ - SerieCard  │  │                  │         │
│  │ - SavedPage  │  │ - Slider     │  │                  │         │
│  │ - SearchPage │  │ - Button     │  │                  │         │
│  │ - Support    │  │ - SearchBar  │  │                  │         │
│  │              │  │ - VideoPlayer│  │                  │         │
│  └──────────────┘  └──────────────┘  └──────────────────┘         │
│                              │                                    │
│                              ▼                                    │
│                    Axios HTTP Client                              │
│                    (axiosConfig / axiosPrivate)                   │
└───────────────────────────────┼───────────────────────────────────┘
                                │
                                │ REST API Calls + JWT Auth
                                │
┌───────────────────────────────▼───────────────────────────────────┐
│                  Backend (Go + Gin Framework)                     │
│  ┌─────────────┐    ┌─────────────────┐    ┌─────────────┐        │
│  │   Routes    │    │   Controllers   │    │ Middleware  │        │
│  │             │    │                 │    │             │        │
│  │ Unprotected:│--->│ user_controller │    │- AuthMiddle-│        │
│  │ - /register │    │  - RegisterUser │    │  ware (JWT) │        │
│  │ - /login    │    │  - LoginUser    │    │             │        │
│  │ - /logout   │    │  - LogoutHandler│    │             │        │
│  │ - /refresh  │    │  - RefreshToken │    │             │        │
│  │             │    │                 │    │             │        │
│  │ - /movie/:id│    │ tmdb_movie_ctrl │    │             │        │
│  │ - /serie/:id│    │  - GetMovieTMDB │    │             │        │
│  │ - /db-movie │    │  - GetSerieTMDB │    │             │        │
│  │ - /search   │    │                 │    │             │        │
│  │ - /home-... │    │ movie_controller│    │             │        │
│  │ - /support  │    │  - GetMovies    │    │             │        │
│  │             │    │  - GetMovie     │    │             │        │
│  │ Protected:  │    │                 │    │             │        │
│  │ - /addreview│    │ search_ctrl     │    │             │        │
│  │ - /watchlist│    │  - SearchTMDB   │    │             │        │
│  │ - /recommen-│    │                 │    │             │        │
│  │   dedmovies │    │ watchlist_ctrl  │    │             │        │
│  │             │    │  - AddToWatch   │    │             │        │
│  │             │    │  - RemoveFrom   │    │             │        │
│  │             │    │  - GetWatchlist │    │             │        │
│  └─────────────┘    └─────────────────┘    └─────────────┘        │
│                              │                                    │
│                              ▼                                    │
│                    MongoDB Driver (Go)                            │
└───────────────────────────────┼───────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────┐
│                      MongoDB Database                             │
│                                                                   │
│  Collections:                                                     │
│  - users (Benutzer, JWT-Tokens, Watchlist, Genres)                │
│  - movies (DB-Filme: Poster, Trailer, Regie, Drehbuch)            │
│  - user_reviews (Bewertungen von Usern)                           │
│  - support_anfrage (Support-Anfragen)                             │
│  - rankings (AI-Review-Klassifikation, optional)                  │
└───────────────────────────────────────────────────────────────────┘

External Services:
┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐
│   TMDB API      │    │  YouTube Embed  │    │  OpenAI API  │
│  (Filme/Serien, │    │   (Trailer)     │    │ (AI-Review,  │
│   Metadaten,    │    │                 │    │  optional)   │
│   Bilder)       │    │                 │    │              │
└─────────────────┘    └─────────────────┘    └──────────────┘

Authentication Flow:
┌───────────────────────────────────────────────────────────────────┐
│  1. User Login → Backend generiert Access Token + Refresh Token   │
│  2. Tokens als HttpOnly Cookies gespeichert                       │
│  3. axiosPrivate Interceptor: Auto-Refresh bei 401                │
│  4. AuthContext speichert User-State (localStorage + State)       │
└───────────────────────────────────────────────────────────────────┘

Data Flow Beispiel (Film-Details abrufen):
┌────────────────────────────────────────────────────────────────────┐
│ 1. User navigiert zu /movie/:tmdbId                                │
│ 2. MovieDetailsTMDB.jsx ruft apiService.getMovieById(tmdbId)       │
│ 3. axiosConfig sendet GET /movie/:tmdbId an Backend                │
│ 4. Backend-Controller GetMovieTMDB:                                │
│    - Ruft TMDB API für Filmdaten ab                                │
│    - Holt User-Reviews aus MongoDB                                 │
│    - Konvertiert zu MovieDetailsResponse                           │
│ 5. Frontend zeigt Film-Banner + Details + Reviews                  │
└────────────────────────────────────────────────────────────────────┘

Personalisierte Empfehlungen:
┌────────────────────────────────────────────────────────────────────┐
│ 1. User hat favourite_genres bei Registrierung gewählt             │
│ 2. Backend mappt Genre-Namen zu TMDB-Genre-IDs                     │
│ 3. Für jedes Genre: 2× top-rated + 2× popular (aktuell)            │
│ 4. Duplikate entfernen → Empfehlungen zurückgeben                  │
│ 5. Frontend zeigt "Filmempfehlungen" Sektion                       │
└────────────────────────────────────────────────────────────────────┘
```
### Backend (Go)

#### Schichtenmodell

1. **Router (routes/)** → Route-Definitionen
2. **Middleware (middleware/)** → Authentifizierung & CORS
3. **Controller (controllers/)** → Business-Logik
4. **Models (models/)** → Datenstrukturen
5. **Utils (utils/)** → Hilfsfunktionen (TMDB, JWT, Empfehlungen)
6. **Database (database/)** → MongoDB-Verbindung

#### Konzepte

1. **RESTful API-Design**
2. **JWT-basierte Authentifizierung** via HTTP-Only Cookies
3. **Parallele API-Anfragen** mit Goroutines & WaitGroups
4. **Context-basierte Timeouts** für DB-Operationen


### Frontend(React)

#### Verzeichnisstruktur

1. **pages/** → Route-Komponenten (vollständige Seiten)
2. **layouts/** → Wiederverwendbare Layout-Wrapper
3. **components/** → UI-Bausteinkomponenten
4. **modals/** → Dialog-Komponenten
5. **hooks/** → Custom React Hooks (Auth, Caching, Fetch)
6. **context/** → Globaler State (AuthContext)

#### Design-Prinzipien

1. **Component Composition**
2. **Custom Hooks** für API-Logik
3. **Session Storage** für Search-Caching
4. **Responsive SCSS** mit Fluid Typography & Breakpoints

---

##  Sicherheit & Authentifizierung
### JWT-Flow

#### Login
- Server generiert **Access Token (24h)** und **Refresh Token (7d)**
- Speicherung in **HTTP-Only Cookies** (Schutz vor XSS)

#### Token-Speicherung & Refresh
- Tokens liegen in sicheren Cookies (`accessToken`, `refreshToken`)
- **Axios-Interceptor** erneuert Tokens automatisch bei 401‑Response

#### Logout
- Cookies werden gelöscht
- Tokens werden in der Datenbank ungültig gemacht


### Sicherheitsmaßnahmen

#### Authentifizierung & Schutz
- **Passwort-Hashing:** bcrypt mit Default-Cost
- **Protected Routes:** Middleware prüft JWT vor geschützten Endpunkten

#### Sicherheit im Request-Flow
- **CORS-Konfiguration:** Explizite Whitelist für erlaubte Origins
- **SameSite-Cookies:** Lax (dev) / None (prod mit HTTPS)
- **Input-Validierung:** go-playground/validator auf Server-Seite


### Datenschutz (DSGVO-Konform)

#### Grundprinzipien
- **Minimale Datenerhebung:** Nur notwendige Felder werden gespeichert
- **Passwörter:** Niemals im Klartext gespeichert
- **Pseudonymisierung:** Nutzer-Reviews zeigen nur `user_name` statt echter Identität

---

## Deployment
### Empfohlene Infrastruktur

#### Backend
- Cloud VM (z.B. AWS EC2, DigitalOcean Droplet)

#### Frontend
- CDN-Hosting (Vercel, Netlify, Cloudflare Pages)

#### Datenbank
- MongoDB Atlas (Managed Service)


### Umgebungsspezifische Konfiguration

#### ![ENV=production](https://img.shields.io/badge/ENV-production-blue) aktiviert
- ![SameSite=None](https://img.shields.io/badge/SameSite-None-blue) Cookies  
- ![Secure](https://img.shields.io/badge/Secure-HTTPS-blue)‑Flag für HTTPS  
- Strikte CORS‑Origins

---

## UI-Design
### Design-System
**Farben** (variables.scss):
Primär: Graustufen von
![Akzentfarben](https://img.shields.io/badge/--colour--black--06-%230F0F0F-darkgrey.svg)
bis
![Akzentfarben](https://img.shields.io/badge/--colour-grey-99-%23FCFCFD-lightgrey.svg)


Akzentfarben: 
![Akzentfarben](https://img.shields.io/badge/--colour--red--45-%23E50000-red.svg) , 
![Akzentfarben](https://img.shields.io/badge/--colour--red--50-%23FF0000-red.svg)

Erfolg: 
![Erfolg](https://img.shields.io/badge/--colour--green-%233cad40-green.svg) ,
![Erfolg](https://img.shields.io/badge/--colour--green--22-%23116714-darkgreen.svg)

**Typografie**:
- Font: Manrope (400, 500, 600, 700)
- Fluid Typography: fluid(max, min) für responsive Schriftgrößen
- Breakpoints: 1440px (laptop), 1023px (tablet), 767px (mobile)

**Accessibility**:
- Keyboard-Navigation (Tab, Arrow-Keys)
- ARIA-Labels & Roles
- Focus-States (@include focus-visible)

---

##  Roadmap
### Geplante Features

- Admin-Dashboard
- Erweiterte Filter (Jahr, Rating, Sprache)
- Dark/Light Mode

