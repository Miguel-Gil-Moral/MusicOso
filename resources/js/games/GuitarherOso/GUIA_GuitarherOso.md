# Guia de GuitarherOso

Aquesta guia explica els fitxers JavaScript de GuitarherOso, com s’enllacen amb la vista Laravel i què passa des que prems una tecla fins que encertes o falles una nota.

## Explicació lleugera

El joc es carrega des de [`GuitarherOso.blade.php`](../../../views/games/GuitarherOso.blade.php). La vista dibuixa les tecles, el pentagrama, el combo, la barra de nivell i l’element d’àudio. Laravel Vite carrega [`Controls.js`](./Controls.js), i aquest importa els altres fitxers JavaScript.

Quan comença la partida, `Controls.js` crea una nota i la posa al pentagrama. En el mode normal, la lletra i la figura musical es trien a l’atzar. La nota es mou amb CSS cap a la línia on s’ha d’encertar. Quan prems una tecla, el joc comprova si correspon a la nota més antiga i si encara ets dins del marge de temps.

- `A`, `S`, `D`, `F`, `G`, `H`, `J` corresponen a les notes `A`–`G`.
- Un encert suma 5 punts de nivell i 1 al combo.
- Una nota fallada o una tecla incorrecta resta 5 punts i posa el combo a 0.
- El nivell va de 0 a 100. Si arriba a 0, es reinicia la partida.
- Amb un mapa actiu, les notes es programen segons els temps de `levelCharts.js`.

### Mapa ràpid dels fitxers

| Fitxer | Paper dins del joc |
| --- | --- |
| [`Controls.js`](./Controls.js) | Coordina la partida, el teclat, el nivell, el combo i els temporitzadors. |
| [`gameConfig.js`](./gameConfig.js) | Defineix tecles, ritmes, imatges i valors de temps. |
| [`noteElements.js`](./noteElements.js) | Tria dades aleatòries i crea les imatges de les notes i les notes fantasma. |
| [`noteTiming.js`](./noteTiming.js) | Decideix si un encert és dins del marge i calcula la precisió. |
| [`noteVisuals.js`](./noteVisuals.js) | Actualitza el combo i mostra animacions o missatges. |
| [`levelCharts.js`](./levelCharts.js) | Conté mapes editables i valida el mapa seleccionat. |

## Explicació completa

### 1. Com s’engega i quins elements fa servir

La vista Blade ([`GuitarherOso.blade.php`](../../../views/games/GuitarherOso.blade.php)) inclou `resources/js/games/GuitarherOso/Controls.js` amb `@vite`. Vite segueix els `import` de `Controls.js`, així que no cal afegir cada mòdul separat a Blade.

`Controls.js` busca aquests elements de Blade pels seus identificadors:

| Identificador Blade | Per a què el fa servir JavaScript |
| --- | --- |
| `musica-joc` | Reproduir, pausar i reiniciar l’àudio. |
| `marcador-nivel` | Mostrar el nivell actual amb una variable CSS i `aria-valuenow`. |
| `mensaje-juego` | Mostrar l’avís inicial, la derrota, la victòria o el missatge del truc. |
| `combo` | Mostrar el combo i aplicar-hi animacions. |
| `Pentagrama` | Contenidor de les notes que es mouen i dels missatges de precisió. |
| `1`–`7` | Tecles visuals que s’il·luminen quan es prem `A`–`J`. |

La partida comença amb el primer `keydown`. Aquella primera tecla només inicia el joc; no compta com a nota. Després, cada `keydown` pot iniciar una partida, avançar el codi secret, encertar una nota o penalitzar una tecla incorrecta.

### 2. `gameConfig.js`: les dades i els valors generals

Aquest fitxer només exporta dades; no conté funcions.

