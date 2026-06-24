# Testprosjekt

Intern **testmal** for Prosjektportalen 365. Pakken finnes kun for å teste hele
installasjonsløypa: den utøver med vilje *alle* funksjoner i pakkeformatet, slik at en endring
i provisjoneringen eller hosting-katalogen kan verifiseres mot en kjent referanse.

> [!WARNING]
> **Dette er ikke en reell prosjektmal.** Den skal ikke brukes til faktiske prosjekter. Malen er
> markert `cloudCompatible: false` fordi den provisjonerer taksonomi-termsett til termlageret på
> hub-området, som ikke kan settes opp fra en skymal. Bruk den kun til testing og QA.

| | |
| --- | --- |
| **ID** | `pp-testprosjekt` |
| **Type** | template |
| **Versjon** | 1.0.0 |
| **Minimum PP-versjon** | 1.12.0 |
| **Tagger** | test, alle-funksjoner, qa, intern |
| **Språk** | Norsk (nb-NO) og engelsk (en-US) |
| **Skykompatibel** | Nei (`cloudCompatible: false`) |

## Tospråklig (norsk + engelsk)

Pakken inneholder **to språkvarianter** av provisjoneringen:

- `provisioning/hub-template.json` / `provisioning/template.json` – norsk (nb-NO)
- `provisioning/hub-template.en-US.json` / `provisioning/template.en-US.json` – engelsk (en-US)

Prosjektportalen oppdager hub-områdets språk ved import og bruker den matchende varianten (norsk hub →
norske felt-, liste- og innholdstypenavn + norske termer + «Testprosjekt» som mal; engelsk hub →
engelske navn + engelske termer + «Test Project»). Alle ID-er – termsett, termer, innholdstyper og felt –
er identiske i begge varianter, så de er idempotente.

## Hva pakken provisjonerer

På **hub-området** (`provisioning/hub-template.json`):

- **Taksonomi** – tre termsett i den eksisterende termgruppen **Prosjektportalen** (se egen seksjon under).
- **Sitekolonner** i gruppen «Kolonner for Prosjektportalen (Test)»: `GtTestText` (tekst), `GtTestNote`
  (flerlinjes notat), `GtTestDate` (dato), `GtTestBool` (ja/nei), `GtTestChoice` (valg: Lav, Middels, Høy),
  `GtTestNumber` (tall) og `GtTestUrl` (lenke).
- **Innholdstyper**: **Prosjekt (Test)** (`0x0100CBEAE584066D4D87970DD5EDFDFE7F06`) som binder både
  standardkolonnene og test-kolonnene, og **Testsjekkpunkt**
  (`0x0100FFE226AE6A8C4F38A2DAB5E451711F4E`).
- **Lister**:
  - **Prosjekter** – innholdstypen Prosjekt (Test) bindes til den eksisterende porteføljelisten.
  - **Testsjekkliste** – egen liste med innholdstypen Testsjekkpunkt, versjonering, en sortert visning
    («Alle elementer»), en eksempelmappe og fem ferdige rader knyttet til prosjektfasene.
  - **Testbibliotek** – et dokumentbibliotek.
- **Filer**: `Testdokument.txt` lastes opp i Testbibliotek.
- **Egenskaper i property bag**: nøkkelen `GtTestPackage` settes til `pp-testprosjekt` (indeksert).

I **prosjektet** (`provisioning/template.json`):

- **Sitekolonne** `GtTestProjectNote` (notat) i gruppen «Kolonner for Prosjektportalen (Test)».
- **Innholdstype** **Testelement** (`0x01009A8EC06C79424B1B99D0FC4E61331392`) med feltene Title,
  `GtTestProjectNote` og hub-feltet `GtTestChoice`.
- **Liste** **Testprosjektliste** med innholdstypen Testelement, en visning og to eksempelrader.
- **Fil**: `Prosjektnotat.txt` lastes opp i Delte dokumenter.
- **Egenskap i property bag**: `GtTestProjectProvisioned` = `true`.

