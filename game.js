(() => {
  'use strict';

  const screens = {
    home: document.getElementById('screen-home'),
    tutorial: document.getElementById('screen-tutorial'),
    game: document.getElementById('screen-game'),
    results: document.getElementById('screen-results')
  };
  const sceneSvg = document.getElementById('sceneSvg');
  const appState = { level: 0, order: [], position: 0, selected: null, answers: {}, complete: [] };
  const colorNames = { red: 'Rojo · señal crítica', yellow: 'Amarillo · precaución', green: 'Verde · apariencia superficial' };

  // Las clasificaciones son deliberadamente didácticas; no constituyen un dictamen estructural.
  const levels = [
    {
      eyebrow: 'NIVEL 1 / CASA DE UN PISO', title: 'Muro de mampostería', code: 'MURO / A-01',
      points: [
        { id: 1, x: 270, y: 276, title: 'Grieta diagonal cruzada', observation: 'Dos trazos diagonales largos se cruzan y atraviesan buena parte del paño del muro.', clue: 'La forma en “X” extensa es una señal de posible daño por esfuerzo lateral. En un caso real importan el material, el movimiento y el contexto.', expected: 'red', explanation: 'Una grieta diagonal en “X” que atraviesa el muro puede asociarse con daño importante. En una situación real, aléjate y busca evaluación profesional; no intentes comprobar su estabilidad.' },
        { id: 2, x: 205, y: 379, title: 'Grieta escalonada', observation: 'La fisura cambia de dirección y sigue las juntas horizontales y verticales de la mampostería.', clue: 'El recorrido escalonado por las juntas puede reflejar movimiento o esfuerzos en el muro, sobre todo si se extiende o aumenta.', expected: 'yellow', explanation: 'El patrón escalonado requiere revisión y seguimiento profesional. En este ejemplo se clasifica como precaución; si es extensa, reciente o evoluciona, la respuesta debe ser más urgente.' },
        { id: 3, x: 367, y: 190, title: 'Fisura desde la esquina de una ventana', observation: 'Una fisura diagonal nace en el vértice superior de la abertura y se dirige hacia el paño del muro.', clue: 'Las esquinas de las aberturas concentran tensiones. La longitud, el ancho, el desplazamiento y la evolución cambian la interpretación.', expected: 'yellow', explanation: 'Una fisura que nace en una esquina merece precaución y revisión. No todas son estructurales, pero no se debe decidir solo por su apariencia.' },
        { id: 4, x: 532, y: 356, title: 'Fisura fina en el acabado', observation: 'Es una línea delgada y aislada en el revestimiento; no se aprecia desplazamiento en este dibujo.', clue: 'Una fisura fina puede estar relacionada con retracción del acabado o cambios térmicos. La imagen no permite confirmar su profundidad.', expected: 'green', explanation: 'En este ejemplo la señal parece superficial. “Verde” no significa que la vivienda esté certificada como habitable; si crece o aparecen otras señales, pide una evaluación.' }
      ],
      cracks: `
        <path class="crack-shadow" d="M218 188 L261 254 L232 286 L284 363"/><path class="crack-heavy" d="M218 188 L261 254 L232 286 L284 363"/>
        <path class="crack-shadow" d="M323 192 L287 247 L309 270 L275 300 L295 324"/><path class="crack" d="M323 192 L287 247 L309 270 L275 300 L295 324"/>
        <path class="crack-fine" d="M388 190 L370 207 L357 207 L347 223"/><path class="crack-fine" d="M366 207 L357 198"/>
        <path class="crack-fine" d="M523 332 L528 340 L523 348 L529 356 L526 370"/>
        <path class="crack-fine" d="M186 370 L195 374 L195 383 L204 386 L204 393 L215 397"/>
      `
    },
    {
      eyebrow: 'NIVEL 2 / EDIFICACIÓN TRAS UN SISMO', title: 'Inspección después del movimiento', code: 'EDIFICIO / B-02',
      points: [
        { id: 1, x: 307, y: 266, title: 'Daño diagonal en el paño', observation: 'La grieta cruza el muro en diagonal, con ramificaciones y una apertura más marcada hacia el centro.', clue: 'El cruce de diagonales y la continuidad en el paño son señales de atención, especialmente después de un movimiento sísmico.', expected: 'red', explanation: 'El patrón extenso se trata como señal crítica en la simulación. Si se observa algo similar en la realidad, aléjate de la zona y pide una evaluación competente.' },
        { id: 2, x: 634, y: 248, title: 'Desprendimiento en una columna', observation: 'El borde de la columna aparece desmoronado, con pequeñas pérdidas de material y grietas alrededor del encuentro.', clue: 'El concreto aplastado o desprendido, el acero expuesto y los elementos deformados pueden indicar daño serio.', expected: 'red', explanation: 'El daño visible en una columna se considera señal crítica en este escenario. No te acerques ni toques el elemento; prioriza alejarte y reportar.' },
        { id: 3, x: 485, y: 153, title: 'Separación junto a la viga', observation: 'Se aprecia una línea abierta y discontinua en el encuentro superior entre el muro y la viga.', clue: 'Una separación en un encuentro puede ser importante, sobre todo si hay desplazamiento, deformación o cambios recientes.', expected: 'yellow', explanation: 'Se clasifica como precaución en este ejemplo. En una edificación real, la evaluación debe determinar si afecta un elemento estructural y qué medidas tomar.' },
        { id: 4, x: 495, y: 386, title: 'Fisura vertical muy fina', observation: 'La línea es estrecha, localizada en el acabado y sin desprendimiento visible en este esquema.', clue: 'Una fisura fina y aislada puede ser superficial, pero el dibujo no revela qué ocurre dentro del muro.', expected: 'green', explanation: 'La señal parece superficial en este ejemplo. No uses esta conclusión para declarar una vivienda habitable; observa si cambia y consulta si tienes dudas.' }
      ],
      cracks: `
        <path class="crack-shadow" d="M218 190 L260 236 L247 260 L306 305 L293 326 L333 354"/><path class="crack-heavy" d="M218 190 L260 236 L247 260 L306 305 L293 326 L333 354"/>
        <path class="crack-shadow" d="M348 190 L327 224 L342 248 L302 286 L317 310"/><path class="crack-heavy" d="M348 190 L327 224 L342 248 L302 286 L317 310"/>
        <path class="crack-split" d="M611 186 L624 199 L616 212 L630 223 L621 239 L636 251 L627 263 L641 276"/><path class="crack" d="M611 186 L624 199 L616 212 L630 223 L621 239 L636 251 L627 263 L641 276"/>
        <path class="crack-fine" d="M443 145 L456 149 L465 145 L473 151 L487 148 L498 153 L511 148 L524 152"/>
        <path class="crack-fine" d="M495 359 L490 369 L497 378 L492 387 L499 396 L496 405"/>
      `
    }
  ];


  // Identificadores estables: el orden en pantalla se mezcla al iniciar cada partida.
  levels[0].number = 1;
  levels[0].eyebrow = 'CASO 01 / CASA DE UN PISO';
  levels[0].structureType = 'masonry';
  levels[1].number = 2;
  levels[1].eyebrow = 'CASO 02 / EDIFICACIÓN TRAS UN SISMO';
  levels[1].structureType = 'frame';

  levels.push(
    {
      number: 3, structureType: 'masonry',
      eyebrow: 'CASO 03 / MURO JUNTO A UNA VENTANA', title: 'Fisuras alrededor de una abertura', code: 'MAMPOSTERÍA / C-03',
      points: [
        { id: 1, x: 270, y: 276, title: 'Diagonal que atraviesa el paño', observation: 'Una grieta ancha cruza en diagonal una zona amplia del muro y presenta una pequeña ramificación.', clue: 'La longitud, la apertura y el desplazamiento importan. Una diagonal extensa requiere atención, especialmente si apareció después de un sismo.', expected: 'red', explanation: 'Una grieta diagonal extensa que atraviesa el paño se trata como señal crítica en esta simulación. Aléjate del área y solicita ayuda competente si ves una señal similar en la realidad.' },
        { id: 2, x: 205, y: 379, title: 'Fisura escalonada en la parte baja', observation: 'La línea sigue las juntas de los ladrillos cerca del zócalo y sube en pequeños tramos.', clue: 'Las grietas escalonadas pueden estar relacionadas con movimientos del muro o asentamientos. Su extensión y evolución ayudan a valorar la urgencia.', expected: 'yellow', explanation: 'El recorrido escalonado requiere precaución y evaluación profesional, sobre todo si se extiende, aumenta o muestra desniveles.' },
        { id: 3, x: 367, y: 190, title: 'Fisura que nace en el vértice de la ventana', observation: 'Una línea diagonal corta parte desde una esquina de la abertura.', clue: 'Las esquinas de puertas y ventanas concentran tensiones. El patrón por sí solo no confirma la causa ni la profundidad.', expected: 'yellow', explanation: 'Una fisura que nace en una esquina merece revisión. Su clasificación real depende del material, la evolución y otras señales observadas por un profesional.' },
        { id: 4, x: 532, y: 356, title: 'Línea fina en el revestimiento', observation: 'Se ve una línea delgada, aislada y sin desplazamiento visible en el acabado.', clue: 'Las fisuras finas pueden deberse a retracción del revestimiento, pero una ilustración no permite conocer su profundidad.', expected: 'green', explanation: 'En el ejercicio la señal parece superficial. Verde no certifica habitabilidad: si crece o se acompaña de otras señales, busca una evaluación técnica.' }
      ],
      cracks: `
        <path class="crack-shadow" d="M214 190 L252 239 L241 274 L281 340"/><path class="crack-heavy" d="M214 190 L252 239 L241 274 L281 340"/>
        <path class="crack-shadow" d="M173 354 L186 354 L186 367 L198 367 L198 381 L210 381 L210 395 L222 395"/><path class="crack" d="M173 354 L186 354 L186 367 L198 367 L198 381 L210 381 L210 395 L222 395"/>
        <path class="crack-fine" d="M345 183 L357 193 L354 204 L369 214"/>
        <path class="crack-fine" d="M522 335 L529 344 L525 354 L533 363 L530 374"/>
      `
    },
    {
      number: 4, structureType: 'frame',
      eyebrow: 'CASO 04 / DESPUÉS DE UN SISMO', title: 'Señales tras un movimiento sísmico', code: 'INSPECCIÓN / D-04',
      points: [
        { id: 1, x: 270, y: 276, title: 'Diagonales cruzadas en el muro', observation: 'Dos grietas diagonales se cruzan y recorren gran parte del paño.', clue: 'Un patrón extenso en forma de “X” después de un sismo debe tomarse en serio; no te acerques para medirlo ni tocarlo.', expected: 'red', explanation: 'El patrón diagonal cruzado se clasifica como señal crítica en el juego. En un edificio real, aléjate y sigue las indicaciones de las autoridades o de personal competente.' },
        { id: 2, x: 210, y: 379, title: 'Material desprendido en la zona baja', observation: 'La superficie presenta bordes irregulares, pequeñas pérdidas de material y una grieta que se abre alrededor.', clue: 'La caída de material o el desmoronamiento reciente pueden ser signos de daño importante, especialmente tras un movimiento.', expected: 'red', explanation: 'El desprendimiento reciente se trata como señal crítica en este ejemplo. No toques los fragmentos ni el muro; aléjate del área y repórtala.' },
        { id: 3, x: 480, y: 153, title: 'Separación entre muro y viga', observation: 'Una línea horizontal abierta aparece en el encuentro superior entre el muro y la viga.', clue: 'Una abertura en un encuentro puede reflejar movimiento relativo. Si hay desplazamiento o deformación, aumenta la preocupación.', expected: 'yellow', explanation: 'La separación en el encuentro se clasifica como precaución en esta ilustración y necesita una revisión técnica para determinar su alcance.' },
        { id: 4, x: 530, y: 356, title: 'Fisura capilar en el acabado', observation: 'Una línea muy estrecha aparece en el revestimiento, sin desprendimiento representado.', clue: 'Una fisura fina y aislada puede ser superficial; después de un sismo debe considerarse dentro del contexto completo.', expected: 'green', explanation: 'En este caso aislado parece una fisura del acabado. Esa apariencia no demuestra que todo el edificio sea seguro; considera cualquier otra señal y pide valoración cuando haya dudas.' }
      ],
      cracks: `
        <path class="crack-shadow" d="M219 190 L267 269 L228 300 L286 365"/><path class="crack-heavy" d="M219 190 L267 269 L228 300 L286 365"/>
        <path class="crack-shadow" d="M323 186 L288 251 L308 277 L277 321 L292 342"/><path class="crack-heavy" d="M323 186 L288 251 L308 277 L277 321 L292 342"/>
        <path class="crack-split" d="M426 153 L444 148 L462 155 L480 149 L498 155 L519 150"/>
        <path class="crack-fine" d="M523 335 L532 346 L527 356 L535 365 L531 374"/>
        <path class="crack-fine" d="M186 372 L197 379 L193 388 L204 396"/>
      `
    },
    {
      number: 5, structureType: 'masonry',
      eyebrow: 'CASO 05 / MURO PORTANTE', title: 'Grietas extensas y recorrido horizontal', code: 'MAMPOSTERÍA / E-05',
      points: [
        { id: 1, x: 270, y: 276, title: 'Grieta diagonal con ramificación', observation: 'Una línea principal cruza el muro y se ramifica cerca del centro, con apariencia más marcada que una fisura del acabado.', clue: 'La extensión y las ramificaciones no bastan para diagnosticar, pero son señales que requieren una valoración cuidadosa.', expected: 'red', explanation: 'En el escenario, la grieta extensa con ramificaciones se considera una señal crítica. En un caso real, aléjate si sospechas daño estructural y solicita evaluación profesional.' },
        { id: 2, x: 205, y: 379, title: 'Abertura horizontal cerca de la base', observation: 'Una fisura horizontal larga se concentra en la parte inferior del muro.', clue: 'Una abertura continua cerca de la base puede relacionarse con movimientos o separación. Importan el desnivel, la extensión y los cambios recientes.', expected: 'red', explanation: 'La abertura extensa cerca de la base se clasifica como crítica en esta simulación. No intentes repararla ni cubrirla antes de que se evalúe su causa.' },
        { id: 3, x: 367, y: 190, title: 'Fisura corta junto al vano', observation: 'Una grieta oblicua parte de la esquina superior de la ventana y no atraviesa todo el muro.', clue: 'La concentración de tensiones en las esquinas justifica una revisión, aunque el aspecto no permita confirmar daño estructural.', expected: 'yellow', explanation: 'La fisura próxima al vano se clasifica como precaución en este ejemplo y debe interpretarse junto con su evolución y el resto del muro.' },
        { id: 4, x: 532, y: 356, title: 'Recorrido escalonado lateral', observation: 'La fisura avanza en pequeños tramos siguiendo las juntas de la mampostería.', clue: 'Un patrón escalonado puede revelar movimiento. Si aumenta o presenta desplazamiento entre lados, necesita atención más urgente.', expected: 'yellow', explanation: 'El patrón escalonado requiere precaución y evaluación técnica, especialmente si crece o hay desniveles visibles.' }
      ],
      cracks: `
        <path class="crack-shadow" d="M221 202 L251 245 L244 272 L271 294 L260 322 L292 352"/><path class="crack-heavy" d="M221 202 L251 245 L244 272 L271 294 L260 322 L292 352"/>
        <path class="crack-shadow" d="M151 379 L181 379 L181 385 L211 385 L211 391 L236 391"/><path class="crack-heavy" d="M151 379 L181 379 L181 385 L211 385 L211 391 L236 391"/>
        <path class="crack-fine" d="M347 181 L360 194 L355 205 L372 216"/>
        <path class="crack" d="M502 334 L514 334 L514 345 L527 345 L527 357 L540 357 L540 370 L553 370"/>
      `
    },
    {
      number: 6, structureType: 'frame',
      eyebrow: 'CASO 06 / ELEMENTOS DE CONCRETO', title: 'Columna y viga bajo observación', code: 'CONCRETO / F-06',
      points: [
        { id: 1, x: 307, y: 266, title: 'Grieta diagonal en el paño', observation: 'Una diagonal ancha cruza el muro de relleno cerca del encuentro con el marco.', clue: 'Las grietas diagonales extensas pueden relacionarse con esfuerzos laterales. El marco, el muro y el contexto completo deben evaluarse.', expected: 'red', explanation: 'La grieta diagonal extensa se considera crítica en este escenario. Si observas una señal parecida en un edificio real, aléjate del área y solicita una inspección competente.' },
        { id: 2, x: 634, y: 248, title: 'Desprendimiento en una columna', observation: 'El borde de la columna está desmoronado y se dibujan grietas alrededor del material desprendido.', clue: 'El concreto aplastado, el acero expuesto o los elementos deformados son señales de alerta importante.', expected: 'red', explanation: 'El daño visible en una columna se clasifica como señal crítica. No la golpees ni la toques; aléjate y reporta el hallazgo.' },
        { id: 3, x: 485, y: 153, title: 'Abertura en la unión superior', observation: 'Se observa una separación localizada entre el muro y la viga, con una línea irregular.', clue: 'Un encuentro abierto puede necesitar revisión, especialmente si hay desplazamiento entre elementos.', expected: 'yellow', explanation: 'La separación entre muro y viga se trata como precaución. Una persona competente debe determinar si afecta un elemento estructural y qué medidas tomar.' },
        { id: 4, x: 495, y: 386, title: 'Fisura delgada en el acabado', observation: 'Una línea vertical muy fina se ve en el revestimiento, lejos de los daños principales.', clue: 'La apariencia superficial no revela por sí sola la profundidad de una fisura.', expected: 'green', explanation: 'En la ilustración, la línea parece limitada al acabado. No es una certificación de seguridad; debe vigilarse cualquier cambio y considerar otras señales.' }
      ],
      cracks: `
        <path class="crack-shadow" d="M239 199 L271 241 L294 259 L279 285 L318 310"/><path class="crack-heavy" d="M239 199 L271 241 L294 259 L279 285 L318 310"/>
        <path class="crack-split" d="M609 189 L621 200 L613 212 L629 222 L619 235 L634 246 L626 258 L640 269 L633 282"/>
        <path class="crack-fine" d="M430 153 L447 149 L463 155 L481 150 L498 155 L520 151"/>
        <path class="crack-fine" d="M495 360 L489 371 L497 380 L492 390 L499 400 L496 410"/>
      `
    },
    {
      number: 7, structureType: 'masonry',
      eyebrow: 'CASO 07 / ACABADO Y HUMEDAD', title: 'Fisuras finas y deterioro superficial', code: 'ACABADO / G-07',
      points: [
        { id: 1, x: 270, y: 276, title: 'Fisura capilar aislada', observation: 'Se aprecia una línea estrecha e irregular sobre el acabado, sin separación visible de los lados.', clue: 'Las fisuras capilares pueden asociarse con retracción o cambios térmicos, aunque su profundidad no puede confirmarse con una imagen.', expected: 'green', explanation: 'En este ejemplo la fisura parece superficial. Si se ensancha, se repite en varias zonas o aparece junto con deformaciones, conviene solicitar una revisión.' },
        { id: 2, x: 205, y: 379, title: 'Revestimiento deteriorado', observation: 'El acabado tiene una zona descascarada y una pequeña fisura irregular cerca de la parte baja.', clue: 'La humedad puede deteriorar el revestimiento y ocultar el estado del material debajo. El desprendimiento requiere revisar su causa.', expected: 'yellow', explanation: 'El deterioro se clasifica como precaución: hace falta revisar la causa, comprobar si hay humedad y descartar daños más profundos antes de reparar.' },
        { id: 3, x: 367, y: 190, title: 'Fisura diagonal desde la ventana', observation: 'Una fisura estrecha sale de la esquina de una ventana y se ramifica ligeramente.', clue: 'Incluso una línea estrecha en la esquina de una abertura merece observación y contexto, especialmente si está creciendo.', expected: 'yellow', explanation: 'Por su ubicación se clasifica como precaución en este ejercicio. Registra su evolución sin acercarte a una zona peligrosa y busca orientación técnica.' },
        { id: 4, x: 532, y: 356, title: 'Pequeña red de fisuras superficiales', observation: 'Hay varias líneas muy finas y cortas concentradas en el acabado, sin desplazamiento dibujado.', clue: 'Un patrón reticular fino en el revestimiento puede ser superficial, pero la causa debe confirmarse en el sitio.', expected: 'green', explanation: 'El patrón parece limitado al acabado en esta ilustración. Si el material se desprende, la fisura cambia o hay otras señales, solicita evaluación.' }
      ],
      cracks: `
        <path class="crack-fine" d="M250 239 L257 253 L253 267 L263 281 L259 294 L267 306"/>
        <path class="crack-fine" d="M174 354 L185 362 L181 373 L194 379 L192 391 L205 397"/>
        <path class="crack-fine" d="M347 181 L359 193 L355 204 L371 213 L366 222"/>
        <path class="crack-fine" d="M515 339 L526 345 L523 354 L535 356 L529 367 L540 374 M526 345 L538 338 M523 354 L512 365"/>
        <path d="M171 366 L179 362 L184 369 L178 375 Z M191 384 L199 380 L205 386 L198 393 Z" fill="#7b6657" opacity=".55"/>
      `
    },
    {
      number: 8, structureType: 'frame',
      eyebrow: 'CASO 08 / POSIBLE ASENTAMIENTO', title: 'Señales cerca de la cimentación', code: 'CIMENTACIÓN / H-08',
      points: [
        { id: 1, x: 270, y: 276, title: 'Grieta diagonal extensa', observation: 'Una grieta diagonal atraviesa el muro y muestra una apertura desigual a lo largo del recorrido.', clue: 'Las grietas pueden relacionarse con distintas causas. La extensión, el desnivel y la aparición de nuevas señales son claves para pedir una evaluación.', expected: 'red', explanation: 'En este escenario la grieta extensa se considera crítica. No permite afirmar por sí sola que exista asentamiento, pero sí justifica priorizar la seguridad y una evaluación competente.' },
        { id: 2, x: 205, y: 379, title: 'Fisura escalonada ascendente', observation: 'La fisura se desplaza escalonadamente desde la zona baja hacia el centro del muro.', clue: 'El patrón puede aparecer cuando hay movimiento diferencial. No se puede establecer la causa solo por la forma.', expected: 'yellow', explanation: 'La grieta escalonada requiere precaución y una revisión que determine si hay movimiento, evolución u otros daños asociados.' },
        { id: 3, x: 367, y: 190, title: 'Separación junto al vano', observation: 'Una fisura nace cerca de la esquina de la abertura y avanza diagonalmente hacia arriba.', clue: 'Las esquinas de los vanos son zonas sensibles. Revisa el contexto sin intentar manipular la grieta.', expected: 'yellow', explanation: 'La señal se clasifica como precaución en el juego y debe ser valorada en conjunto con el resto del muro y posibles movimientos.' },
        { id: 4, x: 532, y: 356, title: 'Abertura continua en la base', observation: 'Se observa una línea horizontal abierta cerca de la base, con un pequeño quiebre en el recorrido.', clue: 'Una abertura continua en la parte baja, en especial si muestra desnivel o cambios, no debe cubrirse sin conocer su causa.', expected: 'red', explanation: 'La abertura de base se trata como señal crítica en este caso didáctico. No confirma por sí sola un problema de cimentación; requiere evaluación profesional antes de intervenir.' }
      ],
      cracks: `
        <path class="crack-shadow" d="M223 188 L251 235 L239 262 L278 286 L265 314 L291 348"/><path class="crack-heavy" d="M223 188 L251 235 L239 262 L278 286 L265 314 L291 348"/>
        <path class="crack" d="M174 349 L186 349 L186 363 L198 363 L198 378 L210 378 L210 393 L223 393"/>
        <path class="crack-fine" d="M347 182 L359 194 L355 204 L370 214"/>
        <path class="crack-shadow" d="M476 402 L501 402 L501 408 L528 408 L528 402 L555 402"/><path class="crack-heavy" d="M476 402 L501 402 L501 408 L528 408 L528 402 L555 402"/>
      `
    },
    {
      number: 9, structureType: 'masonry',
      eyebrow: 'CASO 09 / UNIONES ENTRE ELEMENTOS', title: 'Viga, columna y muro', code: 'ENCUENTROS / I-09',
      points: [
        { id: 1, x: 634, y: 248, title: 'Grieta diagonal cerca de columna', observation: 'Una grieta diagonal de trazo marcado aparece próxima al borde de un elemento vertical.', clue: 'Las grietas en elementos estructurales o junto a sus uniones requieren especial cautela, sobre todo si hay desprendimiento o deformación.', expected: 'red', explanation: 'La grieta junto al elemento vertical se clasifica como crítica en el escenario. No te acerques ni toques la columna; aléjate y solicita evaluación competente.' },
        { id: 2, x: 205, y: 379, title: 'Separación entre muro y elemento lateral', observation: 'Una línea vertical discontinua separa el muro del elemento lateral, con una pequeña apertura.', clue: 'La separación puede ser importante si es reciente, crece o viene acompañada de desplazamiento entre los elementos.', expected: 'yellow', explanation: 'La separación se clasifica como precaución. Es necesario determinar si se limita al acabado o si refleja movimiento entre elementos.' },
        { id: 3, x: 485, y: 153, title: 'Junta abierta bajo la viga', observation: 'Una línea horizontal en el encuentro superior muestra una abertura irregular entre muro y viga.', clue: 'Los encuentros pueden fisurarse por movimientos relativos; una apertura nueva o creciente necesita revisión.', expected: 'yellow', explanation: 'La junta abierta necesita precaución y una evaluación técnica para establecer su profundidad y su relación con los elementos constructivos.' },
        { id: 4, x: 495, y: 386, title: 'Línea vertical superficial', observation: 'Una fisura delgada y aislada desciende por la terminación superficial.', clue: 'En una imagen no puede confirmarse que la fisura sea solo del acabado. Importa observar cambios y otras señales.', expected: 'green', explanation: 'La línea parece superficial en el ejemplo, pero esa observación no certifica la seguridad del edificio. Busca orientación profesional ante dudas o cambios.' }
      ],
      cracks: `
        <path class="crack-shadow" d="M611 190 L623 205 L615 218 L632 232 L624 246 L639 260 L631 276"/><path class="crack-heavy" d="M611 190 L623 205 L615 218 L632 232 L624 246 L639 260 L631 276"/>
        <path class="crack" d="M185 339 L192 352 L187 365 L199 375 L196 389 L207 401"/>
        <path class="crack-fine" d="M428 153 L448 149 L466 155 L484 150 L505 155 L521 150"/>
        <path class="crack-fine" d="M495 359 L489 372 L497 381 L492 391 L499 400"/>
      `
    },
    {
      number: 10, structureType: 'frame',
      eyebrow: 'CASO 10 / REPASO FINAL', title: 'Señales combinadas en una vivienda', code: 'REPASO / J-10',
      points: [
        { id: 1, x: 270, y: 276, title: 'Grieta en “X” que cruza el paño', observation: 'Dos diagonales anchas cruzan el muro y forman una “X” de gran extensión.', clue: 'Las grietas diagonales cruzadas pueden indicar daño importante. En caso real, prima alejarse y pedir evaluación.', expected: 'red', explanation: 'El patrón extenso en “X” es señal crítica en el ejercicio. No intentes probar la estabilidad del muro; aléjate y reporta cualquier situación real parecida.' },
        { id: 2, x: 205, y: 379, title: 'Fisura escalonada sobre las juntas', observation: 'La grieta recorre las juntas entre ladrillos en un patrón de escalones.', clue: 'El patrón escalonado puede requerir seguimiento y valoración, especialmente si aumenta o presenta desnivel.', expected: 'yellow', explanation: 'La fisura escalonada se clasifica como precaución en este ejemplo y merece una revisión profesional, según la extensión y su evolución.' },
        { id: 3, x: 367, y: 190, title: 'Fisura oblicua en esquina de ventana', observation: 'Una línea diagonal nace en el ángulo superior de la abertura y avanza hacia el muro.', clue: 'Las esquinas de los vanos son zonas sensibles. La forma no permite concluir por sí sola cuál es la causa.', expected: 'yellow', explanation: 'La fisura de esquina requiere precaución y evaluación dentro del contexto constructivo completo.' },
        { id: 4, x: 532, y: 356, title: 'Fisura capilar aislada', observation: 'Una línea fina y de poca extensión aparece en la superficie sin una separación visible.', clue: 'Puede tratarse de una fisura superficial, aunque su profundidad no se puede confirmar a partir del dibujo.', expected: 'green', explanation: 'La señal parece superficial en este caso ilustrativo. Verde no significa “vivienda certificada como habitable”; consulta si la fisura cambia o hay otras señales.' }
      ],
      cracks: `
        <path class="crack-shadow" d="M217 190 L265 269 L229 299 L286 362"/><path class="crack-heavy" d="M217 190 L265 269 L229 299 L286 362"/>
        <path class="crack-shadow" d="M326 188 L286 249 L308 274 L278 310 L294 339"/><path class="crack-heavy" d="M326 188 L286 249 L308 274 L278 310 L294 339"/>
        <path class="crack" d="M173 352 L185 352 L185 365 L198 365 L198 379 L211 379 L211 393 L224 393"/>
        <path class="crack-fine" d="M347 181 L360 194 L355 205 L371 215"/>
        <path class="crack-fine" d="M524 337 L531 347 L527 356 L534 366"/>
      `
    }
  );

  function showScreen(name) {
    Object.entries(screens).forEach(([key, el]) => el.classList.toggle('hidden', key !== name));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function sceneStructure(levelIndex) {
    const level = levels[levelIndex];
    const second = level.structureType === 'frame';
    const wallLabel = second ? 'MARCO DE CONCRETO' : 'MURO DE MAMPOSTERÍA';
    const opening = second
      ? '<rect x="385" y="220" width="132" height="156" class="wall-window"/><path d="M399 232H503M399 244H503" stroke="#253044" stroke-width="1"/>'
      : '<rect x="381" y="205" width="132" height="137" class="wall-window"/><path d="M395 218H499M395 231H499" stroke="#253044" stroke-width="1"/>';
    const baseElements = `
      <defs><linearGradient id="wallTone" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b293d"/><stop offset="1" stop-color="#152136"/></linearGradient><pattern id="masonry" width="84" height="43" patternUnits="userSpaceOnUse"><path d="M0 0H84M0 43H84M42 0V21.5M0 21.5H84M0 21.5V43" fill="none" stroke="#2b394f" stroke-width="1" opacity=".45"/></pattern></defs>
      <rect x="20" y="18" width="760" height="524" rx="13" fill="#10192b"/>
      <rect x="103" y="103" width="594" height="354" class="wall-surface" fill="url(#wallTone)"/>
      <rect x="104" y="104" width="592" height="352" fill="url(#masonry)" opacity=".85"/>
      <rect x="103" y="93" width="594" height="36" rx="2" class="wall-concrete"/>
      <rect x="103" y="443" width="594" height="36" rx="2" class="wall-concrete"/>
      <rect x="139" y="129" width="58" height="314" fill="#182438" stroke="#46536a" stroke-width="2.5"/>
      <rect x="603" y="129" width="58" height="314" fill="#182438" stroke="#46536a" stroke-width="2.5"/>
      ${opening}
      <path d="M103 129H697M103 443H697" stroke="#69768a" stroke-width="1" opacity=".55"/>
      <g fill="#98a5b8" font-family="DM Mono, monospace" font-size="12" letter-spacing="1.1"><text x="116" y="151">${wallLabel}</text><text x="589" y="428" text-anchor="end">VISTA INTERIOR</text></g>
    `;
    const hotspots = level.points.map((p) => {
      const answeredClass = appState.answers[`${levelIndex}-${p.id}`] ? ` answered answered-${appState.answers[`${levelIndex}-${p.id}`].choice}` : '';
      const selectedClass = appState.selected === p.id ? ' selected' : '';
      return `<g class="hotspot${answeredClass}${selectedClass}" data-point="${p.id}" role="button" tabindex="0" aria-label="Revisar punto ${p.id}" aria-pressed="${appState.selected === p.id}"><circle class="hit-area" cx="${p.x}" cy="${p.y}" r="31"/><circle class="hotspot-ring" cx="${p.x}" cy="${p.y}" r="19"/><text class="hotspot-number" x="${p.x}" y="${p.y+0.5}">${p.id}</text></g>`;
    }).join('');
    sceneSvg.innerHTML = baseElements + level.cracks + hotspots;
    sceneSvg.querySelectorAll('.hotspot').forEach((node) => {
      node.addEventListener('click', () => selectPoint(Number(node.dataset.point)));
      node.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectPoint(Number(node.dataset.point)); }
      });
    });
  }

  function shuffledOrder() {
    const order = levels.map((_, index) => index);
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }

  function startGame() {
    appState.order = shuffledOrder();
    appState.position = 0;
    appState.level = appState.order[0];
    appState.selected = null;
    appState.answers = {};
    appState.complete = Array(levels.length).fill(false);
    renderGame();
    showScreen('game');
  }

  function restartCurrentCase() {
    appState.selected = null;
    appState.answers = Object.fromEntries(Object.entries(appState.answers).filter(([key]) => !key.startsWith(`${appState.level}-`)));
    appState.complete[appState.level] = false;
    renderGame();
  }

  function renderGame() {
    const level = levels[appState.level];
    document.getElementById('levelEyebrow').textContent = level.eyebrow;
    document.getElementById('game-title').textContent = level.title;
    document.getElementById('diagramCode').textContent = level.code;
    document.getElementById('levelName').textContent = `CASO ${String(level.number).padStart(2, '0')} · ${appState.position + 1}/${levels.length}`;
    const count = level.points.filter(p => appState.answers[`${appState.level}-${p.id}`]).length;
    document.getElementById('examinedCount').textContent = `${count} / 4 REVISADOS`;
    document.getElementById('levelProgressBar').style.width = `${count * 25}%`;
    document.getElementById('rightCount').textContent = level.points.filter(p => appState.answers[`${appState.level}-${p.id}`]?.correct).length;
    const advance = document.getElementById('advanceButton');
    advance.classList.toggle('hidden', count !== 4);
    advance.innerHTML = appState.position === levels.length - 1 ? 'Ver informe final <span aria-hidden="true">→</span>' : 'Siguiente caso <span aria-hidden="true">→</span>';
    document.getElementById('advanceHint').classList.toggle('hidden', count === 4);
    sceneStructure(appState.level);
    renderDecision();
  }

  function selectPoint(pointId) {
    appState.selected = pointId;
    renderGame();
  }

  function renderDecision() {
    const level = levels[appState.level];
    const selected = level.points.find(p => p.id === appState.selected);
    const key = selected ? `${appState.level}-${selected.id}` : null;
    const saved = key ? appState.answers[key] : null;
    document.getElementById('emptyState').classList.toggle('hidden', Boolean(selected));
    document.getElementById('selectedState').classList.toggle('hidden', !selected || Boolean(saved));
    document.getElementById('completedPointState').classList.toggle('hidden', !selected || !saved);
    const pill = document.getElementById('decisionPill');
    const code = document.getElementById('hotspotCode');
    if (!selected) {
      pill.textContent = 'SELECCIONA UN PUNTO'; code.textContent = 'PUNTO #--';
      return;
    }
    pill.textContent = saved ? (saved.correct ? 'RESPUESTA CORRECTA' : 'REPASA ESTA SEÑAL') : 'OBSERVA LA SEÑAL';
    code.textContent = `PUNTO #0${selected.id}`;
    if (saved) {
      const feedbackTitle = saved.correct ? '✓ Buena lectura' : `Respuesta esperada: ${colorNames[selected.expected]}`;
      const feedbackIntro = saved.correct ? 'Tu respuesta fue correcta.' : `Elegiste ${colorNames[saved.choice]}.`;
      document.getElementById('completedAnswer').innerHTML = `<b style="color:${saved.correct ? '#087e62' : '#a65f0a'}">${feedbackTitle}</b><br>${feedbackIntro} ${selected.explanation}`;
      return;
    }
    document.getElementById('crackTitle').textContent = selected.title;
    document.getElementById('crackObservation').textContent = selected.observation;
    document.getElementById('crackClue').textContent = selected.clue;
    document.getElementById('answerFeedback').className = 'answer-feedback hidden';
    document.querySelectorAll('.choice-button').forEach(btn => { btn.disabled = false; });
  }

  function answer(choice) {
    const level = levels[appState.level];
    const point = level.points.find(p => p.id === appState.selected);
    if (!point) return;
    const key = `${appState.level}-${point.id}`;
    if (appState.answers[key]) return;
    const correct = choice === point.expected;
    appState.answers[key] = { choice, correct };
    renderGame();
    document.getElementById('completedPointState').classList.remove('hidden');
    document.getElementById('selectedState').classList.add('hidden');
    const feedbackTitle = correct ? '✓ Correcto' : `No exactamente · ${colorNames[point.expected]}`;
    const feedbackIntro = correct ? 'Has elegido la clasificación esperada.' : `Tu respuesta fue ${colorNames[choice]}.`;
    document.getElementById('completedAnswer').innerHTML = `<b style="color:${correct ? '#087e62' : '#a65f0a'}">${feedbackTitle}</b><br>${feedbackIntro} ${point.explanation}`;
    const count = level.points.filter(p => appState.answers[`${appState.level}-${p.id}`]).length;
    if (count === 4) {
      document.getElementById('advanceHint').classList.add('hidden');
      document.getElementById('advanceButton').classList.remove('hidden');
    }
  }

  function advanceLevel() {
    const level = levels[appState.level];
    const count = level.points.filter(p => appState.answers[`${appState.level}-${p.id}`]).length;
    if (count !== 4) return;
    appState.complete[appState.level] = true;
    if (appState.position < levels.length - 1) {
      appState.position += 1;
      appState.level = appState.order[appState.position];
      appState.selected = null;
      renderGame();
      showScreen('game');
    } else {
      showResults();
    }
  }

  function renderReport(filter = 'all') {
    const report = document.getElementById('levelReport');
    const visibleLevels = appState.order.map((index, position) => ({ level: levels[index], index, position })).filter(({ level, index }) => {
      if (filter !== 'mistakes') return true;
      return level.points.some(point => appState.answers[`${index}-${point.id}`] && !appState.answers[`${index}-${point.id}`].correct);
    });

    report.innerHTML = visibleLevels.map(({ level, index, position }) => {
      const pointRows = level.points.map(point => {
        const saved = appState.answers[`${index}-${point.id}`];
        if (!saved || (filter === 'mistakes' && saved.correct)) return '';
        const isWrong = !saved.correct;
        return `<article class="report-item ${isWrong ? 'report-mistake' : 'report-correct'}">
          <div class="report-item-top"><span class="report-status">${isWrong ? '✕ PARA REPASAR' : '✓ CORRECTO'}</span><span class="report-point">PUNTO ${point.id}</span></div>
          <h4>${point.title}</h4>
          <div class="report-comparison"><div><span>Tu respuesta</span><b>${colorNames[saved.choice]}</b></div><div><span>Respuesta esperada</span><b>${colorNames[point.expected]}</b></div></div>
          <p>${isWrong ? '¿Qué faltó observar? ' : '¿Por qué? '}${point.explanation}</p>
        </article>`;
      }).join('');
      const correctCount = level.points.filter(point => appState.answers[`${index}-${point.id}`]?.correct).length;
      const wrongCount = level.points.length - correctCount;
      return `<details class="report-level" ${wrongCount > 0 && filter === 'mistakes' ? 'open' : ''}>
        <summary><span class="report-case-title"><small>ORDEN DE PARTIDA ${position + 1} · CASO ${String(level.number).padStart(2, '0')}</small><b>${level.title}</b></span><span class="report-case-score"><b>${correctCount}/4</b><small>${wrongCount ? `${wrongCount} ${wrongCount === 1 ? 'error' : 'errores'}` : 'Sin errores'}</small></span></summary>
        <div class="report-questions">${pointRows || '<p class="report-empty">No hay errores en este caso. ¡Buen trabajo!</p>'}</div>
      </details>`;
    }).join('');

    if (filter === 'mistakes' && visibleLevels.length === 0) {
      report.innerHTML = '<p class="report-empty">No hay errores que repasar. ¡Excelente observación!</p>';
    }
    document.getElementById('reportFilterAll').classList.toggle('is-active', filter === 'all');
    document.getElementById('reportFilterMistakes').classList.toggle('is-active', filter === 'mistakes');
    const wrongCount = Object.values(appState.answers).filter(saved => !saved.correct).length;
    document.getElementById('reportSummary').textContent = wrongCount === 0
      ? '¡No tuviste errores! Puedes revisar todas las explicaciones para reforzar el aprendizaje.'
      : `Clasificaste correctamente ${Object.values(appState.answers).filter(saved => saved.correct).length} de 40 señales. Revisa los ${wrongCount} ${wrongCount === 1 ? 'error señalado' : 'errores señalados'} para entender qué patrón pudo pasar desapercibido.`;
  }

  function showResults() {
    const score = Object.values(appState.answers).filter(saved => saved.correct).length;
    const total = levels.length * 4;
    const wrongCount = total - score;
    document.getElementById('finalScore').textContent = `${score}/${total}`;
    document.getElementById('finalPercent').textContent = `${Math.round(score / total * 100)}%`;
    document.getElementById('finalCaseCount').textContent = String(levels.length).padStart(2, '0');
    const title = document.getElementById('result-title');
    const lede = document.getElementById('resultLede');
    if (score >= 36) { title.textContent = 'Muy buena observación'; lede.textContent = 'Reconociste con criterio la gran mayoría de las señales de los diez casos.'; }
    else if (score >= 28) { title.textContent = 'Vas afinando tu criterio'; lede.textContent = 'Identificaste muchos patrones. El informe te ayudará a reforzar los que se parecían entre sí.'; }
    else { title.textContent = 'Cada señal es una oportunidad para aprender'; lede.textContent = 'Revisa con calma los errores de cada caso y vuelve a intentarlo con un nuevo orden aleatorio.'; }
    document.getElementById('mistakeCount').textContent = String(wrongCount);
    renderReport('all');
    showScreen('results');
  }

  document.getElementById('startButton').addEventListener('click', () => { showScreen('tutorial'); });
  document.getElementById('tutorialButton').addEventListener('click', () => showScreen('tutorial'));
  document.getElementById('beginLevelButton').addEventListener('click', startGame);
  document.getElementById('advanceButton').addEventListener('click', advanceLevel);
  document.getElementById('restartLevelButton').addEventListener('click', restartCurrentCase);
  document.getElementById('playAgainButton').addEventListener('click', () => showScreen('tutorial'));
  document.getElementById('reviewTutorialButton').addEventListener('click', () => showScreen('tutorial'));
  document.getElementById('brandHome').addEventListener('click', (event) => { event.preventDefault(); showScreen('home'); });
  document.querySelectorAll('.choice-button').forEach(button => button.addEventListener('click', () => answer(button.dataset.choice)));
  document.getElementById('reportFilterAll').addEventListener('click', () => renderReport('all'));
  document.getElementById('reportFilterMistakes').addEventListener('click', () => renderReport('mistakes'));
})();
