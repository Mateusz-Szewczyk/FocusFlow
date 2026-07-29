/* FocusFlow design-system bundle.
   Loads every component straight from components/<cat>/<Name>.jsx — the .jsx files
   stay the single source of truth, nothing is duplicated or pre-compiled.
   Requires React and @babel/standalone to already be on the page.
   Exposes window.DS (and window.FF as an alias). Synchronous by design so a plain
   <script src="_ds_bundle.js"> is finished before the next script tag runs. */
(function () {
  var FILES = [
    'type/Headline', 'type/Label', 'type/Note', 'type/Numeral',
    'core/Button', 'core/Chip', 'core/SegmentedControl', 'core/Rule',
    'data/StatRow', 'data/BulletItem', 'data/Timeline', 'data/Countdown',
    'shell/StatusBar', 'shell/PhoneFrame', 'shell/TabBar',
    'grove/Tree', 'grove/Grove', 'grove/ShareArt', 'grove/BreathRing',
  ];

  var here = (document.currentScript && document.currentScript.src) || location.href;
  var base = new URL('./components/', here);
  var DS = {};

  function read(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    if (xhr.status && xhr.status >= 400) throw new Error('cannot load ' + url);
    return xhr.responseText;
  }

  /* Babel is the slow part of loading a page, so compiled output is memoised in
     localStorage against a hash of the source: edit a .jsx and it recompiles. */
  function hash(s) {
    var h = 5381, i = s.length;
    while (i) h = (h * 33 ^ s.charCodeAt(--i)) >>> 0;
    return h.toString(36) + s.length.toString(36);
  }

  function transform(key, source) {
    var slot = 'ds:' + key + ':' + hash(source);
    try {
      var hit = localStorage.getItem(slot);
      if (hit) return hit;
    } catch (e) { /* private mode — just compile */ }
    var code = Babel.transform(source, {
      presets: [['react', { runtime: 'classic' }]], sourceType: 'script', filename: key,
    }).code;
    try {
      Object.keys(localStorage).forEach(function (k) {
        if (k.indexOf('ds:' + key + ':') === 0) localStorage.removeItem(k);
      });
      localStorage.setItem(slot, code);
    } catch (e) { /* quota — fine */ }
    return code;
  }

  function compile(path) {
    var src = read(new URL(path + '.jsx', base).href);

    /* named imports from sibling modules resolve out of what is already registered */
    var pre = [];
    src = src.replace(/^import\s+\{([^}]+)\}\s+from\s+['"][^'"]+['"];?\s*$/gm, function (_, names) {
      names.split(',').map(function (n) { return n.trim(); }).filter(Boolean)
        .forEach(function (n) { pre.push('var ' + n + ' = __DS__.' + n + ';'); });
      return '';
    });
    src = src.replace(/^import\s+[^\n]*from\s+['"][^'"]+['"];?\s*$/gm, '');

    var names = [];
    src = src.replace(/^export\s+(function|const|let|var|class)\s+([A-Za-z_$][\w$]*)/gm,
      function (_, kind, name) { names.push(name); return kind + ' ' + name; });

    var body = '(function(React, __DS__){"use strict";' + pre.join('') + '\n' + src +
      '\nreturn {' + names.map(function (n) { return n + ':' + n; }).join(',') + '};})';

    var out = transform(path + '.jsx', body);
    /* eslint-disable no-eval */
    var factory = eval(out);
    var exports = factory(window.React, DS);
    Object.keys(exports).forEach(function (k) { DS[k] = exports[k]; });
  }

  FILES.forEach(function (p) {
    try { compile(p); }
    catch (e) { console.error('[ds-bundle] ' + p + ': ' + e.message); }
  });

  window.DS = DS;
  window.FF = DS;

  /* Compile a list of sibling .jsx files as ONE script in a shared scope and hoist
     their top-level function declarations onto window. React and FF are in scope. */
  window.dsLoadScripts = function (urls) {
    var src = urls.map(function (u) { return read(new URL(u, location.href).href); }).join('\n;\n');
    var names = [];
    src.replace(/^function\s+([A-Za-z_$][\w$]*)/gm, function (m, n) { names.push(n); return m; });
    var body = '(function(React, FF){' + src + '\nreturn {' +
      names.map(function (n) { return n + ':' + n; }).join(',') + '};})';
    var out = transform(urls.join('+'), body);
    var ns = eval(out)(window.React, DS);
    Object.keys(ns).forEach(function (k) { window[k] = ns[k]; });
    return ns;
  };
})();
