# Endringslogg - Forskningsprosjekt

Alle viktige endringer i denne malpakken dokumenteres i denne filen.

Formatet er basert på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
og denne pakken følger [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Versjonshistorikken følger kildemodulen
[Puzzlepart/prosjektportalen365-addons → Prosjektmaler/Forskningsmal](https://github.com/Puzzlepart/prosjektportalen365-addons/tree/master/Prosjektmaler/Forskningsmal)
(utviklet av Høgskolen i Innlandet). Denne pakken er en re-implementasjon av modulen for
hosting-katalogens JSON-provisjonering.

## [1.0.1] - 2026-01-07

### Lagt til

- Prosjekttillegget **Forskningsmal**, portert fra kildemodulen: listene **Etiske vurderinger**,
  **Prosjektorganisasjon**, **Work Breakdown Structure** og **Publiseringer**, kolonnen **Referanse**
  på fasesjekklisten, **Leveransenummer** på prosjektleveranser, og menylenker til de nye listene.
- Hub-siden **Publiseringer.aspx** med den aggregerte publiseringswebdelen, og datakilden
  **Alle publiseringer** som mater den.
- **Prosjektinnholdskolonner**: publiseringskolonnene og **Leveransenummer**, med kolonner og filtre
  koblet på datakilden, slik at kildemodulens manuelle etterarbeid ikke er nødvendig.
- Porteføljekolonnen **Prosjektstatus** (`GtProjectLifecycleStatus`) utvidet med valget **Terminert**,
  og lagt tilbake på innholdstypen **Prosjekt (Forskning)**.

### Endret

- Diverse rettelser i forskningsmalen (bl.a. taksonomi og NVA/Cristin-kobling).
- Menyen i prosjekttillegget bygges som standardmalens meny pluss de nye listene, i stedet for å
  erstatte den slik kildemodulen gjør. Nytteoversikt, Ressursallokering og Notatblokk beholdes.
- Fasesjekklistevisningen **Per status** heter **Etter status**, som i Prosjektportalen 1.14.

### Rettet

- Korrigert engelsk visningsnavn for innholdstypen **Prosjekt (Forskning)** («Project (Research)»),
  som i kilden feilaktig var satt til innholdstypegruppens navn.
- **Referanse** kopieres nå til prosjektets fasesjekkliste; listeinnholdet manglet kolonnen.
- Innholdstypene **Sjekkpunkt** og **Prosjektleveranse** beholder **Tittel** først i feltrekkefølgen.
  Kildemodulen utelater Tittel, og provisjoneringen sorterer feltlenkene etter oppgitt rekkefølge.
- Prosjektinnholdskolonnen for **Er publikasjonen publisert?** het i kildemodulen «Hvor er
  publikasjonen publisert?», som er beskrivelsesteksten til en annen kolonne.

## [1.0.0] - 2024-12-05

### Lagt til

- Første versjon av forskningsmalen: prosjektmalen **Forskningsprosjekt** med innholdstypen
  **Prosjekt (Forskning)** og forskningsspesifikke kolonner (søknadsstatus, frist, beløp,
  Cristin/NVA-kode, rolle, publikasjonsfelt m.m.).
- **Fasesjekkliste Forskning** med fasesjekkpunkter for forskningsprosjekter.
- Taksonomi for **Finansiør**, **Fakultet**, **Institutt** og **Forskergruppe**.
- Tospråklig (norsk og engelsk).
