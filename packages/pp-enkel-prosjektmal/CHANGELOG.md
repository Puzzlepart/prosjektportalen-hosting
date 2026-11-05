# Endringslogg - Enkel prosjektmal

Alle viktige endringer i denne malpakken dokumenteres i denne filen.

Formatet er basert på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
og denne pakken følger [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-11-05

### Rettet

- **Dokumenter** i venstremenyen til prosjekttilleggene «Enkelt prosjekt» og «Enkel venstremeny» lenker nå til dokumentbiblioteket på adressen det har på norske områder (`Delte dokumenter`). Adressen `Dokumenter` finnes ikke, så når menypunktet måtte legges til (der SharePoints eget menypunkt ikke heter «Dokumenter», for eksempel med engelsk språk), avviste SharePoint det, og oppsettet av prosjektet feilet.
- **Hjem** i «Enkel venstremeny» lenker nå til områdets adresse, som åpner forsiden prosjektet har. `ProjectHome.aspx` finnes ikke når malen er tilgjengeliggjort som skymal.
- **Hjem** i «Enkelt prosjekt» lenker nå alltid til den nye forsiden (`Prosjekt.aspx`). Før beholdt menypunktet adressen det hadde fra før, så menyen lenket ikke til den nye forsiden.

### Endret

- Beskrivelsene av prosjekttilleggene sier at de er alternativer: begge gir samme venstremeny, og «Enkelt prosjekt» gir i tillegg en forenklet prosjektforside.

## [1.0.0] - 2026-06-09

### Lagt til

- Enkel prosjektmal for oppstart av små prosjekter.
- Egen prosjektinnholdstype **«Enkel prosjektmal»** (basert på den innebygde Prosjekt-innholdstypen) på hub-området, knyttet til **Prosjekter**-listen.
- Forenklet prosjektstatus-innholdstype **«Enkel prosjektstatus»** med kjerneindikatorene Samlet status, Tid, Kostnad, Kvalitet og Risiko (med kommentarer), knyttet til **Prosjektstatus**-listen.
- Hub-listen **«Enkel Fasesjekkliste»** med 15 ferdige sjekkpunkter (fasene Idé, Konsept, Planlegge, Gjennomføre, Avslutte og Realisere), seedet via `DataRows`, og listeinnholdskonfigurasjon som kopierer dem til prosjektets **Fasesjekkliste**.
- Prosjektmal (`template.json`) med prosjektsidene **Prosjektstatus**, **Oppgaver** og **Prosjekttidslinje** og listene **Usikkerhet** og **Fasesjekkliste**.
- Prosjekttilleggene **«Enkelt prosjekt»** og **«Enkel venstremeny»**.

> Merk: Malen definerer innholdstyper på hub-området. Prosjektsidene og -listene bruker standard Prosjektportalen-innholdstyper, -kolonner og -webdeler som forventes levert av grunninstallasjonen av Prosjektportalen.
