# Forskningsprosjekt

Prosjektmal for forsknings- og utviklingsprosjekter (FoU) i Prosjektportalen 365.
Forskningsmalen er utviklet av **Høgskolen i Innlandet** i samarbeid med Puzzlepart,
nå Crayon Consulting, og forvaltes av Crayon Consulting.

Malen gir forskningsprosjekter egne felter for søknad, finansiering og organisatorisk
tilhørighet, en egen fasesjekkliste med referanser til veiledning, egne lister for
etiske vurderinger, prosjektorganisasjon, arbeidsnedbrytning og publiseringer, og en
samlet oversikt over publiseringer på porteføljenivå.

| | |
| --- | --- |
| **ID** | `pp-forskningsprosjekt` |
| **Type** | Prosjektmal |
| **Versjon** | 1.0.2 |
| **Minimum PP-versjon** | 1.14.0 |
| **Språk** | Norsk (nb-NO) |
| **Tagger** | forskning, FoU, prosjektledelse |

Malen bruker standardfasene i Prosjektportalen og standard statusrapport.

## Hva som settes opp på hub-området

Når malen kopieres til installasjonen eller tilgjengeliggjøres som skymal, settes
følgende opp på hub-området:

- Innholdstypen **Prosjekt (Forskning)**, som tas i bruk i listene **Prosjekter** og
  **Prosjektdata**.
- Forskningsfelter for prosjektinformasjonen: finansiør, finansiør (annet), utlysning,
  søknadssum, sum til universitetet, søknadsfrist, status søknad, fakultet, institutt,
  forskergruppe, forskergruppe (annet), NVA prosjektkode, rolle i prosjektet og
  oppstartsdato. Feltene registreres som prosjektkolonner og kan vises, filtreres og
  grupperes i porteføljen, i statusrapporter og på prosjektforsiden.
- Porteføljevisningen **Forskningsprosjekter**, som viser forskningsprosjektene med
  forskningsfeltene som kolonner og filtre.
- Hub-listen **Fasesjekkliste Forskning** med 48 sjekkpunkter fordelt på
  prosjektfasene, hver med kolonnen **Referanse** som lenker til veiledning. Innholdet
  kan tilpasses før nye prosjekter settes opp.
- Publiseringskolonnene (publiseringskanal, publiseringsdato, om publikasjonen er
  publisert, rolle i publikasjonen, NVA resultat-ID og lenke til NVA) og
  **Leveransenummer** som prosjektinnholdskolonner.
- Datakilden **Alle publiseringer** og hub-siden **Publiseringer**, som viser alle
  publiseringer registrert i forskningsprosjektene samlet, med kolonner og filtre
  ferdig satt opp. Siden opprettes bare hvis den ikke finnes fra før.
- Termsettene **Finansiør**, **Fakultet**, **Institutt** og **Forskergruppe** i
  termgruppen **Prosjektportalen**. Termene er hentet fra Høgskolen i Innlandet og kan
  tilpasses egen organisasjon.
- Valget **Terminert** i porteføljekolonnen **Prosjektstatus**, som dermed har valgene
  Aktivt, Avventer, Avsluttet og Terminert. Kolonnen er felles for alle maler på
  hub-området, så valget blir tilgjengelig for alle prosjekter.
- Prosjekttillegget **Forskningsmal** i listen **Prosjekttillegg**, låst til malen.
- Malen **Forskningsprosjekt** i **Maloppsett**.

## Hva som settes opp i prosjektet

Prosjekttillegget **Forskningsmal** følger malen og legges alltid på nye
forskningsprosjekter:

- Fire nye lister: **Etiske vurderinger**, **Prosjektorganisasjon**,
  **Work Breakdown Structure** og **Publiseringer**. Publiseringer som registreres i
  prosjektet vises også i den samlede oversikten på hub-området.
- **Fasesjekkliste** får kolonnen **Referanse**, som vises i alle visningene av listen.
- **Prosjektleveranser** får kolonnen **Leveransenummer**.
- Venstremenyen grupperes i **Obligatoriske funksjoner**, **Planlegging og styring**,
  **Administrasjon**, **FoU Verktøy** og **Generelt**, med lenker til de nye listene i
  tillegg til standardinnholdet i prosjektet.

I tillegg kan følgende listeinnhold velges i oppsettveiviseren:

- **Fasesjekkpunkter Forskning**: sjekkpunktene fra hub-listen, inkludert
  **Referanse**, fylles inn i prosjektets **Fasesjekkliste**.

## Forutsetninger og begrensninger

- Prosjektportalen 365 versjon 1.14 eller nyere.
- Hub-området må være på norsk (listene heter «Prosjekter», «Prosjektkolonner» osv.).
  Malen er ikke tilgjengelig på engelsk i denne versjonen.
- Malen kan både kopieres til installasjonen og tilgjengeliggjøres som skymal. Som
  skymal settes felter, innholdstype og termsett opp på hub-området, mens
  fasesjekklisten og prosjekttillegget hentes fra pakken når prosjektet settes opp.
  Siden **Publiseringer** på hub-området opprettes bare når malen kopieres til
  installasjonen, og må opprettes manuelt hvis malen bare brukes som skymal.
- Finansiør, fakultet, institutt og forskergruppe registreres som tekstfelter i denne
  versjonen. Termsettene settes opp på hub-området, men er ikke koblet til egne
  taksonomikolonner.
- Forskningsprosjekter bruker standardforsiden i Prosjektportalen.
- Menypunktet **Ressursallokering** fra standardmalen er ikke med i venstremenyen til
  forskningsprosjekter.
- Pakken setter hele valglisten i **Prosjektstatus**, ikke bare **Terminert**. Hver gang
  malen kopieres til installasjonen, oppdateres eller tilgjengeliggjøres som skymal,
  settes valgene i kolonnen på hub-området tilbake til **Aktivt**, **Avventer**,
  **Avsluttet** og **Terminert**, med **Aktivt** som standardverdi. Valg som en
  administrator eller en annen malpakke har lagt til i kolonnen, fjernes da og må legges
  til igjen etterpå. Prosjekter som allerede har et slikt valg, beholder verdien, og
  lister som allerede har kolonnen, for eksempel **Prosjekter**, beholder valgene sine.
