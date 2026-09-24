# Dokumentbibliotek – flat visning

Prosjekttillegg for Prosjektportalen 365 som legger til en flat dokumentvisning i
prosjektets bibliotek **Dokumenter**. I visningen **Flat struktur** vises alle
dokumenter i biblioteket i én liste uten mapper, med de sist endrede dokumentene
først. Kolonnen **Bane** viser hvilken mappe hvert dokument ligger i.

Visningen er nyttig i prosjekter med en dyp mappestruktur, der det ellers er
tidkrevende å finne igjen dokumenter eller se hva som er endret sist.

| | |
| --- | --- |
| **ID** | `pp-dokumentbibliotek-flat` |
| **Type** | Prosjekttillegg |
| **Minimum PP-versjon** | 1.14.0 |
| **Tagger** | dokumenter, visning, tillegg |

## Hva tillegget gjør

- Legger til visningen **Flat struktur** i biblioteket **Dokumenter**, med kolonnene
  Navn, Fase, Endret, Endret av og **Bane**.
- Visningen viser alle dokumenter i biblioteket uavhengig av mappe, sortert etter
  sist endret, 100 dokumenter per side.

Standardvisningen **Alle dokumenter** beholdes.

## Slik tar du det i bruk

1. Kopier tillegget til installasjonen fra malpakkekatalogen. Tillegget legges da
   til i listen **Prosjekttillegg** på hub-området.
2. Velg tillegget under **Prosjekttillegg** i oppsettveiviseren når et nytt prosjekt
   opprettes.

## Forutsetninger

- Prosjektportalen 365 versjon 1.14 eller nyere.
- Prosjektområdet må være på norsk (biblioteket heter «Dokumenter»).