- `notesByKey`: relaciona la tecla física amb una nota musical i amb l’identificador del control visual. Per exemple, `a` correspon a la nota `A` i al control `1`.
- `noteTypes`: llista de notes creada a partir dels valors de `notesByKey`. `createRandomNoteData()` la fa servir per triar una nota aleatòria.
- `quarterNoteDuration`: durada d’un pols, en mil·lisegons. És `500` i també es publica a CSS com `--quarter-note-duration`.
- `gameSpeed`: factor de velocitat del mode aleatori. El valor `1` deixa el temps sense accelerar ni alentir.
- `noteTravelDuration`: durada total de l’animació d’una nota, `2500 ms`.
- `noteHitWindowMs`: marge màxim per encertar, `750 ms` abans o després del moment ideal.
- `perfectWindowMs`: marge de `150 ms` que separa els encerts perfectes dels encerts aviat o tard.
- `pixelPerfectWindowMs`: marge de `30 ms` per obtenir “SUPER PERFECT”.
- `ghostNoteCount`: nombre màxim de previsualitzacions de notes, `3`.
- `levelStep`: canvi de nivell per encert o error, `5` punts.
- `konamiCode`: seqüència de tecles que activa l’autoencert.
- `rhythmTypes`: defineix les quatre figures (`redonda`, `blanca`, `negra`, `corchea`), les imatges de cada color i els polsos que ocupen. En el mode aleatori, `beats` determina quan es crea la nota següent. En un mapa, el temps de cada nota el determina `atMs`.

Les imatges importades al començament són fitxers PNG de `resources/src`. Vite les processa i retorna les rutes que després s’assignen a `img.src`.

### 3. `noteElements.js`: triar i dibuixar notes

#### `createRandomNoteData()`

Tria a l’atzar una entrada de `noteTypes` i una figura de `rhythmTypes`. Retorna `{ note, rhythm }`. La crida és des de `createNote()` quan no hi ha un mapa actiu.

#### `getNoteHitTime(pentagram)`

Calcula quants mil·lisegons triga la nota a arribar a la línia d’encert. Ho calcula a partir de l’amplada real del pentagrama, la posició inicial, la posició final i la posició de la línia. Fa servir el mateix `noteTravelDuration` que l’animació CSS.

La funció es fa servir en dos llocs: `createNoteImage()` desa aquest temps a la nota, i `scheduleChartNote()` el resta de `atMs` per fer aparèixer la nota amb prou antelació.

#### `createNoteImage(note, rhythm, pentagram)`

Crea un element `<img>` per a la nota. Hi desa dades com la lletra, l’hora de creació, el moment d’arribada i les imatges de colors dins de `dataset`. També configura les variables CSS `--note-travel-duration` i `--note-travel-distance`.

La crida és des de `Controls.js`, a `createNote()`. El CSS aplica l’animació `mover-nota` a les imatges amb la classe `figura-musical`.

#### `renderGhostNotes(activeNotes, ghostImages, pentagram)`

Manté al pentagrama fins a tres imatges blaves que anticipen les pròximes notes. Reutilitza les imatges de la llista `ghostImages` i amaga les que ja no cal mostrar. També les col·loca en la fila correcta i ajusta opacitat i separació quan es repeteix una nota.

`Controls.js` la crida després de crear, encertar o fallar una nota i després de buidar la partida. El darrer cas amaga les notes fantasma que abans podien quedar visibles després de perdre.

### 4. `noteTiming.js`: comprovar el moment de l’encert

#### `isNoteInHitWindow(noteImage)`

Calcula el temps transcorregut des de `dataset.createdAt` amb `performance.now()` i el compara amb `dataset.hitTime`. Retorna `true` si la tecla s’ha premut dins de ±`750 ms`. `Controls.js` utilitza el resultat per decidir entre registrar l’encert o aplicar una penalització.

#### `getTimingFeedback(noteImage)`

Calcula la diferència entre el moment real de la tecla i el moment ideal, i retorna un objecte amb un text, un tipus i la diferència en mil·lisegons.

- Més de `150 ms` aviat: `Pronto`.
- Dins de `30 ms` del moment ideal: `SUPER PERFECT`.
- Fins a `150 ms` de diferència: `Perfecto`.
- La resta de la finestra vàlida: `Tarde`.

La funció només classifica l’encert. La penalització de nivell depèn de si la nota és dins o fora de la finestra de ±`750 ms`. Això vol dir que una nota marcada “Pronto” encara compta com a encert si s’ha premut dins d’aquesta finestra.

