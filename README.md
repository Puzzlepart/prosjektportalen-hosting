# Prosjektportalen – Sentral hosting av malpakker

> **Om:** Spesifikasjon for sentral hosting av malpakker i Prosjektportalen
> **Status:** Utkast v6
> **Sist oppdatert:** 2026-04-10
> **Repo:** [prosjektportalen-hosting](https://github.com/Puzzlepart/prosjektportalen-hosting)

Dette dokumentet er den felles innledningen og overordnede spesifikasjonen. Detaljerte oppgaver og teknisk spesifikasjon per repo/system finnes i egne dokumenter:

| Dokument | Repo / system | Beskrivelse |
|---|---|---|
| [spec-hosting.md](spec-hosting.md) | `prosjektportalen-hosting` | Repostruktur, katalog, build-script, JSON Schema, CI |
| [spec-pp365.md](spec-pp365.md) | `prosjektportalen365` | SPFx-komponenter (katalog-UI, veiviser), Maloppsett-utvidelser, stempling |
| [spec-provisioning.md](spec-provisioning.md) | `sp-js-provisioning` | Taxonomy-handler, provisjoneringssekvens, idempotens, tillatelser |
| [spec-web.md](spec-web.md) | `prosjektportalen.no` | Offentlig forhåndsvisning av tilgjengelige malpakker |

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
├── thumbnail.png              # Forhåndsvisningsbilde (16:9, min 600x338px)
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
└── assets/                    # Filer referert fra hub-template.json og template.json
    └── ...
```

### 4.2 `manifest.json`

Manifestet er pakkens sentrale konfigurasjonsfil. Den inneholder all metadata samt innholdskonfigurasjon (inkl. content-mapping), slik at man slipper separate config-filer. Alle hub-level artefakter (taxonomy, felter, innholdstyper, lister, filer) samles i en sp-js-provisioning mal (`hub-template.json`), mens prosjekt-level provisjonering ligger i `template.json`.

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

Hub-templaten samler **alt** som skal provisjoneres på hub-nivå i en sp-js-provisioning-fil: taxonomy (termsett), felter, innholdstyper, lister og filer. Ved å bruke standard sp-js-provisioning-format kan `provisionTemplate()` gjenbrukes direkte.

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
          }
        ]
      }
    ]
  },
  "SiteFields": ["..."],
  "ContentTypes": ["..."],
  "Lists": ["..."],
  "Files": [
    {
      "Src": "assets/prosjektrapport-mal.docx",
      "Dest": "Malfiler/prosjektrapport-mal.docx"
    }
  ]
}
```

#### Designvalg for termsett-IDer

Alle termsett og termer har forhåndsdefinerte IDer i pakken. Dette sikrer:

- **Feltkobling:** Managed metadata-felter i `SiteFields` kan referere til `TermSetId` direkte
- **Kryssreferanser:** Standardinnhold kan referere til termer via ID
- **Idempotens:** Ved re-installasjon kan eksisterende termsett gjenkjennes og oppdateres
- **Konsistens på tvers av tenanter:** Identiske IDer forenkler support og dokumentasjon

---

## 5. Sikkerhet og tilgang

- Hosting-repoet er offentlig – alle kan lese malpakker
- Bare maintainers (Puzzlepart) kan publisere nye pakker
- SPFx-komponenten henter kun fra konfigurerbar repo-URL (property på web part/extension)
- Ingen sensitiv informasjon i malpakker (kun strukturdefinisjoner og eksempeldata)
- CORS: GitHub Raw-URL-er er tilgjengelig fra klientside uten spesielle krav
- Vurder signering av pakker (integritet) i fremtidige versjoner

---

## 6. Faseplan

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

## 7. Beslutninger og avklaringer

| # | Spørsmål | Beslutning |
|---|---|---|
| 1 | **Begrepsavklaring maltyper** – Er Lokal / Importert / Sentral de riktige navnene? | Ja, navnene beholdes som de er. |
| 2 | **Granularitet av files.json** – Trenger vi mer enn ren kopiering? | Hold det enkelt – kun kopiering, men med `overwrite`-flagg (`true`/`false`) per fil. |
| 3 | **CDN/proxy for sentrale maler** – Mellomtjeneste foran GitHub? | Nei, gå direkte mot raw.githubusercontent.com. |
| 4 | **Oppdateringsstrategi for importerte maler** – Overskriv alt eller merge/diff? | Overskriv alt ved oppdatering. |
| 5 | **Tilgangsstyring for sentrale maler** – Begrense per tenant? | Ikke aktuelt per nå. |
| 6 | **Taxonomy-konflikter** – Hva om to pakker definerer samme termsett ulikt? | Lukes ut i byggeprosessen. Flere maler kan peke på samme termsett, men en pakke kan ikke definere samme ID for ulike navn eller omvendt. |
| 7 | **Eksisterende termsett** – Migreringsmekanisme for eksisterende kunder? | Ikke nødvendig – vi har kontroll på alle termsett og IDer. Ved import sjekkes om termsettet allerede finnes; hvis ja, hoppes det over. |
