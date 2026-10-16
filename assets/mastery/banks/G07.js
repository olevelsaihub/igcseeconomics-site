/* Group G07 mastery bank: Minimum wage, deregulation, unemployment effects and deficits; Trading blocs. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- small helpers ----------
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function num(n, dp) {
    var neg = n < 0; n = Math.abs(n);
    var s = dp ? R.roundDp(n, dp).toFixed(dp) : String(Math.round(n));
    var p = s.split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '-' : '') + p.join('.');
  }
  // Currency amount with prefix symbol and suffix unit, e.g. cur('€', -77642, 0, 'm') -> "-€77,642m".
  function cur(sym, n, dp, suf) { return (n < 0 ? '-' : '') + sym + num(Math.abs(n), dp) + (suf || ''); }
  function table(head, rows) {
    return '<table class="mc-table"><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  function mc(skill, q, right, wrong, why, extra) {
    var o = { skill: skill, kind: 'mcq', q: q, options: [right].concat(wrong), answer: 0, why: why };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  function mu(skill, q, rights, wrongs, why, extra) {
    var o = { skill: skill, kind: 'multi', q: q, options: rights.concat(wrongs), answers: rights.map(function (_, i) { return i; }), why: why };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  function Q(q, right, wrong, why, extra) {
    var opts = [right];
    wrong.forEach(function (w) { if (opts.indexOf(w) < 0 && opts.length < 5) opts.push(w); });
    var o = { kind: 'mcq', q: q, options: opts, answer: 0, why: why };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  function N(q, ans, unit, why, tol, display) {
    var o = { kind: 'num', q: q, answer: ans, unit: unit, why: why };
    if (tol != null) o.tol = tol;
    if (display) o.display = display;
    return o;
  }
  var COUNTRIES = ['Marenland', 'Kestria', 'Valdoria', 'Osmara', 'Tarvonia', 'Corvenia', 'Ardesh', 'Sundara', 'Pellucia', 'Norvania', 'Eastmoor', 'Lunaria'];
  var YEARS = ['2021', '2022', '2023', '2024', '2025'];
  var WORKERS = ['Amira', 'Tomasz', 'Keisha', 'Rohan', 'Lena', 'Diego', 'Farah', 'Jonas', 'Mei', 'Kwame'];
  var CURS = [{ s: '€', name: 'euros' }, { s: '$', name: 'dollars' }, { s: '£', name: 'pounds' }];

  // ---------- labour market figures ----------
  // Main diagram: origin (60,220). Demand (80,40)-(300,200); supply (80,200)-(300,40); equilibrium (190,120).
  // On demand x = 80 + (y-40)*1.375; on supply x = 80 + (200-y)*1.375.
  var INK = '#303a4c', RED = '#e4464f', BLUE = '#195d9b', GREY = '#9aa5b8';
  function t(x, y, s, fill, extra) { return '<text x="' + x + '" y="' + y + '" font-size="13" fill="' + (fill || INK) + '"' + (extra || '') + '>' + s + '</text>'; }
  function ln(x1, y1, x2, y2, col, w, dash) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + col + '" stroke-width="' + (w || 2) + '"' + (dash ? ' stroke-dasharray="5 4"' : '') + '/>'; }
  function lmSvg(inner, aria, showQe) {
    return '<svg viewBox="0 0 360 262" role="img" aria-label="' + aria + '" xmlns="http://www.w3.org/2000/svg">' +
      ln(60, 220, 340, 220, INK) + ln(60, 220, 60, 18, INK) +
      ln(80, 40, 300, 200, BLUE, 3) + ln(80, 200, 300, 40, BLUE, 3) +
      t(304, 204, 'DL', BLUE) + t(304, 44, 'SL', BLUE) +
      ln(60, 120, 190, 120, GREY, 1.5, true) + ln(190, 120, 190, 220, GREY, 1.5, true) +
      t(32, 124, 'We') + (showQe ? t(181, 236, 'Qe') : '') + t(50, 234, '0') +
      t(200, 256, 'Quantity of labour (workers)', INK, ' text-anchor="middle" font-size="12"') +
      '<text x="16" y="120" font-size="12" fill="' + INK + '" text-anchor="middle" transform="rotate(-90 16 120)">Wage rate ($ per hour)</text>' +
      inner + '</svg>';
  }
  var LM_ABC = lmSvg(
    ln(60, 75, 330, 75, RED, 2, true) + t(318, 70, 'A', RED, ' font-weight="bold"') +
    ln(60, 165, 330, 165, RED, 2, true) + t(318, 160, 'B', RED, ' font-weight="bold"') +
    ln(255, 220, 255, 26, RED, 2, true) + t(260, 30, 'C', RED, ' font-weight="bold"'),
    'Labour market with demand and supply of labour crossing at We and Qe. Line A is horizontal above We, line B is horizontal below We, line C is vertical to the right of Qe', true);
  var LM_JKL = lmSvg(
    ln(60, 80, 330, 80, RED, 2.5) + t(26, 84, 'W1', RED, ' font-weight="bold"') +
    ln(135, 80, 135, 220, GREY, 1.5, true) + ln(245, 80, 245, 220, GREY, 1.5, true) +
    t(130, 238, 'J', RED, ' font-weight="bold"') + t(185, 238, 'K', RED, ' font-weight="bold"') + t(240, 238, 'L', RED, ' font-weight="bold"'),
    'Labour market with a minimum wage line W1 above We. Point J is below where W1 meets the demand curve, point K is below the equilibrium, and point L is below where W1 meets the supply curve', false);
  var LM_RAISE = lmSvg(
    ln(60, 80, 330, 80, RED, 2) + t(26, 84, 'W1', RED, ' font-weight="bold"') +
    ln(60, 56, 330, 56, RED, 2.5) + t(26, 60, 'W2', RED, ' font-weight="bold"') +
    ln(102, 56, 102, 220, GREY, 1.5, true) + ln(135, 80, 135, 220, GREY, 1.5, true) +
    ln(245, 80, 245, 220, GREY, 1.5, true) + ln(278, 56, 278, 220, GREY, 1.5, true) +
    t(97, 238, 'F', RED, ' font-weight="bold"') + t(130, 238, 'G', RED, ' font-weight="bold"') +
    t(240, 238, 'H', RED, ' font-weight="bold"') + t(273, 238, 'J', RED, ' font-weight="bold"'),
    'Labour market with minimum wage W1 above We and a higher minimum wage W2 above W1. Points F and G are below where W2 and W1 meet the demand curve; points H and J are below where W1 and W2 meet the supply curve', false);

  // Small panel for "choose the correct diagram". Local origin (22,112); D (32,20)-(142,100); S (32,100)-(142,20); eq (87,60).
  function panel(x0, y0, kind, letter) {
    var s = function (x, y, txt, col, ex) { return '<text x="' + x + '" y="' + y + '" font-size="10" fill="' + (col || INK) + '"' + (ex || '') + '>' + txt + '</text>'; };
    var g = '<g transform="translate(' + x0 + ',' + y0 + ')">' +
      '<text x="0" y="12" font-size="14" font-weight="bold" fill="' + INK + '">' + letter + '</text>' +
      ln(22, 112, 158, 112, INK, 1.5) + ln(22, 112, 22, 8, INK, 1.5) +
      ln(32, 20, 142, 100, BLUE, 2) + ln(32, 100, 142, 20, BLUE, 2) + s(144, 104, 'D', BLUE) + s(144, 22, 'S', BLUE) +
      ln(22, 60, 87, 60, GREY, 1, true) + s(4, 64, 'We');
    if (kind === 'right' || kind === 'swap') {
      g += ln(22, 36, 155, 36, RED, 2) + s(4, 40, 'W1', RED) + ln(54, 36, 54, 112, GREY, 1, true) + ln(120, 36, 120, 112, GREY, 1, true) +
        s(47, 124, kind === 'right' ? 'Qd' : 'Qs', RED) + s(113, 124, kind === 'right' ? 'Qs' : 'Qd', RED);
    } else if (kind === 'below') {
      g += ln(22, 84, 155, 84, RED, 2) + s(4, 88, 'W1', RED) + ln(120, 84, 120, 112, GREY, 1, true) + ln(54, 84, 54, 112, GREY, 1, true) +
        s(113, 124, 'Qd', RED) + s(47, 124, 'Qs', RED);
    } else {   // shifts demand instead of drawing a wage line
      g += ln(22, 27.3, 122, 100, RED, 2, true) + s(124, 108, 'D1', RED) + ln(22, 67.3, 77, 67.3, GREY, 1, true) + ln(77, 67.3, 77, 112, GREY, 1, true) +
        s(4, 80, 'W1', RED) + s(71, 124, 'Q1', RED);
    }
    return g + '</g>';
  }
  var PANEL_ARIA = {
    right: 'a horizontal W1 above We with Qd at the demand curve to the left and Qs at the supply curve to the right',
    below: 'a horizontal W1 below We',
    swap: 'a horizontal W1 above We with Qs labelled on the left at the demand curve and Qd on the right at the supply curve',
    shift: 'no wage line; the demand curve is shifted left to D1 with a new lower wage W1 and quantity Q1'
  };
  function panelsSvg(kinds) {
    var L = ['A', 'B', 'C', 'D'], pos = [[0, 0], [178, 0], [0, 140], [178, 140]];
    var aria = 'Four labour market diagrams. ' + kinds.map(function (k, i) { return 'Diagram ' + L[i] + ': ' + PANEL_ARIA[k]; }).join('. ');
    return '<svg viewBox="0 0 350 272" role="img" aria-label="' + aria + '" xmlns="http://www.w3.org/2000/svg">' +
      kinds.map(function (k, i) { return panel(pos[i][0], pos[i][1], k, L[i]); }).join('') + '</svg>';
  }
  function panelItem(target, q, why) {
    var kinds = shuf(['right', 'below', 'swap', 'shift']);
    var L = ['A', 'B', 'C', 'D'], ans = kinds.indexOf(target);
    return { kind: 'mcq', q: q, options: L.slice(), answer: ans, svg: panelsSvg(kinds), why: 'Diagram ' + L[ans] + '. ' + why };
  }
  // Labour schedule with equilibrium in the middle row; minimum wage set at row k.
  function schedule() {
    var step = pick([0.5, 1]), base = rint(6, 12), qe = rint(40, 90) * 1000, d = rint(3, 8) * 1000, s = rint(3, 8) * 1000;
    var rows = [];
    for (var i = 0; i < 5; i++) rows.push({ w: base + step * i, ld: qe + d * (2 - i), ls: qe + s * (i - 2) });
    return { rows: rows, qe: qe, we: base + 2 * step, step: step };
  }
  function schedTable(sc) {
    return table(['Wage rate ($ per hour)', 'Workers demanded', 'Workers supplied'], sc.rows.map(function (r) { return ['$' + r.w.toFixed(2), num(r.ld), num(r.ls)]; }));
  }

  // =====================================================================
  // ECO-CALC-21 Fiscal balance: budget surplus or deficit
  // =====================================================================
  B['ECO-CALC-21'] = { title: 'Fiscal balance: budget surplus or deficit', items: [
    { skill: 'calculate', gen: function () {
      var c = pick(COUNTRIES), y = pick(YEARS), rev = rint(60000, 150000), sp = rev + rint(1500, 9000), bal = rev - sp;
      return N('The table shows government finances for ' + c + ' in ' + y + '.<br>' + table(['', '€m'], [['Government revenue', num(rev)], ['Government expenditure', num(sp)]]) +
        'Calculate the fiscal balance in €m. Give a deficit as a negative number.', bal, '€m',
        'Fiscal balance = revenue − expenditure = ' + num(rev) + ' − ' + num(sp) + ' = ' + num(bal) + ' €m. It is negative because spending was greater than revenue, so ' + c + ' had a fiscal deficit of €' + num(-bal) + 'm.');
    } },
    { skill: 'calculate', gen: function () {
      var c = pick(COUNTRIES), revI = rint(30000, 60000), spI = revI - rint(800, 4000), bal = (revI - spI) / 1000;
      return N('In one year the government of ' + c + ' received $' + (revI / 1000).toFixed(3) + 'bn in revenue and spent $' + (spI / 1000).toFixed(3) + 'bn. Calculate the fiscal balance in $bn. Give a deficit as a negative number.',
        bal, '$bn', 'Fiscal balance = ' + (revI / 1000).toFixed(3) + ' − ' + (spI / 1000).toFixed(3) + ' = ' + bal.toFixed(3) + ' $bn. It is positive, so revenue was greater than spending: a fiscal surplus.', 0.0005, bal.toFixed(3));
    } },
    { skill: 'calculate', gen: function () {
      var c = pick(COUNTRIES), revT = rint(4000, 9000), diff = rint(50, 600) * pick([1, -1]), spT = revT - diff, bal = diff / 10;
      return N('Government of ' + c + ', ' + pick(YEARS) + ':<br>' + table(['', '£bn'], [['Tax and other revenue', (revT / 10).toFixed(1)], ['Total government spending', (spT / 10).toFixed(1)]]) +
        'Calculate the fiscal surplus or deficit in £bn. Give a deficit as a negative number.', bal, '£bn',
        'Revenue − spending = ' + (revT / 10).toFixed(1) + ' − ' + (spT / 10).toFixed(1) + ' = ' + bal.toFixed(1) + ' £bn. ' + (bal > 0 ? 'Positive, so this is a fiscal surplus.' : 'Negative, so this is a fiscal deficit: spending was higher than revenue.'), 0.05, bal.toFixed(1));
    } },
    { skill: 'calculate', gen: function () {
      var c = pick(COUNTRIES), it = rint(80, 160) * 100, vat = rint(60, 140) * 100, ct = rint(20, 60) * 100, ot = rint(5, 25) * 100;
      var rev = it + vat + ct + ot, sp = rev + rint(3, 30) * 100 * pick([1, -1]), bal = rev - sp;
      return N('The government of ' + c + ' collected the following revenue in one year (all figures in $m):<br>' +
        table(['Revenue source', '$m'], [['Income tax', num(it)], ['VAT', num(vat)], ['Corporation tax', num(ct)], ['Other revenue', num(ot)]]) +
        'Total government expenditure was $' + num(sp) + 'm. Calculate the fiscal balance in $m. Give a deficit as a negative number.', bal, '$m',
        'First add the revenue: ' + num(it) + ' + ' + num(vat) + ' + ' + num(ct) + ' + ' + num(ot) + ' = ' + num(rev) + ' $m. Then revenue − expenditure = ' + num(rev) + ' − ' + num(sp) + ' = ' + num(bal) + ' $m, a fiscal ' + (bal > 0 ? 'surplus.' : 'deficit.'));
    } },
    { skill: 'calculate', gen: function () {
      var c = pick(COUNTRIES), r10 = rint(250, 420), d10 = rint(8, 60) * pick([1, -1]), s10 = r10 - d10, bal = d10 / 10;
      return N('In ' + c + ', government revenue was ' + (r10 / 10).toFixed(1) + '% of GDP and government expenditure was ' + (s10 / 10).toFixed(1) + '% of GDP. Calculate the fiscal balance as a percentage of GDP. Give a deficit as a negative number.',
        bal, '% of GDP', 'Revenue − expenditure = ' + (r10 / 10).toFixed(1) + ' − ' + (s10 / 10).toFixed(1) + ' = ' + bal.toFixed(1) + '% of GDP. ' + (bal > 0 ? 'Positive: a fiscal surplus.' : 'Negative: a fiscal deficit.'), 0.05, bal.toFixed(1));
    } },
    { skill: 'calculate', gen: function () {
      var c = pick(COUNTRIES), revM = rint(300, 900) * 10, d = rint(3, 40) * 10 * pick([1, -1]), spM = revM - d;
      return N('A regional government in ' + c + ' received revenue of $' + (revM / 1000).toFixed(2) + 'bn and spent $' + num(spM) + 'm. Calculate its fiscal balance in $m. Give a deficit as a negative number. (Remember: $1bn = $1,000m.)',
        d, '$m', 'Convert revenue to millions: $' + (revM / 1000).toFixed(2) + 'bn = $' + num(revM) + 'm. Then ' + num(revM) + ' − ' + num(spM) + ' = ' + num(d) + ' $m, a fiscal ' + (d > 0 ? 'surplus.' : 'deficit.'));
    } },
    { skill: 'label', gen: function () {
      var c = pick(COUNTRIES), rev = rint(42, 98) * 10, d = rint(2, 9) * 10 * pick([1, -1]), sp = rev - d, sum = rev + sp;
      var good = d > 0 ? 'surplus' : 'deficit', badl = d > 0 ? 'deficit' : 'surplus';
      return Q('In ' + pick(YEARS) + ' the government of ' + c + ' had revenue of €' + num(rev) + 'bn and expenditure of €' + num(sp) + 'bn. What was its fiscal position?',
        '€' + num(Math.abs(d)) + 'bn ' + good, ['€' + num(Math.abs(d)) + 'bn ' + badl, '€' + num(sum) + 'bn ' + good, '€' + num(sum) + 'bn ' + badl],
        'Revenue − expenditure = ' + num(rev) + ' − ' + num(sp) + ' = ' + num(d) + ' €bn. ' + (d > 0 ? 'Revenue was higher, so it is a surplus.' : 'Spending was higher, so it is a deficit.') + ' Adding the two figures (€' + num(sum) + 'bn) is a common trap.');
    } },
    { skill: 'label', gen: function () {
      var c = pick(COUNTRIES), rev = rint(1200, 4800), sp = rev + rint(40, 400), d = sp - rev;
      return Q('A city government in ' + c + ' collected $' + num(rev) + 'm in revenue and spent $' + num(sp) + 'm. Which of the following describes its budget?',
        'A fiscal deficit of $' + num(d) + 'm', ['A fiscal surplus of $' + num(d) + 'm', 'A fiscal deficit of $' + num(sp) + 'm', 'A fiscal surplus of $' + num(rev + sp) + 'm'],
        'Revenue − spending = ' + num(rev) + ' − ' + num(sp) + ' = −' + num(d) + ' $m. Spending was greater than revenue, so the city has a fiscal deficit of $' + num(d) + 'm, not a deficit equal to all its spending.');
    } },
    { skill: 'read-table', gen: function () {
      var ys = ['2021', '2022', '2023', '2024'], defs = shuf([rint(5, 20), rint(25, 40), rint(45, 60), -rint(5, 30)]);
      var rows = ys.map(function (y, i) { var r = rint(300, 500); return [y, num(r), num(r + defs[i])]; });
      var big = defs.indexOf(Math.max.apply(null, defs));
      return Q('The table shows government finances for ' + pick(COUNTRIES) + ' ($bn).<br>' + table(['Year', 'Revenue', 'Expenditure'], rows) + 'In which year was the fiscal deficit largest?',
        ys[big], ys.filter(function (_, i) { return i !== big; }),
        'Work out revenue − expenditure for each year: ' + ys.map(function (y, i) { return y + ': ' + num(-defs[i]); }).join(', ') + ' ($bn). The most negative balance, ' + num(-defs[big]) + ', is the largest deficit, in ' + ys[big] + '.');
    } },
    { skill: 'read-table', gen: function () {
      var ys = ['2022', '2023', '2024', '2025'], gaps = shuf([-rint(20, 90), rint(10, 60), rint(70, 120), rint(130, 200)]);
      var rows = ys.map(function (y, i) { var r = rint(2000, 3500); return [y, num(r), num(r + gaps[i])]; });
      var sur = gaps.findIndex(function (g) { return g < 0; });
      return Q('The table shows revenue and expenditure for the government of ' + pick(COUNTRIES) + ' (€m).<br>' + table(['Year', 'Revenue', 'Expenditure'], rows) + 'In which year did the government have a fiscal surplus?',
        ys[sur], ys.filter(function (_, i) { return i !== sur; }),
        'A surplus needs revenue greater than expenditure. Only in ' + ys[sur] + ' was revenue higher: balance = +' + num(-gaps[sur]) + ' €m. Every other year had a deficit.');
    } },
    { skill: 'rearrange', gen: function () {
      var c = pick(COUNTRIES), rev = rint(120, 480), def = rint(6, 45);
      return N('In ' + pick(YEARS) + ' the government of ' + c + ' had revenue of $' + rev + 'bn and a fiscal deficit of $' + def + 'bn. Calculate its total expenditure in $bn.',
        rev + def, '$bn', 'A deficit means spending was higher than revenue by $' + def + 'bn, so expenditure = ' + rev + ' + ' + def + ' = $' + (rev + def) + 'bn. Check: ' + rev + ' − ' + (rev + def) + ' = −' + def + '.');
    } },
    { skill: 'rearrange', gen: function () {
      var c = pick(COUNTRIES), spI = rint(80, 300) * 10, surI = rint(15, 95), ans = spI + surI;
      return N('The government of ' + c + ' spent €' + num(spI) + 'm and ran a fiscal surplus of €' + surI + 'm. Calculate its total revenue in €m.',
        ans, '€m', 'A surplus means revenue was higher than spending by €' + surI + 'm, so revenue = ' + num(spI) + ' + ' + surI + ' = €' + num(ans) + 'm. Check: ' + num(ans) + ' − ' + num(spI) + ' = +' + surI + '.');
    } },
    { skill: 'method', gen: function () {
      var rev = rint(200, 600), sp = rev + rint(10, 60), d = sp - rev;
      return Q('A student is told government revenue was $' + rev + 'bn and expenditure was $' + sp + 'bn. She writes: "' + sp + ' − ' + rev + ' = ' + d + ', so the fiscal balance is +$' + d + 'bn, a surplus." What is wrong?',
        'She subtracted in the wrong order, so the sign and the label are wrong', ['She should have added revenue and spending to get $' + num(rev + sp) + 'bn', 'Nothing is wrong: a positive answer means a surplus', 'She should have divided expenditure by revenue instead'],
        'Fiscal balance = revenue − expenditure = ' + rev + ' − ' + sp + ' = −' + d + ' $bn. Spending was higher, so this is a deficit of $' + d + 'bn, not a surplus.');
    } },
    mc('method', 'Which calculation gives a government\'s fiscal balance?',
      'Government revenue − government expenditure', ['Government expenditure + government revenue', 'Value of exports − value of imports', 'Government expenditure ÷ government revenue'],
      'The fiscal balance compares what the government receives with what it spends: revenue minus expenditure. Exports minus imports is part of the current account, not the budget.'),
    mc('label', 'A government\'s fiscal balance is calculated as −€6bn. What does the minus sign tell you?',
      'Spending was €6bn more than revenue: a deficit', ['Revenue was €6bn more than spending: a surplus', 'Imports were €6bn more than exports in that year', 'The government repaid €6bn of its debt that year'],
      'Revenue − expenditure is negative only when expenditure is bigger. So −€6bn is a fiscal deficit of €6bn.'),
    mc('label', 'In one year, Tarvonia\'s government revenue is greater than its expenditure. The fiscal balance is',
      'positive, showing a fiscal surplus', ['negative, showing a fiscal deficit', 'positive, showing a fiscal deficit', 'zero, showing a balanced budget'],
      'Revenue − expenditure is positive when revenue is the larger figure, and a positive balance is a surplus.'),
    mc('label', 'A government\'s revenue and expenditure are both exactly $240bn. Its fiscal balance is',
      'zero, a balanced budget', ['a surplus of $480bn', 'a deficit of $240bn', 'a surplus of $240bn'],
      '240 − 240 = 0. When revenue equals expenditure there is neither a surplus nor a deficit: the budget is balanced.'),
    mu('method', 'Which two figures do you need to calculate a government\'s fiscal balance for one year?',
      ['Total government revenue', 'Total government expenditure'], ['Value of exports', 'Value of imports', 'Gross domestic product (GDP)'],
      'Fiscal balance = government revenue − government expenditure. Exports and imports are needed for the current account, and GDP is only needed if you want the balance as a share of GDP.'),
    mc('method', 'Revenue and expenditure are given in a table headed "Rs crore". How should the fiscal balance be written?',
      'In Rs crore, with a minus sign if it is a deficit', ['As a percentage, because it is a difference', 'Without any units, because the units cancel', 'In Rs crore, always as a positive number'],
      'Keep the units and currency of the data, and keep the sign: a negative balance shows a deficit. Mark schemes often lose a mark if the units are missing.'),
    mc('method', 'Revenue was £510bn and expenditure was £560bn. A student writes "fiscal balance = £1,070bn". What mistake was made?',
      'The two figures were added instead of subtracted', ['Expenditure was subtracted from revenue correctly', 'Revenue should have been divided by expenditure', 'The answer should have been given in % of GDP'],
      'The balance is revenue − expenditure = 510 − 560 = −£50bn, a deficit. Adding the figures (510 + 560 = 1,070) gives no meaning.'),
    mc('label', 'Which statement about a fiscal deficit of $12bn is correct?',
      'Government expenditure was $12bn greater than revenue', ['Government revenue was $12bn greater than expenditure', 'The country imported $12bn more than it exported', 'Total government spending for the year was $12bn'],
      'A fiscal deficit is the gap by which spending exceeds revenue. It is not the total amount spent, and it is not about imports and exports.'),
    mc('read-table', 'A government had a fiscal balance of −€30bn in 2024 and +€5bn in 2025. Which statement is correct?',
      'It had a deficit in 2024 and a surplus in 2025', ['It had a surplus in 2024 and a deficit in 2025', 'It had a deficit in both years', 'It had a surplus in both years'],
      'A negative balance (−€30bn) is a deficit and a positive balance (+€5bn) is a surplus.')
  ] };

  // =====================================================================
  // ECO-T21-31 Deregulation: meaning, advantages and disadvantages
  // =====================================================================
  B['ECO-T21-31'] = { title: 'Deregulation: meaning, advantages and disadvantages', items: [
    mc('definition', 'What is meant by deregulation?',
      'Removing or reducing government rules and controls on firms and markets', ['Selling state-owned firms and their assets to private sector shareholders', 'Introducing new laws to protect consumers and workers', 'The government setting a maximum price in a market'],
      'Deregulation means removing government controls on how firms and markets work. Selling state-owned firms is privatisation, which changes who owns the firm, not the rules.'),
    mc('definition', 'Deregulation is an example of which kind of government policy?',
      'Supply-side policy', ['Monetary policy', 'Protectionist trade policy', 'Policy to reduce income inequality'],
      'Deregulation aims to raise competition and the productive capacity of the economy, so it is a supply-side policy.'),
    mu('definition', 'Which statements about deregulation are correct?',
      ['It aims to increase competition in markets', 'It can make it easier for new firms to enter a market', 'It is one type of supply-side policy'],
      ['It means the government sells its firms to the private sector', 'It always adds new rules for firms to follow'],
      'Deregulation removes rules, so entry is easier and competition rises; it is a supply-side policy. Selling state firms is privatisation, and adding rules is the opposite of deregulation.'),
    mc('identify-example', 'Which of the following is an example of deregulation?',
      'Removing the limit on the number of taxi licences in a city', ['Requiring every street food seller to buy a yearly trading licence', 'Raising the national minimum wage by 6%', 'Banning shops from opening on public holidays'],
      'Scrapping the limit lets more taxi firms enter the market, so a control is removed. The other options all add rules for firms.'),
    mc('identify-example', 'The government of Sundara wants to deregulate its banking sector. Which policy would do this?',
      'Allowing foreign banks to open branches in Sundara', ['Selling the state-owned bank to private investors', 'Making banks hold more cash in reserve', 'Capping the interest rates that banks may charge'],
      'Letting foreign banks enter removes a barrier to entry, which is deregulation. Selling the state bank is privatisation, and reserve rules or caps are new regulations.'),
    mu('identify-example', 'Which of the following are examples of deregulation?',
      ['Scrapping a rule that limits shop opening hours', 'Letting new airlines fly routes once reserved for one firm', 'Removing the need for a permit to run a small home business'],
      ['Introducing compulsory safety checks for all lifts', 'Selling shares in the state-owned water company'],
      'Each correct option removes a government control or barrier to entry. Compulsory checks add a rule, and selling shares in a state firm is privatisation.'),
    mc('identify-example', 'Which of these policies is the <b>opposite</b> of deregulation?',
      'Introducing a licence that firms must hold before they can trade', ['Letting more firms compete to supply electricity', 'Abolishing the old rule that only one firm may run the city\'s bus routes', 'Cutting the paperwork needed to open a new factory'],
      'A new licence requirement adds a government control and makes entry harder. The other three remove rules or barriers, which is deregulation.'),
    mc('distinguish', 'The government of Pellucia sells its national railway company to private shareholders. Which policy is this?',
      'Privatisation', ['Deregulation', 'Nationalisation', 'Infrastructure spending'],
      'Moving ownership of a state firm to the private sector is privatisation. Deregulation changes the rules on firms, not who owns them.'),
    mc('distinguish', 'Corvenia\'s state postal firm had a legal monopoly on letter delivery. The government ends the monopoly so private couriers can also deliver letters, but it still owns the postal firm. Which policy is this?',
      'Deregulation', ['Privatisation', 'Nationalisation', 'Education and training'],
      'Ownership has not changed, so it is not privatisation. A legal barrier to entry has been removed, which is deregulation.'),
    mc('distinguish', 'Ardesh scraps the rule that limited how many mobile phone networks may operate in the country. Which supply-side policy has it used?',
      'Deregulation', ['Lower business taxes', 'Infrastructure spending', 'Education and training'],
      'The government has removed a control that limited the number of firms. That is deregulation; no tax, building or training is involved.'),
    mc('advantage-chain', 'Kestria removes the cap on the number of bus companies allowed to run city routes. What is the most likely next link in the chain?',
      'More firms compete, so fares tend to fall and choice increases', ['Fewer firms compete, so bus fares tend to rise and choice narrows', 'The government must now buy the bus companies', 'Bus companies must pay a new tax on each route'],
      'Removing the cap lowers a barrier to entry. New firms enter and compete for passengers, which puts downward pressure on fares and widens choice.'),
    mc('advantage-chain', 'A government cuts the number of permits a firm needs to build a new factory. Which chain best shows how this could reduce unemployment?',
      'Lower costs and faster approval → more investment → more jobs', ['Higher costs for firms → less investment → fewer jobs', 'More permits needed → more civil servants → more jobs', 'Fewer factories built → less output → more jobs'],
      'Fewer permits cut the time and cost of starting production. Firms invest more, new factories need workers, so employment can rise.'),
    mc('advantage-chain', 'Lunaria allows foreign firms to enter its broadband market for the first time. Which is the most likely benefit?',
      'Foreign direct investment brings new networks and jobs', ['Domestic broadband firms face less competition', 'Broadband prices rise because the supply of broadband falls', 'The government gains ownership of the new networks'],
      'New foreign firms invest in equipment and staff (foreign direct investment). This adds jobs and, through competition, can improve quality and lower prices.'),
    mc('advantage-chain', 'Which group is most likely to benefit directly when airline routes are deregulated and new airlines start flying?',
      'Passengers, through lower fares and more choice', ['The existing airline, through higher profits', 'Airport workers, through guaranteed pay rises', 'The government, through higher import tariffs'],
      'More airlines competing on the same routes means fares are pushed down and passengers can choose between more flights.'),
    mu('advantage-chain', 'Which of the following are possible advantages of deregulation for an economy?',
      ['Lower costs of production for firms', 'More competition, leading to lower prices', 'More investment, leading to economic growth'],
      ['Stronger job security for workers', 'Tighter limits on pollution from factories'],
      'Fewer rules cut costs and make entry easier, which raises competition and investment. Stronger job security and tighter pollution limits come from more regulation, not less.'),
    mc('disadvantage-chain', 'Norvania removes limits on the waste that mines may release into rivers. What is the most likely disadvantage?',
      'More pollution, which harms people living downstream', ['Lower costs for the mines, so their output and profits rise', 'The mines are sold to the private sector', 'Fewer firms want to open mines in Norvania'],
      'Removing environmental rules lets firms pollute more. The harm falls on third parties such as farmers and families who use the river. Lower costs are an advantage for the mines, not a disadvantage.'),
    mc('disadvantage-chain', 'A government relaxes employment rules so firms can dismiss staff with very little notice. Which is the main disadvantage for workers?',
      'Weaker job security, so workers may lose income suddenly', ['Higher wages, because firms must now compete harder for staff', 'Lower costs for firms that want to hire staff', 'More training, because firms must keep workers longer'],
      'The rule protected workers. Without it, workers can lose their job and income with little warning, which raises stress and uncertainty.'),
    mc('disadvantage-chain', 'Safety inspections of restaurant kitchens are scrapped to cut costs for firms. Who is most at risk?',
      'Consumers, who may eat food prepared in unsafe conditions', ['Restaurant owners, whose costs of production rise', 'The government, which must hire more inspectors', 'Suppliers, who must now pay for the inspections'],
      'Inspections protected diners. Without them some restaurants may cut corners, so consumers face a greater risk of food poisoning.'),
    mc('disadvantage-chain', 'Eastmoor deregulates its energy market to cut firms\' costs. Many firms keep the savings as higher profit instead of hiring. Why does this weaken the policy?',
      'Lower costs do not turn into more jobs, so unemployment may not fall', ['Higher profit always forces firms to raise their prices for consumers', 'Firms must return the savings to the government as tax', 'Deregulation means the firms are now owned by the state'],
      'Deregulation only reduces unemployment if firms use lower costs to expand and hire. If the savings become profit, there may be little change in jobs.'),
    mc('disadvantage-chain', 'Which group is most likely to lose when a market that was protected by a licence system is deregulated?',
      'Existing firms, which face new competitors and may lose sales', ['New firms, which can now enter the market more easily', 'Consumers, who can now choose from many more sellers than before', 'Foreign investors, who can now set up in the market'],
      'The licences kept rivals out. Once they go, established firms face more competition, so their market share and profit may fall and some jobs may be lost.'),
    mc('evaluate', 'A minister claims: "Deregulating the construction industry will reduce unemployment." Which is the strongest counter-argument?',
      'Firms may use lower costs to buy machines rather than hire workers', ['Construction firms never respond in any way to changes in their costs', 'Deregulation always raises the costs of construction firms', 'Fewer rules mean the government must build all the houses'],
      'The chain from fewer rules to more jobs depends on how firms use their savings. If they invest in labour-saving machinery or keep the profit, unemployment may hardly fall.'),
    mc('evaluate', 'Deregulation of a market is most likely to lead to lower prices when',
      'many new firms actually enter and compete', ['one firm still controls almost all of the market', 'start-up costs remain far too high for new firms', 'existing firms agree with each other to keep prices high'],
      'Removing rules only helps if competition really increases. If other barriers stop new firms entering, or one firm dominates, prices may not fall.'),
    mu('evaluate', 'The effect of deregulation on unemployment is likely to depend on which of the following?',
      ['Whether firms use the cost savings to hire more workers', 'Whether new firms actually enter the market', 'How many jobs existing firms lose to new competitors'],
      ['Whether the deregulated firms are sold by the state', 'Whether the country uses the same currency as its neighbours'],
      'Jobs rise only if savings and new entry lead to hiring, and this must outweigh any jobs lost at existing firms. Ownership changes and currency choice are not part of deregulation.')
  ] };

  // =====================================================================
  // ECO-T12-24 Draw a minimum wage on a labour market diagram
  // =====================================================================
  B['ECO-T12-24'] = { title: 'Draw a minimum wage on a labour market diagram', items: [
    mc('place-line', 'Look at the labour market diagram. Which line correctly shows a minimum wage set above the equilibrium wage?',
      'Line A', ['Line B', 'Line C'],
      'A minimum wage is a wage, so it is a horizontal line drawn from the wage axis. To be above equilibrium it must be higher than We, which is line A.', { svg: LM_ABC, family: 'lm-abc' }),
    mc('place-line', 'Look at the labour market diagram. Which line shows a minimum wage that would have <b>no effect</b> on the market?',
      'Line B', ['Line A', 'Line C'],
      'Line B is below We. Firms already pay the equilibrium wage, which is higher than this minimum, so the minimum wage does not bind and nothing changes.', { svg: LM_ABC, family: 'lm-abc' }),
    mc('place-line', 'How should a minimum wage (W1) be drawn on a labour market diagram?',
      'As a horizontal line at W1, above the equilibrium wage', ['As a vertical line to the right of the equilibrium quantity', 'By shifting the demand for labour curve to the left', 'As a horizontal line at W1, below the equilibrium wage'],
      'The minimum wage is a wage floor, so it is a horizontal line at that wage. It only changes the market when it is set above the equilibrium wage We.'),
    mc('place-line', 'Why must a minimum wage be drawn above the equilibrium wage We to show an effect?',
      'Below We, employers already pay more than the minimum, so it does not bind', ['Below We, the demand curve becomes vertical', 'Above We, the supply of labour curve shifts to the right', 'Above We, firms must hire more workers than before'],
      'A minimum wage is a floor. If it is below the wage the market already pays, nobody is paid less than it, so the market stays at We and Qe.'),
    mc('read-quantities', 'Look at the diagram, where a minimum wage W1 has been set. Which point shows the new quantity of labour demanded?',
      'J', ['K', 'L'],
      'Read across from W1 to the demand curve (DL) and then down to the axis. That is J: at the higher wage firms want fewer workers than at equilibrium (K).', { svg: LM_JKL, family: 'lm-jkl' }),
    mc('read-quantities', 'Look at the diagram, where a minimum wage W1 has been set. Which point shows the new quantity of labour supplied?',
      'L', ['J', 'K'],
      'Read across from W1 to the supply curve (SL) and down to the axis. That is L: at the higher wage more people want to work than at equilibrium (K).', { svg: LM_JKL, family: 'lm-jkl' }),
    mc('surplus-gap', 'Look at the diagram, where a minimum wage W1 has been set. Which distance shows the surplus of labour (unemployment) caused by the minimum wage?',
      'J to L', ['J to K', 'K to L', '0 to J'],
      'At W1, firms want J workers but L people want to work. The gap J to L is the excess supply of labour: people who want a job at W1 but cannot get one.', { svg: LM_JKL, family: 'lm-jkl' }),
    mc('surplus-gap', 'Look at the diagram, where a minimum wage W1 has been set. Which distance shows the fall in the number of workers employed?',
      'K to J', ['K to L', 'J to L', '0 to K'],
      'Before the minimum wage, K workers were employed. Firms now hire only J workers (the quantity demanded at W1), so employment falls by the distance K to J.', { svg: LM_JKL, family: 'lm-jkl' }),
    { skill: 'choose-diagram', gen: function () {
      return panelItem('right', 'Which diagram correctly shows the effect of a minimum wage (W1) set above the equilibrium wage, with the new quantities of labour demanded (Qd) and supplied (Qs) labelled?',
        'It has a horizontal W1 above We, Qd where W1 meets demand (to the left of equilibrium) and Qs where W1 meets supply (to the right).');
    } },
    { skill: 'choose-diagram', gen: function () {
      return panelItem('swap', 'In which diagram have the new quantity of labour demanded (Qd) and the new quantity of labour supplied (Qs) been labelled the wrong way round?',
        'Its Qs is under the point where W1 meets the demand curve, and its Qd is under the supply curve. Demand gives the smaller quantity, supply the larger.');
    } },
    { skill: 'choose-diagram', gen: function () {
      return panelItem('shift', 'A student was asked to draw a minimum wage. In which diagram has the student made the error of shifting a curve instead of drawing a wage line?',
        'It moves the demand curve to D1 and has no horizontal wage line. A minimum wage does not shift either curve; it is drawn as a horizontal line above We.');
    } },
    mc('common-errors', 'After a minimum wage is set above We, which ordering of quantities of labour is correct?',
      'Qd &lt; Qe &lt; Qs', ['Qs &lt; Qe &lt; Qd', 'Qe &lt; Qd &lt; Qs', 'Qd &lt; Qs &lt; Qe'],
      'At a wage above We, firms demand fewer workers than at equilibrium (Qd &lt; Qe) and more people offer to work (Qs &gt; Qe).'),
    mu('common-errors', 'To gain full marks for drawing a minimum wage on a labour market diagram, which must be shown?',
      ['A horizontal line labelled W1 above We', 'The new quantity of labour demanded, labelled', 'The new quantity of labour supplied, labelled'],
      ['A new demand for labour curve to the left', 'A new supply of labour curve to the right'],
      'Marks go for the wage line above equilibrium and the two new quantities read off the existing curves. Neither curve shifts.'),
    mc('common-errors', 'A student draws W1 above We, then labels Qs where W1 meets the demand curve. What is wrong?',
      'Qs should be read from the supply curve, not the demand curve', ['W1 should have been drawn below the equilibrium wage', 'Qs should be at the equilibrium quantity Qe', 'The student should have shifted the supply curve'],
      'Quantity supplied always comes from the supply of labour curve. Where W1 meets demand gives Qd, the smaller quantity.'),
    mc('common-errors', 'On a labour market diagram, what goes on each axis?',
      'Wage rate on the vertical axis; quantity of labour on the horizontal', ['Quantity of labour on the vertical axis; wage rate on the horizontal', 'Price of the product on the vertical axis; output on the horizontal', 'Number of firms on the vertical axis; wage rate on the horizontal'],
      'The wage is the price of labour, so it goes on the vertical axis, and the number of workers goes on the horizontal axis.'),
    mc('surplus-gap', 'After a minimum wage is set above equilibrium, how many workers are actually employed?',
      'The quantity of labour demanded at W1', ['The quantity of labour supplied at W1', 'The original equilibrium quantity Qe', 'The total of quantity demanded and supplied'],
      'Firms decide how many people to hire. At W1 they only want Qd workers, so employment is Qd even though more people (Qs) want to work.'),
    mc('surplus-gap', 'What is the gap between the quantity of labour supplied and the quantity of labour demanded at the minimum wage called?',
      'An excess supply of labour (unemployment)', ['An excess demand for labour (a shortage)', 'The equilibrium level of employment', 'A rise in the demand for labour'],
      'At W1 more people want to work (Qs) than firms want to hire (Qd). The extra workers are a surplus of labour, so they are unemployed.'),
    mc('raise-minimum', 'Look at the diagram. The minimum wage is increased from W1 to W2. Which point shows the new quantity of labour demanded?',
      'F', ['G', 'H', 'J'],
      'Read across from W2 to the demand curve and down: F. It is to the left of G (demand at W1), because firms want even fewer workers at the higher wage.', { svg: LM_RAISE, family: 'lm-raise' }),
    mc('raise-minimum', 'Look at the diagram. After the minimum wage rises from W1 to W2, which distance shows the surplus of labour?',
      'F to J', ['G to H', 'F to G', 'H to J'],
      'At W2, labour demanded is F and labour supplied is J, so the surplus is F to J. G to H was the surplus at the old minimum wage W1, which is smaller.', { svg: LM_RAISE, family: 'lm-raise' }),
    mc('raise-minimum', 'A minimum wage already above equilibrium is increased further. What happens on the labour market diagram?',
      'Quantity demanded falls, quantity supplied rises, and the surplus widens', ['Quantity demanded rises, quantity supplied falls, and the surplus narrows', 'The demand curve shifts right, so the surplus disappears', 'Both quantities stay the same because the curves do not move'],
      'The horizontal wage line moves up. Reading off the same curves, firms want fewer workers and more people want to work, so the gap between them grows.'),
    { skill: 'read-quantities', gen: function () {
      var sc = schedule(), k = rint(3, 4), r = sc.rows[k];
      return N('The table shows the market for cleaners in ' + pick(COUNTRIES) + '.<br>' + schedTable(sc) + 'The government sets a minimum wage of $' + r.w.toFixed(2) + ' per hour. How many cleaners will be employed?',
        r.ld, 'workers', 'Equilibrium is at $' + sc.we.toFixed(2) + ' with ' + num(sc.qe) + ' workers. At the minimum wage of $' + r.w.toFixed(2) + ', firms only demand ' + num(r.ld) + ' workers, and firms decide how many are hired, so employment is ' + num(r.ld) + '.');
    } },
    { skill: 'surplus-gap', gen: function () {
      var sc = schedule(), k = rint(3, 4), r = sc.rows[k];
      return N('The table shows the labour market for farm workers in ' + pick(COUNTRIES) + '.<br>' + schedTable(sc) + 'A minimum wage of $' + r.w.toFixed(2) + ' per hour is introduced. Calculate the surplus of labour (the number of workers who want a job but cannot get one).',
        r.ls - r.ld, 'workers', 'At $' + r.w.toFixed(2) + ': labour supplied ' + num(r.ls) + ' − labour demanded ' + num(r.ld) + ' = ' + num(r.ls - r.ld) + ' workers. This excess supply is the gap between Qs and Qd on the diagram.');
    } },
    { skill: 'read-quantities', gen: function () {
      var sc = schedule(), k = rint(3, 4), r = sc.rows[k];
      return N('The table shows the labour market for shop assistants in ' + pick(COUNTRIES) + '.<br>' + schedTable(sc) + 'A minimum wage of $' + r.w.toFixed(2) + ' per hour is set. By how many workers does employment fall compared with equilibrium?',
        sc.qe - r.ld, 'workers', 'Equilibrium employment is ' + num(sc.qe) + ' (where demand equals supply, at $' + sc.we.toFixed(2) + '). At the minimum wage firms hire ' + num(r.ld) + '. Fall = ' + num(sc.qe) + ' − ' + num(r.ld) + ' = ' + num(sc.qe - r.ld) + ' workers.');
    } },
    { skill: 'place-line', gen: function () {
      var sc = schedule(), r = sc.rows[rint(0, 1)];
      return Q('The table shows the labour market for kitchen porters in ' + pick(COUNTRIES) + '.<br>' + schedTable(sc) + 'The government sets a minimum wage of $' + r.w.toFixed(2) + ' per hour. What happens?',
        'Nothing changes: ' + num(sc.qe) + ' workers stay employed at $' + sc.we.toFixed(2),
        ['Employment falls to ' + num(r.ld) + ' at the new wage', 'Employment rises to ' + num(r.ld) + ' at the new wage', 'A surplus of ' + num(Math.abs(r.ld - r.ls)) + ' workers appears'],
        'The equilibrium wage is $' + sc.we.toFixed(2) + ', which is above the $' + r.w.toFixed(2) + ' minimum. Firms already pay more than the minimum, so it does not bind: the market stays at equilibrium.');
    } }
  ] };

  // =====================================================================
  // ECO-T21-25 Fiscal deficits and surpluses: meaning and effects
  // =====================================================================
  B['ECO-T21-25'] = { title: 'Fiscal deficits and surpluses: meaning and effects', items: [
    mc('definition', 'Which of these shows that Osmara\'s government had a fiscal surplus last year?',
      'It collected more in taxes and other revenue than it spent', ['It spent more than it collected in taxes and other revenue', 'Osmara earned more from exports than it spent on imports', 'Its total national debt was smaller than its GDP'],
      'Fiscal means to do with the government budget. A surplus means the government takes in more (mainly from taxes) than it spends in the year.'),
    mc('definition', 'A fiscal deficit is when',
      'government expenditure is greater than government revenue', ['government revenue is greater than government expenditure', 'spending on imports is higher than earnings from exports', 'the government owns more firms than the private sector'],
      'A deficit is a shortfall: the government spends more than it receives in that year, so it must borrow the difference.'),
    mc('not-current-account', 'Which of the following describes a current account deficit, <b>not</b> a fiscal deficit?',
      'Spending on imports is greater than earnings from exports', ['Government spending on schools is greater than its tax revenue', 'Government borrowing is needed to pay for hospitals', 'Benefit spending rises while income tax revenue falls'],
      'The current account compares exports and imports. A fiscal deficit compares government revenue and government expenditure.'),
    mc('not-current-account', 'Osmara has a fiscal surplus but a current account deficit. Which statement must be true?',
      'Government revenue exceeds its spending, while imports exceed exports', ['Exports exceed imports, while government spending exceeds revenue', 'Government spending exceeds revenue, and imports exceed exports', 'Both government revenue and exports are falling'],
      'The two balances measure different things. A fiscal surplus is about the government budget; a current account deficit is about trade with other countries.'),
    mc('deficit-effects', 'How does a government pay for a fiscal deficit?',
      'It borrows the difference, which adds to the national debt', ['It sells more exports to other countries', 'It receives the difference from the central bank as profit', 'It cuts the value of its imports to match'],
      'When spending is greater than revenue, the gap must be borrowed, for example by selling government bonds. Each year\'s deficit adds to the total national debt.'),
    mc('deficit-effects', 'What is the difference between a fiscal deficit and the national debt?',
      'A deficit is one year\'s shortfall; the debt is the total borrowed over time', ['A deficit is the total borrowed over time; the debt is one year\'s shortfall', 'A deficit is about trade; the debt is about the government budget', 'They mean the same thing and can be used either way'],
      'The deficit is a flow: the gap between spending and revenue in one year. The national debt is a stock: everything borrowed and not yet repaid. Deficits add to the debt.'),
    mc('deficit-effects', 'Tarvonia runs large fiscal deficits for many years. What is the most likely long-term consequence?',
      'Rising interest payments, which may mean higher taxes or spending cuts later', ['Falling national debt, so the interest payments on it disappear within a few years', 'A rise in the value of the country\'s exports', 'Lower taxes in future because the debt repays itself'],
      'Each deficit adds to the debt, and the government must pay interest on it. Money spent on interest cannot be spent on services, so taxes may rise or spending may be cut in future.'),
    mc('deficit-effects', 'A government runs a deficit to build new roads and railways during a recession. Which chain shows a short-run benefit?',
      'More spending creates construction jobs, so incomes and spending rise', ['Less government spending cuts jobs, so incomes and consumer spending fall', 'Higher taxes reduce demand, so inflation falls', 'Fewer imports are bought, so the current account improves'],
      'Deficit spending injects extra demand. Firms hire workers to build the roads, those workers spend their wages, and this can boost economic growth in the short run.'),
    mc('deficit-effects', 'Why might a large fiscal deficit be unfair to future generations?',
      'They may face higher taxes to pay interest on today\'s borrowing', ['They will receive more public services than today\'s taxpayers', 'They will pay lower taxes because the debt is cancelled', 'They will have to export more goods to repay it'],
      'Borrowing today creates debt that must be serviced later. Future taxpayers may pay higher taxes or receive fewer services to cover the interest.'),
    mu('surplus-uses', 'Which of the following are ways a government could use a fiscal surplus?',
      ['Repay some of the national debt', 'Cut income tax rates', 'Spend more on healthcare and education'],
      ['Reduce the country\'s current account deficit directly', 'Borrow more money from abroad'],
      'A surplus is extra money after spending, so it can repay debt, fund tax cuts or pay for more public services. It does not directly change exports and imports, and a surplus means less borrowing, not more.'),
    mc('surplus-uses', 'Valdoria uses its fiscal surplus to repay part of its national debt. What is the most likely next link?',
      'Interest payments fall, freeing money for services in future', ['Interest payments rise, so income taxes must increase next year', 'Imports fall, so the current account improves', 'The surplus turns into a deficit the same year'],
      'Less debt means less interest to pay each year. That money can then be used for schools, hospitals or tax cuts in future years.'),
    mc('surplus-uses', 'A government uses its surplus to cut income tax. Which chain shows the effect on households?',
      'Disposable income rises, so consumer spending can rise', ['Disposable income falls, so households save less', 'Prices of imports fall, so exports rise', 'Government spending rises, so households must pay more tax'],
      'Lower income tax means people keep more of their pay. With higher disposable income, households can spend more, which also helps firms\' sales.'),
    mc('surplus-uses', 'Lunaria uses its fiscal surplus to train more nurses. Which group is most likely to benefit directly?',
      'Patients, who wait less time for treatment', ['Exporters, whose goods become cheaper abroad', 'Lenders, who receive more interest from the government', 'Importers, who pay lower tariffs on goods'],
      'Spending the surplus on a public service such as healthcare increases what that service can provide, so patients benefit from shorter waits and better care.'),
    mc('evaluate', 'A newspaper says: "A fiscal surplus is always good for a country." Which is the strongest counter-argument?',
      'Taxes may be too high or public services underfunded to create it', ['A surplus always causes the total national debt to rise every single year', 'A surplus means the government must borrow more', 'A surplus means exports must have fallen'],
      'A surplus comes from taking in more than is spent. If that is because taxes are high or schools and hospitals are short of money, households may be worse off.'),
    mc('evaluate', 'A politician says: "A fiscal deficit is always bad." Which is the strongest counter-argument?',
      'In a recession, deficit spending can support demand and jobs', ['A deficit always reduces the size of the national debt over time', 'A deficit means revenue is higher than spending', 'A deficit stops the government from paying interest'],
      'When private spending falls, government spending financed by borrowing can keep people in work. The cost is more debt, so it depends on how long the deficit lasts and what the money is spent on.'),
    mc('evaluate', 'A deficit is least likely to cause problems when the borrowed money is spent on',
      'infrastructure that raises the economy\'s future output', ['interest payments on old debt', 'one-off events with no lasting benefit', 'replacing tax revenue lost through tax evasion'],
      'If borrowing pays for roads, ports or broadband that raise future output and tax revenue, the debt is easier to repay later.'),
    mc('identify-position', 'Which event is most likely to turn a government\'s fiscal surplus into a deficit?',
      'A recession that cuts tax revenue and raises benefit spending', ['A rise in exports of manufactured goods to neighbouring countries', 'A fall in the value of imports', 'An increase in income tax rates'],
      'In a recession incomes and spending fall, so income tax and VAT revenue fall, while more people claim benefits. Spending rises as revenue falls. Exports and imports affect the current account instead.'),
    mc('identify-position', 'Where does most government revenue come from?',
      'Taxes, both direct (such as income tax) and indirect (such as VAT)', ['Loans from other governments and from large international banks abroad', 'Profits from the country\'s exports of goods', 'The sale of government bonds to households'],
      'Government revenue is mainly tax receipts. Borrowing (including selling bonds) is how a deficit is financed; it is not revenue.'),
    mc('identify-position', 'A government cuts income tax rates but keeps its spending the same. If nothing else changes, what happens to its fiscal position?',
      'Revenue falls, so a surplus shrinks or a deficit grows', ['Revenue rises because people work harder, so a deficit shrinks', 'Spending falls, so a surplus grows', 'The current account moves into deficit'],
      'Lower tax rates mean less revenue. With spending unchanged, the gap between revenue and spending moves towards deficit.'),
    { skill: 'identify-position', gen: function () {
      var c = pick(COUNTRIES), rev = rint(80, 400), d = rint(4, 30) * pick([1, -1]), sp = rev - d;
      var sur = d > 0;
      return Q('In ' + pick(YEARS) + ', the government of ' + c + ' received $' + rev + 'bn and spent $' + sp + 'bn. Which statement is correct?',
        sur ? 'It has a fiscal surplus, so it could repay some debt' : 'It has a fiscal deficit, so it must borrow the difference',
        [sur ? 'It has a fiscal deficit, so it must borrow the difference' : 'It has a fiscal surplus, so it could repay some debt',
          'It has a current account ' + (sur ? 'surplus' : 'deficit') + ', so imports must change',
          sur ? 'It has a fiscal surplus, so it must borrow the difference' : 'It has a fiscal deficit, so it could repay some debt'],
        'Revenue $' + rev + 'bn − spending $' + sp + 'bn = ' + (d > 0 ? '+' : '−') + '$' + Math.abs(d) + 'bn. ' + (sur ? 'Revenue is higher, so there is a surplus that could be used to repay debt.' : 'Spending is higher, so there is a deficit that has to be borrowed.'));
    } },
    { skill: 'identify-position', gen: function () {
      var c = pick(COUNTRIES), r = rint(260, 400), d = rint(10, 60) * pick([1, -1]), s = r - d, sur = d > 0, g = (Math.abs(d) / 10).toFixed(1);
      return Q('In ' + c + ', government revenue was ' + (r / 10).toFixed(1) + '% of GDP and government spending was ' + (s / 10).toFixed(1) + '% of GDP. Which statement is correct?',
        'There is a fiscal ' + (sur ? 'surplus' : 'deficit') + ' of ' + g + '% of GDP', ['There is a fiscal ' + (sur ? 'deficit' : 'surplus') + ' of ' + g + '% of GDP', 'There is a current account ' + (sur ? 'surplus' : 'deficit') + ' of ' + g + '% of GDP', 'There is a fiscal ' + (sur ? 'surplus' : 'deficit') + ' of ' + ((r + s) / 10).toFixed(1) + '% of GDP'],
        (r / 10).toFixed(1) + ' − ' + (s / 10).toFixed(1) + ' = ' + (sur ? '' : '−') + g + '% of GDP. ' + (sur ? 'Revenue is larger, so it is a fiscal surplus.' : 'Spending is larger, so it is a fiscal deficit.') + ' It is a fiscal (budget) measure, not the current account.');
    } },
    mc('evaluate', 'Marenland has a fiscal surplus of 4% of GDP and a small national debt. Which use of the surplus is most likely to raise long-run economic growth?',
      'Spending it on education and training to raise productivity', ['Keeping it unspent with no plan for its use', 'Using it to pay higher salaries to senior government ministers', 'Using it to buy back bonds that pay almost no interest'],
      'Training raises the skills and productivity of the workforce, which increases future output. With little debt, repaying it brings only small interest savings.')
  ] };

  // =====================================================================
  // ECO-T21-12 Effects of unemployment on the economy, government and confidence
  // =====================================================================
  B['ECO-T21-12'] = { title: 'Effects of unemployment on the economy, government and confidence', items: [
    mc('tax-revenue', 'Unemployment rises sharply in Kestria. What is the most likely effect on income tax revenue?',
      'It falls, because fewer people earn incomes that are taxed', ['It rises, because the unemployed pay a higher rate of income tax', 'It rises, because benefits are taxed more heavily', 'It is unchanged, because tax rates have not changed'],
      'Income tax is a direct tax on earnings. When people lose their jobs they stop earning, so fewer people pay income tax and revenue falls.'),
    mc('tax-revenue', 'Why does indirect tax revenue, such as VAT, usually fall when unemployment rises?',
      'Unemployed people have lower incomes and spend less on taxed goods', ['VAT is charged only on the wages of employed workers', 'Firms are allowed to stop charging VAT on goods whenever unemployment rises', 'The government cuts the VAT rate whenever jobs are lost'],
      'VAT is a tax on spending. People who lose their jobs have less income, so they buy less, and the government collects less VAT.'),
    mu('tax-revenue', 'Unemployment in Osmara rises from 5% to 9%. Which effects on government finances are likely?',
      ['Income tax revenue falls', 'VAT revenue falls', 'Spending on unemployment benefits rises'],
      ['Spending on unemployment benefits falls', 'VAT revenue rises as people shop for cheaper goods'],
      'Fewer workers means less income tax; lower incomes mean less spending and less VAT; and more people claim benefits. All three worsen the government\'s budget.'),
    mc('falling-unemployment', 'Unemployment in Sundara falls from 7% to 4%. What is the most likely effect on tax revenue?',
      'Both income tax and VAT revenue rise', ['Income tax revenue rises but VAT revenue falls', 'Both income tax and VAT revenue fall', 'Tax revenue falls because benefits are cut'],
      'More people in work means more income tax collected. Those workers have more to spend, so spending on taxed goods rises and VAT revenue rises too.'),
    mc('falling-unemployment', 'Falling unemployment means the government pays out less in unemployment benefits. Which is the most likely next link?',
      'More money is available for public services or to reduce borrowing', ['Income tax rates must be increased', 'The national debt must rise to pay for the fall in benefit spending', 'Fewer people are available to pay VAT'],
      'Lower benefit spending, together with higher tax revenue, improves the government\'s budget. It can spend more on schools or hospitals, or borrow less.'),
    mc('benefit-spending', 'Why does government spending on benefits rise when unemployment rises?',
      'More people without work claim unemployment benefits', ['Employed workers receive larger pay rises', 'Firms pay higher taxes that fund the benefits', 'The prices of goods and services fall'],
      'Unemployment benefits are welfare payments to people without work. More unemployed people means more claimants, so the government\'s benefit bill rises.'),
    mc('benefit-spending', 'Unemployment benefit spending in Valdoria rises by $3bn. What is the opportunity cost for the government?',
      'Less money for other spending such as schools, or more borrowing', ['Lower interest payments on the national debt', 'Higher tax revenue from income tax', 'More money available for building new hospitals and new schools in every region'],
      'The government has limited funds. Extra spending on benefits means something else is given up, such as spending on education, or it has to borrow more.'),
    mc('output-resources', 'Why does high unemployment mean an economy produces less than it could?',
      'Unemployed workers are a scarce resource that is not being used', ['Unemployed workers produce goods of lower quality', 'Unemployment always raises the productivity of the workers who are employed', 'Firms must pay unemployed workers to stay at home'],
      'Labour is a factor of production. Unemployed people want to work but produce nothing, so output (GDP) is lower than it would be if they were employed.'),
    mc('output-resources', 'On a production possibility curve (PPC) diagram, how is an economy with high unemployment shown?',
      'At a point inside the PPC', ['At a point on the PPC', 'At a point outside the PPC', 'By shifting the PPC outwards'],
      'A point on the PPC means all resources are fully used. With unemployed workers the economy is producing less than it could, so it is inside the curve.'),
    mc('confidence', 'Unemployment is rising in Pellucia. What is the most likely effect on consumer confidence?',
      'It falls, so households save more and spend less', ['It rises, so households borrow and spend more', 'It falls, so households spend more before prices rise', 'It is unaffected because only firms are affected'],
      'People who fear losing their jobs feel less confident about future income. They cut spending and save more, just in case.'),
    mc('confidence', 'Why might rising unemployment lower business confidence?',
      'Firms expect fewer sales, so they delay investment in new equipment', ['Firms expect higher sales, so they invest more in new machinery and buildings', 'Firms can hire workers more cheaply, so they stop all investment', 'Firms pay less tax, so they cut prices'],
      'Fewer people in work means less income and spending in the economy. Firms expect lower sales and are less willing to invest in machinery or new premises.'),
    mc('confidence', 'Rising unemployment makes households cut their spending. What is the most likely next link?',
      'Firms\' sales fall, so they may cut even more jobs', ['Firms\' sales rise, so they hire more workers', 'Prices rise, so firms\' profits increase', 'Government tax revenue from VAT rises'],
      'Less consumer spending means lower revenue for firms. Some respond by cutting staff, which raises unemployment further: a downward spiral.'),
    mc('confidence', 'Unemployment in Eastmoor is falling steadily. Which chain is most likely?',
      'Confidence rises, so households spend more and firms invest more', ['Confidence falls, so households spend less and firms invest less', 'Confidence rises, so households save all their extra income', 'Confidence falls, so firms hire even more workers'],
      'When jobs feel secure, households are happier to spend, and firms that expect more sales are more willing to invest. This can support further growth.'),
    mc('poverty-society', 'Why can long-term unemployment increase poverty?',
      'Incomes fall to benefit levels, which may not cover basic needs', ['Unemployed people pay more income tax than workers', 'Prices of basic goods such as food always fall when unemployment is high', 'The government stops paying all welfare benefits'],
      'Without a wage, people rely on savings and benefits. Over a long period savings run out and benefits may not cover rent, food and heating, so poverty rises.'),
    mu('poverty-society', 'Which of the following are possible effects of long-term unemployment on society?',
      ['Higher stress and poorer mental health', 'Workers losing skills, making it harder to find work', 'More households living in poverty'],
      ['Higher income tax revenue for the government', 'Shorter waiting lists at hospitals'],
      'Long spells without work cause stress, poverty and the loss of skills. Tax revenue falls rather than rises, and health problems tend to add pressure on health services.'),
    mc('poverty-society', 'A large factory closes in one region of Corvenia, and many local workers become unemployed. What is the most likely effect on local shops?',
      'Their sales fall because local incomes and spending fall', ['Their sales rise because people have more free time', 'Their costs rise because wages go up in the region', 'They benefit because the factory\'s workers move away'],
      'The former factory workers have less to spend, so local shops and cafés lose customers. Some may also close, spreading unemployment in the region.'),
    mc('evaluate-firms', 'Which group may <b>gain</b> from a rise in unemployment?',
      'Firms that are recruiting, as more people apply for each job', ['The government, as its tax revenue from income tax and VAT rises', 'Workers, as wages tend to rise faster', 'Local shops, as consumers spend more'],
      'With more people looking for work, firms find it easier to fill jobs and face less pressure to raise pay. This is a possible upside for employers, not for workers or the government.'),
    mc('evaluate-firms', 'Why might rising unemployment reduce pressure for pay rises?',
      'Workers fear losing their jobs and can be replaced more easily', ['Firms have more sales, so they can afford to offer higher pay to staff', 'Trade unions gain more members when jobs are scarce', 'The government raises the minimum wage at once'],
      'When many people want work, workers are in a weaker position to ask for higher pay, so wage growth tends to slow.'),
    mc('evaluate-firms', 'The damage caused by unemployment is likely to be smallest when it is',
      'short-term, such as people briefly between jobs', ['long-term, lasting more than two years', 'concentrated in one region where firms are closing', 'rising quickly during a deep recession'],
      'Frictional unemployment, when people are moving between jobs, usually lasts a short time. Long-term or cyclical unemployment does far more harm to incomes, skills and tax revenue.'),
    mc('evaluate-firms', 'A minister says: "Higher unemployment will help firms by keeping wages low." Which is the strongest counter-argument?',
      'Lower incomes reduce spending, so firms\' sales may fall by more', ['Firms always prefer to pay higher wages to all of their staff members', 'Higher unemployment raises the wages firms must pay', 'Unemployment has no effect on what households buy'],
      'Cheaper labour cuts costs, but unemployed people spend less. If firms\' revenue falls by more than their wage savings, they are worse off overall.'),
    { skill: 'tax-revenue', gen: function () {
      var c = pick(COUNTRIES), a = rint(30, 70) / 10, b = rint(80, 140) / 10, up = Math.random() < 0.5;
      var from = up ? a : b, to = up ? b : a;
      var R1 = 'Income tax and VAT revenue fall, while benefit spending rises', R2 = 'Income tax and VAT revenue rise, while benefit spending falls';
      return Q('Between 2023 and 2025 the unemployment rate in ' + c + ' ' + (up ? 'rose' : 'fell') + ' from ' + from.toFixed(1) + '% to ' + to.toFixed(1) + '%. What is the most likely effect on the government\'s finances?',
        up ? R1 : R2, [up ? R2 : R1, 'Income tax revenue ' + (up ? 'falls' : 'rises') + ', but VAT revenue and benefit spending do not change', 'Benefit spending ' + (up ? 'falls' : 'rises') + ' because ' + (up ? 'fewer' : 'more') + ' people pay income tax'],
        up ? 'With more people out of work, fewer pay income tax, spending falls so less VAT is collected, and more people claim benefits.' : 'With more people in work, more pay income tax, they spend more so more VAT is collected, and fewer people need benefits.');
    } },
    { skill: 'output-resources', gen: function () {
      var c = pick(COUNTRIES), lf = rint(4, 12), rate = rint(6, 15), un = R.roundDp(lf * rate / 100, 2);
      return Q(c + ' has a labour force of ' + lf + ' million people, and its unemployment rate is ' + rate + '%. Which statement best describes the effect on the economy?',
        'About ' + un.toFixed(2) + ' million people who want work produce nothing, so GDP is below its potential', ['About ' + un.toFixed(2) + ' million unemployed people produce extra goods at home, so GDP is above its potential', 'Unemployment has no effect on GDP because the unemployed receive benefits', 'About ' + lf + ' million people are wasted resources, so GDP is zero'],
        rate + '% of ' + lf + ' million = ' + un.toFixed(2) + ' million unemployed. Their labour is a scarce resource that is not used, so the economy produces less than it could.');
    } }
  ] };

  // =====================================================================
  // ECO-T12-23 Minimum wage: reasons, benefits and costs
  // =====================================================================
  B['ECO-T12-23'] = { title: 'Minimum wage: reasons, benefits and costs', items: [
    mc('definition', 'What is meant by a minimum wage?',
      'The lowest wage an employer is legally allowed to pay a worker', ['The average wage paid to workers in an industry', 'The highest wage an employer is legally allowed to pay any worker', 'The wage at which the labour market is in equilibrium'],
      'A minimum wage is a legal floor: employers cannot pay less than it, per hour or per month. It is not the average or the equilibrium wage.'),
    mc('definition', 'A national minimum wage is an example of',
      'government intervention in the labour market', ['a market force that sets the price of labour freely', 'a trade barrier on imported goods', 'monetary policy by the central bank'],
      'The government sets the wage floor by law instead of leaving pay entirely to the forces of demand and supply, so it is government intervention.'),
    mu('reasons', 'Which of the following are reasons why a government introduces a minimum wage?',
      ['To raise the incomes of the lowest-paid workers', 'To reduce the gap between rich and poor', 'To reduce the need for in-work welfare benefits'],
      ['To raise firms\' profits by cutting their wage costs', 'To lower the prices of goods made by low-paid workers'],
      'A minimum wage aims to lift low pay, narrow income inequality and reduce reliance on benefits. It raises firms\' wage costs, so it is not designed to raise profits or cut prices.'),
    mc('reasons', 'Why might the government of Tarvonia raise its minimum wage every year?',
      'So low-paid workers can still afford basic goods as prices rise', ['So firms can lower their wage costs every year', 'So the equilibrium wage in the labour market falls below the minimum', 'So fewer people choose to look for work'],
      'Prices usually rise each year. Raising the minimum wage protects the living standards of the lowest-paid, who would otherwise be able to afford less.'),
    mc('benefits', 'The minimum wage rises. Which chain shows a benefit for low-paid workers?',
      'Higher hourly pay → more disposable income → better living standards', ['Lower hourly pay → less disposable income → more saving', 'Higher hourly pay → higher income tax rates → lower living standards', 'Higher prices → lower spending → more jobs for low-paid workers'],
      'Workers on the minimum wage earn more for each hour, so they have more income to spend on food, housing and other needs.'),
    mc('benefits', 'How might a higher minimum wage benefit local shops and cafés?',
      'Low-paid workers have more to spend, raising the shops\' revenue', ['Their own wage costs fall, so their profits rise by the same amount', 'Fewer customers visit, so queues are shorter', 'They can pay their workers less than before'],
      'Low-paid workers usually spend most of any extra income. That extra spending goes partly to local businesses, raising their sales.'),
    mc('benefits', 'Why might a firm\'s productivity rise after a minimum wage increase?',
      'Better-paid workers may be more motivated and stay longer', ['Workers take longer breaks because they are paid more', 'The firm must hire more workers than it needs', 'Machines become cheaper for the firm to buy whenever wages rise'],
      'Higher pay can raise motivation and reduce staff turnover, so the firm spends less on recruiting and training and gets more output per worker.'),
    mc('benefits', 'How could a minimum wage rise help the government\'s budget?',
      'It may collect more income tax and pay out fewer in-work benefits', ['It must pay every worker\'s wage increase itself', 'It collects less tax because firms make more profit and pay less in wages', 'It pays more benefits to every employed worker'],
      'Higher wages raise taxable income, and workers who earn more need less support from welfare payments. Both improve the budget, unless many jobs are lost.'),
    mc('costs', 'A higher minimum wage raises a restaurant\'s wage bill. Which is the most likely response?',
      'Raise menu prices, cut staff hours or accept lower profit', ['Cut menu prices and hire more staff to serve the extra customers', 'Pay workers below the new minimum wage', 'Ask the government to pay the extra wages'],
      'Higher wage costs must be covered somehow: by charging customers more, using less labour, or taking a smaller profit.'),
    mc('costs', 'Why might some low-paid workers be worse off after a minimum wage increase?',
      'They may lose their job or have their hours cut', ['Their hourly wage will fall below the old minimum', 'They will have to pay their employer\'s extra costs', 'The government will stop paying them any benefits'],
      'Firms facing higher labour costs may employ fewer workers or offer fewer hours. Those workers earn more per hour but may earn less in total.'),
    mc('costs', 'If a minimum wage is set above the equilibrium wage, what happens in the labour market?',
      'Labour demanded falls and labour supplied rises, creating a surplus of workers', ['Labour demanded rises and labour supplied falls, creating a shortage of workers', 'Both labour demanded and labour supplied rise by the same amount', 'Nothing happens, because the minimum is above equilibrium'],
      'At the higher wage, firms want to hire fewer workers while more people want to work. The difference is a surplus of labour, which is unemployment.'),
    mc('costs', 'A minimum wage is set below the current equilibrium wage. What is the effect?',
      'Little or no effect, because firms already pay more than the minimum', ['Unemployment rises sharply because firms\' demand for labour falls a lot', 'Wages fall to the level of the minimum wage', 'Firms must hire more workers than they need'],
      'A minimum wage only bites when it is higher than what the market already pays. Below equilibrium, wages and employment stay where they were.'),
    mc('costs', 'How might consumers be affected by a large rise in the minimum wage?',
      'They may pay more for goods and services made with low-paid labour', ['They pay lower prices for most goods and services because firms\' wage costs fall', 'They can only buy from firms that pay above the minimum', 'They receive the extra wages as a tax refund'],
      'Firms may pass higher wage costs on to customers. Goods and services that use a lot of low-paid labour, such as cleaning or restaurant meals, are most affected.'),
    mc('stakeholders', 'Which type of business is likely to be most affected by a rise in the minimum wage?',
      'A labour-intensive café where most staff are paid the minimum', ['A software firm whose staff are paid well above the minimum', 'A highly automated factory employing few workers', 'A bank whose lowest-paid staff earn double the minimum'],
      'A firm whose wage bill is a large share of its costs, and whose staff earn the minimum, faces the biggest rise in costs.'),
    mc('stakeholders', 'Why might small firms find a minimum wage rise harder to cope with than large firms?',
      'They often have smaller profits to absorb the higher wage costs', ['They always pay their workers far more per hour than large firms do', 'They are not allowed to raise their prices', 'They do not have to follow the minimum wage law'],
      'Small firms may have thin profit margins and less money in reserve. A rise in costs can push them to cut jobs or even close.'),
    mc('evaluate', 'A minimum wage rise is <b>least</b> likely to cause job losses when',
      'workers\' productivity rises by a similar amount to their pay', ['the new minimum is far above the equilibrium wage', 'firms\' customers switch easily to cheaper rivals', 'labour costs are most of firms\' total costs'],
      'If workers produce more for each hour, the cost of each unit of output need not rise much, so firms have less reason to cut staff.'),
    mc('evaluate', 'A firm\'s customers will keep buying even if it raises its prices (demand is price inelastic). How does this affect the impact of a minimum wage rise?',
      'The firm can pass on the higher costs, so it is less likely to cut jobs', ['The firm cannot raise its prices at all, so it must cut many jobs instead', 'The firm\'s wage costs will fall, so it hires more workers', 'The firm will no longer need to pay the minimum wage'],
      'With inelastic demand, a price rise causes only a small fall in sales. The firm can cover the extra wage costs through prices instead of cutting staff, though customers pay more.'),
    mc('evaluate', 'A government claims: "Raising the minimum wage helps every worker." Which is the strongest counter-argument?',
      'Some may lose jobs or hours; those paid above it gain nothing directly', ['Every worker already earns exactly the minimum wage', 'The minimum wage only applies to government employees', 'A higher minimum wage always reduces the prices that all workers pay for goods'],
      'Workers who keep their jobs gain, but some may lose work as firms cut costs, and workers already paid more than the minimum see no direct rise.'),
    mu('evaluate', 'The effect of a minimum wage rise on unemployment is likely to depend on which of the following?',
      ['How far above the equilibrium wage the new minimum is', 'Whether workers\' productivity rises', 'Whether firms can raise prices without losing many sales'],
      ['Whether the country has a fiscal surplus', 'Whether the minimum wage is paid in cash or into a bank account'],
      'A large rise far above equilibrium, with no rise in productivity and customers who switch easily, is most likely to cost jobs. The budget position and method of payment do not decide this.'),
    { skill: 'figures', gen: function () {
      var c = pick(CURS), oldC = rint(350, 1000), pct = rint(30, 150) / 10, newC = Math.round(oldC * (1 + pct / 100));
      var ans = Math.floor((2000 * (newC - oldC) + oldC) / (2 * oldC)) / 10;   // exact half-up to 1 dp
      return N('The minimum wage in ' + pick(COUNTRIES) + ' rose from ' + c.s + (oldC / 100).toFixed(2) + ' to ' + c.s + (newC / 100).toFixed(2) + ' per hour. Calculate the percentage increase. Give your answer to 1 decimal place.',
        ans, '%', 'Percentage change = (new − old) ÷ old × 100 = (' + (newC / 100).toFixed(2) + ' − ' + (oldC / 100).toFixed(2) + ') ÷ ' + (oldC / 100).toFixed(2) + ' × 100 = ' + ans.toFixed(1) + '%.', 0.05, ans.toFixed(1));
    } },
    { skill: 'figures', gen: function () {
      var c = pick(CURS), oldC = rint(400, 1200), pct = pick([2, 4, 5, 6, 8, 10, 12, 15]);
      var newV = R.roundDp(oldC * (100 + pct) / 10000, 2);
      return N('A government announces that its hourly minimum wage of ' + c.s + (oldC / 100).toFixed(2) + ' will rise by ' + pct + '%. Calculate the new hourly minimum wage in ' + c.name + '. Give your answer to 2 decimal places.',
        newV, c.s, 'New wage = old × (1 + ' + pct + '/100) = ' + (oldC / 100).toFixed(2) + ' × ' + (1 + pct / 100).toFixed(2) + ' = ' + c.s + newV.toFixed(2) + ' (to 2 decimal places).', 0.005, newV.toFixed(2));
    } },
    { skill: 'figures', gen: function () {
      var c = pick(CURS), staff = rint(6, 30), hrs = rint(20, 40), riseC = rint(15, 90), extra = R.roundDp(staff * hrs * riseC / 100, 2);
      return N('A hotel employs ' + staff + ' workers on the minimum wage, each working ' + hrs + ' hours a week. The minimum wage rises by ' + c.s + (riseC / 100).toFixed(2) + ' per hour. Calculate the increase in the hotel\'s weekly wage bill in ' + c.name + '.',
        extra, c.s, 'Extra cost = workers × hours × rise per hour = ' + staff + ' × ' + hrs + ' × ' + (riseC / 100).toFixed(2) + ' = ' + c.s + num(extra, 2) + ' a week. This is the cost the hotel must cover by raising prices, cutting hours or accepting lower profit.', 0.005, num(extra, 2));
    } }
  ] };

  // =====================================================================
  // ECO-CALC-12 Wage income from an hourly rate
  // =====================================================================
  function rate(lo, hi) { return rint(lo, hi) / 100; }   // hourly rate in currency units, 2 dp
  B['ECO-CALC-12'] = { title: 'Wage income from an hourly rate', items: [
    { skill: 'weekly', gen: function () {
      var c = pick(CURS), r = rate(450, 1280), h = rint(20, 40), a = R.roundDp(r * h, 2);
      return N(pick(WORKERS) + ' is paid the minimum wage of ' + c.s + r.toFixed(2) + ' per hour and works ' + h + ' hours a week. Calculate the weekly gross income in ' + c.name + '.',
        a, c.s, 'Gross income = hourly wage × hours = ' + r.toFixed(2) + ' × ' + h + ' = ' + c.s + num(a, 2) + ' (before tax).', 0.005, num(a, 2));
    } },
    { skill: 'monthly-annual', gen: function () {
      var c = pick(CURS), r = rate(380, 1150), h = rint(150, 180), a = R.roundDp(r * h, 2);
      return N('A worker in ' + pick(COUNTRIES) + ' is employed for ' + h + ' hours per month at the minimum wage of ' + c.s + r.toFixed(2) + ' per hour. Calculate the monthly gross income in ' + c.name + '.',
        a, c.s, 'Monthly gross income = ' + r.toFixed(2) + ' × ' + h + ' = ' + c.s + num(a, 2) + '.', 0.005, num(a, 2));
    } },
    { skill: 'multi-part', gen: function () {
      var c = pick(CURS), r = rate(500, 1100), hd = rint(5, 9), d = rint(3, 6), a = R.roundDp(r * hd * d, 2);
      return N(pick(WORKERS) + ' works ' + hd + ' hours a day for ' + d + ' days a week, paid ' + c.s + r.toFixed(2) + ' per hour. Calculate the weekly gross income in ' + c.name + '.',
        a, c.s, 'Hours per week = ' + hd + ' × ' + d + ' = ' + hd * d + '. Gross income = ' + r.toFixed(2) + ' × ' + hd * d + ' = ' + c.s + num(a, 2) + '.', 0.005, num(a, 2));
    } },
    { skill: 'multi-part', gen: function () {
      var c = pick(CURS), r1 = rate(600, 1000), r2 = R.roundDp(r1 + rint(100, 300) / 100, 2), h1 = rint(20, 32), h2 = rint(4, 10);
      var a = R.roundDp(r1 * h1 + r2 * h2, 2);
      return N('A warehouse worker is paid ' + c.s + r1.toFixed(2) + ' per hour on weekdays and ' + c.s + r2.toFixed(2) + ' per hour at weekends. One week she works ' + h1 + ' weekday hours and ' + h2 + ' weekend hours. Calculate her gross pay for the week in ' + c.name + '.',
        a, c.s, 'Weekday pay = ' + r1.toFixed(2) + ' × ' + h1 + ' = ' + num(r1 * h1, 2) + '. Weekend pay = ' + r2.toFixed(2) + ' × ' + h2 + ' = ' + num(r2 * h2, 2) + '. Total = ' + c.s + num(a, 2) + '.', 0.005, num(a, 2));
    } },
    { skill: 'monthly-annual', gen: function () {
      var c = pick(CURS), r = rate(700, 1250), h = rint(30, 40), a = R.roundDp(r * h * 52, 2);
      return N('A full-time worker earns the minimum wage of ' + c.s + r.toFixed(2) + ' per hour for ' + h + ' hours a week, 52 weeks a year. Calculate the annual gross income in ' + c.name + '.',
        a, c.s, 'Annual gross income = ' + r.toFixed(2) + ' × ' + h + ' × 52 = ' + c.s + num(a, 2) + '.', 0.005, num(a, 2));
    } },
    { skill: 'multi-part', gen: function () {
      var c = pick(CURS), r = rate(550, 1200), h1 = rint(30, 40), h2 = rint(12, 25), a = R.roundDp(r * (h1 + h2), 2), w = shuf(WORKERS);
      return N(w[0] + ' and ' + w[1] + ' live together and are both paid the minimum wage of ' + c.s + r.toFixed(2) + ' per hour. ' + w[0] + ' works ' + h1 + ' hours a week and ' + w[1] + ' works ' + h2 + ' hours. Calculate their combined weekly gross income in ' + c.name + '.',
        a, c.s, 'Total hours = ' + h1 + ' + ' + h2 + ' = ' + (h1 + h2) + '. Combined gross income = ' + r.toFixed(2) + ' × ' + (h1 + h2) + ' = ' + c.s + num(a, 2) + '.', 0.005, num(a, 2));
    } },
    { skill: 'multi-part', gen: function () {
      var c = pick(CURS), r0 = rate(500, 1000), up = rint(20, 80) / 100, r1 = R.roundDp(r0 + up, 2), h = rint(25, 40), a = R.roundDp(up * h, 2);
      return N('The minimum wage rises from ' + c.s + r0.toFixed(2) + ' to ' + c.s + r1.toFixed(2) + ' per hour. A worker on the minimum wage works ' + h + ' hours a week. By how much does the weekly gross income rise, in ' + c.name + '?',
        a, c.s, 'Rise per hour = ' + r1.toFixed(2) + ' − ' + r0.toFixed(2) + ' = ' + up.toFixed(2) + '. Weekly rise = ' + up.toFixed(2) + ' × ' + h + ' = ' + c.s + num(a, 2) + '. (Or: ' + r1.toFixed(2) + ' × ' + h + ' − ' + r0.toFixed(2) + ' × ' + h + '.)', 0.005, num(a, 2));
    } },
    { skill: 'reverse', gen: function () {
      var c = pick(CURS), r = rate(600, 1200), h = rint(16, 40), pay = R.roundDp(r * h, 2);
      var who = pick(WORKERS);
      return N(who + ' is paid ' + c.s + r.toFixed(2) + ' per hour and earned ' + c.s + num(pay, 2) + ' gross last week. How many hours did ' + who + ' work?',
        h, 'hours', 'Gross pay = rate × hours, so hours = pay ÷ rate = ' + num(pay, 2) + ' ÷ ' + r.toFixed(2) + ' = ' + h + ' hours.');
    } },
    { skill: 'reverse', gen: function () {
      var c = pick(CURS), r = rate(500, 1300), h = rint(20, 40), pay = R.roundDp(r * h, 2);
      return N('A part-time worker earns ' + c.s + num(pay, 2) + ' gross for ' + h + ' hours of work. Calculate the hourly wage rate in ' + c.name + '.',
        r, c.s, 'Hourly wage = gross pay ÷ hours = ' + num(pay, 2) + ' ÷ ' + h + ' = ' + c.s + r.toFixed(2) + ' per hour.', 0.005, r.toFixed(2));
    } },
    { skill: 'traps', gen: function () {
      var c = pick(CURS), r = rate(450, 1100), h = rint(25, 40), a = R.roundDp(r * h, 2);
      return Q('In ' + pick(COUNTRIES) + ', the law sets the minimum wage at ' + c.s + r.toFixed(2) + ' per hour. A shop assistant works ' + h + ' hours one week. What is the least the shop can legally pay her, before tax, for that week?',
        c.s + num(a, 2), [c.s + r.toFixed(2), c.s + num(r * (h - 1), 2), c.s + num(r * h * 2, 2)],
        'The minimum wage is the lowest legal hourly rate, so the lowest weekly wage = ' + r.toFixed(2) + ' × ' + h + ' = ' + c.s + num(a, 2) + '. ' + c.s + r.toFixed(2) + ' is only one hour of pay.');
    } },
    { skill: 'traps', gen: function () {
      var c = pick(CURS), r = rate(400, 900), h = rint(150, 175), a = R.roundDp(r * h, 2);
      return Q('A worker is paid ' + c.s + r.toFixed(2) + ' per hour for ' + h + ' hours per month. What is the monthly gross income?',
        c.s + num(a, 2), [c.s + num(a / 10, 2), c.s + num(a * 10, 2), c.s + num(r + h, 2)],
        'Monthly gross income = ' + r.toFixed(2) + ' × ' + h + ' = ' + c.s + num(a, 2) + '. Check the size: about ' + Math.round(r) + ' × ' + h + ' ≈ ' + num(Math.round(r) * h) + ', so the decimal point is in the right place.');
    } },
    { skill: 'weekly', gen: function () {
      var c = pick(CURS), w = shuf(WORKERS).slice(0, 3), rs, hs, pays, top;
      do {
        rs = shuf([rate(700, 900), rate(901, 1100), rate(1101, 1300)]); hs = [rint(22, 40), rint(22, 40), rint(22, 40)];
        pays = rs.map(function (r, i) { return R.roundDp(r * hs[i], 2); });
        top = pays.slice().sort(function (a, b) { return b - a; });
      } while (top[0] - top[1] < 5 || rs[pays.indexOf(top[0])] === Math.max.apply(null, rs) && Math.random() < 0.5);
      var best = pays.indexOf(Math.max.apply(null, pays));
      var rows = w.map(function (n, i) { return [n, c.s + rs[i].toFixed(2), hs[i]]; });
      return Q('The table shows three workers\' hourly pay and weekly hours.<br>' + table(['Worker', 'Pay per hour', 'Hours per week'], rows) + 'Who earns the highest weekly gross income?',
        w[best], w.filter(function (_, i) { return i !== best; }),
        'Weekly pay = rate × hours: ' + w.map(function (n, i) { return n + ' ' + c.s + num(pays[i], 2); }).join(', ') + '. ' + (rs[best] === Math.max.apply(null, rs) ? 'Here the highest hourly rate also gives the highest weekly pay, but always multiply by the hours to check.' : 'The highest hourly rate does not give the highest weekly pay here, because hours matter too.'));
    } },
    { skill: 'weekly', gen: function () {
      var c = pick(CURS), rA = rate(800, 1300), rB = R.roundDp(rA - rint(80, 300) / 100, 2), h = rint(30, 40), d = R.roundDp((rA - rB) * h, 2);
      var cs = shuf(COUNTRIES);
      return N('The hourly minimum wage is ' + c.s + rA.toFixed(2) + ' in ' + cs[0] + ' and ' + c.s + rB.toFixed(2) + ' in ' + cs[1] + '. How much more does a minimum wage worker in ' + cs[0] + ' earn gross for a ' + h + '-hour week, in ' + c.name + '?',
        d, c.s, cs[0] + ': ' + rA.toFixed(2) + ' × ' + h + ' = ' + num(rA * h, 2) + '. ' + cs[1] + ': ' + rB.toFixed(2) + ' × ' + h + ' = ' + num(rB * h, 2) + '. Difference = ' + c.s + num(d, 2) + '.', 0.005, num(d, 2));
    } },
    { skill: 'multi-part', gen: function () {
      var c = pick(CURS), r = rint(250, 600) * 2 / 100, k = rint(3, 6), hs = pick([3.5, 4.5, 5.5, 6.5, 7.5]), a = R.roundDp(r * k * hs, 2);
      return N('A student works ' + k + ' shifts a week in a supermarket. Each shift lasts ' + hs + ' hours and the pay is ' + c.s + r.toFixed(2) + ' per hour. Calculate the weekly gross income in ' + c.name + '.',
        a, c.s, 'Hours = ' + k + ' × ' + hs + ' = ' + (k * hs) + '. Gross income = ' + r.toFixed(2) + ' × ' + (k * hs) + ' = ' + c.s + num(a, 2) + '.', 0.005, num(a, 2));
    } },
    { skill: 'weekly', gen: function () {
      var c = pick(CURS), r = rint(300, 600) * 2 / 100, h = pick([37.5, 35.5, 32.5, 38.5, 22.5]), a = R.roundDp(r * h, 2);
      return N('A care worker\'s contract is for ' + h + ' hours a week at the minimum wage of ' + c.s + r.toFixed(2) + ' per hour. Calculate the weekly gross income in ' + c.name + '.',
        a, c.s, 'Gross income = ' + r.toFixed(2) + ' × ' + h + ' = ' + c.s + num(a, 2) + '. Half hours count: ' + h + ' hours is ' + Math.floor(h) + ' hours and 30 minutes.', 0.005, num(a, 2));
    } },
    { skill: 'monthly-annual', gen: function () {
      var c = pick(CURS), r = rate(600, 1100), h = rint(25, 40), a = R.roundDp(r * h * 4, 2);
      return N('A worker is paid ' + c.s + r.toFixed(2) + ' per hour and works ' + h + ' hours every week. Calculate the gross income for a 4-week period in ' + c.name + '.',
        a, c.s, 'Hours in 4 weeks = ' + h + ' × 4 = ' + h * 4 + '. Gross income = ' + r.toFixed(2) + ' × ' + h * 4 + ' = ' + c.s + num(a, 2) + '.', 0.005, num(a, 2));
    } },
    { skill: 'reverse', gen: function () {
      var c = pick(CURS), r = rate(800, 1200), target = rint(20, 35) * 10;
      while (Math.abs(target / r - Math.round(target / r)) < 0.02) target += 5;
      var h = Math.ceil(target / r);
      return N('The minimum wage is ' + c.s + r.toFixed(2) + ' per hour. What is the smallest whole number of hours a minimum wage worker must work to earn at least ' + c.s + num(target) + ' gross?',
        h, 'hours', target + ' ÷ ' + r.toFixed(2) + ' = ' + (target / r).toFixed(2) + ' hours. Round up to ' + h + ' hours: ' + (h - 1) + ' hours would earn only ' + c.s + num(r * (h - 1), 2) + ', but ' + h + ' hours earn ' + c.s + num(r * h, 2) + '.', 0);
    } },
    mc('method', 'Which calculation gives a worker\'s gross weekly income?',
      'Hourly wage × hours worked in the week', ['Hourly wage ÷ hours worked in the week', 'Hourly wage + hours worked in the week', 'Hours worked ÷ hourly wage'],
      'Each hour earns the hourly wage, so the week\'s pay is the rate multiplied by the number of hours.'),
    mc('method', 'What does "gross" income mean?',
      'Income before tax and other deductions are taken off', ['Income after income tax and other deductions have been taken off', 'Income received from government benefits only', 'Income earned in one hour of work'],
      'Gross income is the full amount earned (rate × hours). Net income is what is left after tax and other deductions.'),
    mc('method', 'A worker earns £9.40 per hour for 30 hours. A student gives the weekly income as £9.40. What is the error?',
      'The student gave the hourly rate instead of multiplying by 30', ['The student should have divided £9.40 by 30', 'The student should have added 30 hours to the £9.40 hourly rate', 'There is no error: weekly pay is the hourly rate'],
      'The hourly rate is pay for one hour only. Weekly pay = 9.40 × 30 = £282.00.'),
    mc('method', 'Why is "minimum wage × hours worked" the <b>lowest</b> weekly gross pay a worker can legally receive?',
      'No employer may pay less than the minimum for any hour worked', ['Every worker must be paid exactly the minimum wage', 'Employers must pay double the minimum for extra hours', 'The minimum wage is the average hourly pay in the country'],
      'The minimum wage is the lowest legal hourly rate. A worker may be paid more, but each hour must earn at least the minimum.'),
    mc('method', 'A worker is paid €7.25 per hour for 40 hours. How should the gross weekly income be written?',
      '€290.00', ['290', '€7.25', '€29.00'],
      '7.25 × 40 = 290, written with the currency and two decimal places: €290.00. Leaving out the € sign can lose a mark.')
  ] };

  // =====================================================================
  // ECO-T22-09 Trading blocs: what they are and their effects
  // =====================================================================
  B['ECO-T22-09'] = { title: 'Trading blocs: what they are and their effects', items: [
    mc('definition', 'What is a trading bloc?',
      'Countries that agree to cut or remove trade barriers between themselves', ['A group of countries that must all use the same currency', 'A group of countries that agree to trade only with each other and nobody else', 'A group of countries that set the same income tax rates'],
      'A trading bloc is about cutting tariffs and quotas among its members. Members can keep their own currencies and taxes and still trade with the rest of the world.'),
    mu('features', 'Which statements about members of a trading bloc are correct?',
      ['They cut or remove tariffs on trade with each other', 'They can still trade with countries outside the bloc', 'They may each keep their own currency'],
      ['They must all share a border with another member', 'They must all charge the same rate of income tax'],
      'The defining feature is lower trade barriers between members. Shared borders, a shared currency and equal tax rates are not required.'),
    mc('features', 'Kestria and Lunaria, which are 3,000 km apart, join the same trading bloc. Which statement is correct?',
      'They can be members even though they do not share a border', ['They cannot be members because they are not neighbouring countries', 'They must now adopt one shared currency', 'They must stop trading with non-member countries'],
      'Trading blocs often include countries in the same region, but there is no rule that members must share a border, a currency or trade only with each other.'),
    mc('examples', 'Which of the following is a trading bloc?',
      'Mercosur', ['The World Trade Organization (WTO)', 'The International Monetary Fund (IMF)', 'The World Bank'],
      'Mercosur is a South American trading bloc. The WTO sets rules for trade between almost all countries, and the IMF and World Bank are international financial institutions.'),
    mu('examples', 'Which of the following are trading blocs?',
      ['ASEAN', 'The African Continental Free Trade Area (AfCFTA)', 'The European Union (EU)'],
      ['The World Trade Organization (WTO)', 'The United Nations (UN)'],
      'ASEAN, AfCFTA and the EU all cut trade barriers between their members. The WTO covers world trade rules for almost all countries, and the UN is not a trade agreement.'),
    mc('benefits', 'Valdoria joins a trading bloc. Its furniture makers can now sell to the other members without tariffs. What is the most likely next link?',
      'Sales rise, so firms produce more and gain economies of scale', ['Sales fall, so firms produce less and their average costs rise', 'Prices rise abroad, so foreign sales fall', 'Firms must now pay a tariff to export'],
      'Without tariffs Valdorian furniture is cheaper in member markets, so sales rise. Producing on a larger scale can cut average costs.'),
    mc('benefits', 'How are consumers in a member country most likely to benefit from joining a trading bloc?',
      'Imports from other members become cheaper and choice increases', ['Imports from members now face higher tariffs, so their prices rise', 'Domestic firms face less competition, so prices rise', 'Consumers must buy only goods made in member countries'],
      'Removing tariffs on goods from other members lowers their prices, and more goods become available, so consumers get lower prices and more choice.'),
    mc('benefits', 'A car maker from outside a trading bloc builds a factory in a member country. Why?',
      'To sell tariff-free to every country in the bloc', ['To pay the bloc\'s tariffs on all its cars', 'To avoid selling to bloc members at all', 'Because bloc members must buy only its cars'],
      'Producing inside the bloc lets the firm sell to all members without tariffs. This is foreign direct investment (FDI), which brings jobs and capital to the host country.'),
    mc('benefits', 'Why might a small country gain from negotiating trade deals as part of a large trading bloc?',
      'The bloc has more bargaining power than the country alone', ['The bloc must accept every term that other countries offer it', 'The country can ignore all rules of the bloc', 'The bloc removes all tariffs worldwide'],
      'A bloc representing a large combined market can win better terms in trade talks than one small country on its own.'),
    mu('benefits', 'Which of the following are likely benefits for a firm when its country joins a trading bloc?',
      ['A larger market to sell into without tariffs', 'Cheaper raw materials imported from other members', 'More chance to gain economies of scale'],
      ['Protection from competition by firms in member countries', 'Higher tariffs on goods it sells to other members'],
      'Membership opens a larger tariff-free market and cheaper inputs, which can raise sales and cut costs. It removes, rather than adds, protection from rival firms in the bloc.'),
    mc('drawbacks', 'After joining a trading bloc, Osmara\'s rice farmers face competition from lower-cost farms in other members. What is the most likely effect?',
      'Some Osmaran farms lose sales and close, causing job losses', ['Osmaran farms gain sales because imported rice becomes more expensive', 'Osmaran rice prices rise because supply falls', 'The government must buy all the rice the farmers grow'],
      'Without tariffs, cheaper rice from other members wins customers. Less efficient domestic farms lose sales, and some may close and cut jobs.'),
    mc('drawbacks', 'A clothing firm moves its factory from Corvenia to another bloc member where wages are lower. What is the main drawback for Corvenia?',
      'Jobs and output move to the cheaper member country', ['Corvenia\'s imports of clothing face higher tariffs', 'Corvenia gains extra factory jobs in clothing', 'The firm must stop selling clothes in Corvenia'],
      'Within a bloc, firms can produce wherever costs are lowest and still sell tariff-free everywhere. Countries with higher costs may lose factories and jobs.'),
    mc('drawbacks', 'How does joining a trading bloc affect a government\'s tariff revenue?',
      'It falls, because tariffs on imports from members are removed', ['It rises, because trade with members increases', 'It rises, because members now pay tariffs to each other on all goods', 'It is unchanged, because tariffs are paid by firms'],
      'Tariffs are a tax on imports. Once tariffs on goods from members are removed, the government no longer collects that revenue.'),
    mc('drawbacks', 'Ardesh sells 80% of its exports to other members of its trading bloc. What is the main risk of this?',
      'A recession in the bloc would sharply cut Ardesh\'s exports', ['Ardesh must pay tariffs on all of its exports to other members', 'Ardesh cannot sell anything to non-members', 'Ardesh\'s exports are guaranteed to grow every year'],
      'Relying heavily on one group of buyers makes a country vulnerable. If demand in the bloc falls, Ardesh\'s exports, output and jobs fall too.'),
    mc('non-members', 'Pellucia is <b>not</b> a member of a trading bloc. Its exporters must pay tariffs to sell in the bloc, but member firms do not. What is the most likely effect?',
      'Pellucian goods become less competitive in the bloc, so their sales fall', ['Pellucian goods become cheaper for buyers in the bloc, so their sales rise', 'Pellucian exporters no longer pay any tariffs to the bloc', 'Member firms must now pay tariffs to sell to Pellucia'],
      'Member firms sell tariff-free while Pellucian goods carry a tariff, so bloc buyers switch to members\' goods and Pellucia loses sales.'),
    mu('non-members', 'Which of the following are possible effects of a trading bloc on non-member countries?',
      ['Their exporters lose sales to firms inside the bloc', 'Their firms may build factories inside the bloc to avoid tariffs'],
      ['They gain tariff-free access to all members', 'They are banned from trading with members', 'They must adopt the bloc\'s currency'],
      'Non-members still face tariffs, so their goods are less competitive inside the bloc. Some of their firms respond by investing inside the bloc. They can still trade with members.'),
    mc('stakeholders', 'Which firm in a new member country is most likely to gain from joining a trading bloc?',
      'An efficient exporter that already sells to other member countries', ['A high-cost producer that sells only to its home market', 'A firm that relies on tariffs to keep out rivals', 'A firm that sells only to countries outside the bloc'],
      'An efficient exporter to member countries no longer pays tariffs, so it can cut prices or raise profit and sell more. High-cost firms that relied on protection face new competition.'),
    mc('evaluate', 'The benefits of joining a trading bloc are likely to be greatest when the country\'s firms',
      'are efficient and can compete with firms in other members', ['have much higher costs than firms in other members', 'sell only in their own domestic market', 'depend on tariffs to protect them from imports'],
      'Competitive firms can use the tariff-free market to grow. If a country\'s firms are high-cost, they are more likely to lose sales to rivals in the bloc.'),
    mc('evaluate', 'A minister says: "Joining the bloc will raise the profits of all our firms." Which is the strongest counter-argument?',
      'Firms facing cheaper rivals from other members may lose sales and profits', ['No firm can ever export to members of a trading bloc', 'Tariffs on trade between members will rise sharply after the country joins', 'Joining means the country must stop all exports'],
      'Exporters may gain, but firms competing with cheaper imports from other members may lose sales, profits and jobs. The effect differs from firm to firm.'),
    mc('evaluate', 'Eastmoor already trades mostly with countries outside a nearby trading bloc. How does this affect the benefit of joining?',
      'The gain is likely to be smaller, as little of its trade is with members', ['The gain is likely to be larger, because it trades very little with members', 'It must stop its trade with countries outside the bloc', 'It will gain tariff-free access to every country in the world'],
      'Tariff cuts only apply to trade with members. If most of Eastmoor\'s trade is with other countries, joining changes less.'),
    mc('definition', 'Which of the following would make two countries a trading bloc?',
      'They sign an agreement to remove tariffs on goods traded between them', ['They both join the United Nations', 'They both use the US dollar to pay for some of their trade with others', 'They both have high rates of economic growth'],
      'The key feature of a trading bloc is an agreement that cuts trade barriers among the members. Using the same currency or joining the UN is not enough.'),
    { skill: 'benefits', gen: function () {
      var cs = shuf(COUNTRIES), good = pick(['coffee', 'steel pipes', 'textiles', 'fresh fruit', 'electric bikes', 'ceramic tiles']), tar = rint(8, 25);
      return Q(cs[0] + ' sells ' + good + ' to ' + cs[1] + ', which charged ' + ([8, 11, 18].indexOf(tar) >= 0 ? 'an ' : 'a ') + tar + '% tariff on these imports. Both countries then join the same trading bloc. What is the most likely effect on ' + cs[0] + '\'s exporters of ' + good + '?',
        'The tariff is removed, so their goods are cheaper in ' + cs[1] + ' and sales rise', ['The tariff rises above ' + tar + '%, so their sales in ' + cs[1] + ' fall', 'The tariff stays at ' + tar + '%, but they must now use ' + cs[1] + '\'s currency', 'They may now sell ' + good + ' only to ' + cs[1] + ' and no one else'],
        'Members remove tariffs on trade with each other, so the ' + tar + '% tariff goes. These exports become cheaper for buyers in ' + cs[1] + ', so sales are likely to rise.');
    } },
    { skill: 'drawbacks', gen: function () {
      var cs = shuf(COUNTRIES), gm = pick([['shoes', 'shoe makers'], ['sugar', 'sugar producers'], ['furniture', 'furniture makers'], ['dairy products', 'dairy farmers'], ['cement', 'cement makers']]), good = gm[0], maker = gm[1], m = rint(5, 20);
      return Q('A trading bloc with ' + m + ' member countries removes all tariffs between members. ' + cs[0] + ' joins. Its ' + maker + ' have higher costs than producers in ' + cs[1] + ', another member. What is the most likely effect on ' + cs[0] + '\'s ' + maker + '?',
        'They lose sales to cheaper imports from ' + cs[1] + ', so some jobs may be lost', ['They gain sales because imports from ' + cs[1] + ' now face tariffs', 'They are unaffected because tariffs only apply to non-members', 'Their costs fall to the level of producers in ' + cs[1]],
        'Without tariffs, cheaper ' + good + ' from ' + cs[1] + ' can be sold freely in ' + cs[0] + '. Higher-cost domestic ' + maker + ' lose customers, and some may cut jobs or close.');
    } }
  ] };
})();
