# Endringslogg

## [1.1.0] - 2026-11-05

### Endret

- Prosjekttilleggene **Test venstremeny** og **Testforside** gir nå den samme testmenyen: **Hjem**, overskriften **Testlenker** med undernivået **Testpakken** og **Områdesider**, og **Områdeinnhold**. Test venstremeny har `IgnoreExisting` på **Testpakken** og **Områdeinnhold**, Testforside ingen. Slik tester de navigasjonen i sp-js-provisioning 1.5.0: et undernivå, `IgnoreExisting` på begge nivåer og en ny kjøring som ikke endrer noe (se README).

### Rettet

- Menypunktene i prosjekttilleggene lenker bare til mål som finnes på alle prosjektområder, på norsk og engelsk. **Hjem** lenket til `SitePages/Prosjekt.aspx` og **Dokumenter** til `Dokumenter`, som ikke finnes, og **Testliste** til **Testprosjektliste**, som prosjekter satt opp fra den importerte malen ikke har. SharePoint avviste slike menypunkter når de måtte legges til, og oppsettet av prosjektet feilet. **Prosjektstatus**, **Usikkerhet** og **Tidslinje** lenket til sider og lister som bare har de adressene på norsk.
- Den engelske hub-malen gir listen **Projects** samme beskrivelse som Prosjektportalen, så en import på en engelsk hub endrer den ikke lenger.
- README oppgir riktig minimum PP-versjon (1.14.0) og at prosjekttilleggene har norske titler også på en engelsk hub.
- README sier at en import i Prosjektportalen 1.15 (som i 1.14) stopper ved hub-filene, fordi sp-js-provisioning avviser `Files` og `PropertyBagEntries` når den kjøres med SPFx-kontekst: taksonomien, sitekolonnene, innholdstypene og listene settes opp på hub-området, men ikke `Testdokument.txt`, `GtTestPackage`, **Prosjekttillegg**, **Listeinnhold**, lagringen av prosjektmalen eller **Maloppsett**. README sier også at Prosjektportalen 1.15 ikke legger prosjektmalen (`template.json`) eller standardinnholdet på prosjekter, hva pakken derfor ikke tester i dag, og at det endrer seg når sp-js-provisioning støtter de to delene med SPFx-kontekst.

## [1.0.0] - 2026-06-24
- Første versjon av Testprosjekt – full dekning av alle pakkefunksjoner for testformål.
- Taksonomi: fasetermset «Fase (Test)» med lokale termegenskaper, samt «Testkategori» og «Testegenskaper».
- Sitekolonner, innholdstyper, lister (visninger, rader, mapper), filer, prosjekttillegg, listeinnhold, standardinnhold og lokalisering (nb-NO/en-US).
