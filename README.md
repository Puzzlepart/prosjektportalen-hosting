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
│   ├── hub-template.json      # Hub-level: taxonomy, felter, innholdstyper, lister, filer
│   ├── template.json          # Prosjekt-level: provisjonering av nye prosjektområder
│   └── extensions/            # Prosjekttillegg
│       ├── extension-a.json
│       └── extension-b.json
│
├── content/                   # Standardinnhold (listeelementer)
│   ├── phase-checklist.json   # Fasesjekkliste-elementer
│   ├── planner-tasks.json     # Planneroppgaver
│   └── ...
│
└── assets/                    # Filer referert fra hub-template.json og template.json (maler, dokumenter, bilder etc.)
    └── ...
```

### 4.2 `manifest.json`

Manifestet er pakkens sentrale konfigurasjonsfil. Den inneholder all metadata samt innholdskonfigurasjon (inkl. content-mapping), slik at man slipper separate config-filer. Alle hub-level artefakter (taxonomy, felter, innholdstyper, lister, filer) samles i én sp-js-provisioning mal (`hub-template.json`), mens prosjekt-level provisjonering ligger i `template.json`.

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
    "hubTemplate": "provisioning/hub-template.json",
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

  "changelog": "CHANGELOG.md"
}
```

#### Felt: `type`

| Verdi | Beskrivelse |
|---|---|
| `template` | Komplett prosjektmal (provisjoneringsmal + evt. tillegg + innhold) |
| `extension` | Frittstående prosjekttillegg |
| `content` | Frittstående standardinnhold |

### 4.3 `provisioning/hub-template.json`

Hub-templaten samler **alt** som skal provisjoneres på hub-nivå i én sp-js-provisioning-fil: taxonomy (termsett), felter, innholdstyper, lister og filer. Ved å bruke standard sp-js-provisioning-format kan `provisionTemplate()` gjenbrukes direkte – ingen custom provisjoneringslogikk.

Templaten utvider sp-js-provisioning-formatet med en ny `Taxonomy`-seksjon. `provisionTemplate()` håndterer denne internt og kjører den **før** felter, slik at managed metadata-felter kan referere til termsett-IDer fra steg 1.

```json
{
  "Taxonomy": {
    "TermGroup": {
      "Name": "Prosjektportalen",
      "Id": "ab12cd34-ef56-7890-ab12-cd34ef567890"
    },
    "TermSets": [
      {
        "Id": "11111111-2222-3333-4444-555555555555",
        "Name": "Prosjektfaser",
        "Description": "Faser i prosjektets livssyklus",
        "IsOpenForTermCreation": false,
        "Terms": [
          {
            "Id": "aaaa1111-bbbb-cccc-dddd-eeee11111111",
            "Name": "Konsept",
            "SortOrder": 0,
            "CustomProperties": { "PpPhaseLevel": "1" }
          },
          {
            "Id": "aaaa1111-bbbb-cccc-dddd-eeee22222222",
            "Name": "Planlegge",
            "SortOrder": 1,
            "CustomProperties": { "PpPhaseLevel": "2" }
          },
          {
            "Id": "aaaa1111-bbbb-cccc-dddd-eeee33333333",
            "Name": "Gjennomføre",
            "SortOrder": 2,
            "CustomProperties": { "PpPhaseLevel": "3" },
            "Terms": [
              {
                "Id": "aaaa1111-bbbb-cccc-dddd-ffff11111111",
                "Name": "Gjennomføre - Delfase 1",
                "SortOrder": 0
              }
            ]
          },
          {
            "Id": "aaaa1111-bbbb-cccc-dddd-eeee44444444",
            "Name": "Avslutte",
            "SortOrder": 3,
            "CustomProperties": { "PpPhaseLevel": "4" }
          }
        ]
      },
      {
        "Id": "22222222-3333-4444-5555-666666666666",
        "Name": "Prosjekttype",
        "Description": "Klassifisering av prosjekttyper",
        "IsOpenForTermCreation": true,
        "Terms": [
          {
            "Id": "bbbb1111-cccc-dddd-eeee-ffff11111111",
            "Name": "Internt prosjekt",
            "SortOrder": 0
          },
          {
            "Id": "bbbb1111-cccc-dddd-eeee-ffff22222222",
            "Name": "Kundeprosjekt",
            "SortOrder": 1
          }
        ]
      }
    ]
  },
  "SiteFields": [
    "... (egendefinerte felter – managed metadata-felter refererer til termsett-IDer over)"
  ],
  "ContentTypes": [
    "... (innholdstyper som bruker feltene)"
  ],
  "Lists": [
    "... (lister som skal opprettes på hub)"
  ],
  "Files": [
    {
      "Src": "assets/prosjektrapport-mal.docx",
      "Dest": "Malfiler/prosjektrapport-mal.docx"
    },
    {
      "Src": "assets/logo-placeholder.png",
      "Dest": "SiteAssets/logo-placeholder.png"
    }
  ]
}
```

