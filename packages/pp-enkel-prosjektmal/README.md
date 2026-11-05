# Enkel prosjektmal

En enkel prosjektmal for oppstart av små prosjekter i Prosjektportalen 365.

Pakken definerer en egen prosjektinnholdstype **«Enkel prosjektmal»** på
hub-området (basert på den innebygde Prosjekt-innholdstypen), knytter den til
**Prosjekter**-listen, og inkluderer prosjekttilleggene **«Enkelt prosjekt»** og
**«Enkel venstremeny»**.

| | |
| --- | --- |
| **ID** | `pp-enkel-prosjektmal` |
| **Type** | Prosjektmal |
| **Minimum PP-versjon** | 1.14.0 |
| **Språk** | Norsk (nb-NO) |
| **Tagger** | enkel, prosjektledelse, oppstart |

## Hva «Kopier til min installasjon» gjør

1. Provisjonerer innholdstypen `0x0100805E9E4FEAAB4F0EABAB2600D30DB70C01`
   («Enkel prosjektmal») på hub-området.
2. Knytter innholdstypen til **Prosjekter**-listen.
3. Skriver et Maloppsett-element der `GtProjectContentType` peker på den nye
   innholdstypen.
4. Lagrer prosjekttilleggene for bruk i oppsettveiviseren.

## Prosjekttilleggene: velg ett av dem

De to prosjekttilleggene er alternativer. Begge gir prosjektet den samme forenklede
venstremenyen: **Hjem**, **Prosjektstatus**, **Dokumenter**, **Oppgaver**,
**Usikkerhet**, **Fasesjekkliste**, **Prosjekttidslinje** og **Områdeinnhold**.
Menyen erstatter venstremenyen fra prosjektmalen.

- **Enkel venstremeny** (forhåndsvalgt) endrer bare menyen. **Hjem** lenker til
  områdets adresse, som åpner forsiden prosjektet allerede har.
- **Enkelt prosjekt** gir i tillegg prosjektet en ny, forenklet forside
  (`Prosjekt.aspx`) med prosjektinformasjon, nyheter, fasevelger og dokumenter, og
  gjør den til områdets forside. **Hjem** settes til den nye forsiden hver gang
  tillegget legges på, også om noen har endret lenken.

Det holder å velge ett av dem. Velges begge, blir resultatet det samme som med
**Enkelt prosjekt** alene. Bortsett fra **Hjem** i **Enkelt prosjekt** beholder et
menypunkt som finnes fra før, adressen det har.

## Forutsetninger

- Prosjektportalen 365 versjon 1.14 eller nyere.
- Hub-området og prosjektområdene må være på norsk. Provisjoneringen forventer
  norske listenavn (lista heter «Prosjekter»), og **Dokumenter** i menyen lenker til
  `Delte dokumenter`, som er adressen dokumentbiblioteket har på norske områder.
