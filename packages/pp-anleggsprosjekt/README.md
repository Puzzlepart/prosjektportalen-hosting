# Anleggsprosjekt

Prosjektmal for anleggsprosjekter i Prosjektportalen 365, basert på den offisielle
bygg- og anleggsmalen (BA) i Prosjektportalen.

Malen provisjonerer fasetaksonomi, bygg/anlegg-kolonner og -innholdstyper på
hub-området, og setter opp prosjektets fasesjekkliste, planneroppgaver og en
standard mappestruktur for prosjektdokumenter.

| | |
| --- | --- |
| **ID** | `pp-anleggsprosjekt` |
| **Type** | template |
| **Minimum PP-versjon** | 1.12.0 |
| **Tagger** | anlegg, bygg, prosjektledelse |

## Hva «Kopier til min installasjon» gjør

1. Provisjonerer taksonomigruppen **Prosjektportalen** med termsettet **Fase (Anlegg)**
   på hub-områdets termlager.
2. Provisjonerer de 15 bygg/anlegg-kolonnene (`GtBA*`) og innholdstypene
   **Prosjekt (ByggAnlegg)** (`0x0100805E9E4FEAAB4F0EABAB2600D30DB70CBA`) og
   **Prosjektstatus (ByggAnlegg)**, og knytter dem til **Prosjekter**- og
   **Prosjektstatus**-listene.
3. Seeder hub-listene **Fasesjekkliste Anlegg** (45 sjekkpunkter) og
   **Planneroppgaver Anlegg** (31 oppgaver) via `DataRows`.
4. Skriver et Maloppsett-element der `GtProjectContentType` peker på
   **Prosjekt (ByggAnlegg)**.

## Hva som settes opp i prosjektet

- **Fasesjekkliste** og **Planneroppgaver** fylles fra hub-listene via listeinnhold
  ved prosjektoppsett.
- **Standarddokumenter Anlegg** – et dokumentbibliotek med den fulle
  8-hovedmappers mappestrukturen (48 mapper) provisjoneres direkte i prosjektet.

> Merk: Standarddokumenter-mappestrukturen krever sp-js-provisioning ≥ 1.4.0
> (`Folders`-støtte). Malen definerer innholdstyper på hub-området og er derfor
> ikke en ren skymal (`cloudCompatible: false`). Provisjoneringen forventer en
> norsk hub (listene heter «Prosjekter», «Prosjektstatus» osv.).
>
> Kan installeres uavhengig av `pp-byggprosjekt`. Pakkene deler taksonomigruppe,
> kolonner og innholdstyper (idempotent), så begge kan installeres side om side.