#### Designvalg for termsett-IDer

Alle termsett og termer har forhåndsdefinerte IDer i pakken. Dette sikrer:

- **Feltkobling:** Managed metadata-felter i `SiteFields` kan referere til `TermSetId` direkte. Feltene fungerer umiddelbart etter provisjonering.
- **Kryssreferanser:** Standardinnhold (f.eks. fasesjekkliste-elementer) kan referere til termer via ID.
- **Idempotens:** Ved re-installasjon eller oppdatering kan eksisterende termsett gjenkjennes og oppdateres i stedet for dupliseres.
- **Konsistens på tvers av tenanter:** Alle installasjoner av samme malpakke bruker identiske IDer, noe som forenkler support og dokumentasjon.

### 4.4 Utvidelse av sp-js-provisioning – Taxonomy-handler

sp-js-provisioning utvides med en intern **Taxonomy-handler** som provisjonerer termsett via Microsoft Graph API. Handleren aktiveres automatisk når en template inneholder en `Taxonomy`-seksjon, og kjøres som første steg – før `SiteFields` – slik at managed metadata-felter kan referere til termsett-IDer som nettopp er opprettet.

#### API-design

```typescript
import { provisionTemplate } from 'sp-js-provisioning';

// Hub-provisjonering: taxonomy + felter + innholdstyper + lister + filer
await provisionTemplate(hubContext, hubTemplateJson, {
  graphClient: msGraphClient,   // MSGraphClientV3 – påkrevd når Taxonomy-seksjon finnes
  onProgress: (message) => {
    console.log(message);
  }
});

// Prosjekt-provisjonering: felter + innholdstyper + lister + filer
await provisionTemplate(projectContext, projectTemplateJson);
```

Samme `provisionTemplate()`-funksjon brukes for både hub og prosjekt. Forskjellen er kun kontekst (hub-site vs prosjektområde) og at hub-templaten typisk har en `Taxonomy`-seksjon.

#### Options-utvidelse

```typescript
interface ProvisionOptions {
  graphClient?: MSGraphClientV3;  // Påkrevd hvis template har Taxonomy-seksjon
  onProgress?: (message: string) => void;
}
```

Dersom `Taxonomy`-seksjon finnes i templaten men `graphClient` ikke er satt, kastes en tydelig feil.

#### Underliggende API: Microsoft Graph Taxonomy

Handleren bruker Graph Taxonomy API:

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

#### Intern flyt i Taxonomy-handleren

```
provisionTemplate(context, template, { graphClient })
│
├─ 0. Har template Taxonomy-seksjon?
│     Ja → kjør Taxonomy-handler (nedenfor)
│     Nei → hopp til SiteFields som vanlig
│
├─ 1. Hent term store for site
│     GET /sites/{siteId}/termStore
│
├─ 2. Finn eller opprett termgruppe
│     GET  .../termStore/groups → finn by name+id
│     POST .../termStore/groups → opprett hvis ikke finnes
│
├─ 3. For hvert termsett i definisjonen:
│     ├─ 3a. Sjekk om termsett finnes (by ID)
│     ├─ 3b. Opprett hvis ikke finnes
│     ├─ 3c. Oppdater hvis finnes og navn/beskrivelse er endret
│     └─ 3d. Synkroniser termer (rekursivt for hierarki)
│             ├─ Finnes med riktig ID? → Oppdater hvis endret
│             ├─ Finnes ikke? → Opprett med definert ID
│             └─ Finnes lokalt men ikke i pakken → Behold
│
├─ 4. SiteFields (standard sp-js-provisioning)
├─ 5. ContentTypes
├─ 6. Lists
└─ 7. Files
```

#### Feilhåndtering

