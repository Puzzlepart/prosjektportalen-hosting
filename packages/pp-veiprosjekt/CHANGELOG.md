# Endringslogg - Veiprosjekt

Alle viktige endringer i denne malpakken dokumenteres i denne filen.

Formatet er basert på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
og denne pakken følger [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Veimodulen er utviklet av Rogaland fylkeskommune og forvaltes av Crayon Consulting.

## [1.1.4] - 2026-11-05

### Rettet

- Når malen er tilgjengeliggjort som skymal, legges sjekkpunktene i **Fasesjekkpunkter Vei** ikke lenger til to ganger i prosjektets **Fasesjekkliste** når oppsettet kjøres på nytt (Prosjektportalen 1.14 og nyere). Oppsettet kjenner igjen sjekkpunktene på nøkkelkolonnen malen oppgir. Den var **Unik datanøkkel**, som bare finnes på hub-området, så sjekkpunktene ble aldri kjent igjen. Nå er den **Sorteringsrekkefølge**, som prosjektets **Fasesjekkliste** også har.
- En ny import eller oppdatering av malen tømmer ikke lenger beskrivelsen av listene **Prosjekter**, **Prosjektdata**, **Prosjektkolonner** og **Porteføljevisninger** på hub-området.
- En ny import eller oppdatering beholder formatering som er lagt på kolonnene **Planleggingsleder**, **Prosjekteringsleder** og **Byggeleder**, og beskrivelser som er lagt på **Fag** og **Emne**, på hub-området.
- En ny import eller oppdatering beholder en beskrivelse som er lagt på kolonnen **Fase** i hub-listene **Fasesjekkliste Vei** og **Standarddokumenter Vei**.
- Prosjekttillegget **Veimal** setter ikke lenger beskrivelsen og innholdstypeinnstillingen til biblioteket **Dokumenter**. De styres av prosjektmalen.

Rettelsene av beskrivelser og innstillinger gjelder fra Prosjektportalen 1.15. Eldre versjoner av Prosjektportalen setter fortsatt disse innstillingene tilbake.

> Merk: En ny import eller oppdatering kjenner nå også igjen sjekkpunktene i hub-listen **Fasesjekkliste Vei** på **Sorteringsrekkefølge**. Har dere endret sorteringsrekkefølgen på et av malens sjekkpunkter der, legges sjekkpunktet til på nytt med den opprinnelige verdien.

> Merk: På hub-områder som fikk malen før 4. september 2026, er kolonnen **Fase** i **Fasesjekkliste Vei** og **Standarddokumenter Vei** koblet til standardfasene i stedet for **Fase (Vei)**. En ny import eller oppdatering retter ikke dette. Avsnittet «Hub-områder som fikk malen før 4. september 2026» i README forklarer hvordan kolonnen kobles om.

## [1.1.3] - 2025-11-17

### Endret

- Vedlikeholdsoppdatering uten endringer i malens innhold.

## [1.1.2] - 2024-10-24

### Rettet

- Planleggingsleder, Prosjekteringsleder og Byggeleder vises nå riktig i porteføljevisningene.
- Porteføljevisningen **Veiprosjekter** viser nå riktig prosjekttype.

## [1.1.1] - 2024-06-10

### Rettet

- Rettet feil i oppsettet av veikolonnene i listen **Prosjektkolonner**.

## [1.1.0] - 2024-02-19

### Endret

- Justert innholdet i **Fasesjekkliste Vei** og **Planneroppgaver Vei**.

## [1.0.0] - 2023-12-21

### Lagt til

- Første versjon av veimodulen: prosjektmalen **Veiprosjekt** med egne veifaser Planlegge, Prosjektere, Bygge og Avslutte.
- Innholdstypen **Prosjekt (Vei)** med feltene Planleggingsleder, Prosjekteringsleder og Byggeleder.
- Porteføljevisningen **Veiprosjekter** med de tre faseansvarlige som kolonner og filtre.
- **Fasesjekkliste Vei** med sjekkpunkter per fase og kolonnen **Forankret i**.
- **Planneroppgaver Vei** med standardoppgaver per fase for Planner.
- **Standarddokumenter Vei** med en mappestruktur per fase, og dokumentkolonnene **Fag** og **Emne** med egne termsett.
- Prosjekttillegget **Veimal**, som legger Forankret i på fasesjekklisten og Fase, Fag og Emne på dokumentbiblioteket.
