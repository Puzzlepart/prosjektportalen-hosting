# Veiprosjekt

Prosjektmal for veg- og samferdselsprosjekter i Prosjektportalen 365, basert på
**veimodulen** ([Puzzlepart/pp365-veimodul](https://github.com/Puzzlepart/pp365-veimodul)).
Veimodulen er utviklet av **Rogaland fylkeskommune**, og ekstrahert som delbar mal av
**Puzzlepart – nå Crayon Consulting**. Denne pakken er en re-implementasjon av modulen
for hosting-katalogens JSON-provisjonering.

Malen provisjonerer egne veifaser, **Prosjekt (Vei)**-innholdstype og -kolonner på
hub-området, prosjekttillegget **Veimal**, og setter opp prosjektets fasesjekkliste,
Planner-plan og en standard mappestruktur for prosjektdokumenter.

| | |
| --- | --- |
| **ID** | `pp-veiprosjekt` |
| **Type** | template |
| **Versjon** | 1.1.3 (følger kildemodulen) |
| **Minimum PP-versjon** | 1.14.0 |
| **Tagger** | vei, samferdsel, anlegg, prosjektledelse |
| **Språk** | Norsk (nb-NO) |

## Hva «Kopier til min installasjon» gjør

1. Provisjonerer taksonomigruppen **Prosjektportalen** med termsettene **Fase (Vei)**
   (Planlegge, Prosjektere, Bygge, Avslutte), **Fag (Vei)** og **Emne (Vei)** på
   hub-områdets termlager.
2. Provisjonerer veikolonnene (Forankret i, Planleggingsleder, Prosjekteringsleder,
   Byggeleder, Unik datanøkkel) og taksonomikolonnene **Fag** og **Emne** (bundet til
   termsettene Fag (Vei) og Emne (Vei)), samt innholdstypen **Prosjekt (Vei)**
   (`0x0100805E9E4FEAAB4F0EABAB2600D30DB70C0E`), og knytter den til **Prosjekter**- og
   **Prosjektdata**-listene.
3. Seeder hub-listene **Fasesjekkliste Vei** (36 sjekkpunkter; listen får også kolonnene
   Status og Kommentar slik at radene kan skrives) og **Planneroppgaver Vei** (90 oppgaver) via
   `DataRows`, og dokumentbiblioteket **Standarddokumenter Vei** (kolonnene Fase, Fag og Emne)
   med en firefaset mappestruktur (35 mapper). Som i kildemodulen bryter de to listene
   tillatelsesarven: eiere har full kontroll, medlemmer og besøkende kan lese.
4. Legger til veikolonner i **Prosjektkolonner** og en porteføljevisning **Veiprosjekter**
   (filtrert på hub-området og Prosjekt (Vei)-innholdstypen, `DepartmentId:{sitecollectionid}`).
5. Laster opp prosjekttillegget **Veimal** til **Prosjekttillegg**, låst (`locked`), og knytter
   det til malen (`GtProjectExtensions`).
6. Skriver et Maloppsett-element der `GtProjectContentType` peker på **Prosjekt (Vei)** og
   `GtProjectPhaseTermId` peker på termsettet **Fase (Vei)** – slik at veiprosjekter bruker
   sine egne faser.

## Hva som settes opp i prosjektet

- **Prosjekttillegget «Veimal»** legges alltid på for veiprosjekter (låst og knyttet til malen,
  og derfor skjult i oppsettsveiviseren, som i kildemodulen). Det legger kolonnen
  **Forankret i** (`GtVeiAnchored`) på innholdstypen Sjekkpunkt og på prosjektets
  **Fasesjekkliste**, og viser den i visningene *Alle elementer*, *Arkivert* og *Etter status*.
  På **Dokumenter** legges Fase, Fag og Emne til som kolonner og vises i visningen
  *Alle dokumenter*; visningen *Gjeldende fase* beholder standardmalens kolonner.
- **Fasesjekkliste** fylles fra hub-listen **Fasesjekkliste Vei** via listeinnhold
  (sorteringsrekkefølge, tittel, fase og Forankret i).
- **Planner-planen «Veiplan»** opprettes med de 90 oppgavene fra hub-listen
  **Planneroppgaver Vei** (`plannerTitle`, krever Prosjektportalen ≥ 1.14).
- **Standarddokumenter Vei** sin mappestruktur kopieres inn i prosjektets **Dokumenter**.

De tre listeinnholdsoppføringene er knyttet til malen og derfor forhåndsvalgt i
oppsettsveiviseren, men kan velges bort (`default: false`). Kopieringen av fasesjekklisten
forutsetter kolonnen «Forankret i» i prosjektet; den kommer fra tillegget «Veimal», som er låst
og derfor alltid legges på. Tillegget forutsetter i sin tur at hub-kolonnene «Forankret i», Fag og
Emne er provisjonert, siden de kopieres inn i prosjektet ved oppsett.

## Forutsetninger og begrensninger

> Malen er skykompatibel (`cloudCompatible: true`): ved tilgjengeliggjøring som skymal
> provisjoneres hub-avhengighetene (innholdstype, kolonner og taksonomi, krever
> Prosjektportalen ≥ 1.14), mens mappestrukturen, listeinnholdet og prosjekttillegget hentes
> direkte fra pakken ved prosjektoppsett. Provisjoneringen forventer en norsk hub (listene heter
> «Prosjekter», «Prosjektkolonner» osv., og tillatelsesnivåene «Full kontroll» og «Lese»).
>
> Malen bruker funksjonalitet som kommer med Prosjektportalen 1.14: taksonomikolonnene Fag/Emne
> (tokenet `{sitecollectiontermstoreid}`), hub-filteret i porteføljevisningen
> (`{sitecollectionid}`), listetillatelsene (`Security`) og det låste tillegget (`locked`).
> På eldre versjoner avbrytes hub-importen når Fag/Emne-kolonnene skal opprettes.

Følgende fra kildemodulen er **ikke** provisjonert av pakken (samme avgrensning som
bygg/anlegg-malene), og kan settes opp manuelt eller i en senere versjon:

- **Søkekonfigurasjon** – kolonnene Planleggingsleder/Prosjekteringsleder/Byggeleder vises i
  porteføljen via søk (`RefinableString80–82`). Søkeskjema kan ikke provisjoneres fra pakken
  (krever SharePoint-administrator). Se [`search/`](search/) for et skript IT kan kjøre; det
  kobler til administrasjonsområdet med Prosjektportalen-appens klient-ID, som kildemodulen.
- **Veiprosjektets egne prosjektsider** – prosjektstrukturen kommer fra standardmalen.

## Tilskrivelse

Veimodulen er utviklet av Rogaland fylkeskommune, og forvaltes av Crayon Consulting.
Originalkode: <https://github.com/Puzzlepart/pp365-veimodul>.
