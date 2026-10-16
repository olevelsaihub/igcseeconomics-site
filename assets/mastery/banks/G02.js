/* Group G02 mastery bank: Price, supply and income elasticity; Revenue, costs and profit. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- small helpers ----------
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sample(a, n) { return shuffle(a).slice(0, n); }
  function dpOf(x) { for (var d = 0; d < 4; d++) { var m = x * Math.pow(10, d); if (Math.abs(m - Math.round(m)) < 1e-7) return d; } return 4; }
  // Number with thousands separators and a true minus sign; dp defaults to the fewest needed.
  function fmt(n, dp) {
    if (dp == null) dp = dpOf(n);
    var s = Math.abs(n).toFixed(dp).split('.');
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (n < 0 && Number(Math.abs(n).toFixed(dp)) !== 0 ? '−' : '') + s.join('.');
  }
  function d2(x) { return fmt(x, 2); }
  // Money: whole amounts without cents, otherwise 2 dp. A loss shows as -$500.
  function cash(n, cur) { cur = cur || '$'; var dp = dpOf(n) === 0 ? 0 : 2; return (n < 0 ? '−' : '') + cur + fmt(Math.abs(n), dp); }
  function cash2(n, cur) { cur = cur || '$'; return (n < 0 ? '−' : '') + cur + fmt(Math.abs(n), 2); }
  function pc(x) { return fmt(Math.abs(x)) + '%'; }                    // size of a percentage
  function sg(x) { return (x > 0 ? '+' : '') + fmt(x) + '%'; }           // signed percentage: +8%, -4.5%
  function sn(x) { return (x > 0 ? '+' : '') + fmt(x); }                 // signed number for working
  function aPc(x) { var s = fmt(Math.abs(x)); return (/^8/.test(s) || /^1[18](\D|$)/.test(s) ? 'an ' : 'a ') + pc(x); } // 'an 8%', 'a 10%'
  function mc(skill, q, options, answer, why, extra) { var o = { skill: skill, kind: 'mcq', q: q, options: options, answer: answer, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function mu(skill, q, options, answers, why, extra) { var o = { skill: skill, kind: 'multi', q: q, options: options, answers: answers, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function tbl(head, rows) {
    return '<table class="mc-table"><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  // Keeps the first occurrence of each option text; used by numerical multiple-choice generators.
  function distinct(a) { var seen = {}; return a.every(function (s) { var k = String(s); if (seen[k]) return false; seen[k] = 1; return true; }); }

  // ---------- diagrams ----------
  var INK = '#303a4c', HI = '#e4464f', BLUE = '#195d9b', GREY = '#9aa5b8';
  function r1(x) { return Math.round(x * 10) / 10; }
  function L(x1, y1, x2, y2, c, w, dash) { return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (c || INK) + '" stroke-width="' + (w || 1.5) + '"' + (dash ? ' stroke-dasharray="4 3"' : '') + '/>'; }
  function T(x, y, s, o) { o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" font-size="' + (o.size || 12) + '" fill="' + (o.c || INK) + '" text-anchor="' + (o.a || 'start') + '" font-family="sans-serif"' + (o.b ? ' font-weight="bold"' : '') + '>' + s + '</text>'; }
  function dot(x, y, c) { return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="3.5" fill="' + (c || HI) + '"/>'; }
  // Line shapes in a full-size plot (origin 50,195): elastic/inelastic demand and supply, vertical, horizontal.
  var GEO = {
    De: [70, 100, 290, 140], Di: [150, 30, 190, 185], Se: [70, 150, 290, 105], Si: [150, 185, 190, 30],
    v: [175, 25, 175, 192], h: [55, 110, 292, 110], Deq: [70, 35, 230, 190]
  };
  function lerp(g, t) { return [g[0] + (g[2] - g[0]) * t, g[1] + (g[3] - g[1]) * t]; }
  /* o.g: shape key; o.label: curve label; o.aria; o.lab: {pU, pL, qU, qL} labels for the upper and lower marked points;
     o.only: 'P' to mark the price axis only; o.color */
  function diagram(o) {
    var g = GEO[o.g], s = '<svg viewBox="0 0 320 232" role="img" aria-label="' + o.aria + '" xmlns="http://www.w3.org/2000/svg">';
    s += L(50, 195, 300, 195, INK, 1.5) + L(50, 195, 50, 12, INK, 1.5);
    s += T(56, 18, 'Price ($)', { size: 11 }) + T(300, 226, 'Quantity (units)', { size: 11, a: 'end' }) + T(42, 208, '0', { size: 11, a: 'end' });
    s += L(g[0], g[1], g[2], g[3], o.color || BLUE, 2.5);
    var flat = Math.abs(g[3] - g[1]) < 0.5 * Math.abs(g[2] - g[0]);
    var at = flat ? (g[0] > g[2] ? [g[0], g[1]] : [g[2], g[3]]) : (g[1] <= g[3] ? [g[0], g[1]] : [g[2], g[3]]);
    s += T(at[0] + (flat ? 5 : 8), at[1] + (flat ? 4 : -2), o.label || '', { b: true, c: o.color || BLUE });
    if (o.lab) {
      var a = lerp(g, 0.3), b = lerp(g, 0.7), U = a[1] <= b[1] ? a : b, Lw = a[1] <= b[1] ? b : a;
      if (o.g === 'h') { U = a; Lw = b; }
      var close = Math.abs(U[0] - Lw[0]) < 45, leftX = Math.min(U[0], Lw[0]);
      [[U, o.lab.pU, o.lab.qU], [Lw, o.lab.pL, o.lab.qL]].forEach(function (p) {
        s += L(50, p[0][1], p[0][0], p[0][1], GREY, 1.2, true);
        if (p[1]) s += T(45, p[0][1] + 4, p[1], { size: 11, a: 'end', c: HI });
        if (o.only !== 'P') {
          s += L(p[0][0], p[0][1], p[0][0], 195, GREY, 1.2, true);
          // Close quantity marks (steep curves): push the two labels apart so they never overlap.
          var isLeft = p[0][0] === leftX, qx = close ? p[0][0] + (isLeft ? 2 : -2) : p[0][0], qa = close ? (isLeft ? 'end' : 'start') : 'middle';
          if (p[2]) s += T(qx, 211, p[2], { size: 11, a: qa, c: HI });
        }
        s += dot(p[0][0], p[0][1]);
      });
    }
    return s + '</svg>';
  }
  // 2 x 2 grid of small diagrams labelled Diagram A to Diagram D. kinds: array of 4 keys from PGEO.
  var PGEO = {
    De: [40, 60, 158, 85], Di: [85, 18, 103, 120], Se: [40, 102, 158, 72], Si: [85, 120, 103, 18],
    v: [97, 18, 97, 123], h: [36, 70, 158, 70]
  };
  function panels(kinds, aria) {
    var s = '<svg viewBox="0 0 340 312" role="img" aria-label="' + aria + '" xmlns="http://www.w3.org/2000/svg">';
    kinds.forEach(function (k, i) {
      var ox = (i % 2) * 170, oy = Math.floor(i / 2) * 156, g = PGEO[k.g];
      s += '<g transform="translate(' + ox + ',' + oy + ')">';
      s += L(30, 125, 162, 125, INK, 1.2) + L(30, 125, 30, 8, INK, 1.2);
      s += T(34, 14, 'Price ($)', { size: 9 }) + T(162, 138, 'Quantity (units)', { size: 9, a: 'end' });
      s += L(g[0], g[1], g[2], g[3], BLUE, 2.2);
      var flat = Math.abs(g[3] - g[1]) < 0.5 * Math.abs(g[2] - g[0]);
      var at = flat ? [g[2], g[3]] : (g[1] <= g[3] ? [g[0], g[1]] : [g[2], g[3]]);
      s += T(at[0] + (flat ? 1 : 6), at[1] + (flat ? -5 : 2), k.label, { size: 10, b: true, c: BLUE });
      [0.3, 0.7].forEach(function (t) {
        var p = lerp(g, t);
        s += L(30, p[1], p[0], p[1], GREY, 1, true) + L(p[0], p[1], p[0], 125, GREY, 1, true);
      });
      s += T(96, 152, 'Diagram ' + 'ABCD'.charAt(i), { size: 11, a: 'middle', b: true });
      s += '</g>';
    });
    return s + '</svg>';
  }
  // Three demand (or supply) curves through one point X with different slopes, labelled with the given letters.
  function throughX(kind, letters, aria) {
    var X = [160, 110], s = '<svg viewBox="0 0 320 232" role="img" aria-label="' + aria + '" xmlns="http://www.w3.org/2000/svg">';
    s += L(50, 195, 300, 195, INK, 1.5) + L(50, 195, 50, 12, INK, 1.5);
    s += T(56, 18, 'Price ($)', { size: 11 }) + T(300, 226, 'Quantity (units)', { size: 11, a: 'end' }) + T(42, 208, '0', { size: 11, a: 'end' });
    // slopes: flat, medium, steep (svg y grows downwards; demand slopes down = positive m here)
    var specs = kind === 'D'
      ? [[0.18, 70, 285], [0.8, 75, 255], [4, 137.5, 180]]
      : [[-0.18, 70, 285], [-0.8, 75, 255], [-4, 140, 182.5]];
    specs.forEach(function (sp, i) {
      var m = sp[0], x1 = sp[1], x2 = sp[2], y1 = X[1] + m * (x1 - X[0]), y2 = X[1] + m * (x2 - X[0]);
      s += L(x1, y1, x2, y2, BLUE, 2.2);
      var lx = kind === 'D' ? x1 - 4 : x2 + 4, ly = kind === 'D' ? y1 + 4 : y2 + 4;
      if (kind === 'D' && i === 0) { lx = x2 + 4; ly = y2 + 4; }
      if (kind === 'S' && i === 0) { lx = x2 + 4; ly = y2 - 2; }
      s += T(lx, ly, letters[i], { b: true, c: BLUE, a: (kind === 'D' && i > 0) ? 'end' : 'start' });
    });
    s += dot(X[0], X[1]) + T(X[0] + 8, X[1] - 6, 'X', { b: true, c: HI });
    return s + '</svg>';
  }

  var FIRMS = ['Amira’s henna-art stall', 'Tomas’s bicycle-repair shop', 'Leila’s maths tutoring service', 'Kofi’s juice bar', 'Mei’s nail studio', 'Arjun’s phone-case kiosk', 'Sana’s tailoring service', 'Diego’s food truck', 'Hana’s calligraphy classes', 'Rashid’s car-wash bay'];
  var PRODUCTS = ['bottled iced tea', 'cinema tickets', 'yoga classes', 'phone chargers', 'sourdough loaves', 'bicycle helmets', 'printer ink', 'sun cream', 'gym memberships', 'scented candles'];
  var COUNTRIES = ['Corvalia', 'Tarsova', 'Pellara', 'Veridia', 'Mondova', 'Ostrana', 'Kelmar', 'Brevia'];

  // =====================================================================
  // ECO-T11-12 Price elasticity of demand: meaning, values and uses
  // =====================================================================
  var PED_LABELS = ['Perfectly price inelastic', 'Price inelastic', 'Unitary price elasticity', 'Price elastic', 'Perfectly price elastic'];
  B['ECO-T11-12'] = { title: 'Price elasticity of demand: meaning, values and uses', items: [
    mc('define', 'Which of the following is the meaning of price elasticity of demand (PED)?',
      ['The responsiveness of quantity demanded to a change in the price of the good',
       'The responsiveness of quantity demanded to a change in consumers’ incomes',
       'The responsiveness of quantity supplied to a change in the price of the good',
       'The change in the price of a good caused by a rise in the demand for it'], 0,
      'PED compares the change in <b>quantity demanded</b> with the change in the good’s <b>own price</b>. Income in place of price is YED; quantity supplied is PES.'),
    mc('define', 'Which formula is used to calculate price elasticity of demand (PED)?',
      ['% change in quantity demanded ÷ % change in price', '% change in price ÷ % change in quantity demanded',
       '% change in quantity supplied ÷ % change in price', '% change in quantity demanded ÷ % change in income'], 0,
      'Quantity demanded goes on top and price on the bottom. Turning it upside down is the most common error; the other two are the PES and YED formulas.'),
    { skill: 'classify-value', gen: function () {
      var c = pick([{ v: pick([-0.1, -0.25, -0.4, -0.6, -0.75, -0.9]), k: 1 }, { v: pick([-1.2, -1.5, -1.8, -2.4, -3.1]), k: 3 }, { v: -1, k: 2 }, { v: 0, k: 0 }]);
      var a = fmt(Math.abs(c.v));
      var why = [
        'A PED of 0 means quantity demanded does not change at all when the price changes, so demand is perfectly price inelastic.',
        'Ignore the minus sign: the size ' + a + ' is between 0 and 1, so quantity demanded changes by a smaller percentage than price. Demand is price inelastic.',
        'A PED of −1 means quantity demanded changes by exactly the same percentage as price. This is unitary price elasticity.',
        'Ignore the minus sign: the size ' + a + ' is greater than 1, so quantity demanded changes by a larger percentage than price. Demand is price elastic.'][c.k];
      return { kind: 'mcq', q: 'A product has a price elasticity of demand (PED) of ' + fmt(c.v) + '. Which term describes the demand for it?', options: PED_LABELS.slice(), answer: c.k, why: why };
    } },
    { skill: 'classify-value', gen: function () {
      var names = sample(['Lumo', 'Vexa', 'Corra', 'Bryte', 'Kinto', 'Zappa'], 2), el = pick([-1.3, -1.6, -2.2, -2.8, -3.5]), inel = pick([-0.2, -0.35, -0.5, -0.7, -0.85]);
      var firstEl = Math.random() < 0.5, v1 = firstEl ? el : inel, v2 = firstEl ? inel : el;
      var opts = ['Demand for ' + names[0] + ' is price elastic and demand for ' + names[1] + ' is price inelastic',
        'Demand for ' + names[0] + ' is price inelastic and demand for ' + names[1] + ' is price elastic',
        'Demand for both ' + names[0] + ' and ' + names[1] + ' is price elastic',
        'Demand for both ' + names[0] + ' and ' + names[1] + ' is price inelastic'];
      return { kind: 'mcq', q: 'The PED for the soft drink ' + names[0] + ' is ' + fmt(v1) + ' and for the soft drink ' + names[1] + ' it is ' + fmt(v2) + '. Which statement is correct?',
        options: opts, answer: firstEl ? 0 : 1,
        why: 'Ignore the minus signs and compare the sizes with 1. ' + fmt(Math.abs(el)) + ' is above 1 (elastic); ' + fmt(Math.abs(inel)) + ' is below 1 (inelastic). −' + fmt(Math.abs(el)) + ' is not “smaller” than −1 in elasticity terms.' };
    } },
    { skill: 'classify-value', gen: function () {
      var inel = sample([-0.05, -0.3, -0.45, -0.7, -0.85, -0.95], rint(2, 3)), el = sample([-1.05, -1.3, -1.6, -2, -2.75, -4], 2);
      var all = shuffle(inel.map(function (v) { return [v, 1]; }).concat(el.map(function (v) { return [v, 0]; })).concat([[-1, 0]]));
      return { kind: 'multi', q: 'Which of these PED values show <b>price inelastic</b> demand?', options: all.map(function (x) { return fmt(x[0]); }),
        answers: all.map(function (x, i) { return x[1] ? i : -1; }).filter(function (i) { return i >= 0; }),
        why: 'Ignore the minus sign. Sizes between 0 and 1 (' + inel.map(function (v) { return fmt(v); }).join(', ') + ') are price inelastic. −1 is unitary and sizes above 1 are price elastic.' };
    } },
    mc('classify-value', 'Demand for a product is <b>price inelastic</b>. What does this mean?',
      ['When price changes, quantity demanded changes by a smaller percentage than price',
       'When price changes, quantity demanded does not change at all',
       'When price changes, quantity demanded changes by a larger percentage than price',
       'When price changes, quantity demanded changes by exactly the same percentage'], 0,
      'Inelastic does not mean “no change”. Quantity still changes, but by a smaller percentage than price. No change at all is the special case of perfectly price inelastic demand (PED = 0).'),
    mc('classify-value', 'Which statement best describes <b>perfectly price elastic</b> demand?',
      ['Consumers will buy any quantity at one price, but none at all if the price rises above it',
       'Quantity demanded stays exactly the same whatever happens to the price of the good',
       'Quantity demanded changes by exactly the same percentage as the change in price',
       'Quantity demanded changes by a slightly larger percentage than the change in price'], 0,
      'Perfectly price elastic demand has PED of infinity: the smallest rise in price makes quantity demanded fall to zero. The demand curve is horizontal.'),
    mc('classify-value', 'Which product is most likely to have a PED very close to 0?',
      ['Insulin for people with diabetes', 'One brand of cola among many', 'Meals at a city-centre restaurant', 'Designer trainers'], 0,
      'Insulin is a medical necessity with no close substitute, so people buy almost the same amount whatever the price. That makes demand close to perfectly price inelastic.'),
    mc('classify-value', 'A student writes: “PED for coffee pods is −1.5. This is less than −1, so demand is price inelastic.” Why is the student wrong?',
      ['The size of PED is 1.5, which is greater than 1, so demand is price elastic',
       'A PED of −1.5 is unitary, because the minus sign cancels the extra 0.5',
       'PED should be positive, so −1.5 must be a mistake in the calculation',
       'A PED of −1.5 is perfectly inelastic because the answer is negative'], 0,
      'Ignore the minus sign and look at the size. 1.5 is above 1, so quantity demanded changes by 1.5 times the percentage change in price: demand is price elastic.'),
    { skill: 'classify-value', gen: function () {
      var c = pick(['e', 'i', 'u']), p = pick([4, 5, 8, 10, 12, 20]);
      var q = c === 'u' ? p : c === 'e' ? p * pick([1.5, 2, 3]) : p * pick([0.25, 0.5]);
      var prod = pick(PRODUCTS), k = c === 'u' ? 2 : c === 'e' ? 3 : 1;
      return { kind: 'mcq', q: 'The price of ' + prod + ' rises by ' + pc(p) + ' and the quantity demanded falls by ' + pc(q) + '. Which term describes the demand?',
        options: PED_LABELS.slice(0, 4), answer: k,
        why: 'Compare the percentage changes. Quantity demanded changed by ' + pc(q) + ' and price by ' + pc(p) + (c === 'u' ? ': the same percentage, so PED = −1 (unitary).' : c === 'e' ? ': quantity changed by more than price, so PED is above 1 in size (elastic).' : ': quantity changed by less than price, so PED is below 1 in size (inelastic).') };
    } },
    mc('determinants', 'Which of the following would make demand for a product <b>more price inelastic</b>?',
      ['There are few close substitutes for the product', 'There are many close substitutes for the product',
       'The product takes a large share of consumers’ income', 'Consumers have a long time to find alternatives'], 0,
      'With few close substitutes, consumers have nowhere to switch when the price rises, so quantity demanded falls only a little. The other three all make demand more elastic.'),
    mc('determinants', 'Pellara is a small island. One ferry company links it to the mainland, and islanders use it to reach hospital and their jobs. Why is demand for the ferry likely to be price inelastic?',
      ['There is no close substitute for the crossing, and many trips are a necessity',
       'Ferry fares take a large share of islanders’ incomes, so they notice price rises',
       'Many rival ferry firms compete on the route, so travellers can switch easily',
       'Islanders have a long time to adjust, so they always find another way across'], 0,
      'With one ferry and no other way across, islanders cannot switch, and trips to hospital and work are necessities. So a fare rise cuts quantity demanded only a little.'),
    mc('determinants', 'Why is demand for a box of matches likely to be price inelastic?',
      ['It takes a tiny share of income, so a price rise is hardly noticed',
       'It has a great many close substitutes in every supermarket',
       'It is a luxury that consumers buy only when incomes rise',
       'Its price is set by the government, so it never changes'], 0,
      'When a product takes a very small percentage of income, even a large percentage price rise costs consumers very little, so they keep buying almost the same amount.'),
    mc('determinants', 'Why does demand for petrol tend to become <b>more</b> price elastic over a longer time period?',
      ['Over time drivers can switch to electric cars, car-sharing or public transport',
       'Over time petrol becomes more of a necessity for most households',
       'Over time the supply of petrol becomes more price elastic as well',
       'Over time drivers become more used to paying a high petrol price'], 0,
      'In the short run drivers are stuck with their cars. Given time they can find substitutes, so quantity demanded responds more to the price: demand becomes more elastic.'),
    mu('determinants', 'Crunchit is one of many brands of chocolate bar in Tarsova. Which of these help to explain why demand for Crunchit is likely to be price elastic?',
      ['Many rival brands are close substitutes', 'It is not a necessity', 'Consumers have plenty of time to switch brands', 'It takes a very small share of income', 'Some consumers buy it out of habit'], [0, 1, 2],
      'Close substitutes, not being a necessity and time to switch all make consumers more responsive to price. A small share of income and habit both make demand more inelastic.'),
    { skill: 'revenue-link', gen: function () {
      var el = Math.random() < 0.5, v = el ? pick([-1.4, -1.8, -2.5, -3]) : pick([-0.2, -0.3, -0.5, -0.7]), rise = Math.random() < 0.5, p = pick([5, 8, 10, 15]);
      var prod = pick(PRODUCTS), trUp = (el && !rise) || (!el && rise);
      return { kind: 'mcq', q: 'The PED for ' + prod + ' is ' + fmt(v) + '. A firm ' + (rise ? 'raises' : 'cuts') + ' the price by ' + pc(p) + '. What is most likely to happen to its total revenue?',
        options: ['Total revenue rises', 'Total revenue falls', 'Total revenue stays the same'], answer: trUp ? 0 : 1,
        why: 'Demand is price ' + (el ? 'elastic' : 'inelastic') + ', so quantity demanded changes by a ' + (el ? 'larger' : 'smaller') + ' percentage than price. The ' + (el ? 'change in sales' : 'change in price') + ' has the bigger effect, so total revenue ' + (trUp ? 'rises' : 'falls') + '.' };
    } },
    { skill: 'revenue-link', gen: function () {
      var el = Math.random() < 0.5, cut = Math.random() < 0.5, c = pick([10, 20, 25]), q = el ? 2 * c : c / 2;
      var P1 = pick([12, 16, 20, 24, 40]), Q1 = pick([400, 800, 1200, 1600]);
      var P2 = P1 * (cut ? 1 - c / 100 : 1 + c / 100), Q2 = Q1 * (cut ? 1 + q / 100 : 1 - q / 100);
      var tr1 = P1 * Q1, tr2 = R.roundDp(P2 * Q2, 2), trUp = tr2 > tr1;
      var item = pick(['weekday cinema tickets', 'boat-trip tickets', 'climbing-wall sessions', 'museum entry tickets']);
      return { kind: 'mcq', q: 'A leisure firm changed the price of ' + item + '. Use the table to decide what this shows about price elasticity of demand.' +
          tbl(['', 'Price', 'Tickets sold per week'], [['Before', cash(P1), fmt(Q1)], ['After', cash(P2), fmt(Q2)]]),
        options: ['Demand is price elastic, because total revenue ' + (trUp ? 'rose' : 'fell') + ' when price ' + (cut ? 'fell' : 'rose'),
          'Demand is price inelastic, because total revenue ' + (trUp ? 'rose' : 'fell') + ' when price ' + (cut ? 'fell' : 'rose'),
          'Demand is price elastic, because total revenue ' + (trUp ? 'fell' : 'rose') + ' when price ' + (cut ? 'fell' : 'rose'),
          'Demand is price inelastic, because total revenue ' + (trUp ? 'fell' : 'rose') + ' when price ' + (cut ? 'fell' : 'rose')],
        answer: el ? 0 : 1,
        why: 'Total revenue went from ' + cash(P1) + ' × ' + fmt(Q1) + ' = ' + cash(tr1) + ' to ' + cash(P2) + ' × ' + fmt(Q2) + ' = ' + cash(tr2) + '. Price and total revenue moved in ' + (el ? 'opposite directions, so demand is price elastic.' : 'the same direction, so demand is price inelastic.') };
    } },
    mc('revenue-link', 'The price of bus passes in Veridia rises by 20%. PED for bus passes is −0.3. Which is the most accurate next step in the reasoning?',
      ['Quantity demanded falls by a smaller percentage than the price rise, so total revenue rises',
       'Quantity demanded falls by a larger percentage than the price rise, so total revenue falls',
       'Quantity demanded does not fall at all, because demand is price inelastic',
       'Quantity demanded rises, because PED is negative when the price goes up'], 0,
      'With PED −0.3, quantity demanded falls by about 0.3 × 20% = 6%, much less than the 20% price rise. The higher price outweighs the lost sales, so total revenue rises.'),
    mc('uses', 'Brightloaf Bakery has found that demand for its speciality bread is price inelastic. If it wants to increase total revenue, what should it do?',
      ['Raise the price of the bread', 'Lower the price of the bread', 'Keep the price of the bread unchanged'], 0,
      'With inelastic demand, a price rise reduces quantity demanded by a smaller percentage than the price rise, so total revenue increases.'),
    mc('uses', 'Zento Gym faces price elastic demand in a town with several rival gyms. It cuts its monthly fee by 10%. What is the most likely result?',
      ['Membership rises by more than 10%, so total revenue increases',
       'Membership rises by less than 10%, so total revenue falls',
       'Membership stays the same, so total revenue falls by 10%',
       'Membership falls, because a lower price suggests lower quality'], 0,
      'Elastic demand means quantity demanded changes by a larger percentage than price. Members switch from rival gyms, so sales rise by more than 10% and total revenue rises.'),
    mc('uses', 'The government of Mondova wants to raise as much revenue as possible from a new indirect tax. Which product should it tax?',
      ['Product W, with PED of −0.2', 'Product X, with PED of −1.0', 'Product Y, with PED of −1.9', 'Product Z, with PED of −3.4'], 0,
      'A tax raises the price. With the most inelastic demand (−0.2), quantity bought falls the least, so the tax is paid on the most units and raises the most revenue.'),
    mc('uses', 'Demand for sugary fizzy drinks in Ostrana is price inelastic. The government adds an indirect tax to them. What is the most likely outcome?',
      ['The tax raises a lot of revenue but consumption falls only a little',
       'The tax raises little revenue but consumption falls a great deal',
       'The tax raises little revenue and consumption stays exactly the same',
       'Consumption falls by more than the percentage rise in price'], 0,
      'With inelastic demand, the price rise from the tax cuts quantity demanded by a smaller percentage. People keep buying, so revenue is high but the fall in consumption is small.'),
    mc('uses', 'The government of Kelmar subsidises home solar panels, which lowers their price. Demand for solar panels is price elastic. What is the likely effect?',
      ['Quantity demanded rises by a larger percentage than the fall in price',
       'Quantity demanded rises by a smaller percentage than the fall in price',
       'Quantity demanded stays the same, because subsidies do not affect demand',
       'Quantity demanded falls, because the subsidy raises the price of panels'], 0,
      'A subsidy lowers the price. Because demand is price elastic, quantity demanded responds strongly, so the subsidy leads to a large rise in the number of panels bought.'),
    mc('uses', 'A phone maker plans its prices using a PED estimate of −0.6. What is the strongest reason this estimate may be a poor guide?',
      ['PED is estimated from past data and can change as tastes, incomes or rivals change',
       'PED can only be calculated for goods, so it cannot be used for phones',
       'PED is always exactly −1 for most products, so −0.6 must be wrong',
       'PED only matters to the government, not to firms setting prices'], 0,
      'A PED figure is an estimate from the past. If a rival launches a cheaper model, or tastes change, the real PED may be different, so the predicted effect on revenue may be wrong.')
  ] };

  // =====================================================================
  // ECO-CALC-03 Calculating price elasticity of demand (PED)
  // =====================================================================
  var PCT_P = [4, 5, 6, 8, 10, 12, 15, 16, 20, 25], PCT_Q = [2, 3, 5, 6, 7, 9, 11, 13, 14, 18, 22, 24, 30];
  function twoPcts() { var p, q; do { p = pick(PCT_P); q = pick(PCT_Q); } while (p === q); return [p, q]; }
  B['ECO-CALC-03'] = { title: 'Calculating price elasticity of demand (PED)', items: [
    { skill: 'ped-calc', gen: function () {
      var t = twoPcts(), ans = R.roundDp(-t[1] / t[0], 2), prod = pick(PRODUCTS);
      return { kind: 'num', q: 'The price of ' + prod + ' rises by ' + pc(t[0]) + ' and quantity demanded falls by ' + pc(t[1]) + '. Calculate the price elasticity of demand (PED). Give your answer to two decimal places and include the sign.',
        answer: ans, unit: '', tol: 0.005, display: d2(ans), why: 'PED = % change in quantity demanded ÷ % change in price = −' + t[1] + ' ÷ +' + t[0] + ' = ' + d2(ans) + '. The minus sign shows price and quantity moved in opposite directions.' };
    } },
    { skill: 'ped-calc', gen: function () {
      var t = twoPcts(), ans = R.roundDp(-t[1] / t[0], 2), f = pick(FIRMS);
      return { kind: 'num', q: f + ' cut its prices by ' + pc(t[0]) + '. The number of customers each week rose by ' + pc(t[1]) + '. Calculate the PED to two decimal places, including the sign.',
        answer: ans, unit: '', tol: 0.005, display: d2(ans), why: 'A price fall is negative and a rise in quantity is positive: PED = +' + t[1] + ' ÷ −' + t[0] + ' = ' + d2(ans) + '.' };
    } },
    { skill: 'ped-calc', gen: function () {
      var p = pick([1.5, 2.5, 3.2, 4.5, 5.6, 6.4, 7.5]), q = pick([1.8, 2.1, 3.7, 4.9, 7.3, 8.2, 9.6]), rise = Math.random() < 0.5;
      var ans = R.roundDp(-q / p, 2), prod = pick(['olive oil', 'train tickets', 'laptop bags', 'concert-hall parking', 'tennis lessons']);
      return { kind: 'num', q: 'The price of ' + prod + (rise ? ' increases by ' : ' decreases by ') + pc(p) + ', and quantity demanded ' + (rise ? 'decreases by ' : 'increases by ') + pc(q) + '. Calculate the PED to two decimal places.',
        answer: ans, unit: '', tol: 0.005, display: d2(ans), why: 'PED = ' + (rise ? '−' + fmt(q) + ' ÷ +' + fmt(p) : '+' + fmt(q) + ' ÷ −' + fmt(p)) + ' = ' + fmt(-q / p, 4) + ' = ' + d2(ans) + ' to two decimal places.' };
    } },
    { skill: 'from-data', gen: function () {
      var P0 = pick([8, 10, 12, 16, 20, 40]), pp = pick([5, 10, 15, 20, 25]), Q0 = pick([200, 400, 500, 800, 1000, 2000]), qp = pick([2, 4, 5, 6, 8, 10, 15, 20, 30, 35]);
      if (qp === pp) qp = pp + 5;
      var P1 = R.roundDp(P0 * (1 + pp / 100), 2), Q1 = Q0 * (1 - qp / 100), ans = R.roundDp(-qp / pp, 2);
      return { kind: 'num', q: 'A sandwich bar changes the price of its lunch deal. Calculate the PED to two decimal places.' + tbl(['', 'Price', 'Lunch deals sold per week'], [['Old', cash2(P0), fmt(Q0)], ['New', cash2(P1), fmt(Q1)]]),
        answer: ans, unit: '', tol: 0.005, display: d2(ans),
        why: '% change in price = (' + cash2(P1) + ' − ' + cash2(P0) + ') ÷ ' + cash2(P0) + ' × 100 = +' + pp + '%. % change in quantity = (' + fmt(Q1) + ' − ' + fmt(Q0) + ') ÷ ' + fmt(Q0) + ' × 100 = −' + qp + '%. PED = −' + qp + ' ÷ +' + pp + ' = ' + d2(ans) + '.' };
    } },
    { skill: 'from-data', gen: function () {
      var P0 = pick([20, 25, 40, 50, 80]), pp = pick([10, 20, 25]), Q0 = pick([120, 200, 240, 400, 600]), qp = pick([5, 15, 30, 40, 45, 50]);
      var P1 = P0 * (1 - pp / 100), Q1 = Q0 * (1 + qp / 100), ans = R.roundDp(-qp / pp, 2);
      return { kind: 'num', q: 'A swimming pool lowered the price of a family pass. Use the data to calculate the PED to two decimal places.' + tbl(['', 'Price of a family pass', 'Passes sold per month'], [['March', cash(P0), fmt(Q0)], ['April', cash(P1), fmt(Q1)]]),
        answer: ans, unit: '', tol: 0.005, display: d2(ans),
        why: 'Price: (' + fmt(P1) + ' − ' + fmt(P0) + ') ÷ ' + fmt(P0) + ' × 100 = −' + pp + '%. Quantity: (' + fmt(Q1) + ' − ' + fmt(Q0) + ') ÷ ' + fmt(Q0) + ' × 100 = +' + qp + '%. PED = +' + qp + ' ÷ −' + pp + ' = ' + d2(ans) + '.' };
    } },
    { skill: 'rearrange', gen: function () {
      var v = pick([-0.4, -0.5, -0.6, -0.8, -1.2, -1.5, -2, -2.5]), p = pick([4, 6, 8, 10, 12, 20]), rise = Math.random() < 0.5;
      var dp = rise ? p : -p, ans = R.roundDp(v * dp, 2), prod = pick(PRODUCTS);
      return { kind: 'num', q: 'The PED for ' + prod + ' is ' + fmt(v) + '. The price ' + (rise ? 'rises' : 'falls') + ' by ' + pc(p) + '. Calculate the percentage change in quantity demanded. Use a minus sign for a fall.',
        answer: ans, unit: '%', display: sg(ans), why: '% change in quantity demanded = PED × % change in price = ' + fmt(v) + ' × ' + sn(dp) + ' = ' + sg(ans) + '.' };
    } },
    { skill: 'rearrange', gen: function () {
      var v = pick([-0.5, -0.8, -1.5, -2, -2.5, -3]), dp = pick([-12, -10, -8, -6, -4, 4, 6, 8, 10]), dq = R.roundDp(v * dp, 2);
      var f = pick(FIRMS);
      return { kind: 'num', q: 'The PED for ' + f + ' is ' + fmt(v) + '. After a price change, the quantity demanded ' + (dq > 0 ? 'rose' : 'fell') + ' by ' + pc(dq) + '. Calculate the percentage change in price. Use a minus sign for a fall.',
        answer: dp, unit: '%', display: sg(dp), why: '% change in price = % change in quantity demanded ÷ PED = ' + sg(dq) + ' ÷ ' + fmt(v) + ' = ' + sg(dp) + '. Quantity ' + (dq > 0 ? 'rose, so price must have fallen.' : 'fell, so price must have risen.') };
    } },
    { skill: 'rearrange', gen: function () {
      var v = pick([-1.2, -1.5, -2, -2.5, -4]), target = pick([6, 10, 12, 15, 20]), dp = R.roundDp(target / v, 2);
      if (dpOf(dp) > 1) { v = -2; }
      dp = R.roundDp(target / v, 2);
      return { kind: 'num', q: 'Orvo Scooters wants to increase the number of scooters it sells by ' + pc(target) + '. PED for its scooters is ' + fmt(v) + '. By what percentage must it change its price? Use a minus sign for a cut.',
        answer: dp, unit: '%', display: sg(dp), why: 'Rearrange: % change in price = % change in quantity demanded ÷ PED = +' + target + ' ÷ ' + fmt(v) + ' = ' + sg(dp) + '. A price cut of ' + pc(dp) + ' is needed.' };
    } },
    { skill: 'rearrange', gen: function () {
      var v = pick([-0.4, -0.5, -0.8, -1.5, -2]), p = pick([5, 10, 15, 20]), Q0 = pick([1000, 2000, 3000, 4000, 6000]), rise = Math.random() < 0.5;
      var dq = v * (rise ? p : -p), Q1 = R.roundDp(Q0 * (1 + dq / 100), 0);
      return { kind: 'num', q: 'A car-park operator sells ' + fmt(Q0) + ' day tickets a month. PED for its tickets is ' + fmt(v) + '. It ' + (rise ? 'raises' : 'cuts') + ' its price by ' + pc(p) + '. How many day tickets a month will it now sell?',
        answer: Q1, unit: 'tickets', display: fmt(Q1), why: '% change in quantity = ' + fmt(v) + ' × ' + sn(rise ? p : -p) + ' = ' + sg(R.roundDp(dq, 2)) + '. New sales = ' + fmt(Q0) + ' × (1 ' + (dq < 0 ? '− ' : '+ ') + fmt(Math.abs(dq) / 100) + ') = ' + fmt(Q1) + ' tickets.' };
    } },
    { skill: 'working', gen: function () {
      var t = twoPcts(), c = d2(-t[1] / t[0]), opts = [c, d2(-t[0] / t[1]), d2(t[1] / t[0]), d2(t[0] / t[1])];
      if (!distinct(opts)) opts = [c, d2(-t[0] / t[1]), d2(t[1] / t[0]), d2(-t[1] * t[0] / 100)];
      return { kind: 'mcq', q: 'The price of a streaming plan rises by ' + pc(t[0]) + ' and the number of subscribers falls by ' + pc(t[1]) + '. What is the PED, to two decimal places?',
        options: opts, answer: 0, why: 'PED = −' + t[1] + ' ÷ +' + t[0] + ' = ' + c + '. Dividing price by quantity turns the formula upside down, and leaving out the minus sign loses the answer mark.' };
    } },
    { skill: 'working', gen: function () {
      var t = twoPcts(), rise = Math.random() < 0.5, P = rise ? '+' + t[0] : '−' + t[0], Q = rise ? '−' + t[1] : '+' + t[1];
      var P2 = rise ? '−' + t[0] : '+' + t[0];
      return { kind: 'mcq', q: 'The price of a hair-straightener ' + (rise ? 'rises' : 'falls') + ' by ' + pc(t[0]) + ' and quantity demanded ' + (rise ? 'falls' : 'rises') + ' by ' + pc(t[1]) + '. Which line of working is correct for PED?',
        options: [Q + ' ÷ ' + P, P + ' ÷ ' + Q, t[1] + ' ÷ ' + t[0], Q + ' × ' + P, Q + ' ÷ ' + P2], answer: 0,
        why: 'Quantity demanded goes on top and price on the bottom, each with its sign: ' + Q + ' ÷ ' + P + '. Signs matter, because they give PED its minus sign.' };
    } },
    { skill: 'working', gen: function () {
      var t = twoPcts(), v = -t[1] / t[0], el = Math.abs(v) > 1, c = d2(v), w = d2(-t[0] / t[1]);
      return { kind: 'mcq', q: 'After ' + aPc(t[0]) + ' price rise, sales of a board game fell by ' + pc(t[1]) + '. Which answer gives the PED <b>and</b> correctly describes demand?',
        options: [c + ', price ' + (el ? 'elastic' : 'inelastic'), c + ', price ' + (el ? 'inelastic' : 'elastic'), w + ', price ' + (el ? 'inelastic' : 'elastic'), w + ', price ' + (el ? 'elastic' : 'inelastic')], answer: 0,
        why: 'PED = −' + t[1] + ' ÷ +' + t[0] + ' = ' + c + '. Its size is ' + (el ? 'above' : 'below') + ' 1, so demand is price ' + (el ? 'elastic' : 'inelastic') + '. ' + w + ' comes from turning the formula upside down.' };
    } },
    { skill: 'working', gen: function () {
      var t = twoPcts(), err = pick(['inv', 'sign']), right = d2(-t[1] / t[0]), wrong = err === 'inv' ? d2(-t[0] / t[1]) : d2(t[1] / t[0]);
      return { kind: 'mcq', q: 'Price rose by ' + pc(t[0]) + ' and quantity demanded fell by ' + pc(t[1]) + '. A student gave the PED as ' + wrong + '. What mistake did the student make?',
        options: ['Divided the price change by the quantity change', 'Left out the minus sign', 'Multiplied the two percentages', 'Used the change in income instead of price'], answer: err === 'inv' ? 0 : 1,
        why: 'The correct PED is −' + t[1] + ' ÷ +' + t[0] + ' = ' + right + '. ' + (err === 'inv' ? 'The student’s ' + wrong + ' is ' + t[0] + ' ÷ ' + t[1] + ': the formula turned upside down.' : 'The student’s ' + wrong + ' has the right size but no minus sign; price and quantity moved in opposite directions, so PED is negative.') };
    } },
    { skill: 'ped-calc', gen: function () {
      var p = pick([3, 6, 7, 9]), q = pick([8, 10, 13, 17, 20]), ans = R.roundDp(-q / p, 1);
      return { kind: 'num', q: 'Ferries across Lake Ombre cut fares by ' + pc(p) + ' and passenger numbers rose by ' + pc(q) + '. Calculate the PED to <b>one</b> decimal place.',
        answer: ans, unit: '', tol: 0.05, display: fmt(ans, 1), why: 'PED = +' + q + ' ÷ −' + p + ' = ' + fmt(-q / p, 3) + ', which is ' + fmt(ans, 1) + ' to one decimal place.' };
    } },
    { skill: 'ped-calc', gen: function () {
      var p = pick([2, 3, 4, 5, 6, 8]), k = pick([2, 3, 4]), q = p * k, f = pick(FIRMS);
      return { kind: 'num', q: f + ' cut its prices by ' + pc(p) + ' and sold ' + pc(q) + ' more. Calculate the PED.',
        answer: -k, unit: '', display: fmt(-k), why: 'PED = +' + q + ' ÷ −' + p + ' = ' + fmt(-k) + '. Quantity rose ' + k + ' times as much as price fell, so demand is price elastic.' };
    } },
    { skill: 'from-data', gen: function () {
      var P0 = pick([4, 5, 8, 10, 20]), pp = pick([10, 20, 25, 50]), q = pick([3, 6, 9, 12, 15]);
      var P1 = R.roundDp(P0 * (1 + pp / 100), 2), ans = R.roundDp(-q / pp, 2);
      return { kind: 'num', q: 'A bus company raised the single fare from ' + cash2(P0) + ' to ' + cash2(P1) + '. The number of journeys fell by ' + pc(q) + '. Calculate the PED to two decimal places.',
        answer: ans, unit: '', tol: 0.005, display: d2(ans), why: 'First the price change: (' + cash2(P1) + ' − ' + cash2(P0) + ') ÷ ' + cash2(P0) + ' × 100 = +' + pp + '%. Then PED = −' + q + ' ÷ +' + pp + ' = ' + d2(ans) + '.' };
    } },
    { skill: 'from-data', gen: function () {
      var Q0 = pick([250, 400, 500, 800]), qp = pick([4, 8, 12, 16, 20, 28]), p = pick([5, 6, 10, 15]);
      var Q1 = Q0 * (1 - qp / 100), ans = R.roundDp(-qp / p, 2);
      return { kind: 'num', q: 'A florist raised the price of a bouquet by ' + pc(p) + '. Weekly sales fell from ' + fmt(Q0) + ' to ' + fmt(Q1) + ' bouquets. Calculate the PED to two decimal places.',
        answer: ans, unit: '', tol: 0.005, display: d2(ans), why: 'Quantity change = (' + fmt(Q1) + ' − ' + fmt(Q0) + ') ÷ ' + fmt(Q0) + ' × 100 = −' + qp + '%. PED = −' + qp + ' ÷ +' + p + ' = ' + d2(ans) + '.' };
    } },
    { skill: 'from-data', gen: function () {
      var rows = [['Kettles', pick([5, 8, 10]), pick([3, 4, 6])], ['Toasters', pick([4, 6, 12]), pick([9, 10, 15])]];
      var k = pick([0, 1]), r = rows[k], ans = R.roundDp(-r[2] / r[1], 2);
      return { kind: 'num', q: 'An appliance shop raised the prices of two products. Calculate the PED for <b>' + r[0].toLowerCase() + '</b> to two decimal places.' +
          tbl(['Product', '% change in price', '% change in quantity demanded'], rows.map(function (x) { return [x[0], '+' + x[1] + '%', '−' + x[2] + '%']; })),
        answer: ans, unit: '', tol: 0.005, display: d2(ans), why: 'Use the ' + r[0].toLowerCase() + ' row: PED = −' + r[2] + ' ÷ +' + r[1] + ' = ' + d2(ans) + '.' };
    } },
    { skill: 'working', gen: function () {
      var target = pick([[-0.5, 10, 5], [-0.25, 12, 3], [-2, 4, 8], [-1.5, 6, 9], [-0.8, 10, 8]]), p = target[1], q = target[2];
      var opts = ['Price +' + p + '%, quantity demanded −' + q + '%', 'Price +' + q + '%, quantity demanded −' + p + '%', 'Price +' + p + '%, quantity demanded +' + q + '%', 'Price −' + q + '%, quantity demanded +' + (p + q) + '%'];
      return { kind: 'mcq', q: 'Which pair of changes gives a PED of ' + fmt(target[0]) + '?', options: opts, answer: 0,
        why: '−' + q + ' ÷ +' + p + ' = ' + fmt(target[0]) + '. Swapping the two changes inverts the answer, and a rise in both gives a positive value.' };
    } },
    { skill: 'working', gen: function () {
      var t = twoPcts(), c = d2(-t[1] / t[0]), size = d2(t[1] / t[0]);
      return { kind: 'mcq', q: 'Price falls by ' + pc(t[0]) + ' and quantity demanded rises by ' + pc(t[1]) + '. Which answer is written correctly for full marks?',
        options: [c, c + '%', size + '%', '+' + size], answer: 0, why: 'PED = +' + t[1] + ' ÷ −' + t[0] + ' = ' + c + '. PED is a plain number with no % sign, and it must keep its minus sign.' };
    } },
    { skill: 'working', gen: function () {
      var pool = shuffle([[10, 15, 1], [8, 4, 0], [5, 12, 1], [12, 6, 0], [6, 9, 1], [20, 10, 0], [4, 3, 0], [3, 7, 1]]).slice(0, 5);
      if (!pool.some(function (x) { return x[2]; })) pool[0] = [10, 15, 1];
      if (pool.every(function (x) { return x[2]; })) pool[0] = [12, 6, 0];
      return { kind: 'multi', q: 'In each case below the price rises. Which cases show <b>price elastic</b> demand?', options: pool.map(function (x) { return 'Price +' + x[0] + '%, quantity demanded −' + x[1] + '%'; }),
        answers: pool.map(function (x, i) { return x[2] ? i : -1; }).filter(function (i) { return i >= 0; }),
        why: 'Demand is price elastic when the quantity change is bigger than the price change, so PED is above 1 in size: ' + pool.filter(function (x) { return x[2]; }).map(function (x) { return '−' + x[1] + ' ÷ +' + x[0] + ' = ' + d2(-x[1] / x[0]); }).join('; ') + '.' };
    } },
    { skill: 'ped-calc', gen: function () {
      var p = pick([5, 8, 10, 15, 20]), item = pick(['a heart medicine', 'mains water for homes', 'a prescription inhaler']);
      return { kind: 'num', q: 'The price of ' + item + ' rose by ' + pc(p) + ', but the quantity demanded did not change at all. Calculate the PED.',
        answer: 0, unit: '', display: '0', why: 'PED = 0 ÷ +' + p + ' = 0. Quantity demanded did not respond at all, so demand is perfectly price inelastic.' };
    } }
  ] };

  // =====================================================================
  // ECO-T11-15 Income elasticity of demand and types of goods
  // =====================================================================
  B['ECO-T11-15'] = { title: 'Income elasticity of demand and types of goods', items: [
    mc('define', 'What does income elasticity of demand (YED) measure?',
      ['The responsiveness of quantity demanded to a change in consumers’ income',
       'The responsiveness of quantity demanded to a change in the good’s own price',
       'The responsiveness of consumers’ income to a change in quantity demanded',
       'The responsiveness of quantity supplied to a change in consumers’ income'], 0,
      'YED compares the change in quantity demanded with the change in <b>income</b>. Using price instead gives PED.'),
    mc('define', 'Which formula gives income elasticity of demand (YED)?',
      ['% change in quantity demanded ÷ % change in income', '% change in income ÷ % change in quantity demanded',
       '% change in quantity demanded ÷ % change in price', '% change in income ÷ % change in price'], 0,
      'Quantity demanded is on top and income is on the bottom. The PED formula has price on the bottom instead.'),
    mc('define', 'What is meant by a <b>luxury good</b>?',
      ['A good whose demand rises by a larger percentage than the rise in income',
       'A good whose demand rises by a smaller percentage than the rise in income',
       'An expensive good that only people on high incomes are able to buy',
       'A good whose demand falls when consumers’ incomes rise'], 0,
      'In economics a luxury is defined by YED, not by price: YED is above 1, so demand grows faster than income. Being expensive is not the definition.'),
    mc('define', 'What is meant by an <b>inferior good</b>?',
      ['A good whose demand falls when income rises, and rises when income falls',
       'A good whose demand rises when income rises, and falls when income falls',
       'A good of poor quality that breaks easily and needs to be replaced',
       'A good whose demand does not change at all when income changes'], 0,
      'An inferior good has negative YED: demand and income move in opposite directions. Quality is not the test; the response to income is.'),
    { skill: 'classify', gen: function () {
      var c = pick([{ v: pick([1.3, 1.8, 2.4, 2.6, 3.1]), k: 0 }, { v: pick([0.2, 0.35, 0.5, 0.7, 0.9]), k: 1 }, { v: pick([-0.3, -0.6, -0.9, -1.4]), k: 2 }]);
      var why = ['YED is positive and above 1, so demand grows by a bigger percentage than income: a luxury good.',
        'YED is positive but below 1, so demand rises with income but by a smaller percentage: a normal good that is a necessity.',
        'YED is negative, so demand falls when income rises: an inferior good. The size does not matter once the sign is negative.'][c.k];
      return { kind: 'mcq', q: 'A product has an income elasticity of demand (YED) of ' + fmt(c.v) + '. Which term best describes it?',
        options: ['Luxury good', 'Necessity', 'Inferior good', 'Unitary YED'], answer: c.k, why: why };
    } },
    mu('classify', 'Which of these YED values show a <b>normal</b> good?', ['0.4', '1.8', '−0.6', '0.9', '−1.2'], [0, 1, 3],
      'Any positive YED is a normal good, because demand rises when income rises. A luxury (1.8) is a normal good with YED above 1. Negative values are inferior goods.'),
    mu('classify', 'Which statements are true of an <b>inferior</b> good?',
      ['Its YED is negative', 'Demand for it rises when incomes fall', 'Demand for it falls when incomes rise', 'Its YED is greater than 1', 'Demand for it falls when incomes fall'], [0, 1, 2],
      'An inferior good has negative YED: demand moves in the opposite direction to income. YED above 1 is a luxury; demand falling with income is a normal good.'),
    { skill: 'classify', gen: function () {
      var c = pick(['inf', 'nec', 'lux']), inc = pick([3, 4, 5, 6, 8]), rise = Math.random() < 0.5;
      var q = c === 'lux' ? inc * pick([2, 3]) : c === 'nec' ? inc / 2 : inc / 2;
      var qUp = c === 'inf' ? !rise : rise;
      var prod = c === 'lux' ? pick(['cruise holidays', 'fine-dining meals', 'electric sports bikes']) : c === 'nec' ? pick(['toothpaste', 'bread', 'electricity']) : pick(['second-hand school uniforms', 'the cheapest own-brand pasta', 'budget instant noodles']);
      return { kind: 'mcq', q: 'In Brevia, average incomes ' + (rise ? 'rose' : 'fell') + ' by ' + pc(inc) + ' and the quantity demanded of ' + prod + ' ' + (qUp ? 'rose' : 'fell') + ' by ' + pc(q) + '. What type of good is this?',
        options: ['Luxury good', 'Necessity', 'Inferior good', 'Unitary YED'], answer: c === 'lux' ? 0 : c === 'nec' ? 1 : 2,
        why: c === 'inf' ? 'Demand moved in the opposite direction to income, so YED is negative: an inferior good.'
          : 'Demand moved in the same direction as income, so YED is positive. Quantity changed by ' + pc(q) + ', ' + (c === 'lux' ? 'more than the ' + pc(inc) + ' change in income: a luxury.' : 'less than the ' + pc(inc) + ' change in income: a necessity.') };
    } },
    mc('classify', 'Which statement is true of <b>all</b> normal goods?',
      ['Demand rises when income rises', 'YED is greater than 1', 'Demand falls when income rises', 'Demand does not respond to income'], 0,
      'Normal goods have positive YED, so demand moves in the same direction as income. Only luxuries have YED above 1; necessities have YED between 0 and 1.'),
    mc('classify', 'A student says: “Discount supermarket own-brand beans have a YED of −0.5. Demand changes when income changes, so they are a normal good.” What is wrong?',
      ['The negative sign shows demand moves opposite to income, so they are an inferior good',
       'The size 0.5 is below 1, so they are a luxury good rather than a normal good',
       'A YED of −0.5 is unitary, because the size is ignored and only the sign counts',
       'YED cannot be negative, so the value must have been calculated incorrectly'], 0,
      'The sign decides the type. Negative YED means demand falls as income rises, which is an inferior good, not a normal good.'),
    { skill: 'income-change', gen: function () {
      var v = pick([2.2, 1.6, 0.4, 0.7, -0.5, -0.8]), rise = Math.random() < 0.5, inc = pick([2, 4, 5]);
      var k = v < 0 ? (rise ? 2 : 1) : v > 1 ? (rise ? 0 : 3) : (rise ? 1 : 2);
      var prod = v > 1 ? 'organic ready meals' : v > 0 ? 'cooking gas' : 'the cheapest own-brand cereal';
      var opts = ['Demand rises by more than ' + pc(inc), 'Demand rises by less than ' + pc(inc), 'Demand falls by less than ' + pc(inc), 'Demand falls by more than ' + pc(inc)];
      if (v < 0 && !rise) k = Math.abs(v) < 1 ? 1 : 0;
      if (v < 0 && rise) k = Math.abs(v) < 1 ? 2 : 3;
      if (v > 0 && v < 1 && !rise) k = 2;
      return { kind: 'mcq', q: 'The YED for ' + prod + ' is ' + fmt(v) + '. Incomes ' + (rise ? 'rise' : 'fall') + ' by ' + pc(inc) + '. What is most likely to happen to demand?',
        options: opts, answer: k,
        why: '% change in quantity demanded ≈ YED × % change in income = ' + fmt(v) + ' × ' + sn(rise ? inc : -inc) + ' = ' + sg(R.roundDp(v * (rise ? inc : -inc), 2)) + '.' + (v < 0 ? ' Negative YED: demand moves opposite to income.' : '') };
    } },
    mc('income-change', 'Corvalia enters a recession and average incomes fall by 4%. Demand for which product is most likely to <b>rise</b>?',
      ['Own-brand budget bread', 'Meals at full-service restaurants', 'New family cars', 'Holidays abroad'], 0,
      'Demand for an inferior good rises when incomes fall, as households switch to cheaper options. Restaurant meals, new cars and foreign holidays are normal goods, so demand for them falls.'),
    { skill: 'income-change', gen: function () {
      var prods = shuffle([['Spa weekends', pick([2.1, 2.5, 3])], ['Electricity', pick([0.2, 0.3])], ['Value-range cereal', pick([-0.4, -0.7])], ['Fresh fruit', pick([0.6, 0.8])]]);
      var fall = Math.random() < 0.5, idx;
      if (fall) { idx = prods.map(function (p) { return p[1]; }).indexOf(Math.min.apply(null, prods.map(function (p) { return p[1]; }))); }
      else { idx = prods.map(function (p) { return p[1]; }).indexOf(Math.max.apply(null, prods.map(function (p) { return p[1]; }))); }
      return { kind: 'mcq', q: 'Incomes in Ostrana are forecast to <b>' + (fall ? 'fall' : 'rise') + '</b> by 3%. Using the YED values in the table, which product’s quantity demanded is likely to <b>rise by the largest percentage</b>?' +
          tbl(['Product', 'YED'], prods.map(function (p) { return [p[0], fmt(p[1])]; })),
        options: prods.map(function (p) { return p[0]; }), answer: idx,
        why: '% change in demand ≈ YED × ' + (fall ? '(−3%)' : '(+3%)') + '. ' + (fall ? 'When incomes fall, the most negative YED (an inferior good) gives the biggest rise: ' : 'When incomes rise, the highest YED (a luxury) gives the biggest rise: ') + prods[idx][0] + ' at ' + fmt(prods[idx][1]) + '.' };
    } },
    mc('income-change', 'Which product’s sales are likely to fall by the <b>largest</b> percentage in a recession, when incomes fall?',
      ['A product with YED of 2.5', 'A product with YED of 0.3', 'A product with YED of −0.6', 'A product with YED of 1.1'], 0,
      'Falling incomes cut demand for normal goods, and the higher the YED the bigger the fall. With YED 2.5, a 2% fall in income cuts demand by about 5%. A negative YED good would see demand rise.'),
    mc('income-change', 'Incomes in Tarsova rise by 6%. Organic vegetables have a YED of 1.8. Which is the best next link in the analysis?',
      ['Demand rises by about 10.8%, more than income, so organic grocers may need more stock and staff',
       'Demand rises by about 3.3%, less than income, so organic grocers should cut their orders',
       'Demand falls by about 10.8%, because a YED above 1 means demand moves against income',
       'Demand stays the same, because YED only matters when the price of the good changes'], 0,
      'With YED 1.8, demand changes by about 1.8 × 6% = 10.8%, faster than income. Grocers can plan for higher sales by ordering more and hiring staff.'),
    mc('business-use', 'Grenmart is a discount supermarket chain whose own-brand range has a YED of −0.5. Incomes are forecast to rise strongly. What is the most sensible plan for Grenmart?',
      ['Expect lower sales of the range, so add higher-quality lines or cut planned stock',
       'Open many more stores, because sales of the range will rise with incomes',
       'Raise prices, because rising incomes make demand for the range price inelastic',
       'Make no changes, because YED only matters when the price of the range changes'], 0,
      'Negative YED means demand for the range falls as incomes rise. Grenmart can prepare by ordering less and offering products that richer shoppers switch to.'),
    mc('business-use', 'Azure Bay Spa Hotel has a YED of 2.2. Incomes are expected to fall by 3% next year. How can the hotel best use this information?',
      ['Plan for bookings to fall by about 6.6% and adjust staffing or offer deals',
       'Plan for bookings to rise by about 6.6% and hire extra seasonal staff for the year',
       'Plan for bookings to fall by about 1.4% and leave everything unchanged',
       'Ignore the forecast, because a luxury hotel is not affected by income'], 0,
      'Demand changes by about 2.2 × (−3%) = −6.6%, more than income because it is a luxury. Knowing this early lets the hotel cut costs or attract guests with offers.'),
    mc('business-use', 'Why does a government use income elasticity of demand when incomes are expected to change?',
      ['To predict how spending on different goods, and so tax revenue from them, will change',
       'To calculate exactly how much consumers’ incomes will rise or fall next year',
       'To decide the price that firms must charge for necessities such as bread',
       'To measure how far the supply of goods will respond to a change in price'], 0,
      'YED shows which goods will see demand grow or shrink as incomes change, so the government can forecast tax revenue and plan for changes in spending.'),
    mc('business-use', 'A furniture firm sells a luxury sofa range. Incomes rose by 5%, but its sales did not rise as much as its YED estimate predicted. Which is the most likely explanation?',
      ['A rival cut the price of similar sofas at the same time', 'The sofas are a luxury, so YED does not apply to them', 'Rising incomes always reduce the demand for furniture such as sofas', 'The firm’s YED estimate must have been negative'], 0,
      'YED assumes other things stay the same. If a rival cuts prices, some buyers switch, so sales grow less than YED predicts. YED is only an estimate.'),
    mc('business-use', 'Why does the <b>size</b> of YED matter to a firm, as well as its sign?',
      ['It shows how much demand changes for each 1% change in income, so output can be planned',
       'It shows whether the firm’s product is price elastic or price inelastic',
       'It shows how much profit the firm makes on each unit when incomes rise',
       'It shows how quickly the firm can raise output when the price rises'], 0,
      'The sign tells the firm whether demand moves with or against income; the size tells it how far. YED 2 means about a 2% change in demand for every 1% change in income.'),
    mc('define', 'A manager wants to calculate YED for her product. Which two pieces of data does she need?',
      ['% change in quantity demanded and % change in income', '% change in quantity demanded and % change in price', '% change in income and % change in price', '% change in quantity supplied and % change in income'], 0,
      'YED = % change in quantity demanded ÷ % change in income. Data on price would be used for PED, not YED.'),
    mc('classify', 'Which of these is most likely to be an <b>inferior good</b> for most households in a growing economy?',
      ['The cheapest brand of instant noodles', 'Meals at high-end restaurants', 'Monthly music-streaming subscriptions', 'Holidays in overseas resorts'], 0,
      'As incomes grow, many households switch from the cheapest basic brands to better alternatives, so demand for them falls: negative YED. The others are normal goods.')
  ] };

  // =====================================================================
  // ECO-CALC-05 Calculating income elasticity of demand (YED)
  // =====================================================================
  function yedClass(v) { return v < 0 ? 'an inferior good' : v > 1 ? 'a luxury good' : v === 1 ? 'unitary' : 'a normal good (necessity)'; }
  B['ECO-CALC-05'] = { title: 'Calculating income elasticity of demand (YED)', items: [
    { skill: 'yed-calc', gen: function () {
      var i = pick([3, 4, 6, 7, 8, 9]), q; do { q = pick([5, 10, 11, 13, 15, 17, 20, 22]); } while (q <= i);
      var ans = R.roundDp(q / i, 2);
      return { kind: 'num', q: 'Average incomes rise by ' + pc(i) + ' and the quantity demanded of electric bikes rises by ' + pc(q) + '. Calculate the income elasticity of demand (YED) to two decimal places.',
        answer: ans, unit: '', tol: 0.005, display: d2(ans), why: 'YED = % change in quantity demanded ÷ % change in income = +' + q + ' ÷ +' + i + ' = ' + d2(ans) + '. Above 1, so this is a luxury good.' };
    } },
    { skill: 'yed-calc', gen: function () {
      var i = pick([4, 5, 6, 8, 12]), q = pick([1, 2, 3, 7, 9]), ans = R.roundDp(-q / i, 2);
      return { kind: 'num', q: 'Incomes in Mondova rose by ' + pc(i) + '. Quantity demanded of second-hand clothes fell by ' + pc(q) + '. Calculate the YED to two decimal places, including the sign.',
        answer: ans, unit: '', tol: 0.005, display: d2(ans), why: 'YED = −' + q + ' ÷ +' + i + ' = ' + d2(ans) + '. The negative value shows an inferior good.' };
    } },
    { skill: 'yed-calc', gen: function () {
      var i = pick([2, 3, 4, 5]), q = pick([1, 1.5, 2.5, 6, 7, 9]); if (q === i) q = 7;
      var ans = R.roundDp(q / i, 2);
      return { kind: 'num', q: 'During a recession, incomes fell by ' + pc(i) + ' and the quantity demanded of taxi rides fell by ' + pc(q) + '. Calculate the YED to two decimal places.',
        answer: ans, unit: '', tol: 0.005, display: d2(ans), why: 'Both changes are falls: YED = −' + fmt(q) + ' ÷ −' + i + ' = +' + d2(ans) + '. A fall divided by a fall gives a positive YED, so taxi rides are ' + yedClass(ans) + '.' };
    } },
    { skill: 'yed-calc', gen: function () {
      var i = pick([2, 3, 4, 6]), q = pick([1, 5, 7, 8, 9]), ans = R.roundDp(-q / i, 2);
      return { kind: 'num', q: 'Incomes fell by ' + pc(i) + ' and the quantity demanded of budget supermarket meals rose by ' + pc(q) + '. Calculate the YED to two decimal places.',
        answer: ans, unit: '', tol: 0.005, display: d2(ans), why: 'YED = +' + q + ' ÷ −' + i + ' = ' + d2(ans) + '. Demand rose as income fell, so YED is negative: an inferior good.' };
    } },
    { skill: 'yed-calc', gen: function () {
      var i = pick([2.4, 3.5, 4.8, 5.5, 6.2]), q = pick([1.3, 2.9, 7.4, 8.6, 9.1]), ans = R.roundDp(q / i, 2);
      return { kind: 'num', q: 'Incomes increase by ' + pc(i) + ' and quantity demanded of sports-club memberships increases by ' + pc(q) + '. Calculate the YED to two decimal places.',
        answer: ans, unit: '', tol: 0.005, display: d2(ans), why: 'YED = ' + fmt(q) + ' ÷ ' + fmt(i) + ' = ' + fmt(q / i, 4) + ' = ' + d2(ans) + ' to two decimal places.' };
    } },
    { skill: 'yed-calc', gen: function () {
      var i = pick([2, 3, 4, 6, 7, 8, 9]), q = pick([5, 7, 11, 13, 17]); if (q === i) q = 11;
      var ans = R.roundDp(q / i, 1);
      return { kind: 'num', q: 'Incomes rise by ' + pc(i) + ' and demand for gym classes rises by ' + pc(q) + '. Calculate the YED to <b>one</b> decimal place.',
        answer: ans, unit: '', tol: 0.05, display: fmt(ans, 1), why: 'YED = ' + q + ' ÷ ' + i + ' = ' + fmt(q / i, 3) + ', which is ' + fmt(ans, 1) + ' to one decimal place.' };
    } },
    { skill: 'working', gen: function () {
      var i, q; do { i = pick([4, 5, 6, 8, 10]); q = pick([3, 7, 9, 12, 14]); } while (q === i);
      var neg = Math.random() < 0.5, c = d2((neg ? -q : q) / i), opts = [c, d2((neg ? -i : i) / q), d2((neg ? q : -q) / i), d2((neg ? i : -i) / q)];
      return { kind: 'mcq', q: 'Incomes rise by ' + pc(i) + ' and quantity demanded ' + (neg ? 'falls' : 'rises') + ' by ' + pc(q) + '. What is the YED, to two decimal places?',
        options: opts, answer: 0, why: 'YED = ' + (neg ? '−' : '+') + q + ' ÷ +' + i + ' = ' + c + '. Putting income on top gives ' + opts[1] + ', the inverted answer.' };
    } },
    { skill: 'working', gen: function () {
      var i, q; do { i = pick([3, 5, 6, 8]); q = pick([2, 4, 9, 12]); } while (q === i);
      return { kind: 'mcq', q: 'Incomes rise by ' + pc(i) + ' and quantity demanded of a product rises by ' + pc(q) + '. Which line of working is correct for YED?',
        options: [q + ' ÷ ' + i, i + ' ÷ ' + q, q + ' × ' + i, '(' + q + ' − ' + i + ') ÷ ' + i], answer: 0,
        why: 'YED = % change in quantity demanded ÷ % change in income, so ' + q + ' ÷ ' + i + ' = ' + d2(q / i) + '.' };
    } },
    { skill: 'classify-result', gen: function () {
      var c = pick(['lux', 'nec', 'inf', 'uni']), i = pick([4, 5, 8, 10]);
      var q = c === 'lux' ? i + pick([1, 2, 3]) : c === 'nec' ? i - pick([1, 2, 3]) : c === 'uni' ? i : -pick([1, 2, 3]);
      var k = c === 'lux' ? 0 : c === 'nec' ? 1 : c === 'inf' ? 2 : 3, v = q / i;
      return { kind: 'mcq', q: 'Incomes rise by ' + pc(i) + ' and quantity demanded of a product ' + (q < 0 ? 'falls' : 'rises') + ' by ' + pc(q) + '. Which option best describes the product?',
        options: ['Luxury good', 'Necessity', 'Inferior good', 'Unitary YED'], answer: k,
        why: 'YED = ' + sn(q) + ' ÷ +' + i + ' = ' + d2(v) + '. ' + (c === 'lux' ? 'Above 1, so it is a luxury, not unitary.' : c === 'nec' ? 'Between 0 and 1, so it is a necessity, not a luxury.' : c === 'inf' ? 'Negative, so it is an inferior good.' : 'Exactly 1: quantity changes by the same percentage as income.') };
    } },
    { skill: 'classify-result', gen: function () {
      var i = pick([5.5, 6.5, 7.2, 8.4]), q = R.roundDp(i - pick([0.4, 0.6, 0.9]), 1), v = R.roundDp(q / i, 2);
      return { kind: 'mcq', q: 'Incomes increase by ' + pc(i) + ' and quantity demanded of fresh milk increases by ' + pc(q) + '. What is the YED and what type of good is milk?',
        options: [d2(v) + ', a necessity', d2(v) + ', a luxury good', d2(i / q) + ', a luxury good', d2(-v) + ', an inferior good'], answer: 0,
        why: 'YED = ' + fmt(q) + ' ÷ ' + fmt(i) + ' = ' + d2(v) + '. It is positive but below 1, so milk is a necessity. ' + d2(i / q) + ' comes from putting income on top.' };
    } },
    { skill: 'rearrange', gen: function () {
      var v = pick([1.5, 2, 2.5, 0.5, 0.8, -0.5, -1.2]), i = pick([2, 4, 6, 10]), ans = R.roundDp(v * i, 2);
      return { kind: 'num', q: 'A product has a YED of ' + fmt(v) + '. Incomes rise by ' + pc(i) + '. Calculate the percentage change in quantity demanded. Use a minus sign for a fall.',
        answer: ans, unit: '%', display: sg(ans), why: '% change in quantity demanded = YED × % change in income = ' + fmt(v) + ' × ' + i + ' = ' + sg(ans) + '.' };
    } },
    { skill: 'rearrange', gen: function () {
      var v = pick([1.5, 2, 2.5, 4]), i = pick([2, 3, 4, 6]), q = R.roundDp(v * i, 2);
      return { kind: 'num', q: 'Demand for a luxury watch brand has a YED of ' + fmt(v) + '. Demand for the watches rose by ' + pc(q) + '. By what percentage did incomes change?',
        answer: i, unit: '%', display: sg(i), why: '% change in income = % change in quantity demanded ÷ YED = ' + fmt(q) + ' ÷ ' + fmt(v) + ' = ' + sg(i) + '.' };
    } },
    { skill: 'rearrange', gen: function () {
      var v = pick([-0.5, -0.8, -1.5]), i = pick([2, 4, 5, 10]), ans = R.roundDp(v * -i, 2);
      return { kind: 'num', q: 'Basic own-brand margarine has a YED of ' + fmt(v) + '. In a recession, incomes fall by ' + pc(i) + '. Calculate the percentage change in quantity demanded of the margarine.',
        answer: ans, unit: '%', display: sg(ans), why: '% change in quantity demanded = ' + fmt(v) + ' × (−' + i + ') = ' + sg(ans) + '. A negative YED times a fall in income gives a rise in demand.' };
    } },
    { skill: 'rearrange', gen: function () {
      var v = pick([1.2, 1.5, 2, 0.4, 0.6]), i = pick([5, 10]), Q0 = pick([2000, 4000, 5000, 8000]), Q1 = R.roundDp(Q0 * (1 + v * i / 100), 0);
      return { kind: 'num', q: 'A bakery sells ' + fmt(Q0) + ' celebration cakes a year. YED for the cakes is ' + fmt(v) + '. If incomes rise by ' + pc(i) + ', how many cakes a year will it sell?',
        answer: Q1, unit: 'cakes', display: fmt(Q1), why: '% change in quantity = ' + fmt(v) + ' × ' + i + ' = +' + fmt(R.roundDp(v * i, 2)) + '%. New sales = ' + fmt(Q0) + ' × ' + fmt(1 + v * i / 100) + ' = ' + fmt(Q1) + ' cakes.' };
    } },
    { skill: 'from-data', gen: function () {
      var Y0 = pick([20000, 25000, 40000, 50000]), ip = pick([2, 4, 5, 8, 10]), Q0 = pick([500, 1000, 2000, 4000]), qp = pick([3, 6, 12, 15, 16, 20]); if (qp === ip) qp = 15;
      var Y1 = Y0 * (1 + ip / 100), Q1 = Q0 * (1 + qp / 100), ans = R.roundDp(qp / ip, 2);
      return { kind: 'num', q: 'Use the data for Pellara to calculate the YED for streaming-service subscriptions, to two decimal places.' +
          tbl(['Year', 'Average income per year', 'Subscriptions'], [['2025', cash(Y0), fmt(Q0)], ['2026', cash(Y1), fmt(Q1)]]),
        answer: ans, unit: '', tol: 0.005, display: d2(ans),
        why: '% change in income = (' + fmt(Y1) + ' − ' + fmt(Y0) + ') ÷ ' + fmt(Y0) + ' × 100 = +' + ip + '%. % change in quantity = (' + fmt(Q1) + ' − ' + fmt(Q0) + ') ÷ ' + fmt(Q0) + ' × 100 = +' + qp + '%. YED = ' + qp + ' ÷ ' + ip + ' = ' + d2(ans) + '.' };
    } },
    { skill: 'from-data', gen: function () {
      var ip = pick([4, 5, 8]), Q0 = pick([400, 500, 800, 1000]), qp = pick([2, 5, 10, 15]);
      var Q1 = Q0 * (1 - qp / 100), ans = R.roundDp(-qp / ip, 2);
      return { kind: 'num', q: 'Incomes in Kelmar rose by ' + pc(ip) + '. Weekly sales of a basic tinned soup fell from ' + fmt(Q0) + ' to ' + fmt(Q1) + ' cans. Calculate the YED to two decimal places.',
        answer: ans, unit: '', tol: 0.005, display: d2(ans), why: '% change in quantity = (' + fmt(Q1) + ' − ' + fmt(Q0) + ') ÷ ' + fmt(Q0) + ' × 100 = −' + qp + '%. YED = −' + qp + ' ÷ +' + ip + ' = ' + d2(ans) + ' (an inferior good).' };
    } },
    { skill: 'from-data', gen: function () {
      var rows = [['Cinema trips', pick([9, 12, 15]), pick([4, 5, 6])], ['Rice', pick([1, 2, 3]), pick([4, 5, 6])], ['Bulk dried beans', -pick([2, 3]), pick([4, 5, 6])]];
      var k = pick([0, 1, 2]), r = rows[k], ans = R.roundDp(r[1] / r[2], 2);
      return { kind: 'num', q: 'The table shows changes in Veridia over one year. Calculate the YED for <b>' + r[0].toLowerCase() + '</b> to two decimal places.' +
          tbl(['Product', '% change in quantity demanded', '% change in income'], rows.map(function (x) { return [x[0], sg(x[1]), '+' + x[2] + '%']; })),
        answer: ans, unit: '', tol: 0.005, display: d2(ans), why: 'Use the ' + r[0].toLowerCase() + ' row: YED = ' + sn(r[1]) + ' ÷ +' + r[2] + ' = ' + d2(ans) + ', so it is ' + yedClass(ans) + '.' };
    } },
    { skill: 'classify-result', gen: function () {
      var i = pick([4, 5, 8]), pool = shuffle([[-i / 2, 1], [-1, 1], [i * 2, 0], [i / 2, 0], [i, 0]]);
      return { kind: 'multi', q: 'Incomes rise by ' + pc(i) + '. For which of these changes in quantity demanded is the product an <b>inferior</b> good?',
        options: pool.map(function (x) { return 'Quantity demanded ' + (x[0] < 0 ? 'falls' : 'rises') + ' by ' + pc(x[0]); }),
        answers: pool.map(function (x, j) { return x[1] ? j : -1; }).filter(function (j) { return j >= 0; }),
        why: 'With income rising, an inferior good is one whose quantity demanded falls, giving a negative YED. Any rise in quantity gives a positive YED, a normal good.' };
    } },
    { skill: 'classify-result', gen: function () {
      var i = pick([4, 5, 8, 10]), target = pick(['lux', 'inf']);
      var opts = target === 'lux' ? ['+' + (i + 4) + '%', '+' + (i / 2) + '%', '+' + i + '%', '−' + (i / 2) + '%'] : ['−' + (i / 2) + '%', '+' + (i / 2) + '%', '+' + i + '%', '+' + (i + 4) + '%'];
      return { kind: 'mcq', q: 'Incomes rise by ' + pc(i) + '. Which change in quantity demanded would show that the product is ' + (target === 'lux' ? 'a <b>luxury</b> good' : 'an <b>inferior</b> good') + '?',
        options: opts, answer: 0, why: target === 'lux' ? 'A luxury has YED above 1, so quantity must rise by more than ' + pc(i) + ': ' + opts[0] + ' ÷ ' + i + '% = ' + d2((i + 4) / i) + '. A ' + pc(i) + ' rise gives exactly 1 (unitary).' : 'An inferior good has negative YED, so quantity must fall while income rises: ' + opts[0] + ' ÷ +' + i + '% = ' + d2(-i / 2 / i) + '.' };
    } },
    { skill: 'working', gen: function () {
      var i, q; do { i = pick([4, 5, 8]); q = pick([2, 6, 10, 12]); } while (q === i);
      var err = pick(['inv', 'pct']), right = d2(q / i), wrong = err === 'inv' ? d2(i / q) : d2(q / i) + '%';
      return { kind: 'mcq', q: 'Incomes rose by ' + pc(i) + ' and quantity demanded rose by ' + pc(q) + '. A student wrote the YED as ' + wrong + '. What is wrong with the answer?',
        options: ['Income was put on top of the fraction', 'A % sign was added to the YED value', 'The minus sign was left out', 'The answer is correct as written'], answer: err === 'inv' ? 0 : 1,
        why: 'The correct YED is ' + q + ' ÷ ' + i + ' = ' + right + ', a plain number. ' + (err === 'inv' ? wrong + ' is ' + i + ' ÷ ' + q + ': income on top.' : 'YED has no % sign, even though it is made from two percentages.') };
    } },
    { skill: 'working', gen: function () {
      var i, q; do { i = pick([3, 6, 7, 9]); q = pick([4, 5, 8, 11, 14]); } while (q === i);
      var c = d2(q / i);
      return { kind: 'mcq', q: 'Incomes rise by ' + pc(i) + ' and quantity demanded of dishwashers rises by ' + pc(q) + '. Which answer is written correctly for full marks?',
        options: [c, c + '%', '−' + c, d2(i / q)], answer: 0, why: 'YED = ' + q + ' ÷ ' + i + ' = ' + c + '. It is a plain number (no % sign), and it is positive because income and quantity demanded both rose.' };
    } },
    { skill: 'yed-calc', gen: function () {
      var i = pick([2, 3, 4, 5]), k = pick([2, 3]), q = i * k;
      return { kind: 'num', q: 'Incomes rise by ' + pc(i) + ' and demand for overseas flights rises by ' + pc(q) + '. Calculate the YED.',
        answer: k, unit: '', display: String(k), why: 'YED = ' + q + ' ÷ ' + i + ' = ' + k + '. Demand rises ' + k + ' times as fast as income, so flights are a luxury.' };
    } }
  ] };

  // =====================================================================
  // ECO-T11-13 Price elasticity of supply: meaning, values and causes
  // =====================================================================
  var PES_LABELS = ['Perfectly price inelastic', 'Price inelastic', 'Unitary price elasticity', 'Price elastic', 'Perfectly price elastic'];
  B['ECO-T11-13'] = { title: 'Price elasticity of supply: meaning, values and causes', items: [
    mc('define', 'What does price elasticity of supply (PES) measure?',
      ['The responsiveness of quantity supplied to a change in the price of the good',
       'The responsiveness of quantity demanded to a change in the price of the good',
       'The responsiveness of the price of a good to a change in quantity supplied',
       'The responsiveness of quantity supplied to a change in the costs of production'], 0,
      'PES compares the change in <b>quantity supplied</b> with the change in the good’s <b>price</b>. Quantity demanded would make it PED.'),
    mc('define', 'Which is the formula for price elasticity of supply (PES)?',
      ['% change in quantity supplied ÷ % change in price', '% change in quantity demanded ÷ % change in price',
       '% change in price ÷ % change in quantity supplied', '% change in quantity supplied ÷ % change in income'], 0,
      'Quantity supplied goes on top and price on the bottom. Using quantity demanded is the PED formula, a common slip.'),
    { skill: 'classify', gen: function () {
      var c = pick([{ v: pick([0.1, 0.3, 0.5, 0.7, 0.85]), k: 1 }, { v: pick([1.2, 1.6, 2.5, 3.4]), k: 3 }, { v: 1, k: 2 }, { v: 0, k: 0 }]);
      var why = ['A PES of 0 means quantity supplied does not change at all when price changes: perfectly price inelastic.',
        fmt(c.v) + ' is between 0 and 1, so quantity supplied changes by a smaller percentage than price: price inelastic supply.',
        'A PES of exactly 1 means quantity supplied changes by the same percentage as price: unitary price elasticity.',
        fmt(c.v) + ' is above 1, so quantity supplied changes by a larger percentage than price: price elastic supply.'][c.k];
      return { kind: 'mcq', q: 'A product’s price elasticity of supply (PES) is ' + fmt(c.v) + '. Which term describes its supply?', options: PES_LABELS.slice(), answer: c.k, why: why };
    } },
    { skill: 'classify', gen: function () {
      var inel = sample([0.15, 0.4, 0.6, 0.75, 0.9], rint(2, 3)), el = sample([1.1, 1.5, 2.3, 3, 4.5], 2);
      var all = shuffle(inel.map(function (v) { return [v, 1]; }).concat(el.map(function (v) { return [v, 0]; })).concat([[1, 0]]));
      return { kind: 'multi', q: 'Which of these PES values show <b>price inelastic</b> supply?', options: all.map(function (x) { return fmt(x[0]); }),
        answers: all.map(function (x, i) { return x[1] ? i : -1; }).filter(function (i) { return i >= 0; }),
        why: 'PES values between 0 and 1 (' + inel.map(function (v) { return fmt(v); }).join(', ') + ') are price inelastic. 1 is unitary; above 1 is price elastic.' };
    } },
    mc('classify', 'Which statement describes <b>perfectly price elastic</b> supply?',
      ['Suppliers will supply any quantity at the current price, but none at a lower price',
       'Quantity supplied does not change at all, whatever happens to the price of the good',
       'Quantity supplied changes by exactly the same percentage as price',
       'Quantity supplied changes by a smaller percentage than price'], 0,
      'Perfectly price elastic supply has PES of infinity and is drawn as a horizontal line: any quantity is supplied at that price, but none at a lower one.'),
    mc('classify', 'Why is PES normally a <b>positive</b> number?',
      ['Price and quantity supplied move in the same direction', 'Price and quantity supplied move in opposite directions', 'Supply always rises faster than price', 'The minus sign is always ignored for supply'], 0,
      'A higher price encourages firms to supply more, and a lower price to supply less. A rise over a rise, or a fall over a fall, is positive.'),
    { skill: 'classify', gen: function () {
      var c = pick(['e', 'i', 'u']), p = pick([5, 8, 10, 12, 20]), q = c === 'u' ? p : c === 'e' ? p * pick([1.5, 2, 2.5]) : p * pick([0.25, 0.5]);
      var prod = pick(['plastic garden chairs', 'mangoes', 'cotton T-shirts', 'fresh salmon', 'printed mugs']);
      return { kind: 'mcq', q: 'The price of ' + prod + ' rises by ' + pc(p) + ' and quantity supplied rises by ' + pc(q) + '. Which term describes the supply?',
        options: PES_LABELS.slice(0, 4), answer: c === 'u' ? 2 : c === 'e' ? 3 : 1,
        why: 'Quantity supplied changed by ' + pc(q) + ' against ' + aPc(p) + ' change in price. ' + (c === 'u' ? 'The same percentage, so PES = 1 (unitary).' : c === 'e' ? 'Quantity changed by more, so PES is above 1: elastic.' : 'Quantity changed by less, so PES is below 1: inelastic.') };
    } },
    mc('determinants', 'A shoe factory is using only 60% of its machines. How does this affect its price elasticity of supply?',
      ['Supply is more elastic, because it can raise output quickly using idle machines',
       'Supply is more inelastic, because idle machines show demand for shoes is falling',
       'Supply is perfectly inelastic, because the factory cannot buy any new machines',
       'It has no effect, because spare capacity only affects price elasticity of demand'], 0,
      'Spare capacity means extra output can be produced straight away when the price rises, so quantity supplied responds strongly: supply is more elastic.'),
    mc('determinants', 'A toy maker keeps a large stock of finished toys in its warehouse. Why does this make its supply more price elastic?',
      ['It can release stock onto the market quickly when the price rises', 'It must cut its price to clear the warehouse', 'Holding stock means the firm has no spare capacity left to raise output', 'Stocks raise the cost of each toy produced'], 0,
      'If the price rises, the firm can sell from stock at once rather than waiting to produce more, so quantity supplied rises quickly.'),
    mc('determinants', 'Why is the supply of qualified heart surgeons price inelastic in the short run?',
      ['Training a new surgeon takes many years, so extra workers cannot be found quickly',
       'Hospitals hold large stocks of surgeons that they can release at short notice',
       'Surgeons are paid a fixed salary, so their wage can never change at all',
       'Demand for heart surgery is price inelastic, so supply must also be inelastic'], 0,
      'Supply depends on getting extra factors of production. If skilled labour takes years to train, quantity supplied cannot respond much to a higher price in the short run.'),
    mu('determinants', 'Which of these would make the supply of a product <b>more price elastic</b>?',
      ['The firm has spare capacity', 'The firm holds large stocks', 'Extra workers are easy to hire', 'The product takes three years to grow', 'The product is perishable and cannot be stored'], [0, 1, 2],
      'Spare capacity, stocks and easy-to-find factors of production let output respond quickly. Long growing times and perishability make supply inelastic.'),
    mc('determinants', 'Rolta Bikes makes bicycles in a factory that is already at full capacity, with no spare workers. Demand and price rise sharply. What is most likely in the short run?',
      ['Supply is price inelastic, because output cannot be raised quickly', 'Supply is price elastic, because bicycles are always manufactured goods', 'Supply is perfectly elastic, because the factory can add shifts', 'Supply is unitary, because it is a manufactured product'], 0,
      'Manufactured goods are usually supply-elastic, but only when there is spare capacity. At full capacity with no extra labour, output cannot rise quickly, so supply is inelastic.'),
    mc('time', 'Why does supply usually become more price elastic over a longer period of time?',
      ['Firms have time to build new capacity, hire and train workers, and new firms can enter',
       'Firms always hold more stock in the long run than in the short run',
       'Prices are fixed in the long run, so quantity supplied is free to change',
       'Demand becomes more elastic over time, which forces supply to follow'], 0,
      'In the short run firms are limited by existing factories and workers. Given time they can expand and new producers can join, so quantity supplied responds more.'),
    mc('time', 'The price of wheat in Brevia rises sharply just after this year’s harvest. Compared with this year, how is PES for wheat likely to change by next season?',
      ['It is likely to be more elastic, because farmers can plant more wheat',
       'It is likely to be less elastic, because the harvest has already happened',
       'It will stay at zero, because wheat supply can never change',
       'It will become negative, because farmers switch to other crops'], 0,
      'Just after the harvest the quantity is fixed, so supply is very inelastic. By the next season farmers can plant more land, so supply becomes more elastic.'),
    mc('primary-manufactured', 'Why is the supply of coffee beans likely to be price inelastic in the short run?',
      ['Coffee plants take years to mature, and harvests depend on the weather',
       'Coffee beans are manufactured, so factories can add extra shifts',
       'Coffee is a necessity, so consumers keep buying when its price rises',
       'Coffee growers hold large unused stocks that they can release at once'], 0,
      'Coffee is a primary product. New plants take years to produce beans and output depends on the weather, so farmers cannot raise quantity supplied quickly.'),
    mc('primary-manufactured', 'Why is the supply of plastic water bottles likely to be price elastic?',
      ['Factories can add extra shifts, use spare capacity and store finished bottles',
       'Plastic bottles take a long time to grow and depend on the weather',
       'Plastic bottles are perishable, so they must be sold straight away',
       'Demand for bottled water is price inelastic, so supply is elastic'], 0,
      'Manufactured goods can usually be produced faster when the price rises, and they can be stored, so quantity supplied responds strongly to price.'),
    mc('primary-manufactured', 'Which product is most likely to have the <b>most price elastic</b> supply in the short run?',
      ['Phone cases from a factory with spare capacity', 'Mangoes picked from orchards during the dry season', 'Fish caught at sea', 'Rare 20-year-old whisky'], 0,
      'A factory with idle capacity can raise output quickly. Mangoes depend on growing seasons, catches depend on fish stocks and weather, and aged whisky takes decades to make.'),
    mc('primary-manufactured', 'Why is the supply of fresh cut flowers price inelastic in the short run?',
      ['They take time to grow and are perishable, so stocks cannot be built up',
       'They are manufactured goods that can be produced in extra shifts',
       'They take a tiny share of consumers’ incomes, so supply hardly changes at all',
       'There are many close substitutes for cut flowers in most shops'], 0,
      'Flowers must be grown first, and they wilt within days, so growers cannot keep stocks to release when the price rises. Quantity supplied responds slowly.'),
    mc('primary-manufactured', 'Which pair is most likely to be correct?',
      ['Cocoa beans: price inelastic supply; cardboard boxes: price elastic supply',
       'Cocoa beans: price elastic supply; cardboard boxes: price inelastic supply',
       'Cocoa beans and cardboard boxes: both perfectly price elastic supply',
       'Cocoa beans and cardboard boxes: both perfectly price inelastic supply'], 0,
      'Cocoa is a primary product that takes years to grow, so supply is inelastic. Boxes are manufactured and can be made quickly and stored, so supply is elastic.'),
    mc('primary-manufactured', 'Which point most <b>weakens</b> the claim that manufactured goods always have more price elastic supply than crops?',
      ['A factory at full capacity cannot raise output fast, while stored grain can be sold at once',
       'Manufactured goods can be stored in warehouses for long periods',
       'Crops take a long time to grow and depend on the weather',
       'Factories can usually add extra shifts when prices rise'], 0,
      'The claim depends on spare capacity and storage. A full factory is inelastic in the short run, while a crop held in storage can be released quickly, so the comparison can reverse.'),
    mc('primary-manufactured', 'The world price of olive oil rises by 20%. Olive trees take several years to start producing fruit. What is the most likely next link in the analysis?',
      ['Quantity supplied rises by much less than 20% in the short run, so the price stays high',
       'Quantity supplied rises by much more than 20% at once, so the price falls back very quickly',
       'Quantity supplied falls, because higher prices make olive farming less profitable',
       'Quantity supplied rises by exactly 20%, because supply of crops is unitary'], 0,
      'Growers cannot plant and harvest new trees quickly, so supply is inelastic. Output rises only slightly, so the higher price is not quickly brought down.'),
    mc('classify', 'An airline flight has 180 seats, and the flight leaves tomorrow. What is the PES for seats on that flight?',
      ['0, perfectly price inelastic', 'Between 0 and 1, price inelastic', 'Above 1, price elastic', 'Infinity, perfectly price elastic'], 0,
      'However high the price goes, the number of seats on that flight cannot change, so quantity supplied does not respond at all: PES = 0.')
  ] };

  // =====================================================================
  // ECO-CALC-04 Calculating price elasticity of supply (PES)
  // =====================================================================
  var SP = [4, 5, 6, 8, 10, 12, 15, 20, 25], SQ = [2, 3, 6, 7, 9, 11, 14, 18, 24, 30];
  function twoS() { var p, q; do { p = pick(SP); q = pick(SQ); } while (p === q); return [p, q]; }
  B['ECO-CALC-04'] = { title: 'Calculating price elasticity of supply (PES)', items: [
    { skill: 'pes-calc', gen: function () {
      var t = twoS(), ans = R.roundDp(t[1] / t[0], 2), prod = pick(['garden sheds', 'school backpacks', 'ceramic tiles', 'phone stands', 'wooden toys']);
      return { kind: 'num', q: 'The price of ' + prod + ' rises by ' + pc(t[0]) + ' and quantity supplied rises by ' + pc(t[1]) + '. Calculate the price elasticity of supply (PES) to two decimal places.',
        answer: ans, unit: '', tol: 0.005, display: d2(ans), why: 'PES = % change in quantity supplied ÷ % change in price = ' + t[1] + ' ÷ ' + t[0] + ' = ' + d2(ans) + '.' };
    } },
    { skill: 'pes-calc', gen: function () {
      var t = twoS(), ans = R.roundDp(t[1] / t[0], 2), f = pick(FIRMS);
      return { kind: 'num', q: 'Prices at ' + f + ' fell by ' + pc(t[0]) + ', and the quantity it supplied fell by ' + pc(t[1]) + '. Calculate the PES to two decimal places.',
        answer: ans, unit: '', tol: 0.005, display: d2(ans), why: 'PES = −' + t[1] + ' ÷ −' + t[0] + ' = ' + d2(ans) + '. A fall divided by a fall is positive, as PES should be.' };
    } },
    { skill: 'pes-calc', gen: function () {
      var p = pick([3.6, 4.2, 5.4, 6.5, 7.8]), q = pick([2.3, 4.7, 5.1, 8.9, 9.4]), ans = R.roundDp(q / p, 2);
      return { kind: 'num', q: 'The price of handmade soap increased by ' + pc(p) + ' and quantity supplied increased by ' + pc(q) + '. Calculate the PES to two decimal places.',
        answer: ans, unit: '', tol: 0.005, display: d2(ans), why: 'PES = ' + fmt(q) + ' ÷ ' + fmt(p) + ' = ' + fmt(q / p, 4) + ' = ' + d2(ans) + ' to two decimal places.' };
    } },
    { skill: 'from-data', gen: function () {
      var P0 = pick([10, 20, 25, 40, 50]), pp = pick([4, 10, 20, 25]), Q0 = pick([200, 400, 500, 1000]), qp = pick([3, 5, 6, 12, 15, 30]);
      var P1 = R.roundDp(P0 * (1 + pp / 100), 2), Q1 = Q0 * (1 + qp / 100), ans = R.roundDp(qp / pp, 2);
      return { kind: 'num', q: 'A furniture workshop responded to a higher price for its bookshelves. Calculate the PES to two decimal places.' + tbl(['', 'Price of a bookshelf', 'Bookshelves supplied per month'], [['Before', cash2(P0), fmt(Q0)], ['After', cash2(P1), fmt(Q1)]]),
        answer: ans, unit: '', tol: 0.005, display: d2(ans),
        why: '% change in price = (' + cash2(P1) + ' − ' + cash2(P0) + ') ÷ ' + cash2(P0) + ' × 100 = +' + pp + '%. % change in quantity supplied = (' + fmt(Q1) + ' − ' + fmt(Q0) + ') ÷ ' + fmt(Q0) + ' × 100 = +' + qp + '%. PES = ' + qp + ' ÷ ' + pp + ' = ' + d2(ans) + '.' };
    } },
    { skill: 'from-data', gen: function () {
      var P0 = pick([2, 4, 5, 8]), pp = pick([10, 20, 25]), Q0 = pick([1000, 2000, 5000]), qp = pick([4, 8, 15, 30, 40]);
      var P1 = R.roundDp(P0 * (1 - pp / 100), 2), Q1 = Q0 * (1 - qp / 100), ans = R.roundDp(qp / pp, 2);
      return { kind: 'num', q: 'The market price of a pack of eggs fell from ' + cash2(P0) + ' to ' + cash2(P1) + '. A poultry farm cut its weekly supply from ' + fmt(Q0) + ' to ' + fmt(Q1) + ' packs. Calculate the PES to two decimal places.',
        answer: ans, unit: '', tol: 0.005, display: d2(ans),
        why: 'Price change = −' + pp + '%; quantity supplied change = (' + fmt(Q1) + ' − ' + fmt(Q0) + ') ÷ ' + fmt(Q0) + ' × 100 = −' + qp + '%. PES = −' + qp + ' ÷ −' + pp + ' = ' + d2(ans) + '.' };
    } },
    { skill: 'from-data', gen: function () {
      var rows = [['Rugs', pick([5, 10, 20]), pick([2, 4, 7])], ['Lamps', pick([4, 8, 10]), pick([9, 12, 14])]];
      var k = pick([0, 1]), r = rows[k], ans = R.roundDp(r[2] / r[1], 2);
      return { kind: 'num', q: 'A homeware maker faced higher prices for two products. Calculate the PES for <b>' + r[0].toLowerCase() + '</b> to two decimal places.' +
          tbl(['Product', '% change in price', '% change in quantity supplied'], rows.map(function (x) { return [x[0], '+' + x[1] + '%', '+' + x[2] + '%']; })),
        answer: ans, unit: '', tol: 0.005, display: d2(ans), why: 'Use the ' + r[0].toLowerCase() + ' row: PES = ' + r[2] + ' ÷ ' + r[1] + ' = ' + d2(ans) + '.' };
    } },
    { skill: 'rearrange', gen: function () {
      var v = pick([0.2, 0.4, 0.5, 0.8, 1.5, 2, 2.5]), p = pick([4, 6, 8, 10, 12]), rise = Math.random() < 0.5, dp = rise ? p : -p, ans = R.roundDp(v * dp, 2);
      return { kind: 'num', q: 'The PES for kitchen scales is ' + fmt(v) + '. The price of kitchen scales ' + (rise ? 'rises' : 'falls') + ' by ' + pc(p) + '. Calculate the percentage change in quantity supplied. Use a minus sign for a fall.',
        answer: ans, unit: '%', display: sg(ans), why: '% change in quantity supplied = PES × % change in price = ' + fmt(v) + ' × ' + sn(dp) + ' = ' + sg(ans) + '.' };
    } },
    { skill: 'rearrange', gen: function () {
      var v = pick([0.5, 1.5, 2, 2.5, 3]), p = pick([2, 4, 6, 8, 10]), q = R.roundDp(v * p, 2);
      return { kind: 'num', q: 'A printing firm has a PES of ' + fmt(v) + '. After a price rise, the quantity it supplied rose by ' + pc(q) + '. By what percentage did the price rise?',
        answer: p, unit: '%', display: pc(p), why: '% change in price = % change in quantity supplied ÷ PES = ' + fmt(q) + ' ÷ ' + fmt(v) + ' = ' + pc(p) + '.' };
    } },
    { skill: 'rearrange', gen: function () {
      var v = pick([0.4, 0.6, 0.8, 1.2, 1.5]), p = pick([5, 10, 15, 20]), Q0 = pick([2000, 4000, 5000, 8000]), Q1 = R.roundDp(Q0 * (1 + v * p / 100), 0);
      return { kind: 'num', q: 'A brick maker supplies ' + fmt(Q0) + ' pallets of bricks a month. Its PES is ' + fmt(v) + '. If the price of bricks rises by ' + pc(p) + ', how many pallets a month will it supply?',
        answer: Q1, unit: 'pallets', display: fmt(Q1), why: '% change in quantity supplied = ' + fmt(v) + ' × ' + p + ' = +' + fmt(R.roundDp(v * p, 2)) + '%. New supply = ' + fmt(Q0) + ' × ' + fmt(1 + v * p / 100) + ' = ' + fmt(Q1) + ' pallets.' };
    } },
    { skill: 'rearrange', gen: function () {
      var v = pick([0.5, 1.2, 2]), p = pick([5, 10, 20]), Q0 = pick([600, 1000, 3000]), Q1 = R.roundDp(Q0 * (1 - v * p / 100), 0);
      return { kind: 'num', q: 'A dairy supplies ' + fmt(Q0) + ' tubs of yoghurt a day. PES for its yoghurt is ' + fmt(v) + '. The price falls by ' + pc(p) + '. How many tubs a day will it now supply?',
        answer: Q1, unit: 'tubs', display: fmt(Q1), why: '% change in quantity supplied = ' + fmt(v) + ' × (−' + p + ') = −' + fmt(R.roundDp(v * p, 2)) + '%. New supply = ' + fmt(Q0) + ' × ' + fmt(1 - v * p / 100) + ' = ' + fmt(Q1) + ' tubs.' };
    } },
    { skill: 'working', gen: function () {
      var t = twoS(), c = d2(t[1] / t[0]), opts = [c, d2(t[0] / t[1]), d2(-t[1] / t[0]), d2(-t[0] / t[1])];
      return { kind: 'mcq', q: 'The price of solar lamps rises by ' + pc(t[0]) + ' and quantity supplied rises by ' + pc(t[1]) + '. What is the PES, to two decimal places?',
        options: opts, answer: 0, why: 'PES = ' + t[1] + ' ÷ ' + t[0] + ' = ' + c + '. It is positive because price and quantity supplied rose together; ' + opts[1] + ' is the formula upside down.' };
    } },
    { skill: 'working', gen: function () {
      var t = twoS();
      return { kind: 'mcq', q: 'The price of a phone screen protector rises by ' + pc(t[0]) + ' and quantity supplied rises by ' + pc(t[1]) + '. Which line of working is correct for PES?',
        options: [t[1] + ' ÷ ' + t[0], t[0] + ' ÷ ' + t[1], t[1] + ' × ' + t[0], '−' + t[1] + ' ÷ ' + t[0]], answer: 0,
        why: 'PES = % change in quantity supplied ÷ % change in price = ' + t[1] + ' ÷ ' + t[0] + ' = ' + d2(t[1] / t[0]) + '. Both changes are rises, so there is no minus sign.' };
    } },
    { skill: 'working', gen: function () {
      var t = twoS(), v = t[1] / t[0], el = v > 1, c = d2(v), w = d2(t[0] / t[1]);
      return { kind: 'mcq', q: 'After ' + aPc(t[0]) + ' price rise, a farm’s supply of tomatoes rose by ' + pc(t[1]) + '. Which answer gives the PES <b>and</b> correctly describes supply?',
        options: [c + ', price ' + (el ? 'elastic' : 'inelastic'), c + ', price ' + (el ? 'inelastic' : 'elastic'), w + ', price ' + (el ? 'inelastic' : 'elastic'), w + ', price ' + (el ? 'elastic' : 'inelastic')], answer: 0,
        why: 'PES = ' + t[1] + ' ÷ ' + t[0] + ' = ' + c + ', which is ' + (el ? 'above' : 'below') + ' 1, so supply is price ' + (el ? 'elastic' : 'inelastic') + '.' };
    } },
    { skill: 'working', gen: function () {
      var t = twoS(), err = pick(['neg', 'inv', 'pct']), right = d2(t[1] / t[0]);
      var wrong = err === 'neg' ? d2(-t[1] / t[0]) : err === 'inv' ? d2(t[0] / t[1]) : right + '%';
      return { kind: 'mcq', q: 'Price fell by ' + pc(t[0]) + ' and quantity supplied fell by ' + pc(t[1]) + '. A student gave the PES as ' + wrong + '. What is the mistake?',
        options: ['Gave a negative PES when both changes were falls', 'Put the price change on top of the fraction', 'Added a % sign to the PES value', 'Used quantity demanded instead of quantity supplied'], answer: err === 'neg' ? 0 : err === 'inv' ? 1 : 2,
        why: 'The correct PES is −' + t[1] + ' ÷ −' + t[0] + ' = ' + right + '. ' + (err === 'neg' ? 'A fall divided by a fall is positive.' : err === 'inv' ? wrong + ' is ' + t[0] + ' ÷ ' + t[1] + ', upside down.' : 'PES is a plain number, so it has no % sign.') };
    } },
    { skill: 'pes-calc', gen: function () {
      var p = pick([3, 6, 7, 9]), q = pick([5, 8, 11, 13]), ans = R.roundDp(q / p, 1);
      return { kind: 'num', q: 'The price of bamboo flooring rises by ' + pc(p) + ' and quantity supplied rises by ' + pc(q) + '. Calculate the PES to <b>one</b> decimal place.',
        answer: ans, unit: '', tol: 0.05, display: fmt(ans, 1), why: 'PES = ' + q + ' ÷ ' + p + ' = ' + fmt(q / p, 3) + ', which is ' + fmt(ans, 1) + ' to one decimal place.' };
    } },
    { skill: 'pes-calc', gen: function () {
      var p = pick([2, 3, 4, 5, 6]), k = pick([2, 3, 4]), q = p * k;
      return { kind: 'num', q: 'A paper-cup factory with plenty of spare capacity sees the price of cups rise by ' + pc(p) + '. Its quantity supplied rises by ' + pc(q) + '. Calculate the PES.',
        answer: k, unit: '', display: String(k), why: 'PES = ' + q + ' ÷ ' + p + ' = ' + k + '. Quantity supplied rose ' + k + ' times as much as price, so supply is price elastic.' };
    } },
    { skill: 'pes-calc', gen: function () {
      var p = pick([8, 10, 15, 25]);
      return { kind: 'num', q: 'Tickets for a sold-out stadium event rose in price by ' + pc(p) + ' on resale sites, but the number of seats in the stadium did not change. Calculate the PES for seats.',
        answer: 0, unit: '', display: '0', why: 'PES = 0 ÷ ' + p + ' = 0. The quantity supplied cannot change at all, so supply is perfectly price inelastic.' };
    } },
    { skill: 'pes-calc', gen: function () {
      var p = pick([10, 15, 20, 25]), q = pick([2, 3, 4, 6]), ans = R.roundDp(q / p, 2);
      return { kind: 'num', q: 'The price of avocados rose by ' + pc(p) + '. Because new trees take years to fruit, growers raised quantity supplied by only ' + pc(q) + '. Calculate the PES to two decimal places.',
        answer: ans, unit: '', tol: 0.005, display: d2(ans), why: 'PES = ' + q + ' ÷ ' + p + ' = ' + d2(ans) + '. Well below 1: supply of this primary product is price inelastic.' };
    } },
    { skill: 'working', gen: function () {
      var t = pick([[0.5, 10, 5], [2, 4, 8], [1.5, 6, 9], [0.25, 12, 3], [0.8, 10, 8]]);
      var opts = ['Price +' + t[1] + '%, quantity supplied +' + t[2] + '%', 'Price +' + t[2] + '%, quantity supplied +' + t[1] + '%', 'Price +' + t[1] + '%, quantity supplied −' + t[2] + '%', 'Price +' + (t[1] + t[2]) + '%, quantity supplied +' + t[2] + '%'];
      return { kind: 'mcq', q: 'Which pair of changes gives a PES of ' + fmt(t[0]) + '?', options: opts, answer: 0,
        why: t[2] + ' ÷ ' + t[1] + ' = ' + fmt(t[0]) + '. Swapping the changes inverts the answer, and quantity falling while price rises would give a negative value.' };
    } },
    { skill: 'working', gen: function () {
      var t = twoS(), c = d2(t[1] / t[0]);
      return { kind: 'mcq', q: 'Price rises by ' + pc(t[0]) + ' and quantity supplied rises by ' + pc(t[1]) + '. Which answer is written correctly for full marks?',
        options: [c, c + '%', '−' + c, d2(t[0] / t[1])], answer: 0, why: 'PES = ' + t[1] + ' ÷ ' + t[0] + ' = ' + c + '. It is a positive plain number: no % sign and no minus sign.' };
    } },
    { skill: 'working', gen: function () {
      var pool = shuffle([[10, 15, 1], [8, 4, 0], [5, 12, 1], [12, 6, 0], [6, 9, 1], [20, 10, 0], [4, 3, 0], [3, 7, 1]]).slice(0, 5);
      if (!pool.some(function (x) { return x[2]; })) pool[0] = [10, 15, 1];
      if (pool.every(function (x) { return x[2]; })) pool[0] = [12, 6, 0];
      return { kind: 'multi', q: 'In each case below the price rises. Which cases show <b>price elastic</b> supply?', options: pool.map(function (x) { return 'Price +' + x[0] + '%, quantity supplied +' + x[1] + '%'; }),
        answers: pool.map(function (x, i) { return x[2] ? i : -1; }).filter(function (i) { return i >= 0; }),
        why: 'Supply is price elastic when quantity supplied changes by a bigger percentage than price (PES above 1): ' + pool.filter(function (x) { return x[2]; }).map(function (x) { return x[1] + ' ÷ ' + x[0] + ' = ' + d2(x[1] / x[0]); }).join('; ') + '.' };
    } },
    { skill: 'working', gen: function () {
      var a = twoS(), b; do { b = twoS(); } while (Math.abs(b[1] / b[0] - a[1] / a[0]) < 0.1);
      var first = a[1] / a[0] > b[1] / b[0];
      return { kind: 'mcq', q: 'Firm M raised output by ' + pc(a[1]) + ' after a price rise of ' + pc(a[0]) + '. Firm N raised output by ' + pc(b[1]) + ' after a price rise of ' + pc(b[0]) + '. Which firm has the more price elastic supply?',
        options: ['Firm M', 'Firm N', 'Both firms have the same PES'], answer: first ? 0 : 1,
        why: 'Firm M: ' + a[1] + ' ÷ ' + a[0] + ' = ' + d2(a[1] / a[0]) + '. Firm N: ' + b[1] + ' ÷ ' + b[0] + ' = ' + d2(b[1] / b[0]) + '. The higher PES belongs to Firm ' + (first ? 'M' : 'N') + '.' };
    } }
  ] };

  // =====================================================================
  // ECO-T11-14 Draw elastic and inelastic demand or supply curves
  // =====================================================================
  var SHAPES = {
    De: 'Price elastic demand', Di: 'Price inelastic demand', Se: 'Price elastic supply', Si: 'Price inelastic supply'
  };
  var SHAPE_WHY = {
    De: 'The curve slopes down (demand) and is flat: the gap Q1 to Q2 is much wider than P1 to P2, so quantity changes proportionately more than price.',
    Di: 'The curve slopes down (demand) and is steep: the gap P1 to P2 is much wider than Q1 to Q2, so quantity changes proportionately less than price.',
    Se: 'The curve slopes up (supply) and is flat: the gap Q1 to Q2 is much wider than P1 to P2, so quantity supplied changes proportionately more than price.',
    Si: 'The curve slopes up (supply) and is steep: the gap P1 to P2 is much wider than Q1 to Q2, so quantity supplied changes proportionately less than price.'
  };
  function stdLab(k) { return k.charAt(0) === 'D' ? { pU: 'P1', pL: 'P2', qU: 'Q1', qL: 'Q2' } : { pU: 'P2', pL: 'P1', qU: 'Q2', qL: 'Q1' }; }
  B['ECO-T11-14'] = { title: 'Draw elastic and inelastic demand or supply curves', items: [
    { skill: 'read-diagram', gen: function () {
      var k = pick(['De', 'Di', 'Se', 'Si']);
      return { kind: 'mcq', q: 'What does the diagram show?', svg: diagram({ g: k, label: k.charAt(0), lab: stdLab(k), aria: 'A straight-line curve with price and quantity changes marked on both axes' }),
        options: ['Price elastic demand', 'Price inelastic demand', 'Price elastic supply', 'Price inelastic supply'], answer: ['De', 'Di', 'Se', 'Si'].indexOf(k), why: SHAPE_WHY[k] };
    } },
    { skill: 'choose-diagram', gen: function () {
      var order = shuffle(['De', 'Di', 'Se', 'Si']), target = pick(order);
      return { kind: 'mcq', q: 'Which diagram shows <b>' + SHAPES[target].toLowerCase() + '</b>?', svg: panels(order.map(function (k) { return { g: k, label: k.charAt(0) }; }), 'Four small diagrams, A to D, each with one straight line'),
        options: ['Diagram A', 'Diagram B', 'Diagram C', 'Diagram D'], answer: order.indexOf(target), why: SHAPE_WHY[target].replace(/: the gap.*$/, '. The dashed lines show the size of the price and quantity changes.') };
    } },
    { skill: 'choose-diagram', gen: function () {
      var order = shuffle(['De', 'Di', 'Se', 'Si']), want = pick(['e', 'i']);
      var ans = order.map(function (k, i) { return k.charAt(1) === want ? i : -1; }).filter(function (i) { return i >= 0; });
      return { kind: 'multi', q: 'Which diagrams show a price <b>' + (want === 'e' ? 'elastic' : 'inelastic') + '</b> curve, whether demand or supply?', svg: panels(order.map(function (k) { return { g: k, label: k.charAt(0) }; }), 'Four small diagrams, A to D, each with one straight line'),
        options: ['Diagram A', 'Diagram B', 'Diagram C', 'Diagram D'], answers: ans,
        why: want === 'e' ? 'Elastic curves are drawn flat, so a small price change goes with a large quantity change. That is true for flat demand and flat supply.' : 'Inelastic curves are drawn steep, so a large price change goes with a small quantity change, for demand or supply.' };
    } },
    { skill: 'choose-diagram', gen: function () {
      var order = shuffle(['De', 'Di', 'Se', 'Si']), c = pick([
        ['Si', 'the supply of cocoa beans in the short run, when new trees take years to grow'],
        ['De', 'the demand for one brand of crisps, which has many close substitutes'],
        ['Se', 'the supply of plastic hangers from a factory with lots of spare capacity'],
        ['Di', 'the demand for a life-saving medicine with no substitutes']]);
      return { kind: 'mcq', q: 'Which diagram best shows ' + c[1] + '?', svg: panels(order.map(function (k) { return { g: k, label: k.charAt(0) }; }), 'Four small diagrams, A to D, each with one straight line'),
        options: ['Diagram A', 'Diagram B', 'Diagram C', 'Diagram D'], answer: order.indexOf(c[0]),
        why: 'This is ' + SHAPES[c[0]].toLowerCase() + ', so choose the ' + (c[0].charAt(0) === 'D' ? 'downward-sloping' : 'upward-sloping') + ' line that is ' + (c[0].charAt(1) === 'e' ? 'flat (shallow).' : 'steep.') };
    } },
    { skill: 'curve-shape', gen: function () {
      var k = pick(['De', 'Di', 'Se', 'Si']);
      var opts = { De: 'A shallow line sloping downwards from left to right', Di: 'A steep line sloping downwards from left to right', Se: 'A shallow line sloping upwards from left to right', Si: 'A steep line sloping upwards from left to right' };
      var keys = ['De', 'Di', 'Se', 'Si'];
      return { kind: 'mcq', q: 'How should you draw a curve showing <b>' + SHAPES[k].toLowerCase() + '</b>?', options: keys.map(function (x) { return opts[x]; }), answer: keys.indexOf(k),
        why: 'Demand slopes down and supply slopes up. Elastic is drawn shallow (flat) and inelastic steep, so that the quantity gap is ' + (k.charAt(1) === 'e' ? 'wider' : 'narrower') + ' than the price gap.' };
    } },
    mc('axis-changes', 'You are asked to draw <b>price inelastic demand</b> and show a change in price on both axes. How should the gaps compare?',
      ['P1 to P2 on the price axis should be clearly wider than Q1 to Q2 on the quantity axis',
       'Q1 to Q2 on the quantity axis should be clearly wider than P1 to P2 on the price axis',
       'P1 to P2 and Q1 to Q2 should be the same size to show the change accurately',
       'Only P1 to P2 needs to be shown, because quantity does not change at all'], 0,
      'Inelastic means quantity changes proportionately less than price, so the price gap must look clearly larger than the quantity gap.'),
    mc('axis-changes', 'You are asked to draw <b>price elastic supply</b>. How should the gaps on the axes compare?',
      ['Q1 to Q2 should be clearly wider than P1 to P2', 'P1 to P2 should be clearly wider than Q1 to Q2', 'Both gaps should be exactly the same width', 'Only the quantity axis needs to be marked'], 0,
      'Elastic supply means quantity supplied changes proportionately more than price, so the quantity gap must be clearly wider than the price gap.'),
    mc('axis-changes', 'When showing a price change on an elasticity diagram, where should the dashed lines be drawn?',
      ['From each point on the curve across to the price axis and down to the quantity axis',
       'From each point on the curve across to the price axis only, with no quantity marks',
       'From the origin up to each point on the curve, with no labels on the axes',
       'Along the curve itself, between the two points, with arrows showing direction'], 0,
      'Marks go for showing both changes: dashed lines from each point to the price axis (P1, P2) and to the quantity axis (Q1, Q2).'),
    { skill: 'perfect-cases', gen: function () {
      var v = Math.random() < 0.5;
      return { kind: 'mcq', q: 'What does the line in this diagram show?', svg: diagram({ g: v ? 'v' : 'h', label: v ? 'S' : 'D', lab: v ? { pU: 'P2', pL: 'P1' } : { pU: '', pL: '', qU: 'Q1', qL: 'Q2' }, only: v ? 'P' : '', aria: v ? 'A vertical supply line' : 'A horizontal demand line' }),
        options: ['Perfectly price inelastic', 'Perfectly price elastic', 'Unitary price elasticity', 'Price inelastic, but not perfectly'], answer: v ? 0 : 1,
        why: v ? 'A vertical line means the same quantity whatever the price: quantity does not respond at all, so elasticity is 0 (perfectly price inelastic).' : 'A horizontal line means any quantity at one price, but none above it: elasticity is infinity (perfectly price elastic).' };
    } },
    mc('perfect-cases', 'A theatre has exactly 1,200 seats for one evening’s performance. How should the supply of seats for that performance be drawn?',
      ['As a vertical line at 1,200 seats', 'As a horizontal line at the ticket price', 'As a shallow upward-sloping line', 'As a downward-sloping line'], 0,
      'The number of seats cannot change whatever the price, so supply is perfectly price inelastic (PES = 0), drawn as a vertical line.'),
    { skill: 'drawing-errors', gen: function () {
      var e = pick(['steep', 'down', 'equal', 'one']);
      var svg = e === 'steep' ? diagram({ g: 'Di', label: 'D', lab: stdLab('Di'), aria: 'A student drawing of a demand curve' })
        : e === 'down' ? diagram({ g: 'De', label: 'S', lab: { pU: 'P2', pL: 'P1', qU: 'Q2', qL: 'Q1' }, aria: 'A student drawing of a supply curve' })
        : e === 'equal' ? diagram({ g: 'Deq', label: 'D', lab: stdLab('De'), aria: 'A student drawing of a demand curve' })
        : diagram({ g: 'De', label: 'D', lab: { pU: 'P1', pL: 'P2' }, only: 'P', aria: 'A student drawing of a demand curve' });
      var task = e === 'down' ? 'price elastic supply' : 'price elastic demand';
      var opts = ['The curve is too steep, so it shows inelastic rather than elastic', 'A supply curve should slope upwards, not downwards', 'The price and quantity gaps are about the same size, so elasticity is unclear', 'The change in quantity is not shown on the quantity axis'];
      return { kind: 'mcq', q: 'A student was asked to draw <b>' + task + '</b> and show a price change on both axes. What is the main error in the drawing?', svg: svg,
        options: opts, answer: ['steep', 'down', 'equal', 'one'].indexOf(e),
        why: ['Elastic curves must be flat, so that a small price change gives a large quantity change. A steep line shows inelastic demand.', 'Supply always slopes upwards from left to right; the student has drawn the shape of a demand curve.', 'For elastic, the quantity gap Q1 to Q2 must be clearly wider than the price gap P1 to P2; equal gaps lose that mark.', 'Both axes need marking. Without Q1 and Q2 the change in quantity is not shown, so a mark is lost.'][['steep', 'down', 'equal', 'one'].indexOf(e)] };
    } },
    mu('axis-changes', 'Which features are needed for full marks when drawing <b>price elastic supply</b>?',
      ['A curve labelled S', 'The curve slopes upwards and is shallow', 'P1 and P2 marked on the price axis', 'Q1 and Q2 marked on the quantity axis, wider apart than P1 to P2', 'The curve slopes downwards', 'The price gap is wider than the quantity gap'], [0, 1, 2, 3],
      'Credit goes to a correctly sloped, labelled curve, the price change on the price axis, and a larger quantity change on the quantity axis. A downward slope or a wider price gap would show something else.'),
    { skill: 'compare-curves', gen: function () {
      var L3 = shuffle(['A', 'B', 'C']), want = pick(['most', 'least']);
      var ansLetter = want === 'most' ? L3[0] : L3[2];
      return { kind: 'mcq', q: 'Three demand curves, A, B and C, pass through point X. At point X, which curve shows the <b>' + want + '</b> price elastic demand?', svg: throughX('D', L3, 'Three downward-sloping demand curves of different steepness passing through point X'),
        options: ['Curve A', 'Curve B', 'Curve C'], answer: ['A', 'B', 'C'].indexOf(ansLetter),
        why: 'At the same point, the flatter the curve, the more quantity demanded responds to a price change. Curve ' + L3[0] + ' is the flattest (most elastic) and curve ' + L3[2] + ' the steepest (least elastic).' };
    } },
    { skill: 'compare-curves', gen: function () {
      var L3 = shuffle(['A', 'B', 'C']), want = pick(['most', 'least']);
      var ansLetter = want === 'most' ? L3[0] : L3[2];
      return { kind: 'mcq', q: 'Three supply curves, A, B and C, pass through point X. At point X, which curve shows the <b>' + want + '</b> price elastic supply?', svg: throughX('S', L3, 'Three upward-sloping supply curves of different steepness passing through point X'),
        options: ['Curve A', 'Curve B', 'Curve C'], answer: ['A', 'B', 'C'].indexOf(ansLetter),
        why: 'Through the same point, a flatter supply curve means quantity supplied responds more to price. Curve ' + L3[0] + ' is the flattest (most elastic) and curve ' + L3[2] + ' the steepest (least elastic).' };
    } },
    { skill: 'read-diagram', gen: function () {
      var el = Math.random() < 0.5, P0 = pick([8, 10, 20, 40]), pp = el ? pick([5, 10]) : pick([40, 50]), Q0 = pick([200, 400, 1000]), qp = el ? pick([30, 40, 50]) : pick([5, 10]);
      var Pfall = P0 * (1 - pp / 100), Qrise = Q0 * (1 + qp / 100);
      return { kind: 'mcq', q: 'The diagram shows a fall in the price of a product. What does it show about demand?',
        svg: diagram({ g: el ? 'De' : 'Di', label: 'D', lab: { pU: cash(P0), pL: cash(Pfall), qU: fmt(Q0), qL: fmt(Qrise) }, aria: 'A demand curve with prices and quantities marked on the axes' }),
        options: ['Price elastic, because quantity changes by a larger percentage than price', 'Price inelastic, because quantity changes by a smaller percentage than price', 'Perfectly price inelastic, because quantity does not change', 'Unitary, because price and quantity change by the same percentage'], answer: el ? 0 : 1,
        why: 'Price falls by ' + pc(pp) + ' (' + cash(P0) + ' to ' + cash(Pfall) + ') and quantity rises by ' + pc(qp) + ' (' + fmt(Q0) + ' to ' + fmt(Qrise) + '). Quantity changes by ' + (el ? 'more, so demand is price elastic.' : 'less, so demand is price inelastic.') };
    } },
    { skill: 'read-diagram', gen: function () {
      var el = Math.random() < 0.5, P0 = pick([5, 10, 20, 50]), pp = el ? pick([4, 10]) : pick([40, 60]), Q0 = pick([100, 500, 2000]), qp = el ? pick([30, 40, 60]) : pick([4, 10]);
      var P1 = P0 * (1 + pp / 100), Q1 = Q0 * (1 + qp / 100);
      return { kind: 'mcq', q: 'The diagram shows a rise in the price of a product and the response of its suppliers. What does it show?',
        svg: diagram({ g: el ? 'Se' : 'Si', label: 'S', lab: { pU: cash(P1), pL: cash(P0), qU: fmt(Q1), qL: fmt(Q0) }, aria: 'A supply curve with prices and quantities marked on the axes' }),
        options: ['Price elastic supply', 'Price inelastic supply', 'Perfectly price elastic supply', 'Price elastic demand'], answer: el ? 0 : 1,
        why: 'Price rises by ' + pc(pp) + ' (' + cash(P0) + ' to ' + cash(P1) + ') and quantity supplied rises by ' + pc(qp) + ' (' + fmt(Q0) + ' to ' + fmt(Q1) + '). PES = ' + qp + ' ÷ ' + pp + ' = ' + d2(qp / pp) + ', ' + (el ? 'above 1: elastic.' : 'below 1: inelastic.') };
    } },
    { skill: 'read-diagram', gen: function () {
      var k = pick(['De', 'Di']);
      return { kind: 'mcq', q: 'The diagram shows the price falling from P1 to P2. Which caption fits the diagram?', svg: diagram({ g: k, label: 'D', lab: stdLab(k), aria: 'A demand curve with a price fall from P1 to P2' }),
        options: ['A small price cut leads to a large rise in quantity demanded', 'A large price cut leads to a small rise in quantity demanded', 'A small price cut leads to a large fall in quantity demanded', 'A large price cut leads to no change in quantity demanded'], answer: k === 'De' ? 0 : 1,
        why: 'Compare the gaps: ' + (k === 'De' ? 'P1 to P2 is narrow and Q1 to Q2 is wide, so this is elastic demand.' : 'P1 to P2 is wide and Q1 to Q2 is narrow, so this is inelastic demand.') + ' A price cut always raises quantity demanded along a demand curve.' };
    } },
    mc('drawing-errors', 'A student labels a steep, upward-sloping line “D” and marks a large price change and a small quantity change. What should be corrected?',
      ['Label it S: an upward line is supply, and it shows price inelastic supply', 'Make it flatter: an upward line labelled D shows elastic demand', 'Nothing: a steep line labelled D shows inelastic demand', 'Swap the axes, so that price is on the horizontal axis'], 0,
      'Upward-sloping lines are supply curves, so the label must be S. Being steep with a wide price gap, it shows price inelastic supply.'),
    mc('curve-shape', 'Over time, consumers find substitutes for a product, so demand becomes more price elastic. How would the long-run demand curve through the same point compare with the short-run curve?',
      ['It would be flatter', 'It would be steeper', 'It would be vertical', 'It would slope upwards'], 0,
      'More elastic demand is drawn flatter: for the same price change, quantity demanded changes by more.'),
    mc('curve-shape', 'A farm can plant more crops next season, so its supply becomes more price elastic in the long run. How should the long-run supply curve through the same point be drawn?',
      ['Flatter than the short-run supply curve', 'Steeper than the short-run supply curve', 'As a vertical line', 'Sloping downwards'], 0,
      'More elastic supply is drawn flatter: quantity supplied changes by more for the same price change.'),
    mc('axis-changes', 'In a 4EC1 elasticity diagram, which axis shows price and which shows quantity?',
      ['Price on the vertical axis, quantity on the horizontal axis', 'Quantity on the vertical axis, price on the horizontal axis', 'Price on both axes, before and after the change', 'Quantity on both axes, before and after the change'], 0,
      'Demand and supply diagrams always have price on the vertical (y) axis and quantity on the horizontal (x) axis, so P1 and P2 go on the vertical axis.'),
    mc('curve-shape', 'Why is it a mistake to draw the price gap and the quantity gap about the same size when asked for price elastic demand?',
      ['Elastic demand must show quantity changing proportionately more than price', 'Equal gaps show perfectly price elastic demand instead', 'Elastic demand must show no change in price at all', 'Equal gaps show that the curve is a supply curve'], 0,
      'The examiner looks for a narrow price gap and a clearly wider quantity gap. Gaps of the same size do not show elasticity clearly, so that mark is lost.')
  ] };

  // =====================================================================
  // ECO-T12-06 Revenue, costs and profit: meanings and formulas
  // =====================================================================
  var COST_ITEMS = [
    ['Monthly rent for a workshop', 0], ['Annual insurance premium', 0], ['Salary of the office manager', 0], ['A yearly advertising contract', 0], ['Interest on a bank loan', 0],
    ['Flour used in each loaf baked', 1], ['Packaging for each order shipped', 1], ['Wages paid for each item made', 1], ['Electricity for machines, per hour of production', 1], ['Fabric used in each shirt sewn', 1],
    ['Money received from customers for items sold', 2], ['Payments from customers for repair jobs', 2]];
  B['ECO-T12-06'] = { title: 'Revenue, costs and profit: meanings and formulas', items: [
    mc('define', 'What is meant by <b>total revenue</b>?',
      ['All the money a firm receives from selling its output', 'The money left after a firm has paid all its costs', 'The money a firm spends on making its products', 'The price a firm charges for one unit of output'], 0,
      'Total revenue is the money coming in from sales (price × quantity sold). The money left after costs is profit, a different idea.'),
    mc('define', 'What is meant by <b>total costs</b>?',
      ['All the costs of production: total fixed costs plus total variable costs', 'Only the costs that change when the firm changes its output', 'The cost of producing one unit, found by dividing by output', 'The money received from sales minus the money paid out'], 0,
      'Total costs include both parts: fixed costs, which do not change with output, and variable costs, which do. TC = TFC + TVC.'),
    mc('define', 'Which is the best meaning of <b>fixed costs</b>?',
      ['Costs that do not change when the firm’s output changes', 'Costs that rise and fall directly with the firm’s output', 'Costs that the government fixes for every firm', 'Costs that are paid only once when a firm starts up'], 0,
      'Fixed costs, such as rent and insurance, stay the same whether the firm makes 10 units or 10,000 in the period.'),
    mc('define', 'Which is the best meaning of <b>variable costs</b>?',
      ['Costs that change directly with the level of output', 'Costs that stay the same at every level of output', 'Costs that change only when prices in the economy rise', 'Costs that a firm can choose not to pay'], 0,
      'Variable costs, such as raw materials, rise when output rises and fall when output falls.'),
    mc('define', 'What does <b>average cost</b> show?',
      ['The cost of producing one unit of output', 'The total of all fixed costs in a period', 'The profit made on each unit sold', 'The price charged for each unit sold'], 0,
      'Average (total) cost is total cost divided by the number of units produced, so it is the cost per unit.'),
    mc('formula', 'Which formula gives <b>total revenue</b>?',
      ['Price × quantity sold', 'Total costs ÷ quantity sold', 'Total revenue − total costs', 'Price ÷ quantity sold'], 0,
      'TR = P × Q. TC ÷ Q is average cost and TR − TC is profit.'),
    mc('formula', 'Which formula gives <b>total costs</b>?',
      ['Total fixed costs + total variable costs', 'Total revenue − total fixed costs', 'Total variable costs ÷ output', 'Total fixed costs × output'], 0,
      'TC = TFC + TVC. Both kinds of cost must be added.'),
    mc('formula', 'Which formula is used to calculate <b>average cost</b>?',
      ['Total costs ÷ quantity produced', 'Total fixed costs ÷ quantity produced', 'Total variable costs ÷ quantity produced', 'Total revenue ÷ quantity produced'], 0,
      'Average cost uses <b>total</b> cost. Fixed or variable cost alone leaves part out, and total revenue ÷ quantity is the price, not a cost.'),
    mc('formula', 'Which is the formula for <b>profit</b>?',
      ['Total revenue − total costs', 'Total costs − total revenue', 'Price × quantity sold', 'Total revenue − total fixed costs'], 0,
      'Profit = TR − TC. If the answer is negative, the firm has made a loss. Taking away only fixed costs ignores variable costs.'),
    mc('formula', 'A firm knows its total revenue and the price of its product. Which formula gives the quantity it sold?',
      ['Total revenue ÷ price', 'Price ÷ total revenue', 'Total revenue × price', 'Total revenue − price'], 0,
      'Rearranging TR = P × Q gives Q = TR ÷ P.'),
    { skill: 'formula', gen: function () {
      var P = pick([4, 5, 6, 8, 12, 15]), Q = pick([300, 400, 500, 600, 800]), FC = pick([600, 900, 1200, 1500]), v = pick([1, 2, 3]);
      if (v >= P) v = 1;
      var TR = P * Q, TVC = v * Q, TC = FC + TVC, PR = TR - TC;
      var vals = [['Total revenue', TR], ['Total costs', TC], ['Profit', PR], ['Total variable costs', TVC]];
      var seen = {}; vals.forEach(function (x) { seen[x[1]] = (seen[x[1]] || 0) + 1; });
      var choices = vals.filter(function (x) { return seen[x[1]] === 1 && x[1] > 0; });
      var t = pick(choices);
      return { kind: 'mcq', q: 'A juice stall sells ' + fmt(Q) + ' bottles a week at ' + cash(P) + ' each. Its fixed costs are ' + cash(FC) + ' a week and its variable cost is ' + cash(v) + ' per bottle. Which measure has a value of ' + cash(t[1]) + '?',
        options: vals.map(function (x) { return x[0]; }), answer: vals.indexOf(t),
        why: 'TR = ' + cash(P) + ' × ' + fmt(Q) + ' = ' + cash(TR) + '. TVC = ' + cash(v) + ' × ' + fmt(Q) + ' = ' + cash(TVC) + '. TC = ' + cash(FC) + ' + ' + cash(TVC) + ' = ' + cash(TC) + '. Profit = ' + cash(TR) + ' − ' + cash(TC) + ' = ' + cash(PR) + '.' };
    } },
    mu('classify', 'A bakery lists these costs. Which are <b>fixed</b> costs?',
      ['Rent for the shop', 'Insurance for the building', 'Salary of the shop manager', 'Flour and butter', 'Paper bags for each loaf sold'], [0, 1, 2],
      'Rent, insurance and a manager’s salary stay the same whatever the number of loaves baked. Ingredients and bags rise with output, so they are variable.'),
    mu('classify', 'A T-shirt printer lists these costs. Which are <b>variable</b> costs?',
      ['Blank T-shirts', 'Ink used for each print', 'Pay of workers paid per shirt printed', 'Monthly rent of the unit', 'Insurance for the printing machine'], [0, 1, 2],
      'Shirts, ink and piece-rate pay all rise with each extra shirt printed. Rent and insurance are fixed.'),
    { skill: 'classify', gen: function () {
      var it = pick(COST_ITEMS);
      return { kind: 'mcq', q: 'How should this item be classified? <b>' + it[0] + '</b>', options: ['Fixed cost', 'Variable cost', 'Revenue, not a cost'], answer: it[1],
        why: ['It stays the same whatever the level of output, so it is a fixed cost.', 'It rises and falls with the amount produced, so it is a variable cost.', 'It is money coming in from sales, so it is revenue, not a cost.'][it[1]] };
    } },
    mc('classify', 'At a furniture workshop, carpenters are paid $15 for each chair they make. How should their pay be classified?',
      ['Variable cost, because it rises with the number of chairs made', 'Fixed cost, because wages are always fixed costs', 'Fixed cost, because the $15 rate does not change', 'Revenue, because it is paid out for each chair'], 0,
      'Pay linked to each unit made rises as output rises, so it is a variable cost. A fixed salary would be a fixed cost.'),
    mc('classify', 'A firm produces nothing this month. What are its total costs equal to?',
      ['Its total fixed costs', 'Its total variable costs', 'Zero, because nothing was produced', 'Its total revenue'], 0,
      'At zero output there are no variable costs, but fixed costs such as rent must still be paid, so TC = TFC.'),
    mu('classify', 'A firm increases its output but keeps the same premises and managers. Which of these will rise?',
      ['Total variable costs', 'Total costs', 'Total fixed costs', 'Rent'], [0, 1],
      'More output needs more materials and per-unit labour, so TVC rises, and TC = TFC + TVC rises too. Fixed costs such as rent do not change.'),
    mc('profit-effect', 'Café Brisa’s total revenue rose by 20% this year, but its profit fell. How is this possible?',
      ['Its total costs rose by more than its total revenue', 'Its total costs fell by more than its total revenue', 'Its revenue is the same thing as its profit', 'It sold fewer cups of coffee than last year'], 0,
      'Profit = TR − TC. If costs grow by more money than revenue does, the gap between them shrinks, so profit falls even though revenue rose.'),
    mc('profit-effect', 'The price of flour rises sharply. A bakery cannot raise the price of its bread. Which is the correct chain of reasoning?',
      ['Variable costs rise, so total costs rise, so profit falls', 'Fixed costs rise, so total revenue falls, so profit falls', 'Variable costs rise, so total revenue rises, so profit rises', 'Total revenue falls, so variable costs fall, so profit is unchanged'], 0,
      'Flour is a variable cost. Higher variable costs raise total costs; with revenue unchanged, TR − TC gets smaller, so profit falls.'),
    mc('profit-effect', 'A design firm moves to cheaper offices, cutting its rent. Its sales do not change. What happens?',
      ['Fixed costs fall, so total costs fall and profit rises', 'Variable costs fall, so total revenue rises', 'Fixed costs fall, so average cost rises', 'Total revenue falls, so profit falls'], 0,
      'Rent is a fixed cost. Lower rent cuts total costs; with revenue the same, profit = TR − TC rises.'),
    mc('profit-effect', 'A firm’s total costs are greater than its total revenue. What does this mean?',
      ['The firm is making a loss', 'The firm is making a profit', 'The firm’s fixed costs are zero', 'The firm’s average cost is zero'], 0,
      'Profit = TR − TC. When TC is bigger than TR, the answer is negative, which is a loss.'),
    mu('profit-effect', 'Other things staying the same, which of these would <b>increase</b> a firm’s profit?',
      ['Moving to premises with lower rent', 'Finding a cheaper supplier of raw materials', 'Selling more units at a price above the variable cost of each unit', 'Agreeing to pay workers more for each unit made', 'Paying a higher insurance premium'], [0, 1, 2],
      'Lower fixed or variable costs raise profit, and so do extra sales that bring in more than they add to costs. Higher pay per unit and dearer insurance raise costs, cutting profit.'),
    mc('profit-effect', 'A student writes: “The firm’s revenue was $80,000, so its profit was $80,000.” What is the error?',
      ['Revenue is not profit: costs must be subtracted from revenue first', 'Profit is found by adding costs to revenue', 'Revenue must be divided by output to give profit', 'Profit is always equal to revenue for a small firm'], 0,
      'Revenue is the money coming in. Profit is what is left after paying total costs: profit = TR − TC.')
  ] };

  // =====================================================================
  // ECO-CALC-06 Total revenue: price times quantity
  // =====================================================================
  B['ECO-CALC-06'] = { title: 'Total revenue: price times quantity', items: [
    { skill: 'tr-calc', gen: function () {
      var P = pick([12, 15, 24, 35, 45, 60, 85]), Q = pick([120, 250, 340, 480, 650, 900]), TR = P * Q, f = pick(FIRMS);
      return { kind: 'num', q: f + ' charges ' + cash(P) + ' per customer and serves ' + fmt(Q) + ' customers in a month. Calculate its total revenue for the month. Give your answer in $.',
        answer: TR, unit: '$', display: fmt(TR), why: 'TR = price × quantity = ' + cash(P) + ' × ' + fmt(Q) + ' = ' + cash(TR) + '.' };
    } },
    { skill: 'tr-calc', gen: function () {
      var P = pick([2.5, 3.75, 4.2, 6.4, 8.5, 12.25]), Q = pick([120, 240, 360, 400, 560, 800]), TR = R.roundDp(P * Q, 2);
      return { kind: 'num', q: 'A street-food van sells ' + fmt(Q) + ' wraps at ' + cash2(P) + ' each. Calculate its total revenue. Give your answer in $.',
        answer: TR, unit: '$', tol: 0.005, display: fmt(TR, dpOf(TR) ? 2 : 0), why: 'TR = ' + cash2(P) + ' × ' + fmt(Q) + ' = ' + cash(TR) + '.' };
    } },
    { skill: 'rearrange', gen: function () {
      var P = pick([8, 12, 25, 40, 45, 60]), Q = pick([75, 90, 140, 220, 360]), TR = P * Q;
      return { kind: 'num', q: 'A climbing gym charges ' + cash(P) + ' for each session. Its total revenue last month was ' + cash(TR) + '. How many sessions did it sell?',
        answer: Q, unit: 'sessions', display: fmt(Q), why: 'Q = TR ÷ P = ' + cash(TR) + ' ÷ ' + cash(P) + ' = ' + fmt(Q) + ' sessions.' };
    } },
    { skill: 'rearrange', gen: function () {
      var P = pick([6, 14, 18, 32, 55]), Q = pick([150, 240, 400, 625, 800]), TR = P * Q;
      return { kind: 'num', q: 'A firm sold ' + fmt(Q) + ' phone cases and received total revenue of ' + cash(TR) + '. What price did it charge for each case? Give your answer in $.',
        answer: P, unit: '$', display: fmt(P), why: 'P = TR ÷ Q = ' + cash(TR) + ' ÷ ' + fmt(Q) + ' = ' + cash(P) + '.' };
    } },
    { skill: 'sum-first', gen: function () {
      var P = pick([4, 6, 9, 15, 22]), wk = [rint(30, 90) * 5, rint(30, 90) * 5, rint(30, 90) * 5, rint(30, 90) * 5], tot = wk.reduce(function (a, b) { return a + b; }, 0), TR = P * tot;
      return { kind: 'num', q: 'A bakery sells cinnamon buns at ' + cash(P) + ' each. Calculate its total revenue from buns over the four weeks. Give your answer in $.' +
          tbl(['Week', '1', '2', '3', '4'], [['Buns sold'].concat(wk.map(function (x) { return fmt(x); }))]),
        answer: TR, unit: '$', display: fmt(TR), why: 'Add the sales first: ' + wk.map(function (x) { return fmt(x); }).join(' + ') + ' = ' + fmt(tot) + '. TR = ' + cash(P) + ' × ' + fmt(tot) + ' = ' + cash(TR) + '.' };
    } },
    { skill: 'ignore-cost', gen: function () {
      var P = pick([20, 30, 45, 60, 75]), c = pick([8, 12, 15, 18]), Q = pick([150, 220, 300, 420]), TR = P * Q;
      return { kind: 'num', q: 'Hana’s calligraphy classes cost her ' + cash(c) + ' per student to run. She charges ' + cash(P) + ' per student and teaches ' + fmt(Q) + ' students a month. Calculate her total revenue per month. Give your answer in $.',
        answer: TR, unit: '$', display: fmt(TR), why: 'Revenue uses the price, not the cost: TR = ' + cash(P) + ' × ' + fmt(Q) + ' = ' + cash(TR) + '. The ' + cash(c) + ' cost is not part of revenue.' };
    } },
    { skill: 'mcq-distractors', gen: function () {
      var P = pick([40, 75, 120, 160, 250]), c = pick([15, 30, 50, 90]), Q = pick([200, 500, 1200, 2000, 4000]);
      if (c >= P) c = Math.round(P / 2);
      var opts = [cash(P * Q), cash(c * Q), cash(P + Q), cash(P * c)];
      return { kind: 'mcq', q: 'A firm sells ' + fmt(Q) + ' units at a price of ' + cash(P) + ' each. Each unit costs ' + cash(c) + ' to make. What is the firm’s total revenue?',
        options: opts, answer: 0, why: 'TR = ' + cash(P) + ' × ' + fmt(Q) + ' = ' + cash(P * Q) + '. ' + opts[1] + ' uses the cost per unit, ' + opts[2] + ' adds price and quantity, and ' + opts[3] + ' multiplies price by cost.' };
    } },
    { skill: 'tr-calc', gen: function () {
      var P0 = pick([20, 25, 40]), P1 = P0 + pick([2, 5, 10]), Q0 = pick([500, 800, 1000]), Q1 = Q0 - pick([50, 100, 150]), TR = P1 * Q1;
      return { kind: 'num', q: 'A boat-tour firm raised its ticket price from ' + cash(P0) + ' to ' + cash(P1) + '. Monthly tickets sold fell from ' + fmt(Q0) + ' to ' + fmt(Q1) + '. Calculate the <b>new</b> total revenue per month. Give your answer in $.',
        answer: TR, unit: '$', display: fmt(TR), why: 'Use the new price and new quantity: TR = ' + cash(P1) + ' × ' + fmt(Q1) + ' = ' + cash(TR) + '.' };
    } },
    { skill: 'tr-calc', gen: function () {
      var P0 = pick([10, 12, 16, 20]), cut = pick([2, 4]), Q0 = pick([300, 400, 600]), Q1 = Q0 + pick([60, 100, 150, 200]), P1 = P0 - cut;
      var d = P1 * Q1 - P0 * Q0;
      return { kind: 'num', q: 'A car wash cut its price from ' + cash(P0) + ' to ' + cash(P1) + '. Weekly washes rose from ' + fmt(Q0) + ' to ' + fmt(Q1) + '. Calculate the change in weekly total revenue in $. Use a minus sign for a fall.',
        answer: d, unit: '$', display: fmt(d), why: 'Old TR = ' + cash(P0) + ' × ' + fmt(Q0) + ' = ' + cash(P0 * Q0) + '. New TR = ' + cash(P1) + ' × ' + fmt(Q1) + ' = ' + cash(P1 * Q1) + '. Change = ' + cash(P1 * Q1) + ' − ' + cash(P0 * Q0) + ' = ' + cash(d) + '.' };
    } },
    { skill: 'choose-product', gen: function () {
      var a = [pick([30, 45, 60]), pick([400, 500, 800])], b = [pick([1200, 1500, 1800]), pick([15, 20, 25])];
      var elFirst = Math.random() < 0.5, el = elFirst ? a : b;
      var rows = [['Product M', elFirst ? '−1.6' : '−0.4', cash(a[0]), fmt(a[1])], ['Product N', elFirst ? '−0.4' : '−1.6', cash(b[0]), fmt(b[1])]];
      return { kind: 'num', q: 'Calculate the total revenue for the product whose demand is <b>price elastic</b>. Give your answer in $.' + tbl(['Product', 'PED', 'Price', 'Quantity sold'], rows),
        answer: el[0] * el[1], unit: '$', display: fmt(el[0] * el[1]),
        why: 'Price elastic demand has PED above 1 in size, so choose ' + (elFirst ? 'Product M' : 'Product N') + ' (−1.6). TR = ' + cash(el[0]) + ' × ' + fmt(el[1]) + ' = ' + cash(el[0] * el[1]) + '.' };
    } },
    { skill: 'sum-first', gen: function () {
      var pa = pick([3, 4, 5]), qa = pick([300, 450, 600]), pb = pick([7, 8, 12]), qb = pick([150, 200, 250]), TR = pa * qa + pb * qb;
      return { kind: 'num', q: 'A kiosk sells ' + fmt(qa) + ' coffees at ' + cash(pa) + ' each and ' + fmt(qb) + ' sandwiches at ' + cash(pb) + ' each in a week. Calculate its total revenue for the week. Give your answer in $.',
        answer: TR, unit: '$', display: fmt(TR), why: 'TR = (' + cash(pa) + ' × ' + fmt(qa) + ') + (' + cash(pb) + ' × ' + fmt(qb) + ') = ' + cash(pa * qa) + ' + ' + cash(pb * qb) + ' = ' + cash(TR) + '.' };
    } },
    { skill: 'tr-calc', gen: function () {
      var P = pick([1250, 1800, 2400, 3500]), Q = pick([24, 36, 48, 65]), TR = P * Q;
      return { kind: 'num', q: 'Kelmar Kitchens fits ' + fmt(Q) + ' kitchens a year at an average price of ' + cash(P) + ' each. Calculate its total revenue for the year. Give your answer in $.',
        answer: TR, unit: '$', display: fmt(TR), why: 'TR = ' + cash(P) + ' × ' + fmt(Q) + ' = ' + cash(TR) + '.' };
    } },
    { skill: 'mcq-distractors', gen: function () {
      var P, Q, v, FC, TR, TVC;
      do { P = pick([8, 10, 12, 15]); Q = pick([40, 50, 60]); v = pick([3, 4, 5]); FC = pick([100, 150, 200]); TR = P * Q; TVC = v * Q; } while (FC + TVC === TR || TR - FC - TVC === TR);
      var opts = ['Total revenue', 'Total costs', 'Profit', 'Price'];
      return { kind: 'mcq', q: 'A market stall sold ' + fmt(Q) + ' scarves at ' + cash(P) + ' each. Its fixed costs were ' + cash(FC) + ' and its variable cost was ' + cash(v) + ' per scarf. Which of these equals ' + cash(TR) + '?',
        options: opts, answer: 0, why: cash(P) + ' × ' + fmt(Q) + ' = ' + cash(TR) + ', which is total revenue. Total costs are ' + cash(FC) + ' + ' + cash(v) + ' × ' + fmt(Q) + ' = ' + cash(FC + TVC) + '; profit and price are different again.' };
    } },
    { skill: 'tr-calc', gen: function () {
      var P = pick([3.6, 7.5, 9.8, 14.5]), Q = pick([200, 350, 500, 1200]), TR = R.roundDp(P * Q, 2);
      return { kind: 'num', q: 'A bookshop in Brevia sells ' + fmt(Q) + ' notebooks at €' + fmt(P, 2) + ' each. Calculate its total revenue in euros (€).',
        answer: TR, unit: '€', tol: 0.005, display: fmt(TR, dpOf(TR) ? 2 : 0), why: 'TR = €' + fmt(P, 2) + ' × ' + fmt(Q) + ' = ' + cash(TR, '€') + '.' };
    } },
    { skill: 'rearrange', gen: function () {
      var P = pick([2.5, 4.5, 7.5, 12.5]), Q = pick([120, 240, 360, 480]), TR = R.roundDp(P * Q, 2);
      return { kind: 'num', q: 'A juice bar sells smoothies at ' + cash2(P) + ' each. Its smoothie revenue for the week was ' + cash(TR) + '. How many smoothies did it sell?',
        answer: Q, unit: 'smoothies', display: fmt(Q), why: 'Q = TR ÷ P = ' + cash(TR) + ' ÷ ' + cash2(P) + ' = ' + fmt(Q) + ' smoothies.' };
    } },
    { skill: 'sum-first', gen: function () {
      var P = pick([2.5, 3, 4.5]), per = pick([80, 95, 120, 150]), days = pick([5, 6, 7]), TR = R.roundDp(P * per * days, 2);
      return { kind: 'num', q: 'A bakery sells an average of ' + fmt(per) + ' bagels a day at ' + cash2(P) + ' each. It opens ' + days + ' days a week. Calculate its weekly total revenue from bagels. Give your answer in $.',
        answer: TR, unit: '$', tol: 0.005, display: fmt(TR, dpOf(TR) ? 2 : 0), why: 'Quantity per week = ' + fmt(per) + ' × ' + days + ' = ' + fmt(per * days) + '. TR = ' + cash2(P) + ' × ' + fmt(per * days) + ' = ' + cash(TR) + '.' };
    } },
    { skill: 'mcq-distractors', gen: function () {
      var P = pick([18, 24, 35]), Q = pick([150, 220, 300]), c = pick([6, 9, 11]);
      return { kind: 'mcq', q: 'A firm sells ' + fmt(Q) + ' units at ' + cash(P) + ' each; each unit costs ' + cash(c) + ' to make. Which working gives its total revenue?',
        options: [cash(P) + ' × ' + fmt(Q), cash(c) + ' × ' + fmt(Q), '(' + cash(P) + ' − ' + cash(c) + ') × ' + fmt(Q), cash(P) + ' + ' + fmt(Q)], answer: 0,
        why: 'TR is price × quantity sold. Cost per unit is not used; (price − cost) × quantity would give profit before fixed costs, not revenue.' };
    } },
    { skill: 'sum-first', gen: function () {
      var P = pick([12, 20, 30]), disc = pick([0.75, 0.5]), Q1 = pick([300, 450, 500]), Q2 = pick([80, 120, 160]), P2 = P * disc, TR = P * Q1 + P2 * Q2;
      return { kind: 'num', q: 'A shoe-repair kiosk sold ' + fmt(Q1) + ' shoe-care kits at the full price of ' + cash(P) + ', and ' + fmt(Q2) + ' more in a sale at ' + cash(P2) + '. Calculate its total revenue from the kits. Give your answer in $.',
        answer: TR, unit: '$', display: fmt(TR), why: 'TR = (' + cash(P) + ' × ' + fmt(Q1) + ') + (' + cash(P2) + ' × ' + fmt(Q2) + ') = ' + cash(P * Q1) + ' + ' + cash(P2 * Q2) + ' = ' + cash(TR) + '.' };
    } },
    { skill: 'rearrange', gen: function () {
      var P = pick([5, 8, 12, 15]), wk = [rint(10, 40) * 5, rint(10, 40) * 5, rint(10, 40) * 5], tot = wk[0] + wk[1] + wk[2], TR = P * tot;
      return { kind: 'num', q: 'Over three weeks a stall sold ' + wk.map(function (x) { return fmt(x); }).join(', ') + ' candles, all at the same price. Its total revenue was ' + cash(TR) + '. What was the price of one candle? Give your answer in $.',
        answer: P, unit: '$', display: fmt(P), why: 'Total quantity = ' + wk.map(function (x) { return fmt(x); }).join(' + ') + ' = ' + fmt(tot) + '. P = ' + cash(TR) + ' ÷ ' + fmt(tot) + ' = ' + cash(P) + '.' };
    } },
    { skill: 'tr-calc', gen: function () {
      var P = pick([7.5, 9.5, 12.5, 14]), Q = pick([1200, 1450, 2300, 3800]), TR = R.roundDp(P * Q, 2);
      return { kind: 'num', q: 'A language-learning app has ' + fmt(Q) + ' subscribers, each paying ' + cash2(P) + ' a month. Calculate its total revenue per month. Give your answer in $.',
        answer: TR, unit: '$', tol: 0.005, display: fmt(TR, dpOf(TR) ? 2 : 0), why: 'TR = ' + cash2(P) + ' × ' + fmt(Q) + ' = ' + cash(TR) + ' per month.' };
    } },
    { skill: 'sum-first', gen: function () {
      var P = pick([15, 25, 40]), m = pick([60, 85, 120, 150]), TR = P * m * 12;
      return { kind: 'num', q: 'A dance school sells ' + fmt(m) + ' monthly passes every month, at ' + cash(P) + ' each. Calculate its total revenue from passes for a whole year. Give your answer in $.',
        answer: TR, unit: '$', display: fmt(TR), why: 'Passes per year = ' + fmt(m) + ' × 12 = ' + fmt(m * 12) + '. TR = ' + cash(P) + ' × ' + fmt(m * 12) + ' = ' + cash(TR) + '.' };
    } },
    { skill: 'tr-calc', gen: function () {
      var seats = pick([400, 600, 800, 1200]), share = pick([50, 75, 80, 90]), P = pick([12, 18, 25, 30]), Q = seats * share / 100, TR = P * Q;
      return { kind: 'num', q: 'A theatre has ' + fmt(seats) + ' seats. For one performance, ' + share + '% of the seats were sold at ' + cash(P) + ' each. Calculate the total revenue for the performance. Give your answer in $.',
        answer: TR, unit: '$', display: fmt(TR), why: 'Seats sold = ' + share + '% × ' + fmt(seats) + ' = ' + fmt(Q) + '. TR = ' + cash(P) + ' × ' + fmt(Q) + ' = ' + cash(TR) + '.' };
    } }
  ] };

  // =====================================================================
  // ECO-CALC-08 Sorting costs into fixed and variable
  // =====================================================================
  var FIXED_POOL = [['Rent', [800, 1200, 1500, 2400]], ['Insurance', [150, 240, 300, 450]], ['Advertising', [200, 350, 500, 650]], ['Manager’s salary', [2200, 2800, 3100]], ['Loan interest', [90, 180, 250]], ['Business rates', [120, 210, 340]]];
  var VAR_POOL = [['Raw materials', [1800, 2600, 3400, 4750]], ['Packaging', [220, 360, 480]], ['Wages paid per unit made', [1600, 2100, 3200]], ['Delivery fuel', [160, 290, 410]], ['Sales commission per item sold', [270, 380, 520]]];
  function costTable(nf, nv) {
    var f = sample(FIXED_POOL, nf).map(function (x) { return [x[0], pick(x[1]), 'F']; }), v = sample(VAR_POOL, nv).map(function (x) { return [x[0], pick(x[1]), 'V']; });
    var rows = shuffle(f.concat(v)), sum = function (a) { return a.reduce(function (s, x) { return s + x[1]; }, 0); };
    return { rows: rows, f: rows.filter(function (x) { return x[2] === 'F'; }), v: rows.filter(function (x) { return x[2] === 'V'; }), sum: sum, html: tbl(['Cost item', 'Cost per month'], rows.map(function (x) { return [x[0], cash(x[1])]; })) };
  }
  function plus(list) { return list.map(function (x) { return cash(x[1]); }).join(' + '); }
  B['ECO-CALC-08'] = { title: 'Sorting costs into fixed and variable', items: [
    { skill: 'tfc-sum', gen: function () {
      var t = costTable(3, 3), F = t.sum(t.f);
      return { kind: 'num', q: 'The table shows the monthly costs of a candle-making business. Calculate its total fixed costs per month. Give your answer in $.' + t.html,
        answer: F, unit: '$', display: fmt(F), why: 'Fixed costs do not change with output: ' + t.f.map(function (x) { return x[0].toLowerCase(); }).join(', ') + '. TFC = ' + plus(t.f) + ' = ' + cash(F) + '.' };
    } },
    { skill: 'tvc-sum', gen: function () {
      var t = costTable(3, 3), V = t.sum(t.v);
      return { kind: 'num', q: 'The table shows the monthly costs of a skateboard maker. Calculate its total variable costs per month. Give your answer in $.' + t.html,
        answer: V, unit: '$', display: fmt(V), why: 'Variable costs change with output: ' + t.v.map(function (x) { return x[0].toLowerCase(); }).join(', ') + '. TVC = ' + plus(t.v) + ' = ' + cash(V) + '.' };
    } },
    { skill: 'classify-items', gen: function () {
      var t = costTable(rint(2, 3), 3);
      return { kind: 'multi', q: 'A small printing firm has these costs. Which are <b>fixed</b> costs?', options: t.rows.map(function (x) { return x[0]; }),
        answers: t.rows.map(function (x, i) { return x[2] === 'F' ? i : -1; }).filter(function (i) { return i >= 0; }),
        why: 'Ask of each item: would it change if the firm printed more? ' + t.f.map(function (x) { return x[0].toLowerCase(); }).join(', ').replace(/^./, function (c) { return c.toUpperCase(); }) + ': these would not change, so they are fixed.' };
    } },
    { skill: 'classify-items', gen: function () {
      var t = costTable(3, rint(2, 3));
      return { kind: 'multi', q: 'A meal-kit company has these costs. Which are <b>variable</b> costs?', options: t.rows.map(function (x) { return x[0]; }),
        answers: t.rows.map(function (x, i) { return x[2] === 'V' ? i : -1; }).filter(function (i) { return i >= 0; }),
        why: t.v.map(function (x) { return x[0]; }).join(', ') + ' all rise when more meal kits are made and sold, so they are variable. The others stay the same.' };
    } },
    { skill: 'tfc-sum', gen: function () {
      var t = costTable(3, 2), allR = t.rows, wrongMix = [t.f[0], t.f[1], t.v[0]];
      return { kind: 'mcq', q: 'Which working gives the total fixed costs of this firm?' + t.html,
        options: [plus(t.f), plus(t.v), plus(allR), plus(wrongMix)], answer: 0,
        why: 'Only the fixed items are added: ' + t.f.map(function (x) { return x[0].toLowerCase(); }).join(', ') + '. Adding every item gives total costs, not total fixed costs.' };
    } },
    { skill: 'tvc-sum', gen: function () {
      var t, V, F, opts;
      do { t = costTable(3, 3); V = t.sum(t.v); F = t.sum(t.f); opts = [cash(V), cash(F), cash(V + F), cash(V - t.v[0][1])]; } while (!distinct(opts));
      return { kind: 'mcq', q: 'What are the total variable costs per month for this firm?' + t.html, options: opts, answer: 0,
        why: 'TVC = ' + plus(t.v) + ' = ' + cash(V) + '. ' + cash(F) + ' is the fixed total and ' + cash(V + F) + ' adds every item.' };
    } },
    { skill: 'per-unit', gen: function () {
      var a = pick([3, 4.5, 6, 7.5]), b = pick([2, 2.5, 4]), Q = pick([400, 600, 800, 1200]), rent = pick([900, 1500, 2000]), V = R.roundDp((a + b) * Q, 2);
      return { kind: 'num', q: 'A lamp maker produces ' + fmt(Q) + ' lamps a month. Materials cost ' + cash2(a) + ' per lamp, workers are paid ' + cash2(b) + ' per lamp made, and rent is ' + cash(rent) + ' a month. Calculate the total variable costs per month. Give your answer in $.',
        answer: V, unit: '$', display: fmt(V), why: 'Rent is fixed, so leave it out. TVC = (' + cash2(a) + ' × ' + fmt(Q) + ') + (' + cash2(b) + ' × ' + fmt(Q) + ') = ' + cash(a * Q) + ' + ' + cash(b * Q) + ' = ' + cash(V) + '.' };
    } },
    { skill: 'tfc-sum', gen: function () {
      var rent = pick([1100, 1600, 2000]), ins = pick([180, 260, 320]), rate = pick([12, 15, 18]), hrs = pick([160, 200, 240]), mat = pick([2400, 3100, 3900]), F = rent + ins;
      return { kind: 'num', q: 'Calculate the total fixed costs per month for this bakery. Give your answer in $.' +
          tbl(['Cost item', 'Cost'], [['Rent', cash(rent) + ' per month'], ['Electricity for ovens', cash(rate) + ' per hour of baking; ' + hrs + ' hours a month'], ['Insurance', cash(ins) + ' per month'], ['Ingredients', cash(mat) + ' per month']]),
        answer: F, unit: '$', display: fmt(F), why: 'Electricity is charged per hour of baking and ingredients rise with output, so both are variable. TFC = ' + cash(rent) + ' + ' + cash(ins) + ' = ' + cash(F) + '.' };
    } },
    { skill: 'tfc-sum', gen: function () {
      var rent = pick([1400, 1800, 2500]), oven = pick([3200, 4500, 6000]), adv = pick([250, 400]), mat = pick([2800, 3600]), pk = pick([300, 450]), F = rent + oven + adv;
      return { kind: 'num', q: 'In June a pizza restaurant had the costs below. Calculate its total fixed costs for June. Give your answer in $.' +
          tbl(['Cost item', 'Cost in June'], [['Rent', cash(rent)], ['New pizza oven (one-off purchase)', cash(oven)], ['Ingredients', cash(mat)], ['Advertising', cash(adv)], ['Takeaway boxes', cash(pk)]]),
        answer: F, unit: '$', display: fmt(F), why: 'The oven’s cost does not depend on how many pizzas are made, so it is fixed, like rent and advertising. TFC = ' + cash(rent) + ' + ' + cash(oven) + ' + ' + cash(adv) + ' = ' + cash(F) + '.' };
    } },
    { skill: 'per-unit', gen: function () {
      var rate = pick([8, 11, 14]), hrs = pick([150, 220, 300]), mat = pick([1900, 2700, 3300]), rent = pick([1000, 1700]), V = rate * hrs + mat;
      return { kind: 'num', q: 'A glass-blowing studio uses furnace electricity costing ' + cash(rate) + ' per hour of production, and ran for ' + hrs + ' hours last month. It also spent ' + cash(mat) + ' on raw glass and paid rent of ' + cash(rent) + '. Calculate its total variable costs for the month. Give your answer in $.',
        answer: V, unit: '$', display: fmt(V), why: 'Electricity: ' + cash(rate) + ' × ' + hrs + ' = ' + cash(rate * hrs) + '. TVC = ' + cash(rate * hrs) + ' + ' + cash(mat) + ' = ' + cash(V) + '. Rent is fixed.' };
    } },
    { skill: 'classify-items', gen: function () {
      var it = pick([['Commission paid to sales staff on each sale', 1], ['Rent for a storage warehouse', 0], ['An annual software licence', 0], ['Ingredients for each meal cooked', 1], ['Fuel for each delivery trip', 1], ['The security guard’s monthly salary', 0], ['Fees received from customers', 2]]);
      return { kind: 'mcq', q: 'A catering firm is sorting its figures. How should this item be classified? <b>' + it[0] + '</b>', options: ['Fixed cost', 'Variable cost', 'Not a cost: it is revenue'], answer: it[1],
        why: ['It does not change with the number of meals produced, so it is a fixed cost.', 'It rises as more meals are produced and sold, so it is a variable cost.', 'Money received from customers is revenue, so it is left out of both cost totals.'][it[1]] };
    } },
    { skill: 'tfc-sum', gen: function () {
      var rent = pick([900, 1300, 1750]), insY = pick([1800, 2400, 3600, 4200]), adv = pick([150, 300]), mat = pick([2200, 3000]), F = rent + insY / 12 + adv;
      return { kind: 'num', q: 'A cycle-hire firm pays rent of ' + cash(rent) + ' a month, insurance of ' + cash(insY) + ' a <b>year</b>, and ' + cash(adv) + ' a month for advertising. It spends ' + cash(mat) + ' a month on spare parts used for repairs. Calculate its total fixed costs per <b>month</b>. Give your answer in $.',
        answer: F, unit: '$', display: fmt(F), why: 'Monthly insurance = ' + cash(insY) + ' ÷ 12 = ' + cash(insY / 12) + '. TFC = ' + cash(rent) + ' + ' + cash(insY / 12) + ' + ' + cash(adv) + ' = ' + cash(F) + '. Spare parts vary with use, so they are variable.' };
    } },
    { skill: 'per-unit', gen: function () {
      var c = pick([0.35, 0.45, 0.6, 0.85]), n = pick([12, 18, 24, 36]), V = R.roundDp(c * n, 2);
      return { kind: 'num', q: 'A print shop receives an order for ' + n + ' posters. Ink and paper cost ' + cash2(c) + ' per poster; the shop’s rent is ' + cash(950) + ' a month. Calculate the total variable cost of this order. Give your answer in $.',
        answer: V, unit: '$', tol: 0.005, display: fmt(V, 2), why: 'Only the per-poster cost varies with the order: ' + cash2(c) + ' × ' + n + ' = ' + cash2(V) + '. Rent is fixed and is not part of the order’s variable cost.' };
    } },
    { skill: 'tvc-sum', gen: function () {
      var lab = pick([2, 3, 4]), Q = pick([1200, 1500, 2000]), office = pick([2600, 3000]), mat = pick([3500, 4200, 5100]), rent = pick([1500, 2200]), V = lab * Q + mat;
      return { kind: 'num', q: 'Calculate the total variable costs per month for this sandal maker. Give your answer in $.' +
          tbl(['Cost item', 'Cost'], [['Factory workers', cash(lab) + ' for each pair made; ' + fmt(Q) + ' pairs a month'], ['Office staff', cash(office) + ' fixed salary per month'], ['Leather and soles', cash(mat) + ' per month'], ['Rent', cash(rent) + ' per month']]),
        answer: V, unit: '$', display: fmt(V), why: 'Factory workers are paid per pair, so their pay is variable: ' + cash(lab) + ' × ' + fmt(Q) + ' = ' + cash(lab * Q) + '. TVC = ' + cash(lab * Q) + ' + ' + cash(mat) + ' = ' + cash(V) + '. Office salaries and rent are fixed.' };
    } },
    { skill: 'tvc-sum', gen: function () {
      var a = pick([1250, 1840, 2300]), b = pick([420, 560, 690]), c = pick([310, 375, 460]), r = pick([1800, 2600]), V = a + b + c;
      return { kind: 'num', q: 'A cheese maker in Brevia has these monthly costs: milk €' + fmt(a) + ', packaging €' + fmt(b) + ', delivery fuel €' + fmt(c) + ' and rent €' + fmt(r) + '. Calculate its total variable costs per month in euros (€).',
        answer: V, unit: '€', display: fmt(V), why: 'Milk, packaging and delivery fuel all rise with output. TVC = €' + fmt(a) + ' + €' + fmt(b) + ' + €' + fmt(c) + ' = €' + fmt(V) + '. Rent is fixed.' };
    } },
    { skill: 'tfc-sum', gen: function () {
      var sal = pick([2400, 2900, 3300]), piece = pick([1.5, 2, 2.5]), Q = pick([800, 1000, 1600]), rent = pick([1200, 1600]), ins = pick([200, 280]), F = sal + rent + ins;
      return { kind: 'num', q: 'A soap maker pays its supervisor a salary of ' + cash(sal) + ' a month and pays packers ' + cash2(piece) + ' for each box packed (' + fmt(Q) + ' boxes a month). Rent is ' + cash(rent) + ' and insurance ' + cash(ins) + ' a month. Calculate the total fixed costs per month. Give your answer in $.',
        answer: F, unit: '$', display: fmt(F), why: 'The supervisor’s salary does not change with output, but packers’ pay does. TFC = ' + cash(sal) + ' + ' + cash(rent) + ' + ' + cash(ins) + ' = ' + cash(F) + '.' };
    } },
    { skill: 'per-unit', gen: function () {
      var t = pick([35, 42, 50]), qt = pick([60, 80, 100]), c = pick([12, 15, 18]), qc = pick([240, 320, 400]), V = t * qt + c * qc;
      return { kind: 'num', q: 'A furniture maker made ' + qt + ' tables and ' + qc + ' chairs last month. Materials cost ' + cash(t) + ' per table and ' + cash(c) + ' per chair. Calculate the total variable cost of materials. Give your answer in $.',
        answer: V, unit: '$', display: fmt(V), why: 'TVC = (' + cash(t) + ' × ' + qt + ') + (' + cash(c) + ' × ' + qc + ') = ' + cash(t * qt) + ' + ' + cash(c * qc) + ' = ' + cash(V) + '.' };
    } },
    { skill: 'tfc-sum', gen: function () {
      var m = ['March', 'April'], k = pick([0, 1]);
      var rows = [['Rent', 1500, 1500], ['Insurance', pick([200, 240]), pick([200, 240])], ['Raw materials', pick([2600, 3100]), pick([3400, 3900])], ['Advertising', pick([300, 450]), pick([600, 750])]];
      var F = rows[0][k + 1] + rows[1][k + 1] + rows[3][k + 1];
      return { kind: 'num', q: 'Calculate the total fixed costs of this hat maker in <b>' + m[k] + '</b>. Give your answer in $.' + tbl(['Cost item', 'March', 'April'], rows.map(function (x) { return [x[0], cash(x[1]), cash(x[2])]; })),
        answer: F, unit: '$', display: fmt(F), why: 'Use the ' + m[k] + ' column and only the fixed items (rent, insurance, advertising): ' + cash(rows[0][k + 1]) + ' + ' + cash(rows[1][k + 1]) + ' + ' + cash(rows[3][k + 1]) + ' = ' + cash(F) + '.' };
    } },
    { skill: 'classify-items', gen: function () {
      var wrong = pick([['Rent', 'fixed'], ['Packaging', 'variable'], ['Insurance', 'fixed'], ['Raw materials', 'variable']]);
      var listF = ['Rent', 'Insurance'], listV = ['Packaging', 'Raw materials'];
      var sF = listF.filter(function (x) { return x !== wrong[0]; }), sV = listV.filter(function (x) { return x !== wrong[0]; });
      if (wrong[1] === 'fixed') sV.push(wrong[0]); else sF.push(wrong[0]);
      return { kind: 'mcq', q: 'A student sorted four costs. Fixed: ' + sF.join(', ') + '. Variable: ' + sV.join(', ') + '. Which item is in the wrong group?',
        options: ['Rent', 'Insurance', 'Packaging', 'Raw materials'], answer: ['Rent', 'Insurance', 'Packaging', 'Raw materials'].indexOf(wrong[0]),
        why: wrong[0] + ' is a ' + wrong[1] + ' cost: ' + (wrong[1] === 'fixed' ? 'it stays the same whatever the output.' : 'it rises with each extra unit produced.') };
    } },
    { skill: 'per-unit', gen: function () {
      var perKm = pick([0.4, 0.5, 0.6, 0.8]), km = pick([1500, 2000, 2500, 3000]), hire = pick([700, 900]), V = R.roundDp(perKm * km, 2);
      return { kind: 'num', q: 'A courier leases a van for ' + cash(hire) + ' a month. Fuel costs ' + cash2(perKm) + ' per kilometre, and the van covers ' + fmt(km) + ' km this month. Calculate the total variable cost of fuel this month. Give your answer in $.',
        answer: V, unit: '$', display: fmt(V), why: 'Fuel depends on distance, so it is variable: ' + cash2(perKm) + ' × ' + fmt(km) + ' = ' + cash(V) + '. The monthly lease is fixed.' };
    } },
    mu('classify-items', 'Tarsova Tiles pays monthly rent on its factory, buys clay for every batch of tiles, pays an accountant a fixed annual fee, and pays kiln electricity per hour of firing. Which of these costs are <b>variable</b>?',
      ['Clay', 'Kiln electricity', 'Factory rent', 'Accountant’s fee'], [0, 1],
      'Clay and kiln electricity rise with the number of tiles made, so they are variable. Rent and a fixed annual fee do not change with output.'),
    { skill: 'per-unit', gen: function () {
      var pk = pick([0.3, 0.5, 0.75]), roy = pick([1.2, 1.5, 2]), Q = pick([2000, 4000, 5000]), V = R.roundDp((pk + roy) * Q, 2);
      return { kind: 'num', q: 'A board-game publisher pays ' + cash2(pk) + ' packaging and a ' + cash2(roy) + ' royalty to the designer for every game sold. It sells ' + fmt(Q) + ' games. Calculate the total variable cost of packaging and royalties. Give your answer in $.',
        answer: V, unit: '$', display: fmt(V), why: 'Per game: ' + cash2(pk) + ' + ' + cash2(roy) + ' = ' + cash2(pk + roy) + '. TVC = ' + cash2(pk + roy) + ' × ' + fmt(Q) + ' = ' + cash(V) + '.' };
    } }
  ] };

  // =====================================================================
  // ECO-CALC-07 Total cost from fixed and variable costs
  // =====================================================================
  B['ECO-CALC-07'] = { title: 'Total cost from fixed and variable costs', items: [
    { skill: 'tc-build', gen: function () {
      var F = pick([2000, 3500, 5000, 8000]), v = pick([4, 6, 12, 15, 25]), Q = pick([300, 500, 800, 1200]), TC = F + v * Q;
      return { kind: 'num', q: 'Mondova Mouldings pays ' + cash(F) + ' each month in fixed costs, and every plastic crate it makes adds ' + cash(v) + ' in variable costs. This month it makes ' + fmt(Q) + ' crates. Calculate its total costs for the month. Give your answer in $.',
        answer: TC, unit: '$', display: fmt(TC), why: 'TC = TFC + (variable cost per unit × output) = ' + cash(F) + ' + (' + cash(v) + ' × ' + fmt(Q) + ') = ' + cash(F) + ' + ' + cash(v * Q) + ' = ' + cash(TC) + '.' };
    } },
    { skill: 'decompose', gen: function () {
      var F = pick([12000, 25000, 40000]), V = pick([18000, 32000, 55000]), Q = pick([500, 1000, 2000]);
      return { kind: 'num', q: 'Last month a garden-tool maker spent ' + cash(F + V) + ' in total, of which ' + cash(F) + ' was fixed costs. It made ' + fmt(Q) + ' tools. Calculate its total variable costs for the month. Give your answer in $.',
        answer: V, unit: '$', display: fmt(V), why: 'TVC = TC − TFC = ' + cash(F + V) + ' − ' + cash(F) + ' = ' + cash(V) + '. The number of units is not needed.' };
    } },
    { skill: 'decompose', gen: function () {
      var F = pick([3000, 6000, 15000]), v = pick([5, 8, 20, 40]), Q = pick([400, 1000, 2500]), TC = F + v * Q;
      return { kind: 'num', q: 'A window-blind maker’s monthly spending totals ' + cash(TC) + '. Each blind costs ' + cash(v) + ' in materials and piece-rate pay, and it makes ' + fmt(Q) + ' blinds. Calculate its total fixed costs for the month. Give your answer in $.',
        answer: F, unit: '$', display: fmt(F), why: 'TVC = ' + cash(v) + ' × ' + fmt(Q) + ' = ' + cash(v * Q) + '. TFC = TC − TVC = ' + cash(TC) + ' − ' + cash(v * Q) + ' = ' + cash(F) + '.' };
    } },
    { skill: 'decompose', gen: function () {
      var F = pick([4200, 7600, 9800]), V = pick([5300, 8900, 12400]);
      return { kind: 'num', q: 'Last month a print studio’s total costs were ' + cash(F + V) + ' and its total variable costs were ' + cash(V) + '. Calculate its total fixed costs. Give your answer in $.',
        answer: F, unit: '$', display: fmt(F), why: 'TFC = TC − TVC = ' + cash(F + V) + ' − ' + cash(V) + ' = ' + cash(F) + '.' };
    } },
    { skill: 'mcq-options', gen: function () {
      var F = pick([20000, 30000, 50000]), v = pick([100, 120, 200]), Q = pick([1000, 2000, 500]), TC = F + v * Q;
      return { kind: 'mcq', q: 'Kelmar Kayaks has monthly fixed costs of ' + cash(F) + ', and each kayak adds ' + cash(v) + ' in variable costs. What are its total costs in a month when it builds ' + fmt(Q) + ' kayaks?',
        options: [cash(TC), cash(v * Q), cash(F + v), cash(F * v)], answer: 0,
        why: 'TC = ' + cash(F) + ' + (' + cash(v) + ' × ' + fmt(Q) + ') = ' + cash(TC) + '. ' + cash(F + v) + ' forgets to multiply by output; ' + cash(v * Q) + ' leaves out fixed costs.' };
    } },
    { skill: 'mcq-options', gen: function () {
      var F = pick([60000, 80000, 120000]), V = pick([40000, 70000, 90000]), Q = pick([1000, 2000, 4000]);
      return { kind: 'mcq', q: 'A drone maker’s costs for March total ' + cash(F + V) + ', including fixed costs of ' + cash(F) + '. It built ' + fmt(Q) + ' drones in March. What were its total variable costs for March?',
        options: [cash(V), cash(V / Q), cash(F + V), cash((F + V) / Q)], answer: 0,
        why: 'TVC = TC − TFC = ' + cash(F + V) + ' − ' + cash(F) + ' = ' + cash(V) + '. Dividing by ' + fmt(Q) + ' would give a per-unit figure, not a total, and ' + cash(F + V) + ' is total costs.' };
    } },
    { skill: 'tc-build', gen: function () {
      var hire = pick([60, 75, 90]), days = pick([20, 22, 25]), perKm = pick([0.3, 0.4, 0.5]), km = pick([2000, 2500, 3000]), F = pick([1200, 1500]);
      var TC = R.roundDp(F + hire * days + perKm * km, 2);
      return { kind: 'num', q: 'A removals firm pays ' + cash(F) + ' a month for its office. It hires a lorry at ' + cash(hire) + ' per <b>day</b> for ' + days + ' days, and fuel costs ' + cash2(perKm) + ' per <b>km</b> for ' + fmt(km) + ' km. Calculate its total costs for the month. Give your answer in $.',
        answer: TC, unit: '$', display: fmt(TC), why: 'Lorry hire = ' + cash(hire) + ' × ' + days + ' = ' + cash(hire * days) + '. Fuel = ' + cash2(perKm) + ' × ' + fmt(km) + ' = ' + cash(perKm * km) + '. TC = ' + cash(F) + ' + ' + cash(hire * days) + ' + ' + cash(perKm * km) + ' = ' + cash(TC) + '.' };
    } },
    { skill: 'decompose', gen: function () {
      var F = pick([2500, 4000, 6000]), v = pick([5, 8, 12, 16]), Q = pick([250, 400, 750, 900]), TC = F + v * Q;
      return { kind: 'num', q: 'A firm’s total costs are ' + cash(TC) + '. Its fixed costs are ' + cash(F) + ' and its variable cost is ' + cash(v) + ' per unit. How many units did it produce?',
        answer: Q, unit: 'units', display: fmt(Q), why: 'TVC = ' + cash(TC) + ' − ' + cash(F) + ' = ' + cash(v * Q) + '. Output = TVC ÷ variable cost per unit = ' + cash(v * Q) + ' ÷ ' + cash(v) + ' = ' + fmt(Q) + ' units.' };
    } },
    { skill: 'tc-build', gen: function () {
      var F = pick([1800, 2400, 3000]), v = pick([3, 4, 6]), q1 = pick([500, 700, 900]), q2 = pick([600, 800, 1100]), TC = 2 * F + v * (q1 + q2);
      return { kind: 'num', q: 'A cake maker has fixed costs of ' + cash(F) + ' each month and variable costs of ' + cash(v) + ' per cake. It made ' + fmt(q1) + ' cakes in May and ' + fmt(q2) + ' in June. Calculate its total costs for the two months together. Give your answer in $.',
        answer: TC, unit: '$', display: fmt(TC), why: 'Fixed costs for two months = 2 × ' + cash(F) + ' = ' + cash(2 * F) + '. Variable = ' + cash(v) + ' × (' + fmt(q1) + ' + ' + fmt(q2) + ') = ' + cash(v * (q1 + q2)) + '. TC = ' + cash(TC) + '.' };
    } },
    { skill: 'tc-build', gen: function () {
      var F = pick([3200, 4500]), a = pick([6, 9, 11]), b = pick([4, 5, 7]), Q = pick([300, 450, 600]), TC = F + (a + b) * Q;
      return { kind: 'num', q: 'A shirt maker has fixed costs of ' + cash(F) + ' a month. Each shirt needs ' + cash(a) + ' of fabric and ' + cash(b) + ' of labour (paid per shirt). It makes ' + fmt(Q) + ' shirts. Calculate its total costs for the month. Give your answer in $.',
        answer: TC, unit: '$', display: fmt(TC), why: 'Variable cost per shirt = ' + cash(a) + ' + ' + cash(b) + ' = ' + cash(a + b) + '. TC = ' + cash(F) + ' + (' + cash(a + b) + ' × ' + fmt(Q) + ') = ' + cash(F) + ' + ' + cash((a + b) * Q) + ' = ' + cash(TC) + '.' };
    } },
    { skill: 'tc-build', gen: function () {
      var F = pick([950, 1400, 2250]), v = pick([1.25, 2.4, 3.75]), Q = pick([400, 800, 1200]), TC = R.roundDp(F + v * Q, 2);
      return { kind: 'num', q: 'A candle workshop in Brevia has fixed costs of €' + fmt(F) + ' a month and variable costs of €' + fmt(v, 2) + ' per candle. Calculate its total costs when it makes ' + fmt(Q) + ' candles. Give your answer in euros (€).',
        answer: TC, unit: '€', display: fmt(TC), why: 'TC = €' + fmt(F) + ' + (€' + fmt(v, 2) + ' × ' + fmt(Q) + ') = €' + fmt(F) + ' + €' + fmt(v * Q) + ' = €' + fmt(TC) + '.' };
    } },
    { skill: 'output-change', gen: function () {
      var F = pick([5000, 8000]), v = pick([7, 9, 14]), Q = pick([600, 900]), add = pick([100, 150, 250]);
      return { kind: 'num', q: 'A firm with fixed costs of ' + cash(F) + ' and variable costs of ' + cash(v) + ' per unit raises output from ' + fmt(Q) + ' to ' + fmt(Q + add) + ' units. By how much do its total costs rise? Give your answer in $.',
        answer: v * add, unit: '$', display: fmt(v * add), why: 'Fixed costs do not change, so only variable costs rise: ' + cash(v) + ' × ' + add + ' extra units = ' + cash(v * add) + '.' };
    } },
    { skill: 'mcq-options', gen: function () {
      var F = pick([1500, 2500]), v = pick([6, 8, 12]), Q = pick([200, 350, 500]);
      return { kind: 'mcq', q: 'Fixed costs are ' + cash(F) + ', the variable cost is ' + cash(v) + ' per unit and output is ' + fmt(Q) + ' units. Which working gives total costs?',
        options: [cash(F) + ' + (' + cash(v) + ' × ' + fmt(Q) + ')', cash(F) + ' + ' + cash(v), '(' + cash(F) + ' + ' + cash(v) + ') × ' + fmt(Q), cash(F) + ' × ' + cash(v)], answer: 0,
        why: 'Multiply the per-unit cost by output first, then add fixed costs once: TC = ' + cash(F) + ' + ' + cash(v * Q) + ' = ' + cash(F + v * Q) + '.' };
    } },
    { skill: 'tc-build', gen: function () {
      var Fm = pick([1500, 2000, 2500]), v = pick([3, 5, 8]), Qy = pick([6000, 9000, 12000]), TC = Fm * 12 + v * Qy;
      return { kind: 'num', q: 'A firm’s fixed costs are ' + cash(Fm) + ' per <b>month</b>. It makes ' + fmt(Qy) + ' units a <b>year</b> at a variable cost of ' + cash(v) + ' per unit. Calculate its total costs for the year. Give your answer in $.',
        answer: TC, unit: '$', display: fmt(TC), why: 'Fixed costs per year = ' + cash(Fm) + ' × 12 = ' + cash(Fm * 12) + '. TVC = ' + cash(v) + ' × ' + fmt(Qy) + ' = ' + cash(v * Qy) + '. TC = ' + cash(TC) + '.' };
    } },
    { skill: 'decompose', gen: function () {
      var F = pick([2000, 3000, 4500]), v = pick([4, 6, 10]), q1 = pick([200, 300]), q2 = q1 + pick([100, 200]);
      return { kind: 'num', q: 'A firm’s total costs are ' + cash(F + v * q1) + ' when it makes ' + fmt(q1) + ' units and ' + cash(F + v * q2) + ' when it makes ' + fmt(q2) + ' units. The variable cost per unit is the same at both outputs. Calculate its total fixed costs. Give your answer in $.',
        answer: F, unit: '$', display: fmt(F), why: 'Extra cost ÷ extra units = (' + cash(F + v * q2) + ' − ' + cash(F + v * q1) + ') ÷ ' + (q2 - q1) + ' = ' + cash(v) + ' per unit. TFC = ' + cash(F + v * q1) + ' − (' + cash(v) + ' × ' + fmt(q1) + ') = ' + cash(F) + '.' };
    } },
    { skill: 'decompose', gen: function () {
      var rent = pick([1800, 2600]), ins = pick([300, 450]), V = pick([4100, 5600, 7300]), TC = rent + ins + V;
      return { kind: 'num', q: 'A gift shop’s only fixed costs are rent of ' + cash(rent) + ' and insurance of ' + cash(ins) + ' a month. Its total costs last month were ' + cash(TC) + '. Calculate its total variable costs. Give your answer in $.',
        answer: V, unit: '$', display: fmt(V), why: 'TFC = ' + cash(rent) + ' + ' + cash(ins) + ' = ' + cash(rent + ins) + '. TVC = ' + cash(TC) + ' − ' + cash(rent + ins) + ' = ' + cash(V) + '.' };
    } },
    { skill: 'mcq-options', gen: function () {
      var F = pick([4000, 6000]), v = pick([15, 25]), Q = pick([300, 400]), wrong = F + v;
      return { kind: 'mcq', q: 'Fixed costs are ' + cash(F) + ', the variable cost is ' + cash(v) + ' per unit and output is ' + fmt(Q) + ' units. A student says total costs are ' + cash(wrong) + '. What mistake was made?',
        options: ['The variable cost per unit was not multiplied by output', 'Fixed costs were multiplied by output', 'Variable costs were left out completely', 'The answer should have been divided by output'], answer: 0,
        why: cash(F) + ' + ' + cash(v) + ' = ' + cash(wrong) + ' adds one unit’s cost only. Correct TC = ' + cash(F) + ' + (' + cash(v) + ' × ' + fmt(Q) + ') = ' + cash(F + v * Q) + '.' };
    } },
    { skill: 'tc-build', gen: function () {
      var F = pick([600, 850, 1200]), rate = pick([18, 22, 30]), hrs = pick([120, 150, 180]), TC = F + rate * hrs;
      return { kind: 'num', q: 'A cleaning company pays ' + cash(F) + ' a month for its office and equipment lease, and pays cleaners ' + cash(rate) + ' for each hour of cleaning done. Last month cleaners worked ' + hrs + ' hours. Calculate total costs for the month. Give your answer in $.',
        answer: TC, unit: '$', display: fmt(TC), why: 'TVC = ' + cash(rate) + ' × ' + hrs + ' = ' + cash(rate * hrs) + '. TC = ' + cash(F) + ' + ' + cash(rate * hrs) + ' = ' + cash(TC) + '.' };
    } },
    { skill: 'tc-build', gen: function () {
      var F = pick([180000, 250000, 400000]), v = pick([35, 60, 85]), Q = pick([5000, 8000, 12000]), TC = F + v * Q;
      return { kind: 'num', q: 'A bicycle factory in Ostrana has fixed costs of ' + cash(F) + ' a year and variable costs of ' + cash(v) + ' per bicycle. Calculate its total costs for a year in which it makes ' + fmt(Q) + ' bicycles. Give your answer in $.',
        answer: TC, unit: '$', display: fmt(TC), why: 'TC = ' + cash(F) + ' + (' + cash(v) + ' × ' + fmt(Q) + ') = ' + cash(F) + ' + ' + cash(v * Q) + ' = ' + cash(TC) + '.' };
    } },
    mu('mcq-options', 'Which of these statements about total costs are correct?',
      ['Total costs = total fixed costs + total variable costs', 'Total variable costs = total costs − total fixed costs', 'Total costs rise when output rises, because variable costs rise', 'Total fixed costs = total costs + total variable costs', 'Total fixed costs rise when output rises'], [0, 1, 2],
      'TC = TFC + TVC, so TVC = TC − TFC. More output raises TVC and so TC. Fixed costs do not change with output, and TFC = TC − TVC, not TC + TVC.'),
    { skill: 'tc-build', gen: function () {
      var Fw = pick([400, 650, 900]), weeks = 4, v = pick([2.5, 3, 4.5]), Q = pick([1200, 1600, 2000]), TC = R.roundDp(Fw * weeks + v * Q, 2);
      return { kind: 'num', q: 'A food van has fixed costs of ' + cash(Fw) + ' per week. Over 4 weeks it serves ' + fmt(Q) + ' meals, with ingredients costing ' + cash2(v) + ' per meal. Calculate its total costs for the 4 weeks. Give your answer in $.',
        answer: TC, unit: '$', display: fmt(TC), why: 'TFC for 4 weeks = ' + cash(Fw) + ' × 4 = ' + cash(Fw * 4) + '. TVC = ' + cash2(v) + ' × ' + fmt(Q) + ' = ' + cash(v * Q) + '. TC = ' + cash(TC) + '.' };
    } },
    { skill: 'output-change', gen: function () {
      var F = pick([3000, 5000]), v = pick([6, 9, 15]), q1 = pick([400, 500]), add = pick([100, 200, 250]);
      return { kind: 'num', q: 'A firm’s total costs rise from ' + cash(F + v * q1) + ' to ' + cash(F + v * (q1 + add)) + ' when it produces ' + add + ' extra units. Its fixed costs do not change. What is its variable cost per unit? Give your answer in $.',
        answer: v, unit: '$', display: fmt(v), why: 'The rise in total costs is all variable cost: (' + cash(F + v * (q1 + add)) + ' − ' + cash(F + v * q1) + ') ÷ ' + add + ' = ' + cash(v * add) + ' ÷ ' + add + ' = ' + cash(v) + ' per unit.' };
    } }
  ] };

  // =====================================================================
  // ECO-CALC-09 Average cost per unit
  // =====================================================================
  function acNum(q, ac, why, cur) { return { kind: 'num', q: q, answer: R.roundDp(ac, 2), unit: cur || '$', tol: 0.005, display: fmt(R.roundDp(ac, 2), 2), why: why }; }
  B['ECO-CALC-09'] = { title: 'Average cost per unit', items: [
    { skill: 'ac-totals', gen: function () {
      var F = pick([4500, 6000, 7200, 9000]), V = pick([8400, 11500, 13600, 18000]), Q = pick([800, 1500, 2000, 2400, 3000]), ac = (F + V) / Q;
      return acNum('A firm makes ' + fmt(Q) + ' units a month. Its total fixed costs are ' + cash(F) + ' and its total variable costs are ' + cash(V) + '. Calculate its average cost per unit, to the nearest cent. Give your answer in $.', ac,
        'TC = ' + cash(F) + ' + ' + cash(V) + ' = ' + cash(F + V) + '. AC = TC ÷ Q = ' + cash(F + V) + ' ÷ ' + fmt(Q) + ' = ' + cash2(R.roundDp(ac, 2)) + '.');
    } },
    { skill: 'ac-build', gen: function () {
      var F = pick([2000, 3000, 4800]), v = pick([3.5, 6, 7.25, 9]), Q = pick([400, 500, 800, 1000]), ac = (F + v * Q) / Q;
      return acNum('A firm has fixed costs of ' + cash(F) + ' a month and variable costs of ' + cash2(v) + ' per unit. Calculate its average cost per unit when it produces ' + fmt(Q) + ' units. Give your answer in $ to the nearest cent.', ac,
        'TVC = ' + cash2(v) + ' × ' + fmt(Q) + ' = ' + cash(v * Q) + '. TC = ' + cash(F) + ' + ' + cash(v * Q) + ' = ' + cash(F + v * Q) + '. AC = ' + cash(F + v * Q) + ' ÷ ' + fmt(Q) + ' = ' + cash2(R.roundDp(ac, 2)) + '.');
    } },
    { skill: 'ac-totals', gen: function () {
      var Q = pick([250, 400, 640, 1250]), ac = pick([4.8, 7.5, 12.4, 18.25]), TC = R.roundDp(ac * Q, 2);
      return acNum('A cake shop’s total costs for a week are ' + cash(TC) + ' when it bakes ' + fmt(Q) + ' cakes. Calculate the average cost of a cake. Give your answer in $ to the nearest cent.', ac,
        'AC = TC ÷ Q = ' + cash(TC) + ' ÷ ' + fmt(Q) + ' = ' + cash2(ac) + ' per cake.');
    } },
    { skill: 'ac-options', gen: function () {
      var F = pick([6000, 9000, 12000]), V = pick([15000, 18000, 24000]), Q = pick([1000, 1500, 3000]);
      var opts = [cash2((F + V) / Q), cash2(F / Q), cash2(V / Q), cash(F + V)];
      return { kind: 'mcq', q: 'A firm produces ' + fmt(Q) + ' units. Its total fixed costs are ' + cash(F) + ' and total variable costs are ' + cash(V) + '. What is its average cost per unit?',
        options: opts, answer: 0, why: 'AC = (' + cash(F) + ' + ' + cash(V) + ') ÷ ' + fmt(Q) + ' = ' + opts[0] + '. Dividing only fixed (' + opts[1] + ') or only variable (' + opts[2] + ') costs leaves part out; ' + opts[3] + ' is total cost, not per unit.' };
    } },
    { skill: 'rearrange', gen: function () {
      var ac = pick([2.4, 3.75, 8.6, 12.5]), Q = pick([600, 1200, 2000, 4000]), TC = R.roundDp(ac * Q, 2);
      return { kind: 'num', q: 'A firm’s average cost is ' + cash2(ac) + ' per unit when it produces ' + fmt(Q) + ' units. Calculate its total costs. Give your answer in $.',
        answer: TC, unit: '$', display: fmt(TC), why: 'AC = TC ÷ Q, so TC = AC × Q = ' + cash2(ac) + ' × ' + fmt(Q) + ' = ' + cash(TC) + '.' };
    } },
    { skill: 'rearrange', gen: function () {
      var ac = pick([4, 5, 8, 12.5, 16]), Q = pick([300, 500, 800, 1200]), TC = ac * Q;
      return { kind: 'num', q: 'A firm’s total costs are ' + cash(TC) + ' and its average cost is ' + cash2(ac) + ' per unit. How many units does it produce?',
        answer: Q, unit: 'units', display: fmt(Q), why: 'Q = TC ÷ AC = ' + cash(TC) + ' ÷ ' + cash2(ac) + ' = ' + fmt(Q) + ' units.' };
    } },
    { skill: 'compare', gen: function () {
      var F = pick([6000, 8000, 12000]), v = pick([2, 3, 5]), q1 = pick([500, 1000]), q2 = q1 * pick([2, 4]);
      var a1 = (F + v * q1) / q1, a2 = (F + v * q2) / q2, d = R.roundDp(a1 - a2, 2);
      return { kind: 'num', q: 'A firm has fixed costs of ' + cash(F) + ' and variable costs of ' + cash(v) + ' per unit. By how much does its average cost per unit fall when output rises from ' + fmt(q1) + ' to ' + fmt(q2) + ' units? Give your answer in $ to the nearest cent.',
        answer: d, unit: '$', tol: 0.005, display: fmt(d, 2), why: 'AC at ' + fmt(q1) + ' = (' + cash(F) + ' + ' + cash(v * q1) + ') ÷ ' + fmt(q1) + ' = ' + cash2(a1) + '. AC at ' + fmt(q2) + ' = (' + cash(F) + ' + ' + cash(v * q2) + ') ÷ ' + fmt(q2) + ' = ' + cash2(R.roundDp(a2, 2)) + '. Fall = ' + cash2(d) + '.' };
    } },
    { skill: 'compare', gen: function () {
      var rows = shuffle([[200, pick([3000, 3200])], [400, pick([4400, 4800])], [600, pick([6600, 7200])], [800, pick([10400, 11200])]]);
      var acs = rows.map(function (r) { return r[1] / r[0]; }), min = Math.min.apply(null, acs);
      while (acs.filter(function (a) { return a === min; }).length > 1) { rows[acs.lastIndexOf(min)][1] += 200; acs = rows.map(function (r) { return r[1] / r[0]; }); min = Math.min.apply(null, acs); }
      var idx = acs.indexOf(min), sorted = rows.slice().sort(function (a, b) { return a[0] - b[0]; });
      return { kind: 'mcq', q: 'At which output is the firm’s average cost per unit lowest?' + tbl(['Output (units)', 'Total costs'], sorted.map(function (r) { return [fmt(r[0]), cash(r[1])]; })),
        options: rows.map(function (r) { return fmt(r[0]) + ' units'; }), answer: idx,
        why: 'AC = TC ÷ output: ' + sorted.map(function (r) { return cash(r[1]) + ' ÷ ' + fmt(r[0]) + ' = ' + cash2(r[1] / r[0]); }).join('; ') + '. The lowest is at ' + fmt(rows[idx][0]) + ' units.' };
    } },
    { skill: 'ac-totals', gen: function () {
      var rent = pick([1200, 1800]), ins = pick([200, 300]), mat = pick([2600, 3400]), lab = pick([3000, 4200]), Q = pick([500, 800, 1000]), TC = rent + ins + mat + lab, ac = TC / Q;
      return acNum('A sports-bag maker produces ' + fmt(Q) + ' bags a month. Use the table to calculate the average cost per bag, to the nearest cent. Give your answer in $.' +
          tbl(['Cost item', 'Cost per month'], [['Rent', cash(rent)], ['Insurance', cash(ins)], ['Materials', cash(mat)], ['Wages paid per bag made', cash(lab)]]), ac,
        'TC = ' + cash(rent) + ' + ' + cash(ins) + ' + ' + cash(mat) + ' + ' + cash(lab) + ' = ' + cash(TC) + '. AC = ' + cash(TC) + ' ÷ ' + fmt(Q) + ' = ' + cash2(R.roundDp(ac, 2)) + '.');
    } },
    { skill: 'ac-totals', gen: function () {
      var F = pick([1800, 2500, 3600]), V = pick([4200, 5100, 6900]), Q = pick([600, 900, 1200]), ac = (F + V) / Q;
      return acNum('A jam maker in Brevia has monthly fixed costs of €' + fmt(F) + ' and variable costs of €' + fmt(V) + '. It makes ' + fmt(Q) + ' jars. Calculate the average cost per jar in euros (€), to the nearest cent.', ac,
        'AC = (€' + fmt(F) + ' + €' + fmt(V) + ') ÷ ' + fmt(Q) + ' = €' + fmt(F + V) + ' ÷ ' + fmt(Q) + ' = €' + fmt(R.roundDp(ac, 2), 2) + '.', '€');
    } },
    { skill: 'ac-build', gen: function () {
      var F = pick([2400, 3000, 3900]), v = pick([12, 18, 25]), Q = pick([80, 120, 150]), ac = (F + v * Q) / Q;
      return acNum('A physiotherapy clinic has fixed costs of ' + cash(F) + ' a month. Each session costs ' + cash(v) + ' in materials and therapist pay. It runs ' + fmt(Q) + ' sessions a month. Calculate the average cost per session. Give your answer in $ to the nearest cent.', ac,
        'TC = ' + cash(F) + ' + (' + cash(v) + ' × ' + fmt(Q) + ') = ' + cash(F + v * Q) + '. AC = ' + cash(F + v * Q) + ' ÷ ' + fmt(Q) + ' = ' + cash2(R.roundDp(ac, 2)) + '.');
    } },
    { skill: 'ac-options', gen: function () {
      var F = pick([3000, 5000]), V = pick([7000, 9000]), Q = pick([500, 2000]);
      return { kind: 'mcq', q: 'Total fixed costs are ' + cash(F) + ', total variable costs are ' + cash(V) + ' and output is ' + fmt(Q) + ' units. Which working gives average cost?',
        options: ['(' + cash(F) + ' + ' + cash(V) + ') ÷ ' + fmt(Q), cash(F) + ' + (' + cash(V) + ' ÷ ' + fmt(Q) + ')', cash(F) + ' ÷ ' + fmt(Q), '(' + cash(F) + ' + ' + cash(V) + ') × ' + fmt(Q)], answer: 0,
        why: 'Add fixed and variable costs to get total cost first, then divide the whole total by output.' };
    } },
    { skill: 'compare', gen: function () {
      var F = pick([4000, 6000, 9000]), v = pick([2, 4, 6]), Q = pick([500, 1000, 1500]), a2 = (F + v * 2 * Q) / (2 * Q);
      return acNum('A firm has fixed costs of ' + cash(F) + ' and variable costs of ' + cash(v) + ' per unit. It currently makes ' + fmt(Q) + ' units. Calculate its average cost per unit if it <b>doubles</b> its output. Give your answer in $ to the nearest cent.', a2,
        'New output = ' + fmt(2 * Q) + '. TC = ' + cash(F) + ' + (' + cash(v) + ' × ' + fmt(2 * Q) + ') = ' + cash(F + 2 * v * Q) + '. AC = ' + cash(F + 2 * v * Q) + ' ÷ ' + fmt(2 * Q) + ' = ' + cash2(R.roundDp(a2, 2)) + '. Fixed costs are spread over more units, so AC falls.');
    } },
    { skill: 'ac-build', gen: function () {
      var F = pick([1500, 2100, 2800]), v = pick([4, 6.5, 9]), Q = pick([300, 400, 700]), ac = (F + v * Q) / Q;
      return acNum('A tie maker has fixed costs of ' + cash(F) + ' a month and variable costs of ' + cash2(v) + ' per tie. It makes ' + fmt(Q) + ' ties a month. What is the lowest price per tie that would just cover all its costs? Give your answer in $ to the nearest cent.', ac,
        'All costs are covered when price equals average cost. AC = (' + cash(F) + ' + ' + cash(v * Q) + ') ÷ ' + fmt(Q) + ' = ' + cash2(R.roundDp(ac, 2)) + '.');
    } },
    { skill: 'ac-totals', gen: function () {
      var F = pick([2500000, 4000000]), V = pick([6000000, 9500000]), Q = pick([250000, 400000, 500000]), ac = (F + V) / Q;
      return acNum('A car-parts factory has total fixed costs of ' + cash(F) + ' and total variable costs of ' + cash(V) + ' a year. It makes ' + fmt(Q) + ' parts a year. Calculate its average cost per part. Give your answer in $ to the nearest cent.', ac,
        'AC = (' + cash(F) + ' + ' + cash(V) + ') ÷ ' + fmt(Q) + ' = ' + cash(F + V) + ' ÷ ' + fmt(Q) + ' = ' + cash2(R.roundDp(ac, 2)) + '.');
    } },
    { skill: 'rearrange', gen: function () {
      var ac = pick([6, 7.5, 9, 11]), Q = pick([400, 800, 1000]), V = pick([1800, 2600, 3200]), F = ac * Q - V;
      return { kind: 'num', q: 'A firm’s average cost is ' + cash2(ac) + ' per unit at an output of ' + fmt(Q) + ' units. Its total variable costs are ' + cash(V) + '. Calculate its total fixed costs. Give your answer in $.',
        answer: F, unit: '$', display: fmt(F), why: 'TC = AC × Q = ' + cash2(ac) + ' × ' + fmt(Q) + ' = ' + cash(ac * Q) + '. TFC = TC − TVC = ' + cash(ac * Q) + ' − ' + cash(V) + ' = ' + cash(F) + '.' };
    } },
    mc('ac-options', 'A firm’s fixed costs stay the same and its variable cost per unit does not change. Why does its average cost per unit fall as it produces more?',
      ['The fixed costs are spread over a larger number of units', 'The variable cost of each unit falls as output rises', 'Total costs fall when the firm produces more units', 'Total revenue rises, so the cost of each unit falls'], 0,
      'AC = (TFC + TVC) ÷ Q. With a fixed total of fixed costs, each extra unit takes a smaller share of them, so the cost per unit falls.'),
    { skill: 'ac-totals', gen: function () {
      var F, V, Q, ac;
      do { F = pick([1000, 2000, 2500]); V = pick([1400, 2200, 3100]); Q = pick([300, 700, 900]); ac = (F + V) / Q; } while (dpOf(ac) <= 2);
      return acNum('A mug printer has total costs made up of ' + cash(F) + ' fixed and ' + cash(V) + ' variable, for ' + fmt(Q) + ' mugs. Calculate the average cost per mug, giving your answer in $ to two decimal places.', ac,
        'AC = ' + cash(F + V) + ' ÷ ' + fmt(Q) + ' = ' + fmt(ac, 4) + '… = ' + cash2(R.roundDp(ac, 2)) + ' to two decimal places.');
    } },
    { skill: 'ac-build', gen: function () {
      var F = pick([3000, 4500]), a = pick([2.5, 3, 4]), b = pick([1.5, 2, 3.5]), c = pick([0.5, 1]), Q = pick([500, 800, 1000]), ac = (F + (a + b + c) * Q) / Q;
      return acNum('A water-bottle maker has fixed costs of ' + cash(F) + ' a month. Each bottle uses ' + cash2(a) + ' of steel, ' + cash2(b) + ' of labour and ' + cash2(c) + ' of packaging. It makes ' + fmt(Q) + ' bottles. Calculate the average cost per bottle. Give your answer in $ to the nearest cent.', ac,
        'Variable cost per bottle = ' + cash2(a + b + c) + '. TC = ' + cash(F) + ' + (' + cash2(a + b + c) + ' × ' + fmt(Q) + ') = ' + cash(F + (a + b + c) * Q) + '. AC = ' + cash(F + (a + b + c) * Q) + ' ÷ ' + fmt(Q) + ' = ' + cash2(R.roundDp(ac, 2)) + '.');
    } },
    mu('ac-options', 'Which statements about average cost are correct?',
      ['Average cost = total cost ÷ quantity produced', 'Average cost is the cost of producing one unit', 'Average cost × output = total cost', 'Average cost = total fixed cost ÷ quantity produced', 'Average cost is the same as the selling price'], [0, 1, 2],
      'AC is total cost per unit, so AC × Q gives total cost back. Using fixed cost alone leaves out variable costs. The selling price is what customers pay, which can be above or below average cost.'),
    { skill: 'ac-build', gen: function () {
      var Fy = pick([24000, 36000, 48000]), V = pick([5000, 6500, 8000]), Q = pick([1000, 1500, 2500]), Fm = Fy / 12, ac = (Fm + V) / Q;
      return acNum('A firm has fixed costs of ' + cash(Fy) + ' a <b>year</b>. In one month it makes ' + fmt(Q) + ' units with total variable costs of ' + cash(V) + '. Calculate the average cost per unit for that month. Give your answer in $ to the nearest cent.', ac,
        'Fixed costs per month = ' + cash(Fy) + ' ÷ 12 = ' + cash(Fm) + '. TC = ' + cash(Fm) + ' + ' + cash(V) + ' = ' + cash(Fm + V) + '. AC = ' + cash(Fm + V) + ' ÷ ' + fmt(Q) + ' = ' + cash2(R.roundDp(ac, 2)) + '.');
    } },
    { skill: 'ac-totals', gen: function () {
      var F = pick([600, 900, 1500]), V = pick([1100, 1800, 2400]), Q = pick([5000, 6000, 8000]), ac = (F + V) / Q;
      return acNum('A firm makes ' + fmt(Q) + ' paper straws a day. Its daily fixed costs are ' + cash(F) + ' and daily variable costs are ' + cash(V) + '. Calculate the average cost per straw. Give your answer in $ to the nearest cent.', ac,
        'AC = (' + cash(F) + ' + ' + cash(V) + ') ÷ ' + fmt(Q) + ' = ' + cash(F + V) + ' ÷ ' + fmt(Q) + ' = ' + fmt(ac, 4) + ', which is ' + cash2(R.roundDp(ac, 2)) + ' per straw.');
    } },
    { skill: 'compare', gen: function () {
      var rows = [[1000, pick([4500, 5200])], [2000, pick([7400, 8200])], [3000, pick([9900, 10800])]], k = pick([0, 1, 2]), ac = rows[k][1] / rows[k][0];
      return acNum('Using the table, calculate the average cost per unit when the firm produces <b>' + fmt(rows[k][0]) + '</b> units. Give your answer in $ to the nearest cent.' +
          tbl(['Output (units)', 'Total fixed costs', 'Total variable costs'], rows.map(function (r) { return [fmt(r[0]), cash(2000), cash(r[1] - 2000)]; })), ac,
        'At ' + fmt(rows[k][0]) + ' units, TC = ' + cash(2000) + ' + ' + cash(rows[k][1] - 2000) + ' = ' + cash(rows[k][1]) + '. AC = ' + cash(rows[k][1]) + ' ÷ ' + fmt(rows[k][0]) + ' = ' + cash2(R.roundDp(ac, 2)) + '.');
    } }
  ] };

  // =====================================================================
  // ECO-CALC-10 Profit or loss from revenue and costs
  // =====================================================================
  function plWord(x) { return x >= 0 ? 'profit' : 'loss'; }
  B['ECO-CALC-10'] = { title: 'Profit or loss from revenue and costs', items: [
    { skill: 'profit-total', gen: function () {
      var P = pick([15, 24, 40, 65]), Q = pick([200, 350, 500, 800]), TC = pick([2400, 4100, 6800, 9500]), PR = P * Q - TC;
      if (PR <= 0) TC = Math.round(P * Q * 0.6 / 100) * 100;
      PR = P * Q - TC;
      return { kind: 'num', q: 'Veridia Vinyl sold ' + fmt(Q) + ' records at ' + cash(P) + ' each last month, and its total costs were ' + cash(TC) + '. Calculate its profit for the month. Give your answer in $.',
        answer: PR, unit: '$', display: fmt(PR), why: 'TR = ' + cash(P) + ' × ' + fmt(Q) + ' = ' + cash(P * Q) + '. Profit = TR − TC = ' + cash(P * Q) + ' − ' + cash(TC) + ' = ' + cash(PR) + '.' };
    } },
    { skill: 'per-unit', gen: function () {
      var P = pick([49, 75, 89, 120]), a = pick([14, 18, 22, 27]), b = pick([9, 16, 25, 31]), PR = P - (a + b);
      return { kind: 'num', q: 'A firm sells rucksacks for ' + cash(P) + ' each. Each rucksack costs ' + cash(a) + ' in materials and ' + cash(b) + ' in labour. Calculate the profit or loss on each rucksack. Give your answer in $, using a minus sign for a loss.',
        answer: PR, unit: '$', display: fmt(PR), why: 'Profit per unit = price − (sum of unit costs) = ' + cash(P) + ' − (' + cash(a) + ' + ' + cash(b) + ') = ' + cash(P) + ' − ' + cash(a + b) + ' = ' + cash(PR) + ' ' + plWord(PR) + '.' };
    } },
    { skill: 'loss', gen: function () {
      var P = pick([8, 12, 15]), Q = pick([200, 300, 450]), TR = P * Q, TC = TR + pick([400, 750, 1200, 1800]), PR = TR - TC;
      return { kind: 'num', q: 'In its first month, a new café sold ' + fmt(Q) + ' brunches at ' + cash(P) + ' each. Its total costs were ' + cash(TC) + '. Calculate its profit or loss. Give your answer in $, using a minus sign for a loss.',
        answer: PR, unit: '$', display: fmt(PR), why: 'TR = ' + cash(P) + ' × ' + fmt(Q) + ' = ' + cash(TR) + '. TR − TC = ' + cash(TR) + ' − ' + cash(TC) + ' = ' + cash(PR) + ', so the café made a loss of ' + cash(-PR) + '.' };
    } },
    { skill: 'mcq-options', gen: function () {
      var P = pick([20, 40, 60]), Q = pick([100, 150, 300]), TC = pick([800, 1500, 2400]), TR = P * Q, PR = TR - TC;
      var res = PR >= 0 ? 'profit' : 'loss', opp = PR >= 0 ? 'loss' : 'profit';
      var opts = [cash(Math.abs(PR)) + ' ' + res, cash(TR) + ' profit', cash(Math.abs(PR)) + ' ' + opp, cash(TR + TC) + ' profit'];
      if (!distinct(opts)) opts[3] = cash(TC * P) + ' profit';
      return { kind: 'mcq', q: 'A plant nursery sold ' + fmt(Q) + ' potted herbs at ' + cash(P) + ' each. Its total costs for the season were ' + cash(TC) + '. What was its profit or loss?',
        options: opts, answer: 0, why: 'TR = ' + cash(P) + ' × ' + fmt(Q) + ' = ' + cash(TR) + '. Profit = ' + cash(TR) + ' − ' + cash(TC) + ' = ' + cash(PR) + (PR >= 0 ? ', a profit' : ', a loss of ' + cash(-PR)) + '. ' + cash(TR) + ' forgets to subtract costs, and ' + cash(TR + TC) + ' adds them instead. A positive answer is a profit and a negative answer is a loss.' };
    } },
    { skill: 'profit-total', gen: function () {
      var F = pick([3000, 4500, 6000]), v = pick([6, 9, 12]), P = pick([18, 22, 30]), Q = pick([400, 500, 700]), TC = F + v * Q, PR = P * Q - TC;
      return { kind: 'num', q: 'A firm has fixed costs of ' + cash(F) + ' a month and variable costs of ' + cash(v) + ' per unit. It sells ' + fmt(Q) + ' units at ' + cash(P) + ' each. Calculate its profit or loss for the month. Give your answer in $, using a minus sign for a loss.',
        answer: PR, unit: '$', display: fmt(PR), why: 'TR = ' + cash(P) + ' × ' + fmt(Q) + ' = ' + cash(P * Q) + '. TC = ' + cash(F) + ' + (' + cash(v) + ' × ' + fmt(Q) + ') = ' + cash(TC) + '. Profit = ' + cash(P * Q) + ' − ' + cash(TC) + ' = ' + cash(PR) + '.' };
    } },
    { skill: 'profit-total', gen: function () {
      var TR = pick([184000, 236500, 410000, 525000]), TC = TR - pick([-12500, 18400, 31700, 52300]), PR = TR - TC;
      return { kind: 'num', q: 'Last year Ostrana Outdoor had total revenue of ' + cash(TR) + ' and total costs of ' + cash(TC) + '. Calculate its profit or loss. Give your answer in $, using a minus sign for a loss.',
        answer: PR, unit: '$', display: fmt(PR), why: 'Profit = TR − TC = ' + cash(TR) + ' − ' + cash(TC) + ' = ' + cash(PR) + ' ' + plWord(PR) + '.' };
    } },
    { skill: 'per-unit', gen: function () {
      var a = pick([6, 8, 11]), b = pick([4, 5, 7]), c = pick([2, 3]), P = a + b + c - pick([1, 2, 3]), PR = P - (a + b + c);
      return { kind: 'num', q: 'A firm sells desk lamps at ' + cash(P) + ' each. Each lamp costs ' + cash(a) + ' in parts, ' + cash(b) + ' in labour and ' + cash(c) + ' to deliver. Calculate the profit or loss on each lamp. Give your answer in $, using a minus sign for a loss.',
        answer: PR, unit: '$', display: fmt(PR), why: 'Cost per lamp = ' + cash(a) + ' + ' + cash(b) + ' + ' + cash(c) + ' = ' + cash(a + b + c) + '. ' + cash(P) + ' − ' + cash(a + b + c) + ' = ' + cash(PR) + ': a loss on each lamp.' };
    } },
    { skill: 'mcq-options', gen: function () {
      var P = pick([65, 79, 95]), a = pick([18, 21, 26]), b = pick([12, 15, 19]), PR = P - a - b;
      var opts = [cash(PR) + ' profit', cash(P - a) + ' profit', cash(PR) + ' loss', cash(a + b) + ' profit'];
      return { kind: 'mcq', q: 'A firm sells headphones for ' + cash(P) + ' a pair. Each pair costs ' + cash(a) + ' in parts and ' + cash(b) + ' in assembly. What is the profit or loss per pair?',
        options: opts, answer: 0, why: cash(P) + ' − (' + cash(a) + ' + ' + cash(b) + ') = ' + cash(PR) + ', a profit. Subtracting only one unit cost gives ' + cash(P - a) + '.' };
    } },
    { skill: 'profit-total', gen: function () {
      var pa = pick([12, 15]), qa = pick([200, 300]), pb = pick([25, 30]), qb = pick([80, 120]), TC = pick([3000, 4200, 5100]), TR = pa * qa + pb * qb, PR = TR - TC;
      return { kind: 'num', q: 'A craft stall sold ' + fmt(qa) + ' bracelets at ' + cash(pa) + ' and ' + fmt(qb) + ' necklaces at ' + cash(pb) + '. Its total costs were ' + cash(TC) + '. Calculate its profit or loss. Give your answer in $, using a minus sign for a loss.',
        answer: PR, unit: '$', display: fmt(PR), why: 'TR = ' + cash(pa * qa) + ' + ' + cash(pb * qb) + ' = ' + cash(TR) + '. Profit = ' + cash(TR) + ' − ' + cash(TC) + ' = ' + cash(PR) + ' ' + plWord(PR) + '.' };
    } },
    { skill: 'change', gen: function () {
      var TR = pick([48000, 62000, 75000]), TC = TR - pick([8000, 12000, 15000]), rise = pick([2500, 4000, 6000]), P2 = TR - TC - rise;
      return { kind: 'num', q: 'A printing firm had total revenue of ' + cash(TR) + ' and total costs of ' + cash(TC) + '. Paper prices then rise, adding ' + cash(rise) + ' to its costs, while revenue stays the same. Calculate its new profit. Give your answer in $.',
        answer: P2, unit: '$', display: fmt(P2), why: 'Old profit = ' + cash(TR) + ' − ' + cash(TC) + ' = ' + cash(TR - TC) + '. New costs = ' + cash(TC + rise) + ', so new profit = ' + cash(TR) + ' − ' + cash(TC + rise) + ' = ' + cash(P2) + '.' };
    } },
    { skill: 'rearrange', gen: function () {
      var TR = pick([56000, 84000, 120000]), PR = pick([9500, 14000, 21500]);
      return { kind: 'num', q: 'A firm made a profit of ' + cash(PR) + ' on total revenue of ' + cash(TR) + '. Calculate its total costs. Give your answer in $.',
        answer: TR - PR, unit: '$', display: fmt(TR - PR), why: 'Profit = TR − TC, so TC = TR − profit = ' + cash(TR) + ' − ' + cash(PR) + ' = ' + cash(TR - PR) + '.' };
    } },
    { skill: 'rearrange', gen: function () {
      var TC = pick([6000, 9000, 12000]), target = pick([3000, 4500, 6000]), Q = pick([300, 500, 600]), P = (TC + target) / Q;
      return { kind: 'num', q: 'A firm’s total costs are ' + cash(TC) + ' and it expects to sell ' + fmt(Q) + ' units. What price per unit must it charge to make a profit of ' + cash(target) + '? Give your answer in $ to the nearest cent.',
        answer: R.roundDp(P, 2), unit: '$', tol: 0.005, display: fmt(R.roundDp(P, 2), 2), why: 'Needed TR = TC + profit = ' + cash(TC) + ' + ' + cash(target) + ' = ' + cash(TC + target) + '. Price = ' + cash(TC + target) + ' ÷ ' + fmt(Q) + ' = ' + cash2(R.roundDp(P, 2)) + '.' };
    } },
    { skill: 'profit-total', gen: function () {
      var P = pick([6, 8, 9]), wk = [rint(40, 90) * 5, rint(40, 90) * 5, rint(40, 90) * 5, rint(40, 90) * 5], tot = wk.reduce(function (a, b) { return a + b; }, 0), TC = Math.round(P * tot * pick([0.55, 0.7, 0.85]) / 10) * 10, PR = P * tot - TC;
      return { kind: 'num', q: 'A taco stand sells tacos at ' + cash(P) + ' each. Its total costs for the four weeks were ' + cash(TC) + '. Calculate its profit for the four weeks. Give your answer in $.' +
          tbl(['Week', '1', '2', '3', '4'], [['Tacos sold'].concat(wk.map(function (x) { return fmt(x); }))]),
        answer: PR, unit: '$', display: fmt(PR), why: 'Total sold = ' + fmt(tot) + '. TR = ' + cash(P) + ' × ' + fmt(tot) + ' = ' + cash(P * tot) + '. Profit = ' + cash(P * tot) + ' − ' + cash(TC) + ' = ' + cash(PR) + '.' };
    } },
    { skill: 'profit-total', gen: function () {
      var TRm = pick([18000, 24000, 31000]), TCm = TRm - pick([2500, 3200, 4100]);
      return { kind: 'num', q: 'Each month a dental-supplies shop has total revenue of ' + cash(TRm) + ' and total costs of ' + cash(TCm) + '. Calculate its profit for a full year. Give your answer in $.',
        answer: (TRm - TCm) * 12, unit: '$', display: fmt((TRm - TCm) * 12), why: 'Monthly profit = ' + cash(TRm) + ' − ' + cash(TCm) + ' = ' + cash(TRm - TCm) + '. Yearly profit = ' + cash(TRm - TCm) + ' × 12 = ' + cash((TRm - TCm) * 12) + '.' };
    } },
    { skill: 'per-unit', gen: function () {
      var P = pick([12, 15, 20]), ac = pick([8.5, 9.75, 11.2, 13.6]), Q = pick([500, 1000, 1500]);
      if (ac >= P) ac = P - 2.5;
      var PR = R.roundDp((P - ac) * Q, 2);
      return { kind: 'num', q: 'A firm sells ' + fmt(Q) + ' units at ' + cash(P) + ' each. Its average cost is ' + cash2(ac) + ' per unit. Calculate its total profit. Give your answer in $.',
        answer: PR, unit: '$', display: fmt(PR), why: 'Profit per unit = ' + cash(P) + ' − ' + cash2(ac) + ' = ' + cash2(P - ac) + '. Total profit = ' + cash2(P - ac) + ' × ' + fmt(Q) + ' = ' + cash(PR) + '. (Or TR ' + cash(P * Q) + ' − TC ' + cash(ac * Q) + '.)' };
    } },
    { skill: 'mcq-options', gen: function () {
      var P = pick([30, 45]), Q = pick([200, 400]), TC = pick([5000, 7000]);
      return { kind: 'mcq', q: 'A firm sells ' + fmt(Q) + ' units at ' + cash(P) + ' each, and its total costs are ' + cash(TC) + '. Which working gives its profit?',
        options: ['(' + cash(P) + ' × ' + fmt(Q) + ') − ' + cash(TC), cash(TC) + ' − (' + cash(P) + ' × ' + fmt(Q) + ')', '(' + cash(TC) + ' × ' + cash(P) + ') − ' + fmt(Q), cash(P) + ' × ' + fmt(Q)], answer: 0,
        why: 'Work out TR first (' + cash(P) + ' × ' + fmt(Q) + ' = ' + cash(P * Q) + '), then subtract TC: ' + cash(P * Q) + ' − ' + cash(TC) + ' = ' + cash(P * Q - TC) + '.' };
    } },
    mu('mcq-options', 'A firm’s total revenue is $42,000 and its total costs are $45,500. Which statements are correct?',
      ['The firm has made a loss', 'The loss is $3,500', 'Profit = TR − TC gives −$3,500', 'The firm has made a profit of $3,500', 'The firm’s profit is $42,000'], [0, 1, 2],
      '$42,000 − $45,500 = −$3,500. A negative result means a loss of $3,500. Revenue is not profit.'),
    { skill: 'profit-total', gen: function () {
      var P = pick([2.4, 3.6, 4.8]), Q = pick([1500, 2500, 4000]), TC = pick([4200, 6800, 9300]), PR = R.roundDp(P * Q - TC, 2);
      return { kind: 'num', q: 'A bakery in Brevia sells ' + fmt(Q) + ' pastries at €' + fmt(P, 2) + ' each. Its total costs are €' + fmt(TC) + '. Calculate its profit or loss in euros (€), using a minus sign for a loss.',
        answer: PR, unit: '€', display: fmt(PR), why: 'TR = €' + fmt(P, 2) + ' × ' + fmt(Q) + ' = €' + fmt(P * Q) + '. Profit = €' + fmt(P * Q) + ' − €' + fmt(TC) + ' = ' + (PR < 0 ? '−€' + fmt(-PR) : '€' + fmt(PR)) + ' (' + plWord(PR) + ').' };
    } },
    { skill: 'rearrange', gen: function () {
      var F = pick([2000, 3000, 4000]), v = pick([5, 6, 8]), P = v + pick([5, 10]), target = pick([1000, 2000, 3000]), Q = (target + F) / (P - v);
      if (Q % 1) { target = (P - v) * 300 - F; if (target <= 0) { F = 2000; P = v + 10; target = 1000; } Q = (target + F) / (P - v); }
      return { kind: 'num', q: 'A firm has fixed costs of ' + cash(F) + ' and variable costs of ' + cash(v) + ' per unit. It sells each unit for ' + cash(P) + '. How many units must it sell to make a profit of ' + cash(target) + '?',
        answer: Q, unit: 'units', display: fmt(Q), why: 'Each unit adds ' + cash(P) + ' − ' + cash(v) + ' = ' + cash(P - v) + ' towards fixed costs and profit. Units = (' + cash(F) + ' + ' + cash(target) + ') ÷ ' + cash(P - v) + ' = ' + fmt(Q) + '.' };
    } },
    { skill: 'change', gen: function () {
      var P0 = pick([20, 25]), cut = pick([2, 5]), Q0 = pick([400, 500]), Q1 = Q0 + pick([100, 150, 200]), F = pick([2000, 3000]), v = pick([8, 10]);
      var PR1 = (P0 - cut) * Q1 - (F + v * Q1);
      return { kind: 'num', q: 'A firm has fixed costs of ' + cash(F) + ' and variable costs of ' + cash(v) + ' per unit. It cuts its price from ' + cash(P0) + ' to ' + cash(P0 - cut) + ' and sales rise from ' + fmt(Q0) + ' to ' + fmt(Q1) + ' units. Calculate its <b>new</b> profit or loss. Give your answer in $, using a minus sign for a loss.',
        answer: PR1, unit: '$', display: fmt(PR1), why: 'New TR = ' + cash(P0 - cut) + ' × ' + fmt(Q1) + ' = ' + cash((P0 - cut) * Q1) + '. New TC = ' + cash(F) + ' + (' + cash(v) + ' × ' + fmt(Q1) + ') = ' + cash(F + v * Q1) + '. Profit = ' + cash(PR1) + '.' };
    } },
    { skill: 'loss', gen: function () {
      var P, Q, TR, TC, L, opts;
      do { P = pick([10, 20, 25]); Q = pick([100, 200, 300]); TR = P * Q; TC = TR + pick([500, 1000, 1500]); L = TC - TR;
        opts = [cash(L) + ' loss', cash(L) + ' profit', cash(TC) + ' loss', cash(TR) + ' profit']; } while (!distinct(opts));
      return { kind: 'mcq', q: 'A pop-up bookstall sold ' + fmt(Q) + ' second-hand books at ' + cash(P) + ' each, but its total costs were ' + cash(TC) + '. What was its profit or loss?',
        options: opts, answer: 0, why: 'TR = ' + cash(TR) + '. ' + cash(TR) + ' − ' + cash(TC) + ' = −' + cash(L) + '. Costs are higher than revenue, so it is a loss of ' + cash(L) + '.' };
    } },
    { skill: 'per-unit', gen: function () {
      var Q = pick([400, 500, 800, 1250]), pu = pick([3.5, 4.25, 6, 7.8]), PR = R.roundDp(pu * Q, 2), TR = pick([12000, 15000, 20000]);
      return { kind: 'num', q: 'A firm sold ' + fmt(Q) + ' units for total revenue of ' + cash(TR) + ' and made a total profit of ' + cash(PR) + '. Calculate its profit per unit. Give your answer in $ to the nearest cent.',
        answer: pu, unit: '$', tol: 0.005, display: fmt(pu, 2), why: 'Profit per unit = total profit ÷ units = ' + cash(PR) + ' ÷ ' + fmt(Q) + ' = ' + cash2(pu) + '. Total revenue is not needed.' };
    } }
  ] };
})();
