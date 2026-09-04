# Cloud-Template (skymal) Compatibility — Hosting Packages

**Scope:** all packages in `prosjektportalen-hosting` (`catalog.json` + `packages/<id>/`).

**What "cloud-compatible" means:** a *cloud template* (skymal) delivers its **project-level
content straight from the `.pppkg`** at project-setup time — the project-web template,
bundled extensions, list-content rows **and folder structures** (e.g. «Standarddokumenter»).
At **publish time** ("Tilgjengeliggjør som skymal", admin context, Prosjektportalen ≥ 1.14)
the catalog provisions the template's **hub dependencies** from `hub-template.json`:

- `SiteFields` (site columns)
- `ContentTypes` + their bindings to existing hub lists (`Prosjekter`/`Prosjektstatus`/…)
- Hub **configuration rows** — `Lists[]` entries carrying `DataRows` that are *not*
  list-content sources (e.g. `Prosjektkolonner`, `Statusseksjoner`, `Porteføljevisninger`)
- **`Taxonomy`** (term group / term sets) — feature-flag gated (`PP_DISABLE_TAXONOMY` /
  `featureFlagProvisioning: false` opt out) and pre-checked for Term Store access,
  exactly like a full import

List-content **source lists** (referenced by `provisioning.listContent[].sourceList`) are
*not* created on the hub — their rows and `Folders` hierarchies are read from the `.pppkg`
by the setup wizard and applied directly to the project web.

## The disqualifiers

> **Taxonomy is no longer a disqualifier.** Since Prosjektportalen ≥ 1.14 the publish flow
> runs the sp-js-provisioning Term Store handler with the same feature flag and permission
> pre-check as a full import. (Historically, a `Taxonomy` block was the *single*
> disqualifier — that rule is obsolete.)

A template is **not** cloud-compatible only if its `hub-template.json` needs hub content
**outside** the publish-time set above:

- `Files` uploaded to hub libraries
- `PropertyBagEntries` on the hub web
- Standalone hub lists/libraries with neither `ContentTypeBindings` nor `DataRows` that are
  not list-content sources (nothing delivers them)

## Scorecard

| Package | Type | Declared | Blocker |
| --- | --- | --- | --- |
| `pp-anleggsprosjekt` | template | `true` ✓ | — (taxonomy provisions at publish; «Standarddokumenter Anlegg» folders apply from the `.pppkg` at setup) |
| `pp-byggprosjekt` | template | `true` ✓ | — (same as anlegg) |
| `pp-forskningsprosjekt` | template | `true` ✓ | — (its 4 term sets — Finansiør, Fakultet, Institutt, Forskergruppe — provision at publish; bilingual variants supported) |
| `pp-veiprosjekt` | template | `true` ✓ | — (3 term sets provision at publish; «Standarddokumenter Vei» folders and the «Veimal» extension apply from the `.pppkg`) |
| `pp-enkel-prosjektmal` | template | `true` ✓ | — (no taxonomy; references the base PP phase term set) |
| `pp-leverandorsamhandling` | template *(hidden)* | `true` ✓ | — (no `hub-template.json`) |
| `pp-smidig` | template *(hidden)* | `true` ✓ | — (no `hub-template.json`) |
| `pp-testprosjekt` | template | `false` ✓ | hub `Files` (Testdokument.txt), `PropertyBagEntries`, standalone «Testbibliotek» library — QA package, intentionally exercises everything |
| `pp-dokumentbibliotek-flat` | extension | n/a | not a template |
| `pp-fasesider` | extension | n/a | not a template |
| `pp-forside-hurtiglenke` | extension | n/a | not a template |
| `pp-risikobibliotek` | content | n/a | not a template |

## Version requirement

Publish-time provisioning of taxonomy, hub configuration rows and the `.pppkg` folder
passthrough at setup require the Prosjektportalen 365 release that carries the extended
Malpakkekatalog publish flow (**≥ 1.14**). Older releases never shipped the catalog UI, so
no older client interprets these flags differently.

## Extensions & content — n/a

Cloud-compatibility is a *template* attribute. The three **extensions**
(`pp-dokumentbibliotek-flat`, `pp-fasesider`, `pp-forside-hurtiglenke`) and the **content**
package (`pp-risikobibliotek`) aren't cloud templates, so the flag doesn't apply. None of
them touch the hub schema, so they are all safe to bundle into a cloud template
(extensions resolve and list content is copied from the `.pppkg` at setup).

## Maintenance notes

- `cloudCompatible` and `cloudCompatibleReason` are declared in each package's
  `manifest.json`; `scripts/build-packages.js` copies **both** into `catalog.json` — edit
  the manifest and rebuild, never hand-edit the catalog.
