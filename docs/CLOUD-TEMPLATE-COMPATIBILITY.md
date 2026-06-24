# Cloud-Template (skymal) Compatibility — Hosting Packages

**Scope:** all 11 packages in `prosjektportalen-hosting` (`catalog.json` + `packages/<id>/`).

**What "cloud-compatible" means:** a *cloud template* (skymal) is applied at project-setup time **straight from the `.pppkg` to the project web** — it provisions the project-web template + bundled extensions + bundled list content. It does **not** provision hub-area content. (At publish time, an admin flow can still create a template's essential project content types and bind them to the hub `Prosjekter`/`Prosjektstatus` lists; the term store is *not* set up that way.)

## The single disqualifier: a `Taxonomy` section

The decisive test is a control comparison with **`pp-enkel-prosjektmal`** (`cloudCompatible: true`): it has its *own* `hub-template.json`, its own hub content types **with `Prosjekter`/`Prosjektstatus` bindings**, and `listContent` that copies a `GtProjectPhase` column — yet it is cloud-compatible. So none of those are blockers. The **only** structural difference between it and the four non-compatible templates is a **`Taxonomy` block** (a term group + term sets).

> **A template is not cloud-compatible iff its `hub-template.json` has a `Taxonomy` section.** Term sets must be created in the *site-collection term store* with fixed GUIDs — that needs hub context + Term Store admin permission and has no equivalent in a project-web-only apply. The project's managed-metadata phase/category columns reference those term-set GUIDs, so without them the columns can't bind.

## Scorecard

| Package | Type | Declared | Assessed | Blocker |
|---|---|---|---|---|
| `pp-anleggsprosjekt` | template | `false` | **not cloud** ✓ | `Taxonomy`: term set **Fase (Anlegg)** |
| `pp-byggprosjekt` | template | `false` | **not cloud** ✓ | `Taxonomy`: term set **Fase (Bygg)** |
| `pp-forskningsprosjekt` | template | `false` | **not cloud** ✓ | `Taxonomy`: 4 term sets **Finansiør, Fakultet, Institutt, Forskergruppe** |
| `pp-veiprosjekt` | template | `false` | **not cloud** ✓ | `Taxonomy`: term sets **Fase (Vei), Fag (Vei), Emne (Vei)** |
| `pp-enkel-prosjektmal` | template | `true` | cloud-OK ✓ | — (no `Taxonomy`) |
| `pp-leverandorsamhandling` | template *(hidden)* | **unset** | cloud-OK ⚠️ | — (no `hub-template.json`) |
| `pp-smidig` | template *(hidden)* | **unset** | cloud-OK ⚠️ | — (no `hub-template.json`) |
| `pp-dokumentbibliotek-flat` | extension | n/a | n/a | not a template |
| `pp-fasesider` | extension | n/a | n/a | not a template |
| `pp-forside-hurtiglenke` | extension | n/a | n/a | not a template |
| `pp-risikobibliotek` | content | n/a | n/a | not a template |

Every declared `cloudCompatible` flag matches the verified assessment. **Two gaps**, both on the hidden templates (see Recommendations).

---

## Not cloud-compatible (4) — why

All four declare `cloudCompatible: false` (in both `catalog.json` and the package `manifest.json`), and all four are blocked by the **same thing: a term-store `Taxonomy` block** under term group **"Prosjektportalen"** (`c56bb677-…`). Their project `template.json` is empty (`{"Version":"1.0"}`) — everything substantive lives in `hub-template.json`, which can't run cloud-side.

- **`pp-byggprosjekt`** — term set **Fase (Bygg)** (`ec5ceb95-…`, 7 fixed-GUID phase terms). The bundled `Fasesjekkliste Bygg` rows tag `GtProjectPhase` with those term GUIDs.
- **`pp-anleggsprosjekt`** — term set **Fase (Anlegg)** (`cc6cdd18-…`, 7 terms); same shape as Bygg (shares the `ByggAnlegg` content types/columns).
- **`pp-forskningsprosjekt`** — **four** research term sets: **Finansiør, Fakultet, Institutt, Forskergruppe** — managed-metadata columns for research projects that have no term-store equivalent cloud-side.
- **`pp-veiprosjekt`** — **three** term sets: **Fase (Vei)** (`7ccff67b-…`), **Fag (Vei)** (`85485162-…`), **Emne (Vei)** (`f475345f-…`).

> Note: each of these *also* ships hub content types (`Prosjekt (ByggAnlegg)` / `Prosjekt (Forskning)` / …), GtBA*/Gtc* hub site columns, and hub-list `listContent`. Those are **not** what makes them non-compatible — `pp-enkel-prosjektmal` has the equivalents and is fine. It is specifically the **term-store provisioning** that disqualifies them.

## Cloud-compatible (1 declared + 2 effectively)

- **`pp-enkel-prosjektmal`** (`true`) — no `Taxonomy`. Defines two essential content types (`Enkel prosjektmal`, `Enkel prosjektstatus`) + their `Prosjekter`/`Prosjektstatus` bindings (reproducible by the publish-as-cloud-template flow) and a self-contained project-web template. It references `GtProjectPhase` via a `TermSetIds.GtProjectPhase` parameter pointing at the **base Prosjektportalen** term set — one that already exists in any PP-installed tenant, so it isn't provisioned by the package.
- **`pp-leverandorsamhandling`** & **`pp-smidig`** (both *hidden*) — **no `hub-template.json` at all**; their project `template.json` is an empty schema (`SiteFields: []`, `ContentTypes: []`, `Lists: []`). They depend on zero hub artifacts, so they are fully cloud-capable — but their `cloudCompatible` flag is **unset** (they're hidden and not surfaced).

## Extensions & content (4) — n/a

Cloud-compatibility is a *template* attribute (a skymal is a template applied cloud-side). The three **extensions** (`pp-dokumentbibliotek-flat`, `pp-fasesider`, `pp-forside-hurtiglenke`) and the **content** package (`pp-risikobibliotek`) aren't cloud templates, so the flag doesn't apply. None of them touch the hub schema (extensions ship only `provisioning.extensions`; the content package ships list content), so they are all **safe to bundle into a cloud template** (extensions resolve and list content is copied at setup).

---

## Recommendations

1. **Set `cloudCompatible` on the two hidden templates.** `pp-leverandorsamhandling` and `pp-smidig` are verifiably cloud-capable (no hub dependencies) but have no flag. When they're un-hidden, the catalog can't show the cloud badge / will treat them as unknown. Add `"cloudCompatible": true` to both (catalog + manifest) — or consciously decide and document why not.
2. **The path to making a "false" template cloud-compatible is to drop its custom term sets** — either reuse the base Prosjektportalen term sets the way `pp-enkel-prosjektmal` does (reference via `TermSetIds`, don't provision), or accept the in-product "at own risk" warning (hub content, incl. taxonomy, is skipped when used as a cloud template). Hub content types + site columns + list content do **not** need to be removed.
3. **No flag corrections needed** for the visible packages — all declared values are verified correct.

## Method

Per-template analysis was fanned out (one agent per template package) reading each `manifest.json` + `provisioning/hub-template.json` + `template.json`, then **adversarially verified** by re-reading the JSON and running the `pp-enkel-prosjektmal` control test — which is what narrowed the blocker from "taxonomy + content types + site columns" down to **taxonomy alone**. Term-group/set GUIDs and names above were read from the actual hub-template files.
