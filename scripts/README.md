# Byggscript

Denne mappen inneholder bygg- og valideringscript for Prosjektportalen malpakker.

## build-packages.js

Bygger malpakker (.pppkg-filer) fra kildekode i `packages/`-mappen.

### Funksjoner

- **Validerer manifest.json** mot JSON Schema
- **Sjekker filreferanser** - sikrer at alle refererte filer finnes
- **Oppretter .pppkg-filer** - ZIP-arkiver med pakkeinnhold
- **Oppdaterer catalog.json** - vedlikeholder automatisk pakkekatalogen

### Bruk

```bash
# Bygg alle pakker
npm run build:packages

# Bygg en spesifikk pakke
npm run build:package -- --name=standard-prosjektmal
```

### Hva scriptet gjør

1. Laster og validerer `manifest.json` mot skjemaet
2. Verifiserer at alle refererte filer finnes (provisioning, content, assets, thumbnail)
3. Oppretter en komprimert ZIP-fil (`.pppkg`) i `dist/`-mappen
4. Oppdaterer `catalog.json` med pakkemetadata og nedlastnings-URLer

### Output

Bygde pakker plasseres i `dist/` med følgende navneformat:
```
{pakkenavn}-{versjon}.pppkg
```

For eksempel: `standard-prosjektmal-1.2.0.pppkg`

## validate-manifest.js

_(Kommer snart)_

Frittstående valideringscript for bruk i CI/CD-pipelines.

## generate-placeholder-thumbnails.js

Genererer enkle plassholder-thumbnails (16:9, 640×360 PNG) for hver pakke under
`packages/`. Bruker kun Node sin innebygde `zlib` (ingen avhengigheter) og lager
et deterministisk to-tone «kort»-bilde basert på pakkenavnet, slik at hver mal får
et eget gjenkjennbart bilde å starte med.

```bash
# Generer thumbnails for alle pakker (hopper over ekte bilder som allerede finnes)
npm run generate:thumbnails

# Overskriv eksisterende
node scripts/generate-placeholder-thumbnails.js --force

# Kun én pakke
node scripts/generate-placeholder-thumbnails.js --name=pp-byggprosjekt
```

> Bildene er plassholdere. Erstatt `thumbnail.png` med ekte grafikk før en pakke
> publiseres for produksjon.
