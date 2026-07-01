(function () {
  try {
    var BASE = 'https://xytmbhbkridbepeyhfml.supabase.co/functions/v1';
    var ACC = '#2E6C8E';

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
      var s = document.createElement('style');
      s.textContent = [
        '#noraBtn{position:fixed;right:18px;bottom:18px;z-index:2147483000;background:' + ACC + ';color:#fff;border:none;border-radius:26px;padding:12px 18px;font:600 15px system-ui,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.25);cursor:pointer}',
        '#noraOv{position:fixed;inset:0;z-index:2147483001;background:rgba(20,30,38,.45);display:none}',
        '#noraOv.on{display:block}',
        '#noraPanel{position:absolute;top:0;right:0;height:100%;width:min(560px,100%);background:#f7fafc;overflow:auto;box-shadow:-8px 0 24px rgba(0,0,0,.2);font-family:system-ui,sans-serif;color:#1f2a33}',
        '.nora-hd{position:sticky;top:0;background:#fff;border-bottom:1px solid #e2e8ed;padding:14px 18px;display:flex;align-items:center;gap:10px}',
        '.nora-hd b{color:' + ACC + ';font-size:18px;margin-right:auto}',
        '.nora-tab{border:1px solid #e2e8ed;background:#fff;border-radius:8px;padding:7px 12px;font-size:14px;cursor:pointer}',
        '.nora-tab.on{background:' + ACC + ';color:#fff;border-color:' + ACC + '}',
        '#noraX{border:none;background:none;font-size:22px;cursor:pointer;color:#5a6b75;line-height:1}',
        '.nora-body{padding:16px 18px 60px}',
        '.nora-card{background:#fff;border:1px solid #e2e8ed;border-radius:12px;padding:14px;margin-bottom:12px}',
        '.nora-t{font-weight:600;font-size:15px}',
        '.nora-m{font-size:13px;color:#5a6b75;margin-top:2px}',
        '.nora-pill{display:inline-block;font-size:12px;padding:2px 8px;border-radius:20px;margin-left:6px}',
        '.nora-over{background:#fdecec;color:#b23b3b}.nora-top{background:#e4eef3;color:' + ACC + '}',
        '.nora-day h4{font-size:13px;color:#5a6b75;margin:12px 0 4px}',
        '.nora-ev{display:flex;gap:10px;padding:6px 0;border-top:1px solid #eef2f5}',
        '.nora-ev .tm{color:' + ACC + ';font-weight:600;font-size:13px;min-width:54px}',
        '.nora-in{border:1px solid #e2e8ed;border-radius:8px;padding:6px 8px;font-size:14px}',
        '.nora-in.name{width:100%}.nora-in.hrs{width:60px;text-align:right}',
        '.nora-sv{background:' + ACC + ';color:#fff;border:none;border-radius:8px;padding:8px 12px;font-weight:600;cursor:pointer}',
        '.nora-gh{border:1px solid #e2e8ed;background:#fff;border-radius:8px;padding:8px 12px;cursor:pointer;font-size:14px}',
        '.nora-empty{color:#5a6b75;font-size:14px}'
      ].join('');
      document.head.appendChild(s);
    }

    function renderPlan(body) {
      body.innerHTML = '<div class="nora-empty">Lädt…</div>';
      api('/eb-plan').then(function (j) {
        if (j.error) { body.innerHTML = '<div class="nora-empty">' + (j.error === 'unauthorized' ? 'Bitte in der App mit Google anmelden.' : 'Fehler: ' + j.error) + '</div>'; return; }
        body.innerHTML = '';
        var todos = j.todos || [];
        var ha = h('div', 'nora-card');
        ha.appendChild(h('div', 'nora-t', 'Aufgaben (' + todos.length + ' offen)'));
        todos.forEach(function (x, i) {
          var d = h('div'); d.style.padding = '10px 0'; d.style.borderTop = i ? '1px solid #eef2f5' : 'none';
          var title = h('div', 'nora-t'); title.textContent = x.title;
          if (i === 0) title.appendChild(h('span', 'nora-pill nora-top', 'Jetzt dran'));
          if (x.overdue) title.appendChild(h('span', 'nora-pill nora-over', 'überfällig'));
          d.appendChild(title);
          d.appendChild(h('div', 'nora-m', x.project || ''));
          d.appendChild(h('div', 'nora-m', 'Frist ' + fDate(deDate(x.due)) + (x.amount ? (' · ' + x.amount + ' €') : '')));
          ha.appendChild(d);
        });
        body.appendChild(ha);
        var hc = h('div', 'nora-card');
        hc.appendChild(h('div', 'nora-t', 'Diese Woche'));
        if (!j.calendar_ok) hc.appendChild(h('div', 'nora-empty', 'Kalender nicht verbunden.'));
        else {
          var evs = (j.calendar || []).map(function (e) { return { t: e.title, allDay: e.allDay, s: deDate(e.start) }; }).filter(function (e) { return e.s; }).sort(function (a, b) { return a.s - b.s; });
          if (!evs.length) hc.appendChild(h('div', 'nora-empty', 'Keine Termine.'));
          var groups = {}; evs.forEach(function (e) { var k = e.s.toISOString().slice(0, 10); (groups[k] = groups[k] || []).push(e); });
          Object.keys(groups).sort().forEach(function (k) {
            var g = h('div', 'nora-day'); g.appendChild(h('h4', null, dName(new Date(k + 'T00:00:00'))));
            groups[k].forEach(function (e) { var r = h('div', 'nora-ev'); r.appendChild(h('div', 'tm', e.allDay ? 'ganztg.' : fTime(e.s))); r.appendChild(h('div', null, e.t)); g.appendChild(r); });
            hc.appendChild(g);
          });
        }
        body.appendChild(hc);
      }).catch(function () { body.innerHTML = '<div class="nora-empty">Konnte nicht laden.</div>'; });
    }

    function stepRow(tb, s) {
      var tr = h('tr');
      var nm = h('input', 'nora-in name'); nm.value = s.name || '';
      var hr = h('input', 'nora-in hrs'); hr.type = 'number'; hr.step = '0.5'; hr.value = s.hours != null ? s.hours : 0;
      var kd = h('select', 'nora-in'); [['movable', 'beweglich'], ['fix', 'Termin-fix']].forEach(function (o) { var op = h('option', null, o[1]); op.value = o[0]; if ((s.kind || 'movable') === o[0]) op.selected = true; kd.appendChild(op); });
      var rm = h('button', null, '×'); rm.style.cssText = 'border:none;background:none;color:#b23b3b;cursor:pointer;font-size:16px'; rm.onclick = function () { tr.remove(); };
      [nm, hr, kd, rm].forEach(function (x) { var td = h('td'); td.style.padding = '4px 3px'; td.appendChild(x); tr.appendChild(td); });
      tb.appendChild(tr);
    }
    function stepCard(plan) {
      var c = h('div', 'nora-card');
      var type = h('input', 'nora-in name'); type.value = plan.auftrag_type || ''; type.placeholder = 'Auftragsart'; type.style.fontWeight = '600'; type.style.color = ACC; type.style.marginBottom = '8px';
      c.appendChild(type);
      var tbl = h('table'); tbl.style.width = '100%'; var tb = h('tbody'); tbl.appendChild(tb); c.appendChild(tbl);
      (plan.steps || []).forEach(function (s) { stepRow(tb, s); });
      var bar = h('div'); bar.style.cssText = 'display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;align-items:center';
      var add = h('button', 'nora-gh', '+ Schritt'); add.onclick = function () { stepRow(tb, { name: '', hours: 0, kind: 'movable' }); };
      var sv = h('button', 'nora-sv', 'Speichern');
      var msg = h('span'); msg.style.cssText = 'font-size:13px;margin-left:auto';
      sv.onclick = function () {
        var steps = [].slice.call(tb.querySelectorAll('tr')).map(function (tr) { return { name: tr.querySelector('input.name').value.trim(), hours: Number(tr.querySelector('input.hrs').value) || 0, kind: tr.querySelector('select').value }; }).filter(function (s) { return s.name; });
        msg.textContent = 'Speichere…'; msg.style.color = '#5a6b75';
        api('/eb-steps', { method: 'POST', body: JSON.stringify({ auftrag_type: type.value.trim(), steps: steps }) }).then(function (j) { if (j.ok) { msg.textContent = '✓ ' + j.total_hours + ' h'; msg.style.color = '#1e7a44'; } else { msg.textContent = j.error || 'Fehler'; msg.style.color = '#b23b3b'; } });
      };
      bar.appendChild(add); bar.appendChild(sv); bar.appendChild(msg); c.appendChild(bar);
      return c;
    }
    function renderSteps(body) {
      body.innerHTML = '<div class="nora-empty">Lädt…</div>';
      api('/eb-steps').then(function (j) {
        if (j.error) { body.innerHTML = '<div class="nora-empty">' + (j.error === 'unauthorized' ? 'Bitte in der App mit Google anmelden.' : 'Fehler: ' + j.error) + '</div>'; return; }
        body.innerHTML = '';
        body.appendChild(h('div', 'nora-m', 'Zeiten sind Startwerte – an echte Zeiten anpassen, dann Speichern.'));
        (j.plans || []).forEach(function (p) { body.appendChild(stepCard(p)); });
        var addT = h('button', 'nora-gh', '+ Neue Auftragsart'); addT.style.width = '100%'; addT.style.marginTop = '4px';
        addT.onclick = function () { var c = stepCard({ auftrag_type: '', steps: [{ name: '', hours: 0, kind: 'movable' }] }); body.insertBefore(c, addT); };
        body.appendChild(addT);
      }).catch(function () { body.innerHTML = '<div class="nora-empty">Konnte nicht laden.</div>'; });
    }

    function build() {
      if (document.getElementById('noraBtn')) return;
      css();
      var btn = h('button', null, 'Nora'); btn.id = 'noraBtn';
      var ov = h('div'); ov.id = 'noraOv';
      var panel = h('div'); panel.id = 'noraPanel';
      var hd = h('div', 'nora-hd');
      var tabPlan = h('button', 'nora-tab on', 'Heute');
      var tabSteps = h('button', 'nora-tab', 'Schritt-Pläne');
      var x = h('button', null, '×'); x.id = 'noraX';
      hd.appendChild(h('b', null, 'Nora')); hd.appendChild(tabPlan); hd.appendChild(tabSteps); hd.appendChild(x);
      var body = h('div', 'nora-body');
      panel.appendChild(hd); panel.appendChild(body); ov.appendChild(panel);
      document.body.appendChild(btn); document.body.appendChild(ov);
      function show(w) { tabPlan.classList.toggle('on', w === 'plan'); tabSteps.classList.toggle('on', w === 'steps'); w === 'plan' ? renderPlan(body) : renderSteps(body); }
      btn.onclick = function () { ov.classList.add('on'); show('plan'); };
      x.onclick = function () { ov.classList.remove('on'); };
      ov.addEventListener('click', function (e) { if (e.target === ov) ov.classList.remove('on'); });
      tabPlan.onclick = function () { show('plan'); };
      tabSteps.onclick = function () { show('steps'); };
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
  } catch (e) { console.warn('nora-embed failed', e); }
})();
