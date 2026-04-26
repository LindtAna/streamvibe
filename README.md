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

- [Über das Projekt](#uber-das-projekt)
- [Features](#features)
- [Technologie-Stack](#technologie-stack)
- [Repository-Struktur](#repository-struktur)
- [Umgebungsvariablen](#umgebungsvariablen)
- [API-Dokumentation](#api-dokumentation)
- [Datenbank-Schema](#datenbank-schema-models)
- [Architektur](#architektur)
- [Sicherheit & Authentifizierung](#sicherheit--authentifizierung)
- [Deployment](#deployment)
- [UI-Design](#ui-design--design-system)
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
| Argon2id | golang.org/x/crypto | Passwort‑Hashing |
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
│   │   ├── api/                 # API-Konfiguration & Endpunkte
│   │   │    ├── api.js          # apiService: Zentralisierte API-Methoden(Movies, Collections)
│   │   │    └── axiosConfig.js  # Axios-Instanz mit baseURL und Credentials-Support
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
│   │   │   ├── useAuth.js          # Zugriff auf den AuthContext (User-Daten & Token)
│   │   │   ├── useAxiosPrivate.js  # Automatischer Token-Refresh via Interceptors
│   │   │   ├── useFetch.js         # Datenabfragen mit Loading- und Error-State Handling
│   │   │   └── useSearchCache.js   # Caching für Suchergebnisse und Scroll-Position
│   │   ├── styles/             # Globale Styles & Helpers
│   │   │   ├── helpers/  # SCSS-Variablen, Mixins & Funktionen (generieren keinen direkten CSS-Output)
│   │   │   │   ├── constants.scss  # Basis-Konstanten (z.B. Viewport-Breiten)
│   │   │   │   ├── functions.scss  # Mathematische SCSS-Logik 
│   │   │   │   ├── media.scss      # Media Query Mixins (Breakpoints) & Touch-sichere Hover-States
│   │   │   │   └── mixins.scss     # Wiederverwendbare Layout-Bausteine
│   │   │   ├── fonts.scss          # Lokale @font-face Einbindungen
│   │   │   ├── globals.scss        # HTML/Body-Resets und Basis-Typografie-Regeln
│   │   │   ├── utils.scss          # Globale CSS-Utility-Klassen
│   │   │   ├── variables.scss      # Globale CSS Custom Properties
│   │   │   └── index.scss          # Entry-Point: Importiert Normalisierung, bündelt SCSS-Module
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
    ├── legacy/                 # Veraltete / nicht mehr verwendete Implementierungen
    │   └── controllers/
    │       └── user_controller_bcrypt.go
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

### Infrastruktur & Sicherheit
Die Kommunikation mit dem Backend erfolgt über eine zentralisierte Architektur, die Sicherheit и Performance optimiert.

#### Kommunikation & Authentifizierung
- **Zentraler Service:** Alle Anfragen werden über den `apiService` (`api/api.js`) abgewickelt, der auf einer vorkonfigurierten Axios-Instanz basiert.
- **Sicherheits-Interceptors:** Der Hook `useAxiosPrivate` implementiert automatisches Token-Management:
  - Erkennt `401 Unauthorized` Fehler bei abgelaufenen Access-Tokens.
  - Pausiert ausgehende Anfragen in einer `failedQueue`.
  - Führt einen `/refresh` Call durch.
  - Wiederholt alle wartenden Anfragen automatisch nach erfolgreichem Refresh.
  - **Fallback:** Bei ungültigem Refresh-Token wird der User automatisch ausgeloggt (`auth` wird zurückgesetzt).
- **Credentials:** Alle Anfragen werden mit `withCredentials: true` gesendet, um das sichere Handling von HTTP-only Cookies zu gewährleisten.

#### Caching-Strategie
Um die Netzwerklast zu reduzieren, wird Caching-System via `useSearchCache`genutzt:
- **Persistence:** Speicherung im `sessionStorage` (Daten bleiben beim Tab-Wechsel/Refresh erhalten).
- **TTL (Time-To-Live):** Cache-Einträge sind **10 Minuten** gültig.
- **UX-Optimierung:** Neben den Daten wird die **Scroll-Position** gespeichert(z. B. beim Zurückkehren von einer Detailseite zur Ergebnisliste).

### Endpunkte (Beispiele)

#### Öffentliche Endpunkte

Filme & Serien (TMDB)
```http
GET /movie/:tmdb_id              # Film-Details
GET /serie/:tmdb_id              # Serien-Details
GET /home-collections            # Homepage Film-Sammlungen
GET /home-collections-series     # Homepage Serien-Sammlungen
GET /movies-page-collections     # Film-Seite nach Genres
GET /series-page-collections     # Serien-Seite nach Genres
GET /search?q=<query>&page=<n>   # Multi-Search
```

Datenbank-Filme (Redaktions-Tipps)
```http
GET  /db-movies                   # Alle DB-Filme
GET  /db-movie/:db_id             # Einzelner DB-Film
```

Authentifizierung
```http
POST /register                    # Benutzerregistrierung
POST /login                       # Login (setzt JWT-Cookies)
POST /logout                      # Logout (löscht Cookies)
POST /refresh                     # Token-Refresh
```

Sonstiges
```http
GET  /genres                      # Alle Genre-Kategorien
POST /support                     # Support-Anfrage erstellen
```

#### Geschützte Endpunkte (erfordern JWT)

```http
POST   /addreview/:tmdb_id        # Bewertung hinzufügen
POST   /watchlist/:type/:tmdb_id        # Film/Serie zur Merkliste
DELETE /watchlist/:type/:tmdb_id        # Aus Merkliste entfernen
GET    /watchlist                 # Merkliste abrufen
GET    /recommendedmovies         # Personalisierte Film-Empfehlungen
GET    /recommendedseries         # Personalisierte Serien-Empfehlungen
```
---

## Datenbank-Schema (Models)
Die Datenbank basiert auf MongoDB. Die Datenstrukturen sind in Go wie folgt definiert:

### Benutzer (User)
Repräsentiert die registrierten Nutzer der Plattform.
```go
type User struct {
    ID              bson.ObjectID `bson:"_id,omitempty"`
    UserName        string        `bson:"user_name"`
    Email           string        `bson:"email"`
    Password        string        `bson:"password"` // bcrypt-Hash
    Role            string        `bson:"role"`     // "ADMIN" oder "USER"
    FavouriteGenres []Genre       `bson:"favourite_genres"`
    Watchlist       []string      `bson:"watchlist"` // IDs von TMDB
    Token           string        `bson:"token"`
    RefreshToken    string        `bson:"refresh_token"`
}
```
### Redaktions-Filme (Movie)
Interne Filmdatenbank für redaktionelle Empfehlungen.
```go
type Movie struct {
    DbID             string        `bson:"db_id"`
    Title            string        `bson:"title"`
    PosterPath       string        `bson:"poster_path"`
    YouTubeID        string        `bson:"youtube_id"`
    Director         *PersonInfoDB `bson:"director"`
    Screenwriter     *PersonInfoDB `bson:"screenwriter"`
    Genre            []Genre       `bson:"genre"`
    AdminReview      string        `bson:"admin_review"`
}
```
### Benutzerbewertungen (UserReview)
Speichert die Bewertungen der Nutzer.
```go
type UserReview struct {
    ReviewID  bson.ObjectID `bson:"review_id"`
    UserID    string        `bson:"user_id"`
    UserName  string        `bson:"user_name"`
    Rating    int           `bson:"rating"` // 1-5
    Text      string        `bson:"text"`
    CreatedAt time.Time     `bson:"created_at"`
}
```
### Genres(Genre)
```go
type Genre struct {
	GenreID   int    `bson:"genre_id"`
	GenreName string `bson:"genre_name"`
}
```
### Support Anfrage(SupportRequest)
```go
type SupportRequest struct {
	ID        bson.ObjectID `bson:"_id,omitempty"`
	FirstName string        `bson:"first_name"`
	LastName  string        `bson:"last_name"`
	Email     string        `bson:"email"`
	Phone     string        `bson:"phone,omitempty"`
	Message   string        `bson:"message"`
	CreatedAt time.Time     `bson:"created_at"`
}
```
### Rankings (für KI-Review-Analyse)
```go
type Ranking struct {
	RankingValue int    `bson:"ranking_value"`
	RankingName  string `bson:"ranking_name"`
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
- **Passwort-Hashing:** Argon2id mit OWASP-konformen Parametern
  - **Time:** 3 Iterationen
  - **Memory:** 64 MB
  - **Parallelism:** 4 Threads
  - **Key Length:** 32 Bytes
  - **Salt:** 16 Bytes (kryptographisch sicher)
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

#### `ENV=production` aktiviert
- `SameSite=None` Cookies  
- `Secure HttpOnly`‑Flag für HTTPS  
- Strikte CORS‑Origins

---

## UI-Design & Design-System

Das Frontend nutzt ein maßgeschneidertes, modulares SCSS-Design-System, das auf Fluid Design, Wiederverwendbarkeit und Barrierefreiheit (Accessibility) ausgelegt ist. Die Architektur basiert auf globalen CSS-Variablen kombiniert mit leistungsstarken SCSS-Mixins und -Funktionen.

### Farbpalette (variables.scss):   
Das Projekt verwendet ein systematisches Naming für Farbpaletten, das in variables.scss definiert ist:   
Primärfarben:
- Hintergrund: `--colour-black-08` <span style="background-color:#141414;color:#fff;padding:2px 6px;border-radius:6px;">#141414</span> bis `--colour-black-15` <span style="background-color:#262626;color:#fff;padding:2px 6px;border-radius:6px;">#262626</span> für Cards/Elemente.

- Text:  `--colour-white` <span style="background-color:#FFFFFF;color:#000;padding:2px 6px;border-radius:6px;border:1px solid #888;">#FFFFFF</span> für Headings, `--colour-grey-60` <span style="background-color:#999999;color:#000;padding:2px 6px;border-radius:6px;">#999999</span> für Body-Text.
  
Akzentfarben: 
- Rot-Skala: `--colour-red-45` <span style="background-color:#E50000;color:#fff;padding:2px 6px;border-radius:6px;">#E50000</span> bis `--colour-red-99` <span style="background-color:#FFFAFA;color:#000;padding:2px 6px;border-radius:6px;border:1px solid #ccc;">#FFFAFA</span> für Hover-States, Buttons und Highlights.
  
Statusfarben:    
Erfolg/Validierung: `--colour-green` <span style="background-color:#3cad40;color:#fff;padding:2px 6px;border-radius:6px;">#3cad40</span>, `--colour-green-22` <span style="background-color:#116714;color:#fff;padding:2px 6px;border-radius:6px;border:1px solid #0b4d0f;">#116714</span>.

### Typografie:     
Die Applikation nutzt Fluid Typography, berechnet durch die mathematische SCSS-Funktion clamp(). Dadurch skalieren Schriftgrößen und Abstände stufenlos zwischen den Viewports, ohne dass harte Breakpoints nötig sind.
 - Schriftart: Manrope (Weights: 400, 500, 600, 700)

 - Fluid Headings:
  * h1: Skaliert von 58px (Desktop) bis 28px (Mobile)
  * h2: Skaliert von 48px bis 24px
  * h3: Skaliert von 38px bis 20px

- Body Text: Skaliert fließend zwischen 18px und 14px.

### Responsive Breakpoints & Media Queries:

| Breakpoint       | SCSS‑Variable | Mixins (Beispiele)        |
|------------------|--------------|----------------------------|
| Desktop / Laptop | > 1440px     | @include laptop-above      |
| Tablet           | <= 1023px    | @include tablet            |
| Mobile           | <= 767px     | @include mobile, @include mobile-above |
| Mobile Small     | <= 480px     | @include mobile-s          |


## SCSS Utilities & Mixins:
Die Ordnerstruktur (styles/helpers/) stellt wichtige Werkzeuge bereit, um sauberen und DRY (Don't Repeat Yourself) Code zu schreiben:
  - @include hover: Ein intelligentes Hover-Mixin, das erkennt, ob das Gerät eine Maus unterstützt (any-hover: hover). Auf Touch-Geräten (Smartphones) fällt es automatisch auf einen :active-State zurück, um "steckengebliebene" Hover-Effekte zu vermeiden.
  - Positionierung: Hilfs-Mixins wie @include flex-center, @include abs-center (Absolute Centering) reduzieren Boilerplate-Code.
  - Visibility-Klassen: Hilfsklassen wie .hidden-tablet, .visible-mobile erlauben schnelles Ein- und Ausblenden von Elementen im DOM.

### Accessibility:
- Keyboard-Navigation (Tab, Arrow-Keys)
- .visually-hidden: Ein Mixin/Klasse, um Elemente (wie Label) visuell zu verstecken, aber für Screenreader weiterhin vorlesbar zu machen.
- Focus Management: Globale Anpassung der Focus-States (:focus-visible) mit Outline-Offset (2px dashed var(--colour-white)), um Tastaturnutzern eine klare Navigation zu ermöglichen.

---

##  Roadmap
### Geplante Features

- Admin-Dashboard
- Erweiterte Filter (Jahr, Rating, Sprache)
- Dark/Light Mode

