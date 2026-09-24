# Entrenamiento de tiros

App de captura de tiros de baloncesto para entrenamiento. Se registra por línea (A–E) y posición (1–5), contando **cuántos tiros costó lograr los encestes objetivo** de cada punto.

Funciona en el navegador del celular, se instala en la pantalla de inicio y opera sin conexión. Los datos se respaldan en una hoja de Google compartida entre todos los usuarios.

---

## Archivos del repositorio

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app completa. Un solo archivo, sin compilación. |
| `manifest.json` | Nombre, colores e iconos para instalarla como app. |
| `sw.js` | Service worker: permite abrirla sin internet. |
| `icon-180.png`, `icon-192.png`, `icon-512.png` | Iconos. |
| `apps-script.gs` | Se pega en Google Apps Script, **no** se usa en el sitio. |

---

## Paso 1 — Publicar en GitHub Pages

1. En GitHub, **New repository**. Nombre: `cinco-lineas`. Visibilidad **Public** (Pages gratis requiere repo público). No marques "Add a README".
2. En el repo vacío, **uploading an existing file**. Arrastra todos los archivos de la tabla de arriba, **excepto** `apps-script.gs`.
3. Renombra el HTML a `index.html` si no lo está. GitHub Pages solo sirve la portada con ese nombre exacto.
4. **Commit changes**.
5. **Settings → Pages**. En *Source* elige `Deploy from a branch`, rama `main`, carpeta `/ (root)`. **Save**.
6. Espera un par de minutos y recarga la página de Settings. Aparece la URL:

   ```
   https://TU-USUARIO.github.io/cinco-lineas/
   ```

Esa es la dirección que vas a compartir.

> **Al actualizar la app:** sube el `index.html` nuevo **y** súbele el número a `VERSION` dentro de `sw.js` (por ejemplo `cinco-lineas-v2`). Si no lo cambias, los teléfonos seguirán abriendo la versión guardada en caché.

---

## Paso 2 — Crear la hoja de Google

1. En Drive, crea una hoja nueva: **Entrenamiento de tiros**.
2. **Extensiones → Apps Script**. Borra lo que traiga y pega el contenido de `apps-script.gs`.
3. Guarda (icono de disco).
4. **Implementar → Nueva implementación**. En el engrane elige **Aplicación web**.
   - *Descripción:* `v1`
   - *Ejecutar como:* **Yo**
   - *Quién tiene acceso:* **Cualquier usuario**
5. **Implementar**. Google pedirá autorizar; acepta (la advertencia de "app no verificada" es normal en scripts propios: *Configuración avanzada → Ir a…*).
6. Copia la URL que termina en `/exec`.

Las pestañas `Jornadas` y `Tiros` se crean solas con el primer registro.

> **Importante:** si dejas *Quién tiene acceso* en "Solo yo", los demás teléfonos recibirán error de permisos y sus jornadas se quedarán atoradas en la cola de subida.

> **Al modificar el script después:** usa **Implementar → Gestionar implementaciones → editar (lápiz) → Versión: Nueva versión**. Si creas una implementación nueva desde cero, cambia la URL y hay que actualizarla en todos los teléfonos.

---

## Paso 3 — Dar de alta a cada persona

No hay cuentas ni contraseñas. Un usuario queda dado de alta cuando su teléfono apunta a la misma hoja.

Para cada persona (tú, tu esposa, quien capture):

1. Mándale la URL de GitHub Pages por WhatsApp.
2. Que la abra en el navegador del celular.
   - **Android / Chrome:** menú ⋮ → *Agregar a pantalla principal*.
   - **iPhone / Safari:** botón compartir → *Agregar a inicio*. En iPhone tiene que ser Safari; desde Chrome no se instala.
3. Que abra la app y toque la etiqueta de arriba a la derecha (dice *Solo este equipo*).
4. Que pegue ahí la URL `/exec` del Paso 2 y toque **Guardar y sincronizar**.
5. La etiqueta cambia a **Drive activo**. Listo.

A partir de ahí los jugadores, las jornadas y el análisis se ven iguales en todos los teléfonos.

**Los jugadores no son usuarios.** Cada quien agrega los nombres que va a medir en *¿Quién tiene tiro?* y esos nombres se sincronizan solos. Si tu esposa registra a las niñas, sus jornadas te aparecen a ti en *Ver análisis de todos* sin que hagas nada.

### Cuidado con la URL del script

Esa dirección es la llave de la hoja: quien la tenga puede escribir en ella. Para uso familiar está bien, pero **no la pongas dentro de `index.html` ni la subas al repo** — por eso se captura en Ajustes y se guarda solo en el teléfono. Si algún día se filtra, genera una implementación nueva en Apps Script y reparte la URL nueva.

