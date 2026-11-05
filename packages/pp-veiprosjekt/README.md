# Veiprosjekt

Prosjektmal for vei- og samferdselsprosjekter i Prosjektportalen 365, basert på
veimodulen til Prosjektportalen. Veimodulen er utviklet av **Rogaland fylkeskommune**
og forvaltes av Crayon Consulting.

Malen gir veiprosjekter egne faser, egne felter for hvem som leder planlegging,
prosjektering og bygging, en egen porteføljevisning, en fasesjekkliste med forankring,
standardoppgaver i Planner, en standard mappestruktur for prosjektdokumenter og
dokumentkolonnene Fag og Emne.

| | |
| --- | --- |
| **ID** | `pp-veiprosjekt` |
| **Type** | Prosjektmal |
| **Versjon** | 1.1.4 |
| **Minimum PP-versjon** | 1.14.0 |
| **Språk** | Norsk (nb-NO) |
| **Tagger** | vei, samferdsel, anlegg, prosjektledelse |

## Faser

Malen bruker sitt eget fasesett **Fase (Vei)**:

1. Planlegge
2. Prosjektere
3. Bygge
4. Avslutte

## Hva som settes opp på hub-området

Når malen kopieres til installasjonen eller tilgjengeliggjøres som skymal, settes
følgende opp på hub-området:

- Fasesettet **Fase (Vei)** og termsettene **Fag (Vei)** (20 fag) og **Emne (Vei)**
  (9 emner) i termgruppen **Prosjektportalen**.
- Veifeltene **Planleggingsleder**, **Prosjekteringsleder**, **Byggeleder** og
  **Forankret i**, og dokumentkolonnene **Fag** og **Emne** koblet til termsettene.
- Innholdstypen **Prosjekt (Vei)**, som tas i bruk i listene **Prosjekter** og
  **Prosjektdata**.
- De tre faseansvarlige registreres som prosjektkolonner, slik at de kan vises og
  filtreres i porteføljen.
- Porteføljevisningen **Veiprosjekter**, som viser veiprosjektene med standardkolonnene
  og de tre faseansvarlige som kolonner og filtre.
- Hub-listene **Fasesjekkliste Vei** (36 sjekkpunkter), **Planneroppgaver Vei**
  (90 oppgaver) og **Standarddokumenter Vei** (mappestruktur med kolonnene Fase, Fag og
  Emne). Innholdet kan tilpasses før nye prosjekter settes opp. Listene kan bare endres
  av eierne av hub-området.
- Prosjekttillegget **Veimal** i listen **Prosjekttillegg**, låst til malen.
- Malen **Veiprosjekt** i **Maloppsett**, med fasesettet og innholdstypen over.

## Hva som settes opp i prosjektet

Prosjekttillegget **Veimal** følger malen og legges alltid på nye veiprosjekter:

- **Fasesjekkliste** får kolonnen **Forankret i**, som vises i visningene
  *Alle elementer*, *Arkivert* og *Etter status*.
- **Dokumenter** får kolonnene **Fase**, **Fag** og **Emne**, som vises i visningen
  *Alle dokumenter*.

I tillegg kan følgende listeinnhold velges i oppsettveiviseren:

- **Fasesjekkpunkter Vei**: sjekkpunktene fra hub-listen, inkludert **Forankret i**,
  fylles inn i prosjektets **Fasesjekkliste**.
- **Planneroppgaver Vei**: de 90 standardoppgavene opprettes i Planner-planen
  **Veiplan**.
- **Standarddokumenter Vei**: mappestrukturen kopieres inn i prosjektets
  **Dokumenter**, med én hovedmappe per fase (Planlegge, Prosjektere, Bygge og
  Avslutte) og undermapper.

## Forutsetninger og begrensninger

- Prosjektportalen 365 versjon 1.14 eller nyere.
- Hub-området må være på norsk (listene heter «Prosjekter», «Prosjektkolonner» osv.).
- Malen kan både kopieres til installasjonen og tilgjengeliggjøres som skymal. Som
  skymal settes felter, innholdstype og termsett opp på hub-området, mens
  fasesjekkliste, oppgaver, mappestruktur og prosjekttillegg hentes fra pakken når
  prosjektet settes opp.
- **Søkekonfigurasjon**: for at Planleggingsleder, Prosjekteringsleder og Byggeleder
  skal vises i porteføljevisningen, må de tre feltene kobles til søkeegenskaper i
  søkeskjemaet. Dette krever rollen SharePoint-administrator og gjøres som et eget steg
  etter installasjonen. Se [`search/`](search/) for veiledning og skript.
- Veiprosjekter bruker standardsidene i Prosjektportalen.

## Hub-områder som fikk malen før 4. september 2026

Før 4. september 2026 ble kolonnen **Fase** i hub-listene **Fasesjekkliste Vei** og
**Standarddokumenter Vei** koblet til standardfasene i Prosjektportalen i stedet for til
fasesettet **Fase (Vei)**. Feilen ble rettet i pakken uten nytt versjonsnummer. En ny
import eller oppdatering av malen kobler ikke om en kolonne som allerede finnes i
listen, så på hub-områder som fikk malen før rettelsen, må kolonnen kobles om for hånd.

Åpne listeinnstillingene for hver av de to listene og velg kolonnen **Fase**. Er den
koblet til et annet termsett enn **Fase (Vei)**, gjør ett av følgende:

- Koble kolonnen til termsettet **Fase (Vei)** i termgruppen **Prosjektportalen**, og
  lagre. Kontroller deretter fasen på sjekkpunktene i **Fasesjekkliste Vei**.
- Slett kolonnen **Fase** fra listen, og oppdater malen eller kopier den til
  installasjonen på nytt. Kolonnen opprettes da på nytt, koblet til **Fase (Vei)**. Fasen
  som var satt på elementene i listen, slettes sammen med kolonnen, og sjekkpunktene
  som finnes fra før, får den ikke tilbake fra malen. Den må settes på nytt for hånd.