I tillegg utøver pakken disse mekanismene i installasjonsløypa:

- **Prosjekttillegg** (`provisioning/extensions/`): **Testforside** (valgfri, ikke standard valgt) og
  **Test venstremeny** (valgfri, standard valgt) – begge endrer kun navigasjonen (QuickLaunch).
- **Listeinnhold**: tre varianter som kopierer fasesjekkpunkter fra hub-listen **Testsjekkliste** til
  prosjektlisten **Fasesjekkliste** – en standard, en låst (kan ikke fravelges) og en skjult (vises ikke
  i veiviseren).
- **Standardinnhold**: obligatoriske testrader (`content/test-innhold-a.json` → **Testprosjektliste**) og
  valgfrie standardrader (`content/test-innhold-b.json` → standardlisten **Usikkerhet**).
- **Lokalisering**: full nb-NO/en-US-dekning av navn, beskrivelser, termer og listeinnhold.

## Taksonomi

Pakken oppretter tre termsett i den **eksisterende** termgruppen **Prosjektportalen**
(`c56bb677-f782-4cf6-a6d6-17685ee9f19d`) – gruppen gjenbrukes, den opprettes ikke på nytt:

1. **Fase (Test)** / «Phase (Test)» (`aaa3e3cc-1b49-4b06-b9f8-37ff111407f7`,
   `UpdateExistingTerms: true`) – fasetermsettet med termene Konsept, Planlegge, Gjennomføre, Avslutte og
   Realisere. De fleste termene bærer lokale termegenskaper (`PhaseLetter`, `PhaseSubText`,
   `PhaseDescription`); termen **Avslutte** har med vilje *ingen* egenskaper, slik at også den stien
   testes. Egenskapsverdiene er data og holdes på norsk i begge språkvarianter.
2. **Testkategori** / «Test Category» (`f11ebd26-1f9e-477c-b5f5-f84b241890e7`) – et enkelt termsett uten
   egenskaper (Kategori A/B/C).
3. **Testegenskaper** / «Test Properties» (`183cad74-32ab-4390-b270-a6ac16ca24d9`,
   `UpdateExistingTerms: true`) – termer med egenskaper (`Kode`, `Ansvarlig`), som tester
   tilbakefyllings-stien for eksisterende termer.

Fasetermsettet kobles til malen via manifestets `projectPhaseTermSetId`, og radene i Testsjekkliste
refererer faseverdiene gjennom standardfeltet `GtProjectPhase` (termId + label).

## Kjent begrensning – ingen egen managed metadata-sitekolonne

Pakken oppretter med vilje **ingen** egen `TaxonomyFieldType`-sitekolonne. sp-js-provisioning sin
TokenHelper har ikke et `sitecollectiontermstoreid`-token, så en managed metadata-sitekolonne kan ikke
provisjoneres på en pålitelig måte. I stedet brukes det utprøvde mønsteret fra **veiprosjekt**:

- nye termsett opprettes av Taxonomy-handleren,
- fasetermsettet kobles til via manifestets `projectPhaseTermSetId`,
- innholdstyper og lister refererer **standardfeltet** `GtProjectPhase`, og
- listerader bærer faseverdien som `GtProjectPhase: { "termId": "…", "label": "…" }`.

## Bygging

Pakken bygges sammen med de andre pakkene i hosting-katalogen fra rota av repoet:

```bash
npm run build:packages
```

Byggetrinnet validerer manifestet (JSON Schema, draft-07) og at alle refererte filer finnes –
`thumbnail.png`, skjermbildene under `assets/screenshots/`, begge hub- og prosjektmalene, begge
prosjekttilleggene, begge innholdsfilene og `CHANGELOG.md`. Alle `GtProjectPhase`-verdier i radene må
referere en term i fasetermsettet **Fase (Test)**.
