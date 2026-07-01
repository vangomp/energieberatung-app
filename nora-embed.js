(function () {
  try {
    var BASE = 'https://xytmbhbkridbepeyhfml.supabase.co/functions/v1';

    function tok() {
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (/^sb-.*-auth-token$/.test(k)) {
            var v = JSON.parse(localStorage.getItem(k));
            var at = v && (v.access_token || (v.currentSession && v.currentSession.access_token) || (Array.isArray(v) && v[0]));
            if (at) return at;
          }
        }
      } catch (e) {}
      return null;
    }
    function api(path, opts) {
      opts = opts || {};
      var t = tok();
      opts.headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {}, t ? { 'Authorization': 'Bearer ' + t } : {});
      return fetch(BASE + path, opts).then(function (r) { return r.json(); });
    }
    function h(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
    var deDate = function (s) { return s ? new Date(s) : null; };
    var fDate = function (d) { return d ? d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) : '—'; };
    var fTime = function (d) { return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); };
    var dName = function (d) { return d.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' }); };

    function css() {
      if (document.getElementById('noraCss')) return;
      var s = document.createElement('style'); s.id = 'noraCss';
      s.textContent = [
        '#view-nora .nora-bar{display:flex;gap:8px;margin:0 0 16px}',
        '#view-nora .nora-sub{background:transparent;border:1px solid var(--border);color:var(--muted);padding:7px 14px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500}',
        '#view-nora .nora-sub.on{background:var(--panel2);color:var(--text);border-color:var(--accent)}',
        '#view-nora .nora-card{background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:14px}',
        '#view-nora .nora-t{font-weight:600;font-size:15px;color:var(--text)}',
        '#view-nora .nora-m{font-size:13px;color:var(--muted);margin-top:2px}',
        '#view-nora .nora-pill{display:inline-block;font-size:11px;padding:2px 8px;border-radius:20px;margin-left:8px;vertical-align:middle}',
        '#view-nora .nora-over{background:rgba(248,113,113,.16);color:var(--bad)}',
        '#view-nora .nora-top{background:rgba(79,140,255,.16);color:var(--accent)}',
        '#view-nora .nora-day h4{font-size:13px;color:var(--muted);margin:14px 0 4px;font-weight:600}',
        '#view-nora .nora-ev{display:flex;gap:12px;padding:7px 0;border-top:1px solid var(--border)}',
        '#view-nora .nora-ev .tm{color:var(--accent);font-weight:600;font-size:13px;min-width:56px}',
        '#view-nora .nora-cols{display:grid;grid-template-columns:1fr 1fr;gap:14px}',
        '@media(max-width:820px){#view-nora .nora-cols{grid-template-columns:1fr}}',
        '#view-nora .nora-in{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:7px 9px;font-size:14px;color:var(--text)}',
        '#view-nora .nora-in.name{width:100%}#view-nora .nora-in.hrs{width:62px;text-align:right}',
        '#view-nora select.nora-in{background:var(--panel2)}',
        '#view-nora .nora-sv{background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 13px;font-weight:600;cursor:pointer}',
        '#view-nora .nora-gh{border:1px solid var(--border);background:transparent;color:var(--text);border-radius:8px;padding:8px 13px;cursor:pointer;font-size:14px}',
        '#view-nora .nora-empty{color:var(--muted);font-size:14px}',
        '#view-nora table{width:100%;border-collapse:collapse}#view-nora td{padding:4px 3px}'
      ].join('');
      document.head.appendChild(s);
    }

    function renderPlan(body) {
      body.innerHTML = '<div class="nora-empty">Lädt…</div>';
      api('/eb-plan').then(function (j) {
        if (j.error) { body.innerHTML = '<div class="nora-empty">' + (j.error === 'unauthorized' ? 'Bitte mit dem JJ-Google-Konto anmelden.' : 'Fehler: ' + j.error) + '</div>'; return; }
        body.innerHTML = '';
        var cols = h('div', 'nora-cols');
        var todos = j.todos || [];
        var ca = h('div', 'nora-card'); ca.appendChild(h('div', 'nora-t', 'Aufgaben (' + todos.length + ' offen)'));
        todos.forEach(function (x, i) {
          var d = h('div'); d.style.padding = '10px 0'; d.style.borderTop = i ? '1px solid var(--border)' : 'none';
          var ti = h('div', 'nora-t'); ti.textContent = x.title;
          if (i === 0) ti.appendChild(h('span', 'nora-pill nora-top', 'Jetzt dran'));
          if (x.overdue) ti.appendChild(h('span', 'nora-pill nora-over', 'überfällig'));
          d.appendChild(ti);
          d.appendChild(h('div', 'nora-m', x.project || ''));
          d.appendChild(h('div', 'nora-m', 'Frist ' + fDate(deDate(x.due)) + (x.amount ? (' · ' + x.amount + ' €') : '')));
          ca.appendChild(d);
        });
        if (!todos.length) ca.appendChild(h('div', 'nora-empty', 'Nichts offen. Stark.'));
        var cc = h('div', 'nora-card'); cc.appendChild(h('div', 'nora-t', 'Diese Woche'));
        if (!j.calendar_ok) cc.appendChild(h('div', 'nora-empty', 'Kalender nicht verbunden.'));
        else {
          var evs = (j.calendar || []).map(function (e) { return { t: e.title, allDay: e.allDay, s: deDate(e.start) }; }).filter(function (e) { return e.s; }).sort(function (a, b) { return a.s - b.s; });
          if (!evs.length) cc.appendChild(h('div', 'nora-empty', 'Keine Termine.'));
          var g = {}; evs.forEach(function (e) { var k = e.s.toISOString().slice(0, 10); (g[k] = g[k] || []).push(e); });
          Object.keys(g).sort().forEach(function (k) {
            var day = h('div', 'nora-day'); day.appendChild(h('h4', null, dName(new Date(k + 'T00:00:00'))));
            g[k].forEach(function (e) { var r = h('div', 'nora-ev'); r.appendChild(h('div', 'tm', e.allDay ? 'ganztg.' : fTime(e.s))); r.appendChild(h('div', null, e.t)); day.appendChild(r); });
            cc.appendChild(day);
          });
        }
        cols.appendChild(ca); cols.appendChild(cc); body.appendChild(cols);
      }).catch(function () { body.innerHTML = '<div class="nora-empty">Konnte nicht laden.</div>'; });
    }

    function stepRow(tb, s) {
      var tr = h('tr');
      var nm = h('input', 'nora-in name'); nm.value = s.name || '';
      var hr = h('input', 'nora-in hrs'); hr.type = 'number'; hr.step = '0.5'; hr.value = s.hours != null ? s.hours : 0;
      var kd = h('select', 'nora-in'); [['movable', 'beweglich'], ['fix', 'Termin-fix']].forEach(function (o) { var op = h('option', null, o[1]); op.value = o[0]; if ((s.kind || 'movable') === o[0]) op.selected = true; kd.appendChild(op); });
      var rm = h('button', null, '×'); rm.style.cssText = 'border:none;background:none;color:var(--bad);cursor:pointer;font-size:16px'; rm.onclick = function () { tr.remove(); };
      [nm, hr, kd, rm].forEach(function (x) { var td = h('td'); td.appendChild(x); tr.appendChild(td); });
      tb.appendChild(tr);
    }
    function stepCard(plan) {
      var c = h('div', 'nora-card');
      var type = h('input', 'nora-in name'); type.value = plan.auftrag_type || ''; type.placeholder = 'Auftragsart'; type.style.fontWeight = '600'; type.style.marginBottom = '8px';
      c.appendChild(type);
      var tbl = h('table'); var tb = h('tbody'); tbl.appendChild(tb); c.appendChild(tbl);
      (plan.steps || []).forEach(function (s) { stepRow(tb, s); });
      var bar = h('div'); bar.style.cssText = 'display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;align-items:center';
      var add = h('button', 'nora-gh', '+ Schritt'); add.onclick = function () { stepRow(tb, { name: '', hours: 0, kind: 'movable' }); };
      var sv = h('button', 'nora-sv', 'Speichern');
      var msg = h('span'); msg.style.cssText = 'font-size:13px;margin-left:auto';
      sv.onclick = function () {
        var steps = [].slice.call(tb.querySelectorAll('tr')).map(function (tr) { return { name: tr.querySelector('input.name').value.trim(), hours: Number(tr.querySelector('input.hrs').value) || 0, kind: tr.querySelector('select').value }; }).filter(function (s) { return s.name; });
        msg.textContent = 'Speichere…'; msg.style.color = 'var(--muted)';
        api('/eb-steps', { method: 'POST', body: JSON.stringify({ auftrag_type: type.value.trim(), steps: steps }) }).then(function (j) { if (j.ok) { msg.textContent = '✓ ' + j.total_hours + ' h'; msg.style.color = 'var(--good)'; } else { msg.textContent = j.error || 'Fehler'; msg.style.color = 'var(--bad)'; } });
      };
      bar.appendChild(add); bar.appendChild(sv); bar.appendChild(msg); c.appendChild(bar);
      return c;
    }
    function renderSteps(body) {
      body.innerHTML = '<div class="nora-empty">Lädt…</div>';
      api('/eb-steps').then(function (j) {
        if (j.error) { body.innerHTML = '<div class="nora-empty">' + (j.error === 'unauthorized' ? 'Bitte mit dem JJ-Google-Konto anmelden.' : 'Fehler: ' + j.error) + '</div>'; return; }
        body.innerHTML = '';
        body.appendChild(h('div', 'nora-m', 'Zeiten sind Startwerte – an echte Zeiten anpassen, dann Speichern. „Termin-fix“ = an einen Termin gebunden.'));
        (j.plans || []).forEach(function (p) { body.appendChild(stepCard(p)); });
        var addT = h('button', 'nora-gh', '+ Neue Auftragsart'); addT.style.width = '100%'; addT.style.marginTop = '4px';
        addT.onclick = function () { var c = stepCard({ auftrag_type: '', steps: [{ name: '', hours: 0, kind: 'movable' }] }); body.insertBefore(c, addT); };
        body.appendChild(addT);
      }).catch(function () { body.innerHTML = '<div class="nora-empty">Konnte nicht laden.</div>'; });
    }

    function build(nav, main) {
      if (document.getElementById('view-nora')) return;
      css();
      var btn = h('button', null, 'Nora'); btn.id = 'noraTab';
      nav.appendChild(btn);
      var sec = h('section', 'view'); sec.id = 'view-nora';
      var bar = h('div', 'nora-bar');
      var tp = h('button', 'nora-sub on', 'Heute');
      var ts = h('button', 'nora-sub', 'Schritt-Pläne');
      bar.appendChild(tp); bar.appendChild(ts);
      var body = h('div', 'nora-body');
      sec.appendChild(bar); sec.appendChild(body);
      main.appendChild(sec);
      function sub(w) { tp.classList.toggle('on', w === 'plan'); ts.classList.toggle('on', w === 'steps'); w === 'plan' ? renderPlan(body) : renderSteps(body); }
      btn.addEventListener('click', function () {
        main.querySelectorAll('section.view').forEach(function (v) { v.classList.remove('active'); });
        nav.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
        sec.classList.add('active'); btn.classList.add('active'); sub('plan');
      });
      tp.addEventListener('click', function () { sub('plan'); });
      ts.addEventListener('click', function () { sub('steps'); });
      nav.querySelectorAll('button').forEach(function (b) { if (b !== btn) b.addEventListener('click', function () { sec.classList.remove('active'); btn.classList.remove('active'); }); });
    }

    var tries = 0;
    function tryBuild() {
      if (document.getElementById('view-nora')) return;
      var nav = document.querySelector('nav.tabs'); var main = document.querySelector('main');
      if (nav && main) build(nav, main);
      else if (tries++ < 40) setTimeout(tryBuild, 500);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tryBuild); else tryBuild();
  } catch (e) { console.warn('nora-embed failed', e); }
})();
