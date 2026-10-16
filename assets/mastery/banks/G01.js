/* Group G01 mastery bank: The economic problem, factors and sectors; Demand, supply, equilibrium and the labour market. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- small helpers ----------
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sample(a, n) { return shuffle(a).slice(0, n); }
  function sep(n) { var s = String(n).split('.'); s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return s.join('.'); }
  function money(x) { return '$' + sep(x.toFixed(2)); }
  function mc(skill, q, options, answer, why, extra) { var o = { skill: skill, kind: 'mcq', q: q, options: options, answer: answer, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function mu(skill, q, options, answers, why, extra) { var o = { skill: skill, kind: 'multi', q: q, options: options, answers: answers, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function nm(skill, q, answer, unit, why, extra) { var o = { skill: skill, kind: 'num', q: q, answer: answer, unit: unit, display: sep(answer), why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function G(skill, fn, extra) { var o = { skill: skill, gen: fn }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function tbl(head, rows) {
    return '<table class="mc-table"><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  // Put the correct option at a random place in a letter-labelled list (letters keep their printed order).
  var LET = ['A', 'B', 'C', 'D'];

  // ---------- SVG helpers ----------
  var INK = '#303a4c', HI = '#e4464f', BLUE = '#195d9b', GREY = '#9aa5b8';
  function f1(n) { return Math.round(n * 10) / 10; }
  function svg(w, h, label, body) { return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg" font-family="Arial, Helvetica, sans-serif">' + body + '</svg>'; }
  function ln(x1, y1, x2, y2, c, w, dash) { return '<line x1="' + f1(x1) + '" y1="' + f1(y1) + '" x2="' + f1(x2) + '" y2="' + f1(y2) + '" stroke="' + (c || INK) + '" stroke-width="' + (w || 2) + '"' + (dash ? ' stroke-dasharray="4 3"' : '') + '/>'; }
  function tx(x, y, s, o) { o = o || {}; return '<text x="' + f1(x) + '" y="' + f1(y) + '" font-size="' + (o.size || 12) + '" fill="' + (o.c || INK) + '"' + (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') + (o.bold ? ' font-weight="bold"' : '') + '>' + s + '</text>'; }
  function dot(x, y, c) { return '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="3.5" fill="' + (c || INK) + '"/>'; }
  function arrow(x1, y1, x2, y2, c) {
    var a = Math.atan2(y2 - y1, x2 - x1), h = 8;
    var p1 = [x2 - h * Math.cos(a - 0.4), y2 - h * Math.sin(a - 0.4)], p2 = [x2 - h * Math.cos(a + 0.4), y2 - h * Math.sin(a + 0.4)];
    return ln(x1, y1, x2, y2, c || HI, 1.8) + '<polygon points="' + f1(x2) + ',' + f1(y2) + ' ' + f1(p1[0]) + ',' + f1(p1[1]) + ' ' + f1(p2[0]) + ',' + f1(p2[1]) + '" fill="' + (c || HI) + '"/>';
  }
  function smooth(pts, c, w, dash) {   // Catmull-Rom curve through pixel points
    var d = 'M' + f1(pts[0][0]) + ',' + f1(pts[0][1]);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ' C' + f1(p1[0] + (p2[0] - p0[0]) / 6) + ',' + f1(p1[1] + (p2[1] - p0[1]) / 6) + ' ' + f1(p2[0] - (p3[0] - p1[0]) / 6) + ',' + f1(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + f1(p2[0]) + ',' + f1(p2[1]);
    }
    return '<path d="' + d + '" fill="none" stroke="' + (c || INK) + '" stroke-width="' + (w || 2.2) + '"' + (dash ? ' stroke-dasharray="5 4"' : '') + '/>';
  }

  // Market / labour diagram in unit coordinates: q 0..11.5, p 0..12. Demand p = 10 + s - q; supply p = q - s.
  function GX(q) { return 60 + q * 20; }
  function GY(p) { return 215 - p * 15; }
  function dLine(s, lab, c, dash) {
    var q1 = Math.max(0.5, s - 1), q2 = Math.min(11.5, 9 + s);
    return ln(GX(q1), GY(10 + s - q1), GX(q2), GY(10 + s - q2), c || BLUE, 2.2, dash) + tx(GX(q2) + 4, GY(10 + s - q2) + 4, lab, { c: c || BLUE, bold: true });
  }
  function sLine(s, lab, c, dash) {
    var q1 = Math.max(0.5, 1 + s), q2 = Math.min(11, 11 + s);
    return ln(GX(q1), GY(q1 - s), GX(q2), GY(q2 - s), c || INK, 2.2, dash) + tx(GX(q2) + 4, GY(q2 - s) + 2, lab, { c: c || INK, bold: true });
  }
  function graph(o) {
    var b = ln(60, 215, 300, 215, INK, 1.6) + ln(60, 215, 60, 22, INK, 1.6);
    b += tx(8, 16, o.yl, { size: 12 }) + tx(305, 244, o.xl, { size: 12, anchor: 'end' }) + tx(52, 229, 'O', { size: 11 });
    b += o.body || '';
    (o.guides || []).forEach(function (g) { b += ln(GX(g[0]), GY(g[1]), GX(g[0]), 215, GREY, 1.3, true) + ln(GX(g[0]), GY(g[1]), 60, GY(g[1]), GREY, 1.3, true); });
    (o.yt || []).forEach(function (t) { b += ln(56, GY(t[0]), 60, GY(t[0]), INK, 1.3) + tx(54, GY(t[0]) + 4, t[1], { size: 11, anchor: 'end' }); });
    (o.xt || []).forEach(function (t) { b += ln(GX(t[0]), 215, GX(t[0]), 219, INK, 1.3) + tx(GX(t[0]), 231, t[1], { size: 11, anchor: 'middle' }); });
    (o.pts || []).forEach(function (p) { b += dot(GX(p[0]), GY(p[1]), p[3] || HI) + tx(GX(p[0]) + 7, GY(p[1]) + 4, p[2], { bold: true, c: p[3] || HI }); });
    return svg(320, 250, o.label, b);
  }
  // Four new-equilibrium points around E(5,5): after D right, D left, S right, S left.
  var SHIFT_PT = { dR: [6.5, 6.5], dL: [3.5, 3.5], sR: [6.5, 3.5], sL: [3.5, 6.5] };
  function pointsDiagram(letters, labels) {   // letters: {dR:'A',...}; labels: axis words
    labels = labels || {};
    var body = dLine(0, labels.d || 'D') + sLine(0, labels.s || 'S') +
      dLine(3, (labels.d || 'D') + '1', GREY, true) + dLine(-3, (labels.d || 'D') + '2', GREY, true) +
      sLine(3, (labels.s || 'S') + '1', GREY, true) + sLine(-3, (labels.s || 'S') + '2', GREY, true);
    var pts = [[5, 5, 'E', INK]];
    Object.keys(SHIFT_PT).forEach(function (k) { pts.push([SHIFT_PT[k][0], SHIFT_PT[k][1], letters[k]]); });
    return graph({ yl: labels.yl || 'Price ($)', xl: labels.xl || 'Quantity', body: body, pts: pts, label: (labels.what || 'Demand and supply diagram') + ' with original curves, four shifted curves and points W to Z' });
  }
  var PLET = ['W', 'X', 'Y', 'Z'];
  function randomLetters() { var l = shuffle(PLET); return { dR: l[0], dL: l[1], sR: l[2], sL: l[3] }; }

  // PPC: quarter-ellipse in a 240 x 180 plotting box with origin (70, 215).
  function ppcCurve(a, b, c, dash) { var pts = []; for (var t = 0; t <= 90; t += 10) { var r = t * Math.PI / 180; pts.push([70 + a * Math.cos(r), 215 - b * Math.sin(r)]); } return smooth(pts, c, 2.2, dash); }
  function ppcFrame(yl, xl, body, label) {
    return svg(320, 250, label, ln(70, 215, 305, 215, INK, 1.6) + ln(70, 215, 70, 20, INK, 1.6) + tx(8, 14, yl, { size: 12 }) + tx(305, 244, xl, { size: 12, anchor: 'end' }) + tx(60, 229, 'O', { size: 11 }) + body);
  }

  // Pie chart: slices [{v, lab}] starting at 12 o'clock, clockwise.
  var FILLS = ['#195d9b', '#9aa5b8', '#e4464f'];
  function pie(cx, cy, r, slices, caption) {
    var a0 = 0, out = '';
    slices.forEach(function (s, i) {
      var a1 = a0 + s.v * 3.6, r0 = a0 * Math.PI / 180, r1 = a1 * Math.PI / 180;
      var x0 = cx + r * Math.sin(r0), y0 = cy - r * Math.cos(r0), x1 = cx + r * Math.sin(r1), y1 = cy - r * Math.cos(r1);
      out += '<path d="M' + f1(cx) + ',' + f1(cy) + ' L' + f1(x0) + ',' + f1(y0) + ' A' + r + ',' + r + ' 0 ' + (a1 - a0 > 180 ? 1 : 0) + ' 1 ' + f1(x1) + ',' + f1(y1) + ' Z" fill="' + FILLS[i % 3] + '" fill-opacity="0.35" stroke="' + INK + '" stroke-width="1.5"/>';
      var mid = (a0 + a1) / 2 * Math.PI / 180, rr = s.v < 9 ? r + 10 : r * 0.58;
      out += tx(cx + rr * Math.sin(mid), cy - rr * Math.cos(mid) + 4, s.lab, { bold: true, anchor: 'middle', size: 12 });
      a0 = a1;
    });
    if (caption) out += tx(cx, cy + r + 22, caption, { bold: true, anchor: 'middle', size: 13 });
    return out;
  }
  function fourPies(sets, label) {   // sets: 4 arrays of slices, captions A-D
    var c = [[85, 75], [245, 75], [85, 215], [245, 215]], body = '';
    sets.forEach(function (s, i) { body += pie(c[i][0], c[i][1], 50, s, LET[i]); });
    return svg(330, 300, label, body);
  }
  function PST(p, s, t) { return [{ v: p, lab: 'P' }, { v: s, lab: 'S' }, { v: t, lab: 'T' }]; }

  // Mini PPC panels for drawing items (2 x 2 grid, captions Diagram 1-4).
  function miniPanel(ox, oy, kind, yg, xg, n) {
    var O = [ox + 24, oy + 104], a = 92, b = 72, out = '';
    function cur(sc, dash, c) { var pts = []; for (var t = 0; t <= 90; t += 15) { var r = t * Math.PI / 180; pts.push([O[0] + a * sc * Math.cos(r), O[1] - b * sc * Math.sin(r)]); } return smooth(pts, c || INK, 1.8, dash); }
    function at(sc, deg) { var r = deg * Math.PI / 180; return [O[0] + a * sc * Math.cos(r), O[1] - b * sc * Math.sin(r)]; }
    out += ln(O[0], O[1], ox + 148, O[1], INK, 1.3) + ln(O[0], O[1], O[0], oy + 12, INK, 1.3);
    out += tx(ox + 2, oy + 10, yg, { size: 9 }) + tx(ox + 148, oy + 116, xg, { size: 9, anchor: 'end' });
    var A, Bp;
    if (kind === 'moveX' || kind === 'moveY' || kind === 'moveIn') {
      out += cur(1);
      A = kind === 'moveY' ? at(1, 22) : at(1, 66);
      Bp = kind === 'moveX' ? at(1, 22) : kind === 'moveY' ? at(1, 66) : at(0.62, 40);
      out += dot(A[0], A[1], INK) + tx(A[0] + 4, A[1] - 5, 'A', { size: 10, bold: true }) + dot(Bp[0], Bp[1], HI) + tx(Bp[0] + 4, Bp[1] - 5, 'B', { size: 10, bold: true, c: HI });
      out += arrow(A[0] + (Bp[0] - A[0]) * 0.15, A[1] + (Bp[1] - A[1]) * 0.15, A[0] + (Bp[0] - A[0]) * 0.82, A[1] + (Bp[1] - A[1]) * 0.82);
    } else {   // two curves: 'out' = PPC2 outside PPC1, 'in' = PPC2 inside PPC1
      var inner = 0.7, outer = 1.12;
      out += cur(inner, kind === 'in') + cur(outer, kind === 'out');
      var li = at(inner, 45), lo = at(outer, 45);
      out += tx(li[0] - 34, li[1] + 14, kind === 'out' ? 'PPC1' : 'PPC2', { size: 9, bold: true }) + tx(lo[0] + 2, lo[1] - 4, kind === 'out' ? 'PPC2' : 'PPC1', { size: 9, bold: true });
    }
    out += tx(ox + 82, oy + 134, 'Diagram ' + n, { size: 11, bold: true, anchor: 'middle' });
    return out;
  }
  function fourPanels(kinds, yg, xg, label) {
    var c = [[6, 4], [166, 4], [6, 148], [166, 148]], body = '';
    kinds.forEach(function (k, i) { body += miniPanel(c[i][0], c[i][1], k, yg, xg, i + 1); });
    return svg(326, 292, label, body);
  }
  var DIAG = ['Diagram 1', 'Diagram 2', 'Diagram 3', 'Diagram 4'];

  var COUNTRIES = ['Velmora', 'Tarsia', 'Kestland', 'Orlavia', 'Danuvia', 'Marenko', 'Solvany', 'Brenthia', 'Caldoria', 'Ostrava Isles'];
  var PEOPLE = ['Amara', 'Diego', 'Leila', 'Tomasz', 'Priya', 'Kofi', 'Yuki', 'Hana', 'Rashid', 'Elena', 'Nadia', 'Sipho', 'Mateo', 'Farah'];

  // =====================================================================
  // ECO-T11-02 Scarcity, choice and opportunity cost
  // =====================================================================
  var NEEDS = ['clean drinking water', 'basic food to stay healthy', 'simple shelter from the weather', 'warm clothing in a cold winter', 'safe water for washing and cooking'];
  var WANTS = ['a games console', 'a holiday by the sea', 'a designer handbag', 'a new smartphone', 'tickets to a football final', 'a course in photography', 'a sports car', 'a takeaway pizza'];

  B['ECO-T11-02'] = { title: 'Scarcity, choice and opportunity cost', items: [
    mc('scarcity', 'What is meant by the economic problem of scarcity?',
      ['Wants are unlimited but the resources to meet them are finite', 'Some goods have prices that are too high for many families', 'Firms cannot sell all of the goods that they produce each year', 'Governments have no money left over after spending'], 0,
      'Scarcity is the gap between unlimited wants and finite resources (land, labour, capital and enterprise). It is not about high prices or unsold goods.'),
    mc('scarcity', 'Why does scarcity mean that every society has to make choices?',
      ['Its resources cannot produce everything people want', 'Prices of goods and services rise every year', 'Producers would rather make fewer goods than they are able to', 'Consumers do not know what they want to buy'], 0,
      'Because resources are limited, using them for one thing means they cannot be used for another, so a choice must be made.'),
    mc('scarcity', 'Which question must every society answer because of scarcity?',
      ['For whom should goods and services be produced?', 'At what time should shops open each day?', 'Which firm in the country should pay the highest rate of tax?', 'In which city should the parliament meet?'], 0,
      'Scarcity forces three basic choices: what to produce, how to produce it and for whom. The other questions are not part of the economic problem.'),
    mu('scarcity', 'Which statements about scarcity are correct? Select all that apply.',
      ['It affects rich countries as well as poor countries', 'It exists because resources are finite', 'It means people must choose between alternatives', 'It would disappear if every good became cheaper', 'It applies to goods but never to services'], [0, 1, 2],
      'Every country, rich or poor, has more wants than resources, so all must choose. Lower prices do not create more resources, and services such as health care use scarce resources too.'),
    mc('scarcity', 'Solvany has oil, four million workers and many factories, yet its people want more hospitals, roads and schools than it can build. What does this show?',
      ['The problem of scarcity', 'Excess supply of hospitals', 'A fall in demand for roads', 'Negative economic growth'], 0,
      'Even with many resources, Solvany cannot meet every want at once. Wants exceed what finite resources can provide, which is scarcity.'),
    mc('wants-needs', 'Which of these is a need rather than a want?',
      ['Clean drinking water', 'A games console', 'A holiday abroad', 'A university course'], 0,
      'A need is something we must have to survive, such as water, food and shelter. The other options are things people would like on top of that, so they are wants.'),
    mc('wants-needs', 'Which of these is a want rather than a need?',
      ['A smartwatch', 'Basic shelter', 'Enough food to survive', 'Safe drinking water'], 0,
      'People can survive without a smartwatch, so it is a want. Shelter, food and water are essential for survival, so they are needs.'),
    G('wants-needs', function () {
      var n = sample(NEEDS, 2), w = sample(WANTS, 3), opts = n.concat(w).map(cap);
      return mu('wants-needs', 'Which of these are <b>needs</b>? Select all that apply.', opts, [0, 1],
        cap(n[0]) + ' and ' + n[1] + ' are essential for survival, so they are needs. ' + cap(w[0]) + ', ' + w[1] + ' and ' + w[2] + ' are things people would like but can live without, so they are wants.');
    }),
    mc('wants-needs', 'Why are education and holidays classed as wants in economics?',
      ['People can survive without them', 'They are always provided free of charge', 'They are only produced by the government', 'Only people on high incomes buy them'], 0,
      'Needs are the things required to survive (food, water, shelter). Education and holidays are valuable, but a person can survive without them, so they are wants.'),
    mc('wants-needs', 'Which statement about wants is correct?',
      ['Wants are unlimited because people always desire more', 'Wants are limited because every household’s income is limited', 'Wants are exactly the same as needs', 'Wants disappear once all needs are met'], 0,
      'Wants never run out: when one is met, people want something else. Limited income limits what people can buy, not what they want.'),
    mc('opportunity-cost', 'What is meant by opportunity cost?',
      ['The next best alternative sacrificed when a choice is made', 'The money price paid for the item that is chosen', 'Every single alternative that could have been chosen instead of it', 'The extra profit earned as a result of a choice'], 0,
      'Opportunity cost has two parts: it is the next best alternative, and it is given up when a choice is made. It is one option, not a list, and not the money price.'),
    G('opportunity-cost', function () {
      var who = pick(PEOPLE), cash = pick([60, 80, 120, 150, 200]);
      var items = sample(['a pair of trainers', 'a new jacket', 'a concert ticket', 'a set of headphones', 'a skateboard', 'a box of art supplies'], 3);
      return mc('opportunity-cost', who + ' has $' + cash + ' to spend. Each of these costs $' + cash + '. ' + who + ' ranks them in order of preference:<br>1. ' + items[0] + '<br>2. ' + items[1] + '<br>3. ' + items[2] + '<br>' + who + ' buys ' + items[0] + '. What is the opportunity cost of this choice?',
        [cap(items[1]), cap(items[0]), 'The $' + cash + ' spent', cap(items[1]) + ' and ' + items[2]], 0,
        'The opportunity cost is the next best alternative given up. ' + who + '’s second choice was ' + items[1] + ', so that is what is sacrificed. It is not the item bought, the money paid, or a list of every alternative.');
    }),
    G('opportunity-cost', function () {
      var firm = pick(['Brightway Printing', 'Kora Bakery', 'Nexa Logistics', 'Tamsin Tiles', 'Orbit Web Design']), budget = pick([20000, 30000, 45000, 60000]);
      var uses = sample(['buy a new delivery van', 'hire two extra staff for a year', 'run an advertising campaign', 'upgrade its computer system', 'refit its shop front'], 3);
      return mc('opportunity-cost', firm + ' has $' + sep(budget) + ' to invest. It could ' + uses[0] + ', ' + uses[1] + ' or ' + uses[2] + '. Each would use the whole budget. The owners decide to ' + uses[0] + '; their second choice was to ' + uses[1] + '. What is the opportunity cost of the decision?',
        ['The chance to ' + uses[1], 'The chance to ' + uses[2], 'The $' + sep(budget) + ' that is spent', 'The chance to ' + uses[1] + ' and ' + uses[2]], 0,
        'The firm cannot afford all three, so it gives up its next best option: to ' + uses[1] + '. Opportunity cost is that single next best alternative, not the money or every option.');
    }),
    G('opportunity-cost', function () {
      var c = pick(COUNTRIES), m = pick([40, 80, 120, 250]);
      var proj = sample(['a new hospital', 'ten new primary schools', 'a coastal flood barrier', 'a high-speed rail link', 'a national vaccination programme'], 3);
      return mc('opportunity-cost', 'The government of ' + c + ' has $' + m + ' million to spend. It ranks three projects: first ' + proj[0] + ', second ' + proj[1] + ', third ' + proj[2] + '. Each costs $' + m + ' million. It chooses ' + proj[0] + '. What is the opportunity cost?',
        [cap(proj[1]), cap(proj[2]), cap(proj[0]), 'The $' + m + ' million of tax revenue'], 0,
        'The government can afford only one project, so it sacrifices its next best alternative, ' + proj[1] + '. Governments face opportunity cost just like consumers and firms.');
    }),
    mc('opportunity-cost', 'Ewa chooses to study at college for a year instead of taking a full-time job paying $1,500 a month. The job was her next best choice. What is her opportunity cost?',
      ['The wages she would have earned from the job', 'The college fees she pays for the year', 'The books she must buy for her course', 'The higher pay she may earn once she finishes college'], 0,
      'Ewa gives up the job, so the opportunity cost is the income from it ($1,500 a month). Fees and books are money costs of college, not the next best alternative given up.'),
    mc('oc-reasoning', 'Complete the explanation. “Lumo Café has only $8,000. It spends it on a new coffee machine, so …”',
      ['it cannot also afford the new seating it wanted', 'the market price of coffee machines will fall', 'its profits will certainly rise this year', 'its workers will become more skilled'], 0,
      'Opportunity cost comes from a limited budget: spending the $8,000 on the machine means the next best use, new seating, is given up.'),
    mc('oc-reasoning', 'A town council spends its whole budget on a new sports centre. Why does this decision have an opportunity cost?',
      ['The budget could have funded a different project', 'The sports centre will charge entry fees to every visitor', 'The builders must be paid wages', 'The sports centre may make a loss'], 0,
      'The council’s money is limited. Using it for the sports centre means another project, such as road repairs, cannot be paid for. That sacrifice is the opportunity cost.'),
    mc('oc-reasoning', 'Why is opportunity cost a single option rather than a list of everything given up?',
      ['Only one alternative would have been chosen instead', 'Economists only count the cheapest alternative', 'Only goods, not services, can be alternatives', 'A list of options is too long to measure'], 0,
      'If the choice had not been made, the person would have picked just their next best option. That one option is what is really sacrificed.'),
    mc('oc-reasoning', 'Joaquín spends Saturday working at a market stall. If he had not worked, he would have spent the day revising for an exam. What is the opportunity cost of working?',
      ['The revision he could have done that day', 'The wages he earns at the market stall', 'Every activity he could have done that day', 'The bus fare he pays to reach the market'], 0,
      'His next best use of the day was revising, so that is what he gives up. The wages are a benefit of working, not a cost.'),
    mc('economic-agents', 'Which is the best definition of a consumer?',
      ['A person who buys goods or services for their own use', 'A person who makes goods and sells them to others', 'A worker who is paid a wage by a firm', 'A person who buys goods only in order to resell them at a profit'], 0,
      'A consumer is the end user: someone who buys goods or services to use themselves.'),
    mc('economic-agents', 'Which is the best definition of a producer?',
      ['A person or firm that makes and supplies goods or services', 'A person who buys goods or services for their own use', 'A body that collects taxes and passes laws', 'A household that saves part of its income in a bank every month'], 0,
      'A producer makes and supplies goods or services. It can be a person, a firm or even a country.'),
    mc('economic-agents', 'Which is the best definition of a government?',
      ['The group with the authority to run a country', 'The largest firm in a country’s economy', 'All the consumers who live in a country', 'The bank that lends money to firms'], 0,
      'A government is the group of people with the authority to run a country or state. It makes choices about spending and faces opportunity cost too.'),
    G('economic-agents', function () {
      var cases = [
        ['A teenager buys a phone case to use herself.', 0], ['A family buys groceries for their own meals.', 0], ['A pensioner pays for a haircut.', 0],
        ['A farmer grows tomatoes and sells them at a market.', 1], ['A small firm makes wooden toys and sells them online.', 1], ['A plumber is paid to fix leaking pipes in homes.', 1],
        ['The transport ministry decides to build a new railway line.', 2], ['The national authority that runs the country raises income tax.', 2], ['The education ministry chooses to build more schools.', 2]];
      var c = pick(cases), names = ['Consumer', 'Producer', 'Government'];
      var whys = ['buys for their own use, so this agent is a consumer', 'makes or provides something for others, so this agent is a producer', 'is part of the group with authority to run the country, so this agent is the government'];
      return mc('economic-agents', 'Which economic agent is described? <i>' + c[0] + '</i>', names, c[1], 'The agent ' + whys[c[1]] + '.');
    }),
    mu('economic-agents', 'Which of these face opportunity cost when they make a choice? Select all that apply.',
      ['A consumer choosing between two purchases', 'A firm choosing between two investments', 'A government choosing between two projects', 'Nobody, if the item chosen was a gift', 'Only consumers, because firms make profits'], [0, 1, 2],
      'All economic agents have limited resources, so every choice by a consumer, firm or government gives up a next best alternative.')
  ] };

  // =====================================================================
  // ECO-T12-01 The four factors of production
  // =====================================================================
  var FOP = ['Land', 'Labour', 'Capital', 'Enterprise'];
  var FOP_WHY = ['it is a natural resource, so it is land', 'it is human effort used in production, so it is labour', 'it is a man-made item used to make other goods, so it is capital', 'it is the person who organises the other factors and takes the risk, so it is enterprise'];
  var FOP_EASY = [
    ['crude oil under the seabed', 0], ['a forest cut for timber', 0], ['rainwater collected to water crops', 0], ['iron ore in the ground', 0], ['fish in a lake', 0], ['fertile farmland', 0],
    ['a bus driver', 1], ['a nurse in a hospital', 1], ['a tea picker on a plantation', 1], ['a software tester', 1], ['a teacher', 1],
    ['a tractor', 2], ['a delivery van', 2], ['an industrial oven in a bakery', 2], ['a laptop for designing websites', 2], ['a warehouse building', 2],
    ['a woman who starts a juice business, organises everything and risks her savings', 3], ['the founder who combines workers, machines and land and bears the risk of loss', 3]];
  var FOP_HARD = [
    ['a technician who repairs the robots in a car factory', 1, 'The technician is a person working, so he is labour, even though he works on machines.'],
    ['the robots on a car assembly line', 2, 'Robots are man-made equipment used to make cars, so they are capital.'],
    ['river water used to cool factory machines', 0, 'River water is a natural resource, so it is land, even though it is used in a factory.'],
    ['a fishing boat', 2, 'The boat is man-made and used to catch fish, so it is capital. The fish themselves would be land.'],
    ['the fish caught by a fishing boat', 0, 'Fish in the sea are a natural resource, so they are land.'],
    ['an accountant employed by a supermarket', 1, 'The accountant provides mental effort for a wage, so this is labour.'],
    ['the sand used to make glass bottles', 0, 'Sand is taken from nature, so it is land.'],
    ['a sewing machine in a clothing factory', 2, 'The sewing machine is a man-made tool used to make clothes, so it is capital.']];

  B['ECO-T12-01'] = { title: 'The four factors of production', items: [
    G('identify-factor', function () {
      var c = pick(FOP_EASY);
      return mc('identify-factor', 'Which factor of production is this: <b>' + c[0] + '</b>?', FOP.slice(), c[1], cap(c[0]) + ': ' + FOP_WHY[c[1]] + '.');
    }),
    G('identify-factor', function () {
      var c = pick(FOP_HARD);
      return mc('identify-factor', 'Classify this input as a factor of production: <b>' + c[0] + '</b>.', FOP.slice(), c[1], c[2]);
    }),
    G('identify-factor', function () {
      var EX = [['Crude oil lying under the seabed', 'A forest that is cut down for timber', 'Fertile farmland used to grow wheat'],
        ['A bus driver employed by a transport firm', 'A nurse working in a city hospital', 'A tea picker working on a plantation'],
        ['A tractor used on a large farm', 'An industrial oven in a bakery', 'A delivery van owned by a courier firm'],
        ['A founder who organises a firm and bears its risk', 'An owner who risks her savings on a new café']];
      var k = rint(0, 3), opts = [pick(EX[k])].concat([0, 1, 2, 3].filter(function (j) { return j !== k; }).map(function (j) { return pick(EX[j]); }));
      return mc('identify-factor', 'Which of these is an example of <b>' + FOP[k].toLowerCase() + '</b> as a factor of production?', opts, 0,
        opts[0] + ': ' + FOP_WHY[k] + '. Each other option belongs to a different factor.');
    }),
    mc('definitions', 'Which is the best definition of labour?',
      ['The human effort, physical or mental, used in production', 'The machines and tools used to make other goods', 'The natural resources used to make goods', 'The wages paid to the people who work for a firm each month'], 0,
      'Labour is the people and the effort they put into making goods and services. Wages are the reward paid to labour, not the factor itself.'),
    mc('definitions', 'Which is the best definition of capital as a factor of production?',
      ['Man-made goods used to produce other goods and services', 'Money that a firm keeps in its bank account to spend later', 'Natural resources such as coal and forests', 'The person who takes the risk of starting a firm'], 0,
      'In economics, capital means man-made equipment such as machines, tools, vehicles and buildings that are used in production.'),
    mc('definitions', 'Which is the best definition of land as a factor of production?',
      ['All natural resources used to make goods and services', 'Only the fields that farmers use to grow crops', 'The factory buildings in which goods are produced and stored', 'The rent that a firm pays for its premises'], 0,
      'Land covers every natural resource, including water, oil, minerals, forests and fish, not only fields.'),
    mc('definitions', 'Which is the best definition of enterprise?',
      ['Organising the other factors and taking the risk of production', 'Working on a factory production line every day in return for a wage', 'Lending money to firms in return for interest', 'Owning natural resources and renting them out'], 0,
      'Enterprise is provided by the entrepreneur, who has the idea, combines land, labour and capital, and risks losing money.'),
    mc('definitions', 'Which is the best definition of a factor of production?',
      ['A resource used to make goods and services', 'A reward paid to the owners of a business', 'A finished product sold to consumers', 'A sector of the economy such as manufacturing'], 0,
      'Factors of production are the inputs (land, labour, capital and enterprise) used to produce goods and services.'),
    mc('not-a-factor', 'Which of these is a factor of production?',
      ['Capital', 'Interest', 'Taxation', 'Retailing'], 0,
      'Capital is one of the four factors. Interest is a payment, taxation is collected by government and retailing is an activity in the tertiary sector.'),
    mu('not-a-factor', 'Which of these are factors of production? Select all that apply.',
      ['Land', 'Labour', 'Enterprise', 'Profit', 'Wages', 'The tertiary sector'], [0, 1, 2],
      'Land, labour and enterprise are factors (with capital). Profit and wages are rewards paid to factors, and the tertiary sector is a part of the economy.'),
    mc('not-a-factor', 'Why is profit <b>not</b> a factor of production?',
      ['It is a reward earned by enterprise, not an input', 'It is too small to matter for most firms', 'It is only earned by firms in the public sector', 'It is a natural resource, so it counts as land'], 0,
      'Factors are inputs used to make goods. Profit is the reward the entrepreneur earns after production, so it is an outcome, not an input.'),
    mc('not-a-factor', 'Which of these is capital as a factor of production?',
      ['A forklift truck in a warehouse', 'Cash saved in a bank account', 'The wages paid to drivers', 'Coal dug out of a mine'], 0,
      'Capital means man-made equipment used to produce goods and services, such as a forklift truck. Cash is money, wages are a reward and coal is land.'),
    mc('production', 'What is meant by production?',
      ['Turning inputs into goods and services that people want', 'Selling finished goods to consumers in shops at a profit', 'Buying goods and services for your own use', 'Storing goods until their prices rise'], 0,
      'Production means combining resources (inputs) to make goods or services. A producer is any firm or person who does this.'),
    mc('production', 'Which of these is a producer?',
      ['A firm that bottles and sells fruit juice', 'A family drinking juice with breakfast', 'A tax charged on each bottle of juice', 'The price paid for a bottle of juice'], 0,
      'A producer makes and supplies goods or services. The family is a consumer, and the tax and the price are not economic agents.'),
    mc('factor-in-context', 'Nia’s Chocolate Co. makes chocolate bars. Which input is <b>enterprise</b>?',
      ['Nia, who organises production and risks her savings', 'The cocoa beans grown on farms', 'The workers who wrap the bars', 'The machines in the factory that grind and roast the beans'], 0,
      'Nia has the business idea, brings the other factors together and takes the risk, so she provides enterprise. The beans are land, the workers labour and the machines capital.'),
    mc('factor-in-context', 'A honey business keeps bees in the countryside. Which input is <b>land</b>?',
      ['The wildflower meadows where the bees feed', 'The beekeepers who collect the honey', 'The wooden hives the bees live in', 'The owner who decided to start the firm'], 0,
      'The meadows are a natural resource, so they are land. Beekeepers are labour, the hives are capital and the owner is enterprise.'),
    mc('factor-in-context', 'A bicycle factory makes frames. Which input is <b>capital</b>?',
      ['The welding robots that join the frames', 'The steel workers on the production line', 'The iron ore mined to make steel', 'The founder who takes the business risk'], 0,
      'Welding robots are man-made equipment used to produce bicycles, so they are capital.'),
    mc('factor-in-context', 'A rice farm grows rice for sale. Which input is <b>labour</b>?',
      ['The people who plant and harvest the rice', 'The paddy fields and the river water', 'The tractors and water pumps', 'The owner who borrows to buy seed'], 0,
      'The people doing the planting and harvesting provide human effort, so they are labour.'),
    mu('factor-in-context', 'A sugar mill turns sugar cane into sugar. Which of these inputs are <b>capital</b>? Select all that apply.',
      ['The cane-crushing machines', 'The lorries that carry the cane', 'The fields where the cane grows', 'The cane cutters', 'The mill owner who takes the risk'], [0, 1],
      'Machines and lorries are man-made items used in production, so they are capital. The fields are land, the cutters are labour and the owner provides enterprise.'),
    mc('factor-in-context', 'Why does a firm usually need all four factors of production together?',
      ['Each factor does a different job, so output stops without one', 'The government requires every firm by law to use all four factors', 'Using all four always lowers the price of output', 'Each factor earns exactly the same reward'], 0,
      'Land provides the raw materials, labour does the work, capital provides the tools and enterprise organises it all. Without any one of them the product cannot be made efficiently.'),
    mc('factor-in-context', 'Which pair correctly matches a factor of production with an example?',
      ['Land: a cotton field', 'Capital: a cotton picker employed on a farm', 'Labour: a cotton-spinning machine', 'Enterprise: a bale of raw cotton'], 0,
      'A cotton field is a natural resource, so it is land. A picker is labour, a spinning machine is capital and raw cotton comes from land.'),
    mc('not-a-factor', 'Wages are best described as which of these?',
      ['The reward paid to labour', 'A factor of production', 'A natural resource', 'The reward paid to enterprise'], 0,
      'Wages are the payment people receive for their labour. They are a reward linked to a factor, not a factor of production themselves. The reward for enterprise is profit.')
  ] };

  // =====================================================================
  // ECO-T12-02 Sectors of the economy and how they change
  // =====================================================================
  var SECT = ['Primary', 'Secondary', 'Tertiary'];
  var SECT_WHY = ['it takes or grows natural resources, so it is in the primary sector', 'it makes or builds goods from raw materials, so it is in the secondary sector', 'it provides a service, so it is in the tertiary sector'];
  var JOBS_EASY = [
    ['a dairy farmer', 0], ['a coal miner', 0], ['a forestry worker cutting trees', 0], ['a fisherman', 0], ['an oil-rig driller', 0],
    ['a worker assembling televisions', 1], ['a furniture maker in a factory', 1], ['a worker in a steel mill', 1], ['a clothing machinist', 1],
    ['a bank clerk', 2], ['a hairdresser', 2], ['a hotel receptionist', 2], ['a secondary-school teacher', 2], ['a doctor', 2]];
  var JOBS_HARD = [
    ['a bricklayer building new houses', 1, 'House building is construction, which belongs to the secondary sector, not services.'],
    ['a worker building a new motorway bridge', 1, 'Construction of roads and bridges is part of the secondary sector.'],
    ['a baker in a large bread factory', 1, 'Turning flour into bread in a factory is manufacturing, so it is secondary.'],
    ['a lorry driver delivering goods to shops', 2, 'Transport is a service, so the driver is in the tertiary sector.'],
    ['a worker drilling for natural gas', 0, 'Extracting gas from the ground takes a natural resource, so it is primary.'],
    ['a shipyard welder building ferries', 1, 'Shipbuilding is manufacturing, so it is secondary.'],
    ['an insurance salesperson', 2, 'Selling insurance is a service, so it is tertiary.'],
    ['a worker picking tea leaves on a plantation', 0, 'Growing and harvesting crops is primary-sector work.']];

  B['ECO-T12-02'] = { title: 'Sectors of the economy and how they change', items: [
    G('classify', function () { var c = pick(JOBS_EASY); return mc('classify', 'In which sector of the economy does ' + c[0] + ' work?', SECT.slice(), c[1], cap(c[0]) + ': ' + SECT_WHY[c[1]] + '.'); }),
    G('classify', function () { var c = pick(JOBS_HARD); return mc('classify', 'Classify this occupation by sector: <b>' + c[0] + '</b>.', SECT.slice(), c[1], c[2]); }),
    mu('classify', 'Which of these occupations are in the <b>secondary</b> sector? Select all that apply.',
      ['A car assembly worker', 'A bricklayer on a housing estate', 'A furniture maker', 'A coffee grower', 'A bank clerk', 'A hotel receptionist'], [0, 1, 2],
      'Making goods and building are secondary. Growing coffee is primary, and banking and hotels provide services, so they are tertiary.'),
    mu('classify', 'Which of these occupations are in the <b>tertiary</b> sector? Select all that apply.',
      ['A hairdresser', 'A train driver', 'An insurance broker', 'A copper miner', 'A shipyard welder', 'A cattle farmer'], [0, 1, 2],
      'Hairdressing, transport and insurance are services, so they are tertiary. Mining and farming are primary; shipbuilding is secondary.'),
    mc('definitions', 'Which is the best definition of the tertiary sector?',
      ['The part of the economy that provides services', 'The part of the economy that grows crops', 'The part of the economy that makes goods', 'The part of the economy run by the government'], 0,
      'The tertiary sector provides services such as banking, retail, education and health care.'),
    mc('definitions', 'Which is the best definition of the primary sector?',
      ['The part of the economy that extracts or grows natural resources', 'The part of the economy that turns raw materials into finished goods', 'The part of the economy that provides services to people', 'The part of the economy with the most workers'], 0,
      'The primary sector takes resources from nature: farming, fishing, mining, forestry and drilling for oil.'),
    mc('definitions', 'Which is the best definition of the secondary sector?',
      ['The part of the economy that makes or builds things from raw materials', 'The part of the economy that grows food and catches fish', 'The part of the economy that sells goods to consumers', 'The part of the economy that provides health care, education and banking services'], 0,
      'Manufacturing and construction turn raw materials into finished goods or buildings, so they make up the secondary sector.'),
    mc('definitions', 'The “service sector” is another name for which sector?',
      ['The tertiary sector', 'The primary sector', 'The secondary sector', 'A fourth, separate sector'], 0,
      'Services are the tertiary sector. There is no separate fourth sector called the service sector.'),
    mc('definitions', 'A firm grows cocoa, makes chocolate bars from it and sells them in its own shops. In which sectors does it operate?',
      ['Primary, secondary and tertiary', 'Primary and secondary only', 'Secondary and tertiary only', 'Tertiary only'], 0,
      'Growing cocoa is primary, making chocolate is secondary and running shops is a retail service, which is tertiary.'),
    mc('cause-chain', 'As average incomes in a country rise, which change in employment is most likely?',
      ['A larger share of workers in the tertiary sector', 'A larger share of workers in the primary sector', 'Equal shares of workers in all three sectors', 'No change at all in any sector’s share of total workers'], 0,
      'Higher incomes mean people spend more on services such as restaurants, health and leisure, so demand for service workers grows.'),
    mc('cause-chain', 'Complete the chain: “Incomes rise, so households spend more on restaurants, health care and leisure, so …”',
      ['demand for service workers rises and tertiary jobs grow', 'farms need more workers and primary jobs grow', 'factories raise their prices and so secondary-sector jobs grow', 'fewer workers are needed in every sector'], 0,
      'More spending on services raises demand for the workers who provide them, so employment shifts towards the tertiary sector.'),
    mc('cause-chain', 'Why have many developed countries seen fewer jobs in the secondary sector?',
      ['Manufacturing has moved to countries with lower costs', 'Demand for every manufactured good has stopped', 'Factories have moved into the primary sector', 'Services have become too expensive for most households to buy'], 0,
      'Lower production costs abroad made it hard for factories in developed countries to compete, so some closed or cut jobs.'),
    mc('cause-chain', 'In which type of economy is the largest share of workers usually in the primary sector?',
      ['A developing economy with many small farms', 'A developed economy with high incomes', 'An economy where most jobs are in banking', 'An economy with large car factories'], 0,
      'In developing economies many people work in farming, fishing and mining, so the primary sector employs the most people.'),
    mu('cause-chain', 'Factory jobs in Kestland have fallen for twenty years. Which of these could explain this? Select all that apply.',
      ['Cheaper manufactured imports from lower-cost countries', 'Local factories closing because they cannot compete', 'A rise in demand for the goods its factories make', 'Lower wages making its factories more competitive', 'More people choosing to buy goods made in Kestland'], [0, 1],
      'Cheaper competition from abroad leads some factories to close or cut staff, reducing secondary jobs. Rising demand, lower costs and more local buying would protect factory jobs, not cut them.'),
    G('sector-data', function () {
      var c = pick(COUNTRIES), y1 = pick([1990, 1995, 2000]), y2 = y1 + pick([25, 30]);
      var P1 = rint(45, 62), S1 = rint(14, 22), T1 = 100 - P1 - S1, P2 = P1 - rint(15, 25), S2 = S1 + rint(-2, 6), T2 = 100 - P2 - S2;
      return nm('sector-data', 'The table shows the share of employment in each sector in ' + c + '.' + tbl(['Sector', y1 + ' (%)', y2 + ' (%)'], [['Primary', P1, P2], ['Secondary', S1, S2], ['Tertiary', T1, T2]]) + 'By how many percentage points did the tertiary sector’s share of employment rise?',
        T2 - T1, 'points', 'Subtract the old share from the new share: ' + T2 + ' − ' + T1 + ' = ' + (T2 - T1) + ' percentage points. This growth in services is typical as incomes rise and a country develops.');
    }),
    G('sector-data', function () {
      var c = pick(COUNTRIES), y1 = 2000, y2 = 2024;
      var P1 = rint(40, 55), S1 = rint(15, 22), T1 = 100 - P1 - S1, dp = rint(12, 20), P2 = P1 - dp, S2 = S1 + rint(1, 5), T2 = 100 - P2 - S2;
      return mc('sector-data', 'Shares of employment in ' + c + ':' + tbl(['Sector', y1 + ' (%)', y2 + ' (%)'], [['Primary', P1, P2], ['Secondary', S1, S2], ['Tertiary', T1, T2]]) + 'Which statement is supported by the data?',
        ['The primary share fell by ' + dp + ' percentage points', 'The primary share rose by ' + dp + ' percentage points', 'The tertiary share fell between ' + y1 + ' and ' + y2, 'The secondary share fell between ' + y1 + ' and ' + y2], 0,
        'Primary employment fell from ' + P1 + '% to ' + P2 + '%, a fall of ' + P1 + ' − ' + P2 + ' = ' + dp + ' points, while the tertiary and secondary shares both rose. This is the usual pattern as a country develops.');
    }),
    mc('interdependence', 'How does the primary sector support the secondary sector?',
      ['It supplies the raw materials that factories process', 'It provides banking services to factories', 'It sets the prices that factories charge for finished goods', 'It buys most of the goods factories make'], 0,
      'Raw materials such as timber, cotton, metal ores and crops come from the primary sector and are turned into goods by the secondary sector.'),
    mc('interdependence', 'A large copper mine in Orlavia closes. Which sectors are affected, in what order?',
      ['Primary first, then secondary firms that use the copper', 'Tertiary first, then primary firms that sell the copper', 'Secondary first, then the primary mine itself', 'Only the tertiary sector is affected'], 0,
      'The mine is primary, so its jobs go first. Manufacturers that turn copper into wires or pipes (secondary) then lose a supply of raw material.'),
    mc('interdependence', 'A minister says, “Only the tertiary sector matters now.” Which is the best counter-argument?',
      ['Many services rely on goods and materials from the other sectors', 'The tertiary sector employs very few people in developed countries', 'Services never earn any tax revenue for governments', 'Primary output is always larger than tertiary output'], 0,
      'Shops need goods to sell and hospitals need equipment and medicines. The sectors depend on each other, so the other two still matter.'),
    mc('cause-chain', 'Which change would most likely raise the share of output from the tertiary sector in a developing country?',
      ['More tourists staying in hotels and using tour firms', 'The discovery of a large new gold deposit', 'A new steel works opening in the capital', 'Higher world prices for the rice that its farmers grow and export'], 0,
      'Tourism uses hotels, restaurants and transport, which are services. Gold mining and rice are primary, and steel making is secondary.'),
    mc('cause-chain', 'Which data pattern best suggests that a country has developed over time?',
      ['The primary share of jobs falls and the tertiary share rises', 'The primary share of jobs rises and the tertiary share falls', 'All three sectors keep exactly the same shares', 'The secondary share falls to zero within a year'], 0,
      'As incomes rise, workers move out of farming and into services, so the primary share shrinks and the tertiary share grows.'),
    mc('classify', 'Which statement about the sectors of the economy is correct?',
      ['House building is part of the secondary sector', 'Fishing is part of the tertiary sector', 'Retailing is part of the secondary sector', 'Mining is part of the secondary sector'], 0,
      'Construction turns raw materials into buildings, so it is secondary. Fishing and mining are primary, and retailing is a service, so it is tertiary.')
  ] };

  // =====================================================================
  // ECO-T12-03 Draw a sector pie chart for a country
  // =====================================================================
  var DEVELOPED = ['Canada', 'Sweden', 'Australia', 'South Korea', 'the Netherlands', 'New Zealand', 'Denmark'];
  var DEVELOPING = ['Malawi', 'Chad', 'Burundi', 'Niger', 'Mozambique', 'Burkina Faso'];
  function devPie() { var p = rint(2, 6), s = rint(18, 28); return PST(p, s, 100 - p - s); }
  function poorPie() { var p = rint(55, 72), s = rint(8, 15); return PST(p, s, 100 - p - s); }

  B['ECO-T12-03'] = { title: 'Draw a sector pie chart for a country', items: [
    G('choose-chart', function () {
      var c = pick(DEVELOPED), wrong = sample([PST(6, 54, 40), PST(58, 26, 16), PST(30, 10, 60), PST(33, 33, 34), PST(12, 46, 42)], 3);
      var sets = [devPie()].concat(wrong), order = shuffle([0, 1, 2, 3]), shown = order.map(function (i) { return sets[i]; });
      return mc('choose-chart', 'Which pie chart best shows how employment is split between P (primary), S (secondary) and T (tertiary) in a developed country such as ' + c + '?', LET.slice(), order.indexOf(0),
        'For a developed country T must be the biggest slice (well over half), S the second biggest and P the smallest. Only chart ' + LET[order.indexOf(0)] + ' has that order.',
        { svg: fourPies(shown, 'Four pie charts labelled A to D, each split into P, S and T slices') });
    }),
    G('choose-chart', function () {
      var c = pick(DEVELOPING), wrong = sample([PST(42, 28, 30), PST(20, 25, 55), PST(30, 45, 25), PST(33, 33, 34), PST(46, 20, 34)], 3);
      var sets = [poorPie()].concat(wrong), order = shuffle([0, 1, 2, 3]), shown = order.map(function (i) { return sets[i]; });
      return mc('choose-chart', 'Which pie chart best shows how employment is split between P (primary), S (secondary) and T (tertiary) in a developing country such as ' + c + '?', LET.slice(), order.indexOf(0),
        'For a developing country P must be the biggest slice and at least half the circle, with S and T sharing the rest. Only chart ' + LET[order.indexOf(0)] + ' meets both conditions.',
        { svg: fourPies(shown, 'Four pie charts labelled A to D, each split into P, S and T slices') });
    }),
    G('mark-scheme', function () {
      var c = pick(DEVELOPING), p = rint(40, 46), s = rint(24, 30), t = 100 - p - s;
      return mc('mark-scheme', 'A student drew this pie chart for a developing country such as ' + c + '. P is ' + p + '%, S is ' + s + '% and T is ' + t + '%. Which feature would lose a mark?',
        ['P is less than half of the circle', 'P is not the biggest slice', 'S and T do not share the rest', 'T should be bigger than P'], 0,
        'P is the biggest slice and S and T share the remainder, so those marks are earned. But P at ' + p + '% is under half the circle; for a developing country it must be at least 50%.',
        { svg: svg(200, 170, 'A single pie chart with slices P, S and T', pie(100, 80, 62, PST(p, s, t))) });
    }),
    G('mark-scheme', function () {
      var v = pick([
        { set: PST(6, 52, 42), ans: [0, 1], txt: 'S is the biggest slice and T only second' },
        { set: PST(24, 8, 68), ans: [1, 2], txt: 'T is biggest, but P is larger than S' },
        { set: PST(50, 35, 15), ans: [0, 2], txt: 'P is the biggest slice and T the smallest' }]);
      var c = pick(DEVELOPED);
      return mu('mark-scheme', 'A student drew this pie chart for a developed country such as ' + c + '. Which marks does it lose? Select all that apply.',
        ['T is not the biggest slice', 'S is not the second-biggest slice', 'P is not the smallest slice', 'The slices are not labelled'], v.ans,
        'For a developed country the marks are for T biggest, S second and P smallest. Here ' + v.txt + ', so the matching marks are lost. The slices are labelled, so no mark is lost for that.',
        { svg: svg(200, 170, 'A single pie chart with slices P, S and T', pie(100, 80, 62, v.set)) });
    }),
    G('pie-maths', function () {
      var sec = pick(['secondary', 'tertiary']), pct = sec === 'secondary' ? pick([10, 15, 20, 25, 30]) : pick([25, 30, 35, 40, 45]), ang = R.roundDp(pct * 3.6, 0);
      return nm('pie-maths', 'In a pie chart of employment, the ' + sec + ' sector slice has an angle of ' + ang + '°. What percentage of workers are in the ' + sec + ' sector?', pct, '%',
        'A full circle is 360°, so the share is ' + ang + ' ÷ 360 × 100 = ' + pct + '%.');
    }),
    G('pie-maths', function () {
      var pct = pick([55, 60, 65, 70, 75]), ang = R.roundDp(pct * 3.6, 0), c = pick(DEVELOPED);
      return nm('pie-maths', 'In ' + c + ', ' + pct + '% of workers are in the tertiary sector. What angle, in degrees, should the T slice have in a pie chart?', ang, '°',
        'Multiply the share by 360°: ' + pct + ' ÷ 100 × 360 = ' + ang + '°. This is more than 180°, so T fills more than half the circle.');
    }),
    G('pie-maths', function () {
      var p = rint(52, 70), s = rint(8, 16), t = 100 - p - s;
      return nm('pie-maths', 'In a developing country, the primary sector employs ' + p + '% of workers and the secondary sector employs ' + s + '%. What percentage of workers are in the tertiary sector?', t, '%',
        'The three slices must add up to 100%: 100 − ' + p + ' − ' + s + ' = ' + t + '%.');
    }),
    G('read-chart', function () {
      var dev = Math.random() < 0.5, set = dev ? devPie() : poorPie();
      var opts = ['A developed economy with high incomes', 'A developing economy with many small farms', 'An economy where factories employ most people', 'An economy with equal shares in each sector'];
      return mc('read-chart', 'This pie chart shows employment by sector. Which kind of economy does it most likely show?', opts, dev ? 0 : 1,
        dev ? 'T is well over half and P is a thin slice, which fits a developed economy where most people work in services.' : 'P is over half the circle, which fits a developing economy where most people work in farming and other primary activities.',
        { svg: svg(200, 170, 'A pie chart with slices P, S and T', pie(100, 80, 62, set)) });
    }),
    G('read-chart', function () {
      var p = rint(56, 70), a = rint(10, 14), b = 100 - p - a, labs = shuffle(['X', 'Y', 'Z']), c = pick(DEVELOPING);
      var slices = [{ v: p, lab: labs[0] }, { v: a, lab: labs[1] }, { v: b, lab: labs[2] }];
      return mc('read-chart', 'This pie chart shows employment in ' + c + ', a developing country. The slices are labelled X, Y and Z. Which slice is most likely the primary sector?', ['X', 'Y', 'Z'], ['X', 'Y', 'Z'].indexOf(labs[0]),
        'In a developing country the primary sector is the largest slice, at least half the circle. Slice ' + labs[0] + ' is ' + p + '%, so it is most likely primary.',
        { svg: svg(200, 170, 'A pie chart with slices X, Y and Z', pie(100, 80, 62, slices)) });
    }),
    G('read-chart', function () {
      var p = rint(2, 5), s = rint(20, 26), t = 100 - p - s, labs = shuffle(['X', 'Y', 'Z']), c = pick(DEVELOPED);
      var slices = [{ v: t, lab: labs[0] }, { v: s, lab: labs[1] }, { v: p, lab: labs[2] }];
      return mc('read-chart', 'This pie chart shows employment in ' + c + ', a developed country. Which slice is most likely the secondary sector?', ['X', 'Y', 'Z'], ['X', 'Y', 'Z'].indexOf(labs[1]),
        'In a developed country T is the biggest slice, S the second biggest and P the smallest. The middle-sized slice, ' + labs[1] + ' (' + s + '%), is most likely secondary.',
        { svg: svg(200, 170, 'A pie chart with slices X, Y and Z', pie(100, 80, 62, slices)) });
    }),
    mc('size-rules', 'For a developed country such as Denmark, which order of slice sizes is correct, largest first?',
      ['T, then S, then P', 'S, then T, then P', 'P, then S, then T', 'T, then P, then S'], 0,
      'In developed countries most people work in services (T), fewer in manufacturing and building (S) and very few in farming or mining (P).'),
    mc('size-rules', 'Which description fits a pie chart for a developing country such as Chad?',
      ['P is at least half the circle; S and T share the rest', 'P is the biggest slice but under a third of the circle', 'T is over half the circle; S and P share the rest', 'All three slices are roughly equal in size'], 0,
      'Most workers in a developing country are in the primary sector, so P must be the biggest slice and at least half of the circle.'),
    mc('size-rules', 'At least what angle should the P slice have for a developing country?',
      ['180°', '90°', '120°', '360°'], 0,
      'P must be at least half the circle, and half of 360° is 180°.'),
    mc('size-rules', 'For a developed country, about how big should the P slice usually be?',
      ['Under 10% of the circle', 'About 30% of the circle', 'About 50% of the circle', 'Over 60% of the circle'], 0,
      'Very few people in developed countries work in farming, fishing or mining, so P is a thin slice, usually well under a tenth.'),
    mc('size-rules', 'Why is T the biggest slice for a developed country?',
      ['High incomes create strong demand for services', 'Services are produced only in developed countries', 'Developed countries have no farms or mines', 'Factories in developed countries are banned'], 0,
      'As incomes rise, people spend more on services such as health, leisure and finance, so most jobs are in the tertiary sector.'),
    mc('size-rules', 'For a developing country, which must be true of the S and T slices together?',
      ['They make up half of the circle or less', 'They make up more than half of the circle', 'They must be exactly equal in size', 'S must always be bigger than T'], 0,
      'P is at least half the circle, so S and T together can only fill the remaining half or less. Their sizes relative to each other can vary.'),
    mc('size-rules', 'A student draws three equal slices for a developed country. Why does this lose marks?',
      ['No size order between the sectors can be seen', 'Pie charts must always have four slices', 'The slices should be drawn in different colours', 'Equal slices are only correct for developing countries'], 0,
      'The marks are for the size order (T biggest, S second, P smallest). Equal slices show no order at all.'),
    mc('size-rules', 'As a country develops over several decades, how does its employment pie chart change?',
      ['P shrinks and T grows', 'P grows and T shrinks', 'S disappears completely', 'All slices stay the same size'], 0,
      'Development moves workers out of farming and into services, so the P slice gets smaller and the T slice gets bigger.'),
    mc('size-rules', 'In this kind of pie chart, what does each slice show?',
      ['That sector’s share of total employment or output', 'The number of firms in each sector', 'The profit made in each sector', 'The price of goods made in each sector'], 0,
      'Each slice is a share of the whole: the part of total employment (or output) that is in that sector.'),
    mc('size-rules', 'Which drawing tip helps to show clearly that P is at least half the circle?',
      ['Draw a line through the centre and give P one whole half', 'Draw P as a thin slice near the top of the circle', 'Split the circle into three equal slices first', 'Draw P outside the circle as a separate shape'], 0,
      'A straight line through the centre splits the circle into two halves. Giving P all of one half (or more) makes the 50% condition clear.'),
    mu('size-rules', 'Which features earn marks on a pie chart for a developing country such as Burundi? Select all that apply.',
      ['P is the biggest slice', 'P is at least half the circle', 'The rest is split between S and T', 'T is bigger than S', 'S is at least a quarter of the circle'], [0, 1, 2],
      'The marks are for P biggest, P at least half, and the rest divided between S and T. Whether S or T is bigger does not matter.'),
    mc('mark-scheme', 'A student’s pie chart for Japan, a developed country, shows T as 72%, S as 24% and P as 4%. Is it correct?',
      ['Yes: T is biggest, S second and P smallest', 'No: P should be at least half the circle', 'No: S should be the biggest slice', 'No: the three slices should be equal'], 0,
      'For a developed country the three marks are for T biggest, S second biggest and P smallest. This chart has all three.')
  ] };

  // =====================================================================
  // ECO-T11-03 Reading a production possibility curve and economic growth
  // =====================================================================
  var GOODS2 = [['Capital goods', 'Consumer goods'], ['Food', 'Clothing'], ['Tractors', 'Cars'], ['Medical care', 'Education'], ['Machinery', 'Furniture']];
  function ppcPoints(L, yg, xg) {   // L = {hi, lo, inside, outside}
    var a = 205, b = 165, body = ppcCurve(a, b) + tx(70 + a * 0.97 + 2, 215 - b * 0.2, 'PPC', { bold: true, size: 12 });
    function P(sc, deg, lab) { var r = deg * Math.PI / 180, x = 70 + a * sc * Math.cos(r), y = 215 - b * sc * Math.sin(r); return dot(x, y, HI) + tx(x + 6, y - 6, lab, { bold: true, c: HI }); }
    body += P(1, 70, L.hi) + P(1, 22, L.lo) + P(0.55, 45, L.inside) + P(1.16, 47, L.outside);
    return ppcFrame(yg, xg, body, 'Production possibility curve with four points labelled W, X, Y and Z');
  }
  function ppcLetters() { var l = shuffle(['W', 'X', 'Y', 'Z']); return { hi: l[0], lo: l[1], inside: l[2], outside: l[3] }; }
  function ppcTwo(outward, yg, xg) {
    var a = 205, b = 165, s1 = outward ? 0.74 : 1, s2 = outward ? 1 : 0.7;
    var body = ppcCurve(a * s1, b * s1, INK) + ppcCurve(a * s2, b * s2, BLUE, true);
    var r = 45 * Math.PI / 180;
    body += tx(70 + a * s1 * Math.cos(r) + 4, 215 - b * s1 * Math.sin(r) - 4, 'PPC1', { bold: true }) + tx(70 + a * s2 * Math.cos(r) + 4, 215 - b * s2 * Math.sin(r) - 4, 'PPC2', { bold: true, c: BLUE });
    return ppcFrame(yg, xg, body, 'Two production possibility curves labelled PPC1 and PPC2');
  }
  var PPC_EVENTS = [
    ['a new irrigation system doubles crop yields per hectare', 0], ['workers gain new skills on a national training scheme', 0], ['firms invest heavily in new machinery', 0], ['skilled engineers move into the country from abroad', 0],
    ['many doctors and engineers emigrate', 1], ['an earthquake destroys ports and factories', 1], ['the country’s only coal reserves run out', 1], ['floods ruin a large share of the farmland', 1],
    ['firms switch some factories from making one good to the other', 2], ['the government shifts resources from one good to the other, keeping all resources in use', 2],
    ['unemployed workers find jobs during a recovery, using existing resources', 3], ['idle factories that were closed in a recession reopen', 3]];

  B['ECO-T11-03'] = { title: 'Reading a production possibility curve and economic growth', items: [
    G('points', function () {
      var L = ppcLetters(), g = pick(GOODS2);
      return mc('points', 'Which point on the diagram cannot be reached with the economy’s current resources?', ['W', 'X', 'Y', 'Z'], ['W', 'X', 'Y', 'Z'].indexOf(L.outside),
        'Point ' + L.outside + ' lies outside the PPC, so the economy does not have enough resources to produce that combination today. Points on or inside the curve are possible.',
        { svg: ppcPoints(L, g[0], g[1]) });
    }),
    G('points', function () {
      var L = ppcLetters(), g = pick(GOODS2);
      return mc('points', 'Which point shows that some of the economy’s resources are unemployed?', ['W', 'X', 'Y', 'Z'], ['W', 'X', 'Y', 'Z'].indexOf(L.inside),
        'Point ' + L.inside + ' is inside the PPC. The economy could make more of both goods, so some resources are idle or used inefficiently. It is reachable, just wasteful.',
        { svg: ppcPoints(L, g[0], g[1]) });
    }),
    G('points', function () {
      var L = ppcLetters(), g = pick(GOODS2);
      return mc('points', 'Of the points where the economy uses all its resources, which one produces the most ' + g[1].toLowerCase() + '?', ['W', 'X', 'Y', 'Z'], ['W', 'X', 'Y', 'Z'].indexOf(L.lo),
        'Only points on the curve use all resources fully. Of the two on the curve, ' + L.lo + ' is further along the ' + g[1].toLowerCase() + ' axis. ' + L.inside + ' leaves resources idle and ' + L.outside + ' cannot be reached.',
        { svg: ppcPoints(L, g[0], g[1]) });
    }),
    G('points', function () {
      var L = ppcLetters(), g = pick(GOODS2), opts = ['W', 'X', 'Y', 'Z'];
      return mu('points', 'Which points show the economy’s resources being fully employed? Select all that apply.', opts, [opts.indexOf(L.hi), opts.indexOf(L.lo)],
        'Points on the PPC (' + L.hi + ' and ' + L.lo + ') use all resources fully. ' + L.inside + ' is inside the curve (unemployed resources) and ' + L.outside + ' is outside it (unattainable).',
        { svg: ppcPoints(L, g[0], g[1]) });
    }),
    G('shifts', function () {
      var out = Math.random() < 0.5, g = pick(GOODS2);
      var pos = sample(['Better technology in factories', 'More investment in machinery', 'A rise in labour productivity', 'More workers arriving from abroad'], 1)[0];
      var neg = sample(['Oil reserves running out', 'Skilled workers emigrating', 'A natural disaster destroying factories'], 1)[0];
      var opts = [pos, neg, 'More unemployment of existing workers', 'Making more of one good and less of the other'];
      return mc('shifts', 'The economy moves from PPC1 to PPC2. Which of these could explain this?', opts, out ? 0 : 1,
        out ? 'PPC2 is outside PPC1, so productive capacity has grown (positive growth). ' + pos + ' increases what the economy can make.' : 'PPC2 is inside PPC1, so productive capacity has fallen (negative growth). ' + neg + ' reduces the resources available.',
        { svg: ppcTwo(out, g[0], g[1]) });
    }),
    G('shifts', function () {
      var e = pick(PPC_EVENTS);
      var opts = ['An outward shift of the PPC', 'An inward shift of the PPC', 'A movement along the PPC', 'A move from inside the PPC towards it'];
      var whys = ['This adds to the economy’s resources or how much they can produce, so the whole curve shifts outwards (positive growth).',
        'This reduces the resources available, so the whole curve shifts inwards (negative growth).',
        'Resources are reallocated between the goods but the total capacity is unchanged, so the economy moves along the existing curve.',
        'No new capacity is created; idle resources are put back to work, so the economy moves from inside the curve towards it.'];
      return mc('shifts', 'In ' + pick(COUNTRIES) + ', ' + e[0] + '. How is this best shown on the country’s PPC?', opts, e[1], whys[e[1]]);
    }),
    mc('ppc-meaning', 'What does a point on a production possibility curve show?',
      ['The most output possible when all resources are fully used', 'The output that the government thinks all firms should make', 'An output that cannot be reached with current resources', 'An output where some resources are unemployed'], 0,
      'Points on the PPC are maximum combinations of the two goods when every resource is used fully and efficiently.'),
    mc('ppc-meaning', 'What does a point inside the PPC mean?',
      ['Some resources are unemployed or used inefficiently', 'The output cannot be reached with current resources', 'The economy has just experienced economic growth', 'Every resource is fully and efficiently employed'], 0,
      'Inside the curve the economy could make more of both goods, so resources are being wasted. The point can be reached, unlike one outside the curve.'),
    mc('ppc-meaning', 'Why can an economy not produce at a point outside its PPC today?',
      ['It lacks the resources and technology to make that much', 'Its government has banned that level of output', 'Consumers do not want that much of either good', 'Producers would make a loss at that output'], 0,
      'The PPC shows the limit of what current resources can make. Beyond it, more resources or better technology would be needed.'),
    mc('ppc-meaning', 'Which statement about a point inside the PPC is correct?',
      ['It can be reached, but some resources are wasted', 'It cannot be reached with current resources', 'It shows the economy at full employment', 'It shows positive economic growth'], 0,
      'A common mistake is to call an inside point impossible. It is possible, but it means idle resources such as unemployed workers.'),
    mc('ppc-meaning', 'A PPC is drawn for Tarsia, which makes food and clothing. What does the curve itself show?',
      ['Every maximum combination of food and clothing it can make', 'The prices of food and clothing in Tarsia', 'How much food and clothing consumers in Tarsia demand each year', 'The profit made by food and clothing firms'], 0,
      'A PPC shows the most of two goods an economy can produce with all its resources fully employed. It does not show prices, demand or profit.'),
    mc('ppc-meaning', 'An economy moves along its PPC from a point with more food to a point with more clothing. What does this show?',
      ['More clothing is made, at the cost of less food', 'More of both goods is made than before', 'The economy has suffered negative growth', 'Some resources have become unemployed'], 0,
      'Moving along the curve means switching resources between goods. Extra clothing requires giving up some food: the opportunity cost.'),
    mc('shifts', 'What does an outward shift of a PPC show?',
      ['Positive economic growth', 'Negative economic growth', 'A rise in unemployment', 'A movement along the curve'], 0,
      'An outward shift means the economy can now make more of both goods, so its productive capacity has grown.'),
    mc('shifts', 'What does an inward shift of a PPC show?',
      ['Negative economic growth', 'Positive economic growth', 'Full employment of resources', 'Higher productivity'], 0,
      'An inward shift means the economy can make less of both goods than before, so its productive capacity has fallen.'),
    mu('causes', 'Which of these could shift a country’s PPC outwards? Select all that apply.',
      ['Better technology', 'More investment in machinery', 'Skilled workers moving into the country', 'A rise in unemployment', 'An earthquake destroying factories'], [0, 1, 2],
      'Technology, investment and more skilled workers raise productive capacity. Unemployment moves the economy inside the curve, and destroyed factories shift it inwards.'),
    mu('causes', 'Which of these could shift a country’s PPC inwards? Select all that apply.',
      ['Skilled workers emigrating', 'Oil reserves running out', 'Floods destroying farmland', 'A new national training scheme', 'The discovery of a new gas field'], [0, 1, 2],
      'Losing workers, natural resources or land reduces capacity. Training and new gas reserves would increase it.'),
    mc('causes', 'Which of these is most likely to cause economic growth?',
      ['A rise in productivity', 'A rise in unemployment', 'A fall in investment', 'A fall in the number of workers'], 0,
      'Higher productivity means more output from the same resources, shifting the PPC outwards. The other options would reduce output or capacity.'),
    mc('causes', 'Which change would move an economy from a point inside its PPC to a point on it, rather than shift the curve?',
      ['Unemployed workers finding jobs', 'New technology raising output per worker', 'The discovery of new mineral reserves', 'Skilled workers leaving the country'], 0,
      'Putting idle resources back to work uses existing capacity more fully. Technology and new reserves shift the curve out; emigration shifts it in.'),
    mc('capital-consumer', 'Why might producing more capital goods today shift the PPC outwards in the future?',
      ['More machines raise the economy’s future productive capacity', 'Capital goods are always cheaper to make than any consumer goods', 'Consumers prefer capital goods to consumer goods', 'Capital goods do not use any scarce resources'], 0,
      'Capital goods such as machines and buildings are used to make other goods, so investing in them now increases what the economy can produce later.'),
    mc('capital-consumer', 'An economy on its PPC decides to make more capital goods this year. What is the opportunity cost?',
      ['Fewer consumer goods available this year', 'More consumer goods available this year', 'An inward shift of the PPC', 'Higher unemployment this year'], 0,
      'On the curve, more of one good means less of the other. The consumer goods given up are the opportunity cost.'),
    mc('capital-consumer', 'Complete the chain: “Marenko moves along its PPC to make more capital goods, so its factories gain new machines, so …”',
      ['its PPC is likely to shift outwards in future', 'its PPC immediately shifts inwards', 'it moves to a point inside its PPC', 'it can make more consumer goods this year'], 0,
      'New machines raise productive capacity, so in later years the economy can make more of both goods: the PPC shifts out.'),
    mc('shifts', 'A hurricane destroys roads and factories across Caldoria. How is this shown on its PPC?',
      ['The PPC shifts inwards', 'The PPC shifts outwards', 'The economy moves along its PPC', 'A point appears outside the PPC'], 0,
      'Destroyed capital reduces the economy’s productive capacity, so it can make less of both goods: an inward shift (negative growth).')
  ] };

  // =====================================================================
  // ECO-T11-04 Draw a PPC showing a movement or shift
  // =====================================================================
  var PAIRS = [['Kites', 'Yo-yos'], ['Mugs', 'Plates'], ['Jackets', 'Scarves'], ['Bread', 'Cakes'], ['Pens', 'Pencils'], ['Sofas', 'Beds'], ['Bikes', 'Scooters']];

  B['ECO-T11-04'] = { title: 'Draw a PPC showing a movement or shift', items: [
    G('show-movement', function () {
      var g = pick(PAIRS), upX = Math.random() < 0.5, good = upX ? g[1] : g[0];
      var kinds = [upX ? 'moveX' : 'moveY', upX ? 'moveY' : 'moveX', 'moveIn', 'out'], order = shuffle([0, 1, 2, 3]);
      return mc('show-movement', 'A firm can make ' + g[0].toLowerCase() + ' and/or ' + g[1].toLowerCase() + '. Which diagram correctly shows the firm increasing production of ' + good.toLowerCase() + '?', DIAG.slice(), order.indexOf(0),
        'Production of ' + good.toLowerCase() + ' rises, so B must be further along the curve towards the ' + good.toLowerCase() + ' axis, with less of the other good. Diagram ' + (order.indexOf(0) + 1) + ' shows this; a point inside the curve or a new curve is not a movement along the PPC.',
        { svg: fourPanels(order.map(function (i) { return kinds[i]; }), g[0], g[1], 'Four production possibility diagrams labelled Diagram 1 to Diagram 4') });
    }),
    G('show-growth', function () {
      var g = pick(PAIRS), kinds = ['out', 'in', 'moveX', 'moveIn'], order = shuffle([0, 1, 2, 3]);
      return mc('show-growth', 'Which diagram correctly shows an economy experiencing positive economic growth?', DIAG.slice(), order.indexOf(0),
        'Positive growth is a shift of the whole curve away from the origin: PPC2 outside PPC1. Diagram ' + (order.indexOf(0) + 1) + ' shows this. PPC2 inside PPC1 would be negative growth, and a move between points is not growth.',
        { svg: fourPanels(order.map(function (i) { return kinds[i]; }), g[0], g[1], 'Four production possibility diagrams labelled Diagram 1 to Diagram 4') });
    }),
    G('read-drawing', function () {
      var g = pick(PAIRS), k = pick(['moveX', 'moveY', 'out', 'in']);
      var opts = ['More ' + g[1].toLowerCase() + ' and fewer ' + g[0].toLowerCase(), 'More ' + g[0].toLowerCase() + ' and fewer ' + g[1].toLowerCase(), 'Positive economic growth', 'Negative economic growth'];
      var ans = { moveX: 0, moveY: 1, out: 2, 'in': 3 }[k];
      var whys = ['B is further along the curve towards the ' + g[1].toLowerCase() + ' axis, so ' + g[1].toLowerCase() + ' rise and ' + g[0].toLowerCase() + ' fall.',
        'B is further up the curve towards the ' + g[0].toLowerCase() + ' axis, so ' + g[0].toLowerCase() + ' rise and ' + g[1].toLowerCase() + ' fall.',
        'PPC2 lies outside PPC1, so the economy can now make more of both goods.', 'PPC2 lies inside PPC1, so the economy can now make less of both goods.'];
      return mc('read-drawing', 'What does this diagram show?', opts, ans, whys[ans], { svg: svg(166, 146, 'A production possibility diagram', miniPanel(4, 2, k, g[0], g[1], 1).replace(/<text[^>]*>Diagram 1<\/text>/, '')) });
    }),
    G('spot-error', function () {
      var g = pick(PAIRS), v = pick([
        { k: 'moveIn', task: 'show an increase in production of ' + g[1].toLowerCase(), ans: 0 },
        { k: 'out', task: 'show an increase in production of ' + g[1].toLowerCase(), ans: 1 },
        { k: 'in', task: 'show positive economic growth', ans: 2 },
        { k: 'moveY', task: 'show an increase in production of ' + g[1].toLowerCase(), ans: 3 }]);
      var opts = ['B is inside the curve, so it is not a full-employment point', 'A new curve is drawn instead of a movement along the PPC', 'PPC2 is inside PPC1, which shows negative growth', 'B shows fewer ' + g[1].toLowerCase() + ', not more'];
      return mc('spot-error', 'A student was asked to ' + v.task + '. What is wrong with this drawing?', opts, v.ans,
        ['To show a change in production on the PPC, B must be on the curve; a point inside means some resources are unemployed.', 'Increasing one good with the same resources is a movement along the existing curve, not a shift.', 'Positive growth needs the new curve outside the old one, away from the origin.', 'The arrow moves towards the ' + g[0].toLowerCase() + ' axis, so ' + g[1].toLowerCase() + ' fall. B should be further towards the ' + g[1].toLowerCase() + ' axis.'][v.ans],
        { svg: svg(166, 146, 'A student’s production possibility diagram', miniPanel(4, 2, v.k, g[0], g[1], 1).replace(/<text[^>]*>Diagram 1<\/text>/, '')) });
    }),
    G('axes-curve', function () {
      var g = pick(PAIRS), a = pick([200, 300, 400, 500, 600]), b = pick([150, 250, 350, 450]);
      return mc('axes-curve', 'A workshop can make at most ' + a + ' ' + g[0].toLowerCase() + ' a week if it makes only ' + g[0].toLowerCase() + ', or at most ' + b + ' ' + g[1].toLowerCase() + ' if it makes only ' + g[1].toLowerCase() + '. Where should its PPC meet the axes?',
        ['At ' + a + ' on the ' + g[0].toLowerCase() + ' axis and ' + b + ' on the ' + g[1].toLowerCase() + ' axis', 'At ' + b + ' on the ' + g[0].toLowerCase() + ' axis and ' + a + ' on the ' + g[1].toLowerCase() + ' axis', 'At ' + (a + b) + ' on both axes', 'At the origin on both axes'], 0,
        'Each end of the PPC shows the most of one good when nothing of the other is made, so the curve meets the ' + g[0].toLowerCase() + ' axis at ' + a + ' and the ' + g[1].toLowerCase() + ' axis at ' + b + '.');
    }),
    G('axes-curve', function () {
      var g = pick(PAIRS);
      return mc('axes-curve', 'How should the axes be labelled on a PPC for a firm that can make ' + g[0].toLowerCase() + ' and/or ' + g[1].toLowerCase() + '?',
        [g[0] + ' on one axis and ' + g[1].toLowerCase() + ' on the other', 'Price on one axis and quantity on the other', 'Cost on one axis and output on the other', 'Time on one axis and profit on the other'], 0,
        'A PPC compares two goods, so each axis shows the quantity of one of them. Price and quantity axes belong to a demand and supply diagram.');
    }),
    mc('axes-curve', 'What shape should a PPC be drawn?',
      ['A curve bowed outwards from the origin, meeting both axes', 'A straight line sloping upwards from the origin', 'A curve bowed inwards towards the origin', 'A horizontal line across the middle of the diagram'], 0,
      'A PPC is drawn concave to the origin (bowed outwards) and touches both axes.'),
    mc('axes-curve', 'Why does the PPC touch both axes?',
      ['Each end shows the most of one good if none of the other is made', 'Every economy must make some of both goods', 'The two axes show the market prices that are charged for both goods', 'The curve must start at the origin'], 0,
      'Where the curve meets an axis, all resources are used to make just that one good.'),
    mc('show-movement', 'To show production of the good on the horizontal axis increasing, where should point B be placed?',
      ['On the curve, further towards the horizontal axis than A', 'On a new curve drawn outside the first curve', 'Inside the curve, below and to the left of A', 'On the curve, further towards the vertical axis than A'], 0,
      'More of the horizontal-axis good means moving along the curve towards that axis. B then has more of that good and less of the other.'),
    mc('show-movement', 'On a PPC, point B shows more of one good than point A. What must also be true of B if both are on the curve?',
      ['It shows less of the other good', 'It shows more of the other good', 'It shows the same amount of the other good', 'It shows unemployed resources'], 0,
      'Both points use all resources fully, so making more of one good means giving up some of the other.'),
    mc('show-movement', 'Why are dashed lines drawn from points A and B to both axes?',
      ['To show the change in the quantity of each good', 'To show where the PPC meets the axes', 'To show the price of each good', 'To show the new curve after growth'], 0,
      'The dashed lines let the examiner read off how much of each good is made at A and at B, so the increase and the decrease are clear.'),
    mc('show-movement', 'A student draws a second curve when asked to show only an increase in production of one good. What is wrong?',
      ['A movement along the existing curve was needed', 'The second curve should be drawn inside the first', 'The axes should be price and quantity', 'The curve should be a straight line'], 0,
      'Using the same resources to make more of one good is a movement along the PPC. A new curve shows growth, which was not asked for.'),
    mc('show-movement', 'Which way should the arrow on a PPC movement point?',
      ['From the old point A to the new point B', 'From the new point B to the old point A', 'From the origin to point B', 'From point A to the origin'], 0,
      'The arrow shows the direction of the change, from the starting combination A to the new combination B.'),
    mc('show-growth', 'To show economic growth on a PPC diagram, what should be drawn?',
      ['A second curve further from the origin, labelled PPC2', 'A second point inside the first curve, labelled B', 'An arrow along the first curve, from A to B', 'A second curve drawn nearer to the origin, labelled PPC2'], 0,
      'Growth means the economy can make more of both goods, so the new curve lies outside the old one. Label the old PPC1 and the new PPC2.'),
    mc('show-growth', 'How should the two curves be labelled when showing positive economic growth?',
      ['PPC1 on the inner curve and PPC2 on the outer curve', 'PPC1 on the outer curve and PPC2 on the inner curve', 'D on the inner curve and S on the outer curve', 'No labels are needed on either curve'], 0,
      'PPC1 is the starting curve and PPC2 the new one. For positive growth the new curve is further out, so PPC2 is the outer curve.'),
    mc('show-growth', 'To show negative economic growth, where should PPC2 be drawn?',
      ['Inside PPC1, nearer the origin', 'Outside PPC1, further from the origin', 'On top of PPC1', 'As a straight line through PPC1'], 0,
      'Negative growth means less of both goods can be made, so the new curve is drawn closer to the origin than the old one.'),
    mc('show-growth', 'A firm buys new machines that let it make more of both of its products. How should this be drawn?',
      ['A new curve PPC2 outside the original PPC1', 'A move from point A to point B along PPC1', 'A new curve PPC2 inside the original PPC1', 'A point B marked inside the original PPC1'], 0,
      'More capacity to make both goods is growth, so the whole curve shifts away from the origin. A move along the curve would mean more of one good and less of the other.'),
    mu('marks', 'A question asks you to draw a PPC for a firm making bags and/or belts and to show an increase in belt production. Which features earn marks? Select all that apply.',
      ['Both axes labelled with the two goods', 'A decrease in bags shown on the curve', 'An increase in belts shown on the curve', 'A second curve drawn outside the first', 'Price written on the vertical axis'], [0, 1, 2],
      'The marks are for a PPC with correctly labelled axes, the fall in the other good and the rise in the named good. A second curve or a price axis would be wrong here.'),
    mu('marks', 'A question asks you to show an economy moving from PPC1 to PPC2 after positive growth. Which features earn marks? Select all that apply.',
      ['Correctly labelled axes', 'PPC1 drawn closer to the axes than PPC2', 'PPC2 drawn outside PPC1', 'A point marked inside PPC1', 'An arrow along PPC1 from A to B'], [0, 1, 2],
      'The marks are for labelled axes and two curves in the right positions: PPC1 nearer the origin, PPC2 further out. Points and arrows along the curve are not needed.'),
    mc('marks', 'A student draws a correct PPC with A and B on the curve but leaves the axes unlabelled. What is the most likely result?',
      ['The mark for labelled axes is lost', 'All the marks are lost', 'No marks are lost at all', 'Only the mark for the arrow is lost'], 0,
      'Each feature is marked separately. Correct points still earn their marks, but the axes mark needs the two goods named.'),
    mc('spot-error', 'Which of these drawings would be marked as a correctly drawn PPC?',
      ['A smooth curve bowed outwards between the two axes', 'A straight line from the origin to the top right', 'A curve bowed in towards the origin', 'A circle drawn in the middle of the axes'], 0,
      'The PPC is a smooth curve, concave to the origin, joining a point on each axis.'),
    mc('spot-error', 'Point B is drawn inside the PPC to show more of one good. Why is this wrong?',
      ['B inside the curve shows unemployed resources', 'Points inside the curve cannot be drawn at all', 'Point B should be drawn on a demand curve', 'Point B must always be on an axis'], 0,
      'A movement along the PPC keeps resources fully employed. A point inside the curve shows idle resources instead.')
  ] };

  // =====================================================================
  // ECO-CALC-01 Opportunity cost from a PPC diagram
  // =====================================================================
  // Concave schedule: x = 0, s, ..., 5s; y falls by increasing amounts to 0.
  function sched(s, b) {
    var inc = sample([1, 2, 3, 4, 5, 6, 7, 8], 5).sort(function (p, q) { return p - q; }).map(function (k) { return k * b; });
    var y = [inc.reduce(function (p, q) { return p + q; }, 0)];
    inc.forEach(function (d) { y.push(y[y.length - 1] - d); });
    var x = [0, 1, 2, 3, 4, 5].map(function (i) { return i * s; });
    return { x: x, y: y };
  }
  var PL = ['A', 'B', 'C', 'D', 'E', 'F'];
  function schedTable(S, xg, yg) { return tbl(['Point'].concat(PL), [[xg].concat(S.x), [yg].concat(S.y)]); }
  function schedSvg(S, i, j, xg, yg) {   // curve with points i and j marked and read off
    var xm = S.x[5], ym = S.y[0];
    function px(v) { return 70 + v / xm * 220; } function py(v) { return 215 - v / ym * 170; }
    var pts = S.x.map(function (v, k) { return [px(v), py(S.y[k])]; });
    var body = smooth(pts, INK);
    [[i, 'A'], [j, 'B']].forEach(function (p) {
      var X = px(S.x[p[0]]), Y = py(S.y[p[0]]);
      body += ln(X, Y, X, 215, GREY, 1.3, true) + ln(X, Y, 70, Y, GREY, 1.3, true) + dot(X, Y, HI) + tx(X + 6, Y - 6, p[1], { bold: true, c: HI });
      body += tx(X, 231, sep(S.x[p[0]]), { size: 11, anchor: 'middle' }) + tx(66, Y + 4, sep(S.y[p[0]]), { size: 11, anchor: 'end' });
    });
    return ppcFrame(yg, xg, body, 'Production possibility curve with points A and B marked and their values shown on the axes');
  }

  B['ECO-CALC-01'] = { title: 'Opportunity cost from a PPC diagram', items: [
    G('table-x', function () {
      var S = sched(pick([20, 25, 50, 100]), pick([10, 20, 25, 50])), i = rint(1, 3), k = rint(1, Math.min(2, 5 - i)), j = i + k, oc = S.y[i] - S.y[j];
      return nm('table-x', 'The table shows points on an economy’s PPC (units).' + schedTable(S, 'Consumer goods', 'Capital goods') + 'The economy now makes ' + sep(S.x[i]) + ' units of consumer goods. Calculate the opportunity cost of making an extra ' + sep(S.x[j] - S.x[i]) + ' units of consumer goods. Give your answer in units.',
        oc, 'units', 'At ' + sep(S.x[i]) + ' consumer goods the economy makes ' + sep(S.y[i]) + ' capital goods; at ' + sep(S.x[j]) + ' it makes ' + sep(S.y[j]) + '. Opportunity cost = ' + sep(S.y[i]) + ' − ' + sep(S.y[j]) + ' = ' + sep(oc) + ' units of capital goods.');
    }),
    G('table-y', function () {
      var S = sched(pick([20, 40, 50]), pick([20, 25, 50])), j = rint(2, 4), k = rint(1, Math.min(2, j)), i = j - k, oc = S.x[j] - S.x[i];
      return nm('table-y', 'The table shows points on an economy’s PPC (units).' + schedTable(S, 'Consumer goods', 'Capital goods') + 'The economy now makes ' + sep(S.y[j]) + ' units of capital goods. Calculate the opportunity cost of making an extra ' + sep(S.y[i] - S.y[j]) + ' units of capital goods. Give your answer in units.',
        oc, 'units', 'More capital goods means moving to ' + sep(S.y[i]) + ' capital goods, where consumer goods fall from ' + sep(S.x[j]) + ' to ' + sep(S.x[i]) + '. Opportunity cost = ' + sep(S.x[j]) + ' − ' + sep(S.x[i]) + ' = ' + sep(oc) + ' units of consumer goods.');
    }),
    G('diagram', function () {
      var S = sched(pick([40, 50, 100]), pick([20, 25, 50])), i = rint(1, 2), j = i + 2, oc = S.y[i] - S.y[j];
      return nm('diagram', 'The diagram shows an economy’s PPC. It now produces at point A. Calculate the opportunity cost of moving to point B to make ' + sep(S.x[j] - S.x[i]) + ' more units of consumer goods. Give your answer in units.',
        oc, 'units', 'Read the capital goods axis: ' + sep(S.y[i]) + ' at A and ' + sep(S.y[j]) + ' at B. Opportunity cost = ' + sep(S.y[i]) + ' − ' + sep(S.y[j]) + ' = ' + sep(oc) + ' units of capital goods.',
        { svg: schedSvg(S, i, j, 'Consumer goods', 'Capital goods') });
    }),
    G('diagram', function () {
      var S = sched(pick([20, 25, 50]), pick([10, 20, 25])), j = rint(3, 4), i = j - 2, oc = S.x[j] - S.x[i];
      return nm('diagram', 'The diagram shows a country’s PPC for food and clothing (tonnes). It now produces at point B. Calculate the opportunity cost of moving to point A to make ' + sep(S.y[i] - S.y[j]) + ' more tonnes of food. Give your answer in tonnes.',
        oc, 'tonnes', 'Read the clothing axis: ' + sep(S.x[j]) + ' tonnes at B and ' + sep(S.x[i]) + ' at A. Opportunity cost = ' + sep(S.x[j]) + ' − ' + sep(S.x[i]) + ' = ' + sep(oc) + ' tonnes of clothing.',
        { svg: schedSvg(S, i, j, 'Clothing (tonnes)', 'Food (tonnes)') });
    }),
    G('table-x', function () {
      var S = sched(pick([25, 50, 100]), pick([10, 20, 50])), i = rint(0, 2), j = i + rint(2, 3), oc = S.y[i] - S.y[j];
      return nm('table-x', 'Points A to F lie on an economy’s PPC.' + schedTable(S, 'Cars', 'Tractors') + 'Calculate the opportunity cost of moving from point ' + PL[i] + ' to point ' + PL[j] + '. Give your answer in units.',
        oc, 'units', 'From ' + PL[i] + ' to ' + PL[j] + ' car output rises, so tractors are given up: ' + sep(S.y[i]) + ' − ' + sep(S.y[j]) + ' = ' + sep(oc) + ' tractors.');
    }),
    G('working', function () {
      var S = sched(pick([20, 40, 50]), pick([20, 25, 50])), i = rint(1, 3), j = i + 1, oc = S.y[i] - S.y[j], dx = S.x[j] - S.x[i];
      var opts = [sep(oc) + ' units of capital goods'], cands = [sep(dx) + ' units of consumer goods', sep(S.y[j]) + ' units of capital goods', sep(oc) + ' units of consumer goods', sep(S.y[i]) + ' units of capital goods', sep(oc + dx) + ' units of capital goods'];
      cands.forEach(function (c) { if (opts.length < 4 && opts.indexOf(c) < 0) opts.push(c); });
      return mc('working', 'Using the table, what is the opportunity cost of increasing consumer goods from ' + sep(S.x[i]) + ' to ' + sep(S.x[j]) + ' units?' + schedTable(S, 'Consumer goods', 'Capital goods'), opts, 0,
        'Capital goods fall from ' + sep(S.y[i]) + ' to ' + sep(S.y[j]) + ', so ' + sep(oc) + ' units of capital goods are given up. ' + sep(dx) + ' is the increase in consumer goods, and ' + sep(S.y[j]) + ' is just the new reading.');
    }),
    G('working', function () {
      var S = sched(pick([25, 50]), pick([20, 50])), i = rint(1, 2), j = i + 2, oc = S.y[i] - S.y[j];
      var opts = [sep(S.y[i]) + ' − ' + sep(S.y[j]), sep(S.x[j]) + ' − ' + sep(S.x[i]), sep(S.y[i]) + ' + ' + sep(S.y[j]), sep(S.y[j]) + ' − ' + sep(S.y[i])];
      return mc('working', 'An economy makes ' + sep(S.x[i]) + ' consumer goods and ' + sep(S.y[i]) + ' capital goods. Moving along its PPC, it raises consumer goods to ' + sep(S.x[j]) + ' and capital goods fall to ' + sep(S.y[j]) + '. Which calculation gives the opportunity cost?', opts, 0,
        'Opportunity cost is the fall in the good given up: ' + sep(S.y[i]) + ' − ' + sep(S.y[j]) + ' = ' + sep(oc) + ' units of capital goods. Subtracting the consumer goods gives the gain, not the cost.');
    }),
    G('reverse', function () {
      var S = sched(pick([20, 50]), pick([10, 25, 50])), i = rint(1, 3), oc = S.y[i] - S.y[i + 1];
      return nm('reverse', 'An economy makes ' + sep(S.y[i]) + ' units of capital goods. The opportunity cost of making ' + sep(S.x[i + 1] - S.x[i]) + ' more consumer goods is ' + sep(oc) + ' units of capital goods. How many units of capital goods will it now make?',
        S.y[i + 1], 'units', 'The opportunity cost is the capital goods given up, so new output = ' + sep(S.y[i]) + ' − ' + sep(oc) + ' = ' + sep(S.y[i + 1]) + ' units.');
    }),
    G('contexts', function () {
      var S = sched(pick([10, 20]), pick([10, 15, 20])), i = rint(1, 3), oc = S.y[i] - S.y[i + 1];
      return nm('contexts', 'Bramble Bakery can make these daily combinations of loaves and cakes with its staff and ovens.' + schedTable(S, 'Cakes', 'Loaves') + 'It now bakes ' + S.x[i] + ' cakes a day. What is the opportunity cost, in loaves, of baking ' + (S.x[i + 1] - S.x[i]) + ' more cakes a day?',
        oc, 'loaves', 'At ' + S.x[i] + ' cakes it bakes ' + S.y[i] + ' loaves; at ' + S.x[i + 1] + ' cakes it bakes ' + S.y[i + 1] + '. Opportunity cost = ' + S.y[i] + ' − ' + S.y[i + 1] + ' = ' + oc + ' loaves.');
    }),
    G('contexts', function () {
      var S = sched(1, pick([2, 3])), i = rint(2, 3), oc = S.y[i] - S.y[i + 1], c = pick(COUNTRIES);
      return nm('contexts', 'With its building budget, the government of ' + c + ' can build these combinations of schools and clinics this year.' + schedTable(S, 'Schools', 'Clinics') + 'It plans ' + S.x[i] + ' schools. What is the opportunity cost of building one more school?',
        oc, 'clinics', 'At ' + S.x[i] + ' schools it can build ' + S.y[i] + ' clinics; at ' + (S.x[i] + 1) + ' schools only ' + S.y[i + 1] + '. Opportunity cost = ' + S.y[i] + ' − ' + S.y[i + 1] + ' = ' + oc + ' clinics.');
    }),
    G('working', function () {
      var S = sched(pick([25, 50, 100]), pick([20, 25])), i = rint(0, 3), j = i + 1, oc = S.y[i] - S.y[j];
      var moves = [[i, j]];
      for (var k = 0; k < 5 && moves.length < 4; k++) { if (k !== i && S.y[k] - S.y[k + 1] !== oc) moves.push([k, k + 1]); }
      var opts = moves.map(function (m) { return PL[m[0]] + ' to ' + PL[m[1]]; });
      return mc('working', 'Points A to F lie on an economy’s PPC.' + schedTable(S, 'Consumer goods', 'Capital goods') + 'Which move along the PPC has an opportunity cost of ' + sep(oc) + ' units of capital goods?', opts, 0,
        'From ' + PL[i] + ' to ' + PL[j] + ' capital goods fall from ' + sep(S.y[i]) + ' to ' + sep(S.y[j]) + ', which is ' + sep(oc) + ' units given up. Each other move gives up a different amount.');
    }),
    G('table-y', function () {
      var S = sched(pick([50, 100]), pick([25, 50])), j = 5, i = j - rint(1, 2), oc = S.x[j] - S.x[i];
      return nm('table-y', 'An economy makes only consumer goods, as shown at point F in the table.' + schedTable(S, 'Consumer goods', 'Capital goods') + 'What is the opportunity cost of moving to point ' + PL[i] + ' so that it makes ' + sep(S.y[i]) + ' units of capital goods?',
        oc, 'units', 'Consumer goods fall from ' + sep(S.x[j]) + ' at F to ' + sep(S.x[i]) + ' at ' + PL[i] + ': ' + sep(S.x[j]) + ' − ' + sep(S.x[i]) + ' = ' + sep(oc) + ' units of consumer goods given up.');
    }),
    G('table-x', function () {
      var S = sched(pick([20, 50]), pick([20, 25, 50])), oc = S.y[0] - S.y[2];
      return nm('table-x', 'An economy makes only capital goods, as shown at point A.' + schedTable(S, 'Consumer goods', 'Capital goods') + 'It decides to start making consumer goods and moves to point C. What is the opportunity cost of this decision, in units of capital goods?',
        oc, 'units', 'Capital goods fall from ' + sep(S.y[0]) + ' at A to ' + sep(S.y[2]) + ' at C: ' + sep(S.y[0]) + ' − ' + sep(S.y[2]) + ' = ' + sep(oc) + ' units given up.');
    }),
    G('two-step', function () {
      var S = sched(pick([20, 25, 50]), pick([10, 20, 25])), i = rint(0, 2), o1 = S.y[i] - S.y[i + 1], o2 = S.y[i + 1] - S.y[i + 2];
      return nm('two-step', 'A firm on its PPC first moves from point ' + PL[i] + ' to point ' + PL[i + 1] + ', then from ' + PL[i + 1] + ' to ' + PL[i + 2] + '.' + schedTable(S, 'Phones', 'Tablets') + 'What is the total opportunity cost of the two moves, in tablets?',
        o1 + o2, 'tablets', 'The two moves give up ' + sep(o1) + ' and ' + sep(o2) + ' tablets: ' + sep(o1) + ' + ' + sep(o2) + ' = ' + sep(o1 + o2) + ', the same as ' + sep(S.y[i]) + ' − ' + sep(S.y[i + 2]) + '.');
    }),
    nm('diagram', 'An economy moves along its PPC from point A (200 consumer goods, 600 capital goods) to point B (260 consumer goods, 540 capital goods). What is the opportunity cost of the extra 60 consumer goods, in units of capital goods?',
      60, 'units', 'Capital goods fall from 600 to 540: 600 − 540 = 60 units of capital goods. Here the gain and the sacrifice happen to be the same size.'),
    mc('concept', 'When an economy on its PPC makes more consumer goods, how is the opportunity cost measured?',
      ['In units of capital goods given up', 'In units of consumer goods gained', 'In dollars spent on consumer goods', 'In the number of workers employed'], 0,
      'Opportunity cost on a PPC is the quantity of the other good that is sacrificed, so it is measured in units of capital goods.'),
    mc('concept', 'Why is opportunity cost on a PPC not measured in money?',
      ['It is the quantity of the other good that is sacrificed', 'Money is not used in economies with a PPC', 'The PPC shows prices only on the vertical axis', 'Goods on a PPC are always given away free'], 0,
      'The PPC shows quantities of two goods. The cost of making more of one is the amount of the other given up, counted in its own units.'),
    mc('concept', 'An economy produces at a point inside its PPC. Unemployed workers find jobs and it moves to a point on the curve with more of both goods. What is the opportunity cost?',
      ['Zero, because no good is given up', 'The extra consumer goods produced', 'The extra capital goods produced', 'The wages paid to the new workers'], 0,
      'Moving from inside the curve uses idle resources, so more of both goods can be made without sacrificing either. There is no opportunity cost.'),
    mc('concept', 'A student subtracts the two amounts of consumer goods after consumer goods increased. What has she found?',
      ['The increase in consumer goods, not the opportunity cost', 'The opportunity cost in units of capital goods', 'The fall in capital goods production', 'The total output of the economy'], 0,
      'Subtracting the good that increased gives the gain. The opportunity cost comes from subtracting the readings of the good given up.'),
    mc('concept', 'A student writes only “OC = old amount − new amount” with no numbers. How is this likely to be marked?',
      ['It earns no marks, because a formula alone is not credited', 'It earns full marks for knowing the method', 'It earns one mark for the correct formula', 'It earns marks only if the units are given'], 0,
      'Calculation marks need the actual readings, such as 480 − 420, and the answer with its unit. A formula on its own is not credited.'),
    mc('concept', 'On a PPC, moving to make more of one good always means what?',
      ['Less of the other good is made', 'More of the other good is made', 'The PPC shifts outwards', 'Some resources become unemployed'], 0,
      'Points on the PPC already use all resources, so more of one good requires taking resources from the other good.'),
    mc('concept', 'An economy on its PPC raises consumer goods output and capital goods fall from 520 to 440. Which is the best written answer for the opportunity cost?',
      ['80 units of capital goods', '80 units of consumer goods', '$80 of capital goods', '440 units of capital goods'], 0,
      '520 − 440 = 80, and the good given up is capital goods, so the full answer is 80 units of capital goods. It is a quantity, not money, and 440 is only the new reading.')
  ] };

  // =====================================================================
  // Shared market data helpers
  // =====================================================================
  // Five-row schedule with equilibrium at row k: Qd falls by a per row, Qs rises by b per row.
  function mktSched() {
    var a = pick([10, 20, 25, 50]), b = pick([10, 20, 25, 50]), k = rint(1, 3);
    var Qe = Math.max(4 * a, 4 * b) + rint(2, 12) * 10;
    var st = pick([[0.5, [1, 1.5, 2, 2.5]], [1, [2, 3, 4, 5]], [2, [4, 6, 8, 10]], [5, [10, 15, 20, 25]]]), step = st[0], base = pick(st[1]);
    var p = [], qd = [], qs = [];
    for (var i = 0; i < 5; i++) { p.push(base + i * step); qd.push(Qe + (k - i) * a); qs.push(Qe + (i - k) * b); }
    return { p: p, qd: qd, qs: qs, k: k, a: a, b: b, step: step };
  }
  function schedTbl(M, good, unit) {
    return tbl(['Price ($)', 'Quantity demanded (' + unit + ')', 'Quantity supplied (' + unit + ')'], M.p.map(function (v, i) { return [v.toFixed(2), sep(M.qd[i]), sep(M.qs[i])]; }));
  }
  // Demand p = 10 - q, supply p = q (unit coordinates); a horizontal price line at p0 with the two quantities read off.
  function excessSvg(p0, pk, qk, showEq) {
    var qd = 10 - p0, qs = p0, body = dLine(0, 'D') + sLine(0, 'S');
    body += ln(60, GY(p0), GX(Math.max(qd, qs)) + 10, GY(p0), HI, 1.8, true);
    var g = [[qd, p0], [qs, p0]];
    var xt = [[qd, sep(qd * qk)], [qs, sep(qs * qk)]], yt = [[p0, '$' + sep(p0 * pk)]];
    if (showEq) { yt.push([5, '$' + sep(5 * pk)]); }
    return graph({ yl: 'Price ($)', xl: 'Quantity', body: body, guides: g, xt: xt, yt: yt, label: 'Demand and supply diagram with a horizontal line at one price and the quantities demanded and supplied marked' });
  }

  // =====================================================================
  // ECO-T11-07 Demand, supply and movements along the curves
  // =====================================================================
  var GOODS = ['pears', 'bus tickets', 'notebooks', 'bananas', 'cinema tickets', 'bottled water', 'phone cases', 'potatoes', 'rice', 'bicycles'];

  B['ECO-T11-07'] = { title: 'Demand, supply and movements along the curves', items: [
    mc('definitions', 'What is meant by the term demand?',
      ['The quantity consumers are willing and able to buy at a given price', 'The quantity consumers would like to have, whatever the price', 'The quantity producers are willing and able to sell at a given price', 'The total amount of money that consumers spend on a good'], 0,
      'Demand needs both parts: consumers must be willing <i>and able</i> to buy, and the quantity is linked to a given price over a period of time.'),
    mc('definitions', 'What is meant by the term supply?',
      ['The quantity producers are willing and able to sell at a given price', 'The quantity of a good that exists in the whole world', 'The quantity consumers are willing and able to buy at a given price', 'The number of firms that make a good in a market'], 0,
      'Supply is the quantity producers are willing and able to sell, linked to a given price (over a given period of time).'),
    mu('definitions', 'A student is asked what is meant by demand. Which two ideas must the answer include for full marks? Select all that apply.',
      ['Consumers are willing and able to buy', 'The quantity is at a given price', 'Consumers want or wish for the good', 'Producers are willing to sell the good', 'Consumers have money saved in a bank'], [0, 1],
      'The two marks are for “willing and able to buy” and “at a given price”. Simply wanting a good is not enough, because the consumer must also be able to pay.'),
    mc('definitions', 'Why is “the amount of a good people want” not a full definition of demand?',
      ['It leaves out being able to pay and the link to price', 'It should refer to producers rather than consumers', 'Demand only refers to services, not goods', 'Demand is measured in money, not quantity'], 0,
      'Effective demand needs willingness <i>and</i> ability to buy, and it is the quantity at a given price.'),
    G('movements', function () {
      var g = pick(GOODS), up = Math.random() < 0.5;
      var opts = ['An extension along the demand curve', 'A contraction along the demand curve', 'A shift of the demand curve to the right', 'A shift of the demand curve to the left'];
      return mc('movements', 'The price of ' + g + ' ' + (up ? 'rises' : 'falls') + ' and nothing else changes. What happens in the market for ' + g + '?', opts, up ? 1 : 0,
        up ? 'A higher own price lowers the quantity demanded: a contraction, which is a movement up along the existing curve. The curve itself does not shift.' : 'A lower own price raises the quantity demanded: an extension, which is a movement down along the existing curve. The curve itself does not shift.');
    }),
    G('movements', function () {
      var g = pick(GOODS), up = Math.random() < 0.5;
      var opts = ['Quantity supplied rises along the supply curve', 'Quantity supplied falls along the supply curve', 'The supply curve shifts to the right', 'The supply curve shifts to the left'];
      return mc('movements', 'The market price of ' + g + ' ' + (up ? 'rises' : 'falls') + '. What happens to the quantity of ' + g + ' supplied?', opts, up ? 0 : 1,
        up ? 'A higher price makes supplying more profitable, so producers offer more: a movement up along the supply curve, not a shift.' : 'A lower price makes supplying less profitable, so producers offer less: a movement down along the supply curve, not a shift.');
    }),
    G('read-graph', function () {
      var pk = pick([1, 2, 5]), qk = pick([10, 20, 50, 100]), p1 = rint(6, 8), p2 = p1 - rint(2, 3), q1 = 10 - p1, q2 = 10 - p2;
      var body = dLine(0, 'D');
      var svgS = graph({ yl: 'Price ($)', xl: 'Quantity', body: body, guides: [[q1, p1], [q2, p2]], yt: [[p1, '$' + p1 * pk], [p2, '$' + p2 * pk]], xt: [[q1, sep(q1 * qk)], [q2, sep(q2 * qk)]], label: 'A demand curve with two prices and quantities marked' });
      var Q1 = sep(q1 * qk), Q2 = sep(q2 * qk);
      return mc('read-graph', 'Using the diagram, what happens when the price falls from $' + p1 * pk + ' to $' + p2 * pk + '?',
        ['Quantity demanded extends from ' + Q1 + ' to ' + Q2 + ' units', 'Quantity demanded contracts from ' + Q2 + ' to ' + Q1 + ' units', 'Demand shifts right from ' + Q1 + ' to ' + Q2 + ' units', 'Quantity demanded stays at ' + Q1 + ' units'], 0,
        'Reading the demand curve: at $' + p1 * pk + ' quantity demanded is ' + Q1 + '; at $' + p2 * pk + ' it is ' + Q2 + '. A fall in price causes an extension along the curve, not a shift.', { svg: svgS });
    }),
    G('read-graph', function () {
      var pk = pick([1, 2, 4]), qk = pick([10, 25, 50, 100]), p1 = rint(3, 5), p2 = p1 + rint(2, 3);
      var svgS = graph({ yl: 'Price ($)', xl: 'Quantity', body: sLine(0, 'S'), guides: [[p1, p1], [p2, p2]], yt: [[p1, '$' + p1 * pk], [p2, '$' + p2 * pk]], xt: [[p1, sep(p1 * qk)], [p2, sep(p2 * qk)]], label: 'A supply curve with two prices and quantities marked' });
      var d = (p2 - p1) * qk;
      return nm('read-graph', 'Using the supply curve, by how many units does quantity supplied rise when the price rises from $' + p1 * pk + ' to $' + p2 * pk + '?', d, 'units',
        'Quantity supplied is ' + sep(p1 * qk) + ' at $' + p1 * pk + ' and ' + sep(p2 * qk) + ' at $' + p2 * pk + ': ' + sep(p2 * qk) + ' − ' + sep(p1 * qk) + ' = ' + sep(d) + ' units. This is a movement up along the supply curve.', { svg: svgS });
    }),
    G('schedule', function () {
      var M = mktSched(), g = pick(['kilograms', 'boxes', 'tickets']), i = rint(2, 4), j = i - rint(1, 2), d = M.qd[j] - M.qd[i];
      return nm('schedule', 'The table shows a market schedule.' + schedTbl(M, '', g) + 'The price falls from $' + M.p[i].toFixed(2) + ' to $' + M.p[j].toFixed(2) + '. By how many ' + g + ' does quantity demanded extend?',
        d, g, 'At $' + M.p[i].toFixed(2) + ' quantity demanded is ' + sep(M.qd[i]) + '; at $' + M.p[j].toFixed(2) + ' it is ' + sep(M.qd[j]) + '. Extension = ' + sep(M.qd[j]) + ' − ' + sep(M.qd[i]) + ' = ' + sep(d) + ' ' + g + '.');
    }),
    G('schedule', function () {
      var M = mktSched(), i = rint(0, 4);
      return nm('schedule', 'The table shows a market schedule.' + schedTbl(M, '', 'units') + 'At what price would producers be willing and able to sell ' + sep(M.qs[i]) + ' units? Give your answer in $ to 2 decimal places.',
        M.p[i], '$', 'Read down the quantity supplied column to ' + sep(M.qs[i]) + ' units and across to the price: $' + M.p[i].toFixed(2) + '.', { tol: 0.005, display: M.p[i].toFixed(2) });
    }),
    G('plot', function () {
      var M = mktSched(), i = rint(0, 4), o = (i + 2) % 5;
      var w2 = M.qs[i] === M.qd[i] ? M.qd[o] : M.qs[i], w4 = M.qd[i] + M.qs[i];
      if (w4 === w2) w4 = M.qd[i] + 7 * M.a;
      return mc('plot', 'A student plots a demand curve from this schedule.' + schedTbl(M, '', 'units') + 'Which point should be plotted for a price of $' + M.p[i].toFixed(2) + '?',
        ['Price $' + M.p[i].toFixed(2) + ', quantity ' + sep(M.qd[i]), 'Price $' + M.p[i].toFixed(2) + ', quantity ' + sep(w2), 'Price $' + M.p[o].toFixed(2) + ', quantity ' + sep(M.qd[i]), 'Price $' + M.p[i].toFixed(2) + ', quantity ' + sep(w4)], 0,
        'A demand curve pairs each price with its quantity <i>demanded</i>. At $' + M.p[i].toFixed(2) + ' that is ' + sep(M.qd[i]) + '. The quantity supplied belongs on the supply curve.');
    }),
    mc('plot', 'When a demand curve is drawn from a demand schedule, what should it look like?',
      ['A line sloping down from left to right, labelled D', 'A line sloping up from left to right, labelled D', 'A horizontal line at the average price, labelled D', 'A vertical line at the average quantity, labelled D'], 0,
      'As price falls, quantity demanded rises, so the plotted points form a downward-sloping line. Label it D.'),
    mc('reasons', 'Why does a demand curve usually slope downwards?',
      ['At a lower price the good is cheaper compared with substitutes', 'At a lower price producers want to sell more of the good to consumers', 'At a higher price consumers have more income', 'At a higher price the good becomes more fashionable'], 0,
      'When the price falls the good becomes better value compared with alternatives, and more buyers can afford it, so quantity demanded rises.'),
    mc('reasons', 'Why does a supply curve usually slope upwards?',
      ['A higher price makes it more profitable to supply more', 'A higher price makes consumers buy more of the good', 'A lower price makes production more profitable', 'Costs of production fall as the price rises'], 0,
      'Producers aim for profit, so a higher price encourages them to offer more for sale.'),
    mc('reasons', 'The price of wheat falls. Why do farmers supply less wheat?',
      ['Supplying wheat becomes less profitable', 'Consumers demand less wheat at lower prices', 'The supply curve for wheat shifts to the left', 'The cost of growing wheat rises'], 0,
      'At a lower price each tonne earns less, so some farmers grow less or switch crops. This is a contraction along the supply curve, not a shift.'),
    mc('shift-or-move', 'Which statement is correct?',
      ['A change in a good’s own price never shifts its demand curve', 'A change in a good’s own price always shifts its demand curve', 'A rise in a good’s own price shifts its supply curve right', 'A fall in a good’s own price shifts its demand curve left'], 0,
      'A change in the good’s own price is shown by a movement along the existing curves. Shifts are caused by other factors such as income or costs.'),
    mu('shift-or-move', 'Which of these cause a movement along the demand curve for bus tickets? Select all that apply.',
      ['A rise in the bus fare', 'A cut in the bus fare', 'A rise in consumers’ incomes', 'A rise in train fares', 'An advertising campaign for buses'], [0, 1],
      'Only changes in the price of bus tickets themselves cause movements along the demand curve. Income, the price of a substitute and advertising shift the curve.'),
    mc('shift-or-move', 'A student writes: “The price of tea fell, so the demand curve for tea shifted to the right.” What should the student have written?',
      ['Quantity demanded extended along the existing curve', 'Supply of tea shifted to the right', 'Quantity demanded contracted along the same demand curve', 'Demand for tea shifted to the left'], 0,
      'A change in tea’s own price causes a movement along the demand curve. A fall in price is an extension.'),
    mc('shift-or-move', 'What is meant by a contraction in demand?',
      ['Quantity demanded falls because the good’s own price rises', 'Quantity demanded falls because consumers’ incomes have fallen', 'The demand curve shifts to the left', 'Quantity supplied falls because the price falls'], 0,
      'A contraction is a movement up along the demand curve caused by a rise in the good’s own price.'),
    mc('shift-or-move', 'What is meant by an extension in supply?',
      ['Quantity supplied rises because the good’s own price rises', 'The supply curve shifts right because costs fall', 'Quantity supplied rises because of a subsidy', 'Quantity demanded rises because the price falls'], 0,
      'An extension in supply is a movement up along the supply curve caused by a higher price. Cost changes and subsidies shift the curve.'),
    mc('movements', 'The price of mangoes rises from $2.00 to $2.40 a kilogram. What happens to the quantity of mangoes supplied?',
      ['It rises, as a movement up the supply curve', 'It falls, as a movement down the supply curve', 'It rises, as a shift of the supply curve', 'It stays the same because supply is fixed'], 0,
      'A higher price makes selling mangoes more profitable, so quantity supplied extends along the existing supply curve.'),
    mc('movements', 'A cinema cuts its ticket price from $12 to $9 on weekdays. What is the most likely effect?',
      ['Quantity demanded for weekday tickets extends', 'Demand for weekday tickets shifts to the left', 'Supply of weekday tickets shifts to the right', 'Quantity demanded for weekday tickets contracts'], 0,
      'A lower price makes tickets better value, so more are bought: an extension along the demand curve.')
  ] };

  // =====================================================================
  // ECO-T11-11 Equilibrium, excess demand and excess supply
  // =====================================================================
  B['ECO-T11-11'] = { title: 'Equilibrium, excess demand and excess supply', items: [
    mc('definitions', 'What is meant by the equilibrium price?',
      ['The price at which quantity demanded equals quantity supplied', 'The price at which producers make the most profit', 'The price that the government sets for a good', 'The price at which every consumer can afford the good'], 0,
      'At the equilibrium price the amount buyers want equals the amount sellers offer, so the market clears.'),
    mc('definitions', 'Which is the best definition of excess supply?',
      ['Quantity supplied is greater than quantity demanded at the current price', 'Quantity demanded is greater than quantity supplied at the current price', 'Supply has increased because production costs have fallen', 'Producers supply exactly the quantity that consumers demand'], 0,
      'Excess supply (a surplus) means more is offered for sale than buyers want at that price, so goods go unsold.'),
    mc('definitions', 'Which is the best definition of excess demand?',
      ['Quantity demanded is greater than quantity supplied at the current price', 'Quantity supplied is greater than quantity demanded at the current price', 'Demand has increased because incomes have risen', 'Consumers buy all the goods that are produced'], 0,
      'Excess demand (a shortage) means buyers want more than sellers offer at that price.'),
    mc('definitions', 'Excess demand is also known as which of these?',
      ['A shortage', 'A surplus', 'An equilibrium', 'A contraction'], 0,
      'When quantity demanded exceeds quantity supplied, some buyers cannot get the good: a shortage.'),
    mc('identify', 'Shops selling winter coats have large piles of unsold stock. What does this suggest?',
      ['Excess supply, because the price is above equilibrium', 'Excess demand, because the price is below equilibrium', 'Excess demand, because the price is above equilibrium', 'The market is in equilibrium'], 0,
      'Unsold goods mean quantity supplied is greater than quantity demanded, which happens when the price is above equilibrium.'),
    mc('identify', 'Fans queue overnight and tickets for a festival sell out in minutes. What does this suggest?',
      ['Excess demand, because the price is below equilibrium', 'Excess supply, because the price is above equilibrium', 'Excess supply, because the price is below equilibrium', 'The market is in equilibrium'], 0,
      'Queues and sell-outs show buyers want more than is available at that price. The price is below equilibrium, creating a shortage.'),
    mc('identify', 'When the price of a good is set above its equilibrium price, what results?',
      ['Excess supply', 'Excess demand', 'An increase in demand', 'A decrease in supply'], 0,
      'Above equilibrium, quantity supplied extends and quantity demanded contracts, so supply exceeds demand.'),
    mc('identify', 'The rent for flats in Orlavia’s capital is kept below the equilibrium level. What is the most likely result?',
      ['More people want flats than landlords offer', 'Landlords offer more flats than people want', 'The demand curve for flats shifts to the left', 'The market for flats clears with no queue'], 0,
      'A price below equilibrium makes quantity demanded greater than quantity supplied, so there is a shortage of flats.'),
    G('identify', function () {
      var above = Math.random() < 0.5, p0 = above ? rint(7, 8) : rint(2, 3), pk = pick([1, 2, 5]), qk = pick([10, 20, 50]);
      return mc('identify', 'The red dashed line shows the price in this market. What does the diagram show at that price?',
        ['Excess supply', 'Excess demand', 'Equilibrium', 'A shift of the supply curve'], above ? 0 : 1,
        above ? 'At $' + p0 * pk + ' the supply curve is further right than the demand curve: quantity supplied (' + sep(p0 * qk) + ') is greater than quantity demanded (' + sep((10 - p0) * qk) + '), so there is excess supply.' : 'At $' + p0 * pk + ' quantity demanded (' + sep((10 - p0) * qk) + ') is greater than quantity supplied (' + sep(p0 * qk) + '), so there is excess demand.',
        { svg: excessSvg(p0, pk, qk, false) });
    }),
    G('identify', function () {
      var M = mktSched(), i = pick([0, 1, 2, 3, 4].filter(function (j) { return j !== M.k; }));
      var opts = ['Excess supply', 'Excess demand', 'Equilibrium'];
      var ans = M.qs[i] > M.qd[i] ? 0 : 1;
      return mc('identify', 'The table shows the market for coconut oil.' + schedTbl(M, '', 'litres') + 'What is the situation at a price of $' + M.p[i].toFixed(2) + '?', opts, ans,
        'At $' + M.p[i].toFixed(2) + ' quantity demanded is ' + sep(M.qd[i]) + ' and quantity supplied is ' + sep(M.qs[i]) + '. ' + (ans === 0 ? 'Supply is greater, so there is excess supply.' : 'Demand is greater, so there is excess demand.'));
    }),
    G('equilibrium', function () {
      var M = mktSched();
      return nm('equilibrium', 'The table shows the market for a type of honey.' + schedTbl(M, '', 'jars') + 'What is the equilibrium price? Give your answer in $ to 2 decimal places.',
        M.p[M.k], '$', 'Equilibrium is where quantity demanded equals quantity supplied: both are ' + sep(M.qd[M.k]) + ' jars at $' + M.p[M.k].toFixed(2) + '.', { tol: 0.005, display: M.p[M.k].toFixed(2) });
    }),
    G('equilibrium', function () {
      var M = mktSched(), i = M.k + 1;
      return nm('equilibrium', 'The table shows the market for bicycle helmets.' + schedTbl(M, '', 'helmets') + 'Sellers are charging $' + M.p[i].toFixed(2) + '. Market forces push the price to equilibrium. How many helmets will then be bought and sold?',
        M.qd[M.k], 'helmets', 'At $' + M.p[i].toFixed(2) + ' there is excess supply, so the price falls to $' + M.p[M.k].toFixed(2) + ', where quantity demanded and supplied are both ' + sep(M.qd[M.k]) + ' helmets.');
    }),
    G('market-forces', function () {
      var M = mktSched(), below = Math.random() < 0.5, i = below ? M.k - 1 : M.k + 1;
      var pe = '$' + M.p[M.k].toFixed(2), pi = '$' + M.p[i].toFixed(2);
      var opts = below ? ['The price rises towards ' + pe, 'The price falls towards ' + pe, 'The price stays at ' + pi, 'The supply curve shifts right'] : ['The price falls towards ' + pe, 'The price rises towards ' + pe, 'The price stays at ' + pi, 'The demand curve shifts right'];
      return mc('market-forces', 'The table shows the market for sandwiches.' + schedTbl(M, '', 'sandwiches') + 'The current price is ' + pi + '. What will market forces do?', opts, 0,
        below ? 'At ' + pi + ' there is excess demand (' + sep(M.qd[i]) + ' demanded, ' + sep(M.qs[i]) + ' supplied), so the price is bid up until it reaches the equilibrium of ' + pe + '.' : 'At ' + pi + ' there is excess supply (' + sep(M.qs[i]) + ' supplied, ' + sep(M.qd[i]) + ' demanded), so sellers cut the price until it reaches the equilibrium of ' + pe + '.');
    }),
    mc('market-forces', 'How do market forces remove excess supply?',
      ['Sellers cut the price; quantity demanded extends and quantity supplied contracts', 'Sellers raise the price; quantity demanded contracts and quantity supplied extends', 'The demand curve shifts right until it meets the supply curve', 'The government buys the unsold goods at the current price'], 0,
      'Unsold stock leads sellers to cut the price. As it falls, buyers want more and sellers offer less, until the two quantities are equal.'),
    mc('market-forces', 'How do market forces remove excess demand?',
      ['The price rises; quantity demanded contracts and quantity supplied extends', 'The price falls; quantity demanded extends and quantity supplied contracts', 'The supply curve shifts left until the shortage is removed', 'Producers ration the good at the current price for ever'], 0,
      'A shortage lets sellers raise the price. Fewer buyers then want the good and more is offered, until quantity demanded equals quantity supplied.'),
    mc('market-forces', 'When the price falls to remove a surplus, what happens to the demand and supply curves?',
      ['They do not shift; there are movements along both curves', 'Both curves shift to the left', 'The demand curve shifts to the right', 'The supply curve shifts to the left'], 0,
      'A price change causes movements along the existing curves: an extension in demand and a contraction in supply. Neither curve shifts.'),
    mu('market-forces', 'Which of these happen as market forces remove a surplus? Select all that apply.',
      ['The price falls', 'Quantity demanded extends', 'Quantity supplied contracts', 'The supply curve shifts to the left', 'The demand curve shifts to the right'], [0, 1, 2],
      'The surplus is removed by a fall in price and movements along the curves. The curves themselves do not shift.'),
    mc('market-forces', 'There is a shortage of concert tickets at $40. Complete the chain: “The organisers raise the price, so …”',
      ['fewer fans want tickets and more tickets are offered', 'more fans want tickets and fewer tickets are offered', 'the demand curve shifts to the right', 'the shortage grows larger'], 0,
      'A higher price causes a contraction in quantity demanded and an extension in quantity supplied, closing the gap.'),
    mc('evaluation', 'A café owner keeps the price of her cakes above the equilibrium price. What is the most likely effect on her?',
      ['Unsold cakes are wasted, so she has a reason to cut the price', 'She sells out early, so she has a reason to raise the price', 'Demand for her cakes shifts to the right', 'She sells exactly the number of cakes she bakes'], 0,
      'Above equilibrium she bakes more cakes than customers want. Waste and lost revenue give her an incentive to lower the price.'),
    mc('evaluation', 'The only bakery in a village prices its bread below the equilibrium price. What is the most likely effect on consumers?',
      ['Some cannot buy bread because it sells out early', 'They are left with unsold bread at the end of the day', 'They all buy less bread than before', 'They pay a higher price than at equilibrium'], 0,
      'Below equilibrium, quantity demanded is greater than quantity supplied, so there is a shortage: bread runs out and some customers miss out.'),
    mc('definitions', 'Which describes a market that “clears”?',
      ['Quantity demanded equals quantity supplied, with nothing left over', 'All firms in the market have sold their premises', 'The price falls to zero because of a surplus', 'Consumers buy more than producers supply'], 0,
      'A market clears at the equilibrium price, where every unit offered for sale is bought.'),
    mc('definitions', 'On a demand and supply diagram, where is the equilibrium?',
      ['Where the demand and supply curves cross', 'Where the demand curve meets the price axis', 'Where the supply curve meets the quantity axis', 'At the highest point on the demand curve'], 0,
      'The crossing point gives the price and quantity at which quantity demanded equals quantity supplied.')
  ] };

  // =====================================================================
  // ECO-CALC-02 Excess demand and excess supply
  // =====================================================================
  var MONTHS3 = [['January', 'February', 'March'], ['April', 'May', 'June'], ['July', 'August', 'September'], ['October', 'November', 'December']];
  function threeMonths(excessDemand, lo, hi) {   // per-month supply s, monthly demand around it
    for (var t = 0; t < 50; t++) {
      var s = rint(lo, hi) * 10, d = [0, 1, 2].map(function () { return s + rint(-25, 45) * (excessDemand ? 10 : -10); });
      var tot = d[0] + d[1] + d[2], gap = excessDemand ? tot - 3 * s : 3 * s - tot;
      if (gap >= 50 && d.every(function (v) { return v > 0; })) return { s: s, d: d, tot: tot, gap: gap };
    }
    return { s: 1000, d: [1200, 1100, 1050], tot: 3350, gap: 350 };
  }

  B['ECO-CALC-02'] = { title: 'Excess demand and excess supply', items: [
    G('graph', function () {
      var p0 = rint(6, 8), pk = pick([2, 4, 5, 10]), qk = pick([10, 20, 25, 50]), ans = (2 * p0 - 10) * qk;
      return nm('graph', 'Using the diagram, calculate the excess supply in this market at a price of $' + p0 * pk + '.', ans, 'units',
        'At $' + p0 * pk + ' quantity supplied is ' + sep(p0 * qk) + ' and quantity demanded is ' + sep((10 - p0) * qk) + '. Excess supply = ' + sep(p0 * qk) + ' − ' + sep((10 - p0) * qk) + ' = ' + sep(ans) + ' units.',
        { svg: excessSvg(p0, pk, qk, true) });
    }),
    G('graph', function () {
      var p0 = rint(2, 4), pk = pick([1, 3, 5]), qk = pick([20, 40, 50, 100]), ans = (10 - 2 * p0) * qk;
      return nm('graph', 'Using the diagram, calculate the excess demand in this market at a price of $' + p0 * pk + '.', ans, 'units',
        'At $' + p0 * pk + ' quantity demanded is ' + sep((10 - p0) * qk) + ' and quantity supplied is ' + sep(p0 * qk) + '. Excess demand = ' + sep((10 - p0) * qk) + ' − ' + sep(p0 * qk) + ' = ' + sep(ans) + ' units.',
        { svg: excessSvg(p0, pk, qk, true) });
    }),
    G('graph', function () {
      var p0 = pick([2, 3, 7, 8]), pk = pick([2, 5]), qk = pick([10, 30, 50]), qd = (10 - p0) * qk, qs = p0 * qk, gap = Math.abs(qd - qs), ed = qd > qs;
      var opts = [(ed ? 'Excess demand of ' : 'Excess supply of ') + sep(gap) + ' units', (ed ? 'Excess supply of ' : 'Excess demand of ') + sep(gap) + ' units', (ed ? 'Excess demand of ' : 'Excess supply of ') + sep(qd + qs) + ' units', (ed ? 'Excess demand of ' : 'Excess supply of ') + sep(ed ? qd : qs) + ' units'];
      return mc('graph', 'What does the diagram show at a price of $' + p0 * pk + '?', opts, 0,
        'Quantity demanded is ' + sep(qd) + ' and quantity supplied is ' + sep(qs) + '. ' + (ed ? 'Demand is bigger: ' + sep(qd) + ' − ' + sep(qs) : 'Supply is bigger: ' + sep(qs) + ' − ' + sep(qd)) + ' = ' + sep(gap) + ' units of ' + (ed ? 'excess demand.' : 'excess supply.'),
        { svg: excessSvg(p0, pk, qk, false) });
    }),
    G('months', function () {
      var m = pick(MONTHS3), r = threeMonths(true, 150, 400), good = pick(['bike-hire sessions', 'swimming lessons', 'climbing-wall sessions']);
      return nm('months', 'Demand for ' + good + ' at a leisure centre was:' + tbl(['Month', m[0], m[1], m[2]], [['Quantity demanded', sep(r.d[0]), sep(r.d[1]), sep(r.d[2])]]) + 'The centre supplied ' + sep(3 * r.s) + ' in total over the three months. Calculate the excess demand.',
        r.gap, '', '(' + sep(r.d[0]) + ' + ' + sep(r.d[1]) + ' + ' + sep(r.d[2]) + ') − ' + sep(3 * r.s) + ' = ' + sep(r.tot) + ' − ' + sep(3 * r.s) + ' = ' + sep(r.gap) + ' ' + good + '.');
    }),
    G('months', function () {
      var m = pick(MONTHS3), r = threeMonths(false, 200, 500), good = pick(['hotel rooms', 'rental cars', 'boat trips']);
      return nm('months', 'Demand for ' + good + ' in a holiday town was:' + tbl(['Month', m[0], m[1], m[2]], [['Quantity demanded', sep(r.d[0]), sep(r.d[1]), sep(r.d[2])]]) + 'Firms supplied ' + sep(3 * r.s) + ' in total over these three months. Calculate the excess supply.',
        r.gap, '', sep(3 * r.s) + ' − (' + sep(r.d[0]) + ' + ' + sep(r.d[1]) + ' + ' + sep(r.d[2]) + ') = ' + sep(3 * r.s) + ' − ' + sep(r.tot) + ' = ' + sep(r.gap) + ' ' + good + '.');
    }),
    G('months', function () {
      var m = pick(MONTHS3), ed = Math.random() < 0.5, r = threeMonths(ed, 100, 300), good = pick(['cooking classes', 'driving lessons', 'gym sessions']);
      return nm('months', 'A training centre supplied ' + sep(r.s) + ' ' + good + ' each month. Demand was:' + tbl(['Month', m[0], m[1], m[2]], [['Quantity demanded', sep(r.d[0]), sep(r.d[1]), sep(r.d[2])]]) + 'Calculate the excess ' + (ed ? 'demand' : 'supply') + ' over the three months.',
        r.gap, '', 'Total supply = 3 × ' + sep(r.s) + ' = ' + sep(3 * r.s) + '. Total demand = ' + sep(r.d[0]) + ' + ' + sep(r.d[1]) + ' + ' + sep(r.d[2]) + ' = ' + sep(r.tot) + '. Excess ' + (ed ? 'demand = ' + sep(r.tot) + ' − ' + sep(3 * r.s) : 'supply = ' + sep(3 * r.s) + ' − ' + sep(r.tot)) + ' = ' + sep(r.gap) + '.');
    }),
    G('places', function () {
      var towns = sample(['Ashby', 'Kelmore', 'Rivington', 'Dunmere', 'Holloway', 'Pennick'], 3), d = towns.map(function () { return rint(60, 180) * 10; });
      var tot = d[0] + d[1] + d[2], gap = rint(20, 90) * 10, s = tot - gap;
      return nm('places', 'A theatre company tours three towns. Demand for seats was:' + tbl(['Town', towns[0], towns[1], towns[2]], [['Seats demanded', sep(d[0]), sep(d[1]), sep(d[2])]]) + 'The company offered ' + sep(s) + ' seats in total. Calculate the excess demand for seats.',
        gap, 'seats', '(' + sep(d[0]) + ' + ' + sep(d[1]) + ' + ' + sep(d[2]) + ') − ' + sep(s) + ' = ' + sep(tot) + ' − ' + sep(s) + ' = ' + sep(gap) + ' seats.');
    }),
    G('places', function () {
      var n = rint(3, 4), seats = rint(9, 15) * 10, d = []; for (var i = 0; i < n; i++) d.push(rint(5, seats / 10 - 1) * 10);
      var tot = d.reduce(function (a, b) { return a + b; }, 0), s = n * seats, days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'].slice(0, n);
      return nm('places', 'A tour boat has ' + seats + ' seats and makes one trip a day on ' + n + ' days. Demand was:' + tbl(['Day'].concat(days), [['Seats demanded'].concat(d.map(sep))]) + 'Calculate the excess supply of seats over the ' + n + ' days.',
        s - tot, 'seats', 'Supply = ' + n + ' × ' + seats + ' = ' + sep(s) + ' seats. Demand = ' + d.map(sep).join(' + ') + ' = ' + sep(tot) + '. Excess supply = ' + sep(s) + ' − ' + sep(tot) + ' = ' + sep(s - tot) + ' seats.');
    }),
    G('schedule', function () {
      var M = mktSched(), i = pick([0, 1, 2, 3, 4].filter(function (j) { return j !== M.k; })), gap = Math.abs(M.qd[i] - M.qs[i]), ed = M.qd[i] > M.qs[i];
      return nm('schedule', 'The table shows the market for a brand of yoghurt.' + schedTbl(M, '', 'pots') + 'Calculate the excess ' + (ed ? 'demand' : 'supply') + ' at a price of $' + M.p[i].toFixed(2) + '.',
        gap, 'pots', (ed ? sep(M.qd[i]) + ' − ' + sep(M.qs[i]) : sep(M.qs[i]) + ' − ' + sep(M.qd[i])) + ' = ' + sep(gap) + ' pots of excess ' + (ed ? 'demand' : 'supply') + '.');
    }),
    G('weeks', function () {
      var s = rint(30, 60) * 10, d = [0, 1, 2, 3].map(function () { return s + rint(5, 30) * 10; }), tot = d.reduce(function (a, b) { return a + b; }, 0);
      return nm('weeks', 'A bakery bakes ' + sep(s) + ' sourdough loaves a week. Over four weeks, customers wanted:' + tbl(['Week', '1', '2', '3', '4'], [['Loaves demanded'].concat(d.map(sep))]) + 'Calculate the excess demand for loaves over the four weeks.',
        tot - 4 * s, 'loaves', 'Demand = ' + d.map(sep).join(' + ') + ' = ' + sep(tot) + '. Supply = 4 × ' + sep(s) + ' = ' + sep(4 * s) + '. Excess demand = ' + sep(tot) + ' − ' + sep(4 * s) + ' = ' + sep(tot - 4 * s) + ' loaves.');
    }),
    G('common-errors', function () {
      var m = pick(MONTHS3), r = threeMonths(true, 200, 400), wrong = Math.abs(r.d[2] - r.s);
      var opts = [sep(r.gap), sep(r.tot), sep(wrong), sep(3 * r.s)];
      if (wrong === 0 || new Set(opts).size < 4) opts[2] = sep(r.gap + 100);
      return mc('common-errors', 'Demand for parking permits was ' + sep(r.d[0]) + ' in ' + m[0] + ', ' + sep(r.d[1]) + ' in ' + m[1] + ' and ' + sep(r.d[2]) + ' in ' + m[2] + '. The council supplied ' + sep(r.s) + ' permits each month. Ali compared only ' + m[2] + '’s demand with the supply for one month. What is the correct excess demand for the three months?', opts, 0,
        'Use totals for the same period: (' + sep(r.d[0]) + ' + ' + sep(r.d[1]) + ' + ' + sep(r.d[2]) + ') − 3 × ' + sep(r.s) + ' = ' + sep(r.tot) + ' − ' + sep(3 * r.s) + ' = ' + sep(r.gap) + '.');
    }),
    G('working', function () {
      var a = rint(30, 60) * 10, b = rint(30, 60) * 10, c = rint(30, 60) * 10, s = a + b + c - rint(5, 25) * 10, gap = a + b + c - s;
      var opts = ['(' + sep(a) + ' + ' + sep(b) + ' + ' + sep(c) + ') − ' + sep(s), sep(s) + ' − (' + sep(a) + ' + ' + sep(b) + ' + ' + sep(c) + ')', sep(a) + ' − ' + sep(s), '(' + sep(a) + ' + ' + sep(b) + ' + ' + sep(c) + ') + ' + sep(s)];
      return mc('working', 'Three branches of a bike-repair chain had demand for ' + sep(a) + ', ' + sep(b) + ' and ' + sep(c) + ' repairs. The chain could supply ' + sep(s) + ' repairs in total. Which working gives the excess demand?', opts, 0,
        'Add all the demand first, then subtract the total supply: ' + sep(a + b + c) + ' − ' + sep(s) + ' = ' + sep(gap) + '. Subtracting the other way round gives a negative number.');
    }),
    G('reverse', function () {
      var qd = rint(40, 90) * 10, gap = rint(5, 30) * 10;
      return nm('reverse', 'At a price of $' + rint(2, 4) + ', quantity demanded for croissants at a city bakery chain is ' + sep(qd) + ' a day and there is excess demand of ' + sep(gap) + '. What is the quantity supplied at this price?',
        qd - gap, 'croissants', 'Excess demand = quantity demanded − quantity supplied, so quantity supplied = ' + sep(qd) + ' − ' + sep(gap) + ' = ' + sep(qd - gap) + '.');
    }),
    G('reverse', function () {
      var qs = rint(50, 120) * 10, gap = rint(10, 40) * 10;
      return nm('reverse', 'A fruit market has an excess supply of ' + sep(gap) + ' crates of melons. Sellers offered ' + sep(qs) + ' crates. How many crates did buyers want?',
        qs - gap, 'crates', 'Excess supply = quantity supplied − quantity demanded, so quantity demanded = ' + sep(qs) + ' − ' + sep(gap) + ' = ' + sep(qs - gap) + ' crates.');
    }),
    mc('concepts', 'When does excess demand exist?',
      ['When quantity demanded is greater than quantity supplied', 'When quantity supplied is greater than quantity demanded', 'When the demand curve shifts to the right', 'When the price is above equilibrium'], 0,
      'Excess demand (a shortage) = quantity demanded − quantity supplied, which is positive only when demand is bigger.'),
    mc('concepts', 'Which calculation gives excess supply?',
      ['Quantity supplied − quantity demanded', 'Quantity demanded − quantity supplied', 'Quantity supplied + quantity demanded', 'Quantity supplied × price'], 0,
      'Excess supply is the surplus left over: what sellers offer minus what buyers want at that price.'),
    mc('concepts', 'A student works out quantity demanded − quantity supplied and gets −150. What does this show?',
      ['Excess supply of 150 units', 'Excess demand of 150 units', 'Excess demand of −150 units', 'The market is in equilibrium'], 0,
      'A negative answer means supply is bigger than demand. Subtract the smaller from the larger instead: there is an excess supply of 150 units.'),
    mc('concepts', 'In what unit should an answer for excess demand for tickets be given?',
      ['Number of tickets', 'Dollars', 'Percentage', 'Tickets per dollar'], 0,
      'Excess demand is a gap between two quantities, so it is measured in units of the good, here tickets, not in money.'),
    mc('concepts', 'Demand is given for each of three months, but supply is given as an amount per month. What should you do first?',
      ['Multiply the monthly supply by 3 to get the three-month total', 'Compare one month’s demand with one month’s supply only', 'Divide total demand by 3 and ignore supply', 'Add the monthly supply to each month’s demand'], 0,
      'Both totals must cover the same period. Turn the monthly supply into a three-month total before comparing it with total demand.'),
    mc('concepts', 'What is the excess demand in a market at its equilibrium price?',
      ['Zero', 'Equal to quantity demanded', 'Equal to quantity supplied', 'Equal to the price'], 0,
      'At equilibrium, quantity demanded equals quantity supplied, so the gap between them is zero.'),
    nm('concepts', 'At a price of $15, quantity supplied of a magazine is 2,400 copies and quantity demanded is 1,750 copies. Calculate the excess supply.',
      650, 'copies', 'Supply is bigger, so excess supply = 2,400 − 1,750 = 650 copies.'),
    nm('concepts', 'At a price of $3, quantity demanded of a snack bar is 5,600 and quantity supplied is 4,150. Calculate the excess demand.',
      1450, 'bars', 'Demand is bigger, so excess demand = 5,600 − 4,150 = 1,450 bars.')
  ] };

  // =====================================================================
  // ECO-T12-18 Supply of labour: what changes the workforce
  // =====================================================================
  var LAB_EVENTS = [
    ['The retirement age is raised from 63 to 66.', 0, 'People must work for longer before they can stop, so more people stay in the workforce.'],
    ['The school-leaving age is lowered from 18 to 16.', 0, 'Young people can start full-time work two years earlier, adding them to the workforce.'],
    ['Many workers move into the country from abroad.', 0, 'Immigration adds people of working age who are willing and able to work.'],
    ['Free childcare lets many more parents take paid jobs.', 0, 'Parents who stayed at home can now work, so female participation and the workforce rise.'],
    ['The school-leaving age is raised from 16 to 18.', 1, 'Young people must stay in education longer, so fewer of them can work full-time.'],
    ['The retirement age is lowered from 67 to 62.', 1, 'Older workers can stop work earlier, so they leave the workforce sooner.'],
    ['Thousands of young workers emigrate to find jobs abroad.', 1, 'Emigration removes people of working age from the country.'],
    ['Demand for the goods that firms make falls sharply.', 3, 'This changes how many workers firms want to hire, so it affects the demand for labour, not the supply.'],
    ['Firms receive many new export orders and want to expand.', 2, 'Firms need more workers to meet orders, so the demand for labour rises. The supply of labour is unchanged.']];
  var LAB_OPTS = ['The supply of labour increases', 'The supply of labour decreases', 'The demand for labour increases', 'The demand for labour decreases'];

  B['ECO-T12-18'] = { title: 'Supply of labour: what changes the workforce', items: [
    G('direction', function () {
      var e = pick(LAB_EVENTS);
      return mc('direction', 'In ' + pick(COUNTRIES) + ': <i>' + e[0] + '</i> What is the most likely effect on the labour market?', LAB_OPTS.slice(), e[1], e[2]);
    }),
    G('direction', function () {
      var c = pick(COUNTRIES), up = Math.random() < 0.5, from = up ? rint(15, 16) : 18, to = up ? 18 : 16, a = rint(60, 63), b = a + rint(2, 4);
      var v = pick([
        [(up ? 'raises' : 'lowers') + ' the school-leaving age from ' + from + ' to ' + to, up ? 1 : 0, up ? 'Young people stay in education longer, so fewer can work full-time: supply of labour falls.' : 'Young people can leave school and work earlier: supply of labour rises.'],
        ['raises the state pension age from ' + a + ' to ' + b, 0, 'People must work longer before receiving a state pension, so more older people stay in the workforce.'],
        ['lowers the state pension age from ' + b + ' to ' + a, 1, 'People can stop working earlier, so the workforce shrinks.']]);
      return mc('direction', 'The government of ' + c + ' ' + v[0] + '. What is the effect on the supply of labour?', ['It increases', 'It decreases', 'It does not change', 'Only the demand for labour changes'], v[1], v[2]);
    }),
    mc('definitions', 'What is meant by the supply of labour?',
      ['The number of people willing and able to work at a given wage rate', 'The number of jobs that firms want to fill', 'The total wages paid by all the firms in the economy in a single year', 'The number of people who are unemployed'], 0,
      'Labour supply is about workers: how many people (or hours) are offered to employers at each wage rate. Jobs firms want to fill are the demand for labour.'),
    mc('mobility', 'What is meant by occupational mobility of labour?',
      ['The ability of workers to change to a different type of job', 'The ability of workers to move to a different area for work', 'The number of workers who change employer each year', 'The speed at which workers are promoted'], 0,
      'Occupational mobility is moving between types of work, such as from factory work to care work. Moving location is geographical mobility.'),
    mc('mobility', 'What is meant by geographical mobility of labour?',
      ['The ability of workers to move to another place for work', 'The ability of workers to retrain for a new type of job', 'The number of workers who emigrate each year', 'The movement of firms to cheaper locations'], 0,
      'Geographical mobility is about moving location to where the jobs are.'),
    mc('mobility', 'Which is an example of occupational immobility?',
      ['A coal miner cannot become a nurse without years of training', 'A teacher cannot afford to move to a city with many job vacancies', 'A worker moves abroad to earn a higher wage', 'A firm moves its factory to a cheaper region'], 0,
      'The miner lacks the skills for a different type of job, so he cannot switch occupation easily.'),
    mc('mobility', 'Which is the most likely barrier to geographical mobility?',
      ['Much higher housing costs in the city where the jobs are', 'A lack of the right qualifications for the new type of job', 'A rise in the national retirement age', 'Free retraining courses for unemployed workers'], 0,
      'If housing near the vacancies is expensive, workers may be unable to move there. A lack of qualifications is an occupational barrier.'),
    mc('mobility', 'The government of Kestland funds courses to retrain factory workers as care workers. What is the most likely effect?',
      ['Occupational mobility rises, increasing the supply of care workers', 'Geographical mobility falls, which reduces the supply of care workers', 'The demand for care workers falls', 'The supply of all types of labour falls'], 0,
      'Retraining lets workers move between types of job, so more people are able to do care work.'),
    mu('direction', 'Which of these would increase a country’s supply of labour? Select all that apply.',
      ['More women joining the paid workforce', 'A higher retirement age', 'More immigration of working-age people', 'A higher school-leaving age', 'More emigration of young workers'], [0, 1, 2],
      'Female participation, working longer and immigration all add workers. A higher school-leaving age and emigration remove them.'),
    mu('direction', 'Which of these would decrease a country’s supply of labour? Select all that apply.',
      ['A lower retirement age', 'A higher school-leaving age', 'A shrinking working-age population', 'Cheaper childcare for working parents', 'A lower school-leaving age'], [0, 1, 2],
      'Earlier retirement, longer schooling and fewer working-age people reduce the workforce. Cheaper childcare and a lower school-leaving age increase it.'),
    mc('supply-or-demand', 'Which of these affects the demand for labour rather than the supply of labour?',
      ['A fall in demand for the product workers make', 'A rise in the retirement age', 'More people migrating into the country', 'A higher school-leaving age'], 0,
      'Firms’ need for workers depends on demand for their products, so this is a demand-side factor. The others change how many people are available to work.'),
    mc('supply-or-demand', 'Which of these is <b>not</b> a factor affecting the supply of labour?',
      ['The price of the firm’s product', 'The size of the population', 'The retirement age', 'Workers’ skills and qualifications'], 0,
      'The product price affects how many workers firms want (demand). Population, retirement age and skills affect how many people can and will work (supply).'),
    mc('reasons', 'Why does raising the retirement age increase the supply of labour?',
      ['People must keep working longer before they receive a state pension', 'Firms want to hire more older workers', 'Wages automatically rise for all workers over the age of 60 in every job', 'Young people leave school earlier'], 0,
      'If people cannot receive a pension until later, many continue working, so more people are in the workforce.'),
    mc('reasons', 'Why does raising the school-leaving age reduce the supply of labour?',
      ['Young people stay in education instead of working full-time', 'Firms stop hiring people under 18', 'Older workers decide to retire earlier than they had planned to', 'Wages for young workers fall'], 0,
      'Students who must stay in education cannot join the full-time workforce until they leave, so fewer people are available to work.'),
    mc('reasons', 'Firms in Danuvia cannot find enough software engineers, even though many people are unemployed. What is the most likely supply-side reason?',
      ['Too few people have the skills and qualifications needed', 'Demand for software has fallen sharply', 'The retirement age has been raised', 'Too many engineers have moved into Danuvia from other countries'], 0,
      'Unemployed people may lack the specialist skills, and training takes time and money. This limits the supply of labour for that job.'),
    mc('demographics', 'A country has a rapidly growing share of people aged over 70. What is the most likely effect?',
      ['A smaller share of the population is of working age', 'A larger share of the population is of working age', 'The school-leaving age falls automatically', 'The demand for labour falls to zero'], 0,
      'The age distribution matters: more retired people means fewer people of working age relative to the total population.'),
    mc('demographics', 'Which policy is most likely to increase female participation in the workforce?',
      ['Providing cheaper childcare places', 'Raising the school-leaving age', 'Lowering the retirement age', 'Cutting the number of part-time jobs'], 0,
      'Childcare costs keep some parents, often mothers, out of work. Cheaper childcare lets more of them take paid jobs.'),
    G('demographics', function () {
      var leave = rint(40, 70) * 1000, retire = rint(25, 45) * 1000, imm = rint(5, 20) * 1000, emig = rint(4, 15) * 1000, net = leave + imm - retire - emig;
      if (net <= 0) { leave += 40000; net += 40000; }
      return nm('demographics', 'In one year in ' + pick(COUNTRIES) + ', ' + sep(leave) + ' young people leave education and look for work, ' + sep(retire) + ' workers retire, ' + sep(imm) + ' workers immigrate and ' + sep(emig) + ' workers emigrate. By how many people does the supply of labour rise?',
        net, 'people', 'Add the people joining and subtract those leaving: ' + sep(leave) + ' + ' + sep(imm) + ' − ' + sep(retire) + ' − ' + sep(emig) + ' = ' + sep(net) + '.');
    }),
    mc('evaluation', 'A government raises the retirement age to ease a shortage of construction workers. Which is the best counter-argument?',
      ['Older workers may be unable to do heavy physical work', 'A higher retirement age always reduces the supply of labour', 'Construction firms do not need any workers', 'Older workers cannot legally work in any sector'], 0,
      'Keeping older people in work raises total labour supply, but it may not help an industry that needs younger, physically fit workers.'),
    mc('evaluation', 'Brenthia recruits nurses from abroad to fill hospital vacancies. Which is the most likely limitation?',
      ['Their qualifications may take time to be recognised', 'Immigration always reduces the supply of labour', 'Hospitals will need fewer nurses as a result', 'Nurses from abroad cannot speak any language'], 0,
      'Migration can raise labour supply, but checks on qualifications can delay when the new nurses can start work.'),
    mc('chain', 'Complete the chain: “More people migrate into Caldoria, so the supply of labour increases, so …”',
      ['firms find it easier to fill their vacancies', 'firms find it harder to fill their vacancies', 'the demand for labour falls immediately', 'the retirement age must rise'], 0,
      'More people willing and able to work makes it easier for firms to recruit, which can ease shortages and hold down wage rises.'),
    mc('chain', 'Many young, skilled workers emigrate from Marenko. What is the most likely effect on the supply of labour in Marenko?',
      ['It decreases, especially for skilled jobs', 'It increases, especially for skilled jobs', 'It is unchanged because only demand changes', 'It increases because wages fall'], 0,
      'Emigration removes people of working age, and here they are skilled, so firms needing those skills face shortages.')
  ] };

  // =====================================================================
  // Shared event pools for shifts
  // =====================================================================
  // [market, event, key] where key is dR, dL, sR, sL or mv (movement along demand)
  var D_EVENTS = [
    ['restaurant meals', 'average incomes in the city rise by 8%', 'dR', 'Higher incomes mean consumers can afford more meals out at every price.'],
    ['oat milk', 'a popular fitness influencer recommends oat milk to her followers', 'dR', 'A change in tastes makes consumers want more oat milk at every price.'],
    ['electric bicycles', 'bus fares in the city double', 'dR', 'Buses are a substitute; when they become dearer, more people choose e-bikes at every price.'],
    ['printer ink cartridges', 'the price of home printers falls sharply', 'dR', 'Printers and ink are complements; cheaper printers mean more printers in use, so more ink is wanted at every price.'],
    ['school uniforms', 'the number of school-age children in the town rises', 'dR', 'A demographic change adds buyers, so demand rises at every price.'],
    ['a brand of sun cream', 'the firm runs a successful television advertising campaign', 'dR', 'Advertising persuades more consumers to buy at every price.'],
    ['tea', 'the price of coffee rises', 'dR', 'Coffee is a substitute for tea; when coffee is dearer, some people switch to tea at every price.'],
    ['sugary fizzy drinks', 'a widely reported health study links them to tooth decay', 'dL', 'Tastes turn against the product, so consumers want less at every price.'],
    ['new cars', 'a recession cuts average incomes', 'dL', 'Lower incomes mean fewer households can afford new cars at every price.'],
    ['cinema tickets', 'a cheap film-streaming service launches', 'dL', 'A new, cheaper substitute draws viewers away, so demand for cinema tickets falls at every price.'],
    ['large petrol cars', 'the price of petrol rises sharply', 'dL', 'Petrol is a complement to petrol cars; dearer petrol makes owning one less attractive, so demand falls.'],
    ['baby clothes', 'the birth rate falls for several years', 'dL', 'Fewer babies means fewer buyers: a demographic change that lowers demand at every price.'],
    ['butter', 'the price of margarine falls', 'dL', 'Margarine is a substitute; when it is cheaper, some buyers switch away from butter.']];
  var S_EVENTS = [
    ['wheat', 'ideal weather gives farmers a record harvest', 'sR', 'Good weather raises the amount that can be produced, so more is supplied at every price.'],
    ['solar panels', 'the government gives makers a subsidy for each panel', 'sR', 'A subsidy lowers producers’ costs, so they supply more at every price.'],
    ['furniture', 'new machines cut the time needed to make each chair', 'sR', 'Better technology lowers the cost of each unit, so more is supplied at every price.'],
    ['bread', 'the price of flour falls', 'sR', 'Cheaper raw materials cut costs of production, so supply rises.'],
    ['bottled water', 'an indirect tax on each bottle is removed', 'sR', 'Removing the tax cuts the cost of supplying each bottle, so supply shifts right.'],
    ['coffee', 'a frost destroys much of the coffee crop', 'sL', 'A natural factor reduces how much can be produced, so less is supplied at every price.'],
    ['cola', 'the government adds an indirect tax on each can', 'sL', 'The tax raises the cost of supplying each can, so supply shifts left.'],
    ['strawberries', 'wages for fruit pickers rise sharply', 'sL', 'Higher wage costs raise costs of production, so less is supplied at every price.'],
    ['rice', 'floods wash away large areas of rice fields', 'sL', 'The flood cuts the amount that can be grown, so supply falls.'],
    ['electric cars', 'the government ends the subsidy paid to car makers', 'sL', 'Losing the subsidy raises makers’ costs, so supply shifts left.'],
    ['steel', 'the cost of energy used in steel works doubles', 'sL', 'Higher energy costs raise costs of production, so supply falls.']];
  var KEY_TXT = { dR: 'Demand shifts to the right', dL: 'Demand shifts to the left', sR: 'Supply shifts to the right', sL: 'Supply shifts to the left' };
  var PQ = { dR: 0, dL: 3, sR: 2, sL: 1 };
  var PQ_OPTS = ['Price rises and quantity rises', 'Price rises and quantity falls', 'Price falls and quantity rises', 'Price falls and quantity falls'];
  var PQ_WHY = { dR: 'Demand shifts right along the unchanged supply curve, so equilibrium price and quantity both rise.', dL: 'Demand shifts left along the unchanged supply curve, so equilibrium price and quantity both fall.', sR: 'Supply shifts right along the unchanged demand curve, so equilibrium price falls and quantity rises.', sL: 'Supply shifts left along the unchanged demand curve, so equilibrium price rises and quantity falls.' };

  // =====================================================================
  // ECO-T11-08 What shifts the demand curve
  // =====================================================================
  B['ECO-T11-08'] = { title: 'What shifts the demand curve', items: [
    G('identify-shift', function () {
      var e = pick(D_EVENTS);
      var opts = ['The demand curve shifts to the right', 'The demand curve shifts to the left', 'A movement along the demand curve', 'The supply curve shifts to the left'];
      return mc('identify-shift', 'In the market for ' + e[0] + ', ' + e[1] + '. What happens?', opts, e[2] === 'dR' ? 0 : 1, e[3]);
    }, { family: 'shift-events' }),
    G('related-goods', function () {
      var pairs = [['tea', 'coffee', 's'], ['bus travel', 'train travel', 's'], ['butter', 'margarine', 's'], ['printers', 'ink cartridges', 'c'], ['games consoles', 'console games', 'c'], ['tennis rackets', 'tennis balls', 'c'], ['cars', 'petrol', 'c']];
      var pr = pick(pairs), up = Math.random() < 0.5, right = (pr[2] === 's') === up;
      return mc('related-goods', 'The price of ' + pr[0] + ' ' + (up ? 'rises' : 'falls') + '. What happens to the demand curve for ' + pr[1] + '?',
        ['It shifts to the right', 'It shifts to the left', 'It does not shift; there is a movement along it', 'It shifts right and then back left'], right ? 0 : 1,
        cap(pr[0]) + ' and ' + pr[1] + ' are ' + (pr[2] === 's' ? 'substitutes' : 'complements') + '. ' + (pr[2] === 's' ? (up ? 'When the price of ' + pr[0] + ' rises, some buyers switch to ' + pr[1] + ', so demand for ' + pr[1] + ' shifts right.' : 'When the price of ' + pr[0] + ' falls, some buyers switch away from ' + pr[1] + ', so demand for ' + pr[1] + ' shifts left.') : (up ? 'When the price of ' + pr[0] + ' rises, fewer are bought and used, so demand for ' + pr[1] + ' shifts left.' : 'When the price of ' + pr[0] + ' falls, more are bought and used, so demand for ' + pr[1] + ' shifts right.')));
    }),
    G('equilibrium', function () {
      var e = pick(D_EVENTS);
      return mc('equilibrium', 'In the market for ' + e[0] + ', ' + e[1] + '. Supply does not change. What happens to the equilibrium?', PQ_OPTS.slice(), PQ[e[2]], e[3] + ' ' + PQ_WHY[e[2]]);
    }, { family: 'shift-events' }),
    G('equilibrium', function () {
      var right = Math.random() < 0.5, e = pick(D_EVENTS.filter(function (x) { return x[2] === (right ? 'dR' : 'dL'); }));
      var other = pick(S_EVENTS);
      var body = dLine(0, 'D') + sLine(0, 'S') + dLine(right ? 2 : -2, 'D1', HI, true);
      var pt = right ? [6, 6] : [4, 4];
      var svgS = graph({ yl: 'Price ($)', xl: 'Quantity', body: body, pts: [[5, 5, 'E', INK], [pt[0], pt[1], 'F']], label: 'Demand and supply diagram showing demand moving from D to D1' });
      return mc('equilibrium', 'The diagram shows a market in which demand moves from D to D1. Which event could explain this?',
        [cap(e[1]) + ' (market for ' + e[0] + ')', cap(other[1]) + ' (market for ' + other[0] + ')', 'The price of ' + e[0] + ' itself ' + (right ? 'falls' : 'rises'), 'Producers of ' + e[0] + ' install faster machines'], 0,
        'D1 lies to the ' + (right ? 'right' : 'left') + ' of D, so a non-price factor has ' + (right ? 'raised' : 'lowered') + ' demand. ' + e[3] + ' The other events would move supply or cause a movement along D.', { svg: svgS });
    }, { family: 'shift-events' }),
    mc('definitions', 'Which is the best definition of a substitute good?',
      ['A good that can be bought instead of another to meet the same want', 'A good that is used together with another good', 'A good whose demand rises when incomes fall', 'A good that is produced by the same firm that also makes another good'], 0,
      'Substitutes are alternatives, such as tea instead of coffee. Goods used together are complements.'),
    mc('definitions', 'Which is the best definition of a complementary good?',
      ['A good that is used together with another good', 'A good that can be bought instead of another good', 'A good that is given away free with another', 'A good that the government provides'], 0,
      'Complements go together, such as phones and phone cases, so a change in the price of one affects demand for the other.'),
    mc('definitions', 'What is meant by an increase in demand?',
      ['More is demanded at every price, so the curve shifts right', 'More is demanded because the good’s own price has fallen sharply', 'Producers supply more at every price', 'The price of the good rises'], 0,
      'An increase in demand is a shift of the whole curve to the right, caused by a non-price factor. A price fall only causes an extension along the curve.'),
    mc('definitions', 'Which pair of goods are complements?',
      ['Tennis rackets and tennis balls', 'Butter and margarine', 'Bus travel and train travel', 'Tea and coffee'], 0,
      'Rackets and balls are used together. The other pairs are alternatives to each other, so they are substitutes.'),
    mc('definitions', 'Which pair of goods are substitutes?',
      ['Bus travel and train travel between two cities', 'Cars and car tyres', 'Phones and phone chargers', 'Printers and printer paper'], 0,
      'Travellers can choose the bus or the train for the same journey, so they are substitutes. The other pairs are used together.'),
    mc('factors', 'Which of these causes a shift of the demand curve?',
      ['A change in consumers’ tastes', 'A rise in costs of production', 'A new subsidy for producers', 'A change in the good’s own price'], 0,
      'Tastes affect buyers, so they shift demand. Costs and subsidies shift supply; the good’s own price causes a movement along the curve.'),
    mc('factors', 'Which of these is <b>not</b> a cause of a shift in the demand curve?',
      ['An indirect tax charged to producers', 'A change in the price of a substitute', 'A change in consumers’ incomes', 'A change in the size of the population'], 0,
      'An indirect tax raises producers’ costs, so it shifts supply. The other three change how much buyers want at every price.'),
    mc('factors', 'Which of these would shift the demand curve for a good to the left?',
      ['A rise in the price of a complement', 'A fall in the price of a complement', 'A rise in the price of a substitute', 'A rise in consumers’ incomes'], 0,
      'If a complement becomes dearer, people use less of it and so want less of the good that goes with it.'),
    mc('factors', 'A yoghurt brand runs a successful advertising campaign. What happens to the demand curve for that brand?',
      ['It shifts to the right', 'It shifts to the left', 'There is an extension along it', 'It does not move because price is unchanged'], 0,
      'Advertising persuades more consumers to buy the brand at every price, so demand shifts right. An extension would need a fall in the brand’s own price.'),
    mu('factors', 'Which of these would shift the demand curve for electric scooters to the right? Select all that apply.',
      ['Cheaper electricity for charging scooters', 'Higher bus fares', 'A rise in consumers’ incomes', 'A fall in the price of electric scooters', 'Lower battery costs for scooter makers'], [0, 1, 2],
      'Cheaper charging (a complement), dearer buses (a substitute) and higher incomes all raise demand at every price. A fall in the scooter’s own price is a movement along the curve, and lower battery costs shift supply.'),
    mu('factors', 'Which of these would shift the demand curve for gym memberships to the left? Select all that apply.',
      ['A fall in average incomes', 'Cheaper home exercise equipment', 'Gyms going out of fashion', 'A rise in gym membership prices', 'A rise in the cost of gym equipment for gym owners'], [0, 1, 2],
      'Lower incomes, a cheaper substitute and a change in tastes all reduce demand at every price. A higher membership price is a movement along the curve; higher equipment costs affect supply.'),
    mc('applications', 'The price of games consoles falls sharply. What is the most likely effect on the demand for console games?',
      ['It shifts to the right', 'It shifts to the left', 'There is a contraction along it', 'It does not change at all'], 0,
      'Consoles and games are complements. Cheaper consoles mean more consoles in homes, so more games are wanted at every price.'),
    mc('applications', 'The number of children in a new housing area rises quickly. What is the most likely effect in the local market for school shoes?',
      ['Demand shifts right; price and quantity rise', 'Demand shifts left; price and quantity fall', 'Supply shifts right; price falls', 'Supply shifts left; price rises'], 0,
      'A demographic change adds buyers, shifting demand right. With supply unchanged, equilibrium price and quantity both rise.'),
    mc('applications', 'A health study linking energy drinks to poor sleep is widely reported. What is the most likely effect on the energy drink market?',
      ['Demand shifts left; price and quantity fall', 'Demand shifts right; price and quantity rise', 'Supply shifts left; price rises', 'Quantity demanded extends along the curve'], 0,
      'Tastes turn against energy drinks, so less is wanted at every price. With supply unchanged, price and quantity both fall.'),
    mc('applications', 'An ageing population in Orlavia is most likely to shift the demand curve for which of these to the right?',
      ['Home care services for older people', 'Baby clothes and prams', 'School textbooks', 'Student accommodation'], 0,
      'More older people means more buyers of care services at every price. Demand for products used by young people is more likely to fall.'),
    mc('applications', 'A rival cinema chain closes all its sites in a city. Why might demand for the remaining cinema’s tickets increase?',
      ['A substitute is no longer available to customers', 'The remaining cinema’s costs have fallen', 'Ticket prices at the remaining cinema have fallen', 'Customers’ incomes have risen'], 0,
      'The closed chain was a substitute. Its customers now go to the remaining cinema, so demand shifts right at every price.'),
    mc('chain', 'Complete the chain: “A popular influencer recommends a brand of trainers, so demand shifts to the right, so …”',
      ['the equilibrium price and quantity of the trainers both rise', 'the equilibrium price falls while the equilibrium quantity rises', 'the supply curve shifts to the right', 'the equilibrium price rises and quantity falls'], 0,
      'With supply unchanged, a rightward shift in demand raises both the equilibrium price and the equilibrium quantity.'),
    mc('chain', 'A recession cuts incomes in Solvany. What is the most likely effect on demand for foreign holidays?',
      ['Demand shifts left because fewer people can afford them', 'Demand shifts right because more people want to escape from work', 'Supply shifts left because airlines close', 'Quantity demanded extends because prices fall'], 0,
      'Foreign holidays are something people buy more of when incomes rise. Lower incomes reduce the quantity wanted at every price.')
  ] };

  // =====================================================================
  // ECO-T11-09 What shifts the supply curve
  // =====================================================================
  B['ECO-T11-09'] = { title: 'What shifts the supply curve', items: [
    G('identify-shift', function () {
      var e = pick(S_EVENTS);
      var opts = ['The supply curve shifts to the right', 'The supply curve shifts to the left', 'A movement along the supply curve', 'The demand curve shifts to the right'];
      return mc('identify-shift', 'In the market for ' + e[0] + ', ' + e[1] + '. What happens?', opts, e[2] === 'sR' ? 0 : 1, e[3]);
    }, { family: 'shift-events' }),
    G('equilibrium', function () {
      var e = pick(S_EVENTS);
      return mc('equilibrium', 'In the market for ' + e[0] + ', ' + e[1] + '. Demand does not change. What happens to the equilibrium?', PQ_OPTS.slice(), PQ[e[2]], e[3] + ' ' + PQ_WHY[e[2]]);
    }, { family: 'shift-events' }),
    G('equilibrium', function () {
      var right = Math.random() < 0.5, e = pick(S_EVENTS.filter(function (x) { return x[2] === (right ? 'sR' : 'sL'); }));
      var other = pick(D_EVENTS);
      var body = dLine(0, 'D') + sLine(0, 'S') + sLine(right ? 2 : -2, 'S1', HI, true);
      var pt = right ? [6, 4] : [4, 6];
      var svgS = graph({ yl: 'Price ($)', xl: 'Quantity', body: body, pts: [[5, 5, 'E', INK], [pt[0], pt[1], 'F']], label: 'Demand and supply diagram showing supply moving from S to S1' });
      return mc('equilibrium', 'The diagram shows a market in which supply moves from S to S1. Which event could explain this?',
        [cap(e[1]) + ' (market for ' + e[0] + ')', cap(other[1]) + ' (market for ' + other[0] + ')', 'The price of ' + e[0] + ' itself ' + (right ? 'rises' : 'falls'), 'Consumers’ tastes turn ' + (right ? 'towards' : 'against') + ' ' + e[0]], 0,
        'S1 lies to the ' + (right ? 'right' : 'left') + ' of S, so a cost or production factor has changed. ' + e[3] + ' The other events would move demand or cause a movement along S.', { svg: svgS });
    }, { family: 'shift-events' }),
    G('schedule', function () {
      var M = mktSched(), tax = Math.random() < 0.5, m = M.a + M.b, k2 = tax ? M.k + 1 : M.k - 1;
      return nm('schedule', 'The table shows the market for a type of tile.' + schedTbl(M, '', 'boxes') + (tax ? 'A new indirect tax means producers supply ' + sep(m) + ' fewer boxes at every price.' : 'A new subsidy means producers supply ' + sep(m) + ' more boxes at every price.') + ' Demand does not change. What is the new equilibrium price? Give your answer in $ to 2 decimal places.',
        M.p[k2], '$', (tax ? 'Subtract ' + sep(m) + ' from' : 'Add ' + sep(m) + ' to') + ' each quantity supplied. At $' + M.p[k2].toFixed(2) + ' the new quantity supplied is ' + sep(M.qs[k2]) + (tax ? ' − ' : ' + ') + sep(m) + ' = ' + sep(M.qd[k2]) + ', equal to quantity demanded. Supply shifted ' + (tax ? 'left, so the price rose.' : 'right, so the price fell.'),
        { tol: 0.005, display: M.p[k2].toFixed(2) });
    }),
    mc('factors', 'Which of these is most likely to shift the supply curve to the left?',
      ['A rise in an indirect tax on the product', 'A fall in the cost of raw materials', 'A new subsidy paid to producers', 'A rise in advertising by producers'], 0,
      'An indirect tax raises the cost of supplying each unit, so less is supplied at every price. Advertising affects demand, not supply.'),
    mc('factors', 'A government starts paying a subsidy to makers of bicycles. What happens to supply?',
      ['It shifts to the right', 'It shifts to the left', 'It extends along the curve', 'It does not change'], 0,
      'A subsidy lowers producers’ costs, so they are willing and able to supply more at every price.'),
    mu('factors', 'Which of these would shift a supply curve to the right? Select all that apply.',
      ['New technology that speeds up production', 'A fall in the price of raw materials', 'A new subsidy for producers', 'A successful advertising campaign', 'A rise in consumers’ incomes'], [0, 1, 2],
      'Technology, cheaper inputs and subsidies lower costs, so supply rises. Advertising and incomes affect demand, not supply.'),
    mu('factors', 'Which of these would shift a supply curve to the left? Select all that apply.',
      ['Higher wages for production workers', 'A drought that damages crops', 'A new indirect tax on the product', 'A fall in the price of a substitute', 'Lower energy prices for factories'], [0, 1, 2],
      'Higher wages, bad weather and taxes reduce supply at every price. A cheaper substitute affects demand, and lower energy prices would shift supply right.'),
    mc('factors', 'Which of these would <b>not</b> shift the supply curve?',
      ['A celebrity promoting the product', 'A rise in production costs', 'A natural disaster at the factory', 'The removal of a subsidy'], 0,
      'A celebrity promotion changes tastes, so it shifts demand. The other three change costs or the ability to produce.'),
    mc('factors', 'Which pair of events would both shift the supply curve to the right?',
      ['A new subsidy and better technology', 'A new subsidy and a new indirect tax', 'Better technology and higher wages', 'Higher incomes and lower costs'], 0,
      'Subsidies and better technology both lower the cost of producing each unit. Taxes and higher wages raise costs; incomes affect demand.'),
    mc('reasons', 'Why does an indirect tax shift the supply curve to the left?',
      ['It raises the cost of supplying each unit', 'It reduces consumers’ incomes', 'It makes the product less fashionable', 'It lowers the price that consumers pay'], 0,
      'Producers must pay the tax on each unit sold, so supplying is more costly and less is offered at every price.'),
    mc('reasons', 'Which statement about a rise in production costs is correct?',
      ['Producers supply less at every price', 'Producers supply more at every price', 'Consumers demand less at every price', 'The supply curve does not move'], 0,
      'Higher costs make each unit less profitable, so supply shifts left: less is offered at every price.'),
    mc('applications', 'Wages paid to fruit pickers rise sharply. What is the most likely effect on the market for apples?',
      ['Supply shifts left; price rises and quantity falls', 'Supply shifts right; price falls and quantity rises', 'Demand shifts left; price and quantity fall', 'Demand shifts right; price and quantity rise'], 0,
      'Higher wages raise costs of production, so supply shifts left. With demand unchanged, price rises and quantity falls.'),
    mc('applications', 'A drought hits the main coffee-growing region. What is the most likely effect on the coffee market?',
      ['Supply shifts left; price rises and quantity falls', 'Supply shifts right; price falls and quantity rises', 'Demand shifts left; price falls', 'Quantity supplied extends along the curve'], 0,
      'A natural factor cuts how much coffee can be grown, so supply falls. With demand unchanged, the price rises and quantity falls.'),
    mc('applications', 'Perfect growing weather produces a huge strawberry crop. What is the most likely effect on the strawberry market?',
      ['Supply shifts right; price falls and quantity rises', 'Supply shifts left; price rises and quantity falls', 'Demand shifts right; price rises', 'Quantity demanded contracts'], 0,
      'Good weather raises the amount that can be produced, so supply shifts right, lowering the price and raising the quantity sold.'),
    mc('applications', 'A furniture factory installs robots that cut the time to make each table. What happens to supply?',
      ['It shifts to the right', 'It shifts to the left', 'It contracts along the curve', 'It is unaffected because demand is unchanged'], 0,
      'Better technology lowers costs and raises productivity, so more tables are supplied at every price.'),
    mc('applications', 'Productivity falls in a country’s car plants after old machines break down. What happens to car supply?',
      ['It shifts to the left', 'It shifts to the right', 'It extends along the curve', 'It is unaffected'], 0,
      'Lower productivity raises the cost of each car and cuts how many can be made, so supply falls at every price.'),
    mc('applications', 'The government ends the subsidy it paid to wind turbine makers. What is the most likely effect?',
      ['Supply shifts left, so the price of turbines rises', 'Supply shifts right, so the price of turbines falls', 'Demand shifts right, so the price rises', 'Demand shifts left, so the price falls'], 0,
      'Removing a subsidy raises producers’ costs, so supply shifts left and, with demand unchanged, the equilibrium price rises.'),
    mc('applications', 'The price of fertiliser falls. What is the most likely effect on the supply of wheat?',
      ['It shifts to the right', 'It shifts to the left', 'It contracts along the curve', 'Only demand for wheat changes'], 0,
      'Fertiliser is an input. Cheaper inputs lower the cost of growing wheat, so farmers supply more at every price.'),
    mc('chain', 'Complete the chain: “The government subsidises makers of solar panels, so their costs per panel fall, so …”',
      ['supply shifts right, so the price falls and more are sold', 'supply shifts left, so the price rises and fewer are sold', 'demand shifts right, so the price rises', 'quantity supplied contracts along the curve'], 0,
      'Lower costs mean more is supplied at every price. With demand unchanged, the equilibrium price falls and quantity rises.'),
    mc('evaluation', 'Velmora subsidises builders to increase the supply of new homes and end a housing shortage. Which is the best reason the shortage may continue?',
      ['Building takes years, while demand keeps rising', 'A subsidy shifts the supply curve to the left', 'Subsidies always raise the price of homes', 'Builders will supply fewer homes than before'], 0,
      'Supply shifts right, but if demand grows faster, or new homes take years to complete, quantity demanded can still exceed quantity supplied.'),
    mc('evaluation', 'A minister says a new tax on sugary snacks will not change the market because shoppers still want snacks. Which is the best response?',
      ['The tax raises producers’ costs, so supply shifts left and price rises', 'The tax shifts demand to the right, so more snacks are sold', 'The tax only affects the demand curve, not supply', 'Taxes never change the equilibrium price'], 0,
      'Even if tastes are unchanged, the tax shifts supply left. With demand unchanged, the equilibrium price rises and the quantity sold falls.')
  ] };

  // =====================================================================
  // ECO-T11-10 Draw a demand or supply shift and new equilibrium
  // =====================================================================
  var ALL_EVENTS = D_EVENTS.concat(S_EVENTS);
  function fixedPointsSvg() { return pointsDiagram({ dR: 'W', dL: 'X', sR: 'Y', sL: 'Z' }); }

  B['ECO-T11-10'] = { title: 'Draw a demand or supply shift and new equilibrium', items: [
    G('new-point', function () {
      var e = pick(ALL_EVENTS), L = randomLetters();
      return mc('new-point', 'The market for ' + e[0] + ' starts at equilibrium E. Then ' + e[1] + '. Which point shows the new equilibrium?', PLET.slice(), PLET.indexOf(L[e[2]]),
        e[3] + ' The new equilibrium is where the new ' + (e[2].charAt(0) === 'd' ? 'demand' : 'supply') + ' curve crosses the unchanged curve: point ' + L[e[2]] + '.',
        { svg: pointsDiagram(L) });
    }, { family: 'shift-events' }),
    G('which-curve', function () {
      var e = pick(ALL_EVENTS), keys = ['dR', 'dL', 'sR', 'sL'];
      return mc('which-curve', 'You must draw the effect on the market for ' + e[0] + ' when ' + e[1] + '. Which curve should you shift, and which way?', keys.map(function (k) { return KEY_TXT[k]; }), keys.indexOf(e[2]),
        e[3] + ' Draw the new curve parallel to the old one and label it ' + (e[2].charAt(0) === 'd' ? 'D1' : 'S1') + '.');
    }, { family: 'shift-events' }),
    G('pq-labels', function () {
      var e = pick(ALL_EVENTS);
      var opts = ['P1 above Pe and Q1 to the right of Qe', 'P1 above Pe and Q1 to the left of Qe', 'P1 below Pe and Q1 to the right of Qe', 'P1 below Pe and Q1 to the left of Qe'];
      return mc('pq-labels', 'After drawing the effect on the market for ' + e[0] + ' when ' + e[1] + ', where should the new price (P1) and quantity (Q1) be labelled?', opts, PQ[e[2]], e[3] + ' ' + PQ_WHY[e[2]]);
    }, { family: 'shift-events' }),
    G('read-diagram', function () {
      var k = pick(['dR', 'dL', 'sR', 'sL']), isD = k.charAt(0) === 'd', s = k.charAt(1) === 'R' ? 3 : -3, pt = SHIFT_PT[k];
      var body = dLine(0, 'D') + sLine(0, 'S') + (isD ? dLine(s, 'D1', HI, true) : sLine(s, 'S1', HI, true));
      var svgS = graph({ yl: 'Price ($)', xl: 'Quantity', body: body, guides: [[5, 5], [pt[0], pt[1]]], yt: [[5, 'Pe'], [pt[1], 'P1']], xt: [[5, 'Qe'], [pt[0], 'Q1']], label: 'Demand and supply diagram with one curve shifted and the old and new equilibrium marked' });
      return mc('read-diagram', 'What does this diagram show has happened to the equilibrium?', PQ_OPTS.slice(), PQ[k],
        'The ' + (isD ? 'demand' : 'supply') + ' curve has shifted ' + (s > 0 ? 'right' : 'left') + ' to ' + (isD ? 'D1' : 'S1') + '. ' + PQ_WHY[k], { svg: svgS });
    }),
    mc('new-point', 'The market for lentils starts at E. A popular television chef praises lentils as a healthy food. Which point shows the new equilibrium?', PLET.slice(), 0,
      'Tastes change in favour of lentils, so demand shifts right to D1. The new equilibrium is where D1 crosses S: point W, with a higher price and quantity.', { svg: fixedPointsSvg(), family: 'fixed-goods-points' }),
    mc('new-point', 'The market for bicycles starts at E. The price of steel used to make frames rises sharply. Which point shows the new equilibrium?', PLET.slice(), 3,
      'Higher input costs shift supply left to S2. The new equilibrium is where S2 crosses D: point Z, with a higher price and lower quantity.', { svg: fixedPointsSvg(), family: 'fixed-goods-points' }),
    mc('new-point', 'The market for floor tiles starts at E. New machinery speeds up tile production. Which point shows the new equilibrium?', PLET.slice(), 2,
      'Better technology shifts supply right to S1. The new equilibrium is where S1 crosses D: point Y, with a lower price and higher quantity.', { svg: fixedPointsSvg(), family: 'fixed-goods-points' }),
    mc('new-point', 'The market for skateboards in a small town starts at E. Many young families move away. Which point shows the new equilibrium?', PLET.slice(), 1,
      'Fewer young buyers is a demographic change, so demand shifts left to D2. The new equilibrium is where D2 crosses S: point X, with a lower price and quantity.', { svg: fixedPointsSvg(), family: 'fixed-goods-points' }),
    mc('labelling', 'After shifting a curve, where should the new equilibrium price be marked?',
      ['Read across from where the new curve crosses the unchanged curve', 'Read across from where the old curves crossed', 'At the top of the new curve', 'Where the new curve meets the quantity axis'], 0,
      'The new equilibrium is the crossing of the new curve with the curve that did not move. Draw a dashed line from there to the price axis and label it P1.'),
    mc('labelling', 'How should the new demand curve be labelled after an increase in demand?',
      ['D1', 'S1', 'P1', 'Q1'], 0,
      'The new demand curve is labelled D1. P1 and Q1 label the new price and quantity on the axes, and S1 would be a new supply curve.'),
    mc('labelling', 'Where should the dashed lines for the new equilibrium be drawn?',
      ['From the new crossing point across to the price axis and down to the quantity axis', 'From the old crossing point across to the price axis only', 'Along the new curve from one axis to the other', 'From the origin to the new crossing point'], 0,
      'Dashed lines from the new equilibrium show where to label P1 on the price axis and Q1 on the quantity axis.'),
    mc('labelling', 'How should a shifted curve be drawn?',
      ['Parallel to the old curve, on the correct side, and labelled', 'Crossing the old curve at the old equilibrium', 'As a horizontal line at the new price', 'With the old curve rubbed out completely'], 0,
      'Draw the new curve parallel to the original so the shift is clear, and label it D1 or S1. Keep the original curve.'),
    mc('labelling', 'What label goes on the quantity axis at the new equilibrium?',
      ['Q1', 'Qe', 'D1', 'P1'], 0,
      'Qe marks the original equilibrium quantity. The new equilibrium quantity, read down from the new crossing point, is labelled Q1.'),
    mu('labelling', 'A question asks you to draw the effect of an event on a market. Which features earn marks? Select all that apply.',
      ['The correct curve shifted the correct way, labelled', 'The new equilibrium price labelled on the price axis', 'The new equilibrium quantity labelled on the quantity axis', 'Both curves shifted to the right', 'The original curves removed from the diagram'], [0, 1, 2],
      'The three marks are for a correctly shifted and labelled curve, the new price and the new quantity. Only one curve should move.'),
    mc('spot-error', 'A student shows a rise in incomes by shifting the supply curve of restaurant meals. What is wrong?',
      ['Income affects buyers, so the demand curve should shift', 'Income affects costs, so supply should shift left', 'Both curves should be shifted together', 'Nothing; income always shifts supply'], 0,
      'Income changes how much consumers can afford, so it shifts demand, here to the right.'),
    mc('spot-error', 'A student shows a fall in the price of a complement by shifting demand to the left. What should the drawing show?',
      ['Demand shifting to the right', 'Supply shifting to the right', 'Supply shifting to the left', 'A movement along the demand curve'], 0,
      'A cheaper complement means more of it is used, so more of the other good is wanted: demand shifts right.'),
    mc('spot-error', 'A student marks P1 at the old equilibrium after shifting the demand curve. Which mark is lost?',
      ['The mark for the new equilibrium price', 'The mark for the shifted curve', 'The mark for the new equilibrium quantity', 'No mark is lost'], 0,
      'P1 must be read from the new crossing point. Marking it at the old crossing gives no new price, so that mark is lost.'),
    mc('spot-error', 'Bakery workers’ wages rise. Which curve or curves should be shifted on a diagram of the bread market?',
      ['Only supply, to the left', 'Only demand, to the left', 'Both supply and demand, to the left', 'Only supply, to the right'], 0,
      'Wages are a cost of production, so only supply shifts, to the left. Demand for bread is not directly affected.'),
    mc('pq-labels', 'Supply shifts to the left. Where should P1 and Q1 be compared with Pe and Qe?',
      ['P1 above Pe; Q1 to the left of Qe', 'P1 below Pe; Q1 to the right of Qe', 'P1 above Pe; Q1 to the right of Qe', 'P1 below Pe; Q1 to the left of Qe'], 0,
      'A leftward supply shift moves up along the demand curve, so price rises and quantity falls.'),
    mc('pq-labels', 'Demand shifts to the left. Where should P1 and Q1 be compared with Pe and Qe?',
      ['P1 below Pe; Q1 to the left of Qe', 'P1 above Pe; Q1 to the left of Qe', 'P1 below Pe; Q1 to the right of Qe', 'P1 above Pe; Q1 to the right of Qe'], 0,
      'A leftward demand shift moves down along the supply curve, so both price and quantity fall.'),
    mc('which-curve', 'A new tax is placed on each packet of crisps. Which drawing is correct?',
      ['S shifts left to S1; P1 is higher; Q1 is lower', 'D shifts left to D1; P1 is lower; Q1 is lower', 'S shifts right to S1; P1 is lower; Q1 is higher', 'D shifts right to D1; P1 is higher; Q1 is higher'], 0,
      'An indirect tax raises producers’ costs, so supply shifts left. The new equilibrium has a higher price and lower quantity.'),
    mc('which-curve', 'The price of coffee rises. Which drawing is correct for the market for tea?',
      ['D shifts right to D1; P1 is higher; Q1 is higher', 'S shifts right to S1; P1 is lower; Q1 is higher', 'D shifts left to D1; P1 is lower; Q1 is lower', 'S shifts left to S1; P1 is higher; Q1 is lower'], 0,
      'Coffee is a substitute for tea. Dearer coffee pushes buyers to tea, so tea demand shifts right, raising price and quantity.'),
    mu('which-curve', 'Which of these events require you to shift the <b>demand</b> curve? Select all that apply.',
      ['A rise in consumers’ incomes', 'A rise in the population', 'A rise in the price of a substitute', 'A rise in the cost of raw materials', 'A spell of bad weather for farmers'], [0, 1, 2],
      'Income, population and the prices of related goods affect buyers, so they shift demand. Costs and weather affect producers, so they shift supply.')
  ] };

  // =====================================================================
  // ECO-T12-19 Draw a shift in a labour market diagram
  // =====================================================================
  var L_EVENTS = [
    ['the retirement age is raised from 64 to 67', 'sR', 'More older people stay in work, so the supply of labour shifts right.'],
    ['the school-leaving age is lowered from 18 to 16', 'sR', 'Young people can join the workforce earlier, so the supply of labour shifts right.'],
    ['many working-age people migrate into the country', 'sR', 'Immigration adds workers, so the supply of labour shifts right.'],
    ['free childcare lets many more parents take paid work', 'sR', 'More parents are available to work, so the supply of labour shifts right.'],
    ['the school-leaving age is raised from 16 to 18', 'sL', 'Young people stay in education longer, so the supply of labour shifts left.'],
    ['the retirement age is lowered from 66 to 62', 'sL', 'Older workers leave the workforce earlier, so the supply of labour shifts left.'],
    ['many young workers emigrate to find jobs abroad', 'sL', 'Emigration removes workers, so the supply of labour shifts left.'],
    ['firms’ sales boom and they want to expand output', 'dR', 'Firms need more workers at every wage, so the demand for labour shifts right.'],
    ['a deep recession cuts firms’ sales', 'dL', 'Firms need fewer workers at every wage, so the demand for labour shifts left.']];
  var L_KEY = { dR: 'Demand for labour shifts right', dL: 'Demand for labour shifts left', sR: 'Supply of labour shifts right', sL: 'Supply of labour shifts left' };
  var WQ_OPTS = ['Wage rate rises and employment rises', 'Wage rate rises and employment falls', 'Wage rate falls and employment rises', 'Wage rate falls and employment falls'];
  var WQ_WHY = { dR: 'Labour demand shifts right along the unchanged supply curve, so the wage rate and employment both rise.', dL: 'Labour demand shifts left, so the wage rate and employment both fall.', sR: 'Labour supply shifts right along the unchanged demand curve, so the wage rate falls and employment rises.', sL: 'Labour supply shifts left, so the wage rate rises and employment falls.' };
  var LAB_LABELS = { d: 'D', s: 'S', yl: 'Wage rate ($)', xl: 'Quantity of workers', what: 'Labour market diagram' };
  function labourPointsFixed() { return pointsDiagram({ dR: 'W', dL: 'X', sR: 'Y', sL: 'Z' }, LAB_LABELS); }

  B['ECO-T12-19'] = { title: 'Draw a shift in a labour market diagram', items: [
    G('which-curve', function () {
      var e = pick(L_EVENTS), keys = ['dR', 'dL', 'sR', 'sL'];
      return mc('which-curve', 'In ' + pick(COUNTRIES) + ', ' + e[0] + '. Which shift should you draw on the labour market diagram?', keys.map(function (k) { return L_KEY[k]; }), keys.indexOf(e[1]), e[2]);
    }),
    G('new-point', function () {
      var e = pick(L_EVENTS), L = randomLetters();
      return mc('new-point', 'The labour market starts at equilibrium E. Then ' + e[0] + '. Which point shows the new equilibrium wage rate and quantity of workers?', PLET.slice(), PLET.indexOf(L[e[1]]),
        e[2] + ' The new equilibrium is where the new curve crosses the unchanged one: point ' + L[e[1]] + '.', { svg: pointsDiagram(L, LAB_LABELS) });
    }),
    G('wage-employment', function () {
      var e = pick(L_EVENTS);
      return mc('wage-employment', 'In a country’s labour market, ' + e[0] + '. What happens to the equilibrium wage rate and the quantity of workers employed?', WQ_OPTS.slice(), PQ[e[1]], e[2] + ' ' + WQ_WHY[e[1]]);
    }),
    G('wage-employment', function () {
      var c = pick(COUNTRIES), up = Math.random() < 0.5, kind = pick(['school', 'retire']);
      var txt, key;
      if (kind === 'school') { txt = (up ? 'raises the school-leaving age from 16 to 18' : 'lowers the school-leaving age from 18 to 16'); key = up ? 'sL' : 'sR'; }
      else { txt = (up ? 'raises the retirement age from ' + rint(60, 63) + ' to ' + rint(65, 68) : 'lowers the retirement age from ' + rint(66, 68) + ' to ' + rint(60, 63)); key = up ? 'sR' : 'sL'; }
      var opts = ['S1 to the left of S; W1 above We; Q1 left of Qe', 'S1 to the right of S; W1 below We; Q1 right of Qe', 'D1 to the right of D; W1 above We; Q1 right of Qe', 'D1 to the left of D; W1 below We; Q1 left of Qe'];
      return mc('wage-employment', 'The government of ' + c + ' ' + txt + '. Which drawing on the labour market diagram is correct?', opts, key === 'sL' ? 0 : 1,
        (key === 'sL' ? 'Fewer people are available to work, so labour supply shifts left: the wage rate rises (W1 above We) and fewer workers are employed (Q1 left of Qe).' : 'More people are available to work, so labour supply shifts right: the wage rate falls (W1 below We) and more workers are employed (Q1 right of Qe).') + ' The demand for labour does not move.');
    }),
    G('read-diagram', function () {
      var wk = pick([1, 2, 3, 4]), right = Math.random() < 0.5, pt = right ? [6, 4] : [4, 6];
      var body = dLine(0, 'D') + sLine(0, 'S') + sLine(right ? 2 : -2, 'S1', HI, true);
      var svgS = graph({ yl: 'Wage rate ($ per hour)', xl: 'Quantity of workers', body: body, yt: [[4, '$' + 4 * wk], [5, '$' + 5 * wk], [6, '$' + 6 * wk]], pts: [[5, 5, 'E', INK]], label: 'Labour market diagram showing labour supply moving from S to S1' });
      return nm('read-diagram', 'The diagram shows a labour market. Labour supply moves from S to S1. What is the new equilibrium wage rate? Give your answer in $ per hour.', pt[1] * wk, '$',
        'S1 crosses the demand curve at a wage of $' + pt[1] * wk + ' per hour, ' + (right ? 'below' : 'above') + ' the old wage of $' + 5 * wk + '. Employment ' + (right ? 'rises' : 'falls') + ' as the equilibrium moves along the demand curve.', { svg: svgS });
    }),
    mc('axes', 'On a labour market diagram, what goes on the vertical axis?',
      ['The wage rate', 'The price of the product', 'The quantity of workers', 'The firm’s profit'], 0,
      'The wage rate is the price of labour, so it goes on the vertical axis.'),
    mc('axes', 'On a labour market diagram, what goes on the horizontal axis?',
      ['The quantity of workers employed', 'The wage rate', 'The quantity of goods produced', 'The number of firms'], 0,
      'The horizontal axis shows how many workers are employed (the quantity of labour).'),
    mc('axes', 'Where is the equilibrium wage rate on a labour market diagram?',
      ['Where the demand for labour and supply of labour curves cross', 'Where the supply of labour curve meets the wage axis', 'At the highest wage on the demand for labour curve', 'Where the demand for labour curve meets the quantity axis'], 0,
      'At the crossing point the number of workers firms want equals the number willing to work, giving We and Qe.'),
    mc('axes', 'Why does the supply of labour curve slope upwards?',
      ['Higher wage rates attract more people to offer their work', 'Firms want more workers when wages rise', 'Higher wages reduce the number of people of working age', 'Workers prefer lower wages'], 0,
      'A higher wage makes working more attractive, so more people are willing to work, or to work more hours.'),
    mc('axes', 'Why does the demand for labour curve slope downwards?',
      ['Firms hire more workers when the wage rate is lower', 'Workers supply more labour when wages fall', 'Higher wages make firms hire more workers', 'The population falls as wages fall'], 0,
      'Workers are a cost to firms. When each worker is cheaper, firms can afford to employ more.'),
    mc('new-point', 'The labour market for nurses in a city starts at E. A large new hospital opens. Which point shows the new equilibrium?', PLET.slice(), 0,
      'The hospital needs more nurses at every wage, so the demand for labour shifts right to D1. The new equilibrium (point W) has a higher wage and more nurses employed.', { svg: labourPointsFixed(), family: 'fixed-labour-points' }),
    mc('new-point', 'A country’s labour market starts at E. Free childcare lets many more parents take paid jobs. Which point shows the new equilibrium?', PLET.slice(), 2,
      'More people are available to work, so the supply of labour shifts right to S1. The new equilibrium (point Y) has a lower wage and more workers employed.', { svg: labourPointsFixed(), family: 'fixed-labour-points' }),
    mc('new-point', 'A country’s labour market starts at E. Many skilled workers emigrate. Which point shows the new equilibrium?', PLET.slice(), 3,
      'Fewer people are available to work, so the supply of labour shifts left to S2. The new equilibrium (point Z) has a higher wage and fewer workers employed.', { svg: labourPointsFixed(), family: 'fixed-labour-points' }),
    mc('wage-employment', 'A higher school-leaving age is drawn on a labour market diagram. Which result is correct?',
      ['Supply of labour shifts left; wage rises; employment falls', 'Supply of labour shifts right; wage falls; employment rises', 'Demand for labour shifts left; wage falls; employment falls', 'Demand for labour shifts right; wage rises; employment rises'], 0,
      'Young people stay in education, so fewer can work. Supply shifts left, the wage rate rises and fewer workers are employed.'),
    mc('wage-employment', 'Many working-age people migrate into a country. What is the effect on the equilibrium in its labour market?',
      ['Wage rate falls; employment rises', 'Wage rate rises; employment falls', 'Wage rate rises; employment rises', 'Wage rate falls; employment falls'], 0,
      'Immigration shifts labour supply right. Along the unchanged demand curve, the wage rate falls and more workers are employed.'),
    mc('wage-employment', 'Power stations close and demand for coal collapses. What happens in the labour market for coal miners?',
      ['Demand for labour shifts left; wage and employment fall', 'Supply of labour shifts left; wage rises; employment falls', 'Demand for labour shifts right; wage and employment rise', 'Supply of labour shifts right; wage falls; employment rises'], 0,
      'Demand for miners comes from demand for coal. Less coal is wanted, so firms need fewer miners at every wage.'),
    mc('wage-employment', 'Labour supply shifts to the right. Where should W1 and Q1 be compared with We and Qe?',
      ['W1 below We; Q1 to the right of Qe', 'W1 above We; Q1 to the left of Qe', 'W1 above We; Q1 to the right of Qe', 'W1 below We; Q1 to the left of Qe'], 0,
      'More workers available at every wage moves the equilibrium down along the demand for labour curve: a lower wage and more employment.'),
    mc('spot-error', 'A student shows a higher retirement age by shifting the demand for labour curve. What is wrong?',
      ['It changes who is available to work, so supply should shift', 'It changes firms’ costs, so supply should shift left', 'Both curves should be shifted', 'Nothing; the retirement age affects demand'], 0,
      'The retirement age changes how many people are willing and able to work, so the supply of labour shifts (here to the right).'),
    mc('spot-error', 'A student shifts labour supply to the right for a higher school-leaving age. What should the drawing show?',
      ['Labour supply shifting to the left', 'Labour demand shifting to the right', 'Labour demand shifting to the left', 'A movement along the labour supply curve'], 0,
      'A higher school-leaving age keeps young people in education, so fewer are available to work: supply shifts left.'),
    mc('labelling', 'After shifting labour supply, how should the new wage be labelled?',
      ['W1 on the wage axis, read across from the new crossing point', 'W1 on the quantity axis, read down from the new crossing point', 'P1 on the price axis, read across from the old crossing point', 'S1 on the wage axis'], 0,
      'The new wage is read across from where the new curve crosses the unchanged curve and labelled W1 on the wage axis.'),
    mu('labelling', 'A question asks you to draw the effect of a lower retirement age on a labour market. Which features earn marks? Select all that apply.',
      ['Labour supply shifted left and labelled', 'A higher wage rate labelled on the wage axis', 'A lower quantity of workers labelled', 'Labour demand shifted to the left', 'Price written on the vertical axis'], [0, 1, 2],
      'A lower retirement age reduces the workforce, so supply shifts left; the marks are for that labelled shift, the higher wage and the lower employment.'),
    mc('labelling', 'How should the new labour supply curve be drawn?',
      ['Parallel to the old curve and labelled S1', 'Crossing the old curve at the old equilibrium', 'As a vertical line at the new quantity', 'On top of the demand for labour curve'], 0,
      'Draw the new curve parallel to the old one, on the correct side, and label it so the examiner can see the shift.')
  ] };
})();
