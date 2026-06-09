# Endringslogg - Enkel prosjektmal

Alle viktige endringer i denne malpakken dokumenteres i denne filen.

Formatet er basert på [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
og denne pakken følger [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 09/06/2026

### Lagt til

- Forenklet prosjektstatus-innholdstype **«Enkel prosjektstatus»** (`0x010022252E35737A413FB56A1BA53862F6D501`, basert på den innebygde Prosjektstatus-innholdstypen) på hub-området, med kjerneindikatorene Samlet status, Tid, Kostnad, Kvalitet og Risiko (med kommentarer). Knyttet til **Prosjektstatus**-listen.
- Prosjektmal (`template.json`) fylt ut basert på venstremenyen: prosjektsidene **Prosjektstatus**, **Oppgaver** og **Prosjekttidslinje** (med standard Prosjektportalen-webdeler) og listene **Usikkerhet** og **Fasesjekkliste**. Hentet fra standard prosjektmal og med tokens løst til norsk.

### Endret

- `template.json` peker nå `ProjectStatusContentTypeId` på den nye «Enkel prosjektstatus»-innholdstypen i stedet for den fulle Prosjektstatus-innholdstypen.

> Merk: prosjektsidene og -listene bruker standard Prosjektportalen-innholdstyper, -kolonner og -webdeler (f.eks. risikokolonner og status-/tidslinjewebdeler). Disse forventes levert av grunninstallasjonen av Prosjektportalen; uten dem vises tilhørende kolonner/webdeler tomme.

## [1.2.0] - 09/06/2026

### Endret
- Prosjektmalen (`provisioning/template.json`) har nå egne `Parameters` (prosjekt- og statusinnholdstype, kolonnegrupper og termsett for prosjektfase), slik at `PreTask` i Oppsettveiviseren kobler riktig innholdstype til prosjektet
- Prosjektinformasjon bruker pakkens egen «Enkel prosjektmal»-innholdstype (`…70C01`). Innholdstypen provisjoneres til hub og bindes til **Prosjekter**-listen når skymalen tilgjengeliggjøres («Tilgjengeliggjør som skymal»), slik at porteføljen kjenner igjen prosjekter laget fra den
- Merket som `cloudCompatible: true` – ingen «på eget ansvar»-varsel lenger

## [1.1.0] - 08/06/2026

### Lagt til

- Listen «Enkel Fasesjekkliste» på hub-området, med 15 ferdige sjekkpunkter fordelt på fasene Idé, Konsept, Planlegge, Gjennomføre, Avslutte og Realisere (basert på den fullstendige fasesjekklisten i Prosjektportalen)
- Sjekkpunktene provisjoneres som `DataRows` (krever sp-js-provisioning ≥ 1.3.10), og demonstrerer utfylling av tekst-, tall- og termfelt (`GtProjectPhase`)
- Listeinnholdskonfigurasjon «Enkel fasesjekkliste» som kobles automatisk til Maloppsett-oppføringen ved import, slik at sjekkpunktene kopieres fra hub-listen til prosjektets «Fasesjekkliste» under prosjektoppsett
- Merket som `cloudCompatible: false` fordi malen definerer en innholdstype på hub-området som knyttes til «Prosjekter»-listen. Tillegg og listeinnhold fungerer som skymal, men hub-innholdstypen provisjoneres ikke – katalogen og oppsettveiviseren varsler «på eget ansvar»

## [1.0.0] - 05/06/2026

### Lagt til

- Første versjon av Enkel prosjektmal
- Egen prosjektinnholdstype «Enkel prosjektmal» (basert på den innebygde Prosjekt-innholdstypen), definert på hub-området og knyttet til Prosjekter-listen
- Prosjekttillegget «Enkelt prosjekt» (forenklet prosjektforside og venstremeny)
- Prosjekttillegget «Enkel venstremeny» (standard valgt)
