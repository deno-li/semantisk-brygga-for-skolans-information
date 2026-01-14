# Bidra till välbefinnandehjul för sammanhållen planering och uppföljning

Tack för ditt intresse att bidra till detta projekt! Vi välkomnar bidrag från alla, särskilt från yrkespersoner inom skola, hälsa, vård och omsorg.

## 🎯 Projektets Syfte

Detta är en prototyp för att demonstrera semantisk integration av information från olika välfärdssektorer för sammanhållen planering kring barn och unga. Projektet är ett privat initiativ för att bidra med ett perspektiv från praktiken.

## 🤝 Hur Man Bidrar

### Rapportera Buggar eller Föreslå Förbättringar

1. **Kontrollera först** om problemet eller förslaget redan rapporterats i [Issues](https://github.com/deno-li/semantisk-brygga-for-skolans-information/issues)
2. **Skapa en ny issue** med en tydlig titel och beskrivning
3. **Inkludera exempel** eller skärmdumpar när det är relevant
4. **För säkerhetsrelaterade problem**, följ instruktionerna i [SECURITY.md](SECURITY.md)

### Bidra med Kod

1. **Fork** repositoryt
2. **Skapa en branch** för din förändring: `git checkout -b feature/min-förbättring`
3. **Gör dina ändringar** och följ kodstandarden nedan
4. **Testa dina ändringar**: 
   - Kör `npm run lint` för att kontrollera TypeScript-fel
   - Kör `npm run build` för att säkerställa att projektet byggs korrekt
5. **Commit dina ändringar** med tydliga meddelanden
6. **Push** till din fork: `git push origin feature/min-förbättring`
7. **Öppna en Pull Request** med en beskrivning av ändringarna

### Kodstandard

- **TypeScript**: Använd stark typning och undvik `any` när det är möjligt
- **React**: Använd funktionella komponenter och hooks
- **Kommentarer**: Skriv kommentarer på svenska för svensk kontext, engelska för internationella begrepp
- **Namngivning**: Använd beskrivande variabelnamn på engelska
- **Formatering**: Projektet använder standard TypeScript/React-konventioner

### Dokumentation

- Uppdatera `README.md` om du lägger till nya funktioner
- Dokumentera nya komponenter med JSDoc-kommentarer
- Håll exempel och mockdata realistisk men fiktiv

## 🔒 Säkerhet och Personuppgifter

**VIKTIGT**: Detta är en prototyp med demonstrationsdata.

- ✅ Använd **endast fiktiva** personuppgifter i all mockdata
- ✅ Inga riktiga personnummer, namn, eller känsliga uppgifter
- ❌ Commita **aldrig** API-nycklar eller secrets (`.env.local` är gitignored)
- ✅ Följ GDPR-principer även i exempel

## 📚 Utvecklingsmiljö

### Förkunskaper

- Node.js 20 eller senare
- npm eller yarn
- Git
- Python 3.11+ (för backend-utveckling)

### Installation

```bash
# Klona ditt fork
git clone https://github.com/ditt-användarnamn/semantisk-brygga-for-skolans-information.git
cd semantisk-brygga-for-skolans-information

# Installera frontend-beroenden
npm install

# Installera backend-beroenden (valfritt)
python -m pip install -r backend/requirements.txt
```

### Utveckling

```bash
# Starta frontend-utvecklingsserver
npm run dev

# Starta backend (i separat terminal, valfritt)
uvicorn backend.fastapi_app:app --reload

# Kontrollera kod
npm run lint

# Bygg för produktion
npm run build
```

## 🎨 Designprinciper

1. **Användarvänlighet**: Gränssnittet ska vara intuitivt för yrkespersoner i välfärdssektorn
2. **Tydlighet**: Information ska presenteras på ett strukturerat och lättförståeligt sätt
3. **Säkerhet**: Alltid tänka på dataskydd och informationssäkerhet
4. **Evidens**: Basera funktioner på etablerade ramverk (GIRFEC, ICF, BBIC)
5. **Öppenhet**: Transparent utveckling och delning av kunskap

## 📖 Projektstruktur

```
src/
├── components/     # React-komponenter
├── data/          # Mockdata och konstanter
├── types/         # TypeScript-typdefinitioner
├── api/           # API-klienter
└── hooks/         # Custom React hooks

backend/
├── fastapi_app.py      # FastAPI backend
├── semantic_mapper.py  # Semantisk mappning
└── *_models.py        # Datamodeller
```

### Högprioriterade Bidrag

- Förbättringar av tillgänglighet (WCAG)
- Validering av semantiska mappningar (ICF, KSI, etc.)
- Användarupplevelse för yrkespersoner
- Exempel på integration med befintliga system
- Dokumentation och översättningar

### Välkomna Bidrag

- Buggfixar
- Prestandaförbättringar
- Testning och feedback från praktiken
- Nya visualiseringar

## 📄 Licens

Genom att bidra till detta projekt godkänner du att dina bidrag kommer att licensieras under samma licens som projektet:

- **Källkod**: MIT License
- **Dokumentation**: Creative Commons Attribution 4.0 International (CC BY 4.0)

Se [LICENSE](LICENSE) för fullständiga villkor.

## 💬 Community

### Var Respektfull

- Bemöt alla bidragsgivare med respekt
- Fokusera på konstruktiv feedback
- Var tålmodig med nya bidragsgivare
- Håll diskussioner professionella

### Kommunikation

- Använd GitHub Issues för buggar och funktionsförslag
- Använd Pull Requests för att diskutera kodändringar
- För säkerhetsfrågor, följ [SECURITY.md](SECURITY.md)

## 🎓 Erkännanden

Bidrag erkänns i projektets README och commit-historik. Om ditt bidrag är särskilt betydande kan du läggas till i en CONTRIBUTORS-fil.

## ❓ Frågor?

Om du har frågor om hur du kan bidra, öppna en issue märkt med "question" eller kontakta projektägaren via GitHub.

---

**Tack för att du bidrar till barn och ungas välbefinnande!** 🌟
