# Testprosjekt

Intern **testmal** for Prosjektportalen 365. Pakken finnes kun for å teste installasjonsløypa:
den inneholder med vilje *alle* funksjoner i pakkeformatet, slik at en endring i provisjoneringen
eller hosting-katalogen kan verifiseres mot en kjent referanse. Prosjektportalen 1.15 bruker ikke
alle ennå: en import stopper ved hub-filene, og prosjektmalen og standardinnholdet legges ikke på
prosjekter (se [Hva pakken tester i Prosjektportalen 1.15](#hva-pakken-tester-i-prosjektportalen-115)).

> [!WARNING]
> **Dette er ikke en reell prosjektmal.** Den skal ikke brukes til faktiske prosjekter. Malen er
> markert `cloudCompatible: false` fordi hub-malen har innhold som ikke settes opp ved
> tilgjengeliggjøring som skymal: filer, property bag-oppføringer og det frittstående biblioteket
> «Testbibliotek». (Taksonomi provisjoneres ved tilgjengeliggjøring fra Prosjektportalen ≥ 1.14 og
> er ikke lenger en blokker.) Bruk den kun til testing og QA.

| | |
| --- | --- |
| **ID** | `pp-testprosjekt` |
| **Type** | template |
| **Versjon** | 1.1.0 |
| **Minimum PP-versjon** | 1.14.0 |
| **Tagger** | test, alle-funksjoner, qa, intern |
| **Språk** | Norsk (nb-NO) og engelsk (en-US); prosjekttilleggene har norske titler på begge |
| **Skykompatibel** | Nei (`cloudCompatible: false` — hub-filer, property bag og «Testbibliotek» settes ikke opp ved tilgjengeliggjøring) |

## Hva pakken tester i Prosjektportalen 1.15

En import av pakken i Prosjektportalen 1.15 **stopper ved hub-filene**. Prosjektportalen legger
hub-malen (`provisioning/hub-template.json`, eller `hub-template.en-US.json` på en engelsk hub) på
hub-området med sp-js-provisioning 1.5.0 og en SPFx-kontekst, og med SPFx-kontekst avviser motoren
delene `Files` og `PropertyBagEntries`. Motoren kjører delene av malen i fast rekkefølge, så importen
kommer så langt:

1. **Taksonomi**: de tre termsettene (med mindre taksonomi er slått av for katalogen),
2. **Sitekolonner**,
3. **Innholdstyper**,
4. **Lister**: Prosjekter, Testsjekkliste og Testbibliotek, og
5. **Filer**: her stopper importen, og `Testdokument.txt` lastes ikke opp i Testbibliotek.

Steget **Provisjonerer hub** merkes som feilet, og importen ender med «Importen feilet» og
feilmeldingen `The Files handler is not supported with an SPFx context (config.spfxContext is set).`
Resten av importen kjøres ikke:

- `GtTestPackage` settes ikke i property bag (`PropertyBagEntries` kommer etter `Files` og ville
  stoppet importen på samme måte),
- prosjekttilleggene legges ikke i **Prosjekttillegg**,
- elementene i **Listeinnhold** lages ikke,
- prosjektmalen og innholdsfilene lagres ikke i `pp-packages/pp-testprosjekt` i **Malbibliotek**, og
- malen **Testprosjekt** legges ikke i **Maloppsett**, så den kan ikke velges i oppsettveiviseren.

Prosjektportalen 1.14 (sp-js-provisioning 1.3.15) stopper på samme sted, men der er feilmeldingen tom.

Heller ikke en import som gikk hele veien, ville gitt prosjekter pakkens innhold: Prosjektportalen 1.15
legger **ikke** pakkens prosjektmal (`provisioning/template.json`) eller standardinnholdet
(`content.items` i manifestet) på prosjekter. En importert mal peker i **Maloppsett** på
**Standardmal**, og prosjektmalen og innholdsfilene lagres bare på hub-området. Koblingen mellom en
importert mal og prosjektmalen i pakken kommer i en senere fase av Prosjektportalen. Pakken kan heller
ikke tilgjengeliggjøres som skymal (se advarselen over).

Pakken tester derfor i dag:

- **importen fram til hub-filene**: nedlastingen, manifestet, versjons- og kompatibilitetssjekken, og
  taksonomien, sitekolonnene, innholdstypene og listene i hub-malen (se
  [Hva pakken inneholder](#hva-pakken-inneholder)), og
- **at importen stopper** med en feil som sier hvilken del av hub-malen motoren ikke støtter.

Ikke testet i dag er hub-filen og property bag-oppføringen, det importen gjør etter hub-malen
(**Prosjekttillegg**, **Listeinnhold**, lagringen av prosjektmalen og **Maloppsett**),
oppsettveiviseren med malen Testprosjekt, og prosjektmalen og standardinnholdet.
[Navigasjonstesten](#navigasjonstest-prosjekttilleggene) krever at prosjekttilleggene lastes opp i
**Prosjekttillegg** for hånd.

Dette endrer seg når sp-js-provisioning støtter `Files` og `PropertyBagEntries` med SPFx-kontekst (når
motoren går bort fra JSOM): da går importen hele veien, og pakken tester også hub-filen, property
bag-oppføringen, **Prosjekttillegg**, **Listeinnhold** og **Maloppsett**. Derfor beholder hub-malen
filen og property bag-oppføringen.

## Tospråklig (norsk + engelsk)

Pakken inneholder **to språkvarianter** av provisjoneringen:

- `provisioning/hub-template.json` / `provisioning/template.json` – norsk (nb-NO)
- `provisioning/hub-template.en-US.json` / `provisioning/template.en-US.json` – engelsk (en-US)

Prosjektportalen oppdager hub-områdets språk ved import og bruker den matchende varianten (norsk hub →
norske felt-, liste- og innholdstypenavn + norske termer + «Testprosjekt» som mal; engelsk hub →
engelske navn + engelske termer + «Test Project»). Alle ID-er – termsett, termer, innholdstyper og felt –
er identiske i begge varianter, så de er idempotente.

Prosjekttilleggene finnes i én variant, fordi pakkeformatet ikke har språkvarianter for prosjekttillegg.
Menyene de lager, har norske titler også på en engelsk hub, men lenker bare til mål som finnes på begge
språk (se [Navigasjonstest](#navigasjonstest-prosjekttilleggene)).

## Hva pakken inneholder

På **hub-området** (`provisioning/hub-template.json`), som settes opp ved import. I Prosjektportalen
1.15 kommer importen til og med listene, og filen og property bag-oppføringen settes ikke opp (se
[Hva pakken tester i Prosjektportalen 1.15](#hva-pakken-tester-i-prosjektportalen-115)):

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
- **Filer**: `Testdokument.txt` i Testbibliotek. Her stopper en import i Prosjektportalen 1.15.
- **Egenskaper i property bag**: nøkkelen `GtTestPackage` med verdien `pp-testprosjekt` (indeksert).

**Prosjektmalen** (`provisioning/template.json`) beskriver følgende for prosjektområdet, men
Prosjektportalen 1.15 legger den ikke på prosjekter (se
[Hva pakken tester i Prosjektportalen 1.15](#hva-pakken-tester-i-prosjektportalen-115)):

- **Sitekolonne** `GtTestProjectNote` (notat) i gruppen «Kolonner for Prosjektportalen (Test)».
- **Innholdstype** **Testelement** (`0x01009A8EC06C79424B1B99D0FC4E61331392`) med feltene Title,
  `GtTestProjectNote` og hub-feltet `GtTestChoice`.
- **Liste** **Testprosjektliste** med innholdstypen Testelement, en visning og to eksempelrader.
- **Fil**: `Prosjektnotat.txt` i Delte dokumenter.
- **Egenskap i property bag**: `GtTestProjectProvisioned` = `true`.

I tillegg inneholder pakken:

- **Prosjekttillegg** (`provisioning/extensions/`): **Testforside** (valgfri, ikke standard valgt) og
  **Test venstremeny** (valgfri, standard valgt). En import som går hele veien, legger dem i
  **Prosjekttillegg** og kobler dem til malen; i Prosjektportalen 1.15 stopper importen før det. Begge
  endrer kun navigasjonen (QuickLaunch), se [Navigasjonstest](#navigasjonstest-prosjekttilleggene).
- **Listeinnhold**: tre elementer som importen lager i hub-listen **Listeinnhold** og kobler til malen
  (i Prosjektportalen 1.15 stopper importen før det). De kopierer fasesjekkpunkter fra hub-listen
  **Testsjekkliste** til prosjektlisten **Fasesjekkliste** – en standard, en låst (kan ikke fravelges)
  og en skjult (vises ikke i veiviseren).
- **Standardinnhold**: obligatoriske testrader (`content/test-innhold-a.json` → **Testprosjektliste**) og
  valgfrie standardrader (`content/test-innhold-b.json` → standardlisten **Usikkerhet**). Prosjektportalen
  1.15 legger ikke radene inn i prosjekter, og fordi importen stopper ved hub-filene, lagres heller ikke
  filene.
- **Lokalisering**: full nb-NO/en-US-dekning av navn, beskrivelser, termer og listeinnhold (ikke
  prosjekttilleggene, se over).

## Navigasjonstest (prosjekttilleggene)

De to prosjekttilleggene gir den samme venstremenyen og tester navigasjonen i sp-js-provisioning 1.5.0
(Prosjektportalen 1.15): et undernivå, `IgnoreExisting` og en ny kjøring som ikke endrer noe.

Testen krever at tilleggene ligger i **Prosjekttillegg** på hub-området. En import i Prosjektportalen
1.15 legger dem ikke der (se
[Hva pakken tester i Prosjektportalen 1.15](#hva-pakken-tester-i-prosjektportalen-115)), så i dag må
filene i `provisioning/extensions/` lastes opp dit for hånd.

| Menypunkt | Adresse | `IgnoreExisting` i Test venstremeny | `IgnoreExisting` i Testforside |
| --- | --- | --- | --- |
| Hjem | `""`: områdets adresse, som åpner forsiden | nei | nei |
| Testlenker | `http://linkless.header/` (overskrift uten lenke) | nei | nei |
| ↳ Testpakken | pakkens mappe på GitHub | **ja** | nei |
| ↳ Områdesider | `SitePages` | nei | nei |
| Områdeinnhold | `_layouts/15/viewlsts.aspx` | **ja** | nei |

Alle adressene finnes på alle prosjektområder, uansett språk og mal. Det er viktig fordi
**Test venstremeny** er forhåndsvalgt når importen legger det i Prosjekttillegg (`GtExtensionDefault`
gjelder alle maler på hub-området, ikke bare Testprosjekt): velg det bort når du setter opp andre
prosjekter på samme hub, ellers får de testmenyen. Menyen lenker ikke til **Testprosjektliste**:
Prosjektportalen 1.15 legger ikke prosjektmalen på prosjekter, så ingen prosjekter har den listen.

Dette kan kontrolleres på et nytt prosjekt, for eksempel med
`<prosjekt>/_api/web/navigation/quicklaunch?$expand=Children` før og etter hver kjøring:

1. **Første oppsett** med **Test venstremeny**: venstremenyen har nøyaktig punktene over, i den
   rekkefølgen, og SharePoints øvrige standardpunkter er borte. Der SharePoints egne punkter heter
   **Hjem** og **Områdeinnhold** (norsk), er det de samme punktene som før oppsettet (samme id). Heter de
   **Home** og **Site contents** (engelsk), slettes de, og **Hjem** og **Områdeinnhold** legges til.
2. **Kjør oppsettet på nytt** med samme valg: ingen punkter endres, legges til eller slettes, og alle
   beholder id-en.
3. **Endre adressen** til **Testpakken**, **Områdesider** og **Områdeinnhold** i menyen, og kjør
   oppsettet på nytt: **Testpakken** og **Områdeinnhold** får tilbake adressen fra tillegget
   (`IgnoreExisting`), mens **Områdesider** beholder den endrede adressen (et punkt som finnes fra før,
   beholder adressen sin, også på undernivå). Med **Testforside** alene beholder alle tre den endrede
   adressen.
4. **Begge tilleggene valgt**: menyen blir den samme som med **Test venstremeny** alene, uansett
   rekkefølgen de legges på i.

Med Prosjektportalen 1.14 (sp-js-provisioning 1.3.15) blir menyen den samme, men alle punktene slettes og
legges til på nytt ved hver kjøring, så punkt 2 og 3 gir ikke samme resultat der.

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

Fasetermsettet kobles til malen i **Maloppsett** via manifestets `projectPhaseTermSetId` (en import i
Prosjektportalen 1.15 stopper før Maloppsett), og radene i Testsjekkliste refererer faseverdiene gjennom
standardfeltet `GtProjectPhase` (termId + label).

## Kjent begrensning – ingen egen managed metadata-sitekolonne

Pakken oppretter med vilje **ingen** egen `TaxonomyFieldType`-sitekolonne. Slike kolonner kan
provisjoneres fra og med Prosjektportalen 1.14 (tokenet `{sitecollectiontermstoreid}`, se Fag/Emne
i **veiprosjekt**). Denne pakken holder seg til mønsteret som også virker uten taksonomikolonner:

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
