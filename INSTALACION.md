# Instalación y mantenimiento

Guía para publicar la app, conectar el respaldo en Google Drive, darla de alta en cada teléfono y actualizarla. Para saber qué hace la app, ve el [README](README.md).

---

## Archivos del repositorio

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app completa. Un solo archivo, sin compilación. |
| `manifest.json` | Nombre, colores e íconos para instalarla como app. |
| `sw.js` | Service worker: permite abrirla sin internet. |
| `icon-180.png`, `icon-192.png`, `icon-512.png` | Íconos. |
| `docs/` | Capturas de pantalla que usa el README. |
| `README.md`, `INSTALACION.md` | Documentación. |
| `apps-script.gs` | Se pega en Google Apps Script, **no** se sube al sitio. |

---

## Paso 1 — Publicar en GitHub Pages

1. En GitHub, **New repository**. Nombre: `cinco-lineas`. Visibilidad **Public** (Pages gratis requiere repo público). No marques "Add a README".
2. En el repo vacío, **uploading an existing file**. Arrastra todos los archivos de la tabla de arriba, **excepto** `apps-script.gs`. La carpeta `docs` se arrastra completa.
3. Revisa que el HTML se llame exactamente `index.html`. GitHub Pages solo sirve la portada con ese nombre.
4. **Commit changes**.
5. **Settings → Pages**. En *Source* elige `Deploy from a branch`, rama `main`, carpeta `/ (root)`. **Save**.
6. Espera un par de minutos y recarga la página de Settings. Aparece la URL:

   ```
   https://TU-USUARIO.github.io/cinco-lineas/
   ```

Esa es la dirección que vas a compartir.

---

## Paso 2 — Crear la hoja de Google

1. En Drive, crea una hoja nueva: **Entrenamiento de tiros**.
2. **Extensiones → Apps Script**. Borra lo que traiga y pega el contenido de `apps-script.gs`.
3. Guarda (ícono de disco).
4. **Implementar → Nueva implementación**. En el engrane elige **Aplicación web**.
   - *Descripción:* `v1`
   - *Ejecutar como:* **Yo**
   - *Quién tiene acceso:* **Cualquier usuario**
5. **Implementar**. Google pedirá autorizar; acepta (la advertencia de "app no verificada" es normal en scripts propios: *Configuración avanzada → Ir a…*).
6. Copia la URL que termina en `/exec`.

Las pestañas `Jornadas`, `Tiros`, `Juegos` y `Tiros_Juego` se crean solas con el primer registro.

> **Importante:** si dejas *Quién tiene acceso* en "Solo yo", los demás teléfonos recibirán error de permisos y sus jornadas se quedarán atoradas en la cola de subida.

> **Al modificar el script después:** usa **Implementar → Gestionar implementaciones → editar (lápiz) → Versión: Nueva versión**. Si creas una implementación nueva desde cero, cambia la URL y hay que actualizarla en todos los teléfonos.

---

## Paso 3 — Dar de alta cada teléfono

No hay cuentas ni contraseñas. Un teléfono queda dado de alta cuando apunta a la misma hoja.

Para cada persona que va a capturar:

1. Mándale la URL de GitHub Pages por WhatsApp.
2. Que la abra en el navegador del celular y la instale:
   - **Android / Chrome:** menú ⋮ → *Agregar a pantalla principal*.
   - **iPhone / Safari:** botón compartir → *Agregar a inicio*. En iPhone tiene que ser Safari; desde Chrome no se instala.
3. Que abra la app y toque la etiqueta de arriba a la derecha (dice *Solo este equipo*).
4. Que pegue ahí la URL `/exec` del Paso 2 y toque **Guardar y sincronizar**.
5. La etiqueta cambia a **Drive activo**. Listo.

A partir de ahí los jugadores, las jornadas y los partidos se ven iguales en todos los teléfonos.

