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
