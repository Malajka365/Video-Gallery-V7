# Video Gallery V7 Tudástérkép

## 1. Projektstruktúra

### Gyökérmappa elemei
- **index.html**: Fő HTML belépési pont
- **package.json**: NPM konfigurációs és függőségi fájl
- **vite.config.ts**: Vite bundler konfiguráció
- **tsconfig*.json**: TypeScript konfigurációs fájlok
- **tailwind.config.js**: Tailwind CSS konfiguráció
- **postcss.config.js**: PostCSS konfiguráció
- **eslint.config.js**: ESLint konfigurációs fájl
- **jest.config.js**: Jest tesztelési konfiguráció
- **.env**: Környezeti változók
- **node_modules/**: Telepített függőségek

### Fő könyvtárszerkezet
- **src/**: Forráskódok fő mappája
  - **assets/**: Statikus erőforrások
  - **components/**: React komponensek
    - **auth/**: Authentikációval kapcsolatos komponensek
    - **common/**: Általános, újrafelhasználható komponensek
    - **dashboard/**: Dashboard funkciókhoz tartozó komponensek
  - **contexts/**: React kontextusok
  - **lib/**: Háttérlogika, szolgáltatások, API hívások
  - **schemas/**: Adatsémák, validációs szabályok
  - **__tests__/**: Tesztfájlok
- **supabase/**: Supabase adatbázis fájlok

## 2. Kódszerkezet részletezése

### Fő fájlok szerepe

#### Belépési pontok
- **src/index.css**: Globális CSS stílusok
- **src/main.tsx**: Alkalmazás fő belépési pontja, React DOM renderelés
- **src/App.tsx**: Fő alkalmazás komponens, routing logika, globális állapotkezelés

#### Adatbázis kapcsolódás
- **src/lib/supabase.ts**: Supabase kliens konfigurációja
- **src/lib/supabase-types.ts**: Adatbázis típusdefiníciók (videók, galériák, tagek, felhasználók)

#### Szolgáltatások
- **src/lib/auth-context.tsx**: Felhasználói authentikáció kontextus, session kezelés
- **src/lib/video-service.ts**: Videókkal kapcsolatos CRUD műveletek
- **src/lib/gallery-service.ts**: Galériákkal kapcsolatos CRUD műveletek

### Fájlok közötti kapcsolatok

#### Import szerkezet
- **App.tsx** importálja a főbb komponenseket és az AuthProvider-t
- A komponensek importálják a megfelelő szolgáltatásokat a **lib/** mappából
- Az auth komponensek felhasználják az **auth-context**-et
- A video és galéria komponensek használják a megfelelő szolgáltatásokat és típusokat

#### Adatfolyam
- **auth-context.tsx** -> **ProtectedRoute.tsx** -> védett komponensek
- **App.tsx** -> adatbetöltés -> komponensekhez továbbítás
- **video-service.ts** és **gallery-service.ts** -> komponensekbe injektálás

## 3. Funkciók és komponensek

### Főbb funkciók

#### Authentikáció
- Bejelentkezés (Google provider és email/jelszó)
- Regisztráció
- Token frissítés és session kezelés
- Védett útvonalak

#### Videókezelés
- Videók hozzáadása YouTube ID alapján
- Videók keresése, szűrése
- Videók szerkesztése és törlése
- Tag-ek menedzselése

#### Galéria funkciók
- Galériák létrehozása különböző láthatósági beállításokkal
- Galériák kategorizálása
- Felhasználói galériák kezelése

### Frontend komponensek

#### Oldal komponensek
- **MainPage.tsx**: Kezdőoldal
- **CategoryGallery.tsx**: Kategória szerinti videónézegető
- **ManageVideosPage.tsx**: Videók kezelése
- **TagManagementPage.tsx**: Tag-ek kezelése
- **VideoPage.tsx**: Videó részletes nézet

#### Auth komponensek
- **RegistrationPage.tsx**: Regisztrációs oldal
- **LoginPage.tsx**: Bejelentkezési oldal
- **ProtectedRoute.tsx**: Védett útirányító komponens

#### Dashboard komponensek
- **DashboardPage.tsx**: Felhasználói vezérlőpult
- **CreateGallery.tsx**: Új galéria létrehozása
- **GalleriesPage.tsx**: Galériák listázása
- **SettingsPage.tsx**: Beállítások

#### Funkcionális komponensek
- **VideoCard.tsx**: Videó kártya megjelenítése
- **VideoGallery.tsx**: Videók galériás megjelenítése
- **VideoUploadForm.tsx**: Videó feltöltési űrlap
- **EditVideoModal.tsx**: Videó szerkesztési modál
- **TagFilter.tsx**: Tag szűrő komponens

## 4. Technológiák

### Frontend
- **React 18**: UI keretrendszer
- **TypeScript**: Statikus típusrendszer
- **React Router**: Kliensoldali routing
- **Tailwind CSS**: Utility-first CSS keretrendszer
- **Lucide React**: Ikonkészlet

### Backend / Adatbázis
- **Supabase**: Backend-as-a-Service
  - Authentikáció
  - PostgreSQL adatbázis
  - Tárhelyszolgáltatás

### Fejlesztési eszközök
- **Vite**: Gyors fejlesztői környezet
- **ESLint**: Kódelemzés
- **Jest**: Tesztelési keretrendszer
- **Testing Library**: React komponensek tesztelése

## 5. Kulcsfontosságú elemek

### Adatbázis entitások
- **profiles**: Felhasználói profilok
- **galleries**: Videó galériák
- **videos**: Videó bejegyzések
- **tag_groups**: Tag csoportok

### Adatmodell kapcsolatok
- Egy felhasználóhoz több galéria tartozhat
- Egy galériához több videó tartozhat
- Egy galériához több tag csoport tartozhat
- Videók több tag-gel címkézhetők

### Jogosultságkezelés
- Három féle galéria láthatóság:
  - **public**: Mindenki számára látható
  - **authenticated**: Csak bejelentkezett felhasználóknak
  - **private**: Csak a tulajdonos számára

### Állapotkezelés
- Felhasználói állapot az **auth-context**-ben
- Adatok lekérése és cache-elése a szolgáltatásokban
- Eseménykezelés egyedi eseményekkel (`videoAdded`, `videoUpdated`, stb.)

### Integrációk
- **YouTube**: Videók beágyazása és előnézeti képek
- **Google Auth**: Google bejelentkezés

## 6. Fejlesztési pontok és kiegészítések

- Komplex szűrési lehetőségek tag-ek alapján
- Videók csoportosítása és rendezése
- Mobilbarát felhasználói felület Tailwind CSS-sel
- Több féle autentikációs lehetőség
- Token és session kezelés automatikus frissítéssel
