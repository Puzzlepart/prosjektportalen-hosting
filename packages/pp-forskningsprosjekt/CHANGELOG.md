# Endringslogg - Forskningsprosjekt

Alle viktige endringer i denne malpakken dokumenteres i denne filen.

Formatet er basert på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
og denne pakken følger [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Versjonshistorikken følger kildemodulen
[Puzzlepart/prosjektportalen365-addons → Prosjektmaler/Forskningsmal](https://github.com/Puzzlepart/prosjektportalen365-addons/tree/master/Prosjektmaler/Forskningsmal)
(utviklet av Høgskolen i Innlandet). Denne pakken er en re-implementasjon av modulen for
hosting-katalogens JSON-provisjonering, med norsk og engelsk variant.

## [1.0.1] - 2026-01-07

### Endret

- Diverse rettelser i forskningsmalen (bl.a. taksonomi og NVA/Cristin-kobling).

### Rettet

- Korrigert engelsk visningsnavn for innholdstypen **Prosjekt (Forskning)** («Project (Research)»),
  som i kilden feilaktig var satt til innholdstypegruppens navn.

## [1.0.0] - 2024-12-05

### Lagt til

- Første versjon av forskningsmalen: prosjektmalen **Forskningsprosjekt** med innholdstypen
  **Prosjekt (Forskning)** og forskningsspesifikke kolonner (søknadsstatus, frist, beløp,
  Cristin/NVA-kode, rolle, publikasjonsfelt m.m.).
- **Fasesjekkliste forskning** med fasesjekkpunkter for forskningsprosjekter.
- Taksonomi for **Finansiør**, **Fakultet**, **Institutt** og **Forskergruppe**.
- Tospråklig (norsk og engelsk).
