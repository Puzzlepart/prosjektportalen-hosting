# Spesifikasjon: prosjektportalen.no

> Detaljert spesifikasjon for offentlig forhåndsvisning av malpakker på prosjektportalen.no.
> Se [README.md](README.md) for overordnet spesifikasjon og bakgrunn.

---

## 1. Bakgrunn

prosjektportalen.no er den offentlige nettsiden for Prosjektportalen. For å gi potensielle brukere og eksisterende administratorer en enkel oversikt over tilgjengelige malpakker, legges det til en offentlig katalogvisning som henter data fra `catalog.json` i hosting-repoet.

Denne siden krever **ingen innlogging** – den er tilgjengelig for alle og fungerer som et utstillingsvindu for hva som finnes av maler.

---

## 2. Funksjonalitet

### 2.1 Katalog-oversikt

En side (f.eks. `/malpakker` eller `/templates`) som viser alle tilgjengelige malpakker i et visuelt grid:

- Thumbnail-bilde per pakke
- Navn og kort beskrivelse
- Type-indikator (Mal / Utvidelse / Standardinnhold)
- Versjonsnummer og utgiver
- Tags for filtrering

### 2.2 Detaljvisning per pakke

Klikk på en pakke viser:

- Stort thumbnail / skjermbilder
- Full beskrivelse (fra pakkens README.md)
- Innholdsoversikt ("Dette får du")
- Changelog (siste versjoner)
- Versjon, utgiver, lisens
- Krav (minPPVersion)
- Link til GitHub-kilde

### 2.3 Datakilde

All data hentes fra `catalog.json` via GitHub Raw URL:
```
https://raw.githubusercontent.com/Puzzlepart/prosjektportalen-hosting/main/catalog.json
```

README og changelog per pakke hentes fra:
```
https://raw.githubusercontent.com/Puzzlepart/prosjektportalen-hosting/main/packages/{id}/README.md
https://raw.githubusercontent.com/Puzzlepart/prosjektportalen-hosting/main/packages/{id}/CHANGELOG.md
```

Thumbnails hentes tilsvarende fra pakkenes raw URL.

### 2.4 Caching

- `catalog.json` caches med fornuftig TTL (f.eks. 1 time) for å unngå unødvendige requests
- Statisk side-generering (SSG/ISR) kan brukes for å pre-rendere katalogen ved bygg

---

## 3. Design-retningslinjer

- Visuelt konsistent med resten av prosjektportalen.no
- Fokus på ikke-teknisk fremstilling – skrevet for beslutningstakere og administratorer
- Responsivt design (mobil + desktop)
- Ingen nedlasting eller installasjon fra denne siden – kun forhåndsvisning og informasjon
- Tydelig CTA til dokumentasjon for hvordan man installerer malpakker fra SPFx-katalogen

---

## Oppgaver

### Fase 2–3

- [ ] Opprette ny side/rute for malpakkekatalog (f.eks. `/malpakker`)
- [ ] Implementere henting og parsing av `catalog.json` fra GitHub Raw URL
- [ ] Bygge grid-komponent for pakkeoversikt (thumbnail, navn, beskrivelse, versjon, type)
- [ ] Implementere filtrering på type og tags
- [ ] Bygge detaljvisning per pakke:
  - [ ] Hent og render README.md (markdown → HTML)
  - [ ] Hent og render CHANGELOG.md
  - [ ] Vis innholdsoversikt basert på manifest-data i katalogen
- [ ] Implementere caching-strategi (SSG/ISR eller klient-side cache)
- [ ] Responsivt design for mobil og desktop
- [ ] Legge til navigasjon/lenke fra eksisterende sider til malpakkekatalogen
- [ ] Skrive kort introduksjonstekst som forklarer hva malpakker er og hvordan de tas i bruk