#### `getAccuracyPercentage(timingDifference)`

Converteix la diferència de temps en un percentatge entre 0 i 100. Com més a prop del moment ideal, més alta la precisió. `registerNoteMetric()` desa aquest percentatge quan es registra un encert.

### 5. `noteVisuals.js`: mostrar el resultat a la pantalla

#### `updateCombo(comboElement, combo)`

Actualitza el text del combo, treu l’estil de “SUPER PERFECT” i cancel·la el temporitzador que el treia automàticament.

#### `cancelComboAnimation()`

Cancel·la l’animació de sacseig del combo que estigui activa. `resetGame()` la crida abans de reiniciar l’estat.

#### `shakeCombo(comboElement, combo)`

Construeix una animació Web Animations que mou, gira i escala el combo. Com més alt és el combo, una mica més intensa és la sacsejada, amb un límit per evitar que creixi indefinidament. Es crida en encerts classificats com a perfectes.

#### `showPrecisionFeedback(pentagram, text, type, noteImage)`

Crea un `<span>` damunt del pentagrama amb el resultat (“Pronto”, “Perfecto”, etc.). Calcula la posició a partir de la mida i ubicació de la nota. Elimina el missatge al cap de `900 ms`. Les classes `feedback-*` del CSS li donen el color i l’estil.

#### `showHackMessage(gameMessage)`

Mostra el missatge del codi secret durant `2500 ms`. `activateAutoHit()` la crida quan es completa la seqüència Konami.

#### `showSuperPerfectCombo(comboElement)`

Afegeix la classe CSS `combo-super-perfecto` durant `900 ms`. La crida és des de `registerSuccessfulHit()` quan el tipus és `super-perfecto`.

### 6. `levelCharts.js`: dades dels mapes editables

#### `selectedLevelId`

Indica quin mapa s’ha d’utilitzar. El valor `null` manté el mode aleatori original. Per activar l’exemple, canvia’l a `'primer-mapa'`.

#### `levelCharts`

És un objecte on cada entrada és un mapa. Un mapa conté:

- `name`: nom que s’utilitza als missatges d’error.
- `songUrl`: ruta pública opcional de la cançó, per exemple `'/audio/la-meva-canco.mp3'`.
- `loopAudio`: indica si l’àudio es repeteix.
- `notes`: llista ordenada d’esdeveniments. Cada esdeveniment conté `atMs`, `note` i `rhythm`.

`atMs` és el moment, comptat des de l’inici de la partida, en què la nota hauria d’arribar a la línia d’encert. El joc la crea abans: resta el temps de trajecte calculat per `getNoteHitTime()`. Els temps han de créixer i la primera nota ha de superar `2499 ms`, perquè la nota necessita temps per travessar la pantalla. `note` ha de ser una lletra de `A` a `G`; `rhythm` ha de ser un dels quatre ritmes configurats.

#### `getSelectedLevel()`

Si `selectedLevelId` és `null`, retorna `null` i el joc utilitza notes aleatòries. En cas contrari, busca el mapa, comprova que existeixi i que tingui notes vàlides, i transforma cada lletra i ritme en les dades completes de `gameConfig.js`. Si hi ha un error al mapa, llença un error amb el número de nota i la causa.

La funció es crida una sola vegada quan es carrega `Controls.js`; el resultat queda a `activeChart` durant aquella pàgina.

**Important sobre l’àudio:** l’element `<audio id="musica-joc">` de Blade no té cap `src`. Per això, el mode aleatori actual no reprodueix cap cançó. En un mapa, posa una ruta accessible des del navegador a `songUrl`; si queda a `null`, les notes segueixen el rellotge de la partida, però no hi ha música.

### 7. `Controls.js`: flux complet de la partida

#### Estat que es guarda mentre jugues

