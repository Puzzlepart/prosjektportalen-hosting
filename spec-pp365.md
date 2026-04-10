# Spesifikasjon: prosjektportalen365

> Detaljert spesifikasjon for endringer i [prosjektportalen365](https://github.com/Puzzlepart/prosjektportalen365).
> Se [README.md](README.md) for overordnet spesifikasjon og bakgrunn.

---

## 1. SPFx-komponent – Malpakkekatalog

### 1.1 Oversikt

En ny SPFx-komponent (ListView Command Set) på **Maloppsett**-listen gir administratorer tilgang til malpakkekatalogen. Komponenten viser også status for eksisterende maler.

### 1.2 Maloversikt på Maloppsett

Eksisterende Maloppsett-visning berikes med visuell indikasjon av maltype:

| Mal | Type | Versjon | Status |
|---|---|---|---|
| Intern prosjektmal | Lokal | – | – |
| Standard prosjektmal | Importert | v1.1.0 | v1.2.0 tilgjengelig |
| Byggeprosjekt | Sentral | v2.0.0 | Oppdatert |

### 1.3 Katalog-wizard

Wizarden er designet for administratorer som ikke nødvendigvis er tekniske. Fokus på visuell fremstilling, gode beskrivelser og bilder.

```
┌────────────────────────────────────────────────────────────┐
│  Malpakkekatalog                                    [X]    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Sok / filtrer       [Maler] [Utvidelser] [Alle]           │
│                                                            │
│  ┌─────────────────────┐  ┌─────────────────────┐         │
│  │                     │  │                     │         │
│  │    [thumbnail]      │  │    [thumbnail]      │         │
│  │                     │  │                     │         │
│  │  Standard           │  │  Byggeprosjekt      │         │
│  │  prosjektmal        │  │                     │         │
│  │                     │  │  Komplett mal for    │         │
│  │  Den mest brukte    │  │  bygge- og anleggs-  │         │
│  │  malen for vanlige  │  │  prosjekter          │         │
│  │  prosjekter         │  │                     │         │
│  │                     │  │  v2.0.0              │         │
│  │  v1.2.0             │  │  [Se detaljer]       │         │
│  │  Importert v1.1     │  │                     │         │
│  │  Oppdatering!       │  │                     │         │
│  └─────────────────────┘  └─────────────────────┘         │
│                                                            │
└────────────────────────────────────────────────────────────┘

         │ Klikk på pakke
         v

┌────────────────────────────────────────────────────────────┐
│  <- Tilbake    Standard prosjektmal               [X]      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │          [Stort thumbnail / skjermbilder]          │    │
│  └────────────────────────────────────────────────────┘    │
│                                                            │
│  Den mest brukte malen for vanlige prosjekter i            │
│  Prosjektportalen. Inkluderer fasesjekkliste med 12        │
│  sjekkpunkter, standardoppgaver i Planner, og              │
│  grunnleggende lister for prosjektstyring.                 │
│                                                            │
│  Versjon: 1.2.0         Utgiver: Puzzlepart                │
│  Krever: Prosjektportalen 1.10.0+                          │
│                                                            │
│  -- Dette far du ---------------------------------         │
│  Prosjektoppsett med faseinndeling                         │
│  Fasesjekkliste – 12 sjekkpunkter                          │
│  Planneroppgaver – 8 standardoppgaver                      │
│  Dokumentmaler for prosjektrapporter                       │
│  Termsett: Prosjektfaser, Prosjekttype                     │
│  Kvalitetssikring (valgfritt tillegg)                      │
│  -------------------------------------------------         │
│                                                            │
│  -- Nyheter i denne versjonen --------------------         │
│  v1.2.0 – Ny fasesjekkliste, oppdaterte                   │
│           Planner-oppgaver, ny dokumentmal                 │
│  v1.1.0 – Lagt til kvalitetssikring-tillegg               │
│  -------------------------------------------------         │
│                                                            │
│  [Importer til hub]  [Bruk som sentral mal]                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 1.4 Installasjonsmoduser

#### Modus A: Importert mal

1. `.pppkg` lastes ned fra GitHub
2. Pakken pakkes ut og innholdet provisjoneres:
   a. **`provisionTemplate(hubContext, hubTemplate, { graphClient })`** → Taxonomy, felter, innholdstyper, lister og filer provisjoneres på hub
   b. **`provisionTemplate(projectContext, template)`** → Prosjekt-level provisjonering
   c. **Prosjekttillegg** → Legges i Prosjekttillegg-listen
   d. **Standardinnhold** → Kopieres til relevante lister
3. Maloppsett-element opprettes/oppdateres med `PpPkgType = Importert` og versjonsinformasjon
4. Malen er nå tilgjengelig i oppsettveiviseren som en lokal kopi

#### Modus B: Sentral mal

1. Admin velger "Bruk som sentral mal" i katalogen
2. Et Maloppsett-element opprettes med `PpPkgType = Sentral` og peker til hosting-repoet
3. **Ingen lokal kopi** av malinnhold – alt hentes fra repo ved provisjonering
4. Malen er nå tilgjengelig i oppsettveiviseren for brukere
5. Virksomheten bruker alltid siste versjon uten lokale modifikasjoner
6. Krever nettverkstilgang fra klient til GitHub (vurdere CDN/proxy ved behov)

#### Deaktivering / fjerning

- Admin kan fjerne en importert eller sentral mal fra Maloppsett
- For importerte maler: lokalt innhold kan valgfritt slettes eller beholdes
- Eksisterende prosjektområder påvirkes ikke (de har allerede fått innholdet)

### 1.5 Oppdateringsflyt

- `catalog.json` sjekkes mot `PpPkgLatestVersion` ved åpning av malpakkekatalogen
- Caching: Katalogen caches i 24 timer for å unngå unødvendige forespørsler
- Pakker med ny versjon markeres med oppdateringsindikator
- Ved oppdatering kjøres samme flyt som installasjon
- Dersom malpakken krever en nyere versjon av Prosjektportalen (`minPPVersion`), vises en tydelig melding: *"Denne malpakken krever Prosjektportalen X.Y.Z. Oppgrader Prosjektportalen før du kan hente denne malen."*

---

## 2. Utvidelse av Maloppsett-listen

### 2.1 Nye felter

Maloppsett-listen utvides med følgende felter for å spore malpakkekilde og status:

| Felt | Type | Beskrivelse |
|---|---|---|
| `PpPkgType` | Valg | Maltype: `Lokal`, `Importert`, `Sentral` |
| `PpPkgId` | Tekst | Malpakke-ID fra manifest (f.eks. `pp-standard-prosjektmal`). Tom for lokale maler. |
| `PpPkgVersion` | Tekst | Installert/tilkoblet versjon (f.eks. `1.2.0`) |
| `PpPkgSourceUrl` | URL | Full URL til kilde i hosting-repoet |
| `PpPkgInstalledDate` | Dato/tid | Når malpakken ble installert/aktivert |
| `PpPkgUpdatedDate` | Dato/tid | Når malpakken sist ble oppdatert lokalt |
| `PpPkgLatestVersion` | Tekst | Siste tilgjengelige versjon fra katalog (oppdateres ved sjekk) |

### 2.2 Oppførsel per maltype

For **lokale maler** er pakke-feltene tomme – disse fungerer som i dag.

For **importerte maler** fylles alle felter, og versjon kan sammenlignes med `PpPkgLatestVersion` for oppdateringsvarsel.

For **sentrale maler** settes `PpPkgType` til `Sentral`, og `PpPkgSourceUrl` peker til hosting-repoet. Ingen lokal kopi av innhold, men admin har eksplisitt valgt at denne malen skal være tilgjengelig.

### 2.3 Vurdering: Egen malpakke-liste vs. utvidelse av Maloppsett

**Alternativ A: Utvide Maloppsett (anbefalt for fase 1)**
- Enklere – bygger direkte på eksisterende liste
- All informasjon om en mal samlet på ett sted
- Fungerer godt så lenge det er 1:1 mellom malpakke og Maloppsett-element

**Alternativ B: Egen Malpakker-liste**
- Bedre separasjon – en pakke kan ha flere Maloppsett-elementer
- Renere sporing og historikk
- Mer kompleksitet – krever relasjoner mellom lister

**Anbefaling:** Start med Alternativ A. Vurder å løfte til egen liste i en senere fase dersom det oppstår behov for mer avansert sporing.

---

## 3. Stempling av prosjektområder

Når et prosjektområde opprettes, stemples følgende informasjon på området (som site properties / property bag):

| Property | Beskrivelse |
|---|---|
| `pp_template_id` | Mal-ID (fra Maloppsett) |
| `pp_pkg_id` | Malpakke-ID (fra manifest, tom for lokale) |
| `pp_pkg_version` | Nøyaktig malpakkeversjon som ble brukt |
| `pp_pkg_type` | `Lokal`, `Importert` eller `Sentral` |
| `pp_provisioned_date` | Tidspunkt for provisjonering |

Dette gir full sporbarhet: fra et prosjektområde kan man se nøyaktig hvilken malpakkeversjon som ble brukt, og koble dette tilbake til en spesifikk versjon i hosting-repoet.

---

## 4. Endringer i oppsettveiviseren

### 4.1 Støtte for sentrale maler

Oppsettveiviseren utvides til å:

1. Gjenkjenne at en mal er sentral (flagg/URL i Maloppsett via `PpPkgType`)
2. Hente `.pppkg` fra hosting-repoet ved provisjonering
3. Pakke ut og provisjonere direkte fra nedlastet pakke (uten å lagre lokalt)
4. Cache pakken i nettleseren i inntil 24 timer (basert på versjon)
5. Håndtere nettverksfeil med tydelig feilmelding til bruker

### 4.2 Visning av malinformasjon

Oppsettveiviseren bør vise:

- Malens navn, beskrivelse og thumbnail
- Type: Lokal / Importert / Sentral (med ikon-indikasjon, ikke teknisk sjargong)
- Versjonsnummer for importerte og sentrale maler

### 4.3 Stempling ved provisjonering

Ved provisjonering stemples prosjektområdet med malpakkeinformasjon (se seksjon 3). Dette skjer uavhengig av maltype, men for lokale maler vil pakke-feltene være tomme.

---

## Oppgaver

### Fase 1 – Maloppsett-utvidelser

- [ ] Definere og opprette nye felt på Maloppsett-listen (`PpPkgType`, `PpPkgId`, `PpPkgVersion`, `PpPkgSourceUrl`, `PpPkgInstalledDate`, `PpPkgUpdatedDate`, `PpPkgLatestVersion`)
- [ ] Oppdatere provisjoneringsmaler for Maloppsett-listen med de nye feltene
- [ ] Sikre at eksisterende maler får `PpPkgType = Lokal` som default

### Fase 2 – SPFx malpakkekatalog

- [ ] Opprette ny SPFx ListView Command Set-komponent for Maloppsett
- [ ] Implementere katalog-visning: hente og parse `catalog.json` fra hosting-repo
- [ ] Bygge grid-layout med thumbnail, navn, beskrivelse og versjon per pakke
- [ ] Implementere søk og filtrering (type, tags)
- [ ] Bygge detaljvisning: stort bilde, full beskrivelse, changelog, innholdsoversikt
- [ ] Implementere "Importer til hub"-flyt (Modus A):
  - [ ] Last ned `.pppkg` fra GitHub
  - [ ] Pakk ut og valider manifest
  - [ ] Sjekk `minPPVersion` mot installert versjon
  - [ ] Sjekk Term Store-tillatelser før taxonomy-provisjonering
  - [ ] Kall `provisionTemplate()` for hub-template (med graphClient)
  - [ ] Kall `provisionTemplate()` for project-template
  - [ ] Lagre prosjekttillegg i Prosjekttillegg-listen
  - [ ] Kopier standardinnhold til relevante lister
  - [ ] Opprett/oppdater Maloppsett-element med pakkemetadata
- [ ] Implementere oppdateringssjekk: sammenlign `PpPkgVersion` med `PpPkgLatestVersion`
- [ ] Visuell indikasjon av maltype og oppdateringsstatus i Maloppsett-visningen
- [ ] Implementere 24-timers caching av `catalog.json`

### Fase 3 – Sentrale maler og veiviser

- [ ] Implementere "Bruk som sentral mal"-flyt (Modus B):
  - [ ] Opprett Maloppsett-element med `PpPkgType = Sentral` og `PpPkgSourceUrl`
  - [ ] Ingen lokal provisjonering – bare metadata-registrering
- [ ] Utvide oppsettveiviseren:
  - [ ] Detekter sentral mal via `PpPkgType`
  - [ ] Hent `.pppkg` runtime fra `PpPkgSourceUrl`
  - [ ] Pakk ut i minnet og kjør provisjonering
  - [ ] Implementer versjonsbasert nettleser-caching (24t)
  - [ ] Feilhåndtering for nettverksproblemer
- [ ] Implementere stempling av prosjektområder:
  - [ ] Sett site properties (`pp_template_id`, `pp_pkg_id`, `pp_pkg_version`, `pp_pkg_type`, `pp_provisioned_date`)
  - [ ] Stempling for alle maltyper (lokale får tomme pakkefelt)
- [ ] Vise maltype og versjon i oppsettveiviseren
- [ ] Implementere deaktivering/fjerning av importerte og sentrale maler
