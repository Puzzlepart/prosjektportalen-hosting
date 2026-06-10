<#
.SYNOPSIS
    Importerer søkeskjema for veimodulen (kun for IT/SharePoint-administrator).

.DESCRIPTION
    Veiprosjekt-pakken legger til brukerkolonnene Planleggingsleder,
    Prosjekteringsleder og Byggeleder. For at disse skal kunne vises og filtreres i
    porteføljevisninger må de tre tilhørende crawled properties mappes til
    RefinableString80, RefinableString81 og RefinableString82.

    Selve søkeskjemaet kan IKKE provisjoneres fra malpakken (sp-js-provisioning har
    ingen søke-handler, og mappingen gjøres på leietaker-/søketjenestenivå). Dette
    skriptet importerer mappingen via PnP.PowerShell og krever rollen
    SharePoint-administrator.

    Skriptet er valgfritt – resten av malen fungerer uten det. Uten denne mappingen vil
    de tre brukerkolonnene bare stå tomme i porteføljen.

.PARAMETER Url
    URL til Prosjektportalen-hubområdet (administrasjons-/hubområdet).

.PARAMETER Scope
    Søkeskjema-omfang. Standard er Subscription (leietaker), som i kildemodulen.
    Bruk Site for å begrense til områdesamlingen.

.EXAMPLE
    .\Set-VeiSearchConfiguration.ps1 -Url https://contoso.sharepoint.com/sites/prosjektportalen

.NOTES
    Krever PnP.PowerShell (samme versjon som følger med Prosjektportalen, p.t. 3.1.0).
    Kjør Connect-PnPOnline med en konto som er SharePoint-administrator.
#>
param(
    [Parameter(Mandatory = $true)]
    [string]$Url,

    [Parameter(Mandatory = $false)]
    [ValidateSet('Subscription', 'Site')]
    [string]$Scope = 'Subscription'
)

$ErrorActionPreference = 'Stop'
$configPath = Join-Path $PSScriptRoot 'SearchConfiguration.xml'

if (-not (Test-Path $configPath)) {
    throw "Fant ikke SearchConfiguration.xml ved siden av skriptet ($configPath)."
}

Write-Host "Kobler til $Url ..." -ForegroundColor Cyan
Connect-PnPOnline -Url $Url -Interactive

Write-Host "Importerer søkeskjema (omfang: $Scope) ..." -ForegroundColor Cyan
Set-PnPSearchConfiguration -Scope $Scope -Path $configPath

Write-Host "Ferdig. Crawled properties for veikolonnene er mappet til RefinableString80-82." -ForegroundColor Green
Write-Host "Merk: en full crawl/oppdatering kan ta tid før verdiene vises i porteføljen." -ForegroundColor Yellow
