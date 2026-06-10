# Veiprosjekt

Prosjektmal for veg- og samferdselsprosjekter i Prosjektportalen 365, basert på
**veimodulen** ([Puzzlepart/pp365-veimodul](https://github.com/Puzzlepart/pp365-veimodul)).
Veimodulen er utviklet av **Rogaland fylkeskommune**, og ekstrahert som delbar mal av
**Puzzlepart – nå Crayon Consulting**. Denne pakken er en re-implementasjon av modulen
for hosting-katalogens JSON-provisjonering.

Malen provisjonerer egne veifaser, **Prosjekt (Vei)**-innholdstype og -kolonner på
hub-området, og setter opp prosjektets fasesjekkliste, planneroppgaver og en standard
mappestruktur for prosjektdokumenter.

| | |
| --- | --- |
| **ID** | `pp-veiprosjekt` |
| **Type** | template |
| **Versjon** | 1.1.3 (følger kildemodulen) |
| **Minimum PP-versjon** | 1.12.0 |
| **Tagger** | vei, samferdsel, anlegg, prosjektledelse |
| **Språk** | Norsk (nb-NO) |

## Hva «Kopier til min installasjon» gjør

1. Provisjonerer taksonomigruppen **Prosjektportalen** med termsettene **Fase (Vei)**
   (Planlegge, Prosjektere, Bygge, Avslutte), **Fag (Vei)** og **Emne (Vei)** på
   hub-områdets termlager.
2. Provisjonerer veikolonnene (Forankret i, Planleggingsleder, Prosjekteringsleder,
   Byggeleder, Unik datanøkkel) og innholdstypen **Prosjekt (Vei)**
   (`0x0100805E9E4FEAAB4F0EABAB2600D30DB70C0E`), og knytter den til **Prosjekter**-listen.
3. Seeder hub-listene **Fasesjekkliste Vei** (36 sjekkpunkter) og **Planneroppgaver Vei**
   (90 oppgaver) via `DataRows`, og dokumentbiblioteket **Standarddokumenter Vei** med en
   firefaset mappestruktur (35 mapper).
4. Legger til veikolonner i **Prosjektkolonner** og en porteføljevisning **Veiprosjekter**
   (filtrert på Prosjekt (Vei)-innholdstypen).
5. Skriver et Maloppsett-element der `GtProjectContentType` peker på **Prosjekt (Vei)** og
   `GtProjectPhaseTermId` peker på termsettet **Fase (Vei)** – slik at veiprosjekter bruker
   sine egne faser (krever en PortfolioExtensions-versjon med `projectPhaseTermSetId`-støtte).

## Hva som settes opp i prosjektet

- **Fasesjekkliste** og **Planneroppgaver** fylles fra hub-listene via listeinnhold ved
  prosjektoppsett.
- **Standarddokumenter Vei** sin mappestruktur kopieres inn i prosjektets **Dokumenter**.

## Forutsetninger og begrensninger

> Malen definerer innholdstype på hub-området og er derfor ikke en ren skymal
> (`cloudCompatible: false`). Mappestrukturen krever sp-js-provisioning med `Folders`-støtte.
> Provisjoneringen forventer en norsk hub (listene heter «Prosjekter», «Prosjektkolonner» osv.).

Følgende fra kildemodulen er **ikke** provisjonert av pakken (samme avgrensning som
bygg/anlegg-malene), og kan settes opp manuelt eller i en senere versjon:

- **Søkekonfigurasjon** – kolonnene Planleggingsleder/Prosjekteringsleder/Byggeleder vises i
  porteføljen via søk (`RefinableString80–82`). Søkeskjema kan ikke provisjoneres fra pakken
  (krever SharePoint-administrator). Se [`search/`](search/) for et lite skript IT kan kjøre.
- **Taksonomikolonnene Fag/Emne** i dokumentbiblioteket – termsettene provisjoneres, men selve
  taksonomikolonnene bindes ikke (sp-js-provisioning binder ikke termlager-ID på nye
  taksonomifelt ved hub-provisjonering).
- **«Forankret i» (GtVeiAnchored) på prosjektets fasesjekkliste** – kolonnen og verdiene finnes
  fullt ut på hub-listen **Fasesjekkliste Vei**, men kopieres ikke til prosjektets fasesjekkliste
  (prosjektsiden bruker standardmalens kolonner).
- **Planner-planen «Veiplan»** – oppgavene seedes som listeinnhold, men selve Planner-planen
  opprettes ikke.
- **Veiprosjektets egne prosjektsider/tillegg** – prosjektstrukturen kommer fra standardmalen.

## Tilskrivelse

Veimodulen er utviklet av Rogaland fylkeskommune, og forvaltes av Crayon Consulting.
Originalkode: <https://github.com/Puzzlepart/pp365-veimodul>.
