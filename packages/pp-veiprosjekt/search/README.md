# Søkekonfigurasjon for veimodulen (valgfritt)

Veiprosjekt-malen legger til tre brukerkolonner – **Planleggingsleder**,
**Prosjekteringsleder** og **Byggeleder**. For at disse skal kunne vises og filtreres i
porteføljevisninger må de mappes i søkeskjemaet til managed properties:

| Kolonne (crawled property) | Managed property |
| --- | --- |
| `ows_GtVeiPlanningManager` | `RefinableString80` |
| `ows_GtVeiProjectingManager` | `RefinableString81` |
| `ows_GtVeiConstructionManager` | `RefinableString82` |

## Hvorfor er dette et eget steg?

Søkeskjema settes på leietaker-/søketjenestenivå og krever rollen **SharePoint-administrator**.
Det kan derfor ikke provisjoneres fra selve malpakken (sp-js-provisioning har ingen
søke-handler). Steget er **valgfritt** – resten av malen fungerer uten det; uten mappingen
står de tre brukerkolonnene bare tomme i porteføljen.

## Slik kjører du det

```powershell
# Krever PnP.PowerShell og en konto som er SharePoint-administrator
.\Set-VeiSearchConfiguration.ps1 -Url https://<tenant>.sharepoint.com/sites/prosjektportalen
```

- `SearchConfiguration.xml` – søkeskjema-eksporten fra kildemodulen (aliaser, crawled/managed
  properties og mappinger for de tre kolonnene).
- `Set-VeiSearchConfiguration.ps1` – tynn PnP.PowerShell-innpakning rundt
  `Set-PnPSearchConfiguration`.

Etter import kan det ta en full crawl/oppdatering før verdiene vises i porteføljen.
