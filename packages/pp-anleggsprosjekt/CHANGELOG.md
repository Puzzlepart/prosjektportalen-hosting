# Endringslogg - Anleggsprosjekt

Alle viktige endringer i denne malpakken dokumenteres i denne filen.

Formatet er basert på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
og denne pakken følger [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 09/06/2026

### Lagt til

- Termsettet «Fase (Anlegg)» fyller nå inn manglende egendefinerte termegenskaper på eksisterende termer ved import (`UpdateExistingTerms: true`). Egenskaper som `PhaseSubText` og `PhaseDescription` legges til når de mangler – eksisterende verdier overskrives ikke (selv om de avviker fra malen), og termer ble tidligere hoppet helt over. Forutsetter at taksonomi-provisjonering er aktivert.

### Rettet

- Hub-listene «Fasesjekkliste Anlegg» og «Planneroppgaver Anlegg» fjerner ikke lenger eksisterende innholdstyper (`RemoveExistingContentTypes: false`). Tidligere feilet importen mot en hub som allerede hadde disse listene fra en tidligere installasjon, fordi en innholdstype som er i bruk ikke kan fjernes («Innholdstypen er fremdeles i bruk»).

## [1.1.0] - 08/06/2026

### Lagt til

- Hub-provisjonering av bygg/anlegg-oppsettet som tidligere lå i Prosjektportalen-installasjonen:
  - **Prosjektkolonner** – 13 kolonnedefinisjoner for `GtBA*`-feltene (visning i prosjektstatus/forside/portefølje)
  - **Prosjektkolonnekonfigurasjon** – verdioppsett (farge/ikon) for SHA- og Miljø-kolonnene
  - **Statusseksjoner** – statusseksjoner for Tilskudd, SHA, Miljø og Plan-/byggesak
  - **Prosjektdata** (Idémodulen) – knytter innholdstypen **Prosjekt (ByggAnlegg)** til listen

### Endret

- **Standarddokumenter Anlegg** provisjoneres nå som et hub-bibliotek (med full mappestruktur), og mappene kopieres til prosjektets «Dokumenter»-bibliotek via listeinnhold ved prosjektoppsett – tidligere ble biblioteket opprettet direkte i prosjektet. Matcher oppførselen i Prosjektportalen.

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
