# Anleggsprosjekt

Prosjektmal for anleggsprosjekter i Prosjektportalen 365, basert på bygg- og
anleggsmalen i Prosjektportalen.

Malen gir anleggsprosjekter egne faser, egne felter for prosjektinformasjon og
statusrapport, en egen porteføljevisning, en fasesjekkliste, standardoppgaver i
Planner og en standard mappestruktur for prosjektdokumenter.

| | |
| --- | --- |
| **ID** | `pp-anleggsprosjekt` |
| **Type** | Prosjektmal |
| **Minimum PP-versjon** | 1.14.0 |
| **Språk** | Norsk (nb-NO) |
| **Tagger** | anlegg, bygg, prosjektledelse |

## Faser

Malen bruker sitt eget fasesett **Fase (Anlegg)**:

1. Idé
2. Flere faser
3. Initiering
4. Prosjektering og kontrahering
5. Anleggsfase
6. Overtakelse og overlevering
7. Bruks og driftsfase

## Hva som settes opp på hub-området

Når malen kopieres til installasjonen eller tilgjengeliggjøres som skymal, settes
følgende opp på hub-området:

- Fasesettet **Fase (Anlegg)** i termgruppen **Prosjektportalen**.
- 14 bygg- og anleggsfelter, blant annet opprinnelig overtakelsesdato, HP-fase,
  siste politiske vedtak, status og kommentar for tilskudd, SHA, miljø og
  plan- og byggesak.
- Innholdstypene **Prosjekt (ByggAnlegg)** og **Prosjektstatus (ByggAnlegg)**, som
  tas i bruk i listene **Prosjekter** og **Prosjektstatus**.
- Feltene registreres som prosjektkolonner og statusseksjoner, slik at de kan vises
  i porteføljen, på prosjektforsiden og i statusrapportene.
- Porteføljevisningen **Anleggsprosjekter**, som viser anleggsprosjektene med
  bygg- og anleggsfeltene som kolonner og filtre.
- Hub-listene **Fasesjekkliste Anlegg** (45 sjekkpunkter), **Planneroppgaver Anlegg**
  (31 oppgaver) og **Standarddokumenter Anlegg** (mappestruktur). Innholdet kan
  tilpasses før nye prosjekter settes opp. Listene kan bare endres av eierne av
  hub-området.
- Malen **Anleggsprosjekt** i **Maloppsett**, med fasesettet og innholdstypene over.

## Hva som settes opp i prosjektet

Når et prosjekt opprettes med malen, kan følgende listeinnhold velges i
oppsettveiviseren:

- **Fasesjekkliste (anlegg)**: sjekkpunktene fra hub-listen fylles inn i prosjektets
  **Fasesjekkliste**.
- **Planneroppgaver (anlegg)**: standardoppgavene opprettes i Planner-planen
  **Anleggsoppgaver**.
- **Standarddokumenter (anlegg)**: mappestrukturen kopieres inn i prosjektets
  **Dokumenter**, med 8 hovedmapper (Grunnlag, Anskaffelser, Økonomi og fremdrift,
  Korrespondanse, Møter, KS/SHA/Miljø/Risiko, Tegninger og rapporter, FDV) og
  undermapper.

Statusrapportene i prosjektet får egne seksjoner for tilskudd, SHA, miljø og
plan- og byggesak.

## Forutsetninger

- Prosjektportalen 365 versjon 1.14 eller nyere.
- Hub-området må være på norsk (listene heter «Prosjekter», «Prosjektstatus» osv.).
- Malen kan både kopieres til installasjonen og tilgjengeliggjøres som skymal. Som
  skymal settes felter, innholdstyper og faser opp på hub-området, mens
  fasesjekkliste, oppgaver og mappestruktur hentes fra pakken når prosjektet settes opp.
- Malen kan brukes sammen med malen **Byggprosjekt**. De to malene deler felter og
  innholdstyper, og kan installeres hver for seg eller side om side.
