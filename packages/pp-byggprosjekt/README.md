# Byggprosjekt

Prosjektmal for byggeprosjekter i Prosjektportalen 365, basert på den offisielle
bygg- og anleggsmalen (BA) i Prosjektportalen.

Malen provisjonerer fasetaksonomi, bygg/anlegg-kolonner og -innholdstyper på
hub-området, og setter opp prosjektets fasesjekkliste, planneroppgaver og en
standard mappestruktur for prosjektdokumenter.

| | |
| --- | --- |
| **ID** | `pp-byggprosjekt` |
| **Type** | template |
| **Minimum PP-versjon** | 1.14.0 |
| **Tagger** | bygg, anlegg, prosjektledelse |

## Hva «Kopier til min installasjon» gjør

1. Provisjonerer taksonomigruppen **Prosjektportalen** med termsettet **Fase (Bygg)**
   på hub-områdets termlager.
2. Provisjonerer de 14 bygg/anlegg-kolonnene (`GtBA*`) og innholdstypene
   **Prosjekt (ByggAnlegg)** (`0x0100805E9E4FEAAB4F0EABAB2600D30DB70CBA`) og
   **Prosjektstatus (ByggAnlegg)**, og knytter dem til **Prosjekter**- og
   **Prosjektstatus**-listene.
3. Seeder hub-listene **Fasesjekkliste Bygg** (63 sjekkpunkter) og
   **Planneroppgaver Bygg** (59 oppgaver) via `DataRows`.
4. Skriver et Maloppsett-element der `GtProjectContentType` peker på
   **Prosjekt (ByggAnlegg)** og `GtProjectStatusContentType` peker på
   **Prosjektstatus (ByggAnlegg)** – slik at statusrapportene får bygg/anlegg-feltene
   (krever en PortfolioExtensions-versjon med `projectStatusContentTypeId`-støtte).

## Hva som settes opp i prosjektet

- **Fasesjekkliste** fylles fra hub-listen via listeinnhold ved prosjektoppsett.
- **Planneroppgaver** – oppgavene fra hub-listen «Planneroppgaver Bygg» opprettes
  som oppgaver i Planner-planen **«Byggeoppgaver»** (`plannerTitle`, krever
  Prosjektportalen ≥ 1.14) når listeinnholdet velges ved prosjektoppsett.
- **Standarddokumenter Bygg** – hub-bibliotek med den fulle 8-hovedmappers
  mappestrukturen (48 mapper); mappestrukturen kopieres inn i prosjektets
  **Dokumenter** via listeinnhold ved prosjektoppsett.

> Merk: Standarddokumenter-mappestrukturen krever sp-js-provisioning med
> `Folders`-støtte. Malen er skykompatibel (`cloudCompatible: true`): ved
> tilgjengeliggjøring som skymal provisjoneres hub-avhengighetene (kolonner,
> innholdstyper og taksonomi, krever Prosjektportalen ≥ 1.14), mens
> mappestrukturen og listeinnholdet hentes direkte fra pakken ved
> prosjektoppsett. Provisjoneringen forventer en norsk hub (listene heter
> «Prosjekter», «Prosjektstatus» osv.).
>
> Kan installeres uavhengig av `pp-anleggsprosjekt`. Pakkene deler taksonomigruppe,
> kolonner og innholdstyper (idempotent), så begge kan installeres side om side.
