# Endringslogg - Standardmal

Alle viktige endringer i denne malpakken dokumenteres i denne filen.

Formatet er basert på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
og denne pakken følger [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 11/05/2026
- Testet validering av endring i mal

## [1.0.0] - 08/05/2026

### Lagt til
- Første versjon av standardmal basert på Prosjektportalen365 produksjonsimplementasjon
- Hub-template med taxonomy for prosjektfaser (Konsept, Planlegging, Gjennomføring, Avslutning) - bruker reelle produksjons-GUIDs
  - TermSet: abcfc9d9-a263-4abb-8234-be973c46258a
  - Konsept: 99e85650-33de-4af4-b8db-edffbc8a310b
  - Planlegging: cda4f1e1-3488-4e57-8a04-6973df239689
  - Gjennomføring: 99d7765a-c786-4792-a1a1-866ef0f982b9
  - Avslutning: 30e03c52-8c3e-4cfe-9b18-ca71593ce130
- Taxonomy for dokumenttyper (Prosjektdokument, Møtereferat, Rapport, Presentasjon)
  - TermSet: bd0a8dfb-80de-4f9e-b852-2b0db59d6f64
- Taxonomy for ressursroller (Prosjektleder, Prosjekteier, Ressurs)
  - TermSet: 54da9f47-c64e-4a26-80f3-4d3c3fa1b7b2
- Felter med reelle produksjons-IDer:
  - `GtProjectPhase` (325543a5-815d-485d-a9a5-e0773ad762e9)
  - `GtDocumentType` (a245f222-bae0-4753-ab78-4ddf33020ea7)
  - `GtChecklistStatus` (249527a3-c7f9-4ea5-9c33-f942c06c9215)
  - `GtComment` (509a6bfe-004e-41f9-bd73-9a0e02d5c4a7)
  - `GtSortOrder` (0e82c395-9ed9-43f9-871a-208215b18558)
  - `GtRiskProbability` og `GtRiskConsequence` for risikohåndtering
- Innholdstyper med produksjons-IDer:
  - Sjekklisteelement (0x0100486B1F8AEA24486FBA1C1BA9146C360C)
  - Usikkerhet (0x0100A87AE71CBF2643A6BC9D0948BD2EE897)
- Fasesjekkliste med tre views: Alle elementer, Arkiverte, Gjeldende fase
- Standardinnhold med taxonomy-verdier (format: `-1;#Term|TermGuid`)
- 12 sjekkpunkter fordelt på faser med `GtSortOrder` og kommentarer
- Planneroppgaver, Interessenter og Dokumenter-lister
- Valgfritt tillegg: Kvalitetssikring
- Valgfritt tillegg: Risikovurdering (standard valgt)

### Tekniske detaljer
- Støtte for Prosjektportalen 1.10.0+
- Komplett sp-js-provisioning struktur
- Følger Prosjektportalen365 feltnavnkonvensjon med "Gt"-prefiks
- Bruker reelle content type IDer fra produksjon
- Bruker reelle taxonomy term set IDer og term GUIDs fra Prosjektportalen365
- Taxonomy-felter med TermSetId-referanser koblet til produksjons-GUIDs
- Taxonomy-verdier i content bruker format `-1;#TermName|TermGuid` med reelle GUIDs
