# Spesifikasjon: sp-js-provisioning

> Detaljert spesifikasjon for endringer i [sp-js-provisioning](https://github.com/AgoraIO-Community/sp-js-provisioning).
> Se [README.md](README.md) for overordnet spesifikasjon og bakgrunn.

---

## 1. Taxonomy-handler

### 1.1 Oversikt

sp-js-provisioning utvides med en intern **Taxonomy-handler** som provisjonerer termsett via Microsoft Graph API. Handleren aktiveres automatisk når en template inneholder en `Taxonomy`-seksjon, og kjøres som første steg – før `SiteFields` – slik at managed metadata-felter kan referere til termsett-IDer som nettopp er opprettet.

### 1.2 API-design

```typescript
import { provisionTemplate } from 'sp-js-provisioning';

// Hub-provisjonering: taxonomy + felter + innholdstyper + lister + filer
await provisionTemplate(hubContext, hubTemplateJson, {
  graphClient: msGraphClient,   // MSGraphClientV3 – påkrevd når Taxonomy-seksjon finnes
  onProgress: (message) => {
    console.log(message);
  }
});

// Prosjekt-provisjonering: felter + innholdstyper + lister + filer
await provisionTemplate(projectContext, projectTemplateJson);
```

Samme `provisionTemplate()`-funksjon brukes for både hub og prosjekt. Forskjellen er kun kontekst (hub-site vs prosjektområde) og at hub-templaten typisk har en `Taxonomy`-seksjon.

### 1.3 Options-utvidelse

```typescript
interface ProvisionOptions {
  graphClient?: MSGraphClientV3;  // Påkrevd hvis template har Taxonomy-seksjon
  onProgress?: (message: string) => void;
}
```

Dersom `Taxonomy`-seksjon finnes i templaten men `graphClient` ikke er satt, kastes en tydelig feil.

### 1.4 Underliggende API: Microsoft Graph Taxonomy

Handleren bruker Graph Taxonomy API:

```
GET    /sites/{siteId}/termStore/groups                          → Finn/opprett termgruppe
POST   /sites/{siteId}/termStore/groups                          → Opprett termgruppe
GET    /sites/{siteId}/termStore/groups/{groupId}/sets            → Finn eksisterende termsett
POST   /sites/{siteId}/termStore/groups/{groupId}/sets            → Opprett termsett (med fast ID)
GET    /sites/{siteId}/termStore/sets/{setId}/children            → List eksisterende termer
POST   /sites/{siteId}/termStore/sets/{setId}/children            → Opprett term (med fast ID)
PATCH  /sites/{siteId}/termStore/sets/{setId}/children/{termId}   → Oppdater term
```

Tilgjengelig fra SPFx via `MSGraphClientV3`. Krever `TermStore.ReadWrite.All` (delegated).

### 1.5 Intern flyt i Taxonomy-handleren

```
provisionTemplate(context, template, { graphClient })
│
├─ 0. Har template Taxonomy-seksjon?
│     Ja → kjør Taxonomy-handler (nedenfor)
│     Nei → hopp til SiteFields som vanlig
│
├─ 1. Hent term store for site
│     GET /sites/{siteId}/termStore
│
├─ 2. Finn eller opprett termgruppe
│     GET  .../termStore/groups → finn by name+id
│     POST .../termStore/groups → opprett hvis ikke finnes
│
├─ 3. For hvert termsett i definisjonen:
│     ├─ 3a. Sjekk om termsett finnes (by ID)
│     ├─ 3b. Opprett hvis ikke finnes
│     ├─ 3c. Oppdater hvis finnes og navn/beskrivelse er endret
│     └─ 3d. Synkroniser termer (rekursivt for hierarki)
│             ├─ Finnes med riktig ID? → Oppdater hvis endret
│             ├─ Finnes ikke? → Opprett med definert ID
│             └─ Finnes lokalt men ikke i pakken → Behold
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
┌─ provisionTemplate(hubContext, hubTemplate) ───────────────┐
│  1. Taxonomy     → Opprett termgruppe og termsett           │
│                    (med faste IDer, via Graph API)           │
│  2. Fields       → Opprett site columns                     │
│                    (managed metadata-felter refererer        │
│                     til termsett-IDer fra steg 1)            │
│  3. ContentTypes → Opprett innholdstyper                    │
│  4. Lists        → Opprett lister med innholdstyper         │
│  5. Files        → Kopier filer til hub                     │
└─────────────────────────────────────────────────────────────┘
         ↓  Fullført uten feil
┌─ provisionTemplate(projectContext, template) ──────────────┐
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
| Manglende `TermStore.ReadWrite.All` | Avbryt med tydelig melding: "Du trenger Term Store-tillatelser. Kontakt din IT-administrator." |
| Bruker er ikke Term Store Admin | Avbryt med melding om manglende rettigheter |
| Term store finnes ikke på site | Avbryt med forklaring |
| `Taxonomy`-seksjon uten `graphClient` | Kast feil: "graphClient er påkrevd for taxonomy-provisjonering" |
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

- [ ] Definere `Taxonomy`-seksjon i template JSON-format (TermGroup, TermSets, Terms med hierarki)
- [ ] Utvide `ProvisionOptions` interface med `graphClient` og `onProgress`
- [ ] Implementere Taxonomy-handler som første steg i `provisionTemplate()`:
  - [ ] Hent term store for site via Graph API
  - [ ] Finn eller opprett termgruppe (by name + id)
  - [ ] For hvert termsett: opprett eller oppdater (by ID)
  - [ ] Rekursiv synkronisering av termer (opprett nye, oppdater endrede, behold lokale)
- [ ] Implementere idempotens-logikk:
  - [ ] Sjekk eksistens by ID før opprettelse
  - [ ] Oppdater kun hvis navn/beskrivelse/sortOrder/customProperties er endret
  - [ ] Aldri slett termer som finnes lokalt men ikke i pakken
- [ ] Implementere feilhåndtering:
  - [ ] Tillatelsessjekk før start (TermStore.ReadWrite.All)
  - [ ] Tydelig feil ved manglende `graphClient` når `Taxonomy`-seksjon finnes
  - [ ] Rate limiting retry med eksponentiell backoff (maks 3)
  - [ ] Nettverksfeil retry (1 gang)
- [ ] Implementere `onProgress`-rapportering gjennom hele provisjoneringsflyten
- [ ] Skrive enhetstester for Taxonomy-handler:
  - [ ] Opprettelse av ny termgruppe og termsett
  - [ ] Oppdatering av eksisterende termsett (endret navn, nye termer)
  - [ ] Idempotens: re-kjøring uten endringer
  - [ ] Feilscenarier (manglende tillatelser, manglende graphClient)
- [ ] Oppdatere eksisterende `provisionTemplate()`-flyt til å sjekke for `Taxonomy`-seksjon
- [ ] Dokumentere nytt API og Taxonomy-format i bibliotekets README
