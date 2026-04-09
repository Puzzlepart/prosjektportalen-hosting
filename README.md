# Prosjektportalen – Sentral hosting av malpakker

> **Om:** Utkast til spesifikasjon for sentral hosting av malpakker i Prosjektportalen
> **Status:** Utkast v4  
> **Sist oppdatert:** 2026-04-09  
> **Repo:** [prosjektportalen-hosting](https://github.com/Puzzlepart/prosjektportalen-hosting)

---

## 1. Bakgrunn og motivasjon

Prosjektportalen er et åpent kildekode-verktøy for M365/SharePoint som installeres i kundens egen tenant. Ved oppsett av nye prosjektområder brukes en oppsettveiviser (SPFx Application Customizer) som provisjonerer innhold basert på maler, prosjekttillegg og standardinnhold via `sp-js-provisioning`.

Dagens løsning fungerer godt, men har begrensninger når det gjelder distribusjon av nye versjoner av maler og standardinnhold. Maler og konfigurasjon ligger lokalt i hver tenant, og det finnes ingen mekanisme for å hente oppdateringer fra en sentral kilde.

### Mål

- Gjøre det enkelt å publisere og distribuere nye maler, standardinnhold og konfigurasjon fra et sentralt GitHub-repo
- La administratorer browse, forhåndsvise og importere malpakker til sin hub – eller koble til sentrale maler uten lokal kopiering
- Gi sluttbrukere en enkel og visuell opplevelse ved valg av mal i oppsettveiviseren
- Bygge videre på eksisterende `sp-js-provisioning`-rammeverk
- Sikre full sporbarhet fra prosjektområde tilbake til nøyaktig malpakkeversjon
- Støtte ny versjon av Prosjektveiviseren som lanseres mai/juni 2026

---

## 2. Nåsituasjon

### 2.1 Eksisterende lister og artefakter

| Liste / artefakt | Beskrivelse |
|---|---|
| **Maloppsett** | Oversikt over alle maler med felter for konfigurasjon |
| **Malfiler** | JSON-filer (sp-js-provisioning-format) som provisjoneres på nye områder |
| **Prosjekttillegg** | JSON-filer (sp-js-provisioning-format) med tilleggskonfigurasjon |
| **Listeinnhold** | Konfigurasjon av standardinnhold og hvor det skal kopieres i nye prosjekter |
| **Fasesjekkliste** | Listedata som kopieres til prosjektområder |
| **Planneroppgaver** | Oppgaver som settes opp i prosjektområder |

### 2.2 Nåværende flyt for opprettelse av prosjektområde

1. M365-gruppeområde opprettes
2. Site design/template "Prosjektområde" legges på
3. SPFx Application Customizer trigges → oppsettveiviseren starter
4. Bruker velger mal (fra Maloppsett), evt. prosjekttillegg og standardinnhold
5. `sp-js-provisioning` provisjonerer alt innhold på området

---

## 3. Konsepter og begreper

### 3.1 Maltyper

| Begrep | Definisjon |
|---|---|
| **Lokal mal** | En mal som er opprettet og vedlikeholdt direkte i tenanten av kunden selv. Ingen kobling til hosting-repoet. Dette er slik alle maler fungerer i dag. |
| **Importert mal** | En malpakke som er hentet fra hosting-repoet og kopiert inn på huben. Ligger lokalt, men kan spores tilbake til kilde og versjon. Kan oppdateres fra repoet. |
| **Sentral mal** | En mal som peker til hosting-repoet og alltid bruker siste versjon derfra ved provisjonering. Ingen lokal kopi av malinnholdet – admin velger hvilke sentrale maler som skal gjøres tilgjengelig for brukere. |

### 3.2 Øvrige begreper

| Begrep | Definisjon |
|---|---|
| **Malpakke** (.pppkg) | En zip-fil med definert struktur som inneholder alt som trengs for en mal eller frittstående utvidelse: provisjoneringsmal, prosjekttillegg, standardinnhold, filer, metadata og konfigurasjon |
| **Hosting-repo** | GitHub-repoet `prosjektportalen-hosting` der malpakker publiseres og versjoneres |
| **Malpakkekatalog** | En sentral indeksfil (`catalog.json`) i hosting-repoet som lister alle tilgjengelige malpakker med metadata |

---

## 4. Pakkeformat – `.pppkg`

### 4.1 Struktur

En `.pppkg`-fil er en zip-fil med følgende mappestruktur. En pakke kan representere en komplett mal, en frittstående utvidelse (prosjekttillegg) eller frittstående standardinnhold.

```
malpakkenavn-1.0.0.pppkg
├── manifest.json              # Metadata, versjon, innholdsreferanser, avhengigheter
├── README.md                  # Beskrivelse (vises i wizard – skrevet for non-techies)
├── CHANGELOG.md               # Endringslogg
├── thumbnail.png              # Forhåndsvisningsbilde (16:9, min 600×338px)
│
├── provisioning/              # sp-js-provisioning filer
│   ├── template.json          # Hoved-provisjoneringsmal (valgfri – ikke påkrevd for frittstående innhold)
│   └── extensions/            # Prosjekttillegg
│       ├── extension-a.json
│       └── extension-b.json
│
├── content/                   # Standardinnhold (listeelementer)
│   ├── phase-checklist.json   # Fasesjekkliste-elementer
│   ├── planner-tasks.json     # Planneroppgaver
│   └── ...
│
├── schema/                    # Felt-, innholdstype- og listedefinisjoner
│   ├── fields.json            # Egendefinerte felter
│   ├── content-types.json     # Innholdstyper
│   ├── lists.json             # Lister som skal opprettes på hub
│   └── files.json             # Filer som skal kopieres/installeres på hub
│
├── taxonomy/                  # Termsett-definisjoner (managed metadata)
│   └── termsets.json          # Termsett med forhåndsdefinerte IDer og termhierarki
│
└── assets/                    # Filer referert fra files.json (maler, dokumenter, bilder etc.)
    └── ...
```

### 4.2 `manifest.json`

Manifestet er pakkens sentrale konfigurasjonsfil. Den inneholder all metadata samt innholdskonfigurasjon (inkl. content-mapping), slik at man slipper separate config-filer.

```json
{
  "$schema": "https://raw.githubusercontent.com/Puzzlepart/prosjektportalen-hosting/main/schema/pppkg-manifest.schema.json",
  "id": "pp-standard-prosjektmal",
  "name": "Standard prosjektmal",
  "description": "Standardmal for prosjekter med fasesjekkliste, planneroppgaver og grunnleggende konfigurasjon.",
  "version": "1.2.0",
  "author": "Puzzlepart",
  "license": "MIT",
  "minPPVersion": "1.10.0",
  "thumbnail": "thumbnail.png",
  "tags": ["standard", "prosjekt", "faser"],
  "type": "template",

  "provisioning": {
    "template": "provisioning/template.json",
    "extensions": [
      {
        "id": "extension-a",
        "name": "Kvalitetssikring",
        "description": "Legger til kvalitetssikringsliste og tilhørende sjekkliste",
        "file": "provisioning/extensions/extension-a.json",
        "optional": true,
        "defaultSelected": false
      }
    ]
  },

  "content": {
    "items": [
      {
        "id": "phase-checklist",
        "name": "Fasesjekkliste",
        "description": "12 sjekkpunkter fordelt på prosjektfasene",
        "sourceFile": "content/phase-checklist.json",
        "targetList": "Fasesjekkliste",
        "optional": false
      },
      {
        "id": "planner-tasks",
        "name": "Planneroppgaver",
        "description": "8 standardoppgaver for prosjektoppstart",
        "sourceFile": "content/planner-tasks.json",
        "targetList": "Planneroppgaver",
        "optional": true,
        "defaultSelected": true
      }
    ]
  },

  "schema": {
    "fields": "schema/fields.json",
    "contentTypes": "schema/content-types.json",
    "lists": "schema/lists.json",
    "files": "schema/files.json"
  },

  "taxonomy": {
    "termsets": "taxonomy/termsets.json"
  },

  "changelog": "CHANGELOG.md"
}
```

#### Felt: `type`

| Verdi | Beskrivelse |
|---|---|
| `template` | Komplett prosjektmal (provisjoneringsmal + evt. tillegg + innhold) |
| `extension` | Frittstående prosjekttillegg |
| `content` | Frittstående standardinnhold |

### 4.3 `schema/files.json`

Definerer filer som skal kopieres til hub-nivå ved installasjon. Refererer til filer under `assets/`.

```json
{
  "files": [
    {
      "source": "assets/prosjektrapport-mal.docx",
      "target": "Malfiler/prosjektrapport-mal.docx",
      "description": "Dokumentmal for prosjektrapporter"
    },
    {
      "source": "assets/logo-placeholder.png",
      "target": "SiteAssets/logo-placeholder.png",
      "description": "Plassholder-logo for nye prosjekter"
    }
  ]
}
```

### 4.4 `taxonomy/termsets.json`

Definerer termsett med forhåndsdefinerte IDer. Faste IDer er avgjørende fordi managed metadata-felter refererer til termsett via GUID – uten stabile IDer ville feltene ikke finne riktig termsett etter provisjonering.

```json
{
  "termGroup": {
    "name": "Prosjektportalen",
    "id": "ab12cd34-ef56-7890-ab12-cd34ef567890"
  },
  "termSets": [
    {
      "id": "11111111-2222-3333-4444-555555555555",
      "name": "Prosjektfaser",
      "description": "Faser i prosjektets livssyklus",
      "isOpenForTermCreation": false,
      "terms": [
        {
          "id": "aaaa1111-bbbb-cccc-dddd-eeee11111111",
          "name": "Konsept",
          "sortOrder": 0,
          "customProperties": {
            "PpPhaseLevel": "1"
          }
        },
        {
          "id": "aaaa1111-bbbb-cccc-dddd-eeee22222222",
          "name": "Planlegge",
          "sortOrder": 1,
          "customProperties": {
            "PpPhaseLevel": "2"
          }
        },
        {
          "id": "aaaa1111-bbbb-cccc-dddd-eeee33333333",
          "name": "Gjennomføre",
          "sortOrder": 2,
          "customProperties": {
            "PpPhaseLevel": "3"
          },
          "terms": [
            {
              "id": "aaaa1111-bbbb-cccc-dddd-ffff11111111",
              "name": "Gjennomføre - Delfase 1",
              "sortOrder": 0
            }
          ]
        },
        {
          "id": "aaaa1111-bbbb-cccc-dddd-eeee44444444",
          "name": "Avslutte",
          "sortOrder": 3,
          "customProperties": {
            "PpPhaseLevel": "4"
          }
        }
      ]
    },
    {
      "id": "22222222-3333-4444-5555-666666666666",
      "name": "Prosjekttype",
      "description": "Klassifisering av prosjekttyper",
      "isOpenForTermCreation": true,
      "terms": [
        {
          "id": "bbbb1111-cccc-dddd-eeee-ffff11111111",
          "name": "Internt prosjekt",
          "sortOrder": 0
        },
        {
          "id": "bbbb1111-cccc-dddd-eeee-ffff22222222",
          "name": "Kundeprosjekt",
          "sortOrder": 1
        }
      ]
    }
  ]
}
```

#### Designvalg for termsett-IDer

Alle termsett og termer har forhåndsdefinerte IDer i pakken. Dette sikrer:

- **Feltkobling:** Managed metadata-felter i `fields.json` kan referere til `TermSetId` direkte. Feltene fungerer umiddelbart etter provisjonering.
- **Kryssreferanser:** Standardinnhold (f.eks. fasesjekkliste-elementer) kan referere til termer via ID.
- **Idempotens:** Ved re-installasjon eller oppdatering kan eksisterende termsett gjenkjennes og oppdateres i stedet for dupliseres.
- **Konsistens på tvers av tenanter:** Alle installasjoner av samme malpakke bruker identiske IDer, noe som forenkler support og dokumentasjon.

### 4.5 Utvidelse av sp-js-provisioning – `provisionTermSets()`

Taxonomy-provisjonering implementeres som en **separat funksjon** i sp-js-provisioning, adskilt fra den vanlige template-provisjoneringen. Funksjonen tar inn termsett-definisjonen (fra `termsets.json`) og provisjonerer mot term store via Microsoft Graph API.

#### API-design

```typescript
import { provisionTermSets } from 'sp-js-provisioning';

// Kalles separat, før template-provisjonering
await provisionTermSets(context, {
  source: termSetsJson,         // Innholdet fra taxonomy/termsets.json
  graphClient: msGraphClient,   // MSGraphClientV3 fra SPFx-kontekst
  onProgress: (message) => {    // Valgfri callback for fremdriftsvisning
    console.log(message);
  }
});

// Deretter kjøres vanlig provisjonering som før
await provisionTemplate(context, templateJson);
```

#### Hvorfor separat funksjon

- **Tydelig ansvarsfordeling:** Taxonomy-provisjonering har egne avhengigheter (Graph API, Term Store-tillatelser) som skiller seg fra resten av sp-js-provisioning
- **Fleksibel rekkefølge:** Kalleren styrer eksplisitt at termsett opprettes *før* template-provisjonering, uten at sp-js-provisioning trenger intern rekkefølgelogikk for dette
- **Kan brukes uavhengig:** Funksjonen kan kalles alene – f.eks. for pakker av typen `content` som bare trenger termsett uten en full provisjoneringsmal
- **Enklere testing:** Kan enhetstestes isolert uten å sette opp full provisjoneringsflyt

#### Underliggende API: Microsoft Graph Taxonomy

Funksjonen bruker Graph Taxonomy API under panseret:

```
GET    /sites/{siteId}/termStore/groups                          → Finn/opprett termgruppe
POST   /sites/{siteId}/termStore/groups                          → Opprett termgruppe
GET    /sites/{siteId}/termStore/groups/{groupId}/sets            → Finn eksisterende termsett
POST   /sites/{siteId}/termStore/groups/{groupId}/sets            → Opprett termsett (med fast ID)
GET    /sites/{siteId}/termStore/sets/{setId}/children            → List eksisterende termer
POST   /sites/{siteId}/termStore/sets/{setId}/children            → Opprett term (med fast ID)
PATCH  /sites/{siteId}/termStore/sets/{setId}/children/{termId}   → Oppdater term
```

Tilgjengelig fra SPFx via `MSGraphClientV3`. Krever `TermStore.ReadWrite.All` (delegated).

#### Intern flyt i `provisionTermSets()`

```
provisionTermSets(context, options)
│
├─ 1. Hent term store for site
│     GET /sites/{siteId}/termStore
│
├─ 2. Finn eller opprett termgruppe
│     GET  .../termStore/groups → finn by name+id
│     POST .../termStore/groups → opprett hvis ikke finnes
│
├─ 3. For hvert termsett i definisjonen:
│     │
│     ├─ 3a. Sjekk om termsett finnes (by ID)
│     │       GET .../groups/{groupId}/sets
│     │
│     ├─ 3b. Opprett hvis ikke finnes
│     │       POST .../groups/{groupId}/sets  { id, name, description, ... }
│     │
│     ├─ 3c. Oppdater hvis finnes og navn/beskrivelse er endret
│     │       PATCH .../sets/{setId}
│     │
│     └─ 3d. Synkroniser termer (rekursivt for hierarki)
│             │
│             ├─ Hent eksisterende termer
│             │   GET .../sets/{setId}/children
│             │
│             ├─ For hver term i definisjonen:
│             │   ├─ Finnes med riktig ID? → Oppdater hvis endret
│             │   └─ Finnes ikke?          → Opprett med definert ID
│             │
│             └─ Termer som finnes lokalt men ikke i pakken → Behold
│
└─ 4. Rapporter resultat (opprettet/oppdatert/uendret per termsett)
```

#### Feilhåndtering

| Feil | Håndtering |
|---|---|
| Manglende `TermStore.ReadWrite.All` | Avbryt med tydelig melding: "Du trenger Term Store-tillatelser. Kontakt din IT-administrator." |
| Bruker er ikke Term Store Admin | Avbryt med melding om manglende rettigheter |
| Term store finnes ikke på site | Avbryt med forklaring |
| Rate limiting (429) | Retry med eksponentiell backoff (maks 3 forsøk) |
| Nettverksfeil | Retry én gang, deretter avbryt med feilmelding |
| Termsett-ID-konflikt (annen termgruppe) | Logg advarsel, forsøk å bruke eksisterende |

#### Logging og fremdrift

Funksjonen rapporterer fremdrift via `onProgress`-callback som SPFx-wizarden kan bruke til å vise status:

```
📋 Oppretter termgruppe "Prosjektportalen"...
📋 Termsett "Prosjektfaser" – oppretter 4 termer...
📋 Termsett "Prosjekttype" – finnes allerede, oppdaterer 1 term...
✅ Taxonomy-provisjonering fullført (2 termsett, 6 termer)
```

### 4.6 Provisjoneringsrekkefølge

Med `provisionTermSets()` som separat funksjon blir den fullstendige provisjoneringssekvensen ved malpakkeinstallasjon:

```
┌─ provisionTermSets() ──────────────────────────────────────┐
│  1. Taxonomy     → Opprett termgruppe og termsett           │
│                    (med faste IDer, via Graph API)           │
└─────────────────────────────────────────────────────────────┘
         ↓  Fullført uten feil
┌─ provisionTemplate() ──────────────────────────────────────┐
│  2. Fields       → Opprett site columns                     │
│                    (managed metadata-felter refererer        │
│                     til termsett-IDer fra steg 1)            │
│  3. ContentTypes → Opprett innholdstyper                    │
│  4. Lists        → Opprett lister med innholdstyper         │
│  5. Files        → Kopier filer til hub                     │
│  6. Content      → Kopier standardinnhold til lister        │
└─────────────────────────────────────────────────────────────┘
         ↓  Fullført uten feil
┌─ Pakkeinstallasjon (SPFx) ─────────────────────────────────┐
│  7. Extensions   → Kjør evt. prosjekttillegg                │
│  8. Metadata     → Oppdater Maloppsett + stemple område     │
└─────────────────────────────────────────────────────────────┘
```

Ansvaret for rekkefølgen ligger hos SPFx-komponenten (malpakkekatalogen / oppsettveiviseren), ikke inne i sp-js-provisioning. Dette gir full kontroll over feilhåndtering mellom stegene.

### 4.7 Idempotens og oppdatering av termsett

Ved installasjon og oppdatering av malpakker må taxonomy-provisjoneringen håndtere at termsett allerede kan eksistere:

| Scenario | Oppførsel |
|---|---|
| Termsett finnes ikke | Opprett med definert ID |
| Termsett finnes med riktig ID | Oppdater navn/beskrivelse hvis endret. Legg til nye termer. |
| Term finnes med riktig ID | Oppdater navn/sortOrder/customProperties hvis endret |
| Term finnes lokalt men ikke i pakken | **Behold** – kunden kan ha lagt til egne termer |
| Termgruppe finnes ikke | Opprett med definert ID |
| Termgruppe finnes | Bruk eksisterende |

Prinsipp: *Additivt og ikke-destruktivt.* Pakken legger til og oppdaterer, men sletter aldri termer som allerede finnes – kunden kan ha utvidet termsettet lokalt.

### 4.8 Tillatelser

Taxonomy-provisjonering krever at brukeren som installerer malpakken har tilstrekkelige rettigheter:

- **Term Store Administrator** – kan opprette termgrupper og termsett
- **Term Group Contributor** – kan opprette termsett og termer innenfor en eksisterende gruppe

SPFx-komponenten bør sjekke tilgangsnivå før taxonomy-provisjonering starter, og gi en tydelig feilmelding dersom brukeren mangler rettigheter.

### 4.9 Bygging av .pppkg

I første omgang bygges pakkene lokalt, tilsvarende hvordan Prosjektportalen i dag bygger malfiler (JSON). En enkel build-script samler filer, validerer manifest og lager zip:

```
npm run build:packages
  → Validerer manifest.json mot JSON Schema
  → Sjekker at alle refererte filer finnes
  → Linter sp-js-provisioning JSON
  → Pakker til .pppkg (zip)
  → Oppdaterer catalog.json
```

GitHub Actions for automatisert bygging kan legges til senere (se fase 4).

---

## 5. Hosting-repo – struktur og katalog

### 5.1 Repo-struktur

```
prosjektportalen-hosting/
├── catalog.json               # Indeks over alle tilgjengelige pakker
├── schema/
│   ├── pppkg-manifest.schema.json
│   └── catalog.schema.json
│
├── packages/                  # Kildefiler per malpakke
│   ├── standard-prosjektmal/
│   │   ├── manifest.json
│   │   ├── README.md
│   │   ├── CHANGELOG.md
│   │   ├── thumbnail.png
│   │   ├── provisioning/
│   │   ├── content/
│   │   ├── schema/
│   │   └── assets/
│   ├── byggeprosjekt/
│   │   └── ...
│   └── kvalitetssikring-tillegg/   # Eksempel: frittstående utvidelse
│       └── ...
│
├── dist/                      # Bygde .pppkg-filer (generert)
│   ├── standard-prosjektmal-1.2.0.pppkg
│   ├── byggeprosjekt-1.0.0.pppkg
│   └── kvalitetssikring-tillegg-1.0.0.pppkg
│
├── scripts/                   # Lokale build-script
│   ├── build-packages.js
│   └── validate-manifest.js
│
└── .github/
    └── workflows/
        └── validate-pr.yml    # Validering ved PR (kan legges til tidlig)
```

### 5.2 `catalog.json`

```json
{
  "$schema": "https://raw.githubusercontent.com/Puzzlepart/prosjektportalen-hosting/main/schema/catalog.schema.json",
  "lastUpdated": "2026-04-09T10:00:00Z",
  "packages": [
    {
      "id": "pp-standard-prosjektmal",
      "name": "Standard prosjektmal",
      "description": "Standardmal for prosjekter med fasesjekkliste, planneroppgaver og grunnleggende konfigurasjon.",
      "version": "1.2.0",
      "type": "template",
      "author": "Puzzlepart",
      "tags": ["standard", "prosjekt", "faser"],
      "thumbnail": "https://raw.githubusercontent.com/Puzzlepart/prosjektportalen-hosting/main/packages/standard-prosjektmal/thumbnail.png",
      "downloadUrl": "https://github.com/Puzzlepart/prosjektportalen-hosting/releases/download/v1.2.0/standard-prosjektmal-1.2.0.pppkg",
      "minPPVersion": "1.10.0",
      "publishedDate": "2026-04-01",
      "changelogUrl": "https://raw.githubusercontent.com/Puzzlepart/prosjektportalen-hosting/main/packages/standard-prosjektmal/CHANGELOG.md"
    }
  ]
}
```

---

## 6. Sporbarhet og metadata

### 6.1 Utvidelse av Maloppsett-listen

Maloppsett-listen utvides med følgende felter for å spore malpakkekilde og status:

| Felt | Type | Beskrivelse |
|---|---|---|
| `PpPkgType` | Valg | Maltype: `Lokal`, `Importert`, `Sentral` |
| `PpPkgId` | Tekst | Malpakke-ID fra manifest (f.eks. `pp-standard-prosjektmal`). Tom for lokale maler. |
| `PpPkgVersion` | Tekst | Installert/tilkoblet versjon (f.eks. `1.2.0`) |
| `PpPkgSourceUrl` | URL | Full URL til kilde i hosting-repoet |
| `PpPkgInstalledDate` | Dato/tid | Når malpakken ble installert/aktivert |
| `PpPkgUpdatedDate` | Dato/tid | Når malpakken sist ble oppdatert lokalt |
| `PpPkgLatestVersion` | Tekst | Siste tilgjengelige versjon fra katalog (oppdateres ved sjekk) |

For **lokale maler** er pakke-feltene tomme – disse fungerer som i dag.

For **importerte maler** fylles alle felter, og versjon kan sammenlignes med `PpPkgLatestVersion` for oppdateringsvarsel.

For **sentrale maler** settes `PpPkgType` til `Sentral`, og `PpPkgSourceUrl` peker til hosting-repoet. Ingen lokal kopi av innhold, men admin har eksplisitt valgt at denne malen skal være tilgjengelig.

### 6.2 Stempling av prosjektområder

Når et prosjektområde opprettes, stemples følgende informasjon på området (som site properties / property bag):

| Property | Beskrivelse |
|---|---|
| `pp_template_id` | Mal-ID (fra Maloppsett) |
| `pp_pkg_id` | Malpakke-ID (fra manifest, tom for lokale) |
| `pp_pkg_version` | Nøyaktig malpakkeversjon som ble brukt |
| `pp_pkg_type` | `Lokal`, `Importert` eller `Sentral` |
| `pp_provisioned_date` | Tidspunkt for provisjonering |

Dette gir full sporbarhet: fra et prosjektområde kan man se nøyaktig hvilken malpakkeversjon som ble brukt, og koble dette tilbake til en spesifikk versjon i hosting-repoet.

### 6.3 Vurdering: Egen malpakke-liste vs. utvidelse av Maloppsett

To alternativer for lagring av pakkemetadata:

**Alternativ A: Utvide Maloppsett (anbefalt for fase 1)**
- Enklere – bygger direkte på eksisterende liste
- All informasjon om en mal samlet på ett sted
- Fungerer godt så lenge det er 1:1 mellom malpakke og Maloppsett-element

**Alternativ B: Egen Malpakker-liste**
- Bedre separasjon – en pakke kan ha flere Maloppsett-elementer
- Renere sporing og historikk
- Mer kompleksitet – krever relasjoner mellom lister
- Kan bli aktuelt hvis vi trenger å spore pakkehistorikk (installasjonslogg, oppdateringer over tid)

**Anbefaling:** Start med Alternativ A. Feltene på Maloppsett gir god nok sporing for de fleste scenarier. Vurder å løfte til egen liste i en senere fase dersom det oppstår behov for mer avansert sporing (f.eks. installerte pakker som ikke er knyttet til et Maloppsett-element, eller detaljert oppdateringshistorikk).

---

## 7. SPFx-komponent – Malpakkehåndtering

### 7.1 Oversikt

En ny SPFx-komponent (ListView Command Set) på **Maloppsett**-listen gir administratorer tilgang til malpakkekatalogen. Komponenten viser også status for eksisterende maler.

### 7.2 Maloversikt på Maloppsett

Eksisterende Maloppsett-visning berikes med visuell indikasjon av maltype:

| Mal | Type | Versjon | Status |
|---|---|---|---|
| Intern prosjektmal | 🏠 Lokal | – | – |
| Standard prosjektmal | 📥 Importert | v1.1.0 | ⬆️ v1.2.0 tilgjengelig |
| Byggeprosjekt | ☁️ Sentral | v2.0.0 | ✅ Oppdatert |

### 7.3 Wizard – brukerflyt

Wizarden er designet for administratorer som ikke nødvendigvis er tekniske. Fokus på visuell fremstilling, gode beskrivelser og bilder – ikke JSON-strukturer og skjemadetaljer.

```
┌────────────────────────────────────────────────────────────┐
│  Malpakkekatalog                                    [✕]    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  🔍 Søk / filtrer       [Maler ▾] [Utvidelser ▾] [Alle]   │
│                                                            │
│  ┌─────────────────────┐  ┌─────────────────────┐         │
│  │                     │  │                     │         │
│  │    [thumbnail]      │  │    [thumbnail]      │         │
│  │                     │  │                     │         │
│  │  Standard           │  │  Byggeprosjekt      │         │
│  │  prosjektmal        │  │                     │         │
│  │                     │  │  Komplett mal for    │         │
│  │  Den mest brukte    │  │  bygge- og anleggs-  │         │
│  │  malen for vanlige  │  │  prosjekter          │         │
│  │  prosjekter         │  │                     │         │
│  │                     │  │  v2.0.0              │         │
│  │  v1.2.0             │  │  [Se detaljer]       │         │
│  │  📥 Importert v1.1  │  │                     │         │
│  │  ⬆️ Oppdatering!    │  │                     │         │
│  └─────────────────────┘  └─────────────────────┘         │
│                                                            │
└────────────────────────────────────────────────────────────┘

         │ Klikk på pakke
         ▼

┌────────────────────────────────────────────────────────────┐
│  ← Tilbake    Standard prosjektmal               [✕]      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │                                                    │    │
│  │          [Stort thumbnail / skjermbilder]          │    │
│  │                                                    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                            │
│  Den mest brukte malen for vanlige prosjekter i            │
│  Prosjektportalen. Inkluderer fasesjekkliste med 12        │
│  sjekkpunkter, standardoppgaver i Planner, og              │
│  grunnleggende lister for prosjektstyring.                 │
│                                                            │
│  Versjon: 1.2.0         Utgiver: Puzzlepart                │
│  Krever: Prosjektportalen 1.10.0+                          │
│                                                            │
│  ┌─ Dette får du ──────────────────────────────────┐       │
│  │                                                  │       │
│  │  📋 Prosjektoppsett med faseinndeling            │       │
│  │  ✅ Fasesjekkliste – 12 sjekkpunkter             │       │
│  │  📌 Planneroppgaver – 8 standardoppgaver          │       │
│  │  📎 Dokumentmaler for prosjektrapporter           │       │
│  │  🏷️ Termsett: Prosjektfaser, Prosjekttype         │       │
│  │  🔧 Kvalitetssikring (valgfritt tillegg)          │       │
│  │                                                  │       │
│  └──────────────────────────────────────────────────┘       │
│                                                            │
│  ┌─ Nyheter i denne versjonen ─────────────────────┐       │
│  │  v1.2.0 – Ny fasesjekkliste, oppdaterte         │       │
│  │           Planner-oppgaver, ny dokumentmal       │       │
│  │  v1.1.0 – Lagt til kvalitetssikring-tillegg     │       │
│  └──────────────────────────────────────────────────┘       │
│                                                            │
│  ┌──────────────────┐  ┌────────────────────────┐          │
│  │ 📥 Importer til  │  │ ☁️ Bruk som sentral    │          │
│  │    hub           │  │    mal                 │          │
│  └──────────────────┘  └────────────────────────┘          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 7.4 Installasjonsmoduser

#### Modus A: Importert mal

1. `.pppkg` lastes ned fra GitHub
2. Pakken pakkes ut og innholdet provisjoneres:
   a. **`provisionTermSets()`** → Termgrupper og termsett opprettes/oppdateres (Graph API, med faste IDer)
   b. **`provisionTemplate()`** → Felter, innholdstyper, lister, filer og innhold provisjoneres (sp-js-provisioning)
   c. **Prosjekttillegg** → Legges i Prosjekttillegg-listen
   d. **Standardinnhold** → Kopieres til relevante lister
3. Maloppsett-element opprettes/oppdateres med `PpPkgType = Importert` og versjonsinformasjon
4. Malen er nå tilgjengelig i oppsettveiviseren som en lokal kopi

#### Modus B: Sentral mal

1. Admin velger "Bruk som sentral mal" i katalogen
2. Et Maloppsett-element opprettes med `PpPkgType = Sentral` og peker til hosting-repoet
3. **Ingen lokal kopi** av malinnhold – alt hentes fra repo ved provisjonering
4. Malen er nå tilgjengelig i oppsettveiviseren for brukere
5. Virksomheten bruker alltid siste versjon uten lokale modifikasjoner
6. Krever nettverkstilgang fra klient til GitHub (vurdere CDN/proxy ved behov)

#### Deaktivering / fjerning

- Admin kan fjerne en importert eller sentral mal fra Maloppsett
- For importerte maler: lokalt innhold kan valgfritt slettes eller beholdes
- Eksisterende prosjektområder påvirkes ikke (de har allerede fått innholdet)

### 7.5 Oppdateringsflyt

- `catalog.json` sjekkes mot `PpPkgLatestVersion` ved åpning av malpakkekatalogen
- Caching: Katalogen caches i 24 timer for å unngå unødvendige forespørsler
- Pakker med ny versjon markeres med oppdateringsindikator
- Ved oppdatering kjøres samme flyt som installasjon
- Dersom malpakken krever en nyere versjon av Prosjektportalen (`minPPVersion`), vises en tydelig melding: *"Denne malpakken krever Prosjektportalen X.Y.Z. Oppgrader Prosjektportalen før du kan hente denne malen."*

---

## 8. Endringer i oppsettveiviseren

### 8.1 Støtte for sentrale maler

Oppsettveiviseren utvides til å:

1. Gjenkjenne at en mal er sentral (flagg/URL i Maloppsett via `PpPkgType`)
2. Hente `.pppkg` fra hosting-repoet ved provisjonering
3. Pakke ut og provisjonere direkte fra nedlastet pakke (uten å lagre lokalt)
4. Cache pakken i nettleseren i inntil 24 timer (basert på versjon)
5. Håndtere nettverksfeil med tydelig feilmelding til bruker

### 8.2 Visning av malinformasjon

Oppsettveiviseren bør vise:

- Malens navn, beskrivelse og thumbnail
- Type: Lokal / Importert / Sentral (med ikon-indikasjon, ikke teknisk sjargong)
- Versjonsnummer for importerte og sentrale maler

### 8.3 Stempling av prosjektområde

Ved provisjonering stemples prosjektområdet med malpakkeinformasjon (se seksjon 6.2). Dette skjer uavhengig av maltype, men for lokale maler vil pakke-feltene være tomme.

---

## 9. Bygging og publisering

### 9.1 Lokal bygging (fase 1)

Pakkene bygges lokalt med et npm-script, tilsvarende hvordan Prosjektportalen i dag bygger malfiler:

```bash
# Bygg alle pakker
npm run build:packages

# Bygg spesifikk pakke
npm run build:package -- --name standard-prosjektmal
```

Scriptet:
1. Validerer `manifest.json` mot JSON Schema
2. Sjekker at alle refererte filer finnes
3. Kjører evt. linting av sp-js-provisioning JSON
4. Pakker til `.pppkg` (zip med definert struktur)
5. Legger resultatet i `dist/`
6. Oppdaterer `catalog.json` automatisk

### 9.2 PR-validering (tidlig)

En enkel GitHub Action for PR-validering kan legges til tidlig:

1. Valider manifest og refererte filer
2. Sjekk at versjon er bumpet hvis innhold er endret
3. Sjekk at CHANGELOG.md er oppdatert
4. Rapporter status som GitHub Check

### 9.3 Automatisert bygging (senere)

Full CI/CD med automatisk bygging, release-opprettelse og `catalog.json`-oppdatering ved merge til `main`. Vurderes i fase 4.

---

## 10. Sikkerhet og tilgang

- Hosting-repoet er offentlig – alle kan lese malpakker
- Bare maintainers (Puzzlepart) kan publisere nye pakker
- SPFx-komponenten henter kun fra konfigurerbar repo-URL (property på web part/extension)
- Ingen sensitiv informasjon i malpakker (kun strukturdefinisjoner og eksempeldata)
- CORS: GitHub Raw-URL-er er tilgjengelig fra klientside uten spesielle krav
- Vurder signering av pakker (integritet) i fremtidige versjoner

---

## 11. Faseplan

### Fase 1 – Fundament

- Definere og implementere `.pppkg`-format og JSON Schema for manifest
- Definere `termsets.json`-format
- Implementere `provisionTermSets()` som separat funksjon i sp-js-provisioning (Graph API)
- Sette opp mappestruktur i hosting-repoet
- Lage lokale build-script (`build:packages`)
- Publisere `catalog.json` og første malpakke(r)
- Utvide Maloppsett-listen med pakkemetadata-felter

### Fase 2 – SPFx malpakkekatalog

- Implementere SPFx ListView Command Set på Maloppsett
- Bygge wizard-UI: browse, forhåndsvisning og detaljer (visuelt, ikke-teknisk)
- Implementere importert-mal-installasjon (Modus A) inkl. taxonomy-provisjonering
- Tilgangssjekk for Term Store-rettigheter før installasjon
- Versjonshåndtering, oppdateringssjekk og `minPPVersion`-validering
- Visuell indikasjon av maltype (Lokal / Importert / Sentral) i Maloppsett

### Fase 3 – Sentrale maler

- Implementere sentral-mal-kobling (Modus B) i malpakkekatalogen
- Utvide oppsettveiviseren med runtime-henting av pakker fra GitHub
- Caching (24t, versjonsbasert) og feilhåndtering
- Stempling av prosjektområder med malpakkeinformasjon

### Fase 4 – Videreutvikling

- GitHub Actions for automatisert bygging og publisering
- Støtte for lokale tilpasninger oppå sentrale maler (overlay/merge)
- Malpakkeavhengigheter (en pakke kan kreve en annen)
- Signering og integritetssjekk av pakker
- Eventuell støtte for community-malpakker
- Bidragsguide for eksterne bidragsytere

---

## 12. Åpne spørsmål

1. **Begrepsavklaring maltyper:** Er Lokal / Importert / Sentral de riktige navnene? Andre kandidater: "Lokal" → "Egendefinert"? "Sentral" → "Skytilkoblet" / "Oppdatert"?
2. **Granularitet av files.json:** Trenger vi støtte for filoperasjoner utover ren kopiering (f.eks. erstatt-i-eksisterende-fil, eller bare "kopier hvis ikke finnes")?
3. **CDN/proxy for sentrale maler:** Bør vi ha en mellomtjeneste foran GitHub for pålitelighet og ytelse, eller holder raw.githubusercontent.com?
4. **Oppdateringsstrategi for importerte maler:** Bør oppdatering av en importert mal overskrive alt blindt, eller bør det finnes en merge/diff-visning?
5. **Tilgangsstyring for sentrale maler:** Er det scenarioer der man vil begrense hvilke sentrale maler som er tilgjengelige per tenant (f.eks. en premium-katalog)?
6. **Taxonomy-konflikter:** Hva om to malpakker definerer termsett med ulike IDer for samme konsept (f.eks. begge har "Prosjektfaser" men med ulik ID)? Bør vi ha et sentralt register over "kjente" termsett-IDer som pakker skal gjenbruke?
7. **Eksisterende termsett:** Kunder som allerede har Prosjektportalen har termsett med sine IDer. Trenger vi en migreringsmekanisme eller mapping for å koble eksisterende termsett til pakke-IDer?
