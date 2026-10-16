/* Group G05 mastery bank: Globalisation, free trade and protection; Monetary and supply-side policy and the current account. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  /* ---------- small helpers ---------- */
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function fmt(n) { var s = String(n).split('.'); s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return s.join('.'); }
  function money(n, cur) { cur = cur || '$'; var dp = Math.round(n * 100) % 100 === 0 ? 0 : 2; var v = dp ? R.roundDp(n, 2).toFixed(2) : String(Math.round(n)); return (n < 0 ? '-' : '') + cur + fmt(v.replace('-', '')); }
  function bn(n, cur) { return (n < 0 ? '-' : '') + cur + fmt(String(Math.abs(n))) + 'bn'; }
  function two(a) { var s = shuffle(a); return [s[0], s[1]]; }
  function M(skill, q, options, answer, why, extra) { var o = { skill: skill, kind: 'mcq', q: q, options: options, answer: answer, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function MU(skill, q, options, answers, why) { return { skill: skill, kind: 'multi', q: q, options: options, answers: answers, why: why }; }
  function table(head, rows) {
    return '<table class="mc-table"><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }

  var COUNTRIES = ['Valdoria', 'Kestland', 'Marovia', 'Pellora', 'Zentara', 'Rivania', 'Aldovia', 'Calvaria', 'Norvela', 'Sundara', 'Ferrosa', 'Brevonia'];
  function countries() { return two(COUNTRIES); }

  /* ---------- diagram helpers (price on the vertical axis, quantity on the horizontal) ---------- */
  var INK = '#303a4c', HI = '#e4464f', BLUE = '#195d9b', GREY = '#9aa5b8';
  function r1(x) { return Math.round(x * 10) / 10; }
  function tx(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" fill="' + (o.col || INK) + '"' + (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') + (o.bold ? ' font-weight="bold"' : '') + (o.fs ? ' font-size="' + o.fs + '"' : '') + '>' + s + '</text>'; }
  function core(o) {
    var X = function (q) { return r1(o.ox + q * o.ux); }, Y = function (p) { return r1(o.oy - p * o.uy); };
    var fs = o.fs || 11, m = 10.4, s = '';
    s += '<line x1="' + o.ox + '" y1="' + Y(m) + '" x2="' + o.ox + '" y2="' + o.oy + '" stroke="' + INK + '" stroke-width="1.5"/>';
    s += '<line x1="' + o.ox + '" y1="' + o.oy + '" x2="' + X(m) + '" y2="' + o.oy + '" stroke="' + INK + '" stroke-width="1.5"/>';
    s += tx(o.ox - (o.small ? 4 : 30), Y(m) - 4, o.yl || 'Price ($)', { fs: fs });
    s += tx(X(m), o.oy + (o.small ? fs + 2 : 2 * fs + 20), o.xl || 'Quantity', { anchor: 'end', fs: fs });
    var qx = [];
    (o.guides || []).forEach(function (g) {
      s += '<path d="M' + o.ox + ' ' + Y(g.p) + ' H' + X(g.q) + (g.noq ? '' : ' V' + o.oy) + '" fill="none" stroke="' + GREY + '" stroke-width="1" stroke-dasharray="4 3"/>';
      if (g.pl) s += tx(o.ox - 4, Y(g.p) + 4, g.pl, { anchor: 'end', fs: fs });
      if (g.ql) { var low = qx.some(function (x) { return Math.abs(x - X(g.q)) < 36; }); qx.push(X(g.q)); s += tx(X(g.q), o.oy + fs + 3 + (low ? fs + 2 : 0), g.ql, { anchor: 'middle', fs: fs }); }
    });
    (o.lines || []).forEach(function (l) {
      s += '<line x1="' + X(l.a[0]) + '" y1="' + Y(l.a[1]) + '" x2="' + X(l.b[0]) + '" y2="' + Y(l.b[1]) + '" stroke="' + (l.col || INK) + '" stroke-width="2"' + (l.dash ? ' stroke-dasharray="6 4"' : '') + '/>';
      if (l.lab) s += tx(r1(X(l.b[0]) + 4), r1(Y(l.b[1]) - (l.b[1] > l.a[1] ? 2 : 4)), l.lab, { col: l.col || INK, fs: fs, bold: true });
    });
    (o.pts || []).forEach(function (pt) {
      s += '<circle cx="' + X(pt.q) + '" cy="' + Y(pt.p) + '" r="3.5" fill="' + (pt.col || BLUE) + '"/>';
      s += tx(r1(X(pt.q) + 6), r1(Y(pt.p) - 5), pt.lab, { col: pt.col || BLUE, bold: true, fs: fs + 1 });
    });
    if (o.letter) s += tx(X(5), r1(Y(m) - 6), o.letter, { bold: true, fs: 13, anchor: 'middle' });
    return s;
  }
  function svgWrap(w, h, label, inner) { return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="11">' + inner + '</svg>'; }
  function full(label, o) { o.ox = 62; o.oy = 185; o.ux = 20.5; o.uy = 16; return svgWrap(300, 235, label, core(o)); }
  // standard curves in 0-10 units: D is p = 10 - q, S is p = q + c
  function sLine(c, col, lab) { var q1 = Math.max(0.4, 0.4 - c), q2 = Math.min(9.6, 9.6 - c); return { a: [q1, q1 + c], b: [q2, q2 + c], col: col, lab: lab }; }
  function dLine(c, col, lab) { c = c || 0; var q1 = Math.max(0.4, c + 0.4), q2 = Math.min(9.2, 9.2 + c); return { a: [q1, 10 + c - q1], b: [q2, 10 + c - q2], col: col, lab: lab }; }
  function vLine(q, col, lab) { return { a: [q, 0], b: [q, 9.8], col: col, lab: lab }; }
  // four small diagrams A-D: kinds SL (supply left), SR, DL, DR
  function panels(order, label) {
    var inner = '';
    order.forEach(function (kind, i) {
      var col = i % 2, row = Math.floor(i / 2);
      var o = { ox: 26 + col * 150, oy: 122 + row * 130, ux: 11, uy: 8.4, fs: 9, small: true, yl: 'P', xl: 'Q', letter: 'ABCD'.charAt(i) };
      var lines = [dLine(0, INK, 'D'), sLine(0, INK, 'S')];
      if (kind === 'SL') lines.push(sLine(2, HI, 'S1'));
      if (kind === 'SR') lines.push(sLine(-2, HI, 'S1'));
      if (kind === 'DL') lines.push(dLine(-2, HI, 'D1'));
      if (kind === 'DR') lines.push(dLine(2, HI, 'D1'));
      o.lines = lines;
      inner += core(o);
    });
    return svgWrap(300, 270, label, inner);
  }
  function lettered(correctKind) {
    var kinds = shuffle(['SL', 'SR', 'DL', 'DR']);
    return { kinds: kinds, answer: kinds.indexOf(correctKind) };
  }

  /* =====================================================================
     ECO-T22-01 Globalisation: what it means and what drives it
     ===================================================================== */
  var DRIVERS = ['Fewer tariffs and quotas', 'Reduced cost of transport', 'Reduced cost of communication', 'Growing significance of MNCs'];
  var DRIVER_WHY = [
    'Removing taxes or limits on imports makes it cheaper and easier to trade across borders.',
    'Cheaper ways of moving goods cut the cost of each item traded, so more trade between countries is worthwhile.',
    'Cheaper ways of exchanging information let firms deal with distant buyers, suppliers and factories at low cost.',
    'Firms that produce and sell in many countries tie those economies together through their operations.'
  ];
  B['ECO-T22-01'] = { title: 'Globalisation: what it means and what drives it', items: [
    M('definition', 'Which of the following is the best definition of <b>globalisation</b>?',
      ["The growing integration and interdependence of the world's economies", 'A rise in the value of the goods and services one country sells abroad each year', 'A government policy of limiting imports in order to protect local jobs', 'The sale of state-owned firms to private shareholders'], 0,
      'Globalisation has two ideas: the world\'s economies becoming more connected (integrated) and more dependent on each other (interdependent). More exports by one country is only one sign of it.'),
    M('definition', 'A student writes: "Globalisation means more trade." Why would this earn only partial credit?',
      ['It misses the idea of economies becoming connected and dependent on each other', 'It should say that globalisation means less trade between countries', "It should define globalisation as the growth of one country's GDP over a period of time", 'It should say that globalisation involves only trade in services'], 0,
      'More trade is evidence of globalisation, but the definition needs the idea of growing integration or interdependence of the world\'s economies.'),
    M('definition', 'In the definition of globalisation, <b>interdependence</b> means that',
      ['economies rely on each other, so a change in one affects the others', 'each economy produces everything it needs within its own borders, without trading', 'governments agree to use one single currency for all trade', 'firms are owned by more than one government at the same time'], 0,
      'Interdependent economies depend on each other for goods, services, inputs and markets, so events in one spread to others.'),
    M('definition', 'Which event best illustrates the <b>interdependence</b> of the world\'s economies?',
      ['A flood shuts chip factories in Zentara, and car makers in three other countries halt production', "Kestland's government raises the rate of income tax paid by its own citizens on their wages and savings", 'A bakery in Marovia opens a second shop in its home town', "Pellora's central bank prints new banknotes with a fresh design"], 0,
      'The car makers depend on chips made in Zentara, so a problem in one economy spreads to others. The other events stay inside one country.'),
    M('drivers', 'Which change is most likely to <b>increase</b> globalisation?',
      ['A fall in the cost of shipping a container between continents', 'A rise in the tariffs charged on imported manufactured goods', 'New quotas limiting the number of foreign cars that can be sold', 'A sharp rise in the price of international data and phone calls'], 0,
      'Cheaper shipping lowers the cost of trading each item across borders, so firms trade more. Higher tariffs, new quotas and dearer communication all make trade harder.'),
    M('slowing factors', 'Which change would be most likely to <b>slow</b> globalisation?',
      ['Several large economies place quotas on a wide range of imports', 'Undersea internet cables make video calls between continents cheaper', 'Larger container ships cut the cost of moving each item by sea', 'Two neighbouring countries scrap the tariffs they charge each other'], 0,
      'Quotas limit the quantity that can be imported, so trade and integration fall. The other three changes make trade cheaper or easier.'),
    MU('drivers', 'Which of these have helped to increase globalisation?',
      ['Fewer tariffs and quotas on traded goods', 'Cheaper air freight and container shipping', 'Low-cost internet and video calling', 'The growing size and number of multinational corporations', 'Higher fuel costs for cargo ships', 'More countries setting import quotas'], [0, 1, 2, 3],
      'The four drivers in the specification are fewer trade barriers, cheaper transport, cheaper communication and the growing significance of MNCs. Dearer fuel and more quotas would slow globalisation.'),
    M('chain of reasoning', 'Container ships now carry thousands of boxes on one voyage, so the cost of shipping each item has fallen. What is the most likely next link in the chain?',
      ['Firms find it cheaper to buy from and sell to other countries, so trade grows', 'Governments raise tariffs to collect more revenue from each container ship that docks', 'Firms switch to buying all their inputs from local suppliers instead', 'Consumers buy fewer imported goods because sea transport is slower'], 0,
      'Lower transport cost per item makes trading across borders more profitable, so imports and exports rise and economies become more integrated.'),
    M('chain of reasoning', 'Online marketplaces let a small furniture maker in Rivania show its products to buyers worldwide for a low monthly fee. How does this add to globalisation?',
      ['The firm can sell abroad without opening overseas shops, so its exports rise', 'The firm must now pay a tariff on every advert it places online', 'The firm stops selling in Rivania and closes its workshop at home', "Rivania's government gains a new tax on the firm's internet use"], 0,
      'Cheaper communication lets even small firms reach foreign customers, so cross-border trade grows and Rivania becomes more connected to other economies.'),
    M('chain of reasoning', 'Pellora cuts its tariff on imported machinery from 18% to zero. Which chain is most likely to follow?',
      ["Imported machines become cheaper, so Pellora's firms import more and trade links grow", "Imported machines become dearer, so Pellora's firms buy only the machines made at home in Pellora", 'The government collects more tariff revenue, so it spends more at home', "Machinery makers in other countries lose sales to Pellora's firms"], 0,
      'A tariff is a tax on imports, so removing it lowers the price of foreign machines. Firms import more and Pellora trades more with other economies.'),
    M('chain of reasoning', 'Aldovia scraps its quota of 20,000 imported cars a year. What is the most likely result?',
      ['More foreign cars can be sold in Aldovia, so trade with car-making countries grows', 'Fewer foreign cars can enter Aldovia, so it trades less with other car-making countries', 'The price of imported cars rises because their supply is now limited', "Aldovia's government earns a new tax on each imported car"], 0,
      'A quota is a limit on the quantity imported. Removing it allows more imports, so Aldovia becomes more integrated with car-producing economies.'),
    M('MNCs', 'How does the growing significance of multinational corporations (MNCs) add to globalisation?',
      ['MNCs spread production and sales across many countries, linking their economies', 'MNCs sell only in their home country, so trade between different countries falls sharply', 'MNCs persuade governments to raise tariffs on goods from rival firms', 'MNCs replace all international trade with production for local markets'], 0,
      'An MNC that makes parts in one country, assembles in another and sells in many ties those economies together, which is greater integration.'),
    M('MNCs', 'Which trend shows the growing significance of MNCs in the world economy?',
      ['A larger share of world output is made by firms operating in several countries', 'More firms choose to produce and sell only within their home country', 'Governments buy back foreign-owned firms and run them as state-owned firms instead', 'The number of countries charging import tariffs has risen each year'], 0,
      'MNCs are firms that produce or sell in more than one country, so a rising share of output from such firms shows their growing importance.'),
    { skill: 'drivers', gen: function () {
      var c = countries(), A = c[0], Bc = c[1];
      var list = [
        ['Larger cargo aircraft halve the cost of flying fresh flowers from ' + A + ' to buyers on other continents.', 1],
        ['A clothing firm in ' + A + ' holds weekly video meetings with its factory managers overseas at almost no cost.', 2],
        [A + ' and ' + Bc + ' sign an agreement removing the tariffs on goods traded between them.', 0],
        ['An electronics firm from ' + A + ' now owns factories in eight countries and sells in forty.', 3],
        ['Faster broadband lets designers in ' + A + ' send drawings instantly to suppliers abroad.', 2],
        [A + ' lifts its limit on the number of foreign-made bicycles that can be imported each year.', 0],
        ['New rail freight links cut the cost of moving each container from ' + A + ' to its neighbours.', 1],
        ['A food firm based in ' + A + ' buys a rival company in ' + Bc + ' and runs both businesses.', 3]
      ];
      var s = pick(list);
      return { kind: 'mcq', q: 'Which reason for the growth of globalisation does this example show best?<br><i>' + s[0] + '</i>', options: DRIVERS.slice(), answer: s[1], why: DRIVERS[s[1]] + ': ' + DRIVER_WHY[s[1]] };
    } },
    { skill: 'drivers', gen: function () {
      var c = countries(), item = pick([['pairs of trainers', 'pair of trainers'], ['toasters', 'toaster'], ['bottles of olive oil', 'bottle of olive oil'], ['books', 'book'], ['desk lamps', 'desk lamp']]);
      var n = pick([2000, 2500, 4000, 5000, 8000, 10000]), cost = rint(15, 40) * 100;
      var ans = R.roundDp(cost / n, 2);
      return { kind: 'num', q: 'A shipping container holding ' + fmt(n) + ' ' + item[0] + ' costs ' + money(cost) + ' to send from ' + c[0] + ' to ' + c[1] + '. What is the transport cost per ' + item[1] + '? Give your answer in $ to 2 decimal places.',
        answer: ans, unit: '$', tol: 0.005, display: ans.toFixed(2),
        why: 'Cost per item = ' + money(cost) + ' &divide; ' + fmt(n) + ' = $' + (cost / n) + (cost / n === ans ? '' : ', which is $' + ans.toFixed(2) + ' to 2 decimal places') + '. Such a tiny transport cost per item makes it worthwhile to trade goods across the world, which drives globalisation.' };
    } },
    { skill: 'evidence', gen: function () {
      var y1 = pick([1985, 1990, 1995]), y2 = y1 + pick([25, 30]);
      var t1 = rint(34, 42), t2 = t1 + rint(10, 18), f1 = rint(2, 6) * 100, f2 = f1 * rint(3, 6);
      return { kind: 'mcq', q: 'The table shows world trade and investment.<br>' + table(['', y1, y2], [['World exports as a % of world GDP', t1 + '%', t2 + '%'], ['Foreign direct investment flows ($bn)', fmt(f1), fmt(f2)]]) + 'Which conclusion is best supported by the data?',
        options: ['Economies became more integrated through trade and cross-border investment', 'Countries traded less with each other at the end of the period', 'Tariffs and quotas must have risen over the period', 'Firms invested less in countries other than their own'], answer: 0,
        why: 'Exports rose from ' + t1 + '% to ' + t2 + '% of world GDP and FDI grew from $' + fmt(f1) + 'bn to $' + fmt(f2) + 'bn, so economies became more connected: evidence of globalisation.' };
    } },
    M('chain of reasoning', 'An exam question asks: "Explain one reason why globalisation has increased." Which answer actually responds to the question?',
      ['Cheaper internet calls cut the cost of dealing with overseas buyers, so firms trade more', 'Globalisation gives consumers lower prices and a wider choice of goods', 'Globalisation can harm the environment because more goods are flown and shipped around the world', 'Globalisation may cause job losses in countries with high labour costs'], 0,
      'The question asks for a cause. The other three answers describe effects of globalisation, which earn no credit here.'),
    M('chain of reasoning', 'Which sequence correctly links a fall in transport costs to globalisation?',
      ['Lower cost per item shipped &rarr; cheaper to trade abroad &rarr; more imports and exports &rarr; greater integration', 'Lower cost per item shipped &rarr; higher tariffs &rarr; less trade &rarr; greater integration', 'Lower cost per item shipped &rarr; dearer to trade abroad &rarr; fewer exports &rarr; greater integration', 'Higher cost per item shipped &rarr; cheaper to trade abroad &rarr; more exports &rarr; greater integration'], 0,
      'Each link must follow from the one before: cheaper shipping makes trade cheaper, so more trade happens, which connects economies more closely.'),
    M('slowing factors', 'Which statement about globalisation is correct?',
      ['It can slow down when trade barriers or transport costs rise', 'It can happen only when neighbouring countries join a single currency', 'It means each country becomes less dependent on the others', 'It is caused mainly by rising tariffs on imported goods'], 0,
      'Globalisation is driven by trade becoming cheaper and easier, so anything that makes trade dearer or harder slows it.'),
    M('definition', 'Because economies are interdependent, a deep recession in a large economy is most likely to',
      ["reduce demand for other countries' exports", 'raise the exports of every other country', 'have no effect on economies outside its borders', 'cut transport costs between all other countries'], 0,
      'When incomes fall in a large economy, its people and firms buy fewer imports, so other countries that sell to it lose export sales. That is what interdependence means.'),
    M('drivers', 'Lower tariffs encourage globalisation because a tariff is',
      ['a tax on imports, so cutting it makes foreign goods cheaper to buy', 'a limit on the number of imports, so cutting it makes goods dearer', 'a payment to exporters, so cutting it makes exports cheaper', 'a tax on exports, so cutting it makes imports scarcer'], 0,
      'A tariff is a tax on imported goods. Cutting it lowers the price of imports, so more is traded.'),
    M('drivers', 'Cheaper air freight lets growers in Sundara sell fresh berries in markets 8,000 km away. Which driver of globalisation is this, and what does it lead to?',
      ['Reduced cost of transport, leading to more exports of perishable goods', 'Fewer quotas and tariffs, leading to more berry imports into Sundara from abroad', 'Reduced cost of communication, leading to fewer berry exports', 'Growth of MNCs, leading to higher tariffs on berries'], 0,
      'Air freight is transport. Lower cost per kilogram flown makes distant markets profitable, so Sundara exports more and trades more with the world.'),
    M('MNCs', 'A Kestland phone maker designs its phones at home, makes parts in two countries and assembles them in a third. Which change has made this easiest to organise?',
      ['Cheap, fast communication such as email and video calls', 'Higher tariffs on parts crossing borders', 'Quotas limiting how many parts can be imported', 'Rising costs of sending data between countries'], 0,
      'Running production across several countries needs constant contact between sites. Cheaper communication makes this possible, helping MNCs grow and globalisation increase.'),
    { skill: 'slowing factors', gen: function () {
      var up = shuffle(['Shipping costs per container fall by a third', 'Several countries remove their import quotas', 'Video-calling and email become almost free to use', 'Large firms open factories in more countries', 'Tariffs on traded goods are cut to zero']).slice(0, 3);
      var down = shuffle(['Fuel costs for cargo ships double', 'Many countries raise tariffs on imports', 'New quotas cut the quantity of goods that can be imported', 'International data charges rise sharply']).slice(0, 2);
      var opts = shuffle(up.concat(down));
      var ans = []; opts.forEach(function (o, i) { if (down.indexOf(o) >= 0) ans.push(i); });
      return { kind: 'multi', q: 'Which of these changes would <b>slow</b> globalisation?', options: opts, answers: ans,
        why: 'Anything that makes trade dearer or harder slows globalisation: here, ' + down.join(' and ').toLowerCase() + '. The other changes make trade cheaper or easier, so they speed it up.' };
    } }
  ] };

  /* =====================================================================
     ECO-T22-04 Free trade: meaning, gains, losses and trade patterns
     ===================================================================== */
  B['ECO-T22-04'] = { title: 'Free trade: meaning, gains, losses and trade patterns', items: [
    M('definition', 'Free trade means',
      ['trade between countries without tariffs, quotas or other restrictions', 'trade in which buyers pay nothing for the goods they import', "trade that takes place only within one country's borders", 'trade in which the government sets the price of every export and import'], 0,
      'Free trade is buying and selling between countries that is not taxed or restricted. Goods still have prices; "free" refers to the absence of barriers.'),
    M('definition', 'A student defines free trade as "trade that is free of charge". What is wrong with this?',
      ['Free trade means no taxes or limits on trade, not that goods cost nothing', 'Free trade means trade only in services, not in goods', 'Free trade means trade only between developing countries, not developed ones', 'Nothing is wrong: this is the correct definition'], 0,
      'Goods traded freely still have a price. Free trade means there are no tariffs, quotas or other restrictions on trade between countries.'),
    M('consumer gains', 'What is the most likely effect of more free trade on consumers?',
      ['Lower prices and a wider choice of goods', 'Higher prices because imports are taxed', 'Less choice because foreign firms leave', 'Fewer imported brands in the shops'], 0,
      'Without tariffs, imports are cheaper and easier to bring in, so consumers face lower prices and more choice, raising living standards.'),
    MU('business gains', 'Which are likely gains from free trade for a country\'s businesses?',
      ['Access to wider markets abroad', 'Cheaper imported raw materials and components', 'Larger output, giving economies of scale', 'Protection from cheaper foreign competitors', 'Higher prices for their products at home'], [0, 1, 2],
      'Free trade opens foreign markets, cuts the cost of imported inputs and lets firms grow to gain economies of scale. It removes protection rather than giving it, and competition tends to lower prices.'),
    M('losses', 'Which is a disadvantage of free trade for domestic businesses?',
      ['They may lose sales to cheaper or better foreign rivals', 'They must pay higher tariffs on the inputs they import', 'They can no longer sell any of their products abroad', 'They face quotas limiting how much they can produce'], 0,
      'With no barriers, foreign firms compete freely in the home market. Domestic firms whose products are dearer or worse may lose sales or close.'),
    M('losses', 'When a country removes all its tariffs, which group loses an income it used to receive?',
      ['The government, which loses its tariff revenue', 'Exporters, who lose tariff payments made to them', 'Consumers, who lose tariff refunds on imports', 'Foreign firms, which lose the tariffs they collected'], 0,
      'Tariffs are taxes on imports collected by the government. Removing them means the government loses that revenue.'),
    M('losses', 'After Rivania removes its tariff on imported shoes, cheaper foreign shoes take sales from Rivania\'s shoe factories. What is the most likely next link?',
      ["Rivania's shoe makers cut output and some workers lose their jobs", "Rivania's shoe makers raise prices and hire more workers", 'Foreign shoe makers lose sales in Rivania', "Rivania's government collects more tariff revenue from foreign shoe imports"], 0,
      'Lower sales mean domestic firms need fewer workers, so unemployment can rise in the industry that faces new foreign competition.'),
    M('business gains', 'Marovia removes its tariff on tea imported from Sundara. What is the most likely effect on Sundara\'s tea growers?',
      ['Their tea becomes cheaper in Marovia, so they sell more there', 'Their tea becomes dearer in Marovia, so they sell less there', "They must now pay the tariff to Sundara's government instead", 'They lose sales because Marovian tea is now protected'], 0,
      'Removing a tariff abroad lowers the price of exporters\' goods in that market, so Sundara\'s growers can win more sales in Marovia.'),
    M('business gains', 'A furniture maker in Kestland imports all of its timber. Kestland removes a 15% tariff on timber. How is the firm most likely to benefit?',
      ['Its costs fall, so it can cut prices or earn more profit', 'Its costs rise, so it must raise the price of its furniture', 'It gains protection from imported furniture', 'It receives a subsidy equal to the old tariff'], 0,
      'The tariff was part of the cost of each piece of imported timber. Without it, input costs fall, so the firm can lower prices or keep a bigger profit margin.'),
    { skill: 'tariff removal', gen: function () {
      var c = pick(COUNTRIES), good = pick(['electric bicycle', 'sewing machine', 'coffee machine', 'lawnmower', 'printer']);
      var p = rint(6, 20) * 20, t = pick([10, 15, 20, 25]), shop = p * (100 + t) / 100;
      return { kind: 'num', q: 'In ' + c + ', an imported ' + good + ' sells for ' + money(shop) + ', which includes a ' + t + '% tariff on its value at the border. Under a new free trade agreement the tariff is removed. If the whole tariff had been passed on to buyers, what will the new price be? Give your answer in $.',
        answer: p, unit: '$', display: String(p),
        why: 'Price with tariff = border value &times; ' + (100 + t) / 100 + ', so border value = ' + money(shop) + ' &divide; ' + (100 + t) / 100 + ' = ' + money(p) + '. Removing the tariff lowers the price by ' + money(shop - p) + ', one gain of free trade for consumers.' };
    } },
    { skill: 'losses', gen: function () {
      var c = pick(COUNTRIES), good = pick(['textiles', 'vehicle parts', 'processed food', 'electrical goods']);
      var v = rint(3, 30) * 20, t = pick([5, 10, 15, 20]), lost = v * t / 100;
      return { kind: 'num', q: c + ' imports ' + good + ' worth $' + fmt(v) + ' million a year and charges a ' + t + '% tariff on them. It then joins a free trade agreement and removes the tariff. Assuming the value of imports is unchanged, how much tariff revenue does the government lose each year? Give your answer in $ million.',
        answer: lost, unit: '$m', display: String(lost),
        why: 'Tariff revenue = ' + t + '% &times; $' + fmt(v) + 'm = $' + fmt(lost) + 'm. Lost tax revenue is one disadvantage of free trade for the government.' };
    } },
    M('trade patterns', 'What is the typical trade pattern of a developed country?',
      ['It exports manufactured goods and services and imports primary products', 'It exports mainly crops and minerals and imports mainly manufactured goods', 'It exports and imports only primary products such as food', 'It imports services and exports only raw materials'], 0,
      'Developed countries have large secondary and tertiary sectors, so they sell high-value manufactured goods and services and buy food and raw materials.'),
    M('trade patterns', 'A developing country is most likely to export mainly',
      ['primary products such as crops and minerals', 'high-value financial and insurance services', 'advanced machinery and aircraft parts', 'branded software and design services'], 0,
      'Most workers and land in developing countries are in the primary sector (farming, mining), so their exports are mostly primary products.'),
    { skill: 'trade patterns', gen: function () {
      var c = pick(COUNTRIES), dev = Math.random() < 0.5, p, s;
      if (dev) { p = rint(1, 4); s = rint(17, 25); } else { p = rint(48, 66); s = rint(10, 18); }
      var t = 100 - p - s;
      return { kind: 'mcq', q: 'The table shows the share of workers in each sector in ' + c + '.<br>' + table(['Sector', 'Share of workers'], [['Primary', p + '%'], ['Secondary', s + '%'], ['Tertiary', t + '%']]) + 'What is ' + c + ' most likely to export?',
        options: ['Mainly primary products such as coffee, cocoa or copper', 'Mainly manufactured goods and services such as cars and banking', 'Only services, because it has no manufacturing', 'Nothing, because it uses all of its output at home'], answer: dev ? 1 : 0,
        why: dev ? 'Only ' + p + '% work in the primary sector and ' + t + '% in services, the pattern of a developed country, which exports manufactured goods and services.' : p + '% of workers are in the primary sector, the pattern of a developing country, which tends to export crops and minerals.' };
    } },
    M('trade patterns', 'Why do many developing countries export mainly primary products?',
      ['Most of their workers and land are used in farming and mining', 'Their tertiary sectors are larger than those of developed countries', 'Developed countries ban all imports of manufactured goods from them', 'Primary products are always the most valuable goods traded'], 0,
      'Developing countries have large primary sectors and less capital for manufacturing, so crops and minerals are what they produce in surplus to sell abroad.'),
    M('losses', 'Why can free trade be a threat to an infant industry?',
      ['Its new, small firms have high costs and cannot yet match established foreign rivals', 'Its firms are already too large and well known to sell their products in foreign markets', "Free trade forces governments to tax the industry's output heavily", 'It must export all of its output under free trade rules'], 0,
      'Infant industries have not yet grown enough to gain economies of scale. Without protection, cheaper imports from established firms may wipe them out.'),
    M('evaluation', 'Whether a country\'s firms gain or lose overall from free trade depends mostly on',
      ['how competitive they are on price and quality against foreign firms', "how far their head offices are located from the country's capital city", 'whether they pay their workers weekly or monthly', 'whether they advertise on television or online'], 0,
      'Competitive firms win new export markets; uncompetitive ones lose sales at home to imports. So competitiveness decides the overall effect.'),
    M('consumer gains', 'Which statement about free trade is <b>incorrect</b>?',
      ['It raises the prices consumers pay for imported goods', 'It lets firms sell into wider markets abroad', 'It can lower the cost of imported inputs', 'It can expose domestic firms to strong foreign competition'], 0,
      'Free trade removes tariffs, so imported goods tend to become cheaper, not dearer. The other three statements are correct.'),
    M('consumer gains', 'Free trade lowers the prices of imported food and clothing in Pellora. How does this raise living standards?',
      ['Households can buy more goods with the same income', 'Households must pay more tax on their imports', 'Households earn higher wages from tariff revenue', 'Households buy fewer goods but pay more for them'], 0,
      'Lower prices mean each unit of income buys more, so households can consume more: a rise in living standards.'),
    M('business gains', 'Tariffs on toys have been removed in 11 neighbouring countries, so a Zentaran toy maker can now sell there freely as well as at home. Which benefit is this?',
      ['A wider market, so it relies less on demand at home', 'Protection from foreign toy makers in its home market', 'A subsidy paid by the other 11 governments', 'Higher tariffs on toys imported into Zentara'], 0,
      'Selling in many markets raises potential sales and spreads risk: if demand falls in Zentara, sales abroad can make up for it.'),
    MU('losses', 'Which are possible disadvantages of free trade for a country?',
      ['Domestic firms harmed by foreign competition', 'Rising unemployment in industries that lose sales', 'Lost tariff revenue for the government', 'Higher prices for imported goods', 'Less choice for consumers'], [0, 1, 2],
      'Foreign competition can close domestic firms and cost jobs, and the government loses tariff revenue. Free trade usually lowers prices and widens choice.'),
    M('losses', 'Calvaria removes its tariff on imported steel. Which group is most likely to lose?',
      ["Workers at Calvaria's steel mills", 'Calvarian car makers that buy steel', 'Calvarian households buying steel goods', 'Foreign steel makers selling to Calvaria'], 0,
      'Cheaper imported steel takes sales from Calvaria\'s mills, putting their jobs at risk. Steel users and foreign sellers gain.'),
    { skill: 'trade patterns', gen: function () {
      var c = pick(COUNTRIES), dev = Math.random() < 0.5, prim = dev ? rint(6, 14) : rint(68, 84), rest = 100 - prim;
      var ops = ['Developing country: its exports are mostly primary products', 'Developed country: its exports are mostly manufactured goods and services', 'Developed country: its exports are mostly primary products', 'Developing country: its exports are mostly manufactured goods and services'];
      return { kind: 'mcq', q: 'Share of ' + c + '\'s exports by type:<br>' + table(['Type of export', 'Share of exports'], [['Primary products (food, minerals, fuels)', prim + '%'], ['Manufactured goods and services', rest + '%']]) + 'Which description best fits ' + c + '?',
        options: ops, answer: dev ? 1 : 0,
        why: dev ? rest + '% of exports are manufactured goods and services, the typical pattern of a developed country.' : prim + '% of exports are primary products, the typical pattern of a developing country.' };
    } },
    M('evaluation', 'Which point best challenges the claim "Removing tariffs will benefit everyone in Aldovia"?',
      ['Aldovian firms that cannot match foreign prices may close, costing jobs', 'Consumers will pay lower prices for imported goods', 'Aldovian households will have a much wider choice of imported goods to buy', 'Firms will be able to buy cheaper imported inputs'], 0,
      'To challenge "everyone gains", you need a group that loses. Workers in uncompetitive firms may lose their jobs; the other options support the claim.')
  ] };

  /* =====================================================================
     ECO-T22-03 Multinationals and FDI
     ===================================================================== */
  var MOTIVES = ['To reach new customers', 'To cut production costs', 'To get round trade barriers', 'To cut transport costs by producing near buyers'];
  B['ECO-T22-03'] = { title: 'Multinationals and FDI: why firms invest abroad, gains and costs', items: [
    M('definitions', 'A multinational corporation (MNC) is',
      ['a firm that produces or operates in more than one country', 'a firm that exports some of its output to other countries', 'a firm whose shares are owned by foreign investors', 'a firm owned jointly by several national governments'], 0,
      'The key idea is operating in more than one country. A firm that only exports, or has foreign shareholders, is not necessarily an MNC.'),
    M('definitions', 'Foreign direct investment (FDI) is',
      ['a firm from one country investing in productive assets, such as a factory, in another', 'a country buying more goods and services from abroad than it manages to sell to other countries', "a government lending money to another country's government", 'a household buying goods from foreign websites'], 0,
      'FDI means owning or building productive assets abroad, such as a factory, mine or firm. Buying or selling goods across borders is trade, not FDI.'),
    { skill: 'definitions', gen: function () {
      var c = countries(), A = c[0], Bc = c[1];
      var list = [
        ['A car maker from ' + A + ' builds an engine plant in ' + Bc + '.', 0],
        ['A supermarket chain from ' + A + ' buys a chain of 40 stores in ' + Bc + '.', 0],
        ['A mining firm from ' + A + ' opens a new copper mine in ' + Bc + '.', 0],
        ['Shops in ' + Bc + ' import 10,000 bicycles made in ' + A + '.', 1],
        ['A drinks firm in ' + A + ' sells juice to wholesalers in ' + Bc + '.', 1],
        ['A furniture firm in ' + A + ' buys tables from a workshop in ' + Bc + '.', 1],
        ['A bakery in ' + A + ' opens a second branch in another city in ' + A + '.', 2],
        ['A hotel group from ' + A + ' builds a new hotel in its own capital city.', 2]
      ];
      var s = pick(list);
      var ops = ['FDI: a firm owning or building productive assets abroad', 'Not FDI: this is trade (an export or an import)', 'Not FDI: this is investment within one country'];
      var why = ['A firm from one country is putting money into productive assets in another country, which is FDI.', 'Goods are only being bought and sold across a border. No assets abroad are owned or built, so it is trade, not FDI.', 'The investment stays inside the firm\'s own country, so nothing crosses a border.'];
      return { kind: 'mcq', q: 'How should this be classified?<br><i>' + s[0] + '</i>', options: ops, answer: s[1], why: why[s[1]] };
    } },
    MU('definitions', 'Which of these are examples of FDI <b>into</b> Pellora?',
      ['A Kestland firm builds a warehouse in Pellora', 'A Marovian bank buys a Pellora insurance company', 'Pellora imports rice from Sundara', 'A Pellora firm builds a new factory in Pellora', 'A Zentaran retailer opens 25 stores in Pellora'], [0, 1, 4],
      'FDI into Pellora means foreign firms owning or building productive assets there. Importing rice is trade, and a Pellora firm building at home is domestic investment.'),
    { skill: 'motives', gen: function () {
      var c = countries(), A = c[0], Bc = c[1], F = pick(['Orlena Group', 'Vexa Holdings', 'Haldor Group', 'Tamsin Industrial', 'Brightfield plc']);
      var list = [
        ['Sales of ' + F + '\'s snacks have stopped growing in ' + A + ', while incomes in ' + Bc + ' are rising fast.', 0],
        ['Wages for factory workers in ' + Bc + ' are about a third of those in ' + A + ', where ' + F + ' is based.', 1],
        [Bc + ' charges a 35% tariff on imported washing machines but none on machines made inside ' + Bc + '. ' + F + ' makes washing machines in ' + A + '.', 2],
        [F + ' makes heavy concrete blocks that are expensive to ship, and most of its buyers are in ' + Bc + '.', 3],
        [Bc + ' has a population of 90 million, and few of them have yet been able to buy ' + F + '\'s products.', 0],
        [Bc + ' limits imported cars with a quota, but cars built inside ' + Bc + ' are not limited. ' + F + ' builds cars in ' + A + '.', 2],
        ['Electricity and land in ' + Bc + ' cost much less than in ' + A + ', where ' + F + ' makes its goods.', 1],
        [F + ' sells bulky flat-pack furniture and wants to stop shipping it 9,000 km from ' + A + ' to its biggest market, ' + Bc + '.', 3]
      ];
      var s = pick(list);
      var why = ['A large or growing market abroad offers more sales and revenue than a saturated home market.', 'Cheaper labour, land or energy lowers the cost of each unit produced, raising profit.', 'Producing inside the country avoids the tariff or quota charged on imports.', 'Making goods close to buyers saves the cost of shipping heavy or bulky products a long way.'];
      return { kind: 'mcq', q: 'Why is ' + F + ' most likely to set up production in ' + Bc + '?<br><i>' + s[0] + '</i>', options: MOTIVES.slice(), answer: s[1], why: why[s[1]] };
    } },
    M('motives', 'A chocolate maker from Ferrosa buys cocoa farms in a tropical country. Which motive does this show most clearly?',
      ['Access to natural resources and cheap raw materials', 'Getting round a quota on chocolate imports', 'Reaching customers who cannot afford chocolate', 'Reducing the number of countries it operates in'], 0,
      'Cocoa only grows in tropical climates. Owning the farms secures the firm\'s key raw material at low cost.'),
    M('motives', 'How can operating in many countries help an MNC gain economies of scale?',
      ['It can produce and sell a much larger output, lowering its average cost', 'It must build many small plants, one in each country, raising its average cost', 'It pays higher wages in every country, raising its total cost', 'It sells less in each country, so its average cost rises'], 0,
      'Selling to customers in many countries allows very large production runs, so fixed costs are spread over more units and average cost falls.'),
    M('host benefits', 'An MNC opens a factory in Norvela employing 3,000 local workers. What is the most likely next link in the chain?',
      ['Unemployment falls and workers spend more, raising incomes and tax revenue', 'Unemployment rises because every local firm in Norvela must close down at once', "Norvela's imports of the MNC's products must rise", "Norvela's government must pay the workers' wages"], 0,
      'New jobs cut unemployment. The workers\' wages are spent in local shops and taxed, so incomes and government revenue rise.'),
    M('host benefits', 'An MNC trains local engineers to use new technology. Which benefit does the host country gain?',
      ['Workers gain skills that raise productivity, even in later jobs', 'The MNC can avoid paying tax on the profits it makes in the country', 'The MNC can send its profits to its home country', 'Local firms lose their best workers to the MNC'], 0,
      'Developing skills raises what workers can produce. Those skills stay in the country even if workers move to local firms later.'),
    M('host benefits', 'An MNC builds a new road from its factory to the nearest port, and local farmers use it too. Which advantage of FDI is this?',
      ['Investing in infrastructure', 'Moving profits abroad', 'Avoiding paying taxes', 'Environmental damage'], 0,
      'Roads, ports and power supplies are infrastructure. When an MNC builds them, local firms and people can benefit as well.'),
    M('host benefits', 'A foreign MNC pays corporation tax to the government of Ferrosa. How can this benefit Ferrosa?',
      ['The revenue can fund public services such as schools and hospitals', "It raises the price of the MNC's products for all consumers in Ferrosa", 'It reduces the number of jobs the MNC creates', 'It means the MNC moves its profits abroad'], 0,
      'Contributing to taxes is a benefit of MNCs: the government gains revenue it can spend on public services.'),
    M('host drawbacks', 'Why is "moving profits abroad" a disadvantage of MNCs for a host country?',
      ['Income earned in the host country goes to owners elsewhere, so less is spent locally', 'The MNC must pay extra tax on all of the profits it makes in the host country each year', 'The host country gains extra profits that it is unable to spend', 'It raises the wages the MNC must pay to local workers'], 0,
      'Profits sent back to shareholders in the home country do not circulate in the host economy, so it gains less income from the MNC\'s activity.'),
    M('host drawbacks', 'An MNC records most of its profits in a low-tax country, although its sales are mainly in Calvaria. Which disadvantage for Calvaria is this?',
      ['Avoiding paying taxes', 'Investing in infrastructure', 'Developing skills', 'Creating jobs'], 0,
      'By booking profits elsewhere, the MNC pays little tax in Calvaria, so Calvaria\'s government loses revenue.'),
    M('host drawbacks', 'A foreign-owned mine in Aldovia pollutes rivers used by local farmers. Which disadvantage of FDI is this?',
      ['Environmental damage', 'Moving profits abroad', 'Avoiding paying taxes', 'Developing capital'], 0,
      'Polluted water harms farmers and nature, an external cost of the MNC\'s production in the host country.'),
    M('host drawbacks', 'A global coffee-shop chain opens 60 branches in Rivania. Why might local café owners lose out?',
      ['They face a strong rival with lower costs and a famous brand', 'They receive a subsidy from the global chain', "They gain many new customers from the chain's adverts and promotions", 'They are protected by a quota on foreign cafés'], 0,
      'The MNC\'s economies of scale and brand let it undercut and out-market small local firms, which may lose sales or close.'),
    MU('host drawbacks', 'Which are possible disadvantages of an MNC for its host country?',
      ['Profits sent back to the home country', 'Pollution from its factories', 'Tax avoidance', 'New jobs for local workers', 'Training that develops local skills'], [0, 1, 2],
      'Moving profits abroad, environmental damage and avoiding taxes are drawbacks. Jobs and skills are benefits.'),
    M('motives', 'Which of these is a reason for the <b>firm</b> to invest abroad, rather than a benefit for the host country?',
      ['Access to cheaper labour that lowers its costs', 'More jobs for local people in the host country', 'Higher tax revenue for the host government', 'New roads and power supplies for local firms'], 0,
      'The firm invests to raise its own profit, for example through lower costs. Jobs, tax and infrastructure are gains for the host, not motives for the firm.'),
    { skill: 'host benefits', gen: function () {
      var c = pick(COUNTRIES), x = rint(3, 25) * 20, t = pick([15, 20, 25, 30]), tax = x * t / 100;
      return { kind: 'num', q: 'A foreign MNC makes a profit of $' + fmt(x) + ' million from its factory in ' + c + '. The corporation tax rate in ' + c + ' is ' + t + '%. How much tax does the MNC pay to ' + c + '\'s government? Give your answer in $ million.',
        answer: tax, unit: '$m', display: String(tax),
        why: 'Tax = ' + t + '% &times; $' + fmt(x) + 'm = $' + fmt(tax) + 'm. This revenue is one benefit of FDI: it can fund public services in ' + c + '.' };
    } },
    { skill: 'host drawbacks', gen: function () {
      var c = pick(COUNTRIES), x = rint(3, 25) * 20, p = pick([60, 70, 75, 80, 85, 90]), stay = x * (100 - p) / 100;
      return { kind: 'num', q: 'An MNC earns a profit of $' + fmt(x) + ' million from its operations in ' + c + ' and sends ' + p + '% of it to shareholders in its home country. How much of the profit stays in ' + c + '? Give your answer in $ million.',
        answer: stay, unit: '$m', display: String(stay),
        why: 'Profit staying = ' + (100 - p) + '% &times; $' + fmt(x) + 'm = $' + fmt(stay) + 'm. The other $' + fmt(x - stay) + 'm leaves ' + c + ', which is why moving profits abroad is a drawback for the host.' };
    } },
    M('evaluation', 'Which point most weakens the claim "The new MNC factory will greatly reduce unemployment in Sundara"?',
      ['The factory is highly automated and will employ only 150 people', 'The MNC will pay tax on the profits it makes in Sundara', 'The MNC will build a new access road to the factory for its lorries', 'The MNC will buy some of its parts from local suppliers'], 0,
      'If very few jobs are created, the effect on unemployment is small. The other points are benefits that do not challenge the claim.'),
    M('evaluation', 'Whether a host country gains overall from an MNC depends most on',
      ['how the MNC behaves and how well the government regulates it', "whether the MNC's logo is written in the local language", 'the number of shareholders the MNC has in its home country and abroad', "whether the MNC's head office is in the same time zone"], 0,
      'The same MNC can create jobs, skills and tax revenue, or pollute, avoid tax and send profits home. Its behaviour and the host\'s rules decide which dominates.'),
    M('host drawbacks', 'An MNC closes its plant in Kestland after five years and moves to a country with lower wages. Which disadvantage of MNCs does this show?',
      ['MNCs may leave quickly, so jobs and incomes are lost', 'MNCs always pay wages well above the local average', 'MNCs are unable to move production between countries', 'MNCs bring permanent jobs that can never be lost'], 0,
      'Because MNCs operate in many countries, they can move when costs are lower elsewhere, leaving the host with sudden job losses.'),
    M('host benefits', 'A foreign car plant in Marovia buys seats and tyres from Marovian firms. How does this benefit Marovia?',
      ['Local suppliers gain sales, creating more jobs and income', 'Local suppliers lose sales to imported parts', 'The plant avoids paying tax on the profits it makes in Marovia', "Marovia's imports of seats and tyres rise"], 0,
      'Orders from the MNC raise local suppliers\' output, so they hire more workers and incomes rise beyond the plant itself.'),
    M('host benefits', 'An MNC builds a modern factory full of new machinery in Zentara. Which advantage of FDI is this mainly an example of?',
      ['Developing capital, so the country can produce more', 'Moving profits abroad to its shareholders', 'Avoiding paying taxes in its home country', 'Damaging the environment around the site'], 0,
      'New factories and machinery add to the country\'s stock of capital, raising its capacity to produce goods.')
  ] };

  /* =====================================================================
     ECO-T22-06 Tariffs, quotas and subsidies
     ===================================================================== */
  var INSTR = ['Tariff', 'Quota', 'Subsidy', 'No protection: free trade'];
  B['ECO-T22-06'] = { title: 'Tariffs, quotas and subsidies: how they protect, gains and costs', items: [
    M('definitions', 'In international trade, a tariff is',
      ['a tax on imported goods', 'a limit on the quantity of imports', 'a payment from the government to producers', 'a ban on all trade with one country'], 0,
      'A tariff is a tax on imports. It raises their price so buyers switch to domestic goods, and the government collects the revenue.'),
    M('definitions', 'An import quota is',
      ['a limit on the quantity of a good that can be imported', 'a tax charged on each unit of a good that is imported', 'a payment to firms for every good they sell abroad', 'a rule that imports must be sold at a set price'], 0,
      'A quota is a physical limit on the amount imported, which leaves more of the market for domestic producers.'),
    M('definitions', 'As a method of protection, a subsidy is',
      ['a payment from the government to producers that lowers their costs', 'a tax on imports that raises their price for buyers', 'a legal limit on the quantity of goods that can be imported each year', 'a charge that domestic firms must pay in order to export'], 0,
      'A subsidy is paid by the government to producers, cutting their costs so their goods can be sold more cheaply at home and abroad.'),
    { skill: 'definitions', gen: function () {
      var A = pick(COUNTRIES);
      var list = [
        [A + ' allows only 40,000 tonnes of foreign rice into the country each year.', 1],
        [A + ' adds a 12% tax to the value of every imported television.', 0],
        [A + '\'s government pays its wheat farmers $30 for every tonne they grow.', 2],
        [A + ' removes every tax and limit on goods traded with its neighbours.', 3],
        [A + ' charges $500 on each foreign car that enters its ports.', 0],
        [A + ' issues licences for no more than 2,000 imported motorbikes a month.', 1],
        [A + ' gives grants to its solar-panel makers so they can sell more cheaply at home and abroad.', 2],
        [A + ' limits imported cheese to 5% of the cheese sold in the country.', 1]
      ];
      var s = pick(list);
      var why = ['A tax on imports is a tariff.', 'A limit on the quantity imported is a quota.', 'A government payment to domestic producers is a subsidy.', 'With no taxes or limits on trade there is no protection: this is free trade.'];
      return { kind: 'mcq', q: 'Which method is being used?<br><i>' + s[0] + '</i>', options: INSTR.slice(), answer: s[1], why: why[s[1]] };
    } },
    M('how it protects', 'Calvaria\'s government wants its fruit growers\' produce to be cheaper in foreign markets. Which method of protection would do this?',
      ['A subsidy paid to its fruit growers', 'A tariff on imported fruit', 'A quota on imported fruit', 'Removing all barriers to fruit imports'], 0,
      'A subsidy lowers growers\' costs, so they can sell their fruit at lower prices abroad. Tariffs and quotas only affect imports into Calvaria.'),
    M('gains', 'Which method of protection raises revenue for the government that uses it?',
      ['A tariff', 'A quota', 'A subsidy', 'Free trade'], 0,
      'A tariff is a tax, so the government collects money on each import. A subsidy costs the government money, and a quota limits quantity without a tax.'),
    M('costs', 'Which method of protection costs the government money?',
      ['A subsidy', 'A tariff', 'A quota', 'An import tax'], 0,
      'The government pays a subsidy to producers, so it adds to government spending. That money has an opportunity cost.'),
    M('how it protects', 'Ferrosa sets a quota of 50,000 imported air conditioners a year, well below current imports. How does this protect Ferrosa\'s own producers?',
      ['Fewer imports are allowed, so domestic firms can supply more of the market', 'Each imported unit is taxed, so the government earns more revenue', 'Domestic firms receive payments that lower their production costs', 'Imports become cheaper, so domestic firms must cut their own prices to compete'], 0,
      'A quota limits the quantity of imports. With fewer foreign units available, domestic producers can sell more and gain market share.'),
    M('how it protects', 'Aldovia puts a 25% tariff on imported bicycles. Which chain is correct?',
      ['Imported bicycles cost more, so buyers switch to Aldovian ones and domestic sales rise', 'Imported bicycles cost less, so buyers switch to them and domestic sales fall', "The tariff is paid to Aldovia's bicycle makers, so their production costs fall sharply each year", 'Fewer bicycles of any kind are sold, so domestic makers lose sales'], 0,
      'The tariff raises the price of imports. Domestic bicycles become relatively cheaper, so Aldovian makers win sales and protect jobs.'),
    M('how it protects', 'How does a subsidy to Kestland\'s steel makers protect them from foreign competition?',
      ['It lowers their costs, so they can charge lower prices than before', 'It raises the price of imported steel at the border', 'It limits how much foreign steel can enter Kestland', 'It raises their costs, so they make better steel'], 0,
      'The subsidy cuts the cost of producing each tonne, so Kestland\'s steel can be priced more competitively against imports and in export markets.'),
    { skill: 'diagram choice', gen: function () {
      var good = pick(['footwear', 'rice', 'televisions', 'olive oil', 'paper']), c = pick(COUNTRIES);
      var tariff = Math.random() < 0.5, kind = tariff ? 'SL' : 'SR', L = lettered(kind);
      var ev = tariff ? 'a tariff is introduced on imported ' + good : 'a subsidy is introduced for ' + c + '\'s producers of ' + good;
      return { kind: 'mcq', q: 'In ' + c + ', ' + ev + '. Which diagram shows the effect on the market for ' + good + ' in ' + c + '?', svg: panels(L.kinds, 'Four supply and demand diagrams labelled A to D showing shifts of supply or demand'),
        options: ['A', 'B', 'C', 'D'], answer: L.answer, keepOrder: true,
        why: tariff ? 'A tariff adds to the cost of supplying the good, so supply shifts left (S to S1): price rises and quantity falls. Demand does not move.' : 'A subsidy lowers producers\' costs, so supply shifts right (S to S1): price falls and quantity rises. Demand does not move.' };
    } },
    { skill: 'diagram choice', gen: function () {
      var good = pick(['sugar', 'cement', 'cotton shirts', 'tinned fruit', 'garden tools']), c = pick(COUNTRIES);
      var tariffOff = Math.random() < 0.5, kind = tariffOff ? 'SR' : 'SL', L = lettered(kind);
      var ev = tariffOff ? 'removes its tariff on imported ' + good : 'removes the subsidy it paid to its producers of ' + good;
      return { kind: 'mcq', q: c + ' ' + ev + '. Which diagram shows the effect on the market for ' + good + ' in ' + c + '?', svg: panels(L.kinds, 'Four supply and demand diagrams labelled A to D showing shifts of supply or demand'),
        options: ['A', 'B', 'C', 'D'], answer: L.answer, keepOrder: true,
        why: tariffOff ? 'Removing a tariff takes a cost away from suppliers, so supply shifts right: price falls and quantity rises.' : 'Removing a subsidy raises producers\' costs again, so supply shifts left: price rises and quantity falls.' };
    } },
    M('costs', 'Which is a disadvantage of a tariff for consumers in the country that imposes it?',
      ['They pay higher prices and have less choice', 'They pay lower prices for imported goods', 'They must collect the tax for the government', 'They can buy an unlimited quantity of imports'], 0,
      'The tariff raises the price of imports and some foreign products may disappear from the shops, so consumers pay more and choose from less.'),
    M('costs', 'Zentara puts tariffs on imports from Pellora, and Pellora responds with tariffs on Zentaran goods. Who in Zentara is most likely to lose?',
      ["Zentara's exporters, whose goods now cost more in Pellora", "Zentara's government, which now collects tariff revenue", 'Zentaran firms that compete with imports from Pellora', 'Zentaran firms that sell only in their home market'], 0,
      'Retaliation means Pellora taxes Zentara\'s exports, so Zentaran exporters lose sales. This trade war is a major cost of protection.'),
    M('costs', 'Why might protection make domestic firms less efficient in the long run?',
      ['Shielded from rivals, they face less pressure to cut costs or innovate', 'They must pay the tariff on everything they produce at home, raising their costs', 'They lose their whole home market to foreign firms', 'They are forced to export all of their output'], 0,
      'Competition pushes firms to improve. Protected firms can survive with high costs and old products, so efficiency may fall.'),
    M('costs', 'Rivania spends $400 million a year subsidising its car makers. What is the main cost of this policy?',
      ['The money cannot be spent on other things such as schools or hospitals', "Car makers' production costs rise, so the price of new cars in Rivania increases", 'Imported cars become cheaper than cars made in Rivania', 'The number of cars that can be imported becomes limited'], 0,
      'Subsidies are government spending, so they have an opportunity cost: the next best use of that $400 million is given up.'),
    MU('gains', 'Which are likely advantages, for the country, of imposing a tariff on imported clothing?',
      ['Domestic clothing makers gain market share', 'The government collects tax revenue', 'Jobs in domestic clothing firms are protected', 'Consumers pay lower prices for clothing', 'Other countries are certain not to retaliate'], [0, 1, 2],
      'The tariff makes imports dearer, helping domestic firms and jobs, and raises revenue. Consumers pay more, and retaliation is a real risk.'),
    MU('costs', 'Which are likely disadvantages of an import quota?',
      ['Prices rise because supply is restricted', 'Consumers have less choice', 'Other countries may retaliate', 'The government must pay producers for each unit', 'Domestic firms face more competition'], [0, 1, 2],
      'Limiting imports cuts supply, raising prices and reducing choice, and trading partners may hit back. Paying producers is a subsidy, and quotas reduce competition.'),
    { skill: 'gains', gen: function () {
      var c = pick(COUNTRIES), good = pick(['bicycles', 'microwave ovens', 'office chairs', 'electric fans']), n = rint(2, 8), p = pick([50, 100, 150, 200, 250, 300]), t = pick([10, 20, 25]);
      var rev = n * p * t / 1000;
      return { kind: 'num', q: c + ' imports ' + fmt(n * 100000) + ' ' + good + ' a year, each valued at ' + money(p) + ' at the border. It introduces a ' + t + '% tariff. If the number imported did not change, how much tariff revenue would the government collect each year? Give your answer in $ million.',
        answer: rev, unit: '$m', display: String(rev),
        why: 'Value of imports = ' + fmt(n * 100000) + ' &times; ' + money(p) + ' = $' + fmt(n * p / 10) + 'm. Revenue = ' + t + '% &times; $' + fmt(n * p / 10) + 'm = $' + fmt(rev) + 'm. (In practice imports would fall, so revenue would be a little less.)' };
    } },
    { skill: 'costs', gen: function () {
      var c = pick(COUNTRIES), crop = pick(['maize', 'cotton', 'soya beans', 'barley']), s = pick([10, 15, 20, 25, 40]), q = rint(2, 12) * 50000;
      var cost = s * q / 1e6;
      return { kind: 'num', q: c + '\'s government pays its farmers a subsidy of ' + money(s) + ' per tonne of ' + crop + '. Farmers produce ' + fmt(q) + ' tonnes a year. How much does the subsidy cost the government each year? Give your answer in $ million.',
        answer: cost, unit: '$m', display: String(cost),
        why: 'Cost = ' + money(s) + ' &times; ' + fmt(q) + ' tonnes = $' + fmt(s * q) + ' = $' + cost + 'm. This spending has an opportunity cost: it could have funded other public services.' };
    } },
    { skill: 'how it protects', gen: function () {
      var c = pick(COUNTRIES), good = pick(['television', 'tablet computer', 'electric guitar', 'washing machine']), p = rint(6, 30) * 20, t = pick([5, 10, 15, 20, 25, 30]);
      var newp = p * (100 + t) / 100;
      return { kind: 'num', q: 'An imported ' + good + ' arrives at ' + c + '\'s border valued at ' + money(p) + '. ' + c + ' adds a ' + t + '% tariff, which importers pass on in full to buyers. What is the new price of the ' + good + '? Give your answer in $.',
        answer: newp, unit: '$', display: String(newp),
        why: 'Tariff = ' + t + '% &times; ' + money(p) + ' = ' + money(p * t / 100) + ', so the price becomes ' + money(p) + ' + ' + money(p * t / 100) + ' = ' + money(newp) + '. Dearer imports push buyers towards domestic products.' };
    } },
    M('gains', 'Which statement is <b>incorrect</b>?',
      ['Subsidies reduce the amount the government spends', 'Tariffs raise the price of imported goods', 'Quotas limit the quantity of goods imported', "Subsidies lower domestic producers' costs"], 0,
      'A subsidy is a payment by the government, so it increases government spending. The other statements are correct.'),
    M('gains', 'How might a tariff on imported cars help Marovia\'s current account?',
      ['Fewer cars are imported, so spending on imports falls', 'More cars are imported, so export revenue rises', "The tariff directly raises the value of Marovia's exports", 'Car imports become cheaper, so the deficit grows'], 0,
      'The tariff makes imported cars dearer, so fewer are bought. Lower import spending improves the current account balance.'),
    M('definitions', 'Unlike a tariff, an import quota',
      ['does not directly raise tax revenue for the government', 'always lowers the price of the imported good', 'is a payment made to domestic producers', 'taxes each imported unit at a fixed rate'], 0,
      'A quota limits quantity rather than taxing it, so the government does not collect tax on the imports as it does with a tariff.'),
    M('diagram choice', 'On a supply and demand diagram for a domestic product, a new subsidy to producers shifts',
      ['supply to the right', 'supply to the left', 'demand to the right', 'demand to the left'], 0,
      'The subsidy lowers producers\' costs, so they supply more at every price: supply shifts right, price falls and quantity rises.')
  ] };

  /* =====================================================================
     ECO-T22-07 Draw a tariff, subsidy or indirect tax change
     ===================================================================== */
  var SHIFT_OPTS = ['Supply shifts left', 'Supply shifts right', 'Demand shifts left', 'Demand shifts right'];
  var PQ_OPTS = ['Price rises and quantity falls', 'Price falls and quantity rises', 'Price rises and quantity rises', 'Price falls and quantity falls'];
  function tsEvent() {
    var good = pick(['imported rugs', 'imported mobile phones', 'imported cheese', 'imported tiles', 'imported watches']);
    var green = pick(['electric buses', 'heat pumps', 'solar water heaters', 'bicycle helmets', 'organic vegetables']);
    var list = [
      ['A tariff is introduced on ' + good + '.', 0, 'A tariff adds to the cost of supplying the imports'],
      ['The government removes the tariff on ' + good + '.', 1, 'Removing the tariff takes a cost away from suppliers'],
      ['A subsidy is introduced for producers of ' + green + '.', 1, 'A subsidy lowers producers\' costs'],
      ['The government removes the subsidy paid to producers of ' + green + '.', 0, 'Removing the subsidy raises producers\' costs again'],
      ['The tariff on ' + good + ' is raised from 10% to 30%.', 0, 'A higher tariff adds more to suppliers\' costs'],
      ['The subsidy paid to producers of ' + green + ' is doubled.', 1, 'A bigger subsidy cuts producers\' costs further']
    ];
    return pick(list);
  }
  // numeric diagram: D p = 10 - q, S p = q + c0, S1 p = q + c1
  function numDiagram() {
    var c0 = pick([-2, 0, 2]), up = Math.random() < 0.5, c1 = c0 + (up ? 2 : -2);
    var q0 = (10 - c0) / 2, p0 = (10 + c0) / 2, q1 = (10 - c1) / 2, p1 = (10 + c1) / 2;
    var pu = pick([1, 2, 5, 0.5, 10]), qu = pick([100, 200, 500, 1000, 50]);
    var plab = function (p) { return money(p * pu); };
    var svg = full('Supply and demand diagram with demand D, original supply S and new supply S1, with dashed lines to the axes at both equilibria', {
      lines: [dLine(0, INK, 'D'), sLine(c0, INK, 'S'), sLine(c1, HI, 'S1')],
      guides: [{ q: q0, p: p0, pl: plab(p0), ql: fmt(q0 * qu) }, { q: q1, p: p1, pl: plab(p1), ql: fmt(q1 * qu) }],
      xl: 'Quantity (units per week)'
    });
    return { up: up, q0: q0 * qu, q1: q1 * qu, p0: p0 * pu, p1: p1 * pu, svg: svg };
  }
  B['ECO-T22-07'] = { title: 'Draw a tariff, subsidy or indirect tax change', items: [
    { skill: 'direction of shift', gen: function () {
      var e = tsEvent();
      return { kind: 'mcq', q: e[0] + ' How should the diagram for this market be changed?', options: SHIFT_OPTS.slice(), answer: e[1],
        why: e[2] + ', so supply shifts ' + (e[1] === 0 ? 'left' : 'right') + ' (S to S1). Demand does not move in these questions.' };
    } },
    { skill: 'new price and quantity', gen: function () {
      var e = tsEvent();
      return { kind: 'mcq', q: e[0] + ' What happens to the equilibrium price and quantity in this market?', options: PQ_OPTS.slice(), answer: e[1],
        why: e[2] + ', so supply shifts ' + (e[1] === 0 ? 'left: the new equilibrium on the unchanged demand curve has a higher price (P1) and a lower quantity (Q1).' : 'right: the new equilibrium on the unchanged demand curve has a lower price (P1) and a higher quantity (Q1).') };
    } },
    { skill: 'reading the diagram', gen: function () {
      var up = Math.random() < 0.5, c1 = up ? 2 : -2;
      var pts = up ? [[4, 6], [5, 7], [4, 4], [3, 7]] : [[6, 4], [5, 3], [6, 6], [7, 3]];
      var order = shuffle([0, 1, 2, 3]), letters = ['A', 'B', 'C', 'D'];
      var P = order.map(function (k, i) { return { q: pts[k][0], p: pts[k][1], lab: letters[i] }; });
      var ev = up ? pick(['a tariff on imported jackets', 'an indirect tax on fizzy drinks', 'the removal of a subsidy for wool producers']) : pick(['a subsidy for makers of electric scooters', 'the removal of a tariff on imported jackets', 'the removal of an indirect tax on fruit juice']);
      return { kind: 'mcq', q: 'The diagram shows the effect of ' + ev + '. Which point is the new equilibrium?', svg: full('Supply and demand diagram with D, S and S1 and four points labelled A to D', { lines: [dLine(0, INK, 'D'), sLine(0, INK, 'S'), sLine(c1, HI, 'S1')], pts: P }),
        options: letters.slice(), answer: order.indexOf(0), keepOrder: true,
        why: 'The new equilibrium is where the new supply curve S1 crosses the unchanged demand curve D. P1 and Q1 are read from that point.' };
    } },
    { skill: 'reading the diagram', gen: function () {
      var d = numDiagram(), dq = d.q1 - d.q0;
      return { kind: 'num', q: 'The diagram shows a market before and after ' + (d.up ? pick(['a tariff is introduced', 'an indirect tax is introduced', 'a subsidy is removed']) : pick(['a subsidy is introduced', 'a tariff is removed', 'an indirect tax is removed'])) + '. What is the change in the equilibrium quantity? Use a minus sign for a fall.', svg: d.svg,
        answer: dq, unit: 'units', display: String(dq),
        why: 'The old equilibrium (S meets D) is at ' + fmt(d.q0) + ' units; the new one (S1 meets D) is at ' + fmt(d.q1) + ' units. Change = ' + fmt(d.q1) + ' - ' + fmt(d.q0) + ' = ' + fmt(dq) + ' units.' };
    } },
    { skill: 'reading the diagram', gen: function () {
      var d = numDiagram();
      var pp = function (p, q) { return 'Price ' + money(p) + ', quantity ' + fmt(q); };
      return { kind: 'mcq', q: 'The diagram shows the effect of ' + (d.up ? 'a new tariff' : 'a new subsidy') + ' on a market. What are the new equilibrium price (P1) and quantity (Q1)?', svg: d.svg,
        options: [pp(d.p1, d.q1), pp(d.p0, d.q0), pp(d.p1, d.q0), pp(d.p0, d.q1)], answer: 0,
        why: 'P1 and Q1 come from where S1 meets D: price ' + money(d.p1) + ' and quantity ' + fmt(d.q1) + '. ' + money(d.p0) + ' and ' + fmt(d.q0) + ' are the old equilibrium on S.' };
    } },
    { skill: 'reading the diagram', gen: function () {
      var up = Math.random() < 0.5;
      var right = up ? ['A tariff is introduced on the imported good', 'The subsidy paid to producers is removed', 'An indirect tax is placed on the good'] : ['A subsidy is introduced for producers', 'The tariff on the imported good is removed', 'The indirect tax on the good is removed'];
      var wrong = up ? ['A subsidy is introduced for producers', 'The tariff on the imported good is removed', 'Consumers\' incomes rise, so they buy more'] : ['A tariff is introduced on the imported good', 'The subsidy paid to producers is removed', 'Consumers\' incomes fall, so they buy less'];
      var w = shuffle(wrong);
      return { kind: 'mcq', q: 'Which event could the diagram show?', svg: full('Supply and demand diagram where supply shifts from S to S1', { lines: [dLine(0, INK, 'D'), sLine(0, INK, 'S'), sLine(up ? 2 : -2, HI, 'S1')] }),
        options: [pick(right), w[0], w[1], w[2]], answer: 0,
        why: 'Supply has shifted ' + (up ? 'left, which happens when suppliers\' costs rise (a new tariff or tax, or a subsidy removed).' : 'right, which happens when suppliers\' costs fall (a new subsidy, or a tariff or tax removed).') + ' Demand has not moved, so an income change is ruled out.' };
    } },
    MU('labels and marks', 'A question asks you to draw the effects of a new tariff, with the new curve, price and quantity all labelled. Which items does a full-mark answer need?',
      ['A supply curve shifted left and labelled S1', 'The new equilibrium price labelled P1, above Pe', 'The new equilibrium quantity labelled Q1, left of Qe', 'A new demand curve labelled D1', 'A vertical supply line at the old quantity'], [0, 1, 2],
      'The three marks are for the shifted supply curve, the new price and the new quantity, each labelled. Demand does not move, and a vertical line is used only for a quota.'),
    M('labels and marks', 'A student shows a new tariff by shifting the <b>demand</b> curve to the left. What is wrong?',
      ['A tariff changes suppliers\' costs, so supply should shift and demand stay put', 'A tariff should shift the demand curve to the right instead', 'A tariff should be drawn as a vertical line at the quantity imported', 'Nothing is wrong: a tariff always reduces demand'], 0,
      'The tariff is a cost paid by suppliers bringing goods into the country, so the supply curve shifts left. The demand curve stays where it is.'),
    M('labels and marks', 'A student was asked to show the effect of a new subsidy for electric scooters and drew the diagram shown. What is wrong with it?',
      ['Supply has been shifted the wrong way', 'The demand curve should also have moved', 'Price and quantity axes are the wrong way round', 'Nothing: it earns all three marks'], 0,
      'A subsidy lowers costs, so supply should shift right, giving a lower price and higher quantity. The student shifted it left.',
      { svg: full("A student's diagram with S1 drawn to the left of S, with P1 above Pe and Q1 left of Qe", { lines: [dLine(0, INK, 'D'), sLine(0, INK, 'S'), sLine(2, HI, 'S1')], guides: [{ q: 5, p: 5, pl: 'Pe', ql: 'Qe' }, { q: 4, p: 6, pl: 'P1', ql: 'Q1' }] }) }),
    M('new price and quantity', 'After a tariff is placed on imported rugs, why does the equilibrium price rise?',
      ['Supply falls, so at the old price there is excess demand that pushes the price up', 'Demand rises, so buyers compete with each other and bid the price up', 'Supply rises, so sellers raise their prices to match each other', 'Demand falls, so firms charge more to cover their fixed costs'], 0,
      'With supply shifted left, at the old price Pe the quantity demanded is greater than the quantity supplied. This shortage pushes the price up to P1.'),
    M('new price and quantity', 'Once supply has shifted left because of a new indirect tax, what is the situation at the old price Pe?',
      ['Excess demand: quantity demanded is greater than quantity supplied', 'Excess supply: quantity supplied is greater than quantity demanded', 'Equilibrium: quantity demanded equals quantity supplied', 'Zero demand: no one will buy at that price'], 0,
      'S1 lies to the left of S, so at Pe less is supplied than is demanded. The shortage drives the price up to the new equilibrium.'),
    M('direction of shift', 'The tariff on imported olive oil is <b>cut</b> from 30% to 10% (but not removed). How should the diagram be drawn?',
      ['Supply shifts right, so price falls and quantity rises', 'Supply shifts left, so price rises and quantity falls', 'Demand shifts right, so price and quantity rise', 'No change, because a tariff is still charged'], 0,
      'A smaller tariff means a smaller cost for suppliers than before, so supply shifts right compared with the old position, even though some tariff remains.'),
    M('direction of shift', 'The subsidy paid to organic farmers is <b>reduced</b>. What is the effect on the market for organic food?',
      ['Supply shifts left: price rises and quantity falls', 'Supply shifts right: price falls and quantity rises', 'Demand shifts left: price and quantity fall', 'Demand shifts right: price and quantity rise'], 0,
      'A smaller subsidy means farmers\' costs rise, so supply shifts left. On the unchanged demand curve, price rises and quantity falls.'),
    M('labels and marks', 'Where should the new equilibrium price P1 be marked?',
      ['On the price axis, level with the point where S1 crosses D', 'On the price axis, level with the point where S1 crosses the quantity axis', 'On the quantity axis, below the point where S crosses D', 'On the price axis, level with the top end of S1'], 0,
      'Draw a dashed line across from the new crossing point of S1 and D to the vertical (price) axis and label it P1.'),
    M('labels and marks', 'How should the new supply curve be drawn when a tariff is introduced?',
      ['Parallel to S, on its left, and labelled S1', 'Parallel to S, on its right, and labelled S1', 'As a vertical line at the old quantity', 'As a new demand curve labelled D1'], 0,
      'A tariff adds to suppliers\' costs at every level of output, so the new curve is drawn parallel to S and to its left.'),
    M('labels and marks', 'After a subsidy for electric scooters, which curve stays where it is?',
      ['The demand curve', 'The supply curve', 'Neither: both curves shift'], 0,
      'A subsidy changes producers\' costs, not buyers\' wishes, so only supply moves. P1 and Q1 are found on the original demand curve.'),
    MU('new price and quantity', 'A subsidy is introduced for producers of heat pumps. Which of these are shown on a correct diagram?',
      ['Supply shifts right to S1', 'The new price P1 is below Pe', 'The new quantity Q1 is greater than Qe', 'Demand shifts right to D1', 'The new price P1 is above Pe'], [0, 1, 2],
      'The subsidy lowers costs, so supply shifts right. Where S1 meets the unchanged D, price is lower and quantity higher.'),
    M('labels and marks', 'Which order of steps draws a tariff diagram correctly?',
      ['Shift S left to S1 &rarr; find where S1 meets D &rarr; read across to label P1 &rarr; read down to label Q1', 'Shift D left to D1 &rarr; find where D1 meets S &rarr; read across to label P1 &rarr; read down to label Q1', 'Shift S right to S1 &rarr; find where S1 meets D &rarr; read across to label P1 &rarr; read down to label Q1', 'Draw a vertical line at Qe &rarr; find where it meets D &rarr; read across to label P1 &rarr; label Q1'], 0,
      'A tariff raises suppliers\' costs, so supply shifts left; the new equilibrium is on the original demand curve, and P1 and Q1 are read from it.'),
    M('direction of shift', 'The government places a new indirect tax on sugary drinks. Which describes the correct diagram?',
      ['S1 to the left of S, P1 above Pe and Q1 to the left of Qe', 'S1 to the right of S, P1 below Pe and Q1 to the right of Qe', 'D1 to the left of D, P1 below Pe and Q1 to the left of Qe', 'S1 to the left of S, P1 below Pe and Q1 to the right of Qe'], 0,
      'An indirect tax adds to the cost of supplying each drink, so supply shifts left: a higher price and a lower quantity on the same demand curve.'),
    M('direction of shift', 'A government removes the indirect tax on children\'s car seats. Which describes the correct diagram?',
      ['S1 to the right of S, P1 below Pe and Q1 to the right of Qe', 'S1 to the left of S, P1 above Pe and Q1 to the left of Qe', 'D1 to the right of D, P1 above Pe and Q1 to the right of Qe', 'S1 to the right of S, P1 above Pe and Q1 to the left of Qe'], 0,
      'Removing the tax lowers suppliers\' costs, so supply shifts right: price falls and quantity rises along the unchanged demand curve.'),
    M('labels and marks', 'A student shifts the supply curve the correct way and labels it S1, but marks no new price or quantity. How many of the 3 marks are likely to be awarded?',
      ['1 mark', '0 marks', '2 marks', '3 marks'], 0,
      'Each of the three items earns a separate mark: the labelled shift, the labelled new price and the labelled new quantity. Only the first has been done.'),
    M('new price and quantity', 'The tariff on imported tiles is raised from 10% to 25%. Compared with the old tariff, what does the diagram show?',
      ['Supply shifts further left, so price rises more and quantity falls more', 'Supply shifts right, so price falls and quantity rises', 'Demand shifts left, so price and quantity both fall', 'No change, because a tariff was already in place'], 0,
      'A bigger tariff adds more to suppliers\' costs, so supply moves further left than before, raising the price and cutting the quantity further.')
  ] };

  /* =====================================================================
     ECO-T22-08 Draw the effect of an import quota
     ===================================================================== */
  function quotaEvent() {
    var good = pick(['sugar', 'steel wire', 'frozen chicken', 'rice', 'cotton yarn', 'timber']);
    var unit = 'tonnes', k = rint(4, 9) * 10000;
    var list = [
      ['Imports of ' + good + ' have been ' + fmt(k + 20000) + ' ' + unit + ' a year. A new quota limits them to ' + fmt(k) + ' ' + unit + '.', 0],
      ['The quota on imported ' + good + ' is cut from ' + fmt(k + 20000) + ' to ' + fmt(k) + ' ' + unit + ' a year.', 0],
      ['The quota on imported ' + good + ' is raised from ' + fmt(k) + ' to ' + fmt(k + 20000) + ' ' + unit + ' a year.', 1]
    ];
    return pick(list);
  }
  B['ECO-T22-08'] = { title: 'Draw the effect of an import quota', items: [
    M('shape of the quota line', 'On a supply and demand diagram, an import quota is shown as',
      ['a vertical supply line at the permitted quantity', 'a supply curve shifted parallel to the left', 'a horizontal supply line at the world price', 'a demand curve shifted to the left'], 0,
      'A quota fixes the maximum quantity, so supply is drawn as a vertical line at that quantity and labelled, for example S1 (quota).'),
    M('shape of the quota line', 'Why is the supply line vertical once a quota is in place?',
      ['However high the price goes, no more than the quota can be supplied', 'The quota sets a fixed price that can never change, whatever happens to demand', 'Demand for the good stays the same at every price', 'The government buys every unit at a fixed price'], 0,
      'The quantity is capped by law, so a higher price cannot draw out more supply: the quantity supplied is fixed at the quota.'),
    M('shape of the quota line', 'A vertical supply curve, such as one caused by a quota, is described as',
      ['perfectly inelastic', 'perfectly elastic', 'unit elastic', 'relatively elastic'], 0,
      'With perfectly inelastic supply, the amount supplied stays fixed whatever the price, so the supply curve is drawn as a vertical line.'),
    { skill: 'position of the quota line', gen: function () {
      var e = quotaEvent();
      var ops = ['A vertical supply line to the left of the old quantity', 'A vertical supply line to the right of the old quantity', 'The sloping supply curve shifted parallel to the left', 'The demand curve shifted to the left'];
      return { kind: 'mcq', q: e[0] + ' How should the new supply be drawn?', options: ops, answer: e[1],
        why: e[1] === 0 ? 'The permitted quantity is smaller than before, so the vertical quota line goes to the left of the old quantity.' : 'More can now be imported, so the vertical quota line moves to the right of the old quota.' };
    } },
    { skill: 'new price and quantity', gen: function () {
      var e = quotaEvent();
      return { kind: 'mcq', q: e[0] + ' What happens to the equilibrium price and quantity?', options: PQ_OPTS.slice(), answer: e[1],
        why: e[1] === 0 ? 'The vertical line moves left along the unchanged demand curve, so it meets D at a higher price and the quantity falls to the quota.' : 'The vertical line moves right along the unchanged demand curve, so it meets D at a lower price and the quantity rises to the new quota.' };
    } },
    { skill: 'reading the diagram', gen: function () {
      var k = pick([3, 3.5, 4]);
      var pts = [[k, 10 - k], [k, k], [5, 5], [7, 3]];
      var order = shuffle([0, 1, 2, 3]), letters = ['A', 'B', 'C', 'D'];
      var P = order.map(function (j, i) { return { q: pts[j][0], p: pts[j][1], lab: letters[i] }; });
      return { kind: 'mcq', q: 'A quota is introduced and shown by the vertical line S1 (quota). Which point is the new equilibrium?', svg: full('Supply and demand diagram with D, S and a vertical quota line S1, with four points labelled A to D', { lines: [dLine(0, INK, 'D'), sLine(0, INK, 'S'), vLine(k, HI, 'S1 (quota)')], pts: P }),
        options: letters.slice(), answer: order.indexOf(0), keepOrder: true,
        why: 'The new equilibrium is where the vertical quota line meets the demand curve D. The point where it meets the old supply curve S is not an equilibrium, because supply is now the vertical line.' };
    } },
    { skill: 'reading the diagram', gen: function () {
      var k = pick([2, 3, 4]), pu = pick([1, 2, 5, 10, 0.5]), qu = pick([100, 1000, 500, 200]);
      var svg = full('Supply and demand diagram with a vertical quota line and dashed lines to three price levels', {
        lines: [dLine(0, INK, 'D'), sLine(0, INK, 'S'), vLine(k, HI, 'S1 (quota)')],
        guides: [{ q: 5, p: 5, pl: money(5 * pu), ql: fmt(5 * qu) }, { q: k, p: 10 - k, pl: money((10 - k) * pu), ql: fmt(k * qu) }, { q: k, p: k, pl: money(k * pu), noq: true }],
        xl: 'Quantity (tonnes per month)'
      });
      var ans = (10 - k) * pu;
      return { kind: 'num', q: 'The diagram shows a market after a quota of ' + fmt(k * qu) + ' tonnes per month is introduced. What is the new equilibrium price? Give your answer in $.', svg: svg,
        answer: ans, unit: '$', display: String(ans),
        why: 'The new equilibrium is where the vertical quota line at ' + fmt(k * qu) + ' tonnes meets demand D, at ' + money(ans) + '. ' + money(k * pu) + ' is where the quota line meets the old supply curve, which is not the equilibrium.' };
    } },
    { skill: 'reading the diagram', gen: function () {
      var c = pick(COUNTRIES), good = pick(['imported sugar', 'imported wheat flour', 'imported steel bars']);
      var start = pick([20, 30, 40]), step = 5, b = pick([20, 25, 30]), a = b * (start + 4 * step) + pick([100, 150, 200]);
      var prices = [0, 1, 2, 3, 4].map(function (i) { return start + i * step; });
      var qs = prices.map(function (p) { return a - b * p; });
      var j = rint(2, 4), quota = qs[j];
      return { kind: 'num', q: 'The table shows the demand schedule for ' + good + ' in ' + c + ' (thousand tonnes a year).<br>' + table(['Price ($ per tonne)', 'Quantity demanded'], prices.map(function (p, i) { return [money(p), fmt(qs[i])]; })) +
        'Before any limit, ' + fmt(qs[1]) + ' thousand tonnes were sold at ' + money(prices[1]) + '. A quota now limits supply to ' + fmt(quota) + ' thousand tonnes a year. At what price will the market clear? Give your answer in $ per tonne.',
        answer: prices[j], unit: '$', display: String(prices[j]),
        why: 'With a quota, supply is fixed at ' + fmt(quota) + ' thousand tonnes. The market clears where quantity demanded equals that amount, which the schedule shows at ' + money(prices[j]) + ' per tonne.' };
    } },
    M('common errors', 'A student shows a new quota by drawing a sloping supply curve S1 to the left of S. What is wrong?',
      ['A quota should be drawn as a vertical line at the quota quantity', 'The sloping supply curve should have been shifted to the right instead of the left', 'The demand curve should shift instead of the supply curve', 'Nothing is wrong: this earns full marks'], 0,
      'A parallel shift is how a tariff is drawn. A quota fixes the quantity, so it is a vertical (perfectly inelastic) supply line.'),
    M('common errors', 'A student was asked to show a new quota that is <b>smaller</b> than the current quantity, and drew the diagram shown. What is wrong?',
      ['The quota line is to the right of Qe, so it wrongly shows a lower price', 'The quota line should slope upwards like the original supply curve', 'The demand curve should also have shifted to the left', 'Nothing is wrong: the diagram is correct'], 0,
      'A smaller quota must be a vertical line to the left of Qe, meeting D at a higher price. Placing it to the right shows a lower price and higher quantity.',
      { svg: full("A student's diagram with a vertical quota line to the right of the original equilibrium quantity", { lines: [dLine(0, INK, 'D'), sLine(0, INK, 'S'), vLine(6.5, HI, 'S1 (quota)')], guides: [{ q: 5, p: 5, pl: 'Pe', ql: 'Qe' }, { q: 6.5, p: 3.5, pl: 'P1', ql: 'Q1' }] }) }),
    MU('labels and marks', 'Which of these does a full-mark quota diagram need?',
      ['A vertical supply line at the quota, labelled', 'The new price P1 where that line meets D, labelled', 'The new quantity Q1 at the foot of that line, labelled', 'A new demand curve labelled D1', 'A sloping supply curve shifted parallel to the left'], [0, 1, 2],
      'The three marks are for the labelled perfectly inelastic supply line, the labelled new price and the labelled new quantity. Demand does not move.'),
    M('reading the diagram', 'After a new quota is introduced, the new equilibrium quantity is',
      ['equal to the quota quantity', 'where the original supply curve meets demand', 'larger than the quota quantity', 'zero, because imports are banned'], 0,
      'Supply is fixed at the quota, so the quantity traded is the quota amount, read where the vertical line meets the quantity axis.'),
    M('reading the diagram', 'On a quota diagram, the new equilibrium price P1 is found',
      ['where the vertical quota line meets the demand curve', 'where the vertical quota line meets the original supply curve', 'where the original supply curve meets the demand curve', 'at the top end of the vertical quota line'], 0,
      'The vertical line is the new supply. Where it meets demand D is the new equilibrium; read across to the price axis for P1.'),
    M('labels and marks', 'Which curve does <b>not</b> move when a quota is introduced?',
      ['The demand curve', 'The supply curve', 'Neither: both curves move'], 0,
      'A quota restricts supply only. Buyers want the same amounts at each price, so D stays where it is.'),
    M('shape of the quota line', 'A government limits the amount of timber that may be felled each year, below the amount felled now. How is this drawn?',
      ['The same way as an import quota: a vertical supply line at the permitted amount', 'As a parallel shift of the sloping supply curve to the right', 'As a shift of the demand curve to the left', 'As a horizontal line at the current price'], 0,
      'Any quota that caps quantity, whether imported, caught or felled, is drawn as a vertical supply line at the allowed amount.'),
    M('new price and quantity', 'A quota is set below the free-market quantity. At the old equilibrium price, the market now has',
      ['excess demand, so the price rises to P1', 'excess supply, so the price falls to P1', 'no shortage or surplus, so the price stays the same', 'excess demand, so the price falls to P1'], 0,
      'At the old price buyers still want Qe, but only the quota can be supplied. The shortage pushes the price up until demand falls to the quota.'),
    M('shape of the quota line', 'How does a quota diagram differ from a tariff diagram?',
      ['A quota is a vertical supply line; a tariff shifts the sloping supply curve left', 'A quota shifts demand left; a tariff shifts supply left', 'A quota shifts the supply curve right; a tariff shifts the supply curve to the left', 'A quota is a horizontal line; a tariff is a vertical line'], 0,
      'A tariff raises costs, so the sloping supply curve moves left. A quota caps quantity, so supply becomes vertical at the quota.'),
    { skill: 'position of the quota line', gen: function () {
      var up = Math.random() < 0.5, k0 = up ? 3 : 4.5, k1 = up ? 4.5 : 3;
      var ops = ['The quota was increased', 'The quota was reduced', 'A tariff was introduced', 'A subsidy was introduced'];
      return { kind: 'mcq', q: 'The diagram shows the old quota line S1 and a new quota line S2. Which event does it show?', svg: full('Diagram with demand D, an old vertical quota line S1 and a new vertical quota line S2', { lines: [dLine(0, INK, 'D'), vLine(k0, GREY, 'S1'), vLine(k1, HI, 'S2')] }),
        options: ops, answer: up ? 0 : 1,
        why: up ? 'The vertical line has moved right, so more can be supplied: the quota was increased, lowering the price.' : 'The vertical line has moved left, so less can be supplied: the quota was reduced, raising the price.' };
    } },
    M('labels and marks', 'Which order of steps draws a new quota diagram correctly?',
      ['Draw a vertical line at the quota quantity &rarr; find where it meets D &rarr; read across to label P1 &rarr; label Q1 at its foot', 'Shift S left parallel to S1 &rarr; find where S1 meets D &rarr; read across to label P1 &rarr; label Q1', 'Draw a vertical line at Qe &rarr; find where it meets S &rarr; read across to label P1 &rarr; label Q1', 'Shift D left to D1 &rarr; find where D1 meets S &rarr; read across to label P1 &rarr; label Q1'], 0,
      'The quota is the new vertical supply line at the permitted quantity; the new equilibrium is where it meets demand.'),
    MU('new price and quantity', 'A quota is introduced below the current quantity imported. Which statements are correct?',
      ['Supply becomes a vertical line at the quota', 'The equilibrium price rises', 'The equilibrium quantity falls to the quota', 'The demand curve shifts left', 'The equilibrium price falls'], [0, 1, 2],
      'The vertical line to the left of Qe meets the unchanged demand curve at a higher price and a lower quantity.'),
    { skill: 'reading the diagram', gen: function () {
      var k0 = pick([2, 3]), k1 = k0 + pick([1, 2]), pu = pick([1, 2, 5, 10]), qu = pick([100, 500, 1000]);
      var dp = (k0 - k1) * pu;
      var svg = full('Diagram with demand D, old quota line S1 and new quota line S2, with dashed lines to the axes', {
        lines: [dLine(0, INK, 'D'), vLine(k0, GREY, 'S1'), vLine(k1, HI, 'S2')],
        guides: [{ q: k0, p: 10 - k0, pl: money((10 - k0) * pu), ql: fmt(k0 * qu) }, { q: k1, p: 10 - k1, pl: money((10 - k1) * pu), ql: fmt(k1 * qu) }],
        xl: 'Quantity (tonnes per month)'
      });
      return { kind: 'num', q: 'The quota is changed from S1 to S2. What is the change in the equilibrium price? Give your answer in $, using a minus sign for a fall.', svg: svg,
        answer: dp, unit: '$', display: String(dp),
        why: 'S1 meets D at ' + money((10 - k0) * pu) + ' and S2 meets D at ' + money((10 - k1) * pu) + '. Change = ' + money((10 - k1) * pu) + ' - ' + money((10 - k0) * pu) + ' = ' + money(dp) + ': a larger quota lowers the price.' };
    } },
    M('new price and quantity', 'Why does a <b>larger</b> quota lower the equilibrium price?',
      ['More can be supplied, so at the old price there is excess supply that pushes the price down', 'Demand rises, so buyers bid the price down', 'Fewer units are supplied, so sellers must lower their prices', 'The government taxes each imported unit less, so firms pass on the saving by cutting their prices'], 0,
      'The vertical line moves right. At the old price, quantity supplied now exceeds quantity demanded, so the price falls until buyers take the larger amount.'),
    M('new price and quantity', 'Two countries set the same quota on a good, cutting the quantity by the same amount. In which country will the price rise more?',
      ['Where demand is more price inelastic (a steeper demand curve)', 'Where demand is more price elastic (a flatter demand curve)', 'Where the original supply curve is steeper', 'The price rise must be the same in both countries'], 0,
      'With a vertical supply line, the new price is read off the demand curve. A steeper demand curve gives a bigger price rise for the same cut in quantity.')
  ] };

  /* =====================================================================
     ECO-T21-13 The current account
     ===================================================================== */
  var CA4 = ['A visible export', 'A visible import', 'An invisible export', 'An invisible import'];
  function caScenarios(A, Bc) {
    return [
      ['A car maker in ' + A + ' sells 5,000 vehicles to dealers in ' + Bc + '.', 0, 'Cars are goods (visible) and money flows into ' + A + ' (export).'],
      ['Supermarkets in ' + A + ' buy bananas grown in ' + Bc + '.', 1, 'Bananas are goods (visible) and money flows out of ' + A + ' (import).'],
      ['Tourists from ' + Bc + ' stay in hotels in ' + A + '.', 2, 'Tourism is a service (invisible) and the visitors\' money flows into ' + A + ' (export).'],
      ['Families from ' + A + ' take holidays in ' + Bc + '.', 3, 'Tourism is a service (invisible) and their spending flows out of ' + A + ' (import).'],
      ['An insurance firm in ' + A + ' insures ships owned by a firm in ' + Bc + '.', 2, 'Insurance is a service (invisible) and the premiums flow into ' + A + ' (export).'],
      ['Firms in ' + A + ' pay a bank in ' + Bc + ' for financial advice.', 3, 'Financial advice is a service (invisible) and the fees flow out of ' + A + ' (import).'],
      ['Students from ' + Bc + ' pay fees to study at universities in ' + A + '.', 2, 'Education is a service (invisible) and the fees flow into ' + A + ' (export).'],
      ['A steel works in ' + A + ' buys iron ore mined in ' + Bc + '.', 1, 'Iron ore is a good (visible) and money flows out of ' + A + ' (import).'],
      ['Farmers in ' + A + ' sell wheat to flour mills in ' + Bc + '.', 0, 'Wheat is a good (visible) and money flows into ' + A + ' (export).'],
      ['Households in ' + A + ' pay a streaming service based in ' + Bc + ' for films.', 3, 'Streaming is a service (invisible) and the payments flow out of ' + A + ' (import).'],
      ['Hospitals in ' + A + ' buy scanners made in ' + Bc + '.', 1, 'Scanners are goods (visible) and money flows out of ' + A + ' (import).']
    ];
  }
  B['ECO-T21-13'] = { title: 'The current account: exports, imports, deficit and surplus', items: [
    { skill: 'classify transactions', gen: function () {
      var c = countries(), s = pick(caScenarios(c[0], c[1]));
      return { kind: 'mcq', q: 'How is this recorded on <b>' + c[0] + '\'s</b> current account?<br><i>' + s[0] + '</i>', options: CA4.slice(), answer: s[1], why: s[2] };
    } },
    { skill: 'classify transactions', gen: function () {
      var c = countries(), s = pick(caScenarios(c[0], c[1]));
      var flip = [1, 0, 3, 2][s[1]];
      var goods = s[1] < 2;
      return { kind: 'mcq', q: 'How is this recorded on <b>' + c[1] + '\'s</b> current account?<br><i>' + s[0] + '</i>', options: CA4.slice(), answer: flip,
        why: 'Judge from ' + c[1] + '\'s point of view. It is trade in ' + (goods ? 'goods (visible)' : 'services (invisible)') + ', and money flows ' + (flip % 2 === 0 ? 'into ' + c[1] + ', so it is an export for ' + c[1] : 'out of ' + c[1] + ', so it is an import for ' + c[1]) + ', the opposite of ' + c[0] + '.' };
    } },
    M('definitions', 'What is meant by <b>exports</b>?',
      ['Goods and services sold to buyers in other countries', 'Goods and services bought from sellers in other countries', 'Only physical goods carried out of a country by ship', 'Goods produced and sold within the same country'], 0,
      'Exports are goods or services sold abroad, so money flows into the country. Services count too, not only goods.'),
    M('definitions', 'What is meant by <b>imports</b>?',
      ['Goods and services bought from other countries', 'Goods and services sold to other countries', 'Taxes paid on goods that enter a country', 'Goods made at home for local customers'], 0,
      'Imports are goods or services bought from abroad, so money flows out of the country.'),
    M('definitions', 'The current account of the balance of payments records',
      ['trade in goods and services with other countries, plus income flows and transfers', "the government's tax revenue and its spending on public services", 'all the money held by households in their bank accounts', 'the total value of goods and services produced in a country in a year'], 0,
      'The current account records a country\'s money flows with the rest of the world: trade in goods (visibles) and services (invisibles), plus income and transfers.'),
    M('surplus and deficit', 'Which describes a <b>current account surplus</b>?',
      ['Exports are worth more than imports', 'Imports are worth more than exports', 'Government tax revenue is greater than government spending', 'The country produces more goods than services'], 0,
      'A surplus means more money flows in from exports than flows out for imports.'),
    M('surplus and deficit', 'Which describes a <b>current account deficit</b>?',
      ['Imports are worth more than exports', 'Exports are worth more than imports', 'Government spending is greater than tax revenue', 'The country buys more goods than services from abroad'], 0,
      'A deficit means the country spends more on imports than it earns from exports.'),
    M('definitions', 'Which of these is <b>not</b> recorded on a country\'s current account?',
      ['Income tax paid by residents to their own government', 'Fees paid by foreign students to local universities', 'Copper sold to factories in another country', 'Profits sent home by firms operating abroad'], 0,
      'Taxes paid to a country\'s own government are part of the government budget, not flows with the rest of the world.'),
    M('visible and invisible', 'Banking, insurance and tourism services sold to foreign customers are recorded as',
      ['invisible exports', 'visible exports', 'invisible imports', 'visible imports'], 0,
      'Services are invisible trade, and selling to foreigners brings money in, so they are exports.'),
    M('visible and invisible', 'Trade in physical items such as oil, cars and wheat is known as',
      ['visible trade', 'invisible trade', 'income flows', 'transfers'], 0,
      'Goods can be seen and touched, so trade in them is called visible trade. Services are invisible trade.'),
    MU('visible and invisible', 'Which of these are part of <b>invisible</b> trade?',
      ['Tourism', 'Insurance', 'Shipping services', 'Consulting and legal advice', 'Cars', 'Crude oil'], [0, 1, 2, 3],
      'Invisible trade is trade in services. Cars and crude oil are physical goods, so they are visible trade.'),
    MU('classify transactions', 'Which of these are recorded as <b>exports</b> on Kestland\'s current account?',
      ["Kestland's farmers sell apples to Pellora", 'Tourists from Pellora stay in Kestland hotels', 'Kestland households buy washing machines made in Pellora', 'Kestland families take holidays in Pellora', 'A Kestland insurer insures factories in Pellora'], [0, 1, 4],
      'Exports bring money into Kestland: apples sold abroad, foreign tourists\' spending and insurance sold to Pellora. The other two send money out, so they are imports.'),
    M('definitions', 'Profits earned abroad by Ferrosa\'s firms and sent home to Ferrosa are recorded',
      ['on the current account, as income flows', 'on the current account, as trade in goods', 'in the government budget, as tax revenue', 'on the current account, as trade in services'], 0,
      'The current account includes income flows such as profits, interest and wages earned abroad, as well as trade.'),
    M('definitions', 'Money sent home to Rivania by Rivanian nurses working abroad appears on Rivania\'s current account as',
      ['transfers', 'visible exports', 'invisible imports', 'trade in goods'], 0,
      'Money sent home by workers abroad is a transfer: nothing is bought or sold in return.'),
    { skill: 'surplus and deficit', gen: function () {
      var c = pick(COUNTRIES), x = rint(40, 400), d = rint(5, 40) * (Math.random() < 0.5 ? 1 : -1), m = x - d;
      var surplus = d > 0;
      return { kind: 'mcq', q: 'In one year, ' + c + '\'s exports of goods and services were worth $' + x + 'bn and its imports of goods and services were worth $' + m + 'bn. Ignoring income and transfers, what does ' + c + ' have?',
        options: ['A current account surplus', 'A current account deficit', 'A balanced current account', 'A fiscal deficit'], answer: surplus ? 0 : 1,
        why: surplus ? 'Exports ($' + x + 'bn) are worth more than imports ($' + m + 'bn), so it is a surplus.' : 'Imports ($' + m + 'bn) are worth more than exports ($' + x + 'bn), so it is a deficit. A fiscal deficit is about the government budget, not trade.' };
    } },
    M('definitions', 'A student writes: "Exports are goods sent abroad." What would make this a full answer?',
      ['Include services, and say they are sold to buyers in other countries', 'Say that exports are goods bought from other countries', 'Say that exports are only manufactured goods', 'Say that exports are goods taxed by the government'], 0,
      'A full definition covers both goods and services and the cross-border sale: goods and services sold to other countries.'),
    M('classify transactions', 'From a country\'s point of view, how can you tell that a transaction is an export?',
      ['Money flows into the country from abroad', 'The good was produced inside the country', 'Money flows out of the country to abroad', 'The government collects a tax on it'], 0,
      'Follow the money: an export earns money from abroad. Tourists spending in the country count as an export even though nothing leaves.'),
    M('classify transactions', 'A shipping firm based in Norvela is paid to carry goods between two other countries. For Norvela this is',
      ['an invisible export', 'a visible export', 'an invisible import', 'a visible import'], 0,
      'Transport is a service (invisible), and Norvela earns money from foreigners for it (export), even though the goods never enter Norvela.'),
    M('classify transactions', 'Which of these is a <b>visible import</b> for Aldovia?',
      ["Aldovia's factories buy steel from Calvaria", 'Calvarian tourists visit Aldovia', 'Aldovian banks sell insurance to Calvarian firms', 'Aldovian families holiday in Calvaria'], 0,
      'Steel is a good and money flows out of Aldovia to pay for it. Tourism and insurance are services (invisible).'),
    M('definitions', 'The current account is one part of',
      ['the balance of payments', "the government's budget", 'the national debt', "the central bank's interest rate policy"], 0,
      'The balance of payments records all money flows between a country and the rest of the world; the current account is the part covering trade, income and transfers.'),
    M('surplus and deficit', 'Which statement wrongly confuses the current account with the government budget?',
      ['A current account deficit means government spending is greater than tax revenue', 'A current account deficit means imports are worth more than exports', 'A current account surplus means exports are worth more than imports', 'The current account records trade in goods and services'], 0,
      'Government spending above tax revenue is a fiscal (budget) deficit. The current account deals with flows to and from other countries.'),
    M('visible and invisible', 'Tourism is counted as invisible trade because',
      ['it is a service, not a physical good', 'tourists cannot be counted at the border', 'it is always an import for every country', 'it is not recorded in the balance of payments'], 0,
      'Invisible trade means trade in services. Hotel stays, meals and tours are services, so tourism is invisible.'),
    M('surplus and deficit', 'Which definition of a current account surplus would earn full marks?',
      ['The value of exports of goods and services is greater than the value of imports', 'The government collects more in taxes than it spends', 'Exports of goods are greater than exports of services', 'The country produces more than it consumes at home'], 0,
      'A full definition compares the value of exports with the value of imports and says exports are greater.')
  ] };

  /* =====================================================================
     ECO-CALC-22 Trade and current account balances
     ===================================================================== */
  var CURS = ['$', '€', '£'];
  function flows() {
    // exports/imports of goods and services in bn, with neither balance equal to zero
    var xg = rint(80, 400), mg = xg + rint(5, 60) * (Math.random() < 0.5 ? 1 : -1);
    var xs = rint(50, 150), ms = xs + rint(4, 40) * (Math.random() < 0.5 ? 1 : -1);
    if ((xg - mg) + (xs - ms) === 0) xs += 3;
    return { xg: xg, mg: mg, xs: xs, ms: ms };
  }
  function flowTable(f, cur) {
    return table(['', 'Exports (' + cur + 'bn)', 'Imports (' + cur + 'bn)'], [['Goods', f.xg, f.mg], ['Services', f.xs, f.ms]]);
  }
  function signWord(n) { return n < 0 ? 'a deficit' : 'a surplus'; }
  function numQ(q, ans, cur, why) { return { kind: 'num', q: q, answer: ans, unit: cur + 'bn', display: String(ans), why: why }; }
  B['ECO-CALC-22'] = { title: 'Trade and current account balances', items: [
    { skill: 'visible balance', gen: function () {
      var f = flows(), cur = pick(CURS), c = pick(COUNTRIES), v = f.xg - f.mg;
      return numQ('The table shows trade for ' + c + ' in one year.<br>' + flowTable(f, cur) + 'Calculate the <b>visible</b> trade balance in ' + cur + 'bn. Use a minus sign for a deficit.', v, cur,
        'Visible balance = exports of goods - imports of goods = ' + f.xg + ' - ' + f.mg + ' = ' + bn(v, cur) + ', ' + signWord(v) + '. Services are left out because they are invisible trade.');
    } },
    { skill: 'invisible balance', gen: function () {
      var f = flows(), cur = pick(CURS), c = pick(COUNTRIES), v = f.xs - f.ms;
      return numQ('The table shows trade for ' + c + ' in one year.<br>' + flowTable(f, cur) + 'Calculate the <b>invisible</b> trade balance in ' + cur + 'bn. Use a minus sign for a deficit.', v, cur,
        'Invisible balance = exports of services - imports of services = ' + f.xs + ' - ' + f.ms + ' = ' + bn(v, cur) + ', ' + signWord(v) + '. Goods are left out because they are visible trade.');
    } },
    { skill: 'current account', gen: function () {
      var f = flows(), cur = pick(CURS), c = pick(COUNTRIES), v = (f.xg + f.xs) - (f.mg + f.ms);
      return numQ('The table shows trade for ' + c + ' in one year.<br>' + flowTable(f, cur) + 'Using only these figures, calculate the current account balance in ' + cur + 'bn. Use a minus sign for a deficit.', v, cur,
        'Current account = total exports - total imports = (' + f.xg + ' + ' + f.xs + ') - (' + f.mg + ' + ' + f.ms + ') = ' + (f.xg + f.xs) + ' - ' + (f.mg + f.ms) + ' = ' + bn(v, cur) + ', ' + signWord(v) + '.');
    } },
    { skill: 'current account', gen: function () {
      var cur = pick(CURS), c = pick(COUNTRIES), vis = rint(5, 80) * (Math.random() < 0.5 ? 1 : -1), inv = rint(5, 60) * (Math.random() < 0.5 ? 1 : -1);
      if (vis + inv === 0) inv += 2;
      var v = vis + inv;
      return numQ(c + ' has a visible trade balance of ' + bn(vis, cur) + ' and an invisible trade balance of ' + bn(inv, cur) + '. Using only these figures, what is its current account balance in ' + cur + 'bn? Use a minus sign for a deficit.', v, cur,
        'Current account = visible balance + invisible balance = (' + vis + ') + (' + inv + ') = ' + bn(v, cur) + ', ' + signWord(v) + '.');
    } },
    { skill: 'missing value', gen: function () {
      var f = flows(), cur = pick(CURS), c = pick(COUNTRIES), ca = (f.xg + f.xs) - (f.mg + f.ms);
      return numQ('For ' + c + ': exports of goods ' + cur + f.xg + 'bn, imports of goods ' + cur + f.mg + 'bn, exports of services ' + cur + f.xs + 'bn. Using only trade figures, its current account balance is ' + bn(ca, cur) + '. What were its imports of services in ' + cur + 'bn?', f.ms, cur,
        'Current account = (' + f.xg + ' + ' + f.xs + ') - (' + f.mg + ' + imports of services). So imports of services = ' + (f.xg + f.xs) + ' - ' + f.mg + ' - (' + ca + ') = ' + cur + f.ms + 'bn.');
    } },
    { skill: 'missing value', gen: function () {
      var cur = pick(CURS), c = pick(COUNTRIES), xg = rint(80, 420), v = rint(4, 60) * (Math.random() < 0.5 ? 1 : -1), mg = xg - v;
      return numQ(c + '\'s exports of goods were ' + cur + xg + 'bn and its visible trade balance was ' + bn(v, cur) + '. What were its imports of goods in ' + cur + 'bn?', mg, cur,
        'Visible balance = exports of goods - imports of goods, so imports of goods = ' + xg + ' - (' + v + ') = ' + cur + mg + 'bn.');
    } },
    { skill: 'visible balance', gen: function () {
      var f = flows(), cur = pick(CURS), c = pick(COUNTRIES), v = f.xg - f.mg;
      var opts = [bn(v, cur), bn(-v, cur), bn(f.xs - f.ms, cur), bn((f.xg + f.xs) - (f.mg + f.ms), cur), bn(f.xg + f.mg, cur)];
      var seen = {}, o2 = [], ans = 0;
      opts.forEach(function (o, i) { if (!seen[o]) { seen[o] = 1; o2.push(o); } });
      o2 = o2.slice(0, 4);
      return { kind: 'mcq', q: 'The table shows trade for ' + c + '.<br>' + flowTable(f, cur) + 'What is ' + c + '\'s visible trade balance?', options: o2, answer: ans,
        why: 'Visible = goods only: ' + f.xg + ' - ' + f.mg + ' = ' + bn(v, cur) + '. The wrong options come from common errors: reversing the subtraction, using services, or using all the flows.' };
    } },
    { skill: 'current account', gen: function () {
      var f = flows(), cur = pick(CURS), c = pick(COUNTRIES), v = (f.xg + f.xs) - (f.mg + f.ms);
      var opts = [bn(v, cur), bn(-v, cur), bn(f.xg - f.mg, cur), bn(f.xs - f.ms, cur), bn(f.xg - f.ms, cur)];
      var seen = {}, o2 = [];
      opts.forEach(function (o) { if (!seen[o]) { seen[o] = 1; o2.push(o); } });
      o2 = o2.slice(0, 4);
      return { kind: 'mcq', q: 'The table shows trade for ' + c + '.<br>' + flowTable(f, cur) + 'Using only these figures, what is ' + c + '\'s current account balance?', options: o2, answer: 0,
        why: 'Current account = (goods + services exports) - (goods + services imports) = ' + (f.xg + f.xs) + ' - ' + (f.mg + f.ms) + ' = ' + bn(v, cur) + '.' };
    } },
    { skill: 'interpreting the sign', gen: function () {
      var f = flows(), cur = pick(CURS), c = pick(COUNTRIES), v = (f.xg + f.xs) - (f.mg + f.ms), a = Math.abs(v);
      var opts = ['A current account ' + (v < 0 ? 'deficit' : 'surplus') + ' of ' + cur + a + 'bn', 'A current account ' + (v < 0 ? 'surplus' : 'deficit') + ' of ' + cur + a + 'bn', 'A current account ' + (v < 0 ? 'deficit' : 'surplus') + ' of ' + cur + (f.xg + f.xs + f.mg + f.ms) + 'bn', 'A fiscal ' + (v < 0 ? 'deficit' : 'surplus') + ' of ' + cur + a + 'bn'];
      return { kind: 'mcq', q: 'The table shows trade for ' + c + '.<br>' + flowTable(f, cur) + 'Using only these figures, which statement is correct?', options: opts, answer: 0,
        why: 'Total exports ' + (f.xg + f.xs) + ' - total imports ' + (f.mg + f.ms) + ' = ' + bn(v, cur) + '. ' + (v < 0 ? 'A negative balance is a deficit.' : 'A positive balance is a surplus.') + ' A fiscal balance is about the government budget, not trade.' };
    } },
    { skill: 'visible balance', gen: function () {
      var cur = pick(CURS), c = pick(COUNTRIES), y = pick([2021, 2022, 2023]);
      var x1 = rint(100, 300), m1 = x1 + rint(-40, 40), x2 = x1 + rint(-30, 30), m2 = m1 + rint(-30, 30);
      if ((x2 - m2) - (x1 - m1) === 0) x2 += 4;
      var ch = (x2 - m2) - (x1 - m1);
      return numQ('Trade in goods for ' + c + ':<br>' + table(['', y, y + 1], [['Exports of goods (' + cur + 'bn)', x1, x2], ['Imports of goods (' + cur + 'bn)', m1, m2]]) + 'By how much did the visible trade balance change from ' + y + ' to ' + (y + 1) + '? Give your answer in ' + cur + 'bn, with a minus sign if it fell.', ch, cur,
        'Visible balance ' + y + ' = ' + x1 + ' - ' + m1 + ' = ' + (x1 - m1) + '; ' + (y + 1) + ' = ' + x2 + ' - ' + m2 + ' = ' + (x2 - m2) + '. Change = ' + (x2 - m2) + ' - (' + (x1 - m1) + ') = ' + ch + ' (' + cur + 'bn).');
    } },
    { skill: 'interpreting the sign', gen: function () {
      var cur = pick(CURS), c = pick(COUNTRIES), years = [2020, 2021, 2022, 2023];
      var bals = shuffle([-rint(2, 8), -rint(9, 15), -rint(16, 25), rint(3, 12)]);
      var rows = years.map(function (y, i) { var x = rint(150, 300); return [y, x, x - bals[i]]; });
      var worst = 0; bals.forEach(function (b, i) { if (b < bals[worst]) worst = i; });
      return { kind: 'mcq', q: 'Exports and imports of goods and services for ' + c + ' (' + cur + 'bn):<br>' + table(['Year', 'Exports', 'Imports'], rows) + 'In which year was the current account deficit largest (using only these figures)?',
        options: years.map(String), answer: worst,
        why: 'Balances (exports - imports): ' + years.map(function (y, i) { return y + ': ' + bn(bals[i], cur); }).join('; ') + '. The most negative is ' + years[worst] + '.' };
    } },
    { skill: 'current account', gen: function () {
      var cur = pick(CURS), c = pick(COUNTRIES);
      var xg = rint(3000, 6000) / 10, mg = rint(3000, 6000) / 10, xs = rint(800, 2500) / 10, ms = rint(800, 2500) / 10;
      var v = R.roundDp((xg + xs) - (mg + ms), 1);
      if (Math.abs(v) < 1) { xs = R.roundDp(xs + 12.4, 1); v = R.roundDp((xg + xs) - (mg + ms), 1); }
      return { kind: 'num', q: 'Trade for ' + c + ' (' + cur + 'bn):<br>' + table(['', 'Exports', 'Imports'], [['Goods', xg.toFixed(1), mg.toFixed(1)], ['Services', xs.toFixed(1), ms.toFixed(1)]]) + 'Using only these figures, calculate the current account balance in ' + cur + 'bn to 1 decimal place. Use a minus sign for a deficit.',
        answer: v, unit: cur + 'bn', tol: 0.05, display: v.toFixed(1),
        why: '(' + xg.toFixed(1) + ' + ' + xs.toFixed(1) + ') - (' + mg.toFixed(1) + ' + ' + ms.toFixed(1) + ') = ' + R.roundDp(xg + xs, 1).toFixed(1) + ' - ' + R.roundDp(mg + ms, 1).toFixed(1) + ' = ' + v.toFixed(1) + ' (' + cur + 'bn), ' + signWord(v) + '.' };
    } },
    { skill: 'invisible balance', gen: function () {
      var cur = pick(CURS), c = pick(COUNTRIES), xs = rint(20, 90), ms = xs + rint(6, 35), xg = rint(100, 300), mg = xg - rint(10, 50);
      var v = xs - ms;
      return numQ('Many residents of ' + c + ' take holidays abroad. Its exports of goods were ' + cur + xg + 'bn, imports of goods ' + cur + mg + 'bn, exports of services ' + cur + xs + 'bn and imports of services ' + cur + ms + 'bn. Calculate its invisible trade balance in ' + cur + 'bn. Use a minus sign for a deficit.', v, cur,
        'Invisible balance = services only: ' + xs + ' - ' + ms + ' = ' + bn(v, cur) + ', a deficit, because residents spend more on foreign services (such as holidays abroad) than foreigners spend on ' + c + '\'s services.');
    } },
    M('invisible balance', 'Which calculation gives the <b>invisible</b> trade balance?',
      ['Exports of services - imports of services', 'Exports of goods - imports of goods', 'Imports of services - exports of services', 'Exports of services + imports of services'], 0,
      'Invisible trade is trade in services, and a balance is always exports minus imports.'),
    { skill: 'interpreting the sign', gen: function () {
      var cur = pick(CURS), c = pick(COUNTRIES), d = rint(3, 12), big = d + rint(2, 6), small = rint(1, d - 1);
      var opts = ['Exports rise by ' + cur + big + 'bn while imports stay the same', 'Imports rise by ' + cur + big + 'bn while exports stay the same', 'Exports fall by ' + cur + small + 'bn while imports stay the same', 'Imports fall by ' + cur + small + 'bn while exports stay the same'];
      return { kind: 'mcq', q: c + ' has a current account deficit of ' + cur + d + 'bn. Which change on its own would turn this into a surplus?', options: opts, answer: 0,
        why: 'The balance is -' + d + '. Exports up ' + big + ' gives -' + d + ' + ' + big + ' = ' + (big - d) + ', a surplus. Imports falling by only ' + small + ' leaves -' + (d - small) + ', still a deficit; the other two make the deficit bigger.' };
    } },
    { skill: 'visible balance', gen: function () {
      var cur = pick(CURS), c = pick(COUNTRIES), xg = rint(100, 300), mg = xg + rint(5, 40), up = rint(10, 60);
      var v = xg + up - mg;
      if (v === 0) up += 3, v = xg + up - mg;
      return numQ(c + '\'s exports of goods were ' + cur + xg + 'bn and its imports of goods ' + cur + mg + 'bn. Next year exports of goods rise by ' + cur + up + 'bn and imports of goods do not change. What is the new visible trade balance in ' + cur + 'bn? Use a minus sign for a deficit.', v, cur,
        'New exports = ' + xg + ' + ' + up + ' = ' + (xg + up) + '. Visible balance = ' + (xg + up) + ' - ' + mg + ' = ' + bn(v, cur) + ', ' + signWord(v) + '.');
    } },
    { skill: 'current account', gen: function () {
      var c = pick(COUNTRIES), cur = pick(CURS);
      var xg = rint(1200, 9000), mg = rint(1200, 9000), xs = rint(400, 3000), ms = rint(400, 3000);
      var v = (xg + xs) - (mg + ms);
      if (v === 0) { xs += 25; v = 25; }
      return { kind: 'num', q: 'Last year ' + c + ' sold goods worth ' + cur + fmt(xg) + ' million and services worth ' + cur + fmt(xs) + ' million to other countries. It bought goods worth ' + cur + fmt(mg) + ' million and services worth ' + cur + fmt(ms) + ' million from abroad. Using only these figures, calculate its current account balance in ' + cur + ' million. Use a minus sign for a deficit.',
        answer: v, unit: cur + 'm', display: String(v),
        why: '(' + fmt(xg) + ' + ' + fmt(xs) + ') - (' + fmt(mg) + ' + ' + fmt(ms) + ') = ' + fmt(xg + xs) + ' - ' + fmt(mg + ms) + ' = ' + fmt(v) + ' (' + cur + ' million), ' + signWord(v) + '.' };
    } },
    { skill: 'interpreting the sign', gen: function () {
      var f = flows(), cur = pick(CURS), c = pick(COUNTRIES), vis = f.xg - f.mg, inv = f.xs - f.ms, ca = vis + inv;
      var st = [
        [c + ' has a visible trade surplus', vis > 0], [c + ' has a visible trade deficit', vis < 0],
        [c + ' has an invisible trade surplus', inv > 0], [c + ' has an invisible trade deficit', inv < 0],
        [c + ' has a current account surplus (trade figures only)', ca > 0], [c + ' has a current account deficit (trade figures only)', ca < 0]
      ];
      var opts = st.map(function (s) { return s[0]; }), ans = [];
      st.forEach(function (s, i) { if (s[1]) ans.push(i); });
      return { kind: 'multi', q: 'The table shows trade for ' + c + '.<br>' + flowTable(f, cur) + 'Which statements are correct?', options: opts, answers: ans,
        why: 'Visible: ' + f.xg + ' - ' + f.mg + ' = ' + vis + '. Invisible: ' + f.xs + ' - ' + f.ms + ' = ' + inv + '. Current account: ' + vis + ' + (' + inv + ') = ' + ca + ' (' + cur + 'bn). Positive is a surplus, negative a deficit.' };
    } },
    { skill: 'invisible balance', gen: function () {
      var cur = pick(CURS), c = pick(COUNTRIES);
      var rows = [['Tourism', rint(5, 40), rint(5, 40)], ['Transport', rint(3, 25), rint(3, 25)], ['Financial services', rint(5, 50), rint(2, 30)]];
      var x = rows[0][1] + rows[1][1] + rows[2][1], m = rows[0][2] + rows[1][2] + rows[2][2];
      if (x === m) { rows[2][1] += 3; x += 3; }
      var v = x - m;
      return numQ('Trade in services for ' + c + ' (' + cur + 'bn):<br>' + table(['Service', 'Exports', 'Imports'], rows) + 'Calculate the invisible trade balance in ' + cur + 'bn. Use a minus sign for a deficit.', v, cur,
        'Total service exports = ' + rows.map(function (r) { return r[1]; }).join(' + ') + ' = ' + x + '; total service imports = ' + rows.map(function (r) { return r[2]; }).join(' + ') + ' = ' + m + '. Invisible balance = ' + x + ' - ' + m + ' = ' + bn(v, cur) + '.');
    } },
    { skill: 'visible balance', gen: function () {
      var cur = pick(CURS), c = pick(COUNTRIES);
      var rows = [['Fuels and minerals', rint(5, 80), rint(5, 80)], ['Food', rint(5, 40), rint(5, 40)], ['Machinery and vehicles', rint(10, 90), rint(10, 90)]];
      var x = rows[0][1] + rows[1][1] + rows[2][1], m = rows[0][2] + rows[1][2] + rows[2][2];
      if (x === m) { rows[1][1] += 2; x += 2; }
      var v = x - m;
      return numQ('Trade in goods for ' + c + ' (' + cur + 'bn):<br>' + table(['Goods', 'Exports', 'Imports'], rows) + 'Calculate the visible trade balance in ' + cur + 'bn. Use a minus sign for a deficit.', v, cur,
        'Total goods exports = ' + rows.map(function (r) { return r[1]; }).join(' + ') + ' = ' + x + '; total goods imports = ' + rows.map(function (r) { return r[2]; }).join(' + ') + ' = ' + m + '. Visible balance = ' + x + ' - ' + m + ' = ' + bn(v, cur) + ', ' + signWord(v) + '.');
    } },
    M('interpreting the sign', 'A country\'s exports are $80bn and its imports are $95bn. A student works out 95 - 80 and writes "a surplus of $15bn". What is the mistake?',
      ['The student found imports - exports; the balance is -$15bn, a deficit', 'The student should have added the figures to get $175bn', 'The student should have divided exports by imports', 'There is no mistake: it is a surplus of $15bn'], 0,
      'A balance is exports - imports = 80 - 95 = -$15bn. A negative figure is a deficit.'),
    M('interpreting the sign', 'A student adds a country\'s exports and imports together. What has the student actually calculated?',
      ['The total value of trade, not the trade balance', 'The current account surplus or deficit for the year', 'The visible trade deficit', 'The invisible trade balance'], 0,
      'A balance compares flows by subtracting imports from exports. Adding them gives the total value of trade, which says nothing about a surplus or deficit.'),
    { skill: 'missing value', gen: function () {
      var cur = pick(CURS), c = pick(COUNTRIES), vis = rint(5, 60) * (Math.random() < 0.5 ? 1 : -1), inv = rint(4, 50) * (Math.random() < 0.5 ? 1 : -1);
      if (vis + inv === 0) vis += 3;
      var ca = vis + inv;
      return numQ('Using trade figures only, ' + c + '\'s current account balance is ' + bn(ca, cur) + ' and its visible trade balance is ' + bn(vis, cur) + '. What is its invisible trade balance in ' + cur + 'bn? Use a minus sign for a deficit.', inv, cur,
        'Current account = visible + invisible, so invisible = ' + ca + ' - (' + vis + ') = ' + bn(inv, cur) + '.');
    } }
  ] };

  /* =====================================================================
     ECO-T21-28 Monetary policy
     ===================================================================== */
  B['ECO-T21-28'] = { title: 'Monetary policy: interest rates and the central bank', items: [
    M('definitions', 'What is meant by an <b>interest rate</b>?',
      ['The cost of borrowing money and the reward for saving it', 'The amount of tax paid on income from savings', 'The rise in the general price level over a year', 'The price of one currency in terms of another'], 0,
      'An interest rate has two sides: borrowers pay it as the cost of a loan, and savers receive it as the reward for saving.'),
    M('definitions', 'A student defines an interest rate as "the cost of borrowing". What is missing for full marks?',
      ['That it is also the reward for saving', "That it is set by the government's finance ministry", 'That it is a tax on bank profits', 'That it is always above the inflation rate'], 0,
      'The full definition needs both ideas: the cost of borrowing and the reward for saving.'),
    M('definitions', 'What is meant by <b>monetary policy</b>?',
      ['The central bank changing interest rates or the money supply to influence total demand', 'The government changing taxes and the amount it spends in order to influence total demand', "Government measures that raise the economy's productive capacity", 'Limits placed on the quantity of goods that can be imported'], 0,
      'Monetary policy is run by the central bank using interest rates (and the money supply). Taxes and spending are fiscal policy; raising capacity is supply-side policy.'),
    M('central bank', 'In most countries, who sets the main interest rate?',
      ['The central bank', 'The finance ministry', 'Commercial banks acting together', "The country's largest employers"], 0,
      'The central bank is the monetary authority. A common error is saying the government sets interest rates.'),
    { skill: 'classify policy', gen: function () {
      var c = pick(COUNTRIES);
      var list = [
        ["The central bank of " + c + ' raises its main interest rate by 0.5 percentage points.', 0],
        ["The central bank of " + c + ' buys government bonds from commercial banks.', 0],
        ["The central bank of " + c + ' cuts its main interest rate to 2%.', 0],
        ['The government of ' + c + ' raises the rate of income tax to reduce consumer spending.', 1],
        ['The government of ' + c + ' raises its spending on public services to boost total demand in a slowdown.', 1],
        ['The government of ' + c + ' cuts the rate of VAT so that shoppers spend more.', 1],
        ['The government of ' + c + ' pays for engineering apprenticeships to fill skill shortages.', 2],
        ['The government of ' + c + ' builds a new high-speed rail line to cut journey times.', 2]
      ];
      var s = pick(list), ops = ['Monetary policy', 'Fiscal policy aimed at total demand', 'Supply-side policy'];
      var why = ['The central bank changing interest rates or buying assets is monetary policy.', 'The government changing taxes or its spending to manage total demand is fiscal policy.', 'Measures that raise the economy\'s productive capacity are supply-side policy.'];
      return { kind: 'mcq', q: 'Which type of policy is this?<br><i>' + s[0] + '</i>', options: ops, answer: s[1], why: why[s[1]] };
    } },
    { skill: 'direction of change', gen: function () {
      var c = pick(COUNTRIES), infl = Math.random() < 0.5;
      var q = infl ? 'Inflation in ' + c + ' has risen to ' + rint(6, 11) + '% against a target of 2%, and unemployment is low.' : c + ' is in a recession: output is falling, unemployment has risen to ' + rint(8, 13) + '% and inflation is below target at ' + pick(['0.5', '1', '1.2']) + '%.';
      return { kind: 'mcq', q: q + ' What should the central bank most likely do with interest rates?', options: ['Raise interest rates', 'Cut interest rates', 'Keep interest rates unchanged'], answer: infl ? 0 : 1,
        why: infl ? 'Higher rates make borrowing dearer and saving more attractive, so spending and total demand fall, easing inflation.' : 'Lower rates make borrowing cheaper and saving less attractive, so spending, output and jobs rise, and inflation below target leaves room to do this.' };
    } },
    M('transmission', 'The central bank of Pellora raises its interest rate from 3% to 4.5%, so loans become more expensive. What is the next link in the chain?',
      ['Households and firms borrow less, so spending falls', 'Households borrow more because banks pay them more', 'Firms invest more because their profits rise', 'Import prices rise, so inflation goes up'], 0,
      'Dearer borrowing means fewer loans for houses, cars and machinery, so consumer spending and investment fall, reducing total demand.'),
    M('transmission', 'Higher interest rates make saving more attractive. How does this help to reduce inflation?',
      ['People save more and spend less, so total demand and price pressure fall', 'People save more, so banks have more money to lend and total demand and prices rise', 'People spend more of their savings, so prices rise', 'Firms raise wages, so their costs fall'], 0,
      'Money saved is not spent. Lower consumer spending reduces total demand, which eases demand-pull inflation.'),
    M('transmission', 'Why might a firm postpone building a new warehouse when interest rates rise?',
      ['The loan to pay for it costs more, so the project is less profitable', 'Its savings earn less interest, so it has less money to spend on the warehouse', 'Its exports become cheaper, so it needs less storage space', 'Its customers will have more money to spend'], 0,
      'Investment is often paid for with loans. Higher interest makes the project dearer, so firms cut investment and total demand falls.'),
    M('transmission', 'Many households in Marovia have mortgages with variable interest rates. If the rate rises, what is the most likely effect?',
      ['Monthly repayments rise, leaving less income for other spending', 'Monthly repayments fall, leaving households more income to spend on other things', 'House prices rise because loans are cheaper', 'Households save less because saving earns less'], 0,
      'A higher rate raises mortgage payments, so households have less disposable income for other goods and services, and consumer spending falls.'),
    M('exchange rate route', 'A rise in interest rates in Kestland attracts savings from abroad. Which chain follows?',
      ["Demand for Kestland's currency rises, it appreciates, imports become cheaper and inflation falls", "Kestland's currency depreciates, imports become dearer and inflation rises", "Kestland's currency appreciates, so its exports become cheaper abroad and total demand in Kestland rises", "Demand for Kestland's currency falls, so imports become cheaper"], 0,
      'Foreign savers must buy Kestland\'s currency, so it appreciates. Imports become cheaper, which lowers costs and prices (less cost-push inflation).'),
    M('exchange rate route', 'If Aldovia cuts its interest rate, its currency may depreciate. How could this help Aldovia\'s exporters?',
      ['Their goods become cheaper for foreign buyers, so they sell more', 'Their goods become dearer for foreign buyers, so they sell less', 'Their imported inputs become cheaper to buy', 'Their borrowing costs rise, so they invest less'], 0,
      'A weaker currency means foreigners need less of their own money to buy Aldovian goods, so exports rise, adding to total demand and jobs.'),
    M('asset purchasing', 'Asset purchasing by a central bank means',
      ['buying government bonds and other assets from banks, so banks have more money to lend', 'selling government bonds to commercial banks in order to take money out of the whole economy', 'buying shares in large firms so it can control their prices', 'the government buying land on which to build infrastructure'], 0,
      'By buying assets from commercial banks, the central bank puts more money into the banking system, so more can be lent to households and firms.'),
    M('asset purchasing', 'The central bank buys bonds worth billions from commercial banks. What is the most likely aim?',
      ['To increase lending and spending when the economy is weak', 'To reduce lending because inflation is far above target', 'To raise income tax revenue for the government', 'To limit the quantity of goods that can be imported'], 0,
      'Asset purchasing adds money to banks, lowering borrowing costs and encouraging loans, which supports spending, output and jobs.'),
    MU('central bank', 'Which of these are roles of a central bank?',
      ['Setting interest rates', 'Managing the money supply', 'Regulating the banking system', 'Acting as lender of last resort to banks', 'Setting income tax rates', 'Deciding spending on schools'], [0, 1, 2, 3],
      'Tax rates and spending on schools are decided by the government (fiscal policy), not the central bank.'),
    M('limits', 'Interest rates were raised a month ago, but inflation is still high. Which limitation of monetary policy explains this?',
      ['Time lags: the full effect can take a year or more to appear', 'Monetary policy affects only government spending', 'Interest rates affect only exporters, not consumers', 'Interest rates cannot be changed more than once a year'], 0,
      'People and firms adjust borrowing, saving and spending gradually, so the full effect of a rate change on prices takes time.'),
    M('limits', 'Interest rates are cut to 0.5%, but households fear losing their jobs. Why might spending still not rise?',
      ['Low confidence means people save rather than borrow, however cheap loans are', 'Low interest rates make borrowing more expensive', 'Low interest rates make the currency appreciate, which raises the demand for exports', 'Low interest rates force banks to stop lending'], 0,
      'Cheap loans only help if people want to borrow. When confidence is low, households and firms hold back whatever the rate.'),
    M('limits', 'Inflation in Sundara is caused mainly by a rise in world oil prices. Why might raising interest rates be a weak response?',
      ['The cause is rising costs, not too much demand, so higher rates mainly cut output and jobs', 'Higher interest rates would raise the world price of oil', 'Higher interest rates would weaken the currency and make all imported goods dearer for firms and households', 'The central bank cannot change interest rates when oil prices rise'], 0,
      'This is cost-push inflation. Cutting demand does little about the oil price, but it does reduce spending, output and employment.'),
    { skill: 'transmission', gen: function () {
      var up = Math.random() < 0.5, c = pick(COUNTRIES);
      var groups = [
        ['households with savings in the bank', 'Better off: their savings earn more interest', 'Worse off: their savings earn less interest', 'the interest rate is the reward for saving'],
        ['households with variable-rate loans', 'Worse off: their loan repayments rise', 'Better off: their loan repayments fall', 'the interest rate is the cost of borrowing'],
        ['firms planning to borrow to buy machinery', 'Less likely to invest: borrowing costs more', 'More likely to invest: borrowing costs less', 'the interest rate is the cost of the loan that pays for the machinery']
      ];
      var g = pick(groups);
      var opts = up ? [g[1], g[2]] : [g[2], g[1]];
      opts.push('Unaffected: interest rates only matter to the government', 'Unaffected: interest rates only matter to banks');
      return { kind: 'mcq', q: 'The central bank of ' + c + ' ' + (up ? 'raises' : 'cuts') + ' interest rates. What is the most likely effect on ' + g[0] + '?', options: opts, answer: 0,
        why: 'For ' + g[0] + ', ' + g[3] + '. After a ' + (up ? 'rise' : 'cut') + ' in rates they are ' + opts[0].charAt(0).toLowerCase() + opts[0].slice(1).replace(':', ', because') + '. Interest rates affect households and firms, not just the government or banks.' };
    } },
    MU('transmission', 'Which are likely effects of a <b>cut</b> in interest rates?',
      ['More borrowing by households and firms', 'More investment by firms', 'The currency may depreciate', 'Saving becomes more attractive', 'Imports become cheaper'], [0, 1, 2],
      'Cheaper loans raise borrowing and investment, and lower rates can weaken the currency, making imports dearer. Saving becomes less attractive.'),
    M('limits', 'Raising interest rates to cut inflation risks which trade-off?',
      ['Lower output and higher unemployment', 'Higher inflation and more borrowing', 'A weaker currency and dearer imports', 'More saving and more spending at once'], 0,
      'Less spending lowers demand for goods, so firms produce less and may cut jobs: price stability can conflict with growth and employment.'),
    M('classify policy', 'Which of these is <b>not</b> monetary policy?',
      ['Raising the rate of VAT on goods', "Raising the central bank's interest rate", 'Buying government bonds from banks', "Cutting the central bank's interest rate"], 0,
      'VAT is a tax set by the government, so changing it is fiscal policy. The others are central bank actions.'),
    { skill: 'direction of change', gen: function () {
      var c = pick(COUNTRIES), up = Math.random() < 0.5;
      var a = pick(['1.5', '2', '2.5', '3']), b = up ? pick(['4', '4.25', '4.5', '5']) : pick(['0.25', '0.5', '0.75', '1']);
      var ops = up ? ['To reduce inflation', 'To reduce unemployment quickly', 'To boost consumer borrowing', 'To make exports cheaper abroad'] : ['To boost spending, output and jobs', 'To reduce inflation quickly', 'To encourage households to save more', 'To make imports cheaper'];
      var from = up ? a : pick(['3.5', '4', '4.5']);
      return { kind: 'mcq', q: 'Over one year, the central bank of ' + c + ' ' + (up ? 'raised' : 'cut') + ' its interest rate from ' + from + '% to ' + b + '%. What was the most likely aim?', options: ops, answer: 0,
        why: up ? 'Higher rates reduce borrowing and spending, cutting total demand and inflation. They tend to raise unemployment and make exports dearer, so the other aims do not fit.' : 'Lower rates make borrowing cheaper and saving less rewarding, so spending, output and employment rise. They would not cut inflation or encourage saving.' };
    } },
    M('limits', 'The central bank cuts its rate from 4.00% to 3.75%. Why might this have little effect on spending?',
      ['A small cut makes little difference to the cost of most loans', 'Any cut makes borrowing more expensive', 'Cuts always cause the currency to appreciate sharply, making exports dearer', 'The cut raises the reward for saving'], 0,
      'A 0.25 percentage point cut changes monthly loan repayments only slightly, so it may not change many spending decisions.')
  ] };

  /* =====================================================================
     ECO-T21-33 Supply-side policy
     ===================================================================== */
  B['ECO-T21-33'] = { title: 'Supply-side policy: training, infrastructure and tax cuts', items: [
    M('definitions', 'What is meant by <b>supply-side policy</b>?',
      ['Government measures that increase the productive capacity of the economy', 'Central bank changes to interest rates that are used to control total demand', 'Government measures that raise total demand during a recession', 'Measures that limit the quantity of goods that can be imported'], 0,
      'Supply-side policy aims to raise how much the economy can produce (aggregate supply), for example through training or infrastructure.'),
    M('definitions', 'A student writes: "Supply-side policy boosts consumer spending." Why is this wrong?',
      ['Supply-side policy aims to raise productive capacity, not demand', 'Supply-side policy always cuts consumer spending', 'Supply-side policy is run by the central bank through changes in interest rates', 'Supply-side policy only affects imports'], 0,
      'Raising spending is a demand-side aim. Supply-side policy works on what the economy is able to produce.'),
    M('definitions', 'What is meant by <b>infrastructure</b>?',
      ['Basic structures such as roads, rail and power networks that an economy needs to operate', 'The total value of goods and services produced in a country in one year', 'The machinery, equipment and buildings owned by a single manufacturing firm for its own use', 'The number of workers employed in the construction industry'], 0,
      'Infrastructure is the transport, energy and communication networks that every firm and household relies on.'),
    { skill: 'classify measures', gen: function () {
      var c = pick(COUNTRIES);
      var list = [
        ['The government of ' + c + ' funds apprenticeships in engineering, where skills are in short supply.', 0],
        [c + ' raises its school-leaving age from 16 to 18.', 0],
        [c + ' builds a high-speed rail line to cut journey times between its cities.', 0],
        [c + ' cuts corporation tax so that firms keep more profit to invest.', 0],
        [c + ' cuts income tax rates to encourage people to work more hours.', 0],
        ['The central bank of ' + c + ' lowers its main interest rate.', 1],
        ['The central bank of ' + c + ' buys government bonds from commercial banks.', 1],
        ['The government of ' + c + ' raises unemployment benefits to boost spending in a recession.', 2],
        ['The government of ' + c + ' raises VAT to reduce consumer spending.', 2]
      ];
      var s = pick(list), ops = ['Supply-side policy', 'Monetary policy', 'Fiscal policy aimed at total demand'];
      var why = ['It raises productive capacity, through skills, infrastructure or incentives to invest and work.', 'It is run by the central bank through interest rates or asset purchasing.', 'It changes taxes or spending to manage total demand, not productive capacity.'];
      return { kind: 'mcq', q: 'Which type of policy is this?<br><i>' + s[0] + '</i>', options: ops, answer: s[1], why: why[s[1]] };
    } },
    M('education and training', 'Unemployed coal miners in Brevonia take a government-funded course in wind-turbine repair, where there are many vacancies. What is the most likely effect?',
      ['Structural unemployment falls because their skills now match the vacancies', 'Cyclical unemployment rises because total demand falls', 'Seasonal unemployment rises because turbines are repaired in summer', 'Inflation falls because interest rates rise'], 0,
      'Structural unemployment is caused by a mismatch between workers\' skills and the jobs available. Retraining closes that gap.'),
    M('education and training', 'Education and training are most likely to reduce which type of unemployment?',
      ['Structural', 'Seasonal', 'Cyclical', 'Voluntary'], 0,
      'Training gives workers the skills that growing industries need, tackling the skills mismatch behind structural unemployment.'),
    M('evaluation', 'Unemployment in Pellora rose because a recession cut demand for goods. Why might more training be a weak response?',
      ['The unemployment is cyclical, so trained workers find few jobs until demand recovers', 'Training always increases cyclical unemployment', 'Training raises interest rates and taxes, which lowers total demand further in a recession', 'Training reduces the number of people of working age'], 0,
      'Training works when jobs exist but workers lack skills. In a recession the problem is too few jobs, so demand-side policy fits better.'),
    M('infrastructure', 'A student says a new railway helps the economy only by creating construction jobs. What has the student missed?',
      ["Once built, it cuts firms' transport costs and journey times for many years", 'Once built, it raises the cost of moving goods and people around the whole country', 'It also lowers interest rates for all borrowers', 'It also reduces the number of firms in the economy'], 0,
      'Construction jobs are a short-run effect. The long-run supply-side gain is lower costs and faster journeys, which raise productivity.'),
    M('infrastructure', 'A new deep-water port in Valdoria cuts shipping times for exporters. Which chain follows?',
      ["Firms' costs fall, their exports become more competitive and output rises", "Firms' costs rise, so their exports become dearer abroad and their output falls", 'Demand for imports falls because the port is only for exports', 'Interest rates rise, so firms invest less in new machinery'], 0,
      'Faster, cheaper shipping lowers firms\' costs, so they can price exports more competitively, sell more and expand output.'),
    M('infrastructure', 'Fast broadband reaches rural areas of Norvela for the first time. How is this a supply-side benefit?',
      ['Firms can operate and hire workers in more places, raising productive capacity', 'It raises interest rates and so reduces inflation', 'It makes imported goods dearer and so protects jobs in local firms from competition', 'It raises tax revenue by charging for internet use'], 0,
      'Better communication infrastructure lets businesses set up and work efficiently outside cities, using more of the country\'s resources.'),
    M('tax cuts', 'Rivania cuts corporation tax from 28% to 20%. How is this meant to raise productive capacity?',
      ['Firms keep more profit to invest in machinery and technology', 'Households pay less income tax and spend more in shops', 'Imports become cheaper because tariffs are lower', 'The central bank can cut interest rates further'], 0,
      'Corporation tax is a tax on firms\' profits. Lower tax leaves more retained profit for investment, which raises productivity and capacity.'),
    M('evaluation', 'Which point most weakens the claim that a cut in corporation tax will boost investment?',
      ['Firms may pay the extra profit to shareholders as dividends instead', 'Firms will have more profit left after tax', 'Lower business taxes may attract foreign firms that build new factories', 'Some firms will buy new machinery with the money'], 0,
      'The tax cut only raises capacity if firms invest the extra profit. If they pay it out to shareholders, productive capacity does not rise.'),
    M('tax cuts', 'Kestland cuts the basic rate of income tax from 25% to 20%. How is this meant to work as a supply-side policy?',
      ['Higher take-home pay gives people more incentive to work, or to work longer hours', 'Firms keep more of their after-tax profits to invest in new machinery and technology', 'Higher taxes reduce spending, which lowers inflation', 'Lower interest rates make borrowing cheaper for households'], 0,
      'Income tax is paid by workers. Keeping more of each hour\'s pay makes working (or working more) more rewarding, raising the supply of labour.'),
    M('evaluation', 'What is a likely cost to the government of cutting business and income taxes?',
      ['Lower tax revenue, which may widen the fiscal deficit', 'Higher interest rates set by the government', 'A rise in the price of imported goods', 'Fewer workers wanting jobs'], 0,
      'Lower tax rates bring in less revenue, at least at first, so the government may have to borrow more or spend less elsewhere.'),
    M('evaluation', 'Why may raising the school-leaving age take many years to raise productivity?',
      ['Pupils must finish the extra schooling before they join the workforce', "It raises interest rates across the economy, which slows down firms' investment", 'It reduces the number of schools the country needs', 'It makes infrastructure projects more expensive'], 0,
      'Education has long time lags: the benefit only arrives when better-educated young people start work.'),
    MU('classify measures', 'Which of these are supply-side policies?',
      ['Funding training schemes for unemployed workers', 'Spending on new roads and railways', 'Cutting business taxes to encourage investment', 'Raising interest rates to cut inflation', 'Buying government bonds from commercial banks'], [0, 1, 2],
      'Training, infrastructure and lower business taxes raise productive capacity. Interest rates and asset purchasing are monetary policy.'),
    { skill: 'choosing a measure', gen: function () {
      var c = pick(COUNTRIES);
      var list = [
        ['Many firms in ' + c + ' cannot fill vacancies for technicians, while thousands of factory workers whose jobs disappeared are unemployed.', 0, 'The problem is a skills mismatch, so training targets it directly.'],
        ['Congested roads and an old rail network mean deliveries in ' + c + ' take twice as long as in neighbouring countries.', 1, 'Slow, costly transport is an infrastructure problem.'],
        ['Firms in ' + c + ' say high taxes on their profits leave too little to spend on new machinery.', 2, 'Lower corporation tax leaves firms more retained profit to invest.'],
        ['Surveys in ' + c + ' show many part-time workers would not take extra hours because so much of their extra pay is taxed.', 3, 'Lower income tax raises take-home pay, increasing the incentive to work more.']
      ];
      var s = pick(list), ops = ['Education and training schemes', 'Infrastructure spending', 'Lower business (corporation) tax', 'Lower income tax rates'];
      return { kind: 'mcq', q: 'Which supply-side measure would most directly tackle this problem?<br><i>' + s[0] + '</i>', options: ops, answer: s[1], why: s[2] };
    } },
    M('definitions', 'If supply-side policies succeed, how would this be shown on a production possibility curve (PPC)?',
      ['The PPC shifts outwards', 'The PPC shifts inwards', 'A movement along the PPC', 'A point inside the PPC'], 0,
      'Supply-side policy raises productive capacity, so the economy can produce more of everything: the whole PPC moves outwards.'),
    M('evaluation', 'Why can supply-side policy raise output without causing demand-pull inflation?',
      ['It raises what the economy can produce, so extra output need not push up prices', 'It cuts total demand in the economy, so the general price level always falls quickly', 'It raises interest rates, which stops all inflation', 'It limits imports, which lowers the price of goods'], 0,
      'Demand-pull inflation happens when demand outstrips capacity. Expanding capacity lets output grow without that pressure on prices.'),
    M('evaluation', 'Which point best supports the view that more training will cut unemployment in Zentara?',
      ['There are 40,000 unfilled vacancies for skilled technicians', 'Unemployment is caused mainly by a fall in demand during a recession', 'Most of the unemployed already have the skills employers want', 'Unemployment is mainly seasonal, in the tourist industry'], 0,
      'Many unfilled skilled vacancies show a skills mismatch, which is exactly what training fixes. The other points suggest training would do little.'),
    M('evaluation', 'Ferrosa spends $2 billion on a new motorway. What is the opportunity cost of this spending?',
      ['The schools, hospitals or other projects the $2 billion could have paid for', 'The tolls that drivers will pay to use the motorway', 'The extra tax revenue the government gains from faster economic growth in later years', 'The time saved by lorry drivers on each journey'], 0,
      'Opportunity cost is the next best alternative given up. Public money spent on the motorway cannot be spent on other projects.'),
    M('classify measures', 'Raising the school-leaving age from 16 to 18 is an example of',
      ['supply-side policy, through education', 'monetary policy, through interest rates', 'fiscal policy aimed at cutting demand', 'protectionism, by limiting imports'], 0,
      'More education raises the skills and productivity of future workers, increasing the economy\'s productive capacity.'),
    M('tax cuts', 'How can lower business taxes help attract multinational firms to a country?',
      ['Firms keep more of their profit, so investing there is more profitable', 'Firms must pay higher wages to their workers, so their costs rise and profits fall', 'Firms must export all of their output to other countries', 'Firms receive lower interest on their savings'], 0,
      'A lower tax on profits raises the return on investing there, so MNCs are more likely to build factories, adding to capacity and jobs.'),
    M('infrastructure', 'In the short run, what is a likely effect of a large road-building programme on unemployment?',
      ['It falls, as construction workers are hired to build the roads', 'It rises, because firms stop investing', 'It is unaffected until every road is finished', 'It rises, because interest rates increase'], 0,
      'Building infrastructure creates jobs straight away in construction and its suppliers; the longer-run gain comes from lower costs once it is finished.')
  ] };
})();
