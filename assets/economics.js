// Economics 4EC1 question bank filters. Pure client-side filtering of rows already in the page.
(() => {
  'use strict';
  const table = document.querySelector('[data-bank-table]');
  if (!table) return;
  const rows = [...table.querySelectorAll('tbody tr')];
  const controls = [...document.querySelectorAll('[data-bank-filter]')];
  const text = document.querySelector('[data-bank-text]');
  const status = document.querySelector('[data-bank-status]');
  function apply() {
    const wanted = Object.fromEntries(controls.map(c => [c.dataset.bankFilter, c.value]));
    const terms = (text ? text.value : '').toLowerCase().trim().split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const row of rows) {
      const ok = Object.entries(wanted).every(([key, value]) => !value || row.dataset[key] === value)
        && terms.every(t => row.dataset.search.includes(t));
      row.hidden = !ok;
      if (ok) shown++;
    }
    if (status) status.textContent = `${shown} of ${rows.length} question parts shown`;
  }
  for (const c of controls) c.addEventListener('change', apply);
  if (text) text.addEventListener('input', apply);
  apply();
})();

/* Answer checking. The page holds no answer keys: the answer is sent to the server, which
   returns feedback only after submission (local preview: /check; live: the PHP endpoint). */
(function () {
  var base = (document.querySelector('link[rel="stylesheet"][href*="/assets/"]') || {}).href || '';
  var root = base ? base.slice(0, base.indexOf('/assets/') + 1) : '/';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  /* Model answers are authored in a small Markdown subset: **bold**, tables (| a | b |) and line breaks. */
  function md(src) {
    var lines = String(src || '').split('\n'), out = [], table = [];
    function inline(t) { return esc(t).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'); }
    function flush() {
      if (!table.length) return;
      var rows = table.filter(function (l) { return !/^\s*\|?\s*:?-{2,}/.test(l); });
      out.push('<table class="model-table">' + rows.map(function (l, n) {
        var cells = l.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|');
        var tag = n === 0 ? 'th' : 'td';
        return '<tr>' + cells.map(function (c) { return '<' + tag + '>' + inline(c.trim()) + '</' + tag + '>'; }).join('') + '</tr>';
      }).join('') + '</table>');
      table = [];
    }
    lines.forEach(function (l) {
      if (/^\s*\|/.test(l)) { table.push(l); return; }
      flush();
      if (l.trim()) out.push('<p>' + inline(l) + '</p>');
    });
    flush();
    return out.join('');
  }
  function list(items) { return '<ul>' + items.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>'; }
  function render(r, mode) {
    if (r.error) return '<p class="check-bad">' + esc(r.error) + '</p>';
    if (mode === 'mcq') {
      if (r.correct === null) return '<p>' + esc(r.feedback) + '</p>';
      return (r.correct ? '<p class="check-good">Correct: ' + r.marks + '/' + r.max + '</p>'
                        : '<p class="check-bad">Not this one. The correct answer is ' + esc(r.key) + '.</p>' + (r.your_option ? '<p>' + esc(r.your_option) + '</p>' : ''))
             + (r.why ? '<p><strong>Why:</strong> ' + esc(r.why) + '</p>' : '');
    }
    if (mode === 'numeric') {
      var head = r.correct ? '<p class="check-good">Correct: ' + r.marks + '/' + r.max + '</p>'
               : r.unit_missing ? '<p class="check-bad">Right value, but the unit is missing: ' + r.marks + '/' + r.max + '</p><p>' + esc(r.unit_hint || '') + '. The exam gives full marks only with it.</p>'
                           : '<p class="check-bad">Your final answer is not right yet: ' + r.marks + '/' + r.max + '</p>';
      var steps = (r.steps || []).map(function (s) { return (s.found ? '✓ ' : '○ ') + esc(s.label); });
      return head + (steps.length ? list(steps) : '') + (r.working ? '<details><summary>See the full working</summary><p>' + esc(r.working) + '</p></details>' : '');
    }
    if (mode === 'figures') {
      // Accounts, statements and journals: which credited items were found, which are missing, then the model layout.
      var items = r.items || [], found = items.filter(function (x) { return x.found === true; }), missing = items.filter(function (x) { return x.found === false; }),
          own = items.filter(function (x) { return x.found === null; });
      var mk = function (x) { return esc(x.label) + (x.marks ? ' <span class="muted">(' + x.marks + ')</span>' : ''); };
      var out = (r.correct ? '<p class="check-good">Every checkable item found: ' + r.marks + '/' + r.max + '</p>'
                           : '<p class="check-bad">' + r.marks + '/' + r.max + ' from the items found</p>')
          + (r.self_marks ? '<p class="muted">' + r.self_marks + ' presentation mark' + (r.self_marks > 1 ? 's' : '') + ' (dates, details, labels) you judge yourself.</p>' : '');
      out += '<p><strong>Found (' + found.length + ' of ' + items.length + ')</strong></p>' + (found.length ? list(found.map(function (x) { return '✓ ' + mk(x); })) : '<p class="muted">None yet.</p>');
      if (missing.length) out += '<p><strong>Missing (' + missing.length + ')</strong></p>' + list(missing.map(function (x) { return '○ ' + mk(x); }));
      if (own.length) out += '<p><strong>Check these yourself against the model (' + own.length + ')</strong></p>' + list(own.map(function (x) { return '? ' + mk(x); }));
      if (r.ideal) out += '<details open><summary>Model layout (written by olevels.com, not official)</summary><div class="figures-model">' + md(r.ideal) + '</div></details>';
      if (r.why) out += '<p><strong>Why:</strong> ' + esc(r.why) + '</p>';
      if (r.note) out += '<p class="muted">' + esc(r.note) + '</p>';
      return out;
    }
    var out = '<p><strong>Mark your own answer.</strong> ' + esc(r.tip || '') + '</p>';
    out += '<details open><summary>Ideal answer (written by olevels.com, not official)</summary>' + md(r.ideal) + '</details>';
    out += '<p><strong>Mark checklist</strong></p>' + list((r.checklist || []).map(function (c) {
      return '<label><input type="checkbox" class="self-tick" data-marks="' + (c.marks || 0) + '"> ' + esc(c.text || c.point || '') + (c.marks ? ' <span class="muted">(' + c.marks + ')</span>' : '') + '</label>'; }));
    if (r.levels) out += '<p><strong>Level guide</strong></p>' + list(r.levels.map(function (l) { return '<strong>Level ' + esc(l.level) + ' (' + esc(l.marks) + ' marks):</strong> ' + esc(l.text || l.descriptor || ''); }));
    return out + '<p class="self-total muted"></p>';
  }
  document.addEventListener('submit', function (ev) {
    var form = ev.target.closest && ev.target.closest('form.checker');
    if (!form) return;
    ev.preventDefault();
    var part = form.getAttribute('data-check-part'), mode = form.getAttribute('data-check-mode');
    var field = form.querySelector('[name="ans-' + part + '"]:checked') || form.querySelector('[name="ans-' + part + '"]:not([type=radio])');
    var answer = field ? field.value : '';
    var out = form.querySelector('.check-result');
    if (!answer.trim()) { out.innerHTML = '<p class="check-bad">Write or choose an answer first.</p>'; return; }
    out.textContent = 'Checking…';
    fetch(root + 'check', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({part: part, answer: answer})})
      .then(function (res) { return res.json(); })
      .then(function (r) { out.innerHTML = render(r, mode); })
      .catch(function () { out.innerHTML = '<p class="check-bad">Answer checking is not available right now.</p>'; });
  });
  document.addEventListener('change', function (ev) {
    if (!ev.target.classList || !ev.target.classList.contains('self-tick')) return;
    var form = ev.target.closest('form.checker');
    var total = 0;
    form.querySelectorAll('.self-tick:checked').forEach(function (b) { total += Number(b.getAttribute('data-marks')) || 0; });
    var max = form.getAttribute('data-check-max');
    form.querySelector('.self-total').textContent = 'Your self-mark: ' + total + ' / ' + max + ' (points-marked parts). For level-marked answers use the level guide.';
  });
})();