| Feil | Håndtering |
|---|---|
| Manglende `TermStore.ReadWrite.All` | Avbryt med tydelig melding: "Du trenger Term Store-tillatelser. Kontakt din IT-administrator." |
| Bruker er ikke Term Store Admin | Avbryt med melding om manglende rettigheter |
| Term store finnes ikke på site | Avbryt med forklaring |
| `Taxonomy`-seksjon uten `graphClient` | Kast feil: "graphClient er påkrevd for taxonomy-provisjonering" |
| Rate limiting (429) | Retry med eksponentiell backoff (maks 3 forsøk) |
| Nettverksfeil | Retry én gang, deretter avbryt med feilmelding |
| Termsett-ID-konflikt (annen termgruppe) | Logg advarsel, forsøk å bruke eksisterende |

#### Logging og fremdrift

Handleren rapporterer fremdrift via `onProgress`-callback:

```
📋 Oppretter termgruppe "Prosjektportalen"...
📋 Termsett "Prosjektfaser" – oppretter 4 termer...
📋 Termsett "Prosjekttype" – finnes allerede, oppdaterer 1 term...
✅ Taxonomy-provisjonering fullført (2 termsett, 6 termer)
📋 Provisjonerer felter...
📋 Provisjonerer innholdstyper...
...
```

### 4.5 Provisjoneringsrekkefølge

Den fullstendige provisjoneringssekvensen ved malpakkeinstallasjon:

```
┌─ provisionTemplate(hubContext, hubTemplate) ───────────────┐
│  1. Taxonomy     → Opprett termgruppe og termsett           │
│                    (med faste IDer, via Graph API)           │
│  2. Fields       → Opprett site columns                     │
│                    (managed metadata-felter refererer        │
│                     til termsett-IDer fra steg 1)            │
│  3. ContentTypes → Opprett innholdstyper                    │
│  4. Lists        → Opprett lister med innholdstyper         │
│  5. Files        → Kopier filer til hub                     │
└─────────────────────────────────────────────────────────────┘
         ↓  Fullført uten feil
┌─ provisionTemplate(projectContext, template) ──────────────┐
│  6. Fields       → Opprett prosjekt-spesifikke felter       │
│  7. ContentTypes → Opprett innholdstyper                    │
│  8. Lists        → Opprett lister                           │
│  9. Content      → Kopier standardinnhold til lister        │
└─────────────────────────────────────────────────────────────┘
         ↓  Fullført uten feil
┌─ Pakkeinstallasjon (SPFx) ─────────────────────────────────┐
│  10. Extensions  → Kjør evt. prosjekttillegg                │
│  11. Metadata    → Oppdater Maloppsett + stemple område     │
└─────────────────────────────────────────────────────────────┘
```

Samme `provisionTemplate()`-funksjon brukes for både hub og prosjekt. Taxonomy-handleren aktiveres kun når template inneholder en `Taxonomy`-seksjon (typisk bare hub-template). Ansvaret for å kalle hub først og deretter prosjekt ligger hos SPFx-komponenten, som gir full kontroll over feilhåndtering mellom stegene.

### 4.6 Idempotens og oppdatering av termsett

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

### 4.7 Tillatelser

Taxonomy-provisjonering krever at brukeren som installerer malpakken har tilstrekkelige rettigheter:

- **Term Store Administrator** – kan opprette termgrupper og termsett
- **Term Group Contributor** – kan opprette termsett og termer innenfor en eksisterende gruppe

SPFx-komponenten bør sjekke tilgangsnivå før taxonomy-provisjonering starter, og gi en tydelig feilmelding dersom brukeren mangler rettigheter.

### 4.8 Bygging av .pppkg

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
│   │   ├── provisioning/     # hub-template.json + template.json + extensions/
│   │   ├── content/
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
   a. **`provisionTemplate(hubContext, hubTemplate, { graphClient })`** → Taxonomy, felter, innholdstyper, lister og filer provisjoneres på hub (sp-js-provisioning med Taxonomy-handler)
   b. **`provisionTemplate(projectContext, template)`** → Prosjekt-level provisjonering
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
- Utvide sp-js-provisioning med Taxonomy-handler (Graph API, intern i `provisionTemplate()`)
- Sette opp mappestruktur i hosting-repoet
- Lage lokale build-script (`build:packages`)
- Publisere `catalog.json` og første malpakke(r) med `hub-template.json` og `template.json`
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
