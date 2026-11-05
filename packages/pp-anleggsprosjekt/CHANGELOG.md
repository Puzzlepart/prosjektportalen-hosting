# Endringslogg - Anleggsprosjekt

Alle viktige endringer i denne malpakken dokumenteres i denne filen.

Formatet er basert på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
og denne pakken følger [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-11-05

### Rettet

- En ny import eller oppdatering av malen tømmer ikke lenger beskrivelsen av listen **Porteføljevisninger** og kolonnen **HP-fase** på hub-området.

Rettelsene gjelder fra Prosjektportalen 1.15. Eldre versjoner av Prosjektportalen setter fortsatt disse innstillingene tilbake.

> Merk: På hub-områder som fikk malen før 4. september 2026, er kolonnen **Fase** i **Fasesjekkliste Anlegg** koblet til standardfasene i stedet for **Fase (Anlegg)**. En ny import eller oppdatering retter ikke dette. Avsnittet «Hub-områder som fikk malen før 4. september 2026» i README forklarer hvordan kolonnen kobles om.

## [1.0.0] - 2026-06-09

### Lagt til

- Prosjektmal for anleggsprosjekter, basert på bygg- og anleggsmalen i Prosjektportalen 365.
- Egne anleggsfaser: Idé, Flere faser, Initiering, Prosjektering og kontrahering, Anleggsfase, Overtakelse og overlevering og Bruks og driftsfase.
- Bygg- og anleggsfelter for prosjektinformasjon og statusrapport, blant annet HP-fase, siste politiske vedtak, tilskudd, SHA, miljø og plan- og byggesak.
- Egne seksjoner for tilskudd, SHA, miljø og plan- og byggesak i statusrapporten.
- Porteføljevisningen **Anleggsprosjekter** med bygg- og anleggsfeltene som kolonner og filtre.
- **Fasesjekkliste** med 45 sjekkpunkter fordelt på anleggsfasene.
- **Planner-oppgaver** med 31 standardoppgaver som opprettes i Planner-planen «Anleggsoppgaver».
- Standard mappestruktur for prosjektdokumenter med 8 hovedmapper og 48 mapper totalt.
