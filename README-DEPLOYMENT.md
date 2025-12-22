# Säker GitHub Pages Deployment

## Översikt

Denna prototyp är deployad via GitHub Pages och kan säkert delas med officiella aktörer (skola, socialtjänst, vård) för granskning.

## Säkerhetsåtgärder

### ✅ Implementerade säkerhetsåtgärder:

1. **Inga API-nycklar exponerade**
   - Ingen OpenAI API-nyckel inkluderas i bygget
   - Ingen backend API-anslutning (prototypen kör helt client-side)
   - Alla känsliga miljövariabler är exkluderade

2. **Statisk deployment**
   - Endast frontend (React SPA) deployas
   - Ingen server-side kod körs
   - Ingen databas eller backend-logik exponerad

3. **GitHub Actions säkerhet**
   - Begränsade permissions (read contents, write pages)
   - Automatiserad build-process utan manuella secrets
   - Reproducerbar och granskningsbar deployment

4. **Demo-data endast**
   - All data i prototypen är mock-data
   - Inga riktiga personuppgifter
   - Demonstrerar konceptet utan känslig information

## Hur deployment fungerar

1. **Trigger**: När kod pushas till `main`-branchen
2. **Build**: GitHub Actions bygger React-appen med Vite
3. **Deploy**: Färdigt bygge publiceras på GitHub Pages
4. **URL**: Tillgänglig på `https://<användarnamn>.github.io/<repo-namn>`

## Aktivera GitHub Pages

För att aktivera deployment:

1. Gå till ditt repo på GitHub
2. Klicka på **Settings** → **Pages**
3. Under **Source**, välj **GitHub Actions**
4. Workflowen körs automatiskt vid nästa push till `main`

## Funktionalitet i deployed prototyp

### ✅ Fungerar:
- Alla visualiseringar (SHANARRI-hjul, resilience matrix, etc.)
- Navigering mellan vyer
- Mock-data och demo-profiler
- Responsiv design
- Alla frontend-komponenter

### ❌ Fungerar INTE (kräver backend):
- AI-analys (kräver OpenAI API)
- Semantisk mappning (kräver Python backend)
- Kodvalidering mot riktiga klassifikationssystem
- Bildgenerering

## Lokal utveckling med backend

Om du vill köra med full funktionalitet lokalt:

```bash
# 1. Kopiera env-template
cp .env.example .env.local

# 2. Lägg till din OpenAI API-nyckel i .env.local (valfritt)
# VITE_OPENAI_API_KEY=sk-...

# 3. Starta frontend
npm run dev

# 4. (Valfritt) Starta Python backend i separat terminal
cd backend
python semantic_mapper.py
```

## Säkerhetsrekommendationer för officiella granskare

När ni granskar prototypen:

1. **Kolla själva koden** - Allt är öppen källkod
2. **Verifiera byggprocessen** - GitHub Actions logs är publika
3. **Testa i sandboxad miljö** - Det är en statisk webbsida
4. **Granska mock-data** - Se `/src/data/` för all demo-data
5. **Kontrollera dependencies** - Se `package.json` för alla npm-paket

## GDPR och personuppgifter

⚠️ **VIKTIGT**: Denna prototyp:
- Innehåller INGA riktiga personuppgifter
- Använder endast fiktiva demo-scenarier
- Sparar ingen data (allt är i minnet under sessionen)
- Skickar ingen data till externa servrar (utan API-nycklar)

Vid produktion skulle följande behövas:
- GDPR-analys och dataskyddskonsekvensanalys
- Säker backend med autentisering
- Krypterad lagring
- Loggning och revision
- Informationssäkerhetsklassning enligt Säkerhetsskyddslagen

## Kontakt och feedback

För frågor om säkerhet, deployment eller prototypen:
- Öppna ett GitHub Issue
- Granska koden direkt i repot
- Forka och testa själva i er egen miljö

## Licens

Se LICENSE-fil i repot.
