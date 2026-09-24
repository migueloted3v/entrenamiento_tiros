/**
 * Cinco Líneas — respaldo en Google Sheets
 * ---------------------------------------------------------------
 * Instalación (una sola vez):
 *   1. Crea una hoja de cálculo nueva en Drive: "Cinco Lineas - Tiros".
 *   2. Menú Extensiones → Apps Script. Borra el contenido y pega esto.
 *   3. Implementar → Nueva implementación → tipo "Aplicación web".
 *        Ejecutar como: Yo
 *        Quién tiene acceso: Cualquier usuario
 *   4. Copia la URL que termina en /exec y pégala en Ajustes dentro de la app.
 *
 * La hoja se crea sola con dos pestañas:
 *   Jornadas — una fila por sesión (grano de jornada)
 *   Tiros    — una fila por tiro    (grano de detalle, para Power BI)
 */

var LINEAS = ['A','B','C','D','E'];

var COLS_JORNADAS = ['jornada_id','jugador','fecha_iso','fecha_local','posiciones',
  'encestes_objetivo','tl_objetivo','encestes_linea','tiros_linea','efectividad_linea',
  'encestes_tl','tiros_tl','efectividad_tl','registrado'];

var COLS_TIROS = ['jornada_id','jugador','fecha_local','fase','linea','posicion','intento',
  'enceste','seg_desde_anterior','ts_ms','linea_idx','pos_idx'];

var COLS_JUEGOS = ['partido_id','jugador','fecha_iso','fecha_local','rival','liga','puntos',
  'tc_anotados','tc_intentos','t3_anotados','t3_intentos','tl_anotados','tl_intentos',
  'asistencias','bloqueados','registrado'];

var COLS_TJ = ['partido_id','jugador','fecha_local','periodo','rival','liga','x','y','distancia_m','zona',
  'triple','enceste','bloqueado','falta','tl_anotados','tl_intentos','puntos','ts_ms'];

var ARO_X = 45, ARO_Y = 195, PX_M = 22;
function esTriple_(z) { return z === 'C3' || z === 'ATB'; }
function distM_(x, y) {
  return Math.sqrt(Math.pow(x - ARO_X, 2) + Math.pow(y - ARO_Y, 2)) / PX_M;
}
function puntos_(s) {
  return (s.made ? (esTriple_(s.zona) ? 3 : 2) : 0) + (s.ftM || 0);
}

