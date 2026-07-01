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
    function para(txt, muted) { var e = h('div'); e.textContent = txt; e.style.cssText = 'font-size:14px;line-height:1.55;margin-top:6px;color:' + (muted ? 'var(--muted)' : 'var(--text)'); return e; }
    function card(title, fn) { var c = h('div', 'nora-card'); if (title) c.appendChild(h('div', 'nora-t', title)); fn(c); return c; }
    var deDate = function (s) { return s ? new Date(s) : null; };
    var fDate = function (d) { return d ? d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) : '—'; };
    var fTime = function (d) { return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); };
    var dName = function (d) { return d.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' }); };

    function css() {
      if (document.getElementById('noraCss')) return;
      var s = document.createElement('style'); s.id = 'noraCss';
      s.textContent = [
        '#view-nora .nora-bar{display:flex;gap:8px;margin:0 0 16px;flex-wrap:wrap}',
        '#view-nora .nora-sub{background:transparent;border:1px solid var(--border);color:var(--muted);padding:7px 14px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500}',
        '#view-nora .nora-sub.on{background:var(--panel2);color:var(--text);border-color:var(--accent)}',
        '#view-nora .nora-card{background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:14px}',
        '#view-nora .nora-t{font-weight:600;font-size:15px;color:var(--text)}',
        '#view-nora .nora-m{font-size:13px;color:var(--muted);margin-top:4px;line-height:1.5}',
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
        '#view-nora .nora-sv{background:var(--accent);color:#fff;border:none;border-radius:8px;padding:10px 14px;font-weight:600;cursor:pointer;font-size:14px}',
        '#view-nora .nora-sv:disabled{opacity:.6}',
        '#view-nora .nora-gh{border:1px solid var(--border);background:transparent;color:var(--text);border-radius:8px;padding:8px 13px;cursor:pointer;font-size:14px}',
        '#view-nora .nora-empty{color:var(--muted);font-size:14px}',
        '#view-nora table{width:100%;border-collapse:collapse}#view-nora td{padding:4px 3px}',
        '#view-nora .nora-proto{font-size:11px;color:var(--muted);border:1px solid var(--border);border-radius:20px;padding:1px 8px;margin-left:8px;vertical-align:middle}',
        '#view-nora .nora-amp{display:inline-flex;gap:6px;margin-left:auto}',
        '#view-nora .nora-dot{width:20px;height:20px;border-radius:50%;border:2px solid var(--border);cursor:pointer;opacity:.35}',
        '#view-nora .nora-dot.on{opacity:1}',
        '#view-nora .nora-g{background:var(--good)}#view-nora .nora-a{background:#fbbf24}#view-nora .nora-r{background:var(--bad)}',
        '#view-nora .nora-step{display:flex;gap:10px;padding:8px 0;border-top:1px solid var(--border);font-size:14px}',
        '#view-nora .nora-step b{color:var(--accent);min-width:60px}',
        '#view-nora label.nora-ck{display:flex;gap:8px;align-items:center;padding:6px 0;font-size:14px;color:var(--text);cursor:pointer}',
        '#view-nora .nora-bar2{height:10px;border-radius:6px;background:var(--border);overflow:hidden;display:flex;margin-top:8px}',
        '#view-nora .nora-bar2 i{display:block;height:100%}',
        '#view-nora h3.nora-h{font-size:16px;color:var(--text);margin:2px 0 2px;font-weight:600}'
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
          var slip = (x.slippage && x.slippage > 0) ? ' · ' + x.slippage + ' Tage über Zusage' : '';
          d.appendChild(h('div', 'nora-m', 'Frist ' + fDate(deDate(x.due)) + (x.amount ? (' · ' + x.amount + ' €') : '') + slip));
          ca.appendChild(d);
        });
        if (!todos.length) ca.appendChild(h('div', 'nora-empty', 'Nichts offen. Stark.'));
        var cc = h('div', 'nora-card'); cc.appendChild(h('div', 'nora-t', 'Diese Woche'));
        if (!j.calendar_ok) cc.appendChild(h('div', 'nora-empty', 'Kalender nicht verbunden.'));
        else {
          var evs = (j.calendar || []).map(function (e) { return { t: e.title, allDay: e.allDay, s: deDate(e.start) }; }).filter(function (e) { return e.s; }).sort(function (a, b) { return a.s - b.s; });
          if (!evs.length) cc.appendChild(h('div', 'nora-empty', 'Keine Termine.'));
          function catOf(t) { t = (t || '').toLowerCase();
            if (/kid|kind|famil|frei|urlaub|privat|geburtstag|schule|kita/.test(t)) return ['Family', '#fbbf24'];
            if (/fris|arzt|zahn/.test(t)) return ['Privat', '#9aa3b5'];
            if (/bni|netzwerk|1-2-1|1:1|stammtisch|vortrag|confer|kongress|messe|besicht|kaffee|austausch|treffen|junioren|meeting|staff/.test(t)) return ['Networking', '#4f8cff'];
            return ['Working', '#34d399'];
          }
          var counts = {}; evs.forEach(function (e) { var cx = catOf(e.t)[0]; counts[cx] = (counts[cx] || 0) + 1; });
          var sm = h('div', 'nora-m'); sm.textContent = 'Networking: ' + (counts.Networking || 0) + ' · Family/Privat: ' + ((counts.Family || 0) + (counts.Privat || 0)) + ' · Working: ' + (counts.Working || 0) + '. Family-Zeit zählt — sie muss in der Arbeitszeit wieder reingeholt werden.'; cc.appendChild(sm);
          if ((counts.Networking || 0) >= 4) { var warn = h('div', 'nora-m'); warn.style.color = 'var(--accent)'; warn.textContent = 'Viel Networking diese Woche — bei neuen Anfragen lieber deinen 1:1-Link schicken statt einen neuen Termin (Dein System → Kalender-Link).'; cc.appendChild(warn); }
          var g = {}; evs.forEach(function (e) { var k = e.s.toISOString().slice(0, 10); (g[k] = g[k] || []).push(e); });
          Object.keys(g).sort().forEach(function (k) {
            var day = h('div', 'nora-day'); day.appendChild(h('h4', null, dName(new Date(k + 'T00:00:00'))));
            g[k].forEach(function (e) { var r = h('div', 'nora-ev'); r.appendChild(h('div', 'tm', e.allDay ? 'ganztg.' : fTime(e.s))); var nmw = h('div', null, e.t); nmw.style.flex = '1'; var ca = catOf(e.t); var tag = h('span', null, ca[0]); tag.style.cssText = 'font-size:10px;padding:1px 7px;border-radius:20px;align-self:center;color:' + (ca[0] === 'Privat' ? 'var(--text)' : '#fff') + ';background:' + ca[1]; r.appendChild(nmw); r.appendChild(tag); day.appendChild(r); });
            cc.appendChild(day);
          });
        }
        cols.appendChild(ca); cols.appendChild(cc); body.appendChild(cols);
      }).catch(function () { body.innerHTML = '<div class="nora-empty">Konnte nicht laden.</div>'; });
    }

    function ampel(project) {
      var wrap = h('div', 'nora-amp');
      ['g', 'a', 'r'].forEach(function (col) {
        var dot = h('span', 'nora-dot nora-' + col);
        dot.onclick = function () { [].slice.call(wrap.children).forEach(function (x) { x.classList.remove('on'); }); dot.classList.add('on'); };
        wrap.appendChild(dot);
      });
      return wrap;
    }

    function renderSystem(body) {
      body.innerHTML = '<div class="nora-empty">Lädt…</div>';
      api('/eb-plan').then(function (j) {
        body.innerHTML = '';
        var todos = (j && j.todos) || [];
        var overdue = todos.filter(function (t) { return t.overdue; });

        body.appendChild(card('Nora hat dich im Blick', function (c) {
          c.appendChild(para('Du musst nicht alles allein tragen. Immer nur ein Schritt — klein, geplant, machbar. Nora erinnert dich, plant deine Woche und holt Jarne dazu, wenn es eng wird.'));
          c.appendChild(para('Das hier ist ein erster Entwurf, damit du ein Gefühl bekommst, wie es funktionieren wird. Wir gehen es zusammen durch.', true));
        }));

        body.appendChild(card('Wenn es zu viel wird', function (c) {
          c.appendChild(para('Ein Klick — und Jarne weiß Bescheid. Früh melden ist Stärke, nicht Schwäche.'));
          var btn = h('button', 'nora-sv', 'Ich hänge fest → Jarne Bescheid geben'); btn.style.width = '100%'; btn.style.marginTop = '10px';
          var m = h('div', 'nora-m');
          btn.onclick = function () {
            btn.disabled = true; m.textContent = 'Sende…'; m.style.color = 'var(--muted)';
            api('/eb-escalate', { method: 'POST', body: JSON.stringify({ context: 'Janika hängt gerade fest und braucht kurz deine Hilfe.', kind: 'manual' }) }).then(function (r) { if (r.ok) { m.textContent = '✓ Jarne ist informiert — er meldet sich.'; m.style.color = 'var(--good)'; } else { m.textContent = r.error || 'Konnte nicht senden'; m.style.color = 'var(--bad)'; btn.disabled = false; } });
          };
          c.appendChild(btn); c.appendChild(m);
          var au = h('div', 'nora-m'); au.style.marginTop = '12px';
          au.innerHTML = '<b>Automatisch im Blick:</b> Nora eskaliert von selbst an Jarne, wenn eine Frist kippt oder die Zeit für einen Auftrag über 80% läuft.';
          c.appendChild(au);
          if (overdue.length) { overdue.slice(0, 5).forEach(function (t) { c.appendChild(para('• ' + t.title + (t.days_overdue ? ' — ' + t.days_overdue + ' Tage über Frist' : ''), true)); }); }
        }));

        body.appendChild(card('Deine Zusagen sind gesichert (Redline)', function (c) {
          c.appendChild(para('Sobald du einem Kunden eine Frist zusagst, wird sie festgehalten. Sie kann nicht heimlich verrutschen — du siehst immer, wo du gegenüber der Zusage stehst.'));
          var withSlip = todos.filter(function (t) { return t.slippage && t.slippage > 0; });
          if (withSlip.length) { withSlip.slice(0, 4).forEach(function (t) { c.appendChild(para('• ' + t.title + ' — ' + t.slippage + ' Tage über der Zusage', true)); }); }
          else c.appendChild(para('Aktuell nichts über der Zusage. Gutes Zeichen.', true));
        }));

        body.appendChild(card('Ampel-Check', function (c) {
          c.appendChild(para('Grün / gelb / rot pro Auftrag — ein Status, keine Beichte. Rot heißt einfach: hier braucht es Hilfe.'));
          var acc = todos.filter(function (t) { return t.status === 'accepted'; }).slice(0, 5);
          (acc.length ? acc : todos.slice(0, 4)).forEach(function (t) {
            var row = h('div'); row.style.cssText = 'display:flex;align-items:center;padding:8px 0;border-top:1px solid var(--border)';
            row.appendChild(h('div', null, t.title));
            row.appendChild(ampel(t)); c.appendChild(row);
          });
          var pr = h('span', 'nora-proto', 'Prototyp'); c.querySelector('.nora-t').appendChild(pr);
        }));

        body.appendChild(card('Erst liefern, dann netzwerken', function (c) {
          c.appendChild(para('Working = fertig machen und Geld verdienen. Networking = neue Kontakte & Termine. Prep = die kleinen Dinge, die einen Termin gelingen lassen. Networking zählt erst, wenn daraus echte Arbeit wird.'));
          var bar = h('div', 'nora-bar2');
          var w = h('i'); w.style.cssText = 'width:65%;background:var(--good)'; var n = h('i'); n.style.cssText = 'width:35%;background:var(--accent)';
          bar.appendChild(w); bar.appendChild(n); c.appendChild(bar);
          c.appendChild(para('Diese Woche etwa: 65% liefern, 35% netzwerken (Beispiel).', true));
          c.querySelector('.nora-t').appendChild(h('span', 'nora-proto', 'Prototyp'));
        }));

        body.appendChild(card('Deine Woche in 30 Minuten', function (c) {
          c.appendChild(para('Ein fester Termin mit Jarne pro Woche — kurz, immer gleich. So bleibt nichts liegen.'));
          [['5 Min', 'Pipeline: 3 Kontakte gemacht?'], ['10 Min', 'Aufträge — Ampel setzen'], ['5 Min', 'Geld: angeboten / berechnet / bezahlt'], ['5 Min', 'Gelbe Flaggen → zusammen entscheiden'], ['5 Min', 'Nächste Woche: 3 konkrete Schritte']].forEach(function (s) {
            var r = h('div', 'nora-step'); r.appendChild(h('b', null, s[0])); r.appendChild(h('div', null, s[1])); c.appendChild(r);
          });
        }));

        body.appendChild(card('Drei kleine Kontakte', function (c) {
          c.appendChild(para('Kein Marketing-Plan — nur eine Gewohnheit. Diese Woche drei Mal kurz melden: ein Anruf, ein Kaffee/Partner, ein Nachfassen.'));
          ['Kontakt 1', 'Kontakt 2', 'Kontakt 3'].forEach(function (t) {
            var l = h('label', 'nora-ck'); var cb = h('input'); cb.type = 'checkbox'; l.appendChild(cb); l.appendChild(h('span', null, t)); c.appendChild(l);
          });
          c.querySelector('.nora-t').appendChild(h('span', 'nora-proto', 'Prototyp'));
        }));

        body.appendChild(card('Leads einordnen & priorisieren', function (c) {
          function tierColor(t) { return t === 'A' ? 'var(--good)' : (t === 'B' ? 'var(--accent)' : 'var(--muted)'); }
          function tierBadge(t, big) { var b = h('span'); b.textContent = big ? ('Tier ' + t) : t; b.style.cssText = 'font-weight:700;border-radius:' + (big ? '10px' : '6px') + ';display:inline-flex;align-items:center;justify-content:center;color:' + (t === 'C' ? 'var(--text)' : '#fff') + ';background:' + tierColor(t) + ';' + (big ? 'font-size:19px;padding:6px 16px' : 'font-size:13px;width:24px;height:24px;flex:none'); return b; }
          c.appendChild(para('Trag eine Anfrage ein und ordne sie ein — so siehst du sofort, was Priorität hat und wo sich deine Zeit wirklich lohnt.'));
          var row = h('div'); row.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px';
          var nm = h('input', 'nora-in'); nm.placeholder = 'Name / Kunde'; nm.style.flex = '1'; nm.style.minWidth = '150px';
          var val = h('input', 'nora-in'); val.type = 'number'; val.placeholder = 'Wert €'; val.style.width = '90px';
          var prob = h('select', 'nora-in'); [['3', 'gute Chance'], ['2', 'mittel'], ['1', 'unsicher']].forEach(function (o) { var op = h('option', null, o[1]); op.value = o[0]; prob.appendChild(op); });
          var eff = h('select', 'nora-in'); [['1', 'wenig Aufwand'], ['2', 'mittel'], ['3', 'viel Aufwand']].forEach(function (o) { var op = h('option', null, o[1]); op.value = o[0]; eff.appendChild(op); });
          var go = h('button', 'nora-gh', 'Einordnen');
          row.appendChild(nm); row.appendChild(val); row.appendChild(prob); row.appendChild(eff); row.appendChild(go); c.appendChild(row);
          var result = h('div'); result.style.cssText = 'display:none;align-items:center;gap:12px;margin-top:12px;padding:12px;border:1px solid var(--border);border-radius:10px';
          var badgeWrap = h('div'); var btxt = h('div', 'nora-m'); btxt.style.flex = '1'; var save = h('button', 'nora-sv', 'Als Lead merken');
          result.appendChild(badgeWrap); result.appendChild(btxt); result.appendChild(save); c.appendChild(result);
          var listBox = h('div'); listBox.style.marginTop = '14px'; c.appendChild(listBox);
          c.appendChild(para('Sag nie unter deinem Mindest-Stundensatz (inkl. Fahrt) zu — der ist deine Erlaubnis, Nein zu sagen.', true));
          var curTier = null;
          go.onclick = function () {
            var v = Number(val.value) || 0, p = Number(prob.value), e = Number(eff.value); var score = (v / 1000) + p - e;
            curTier = score >= 2.5 ? 'A' : (score >= 1 ? 'B' : 'C');
            badgeWrap.innerHTML = ''; badgeWrap.appendChild(tierBadge(curTier, true));
            btxt.textContent = curTier === 'A' ? 'Hohe Priorität — voller Pitch + Anfahrt wert' : (curTier === 'B' ? 'Mittel — Call + Angebot, keine lange Fahrt' : 'Niedrig — eine Mail, sonst loslassen');
            result.style.display = 'flex';
          };
          save.onclick = function () {
            if (!curTier) return; save.disabled = true;
            api('/eb-leads', { method: 'POST', body: JSON.stringify({ lead_name: nm.value.trim() || '(ohne Name)', value_eur: Number(val.value) || 0, probability: Number(prob.value), effort: Number(eff.value), tier: curTier }) }).then(function () { nm.value = ''; val.value = ''; result.style.display = 'none'; curTier = null; save.disabled = false; loadLeads(); });
          };
          function loadLeads() {
            listBox.innerHTML = '<div class="nora-m">Lädt…</div>';
            api('/eb-leads').then(function (j) {
              var leads = (j && j.leads) || []; listBox.innerHTML = '';
              if (!leads.length) { listBox.appendChild(h('div', 'nora-m', 'Noch keine Leads eingeordnet.')); return; }
              listBox.appendChild(h('div', 'nora-m', 'Priorisiert (A zuerst):'));
              leads.forEach(function (l) {
                var r = h('div'); r.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid var(--border)';
                r.appendChild(tierBadge(l.tier, false));
                var n = h('div', null, l.lead_name || '(ohne Name)'); n.style.cssText = 'flex:1;font-size:14px;color:var(--text)';
                var m = h('div', 'nora-m'); m.textContent = (l.value_eur ? (l.value_eur + ' €') : '');
                var del = h('button', null, '×'); del.style.cssText = 'border:none;background:none;color:var(--bad);cursor:pointer;font-size:16px';
                del.onclick = function () { api('/eb-leads', { method: 'POST', body: JSON.stringify({ action: 'delete', id: l.id }) }).then(loadLeads); };
                r.appendChild(n); r.appendChild(m); r.appendChild(del); listBox.appendChild(r);
              });
            });
          }
          loadLeads();
        }));

        body.appendChild(card('Angebot & Nachfassen', function (c) {
          c.appendChild(para('Angebot raus in 48 Stunden — fertig-genug heute schlägt perfekt nächste Woche. Dann in Ruhe nachfassen; Nora hilft dir dabei.'));
          [['Tag 0', 'Angebot raus (48h-Redline)'], ['+ Tage', 'freundlich schriftlich nachfassen'], ['danach', 'kurzer Anruf — hier gewinnst du Deals']].forEach(function (s) { var r = h('div', 'nora-step'); r.appendChild(h('b', null, s[0])); r.appendChild(h('div', null, s[1])); c.appendChild(r); });
          c.appendChild(para('Freundlich Nein sagen: „Das ist gerade nicht mein Schwerpunkt — ich empfehle dir gern jemanden.“', true));
        }));

        body.appendChild(card('Mit Nora sprechen & delegieren', function (c) {
          c.appendChild(para('Gib Nora etwas ab — sie sammelt es und kümmert sich Schritt für Schritt. Bald kannst du hier richtig mit ihr chatten.'));
          c.appendChild(para('Kniffliges bespricht Nora mit ANNA; wenn nötig fragt ANNA bei Jarne nach — und lernt daraus fürs nächste Mal. Du musst nichts davon selbst klären.', true));
          var ta = h('textarea'); ta.className = 'nora-in'; ta.placeholder = 'z. B. „an Müller-Angebot erinnern“ oder „Termin mit Herrn Weiß finden“'; ta.style.cssText = 'width:100%;min-height:64px;margin-top:8px;resize:vertical';
          var arow = h('div'); arow.style.cssText = 'display:flex;gap:8px;align-items:center;margin-top:8px';
          var send = h('button', 'nora-sv', 'An Nora geben'); var msg = h('div', 'nora-m');
          arow.appendChild(send); arow.appendChild(msg); c.appendChild(ta); c.appendChild(arow);
          var box = h('div'); box.style.marginTop = '12px'; c.appendChild(box);
          function load() { box.innerHTML = ''; api('/eb-nora').then(function (j) { var ds = (j && j.delegations) || []; if (!ds.length) { box.appendChild(h('div', 'nora-m', 'Noch nichts delegiert.')); return; } box.appendChild(h('div', 'nora-m', 'Bei Nora:')); ds.forEach(function (d) { var r = h('div'); r.style.cssText = 'display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-top:1px solid var(--border)'; var t = h('div', null, d.body); t.style.cssText = 'flex:1;font-size:14px;color:var(--text)'; var dn = h('button', 'nora-gh', 'erledigt'); dn.onclick = function () { api('/eb-nora', { method: 'POST', body: JSON.stringify({ action: 'done_delegation', id: d.id }) }).then(load); }; r.appendChild(t); r.appendChild(dn); box.appendChild(r); }); }); }
          send.onclick = function () { var v = ta.value.trim(); if (!v) return; send.disabled = true; msg.textContent = 'Sende…'; api('/eb-nora', { method: 'POST', body: JSON.stringify({ action: 'add_delegation', body: v }) }).then(function (r) { if (r.ok) { ta.value = ''; msg.textContent = '✓ Nora hat es.'; msg.style.color = 'var(--good)'; load(); } else { msg.textContent = 'Fehler'; } send.disabled = false; }); };
          c.querySelector('.nora-t').appendChild(h('span', 'nora-proto', 'Prototyp'));
          load();
        }));

        body.appendChild(card('Dein Kalender-Link (1:1)', function (c) {
          c.appendChild(para('Hinterlege hier deinen Buchungs-/1:1-Link. Ist eine Woche schon voll, schickst du statt einem neuen Termin einfach den Link — so bleibt dein Kalender straff.'));
          var row = h('div'); row.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-top:8px';
          var inp = h('input', 'nora-in'); inp.placeholder = 'https://cal.com/… oder Calendly-Link'; inp.style.flex = '1'; inp.style.minWidth = '200px';
          var save = h('button', 'nora-sv', 'Speichern'); var copy = h('button', 'nora-gh', 'Link kopieren'); var msg = h('div', 'nora-m'); msg.style.marginTop = '6px';
          row.appendChild(inp); row.appendChild(save); row.appendChild(copy); c.appendChild(row); c.appendChild(msg);
          api('/eb-nora').then(function (j) { if (j && j.settings && j.settings.calendar_link) inp.value = j.settings.calendar_link; });
          save.onclick = function () { save.disabled = true; api('/eb-nora', { method: 'POST', body: JSON.stringify({ action: 'save_settings', calendar_link: inp.value.trim() }) }).then(function () { msg.textContent = '✓ gespeichert'; msg.style.color = 'var(--good)'; save.disabled = false; }); };
          copy.onclick = function () { if (!inp.value.trim()) return; try { navigator.clipboard.writeText(inp.value.trim()); } catch (e) {} msg.textContent = 'Link kopiert — jetzt an den Kontakt schicken.'; msg.style.color = 'var(--muted)'; };
        }));

        body.appendChild(card('Schritt für Schritt', function (c) {
          c.appendChild(para('Wir bauen keine große Sprünge — wir bauen eine Treppe. Diese Woche zählt nur eins: ein Ding fertig. Der Rest wächst mit dir.'));
          c.appendChild(para('Du schaffst das. 💙', false));
        }));
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
      var tabs = [['plan', 'Heute'], ['system', 'Dein System'], ['steps', 'Schritt-Pläne']];
      var btns = {};
      tabs.forEach(function (t) { var b = h('button', 'nora-sub' + (t[0] === 'plan' ? ' on' : ''), t[1]); btns[t[0]] = b; bar.appendChild(b); });
      var body = h('div', 'nora-body');
      sec.appendChild(bar); sec.appendChild(body);
      main.appendChild(sec);
      function sub(w) {
        Object.keys(btns).forEach(function (k) { btns[k].classList.toggle('on', k === w); });
        if (w === 'plan') renderPlan(body); else if (w === 'system') renderSystem(body); else renderSteps(body);
      }
      btn.addEventListener('click', function () {
        main.querySelectorAll('section.view').forEach(function (v) { v.classList.remove('active'); });
        nav.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
        sec.classList.add('active'); btn.classList.add('active'); sub('plan');
      });
      tabs.forEach(function (t) { btns[t[0]].addEventListener('click', function () { sub(t[0]); }); });
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
