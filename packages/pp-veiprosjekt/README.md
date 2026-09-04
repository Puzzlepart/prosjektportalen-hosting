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
   Byggeleder, Unik datanøkkel) og innholdstypen **Prosjekt (Vei)**
   (`0x0100805E9E4FEAAB4F0EABAB2600D30DB70C0E`), og knytter den til **Prosjekter**-listen.
3. Seeder hub-listene **Fasesjekkliste Vei** (36 sjekkpunkter; listen får også kolonnene
   Status og Kommentar slik at radene kan skrives) og **Planneroppgaver Vei** (90 oppgaver) via
   `DataRows`, og dokumentbiblioteket **Standarddokumenter Vei** med en firefaset
   mappestruktur (35 mapper).
4. Legger til veikolonner i **Prosjektkolonner** og en porteføljevisning **Veiprosjekter**
   (filtrert på Prosjekt (Vei)-innholdstypen, se begrensninger om hub-filter).
5. Laster opp prosjekttillegget **Veimal** til **Prosjekttillegg** og knytter det til malen
   (`GtProjectExtensions`).
6. Skriver et Maloppsett-element der `GtProjectContentType` peker på **Prosjekt (Vei)** og
   `GtProjectPhaseTermId` peker på termsettet **Fase (Vei)** – slik at veiprosjekter bruker
   sine egne faser.

## Hva som settes opp i prosjektet

- **Prosjekttillegget «Veimal»** (knyttet til malen og forhåndsvalgt i oppsettsveiviseren for
  veiprosjekter) legger kolonnen
  **Forankret i** (`GtVeiAnchored`) på innholdstypen Sjekkpunkt og på prosjektets
  **Fasesjekkliste**, og viser den i visningene *Alle elementer*, *Arkivert* og *Etter status*.
  På **Dokumenter** legges Fase, Fag og Emne til som kolonner og vises i visningen
  *Alle dokumenter* (Fag/Emne først når kolonnene finnes på hub-området, se begrensninger);
  visningen *Gjeldende fase* beholder standardmalens kolonner.
- **Fasesjekkliste** fylles fra hub-listen **Fasesjekkliste Vei** via listeinnhold
  (sorteringsrekkefølge, tittel, fase og Forankret i).
- **Planner-planen «Veiplan»** opprettes med de 90 oppgavene fra hub-listen
  **Planneroppgaver Vei** (`plannerTitle`, krever Prosjektportalen ≥ 1.14).
- **Standarddokumenter Vei** sin mappestruktur kopieres inn i prosjektets **Dokumenter**.

De tre listeinnholdsoppføringene er knyttet til malen og derfor forhåndsvalgt i
oppsettsveiviseren, men kan velges bort (`default: false`). Kopieringen av fasesjekklisten
forutsetter at tillegget «Veimal» er valgt, siden kolonnen «Forankret i» må finnes i
prosjektet: velges tillegget bort, feiler sjekkpunktene som har en verdi i «Forankret i»
(19 av 36). Tillegget forutsetter i sin tur at hub-kolonnen «Forankret i»
(`GtVeiAnchored`) er provisjonert, siden den kopieres inn i prosjektet ved oppsett.

## Forutsetninger og begrensninger

> Malen er skykompatibel (`cloudCompatible: true`): ved tilgjengeliggjøring som skymal
> provisjoneres hub-avhengighetene (innholdstype, kolonner og taksonomi, krever
> Prosjektportalen ≥ 1.14), mens mappestrukturen, listeinnholdet og prosjekttillegget hentes
> direkte fra pakken ved prosjektoppsett. Mappestrukturen krever sp-js-provisioning med
> `Folders`-støtte. Provisjoneringen forventer en norsk hub (listene heter «Prosjekter»,
> «Prosjektkolonner» osv.).

Følgende fra kildemodulen er **ikke** provisjonert av pakken (samme avgrensning som
bygg/anlegg-malene), og kan settes opp manuelt eller i en senere versjon:

- **Søkekonfigurasjon** – kolonnene Planleggingsleder/Prosjekteringsleder/Byggeleder vises i
  porteføljen via søk (`RefinableString80–82`). Søkeskjema kan ikke provisjoneres fra pakken
  (krever SharePoint-administrator). Se [`search/`](search/) for et skript IT kan kjøre; det
  kobler til administrasjonsområdet med Prosjektportalen-appens klient-ID, som kildemodulen.
- **Taksonomikolonnene Fag/Emne** – termsettene **Fag (Vei)** og **Emne (Vei)** provisjoneres,
  men selve taksonomikolonnene (`GtVeiSubject`/`GtVeiTopic`) kan ikke opprettes fra pakken
  (sp-js-provisioning har ikke noe token for termlager-ID). Tillegget «Veimal» refererer
  kolonnene på Dokumenter, så de tas i bruk automatisk når kolonnene finnes på hub-området.
- **Hub-filter i porteføljevisningen «Veiprosjekter»** – kildemodulen filtrerer også på
  `DepartmentId:{hub}`, men pakkeprovisjoneringen kan ikke sette inn hub-ID i
  visningsspørringen. For vanlige brukere begrenser porteføljen uansett resultatet til hubens
  områder. Medlemmer av «Porteføljeinnsyn» kan, i leietakere med flere Prosjektportalen-huber,
  se Prosjekt (Vei)-prosjekter fra andre huber i denne visningen.
- **Listetillatelser** – kildemodulen bryter tillatelsesarv på «Fasesjekkliste Vei» og
  «Planneroppgaver Vei» slik at bare eiere kan redigere. sp-js-provisioning støtter ikke
  listetillatelser, så listene arver hubens tillatelser.
- **Skjult tillegg** – i kildemodulen er «Veimal» skjult og knyttet til malen
  (`GtProjectExtensions`). Malpakken kan ikke skjule eller låse tillegget (manifestets `optional`
  mappes ikke til `GtExtensionLocked`), så «Veimal» vises som et forhåndsvalgt tillegg i
  veiviseren. En administrator kan låse det etterpå med «Lås standardtillegg» på
  Maloppsett-elementet.
- **Veiprosjektets egne prosjektsider** – prosjektstrukturen kommer fra standardmalen.

## Tilskrivelse

Veimodulen er utviklet av Rogaland fylkeskommune, og forvaltes av Crayon Consulting.
Originalkode: <https://github.com/Puzzlepart/pp365-veimodul>.
