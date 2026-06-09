# Endringslogg - Enkel prosjektmal

Alle viktige endringer i denne malpakken dokumenteres i denne filen.

Formatet er basert på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
og denne pakken følger [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-09

### Lagt til

- Enkel prosjektmal for oppstart av små prosjekter.
- Egen prosjektinnholdstype **«Enkel prosjektmal»** (basert på den innebygde Prosjekt-innholdstypen) på hub-området, knyttet til **Prosjekter**-listen.
- Forenklet prosjektstatus-innholdstype **«Enkel prosjektstatus»** med kjerneindikatorene Samlet status, Tid, Kostnad, Kvalitet og Risiko (med kommentarer), knyttet til **Prosjektstatus**-listen.
- Hub-listen **«Enkel Fasesjekkliste»** med 15 ferdige sjekkpunkter (fasene Idé, Konsept, Planlegge, Gjennomføre, Avslutte og Realisere), seedet via `DataRows`, og listeinnholdskonfigurasjon som kopierer dem til prosjektets **Fasesjekkliste**.
- Prosjektmal (`template.json`) med prosjektsidene **Prosjektstatus**, **Oppgaver** og **Prosjekttidslinje** og listene **Usikkerhet** og **Fasesjekkliste**.
- Prosjekttilleggene **«Enkelt prosjekt»** og **«Enkel venstremeny»**.

> Merk: Malen definerer innholdstyper på hub-området. Prosjektsidene og -listene bruker standard Prosjektportalen-innholdstyper, -kolonner og -webdeler som forventes levert av grunninstallasjonen av Prosjektportalen.
