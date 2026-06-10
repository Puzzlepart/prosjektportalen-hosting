# Endringslogg - Veiprosjekt

Alle viktige endringer i denne malpakken dokumenteres i denne filen.

Formatet er basert på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
og denne pakken følger [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Versjonshistorikken følger kildemodulen [Puzzlepart/pp365-veimodul](https://github.com/Puzzlepart/pp365-veimodul)
(utviklet av Rogaland fylkeskommune). Denne pakken er en re-implementasjon av modulen for
hosting-katalogens JSON-provisjonering.

## [1.1.3] - 2025-11-17

### Endret

- Oppdatert for PnP PowerShell 3.1.0 (samme versjon som følger med Prosjektportalen).
- Bedre håndtering av releaseversjon og pakkenavn.

## [1.1.2] - 2024-10-24

### Rettet

- Riktig managed property for brukerfeltene (Planleggingsleder, Prosjekteringsleder, Byggeleder).
- Rettet feil innholdstype i porteføljevisningen «Veiprosjekter».
- Oppdatert installasjonsskript etter endringer i PnP.

## [1.1.1] - 2024-06-10

### Rettet

- Rettet feil knyttet til listen «Prosjektkolonner».

## [1.1.0] - 2024-02-19

### Endret

- Justeringer av listene, herunder **Fasesjekkliste Vei** og **Planneroppgaver Vei**.

## [1.0.0] - 2023-12-21

### Lagt til

- Første versjon av veimodulen: prosjektmalen **Veiprosjekt** med egne veifaser
  (Planlegge, Prosjektere, Bygge, Avslutte).
- Innholdstypen **Prosjekt (Vei)** med egne prosjektegenskaper for faseansvar
  (Planleggingsleder, Prosjekteringsleder, Byggeleder).
- **Fasesjekkliste Vei** med fasesjekkpunkter og kolonnen «Forankret i», og
  **Planneroppgaver Vei** med standardoppgaver per fase.
- Dokumentbiblioteket **Standarddokumenter Vei** med en firefaset mappestruktur, og
  taksonomi for **Fag (Vei)** og **Emne (Vei)**.
