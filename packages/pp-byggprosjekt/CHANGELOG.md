# Endringslogg - Byggprosjekt

Alle viktige endringer i denne malpakken dokumenteres i denne filen.

Formatet er basert på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
og denne pakken følger [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 08/06/2026

### Lagt til

- Hub-provisjonering av bygg/anlegg-oppsettet som tidligere lå i Prosjektportalen-installasjonen:
  - **Prosjektkolonner** – 13 kolonnedefinisjoner for `GtBA*`-feltene (visning i prosjektstatus/forside/portefølje)
  - **Prosjektkolonnekonfigurasjon** – verdioppsett (farge/ikon) for SHA- og Miljø-kolonnene
  - **Statusseksjoner** – statusseksjoner for Tilskudd, SHA, Miljø og Plan-/byggesak
  - **Prosjektdata** (Idémodulen) – knytter innholdstypen **Prosjekt (ByggAnlegg)** til listen

### Endret

- **Standarddokumenter Bygg** provisjoneres nå som et hub-bibliotek (med full mappestruktur), og mappene kopieres til prosjektets «Dokumenter»-bibliotek via listeinnhold ved prosjektoppsett – tidligere ble biblioteket opprettet direkte i prosjektet. Matcher oppførselen i Prosjektportalen.

## [2.0.0] - 08/06/2026

### Endret

- Erstattet mock-innholdet med den faktiske bygg- og anleggsmalen fra Prosjektportalen 365.

### Lagt til

- Taksonomigruppen **Prosjektportalen** med termsettet **Fase (Bygg)** (7 faser med sorteringsrekkefølge og egenskaper)
- De 15 bygg/anlegg-kolonnene (`GtBA*`) som områdekolonner på hub-området
- Innholdstypene **Prosjekt (ByggAnlegg)** (`0x0100805E9E4FEAAB4F0EABAB2600D30DB70CBA`) og **Prosjektstatus (ByggAnlegg)**, knyttet til **Prosjekter**- og **Prosjektstatus**-listene
- Hub-listene **Fasesjekkliste Bygg** (63 sjekkpunkter) og **Planneroppgaver Bygg** (59 oppgaver), seedet via `DataRows` (krever sp-js-provisioning ≥ 1.3.10)
- Listeinnholdskonfigurasjon som kopierer sjekkpunkter og oppgaver til prosjektets **Fasesjekkliste** og **Planneroppgaver** under prosjektoppsett
- **Standarddokumenter Bygg** – dokumentbibliotek med full mappestruktur (48 mapper), provisjonert via `Folders` (krever sp-js-provisioning ≥ 1.4.0)

### Fjernet

- Den oppdiktede «Byggfaser»-taksonomien, `GtByggfase`-kolonnen og placeholder-innholdet fra mock-pakken
- Prosjekttillegget «Byggfaser venstremeny» (var placeholder-innhold)

> Merk: `minPPVersion` er satt til `1.12.0` som plassholder for den
> Prosjektportalen-versjonen som først leverer sp-js-provisioning 1.4.0
> (`Folders`-støtte). Juster ved publisering.

## [1.0.0] - 20/05/2026

### Lagt til

- Første (mock-)versjon av byggprosjektmal
- Taksonomi for byggfaser (Skisseprosjekt, Forprosjekt, Detaljprosjekt, Utførelse)
- Fasesjekkliste med 8 sjekkpunkter for prosjektering og utførelse
- Dokumentmaler for entreprise (SHA-plan, byggemøtereferat, sluttrapport)
- Valgfritt tillegg: Byggfaser venstremeny (standard valgt)