- Four packages declare `provisioning.projectPhaseTermSetId` so their phase term sets are
  wired to `GtProjectPhaseTermId` on the Maloppsett item for both import and publish:
  `pp-anleggsprosjekt` (`cc6cdd18-…`), `pp-byggprosjekt` (`ec5ceb95-…`),
  `pp-veiprosjekt` (`7ccff67b-…`) and `pp-testprosjekt` (`aaa3e3cc-…`).
- `pp-byggprosjekt` and `pp-anleggsprosjekt` declare
  `provisioning.projectStatusContentTypeId` (`0x010022252E35737A413FB56A1BA53862F6D5BA`,
  «Prosjektstatus (ByggAnlegg)») so it is wired to `GtProjectStatusContentType` on the
  Maloppsett item for both import and publish. Requires a PortfolioExtensions build with
  `projectStatusContentTypeId` support.
- `listContent` entries carrying a **`plannerTitle`** are Planner task content: the rows
  from `sourceList` become tasks in a Planner plan with that title at project setup
  (`destinationList` is ignored). Import stamps the hub Listeinnhold item with the Planner
  content-type variant + `GtPlannerName`; the cloud path feeds the bundled rows straight to
  `PlannerConfiguration`. Requires Prosjektportalen ≥ 1.14 — the anlegg/bygg/vei
  `Planneroppgaver` entries use this («Anleggsoppgaver» / «Byggeoppgaver» / «Veiplan»).
- `pp-veiprosjekt` ships a project extension («Veimal», `provisioning/extensions/Veimal.json`)
  that adds «Forankret i» (`GtVeiAnchored`) to the project checklist and Fase/Fag/Emne to
  Dokumenter. Import uploads it to Prosjekttillegg and links it via `GtProjectExtensions`;
  the cloud path applies it straight from the `.pppkg`. Its checklist `listContent` copy
  includes `GtVeiAnchored`, so the manifest marks the extension `locked: true`: PP365 maps
  that to `GtExtensionLocked`, and a locked extension linked to its template is always
  applied, cannot be deselected and (with `defaultSelected: false`) is hidden in the wizard,
  mirroring the module's hidden, template-bound Veimal. `defaultSelected` stays `false`
  because `GtExtensionDefault` would pre-select it for **every** template on the hub.
  `locked` support ships with Prosjektportalen 1.14; earlier versions ignore the flag and show
  the extension as a deselectable tillegg. The same `locked` flag on a `listContent` entry makes that
  entry mandatory for its template in the same way.
- Hub-scoped view queries and other hub-specific values are expressed with sp-js-provisioning
  tokens in `DataRows` string values: `{sitecollectionid}` (hub site collection id) and
  `{sitecollectiontermstoreid}` (default term store id, used in taxonomy site-column XML).
  `pp-veiprosjekt`'s «Veiprosjekter» view uses `DepartmentId:{sitecollectionid} ContentTypeId:…`
  like the OOTB views. «Byggprosjekter» and «Anleggsprosjekter» use the same hub scope and their
  shared BA content type, plus an exact `GtProjectTemplateOWSTEXT` filter to keep the two views
  separate. All three views express `GtPortfolioColumns` and `GtPortfolioRefiners` as title
  arrays; the provisioner resolves those `LookupMulti` values against **Prosjektkolonner** by its
  `Title` show field, avoiding installation-dependent item IDs. Their rows use `Overwrite` so a
  package re-import repairs previously empty lookups. Veiprosjekt's Fag/Emne taxonomy site columns
  bind their term sets through the term store token. These features ship with the sp-js-provisioning
  bundled in Prosjektportalen 1.14: on earlier versions the DataRows token stays literal (the view
  returns nothing) and the taxonomy columns fail to create, which aborts the hub import.
- List permissions are expressed with the sp-js-provisioning `Security` element on a list
  (`BreakRoleInheritance`, `RoleAssignments` with `{associatedownergroupid}` /
  `{associatedmembergroupid}` / `{associatedvisitorgroupid}` and localized role names such as
  «Full kontroll» / «Lese»). `pp-veiprosjekt`, `pp-byggprosjekt` and `pp-anleggsprosjekt`
  use it on their Fasesjekkliste/Planneroppgaver hub lists like the OOTB lists do (owners
  edit, members and visitors read). It ships with Prosjektportalen 1.14; earlier provisioner
  builds ignore the element.
- If a future package ships hub `Files`, `PropertyBagEntries` or standalone hub libraries,
  declare `cloudCompatible: false` with a `cloudCompatibleReason` naming that content.