---

## Cómo se guardan los datos

Tres capas, en este orden:

1. **El teléfono** (`localStorage`) — se escribe siempre, primero. Es la fuente de verdad durante el entrenamiento.
2. **La cola de pendientes** — si no hay señal en la cancha, la jornada se guarda aquí y sube sola la próxima vez que se abra la app con internet.
3. **La hoja de Google** — el respaldo compartido.

Por eso puedes capturar en un gimnasio sin datos sin perder nada.

### Estructura de la hoja

**`Jornadas`** — una fila por sesión: identificador, jugador, fecha, posiciones entrenadas, objetivo de encestes, totales y efectividad de línea y de tiros libres.

**`Tiros`** — una fila por tiro: jornada, jugador, fecha, fase (`LINEA` o `TL`), línea, posición, número de intento, resultado (1/0) y segundos desde el tiro anterior.

**`Juegos`** — una fila por partido: identificador, jugador, fecha, rival, liga, puntos, tiros de campo, triples, tiros libres, asistencias y tiros bloqueados.

**`Tiros_Juego`** — una fila por tiro de partido: partido, jugador, fecha, periodo, rival, liga, coordenadas, distancia en metros, zona, si fue triple, resultado, si fue bloqueado, falta, tiros libres y puntos de la jugada.

La liga permite separar el rendimiento entre los distintos equipos y torneos en los que juega la misma jugadora. En la pantalla de resultados del partido puedes alternar entre este partido, el acumulado de esa liga, y el acumulado de todos sus partidos.

La de `Tiros` es la tabla de hechos: conéctala directo a Power BI para tendencias por posición, comparativos entre jugadores o cruces de efectividad contra ritmo. La de `Jornadas` sirve como dimensión de sesión.

Para bajarla como Excel: **Archivo → Descargar → Microsoft Excel**.

---

## Notas de medición

- **La efectividad es encestes / tiros realizados.** Cinco encestes en siete tiros es 71%.
- **El ritmo solo mide intervalos dentro de un mismo punto.** El primer tiro después de cambiar de posición incluye el desplazamiento del jugador y se excluye. También se descartan intervalos mayores a dos minutos.
- **La pausa no cuenta.** El tiempo de recuperar el balón se resta del ritmo.
- **El asterisco en el mapa de calor** marca puntos que se cerraron sin llegar al objetivo. Ese porcentaje es real pero viene de una serie que no se cerró.
- **Los tiros libres son diez intentos fijos.** Caigan o no, siempre se cuentan diez, así que 8 de 10 es 80%. Ese es el dato comparable entre jornadas. Si después quiere seguir tirando, esa racha se mide aparte y no toca el porcentaje.
- **Un tiro bloqueado cuenta como intento fallado**, igual que en la estadística oficial: suma al denominador y no al numerador. Se guarda marcado aparte porque habla de selección de tiro, no de puntería.
- **La cancha se guarda siempre con el aro a la izquierda.** El botón de voltear solo cambia cómo se dibuja en pantalla, para que puedas capturar desde el lado en que estás sentado y cambiar al medio tiempo sin partir el mapa acumulado.
- **Las zonas del modo partido** son las cinco estándar de la NBA adaptadas a medidas FIBA: área restringida, pintura, media distancia, triple de esquina y triple sobre el arco. Una zona con menos de seis tiros acumulados se muestra en gris porque su porcentaje no significa nada todavía.
- **Compara puntos por tiro, no puntos totales.** Quien más tira siempre anota más.
- **Los promedios de fila y columna** salen de sumar encestes y tiros reales, nunca de promediar los porcentajes de las celdas. Una posición donde se tiró el doble pesa el doble, como debe ser.
- **No compares días con distintas posiciones.** Un 80% de un día de posiciones 1 y 2 no es comparable contra un 60% de un día de posición 5. Para eso está el detalle por celda.

---

## Solución de problemas

**La app no se actualiza después de subir cambios.** No subiste el `VERSION` de `sw.js`. Cámbialo, sube el archivo, y en el teléfono cierra la app y vuelve a abrirla dos veces.

**Dice "Por subir" y no baja.** La URL del script está mal pegada, o la implementación no quedó como "Cualquier usuario". Revisa el Paso 2 punto 4.

**En iPhone no aparece "Agregar a inicio".** Está usando Chrome. Tiene que ser Safari.

**No veo las jornadas de otra persona.** Su teléfono no tiene la URL en Ajustes, o pegó una URL distinta. Compara que ambas terminen exactamente igual.

**La pantalla se apaga a media serie.** La app pide bloqueo de pantalla, pero algunos navegadores lo ignoran. Sube el tiempo de apagado del celular durante el entrenamiento.
