# Endringslogg - Forskningsprosjekt

Alle viktige endringer i denne malpakken dokumenteres i denne filen.

Formatet er basert på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
og denne pakken følger [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Forskningsmalen er utviklet av Høgskolen i Innlandet og forvaltes av Crayon Consulting.

## [1.0.2] - 2026-11-05

### Endret

- Kolonnen for interessenter i **Prosjektleveranser** heter nå **Leveranseinteressenter**, som i standardmalen i Prosjektportalen. Prosjekttillegget **Forskningsmal** ga den tidligere navnet «Interessent(er)».

### Rettet

- En ny import eller oppdatering av malen tømmer ikke lenger beskrivelsen av listene **Prosjektdata**, **Prosjektinnholdskolonner**, **Datakilder** og **Porteføljevisninger** på hub-området.
- En ny import eller oppdatering beholder beskrivelser som er lagt på kolonnene **Nasjonalt vitenarkiv (NVA) prosjektkode**, **Leveransenummer**, **Fakultet (tekst)**, **Finansiør (tekst)**, **Institutt (tekst)** og **Forskergruppe (tekst)** på hub-området.

Rettelsene gjelder fra Prosjektportalen 1.15. Eldre versjoner av Prosjektportalen setter fortsatt disse innstillingene tilbake.

## [1.0.1] - 2026-01-07

### Endret

- Cristin er erstattet med Nasjonalt vitenarkiv (NVA) i feltnavn og beskrivelser.

### Rettet

- Rettet manglende taksonomi og diverse mindre feil i malen.

## [1.0.0] - 2024-12-05

### Lagt til

- Første versjon av forskningsmalen: prosjektmalen **Forskningsprosjekt** med innholdstypen **Prosjekt (Forskning)**.
- Forskningsfelter i prosjektinformasjonen, blant annet finansiør, utlysning, status søknad, søknadsfrist, søknadssum, fakultet, institutt, forskergruppe, prosjektkode og rolle i prosjektet.
- Porteføljevisningen **Forskningsprosjekter** med forskningsfeltene som kolonner og filtre.
- **Fasesjekkliste Forskning** med sjekkpunkter for forskningsprosjekter og kolonnen **Referanse** med lenke til veiledning.
- Prosjekttillegget **Forskningsmal** med listene **Etiske vurderinger**, **Prosjektorganisasjon**, **Work Breakdown Structure** og **Publiseringer**.
- Kolonnen **Leveransenummer** på prosjektleveranser, og en venstremeny tilpasset forskningsprosjekter.
- Siden **Publiseringer** på hub-området med en samlet oversikt over publiseringer fra alle forskningsprosjekter.
- Termsettene **Finansiør**, **Fakultet**, **Institutt** og **Forskergruppe**.
- Valget **Terminert** i porteføljekolonnen **Prosjektstatus**.