function hoja_(nombre, cols) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(nombre);
  if (!sh) {
    sh = ss.insertSheet(nombre);
    sh.appendRow(cols);
    sh.getRange(1, 1, 1, cols.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function local_(ms) {
  return Utilities.formatDate(new Date(ms), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---------------- escritura ---------------- */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var body = JSON.parse(e.postData.contents);
    if (body.accion === 'guardar_juego') return guardarJuego_(body.juego);
    if (body.accion === 'editar_juego') return editarJuego_(body);
    if (body.accion !== 'guardar') return json_({ ok: false, error: 'accion desconocida' });

    var j = body.jornada;
    var shJ = hoja_('Jornadas', COLS_JORNADAS);
    var shT = hoja_('Tiros', COLS_TIROS);

    // idempotencia: si la jornada ya está, no la duplicamos
    var ids = shJ.getLastRow() > 1
      ? shJ.getRange(2, 1, shJ.getLastRow() - 1, 1).getValues().map(function (r) { return String(r[0]); })
      : [];
    if (ids.indexOf(String(j.id)) >= 0) return json_({ ok: true, duplicado: true });

    var shots = j.shots || [];
    var linea = shots.filter(function (s) { return s.line !== 5; });
    var tl    = shots.filter(function (s) { return s.line === 5; });
    var mL = linea.filter(function (s) { return s.made; }).length;
    var mT = tl.filter(function (s) { return s.made; }).length;

    shJ.appendRow([
      j.id, j.playerName, j.startedAt, local_(new Date(j.startedAt).getTime()),
      (j.positions || []).map(function (p) { return p + 1; }).join(','),
      j.target, j.ftTarget,
      mL, linea.length, linea.length ? mL / linea.length : '',
      mT, tl.length, tl.length ? mT / tl.length : '',
      new Date()
    ]);

    var intento = {};
    var filas = shots.map(function (s) {
      var k = s.line + '-' + s.pos;
      intento[k] = (intento[k] || 0) + 1;
      var ft = s.line === 5;
      return [
        j.id, j.playerName, local_(s.t),
        ft ? 'TL' : 'LINEA',
        ft ? '' : LINEAS[s.line],
        ft ? '' : s.pos + 1,
        intento[k],
        s.made ? 1 : 0,
        typeof s.gap === 'number' ? Math.round(s.gap) / 1000 : '',
        s.t, s.line, s.pos
      ];
    });
    if (filas.length) {
      shT.getRange(shT.getLastRow() + 1, 1, filas.length, COLS_TIROS.length).setValues(filas);
    }
    return json_({ ok: true, tiros: filas.length });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function guardarJuego_(j) {
  var shJ = hoja_('Juegos', COLS_JUEGOS);
  var shT = hoja_('Tiros_Juego', COLS_TJ);

  var ids = shJ.getLastRow() > 1
    ? shJ.getRange(2, 1, shJ.getLastRow() - 1, 1).getValues().map(function (r) { return String(r[0]); })
    : [];
  if (ids.indexOf(String(j.id)) >= 0) return json_({ ok: true, duplicado: true });

  var shots = j.shots || [];
  var pts = 0, tcm = 0, t3a = 0, t3m = 0, tla = 0, tlm = 0, blq = 0;
  shots.forEach(function (s) {
    pts += puntos_(s);
    if (s.made) tcm++;
    if (s.blocked) blq++;
    if (esTriple_(s.zona)) { t3a++; if (s.made) t3m++; }
    tla += (s.ftA || 0); tlm += (s.ftM || 0);
  });
  var asis = (j.assists || []).length;

  shJ.appendRow([j.id, j.playerName, j.startedAt, local_(new Date(j.startedAt).getTime()), j.rival,
    j.liga || '', pts, tcm, shots.length, t3m, t3a, tlm, tla, asis, blq, new Date()]);

  var filas = shots.map(function (s) {
    return [j.id, j.playerName, local_(s.t), s.periodo, j.rival, j.liga || '', s.x, s.y,
      Math.round(distM_(s.x, s.y) * 100) / 100, s.zona, esTriple_(s.zona) ? 1 : 0,
      s.made ? 1 : 0, s.blocked ? 1 : 0, s.foul ? 1 : 0, s.ftM || 0, s.ftA || 0, puntos_(s), s.t];
  });
  if (filas.length) {
    shT.getRange(shT.getLastRow() + 1, 1, filas.length, COLS_TJ.length).setValues(filas);
  }
  return json_({ ok: true, tiros: filas.length });
}

function editarJuego_(b) {
  var cambios = 0;
  [['Juegos', COLS_JUEGOS, 5, 6], ['Tiros_Juego', COLS_TJ, 4, 5]].forEach(function (cfg) {
    var sh = hoja_(cfg[0], cfg[1]);
    if (sh.getLastRow() < 2) return;
    var n = sh.getLastRow() - 1;
    var ids = sh.getRange(2, 1, n, 1).getValues();
    for (var i = 0; i < n; i++) {
      if (String(ids[i][0]) !== String(b.id)) continue;
      sh.getRange(i + 2, cfg[2]).setValue(b.rival);
      sh.getRange(i + 2, cfg[3]).setValue(b.liga || '');
      cambios++;
    }
  });
  return json_({ ok: true, filas: cambios });
}

/* ---------------- lectura ---------------- */
function doGet(e) {
  try {
    if (!e || !e.parameter || e.parameter.accion !== 'leer') {
      return json_({ ok: true, mensaje: 'Cinco Líneas activo' });
    }
    var shJ = hoja_('Jornadas', COLS_JORNADAS);
    var shT = hoja_('Tiros', COLS_TIROS);
    if (shJ.getLastRow() < 2) return json_({ ok: true, jornadas: [] });

    var J = shJ.getRange(2, 1, shJ.getLastRow() - 1, COLS_JORNADAS.length).getValues();
    var T = shT.getLastRow() > 1
      ? shT.getRange(2, 1, shT.getLastRow() - 1, COLS_TIROS.length).getValues() : [];

    var porId = {};
    T.forEach(function (r) {
      var id = String(r[0]);
      (porId[id] = porId[id] || []).push({
        line: Number(r[10]), pos: Number(r[11]),
        made: Number(r[7]) === 1,
        t: Number(r[9]),
        gap: r[8] === '' ? null : Number(r[8]) * 1000
      });
    });

    var jornadas = J.map(function (r) {
      var id = String(r[0]);
      return {
        id: id,
        playerName: String(r[1]),
        startedAt: (r[2] instanceof Date) ? r[2].toISOString() : String(r[2]),
        positions: String(r[4] || '').split(',').filter(String).map(function (p) { return Number(p) - 1; }),
        target: Number(r[5]) || 5,
        ftTarget: Number(r[6]) || 10,
        shots: (porId[id] || []).sort(function (a, b) { return a.t - b.t; })
      };
    });
    var juegos = [];
    var shG = hoja_('Juegos', COLS_JUEGOS);
    if (shG.getLastRow() > 1) {
      var G = shG.getRange(2, 1, shG.getLastRow() - 1, COLS_JUEGOS.length).getValues();
      var shTJ = hoja_('Tiros_Juego', COLS_TJ);
      var TJ = shTJ.getLastRow() > 1
        ? shTJ.getRange(2, 1, shTJ.getLastRow() - 1, COLS_TJ.length).getValues() : [];
      var porJuego = {};
      TJ.forEach(function (r) {
        var id = String(r[0]);
        (porJuego[id] = porJuego[id] || []).push({
          x: Number(r[6]), y: Number(r[7]), zona: String(r[9]),
          made: Number(r[11]) === 1, blocked: Number(r[12]) === 1, foul: Number(r[13]) === 1,
          ftM: Number(r[14]) || 0, ftA: Number(r[15]) || 0,
          periodo: r[3], t: Number(r[17])
        });
      });
      juegos = G.map(function (r) {
        var id = String(r[0]);
        return {
          id: id, playerName: String(r[1]),
          startedAt: (r[2] instanceof Date) ? r[2].toISOString() : String(r[2]),
          rival: String(r[4]), liga: String(r[5] || ''),
          assists: new Array(Number(r[13]) || 0).fill(0).map(function () { return { t: 0, periodo: '' }; }),
          shots: (porJuego[id] || []).sort(function (a, b) { return a.t - b.t; })
        };
      });
    }
    return json_({ ok: true, jornadas: jornadas, juegos: juegos });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}
