# Endringslogg - Byggprosjekt

Alle viktige endringer i denne malpakken dokumenteres i denne filen.

Formatet er basert på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
og denne pakken følger [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-09

### Lagt til

- Prosjektmal for byggeprosjekter, basert på bygg- og anleggsmalen i Prosjektportalen 365.
- Taksonomigruppen **Prosjektportalen** med termsettet **Fase (Bygg)** (7 faser med sorteringsrekkefølge og egenskaper). Manglende egendefinerte termegenskaper (`PhaseSubText`/`PhaseDescription`) fylles inn på eksisterende termer ved import (`UpdateExistingTerms`).
- De 15 bygg/anlegg-kolonnene (`GtBA*`) som områdekolonner, og innholdstypene **Prosjekt (ByggAnlegg)** og **Prosjektstatus (ByggAnlegg)**, knyttet til **Prosjekter**- og **Prosjektstatus**-listene.
- Hub-provisjonering av **Prosjektkolonner**, **Prosjektkolonnekonfigurasjon**, **Statusseksjoner** og **Prosjektdata**-binding for bygg/anlegg-feltene.
- Hub-listene **Fasesjekkliste Bygg** (63 sjekkpunkter) og **Planneroppgaver Bygg** (59 oppgaver), seedet via `DataRows`, og listeinnholdskonfigurasjon som kopierer dem til prosjektets **Fasesjekkliste** og **Planneroppgaver**.
- **Standarddokumenter Bygg** – hub-bibliotek med full mappestruktur (48 mapper, via `Folders`), kopieres til prosjektets **Dokumenter** ved prosjektoppsett.

> Merk: Krever sp-js-provisioning med `DataRows`- og `Folders`-støtte og at taksonomi-provisjonering er aktivert. Deler taksonomigruppe, kolonner og innholdstyper med `pp-anleggsprosjekt` (idempotent), så pakkene kan installeres hver for seg eller side om side.
