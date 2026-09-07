# Forskningsprosjekt

Prosjektmal for forsknings- og utviklingsprosjekter i Prosjektportalen 365, basert på
**forskningsmalen** ([Puzzlepart/prosjektportalen365-addons → Prosjektmaler/Forskningsmal](https://github.com/Puzzlepart/prosjektportalen365-addons/tree/master/Prosjektmaler/Forskningsmal)).
Forskningsmalen er utviklet av **Høgskolen i Innlandet** sammen med **Puzzlepart – nå Crayon
Consulting**. Denne pakken er en re-implementasjon av modulen for hosting-katalogens
JSON-provisjonering.

| | |
| --- | --- |
| **ID** | `pp-forskningsprosjekt` |
| **Type** | template |
| **Versjon** | 1.0.1 (følger kildemodulen) |
| **Minimum PP-versjon** | 1.14.0 |
| **Tagger** | forskning, FoU, prosjektledelse |
| **Språk** | Norsk (nb-NO) |

## Språk

Pakken er **norsk (nb-NO)**. En ferdig engelsk variant av hub-provisjoneringen ligger i pakken
(`provisioning/hub-template.en-US.json`), men den er **ikke** deklarert i manifestet og brukes derfor ikke.

Årsaken er at bare den ene av de to leveringsveiene håndterer språkvarianter: import til hub-området
oversetter manifestet etter hub-språket, mens prosjektoppsett fra en **skymal** leser manifestet
uoversatt. På et engelsk hub-område ville skymalen dermed lete etter den norske hub-listen og feile.
Den engelske varianten kan deklareres igjen når prosjektoppsettet håndterer språkvarianter på samme
måte som importen.

## Hva «Kopier til min installasjon» gjør

1. Provisjonerer taksonomigruppen **Prosjektportalen** med termsettene **Finansiør**, **Fakultet**,
   **Institutt** og **Forskergruppe** (norske eller engelske termnavn etter hub-språk).
2. Provisjonerer forskningskolonnene (søknadsstatus, frist, beløp, Cristin/NVA-kode, rolle, fag-/finansiør-/
   institutt-/forskergruppe-tekstfelt, publikasjonsfelt m.m.) og innholdstypen **Prosjekt (Forskning)**
   (`0x0100805E9E4FEAAB4F0EABAB2600D30DB70C09`), og knytter den til **Prosjekter**-listen.
3. Seeder hub-listen **Fasesjekkliste forskning** (48 sjekkpunkter på tvers av prosjektfasene) via
   `DataRows`, med kolonnen «Referanse» (lenke til veiledning).
4. Registrerer de 14 forskningskolonnene i **Prosjektkolonner**, slik at de kan vises, filtreres og
   grupperes i porteføljeoversikten, statusrapporter og på prosjektforsiden.
5. Legger til porteføljevisningen **Forskningsprosjekter** (filtrert på hub-området og
   Prosjekt (Forskning)-innholdstypen) med forskningskolonnene som kolonner og filtre.
6. Skriver et Maloppsett-element der `GtProjectContentType` peker på **Prosjekt (Forskning)**. Malen bruker
   standardfasene og standard prosjektstatus-innholdstype.

## Hva som settes opp i prosjektet

- **Fasesjekkliste** fylles fra hub-listen via listeinnhold ved prosjektoppsett.

## Forutsetninger og begrensninger

> Malen er skykompatibel (`cloudCompatible: true`): ved tilgjengeliggjøring som skymal provisjoneres
> hub-avhengighetene (innholdstype, kolonner og de fire termsettene, krever Prosjektportalen ≥ 1.14),
> mens listeinnholdet hentes direkte fra pakken ved prosjektoppsett.
> Provisjoneringen forventer en standard Prosjektportalen-hub.

Følgende fra kildemodulen er **ikke** provisjonert av pakken, og kan settes opp manuelt eller i en
senere versjon:

- **Taksonomikolonnene Finansiør/Fakultet/Institutt/Forskergruppe** (managed metadata): termsettene
  provisjoneres, men selve taksonomikolonnene er ikke portert ennå. De tilhørende **tekstfeltene**
  (`…Text`) provisjoneres i stedet, og er de som registreres som porteføljekolonner. Taksonomikolonnene
  kan uttrykkes i pakken fra og med Prosjektportalen 1.14 (tokenet `{sitecollectiontermstoreid}`, se
  Fag/Emne i veiprosjekt); inntil da fylles ikke tekstfeltene av noe, og termsettene har ingen forbruker.
- **«Referanse» (GtcPhaseReference) på prosjektets fasesjekkliste**: kolonnen og verdiene finnes fullt ut på
  hub-listen, men kopieres ikke til prosjektets fasesjekkliste (prosjektsiden bruker standardmalens kolonner).
- **Prosjekttillegget** til kildemodulen: ikke portert. Prosjektstrukturen kommer derfor fra
  standardmalen, og forskningsprosjekter får ikke modulens fire egne prosjektlister (blant annet
  publiseringer og leveranser) eller dens egen prosjektforside.
- **Publiseringer-siden med egen webdel, datakilden «Alle publiseringer», site scripts/designs og
  PowerShell-installasjonen**: ikke portert. De seks publiseringskolonnene provisjoneres, men har
  ingen liste eller side å brukes i før prosjekttillegget portes.
- Termsettene er hentet fra kildeinstitusjonen (Høgskolen i Innlandet) og kan tilpasses egen organisasjon.

## Tilskrivelse

Forskningsmalen er utviklet av Høgskolen i Innlandet, og forvaltes av Crayon Consulting.
Originalkode: <https://github.com/Puzzlepart/prosjektportalen365-addons/tree/master/Prosjektmaler/Forskningsmal>.
