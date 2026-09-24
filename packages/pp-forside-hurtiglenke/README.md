# Forside med hurtiglenker

Prosjekttillegg for Prosjektportalen 365 som gir prosjektet en forside med
prosjektegenskaper øverst og tre kolonner med **hurtiglenker** under. Bruk
tillegget til å gi alle nye prosjekter faste lenker til for eksempel maler,
rutiner, veiledninger eller andre systemer.

| | |
| --- | --- |
| **ID** | `pp-forside-hurtiglenke` |
| **Type** | Prosjekttillegg |
| **Minimum PP-versjon** | 1.14.0 |
| **Tagger** | forside, navigasjon, tillegg |

## Hva tillegget gjør

Tillegget erstatter prosjektets forside (**Hjem**) med en forside som inneholder:

- Prosjektegenskaper med fasevelger, som på standardforsiden
- Tre webdeler med **Hurtigkoblinger**, side om side i kompakt kortvisning

Webdelene for oppgaver, møter og hendelser og dokumenter, som ligger på
standardforsiden, er ikke med på denne forsiden. De kan legges til igjen ved å
redigere siden i prosjektet, eller ved å tilpasse tillegget.

## Slik tar du det i bruk

1. Kopier tillegget til installasjonen fra malpakkekatalogen. Tillegget legges da
   til i listen **Prosjekttillegg** på hub-området.
2. Bytt ut eksempellenkene med egne lenker ved å redigere tillegget i listen
   **Prosjekttillegg**. Lenkene ligger under `items` i hver av de tre webdelene,
   med tittel og adresse.
3. Velg tillegget under **Prosjekttillegg** i oppsettveiviseren når et nytt prosjekt
   opprettes.

## Forutsetninger

- Prosjektportalen 365 versjon 1.14 eller nyere.
