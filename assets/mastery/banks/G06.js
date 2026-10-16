/* Group G06 mastery bank: Exchange rates, the current account and trade-offs; Division of labour and the size of firms. Original questions, not copied from past papers. */
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
  // Money in a currency: whole amounts without decimals, otherwise 2 dp.
  function fm(c, x, dp) {
    if (dp == null) dp = (Math.abs(R.roundDp(x, 2) - Math.round(x)) < 1e-9) ? 0 : 2;
    var s = num(x, dp);
    return c.pre ? c.sym + s : s + ' ' + c.sym;
  }
  function rate(x) {
    x = R.roundDp(x, 4);
    if (Number.isInteger(x)) return String(x);
    var d = String(x).split('.')[1].length;
    return x.toFixed(Math.max(2, d));
  }
  function table(head, rows) {
    return '<table class="mc-table"><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  // Static single-answer item: correct option first (the engine shuffles).
  function mc(skill, q, right, wrong, why, extra) {
    var o = { skill: skill, kind: 'mcq', q: q, options: [right].concat(wrong), answer: 0, why: why };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  // Static select-all item.
  function mu(skill, q, rights, wrongs, why, extra) {
    var o = { skill: skill, kind: 'multi', q: q, options: rights.concat(wrongs), answers: rights.map(function (_, i) { return i; }), why: why };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  // Generated single-answer question (duplicates removed).
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

  // ---------- currencies ----------
  var GBP = { sym: '£', name: 'pounds', one: 'pound', pre: true, land: 'the UK', adj: 'UK' };
  var USD = { sym: '$', name: 'US dollars', one: 'US dollar', pre: true, land: 'the US', adj: 'US' };
  var EUR = { sym: '€', name: 'euros', one: 'euro', pre: true, land: 'Spain', adj: 'Spanish' };
  var JPY = { sym: '¥', name: 'yen', one: 'yen', pre: true, land: 'Japan', adj: 'Japanese' };
  var CAD = { sym: 'C$', name: 'Canadian dollars', one: 'Canadian dollar', pre: true, land: 'Canada', adj: 'Canadian' };
  var AUD = { sym: 'A$', name: 'Australian dollars', one: 'Australian dollar', pre: true, land: 'Australia', adj: 'Australian' };
  var MYR = { sym: 'RM', name: 'ringgit', one: 'ringgit', pre: true, land: 'Malaysia', adj: 'Malaysian' };
  var KES = { sym: 'KSh', name: 'Kenyan shillings', one: 'Kenyan shilling', pre: false, land: 'Kenya', adj: 'Kenyan' };
  var MXN = { sym: 'MXN', name: 'Mexican pesos', one: 'Mexican peso', pre: false, land: 'Mexico', adj: 'Mexican' };
  var CHF = { sym: 'CHF', name: 'Swiss francs', one: 'Swiss franc', pre: false, land: 'Switzerland', adj: 'Swiss' };

  // ---------- currency market diagram ----------
  // Base curves: D runs from (100,57.5) to (280,192.5); S from (100,192.5) to (280,57.5); they cross at E0 (190,125).
  // A shift moves one curve 40 px sideways: DR/SR to the right, DL/SL to the left.
  var NEWEQ = { DR: [210, 110], DL: [170, 140], SR: [210, 140], SL: [170, 110] };
  function fxSvg(cur, foreign, shift, aria, points) {
    var ink = '#303a4c', hi = '#e4464f', blue = '#195d9b', grey = '#9aa5b8';
    var s = '<svg viewBox="0 0 360 272" role="img" aria-label="' + aria + '" xmlns="http://www.w3.org/2000/svg">' +
      '<line x1="60" y1="220" x2="340" y2="220" stroke="' + ink + '" stroke-width="2"/>' +
      '<line x1="60" y1="220" x2="60" y2="20" stroke="' + ink + '" stroke-width="2"/>' +
      '<text x="200" y="267" font-size="12" fill="' + ink + '" text-anchor="middle">Quantity of ' + cur + '</text>' +
      '<text x="16" y="120" font-size="12" fill="' + ink + '" text-anchor="middle" transform="rotate(-90 16 120)">Price of ' + cur + ' (' + foreign + ')</text>' +
      '<line x1="100" y1="57.5" x2="280" y2="192.5" stroke="' + blue + '" stroke-width="3"/>' +
      '<text x="284" y="202" font-size="13" fill="' + blue + '">D</text>' +
      '<line x1="100" y1="192.5" x2="280" y2="57.5" stroke="' + blue + '" stroke-width="3"/>' +
      '<text x="284" y="56" font-size="13" fill="' + blue + '">S</text>';
    if (points) {
      s += '<circle cx="190" cy="125" r="4" fill="' + ink + '"/><text x="178" y="129" font-size="13" fill="' + ink + '" text-anchor="end">E</text>';
      var lab = { W: [210, 110, 6, -6], X: [210, 140, 8, 14], Y: [170, 140, -16, 16], Z: [170, 110, -16, -6] };
      Object.keys(lab).forEach(function (k) {
        var p = lab[k];
        s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="' + hi + '"/><text x="' + (p[0] + p[2]) + '" y="' + (p[1] + p[3]) + '" font-size="14" font-weight="bold" fill="' + hi + '">' + k + '</text>';
      });
    } else {
      s += '<line x1="60" y1="125" x2="190" y2="125" stroke="' + grey + '" stroke-dasharray="4 4"/>' +
        '<line x1="190" y1="125" x2="190" y2="220" stroke="' + grey + '" stroke-dasharray="4 4"/>' +
        '<text x="54" y="129" font-size="12" fill="' + ink + '" text-anchor="end">e0</text>' +
        '<text x="190" y="236" font-size="12" fill="' + ink + '" text-anchor="middle">Q0</text>';
    }
    if (shift) {
      var dx = (shift === 'DR' || shift === 'SR') ? 40 : -40, isD = shift.charAt(0) === 'D';
      var x1 = 100 + dx, x2 = 280 + dx;
      s += isD ? '<line x1="' + x1 + '" y1="57.5" x2="' + x2 + '" y2="192.5" stroke="' + hi + '" stroke-width="3"/><text x="' + (x2 + 4) + '" y="202" font-size="13" fill="' + hi + '">D1</text>'
        : '<line x1="' + x1 + '" y1="192.5" x2="' + x2 + '" y2="57.5" stroke="' + hi + '" stroke-width="3"/><text x="' + (x2 + 4) + '" y="56" font-size="13" fill="' + hi + '">S1</text>';
      var e = NEWEQ[shift];
      s += '<line x1="60" y1="' + e[1] + '" x2="' + e[0] + '" y2="' + e[1] + '" stroke="' + hi + '" stroke-dasharray="4 4"/>' +
        '<line x1="' + e[0] + '" y1="' + e[1] + '" x2="' + e[0] + '" y2="220" stroke="' + hi + '" stroke-dasharray="4 4"/>' +
        '<text x="54" y="' + (e[1] + 4 + (e[1] < 125 ? -4 : 6)) + '" font-size="12" fill="' + hi + '" text-anchor="end">e1</text>' +
        '<text x="' + e[0] + '" y="' + (248 - 0) + '" font-size="12" fill="' + hi + '" text-anchor="middle">Q1</text>';
    }
    return s + '</svg>';
  }
  var SHIFT_WORDS = {
    DR: 'demand curve shifted to the right (D to D1), with a higher exchange rate (e1) and a higher quantity (Q1)',
    DL: 'demand curve shifted to the left (D to D1), with a lower exchange rate (e1) and a lower quantity (Q1)',
    SR: 'supply curve shifted to the right (S to S1), with a lower exchange rate (e1) and a higher quantity (Q1)',
    SL: 'supply curve shifted to the left (S to S1), with a higher exchange rate (e1) and a lower quantity (Q1)'
  };
  var FIG_DR = fxSvg('ringgit', 'US$ per ringgit', 'DR', 'Market for the ringgit: ' + SHIFT_WORDS.DR);
  var FIG_DL = fxSvg('zloty', '€ per zloty', 'DL', 'Market for the zloty: ' + SHIFT_WORDS.DL);
  var FIG_SR = fxSvg('Canadian dollars', 'US$ per Canadian dollar', 'SR', 'Market for the Canadian dollar: ' + SHIFT_WORDS.SR);
  var FIG_SL = fxSvg('Kenyan shillings', 'US$ per shilling', 'SL', 'Market for the Kenyan shilling: ' + SHIFT_WORDS.SL);
  var FIG_PTS = fxSvg('pesos', 'US$ per peso', null, 'Market for the Chilean peso with demand D and supply S crossing at E. Point W is above and to the right of E, point X is below and to the right, point Y is below and to the left, and point Z is above and to the left', true);

  // =====================================================================
  // ECO-T22-12 Exchange rates: meaning and what moves a currency
  // =====================================================================
  B['ECO-T22-12'] = { title: 'Exchange rates: meaning and what moves a currency', items: [
    mc('definition', 'What is meant by an <b>exchange rate</b>?',
      'The price of one currency expressed in terms of another currency',
      ['The interest rate a central bank charges when it lends to banks', 'The value of a country\'s exports of goods minus the value of its imports', 'The rate at which the general level of prices rises over a year'],
      'An exchange rate is a price: the price of one currency, in terms of another currency. For example, €1 = $1.10 tells you the price of one euro in US dollars.'),
    mc('definition', 'A student writes: "An exchange rate is the price of a currency." What must be added for a full two-part definition?',
      '…in terms of another currency',
      ['…as set by the government each year', '…measured using the consumer price index', '…after the central bank has taken its fee'],
      'The full definition has two ideas: the price of one currency (1) in terms of another currency (1). Most exchange rates are set by the market, not the government, and the CPI measures inflation.'),
    mc('definition', 'The exchange rate between the euro and the Polish zloty is €1 = 4.30 zloty. What does this mean?',
      'One euro can be exchanged for 4.30 zloty',
      ['One zloty can be exchanged for 4.30 euros', 'The euro has risen in value by 4.30% this year', 'Interest rates in Poland are 4.30% higher than in Europe'],
      'The rate gives the price of one euro measured in zloty. Each euro buys 4.30 zloty, so one zloty is worth much less than one euro (about €0.23).'),
    mc('interest-rates', 'Chile\'s central bank raises its interest rate from 5% to 6.5%. Interest rates in other countries do not change. What is the most likely effect on the Chilean peso?',
      'Demand for the peso rises, so the peso appreciates',
      ['Demand for the peso falls, so the peso depreciates', 'Supply of the peso rises, so the peso depreciates', 'Supply of the peso rises, so the peso appreciates'],
      'Savers abroad can now earn 6.5% in Chilean banks, more than before. To deposit money there they must buy pesos, so demand for the peso rises and its price (the exchange rate) goes up.'),
    mc('interest-rates', 'Malaysia\'s central bank cuts its interest rate while rates abroad stay the same. Savers now earn a lower return in Malaysian banks, so…',
      '…some savers move money abroad, demand for the ringgit falls and it depreciates',
      ['…more foreign savers deposit money in Malaysia, so the ringgit appreciates', '…Malaysians buy more imports, so demand for the ringgit rises and it appreciates', '…the government must buy ringgit, so the ringgit falls in value'],
      'A lower interest rate makes Malaysian bank deposits less attractive. Less hot money flows in (and some flows out), so demand for the ringgit falls and the exchange rate falls.'),
    mc('interest-rates', 'What is meant by <b>hot money</b>?',
      'Savings that move between countries to earn the best interest rate',
      ['Spending by foreign tourists during a busy holiday season', 'Banknotes newly printed by a central bank to fund spending', 'Profits that a firm sends home from its branches abroad'],
      'Hot money is savings that move quickly from country to country, chasing the highest return. When a country raises its interest rate, hot money flows in and demand for its currency rises.'),
    mc('interest-rates', 'Why does a rise in a country\'s interest rates usually increase the demand for its currency?',
      'Foreign savers buy the currency so they can deposit it and earn a higher return',
      ['Higher interest rates make the country\'s exports cheaper for foreign buyers to purchase', 'Firms in the country import more materials, so they need more of the currency', 'Higher interest rates raise prices, so each unit of the currency is worth more'],
      'To save in a country\'s banks, foreigners must first buy that country\'s currency. A better return attracts more of these savers, so demand for the currency rises and it appreciates.'),
    mc('interest-rates', 'Interest rates in Country A rise from 3% to 4%. At the same time, rates in all of Country A\'s main trading partners rise from 3% to 5%. What is the most likely effect on Country A\'s currency?',
      'It depreciates, because savers can now earn more by saving in other countries',
      ['It appreciates, because its own interest rate has gone up by one percentage point', 'It does not change, because interest rates never affect exchange rates', 'It appreciates, because savers move money from its trading partners into Country A'],
      'What matters is the interest rate compared with other countries. Country A now pays 1 percentage point less than its partners, so hot money flows out, demand for its currency falls and it depreciates.'),
    { skill: 'interest-rates', gen: function () {
      var c = pick([{ n: 'Varnia', cur: 'varn' }, { n: 'Ostravia', cur: 'kron' }, { n: 'Taluma', cur: 'tal' }, { n: 'Belloria', cur: 'bello' }]);
      var up = Math.random() < 0.5;
      var r0 = pick([2, 2.5, 3, 3.5, 4, 4.5, 5]);
      var step = pick([0.5, 0.75, 1, 1.25, 1.5]);
      var r1 = up ? r0 + step : r0 - step;
      var q = 'The central bank of ' + c.n + ' changes its interest rate from ' + r0 + '% to ' + r1 + '%. Interest rates in other countries stay the same. What is the most likely effect on the ' + c.cur + ', the currency of ' + c.n + '?';
      var A = 'Demand for the ' + c.cur + ' rises, so it appreciates', Dd = 'Demand for the ' + c.cur + ' falls, so it depreciates';
      var right = up ? A : Dd;
      var wrong = up ? [Dd, 'Supply of the ' + c.cur + ' rises, so it depreciates', 'Demand for the ' + c.cur + ' rises, so it depreciates']
        : [A, 'Supply of the ' + c.cur + ' falls, so it appreciates', 'Demand for the ' + c.cur + ' falls, so it appreciates'];
      var why = up ? 'At ' + r1 + '% instead of ' + r0 + '%, saving in ' + c.n + ' gives a better return than before. Foreign savers buy the ' + c.cur + ' to deposit it, so demand rises and the exchange rate rises (appreciation).'
        : 'At ' + r1 + '% instead of ' + r0 + '%, saving in ' + c.n + ' gives a lower return than before. Less hot money flows in, so demand for the ' + c.cur + ' falls and the exchange rate falls (depreciation).';
      return Q(q, right, wrong, why);
    } },
    mc('interest-rates', 'Ruritania\'s central bank raises its interest rate to 7.5% when rates in most other countries are about 4%. Which chain of reasoning is correct?',
      'Higher return on savings → hot money flows in → demand for the currency rises → it appreciates',
      ['Higher return on savings → savers move money abroad → supply of the currency rises → it appreciates', 'Higher interest rates → more borrowing → more imports → demand for the currency rises', 'Higher return on savings → hot money flows in → supply of the currency rises → it depreciates'],
      'Each step must follow from the last: the 7.5% rate beats the 4% available elsewhere, so savers buy the currency to deposit it. More demand for the currency raises its price, so it appreciates.'),
    mc('interest-rates', 'A student writes: "Higher interest rates in Peru increase the demand for the sol." What is needed to finish the explanation of the effect on the currency?',
      'State that the sol appreciates (rises in value) as a result',
      ['State that the supply of the sol rises by the same amount', 'State that Peru\'s exports will become cheaper abroad', 'State that the interest rate is the price of a currency'],
      'The answer stops at "demand rises". The question is about the currency, so the chain must end with the effect on the exchange rate: more demand means the sol appreciates.'),
    mc('trade-flows', 'People in Norland buy many more phones imported from Asia. Which side of the market for the Norland crown changes, and what happens to the crown?',
      'Supply of crowns rises, so the crown depreciates',
      ['Demand for crowns rises, so the crown appreciates', 'Demand for crowns falls, so the crown appreciates', 'Supply of crowns falls, so the crown appreciates'],
      'To pay for imports, Norland residents sell crowns to buy foreign currency. Selling crowns adds to the supply of crowns, so the price of the crown falls.'),
    mc('trade-flows', 'Foreign demand for coffee exported from Vietnam rises sharply. What is the most likely effect on the Vietnamese dong?',
      'Demand for the dong rises, so the dong appreciates',
      ['Supply of the dong rises, so the dong depreciates', 'Demand for the dong falls, so the dong depreciates', 'Supply of the dong falls, so the dong depreciates'],
      'Foreign buyers must pay Vietnamese coffee firms in dong, so they buy dong. More demand for the dong raises its exchange rate.'),
    mc('trade-flows', 'Which of the following creates <b>demand</b> for the Brazilian real?',
      'A US food company paying a Brazilian farm for soya beans',
      ['A Brazilian family paying for a holiday in Portugal', 'A Brazilian firm buying software from a US company', 'A Brazilian bank moving its savings into US banks'],
      'Demand for the real comes from people who need reals: here a foreign buyer paying for a Brazilian export. The other three are Brazilians swapping reals for foreign currency, which adds to the supply of reals.'),
    mu('trade-flows', 'Which of the following would increase the <b>demand</b> for the Kenyan shilling?',
      ['More foreign tourists booking safari holidays in Kenya', 'A rise in Kenyan interest rates compared with other countries', 'Speculators buying shillings because they expect them to rise'],
      ['Kenyan firms buying more machinery from Germany', 'Kenyan savers moving their money to banks abroad'],
      'Tourists, foreign savers and speculators all need to buy shillings, so demand rises. Kenyan firms buying imports and Kenyan savers moving money abroad sell shillings, which adds to supply instead.'),
    mu('trade-flows', 'Which of the following would increase the <b>supply</b> of Canadian dollars on the currency market?',
      ['Canadians buying more cars made in Japan', 'Canadian firms building new factories in Mexico', 'The Bank of Canada selling Canadian dollars'],
      ['Foreign students paying fees to Canadian universities', 'Speculators buying Canadian dollars because they expect a rise'],
      'Supply comes from people selling Canadian dollars to get other currencies: importers, Canadians investing abroad, and a central bank selling its own currency. Foreign students and speculators buying the currency add to demand.'),
    mc('speculation', 'What is a <b>currency speculator</b>?',
      'Someone who buys and sells currencies to profit from changes in exchange rates',
      ['A government official who decides the rate in a fixed exchange rate system each year', 'A shop that changes money for tourists in return for a fixed fee', 'A bank that lends foreign currency to importers at a low interest rate'],
      'Speculators buy a currency they expect to rise and sell one they expect to fall, hoping to profit from the change in its price.'),
    mc('speculation', 'Speculators come to believe that the Polish zloty will fall in value next month. What are they likely to do, and with what effect?',
      'Sell zloty, so the supply of zloty rises and the zloty falls',
      ['Buy zloty, so the demand for zloty rises and the zloty rises', 'Sell zloty, so the demand for zloty rises and the zloty rises', 'Buy zloty, so the supply of zloty rises and the zloty falls'],
      'A speculator who expects a fall gets rid of the currency before it happens. Selling adds to supply, which pushes the exchange rate down.'),
    mc('speculation', 'Why are speculators\' expectations about a currency often described as self-fulfilling?',
      'Their own buying or selling moves the rate in the direction they expected',
      ['Governments are required to change the rate to match their forecasts', 'Their forecasts are always based on fully accurate trade figures', 'They are legally required to hold a currency until its value rises'],
      'If many speculators expect a rise and buy the currency, that extra demand itself raises the rate. Expecting a fall and selling raises supply and pushes the rate down.'),
    mc('government', 'The government of Lumeria is worried that its currency, the lumen, is falling too fast. Which action would help to push the value of the lumen <b>up</b>?',
      'Buying lumens on the currency market with its foreign currency reserves',
      ['Selling lumens on the currency market in exchange for US dollars and euros', 'Cutting interest rates so that borrowing in Lumeria becomes cheaper', 'Printing more lumens and lending them to commercial banks'],
      'Buying its own currency adds to demand for the lumen, which raises its price. Selling lumens, cutting interest rates or creating more lumens would all push the value down further.'),
    mu('government', 'Which of the following would tend to push the value of a country\'s currency <b>down</b>?',
      ['Its central bank cuts interest rates', 'Its government sells its own currency on the currency market'],
      ['Its government buys its own currency using foreign currency reserves', 'Foreign demand for the country\'s exports rises', 'Speculators buy the currency because they expect it to rise'],
      'Lower interest rates reduce demand for the currency, and the government selling its currency adds to supply, so both lower the rate. Buying the currency, more export sales and speculative buying all raise demand and push it up.'),
    mc('government', 'Why might a government that wants to <b>stop</b> its currency from appreciating choose to sell its own currency?',
      'Selling adds to the supply of the currency, which pushes its price down',
      ['Selling reduces the supply of the currency, which pushes its price down', 'Selling adds to the demand for the currency, which pushes its price down', 'Selling raises interest rates, which makes the currency fall in value'],
      'Like any price, the exchange rate falls when supply rises. By selling its own currency the government increases supply, holding the rate down.')
  ] };

  // =====================================================================
  // ECO-CALC-23 Converting currencies with an exchange rate
  // =====================================================================
  B['ECO-CALC-23'] = { title: 'Converting currencies with an exchange rate', items: [
    // multiply: home price to foreign price
    { skill: 'multiply', gen: function () {
      var set = pick([
        { a: AUD, b: JPY, r: [96.5, 97.2, 98.4, 99.6], good: 'surfboard', amt: [400, 450, 520, 600, 680] },
        { a: GBP, b: USD, r: [1.22, 1.24, 1.27, 1.29, 1.32], good: 'wool coat', amt: [180, 240, 260, 320, 350] },
        { a: EUR, b: USD, r: [1.06, 1.08, 1.11, 1.13], good: 'leather sofa', amt: [1200, 1450, 1600, 1850] },
        { a: CHF, b: EUR, r: [1.04, 1.06, 1.07, 1.09], good: 'cuckoo clock', amt: [650, 820, 940, 1100] }
      ]);
      var r = pick(set.r), x = pick(set.amt), ans = R.roundDp(x * r, 2);
      var q = (/^[AEIO]/.test(set.a.adj) ? 'An ' : 'A ') + set.a.adj + '-made ' + set.good + ' is priced at ' + fm(set.a, x) + '. The exchange rate is 1 ' + set.a.one + ' = ' + rate(r) + ' ' + set.b.name + '. Calculate the price of the ' + set.good + ' in ' + set.b.name + ' (' + set.b.sym + '). Give your answer to 2 decimal places where needed.';
      return N(q, ans, set.b.sym, 'Going from ' + set.a.name + ' to ' + set.b.name + ', multiply by the rate: ' + num(x) + ' × ' + rate(r) + ' = ' + fm(set.b, ans) + '. Each ' + set.a.one + ' buys ' + rate(r) + ' ' + set.b.name + ', so the ' + set.b.sym + ' figure is the bigger number.', 0.005, num(ans, ans % 1 ? 2 : 0).replace(/,/g, ''));
    } },
    // divide: foreign price to home price, 2 dp
    { skill: 'divide', gen: function () {
      var set = pick([
        { h: GBP, f: USD, r: [1.23, 1.26, 1.28, 1.31], good: 'pair of trainers from a US online shop', amt: [89, 115, 134, 149, 172] },
        { h: CAD, f: EUR, r: [0.67, 0.68, 0.69], good: 'set of cooking pans from an Italian website', amt: [96, 128, 145, 210] },
        { h: AUD, f: USD, r: [0.64, 0.66, 0.67], good: 'games console imported from the US', amt: [399, 449, 499] }
      ]);
      var r = pick(set.r), x = pick(set.amt), ans = R.roundDp(x / r, 2);
      var q = (/^[AEIO]/.test(set.h.adj) ? 'An ' : 'A ') + set.h.adj + ' customer buys a ' + set.good + ' priced at ' + fm(set.f, x) + '. The exchange rate is 1 ' + set.h.one + ' = ' + rate(r) + ' ' + set.f.name + '. Calculate the price in ' + set.h.name + ' (' + set.h.sym + '), to 2 decimal places.';
      return N(q, ans, set.h.sym, 'The rate is given as 1 ' + set.h.one + ' = ' + rate(r) + ' ' + set.f.name + ', so to go from ' + set.f.name + ' back to ' + set.h.name + ' you divide: ' + num(x) + ' ÷ ' + rate(r) + ' = ' + num(ans, 2) + ', so ' + fm(set.h, ans, 2) + ' to 2 decimal places.', 0.005, ans.toFixed(2));
    } },
    // multiply: large deal in millions
    { skill: 'multiply', gen: function () {
      var r = pick([4.35, 4.42, 4.48, 4.56, 4.61]), m = pick([12, 15, 18, 24, 26, 35]);
      var ans = R.roundDp(m * r, 2);
      var q = 'A Malaysian palm-oil producer signs a contract to supply oil worth $' + m + ' million to a buyer in the United States. The exchange rate is $1 = RM ' + rate(r) + ' (Malaysian ringgit). Calculate the value of the contract in millions of ringgit.';
      return N(q, ans, 'RM million', 'Dollars to ringgit: multiply by the rate. ' + m + ' × ' + rate(r) + ' = ' + num(ans, 2) + ', so the contract is worth RM ' + num(ans, 2) + ' million.', 0.005, ans.toFixed(2));
    } },
    // divide with a clean answer
    { skill: 'divide', gen: function () {
      var r = pick([125, 128, 130, 132, 135]), n = pick([45, 60, 75, 80, 95, 110]);
      var price = r * n;
      var q = 'A safari lodge in Kenya charges KSh ' + num(price) + ' (Kenyan shillings) per night. The exchange rate is $1 = KSh ' + r + '. Calculate the price per night in US dollars ($).';
      return N(q, n, '$', 'Shillings to dollars: divide by the number of shillings in one dollar. ' + num(price) + ' ÷ ' + r + ' = $' + n + '.');
    } },
    // choose-method mcq with operation distractors
    { skill: 'choose-method', gen: function () {
      var r = pick([1.15, 1.18, 1.22, 1.25, 1.28]), x = pick([200, 240, 400, 480, 600, 800]);
      var toForeign = Math.random() < 0.5;
      var h = pick([{ c: GBP, f: { sym: '€', name: 'euros', pre: true } }, { c: GBP, f: { sym: '$', name: 'US dollars', pre: true } }]);
      var q, right, alt, add, sub;
      if (toForeign) {
        q = 'The exchange rate is 1 ' + (h.c.one || 'pound') + ' = ' + rate(r) + ' ' + h.f.name + '. What is ' + fm(h.c, x) + ' worth in ' + h.f.name + '?';
        right = fm(h.f, x * r, 2); alt = fm(h.f, x / r, 2); add = fm(h.f, x + r, 2); sub = fm(h.f, x - r, 2);
        return Q(q, right, [alt, add, sub], 'From ' + h.c.name + ' to ' + h.f.name + ' you multiply: ' + num(x) + ' × ' + rate(r) + ' = ' + right + '. Each ' + (h.c.one || 'pound') + ' buys more than one unit of the other currency, so the answer must be larger than ' + num(x) + '.');
      }
      q = 'The exchange rate is 1 ' + (h.c.one || 'pound') + ' = ' + rate(r) + ' ' + h.f.name + '. What is ' + fm(h.f, x) + ' worth in ' + h.c.name + '?';
      right = fm(h.c, x / r, 2); alt = fm(h.c, x * r, 2); add = fm(h.c, x + r, 2); sub = fm(h.c, x - r, 2);
      return Q(q, right, [alt, add, sub], 'From ' + h.f.name + ' back to ' + h.c.name + ' you divide: ' + num(x) + ' ÷ ' + rate(r) + ' = ' + right + ' (to 2 decimal places). The answer must be smaller than ' + num(x) + ' because each ' + (h.c.one || 'pound') + ' is worth more than one unit of the other currency.');
    } },
    // multi-step: units x price x rate
    { skill: 'multi-step', gen: function () {
      var n = pick([200, 400, 500, 800, 1000]), p = pick([12.5, 15, 18, 22.5, 24]), r = pick([1.05, 1.08, 1.1, 1.12]);
      var eur = n * p, ans = R.roundDp(eur * r, 2);
      var q = 'A Portuguese pottery firm sells ' + num(n) + ' bowls to a US shop at €' + num(p, p % 1 ? 2 : 0) + ' each. The exchange rate is €1 = $' + rate(r) + '. Calculate the total value of the order in US dollars ($).';
      return N(q, ans, '$', 'First find the value in euros: ' + num(n) + ' × €' + num(p, p % 1 ? 2 : 0) + ' = €' + num(eur) + '. Then convert to dollars by multiplying: ' + num(eur) + ' × ' + rate(r) + ' = $' + num(ans, ans % 1 ? 2 : 0) + '.', 0.005);
    } },
    // find-rate
    { skill: 'find-rate', gen: function () {
      var r = pick([1.24, 1.26, 1.28, 1.3, 1.32]), p = pick([150, 200, 250, 300, 400, 500]);
      var usd = R.roundDp(p * r, 2);
      var q = 'A UK publisher sells a box set of books for £' + p + ' in Britain. The same box set is sold in the US for exactly the same value, $' + num(usd, usd % 1 ? 2 : 0) + '. What exchange rate is being used? Give the number of US dollars per pound, to 2 decimal places.';
      return N(q, r, '$ per £', 'Dollars per pound = dollar price ÷ pound price = ' + num(usd, usd % 1 ? 2 : 0) + ' ÷ ' + p + ' = ' + r.toFixed(2) + '. So £1 = $' + r.toFixed(2) + '.', 0.005, r.toFixed(2));
    } },
    // multi-step: change in rate, change in price
    { skill: 'multi-step', gen: function () {
      var p = pick([400, 500, 600, 800, 1200]), r0 = pick([1.08, 1.1, 1.12, 1.14]), d = pick([0.02, 0.04, 0.05, 0.06]);
      var up = Math.random() < 0.5, r1 = R.roundDp(up ? r0 + d : r0 - d, 2);
      var change = R.roundDp(Math.abs(p * r1 - p * r0), 2);
      var q = 'A Swiss watch is priced at CHF ' + num(p) + ' (Swiss francs). The exchange rate changes from CHF 1 = $' + rate(r0) + ' to CHF 1 = $' + rate(r1) + '. The price in francs does not change. By how many US dollars does the dollar price of the watch ' + (up ? 'rise' : 'fall') + '?';
      return N(q, change, '$', 'Old dollar price: ' + num(p) + ' × ' + rate(r0) + ' = $' + num(p * r0, 2) + '. New dollar price: ' + num(p) + ' × ' + rate(r1) + ' = $' + num(p * r1, 2) + '. The difference is $' + num(change, 2) + '.', 0.005);
    } },
    // multi-step: tourist money left over
    { skill: 'multi-step', gen: function () {
      var r = pick([16.8, 17.2, 17.5, 18]), start = pick([500, 600, 800, 1000]), back = pick([100, 120, 150, 200]);
      var total = R.roundDp(start * r, 2), spent = R.roundDp((start - back) * r, 2);
      var q = 'A US tourist changes $' + num(start) + ' into Mexican pesos when $1 = MXN ' + rate(r) + '. During the trip she spends MXN ' + num(spent, spent % 1 ? 2 : 0) + '. At the end she changes the pesos she has left back into dollars at the same rate. How many dollars does she get back?';
      return N(q, back, '$', 'Pesos received: ' + num(start) + ' × ' + rate(r) + ' = MXN ' + num(total, total % 1 ? 2 : 0) + '. Pesos left: ' + num(total, total % 1 ? 2 : 0) + ' − ' + num(spent, spent % 1 ? 2 : 0) + ' = MXN ' + num(total - spent, 2).replace(/\.00$/, '') + '. Back into dollars: ' + num(total - spent, 2).replace(/\.00$/, '') + ' ÷ ' + rate(r) + ' = $' + back + '.');
    } },
    // multi-step: comparing two prices in one currency
    { skill: 'multi-step', gen: function () {
      var r = pick([1.14, 1.16, 1.18]), uk = pick([800, 900, 950, 1000]), gap = pick([20, 30, 40, 50]);
      var ukEur = R.roundDp(uk * r, 2), de = R.roundDp(ukEur - gap, 2);
      var q = 'The same laptop costs £' + num(uk) + ' in a UK shop and €' + num(de, de % 1 ? 2 : 0) + ' in a German shop. The exchange rate is £1 = €' + rate(r) + '. After converting the UK price into euros, how many euros cheaper is the laptop in Germany?';
      return N(q, gap, '€', 'UK price in euros: ' + num(uk) + ' × ' + rate(r) + ' = €' + num(ukEur, ukEur % 1 ? 2 : 0) + '. Difference: ' + num(ukEur, ukEur % 1 ? 2 : 0) + ' − ' + num(de, de % 1 ? 2 : 0) + ' = €' + gap + '.');
    } },
    // choose-method: which answer earns full marks (symbol)
    { skill: 'choose-method', gen: function () {
      var r = pick([1.22, 1.25, 1.28]), x = pick([400, 500, 800, 1000]);
      var ans = x * r, s = num(ans, ans % 1 ? 2 : 0);
      var q = 'A question asks: "Calculate the price in US dollars ($) of a British bicycle priced at £' + num(x) + ' when £1 = $' + rate(r) + '." Which final answer would gain full marks?';
      return Q(q, '$' + s, ['£' + s, '$' + num(x / r, 2), '£' + num(x / r, 2)], 'The working is ' + num(x) + ' × ' + rate(r) + ' = ' + s + ', and the answer must carry the symbol of the new currency: $' + s + '. Writing £' + s + ' gives the right number with the wrong currency.');
    } },
    // divide: yen to pounds, clean
    { skill: 'divide', gen: function () {
      var r = pick([185, 190, 195, 200]), n = pick([12, 15, 18, 24, 30]);
      var q = 'A British student in Tokyo pays ¥' + num(r * n) + ' for a meal. The exchange rate is £1 = ¥' + r + '. How much does the meal cost in pounds (£)?';
      return N(q, n, '£', 'Yen to pounds: divide by the number of yen in one pound. ' + num(r * n) + ' ÷ ' + r + ' = £' + n + '.');
    } },
    // multiply: remittance
    { skill: 'multiply', gen: function () {
      var r = pick([162, 165, 168, 171]), x = pick([250, 300, 400, 450, 500]);
      var q = 'A nurse working in the UK sends £' + x + ' to her family in Kenya. The exchange rate is £1 = KSh ' + r + ' (Kenyan shillings). How many shillings does her family receive, before any fees?';
      return N(q, x * r, 'KSh', 'Pounds to shillings: multiply by the rate. ' + x + ' × ' + r + ' = KSh ' + num(x * r) + '.');
    } },
    // multi-step: imported input cost
    { skill: 'multi-step', gen: function () {
      var t = pick([1500, 2000, 2500, 3000]), p = pick([240, 250, 260, 280]), r = pick([145, 148, 150, 152]);
      var usd = t * p, ans = usd * r;
      var q = 'A Japanese flour mill imports ' + num(t) + ' tonnes of wheat from Canada, priced at $' + p + ' per tonne (US dollars). The exchange rate is $1 = ¥' + r + '. Calculate the total cost of the wheat in yen (¥).';
      return N(q, ans, '¥', 'Cost in dollars: ' + num(t) + ' × $' + p + ' = $' + num(usd) + '. In yen: ' + num(usd) + ' × ' + r + ' = ¥' + num(ans) + '.');
    } },
    // multi-step: cheaper supplier (mcq)
    { skill: 'multi-step', gen: function () {
      var rUsd = pick([1.25, 1.28]), rEur = pick([1.15, 1.17]);
      var usd = pick([5000, 6400, 7500]), gbpA = R.roundDp(usd / rUsd, 2);
      var eur = Math.round((gbpA + pick([-200, -120, 120, 200])) * rEur / 10) * 10, gbpB = R.roundDp(eur / rEur, 2);
      var cheaper = gbpA < gbpB ? 'A' : 'B', diff = R.roundDp(Math.abs(gbpA - gbpB), 2);
      var q = 'A UK café chain needs a new coffee machine. Supplier A (US) quotes $' + num(usd) + '. Supplier B (Italy) quotes €' + num(eur) + '. The exchange rates are £1 = $' + rate(rUsd) + ' and £1 = €' + rate(rEur) + '. Which supplier is cheaper in pounds, and by how much?';
      var other = cheaper === 'A' ? 'B' : 'A';
      return Q(q, 'Supplier ' + cheaper + ', by £' + num(diff, 2), ['Supplier ' + other + ', by £' + num(diff, 2), 'Supplier ' + cheaper + ', by £' + num(Math.abs(usd - eur), 2), 'Supplier ' + other + ', by £' + num(Math.abs(usd * rUsd - eur * rEur), 2)],
        'Convert both into pounds by dividing: A = ' + num(usd) + ' ÷ ' + rate(rUsd) + ' = £' + num(gbpA, 2) + '; B = ' + num(eur) + ' ÷ ' + rate(rEur) + ' = £' + num(gbpB, 2) + '. Supplier ' + cheaper + ' is cheaper by £' + num(gbpA > gbpB ? gbpA : gbpB, 2) + ' − £' + num(gbpA > gbpB ? gbpB : gbpA, 2) + ' = £' + num(diff, 2) + '.');
    } },
    // divide: whole nights in a budget
    { skill: 'divide', gen: function () {
      var r = pick([148, 150, 152]), usdNight = pick([90, 110, 120, 140]), budget = pick([500, 650, 800, 1000]);
      var yen = usdNight * r, nights = Math.floor(budget / usdNight);
      var q = 'A hotel in Kyoto charges ¥' + num(yen) + ' per night. A US traveller has a budget of $' + num(budget) + ' for the hotel. The exchange rate is $1 = ¥' + r + '. What is the greatest number of whole nights she can afford?';
      return N(q, nights, 'nights', 'Price per night in dollars: ' + num(yen) + ' ÷ ' + r + ' = $' + usdNight + '. Then ' + num(budget) + ' ÷ ' + usdNight + ' = ' + R.roundDp(budget / usdNight, 2) + ', so she can afford ' + nights + ' whole nights.');
    } },
    mc('choose-method', 'The exchange rate is £1 = €1.15. To convert an amount in euros into pounds, you should…',
      '…divide the number of euros by 1.15',
      ['…multiply the number of euros by 1.15', '…add 1.15 to the number of euros', '…subtract 1.15 from the number of euros'],
      'The rate tells you how many euros one pound buys. Going from euros back to pounds you divide: for example €230 ÷ 1.15 = £200.'),
    mc('choose-method', 'The exchange rate is €1 = ¥160. Which calculation gives the price in euros of a camera costing ¥48,000?',
      '48,000 ÷ 160', ['48,000 × 160', '160 ÷ 48,000', '48,000 − 160'],
      'Each euro buys 160 yen, so the number of euros is the number of yen divided by 160: 48,000 ÷ 160 = €300.'),
    mc('choose-method', 'The exchange rate is £1 = €1.15. A student converts €230 into pounds and writes £264.50. What has gone wrong?',
      'They multiplied instead of dividing; the answer should be £200',
      ['They divided instead of multiplying; the answer should be £300', 'They added the rate; the answer should be £228.85', 'Nothing has gone wrong; £264.50 is the correct answer'],
      'Pounds are worth more than euros at this rate, so €230 must be fewer than 230 pounds. The correct working is 230 ÷ 1.15 = £200; 230 × 1.15 = 264.50 goes the wrong way.'),
    mu('choose-method', 'The exchange rate is £1 = $1.25. Which of the following statements are correct?',
      ['£40 is worth $50', '$100 is worth £80'],
      ['$1 is worth £1.25', '£10 is worth $8', '$50 is worth £62.50'],
      '£40 × 1.25 = $50, and $100 ÷ 1.25 = £80. One dollar is worth £0.80, not £1.25, and £10 buys $12.50.'),
    mc('find-rate', 'The exchange rate is $1 = ¥150. What is the price of one yen in US dollars?',
      'About $0.0067', ['$150', 'About $0.15', '$1.50'],
      'If one dollar buys 150 yen, one yen is worth 1 ÷ 150 = $0.0067 (to 4 decimal places). The price of one currency in another can be written either way round.'),
    mc('find-rate', 'A Canadian firm receives C$2,700 for goods it sold to an Australian buyer for A$3,000. Which exchange rate was used?',
      'A$1 = C$0.90', ['A$1 = C$1.11', 'C$1 = A$0.90', 'A$1 = C$300'],
      'Divide the Canadian dollar amount by the Australian dollar amount: 2,700 ÷ 3,000 = 0.90, so each Australian dollar was worth C$0.90. C$1 = A$0.90 turns the rate the wrong way round.')
  ] };

  // =====================================================================
  // ECO-T22-13 Draw a change in a currency's exchange rate
  // =====================================================================
  var PTS_Q = 'The diagram shows the market for the Chilean peso, which starts in equilibrium at E. ';
  var PTS_WHY = ' W: demand right (rate up, quantity up). X: supply right (rate down, quantity up). Y: demand left (rate down, quantity down). Z: supply left (rate up, quantity down).';
  B['ECO-T22-13'] = { title: 'Draw a change in a currency\'s exchange rate', items: [
    mc('axes', 'In a diagram of the market for the Ghanaian cedi, what goes on the vertical axis?',
      'The price of the cedi in another currency (its exchange rate)',
      ['The quantity of cedi bought and sold on the market', 'The interest rate set by the central bank of Ghana', 'The value of Ghana\'s exports minus its imports'],
      'A currency market diagram is a demand and supply diagram. The price of the currency (the exchange rate, such as US$ per cedi) goes on the vertical axis and the quantity of cedi on the horizontal axis.'),
    mc('axes', 'In the market for the Australian dollar, which group <b>supplies</b> Australian dollars?',
      'Australians swapping Australian dollars for other currencies to buy imports',
      ['Foreign buyers of Australian exports such as iron ore and wheat', 'Foreign savers who want to deposit money in Australian banks', 'Speculators who buy Australian dollars expecting them to rise'],
      'Supply of a currency comes from its own residents selling it to get foreign currency, for example to pay for imports. The other three groups need to buy Australian dollars, so they are part of demand.'),
    mu('labels', 'A question asks you to draw the effect of an event on a currency\'s exchange rate and to show, with labels, the new curve, the new rate and the new quantity. Which of the following are needed for full marks?',
      ['The correct curve shifted the correct way and labelled (for example D1)', 'The new, higher or lower exchange rate marked on the price axis', 'The new equilibrium quantity marked on the quantity axis'],
      ['The other curve shifted by the same amount in the same direction', 'A second diagram showing the market for the foreign currency'],
      'Each of the three marks goes to one label: the shifted and labelled curve, the new exchange rate and the new quantity at the new crossing point. Only one curve moves.'),
    mc('labels', 'A student shows a rise in a currency\'s exchange rate by shifting demand to the right but labels the new curve "D" and the new rate "e0", the same as the originals. What is the problem?',
      'The new curve and rate cannot be told apart from the originals, so marks are lost',
      ['Demand should never be shifted when an exchange rate rises', 'The new curve should always be drawn steeper than the original', 'Exchange rate diagrams do not need any labels on the axes'],
      'New positions need new labels (D1, e1, Q1). If the original labels are reused, the examiner cannot see which is the new exchange rate or quantity.'),
    mc('which-curve', 'A student shows an increase in Kenyan exports by shifting the <b>supply</b> of shillings to the right. What is wrong?',
      'Exports create demand for shillings, so the demand curve should shift right',
      ['Exports reduce the supply of shillings, so supply should shift left instead', 'Exports have no effect on the market for the Kenyan shilling at all', 'Both the demand and supply curves should shift to the right by equal amounts'],
      'Foreign buyers of Kenyan exports must pay in shillings, so they buy shillings. This is demand. Shifting supply to the right would wrongly show the shilling falling in value.'),
    mc('which-curve', 'In the market for the Polish zloty, Polish households buy fewer cars imported from Japan. Which shows the result?',
      'Supply shifts left; the exchange rate rises and the quantity falls',
      ['Demand shifts left; the exchange rate falls and the quantity falls', 'Supply shifts right; the exchange rate falls and the quantity rises', 'Demand shifts right; the exchange rate rises and the quantity rises'],
      'Buying imports means selling zloty for yen, which is supply of zloty. Fewer imports means less supply, so supply shifts left: a higher exchange rate and a lower quantity of zloty traded.'),
    mc('which-curve', 'In the market for the Indonesian rupiah, foreign tourists spend much more on holidays in Bali. Which shows the result?',
      'Demand shifts right; the exchange rate rises and the quantity rises',
      ['Supply shifts right; the exchange rate falls and the quantity rises', 'Supply shifts left; the exchange rate rises and the quantity falls', 'Demand shifts left; the exchange rate falls and the quantity falls'],
      'Tourists must buy rupiah to spend in Indonesia, so this is demand for the rupiah. More tourism shifts demand right, giving a higher exchange rate and a higher quantity.'),
    mc('which-curve', 'In the market for the New Zealand dollar, the central bank of New Zealand cuts interest rates. Which shows the result?',
      'Demand shifts left; the exchange rate falls and the quantity falls',
      ['Demand shifts right; the exchange rate rises and the quantity rises', 'Supply shifts left; the exchange rate rises and the quantity falls', 'Both curves shift left; the exchange rate stays the same'],
      'Lower interest rates make saving in New Zealand less attractive, so fewer foreigners buy New Zealand dollars. Demand shifts left, lowering both the exchange rate and the quantity. Only one curve moves.'),
    mc('which-curve', 'In the market for the Swiss franc, Swiss households buy many more holidays abroad. Which shows the result?',
      'Supply shifts right; the exchange rate falls and the quantity rises',
      ['Demand shifts right; the exchange rate rises and the quantity rises', 'Demand shifts left; the exchange rate falls and the quantity falls', 'Supply shifts left; the exchange rate rises and the quantity falls'],
      'Holidays abroad are an import of services. Swiss tourists sell francs to buy euros or other currencies, so the supply of francs shifts right: a lower exchange rate and a higher quantity traded.'),
    mu('which-curve', 'Which of the following would shift the <b>demand</b> curve for the South Korean won to the <b>right</b>?',
      ['Rising foreign sales of Korean-made electric cars', 'A rise in Korean interest rates compared with other countries', 'Speculators buying won because they expect it to rise'],
      ['Korean firms importing more oil from the Middle East', 'Korean families buying more holidays in Japan'],
      'Export sales, inflows of hot money and speculative buying all involve foreigners buying won, so demand shifts right. Imports of oil and holidays abroad involve Koreans selling won, which shifts supply instead.'),
    mc('read-diagram', 'The diagram shows a change in the market for the Malaysian ringgit. Which event could have caused it?',
      'A rise in foreign demand for Malaysian exports',
      ['A rise in Malaysian imports of machinery from China', 'A cut in Malaysian interest rates', 'Speculators selling ringgit because they expect it to fall'],
      'The demand curve has shifted right, so more people want to buy ringgit. Foreign buyers of Malaysian exports must pay in ringgit. Imports would shift supply, and lower interest rates would shift demand left.',
      { svg: FIG_DR, family: 'fig-dr' }),
    mc('read-diagram', 'The diagram shows a change in the market for the Malaysian ringgit. What has happened to the exchange rate and the quantity of ringgit traded?',
      'The exchange rate has risen and the quantity has risen',
      ['The exchange rate has risen and the quantity has fallen', 'The exchange rate has fallen and the quantity has risen', 'The exchange rate has fallen and the quantity has fallen'],
      'Demand has shifted right from D to D1. The new crossing point is higher (e1 above e0) and further right (Q1 beyond Q0), so the ringgit appreciates and more ringgit are traded.',
      { svg: FIG_DR, family: 'fig-dr' }),
    mc('read-diagram', 'The diagram shows a change in the market for the Polish zloty. Which event could have caused it?',
      'A fall in foreign demand for Polish exports',
      ['A rise in foreign demand for Polish exports', 'A fall in Polish imports of German cars', 'A rise in Polish interest rates'],
      'Demand for the zloty has shifted left, so fewer people want to buy zloty. Lower export sales mean foreign buyers need fewer zloty. Fewer imports would shift supply left, and higher interest rates would raise demand.',
      { svg: FIG_DL, family: 'fig-dl' }),
    mc('read-diagram', 'The diagram shows a change in the market for the Polish zloty. What does the new equilibrium show?',
      'A lower exchange rate and a lower quantity of zloty',
      ['A higher exchange rate and a lower quantity of zloty', 'A lower exchange rate and a higher quantity of zloty', 'A higher exchange rate and a higher quantity of zloty'],
      'Demand has shifted left from D to D1. The new crossing point is lower (e1 below e0) and to the left (Q1 below Q0), so the zloty depreciates and fewer zloty are traded.',
      { svg: FIG_DL, family: 'fig-dl' }),
    mc('read-diagram', 'The diagram shows a change in the market for the Canadian dollar. Which event could have caused it?',
      'Canadians buying more goods imported from the US',
      ['Americans buying more goods exported from Canada', 'Canadians buying fewer goods imported from the US', 'A rise in Canadian interest rates'],
      'Supply of Canadian dollars has shifted right. Canadians who buy imports sell Canadian dollars to get US dollars, so more imports add to supply. More Canadian exports or higher interest rates would shift demand right instead.',
      { svg: FIG_SR, family: 'fig-sr' }),
    mc('read-diagram', 'The diagram shows a change in the market for the Canadian dollar. What has happened?',
      'The Canadian dollar has depreciated and more have been traded',
      ['The Canadian dollar has appreciated and more have been traded', 'The Canadian dollar has depreciated and fewer have been traded', 'The Canadian dollar has appreciated and fewer have been traded'],
      'Supply shifted right from S to S1. The new crossing point has a lower exchange rate (e1 below e0) and a higher quantity (Q1 beyond Q0).',
      { svg: FIG_SR, family: 'fig-sr' }),
    mc('read-diagram', 'The diagram shows a change in the market for the Kenyan shilling. Which event could have caused it?',
      'Kenyans buying fewer imported goods',
      ['Kenyans buying more imported goods', 'Foreign buyers purchasing fewer Kenyan exports', 'Foreign tourists visiting Kenya more often'],
      'Supply of shillings has shifted left, so fewer shillings are being sold. When Kenyans buy fewer imports they sell fewer shillings for foreign currency. The other events would change demand, or shift supply right.',
      { svg: FIG_SL, family: 'fig-sl' }),
    mc('read-diagram', 'The diagram shows a change in the market for the Kenyan shilling. What does it show?',
      'Supply has fallen, so the exchange rate rises and the quantity falls',
      ['Demand has risen, so the exchange rate rises and the quantity rises', 'Supply has risen, so the exchange rate falls and the quantity rises', 'Supply has fallen, so the exchange rate falls and the quantity falls'],
      'S has moved left to S1. Where S1 crosses D, the exchange rate e1 is above e0 and the quantity Q1 is below Q0.',
      { svg: FIG_SL, family: 'fig-sl' }),
    mc('new-equilibrium', PTS_Q + 'Foreign demand for Chilean copper exports rises. Which point shows the new equilibrium?',
      'Point W', ['Point X', 'Point Y', 'Point Z'],
      'Buyers of copper must pay in pesos, so demand for pesos shifts right: a higher exchange rate and a higher quantity, which is point W.' + PTS_WHY,
      { svg: FIG_PTS, family: 'fig-pts' }),
    mc('new-equilibrium', PTS_Q + 'Chileans buy many more cars imported from South Korea. Which point shows the new equilibrium?',
      'Point X', ['Point W', 'Point Y', 'Point Z'],
      'Chileans sell pesos to pay for imports, so supply of pesos shifts right: a lower exchange rate and a higher quantity, which is point X.' + PTS_WHY,
      { svg: FIG_PTS, family: 'fig-pts' }),
    mc('new-equilibrium', PTS_Q + 'Chile\'s central bank cuts interest rates while rates elsewhere stay the same. Which point shows the new equilibrium?',
      'Point Y', ['Point W', 'Point X', 'Point Z'],
      'Lower interest rates attract less hot money, so demand for pesos shifts left: a lower exchange rate and a lower quantity, which is point Y.' + PTS_WHY,
      { svg: FIG_PTS, family: 'fig-pts' }),
    mc('new-equilibrium', PTS_Q + 'Chileans cut back on imported electronics. Which point shows the new equilibrium?',
      'Point Z', ['Point W', 'Point X', 'Point Y'],
      'Fewer imports means Chileans sell fewer pesos, so supply of pesos shifts left: a higher exchange rate and a lower quantity, which is point Z.' + PTS_WHY,
      { svg: FIG_PTS, family: 'fig-pts' }),
    mc('new-equilibrium', PTS_Q + 'Speculators start buying pesos because they expect the peso to rise. Which point shows the new equilibrium?',
      'Point W', ['Point X', 'Point Y', 'Point Z'],
      'Speculative buying adds to demand for pesos, so demand shifts right: a higher exchange rate and a higher quantity, which is point W.' + PTS_WHY,
      { svg: FIG_PTS, family: 'fig-pts' }),
    mc('new-equilibrium', 'Which combination of changes shows a <b>leftward shift of supply</b> in a currency market?',
      'A higher exchange rate with a lower quantity traded',
      ['A higher exchange rate with a higher quantity traded', 'A lower exchange rate with a higher quantity traded', 'A lower exchange rate with a lower quantity traded'],
      'When supply falls, the currency becomes scarcer, so its price rises while the amount traded falls. Price and quantity moving the same way would show a shift of demand instead.')
  ] };

  // =====================================================================
  // ECO-T22-14 Rising and falling currencies: effects on trade and the current account
  // =====================================================================
  var TERMS = ['appreciation', 'depreciation', 'revaluation', 'devaluation'];
  B['ECO-T22-14'] = { title: 'Rising and falling currencies: effects on trade and the current account', items: [
    { skill: 'terms', gen: function () {
      var fixed = Math.random() < 0.5, up = Math.random() < 0.5;
      var land = pick(['Kaldora', 'Merovia', 'Sundara', 'Penhallow']);
      var q = fixed
        ? 'The government of ' + land + ' fixes the value of its currency against the US dollar. It announces that the official rate will be ' + (up ? 'raised' : 'lowered') + ' from next Monday. What is this change called?'
        : 'The currency of ' + land + ' floats freely, with no government intervention. Over the last six months market forces have ' + (up ? 'pushed its value up' : 'pushed its value down') + ' against the US dollar. What is this change called?';
      var right = fixed ? (up ? 'Revaluation' : 'Devaluation') : (up ? 'Appreciation' : 'Depreciation');
      var why = fixed ? 'In a fixed system the government sets the rate, so an official ' + (up ? 'increase is a revaluation' : 'decrease is a devaluation') + '. Appreciation and depreciation describe market-driven changes.'
        : 'In a floating system the market sets the rate, so a ' + (up ? 'rise is an appreciation' : 'fall is a depreciation') + '. Revaluation and devaluation are official changes in a fixed system.';
      return Q(q, right, TERMS.map(function (t) { return t.charAt(0).toUpperCase() + t.slice(1); }).filter(function (t) { return t !== right; }), why);
    } },
    mc('terms', 'What is meant by <b>devaluation</b>?',
      'A decrease in the value of a currency that the government sets in a fixed exchange rate system',
      ['A decrease in the value of a currency caused by market forces in a floating exchange rate system', 'An increase in the value of a currency that the government sets in a fixed exchange rate system', 'A fall in the average level of prices in an economy over a period of time'],
      'Devaluation has two parts: a fall in the exchange rate (1) that is set officially by the government in a fixed system (1). A market-driven fall is depreciation; a fall in the price level is deflation.'),
    mc('terms', 'What is meant by <b>appreciation</b>?',
      'A rise in the exchange rate caused by market forces in a floating system',
      ['An official rise in the exchange rate set by the government in a fixed system', 'A fall in the exchange rate caused by market forces in a floating system', 'A rise in the value of a country\'s exports compared with its imports'],
      'Appreciation means the currency rises in value (1) because of demand and supply in a floating system, without government setting the rate (1). An official rise is a revaluation.'),
    mc('terms', 'Which of the following is an example of a <b>revaluation</b>?',
      'A government with a fixed rate officially raises it from 1 tal = $0.40 to 1 tal = $0.44',
      ['A floating currency rises from 1 tal = $0.40 to 1 tal = $0.44 as demand for it grows', 'A government with a fixed rate officially lowers it from 1 tal = $0.44 to 1 tal = $0.40', 'A floating currency falls from 1 tal = $0.44 to 1 tal = $0.40 as the supply of it grows'],
      'A revaluation is an official increase in the value of a currency in a fixed exchange rate system. A market-driven rise is an appreciation, and an official fall is a devaluation.'),
    { skill: 'read-rates', gen: function () {
      var h = pick([{ c: GBP, f: USD }, { c: EUR, f: USD }, { c: AUD, f: JPY }, { c: CAD, f: EUR }]);
      var base = h.c === AUD ? pick([96, 98, 100]) : (h.c === CAD ? pick([0.66, 0.68, 0.7]) : pick([1.1, 1.2, 1.3]));
      var step = h.c === AUD ? pick([4, 6, 8]) : pick([0.04, 0.06, 0.08]);
      var down = Math.random() < 0.5;
      var a = base, b = R.roundDp(down ? base - step : base + step, 2);
      var nm = h.c === EUR ? 'euro' : h.c.one;
      var q = 'In a floating exchange rate system, the rate moves from 1 ' + nm + ' = ' + rate(a) + ' ' + h.f.name + ' in January to 1 ' + nm + ' = ' + rate(b) + ' ' + h.f.name + ' in July. What has happened to the ' + nm + '?';
      var right = down ? 'It has depreciated: each ' + nm + ' now buys fewer ' + h.f.name : 'It has appreciated: each ' + nm + ' now buys more ' + h.f.name;
      var wrong = down ? ['It has appreciated: each ' + nm + ' now costs fewer ' + h.f.name, 'It has been devalued by its government', 'It has been revalued by its government']
        : ['It has depreciated: each ' + nm + ' now costs more ' + h.f.name, 'It has been revalued by its government', 'It has been devalued by its government'];
      return Q(q, right, wrong, 'Check what one ' + nm + ' buys: ' + rate(a) + ' ' + h.f.name + ' before and ' + rate(b) + ' after. It now buys ' + (down ? 'fewer' : 'more') + ', so the ' + nm + ' has ' + (down ? 'fallen' : 'risen') + ' in value. The system is floating, so this is ' + (down ? 'depreciation' : 'appreciation') + ', not ' + (down ? 'devaluation' : 'revaluation') + '.');
    } },
    { skill: 'read-rates', gen: function () {
      var a = pick([140, 145, 150]), d = pick([5, 8, 10, 12]), up = Math.random() < 0.5;
      var b = up ? a + d : a - d;
      var q = 'The exchange rate changes from $1 = ¥' + a + ' to $1 = ¥' + b + '. Both currencies float freely. What has happened to the <b>yen</b>?';
      var right = up ? 'The yen has depreciated against the dollar' : 'The yen has appreciated against the dollar';
      var wrong = up ? ['The yen has appreciated against the dollar', 'The dollar has depreciated against the yen', 'The yen has been devalued by the government']
        : ['The yen has depreciated against the dollar', 'The dollar has appreciated against the yen', 'The yen has been revalued by the government'];
      return Q(q, right, wrong, 'The rate is quoted per dollar. It now takes ' + b + ' yen to buy one dollar instead of ' + a + ', so each yen is worth ' + (up ? 'less' : 'more') + '. The yen has ' + (up ? 'depreciated' : 'appreciated') + ' (and the dollar has ' + (up ? 'appreciated' : 'depreciated') + ').');
    } },
    { skill: 'read-rates', gen: function () {
      var old = pick([1.2, 1.25, 1.5, 1.6, 2, 2.5]), p = pick([4, 5, 8, 10, 12, 15, 20]), down = Math.random() < 0.5;
      var nw = R.roundDp(old * (1 + (down ? -p : p) / 100), 4);
      var cur = pick([{ n: 'Sundaran dollar', f: 'euros' }, { n: 'Merovian pound', f: 'US dollars' }, { n: 'Kaldoran mark', f: 'euros' }]);
      var q = 'The ' + cur.n + ' floats freely. Its exchange rate moves from 1 ' + cur.n + ' = ' + rate(old) + ' ' + cur.f + ' to 1 ' + cur.n + ' = ' + rate(nw) + ' ' + cur.f + '. By what percentage has the ' + cur.n + (down ? ' depreciated' : ' appreciated') + '?';
      return N(q, p, '%', 'Percentage change = (new − old) ÷ old × 100 = (' + rate(nw) + ' − ' + rate(old) + ') ÷ ' + rate(old) + ' × 100 = ' + (down ? '−' : '') + p + '%. So the currency has ' + (down ? 'depreciated' : 'appreciated') + ' by ' + p + '%.');
    } },
    { skill: 'price-effects', gen: function () {
      var pH = pick([2400, 3000, 3600, 4800, 6000]), a = pick([0.5, 0.4]), down = Math.random() < 0.5;
      var b = down ? R.roundDp(a - 0.05, 2) : R.roundDp(a + 0.05, 2);
      var nw = R.roundDp(pH * b, 2), old = R.roundDp(pH * a, 2);
      var q = 'A furniture maker in Merovia sells a dining table for M$' + num(pH) + ' (Merovian dollars). The exchange rate changes from M$1 = $' + a.toFixed(2) + ' to M$1 = $' + b.toFixed(2) + ' (US dollars). The price in Merovian dollars stays the same. What is the new price of the table for a US buyer, in US dollars ($)?';
      return N(q, nw, '$', 'New price = ' + num(pH) + ' × ' + b.toFixed(2) + ' = $' + num(nw) + ' (it was ' + num(pH) + ' × ' + a.toFixed(2) + ' = $' + num(old) + '). The Merovian dollar has ' + (down ? 'depreciated, so the export has become cheaper' : 'appreciated, so the export has become dearer') + ' for US buyers.');
    } },
    { skill: 'price-effects', gen: function () {
      var a = pick([1.5, 2, 2.5]), stronger = Math.random() < 0.5;
      var b = R.roundDp(a * (stronger ? 1.1 : 0.9), 2);
      var nw = pick(b > 2 ? [200, 300, 400] : [300, 400, 500, 600]), pF = R.roundDp(nw * b, 2);
      var q = 'A shop in Sundara imports bicycles priced at €' + num(pF, pF % 1 ? 2 : 0) + ' each. The exchange rate moves from S$1 = €' + a.toFixed(2) + ' to S$1 = €' + b.toFixed(2) + ' (Sundaran dollars). What does one bicycle now cost the shop in Sundaran dollars (S$)?';
      return N(q, nw, 'S$', 'Euros to Sundaran dollars: divide by the rate. ' + num(pF, pF % 1 ? 2 : 0) + ' ÷ ' + b.toFixed(2) + ' = S$' + num(nw, nw % 1 ? 2 : 0) + '. The Sundaran dollar has ' + (stronger ? 'appreciated, so imports have become cheaper' : 'depreciated, so imports have become dearer') + ' (before, it cost S$' + num(pF / a, 2) + ').', 0.005);
    } },
    mc('price-effects', 'The Malaysian ringgit depreciates against the US dollar. What happens to the price of Malaysian exports in the US and the price of US imports in Malaysia?',
      'Malaysian exports become cheaper in the US; US imports become dearer in Malaysia',
      ['Malaysian exports become dearer in the US; US imports become cheaper in Malaysia', 'Malaysian exports become cheaper in the US; US imports become cheaper in Malaysia', 'Malaysian exports become dearer in the US; US imports become dearer in Malaysia'],
      'Each dollar now buys more ringgit, so US buyers pay fewer dollars for the same Malaysian good. Malaysians need more ringgit to buy each dollar, so imports from the US cost more.'),
    mc('price-effects', 'The Swiss franc appreciates strongly. A Swiss chocolate firm keeps its price in francs the same. What is the most likely effect on its sales abroad?',
      'Sales abroad fall, because the chocolate now costs more in foreign currencies',
      ['Sales abroad rise, because the chocolate now costs less in foreign currencies', 'Sales abroad rise, because Swiss firms now pay more for imported cocoa', 'Sales abroad are unchanged, because the price in francs has not changed'],
      'After an appreciation, foreign buyers must give up more of their own currency to buy each franc, so the chocolate is dearer for them. Demand for the export is likely to fall.'),
    mc('trade-volumes', 'The government of Penhallow devalues its currency. Why is it most likely to have done this?',
      'To make its exports cheaper abroad and so raise demand for them',
      ['To make its imports cheaper so that households can buy more', 'To make its exports dearer so that foreign firms earn more', 'To make borrowing cheaper for firms that invest at home'],
      'Governments devalue mainly to boost demand for exports. A lower official rate means foreign buyers pay less of their currency for the country\'s goods, so they buy more.'),
    mc('trade-volumes', 'The Indian rupee depreciates by 10%. Which chain correctly shows the effect on India\'s current account?',
      'Exports cheaper abroad → more exports sold; imports dearer → fewer imports bought → current account improves',
      ['Exports dearer abroad → fewer exports sold; imports cheaper → more imports bought → current account worsens', 'Exports cheaper abroad → fewer exports sold; imports dearer → more imports bought → current account improves', 'Exports cheaper abroad → more exports sold; imports cheaper → more imports bought → current account worsens'],
      'A weaker rupee lowers the foreign price of Indian goods and raises the rupee price of imports. More exports and fewer imports mean more money flows in than before, so the current account improves.'),
    mu('trade-volumes', 'The Brazilian real appreciates by 15%. Which of the following are likely results for Brazil?',
      ['Brazilian exports become less price competitive abroad', 'Brazilians buy more imported goods', 'The current account balance worsens'],
      ['Brazilian exports become cheaper for foreign buyers', 'Imports into Brazil become more expensive'],
      'A stronger real makes Brazilian goods dearer abroad, so exports fall, and makes imports cheaper in Brazil, so imports rise. Lower exports and higher imports worsen the current account.'),
    mc('trade-volumes', 'A student writes: "The Kenyan shilling depreciated, so Kenya\'s current account improved." What is missing from the chain?',
      'The price and volume steps: cheaper exports and dearer imports, so exports rise and imports fall',
      ['The definition of the current account as the record of all government spending and taxation', 'The fact that a depreciation always makes both exports and imports dearer in every market', 'A statement that the shilling must have been devalued officially by the Kenyan government'],
      'Examiners reward the links: the weaker shilling lowers export prices abroad and raises import prices at home, so export volumes rise and import volumes fall, which then improves the current account.'),
    mc('trade-volumes', 'Which of the following would be a likely <b>disadvantage</b> for an economy of a large appreciation of its currency?',
      'Exporters lose sales abroad, so output and jobs in export industries may fall',
      ['Imported raw materials become more expensive for domestic manufacturers', 'Inflation rises because imported goods become dearer for households', 'The current account improves because imports become less attractive'],
      'An appreciation makes exports dearer abroad, so export firms may sell less and cut jobs. It actually makes imports cheaper, which tends to lower inflation and worsen the current account.'),
    mc('knock-on', 'The currency of Kaldora depreciates sharply. Kaldora imports most of its fuel and food. Which is the most likely knock-on effect?',
      'Inflation rises because imported fuel and food become dearer',
      ['Inflation falls because imported fuel and food become cheaper', 'Unemployment rises because export firms lose sales', 'Exports fall because they become dearer for foreign buyers'],
      'A weaker currency raises the price of imports. If a country relies on imported fuel and food, these higher costs feed into prices, so inflation rises (cost-push).'),
    mc('knock-on', 'Which is a likely benefit of an appreciating currency for a country\'s households?',
      'Imported goods and foreign holidays become cheaper',
      ['Their wages automatically rise by the same percentage', 'The prices of goods made for export fall at home', 'Interest rates on their savings must rise'],
      'A stronger currency buys more foreign currency, so imports and holidays abroad cost less. This can also help to keep inflation down.'),
    mc('evaluate', 'The currency of Sundara depreciates by 12%. Its main exports are specialist medical scanners that buyers choose for their quality. Why might export sales rise only a little?',
      'Demand for the scanners is price inelastic, so buyers respond little to the lower price',
      ['Demand for the scanners is price elastic, so buyers respond strongly to the lower price', 'A depreciation makes exports dearer, so foreign buyers turn away from Sundara', 'The depreciation is too large for any foreign buyer to notice the change'],
      'How much exports rise depends on price elasticity of demand. If buyers choose on quality and there are few substitutes, a lower price brings only a small rise in quantity demanded.'),
    mc('evaluate', 'A firm says: "Our currency has depreciated, so our export sales will definitely rise." Which is the strongest counter-argument?',
      'The depreciation may be small or short-lived, and rivals may cut their prices too',
      ['A depreciation always makes exports dearer, so sales must fall', 'Exports are not affected by exchange rates, only by interest rates', 'A depreciation only affects imports, never exports'],
      'The size and length of the change matter. A small or temporary fall in the currency, or rival firms cutting prices, may leave export sales almost unchanged.'),
    mu('evaluate', 'A country\'s currency depreciates. Which factors would make the <b>improvement</b> in its current account <b>smaller</b>?',
      ['Demand for its exports is price inelastic', 'Its imports are mainly essential fuel with price inelastic demand', 'The depreciation is reversed after a few weeks'],
      ['Demand for its exports is price elastic', 'The depreciation is large and lasts for several years'],
      'The improvement depends on how far export and import volumes change. Inelastic demand for exports or for essential imports, or a short-lived change, all limit the response. Elastic demand and a large, lasting fall make it bigger.'),
    mc('knock-on', 'The currency of Merovia appreciates while Merovia has high inflation. Which is a likely benefit for Merovia?',
      'Cheaper imports help to bring inflation down',
      ['Dearer imports help to bring inflation down', 'Cheaper exports help to bring inflation down', 'Its current account deficit is sure to get smaller'],
      'An appreciation makes imported goods and raw materials cheaper in Merovia\'s currency. Lower import prices reduce costs and prices, which helps to reduce inflation.')
  ] };

  // =====================================================================
  // ECO-T21-14 Causes and effects of current account deficits and surpluses
  // =====================================================================
  B['ECO-T21-14'] = { title: 'Causes and effects of current account deficits and surpluses', items: [
    mc('cause-quality', 'A country has a current account surplus. Which change would most likely make the surplus <b>smaller</b>?',
      'Foreign firms make goods that its consumers see as better than local goods',
      ['Its own firms make goods that foreign buyers see as the best available', 'Tariffs on imported goods are raised, so foreign goods become dearer', 'Its firms keep their prices rising more slowly than rivals abroad'],
      'Better foreign goods raise demand for imports (and can cut demand for its exports), so more money flows out and the surplus shrinks. The other three would raise exports or cut imports, so the surplus would grow.'),
    mc('cause-quality', 'Smartphones made in other countries become much better than those made in Lorvania. What is the most likely effect on Lorvania\'s current account?',
      'It worsens, because Lorvanians buy more imported phones',
      ['It improves, because Lorvanians buy more imported phones', 'It improves, because Lorvanian exports become cheaper', 'It is unaffected, because quality does not change trade'],
      'Better foreign goods raise demand for imports (and can cut demand for Lorvania\'s own phones abroad). More money flows out, so the current account deficit grows or the surplus shrinks.'),
    mc('cause-quality', 'A student writes: "Ostravia\'s cars improved in quality, so exports rose." What is the best final link to show the effect on the current account?',
      'More money flows into Ostravia, so its current account balance improves',
      ['Ostravia\'s government receives more tax, so its fiscal deficit gets smaller', 'Ostravian car prices rise, so its rate of inflation becomes higher', 'Ostravia imports more cars, so its current account deficit gets larger'],
      'Higher export sales bring more money into the country. With more flowing in compared with what flows out for imports, the current account improves: a smaller deficit or a bigger surplus.'),
    mu('cause-quality', 'Which of the following would tend to <b>improve</b> a country\'s current account?',
      ['Better quality domestic goods', 'Lower prices of domestic goods compared with rivals', 'A depreciation of the country\'s currency'],
      ['Better quality foreign goods', 'A cut in tariffs on imported goods'],
      'Better and cheaper domestic goods, and a weaker currency, all raise exports or cut imports. Better foreign goods and lower tariffs make imports more attractive, which worsens the balance.'),
    mc('cause-price', 'Inflation in Taloria is 9% while its trading partners have inflation of 2%. What is the most likely effect on Taloria\'s current account?',
      'It worsens, as Talorian goods become dearer compared with foreign goods',
      ['It improves, as Talorian goods become cheaper compared with foreign goods', 'It improves, as imports become dearer compared with Talorian goods', 'It is unaffected, as prices are rising in all of these countries'],
      'Prices in Taloria rise faster than abroad, so its exports lose price competitiveness and imports look relatively cheaper. Exports fall and imports rise, so the current account worsens.'),
    mc('cause-price', 'The government of Vellmar cuts the tariff on imported clothing from 25% to 5%. What is the most likely effect on Vellmar\'s current account?',
      'It worsens, because cheaper imported clothing leads to more imports',
      ['It improves, because cheaper imported clothing leads to fewer imports', 'It improves, because Vellmar\'s clothing exports become cheaper abroad', 'It worsens, because the government receives less tax revenue'],
      'A lower tariff cuts the price of imported clothing in Vellmar, so consumers buy more imports. More money flows out of the country, so the current account worsens.'),
    mc('cause-price', 'Which of the following is a reason for a current account <b>deficit</b>?',
      'Domestic goods are priced higher than similar foreign goods',
      ['Foreign goods are priced higher than similar domestic goods', 'Domestic firms produce goods of better quality than foreign firms', 'The country\'s currency has depreciated against its trading partners'],
      'If domestic goods cost more than foreign ones, buyers at home and abroad choose foreign goods. Exports fall and imports rise, which can create a deficit.'),
    mc('cause-exchange-rate', 'Colombia\'s current account deficit grows after the Colombian peso appreciates. Which explanation is correct?',
      'The stronger peso made Colombian exports dearer and imports cheaper',
      ['The stronger peso made Colombian exports cheaper and imports dearer', 'The stronger peso raised Colombian interest rates, so imports fell', 'The stronger peso made Colombian goods better in quality than before'],
      'An appreciation means foreign buyers must pay more of their currency for Colombian goods, while Colombians can buy imports more cheaply. Exports fall and imports rise, so the deficit grows.'),
    mc('impact-deficit', 'Why is a current account deficit described as a <b>leakage</b> from the economy?',
      'Money spent on imports goes to foreign firms instead of domestic firms',
      ['Money is lost because the government charges taxes on all exports', 'Money leaves the economy because savers deposit it in local banks', 'Money is lost because domestic firms sell too many goods abroad'],
      'When households and firms spend more on imports than foreigners spend on exports, the extra spending flows abroad. Domestic firms receive less demand, so output can fall.'),
    mc('impact-deficit', 'Arnovia has a large current account deficit because households buy far more imports than the country exports. Which chain shows a likely impact?',
      'Less demand for domestic firms → lower output → fewer jobs',
      ['More demand for domestic firms → higher output → more jobs', 'Less demand for domestic firms → higher output → more jobs', 'More demand for imports → lower import prices → higher exports'],
      'Spending that goes on imports is not spent on domestic goods. Domestic firms sell less, so they produce less and need fewer workers, which can raise unemployment.'),
    mc('impact-deficit', 'A country has run a current account deficit for many years. Which problem is it most likely to face?',
      'Paying for the deficit by running down foreign currency reserves or borrowing',
      ['Building up very large foreign currency reserves that it cannot spend', 'Finding that its exports are worth far more than its imports each year', 'Seeing its currency rise steadily because of high demand for its goods'],
      'A deficit means more foreign currency is paid out than earned. The gap must be covered by using up reserves of foreign currency or by borrowing from abroad, which cannot go on forever.'),
    mc('impact-deficit', 'A current account deficit can be inflationary. When is this most likely?',
      'When prices rise abroad, so the many imports the country buys become dearer',
      ['When prices fall abroad, so the many imports the country buys become cheaper', 'When the country exports more, so domestic firms have spare capacity', 'When the deficit is small and the country buys hardly any imports'],
      'A country that relies on imports pays more when foreign prices rise. Dearer imported goods and materials push up the domestic price level (imported inflation).'),
    mu('impact-deficit', 'Which of the following are likely <b>costs</b> to an economy of a large and long-lasting current account deficit?',
      ['Lower demand for domestically produced goods', 'Job losses in industries that compete with imports', 'A need to borrow or use reserves to fund the deficit'],
      ['A rise in demand for the country\'s exports', 'A build-up of large foreign currency reserves'],
      'A deficit means spending leaks abroad, so domestic firms sell less and may cut jobs, and the gap must be financed. Rising export demand and growing reserves are features of a surplus, not a deficit.'),
    mc('surplus-benefit', 'Which is the most likely benefit of a current account surplus for a country?',
      'Strong export sales support jobs and raise GDP',
      ['Cheaper imports reduce the rate of inflation', 'Households can buy a wider range of imports', 'The government can cut spending on exports'],
      'A surplus comes from exports worth more than imports. Strong export demand means firms produce more and hire more workers, which raises GDP and living standards.'),
    mc('surplus-benefit', 'A country with a large current account surplus earns more foreign currency than it spends. What can it do with this foreign currency?',
      'Build up reserves or invest it abroad',
      ['Use it to pay the wages of public sector workers at home', 'Print more of its own currency to match the amount earned', 'Use it to cut the price of its own exports to zero'],
      'The extra foreign currency can be held as reserves (useful in a future crisis) or invested in other countries, earning income for the future.'),
    mc('evaluate', 'Which is the strongest argument that a small current account deficit may <b>not</b> be harmful?',
      'Consumers gain a wider choice of cheaper or better imported goods',
      ['A deficit always means the country has no exports at all', 'A deficit always leads to higher growth in domestic output', 'A deficit always makes the country\'s currency appreciate'],
      'A deficit is not always a disaster. Cheaper or better imports raise consumers\' living standards and can help keep inflation down, especially if the deficit is small and short-lived.'),
    mc('evaluate', 'Country P has a current account deficit of 0.5% of GDP for one year. Country Q has a deficit of 7% of GDP for ten years in a row. Which judgement is best?',
      'Q\'s deficit is more serious, because it is larger and has lasted longer',
      ['P\'s deficit is more serious, because it is newer and so harder to fund', 'The two deficits are equally serious, because both countries have deficits', 'Neither deficit matters, because a deficit never needs to be financed'],
      'The size of the deficit (as a share of GDP) and how long it lasts decide how serious it is. A large, long-lasting deficit is much harder to finance through reserves or borrowing.'),
    mc('evaluate', 'A current account deficit may correct itself over time through the exchange rate. How?',
      'High imports raise the supply of the currency, so it depreciates and exports become cheaper',
      ['High imports raise the demand for the currency, so it appreciates and exports become cheaper', 'High imports raise the supply of the currency, so it appreciates and imports become cheaper', 'High imports reduce the supply of the currency, so it depreciates and imports become cheaper'],
      'Paying for imports means selling the home currency, which adds to supply and pushes it down. A weaker currency makes exports cheaper and imports dearer, which tends to reduce the deficit.'),
    mc('evaluate', 'Cheap imports cause a current account deficit in Brenland. Which group is most likely to <b>gain</b>?',
      'Brenland households, who pay lower prices for imported goods',
      ['Brenland firms that compete directly with the cheap imports', 'Brenland workers in industries that compete with imports', 'Foreign firms whose goods have become harder to sell in Brenland'],
      'Cheap imports benefit consumers through lower prices and more choice. Domestic firms and workers who compete with those imports are the ones likely to lose.'),
    { skill: 'cause-quality', gen: function () {
      var land = pick(['Ostravia', 'Lorvania', 'Kaldora', 'Taloria']);
      var ev = pick([
        { t: 'foreign car makers launch models that ' + land + 'n buyers rate far above locally made cars', good: false, why: 'Better foreign goods raise demand for imports, so more money flows out.' },
        { t: land + 'n wine makers win international awards and foreign orders rise', good: true, why: 'Better domestic goods raise demand for exports, so more money flows in.' },
        { t: 'the government of ' + land + ' removes tariffs on imported electronics', good: false, why: 'Lower tariffs make imports cheaper, so imports rise and more money flows out.' },
        { t: 'foreign clothing brands raise their prices sharply', good: true, why: 'Dearer foreign goods reduce demand for imports, so less money flows out.' },
        { t: 'the ' + land + 'n currency appreciates by 20%', good: false, why: 'A stronger currency makes exports dearer and imports cheaper, so exports fall and imports rise.' },
        { t: land + 'n steel firms cut their costs and their prices fall below those of foreign rivals', good: true, why: 'Cheaper domestic goods raise exports and reduce imports, so more money flows in and less flows out.' }
      ]);
      var q = land + ' has a current account deficit. Suppose that ' + ev.t + '. What is the most likely effect on the deficit?';
      var right = ev.good ? 'The deficit gets smaller' : 'The deficit gets larger';
      return Q(q, right, [ev.good ? 'The deficit gets larger' : 'The deficit gets smaller', 'The deficit is unaffected', 'The deficit turns into a fiscal deficit'], ev.why + ' So the current account deficit gets ' + (ev.good ? 'smaller' : 'larger') + '.');
    } },
    mc('cause-exchange-rate', 'Over three years Country X moves from a current account surplus to a deficit. Which of the following could explain this?',
      'Its currency appreciated strongly against its trading partners\' currencies',
      ['Foreign goods became much poorer in quality than goods made in Country X', 'Its firms cut their prices below those of their main foreign rivals', 'Foreign governments removed the tariffs they charged on its exports'],
      'A stronger currency makes Country X\'s exports dearer abroad and imports cheaper at home, so exports fall and imports rise. The other three would raise exports or cut imports, improving the balance.'),
    mc('surplus-benefit', 'A current account surplus can also bring problems. Which is a likely one?',
      'High demand for the currency can make it appreciate, so exports become dearer',
      ['High supply of the currency makes it depreciate, so imports become dearer', 'Domestic firms lose export sales because their goods are too cheap abroad', 'The country runs out of foreign currency reserves to pay for its imports'],
      'A surplus means foreigners are buying a lot of the country\'s currency to pay for its exports. This pushes the currency up, which can later reduce export sales.')
  ] };

  // =====================================================================
  // ECO-T21-35 Macroeconomic objectives and trade-offs
  // =====================================================================
  B['ECO-T21-35'] = { title: 'Macroeconomic objectives and trade-offs', items: [
    mu('objectives', 'Which of the following are macroeconomic objectives of a government?',
      ['Low and stable inflation', 'Low unemployment', 'Protection of the environment'],
      ['Maximum profit for firms', 'A rise in the price of shares'],
      'The macroeconomic objectives are economic growth, low and stable inflation, low unemployment, a balance or surplus on the current account, protection of the environment and redistribution of income. Profit and share prices are aims of firms and investors.'),
    mc('objectives', 'Which of the following is a macroeconomic objective of a government?',
      'Redistribution of income', ['Higher prices for imports', 'More profit for a single firm', 'A rise in the interest rate'],
      'Redistribution of income (reducing the gap between rich and poor) is one of the government\'s macroeconomic objectives. An interest rate is a policy tool, not an objective in itself.'),
    mc('objectives', 'A student states "a good economy" as a macroeconomic objective. Which answer would gain the mark instead?',
      'A balance or surplus on the current account',
      ['A strong economy that everyone is happy with', 'Lots of shops with plenty of goods for sale', 'An economy that is doing better than last year'],
      'Marks go to a named objective such as a current account balance or surplus, economic growth or low unemployment. Vague phrases do not show knowledge of the objectives.'),
    mc('definition', 'What is meant by a <b>trade-off</b> between macroeconomic objectives?',
      'A choice between two objectives, where more of one means less of the other',
      ['The next best alternative given up when an individual makes a choice about spending', 'Exchanging goods and services with other countries in return for money', 'An agreement between two countries to remove tariffs on each other\'s goods'],
      'A trade-off has two parts: a choice between two objectives, and getting more of one means getting less of the other. The next best alternative given up is opportunity cost, a different idea.'),
    mc('definition', 'Which of the following is an example of a trade-off between objectives?',
      'Stricter pollution limits lead to slower economic growth',
      ['Faster economic growth leads to lower unemployment', 'Lower inflation leads to more stable prices', 'Higher employment leads to higher incomes'],
      'In a trade-off, gaining one objective harms another. Protecting the environment with strict pollution limits raises firms\' costs and can slow growth. Growth and lower unemployment usually go together, so they are not a trade-off.'),
    mc('unemployment-inflation', 'Unemployment in Dalvia falls from 8% to 4%. Which chain explains how this might raise inflation?',
      'More people earn wages → spending rises → demand exceeds supply → prices rise',
      ['More people earn wages → spending falls → demand exceeds supply → prices rise', 'More people earn wages → firms\' costs fall → supply rises → prices rise', 'Fewer people earn wages → spending rises → supply exceeds demand → prices rise'],
      'With more people in work, incomes and spending rise. If firms cannot raise output fast enough, demand outruns supply and prices are pulled up (demand-pull inflation).'),
    mc('unemployment-inflation', 'Unemployment is very low, so firms struggle to find workers. How can this cause <b>cost-push</b> inflation?',
      'Firms raise wages to attract staff, so costs rise and firms put up prices',
      ['Firms cut wages because staff are scarce, so their prices fall', 'Households spend more because they are in work, so prices rise', 'The government cuts taxes on firms, so firms raise their prices'],
      'When few workers are available, firms compete for them with higher wages. Higher wage costs are passed on as higher prices: cost-push inflation. Rising household spending is demand-pull, not cost-push.'),
    mu('unemployment-inflation', 'Unemployment falls sharply. Which of the following could explain a rise in inflation?',
      ['Higher household incomes increase spending', 'Firms must pay higher wages to attract scarce workers'],
      ['Fewer workers means firms produce more output', 'Lower unemployment reduces consumer confidence', 'Spending on unemployment benefits rises'],
      'Lower unemployment can cause demand-pull inflation (more income, more spending) and cost-push inflation (higher wages to attract staff). Benefit spending falls, not rises, when unemployment falls.'),
    mc('unemployment-inflation', 'A student writes: "Lower unemployment reduces inflation because workers are happier." What is the main error?',
      'The direction is wrong: lower unemployment tends to raise inflation',
      ['Unemployment and inflation are not macroeconomic objectives at all', 'The answer should say happier workers always demand lower wages', 'Lower unemployment can only affect the current account'],
      'Falling unemployment usually pushes inflation up, through more spending (demand-pull) and higher wages (cost-push). The student also gives no economic chain.'),
    mc('growth-inflation', 'Real GDP in Taloria grows by 7% a year, but firms are already working at full capacity. What is the most likely effect?',
      'Inflation rises, because demand grows faster than firms can supply',
      ['Inflation falls, because firms are producing as much as they can', 'Unemployment rises, because firms cannot produce any more', 'The current account improves, because firms export their spare output'],
      'Fast growth raises incomes and spending. If supply cannot keep up because firms are at capacity, the extra demand pulls prices up.'),
    mc('growth-environment', 'Why can economic growth conflict with protection of the environment?',
      'More output uses more resources and creates more pollution',
      ['More output always reduces carbon emissions per person', 'Growth means firms produce less, so land is left unused', 'Higher incomes stop people from buying more goods'],
      'Producing more goods usually uses more energy and raw materials and creates more waste and emissions. Gaining growth can therefore mean losing environmental protection.'),
    mc('growth-environment', 'A government introduces strict limits on factory emissions. Which trade-off is most likely?',
      'Firms\' costs rise, so output and growth may slow',
      ['Firms\' costs fall, so output and growth speed up', 'Inflation falls, so unemployment must fall too', 'Exports rise, so the current account worsens'],
      'Meeting tighter rules means paying for cleaner equipment or cutting output, which raises costs. Protecting the environment may therefore come at the cost of slower growth.'),
    mc('growth-environment', 'Which of the following could reduce the trade-off between economic growth and environmental protection?',
      'Firms switching to renewable energy and greener technology',
      ['Firms building more coal-fired power stations', 'The government removing all limits on pollution', 'Consumers buying more single-use plastic goods'],
      'Green technology lets an economy produce more while polluting less, so growth and environmental protection can happen together. The other options add pollution.'),
    mc('inflation-current-account', 'Inflation in Brenland is 12%, much higher than in its trading partners. Which chain shows the likely effect on its current account?',
      'Brenland\'s exports become less price competitive → exports fall → current account worsens',
      ['Brenland\'s exports become more price competitive → exports rise → current account improves', 'Imports become dearer than Brenland\'s goods → imports fall → current account improves', 'Brenland\'s exports become less price competitive → imports fall → current account improves'],
      'With prices rising faster at home than abroad, Brenland\'s goods become dearer than foreign goods. Foreign buyers buy fewer exports and Brenlanders switch to imports, so the current account worsens.'),
    mc('inflation-current-account', 'High inflation in a country makes imports appear relatively cheaper. Why does this worsen the current account?',
      'Consumers switch from dearer domestic goods to imports, so more money flows out',
      ['Consumers switch from imports to domestic goods, so less money flows out', 'Foreign buyers switch to the country\'s exports, so more money flows in', 'The government must tax imports, so less money flows into the country'],
      'If domestic prices rise faster than foreign prices, imported goods look better value. Spending on imports rises, which adds to the money flowing out of the country.'),
    mc('inflation-current-account', 'A government reduces inflation by raising interest rates. Which effect on the current account is most likely in the short run?',
      'It may worsen, because the currency appreciates and exports become dearer',
      ['It must improve, because higher interest rates make imports dearer', 'It is unaffected, because interest rates only affect borrowing', 'It must improve, because the currency depreciates and exports become cheaper'],
      'Higher interest rates attract hot money, so the currency appreciates. A stronger currency makes exports dearer and imports cheaper, which can worsen the current account: one objective is gained at the cost of another.'),
    { skill: 'data-trade-off', gen: function () {
      var y0 = pick([2018, 2019, 2020]);
      var kinds = shuf(['trade', 'bothUp', 'bothDown']);
      var u = [rint(5, 8) + 0.5], inf = [rint(2, 4) + 0.5];
      var ans = -1;
      kinds.forEach(function (k, i) {
        var du = pick([1, 1.5, 2]), di = pick([1, 1.5, 2]);
        if (k === 'trade') { u.push(u[i] - du); inf.push(inf[i] + di); ans = i; }
        else if (k === 'bothUp') { u.push(u[i] + du); inf.push(inf[i] + di); }
        else { u.push(u[i] - du); inf.push(inf[i] - di); }
      });
      // keep values realistic and positive
      var minU = Math.min.apply(null, u), minI = Math.min.apply(null, inf);
      if (minU < 2) u = u.map(function (x) { return x + (2 - minU); });
      if (minI < 0.5) inf = inf.map(function (x) { return x + (0.5 - minI); });
      var rows = u.map(function (x, i) { return [String(y0 + i), x.toFixed(1) + '%', inf[i].toFixed(1) + '%']; });
      var opts = [0, 1, 2].map(function (i) { return (y0 + i) + ' to ' + (y0 + i + 1); });
      var q = 'The table shows unemployment and inflation in Dalvia.<br>' + table(['Year', 'Unemployment rate', 'Inflation rate (CPI)'], rows) + 'Between which two years does the data best show the trade-off between unemployment and inflation?';
      return Q(q, opts[ans], opts.filter(function (_, i) { return i !== ans; }).concat(['None of these years show any link between the two']),
        'A trade-off means one objective improves while the other gets worse. From ' + opts[ans] + ' unemployment fell (' + rows[ans][1] + ' to ' + rows[ans + 1][1] + ') while inflation rose (' + rows[ans][2] + ' to ' + rows[ans + 1][2] + '). In the other periods both moved the same way.');
    } },
    mc('evaluate', 'A government wants faster growth but is worried about the trade-off with inflation. Which policy would best allow growth without much extra inflation?',
      'Supply-side policies that raise productive capacity, such as training workers',
      ['A large rise in government spending when the economy is already at full capacity', 'Cutting income tax for everyone when firms cannot produce any more output', 'Printing money to give every household a large cash payment'],
      'If productive capacity grows, supply can keep up with demand, so growth need not push prices up. Boosting demand when the economy is at capacity mainly raises inflation.'),
    mc('evaluate', 'When is the trade-off between lower unemployment and higher inflation likely to be <b>weakest</b>?',
      'When there is a lot of spare capacity and many unemployed workers',
      ['When firms are working at full capacity and workers are scarce', 'When wages are rising quickly because firms compete for staff', 'When demand is already far greater than what firms can supply'],
      'With spare capacity and unemployed workers available, firms can raise output without bidding up wages or prices, so unemployment can fall with little extra inflation.'),
    mc('evaluate', 'A country with high unemployment cuts interest rates to boost spending. Which objective is most at risk?',
      'Low and stable inflation', ['Low unemployment', 'Economic growth', 'Redistribution of income'],
      'Lower interest rates encourage borrowing and spending, which creates jobs and growth. But if demand rises faster than supply, prices rise, so low and stable inflation is put at risk.'),
    mc('growth-inflation', 'Which statement about growth and inflation is correct?',
      'Fast growth can raise inflation if demand rises faster than productive capacity',
      ['Fast growth always lowers inflation because many more goods and services are produced', 'Growth and inflation are not linked in any way at all', 'Inflation can only rise during a recession, never in a boom'],
      'When growth is driven by rising demand and firms cannot expand supply quickly enough, prices rise. Growth from higher productive capacity causes less inflation.'),
    mc('growth-environment', 'Taloria\'s real GDP rose by 6% but its carbon emissions rose by 9%. What does this data most clearly show?',
      'A trade-off between growth and protecting the environment',
      ['A trade-off between unemployment and inflation', 'A trade-off between inflation and the current account', 'That growth and environmental protection were both achieved'],
      'Higher output came with more emissions, so gaining growth meant losing environmental protection. This is the growth versus environment trade-off.')
  ] };

  // =====================================================================
  // ECO-T12-11 Small and large firms, and why firms stay small
  // =====================================================================
  B['ECO-T12-11'] = { title: 'Small and large firms, and why firms stay small', items: [
    mc('niche', 'What is meant by a <b>niche market</b>?',
      'A small, specialised part of a market for a particular product',
      ['A market with only one seller that controls the price', 'A large market where many firms sell identical goods at the same price', 'A market in which goods are sold only to other countries'],
      'A niche market is small and specialised: for example, gluten-free baking kits or hand-carved chess sets. A market with one seller is a monopoly.'),
    mc('niche', 'A student defines a niche market as "a small market". What is missing?',
      'The idea that the market is specialised, for a particular product',
      ['The idea that the market must be owned and run by the national government', 'The idea that prices in the market must be very low', 'The idea that the market must have only one seller'],
      'Small size is only half of it. A niche market is a small, specialised part of a market for a particular product, such as custom-made climbing shoes.'),
    mc('niche', 'Which of the following businesses is most clearly serving a niche market?',
      'A workshop making hand-built guitars for left-handed jazz players',
      ['A supermarket chain selling groceries in every large city', 'A national bus company running services between major towns', 'A factory producing millions of standard plastic bottles each year'],
      'Hand-built left-handed jazz guitars are a small, specialised product with a particular group of buyers, which is a niche market. The others serve large, mass markets.'),
    mc('small-advantages', 'Dev runs a small printing firm. He decides prices, which jobs to accept and when to close, without asking anyone. Which advantage of being small does this show?',
      'The owner keeps full control of decisions',
      ['Lower average costs from economies of scale', 'Risks spread across many products and markets', 'Easy access to finance from selling shares'],
      'In a small firm the owner makes the decisions himself, so he keeps control of how the business is run. The other options are advantages of large firms.'),
    mc('small-advantages', 'Amara runs a small tailoring shop and knows each customer\'s measurements and preferences. Which advantage of being small does this show?',
      'Personal service tailored to each customer',
      ['Economies of scale from bulk buying of cloth', 'Power to set prices across the whole market', 'Easy access to loans from many different banks'],
      'Because Amara deals with each customer herself, she can give personal service that a large chain would find hard to match. This can keep customers loyal.'),
    mu('small-advantages', 'Which of the following are advantages of small firms?',
      ['The owner keeps control of decisions', 'They can serve niche markets profitably', 'They can adapt quickly to changes in demand'],
      ['They gain large economies of scale', 'They find it easy to raise finance from banks'],
      'Control, flexibility and serving niche markets suit small firms. Economies of scale and easy access to finance are usually advantages of large firms.'),
    mc('large-advantages', 'Which of the following is an advantage of a <b>large</b> firm?',
      'It can spread risk by selling many products in many markets',
      ['It offers more personal service to each of its customers', 'Its owner can make every decision without consulting anyone', 'It can change products more quickly than a small rival'],
      'A large firm with many products and markets does not depend on just one, so a fall in one market is less damaging. The other options are strengths of small firms.'),
    mc('large-advantages', 'Why can a large supermarket chain usually sell bread more cheaply than a small village bakery?',
      'It buys flour in bulk, so its average cost per loaf is lower',
      ['It gives every customer more personal service', 'It serves a smaller niche market than the bakery', 'It has fewer ways to raise finance than the small village bakery'],
      'Large firms gain economies of scale such as bulk-buying discounts, which lower the average cost of each unit and allow lower prices.'),
    mu('large-advantages', 'Which of the following are usually advantages of being a <b>large</b> firm?',
      ['Lower average costs from economies of scale', 'More sources of finance, such as issuing shares', 'More market power over suppliers'],
      ['Closer personal contact with every customer', 'The owner keeps full control of every decision'],
      'Size brings economies of scale, more ways to raise money and power over suppliers. Personal contact and full owner control are more typical of small firms.'),
    mc('stay-small', 'Kofi runs the only bicycle repair shop on a small island with 900 residents. Which reason best explains why his firm stays small?',
      'The size of the market is small, so there are not enough customers to expand',
      ['He has easy access to large bank loans, so he does not need to grow', 'His costs are lower than those of any large firm because of economies of scale', 'The government does not allow firms on the island to grow'],
      'With only 900 residents, demand for bicycle repairs is limited. A bigger shop would not find enough extra customers to pay for itself.'),
    mc('stay-small', 'Lina wants to open a second café, but two banks refuse to lend to her because her business is new and has few assets. Which reason for staying small does this show?',
      'Lack of finance', ['Size of the market', 'Aims of the entrepreneur', 'Niche market'],
      'Banks often see small, new firms as risky because they have little to offer as security. Without a loan, Lina cannot pay for the second café, so the firm stays small.'),
    mc('stay-small', 'Tomás owns a successful pottery studio. He says: "I could open more studios, but I want to keep making pots myself and finish work at 4 p.m." Which reason for staying small does this show?',
      'The aims of the entrepreneur', ['Lack of finance', 'Size of the market', 'Economies of scale'],
      'Tomás chooses to stay small because he values control over the work and his lifestyle more than extra profit. These are the aims of the entrepreneur.'),
    mc('stay-small', 'Priya makes made-to-order stained-glass windows, each designed with the customer. Why might this make it hard for her firm to grow?',
      'Each window is unique, so it cannot be mass-produced to cut costs',
      ['Demand for made-to-order windows is far too large to meet', 'Stained-glass windows can only be sold to the government', 'Banks are required by law to lend money to any firm that makes windows'],
      'A niche, made-to-order product needs time with each customer and cannot be made in large batches. Growth would bring few economies of scale and could lose the personal touch customers pay for.'),
    mu('stay-small', 'Which of the following are reasons why firms stay small?',
      ['The market for the product is small', 'The owner wants to keep control and a good work-life balance', 'Banks see the firm as too risky to lend to'],
      ['The firm enjoys large economies of scale', 'The firm has many shareholders who want it to grow'],
      'The specification lists size of market, niche markets, lack of finance and the aims of the entrepreneur. Economies of scale and growth-hungry shareholders push firms to grow.'),
    mc('stay-small', 'A student writes: "Femi stays small because he does not want to grow." How could the answer be developed?',
      'Explain why: for example, he wants to keep control and already earns enough',
      ['Add that large firms always make lower profits than small firms', 'Add that small firms never need any finance to operate', 'Replace it with an advantage of large firms such as risk spreading'],
      'Examiners want the reason behind the owner\'s aim, such as keeping control, a better lifestyle or being satisfied with current income, linked to the business in the case.'),
    mc('small-disadvantages', 'Which is a likely disadvantage of staying small?',
      'Higher average costs, because the firm cannot gain economies of scale',
      ['Too many sources of finance to choose from when it wants to invest', 'Being unable to give personal service to its customers', 'Being too slow to react because of many layers of management'],
      'Small firms buy and produce in small quantities, so they miss out on bulk discounts and other economies of scale. Their average cost per unit is usually higher than a large rival\'s.'),
    mc('small-disadvantages', 'A small firm sells one product in one town. Why is this risky?',
      'If demand in that town falls, the firm has no other sales to fall back on',
      ['The firm will gain too many economies of scale for the owner to manage well', 'The firm will have too many shareholders to consult', 'The firm will be forced to merge with a large rival'],
      'Depending on one product and one market concentrates risk. Large firms can spread risk across many products and places.'),
    mc('evaluate', 'Fern & Loom, a small firm, sells hand-woven rugs at high prices to loyal customers. It is offered a contract to supply a national furniture chain in bulk at a much lower price. What is the main argument for <b>staying small</b>?',
      'It may lose the handmade quality and premium price its niche customers pay for',
      ['It would gain economies of scale and lower its average cost per rug', 'It would sell a much larger number of rugs across the whole country', 'It would gain access to more sources of finance as it grows bigger'],
      'The firm\'s niche strength is a handmade product sold at a high price. Mass production for a furniture chain may cut quality and margins. The other options are arguments for growing.'),
    mc('evaluate', 'Which of the following would most strengthen the case for a small bakery to <b>grow</b>?',
      'Demand from nearby towns is rising, and growth would cut its average costs',
      ['The owner wants to keep baking every loaf herself and work fewer hours', 'The town is small and all its residents already buy from the bakery', 'The bakery\'s customers mainly value knowing the owner personally'],
      'Growth is worth it when there is enough extra demand and size brings lower average costs. The other options are reasons the bakery may do better staying small.'),
    mc('evaluate', 'A small bookshop owner is deciding whether to stay small. Which factor matters <b>most</b> to the judgement?',
      'Whether extra profit from growth outweighs lost control and personal service',
      ['Whether the shop is in the private sector or the public sector of the economy', 'Whether the shop sells goods or services to its customers', 'Whether the owner has ever heard of economies of scale'],
      'A good judgement weighs what growth would bring (economies of scale, more sales) against what being small offers (control, flexibility, personal service) for this owner.'),
    mu('evaluate', 'A small firm making custom bicycles is deciding whether to grow. Which points would support <b>staying small</b>?',
      ['Customers pay a premium for a personal, made-to-measure service', 'The owner values control over every bike that leaves the workshop'],
      ['A larger factory would cut the average cost of each bike', 'Growing would spread risk across more products and markets', 'Growing would give access to finance from selling shares'],
      'Personal service and owner control are strengths of staying small. Lower average costs, risk spreading and more finance are gains from growing.'),
    mc('small-advantages', 'A fashion trend changes suddenly. Why might a small boutique respond faster than a large clothing chain?',
      'The owner can decide alone and change stock quickly without long approval chains',
      ['It has far more sources of finance than the large chain', 'It benefits from much bigger bulk-buying discounts than the large national clothing chain', 'It produces much greater quantities than the large chain'],
      'Flexibility is a key strength of small firms: few people need to agree to a change, so the boutique can switch stock quickly while a large chain plans months ahead.')
  ] };

  // =====================================================================
  // ECO-T12-05 Division of labour: meaning, benefits and drawbacks
  // =====================================================================
  B['ECO-T12-05'] = { title: 'Division of labour: meaning, benefits and drawbacks', items: [
    mc('definition', 'What is meant by <b>division of labour</b>?',
      'Splitting production into small separate tasks, with each worker doing one task',
      ['Dividing the workforce into groups of equal size that each make complete products', 'Using more workers than machines to produce goods and services', 'The amount of output produced by each worker in a given time'],
      'Division of labour has two parts: the production process is broken into smaller tasks (1) and each worker does just one of them (1). Output per worker is productivity, a different idea.'),
    mc('definition', 'In a car plant, one worker only fits doors, another only fits seats and another only fits wheels. Which term describes this?',
      'Division of labour', ['Economies of scale', 'Capital intensive production', 'Labour turnover'],
      'Splitting production into tasks with each worker doing one is division of labour, a form of specialisation. Economies of scale are lower average costs from size, capital intensive means using more machines than labour, and labour turnover is the rate at which staff leave.'),
    mc('definition', 'A student writes: "Division of labour means dividing workers into teams." What is missing?',
      'Splitting production into separate tasks, with each worker doing only one',
      ['The idea that each team must make a different product for a different market', 'The idea that workers are paid according to output', 'The idea that machines replace all of the workers'],
      'The key idea is splitting the production process into smaller tasks, each done by one worker. Just putting workers into teams does not say anything about specialising in tasks.'),
    mc('definition', 'Which of the following is an example of division of labour?',
      'In a shoe factory, one worker cuts leather, another stitches and another adds soles',
      ['In a shoe factory, each worker makes a complete pair of shoes from start to finish alone', 'A shoe factory replaces all of its workers with robots', 'A shoe factory pays workers a bonus for every pair they make'],
      'Each worker doing one stage of the process is division of labour. One worker making whole pairs has no splitting of tasks.'),
    mc('firm-advantages', 'In a bakery, one worker only shapes the dough. Why does this raise output?',
      'She becomes faster and more skilled at shaping because she repeats it all day',
      ['She must learn every task in the bakery, so she gains many more different skills', 'She spends more time moving between different tasks and tools', 'She is paid more, so the bakery must make fewer loaves each day'],
      'Doing one task repeatedly makes a worker quicker and more skilled at it, so more loaves are shaped each hour. Productivity rises.'),
    mc('firm-advantages', 'Why does division of labour save time in a furniture workshop?',
      'Workers do not have to keep switching tools and moving between tasks',
      ['Workers have to learn every task, so training takes longer and costs more', 'Workers take turns on all tasks, so none get bored', 'Each worker makes a whole chair, so there is no waiting'],
      'When each worker stays at one task, no time is lost putting down one tool, picking up another and moving around. More chairs are produced in the same time.'),
    mc('firm-advantages', 'A sandwich bar introduces division of labour and its output rises. Which is the next link in the chain?',
      'Average cost per sandwich falls, so the firm can cut prices or earn more profit',
      ['Average cost per sandwich rises, so the firm must raise its prices', 'Workers need far more training in many tasks, so wages per worker must fall sharply', 'The firm needs more workers to make the same number of sandwiches'],
      'With the same workers producing more sandwiches, wage costs are spread over more units, so the average cost of each sandwich falls. Lower costs allow lower prices or more profit.'),
    mu('firm-advantages', 'Which of the following are advantages of division of labour for a <b>firm</b>?',
      ['Workers become quicker at their task', 'Less training is needed for each worker', 'Average cost per unit can fall'],
      ['Workers gain a wide range of skills', 'Production continues smoothly if one worker is absent'],
      'Specialised workers are faster, need training in only one task, and produce more, lowering average cost. They gain few skills, and an absence can stop the line, which are drawbacks.'),
    mc('worker-effects', 'Which is a disadvantage of division of labour for <b>workers</b>?',
      'Repeating the same task all day can be boring',
      ['Workers become faster at their task', 'Workers need less training to start work', 'Output per worker rises for the firm'],
      'Doing one task over and over is monotonous, which can lower motivation. The other options are benefits, mainly for the firm.'),
    mc('worker-effects', 'A factory worker spends every shift sticking labels on jars. Why might this make it harder for her to find another job later?',
      'She gains very few skills beyond labelling jars',
      ['She becomes skilled in every task in the factory', 'She is too productive for other firms to employ', 'She has gained management skills that are not needed'],
      'Specialising in one narrow task means a worker learns little else. If that task is automated or the job ends, she has few skills to offer other employers.'),
    mc('worker-effects', 'Which is a possible <b>advantage</b> of division of labour for workers?',
      'They become expert at their task and may feel more confident',
      ['They learn to do every job in the factory', 'They never have to repeat the same task', 'Their jobs cannot be replaced by machines'],
      'Becoming very good at one task can give a worker confidence and, in some firms, higher pay for speed. But simple repeated tasks are also the easiest to automate.'),
    mc('worker-effects', 'A firm splits a job into very simple tasks. Why might this put workers\' jobs at risk?',
      'Simple, repetitive tasks are easier to automate with machines',
      ['Simple tasks need highly skilled workers who are hard to find', 'Simple tasks make output fall, so the firm must close', 'Simple tasks require more workers than complex tasks'],
      'Once a job is broken into small repeated steps, a machine can often be built to do each step. Workers doing those steps may then lose their jobs.'),
    mc('firm-disadvantages', 'On a toy production line using division of labour, the worker who fits the wheels is off sick. What is the most likely problem?',
      'The whole line may stop, because no one else is trained to fit the wheels',
      ['Output rises, because the other workers have less to do', 'Average cost per toy falls, because one fewer worker is paid', 'Nothing changes, because every worker is trained to do every task on the line'],
      'Each worker depends on the stage before. If one task is not done and no one else knows it, production can halt, so output falls and average costs rise.'),
    mc('firm-disadvantages', 'Workers at a packing plant become bored by repeating one task and many leave. What is the effect on the firm?',
      'Higher labour turnover, so it pays more to recruit and train replacements',
      ['Lower labour turnover, so its recruitment costs fall', 'Higher productivity, because newly recruited workers are always faster than old ones', 'Lower average costs, because it pays fewer wages'],
      'Boredom lowers motivation and leads staff to leave. High labour turnover means extra costs of hiring and training, and new staff are slower at first.'),
    mu('firm-disadvantages', 'Which of the following are possible disadvantages of division of labour for a <b>firm</b>?',
      ['Bored workers make more mistakes', 'Production stops if one worker is absent', 'Products may become standardised'],
      ['Workers need more training in many tasks', 'Workers become slower at their task'],
      'Repetitive work can cause errors, the line relies on every worker being present, and products all come out the same. Division of labour cuts training needs and makes workers faster.'),
    { skill: 'productivity-calc', gen: function () {
      var n = pick([4, 5, 6, 8, 10]), before = pick([6, 8, 10, 12]), gain = pick([2, 3, 4, 5]);
      var good = pick([{ p: 'chairs' }, { p: 'pairs of sandals' }, { p: 'cakes' }, { p: 'lamps' }]);
      var outB = n * before, outA = n * (before + gain);
      var q = 'A workshop has ' + n + ' workers. When each worker made whole products, the workshop produced ' + outB + ' ' + good.p + ' a day. After introducing division of labour it produces ' + outA + ' ' + good.p + ' a day with the same workers. By how much has output per worker per day risen?';
      return N(q, gain, 'per worker', 'Productivity = output ÷ workers. Before: ' + outB + ' ÷ ' + n + ' = ' + before + '. After: ' + outA + ' ÷ ' + n + ' = ' + (before + gain) + '. The rise is ' + (before + gain) + ' − ' + before + ' = ' + gain + ' per worker per day.');
    } },
    { skill: 'productivity-calc', gen: function () {
      var n = pick([5, 8, 10, 12]), wage = pick([80, 90, 100, 120]), before = pick([100, 120, 160, 200]);
      var pct = pick([25, 50, 60]), after = before * (1 + pct / 100);
      var cost = n * wage, acB = R.roundDp(cost / before, 2), acA = R.roundDp(cost / after, 2);
      var q = 'A small factory employs ' + n + ' workers, each paid $' + wage + ' a day. It produced ' + before + ' units a day. After introducing division of labour, output rises to ' + after + ' units a day with the same workers and wages. Calculate the new labour cost per unit, in $, to 2 decimal places.';
      return N(q, acA, '$', 'Daily wage bill = ' + n + ' × $' + wage + ' = $' + num(cost) + '. New labour cost per unit = ' + num(cost) + ' ÷ ' + after + ' = $' + acA.toFixed(2) + ' (it was ' + num(cost) + ' ÷ ' + before + ' = $' + acB.toFixed(2) + '). More output from the same wages lowers the cost of each unit.', 0.005, acA.toFixed(2));
    } },
    mc('evaluate', 'A pottery workshop owner says: "Division of labour is the only way to raise my productivity." Which is the best counter-argument?',
      'Training staff or buying better equipment could also raise output per worker',
      ['Division of labour always reduces output per worker in every kind of firm and industry', 'Productivity cannot be raised in a business that makes pottery', 'Hiring more workers always raises output per worker'],
      'Division of labour is one way to raise productivity, but not the only one. Training and new technology can also raise output per worker, and may avoid boredom and turnover.'),
    mc('evaluate', 'For which business is division of labour likely to bring the <b>smallest</b> benefit?',
      'A one-person studio making unique, hand-painted portraits to order',
      ['A factory producing thousands of identical phone chargers each day', 'A burger chain serving hundreds of customers every hour', 'A bottling plant filling millions of bottles of water a week'],
      'Division of labour works best with large, repetitive output. A one-person studio making unique items cannot split the work between workers, so there is little to gain.'),
    mc('evaluate', 'A large hotel laundry uses strict division of labour. In which situation is it most likely to suffer from it?',
      'Several staff on key tasks are absent at the same time, so the work slows sharply',
      ['Orders rise and workers handle them faster than before', 'New staff are trained quickly because each learns only one task', 'The laundry washes the same kinds of sheets every day in bulk'],
      'When each worker does one task, the system depends on everyone being there. Absences on key tasks can cause hold-ups that cancel out the speed gains.'),
    mu('evaluate', 'A clothing factory is deciding whether to introduce division of labour. Which factors would make it <b>more</b> likely to benefit?',
      ['It produces large quantities of a standard product', 'Demand is high and steady throughout the year'],
      ['Every garment is a unique, made-to-measure design', 'It employs only one worker', 'Its workers would leave if their work became repetitive'],
      'Division of labour pays off when output is large and standardised and demand is steady, so specialised workers are kept busy. Unique products, a single worker or likely staff losses reduce the gain.'),
    mc('evaluate', 'A firm introduces division of labour, but output per worker rises less than expected. Which explanation is most likely?',
      'Workers became bored, so mistakes and staff turnover rose',
      ['Workers became faster at their tasks, so output rose', 'Workers spent less time switching between tasks', 'Workers needed less training to start their jobs'],
      'Boredom from repetitive work can lead to mistakes and staff leaving, which reduces the gains. The other options are reasons output would rise, not reasons it would disappoint.')
  ] };
})();
