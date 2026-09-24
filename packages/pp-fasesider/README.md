# Fasesider

Prosjekttillegg for Prosjektportalen 365 som legger til en egen forside for hver
av standardfasene **Konsept**, **Planlegge**, **Gjennomføre**, **Avslutte** og
**Realisere**. Sammen med funksjonen **dynamisk forside** i webdelen for
prosjektfaser vises siden som hører til prosjektets gjeldende fase som forside,
slik at innholdet på forsiden kan tilpasses hver fase.

| | |
| --- | --- |
| **ID** | `pp-fasesider` |
| **Type** | Prosjekttillegg |
| **Minimum PP-versjon** | 1.14.0 |
| **Tagger** | faser, forside, tillegg |

## Hva tillegget gjør

Tillegget oppretter fem sider i prosjektets **Områdesider**, én per fase:
Konsept, Planlegge, Gjennomføre, Avslutte og Realisere.

Hver side settes opp med samme innhold som standardforsiden:

- Prosjektegenskaper med fasevelger (dynamisk forside slått på)
- Oppgaver fra Planner
- Møter og hendelser
- Prosjektets dokumenter

Sidene kan deretter redigeres hver for seg, slik at hver fase får sitt eget innhold,
for eksempel veiledning, lenker eller webdeler som er relevante for akkurat den fasen.

## Slik tar du det i bruk

1. Kopier tillegget til installasjonen fra malpakkekatalogen. Tillegget legges da
   til i listen **Prosjekttillegg** på hub-området.
2. Velg tillegget under **Prosjekttillegg** i oppsettveiviseren når et nytt prosjekt
   opprettes.
3. Rediger fasesidene i prosjektet etter behov.

Bruker organisasjonen andre fasenavn enn standardfasene, kan tillegget tilpasses med
egne sider i listen **Prosjekttillegg** på hub-området.

## Forutsetninger

- Prosjektportalen 365 versjon 1.14 eller nyere.
- Prosjektet bruker standardfasene i Prosjektportalen (Konsept, Planlegge,
  Gjennomføre, Avslutte og Realisere).
