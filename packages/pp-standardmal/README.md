# Standardmal

En komplett prosjektmal for Prosjektportalen med fasesjekkliste, interessentregister, usikkerhetshåndtering og dokumenthåndtering.

## Hva får du?

Denne malpakken inkluderer:

### Hub-nivå provisjonering
- **Taxonomy**: Termgruppe "Prosjektportalen" med termsett for prosjektfaser (Konsept, Planlegging, Gjennomføring, Avslutning), dokumenttyper og ressursroller
- **Felter**: 
  - `GtProjectPhase` - Prosjektfase (TaxonomyFieldType)
  - `GtDocumentType` - Dokumenttype (TaxonomyFieldType)
  - `GtChecklistStatus` - Sjekklistestatus (Choice)
  - `GtComment` - Kommentar (Note)
  - `GtSortOrder` - Sorteringsrekkefølge (Number)
  - `GtRiskProbability` / `GtRiskConsequence` - Risikofelt (Choice)
- **Innholdstyper**: 
  - Sjekklisteelement (0x0100486B1F8AEA24486FBA1C1BA9146C360C)
  - Usikkerhet (0x0100A87AE71CBF2643A6BC9D0948BD2EE897)

### Prosjektnivå provisjonering
- **Fasesjekkliste**: Med views for alle elementer, arkiverte og gjeldende fase
- **Planneroppgaver**: Integrasjon med Microsoft Planner
- **Interessenter**: Interessentregister med rolle og interessenivå
- **Dokumenter**: Dokumentbibliotek med prosjektfase og dokumenttype-felter
- **Navigasjon**: Strukturert hurtiglenke-meny med alle lister

### Standardinnhold
- **Fasesjekkliste**: 12 sjekkpunkter fordelt på 4 faser med GtSortOrder og kommentarer
  - Konsept: Prosjektmandat, Business case, Interessentanalyse
  - Planlegging: Prosjektplan, Ressurser, Budsjett, Risikovurdering
  - Gjennomføring: Kickoff, Statusrapportering, Kvalitetssikring
  - Avslutning: Sluttrapport, Evalueringsmøte
- **Planneroppgaver**: 8 standardoppgaver for prosjektoppstart med prioritering

### Valgfrie tillegg
- **Kvalitetssikring**: Tilleggsliste for kvalitetssikringspunkter (valgfri)
- **Risikovurdering**: Liste for risikoer og tiltak (standard aktivert)

## Krav

- Prosjektportalen 1.10.0 eller nyere
- SharePoint Online
- Term Store Administrator-rettigheter for installasjon

## Installasjon

Denne malen installeres via malpakkekatalogen i Prosjektportalen:

1. Åpne Maloppsett-listen på hubområdet
2. Klikk "Malpakkekatalog" i verktøylinjen
3. Finn "Standardmal" i katalogen
4. Velg "Importer til hub" eller "Bruk som sentral mal"

## Hva er nytt?

Se [CHANGELOG.md](CHANGELOG.md) for komplett endringshistorikk.

## Lisens

MIT License - se LICENSE-filen i repoet.