- `activeNotes` és un `Set` amb les notes encara pendents. Un `Set` conserva l’ordre d’inserció, així que `activeNotes.values().next().value` és la nota més antiga i la primera que s’ha d’encertar.
- `ghostImages` guarda les imatges de previsualització per reutilitzar-les.
- `noteMetrics` guarda les estadístiques dels encerts i també s’exposa a `window.noteMetrics` per poder consultar-les des de la consola del navegador. No s’esborra en perdre o començar una altra partida.
- `missTimeouts` relaciona cada nota amb el temporitzador que la marcarà com a fallada.
- `autoHitTimeouts` relaciona cada nota amb el temporitzador del mode d’autoencert.
- `level`, `combo`, `gameStarted` i `konamiProgress` guarden l’estat actual del joc.
- `chartStartedAt` i `chartNoteIndex` s’utilitzen quan hi ha un mapa actiu.

#### Funcions de `Controls.js`

| Funció | Què fa i com s’utilitza |
| --- | --- |
| `startGameMusic()` | Si l’element d’àudio té una ruta, intenta reproduir-la. Si el navegador rebutja la reproducció, ho torna a intentar després d’una altra tecla. La crida és quan s’inicia la partida. |
| `updateLevel(change)` | Suma o resta punts, limita el nivell entre 0 i 100 i actualitza la barra. Si baixa a 0, crida `resetGame()`. Es crida en encerts i penalitzacions. |
| `resetGame()` | Atura temporitzadors i música, buida notes i combo, amaga previsualitzacions i torna el nivell a 50. Mostra el missatge de derrota. Es crida quan el nivell arriba a 0. |
| `finishChartIfComplete()` | Comprova que totes les notes del mapa s’hagin creat i resolt. Si és així, atura la partida i mostra el missatge de nivell completat. Es crida després d’encertar o fallar una nota. |
| `scheduleChartNote()` | Calcula quan s’ha de crear la nota següent del mapa: `atMs` menys el temps de trajecte i el temps ja transcorregut. Programa `createNote()` amb `setTimeout()`. |
| `scheduleNextNote(rhythm)` | En mode aleatori, espera `rhythm.beats × quarterNoteDuration / gameSpeed` abans de crear una nota. En un mapa, delega la programació a `scheduleChartNote()`. |
| `registerNoteMetric(noteImage, timingFeedback)` | Crea un registre amb la lletra, la classificació, el percentatge de precisió, els mil·lisegons de diferència i la data. L’afegeix a `noteMetrics`. |
| `scheduleAutoHit(noteImage)` | Si l’autoencert està activat, programa l’encert de la nota al seu moment ideal. Comprova abans de registrar-lo que la nota continuï activa. |
| `activateAutoHit()` | Activa l’autoencert per a les notes actuals i futures, i mostra el missatge de truc. |
| `handleKonamiInput(key)` | Compara la tecla amb el següent element de `konamiCode`. Una tecla incorrecta reinicia el progrés; completar la seqüència crida `activateAutoHit()`. |
| `renderCurrentGhostNotes()` | Passa l’estat actual a `renderGhostNotes()`. És una funció intermèdia perquè el codi de la partida no hagi de repetir-ne els arguments. |
| `initializeNoteQueue()` | En mode aleatori, crea la primera nota. En mode mapa, inicia el rellotge del mapa, posa l’índex a 0 i programa la primera nota. |
| `createNote(chartNote = null)` | Crea una nota aleatòria o rep una nota del mapa. Crea la seva imatge, la posa a `activeNotes`, programa la fallada i actualitza les previsualitzacions. Després programa la nota següent. |
| `registerSuccessfulHit(noteImage, timingFeedback)` | Cancel·la els temporitzadors de la nota, la treu de les pendents, registra l’estadística, puja el nivell i el combo, canvia la imatge segons la precisió i mostra el resultat. Finalment comprova les previsualitzacions i si el mapa s’ha acabat. |

#### El gestor de teclat

El gestor és el `document.addEventListener('keydown', ...)` del final de `Controls.js`:

1. Ignora els esdeveniments repetits que el sistema operatiu genera quan mantens una tecla premuda.
2. Si la partida encara no ha començat, amaga el missatge inicial, inicia l’àudio i crea la primera nota; després retorna sense puntuar aquella tecla.
3. Durant la partida, comprova el codi Konami si la tecla és una fletxa, `b`, `a` o `Enter`.
4. Cerca la nota associada a `event.key.toLowerCase()` i la compara amb la nota més antiga de `activeNotes`.
5. Si coincideix i és dins de la finestra de temps, crida `getTimingFeedback()` i `registerSuccessfulHit()`. Altrament resta nivell i posa el combo a zero.
6. Si era una tecla musical, il·lumina el control visual corresponent durant `180 ms`.

