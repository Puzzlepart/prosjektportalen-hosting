# Enkel prosjektmal

En enkel prosjektmal for oppstart av små prosjekter i Prosjektportalen 365.

Pakken definerer en egen prosjektinnholdstype **«Enkel prosjektmal»** på
hub-området (basert på den innebygde Prosjekt-innholdstypen), knytter den til
**Prosjekter**-listen, og inkluderer prosjekttilleggene **«Enkelt prosjekt»** og
**«Enkel venstremeny»**.

| | |
| --- | --- |
| **ID** | `pp-enkel-prosjektmal` |
| **Type** | template |
| **Minimum PP-versjon** | 1.10.0 |
| **Tagger** | enkel, prosjektledelse, oppstart |

## Hva «Kopier til min installasjon» gjør

1. Provisjonerer innholdstypen `0x0100805E9E4FEAAB4F0EABAB2600D30DB70C01`
   («Enkel prosjektmal») på hub-området.
2. Knytter innholdstypen til **Prosjekter**-listen.
3. Skriver et Maloppsett-element der `GtProjectContentType` peker på den nye
   innholdstypen.
4. Lagrer prosjekttilleggene for bruk i oppsettveiviseren.

> Merk: provisjoneringen forventer en norsk hub (lista heter «Prosjekter»).
