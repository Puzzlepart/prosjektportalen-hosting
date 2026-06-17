# Spesifikasjon: sp-js-provisioning

> Detaljert spesifikasjon for endringer i [sp-js-provisioning](https://github.com/AgoraIO-Community/sp-js-provisioning).
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
├─ 4. SiteFields (standard sp-js-provisioning)
├─ 5. ContentTypes
├─ 6. Lists
└─ 7. Files
```

---

## 2. Provisjoneringssekvens

Den fullstendige provisjoneringssekvensen ved malpakkeinstallasjon. Ansvaret for å kalle hub først og deretter prosjekt ligger hos SPFx-komponenten, som gir full kontroll over feilhåndtering mellom stegene.

```
┌─ WebProvisioner(hub).applyTemplate(hub-template) ──────────┐
│  1. Taxonomy     → Opprett termgruppe og termsett           │
│                    (med faste IDer, via JSOM)                │
│  2. Fields       → Opprett site columns                     │
│                    (managed metadata-felter refererer        │
│                     til termsett-IDer fra steg 1)            │
│  3. ContentTypes → Opprett innholdstyper                    │
│  4. Lists        → Opprett lister med innholdstyper         │
│  5. Files        → Kopier filer til hub                     │
└─────────────────────────────────────────────────────────────┘
         ↓  Fullført uten feil
┌─ WebProvisioner(prosjekt).applyTemplate(template) ─────────┐
│  6. Fields       → Opprett prosjekt-spesifikke felter       │
│  7. ContentTypes → Opprett innholdstyper                    │
│  8. Lists        → Opprett lister                           │
│  9. Content      → Kopier standardinnhold til lister        │
└─────────────────────────────────────────────────────────────┘
         ↓  Fullført uten feil
┌─ Pakkeinstallasjon (SPFx) ─────────────────────────────────┐
│  10. Extensions  → Kjør evt. prosjekttillegg                │
│  11. Metadata    → Oppdater Maloppsett + stemple område     │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Idempotens og oppdatering av termsett

Ved installasjon og oppdatering av malpakker må taxonomy-provisjoneringen håndtere at termsett allerede kan eksistere:

| Scenario | Oppførsel |
|---|---|
| Termsett finnes ikke | Opprett med definert ID |
| Termsett finnes med riktig ID | Oppdater navn/beskrivelse hvis endret. Legg til nye termer. |
| Term finnes med riktig ID | Oppdater navn/sortOrder/customProperties hvis endret |
| Term finnes lokalt men ikke i pakken | **Behold** – kunden kan ha lagt til egne termer |
| Termgruppe finnes ikke | Opprett med definert ID |
| Termgruppe finnes | Bruk eksisterende |

Prinsipp: *Additivt og ikke-destruktivt.* Pakken legger til og oppdaterer, men sletter aldri termer som allerede finnes – kunden kan ha utvidet termsettet lokalt.

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