Una tecla qualsevol fora del primer inici pot penalitzar la partida quan no encerta la nota més antiga. Les tecles musicals són `A`, `S`, `D`, `F`, `G`, `H` i `J`, segons el mapa de `notesByKey`.

### 8. Conceptes de JavaScript que apareixen al joc

| Concepte/API | Ús en aquest codi |
| --- | --- |
| `import` / `export` | Comparteixen dades i funcions entre fitxers. `Controls.js` és el punt d’entrada i importa la resta. |
| `document.getElementById()` | Busca els elements Blade pels seus identificadors. |
| `document.createElement()` | Crea imatges de notes, imatges fantasma i missatges de precisió. |
| `dataset` | Desa dades al mateix element HTML, com la nota i els temps. El navegador les converteix en text; per això el codi fa servir `Number(...)` quan calcula. |
| `classList` | Afegeix o treu classes CSS per mostrar estats visuals. |
| `style.setProperty()` | Canvia variables CSS des de JavaScript, com la durada d’una animació o el nivell de la barra. |
| `Set` / `Map` | `Set` guarda notes actives en ordre; `Map` relaciona cada nota amb el seu temporitzador. |
| `setTimeout()` / `clearTimeout()` | Programa una acció futura i permet cancel·lar-la si la nota ja s’ha encertat o el joc s’ha reiniciat. |
| `performance.now()` | Rellotge d’alta precisió per mesurar els mil·lisegons des que s’ha creat una nota o començat un mapa. |
| `audio.play()` / `pause()` | Controlen la reproducció. `play()` retorna una promesa, i `catch()` gestiona el cas que el navegador no permeti reproduir encara. |
| `element.animate()` | Crea l’animació de sacseig del combo amb fotogrames. |
| Mètodes d’arrays (`map`, `find`, `forEach`, `slice`, `push`) | Transformen les notes del mapa, troben una lletra o un ritme, recorren elements i guarden estadístiques. |

### 9. Com editar i provar un mapa

1. Obre `levelCharts.js`.
2. Canvia `selectedLevelId` de `null` a `'primer-mapa'`.
3. Edita la llista `notes`. Per exemple, `{ atMs: 4000, note: 'D', rhythm: 'corchea' }` vol dir que la nota `D` s’ha d’encertar als 4 segons. La tecla per fer-ho és `F`; `corchea` tria la imatge i la figura musical.
4. Mantén els `atMs` en ordre creixent. La primera nota ha de superar `2499 ms` perquè ha de travessar el pentagrama abans d’arribar a la línia.
5. Si vols música, posa l’arxiu en una ubicació pública del projecte i escriu-ne la ruta a `songUrl`, per exemple `'/audio/la-meva-canco.mp3'`.

El mapa és una llista editada en codi; no hi ha un editor visual dins de la pàgina. Quan es resol l’última nota, el joc mostra “Nivel completado” i una tecla torna a iniciar el mapa.

### 10. Connexió amb CSS

El fitxer [`GuitarherOso.css`](../../../css/games/GuitarherOso.css) anima i pinta els elements que crea JavaScript:

- `--quarter-note-duration`: ritme visual del pentagrama. El valor inicial del CSS és reemplaçat per `quarterNoteDuration` en carregar `Controls.js`.
- `--note-travel-duration` i `--note-travel-distance`: trajecte de les notes; es configuren a `createNoteImage()`.
- `figura-musical` i `figura-A`…`figura-G`: aspecte i fila de la nota.
- `nota-fantasma`, `--ghost-opacity` i `--ghost-row-offset`: aspecte de les previsualitzacions.
- `feedback-pronto`, `feedback-perfecto`, `feedback-super-perfecto`, `feedback-tarde`: colors dels missatges de precisió.
- `control-actiu`, `combo-super-perfecto` i `--nivel`: efectes dels controls, combo i barra de nivell.

