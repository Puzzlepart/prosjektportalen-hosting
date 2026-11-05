# Spesifikasjon: sp-js-provisioning

> Detaljert spesifikasjon for endringer i [sp-js-provisioning](https://github.com/Puzzlepart/sp-js-provisioning).
> Rekkefølgen, feilene og oppdateringen av eksisterende innhold (kapittel 2 og 3) gjelder versjon 1.5.0, som tas i bruk i Prosjektportalen 1.15.
> Se [README.md](README.md) for overordnet spesifikasjon og bakgrunn.

---

## 1. Taxonomy-handler

### 1.1 Oversikt

sp-js-provisioning har en intern **Taxonomy-handler** som provisjonerer termgruppe, termsett og termer i termlageret til standard områdesamling via **SharePoint JSOM** (`spfx-jsom`), slik at de eksplisitte termsett-/term-GUID-ene fra templaten bevares. Handleren aktiveres automatisk når en template inneholder en `Taxonomy`-seksjon, og kjøres som første steg – før `SiteFields` – slik at managed metadata-felter kan referere til termsett-IDer som nettopp er opprettet.

### 1.2 API

Hub-provisjonering kjøres via `WebProvisioner` (samme mekanisme som prosjekt-provisjonering – forskjellen er kun konteksten: hub-område vs. prosjektområde, og at hub-templaten typisk har en `Taxonomy`-seksjon):

```typescript
import { WebProvisioner } from 'sp-js-provisioning'

const provisioner = new WebProvisioner(web).setup({
  spfxContext // SPFx-kontekst – brukes til å initialisere JSOM (SP.Taxonomy)
})
await provisioner.applyTemplate(hubTemplateJson, null, (handler) => {
  console.log(`Applying handler ${handler}`)
})
```

### 1.3 Konfigurasjon

Taxonomy-handleren bygger sin egen JSOM-kontekst fra `spfxContext` (via `initSpfxJsom(..., { loadTaxonomy: true })`) og skriver til termlageret som den innloggede brukeren har tilgang til. Det kreves **ingen** `graphClient` / Microsoft Graph-tilgang.

### 1.4 Underliggende API: SharePoint JSOM (SP.Taxonomy)

Handleren bruker JSOM (lastet via `spfx-jsom` med `loadTaxonomy: true`) mot termlageret i standard områdesamling, slik at termsett og termer opprettes med **faste GUID-er** fra templaten:

```
termStore.getGroup(id)   / termStore.createGroup(name, id)        → Finn/opprett termgruppe
termStore.getTermSet(id) / group.createTermSet(name, id, lcid)    → Finn/opprett termsett
termStore.getTerm(id)    / termSet.createTerm(name, lcid, id)     → Finn/opprett term
term.setCustomProperty(...) / termSet.set_customSortOrder(...)    → Egenskaper og sortering
termStore.commitAll() + ExecuteJsomQuery(...)                     → Utfør ventende endringer
```

Tilgangen styres av brukerens rolle i termlageret (se [4. Tillatelser](#4-tillatelser)) — ingen Graph-scope (`TermStore.ReadWrite.All`) er nødvendig.

### 1.5 Intern flyt i Taxonomy-handleren

```
applyTemplate(template)  // Taxonomy kjøres først (handler-rekkefølge -1)
│
├─ 0. Har template Taxonomy-seksjon?
│     Ja → kjør Taxonomy-handler (nedenfor)
│     Nei → hopp til SiteFields som vanlig
│
├─ 1. Init JSOM + hent standard termlager (defaultTermStore), les defaultLanguage (lcid)
│
├─ 2. ensureGroup(TermGroup)
│     getGroup(id) finnes? → bruk eksisterende
│     ellers → createGroup(name, id) + commitAll
│
├─ 3. For hvert termsett:
│     ├─ 3a. ensureTermSet: getTermSet(id) finnes? → bruk; ellers createTermSet(name, id, lcid)
│     ├─ 3b. ensureTerms: for hver term – getTerm(id) finnes?
│     │       ├─ Ja  → behold (legg evt. til manglende customProperties hvis UpdateExistingTerms)
│     │       └─ Nei → createTerm(name, lcid, id) + customProperties
│     └─ 3c. applySortOrder (customSortOrder fra term.SortOrder)
│
├─ 4. Lister templaten har, og som en områdekolonne peker på med {listid:},
│     opprettes rett før SiteFields (fra 1.5.0)
│
└─ 5. Resten i motorens rekkefølge: SiteFields, ContentTypes, Features,
      Security, Lists, Files, … (se 2.1)
```

---

## 2. Provisjoneringssekvens

Huben provisjoneres når en malpakke importeres eller oppdateres i Malpakkekatalogen. Prosjektområdet provisjoneres senere, hver gang oppsettveiviseren kjøres for et prosjekt. Det er SPFx-komponentene i Prosjektportalen som kaller motoren, og de bestemmer hva en feil motoren har logget, skal bety for brukeren (se [2.2](#22-feil-som-logges-og-feil-som-stopper-kjøringen)).

```
Import eller oppdatering av malpakken (Malpakkekatalog, på huben)

┌─ WebProvisioner(hub).applyTemplate(hub-template) ───────────┐
│  1. Taxonomy     → Termgruppe og termsett med faste IDer    │
│                    (via JSOM)                               │
│  2. SiteFields   → Opprett eller oppdater områdekolonner    │
│                    (managed metadata-felter refererer       │
│                     til termsett-IDer fra steg 1)           │
│  3. ContentTypes → Opprett eller oppdater innholdstyper     │
│  4. Features og Security, når templaten har dem             │
│  5. Lists        → Lister, listefelter, visninger, DataRows │
│  6. Files        → Stopper når motoren har SPFx-kontekst,   │
│                    som i Prosjektportalen (se 2.2)          │
└─────────────────────────────────────────────────────────────┘
         ↓  Ferdig, men kan ha logget feil (se 2.2)
┌─ Pakkeinstallasjon (SPFx) ──────────────────────────────────┐
│  7. Extensions   → Prosjekttillegg lastes opp, stemplet     │
│  8. Listeinnhold → Listeinnhold-elementer på huben          │
│  9. Metadata     → Malfilen lagres, Maloppsett oppdateres   │
└─────────────────────────────────────────────────────────────┘

Oppsett av et prosjektområde (oppsettveiviseren, per prosjekt)

┌─ WebProvisioner(prosjekt).applyTemplate(...) ───────────────┐
│  10. Mal         → Lists, ClientSidePages, Navigation,      │
│                    WebSettings, … i motorens rekkefølge     │
│  11. Tillegg     → Hvert valgte prosjekttillegg, med samme  │
│                    provisioner                              │
└─────────────────────────────────────────────────────────────┘
         ↓  Ferdig, men kan ha logget feil (se 2.2)
┌─ Standardinnhold (SPFx) ────────────────────────────────────┐
│  12. Content     → Listeinnhold kopieres til prosjektlister │
│                    (skymal: DataRows, matchet på KeyColumn) │
└─────────────────────────────────────────────────────────────┘
```

En skymal (Modus B) legger bare hubavhengighetene på når den tilgjengeliggjøres: `Taxonomy`, `SiteFields`, `ContentTypes`, innholdstypebindinger og konfigurasjonsrader (se [docs/CLOUD-TEMPLATE-COMPATIBILITY.md](docs/CLOUD-TEMPLATE-COMPATIBILITY.md)). Prosjektmalen, tilleggene og standardinnholdet hentes fra `.pppkg` ved oppsett.

### 2.1 Rekkefølgen i motoren

`applyTemplate` kjører seksjonene templaten har, i rekkefølgen fra `DefaultHandlerSort` i [`src/handlers/exports.ts`](https://github.com/Puzzlepart/sp-js-provisioning/blob/main/src/handlers/exports.ts). En seksjon motoren ikke kjenner, hoppes over.

| Rekkefølge | Handler | Gjør |
|---:|---|---|
| -1 | `Taxonomy` | Termgruppe, termsett og termer med faste IDer (JSOM) |
| (før 0) | – | Lister templaten har, og som en områdekolonne peker på med `{listid:}`, opprettes rett før `SiteFields`, så kolonnen kan peke på dem (fra 1.5.0) |
| 0 | `SiteFields` | Områdekolonner |
| 1 | `ContentTypes` | Innholdstyper (JSOM) |
| 2 | `Features` | Funksjoner på området |
| 2.5 | `Security` | SharePoint-grupper og tillatelser på området (nytt i 1.5.0), rett før `Lists` så listenes tillatelser kan gis til gruppene |
| 3 | `Lists` | Lister, innholdstyper på listene, listefelter, visninger, tillatelser, `DataRows` og `Folders` |
| 4 | `Files` | Filer og klassiske sider |
| 5 | `CustomActions` | Egendefinerte handlinger |
| 6 | `ComposedLook` | Tema |
| 7 | `ClientSidePages` | Moderne sider |
| 8 | `PropertyBagEntries` | Egenskaper på området |
| 9 | `Navigation` | Hurtigstart og toppnavigasjon |
| 10 | `WebSettings` | Velkomstside og andre innstillinger for området |
| 11 | `Hooks` | Kall til eksterne endepunkter |

### 2.2 Feil som logges, og feil som stopper kjøringen

Motoren skiller mellom to slags feil:

- **Logges, og kjøringen fortsetter.** Fra 1.5.0 logges en feil i én kolonne, én visning eller én rad som `Error` (i `@pnp/logging`), og resten av templaten legges på. Det gjelder en områdekolonne SharePoint avviser, en kolonne-ID som en annen kolonne bruker, et token som ikke kan løses i en områdekolonne, et listefelt, feltene i en visning, en innholdstypebinding, en `FieldRef` til en kolonne som ikke finnes, en rad i `DataRows` og en oppslags- eller personverdi som ikke finnes. Før 1.5.0 stoppet en områdekolonne som SharePoint avviste, hele kjøringen, mens flere av de andre bare ble logget som informasjon. Det motoren lar stå med vilje, som en typeendring den ikke gjør eller en rad uten nøkkel, logges som `Warning`.
- **Stopper kjøringen.** Handleren kaster en feil, `applyTemplate` avvises med `ProvisioningError`, som navngir handleren, og handlerne etter den kjøres ikke. Det gjelder et menypunkt SharePoint avviser fordi målet ikke finnes (menyen blir stående som den var, og feilen navngir punktet og adressen), `Files` og `PropertyBagEntries` når motoren kjøres med SPFx-kontekst, slik Prosjektportalen gjør, og feil en handler ikke fanger selv, for eksempel en innholdstype som viser til en kolonne området mangler, eller `Taxonomy` uten skrivetilgang til termlageret.

At `applyTemplate` blir ferdig, betyr altså ikke at alt ble lagt på uten feil. Den som kaller motoren, må samle feilene som logges. Prosjektportalen 1.15 (med sp-js-provisioning 1.5.0) gjør det slik:

- **Malpakkekatalogen:** En import eller oppdatering der provisjoneringen av huben logget feil, avsluttes med en advarsel i stedet for å meldes som vellykket. Steget viser antall feil, og feilene står i den avanserte loggen. «Tilgjengeliggjør som skymal» viser feilene i meldingen.
- **Oppsettveiviseren:** Feil og advarsler fra motoren vises i den avanserte loggen, under steget de hører til, og et steg som logget feil, vises som «fullført med advarsler». Oppsettet avsluttes med en advarsel som sier hvor mange feil som ble logget, og feilene skrives til loggen på porteføljeområdet.

En feil som stopper kjøringen, stopper importen eller oppsettet med en feilmelding, som før. Eldre versjoner av Prosjektportalen melder en import som vellykket og et oppsett som fullført når `applyTemplate` blir ferdig, uansett hva motoren har logget.

---

## 3. Idempotens og oppdatering

Ved installasjon og oppdatering av malpakker legges `hub-template.json` på huben på nytt, og når oppsettveiviseren kjøres på nytt, legges malen og prosjekttilleggene på prosjektområdet på nytt. Fra sp-js-provisioning 1.5.0 oppdateres det som finnes, der det står, i stedet for å slettes og opprettes på nytt. Tabellene under viser hva en ny kjøring beholder, erstatter, advarer om (`Warning`) og logger som feil (`Error`). Detaljene står i motorens spesifikasjoner for [områdekolonner](https://github.com/Puzzlepart/sp-js-provisioning/blob/main/docs/specs/sitefields-re-apply.md), [lister og `DataRows`](https://github.com/Puzzlepart/sp-js-provisioning/blob/main/docs/specs/lists-re-apply.md) og [navigasjon](https://github.com/Puzzlepart/sp-js-provisioning/blob/main/docs/specs/navigation-re-apply.md).

Prosjektportalen 1.14 og eldre har en eldre motor (1.14 har sp-js-provisioning 1.3.15), som slettet og opprettet listefelter på nytt (verdiene gikk tapt), skrev hver områdekolonne om med templatens XML og slettet hele menyen før den la den inn igjen.

### 3.1 Termsett (`Taxonomy`)

Taxonomy-provisjoneringen må håndtere at termsett allerede kan eksistere:

| Scenario | Oppførsel |
|---|---|
| Termsett finnes ikke | Opprett med definert ID |
| Termsett finnes med riktig ID | Oppdater navn/beskrivelse hvis endret. Legg til nye termer. |
| Term finnes med riktig ID | Oppdater navn/sortOrder/customProperties hvis endret |
| Term finnes lokalt men ikke i pakken | **Behold** – kunden kan ha lagt til egne termer |
| Termgruppe finnes ikke | Opprett med definert ID |
| Termgruppe finnes | Bruk eksisterende |

Prinsipp: *Additivt og ikke-destruktivt.* Pakken legger til og oppdaterer, men sletter aldri termer som allerede finnes – kunden kan ha utvidet termsettet lokalt.

### 3.2 Områdekolonner (`SiteFields`)

Templaten flettes inn i kolonnen slik den er lagret, og kolonnen skrives bare når noe endres ([spesifikasjon](https://github.com/Puzzlepart/sp-js-provisioning/blob/main/docs/specs/sitefields-re-apply.md)).

| Utfall | Ved ny kjøring |
|---|---|
| **Beholdes** | Kolonnens ID og det templaten ikke oppgir, som indeks, formatering og beskrivelse en administrator har satt. En kolonne templaten ikke endrer noe i, skrives ikke. Kopiene av kolonnen i lister endres ikke: motoren sender ikke endringer videre til listene. |
| **Erstattes** | Attributter templaten oppgir, også tomme: `Description=""` eller `CustomFormatter=""` tømmer det en administrator har satt, ved hver import. Barneelementer templaten har (`CHOICES`, `Default`, `Formula`), erstatter de lagrede, så valg en administrator har lagt til, forsvinner. En utvidende typeendring (`Text` → `Note`, `Lookup` → `LookupMulti`, `User` → `UserMulti`). Et mål som en tidligere kjøring lagret som et uløst token, rettes. |
| **Advarsel** | En annen typeendring: kolonnen beholder typen. Et nytt mål for en oppslags- eller taksonomikolonne (liste, termsett eller termlager): det lagrede målet beholdes, med mindre kolonnen ble opprettet i samme oppsett. Samme interne navn med en annen ID: kolonnen oppdateres og beholder sin ID. På et underområde: en kolonne et overordnet område har, røres ikke. |
| **Feil** | En kolonne SharePoint avviser. En kolonne med templatens ID under et annet internt navn (den opprettes ikke). Et kjent token som ikke kan løses, for eksempel `{listid:X}` for en liste templaten ikke har; peker kolonnen på en liste i samme template, opprettes listen før `SiteFields`. Kjøringen fortsetter i alle tilfellene. |

### 3.3 Lister og listefelter (`Lists`)

Et listefelt som finnes, oppdateres der det står og slettes aldri ([spesifikasjon](https://github.com/Puzzlepart/sp-js-provisioning/blob/main/docs/specs/lists-re-apply.md)).

| Utfall | Ved ny kjøring |
|---|---|
| **Beholdes** | Verdiene i listefeltene, feltenes plass i visninger og innholdstyper, og det templaten ikke oppgir for et felt. Listeinnstillinger templaten ikke oppgir (`Description`, `ContentTypesEnabled`). Visninger og innholdstyper templaten ikke nevner: `RemoveExistingViews` og `RemoveExistingContentTypes` virker bare på lister som ble opprettet i samme oppsett (prosjekttilleggene i samme kjøring av oppsettveiviseren regnes med). Tillatelsene på en liste med egne tillatelser: arv brytes bare på en liste som fortsatt arver, og rolletildelinger legges til. |
| **Erstattes** | Attributter og barneelementer templaten oppgir for et felt (`CHOICES`, `Default`, `Formula`, `Validation`), og en utvidende typeendring. Listeinnstillinger templaten oppgir, ved hver kjøring: `"Description": ""` tømmer listens beskrivelse. En visning templaten nevner, får templatens innstillinger, og feltene i den settes når de avviker fra templatens. |
| **Advarsel** | En annen typeendring: feltet står som det er. Et nytt mål for et oppslags- eller taksonomifelt på en liste som ikke ble opprettet i samme oppsett: det lagrede målet beholdes. Et internt navn som finnes med en annen ID: feltet opprettes ikke. En innholdstype som er i bruk og ikke kan fjernes. |
| **Feil** | Et listefelt SharePoint avviser. Et felt som ikke kan legges i en visning (de andre legges inn). En innholdstypebinding som feiler. En `FieldRef` til en kolonne som verken listen eller området har. Kjøringen fortsetter. |

### 3.4 Standardinnhold (`DataRows`)

En rad matches mot elementene i listen på `KeyColumn`, med tokens erstattet ([spesifikasjon](https://github.com/Puzzlepart/sp-js-provisioning/blob/main/docs/specs/lists-re-apply.md)).

| Utfall | Ved ny kjøring |
|---|---|
| **Beholdes** | Et element som matcher nøkkelen, når `DataRows` har `UpdateBehavior: "Skip"`. Elementer templaten ikke har, slettes aldri. Et eksisterende element beholder verdien i en oppslags- eller personkolonne når radens verdi ikke finnes. |
| **Erstattes** | Med `UpdateBehavior: "Overwrite"` (standard) oppdateres elementet som matcher nøkkelen, med radens verdier. En rad uten treff legges til. |
| **Advarsel** | En rad uten verdi i nøkkelkolonnen: den legges til ved hver kjøring. Flere elementer med samme nøkkel: det første oppdateres. |
| **Feil** | En rad SharePoint avviser (de andre radene legges inn). En oppslags- eller personverdi som ikke finnes: et nytt element får verdiene som ble funnet. En termverdi uten `termId` eller `label`. |

**Standardinnhold i en skymal.** Oppsettveiviseren kopierer radene fra pakken med `DataRows` på prosjektområdet, så nøkkelen gjelder der også. Har `fields` i `listContent` en liste med kolonner, må nøkkelkolonnen (`KeyColumn`, ellers `Title`) være med: Prosjektportalen før 1.15 tar bare med kolonnene i `fields`, og da legges radene til på nytt hver gang oppsettveiviseren kjøres. Fra 1.15 tas nøkkelen alltid med når prosjektlisten har kolonnen. Har den ikke det, kopieres radene uten nøkkel (de legges til på nytt ved hver kjøring, som før 1.15), og oppsettet logger en advarsel som navngir listen og kolonnen. Nøkkelkolonnen bør derfor finnes både i `fields` og på prosjektlisten. `npm run validate` advarer når nøkkelen mangler i `fields`.

### 3.5 Navigasjon (`Navigation`)

Menyen stemmes av mot templaten der den står, i stedet for å slettes og legges inn på nytt ([spesifikasjon](https://github.com/Puzzlepart/sp-js-provisioning/blob/main/docs/specs/navigation-re-apply.md)).

| Utfall | Ved ny kjøring |
|---|---|
| **Beholdes** | Et menypunkt med nøyaktig samme tittel (også store og små bokstaver) på samme nivå beholdes med ID, målgrupper og lagret adresse. Ingenting skrives for det, så en uendret kjøring endrer ikke menyen. |
| **Erstattes** | Manglende punkter legges til, punkter templaten ikke har, slettes (også lenker eierne har lagt til, med underpunktene sine), og punktene flyttes i templatens rekkefølge. Et beholdt punkt får templatens adresse bare med `IgnoreExisting: true`, og bare når adressen avviker. |
| **Advarsel** | Ingen. |
| **Feil** | Et punkt SharePoint avviser fordi adressen peker på noe som ikke finnes, **stopper kjøringen**: punktene kjøringen la til eller endret, tilbakestilles, menyen blir stående som den var, og feilen navngir punktet og adressen. En sletting eller flytting som feiler, stopper også kjøringen, og da er menyen bare delvis avstemt. |

- Titlene matches på språket til kontoen som kjører oppsettet. SharePoints egne `Hjem` og `Dokumenter` matcher en norsk mal bare for en konto med norsk språk; ellers legges malens punkt til og SharePoints slettes. Et punkt motoren har lagt til, har samme tittel på alle språk.
- Prosjektportalen 1.15: Har et valgt prosjekttillegg sin egen `QuickLaunch` eller `TopNavigationBar`, legges ikke malens tilsvarende meny på før tillegget. `Kjør oppsettveiviser` legger tilbake menypunktene eierne hadde lagt til selv.
- Ikke legg `Navigation` i `hub-template.json`: motoren ville stemt av hubens meny mot pakkens punkter og slettet resten. Toppnavigasjonen på en hub er hubnavigasjonen for alle tilknyttede områder.

### 3.6 Én pakke, flere versjoner av Prosjektportalen (`minPPVersion`)

En pakke inneholder bare maler. Motoren som tolker dem, følger med Prosjektportalen, og katalogen hentes fra `catalog.json` på `main` i dette repoet. En ny pakkeversjon er derfor straks tilgjengelig for alle installasjoner med minst pakkens `minPPVersion`, og hver installasjon legger den på med sin egen motor:

| Prosjektportalen | sp-js-provisioning |
|---|---|
| 1.14.x | 1.3.15 |
| 1.15 | 1.5.0 |

Tommelfingerregelen for pakkeforfattere:

- **En pakke med `minPPVersion: 1.14.0` må virke med motoren i 1.14 (1.3.15).** Den kan godt dra nytte av det 1.5.0 gjør bedre, men den kan ikke være avhengig av det. Det som bare virker fra 1.15:
  - at et attributt eller en listeinnstilling templaten ikke oppgir, beholdes (1.3.15 skriver hele områdekolonnen og listeinnstillingene på nytt ved hver import);
  - at listefelter oppdateres der de står (1.3.15 sletter og oppretter dem på nytt, og verdiene går tapt);
  - `{listid:X}` i en områdekolonne som peker på en liste i samme template (1.3.15 lagrer tokenet som tekst ved første kjøring);
  - `IgnoreExisting` og regelen om lagret adresse på undernoder i menyen (1.3.15 bruker dem bare på øverste nivå, sletter hele menyen og legger den inn på nytt ved hver kjøring);
  - at `RemoveExistingViews` og `RemoveExistingContentTypes` bare virker på lister opprettet i samme oppsett (1.3.15 fjerner visningene og innholdstypene ved hver kjøring);
  - at en områdekolonne, et listefelt eller en rad SharePoint avviser, logges og hoppes over (i 1.3.15 stopper en områdekolonne som feiler, hele kjøringen).
- **Trenger pakken noe av dette for å virke riktig, settes `minPPVersion: 1.15.0`.** Da viser katalogen i 1.14 merket «Krever Prosjektportalen 1.15.0» på pakken, og filteret for kompatible pakker skjuler den.
- **Unngå det som er skadelig i begge versjonene:** tomme attributter og innstillinger (`Description=""`, `CustomFormatter=""`, `"Description": ""`) tømmer det en administrator har satt, ved hver import. En `KeyColumn` som prosjektlisten ikke har, eller som mangler i `listContent`-feltet `fields`, gjør at standardinnholdet legges til på nytt ved hver kjøring av oppsettveiviseren. `Files` og `PropertyBagEntries` i `hub-template.json` stopper importen i begge versjonene (se `docs/CLOUD-TEMPLATE-COMPATIBILITY.md`).
- **Skriv i pakkens CHANGELOG hvilken versjon av Prosjektportalen en rettelse gjelder fra**, når den bare virker med den nyere motoren.

---

## 4. Tillatelser

Taxonomy-provisjonering krever at brukeren som installerer malpakken har tilstrekkelige rettigheter:

- **Term Store Administrator** – kan opprette termgrupper og termsett
- **Term Group Contributor** – kan opprette termsett og termer innenfor en eksisterende gruppe

SPFx-komponenten bør sjekke tilgangsnivå før taxonomy-provisjonering starter, og gi en tydelig feilmelding dersom brukeren mangler rettigheter.

---

## 5. Feilhåndtering

| Feil | Håndtering |
|---|---|
| Manglende skrivetilgang til termlageret | Avbryt med tydelig melding: "Du trenger Term Store-tillatelser. Kontakt din IT-administrator." |
| Bruker er ikke Term Store-administrator / gruppebidragsyter | Avbryt med melding om manglende rettigheter |
| Standard termlager finnes ikke på området | Kast feil: "No default site collection term store is available." |
| Rate limiting (429) | Retry med eksponentiell backoff (maks 3 forsøk) |
| Nettverksfeil | Retry en gang, deretter avbryt med feilmelding |
| Termsett-ID-konflikt (annen termgruppe) | Logg advarsel, forsøk å bruke eksisterende |

---

## 6. Logging og fremdrift

Handleren rapporterer fremdrift via `onProgress`-callback:

```
Oppretter termgruppe "Prosjektportalen"...
Termsett "Prosjektfaser" – oppretter 4 termer...
Termsett "Prosjekttype" – finnes allerede, oppdaterer 1 term...
Taxonomy-provisjonering fullført (2 termsett, 6 termer)
Provisjonerer felter...
Provisjonerer innholdstyper...
...
```

---

## Oppgaver

### Fase 1 – Taxonomy-handler

> Implementert i `sp-js-provisioning` 1.3.12 som en JSOM-basert handler. Listen under reflekterer den faktiske implementasjonen (ikke det opprinnelige Graph-baserte utkastet).

- [ ] Definere `Taxonomy`-seksjon i template JSON-format (TermGroup, TermSets, Terms med hierarki)
- [ ] Konfigurere handleren via `spfxContext` (JSOM) og `onProgress`-callback
- [ ] Implementere Taxonomy-handler som kjøres først i `applyTemplate()`:
  - [ ] Hent standard termlager (defaultTermStore) via spfx-jsom (`initSpfxJsom({ loadTaxonomy: true })`)
  - [ ] Finn eller opprett termgruppe (by id)
  - [ ] For hvert termsett: opprett med fast ID hvis det ikke finnes
  - [ ] Synkronisering av termer (opprett nye med fast ID, behold eksisterende)
- [ ] Implementere idempotens-logikk:
  - [ ] Sjekk eksistens by ID før opprettelse
  - [ ] Aldri slett termer som finnes lokalt men ikke i pakken
- [ ] Implementere feilhåndtering:
  - [ ] Tillatelsessjekk før start (skrivetilgang til termlageret — gjøres i SPFx-komponenten)
  - [ ] Tydelig feil når standard termlager mangler
- [ ] Implementere `onProgress`-rapportering via handler-callback i `applyTemplate`
- [ ] Skrive enhetstester for Taxonomy-handler:
  - [ ] Opprettelse av ny termgruppe og termsett
  - [ ] Oppdatering av eksisterende termsett (endret navn, nye termer)
  - [ ] Idempotens: re-kjøring uten endringer
  - [ ] Feilscenarier (manglende tillatelser, manglende termlager)
- [ ] Oppdatere `applyTemplate()`-flyt til å kjøre Taxonomy først når `Taxonomy`-seksjon finnes
- [ ] Dokumentere API og Taxonomy-format i bibliotekets README
