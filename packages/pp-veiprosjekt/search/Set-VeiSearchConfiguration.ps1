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

    Som i kildemodulens Install.ps1 kobles det til leietakerens administrasjonsområde
    (<tenant>-admin.sharepoint.com), utledet fra hub-URL-en, når omfanget er Subscription.

    Skriptet er valgfritt – resten av malen fungerer uten det. Uten denne mappingen vil
    de tre brukerkolonnene bare stå tomme i porteføljen.

.PARAMETER Url
    URL til Prosjektportalen-hubområdet. Brukes til å utlede administrasjonsområdet
    (omfang Subscription) eller som tilkoblingsmål (omfang Site).

.PARAMETER ClientId
    Klient-ID (app-ID) for Entra ID-appen som brukes ved interaktiv pålogging.
    PnP.PowerShell 3.x har ingen innebygd app-registrering, så en klient-ID må oppgis.
    Standard er den multi-tenant Prosjektportalen-appen, samme som i Prosjektportalens
    og kildemodulens Install.ps1.

.PARAMETER Scope
    Søkeskjema-omfang. Standard er Subscription (leietaker), som i kildemodulen.
    Bruk Site for å begrense til hubområdets områdesamling.

.PARAMETER AdminUrl
    URL til leietakerens administrasjonsområde. Utledes normalt fra -Url
    (<tenant>.sharepoint.com → <tenant>-admin.sharepoint.com); oppgi den eksplisitt for
    andre domener.

.EXAMPLE
    .\Set-VeiSearchConfiguration.ps1 -Url https://contoso.sharepoint.com/sites/prosjektportalen

.EXAMPLE
    .\Set-VeiSearchConfiguration.ps1 -Url https://contoso.sharepoint.com/sites/prosjektportalen -ClientId 00000000-0000-0000-0000-000000000000

.NOTES
    Krever PnP.PowerShell 3.1.0 eller nyere (samme minimum som kildemodulens Install.ps1).
    Logg på med en konto som er SharePoint-administrator.
#>
param(
    [Parameter(Mandatory = $true)]
    [string]$Url,

    [Parameter(Mandatory = $false)]
    [string]$ClientId = 'da6c31a6-b557-4ac3-9994-7315da06ea3a',

    [Parameter(Mandatory = $false)]
    [ValidateSet('Subscription', 'Site')]
    [string]$Scope = 'Subscription',

    [Parameter(Mandatory = $false)]
    [string]$AdminUrl
)

$ErrorActionPreference = 'Stop'
$configPath = Join-Path $PSScriptRoot 'SearchConfiguration.xml'

if (-not (Test-Path $configPath)) {
    throw "Fant ikke SearchConfiguration.xml ved siden av skriptet ($configPath)."
}

$pnpCommand = Get-Command Connect-PnPOnline -ErrorAction SilentlyContinue
if ($null -eq $pnpCommand -or $pnpCommand.Version -lt [version]'3.1.0') {
    throw "PnP.PowerShell 3.1.0 eller nyere er påkrevd. Installer med: Install-Module PnP.PowerShell -Scope CurrentUser"
}

[System.Uri]$hubUri = $Url.TrimEnd('/')
if ($hubUri.Host -like '*-admin.sharepoint.com') {
    throw "Oppgi hubområdets URL i -Url, ikke administrasjonsområdet ($($hubUri.Host))."
}
if ([string]::IsNullOrWhiteSpace($AdminUrl)) {
    if ($hubUri.Host -notlike '*.sharepoint.com') {
        throw "Kan ikke utlede administrasjonsområdet fra $($hubUri.Host). Oppgi -AdminUrl."
    }
    $AdminUrl = ($hubUri.Scheme + '://' + $hubUri.Authority).Replace('.sharepoint.com', '-admin.sharepoint.com')
}
$connectUrl = if ($Scope -eq 'Subscription') { $AdminUrl.TrimEnd('/') } else { $hubUri.AbsoluteUri.TrimEnd('/') }

Write-Host "Kobler til $connectUrl ..." -ForegroundColor Cyan
Connect-PnPOnline -Url $connectUrl -ClientId $ClientId -Interactive

Write-Host "Importerer søkeskjema (omfang: $Scope) ..." -ForegroundColor Cyan
Set-PnPSearchConfiguration -Scope $Scope -Path $configPath

Write-Host "Ferdig. Crawled properties for veikolonnene er mappet til RefinableString80-82." -ForegroundColor Green
Write-Host "Merk: en full crawl/oppdatering kan ta tid før verdiene vises i porteføljen." -ForegroundColor Yellow
