# Säkerhetsinformation

## För officiella granskare

Denna prototyp är utvecklad för att demonstrera konceptet "Semantisk brygga för skolans information" - en samordningsplattform för barn- och ungdomsvård i Sverige.

### Säkerhetsstatusen för denna prototyp

#### ✅ Säkerhetsåtgärder som är implementerade:

1. **Ingen exponering av känslig data**
   - Endast mock-data och demonstrationsscenarier
   - Inga riktiga personuppgifter
   - Inga API-nycklar i källkoden eller byggprocessen

2. **Säker deployment**
   - Statisk webbsida via GitHub Pages
   - Ingen server-side kod
   - Ingen databas
   - Automatiserad och reproducerbar build-process

3. **Öppen källkod**
   - All kod är granskningsbar
   - GitHub Actions workflows är publika
   - Transparent build-process

4. **Begränsad attack-yta**
   - Ingen inloggning eller autentisering (demo-läge)
   - Ingen datalagring
   - Ingen kommunikation med externa servrar (utan API-nycklar)

#### ⚠️ Detta är INTE en produktionsklar lösning

Följande säkerhetsåtgärder saknas (medvetet, eftersom detta är en prototyp):

1. **Autentisering & auktorisering**
   - Ingen användareautentisering
   - Ingen rollbaserad åtkomstkontroll
   - Ingen federerad inloggning (SITHS, BankID, etc.)

2. **Dataskydd**
   - Ingen kryptering av data
   - Ingen säker backend
   - Ingen databas med åtkomstkontroll
   - Ingen loggning eller audit trail

3. **GDPR-compliance**
   - Ingen dataskyddskonsekvensanalys (DPIA)
   - Ingen personuppgiftsansvarig
   - Inga rutiner för registerutdrag
   - Ingen samtyckehantering

4. **Informationssäkerhet enligt Säkerhetsskyddslagen**
   - Ingen säkerhetsklassning
   - Ingen riskanalys
   - Ingen incidenthantering
   - Ingen kontinuitetsplanering

5. **Infrastruktursäkerhet**
   - Ingen DDoS-skydd
   - Ingen Web Application Firewall (WAF)
   - Ingen intrångsdetektering
   - Ingen säkerhetsövervakning

6. **Compliance**
   - Inte anpassad för Patientdatalagen (PDL)
   - Inte anpassad för Socialtjänstlagen
   - Inte anpassad för Skollagen
   - Ingen arkiveringsprocess enligt Arkivlagen

## Rapportera säkerhetsproblem

Om du hittar en säkerhetsbugg i prototypen:

1. **Skapa INTE en publik GitHub Issue** (för känsliga säkerhetsfel)
2. **Kontakta projektägaren direkt** via GitHub privat meddelande
3. **Beskriv problemet** så detaljerat som möjligt
4. **Inkludera steg för att reproducera** (om möjligt)

## Utvecklingsriktlinjer för säkerhet

Om du bidrar till projektet, följ dessa riktlinjer:

### ✅ Gör:
- Använd endast mock-data och fiktiva personer
- Håll alla dependencies uppdaterade
- Kör `npm audit` regelbundet
- Validera all användarinput
- Använd TypeScript för typsäkerhet
- Dokumentera säkerhetsantaganden

### ❌ Gör INTE:
- Commita API-nycklar eller secrets (`.env.local` är gitignored)
- Använd riktiga personuppgifter i demo-data
- Implementera egen kryptering (använd etablerade bibliotek)
- Skippa input-validering
- Lägga till externa dependencies utan säkerhetsanalys
- Öppna nya attack-ytor utan dokumentation

## Säkerhetsarkitektur för produktion

Om denna prototyp skulle vidareutvecklas till produktion, krävs:

### 1. Identitet & åtkomst
- **SITHS-kort** för vårdpersonal (1177, vård)
- **BankID** eller tjänstekort för socialtjänst
- **Federerad inloggning** via Skolfederation för skolor
- **Rollbaserad åtkomstkontroll** (RBAC) baserat på:
  - Organisation (skola, socialtjänst, vård)
  - Roll (lärare, kurator, socialsekreterare, läkare)
  - Specifika barn (endast berörda yrkespersoner)
- **Multi-factor authentication (MFA)** för alla användare

### 2. Dataskydd & kryptering
- **Kryptering i vila** (encrypted database, AES-256)
- **Kryptering i transit** (TLS 1.3+, HSTS)
- **End-to-end kryptering** för känsliga meddelanden
- **Pseudonymisering** där möjligt
- **Dataminimering** - endast nödvändig information
- **Automatisk radering** efter retention period

### 3. Backend & infrastruktur
- **Säker hosting** i Sverige (GDPR-compliant datacenter)
- **API Gateway** med rate limiting
- **WAF (Web Application Firewall)**
- **DDoS-skydd**
- **Intrångsdetektering** (IDS/IPS)
- **Säkerhetsloggar** med minimum 1 års retention
- **Backup & disaster recovery**

### 4. Compliance & processer
- **DPIA (Dataskyddskonsekvensanalys)**
- **PUL/GDPR-analys** för alla personuppgifter
- **Informationsklassning** enligt Säkerhetsskyddslagen
- **Säkerhetspolicy** och rutiner
- **Incidenthantering** med 72-timmars rapporteringskrav
- **Regelbundna säkerhetsrevisioner**
- **Penetrationstester** minimum årligen
- **Säkerhetsutbildning** för all personal

### 5. Lagring & loggning
- **Audit trail** för alla åtkomster till barndata
- **SIEM (Security Information and Event Management)**
- **Compliance med Arkivlagen**
- **Säker arkivering** enligt organisationers arkivplaner

### 6. Integration & API-säkerhet
- **OAuth 2.0 / OpenID Connect** för API-autentisering
- **API-nycklar** med rotation
- **Rate limiting** per användare/organisation
- **Validering av all input** (XSS, SQL injection, etc.)
- **CORS-policy** för att förhindra oauktoriserad access

### 7. Organisatoriskt
- **Personuppgiftsansvarig (PUA)** per organisation
- **Dataskyddsombud (DSO)**
- **Informationssäkerhetsansvarig (ISA)**
- **Säkerhetsorganisation** med tydliga roller
- **Avtal** mellan samverkande organisationer
- **Informationsdelningspolicy** enligt Sammanhållen vård och omsorg

## Relevanta lagar och förordningar

1. **Dataskyddsförordningen (GDPR)**
2. **Patientdatalagen (PDL)**
3. **Offentlighets- och sekretesslagen (OSL)**
4. **Arkivlagen**
5. **Säkerhetsskyddslagen**
6. **Socialtjänstlagen (SoL)**
7. **Lagen om behandling av personuppgifter inom socialtjänsten**
8. **Skollagen**

## Kontakt

För säkerhetsfrågor, kontakta projektägaren via:
- GitHub Issues (för icke-känsliga frågor)
- Privat meddelande på GitHub (för säkerhetsrelaterade frågor)

---

**Senast uppdaterad**: 2025-12-27
**Prototypstatus**: Endast demonstration, EJ för produktion
