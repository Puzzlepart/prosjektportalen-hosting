# Spesifikasjon: prosjektportalen-hosting

> Detaljert spesifikasjon for endringer i [prosjektportalen-hosting](https://github.com/Puzzlepart/prosjektportalen-hosting).
> Se [README.md](README.md) for overordnet spesifikasjon og bakgrunn.

---

## 1. Repostruktur

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
        └── validate-pr.yml    # Validering ved PR
```

---

## 2. `catalog.json`

Sentral indeksfil som lister alle tilgjengelige malpakker med metadata. Genereres automatisk av build-scriptet, men kan også vedlikeholdes manuelt.

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

## 3. JSON Schema

To skjemaer skal defineres:

### 3.1 `pppkg-manifest.schema.json`

Validerer `manifest.json` i hver malpakke. Skal dekke:
- Påkrevde felter: `id`, `name`, `version`, `type`, `author`
- Valgfrie felter: `description`, `license`, `minPPVersion`, `thumbnail`, `tags`, `changelog`
- `provisioning`-blokk med `hubTemplate`, `template`, `extensions[]`
- `content`-blokk med `items[]` (sourceFile, targetList, optional, defaultSelected)
- `type` enum: `template`, `extension`, `content`
- Semver-format for `version`

### 3.2 `catalog.schema.json`

Validerer `catalog.json`. Skal dekke:
- `lastUpdated` (ISO 8601 datetime)
- `packages[]` med felter som speiler manifest-metadata pluss `downloadUrl`, `thumbnail` (URL), `publishedDate`, `changelogUrl`

---

## 4. Build-script

### 4.1 Lokal bygging (fase 1)

```bash
# Bygg alle pakker
npm run build:packages

# Bygg spesifikk pakke
npm run build:package -- --name standard-prosjektmal
```

Scriptet (`scripts/build-packages.js`) gjør følgende:

1. Validerer `manifest.json` mot JSON Schema
2. Sjekker at alle refererte filer finnes (provisioning, content, assets, thumbnail)
3. Kjører evt. linting av sp-js-provisioning JSON
4. Pakker til `.pppkg` (zip med definert struktur)
5. Legger resultatet i `dist/`
6. Oppdaterer `catalog.json` automatisk

### 4.2 Validerings-script

`scripts/validate-manifest.js` – frittstående validering som kan brukes i CI:
- Validerer manifest mot schema
- Sjekker filreferanser
- Sjekker at versjon er bumpet hvis innhold er endret (sammenlignet med forrige commit)
- Sjekker at CHANGELOG.md er oppdatert ved versjonsendring

---

## 5. CI/CD

### 5.1 PR-validering (fase 1–2)

GitHub Action (`validate-pr.yml`) som kjører ved PR:

1. Valider manifest og refererte filer for alle endrede pakker
2. Sjekk at versjon er bumpet hvis innhold er endret
3. Sjekk at CHANGELOG.md er oppdatert
4. Rapporter status som GitHub Check

### 5.2 Automatisert bygging og publisering (fase 4)

Full CI/CD ved merge til `main`:

1. Bygg alle endrede pakker
2. Opprett GitHub Release med `.pppkg`-filer som assets
3. Oppdater `catalog.json` automatisk
4. Commit oppdatert `catalog.json` tilbake til `main`

---

## Oppgaver

### Fase 1

- [ ] Opprette mappestruktur (`packages/`, `dist/`, `schema/`, `scripts/`)
- [ ] Skrive `pppkg-manifest.schema.json`
- [ ] Skrive `catalog.schema.json`
- [ ] Implementere `scripts/build-packages.js` (validering + zip + catalog-oppdatering)
- [ ] Implementere `scripts/validate-manifest.js` (frittstående validering)
- [ ] Sette opp `package.json` med `build:packages` og `build:package` scripts
- [ ] Opprette første malpakke under `packages/` (f.eks. `standard-prosjektmal`)
- [ ] Generere initial `catalog.json`
- [ ] Opprette `.github/workflows/validate-pr.yml` for PR-validering

### Fase 4

- [ ] Utvide CI med automatisert bygging ved merge til `main`
- [ ] Automatisk GitHub Release-opprettelse med `.pppkg`-assets
- [ ] Automatisk `catalog.json`-oppdatering og commit
- [ ] Bygge-steg som sjekker taxonomy-konflikter på tvers av pakker (samme ID → ulike navn)
