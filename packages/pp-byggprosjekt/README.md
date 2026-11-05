# Byggprosjekt

Prosjektmal for byggeprosjekter i Prosjektportalen 365, basert på bygg- og
anleggsmalen i Prosjektportalen.

Malen gir byggeprosjekter egne faser, egne felter for prosjektinformasjon og
statusrapport, en egen porteføljevisning, en fasesjekkliste, standardoppgaver i
Planner og en standard mappestruktur for prosjektdokumenter.

| | |
| --- | --- |
| **ID** | `pp-byggprosjekt` |
| **Type** | Prosjektmal |
| **Minimum PP-versjon** | 1.14.0 |
| **Språk** | Norsk (nb-NO) |
| **Tagger** | bygg, anlegg, prosjektledelse |

## Faser

Malen bruker sitt eget fasesett **Fase (Bygg)**:

1. Idé
2. Flere faser
3. Avklare behov
4. Konseptutvikling og bearbeiding
5. Detaljprosjektering
6. Utførelse
7. Overlevering

## Hva som settes opp på hub-området

Når malen kopieres til installasjonen eller tilgjengeliggjøres som skymal, settes
følgende opp på hub-området:

- Fasesettet **Fase (Bygg)** i termgruppen **Prosjektportalen**.
- 14 bygg- og anleggsfelter, blant annet opprinnelig overtakelsesdato, HP-fase,
  siste politiske vedtak, status og kommentar for tilskudd, SHA, miljø og
  plan- og byggesak.
- Innholdstypene **Prosjekt (ByggAnlegg)** og **Prosjektstatus (ByggAnlegg)**, som
  tas i bruk i listene **Prosjekter** og **Prosjektstatus**.
- Feltene registreres som prosjektkolonner og statusseksjoner, slik at de kan vises
  i porteføljen, på prosjektforsiden og i statusrapportene.
- Porteføljevisningen **Byggprosjekter**, som viser byggeprosjektene med
  bygg- og anleggsfeltene som kolonner og filtre.
- Hub-listene **Fasesjekkliste Bygg** (63 sjekkpunkter), **Planneroppgaver Bygg**
  (59 oppgaver) og **Standarddokumenter Bygg** (mappestruktur). Innholdet kan
  tilpasses før nye prosjekter settes opp. Listene kan bare endres av eierne av
  hub-området.
- Malen **Byggprosjekt** i **Maloppsett**, med fasesettet og innholdstypene over.

## Hva som settes opp i prosjektet

Når et prosjekt opprettes med malen, kan følgende listeinnhold velges i
oppsettveiviseren:

- **Fasesjekkliste (bygg)**: sjekkpunktene fra hub-listen fylles inn i prosjektets
  **Fasesjekkliste**.
- **Planneroppgaver (bygg)**: standardoppgavene opprettes i Planner-planen
  **Byggeoppgaver**.
- **Standarddokumenter (bygg)**: mappestrukturen kopieres inn i prosjektets
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
- Malen kan brukes sammen med malen **Anleggsprosjekt**. De to malene deler felter og
  innholdstyper, og kan installeres hver for seg eller side om side.

## Hub-områder som fikk malen før 4. september 2026

Før 4. september 2026 fikk hub-listen **Fasesjekkliste Bygg** kolonnen **Fase** fra
innholdstypen **Sjekkpunkt** i Prosjektportalen, koblet til standardfasene i stedet for
til fasesettet **Fase (Bygg)**. Feilen ble rettet i pakken uten nytt versjonsnummer.
En ny import eller oppdatering av malen kobler ikke om en kolonne som allerede finnes i
listen, så på hub-områder som fikk malen før rettelsen, må kolonnen kobles om for hånd.

Åpne listeinnstillingene for **Fasesjekkliste Bygg** og velg kolonnen **Fase**. Er den
koblet til et annet termsett enn **Fase (Bygg)**, gjør ett av følgende:

- Koble kolonnen til termsettet **Fase (Bygg)** i termgruppen **Prosjektportalen**, og
  lagre. Kontroller deretter fasen på sjekkpunktene i listen.
- Slett kolonnen **Fase** fra listen, og oppdater malen eller kopier den til
  installasjonen på nytt. Kolonnen opprettes da på nytt, koblet til **Fase (Bygg)**.
  Fasen som var satt på elementene i listen, slettes sammen med kolonnen, og
  sjekkpunktene som finnes fra før, får den ikke tilbake fra malen. Den må settes på
  nytt for hånd.
