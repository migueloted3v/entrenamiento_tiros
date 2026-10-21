<div align="center">

<img src="icon-192.png" width="96" alt="Ícono de la app">

# Entrenamiento de tiros

**Registra cada tiro, mide cuánto cuesta cada enceste y descubre dónde mejorar.**

App para el celular que acompaña el entrenamiento de tiro en baloncesto: se captura con un dedo en plena cancha, funciona sin internet y convierte cada jornada en análisis que un entrenador usaría.

📱 Se instala como app &nbsp;·&nbsp; 📶 Funciona sin señal &nbsp;·&nbsp; ☁️ Respaldo en Google Drive &nbsp;·&nbsp; 👨‍👩‍👧 Varios jugadores

<br>

<img src="docs/inicio.png" width="230" alt="Pantalla principal">&nbsp;&nbsp;
<img src="docs/captura.png" width="230" alt="Captura de tiros">&nbsp;&nbsp;
<img src="docs/lab.png" width="230" alt="Laboratorio">

</div>

---

## 🏀 Cómo funciona el entrenamiento

La cancha se divide en **5 líneas (A a E)** y **5 posiciones (1 a 5)**: 25 puntos de tiro.

1. **Eliges las posiciones del día** y cuántos encestes pides en cada punto (por ejemplo, 5).
2. **La jugadora tira hasta lograr esos encestes** en cada punto. La app cuenta cuántos tiros le costó.
3. Al completar un punto, la app **avanza sola en 3 segundos** al siguiente. Puedes pasar de inmediato o quedarte ahí.
4. Al final vienen los **tiros libres**: se tira hasta lograr 10 encestes. Si quiere seguir tirando para buscar racha, esos tiros extra se miden aparte.

> 💡 Medir *cuántos tiros cuesta* un enceste, en lugar de cuántos entran de un número fijo, hace que cada punto se trabaje hasta dominarlo.

---

## ✋ Captura con un dedo

<img src="docs/captura.png" width="220" align="right" alt="Pantalla de captura">

- Media pantalla **verde para "Anotó"** y media **roja para "Falló"**. No hay que ver el celular para atinarle.
- Arriba se ve el punto actual, los encestes que faltan y los círculos de cada intento.
- **Pausa**, **Omitir punto** y **Terminar** siempre a la mano.
- La pantalla se mantiene encendida durante la serie.
- Cada tiro guarda la hora exacta, así que la app sabe el **ritmo** al que se está tirando.

<br clear="right">

---

## 🏟️ Modo partido

Para los juegos de verdad, no solo la práctica:

- Tocas en la cancha **dónde fue el tiro** y si entró, fue bloqueado o hubo falta.
- Clasifica cada tiro en las **5 zonas estándar** (área restringida, pintura, media distancia, triple de esquina y triple sobre el arco), con medidas FIBA.
- Registra **rival, liga y periodo**, y calcula puntos, tiros de campo, triples, libres y asistencias.
- El resumen se puede ver por **partido**, por **liga** o con **todos sus partidos**.
- Puedes voltear la cancha al medio tiempo. El mapa se guarda siempre igual, así que el acumulado no se rompe.

---

## 📊 Análisis de cada jugador

<img src="docs/analisis.png" width="220" align="right" alt="Pantalla de análisis">

Desde la pantalla principal, **Análisis de [jugador]** muestra solo a quien esté seleccionado en *¿Quién tira?*:

- 🎯 **Efectividad acumulada** en tiros de línea y tiros libres.
- 🗺️ **Mapa de calor** de los 25 puntos, con encestes y tiros reales de cada uno.
- 📏 **Rendimiento por línea** y cuál es la más fuerte.
- 📅 Filtros de **todo**, **últimos 30 días** y **últimos 90 días**.

<br clear="right">

---

## 🧪 Laboratorio: el análisis a fondo

<div align="center">
<img src="docs/lab.png" width="230" alt="Racha más larga">&nbsp;&nbsp;
<img src="docs/lab2.png" width="230" alt="Tendencia y racha">
</div>

El botón **Laboratorio de [jugador]** responde las preguntas que un entrenador se hace y que no se ven a simple vista:

| | Módulo | La pregunta que responde |
|:-:|---|---|
| 🔥 | **Racha más larga** | ¿Cuántos encestes seguidos ha logrado, y cuándo? Gráfica por jornada, récord con fecha y récord de tiros libres. |
| 💰 | **Costo por posición** | ¿Cuántos tiros cuesta cada enceste y en qué posición se va el tiempo de entrenamiento? |
| 📈 | **Tendencia con margen de error** | ¿Está mejorando de verdad, o es la variación normal de un día a otro? |
| 🎲 | **¿Existe la racha?** | Después de encestar, ¿de verdad es más probable volver a encestar? Corrige el sesgo de la regla de "tirar hasta N encestes". |
| ⏱️ | **Ritmo de tiro** | ¿Tira mejor rápido o tomándose su tiempo? |
| 🔋 | **Curva de fatiga** | ¿Baja la efectividad conforme avanza la jornada? |
| 🎯 | **Puntos confiables y volátiles** | ¿Dónde es predecible y dónde depende del día? |
| 🆓 | **Tiros libres en secuencia** | ¿Cómo cambia el libre según su orden en la serie? |
| 🆚 | **Práctica contra partido** | ¿Cuánto de lo que encesta en práctica llega al juego? |

Cada módulo trae su gráfica, una lectura en palabras sencillas y una nota de qué cuidar al interpretarlo. Las jornadas de prueba (tiros capturados a menos de 1.5 segundos entre uno y otro) se descartan solas.

---

## ☁️ Tus datos, siempre a salvo

- **Primero se guarda en el teléfono.** Puedes capturar en un gimnasio sin señal y no se pierde nada.
- **Si no hay internet, la jornada espera en una cola** y sube sola la próxima vez que haya conexión.
- **Respaldo en una hoja de Google** compartida por la familia: todos los teléfonos ven los mismos jugadores, jornadas y análisis.
- La etiqueta de arriba a la derecha te dice el estado: **Drive activo**, **Por subir** o **Solo este equipo**.
- La hoja guarda una fila por tiro, lista para abrirse en Excel o conectarse a Power BI.

---

## 📐 Cómo se mide

- ✅ **Efectividad = encestes ÷ tiros realizados.** Cinco encestes en siete tiros es 71%.
- ➕ **Los promedios suman encestes y tiros reales**, nunca promedian porcentajes. Un punto donde se tiró el doble pesa el doble.
- ⏱️ **El ritmo solo cuenta tiros seguidos en el mismo punto.** El cambio de posición, las pausas y los intervalos de más de dos minutos no cuentan.
- ✳️ **El asterisco en el mapa de calor** marca puntos que se cerraron sin llegar al objetivo.
- 🛡️ **Un tiro bloqueado cuenta como fallado**, igual que en la estadística oficial, y se marca aparte.
- ⚪ **Una zona de partido con menos de seis tiros se muestra en gris**: su porcentaje todavía no dice nada.
- ⚖️ **Compara puntos por tiro, no puntos totales.** Quien más tira siempre anota más.
- 🔄 **No compares días con posiciones distintas.** Un 80% en posiciones 1 y 2 no se compara con un 60% en la 5. Para eso está el detalle por punto.

---

<div align="center">

🛠️ ¿Vas a instalarla o actualizarla? Revisa [INSTALACION.md](INSTALACION.md).

Hecho para entrenar en familia 🧡

</div>
