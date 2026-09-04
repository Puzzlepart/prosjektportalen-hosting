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
# Krever PnP.PowerShell 3.1.0+ og en konto som er SharePoint-administrator
.\Set-VeiSearchConfiguration.ps1 -Url https://<tenant>.sharepoint.com/sites/prosjektportalen

# Egen Entra ID-app for interaktiv pålogging (standard er Prosjektportalen-appen)
.\Set-VeiSearchConfiguration.ps1 -Url https://<tenant>.sharepoint.com/sites/prosjektportalen -ClientId <app-id>
```

Skriptet utleder leietakerens administrasjonsområde (`<tenant>-admin.sharepoint.com`) fra
hub-URL-en og kobler til der før importen, slik kildemodulens `Install.ps1` gjør. PnP.PowerShell
3.x har ingen innebygd app-registrering, så `-ClientId` må peke på en Entra ID-app; standardverdien
er den multi-tenant Prosjektportalen-appen (`da6c31a6-b557-4ac3-9994-7315da06ea3a`).
Med `-Scope Site` kobles det i stedet til hub-URL-en, og søkeskjemaet importeres bare for den
områdesamlingen. Bruk `-AdminUrl` hvis administrasjonsområdet ikke kan utledes (andre domener enn
`*.sharepoint.com`).

- `SearchConfiguration.xml` – søkeskjema-eksporten fra kildemodulen (aliaser, crawled/managed
  properties og mappinger for de tre kolonnene).
- `Set-VeiSearchConfiguration.ps1` – tynn PnP.PowerShell-innpakning rundt
  `Set-PnPSearchConfiguration` (kobler til administrasjonsområdet med `-ClientId`).

Etter import kan det ta en full crawl/oppdatering før verdiene vises i porteføljen.
