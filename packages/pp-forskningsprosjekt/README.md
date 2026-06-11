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
| **Minimum PP-versjon** | 1.12.0 |
| **Tagger** | forskning, FoU, prosjektledelse |
| **Språk** | Norsk (nb-NO) og engelsk (en-US) |

## Tospråklig (norsk + engelsk)

Pakken inneholder **to språkvarianter** av provisjoneringen:

- `provisioning/hub-template.json` – norsk (nb-NO)
- `provisioning/hub-template.en-US.json` – engelsk (en-US)

Prosjektportalen oppdager hub-områdets språk ved import og bruker den matchende varianten (norsk hub →
norske felt-, liste- og innholdstypenavn + norske termer + «Forskningsprosjekt» som mal; engelsk hub →
engelske navn + engelske termer + «Research Project»). Innholdstype-ID-er og term-set-/term-ID-er er like
i begge varianter, så de er idempotente.

## Hva «Kopier til min installasjon» gjør

1. Provisjonerer taksonomigruppen **Prosjektportalen** med termsettene **Finansiør**, **Fakultet**,
   **Institutt** og **Forskergruppe** (norske eller engelske termnavn etter hub-språk).
2. Provisjonerer forskningskolonnene (søknadsstatus, frist, beløp, Cristin/NVA-kode, rolle, fag-/finansiør-/
   institutt-/forskergruppe-tekstfelt, publikasjonsfelt m.m.) og innholdstypen **Prosjekt (Forskning)**
   (`0x0100805E9E4FEAAB4F0EABAB2600D30DB70C09`), og knytter den til **Prosjekter**-listen.
3. Seeder hub-listen **Fasesjekkliste forskning** (48 sjekkpunkter på tvers av prosjektfasene) via
   `DataRows`, med kolonnen «Referanse» (lenke til veiledning).
4. Skriver et Maloppsett-element der `GtProjectContentType` peker på **Prosjekt (Forskning)**. Malen bruker
   standardfasene og standard prosjektstatus-innholdstype.

## Hva som settes opp i prosjektet

- **Fasesjekkliste** fylles fra hub-listen via listeinnhold ved prosjektoppsett.

## Forutsetninger og begrensninger

> Malen definerer innholdstype på hub-området og er derfor ikke en ren skymal (`cloudCompatible: false`).
> Provisjoneringen forventer en standard Prosjektportalen-hub.

Følgende fra kildemodulen er **ikke** provisjonert av pakken (samme avgrensning som bygg/anlegg/vei), og
kan settes opp manuelt eller i en senere versjon:

- **Taksonomikolonnene Fag/Institutt/Forskergruppe/Finansiør** (managed metadata): termsettene
  provisjoneres, men selve taksonomikolonnene bindes ikke (sp-js-provisioning binder ikke termlager-ID på
  nye taksonomifelt). De tilhørende **tekstfeltene** (`…Text`) provisjoneres i stedet.
- **«Referanse» (GtcPhaseReference) på prosjektets fasesjekkliste**: kolonnen og verdiene finnes fullt ut på
  hub-listen, men kopieres ikke til prosjektets fasesjekkliste (prosjektsiden bruker standardmalens kolonner).
- **Publiseringer-siden med egen webdel, Datakilder-visninger, site scripts/designs, prosjekttillegg og
  PowerShell-installasjon**: ikke portert; prosjektstrukturen kommer fra standardmalen.
- Termsettene er hentet fra kildeinstitusjonen (Høgskolen i Innlandet) og kan tilpasses egen organisasjon.

## Tilskrivelse

Forskningsmalen er utviklet av Høgskolen i Innlandet, og forvaltes av Crayon Consulting.
Originalkode: <https://github.com/Puzzlepart/prosjektportalen365-addons/tree/master/Prosjektmaler/Forskningsmal>.
