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
måte som importen. Merk at den er **fryst** på innholdet fra før prosjekttillegget ble portert, og må
oppdateres før den eventuelt tas i bruk igjen.

## Hva «Kopier til min installasjon» gjør

1. Provisjonerer taksonomigruppen **Prosjektportalen** med termsettene **Finansiør**, **Fakultet**,
   **Institutt** og **Forskergruppe** (norske eller engelske termnavn etter hub-språk).
2. Provisjonerer forskningskolonnene (søknadsstatus, frist, beløp, Cristin/NVA-kode, rolle, fag-/finansiør-/
   institutt-/forskergruppe-tekstfelt, publikasjonsfelt m.m.) og innholdstypen **Prosjekt (Forskning)**
   (`0x0100805E9E4FEAAB4F0EABAB2600D30DB70C09`), og knytter den til **Prosjekter**- og
   **Prosjektdata**-listene.
3. Seeder hub-listen **Fasesjekkliste Forskning** (48 sjekkpunkter på tvers av prosjektfasene) via
   `DataRows`, med kolonnen «Referanse» (lenke til veiledning).
4. Registrerer de 14 forskningskolonnene i **Prosjektkolonner**, slik at de kan vises, filtreres og
   grupperes i porteføljeoversikten, statusrapporter og på prosjektforsiden.
5. Legger til porteføljevisningen **Forskningsprosjekter** (filtrert på hub-området og
   Prosjekt (Forskning)-innholdstypen) med forskningskolonnene som kolonner og filtre.
6. Registrerer publiseringskolonnene og **Leveransenummer** i **Prosjektinnholdskolonner**, og oppretter
   datakilden **Alle publiseringer** (Portefølje-nivå) med disse kolonnene og filtrene ferdig satt.
7. Oppretter hub-siden **Publiseringer.aspx** med den aggregerte webdelen koblet til datakilden.
   Siden opprettes bare hvis den ikke finnes fra før, så en tilpasset side blir ikke overskrevet.
8. Legger til prosjekttillegget **Forskningsmal** (låst til denne malen).
9. Utvider porteføljekolonnen **Prosjektstatus** (`GtProjectLifecycleStatus`) med valget **Terminert**.
   Kolonnen er delt på huben, så valget blir synlig for alle maler.
10. Skriver et Maloppsett-element der `GtProjectContentType` peker på **Prosjekt (Forskning)**. Malen bruker
   standardfasene og standard prosjektstatus-innholdstype.

## Hva som settes opp i prosjektet

Prosjekttillegget **Forskningsmal** er låst til malen og kjøres alltid når et forskningsprosjekt settes opp:

- Fire nye lister: **Etiske vurderinger**, **Prosjektorganisasjon**, **Work Breakdown Structure** og
  **Publiseringer** (sistnevnte med innholdstypen Publiseringelement).
- **Fasesjekkliste** utvides med kolonnen **Referanse**, som også vises i de tre visningene.
- **Prosjektleveranser** utvides med **Leveransenummer**.
- Venstremenyen får lenker til de fire nye listene. Menyen bygges som standardmalens meny **pluss** de
  nye lenkene, slik at Nytteoversikt, Ressursallokering og Notatblokk beholdes.
- **Fasesjekkliste** fylles fra hub-listen via listeinnhold ved prosjektoppsett, inkludert «Referanse».

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
- **Site script og områdedesign** (`Innholdstype - Publiseringelement`): ikke portert. Dette er
  leietaker-scopet og settes opp av kildemodulens `Install.ps1`; det kan ikke uttrykkes i en pakke.
  Publiseringslisten opprettes uansett av prosjekttillegget, så scriptet er ikke nødvendig for at
  malen skal fungere.
- **Publiseringer-siden ved skymal**: siden opprettes bare ved import til hub-området. Skymal-flyten
  filtrerer hub-malen ned til kolonner, innholdstyper, lister og taksonomi, så `ClientSidePages`
  faller bort der. Siden må da opprettes manuelt.
- **Prosjektforsiden fra kildemodulen**: ikke portert. Modulens `Hjem.aspx` er en kopi av
  prosjektforsiden fra før 1.14, og standardmalens `ProjectHome.aspx` er nyere. Forskningsprosjekter
  bruker derfor standardforsiden.
- **Menygrupperingen fra kildemodulen** (Obligatoriske funksjoner / Planlegging og styring /
  Administrasjon / FoU Verktøy / Generelt): ikke portert, fordi navigasjonshåndtereren erstatter hele
  menyen og modulens meny mangler flere standardoppføringer.
- Termsettene er hentet fra kildeinstitusjonen (Høgskolen i Innlandet) og kan tilpasses egen organisasjon.

## Tilskrivelse

Forskningsmalen er utviklet av Høgskolen i Innlandet, og forvaltes av Crayon Consulting.
Originalkode: <https://github.com/Puzzlepart/prosjektportalen365-addons/tree/master/Prosjektmaler/Forskningsmal>.