**Los jugadores no son usuarios.** Cada quien agrega los nombres que va a medir en *¿Quién tira?* y esos nombres se sincronizan solos. Si alguien más registra a una jugadora, sus jornadas aparecen en el Análisis y el Laboratorio de esa jugadora en todos los teléfonos.

### Cuidado con la URL del script

Esa dirección es la llave de la hoja: quien la tenga puede escribir en ella. Para uso familiar está bien, pero **no la pongas dentro de `index.html` ni la subas al repo**. Por eso se captura en Ajustes y se guarda solo en el teléfono. Si algún día se filtra, genera una implementación nueva en Apps Script y reparte la URL nueva.

---

## Actualizar la app

Cada vez que cambies `index.html`:

1. Sube el `index.html` nuevo a GitHub (o ábrelo con el lápiz, pega el contenido completo y haz commit).
2. En `sw.js` cambia **una sola línea**, la versión, a un número mayor:

   ```js
   var VERSION = 'tiros-v9';   // la siguiente sería 'tiros-v10'
   ```

3. Espera 1 o 2 minutos a que GitHub Pages publique.
4. En el teléfono, cierra la app por completo y ábrela **dos veces**: la primera baja la versión nueva y la segunda la muestra.

> Si no cambias `VERSION`, los teléfonos seguirán abriendo la versión guardada en caché.

---

## Estructura de la hoja

**`Jornadas`**: una fila por sesión. Identificador, jugador, fecha, posiciones entrenadas, objetivo de encestes, totales y efectividad de línea y de tiros libres, y la regla de tiros libres (`regla_tl`).

**`Tiros`**: una fila por tiro. Jornada, jugador, fecha, fase (`LINEA` o `TL`), línea, posición, número de intento, resultado (1/0) y segundos desde el tiro anterior.

**`Juegos`**: una fila por partido. Identificador, jugador, fecha, rival, liga, puntos, tiros de campo, triples, tiros libres, asistencias y tiros bloqueados.

**`Tiros_Juego`**: una fila por tiro de partido. Partido, jugador, fecha, periodo, rival, liga, coordenadas, distancia en metros, zona, si fue triple, resultado, si fue bloqueado, falta, tiros libres y puntos de la jugada.

`Tiros` es la tabla de hechos: conéctala directo a Power BI para tendencias por posición o cruces de efectividad contra ritmo. `Jornadas` sirve como dimensión de sesión. Para bajarla como Excel: **Archivo → Descargar → Microsoft Excel**.

> **Regla de tiros libres:** las jornadas anteriores al 15 de octubre de 2026 se midieron con 10 intentos fijos (`intentos`); las nuevas se miden hasta 10 encestes (`encestes`). Para tendencias, suma encestes y tiros del periodo en lugar de promediar porcentajes.

---

## Solución de problemas

**La app no se actualiza después de subir cambios.** No cambiaste el `VERSION` de `sw.js`, o GitHub Pages todavía no publica. Cámbialo, súbelo, espera un par de minutos y en el teléfono cierra la app y vuelve a abrirla dos veces.

**No aparece un botón nuevo.** Es el mismo caso: el teléfono sigue mostrando la versión en caché. Revisa que hayas subido **los dos** archivos, `index.html` y `sw.js`.

**Dice "Por subir" y no baja.** La URL del script está mal pegada, o la implementación no quedó como "Cualquier usuario". Revisa el Paso 2 punto 4.

**En iPhone no aparece "Agregar a inicio".** Está usando Chrome. Tiene que ser Safari.

**No veo las jornadas de otra persona.** Su teléfono no tiene la URL en Ajustes, o pegó una URL distinta. Compara que ambas terminen exactamente igual.

**Las imágenes del README no se ven en GitHub.** La carpeta `docs` no se subió o quedó con otro nombre. Debe llamarse `docs`, en minúsculas, en la raíz del repo.

**La pantalla se apaga a media serie.** La app pide bloqueo de pantalla, pero algunos navegadores lo ignoran. Sube el tiempo de apagado del celular durante el entrenamiento.
