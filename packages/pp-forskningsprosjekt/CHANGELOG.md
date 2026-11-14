# Endringslogg - Forskningsprosjekt

Alle viktige endringer i denne malpakken dokumenteres i denne filen.

Formatet er basert på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
og denne pakken følger [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Forskningsmalen er utviklet av Høgskolen i Innlandet og forvaltes av Crayon Consulting.

## [1.1.0] - 2026-11-14

### Lagt til

- **Finansiør**, **Fakultet**, **Institutt** og **Forskergruppe** velges fra termsettene med samme navn, som i forskningsmalen fra Høgskolen i Innlandet. Verdiene vises og kan filtreres og grupperes i porteføljevisningen **Forskningsprosjekter**. Finnes ikke finansiøren eller forskergruppen i termsettet, fylles **Finansiør (annet)** eller **Forskergruppe (annet)** ut.
- Venstremenyen i forskningsprosjekter har igjen **Ressursallokering** under **Planlegging og styring** og **Notatblokk** under **Administrasjon**, som i standardmalen.

### Endret

- Tekstkolonnene **Fakultet (tekst)**, **Institutt (tekst)**, **Finansiør (tekst)** og **Forskergruppe (tekst)** fylles automatisk fra de nye kolonnene når prosjektinformasjonen lagres, og vises ikke lenger i skjemaene.

## [1.0.3] - 2026-11-13

### Rettet

- **Fakultet**, **Institutt**, **Finansiør** og **Forskergruppe** kan nå fylles inn i prosjektinformasjonen. Kolonnene var skjult i alle redigeringsskjemaer, så de var alltid tomme i porteføljevisningen **Forskningsprosjekter** og kunne ikke brukes som filtre. Prosjekter som ble satt opp før denne versjonen, beholder kolonnene skjult i sitt eget skjema.
- Import av malen gir ikke lenger «importert med feil» på hub-områder som ikke har malen Veiprosjekt. **Fasesjekkliste Forskning** viste til kolonnen «Unik nøkkel», som bare Veiprosjekt setter opp, og som forskningsmalen ikke bruker.

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
