# Endringslogg - Anleggsprosjekt

Alle viktige endringer i denne malpakken dokumenteres i denne filen.

Formatet er basert på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
og denne pakken følger [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 08/06/2026

### Lagt til

- Første versjon av anleggsprosjektmal, basert på bygg- og anleggsmalen i Prosjektportalen 365
- Taksonomigruppen **Prosjektportalen** med termsettet **Fase (Anlegg)** (7 faser med sorteringsrekkefølge og egenskaper)
- De 15 bygg/anlegg-kolonnene (`GtBA*`) som områdekolonner på hub-området
- Innholdstypene **Prosjekt (ByggAnlegg)** (`0x0100805E9E4FEAAB4F0EABAB2600D30DB70CBA`) og **Prosjektstatus (ByggAnlegg)**, knyttet til **Prosjekter**- og **Prosjektstatus**-listene
- Hub-listene **Fasesjekkliste Anlegg** (45 sjekkpunkter) og **Planneroppgaver Anlegg** (31 oppgaver), seedet via `DataRows` (krever sp-js-provisioning ≥ 1.3.10)
- Listeinnholdskonfigurasjon som kopierer sjekkpunkter og oppgaver til prosjektets **Fasesjekkliste** og **Planneroppgaver** under prosjektoppsett
- **Standarddokumenter Anlegg** – dokumentbibliotek med full mappestruktur (48 mapper), provisjonert via `Folders` (krever sp-js-provisioning ≥ 1.4.0)

> Merk: `minPPVersion` er satt til `1.12.0` som plassholder for den
> Prosjektportalen-versjonen som først leverer sp-js-provisioning 1.4.0
> (`Folders`-støtte). Juster ved publisering. Deler taksonomigruppe, kolonner og
> innholdstyper med `pp-byggprosjekt` (idempotent), så pakkene kan installeres
> hver for seg eller side om side.
