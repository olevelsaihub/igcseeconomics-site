/* Group G03 mastery bank: Business aims, productivity and market structure; Externalities, the public sector and privatisation. Original questions, not copied from past papers. */
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
  function money(n, dp) { return (n < 0 ? '-$' : '$') + num(Math.abs(n), dp); }
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
  function Q(q, right, wrong, why) {
    var opts = [right];
    wrong.forEach(function (w) { if (opts.indexOf(w) < 0 && opts.length < 5) opts.push(w); });
    return { kind: 'mcq', q: q, options: opts, answer: 0, why: why };
  }
  function N(q, ans, unit, why, tol, display) {
    var o = { kind: 'num', q: q, answer: ans, unit: unit, why: why };
    if (tol != null) o.tol = tol;
    if (display) o.display = display;
    return o;
  }
  var GOODS = [
    { s: 'shirt', p: 'shirts' }, { s: 'bicycle', p: 'bicycles' }, { s: 'chair', p: 'chairs' }, { s: 'pair of shoes', p: 'pairs of shoes' },
    { s: 'phone case', p: 'phone cases' }, { s: 'solar lamp', p: 'solar lamps' }, { s: 'bag of rice', p: 'bags of rice' }, { s: 'ceramic tile', p: 'ceramic tiles' },
    { s: 'backpack', p: 'backpacks' }, { s: 'wooden toy', p: 'wooden toys' }
  ];
  var FIRMS = ['Kestrel Works', 'Ondara Textiles', 'Bluefin Manufacturing', 'Tamsin Crafts', 'Halvard Industries', 'Mirembe Goods', 'Corvo Products', 'Sandpiper Ltd'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // ---------- LRAC diagram ----------
  // U-shaped LRAC drawn as a quadratic curve; labels is a list of [text, x, y].
  function lracSvg(labels, aria) {
    var t = labels.map(function (l) { return '<text x="' + l[1] + '" y="' + l[2] + '" font-size="15" font-weight="bold" fill="#e4464f">' + l[0] + '</text>'; }).join('');
    return '<svg viewBox="0 0 340 240" role="img" aria-label="' + aria + '" xmlns="http://www.w3.org/2000/svg">' +
      '<line x1="50" y1="200" x2="320" y2="200" stroke="#303a4c" stroke-width="2"/>' +
      '<line x1="50" y1="200" x2="50" y2="20" stroke="#303a4c" stroke-width="2"/>' +
      '<path d="M70,60 Q180,262 300,50" fill="none" stroke="#195d9b" stroke-width="3"/>' +
      '<text x="302" y="46" font-size="13" fill="#195d9b">LRAC</text>' +
      '<text x="185" y="228" font-size="12" fill="#303a4c" text-anchor="middle">Output (units)</text>' +
      '<text x="18" y="110" font-size="12" fill="#303a4c" text-anchor="middle" transform="rotate(-90 18 110)">Average cost ($ per unit)</text>' +
      '<text x="42" y="214" font-size="12" fill="#303a4c">0</text>' + t + '</svg>';
  }
  var LRAC_ABC = lracSvg([['A', 104, 112], ['B', 176, 185], ['C', 252, 104]], 'U-shaped long run average cost curve with point A on the falling section, point B at the lowest point and point C on the rising section');
  var LRAC_X = lracSvg([['X', 176, 185]], 'U-shaped long run average cost curve with label X at the lowest point of the curve');

  // =====================================================================
  // ECO-T11-06 Profit maximisation and other business aims
  // =====================================================================
  B['ECO-T11-06'] = { title: 'Profit maximisation and other business aims', items: [
    mc('assumption', 'Economists usually make which assumption about the aim of firms in the private sector?',
      'They aim to maximise their profit', ['They aim to maximise their total costs', 'They aim to maximise consumer benefit', 'They aim to keep sales revenue as low as possible'],
      'The standard assumption is that businesses aim to maximise profit (total revenue minus total costs). Maximising benefit is the assumption made about consumers, not firms.'),
    mc('assumption', 'The specification makes two underlying assumptions about economic agents. Which pair is correct?',
      'Consumers maximise benefit; businesses maximise profit', ['Consumers maximise profit; businesses maximise benefit', 'Consumers minimise spending; businesses minimise costs', 'Consumers maximise income; businesses maximise sales'],
      'Consumers are assumed to aim for the greatest benefit (satisfaction) from their spending, and businesses are assumed to aim for the greatest profit.'),
    mc('assumption', 'Which formula is used to find a firm\'s profit?',
      'Total revenue − total costs', ['Total revenue + total costs', 'Total costs − total revenue', 'Price × quantity sold'],
      'Profit is what is left from total revenue after all costs have been paid, so profit = total revenue − total costs. Price × quantity is total revenue, not profit.'),
    mc('assumption', 'Which of the following is an aim of a producer rather than an aim of a consumer?',
      'Maximising profit', ['Maximising benefit from spending', 'Buying goods out of habit', 'Copying what friends buy'],
      'Producers (firms) are assumed to maximise profit. The other options describe consumer behaviour: getting the most benefit, habits and copying others.'),
    mu('assumption', 'Which of the following are reasons given in the specification for why producers may <b>not</b> maximise their profit?',
      ['Managers may aim to maximise revenue or sales', 'The firm may prioritise caring for its customers', 'The firm may complete charitable work'],
      ['The firm may have low fixed costs', 'The firm may be able to charge a high price'],
      'The specification lists three reasons: managers who revenue or sales maximise, prioritising customer care, and charitable work. Low fixed costs or a high price would help a firm make profit, not stop it.'),
    mc('identify-aim', 'Tambo Bakery gives all of its unsold bread to a homeless shelter each evening instead of selling it the next day at a discount. Which aim does this show?',
      'Charitable work', ['Profit maximisation', 'Sales maximisation', 'Survival'],
      'Giving the bread away for free helps people in need but earns no revenue, so the bakery is doing charitable work rather than maximising profit.'),
    mc('identify-aim', 'The sales manager of Kestrel Phones earns a bonus for every handset sold. She cuts prices even when this lowers the firm\'s profit. Which aim is she following?',
      'Sales maximisation', ['Profit maximisation', 'Charitable work', 'Caring for customers'],
      'Her pay depends on the number of units sold, so she aims to sell as many as possible. Managers can have different aims from the owners, who would want the most profit.'),
    mc('identify-aim', 'Orlo Hotels gives every guest a free room upgrade if their room is not ready on time and trains staff to reply to complaints within one hour. Which aim does this show?',
      'Caring for customers', ['Profit maximisation', 'Charitable work', 'Revenue maximisation'],
      'Free upgrades and fast complaint handling add costs but make guests happier, so the hotel is putting customer care ahead of the highest possible profit.'),
    mc('identify-aim', 'The owner of a newly opened tyre shop says: "This year our only goal is to stay open until we have a regular group of customers." Which aim is this?',
      'Survival', ['Profit maximisation', 'Charitable work', 'Growth into new countries'],
      'A new firm often aims simply to survive at first. It may accept low profit, or even a small loss, while it builds a customer base.'),
    mc('identify-aim', 'Which of the following is an example of revenue maximisation?',
      'Choosing the price that brings in the most sales income, even if profit is lower', ['Choosing the price that gives the largest possible gap between total revenue and total costs', 'Giving some products away to local hospitals every month', 'Spending heavily on staff training to improve customer service'],
      'Revenue maximisation means making total revenue as large as possible. The largest gap between revenue and costs is profit maximisation, which is a different aim.'),
    mc('cost-to-profit', 'A café gives 5% of its revenue each month to a local school. What is the most likely short-run effect on the café?',
      'Its profit is lower than it would otherwise be', ['Its total revenue automatically rises by the amount it gives away', 'Its total costs fall', 'It becomes part of the public sector'],
      'The donation is money the café pays out but gets no direct revenue for, so profit falls in the short run. Any extra customers from good publicity would come later, if at all.'),
    mc('cost-to-profit', 'A restaurant decides to give every customer a free dessert with a main meal. Why does this reduce profit in the short run?',
      'It adds to total costs without adding any revenue from the desserts', ['It lowers the restaurant\'s total costs because fewer desserts are sold', 'It forces the restaurant to raise its prices', 'It reduces the number of customers who visit'],
      'Each free dessert must still be made and paid for, so costs rise while revenue from those desserts is zero. Profit = revenue − costs, so profit falls unless more customers come.'),
    mu('cost-to-profit', 'Which of the following actions are likely to reduce a firm\'s profit in the short run?',
      ['Offering free delivery on every order', 'Donating products to a children\'s charity', 'Cutting prices below rivals to win more sales'],
      ['Ending a free gift scheme that attracted no customers', 'Switching to a cheaper supplier of the same materials'],
      'Free delivery and donations add costs, and price cuts lower the revenue from each unit. Ending a useless scheme or finding a cheaper supplier cuts costs, which raises profit.'),
    mc('gain-of-aim', 'A firm gives up some profit to sponsor local charities. Which is the most likely long-term benefit to the firm?',
      'Positive publicity that attracts more customers', ['Lower prices for its raw materials', 'A legal right to be the only seller in its local market', 'An end to all competition in its market'],
      'Charity work can improve a firm\'s reputation. Customers who like what it does may choose it over rivals, raising sales and future profit.'),
    mc('gain-of-aim', 'Why might the managers of a large firm aim for maximum sales rather than maximum profit?',
      'Their pay or bonus may be linked to sales', ['Sales are always equal to profit', 'The owners receive none of the profit', 'Higher sales always reduce costs to zero'],
      'Managers are not always the owners. If their reward depends on sales, they have a reason to push sales up even when the owners would earn more profit with fewer sales.'),
    mc('gain-of-aim', 'A new gym charges a very low joining fee that only just covers its costs. Which reason best explains this choice?',
      'It wants to attract members so that it can survive in a new market', ['It wants to make the highest possible profit this year', 'It wants to raise its total costs as quickly as it can', 'It must charge low fees because it is a public sector body'],
      'A new firm may give up profit at first to attract customers. Once it has a regular group of members it is more likely to survive and can raise profit later.'),
    mc('gain-of-aim', 'A bookshop pays staff to give free reading advice to every customer, so its costs rise. Which is the best next link in the chain?',
      'Profit falls at first, but loyal customers may return and spend more', ['Profit must rise at once because costs are now higher', 'Revenue must fall because customers dislike being given any advice at all', 'The bookshop becomes a non-profit government organisation'],
      'Customer care costs money, so profit falls in the short run. The possible gain is loyalty: happy customers come back, which can raise revenue over time.'),
    mc('gain-of-aim', 'A clothing firm lets staff spend one paid day a month helping a local charity. Which chain shows a possible benefit to the firm?',
      'Staff feel proud of the firm, so motivation and productivity rise', ['Staff work fewer hours, so the firm\'s output must rise', 'Wages fall, so staff are more willing to stay at the firm', 'The charity pays the firm, so its revenue rises'],
      'Charitable work can make staff proud to work for the firm. Motivated staff tend to work harder and stay longer, which can offset the cost of the paid days.'),
    mc('evaluate', 'A juice bar plans to give 20% of its profit to charity to build its reputation. Which is the strongest counter-argument?',
      'Customers may not notice the donations, so costs rise with no extra sales', ['Charity work is certain to double the juice bar\'s sales within its first year', 'Donations reduce the juice bar\'s fixed costs', 'A better reputation always lowers the price of fruit'],
      'The plan only pays off if customers know about it and change what they buy. If they do not, the firm simply has less profit.'),
    mc('evaluate', 'Which situation would make it most sensible for a firm to keep its customer care aim rather than switch to profit maximising?',
      'Many rivals sell similar products, so customer loyalty matters', ['It is the only seller and customers have no other choice', 'Its customers never buy from it more than once', 'The cost of customer care is greater than all its revenue'],
      'When customers can easily switch to rivals, good service keeps them loyal. A sole seller, or a firm with no repeat customers, gains little from customer care.'),
    mc('evaluate', 'A firm wants to drop its free after-sales service to raise profit. Which is the main risk of this change?',
      'Customers may switch to rivals, so revenue falls', ['Its costs will rise because the service is removed', 'It will be forced to become a charity', 'Its prices will automatically fall'],
      'Removing the service saves costs, but customers who valued it may buy elsewhere. If revenue falls by more than the cost saved, profit falls instead of rising.'),
    { skill: 'profit-calc', gen: function () {
      var g = pick(GOODS);
      var unit = rint(4, 15), mA = rint(6, 15), pA = unit + mA, qA = rint(20, 60) * 100, d = rint(2, mA - 3), pB = pA - d;
      // extra units must be too few to make up for the lower margin, so the sales plan earns less profit
      var maxInc = Math.floor(qA * (mA / (mA - d) - 1) * 0.8 / 100);
      var qB = qA + 100 * rint(1, Math.max(1, maxInc));
      var fixed = 1000 * rint(5, Math.max(5, Math.floor((pB - unit) * qB * 0.6 / 1000)));
      var profA = pA * qA - (fixed + unit * qA), profB = pB * qB - (fixed + unit * qB);
      var gap = profA - profB;
      return N('A firm sells ' + g.p + '. Each one costs $' + unit + ' to make and fixed costs are ' + money(fixed) + ' a year.<br>' +
        table(['Plan', 'Price', 'Units sold a year'], [['Profit plan', '$' + pA, num(qA)], ['Sales plan', '$' + pB, num(qB)]]) +
        'The manager prefers the sales plan. How much less profit does the sales plan make than the profit plan? Give your answer in $.',
        gap, '$',
        'Profit plan: ' + money(pA * qA) + ' − (' + money(fixed) + ' + ' + money(unit * qA) + ') = ' + money(profA) + '. Sales plan: ' + money(pB * qB) + ' − (' + money(fixed) + ' + ' + money(unit * qB) + ') = ' + money(profB) + '. The sales plan gives up ' + money(gap) + ' of profit to sell more units.',
        null, num(gap));
    } },
    { skill: 'profit-calc', gen: function () {
      var rev = rint(30, 90) * 1000, cost = rev - rint(8, 20) * 1000, d = pick([2, 4, 5, 10]);
      var don = rev * d / 100, prof = rev - cost - don;
      return N('A family restaurant has monthly revenue of ' + money(rev) + ' and monthly costs of ' + money(cost) + '. It decides to give ' + d + '% of its revenue to a local hospital. What is its monthly profit after the donation? Give your answer in $.',
        prof, '$',
        'Donation = ' + d + '% × ' + money(rev) + ' = ' + money(don) + '. Profit = ' + money(rev) + ' − ' + money(cost) + ' − ' + money(don) + ' = ' + money(prof) + '. The charity work lowers profit in the short run.',
        null, num(prof));
    } }
  ] };

  // =====================================================================
  // ECO-T12-04 Productivity and how to raise it
  // =====================================================================
  B['ECO-T12-04'] = { title: 'Productivity and how to raise it', items: [
    mc('definition', 'What is meant by productivity?',
      'The output produced in relation to the inputs used', ['The total quantity of goods and services that a firm produces in a year', 'The total value of a firm\'s sales revenue', 'The total number of workers a firm employs'],
      'Productivity has two parts: the amount of output, and the inputs (or time) used to make it. Total output on its own is production, not productivity.'),
    mc('definition', 'Which unit could be used to measure labour productivity in a car factory?',
      'Cars per worker per month', ['Dollars of revenue per car', 'Workers per car per month', 'Hours worked per month'],
      'Labour productivity is output per worker in a period of time, so it is measured in units of output (cars) per worker, not in dollars.'),
    mc('definition', 'Which of the following shows a rise in labour productivity?',
      'Output per worker rises from 40 to 46 units a day', ['Total wages paid to workers rise by 15%', 'Revenue rises because the firm raises its prices', 'The firm hires 20 more workers and output per worker stays the same'],
      'Labour productivity is output per worker. Only the first option shows each worker producing more. Higher wages, higher prices or more workers at the same rate do not raise it.'),
    mc('production-v-productivity', 'A factory raises its workforce from 200 to 250 and its weekly output from 8,000 to 10,000 units. What has happened to labour productivity?',
      'It is unchanged at 40 units per worker', ['It has risen by 25%', 'It has fallen to 32 units per worker', 'It has risen from 40 to 50 units per worker'],
      'Before: 8,000 ÷ 200 = 40 units per worker. After: 10,000 ÷ 250 = 40 units per worker. Production rose, but productivity did not.'),
    mc('production-v-productivity', 'Which statement about production and productivity is correct?',
      'Production can rise while productivity stays the same', ['Productivity is the total output of a firm in a year', 'If production rises, productivity must also rise', 'Productivity is measured in dollars of revenue'],
      'Production is total output. A firm can raise production just by adding workers or machines, while output per input (productivity) stays the same.'),
    mc('land', 'Which of the following is most likely to raise the productivity of land?',
      'Draining waterlogged fields', ['Reducing the use of fertiliser', 'Letting irrigation channels fill with mud', 'Increasing the paperwork farmers must complete'],
      'Drainage removes excess water so crops can grow, which raises output per hectare. Less fertiliser, blocked irrigation and extra paperwork would lower output.'),
    mc('land', 'What does irrigation do to farmland?',
      'Supplies water to dry land so more crops can grow', ['Removes excess water from flooded land so roots do not rot', 'Turns sea or desert into usable land', 'Adds chemical nutrients to the soil'],
      'Irrigation adds water. Removing water is drainage, creating new land is reclamation, and adding nutrients is fertiliser use.'),
    mc('land', 'What does drainage do to farmland?',
      'Removes excess water so the soil is not waterlogged', ['Brings extra water to dry fields through channels and pipes', 'Turns unusable land into new farmland', 'Adds chemical nutrients to the soil'],
      'Drainage takes away excess water, so roots are not flooded and more crops survive. Bringing water to dry fields is irrigation.'),
    mc('land', 'The government of the island state of Velmora pumps sand into shallow coastal water to create new farmland. This is an example of',
      'land reclamation', ['irrigation', 'drainage', 'fertiliser use'],
      'Reclamation turns land that could not be used (here, shallow sea) into usable land, which increases the amount of productive land.'),
    mu('land', 'Which of the following could raise the productivity of <b>land</b>?',
      ['Using more fertiliser', 'Irrigating dry fields', 'Draining flooded fields'],
      ['Training farm workers in new skills', 'Buying faster delivery vans'],
      'Fertiliser, irrigation and drainage all act on the land itself. Training acts on labour, and faster vans are capital.'),
    mc('labour', 'How does training raise labour productivity?',
      'Workers gain skills, so each makes more output in the same time', ['It increases the number of workers the firm employs on each shift', 'It lowers workers\' wages, so total costs fall', 'It reduces the number of hours each worker is paid'],
      'Training builds human capital. Skilled workers work faster and make fewer mistakes, so output per worker rises.'),
    mc('labour', 'What is meant by human capital?',
      'The skills, knowledge and experience of workers', ['The machinery and equipment owned by a firm', 'The number of people of working age', 'The money a firm borrows to expand'],
      'Human capital is the quality of labour: what workers know and can do. Education and training increase it. Machinery is physical capital.'),
    mc('labour', 'Many trained nurses move to Country Q from abroad to work in its hospitals. What is the most likely effect on labour productivity in those hospitals?',
      'It may rise because the quality of labour improves', ['It must fall because there are more workers', 'It cannot change because only capital affects productivity', 'It must fall because migration adds bureaucracy'],
      'Migration can bring skilled workers. Higher-quality labour can treat more patients per worker, so labour productivity may rise.'),
    mc('labour', 'Why does the quality of labour matter to a business?',
      'Skilled workers produce more per hour and make fewer mistakes', ['Skilled workers always accept lower wages', 'Unskilled workers raise output per worker the most', 'Quality of labour only matters in the public sector'],
      'Better-quality labour means more output from each worker and less waste, which lowers the cost of each unit and improves the product.'),
    mc('capital', 'A restaurant gives its waiters tablets that send orders straight to the kitchen. What is the most likely effect?',
      'More meals are served per worker each hour', ['Fewer meals are served per worker each hour', 'Waiters spend more time writing orders by hand', 'The restaurant\'s land becomes more productive'],
      'The technology saves time walking and writing orders, so each waiter can serve more customers. This raises output per worker.'),
    mc('capital', 'Which is an example of raising productivity through a technological advance in capital?',
      'Replacing old looms with faster computer-controlled looms', ['Adding fertiliser to fields before planting', 'Training staff in customer service skills', 'Hiring more workers to operate the old looms on a night shift'],
      'Faster machines let the same workers produce more cloth per hour. Fertiliser acts on land and training acts on labour; extra workers on old looms raise production, not productivity.'),
    mc('capital', 'A bakery has 8 bakers but only 4 ovens, so bakers often wait for an oven to be free. It buys 2 more ovens. What is the most likely effect?',
      'Output per baker rises because less time is wasted waiting', ['Output per baker falls because there are more ovens', 'Output per baker is unchanged because no bakers were hired', 'The bakery\'s labour becomes less skilled'],
      'An increased quantity of capital means each baker spends more time baking and less time waiting, so output per worker rises.'),
    mc('cost-link', 'Why does higher labour productivity usually lower a firm\'s average cost?',
      'The same wage bill is spread over more units of output', ['Workers are always paid less when they are productive', 'The firm\'s total costs fall to zero', 'Raw materials become cheaper to buy'],
      'If each worker makes more units for the same pay, the labour cost of each unit falls, so average cost (cost per unit) falls.'),
    mc('cost-link', 'Farmers start using better seeds and fertiliser, so the yield per hectare rises. Which is the best next link in the chain?',
      'The cost of growing each tonne of crop falls', ['The cost of growing each tonne of crop must rise', 'The land becomes less productive', 'Fewer crops are grown on each hectare'],
      'More output from the same land means fixed costs such as rent are spread over more tonnes, so the cost per tonne falls.'),
    mc('evaluate', 'Which is a limitation of training workers to raise productivity?',
      'Trained workers may leave to work for rival firms', ['Training always lowers the quality of labour', 'Training reduces workers\' human capital', 'Training makes output per worker fall for ever'],
      'Training costs money. If skilled workers then leave, the firm pays the cost but a rival gets the benefit.'),
    mu('evaluate', 'Which of the following are possible drawbacks of introducing new technology to raise productivity?',
      ['It can have a high initial cost', 'Staff may need training before they can use it', 'It may take time before output rises'],
      ['It always lowers output per worker', 'It turns capital into land'],
      'New technology must be bought, staff must learn to use it, and the gains may come slowly. These are the costs to weigh against higher output per worker.'),
    mc('evaluate', 'A government says that more education is the best way to raise productivity. Which is the strongest counter-argument?',
      'Education takes years before workers\' output rises', ['Education reduces workers\' human capital', 'Education costs the government nothing', 'Educated workers always produce less than workers with no schooling'],
      'Education does raise human capital, but there is a long time lag before students join the workforce. Other ways, such as new technology, may work faster.'),
    mc('evaluate', 'Which of the following is most likely to <b>reduce</b> productivity?',
      'More bureaucracy and paperwork for staff', ['Better training for new staff in the use of machines', 'New, faster machinery', 'Irrigation of dry land'],
      'Bureaucracy takes up time that could be spent producing, so output per worker falls. The other options raise productivity.')
  ] };

  // =====================================================================
  // ECO-CALC-11 Labour productivity: output per worker
  // =====================================================================
  B['ECO-CALC-11'] = { title: 'Labour productivity: output per worker', items: [
    { skill: 'divide', gen: function () {
      var g = pick(GOODS), w = rint(12, 240), p = rint(18, 420), o = w * p;
      return N(pick(FIRMS) + ' employs ' + w + ' workers and makes ' + num(o) + ' ' + g.p + ' each month. What is its monthly labour productivity? Give your answer in ' + g.p + ' per worker.',
        p, '', 'Labour productivity = total output ÷ number of workers = ' + num(o) + ' ÷ ' + w + ' = ' + num(p) + ' ' + g.p + ' per worker each month.');
    } },
    { skill: 'units-trap', gen: function () {
      var w = rint(25, 160), p = rint(30, 300), o = w * p;
      return Q('A firm employing ' + w + ' workers produces ' + num(o) + ' units each week. What is its weekly labour productivity?',
        num(p) + ' units per worker', ['$' + num(p) + ' per worker', num(o * w) + ' units per worker', R.roundSf(w / o, 2) + ' units per worker'],
        'Divide output by workers: ' + num(o) + ' ÷ ' + w + ' = ' + num(p) + '. Productivity is measured in units, not dollars. Multiplying, or dividing workers by output, gives a meaningless number.');
    } },
    { skill: 'time-period', gen: function () {
      var w = rint(6, 30), pm = rint(4, 30) * 10, o = w * pm, py = pm * 12;
      return N('The ' + w + ' workers at a workshop make ' + num(o) + ' leather bags each month. What is the labour productivity per worker <b>per year</b>? Give your answer in bags per worker.',
        py, '', 'Per month: ' + num(o) + ' ÷ ' + w + ' = ' + pm + ' bags per worker. Per year: ' + pm + ' × 12 = ' + num(py) + ' bags per worker.');
    } },
    { skill: 'reverse', gen: function () {
      var g = pick(GOODS), p = rint(15, 120), w = rint(20, 300), o = p * w;
      return N('Average labour productivity at a factory is ' + p + ' ' + g.p + ' per worker per week. The factory employs ' + w + ' workers. What is its total weekly output? Give your answer in ' + g.p + '.',
        o, '', 'Total output = productivity × number of workers = ' + p + ' × ' + w + ' = ' + num(o) + ' ' + g.p + '.');
    } },
    { skill: 'reverse', gen: function () {
      var p = rint(12, 60) * 5, w = rint(15, 90), t = p * w;
      return N('A cannery wants to produce ' + num(t) + ' tins of fish a day. Each worker cans ' + p + ' tins a day. How many workers does it need?',
        w, '', 'Workers needed = target output ÷ output per worker = ' + num(t) + ' ÷ ' + p + ' = ' + w + ' workers.');
    } },
    { skill: 'compare', gen: function () {
      var names = shuf(['Alder Plant', 'Birch Plant', 'Cedar Plant']);
      var ps = shuf([rint(30, 45), rint(50, 65), rint(70, 90)]);
      var ws = [rint(40, 80), rint(90, 140), rint(150, 220)];
      ws = shuf(ws);
      var rows = names.map(function (n, i) { return [n, num(ws[i]), num(ws[i] * ps[i])]; });
      var best = ps.indexOf(Math.max.apply(null, ps));
      var others = names.filter(function (_, i) { return i !== best; });
      return Q('The table shows the weekly output of three plants owned by one firm.<br>' + table(['Plant', 'Workers', 'Output (units)'], rows) + 'Which plant has the highest labour productivity?',
        names[best], others,
        'Output per worker: ' + names.map(function (n, i) { return n + ' ' + num(ws[i] * ps[i]) + ' ÷ ' + ws[i] + ' = ' + ps[i]; }).join('; ') + '. ' + names[best] + ' has the highest output per worker, even if it does not have the highest total output.');
    } },
    { skill: 'compare', gen: function () {
      var p1 = rint(40, 90), p2 = p1 + rint(5, 30), w1 = rint(20, 80), w2 = rint(20, 80);
      return N('Firm Lumo employs ' + w1 + ' workers and makes ' + num(p1 * w1) + ' units a month. Firm Vesta employs ' + w2 + ' workers and makes ' + num(p2 * w2) + ' units a month. How many more units per worker does Vesta produce each month than Lumo?',
        p2 - p1, '', 'Lumo: ' + num(p1 * w1) + ' ÷ ' + w1 + ' = ' + p1 + '. Vesta: ' + num(p2 * w2) + ' ÷ ' + w2 + ' = ' + p2 + '. Difference = ' + p2 + ' − ' + p1 + ' = ' + (p2 - p1) + ' units per worker.');
    } },
    { skill: 'change', gen: function () {
      var p1 = rint(16, 60) * 5, p2 = p1 + rint(1, 12) * 5, w1 = rint(20, 60), w2 = w1 + rint(-5, 10);
      var pc = R.roundDp((p2 - p1) / p1 * 100, 1);
      return N('Last year a firm\'s ' + w1 + ' workers produced ' + num(p1 * w1) + ' units. This year its ' + w2 + ' workers produced ' + num(p2 * w2) + ' units. By what percentage did labour productivity rise? Give your answer to 1 decimal place.',
        pc, '%', 'Last year: ' + num(p1 * w1) + ' ÷ ' + w1 + ' = ' + p1 + '. This year: ' + num(p2 * w2) + ' ÷ ' + w2 + ' = ' + p2 + '. Change = (' + p2 + ' − ' + p1 + ') ÷ ' + p1 + ' × 100 = ' + pc.toFixed(1) + '%.',
        0.05, pc.toFixed(1));
    } },
    { skill: 'change', gen: function () {
      var w = rint(30, 80), h = rint(5, 20), p2 = rint(30, 90), o2 = p2 * (w + h), o1 = o2 - rint(5, 40) * 10;
      return N('A firm has ' + w + ' workers producing ' + num(o1) + ' units a week. It hires ' + h + ' more workers and weekly output rises to ' + num(o2) + ' units. What is the new labour productivity? Give your answer in units per worker.',
        p2, '', 'New workforce = ' + w + ' + ' + h + ' = ' + (w + h) + '. New productivity = ' + num(o2) + ' ÷ ' + (w + h) + ' = ' + p2 + ' units per worker.');
    } },
    { skill: 'time-period', gen: function () {
      var ph = rint(3, 40), w = rint(5, 60), H = pick([35, 38, 40, 45]), o = ph * w * H;
      return N('In one week, ' + w + ' workers each work ' + H + ' hours and together make ' + num(o) + ' units. What is the output per worker per hour?',
        ph, '', 'Total worker-hours = ' + w + ' × ' + H + ' = ' + num(w * H) + '. Output per worker per hour = ' + num(o) + ' ÷ ' + num(w * H) + ' = ' + ph + ' units.');
    } },
    { skill: 'compare', gen: function () {
      var start = rint(0, 8), ms = MONTHS.slice(start, start + 4);
      var ps = shuf([rint(40, 49), rint(50, 59), rint(60, 69), rint(70, 79)]);
      var ws = ms.map(function () { return rint(30, 60); });
      var best = ps.indexOf(Math.max.apply(null, ps));
      var rows = ms.map(function (m, i) { return [m, ws[i], num(ws[i] * ps[i])]; });
      return Q('The table shows a farm cooperative\'s workers and output of boxes of fruit.<br>' + table(['Month', 'Workers', 'Output (boxes)'], rows) + 'In which month was labour productivity highest?',
        ms[best], ms.filter(function (_, i) { return i !== best; }),
        'Output per worker: ' + ms.map(function (m, i) { return m + ' ' + ps[i]; }).join(', ') + ' boxes. ' + ms[best] + ' is highest. Compare output per worker, not total output.');
    } },
    { skill: 'change', gen: function () {
      var p2 = rint(40, 120), w2 = rint(20, 60), cut = rint(4, 15), o = p2 * w2;
      return N('A firm makes ' + num(o) + ' units a month. After a reorganisation it cuts its workforce from ' + (w2 + cut) + ' to ' + w2 + ' workers, and output stays at ' + num(o) + ' units. What is labour productivity after the change? Give your answer in units per worker.',
        p2, '', 'Productivity = ' + num(o) + ' ÷ ' + w2 + ' = ' + p2 + ' units per worker. The same output from fewer workers means productivity has risen.');
    } },
    { skill: 'change', gen: function () {
      var p = rint(5, 30) * 20, x = pick([5, 10, 15, 20, 25]), np = p * (100 + x) / 100;
      return N('Workers at a printing firm each print ' + p + ' books a week. After a training course, labour productivity rises by ' + x + '%. What is the new output per worker per week? Give your answer in books.',
        np, '', 'Increase = ' + x + '% × ' + p + ' = ' + (np - p) + '. New productivity = ' + p + ' + ' + (np - p) + ' = ' + np + ' books per worker per week.');
    } },
    { skill: 'reverse', gen: function () {
      var w = rint(20, 80), p1 = rint(30, 80), p2 = p1 + rint(5, 20), o1 = w * p1;
      return N('A firm\'s ' + w + ' workers make ' + num(o1) + ' units a month. The firm wants labour productivity to reach ' + p2 + ' units per worker with the same workforce. By how many units must monthly output rise?',
        w * (p2 - p1), '', 'Target output = ' + p2 + ' × ' + w + ' = ' + num(p2 * w) + '. Rise needed = ' + num(p2 * w) + ' − ' + num(o1) + ' = ' + num(w * (p2 - p1)) + ' units.');
    } },
    { skill: 'compare', gen: function () {
      var w1 = rint(20, 60), w2 = rint(20, 60), p = rint(30, 80), o1 = w1 * (p + rint(-8, 8)), o2 = p * (w1 + w2) - o1;
      if (o2 <= 0) { o1 = w1 * p; o2 = w2 * p; }
      return N('Two firms merge. Firm Ardea had ' + w1 + ' workers making ' + num(o1) + ' units a week; Firm Corvid had ' + w2 + ' workers making ' + num(o2) + ' units a week. Output and staff stay the same after the merger. What is the labour productivity of the merged firm?',
        p, '', 'Total output = ' + num(o1) + ' + ' + num(o2) + ' = ' + num(o1 + o2) + '. Total workers = ' + w1 + ' + ' + w2 + ' = ' + (w1 + w2) + '. Productivity = ' + num(o1 + o2) + ' ÷ ' + (w1 + w2) + ' = ' + p + ' units per worker.');
    } },
    { skill: 'reverse', gen: function () {
      var p2 = rint(10, 30) * 5, w2 = rint(20, 60), o = p2 * w2, extra = rint(4, 12), w1 = w2 + extra;
      return N('A packing firm has ' + w1 + ' workers and packs ' + num(o) + ' boxes a day. New equipment raises productivity to ' + p2 + ' boxes per worker a day. If daily output stays at ' + num(o) + ' boxes, how many fewer workers does the firm need?',
        extra, '', 'Workers needed = ' + num(o) + ' ÷ ' + p2 + ' = ' + w2 + '. Fewer workers = ' + w1 + ' − ' + w2 + ' = ' + extra + '.');
    } },
    { skill: 'units-trap', gen: function () {
      var w = rint(10, 50), p = rint(20, 90), o = w * p, price = rint(4, 25);
      return Q('A potter\'s workshop employs ' + w + ' workers. Each month they make ' + num(o) + ' bowls, which sell for $' + price + ' each. What is the monthly labour productivity?',
        p + ' bowls per worker', ['$' + num(p * price) + ' per worker', num(o * price) + ' bowls per worker', '$' + p + ' per worker'],
        'Labour productivity uses output, not revenue: ' + num(o) + ' ÷ ' + w + ' = ' + p + ' bowls per worker. The price is not needed; multiplying by it gives revenue per worker in dollars.');
    } },
    { skill: 'compare', gen: function () {
      var k = pick([1.5, 2, 2.5, 3, 4]), pB = pick([20, 30, 40, 50, 60]), pA = pB * k, wA = rint(10, 40), wB = rint(10, 40);
      return N('Mill A has ' + wA + ' workers producing ' + num(pA * wA) + ' metres of cloth a day. Mill B has ' + wB + ' workers producing ' + num(pB * wB) + ' metres a day. How many times as productive per worker is Mill A as Mill B?',
        k, '', 'Mill A: ' + num(pA * wA) + ' ÷ ' + wA + ' = ' + pA + '. Mill B: ' + num(pB * wB) + ' ÷ ' + wB + ' = ' + pB + '. Ratio = ' + pA + ' ÷ ' + pB + ' = ' + k + '.');
    } },
    { skill: 'change', gen: function () {
      var dir = pick(['rose', 'fell', 'same']);
      var p1 = rint(30, 70), p2 = dir === 'rose' ? p1 + rint(4, 12) : dir === 'fell' ? p1 - rint(4, 12) : p1;
      var w1 = rint(40, 80), w2 = w1 + rint(10, 30);
      var right = dir === 'rose' ? 'It rose from ' + p1 + ' to ' + p2 + ' units per worker' : dir === 'fell' ? 'It fell from ' + p1 + ' to ' + p2 + ' units per worker' : 'It stayed the same at ' + p1 + ' units per worker';
      var wr = [];
      if (dir !== 'rose') wr.push('It rose from ' + p1 + ' to ' + (p1 + 8) + ' units per worker');
      if (dir !== 'fell') wr.push('It fell from ' + p1 + ' to ' + (p1 - 6) + ' units per worker');
      if (dir !== 'same') wr.push('It stayed the same at ' + p1 + ' units per worker');
      var dOut = p2 * w2 - p1 * w1;
      wr.push((dOut >= 0 ? 'It rose by ' : 'It fell by ') + num(Math.abs(dOut)) + ' units per worker');
      return Q('A factory increased its workforce from ' + w1 + ' to ' + w2 + '. Its output changed from ' + num(p1 * w1) + ' to ' + num(p2 * w2) + ' units a week. What happened to labour productivity?',
        right, wr,
        'Before: ' + num(p1 * w1) + ' ÷ ' + w1 + ' = ' + p1 + '. After: ' + num(p2 * w2) + ' ÷ ' + w2 + ' = ' + p2 + '. A change in total output does not by itself show what happened to productivity; you must divide by the number of workers each time.');
    } },
    { skill: 'time-period', gen: function () {
      var ph = rint(4, 25), w = rint(8, 40), H = pick([7, 8, 9]), o = ph * w * H;
      return N('Workers at a call centre each handle ' + ph + ' calls per hour. On Monday, ' + w + ' workers each work a ' + H + '-hour shift. How many calls does the centre handle on Monday?',
        o, '', 'Total worker-hours = ' + w + ' × ' + H + ' = ' + (w * H) + '. Calls = ' + ph + ' × ' + (w * H) + ' = ' + num(o) + '.');
    } },
    { skill: 'cost-per-unit', gen: function () {
      var c, p, wage, tries = 0;
      do { c = pick([0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4]); p = rint(8, 40) * 100; wage = c * p; tries++; } while ((wage < 800 || wage > 4000) && tries < 50);
      if (wage < 800 || wage > 4000) { c = 2; p = 1000; wage = 2000; }
      return N('Each worker at a garment factory is paid ' + money(wage) + ' a month and produces ' + num(p) + ' shirts a month. What is the labour cost of each shirt? Give your answer in $ to 2 decimal places.',
        c, '$', 'Labour cost per unit = wage ÷ output per worker = ' + money(wage) + ' ÷ ' + num(p) + ' = ' + money(c, 2) + '. Higher productivity would spread the same wage over more shirts and lower this cost.',
        0.005, c.toFixed(2));
    } },
    mc('units-trap', 'A student is told a firm has 50 workers and an output of 2,000 units. She calculates 50 ÷ 2,000 = 0.025 units per worker. What mistake has she made?',
      'She divided workers by output instead of output by workers', ['She should have multiplied the output by the number of workers', 'She should have added workers to output', 'She should have given the answer in dollars'],
      'Labour productivity = output ÷ workers = 2,000 ÷ 50 = 40 units per worker. Dividing the wrong way round gives a tiny, meaningless figure.'),
    mc('units-trap', 'Why is labour productivity measured in units of output per worker rather than in dollars?',
      'It measures how much is made, not what it sells for', ['Workers are paid in units of output rather than in dollars', 'Dollars can only be used to measure costs', 'Output per worker cannot be counted'],
      'Productivity compares the quantity of output with the inputs used. Revenue per worker would also change when prices change, even if no extra goods were made.')
  ] };

  // =====================================================================
  // ECO-T12-07 Economies and diseconomies of scale
  // =====================================================================
  B['ECO-T12-07'] = { title: 'Economies and diseconomies of scale', items: [
    mc('definition', 'What is meant by economies of scale?',
      'Average costs fall as a firm grows and produces more', ['Total costs fall as a firm grows and produces more', 'Average costs rise as a firm grows and produces more', 'Prices rise as a firm gains a bigger market share'],
      'Economies of scale are about average (unit) cost, and they happen as the firm grows. Total cost usually rises when output rises.'),
    mc('definition', 'What is an internal economy of scale?',
      'A fall in average cost caused by the growth of the firm itself', ['A fall in average cost caused by the whole industry growing in an area', 'A rise in average cost because a firm has grown too large', 'A fall in total cost because a firm makes less output'],
      'Internal economies come from inside one growing firm (for example bulk buying). Savings from the whole industry growing in an area are external economies.'),
    mc('definition', 'What is meant by diseconomies of scale?',
      'Average costs rise because a firm has grown too large', ['Average costs fall because a firm has grown larger', 'Total costs rise because a firm makes more output', 'Prices fall because rivals enter the market'],
      'Diseconomies of scale happen when a firm becomes so large that problems such as bureaucracy and poor communication push up the cost of each unit.'),
    mc('internal-type', 'Supermarket chain Varela Foods now buys 2 million tins of beans a year, so its supplier gives it a 12% discount. Which economy of scale is this?',
      'Purchasing (bulk buying)', ['Marketing', 'Financial', 'Risk-bearing'],
      'Buying in large quantities earns a discount, so the cost of each tin falls. This is the purchasing, or bulk-buying, economy.'),
    mc('internal-type', 'A national TV advert costs a shoe retailer $400,000 whether it has 50 shops or 200 shops. Which economy of scale does the larger retailer gain?',
      'Marketing', ['Technical', 'Managerial', 'Purchasing'],
      'The same advert cost is spread over the sales of many more shops, so the advertising cost per pair of shoes sold falls. This is a marketing economy.'),
    mc('internal-type', 'A large mining company can borrow from banks at 4% interest, while small mining firms have to pay 9%. Which economy of scale is this?',
      'Financial', ['Marketing', 'Technical', 'Risk-bearing'],
      'Banks see large firms as safer, so they lend to them more cheaply. Lower interest costs per unit of output are a financial economy.'),
    mc('internal-type', 'A large hospital group can afford to employ specialist accountants, buyers and human resources managers. Which economy of scale is this?',
      'Managerial', ['Purchasing', 'Financial', 'External: skilled labour'],
      'A large firm can hire specialist managers who do each job better and faster. This is an internal managerial economy, because it comes from the firm\'s own growth.'),
    mc('internal-type', 'A container ship that carries five times as many containers costs only about twice as much to run. Which economy of scale does a shipping firm using it gain?',
      'Technical', ['Marketing', 'Managerial', 'Risk-bearing'],
      'Large machines and equipment can do much more work for a small rise in cost, so the cost per container falls. This is a technical economy.'),
    mc('internal-type', 'A drinks company sells in 12 countries and makes juices, water and snacks. A bad year for juice sales in one country does not threaten the business. Which economy of scale is this?',
      'Risk-bearing', ['Purchasing', 'Technical', 'External: infrastructure'],
      'A large firm with many products and markets spreads its risk, so a fall in one area is balanced by others. This is the risk-bearing economy.'),
    mc('external-type', 'Many software firms are based in the city of Pellmar, and local colleges train hundreds of coders each year. A new software firm in Pellmar finds staff easily and spends little on training. What is this?',
      'An external economy: skilled labour', ['An internal economy: managerial', 'An internal economy: technical', 'A diseconomy: communication problems'],
      'The saving comes from the whole industry being in the area, not from the firm\'s own size. A local pool of skilled workers is an external economy of scale.'),
    mc('external-type', 'The government builds a rail freight line to an industrial area where 40 furniture makers are based. Their transport costs fall. What is this an example of?',
      'An external economy of scale: infrastructure', ['An internal economy of scale: purchasing', 'A diseconomy of scale: lack of control', 'An internal economy of scale: financial'],
      'Better transport links benefit every firm in the area, whatever its own size. Improved infrastructure is an external economy of scale.'),
    mu('external-type', 'Which of the following are <b>external</b> economies of scale?',
      ['A local pool of skilled workers', 'Better roads and ports serving the area', 'Specialist suppliers setting up nearby'],
      ['Bulk-buying discounts for a large firm', 'Cheaper bank loans for a large firm'],
      'External economies come from the growth of the industry in an area: skilled labour, infrastructure and access to suppliers. Bulk buying and cheaper loans come from one firm\'s own size, so they are internal.'),
    mc('diseconomy', 'Which of the following is a diseconomy of scale?',
      'Decisions slowed down by many layers of management', ['Discounts from buying materials in bulk', 'Cheaper loans from banks', 'Advertising costs spread over more sales'],
      'Too many layers of management (bureaucracy) slow decisions and add cost, so average cost rises. The other options are economies of scale.'),
    mc('diseconomy', 'In a company with 30,000 staff, instructions from head office pass through seven levels of managers and are often misunderstood. Which problem is this?',
      'A diseconomy of scale: communication problems', ['An internal economy of scale: managerial', 'An external economy of scale: skilled labour', 'An internal economy of scale: technical'],
      'Messages that pass through many people get delayed or changed, causing mistakes and waste. This raises average cost, so it is a diseconomy of scale.'),
    mc('diseconomy', 'Factory workers at a very large firm say they never meet senior managers and feel their work is not noticed. Absence rates rise. What does this show?',
      'A diseconomy of scale caused by distance between managers and workers', ['An economy of scale caused by specialist managers', 'An external economy of scale caused by a local pool of skilled workers', 'An economy of scale caused by bulk buying'],
      'When the top and bottom of a large organisation are far apart, workers can lose motivation. Lower effort and more absence push up the cost of each unit.'),
    mc('diseconomy', 'A firm grows so large that senior managers cannot check what every branch is doing. Which is the best next link in the chain?',
      'Waste goes unnoticed, so average cost rises', ['Waste falls, so average cost falls', 'Bulk-buying discounts rise, so average cost falls', 'The firm gains an external economy of scale'],
      'Lack of control means problems such as waste or poor work are not spotted. Costs rise faster than output, so average cost rises.'),
    mc('lrac-diagram', 'The diagram shows a firm\'s long run average cost (LRAC) curve. Which is the correct label for point X?',
      'Most efficient (lowest average cost)', ['Where diseconomies of scale are greatest', 'Where average cost is at its highest', 'Where external economies of scale begin'],
      'X is at the lowest point of the LRAC curve, where the cost per unit is as low as it can be. This is where the firm is most efficient.',
      { svg: LRAC_X, family: 'lrac' }),
    mc('lrac-diagram', 'The diagram shows a long run average cost (LRAC) curve. Which point is on the section that shows diseconomies of scale?',
      'C', ['A', 'B'],
      'Diseconomies of scale are shown by the rising part of the curve, to the right of the lowest point. Point C is on that section.',
      { svg: LRAC_ABC, family: 'lrac' }),
    mc('lrac-diagram', 'The diagram shows a long run average cost (LRAC) curve. Which point is on the section that shows economies of scale?',
      'A', ['B', 'C'],
      'Economies of scale are shown by the falling part of the curve, where average cost drops as output rises. Point A is on that section; B is the lowest point and C is on the rising part.',
      { svg: LRAC_ABC, family: 'lrac' }),
    mc('lrac-diagram', 'Which axis labels are correct for a long run average cost (LRAC) diagram?',
      'Average cost on the y-axis and output on the x-axis', ['Output on the y-axis and average cost on the x-axis', 'Total revenue on the y-axis and price on the x-axis', 'Price on the y-axis and quantity demanded on the x-axis'],
      'The LRAC curve shows how cost per unit changes as output changes, so average cost goes on the vertical (y) axis and output on the horizontal (x) axis.'),
    { skill: 'lrac-diagram', gen: function () {
      var outs = [1, 2, 3, 4, 5, 6, 7].map(function (k) { return k * 1000; }), m = rint(2, 4), ac = [], v = rint(18, 26);
      for (var i = 0; i < 7; i++) { ac.push(v); v = i < m ? v - rint(2, 4) : v + rint(1, 3); }
      var minAc = Math.min.apply(null, ac), best = ac.indexOf(minAc);
      var rows = outs.map(function (o, i) { return [num(o), '$' + ac[i]]; });
      var wrong = [0, 6, best === 1 ? 5 : 1].map(function (i) { return num(outs[i]) + ' units'; });
      return Q('The table shows a firm\'s long run average cost at different levels of output.<br>' + table(['Output (units)', 'Average cost per unit'], rows) + 'At which level of output is the firm most efficient?',
        num(outs[best]) + ' units', wrong,
        'The firm is most efficient where average cost is lowest. The lowest value is $' + minAc + ' at ' + num(outs[best]) + ' units: the bottom of the U-shaped LRAC curve.');
    } },
    { skill: 'lrac-diagram', gen: function () {
      var outs = [10, 20, 30, 40, 50, 60].map(function (k) { return k * 100; }), m = rint(2, 3), ac = [], v = rint(30, 40);
      for (var i = 0; i < 6; i++) { ac.push(v); v = i < m ? v - rint(3, 5) : v + rint(2, 4); }
      var best = ac.indexOf(Math.min.apply(null, ac));
      var rows = outs.map(function (o, i) { return [num(o), '$' + ac[i]]; });
      var a = num(outs[0]), b = num(outs[best]), c = num(outs[5]);
      return Q('The table shows a firm\'s long run average cost at different levels of output.<br>' + table(['Output (units)', 'Average cost per unit'], rows) + 'Over which range of output does the firm experience economies of scale?',
        'From ' + a + ' to ' + b + ' units', ['From ' + b + ' to ' + c + ' units', 'From ' + a + ' to ' + c + ' units', 'Only at ' + b + ' units'],
        'Economies of scale happen while average cost is falling as output rises: from $' + ac[0] + ' at ' + a + ' units down to $' + ac[best] + ' at ' + b + ' units. After that, average cost rises (diseconomies).');
    } },
    mc('evaluate', 'Two supermarket chains plan to merge, saying the bigger firm will have lower costs. Which is the strongest reason the savings may not happen?',
      'The larger firm may suffer diseconomies such as poor communication', ['Bulk-buying discounts will be even larger after the merger is completed', 'A merged firm can never suffer from diseconomies of scale', 'Average costs always fall whenever output rises'],
      'Growth can bring economies, but if the merged firm becomes too large, bureaucracy and poor communication can push average costs up instead.'),
    mc('evaluate', 'How might lower average costs from economies of scale benefit a firm\'s customers?',
      'The firm can cut prices and still make a profit', ['The firm must raise prices to cover its costs', 'Customers will have to pay for bulk buying', 'The firm will offer fewer products'],
      'If each unit costs less to make, the firm can pass some of the saving on as lower prices. Whether it does may depend on how much competition it faces.'),
    mc('evaluate', 'One reason firms become multinational corporations is to',
      'gain economies of scale by selling in more markets', ['raise their average costs of production', 'reduce the number of customers they serve', 'avoid using any natural resources'],
      'Selling in many countries lets a firm produce on a larger scale, spreading fixed costs over more units and lowering average cost.')
  ] };

  // =====================================================================
  // ECO-T12-12 Why and how firms grow: mergers and takeovers
  // =====================================================================
  B['ECO-T12-12'] = { title: 'Why and how firms grow: mergers and takeovers', items: [
    mc('definition', 'What is meant by a takeover?',
      'One firm buys control of another firm', ['Two firms agree to join as one new firm', 'A government buys a private firm', 'A firm sells part of its business to its staff'],
      'In a takeover one firm gains control of another, usually by buying more than half of its shares. Two firms agreeing to join together is a merger.'),
    mc('definition', 'What is meant by a merger?',
      'Two firms agree to join together to form one firm', ['One firm buys control of another by buying its shares', 'A firm opens new branches using its own profit', 'Two firms agree to fix prices but stay separate'],
      'A merger is an agreed joining of two firms into one. Buying control is a takeover, and agreeing prices while staying separate is collusion.'),
    mc('definition', 'What is meant by finance?',
      'Money used to run or expand a business', ['The total value of goods a firm sells', 'The number of shares a firm issues', 'The extra cost of hiring one more worker'],
      'Finance is the money a business uses, for example from savings, retained profit or bank loans, to pay for its day-to-day running and its growth.'),
    mc('definition', 'To take over another firm, a business usually needs to buy',
      'more than half of the firm\'s shares', ['exactly one tenth of the firm\'s shares', 'less than half of the firm\'s shares', 'only the firm\'s brand name'],
      'Owning more than 50% of the shares gives a majority of the votes, so the buyer controls the decisions of the other firm.'),
    mc('merger-v-takeover', 'Brightwell Dairies buys 62% of the shares in Coastline Creameries. Coastline keeps trading under its own name. What has happened?',
      'A takeover', ['A merger', 'A nationalisation', 'A privatisation'],
      'Brightwell has bought a controlling share, so it now controls Coastline. Keeping the brand name does not change this; it is a takeover.'),
    mc('merger-v-takeover', 'Two regional bus companies, Ridgeway Coaches and Valecross Buses, agree to combine and form one new company, Ridgecross Travel. What has happened?',
      'A merger', ['A takeover', 'A nationalisation', 'Collusion'],
      'Both firms agreed to join and form a single new firm, so this is a merger rather than one firm buying control of the other.'),
    mc('merger-v-takeover', 'Which statement about mergers and takeovers is correct?',
      'In a takeover, the buying firm gains control of the other firm', ['In a merger, one firm always closes the other firm down completely', 'A takeover means two firms agree to share prices', 'A merger means a government buys a private firm'],
      'A takeover is about control: one firm buys enough shares to run the other. A merger is an agreed joining; neither involves fixing prices or government ownership.'),
    mc('growth-factor', 'A hair salon owner has made strong profits for six years and has $80,000 saved. Which factor most enables her to open a second salon?',
      'Access to finance', ['The desire to spread risk', 'Government regulation', 'The desire to take over competitors'],
      'Opening a new salon needs money for premises, equipment and staff before any revenue comes in. Her saved profits give her access to that finance.'),
    mc('growth-factor', 'A parcel delivery firm grows so that it can negotiate lower fuel prices and spread its depot costs over more parcels. Which growth factor is this?',
      'Economies of scale', ['Government regulation', 'Access to finance', 'The desire to spread risk'],
      'The firm wants lower average costs from being larger, which is the economies of scale reason for growth.'),
    mc('growth-factor', 'Which of the following is an example of government regulation limiting the growth of a firm?',
      'A competition authority blocks a planned merger', ['A bank offers the firm a cheap loan', 'The firm opens a store in a new city', 'A rival firm closes down'],
      'Government rules can stop firms growing, for example by blocking mergers that would reduce competition too much.'),
    mu('growth-factor', 'Which of the following are likely to <b>encourage</b> a firm to grow?',
      ['Easy access to finance', 'The desire to spread risk', 'The chance to gain economies of scale', 'The desire to take over competitors'],
      ['The owner\'s wish to keep personal control of a small firm', 'A fall in demand for the firm\'s product'],
      'Finance, economies of scale, spreading risk and taking over rivals all push a firm to grow. Wanting to keep personal control is a reason to stay small, and falling demand discourages growth. (Government regulation also influences growth, but it usually limits it.)'),
    mu('growth-factor', 'Which of the following are sources of finance a firm could use to grow?',
      ['Profit kept in the business', 'A bank loan', 'The owner\'s savings'],
      ['The firm\'s market share', 'The number of rivals in the market'],
      'Finance is money. Retained profit, loans and savings are all sources of money. Market share and the number of rivals are features of the market, not money.'),
    mc('growth-factor', 'Why is access to finance important when a firm wants to grow?',
      'Growth needs money for premises, stock and staff before extra revenue arrives', ['Growth always pays for itself, so a firm never needs to spend money before revenue comes in', 'Finance is only needed by firms that are shrinking', 'Banks will only lend to firms that do not want to grow'],
      'A firm has to pay for new premises, equipment and workers up front. Without savings, retained profit or loans it cannot pay these costs, so it cannot grow.'),
    mc('spread-risk', 'A holiday company that sells only ski trips starts selling summer beach holidays as well. What is the main reason?',
      'To spread risk', ['To gain access to finance', 'To reduce its economies of scale', 'To move into the public sector'],
      'If ski sales fall, for example after a winter with little snow, income from beach holidays keeps the firm going. Selling in more markets spreads risk.'),
    mc('spread-risk', 'Why does operating in more markets reduce a firm\'s risk?',
      'If sales fall in one market, income from the others continues', ['Costs in every market fall to zero', 'It guarantees that sales will rise in every market the firm enters', 'It removes all competition from each market'],
      'With several markets, a problem in one does not cut off all income. The firm is less likely to fail if one market declines.'),
    mc('spread-risk', 'A toy maker sells only in Country P, where its sales fall sharply whenever P\'s economy slows down. It opens shops in three other countries. Which factor influencing growth does this best show?',
      'The desire to spread risk', ['The desire to take over competitors', 'Government regulation', 'The desire to raise its average costs'],
      'Selling in several countries means a slowdown in Country P no longer cuts off most of its income, because sales elsewhere continue. This is growth to spread risk.'),
    mc('take-over-rivals', 'Why might a firm buy its main rival?',
      'To increase its market share and reduce competition', ['To increase the number of rivals it faces in the market', 'To lower its own market share', 'To make its products less well known'],
      'Taking over a competitor gives the buyer the rival\'s customers and removes a competitor, so it has more control over the market.'),
    mc('take-over-rivals', 'After taking over a rival, what does the buying firm gain?',
      'The rival\'s profits and customers', ['A legal duty to lower its prices', 'An end to all of its costs', 'A guarantee of no future rivals'],
      'Owning the rival means its profits now go to the buyer, and its customers become part of the buyer\'s business.'),
    mc('evaluate', 'A restaurant owner plans to open a second restaurant in another town. Which is the main risk?',
      'Demand in the new town may be too low to cover the costs', ['Average costs can never rise as a firm grows', 'Opening a second branch removes all competition', 'The firm\'s revenue is certain to double as soon as the new branch opens'],
      'Growth is not guaranteed to pay off. If too few customers come in the new town, the extra costs may be larger than the extra revenue.'),
    mc('evaluate', 'Why is borrowing to fund expansion risky?',
      'Interest must be paid even if sales are poor', ['Loans never have to be repaid', 'Borrowing always lowers a firm\'s costs', 'Banks pay the firm interest on loans'],
      'A loan adds fixed repayments and interest. If the expansion earns less than expected, the firm may struggle to pay, which could threaten its survival.'),
    mc('evaluate', 'Which evidence would most strongly support a firm\'s decision to expand into a new country?',
      'Market research shows strong demand for its product there', ['Its managers are already finding it hard to run the business', 'Interest rates on business loans have just risen sharply', 'It is the only product it has ever sold at home'],
      'Expansion only pays if there are enough customers. Overstretched managers and higher borrowing costs would be reasons for caution.'),
    mc('evaluate', 'Which is a likely disadvantage of a firm growing very large?',
      'Diseconomies of scale such as poor communication', ['Discounts from buying materials in bulk', 'Cheaper loans from banks', 'Spreading risk over more markets'],
      'Very large firms can suffer bureaucracy and poor communication, which push up average costs. The other options are benefits of growth.')
  ] };

  // =====================================================================
  // ECO-T12-13 Monopoly: features, barriers to entry, pros and cons
  // =====================================================================
  B['ECO-T12-13'] = { title: 'Monopoly: features, barriers to entry, pros and cons', items: [
    mc('definition', 'What is a monopoly?',
      'A market with one dominant seller', ['A market with a few large firms', 'A market with many small firms', 'A market where the government sets all prices'],
      'In a monopoly one firm supplies all or nearly all of the product. A few large firms is an oligopoly.'),
    mc('definition', 'What is meant by a price-maker?',
      'A firm that can set the market price', ['A firm that must accept the market price', 'A firm whose price is set by a cartel', 'A firm that produces the most units'],
      'A monopoly has no close rivals, so it can choose its price. A firm with many competitors has to accept the market price (a price-taker).'),
    mc('definition', 'What is meant by a unique product?',
      'A product with no close substitute', ['A product sold by many different firms', 'A product with a well-known logo', 'A product that is cheap to make'],
      'A unique product has nothing similar that customers can switch to. This gives the seller power over price.'),
    mc('definition', 'Only one firm, Pelorus Cable, supplies broadband on the island of Tessaly. No other firm has a network there. Which market structure is this?',
      'Monopoly', ['Oligopoly', 'A market with many competing firms', 'Cartel'],
      'One firm supplies the whole market and there are no rivals, so it is a monopoly. An oligopoly would have a few large firms.'),
    mu('features', 'Which of the following are features of a monopoly?',
      ['One business dominates the market', 'A unique product', 'The firm is a price-maker', 'High barriers to entry'],
      ['Many close substitutes', 'The firm is a price-taker'],
      'A monopoly has one dominant firm selling a unique product, sets its own price and is protected by barriers to entry. Close substitutes and price-taking belong to competitive markets.'),
    mc('features', 'A water company raises its prices by 10% and still sells almost the same amount of water. Which feature of monopoly does this show?',
      'It is a price-maker', ['It is a price-taker', 'It faces many close rivals', 'It has no barriers to entry'],
      'Customers have nowhere else to buy water, so the firm can set a higher price and still keep its sales. That is what being a price-maker means.'),
    mc('barriers', 'What is meant by barriers to entry?',
      'Obstacles that make it hard for new firms to enter a market', ['Rules that stop consumers from buying imported goods from abroad', 'Costs a firm pays when it leaves a market', 'Taxes on the goods that a firm sells'],
      'Barriers to entry are obstacles, such as high start-up costs or patents, that stop new firms joining the market and competing.'),
    mc('barriers', 'Which of these would most probably create a barrier to entry?',
      'A patent protecting a new medicine', ['Low start-up costs in the market', 'Government grants for new firms', 'Rising incomes of consumers'],
      'A patent gives one firm the legal right to be the only producer, so rivals cannot copy the medicine. The other options make entry easier or are unrelated.'),
    mc('barriers', 'What is a patent?',
      'A legal right to be the only producer of a new design for a period', ['A licence that lets any firm copy a new product as soon as it is launched', 'A tax on new inventions', 'A government subsidy for research'],
      'A patent protects a new invention so that rivals cannot copy it for a set number of years. This keeps rivals out of that market.'),
    mc('barriers', 'How can high start-up costs act as a barrier to entry?',
      'New firms cannot raise enough money to buy the equipment needed', ['New firms are given the equipment free by the government', 'Existing firms must pay the start-up costs of new firms', 'High start-up costs make it cheaper to enter the market'],
      'If entering needs very expensive factories or networks, few new firms can find the money, so the existing firm stays dominant.'),
    mc('barriers', 'The leading snack brand spends $50 million a year on advertising. New firms cannot get shelf space because shops prefer the well-known brand. Which barrier to entry is this?',
      'Marketing budgets', ['Patents', 'Legal barriers', 'Low start-up costs'],
      'A huge marketing budget builds brand loyalty that new firms cannot afford to match, so they struggle to win customers.'),
    mc('barriers', 'A government gives one company the only licence to supply electricity in a city. Which barrier to entry is this?',
      'A legal barrier', ['A marketing budget', 'Technology', 'Bulk buying'],
      'The law stops any other firm from supplying, so the barrier is legal. The licensed firm faces no competition.'),
    mc('barriers', 'How can economies of scale act as a barrier to entry?',
      'The large firm\'s low unit costs let it charge prices new firms cannot match', ['They make the large firm\'s average costs higher than those of any new firm entering', 'They force the large firm to share its factories', 'They mean new firms have lower costs than the large firm'],
      'A big established firm has low average costs. A small new firm has higher costs, so it cannot compete on price.'),
    mc('consumer-effects', 'What is the most likely disadvantage for consumers of a monopoly?',
      'Higher prices because there are no rivals to switch to', ['Lower prices because several rival firms start a price war', 'A much wider choice of products', 'Better service forced by competition'],
      'With no close competitors, consumers cannot switch, so the monopoly can raise prices. Price wars and wider choice happen when there is competition.'),
    mc('consumer-effects', 'The only ferry company serving an island cuts the number of sailings and does not repair its waiting rooms. Why can it do this?',
      'Customers cannot switch to a rival, so it loses few sales', ['Customers have many other ferry firms to choose from', 'The government forces it to lower its quality', 'Lower quality always raises demand'],
      'A monopoly faces little pressure to keep quality high, because customers have no alternative supplier.'),
    mu('consumer-effects', 'Which of the following are possible disadvantages of monopoly for consumers?',
      ['Higher prices', 'Less choice', 'Poorer quality or service'],
      ['Lower prices from price wars', 'A wider choice of brands'],
      'Without rivals, a monopoly can charge more, offer less choice and let quality slip. Price wars and more brands come from competition.'),
    mc('consumer-effects', 'Why might a monopoly be inefficient?',
      'Lack of competition removes the pressure to keep costs low', ['Competition forces it to waste resources', 'It has to match the prices charged by many rivals in its market', 'It cannot make any profit'],
      'Firms with rivals must keep costs down or lose customers. A monopoly can survive even if it is wasteful, because customers cannot leave.'),
    mc('benefits', 'Which of the following is a possible advantage of monopoly?',
      'Economies of scale may lower average costs', ['Consumers have more choice of brands', 'Prices are always lower than in competitive markets', 'There are no barriers to entry'],
      'A very large firm can gain economies of scale, so its cost per unit may be lower than many small firms could manage.'),
    mc('benefits', 'Why might a monopoly spend more on innovation than a small firm?',
      'Its high profits can pay for research and development', ['It has many rivals copying its ideas', 'It makes no profit to spend', 'Patents stop it from inventing anything'],
      'Large profits give the monopoly money to research new products. Patents can then protect the rewards of that research.'),
    mc('benefits', 'Why might having one rail network in a country be better than several competing networks?',
      'It avoids wasteful duplication of expensive track', ['It guarantees that fares will fall every year', 'It creates more choice of routes between towns', 'It removes the need to maintain the track'],
      'Building several sets of track to the same places would waste resources. One network can be cheaper overall, which is a possible benefit of monopoly.'),
    mc('evaluate', 'A monopoly says its size lets it produce at a lower cost per unit. Which is the strongest counter-argument for consumers?',
      'With no rivals, it may keep the savings as profit instead of cutting prices', ['A large firm can never have lower average costs', 'Lower average costs always mean higher prices', 'Consumers can easily switch to many other suppliers whenever its prices rise'],
      'Lower costs only help consumers if they are passed on as lower prices. A firm without competition has little reason to do this.'),
    mc('evaluate', 'Whether a monopoly is good for consumers depends most on',
      'whether its cost savings are passed on as lower prices', ['whether it has a recognisable logo', 'whether its head office is in the capital city', 'whether its workers wear a uniform'],
      'A monopoly can bring economies of scale and innovation, but consumers only gain if lower costs and new products reach them at fair prices.')
  ] };

  // =====================================================================
  // ECO-T12-15 Oligopoly: features, collusion and effects
  // =====================================================================
  B['ECO-T12-15'] = { title: 'Oligopoly: features, collusion and effects', items: [
    mc('definition', 'What is an oligopoly?',
      'A market in which a few large firms control most sales', ['A market in which one firm supplies almost all sales', 'A market in which many small firms each have a tiny share', 'A market in which the government supplies all goods'],
      'An oligopoly has a few large firms with most of the market share. One dominant firm is a monopoly.'),
    mc('definition', 'Five companies sell 88% of the mobile phone contracts in Country Z. Each has its own brand and advertises heavily. Which market structure is this?',
      'Oligopoly', ['Monopoly', 'A market with many small competing firms', 'Public sector'],
      'A few large firms share most of the market and sell branded, differentiated products: these are features of an oligopoly.'),
    mc('features', 'Which one of these describes a feature of oligopoly markets?',
      'Firms are interdependent', ['A single firm sets the market price', 'There are no barriers to entry', 'The product has no close substitute'],
      'In an oligopoly each firm watches and reacts to its few rivals, so their decisions depend on each other. One price-setting firm with a unique product is a monopoly.'),
    mc('features', 'What does it mean to say firms in an oligopoly are interdependent?',
      'Each firm\'s decisions depend on how its rivals react', ['Each firm ignores what its rivals do', 'Each firm is owned by the government', 'Each firm sells to only one customer'],
      'With only a few big rivals, a price cut or new product by one firm affects the others, so each must think about how the rest will respond.'),
    mc('features', 'Two supermarket chains sell similar groceries but use different logos, store designs and own-brand ranges. How are their products best described?',
      'Differentiated products', ['Unique products', 'Public goods', 'Identical products with no branding'],
      'The goods are similar but made to look different through branding. That is product differentiation, a feature of oligopoly. A unique product has no substitute at all.'),
    mc('features', 'Why are there only a few firms in a market such as mobile phone networks?',
      'High set-up costs and licences act as barriers to entry', ['There are no barriers to entry', 'Consumers do not want to buy the service', 'The government bans all advertising'],
      'Building a network costs a huge amount and licences are limited, so few new firms can enter. This keeps the market in the hands of a few large firms.'),
    mc('features', 'Which of the following is <b>not</b> a feature of an oligopoly?',
      'No barriers to entry', ['A few large firms dominate', 'Differentiated products', 'Non-price competition'],
      'Oligopolies do have barriers to entry, which is why only a few firms are in the market. The other three are features of oligopoly.'),
    mc('non-price', 'Which of the following is an example of non-price competition?',
      'Introducing a loyalty card scheme', ['Cutting prices by 10%', 'Matching a rival\'s price cut', 'Charging less than rival firms'],
      'Non-price competition wins customers by means other than price, such as loyalty cards, branding or better service.'),
    mu('non-price', 'Which of the following are forms of non-price competition?',
      ['Building a strong brand image', 'Offering better customer service', 'Promoting an environmentally friendly image'],
      ['Reducing prices below rivals', 'Matching every price cut a rival makes'],
      'Branding, service and environmental image attract customers without changing the price. Cutting or matching prices is price competition.'),
    mc('non-price', 'Why do firms in an oligopoly often prefer non-price competition to cutting prices?',
      'A price cut is likely to be matched, so every firm earns less profit', ['Price cuts are banned in every oligopoly', 'Customers in an oligopoly market never respond to any change in prices', 'Non-price competition costs nothing at all'],
      'Because firms are interdependent, rivals usually match a price cut. Everyone ends up with lower prices and profit, so firms compete through branding and service instead.'),
    mc('collusion', 'What is collusion?',
      'Rival firms secretly agreeing to fix prices or limit supply', ['Rival firms competing hard by cutting prices', 'One firm buying control of a rival by purchasing most of its shares', 'Rival firms advertising against each other'],
      'Collusion is cooperation between rivals that should be competing, for example agreeing to fix prices. It reduces competition.'),
    mc('collusion', 'A group of firms that agree together to fix prices is known as',
      'a cartel', ['a merger', 'a price war', 'a public corporation'],
      'A cartel is a group of firms that collude, for example to fix high prices or limit output. They stay separate firms, unlike in a merger.'),
    mc('collusion', 'The four airlines that fly between two cities secretly agree to charge the same high fares. Which is the best next link in the chain?',
      'Passengers pay more and have no cheaper choice', ['Fares fall because the airlines compete harder', 'More airlines enter the route at once', 'Each airline must cut its fares to win customers'],
      'Collusion removes price competition. With all airlines charging the same high fare, passengers cannot find a cheaper option.'),
    mc('collusion', 'When firms in an oligopoly collude, the market behaves most like',
      'a monopoly', ['a market with many small firms', 'a price war', 'a public sector service'],
      'By acting together on price and supply, colluding firms can act as if they were one firm, so the outcome is like a monopoly: higher prices and less choice.'),
    mc('price-war', 'What is a price war?',
      'Rivals repeatedly cutting prices to win customers from each other', ['Rivals secretly agreeing with each other to keep all their prices high', 'A government setting a maximum price', 'One firm buying all its rivals'],
      'In a price war, each firm undercuts the others, and they respond with further cuts. Consumers pay less, but firms\' profits fall.'),
    mu('price-war', 'Two fuel retailers start a price war. Which of the following are likely effects?',
      ['Lower prices for consumers in the short run', 'Lower profit for both firms'],
      ['Higher prices for consumers straight away', 'Higher profit for both firms', 'An immediate cartel between the two firms'],
      'Each firm keeps cutting prices to win customers, so consumers gain and profit margins shrink. A price war is the opposite of collusion.'),
    mc('effects', 'Which of the following is a possible advantage of oligopoly for consumers?',
      'Rivalry may lead to better quality and more choice', ['Firms always collude to raise prices', 'There is only one product to choose from', 'There are no brands to compare'],
      'Firms fighting for market share may improve quality, add features or offer more choice to attract customers.'),
    mc('effects', 'How can the large profits of oligopoly firms benefit consumers?',
      'They can fund research into new products', ['They force firms to close down', 'They stop firms from offering choice', 'They raise barriers that lower quality'],
      'Large firms with high profits can afford research and development, which can bring new and better products.'),
    mc('evaluate', 'Which is the strongest reason an oligopoly may harm consumers?',
      'Firms may collude to keep prices high', ['Firms compete through constant price wars', 'Firms spend money on better service', 'Firms offer many differentiated products'],
      'If the few firms agree not to compete, consumers face higher prices and less choice. Price wars and better service help consumers.'),
    mc('evaluate', 'Whether an oligopoly is good for consumers depends most on',
      'whether the firms compete or collude', ['how many logos each firm uses', 'whether the firms are in the private sector', 'how old the largest firm is'],
      'Rivalry can bring lower prices, better quality and innovation; collusion brings higher prices and less choice. The outcome depends on how the firms behave.'),
    { skill: 'evidence', gen: function () {
      var kind = pick(['olig', 'mono', 'comp']), rows, why;
      var names = shuf(['Arvo', 'Brisa', 'Calder', 'Dunmore', 'Elba', 'Fenwick']);
      if (kind === 'olig') {
        var s = [rint(24, 32), rint(18, 23), rint(14, 17), rint(10, 13)], other = 100 - s.reduce(function (a, b) { return a + b; }, 0);
        rows = s.map(function (v, i) { return [names[i], v + '%']; }).concat([['About 30 other small firms', other + '%']]);
        why = 'Four large firms hold ' + (100 - other) + '% of the market between them. A few large firms dominating is an oligopoly.';
      } else if (kind === 'mono') {
        var m = rint(86, 94), r1 = rint(2, 4), r2 = rint(1, 2), o2 = 100 - m - r1 - r2;
        rows = [[names[0], m + '%'], [names[1], r1 + '%'], [names[2], r2 + '%'], ['Others', o2 + '%']];
        why = 'One firm has ' + m + '% of the market, so it dominates on its own. One dominant seller is a monopoly.';
      } else {
        var c = [rint(3, 4), rint(2, 3), 2, 2], oc = 100 - c.reduce(function (a, b) { return a + b; }, 0);
        rows = c.map(function (v, i) { return [names[i], v + '%']; }).concat([['About 400 other small firms', oc + '%']]);
        why = 'Even the largest firm has a tiny share and hundreds of firms compete, so no small group dominates. This is a market with many small competing firms.';
      }
      var right = kind === 'olig' ? 'Oligopoly' : kind === 'mono' ? 'Monopoly' : 'Many small competing firms';
      return Q('The table shows market shares in the market for cement in the country of Lowmere.<br>' + table(['Firm', 'Market share'], rows) + 'Which market structure does the data suggest?',
        right, ['Oligopoly', 'Monopoly', 'Many small competing firms'].filter(function (x) { return x !== right; }), why);
    } },
    { skill: 'evidence', gen: function () {
      var s = [rint(22, 30), rint(16, 21), rint(12, 15), rint(8, 11), rint(5, 7)], other = 100 - s.reduce(function (a, b) { return a + b; }, 0);
      var names = shuf(['Lumen', 'Petra', 'Quill', 'Rowan', 'Sable']);
      var rows = s.map(function (v, i) { return [names[i], v + '%']; }).concat([['Other firms', other + '%']]);
      var top3 = s[0] + s[1] + s[2];
      return N('The table shows market shares for supermarkets in the country of Varnia.<br>' + table(['Supermarket', 'Market share'], rows) + 'What is the combined market share of the three largest supermarkets?',
        top3, '%', 'Three largest: ' + s[0] + '% + ' + s[1] + '% + ' + s[2] + '% = ' + top3 + '%. A few firms holding a large combined share is evidence of an oligopoly.');
    } }
  ] };

  // =====================================================================
  // ECO-T11-16 Mixed economy and the public and private sectors
  // =====================================================================
  B['ECO-T11-16'] = { title: 'Mixed economy and the public and private sectors', items: [
    mc('definition', 'What is meant by a mixed economy?',
      'An economy where both the public and private sectors provide goods and services', ['An economy that produces a mixture of goods and services', 'An economy where only the government decides what goods and services to provide', 'An economy that trades a mixture of exports and imports'],
      'A mixed economy is defined by who provides: both the government (public sector) and private firms (private sector). A mix of goods on its own is not the definition.'),
    mc('definition', 'What is meant by the public sector?',
      'The part of the economy owned and controlled by the government', ['Firms whose shares can be bought and sold by members of the public', 'Firms owned by individuals or groups of people', 'Organisations run only by charities'],
      'The public sector is owned and controlled by the government and funded mainly by taxes. Firms selling shares to the public are still private sector firms.'),
    mc('definition', 'What is meant by the private sector?',
      'Firms owned by individuals or groups that provide goods and services', ['Organisations that are owned and run by the government and funded by taxes', 'Services that are paid for by taxes', 'Goods that every person must be given free'],
      'The private sector is made up of firms owned by individuals or groups, such as sole traders and companies, which are controlled by their owners.'),
    mc('definition', 'A large public limited company (plc) makes cars and its shares are traded on the stock exchange. Which sector is it in?',
      'The private sector', ['The public sector', 'The government sector', 'The charity sector'],
      'A public limited company is owned by private shareholders, so it is in the private sector. The word \'public\' only means its shares can be sold to the public.'),
    mc('ownership-aims', 'What is the usual aim of a public sector organisation?',
      'To provide services in the public interest', ['To maximise profit for shareholders', 'To pay the highest dividends possible', 'To reduce the number of people it serves'],
      'Public sector bodies aim to serve the public, for example by giving everyone access to schools or roads, rather than to make the most profit.'),
    mc('ownership-aims', 'How is the public sector mainly funded?',
      'Through taxation', ['Through selling shares to investors', 'Through donations from charities', 'Through profits from exports only'],
      'Government spending on roads, schools and hospitals is paid for mainly by taxes collected from people and firms.'),
    mc('ownership-aims', 'Who controls a private sector firm?',
      'Its owners, such as a sole trader or its shareholders', ['The government minister for that industry', 'The customers who buy its products', 'A committee of taxpayers'],
      'Private sector firms are controlled by the people who own them. The government controls the public sector.'),
    mu('ownership-aims', 'Which of the following statements are correct?',
      ['Private sector firms usually aim to make a profit', 'The public sector aims to serve the public interest', 'The public sector is funded mainly by taxes'],
      ['Public sector organisations aim to maximise profit', 'Private sector firms are owned by the government'],
      'The two sectors differ in ownership (private owners or government), control and aims (profit or the public interest). The public sector does not aim to maximise profit.'),
    mc('classify', 'Which of these goods or services would the public sector most probably provide?',
      'A national motorway network', ['Restaurant meals', 'Mobile phones', 'Hairdressing'],
      'Everyone needs main roads, but private firms find it hard to charge every user, so they are usually built and run by the government.'),
    mu('classify', 'Which of the following are part of the private sector?',
      ['A family-owned bakery', 'A car maker that is a public limited company', 'A partnership of three lawyers'],
      ['A state-run hospital', 'A railway owned by the government'],
      'Firms owned by individuals or groups, including plcs, are private sector. Organisations owned by the government are public sector.'),
    mc('classify', 'In the country of Norland, the state runs hospitals, schools and railways, while private firms run shops, farms and banks. Which type of economy is this?',
      'A mixed economy', ['A free market economy', 'A planned economy', 'An economy with no public sector'],
      'Both the government and private firms provide goods and services, so Norland has a mixed economy.'),
    mc('economic-problem', 'In a mixed economy, how is the question of what to produce answered?',
      'Partly by market forces and partly by the government', ['Only by the government, through a central plan for every good', 'Only by market forces', 'By a vote of all workers'],
      'Private firms produce what is profitable, guided by prices, while the government decides on goods such as roads and schools. Both play a part.'),
    mc('economic-problem', 'In a mixed economy, how is the question of for whom to produce answered?',
      'Some goods go to those who can pay; some are given by the state to those who need them', ['Every good and service is shared out equally by the government, whatever people want or can pay', 'Only people who can pay receive any goods', 'Goods are given out at random'],
      'Market goods go to people who can afford them, while the government provides services such as healthcare or education based on need.'),
    mc('economic-problem', 'In the private sector of a mixed economy, how do firms decide how to produce?',
      'They choose methods that keep costs low so they can make a profit', ['The government tells each private firm which machines and workers to use', 'They choose the most expensive methods available', 'Customers vote on each firm\'s production method'],
      'Private firms aim for profit, so they choose the cheapest efficient way to produce, such as more machines or more workers.'),
    mc('benefits-costs', 'Why might the government provide main roads rather than leave them to private firms?',
      'Everyone needs them, but private firms may not make enough profit to build them', ['Private firms are not allowed to make any profit from building, owning or running any roads', 'Roads have no opportunity cost', 'Only the government can buy building materials'],
      'Roads benefit the whole economy, but it is hard to charge every user, so private firms may not build enough. The government provides them in the public interest.'),
    mc('benefits-costs', 'Which of the following is a benefit of public sector provision of a service?',
      'Everyone can use it, whatever their income', ['It always makes a large profit', 'It has no opportunity cost', 'It never needs funding from taxes'],
      'Public provision can give access to people who could not pay market prices, for example free schooling for every child.'),
    mc('benefits-costs', 'The government of Sarnia spends tax money on new public roads. Which is the best next link in the chain? Better roads mean …',
      'firms\' transport costs fall, so they can produce more cheaply', ['firms\' transport costs rise, so prices rise', 'the government no longer needs any taxes', 'private firms are banned from using roads'],
      'Faster journeys cut fuel and time costs for firms, so the cost of getting goods to market falls, which can help growth and jobs.'),
    mc('benefits-costs', 'What is the opportunity cost of the government building a new public hospital?',
      'The schools or roads that could have been built with the same money', ['The money patients pay to use the hospital', 'The profit the hospital makes each year', 'Nothing, because the hospital is paid for out of tax revenue and not by patients'],
      'Opportunity cost is the next best alternative given up. Tax money spent on the hospital cannot also be spent on other projects.'),
    mc('benefits-costs', 'Why might a public sector organisation be less efficient than a private firm?',
      'Without a profit motive there is less pressure to cut costs', ['It must make a profit every year or it will be closed down by the government', 'It faces strong pressure from shareholders', 'It is not allowed to employ any workers'],
      'Private firms that waste money lose profit and may close. A public body funded by taxes may face less pressure to keep costs low.'),
    mc('benefits-costs', 'The state-owned airline of Kalvos keeps flying to small islands even though these routes make a loss. What best explains this?',
      'As a public sector body it aims to serve the public, not to maximise profit', ['It is a private sector firm, so it must make a profit on every single route it flies', 'The routes are paid for by the airline\'s private shareholders', 'Public sector bodies are not allowed to make a loss'],
      'Islanders need the flights to reach hospitals, schools and jobs. A public sector organisation aims to serve the public interest, so it may keep loss-making services that a profit-seeking private firm would cut.'),
    mc('benefits-costs', 'A government is deciding whether to spend more on public roads. Its judgement should depend most on',
      'whether the benefits are greater than the cost and the opportunity cost', ['whether private firms like driving on roads', 'whether roads are in the public sector', 'whether the new roads will make a large profit for the private shareholders'],
      'A good judgement weighs the benefits (lower costs, jobs, access) against the money spent and what else it could have bought.'),
    mc('relative-size', 'In Country A, 70% of workers are employed by the state. In Country B, 15% are. Which statement is correct?',
      'The public sector is relatively more important in Country A', ['The private sector is relatively more important in Country A', 'Country B has no public sector', 'Both countries have the same mix of sectors'],
      'The share of workers employed by the state shows how important the public sector is. At 70%, Country A relies on it much more than Country B.')
  ] };

  // =====================================================================
  // ECO-T11-18 Market failure, public goods and free riders
  // =====================================================================
  B['ECO-T11-18'] = { title: 'Market failure, public goods and free riders', items: [
    mc('market-failure', 'What is meant by market failure?',
      'When a free market does not allocate resources efficiently', ['When a single firm makes a loss and has to close down for good', 'When prices in the market rise', 'When the government provides a good'],
      'Market failure is about the allocation of resources: the market leaves society without the best use of its scarce resources.'),
    mu('market-failure', 'Which of the following can cause market failure?',
      ['Lack of information', 'Lack of competition', 'Public goods'],
      ['Strong competition between many firms', 'Specialisation of workers'],
      'Poor information, too little competition and public goods all lead to resources being allocated inefficiently. Strong competition and specialisation do not cause market failure.'),
    mc('market-failure', 'Which situation would most probably cause resources to be allocated inefficiently?',
      'Only one firm supplying the market, with no rivals', ['Many firms competing for customers', 'Consumers with full information about prices', 'Firms responding quickly to changes in demand'],
      'Without competition, a firm can charge more and produce less than society wants, so resources are not used in the best way.'),
    mc('market-failure', 'What is the most likely result when a market lacks competition?',
      'Higher prices and less choice for consumers', ['Lower prices and more choice for consumers', 'More firms entering the market', 'Lower profits for the only firm'],
      'A firm with no rivals can raise prices and offer little choice, because consumers have nowhere else to go.'),
    mc('market-failure', 'Shoppers do not know that one brand of battery lasts twice as long as another at the same price. What is the most likely result?',
      'Some pay more than they need to for the same use', ['Every shopper still buys the longer-lasting battery', 'Prices of all batteries fall to zero', 'The market allocates resources perfectly'],
      'Lack of information means consumers make poor choices, spending more than they need to. Resources are not allocated efficiently.'),
    mc('market-failure', 'Why is the under-supply of public goods by a free market an example of market failure?',
      'Society wants them, but the market supplies none or too few', ['Firms make too much profit from them', 'They are always too expensive to use', 'They are supplied by too many firms competing for the same customers'],
      'People value goods such as flood defences, but private firms cannot make money from them, so the market fails to produce them.'),
    mc('public-good-features', 'What does non-excludable mean?',
      'People who do not pay cannot be stopped from benefiting', ['One person\'s use does not reduce what is left for others', 'The good is given free by the government', 'Only one person can use the good at a time'],
      'Non-excludable means non-payers cannot be kept out. \'Use does not reduce what is left\' is non-rivalry, a different feature.'),
    mc('public-good-features', 'What does non-rival mean?',
      'One person\'s use does not reduce the amount left for others', ['People who do not pay cannot be stopped from using it', 'Only one firm is allowed to supply the good', 'The good can be used by one person at a time'],
      'Non-rival means one more user does not leave less for anyone else. Not being able to stop non-payers is non-excludability.'),
    mc('public-good-features', 'What is a public good?',
      'A good that is non-excludable and non-rival', ['Any good or service that is provided by the government', 'A good that is excludable and rival', 'A good that creates external costs'],
      'A public good must have both features. Many goods the government provides, such as school places, are not public goods.'),
    mc('public-good-features', 'A firework display over a harbour can be seen from anywhere in the town. Why is it non-excludable?',
      'The organisers cannot stop people who have not paid from watching', ['Each extra viewer reduces how much of the display the others are able to see', 'Only people with tickets can see it', 'The display is paid for by a private firm'],
      'Anyone in the town can see the display without paying, so non-payers cannot be excluded.'),
    mc('public-good-features', 'One more ship using the light from a lighthouse does not reduce the light available to other ships. Which feature does this describe?',
      'Non-rivalry', ['Non-excludability', 'Excludability', 'Rivalry'],
      'Use by one ship does not leave less for others, so the good is non-rival.'),
    mc('classify', 'Which of the following is the best example of a public good?',
      'A lighthouse warning all passing ships', ['A reserved seat on a long-distance express train', 'A bottle of water', 'A cinema ticket'],
      'The lighthouse is non-excludable and non-rival. A train seat, a bottle of water and a cinema seat can be kept from non-payers and are used up by one person.'),
    mu('classify', 'Which of the following are public goods?',
      ['National defence', 'A flood barrier protecting a whole town', 'Street lighting'],
      ['Membership of a private gym', 'A school meal'],
      'Defence, flood barriers and street lights protect everyone in the area and cannot be kept from non-payers. Gym membership and a meal are excludable and rival.'),
    mc('classify', 'Why is a toll motorway not a pure public good?',
      'Drivers who do not pay can be excluded', ['It is always provided by the government', 'Nobody uses it', 'It has no costs to build'],
      'A toll barrier stops drivers who do not pay, so the road is excludable. A pure public good is non-excludable.'),
    mc('classify', 'Why is a pizza a private good?',
      'It is rival and excludable', ['It is non-rival and non-excludable', 'It is made by a private firm', 'It is sold at a high price'],
      'If one person eats the pizza, it is gone (rival), and the shop can refuse to sell it to someone who will not pay (excludable).'),
    mc('free-rider', 'What is a free rider?',
      'Someone who benefits from a good without paying for it', ['Someone who receives a good free from the government', 'Someone who pays more than others for a good', 'Someone who uses public transport every day'],
      'A free rider gets the benefit but makes no payment towards the cost. It is not the same as receiving a free government service.'),
    mc('free-rider', 'On Kelton Street, 30 of the 40 households pay for a private security patrol. The patrol protects every house. What are the 10 households that do not pay?',
      'Free riders', ['Third parties paying external costs', 'Price-makers', 'Private sector suppliers'],
      'The 10 households get the benefit of the patrol without paying, so they are free riders.'),
    mc('free-rider', 'Because of the free rider problem, what is a private firm offering flood defences for a town most likely to do?',
      'Not supply them, because it cannot earn enough revenue', ['Supply them and make a large profit from every resident in town', 'Charge each resident twice', 'Supply them only to free riders'],
      'People can benefit whether or not they pay, so many will not pay. The firm cannot cover its costs, so it does not supply the good.'),
    mc('free-rider', 'Boat owners in a fishing village are asked to share the cost of a new navigation beacon. Some refuse, knowing they will still see its light. Why can they do this?',
      'The beacon is non-excludable, so they benefit without paying', ['The beacon is rival, so they use up its light', 'The beacon is excludable, so they are kept out', 'The beacon is a private good sold in shops'],
      'Non-payers cannot be stopped from seeing the light, so they can free ride on those who pay. If enough people do this, the beacon may never be funded.'),
    mc('government-role', 'Why does the government usually provide street lighting?',
      'Private firms cannot charge users, so the market would not supply it', ['Street lights make a large profit for the government from people who use them', 'Private firms are banned from making lights', 'Only the government can buy electricity'],
      'Street lighting is non-excludable and non-rival, so free riders stop private firms from earning revenue. The government provides it and pays through taxes.'),
    mc('government-role', 'How are public goods usually paid for?',
      'Through taxation', ['Through ticket sales to each user', 'Through donations from free riders', 'Through profits from private firms'],
      'Since users cannot be charged directly, the government pays for public goods from tax revenue.'),
    mc('government-role', 'Which of the following is a reason why governments intervene in the economy?',
      'To correct market failure', ['To increase market failure', 'To reduce the information consumers have', 'To stop competition between firms'],
      'Governments step in when the market allocates resources inefficiently, for example by providing public goods or improving competition and information.'),
    mc('government-role', 'Which is a disadvantage of the government providing public goods?',
      'The tax money has an opportunity cost', ['Free riders pay for the goods twice', 'Public goods always make a loss for consumers', 'It removes the goods from the market'],
      'Money spent on, for example, defence cannot also be spent on schools or hospitals. This opportunity cost must be weighed against the benefits.')
  ] };

  // =====================================================================
  // ECO-T11-20 External costs and external benefits
  // =====================================================================
  B['ECO-T11-20'] = { title: 'External costs and external benefits', items: [
    mc('definition', 'What is an externality?',
      'An effect of an activity on a third party not involved in it', ['A cost paid by a firm to its suppliers for raw materials and parts', 'A benefit a buyer gets from a product', 'A tax charged by the government'],
      'An externality falls on someone outside the decision or transaction, called a third party.'),
    mc('definition', 'What is meant by an external cost?',
      'A negative effect of an activity on a third party', ['Any cost that a business pays to produce its goods', 'The price a consumer pays for a product', 'A payment from the government to a firm'],
      'An external cost has two parts: it is harmful, and it falls on a third party, not on the buyer or seller.'),
    mc('definition', 'What is meant by an external benefit?',
      'A positive effect of an activity on a third party', ['The profit a firm makes from a sale', 'The benefit a buyer gets from a product that she pays for', 'A cost that falls on the government'],
      'An external benefit is a gain to someone who was not part of the decision, for example people who are protected when others are vaccinated.'),
    mc('definition', 'What is meant by congestion?',
      'A place becoming overcrowded, for example with too many vehicles', ['A fall in the number of cars on a road', 'The price paid to park in a city', 'A daily tax charged on all vehicles that enter a busy city centre at peak times'],
      'Congestion is overcrowding. Each extra vehicle slows down others and adds fumes, which is why it is an external cost.'),
    mc('classify', 'Which of the following is an external cost?',
      'Litter dropped near a fast-food outlet', ['Rent paid by the fast-food outlet', 'Wages paid to its staff', 'The price paid by its customers'],
      'Litter affects people who were not part of the sale. Rent, wages and prices are paid by those involved, so they are private costs.'),
    mc('classify', 'Which of the following is an external benefit?',
      'Fewer infections in a town after many children are vaccinated', ['The wages earned by the nurse giving the vaccines', 'The profit made by the vaccine maker', 'The price paid for each vaccine'],
      'Other people, who were not vaccinated, are less likely to catch the disease. That gain to third parties is an external benefit.'),
    mu('classify', 'Which of the following are external costs?',
      ['Noise from a nightclub keeping neighbours awake', 'Traffic delays for other drivers caused by a stadium event', 'Smoke from a factory damaging nearby crops'],
      ['The factory\'s electricity bill', 'A student\'s tuition fee'],
      'The first three fall on third parties. An electricity bill and a tuition fee are paid by the decision-maker, so they are private costs.'),
    mc('classify', 'Why is the rent paid by a shop <b>not</b> an external cost?',
      'It is paid by the shop itself, so it is a private cost', ['It falls on a third party who is not part of the shop\'s business', 'It is paid by the government', 'It is a benefit, not a cost'],
      'External costs fall on people outside the transaction. The shop pays its own rent, so rent is a private cost.'),
    mc('classify', 'A concert-goer pays a high price for a ticket. Why is this not an external cost?',
      'The buyer is part of the transaction, not a third party', ['The concert creates no costs at all for anybody in the area', 'Ticket prices are always low', 'The government pays for the ticket'],
      'The person paying is involved in the deal. An external cost must fall on someone outside it, such as neighbours disturbed by noise.'),
    mc('pollution-type', 'A large quarry can be seen for miles from a scenic road through a national park. Which type of damage is this?',
      'Visual pollution', ['Noise pollution', 'Water pollution', 'Air pollution'],
      'Visual pollution spoils the look of an area, for example mines, quarries, large buildings or litter.'),
    mc('pollution-type', 'Lorries delivering to a warehouse at night wake up local residents. Which type of damage is this?',
      'Noise pollution', ['Visual pollution', 'Water pollution', 'Land reclamation'],
      'Unwanted sound that disturbs people who are not part of the business is noise pollution, an external cost.'),
    mc('pollution-type', 'Dye from a textile mill flows into a lake used by fishing families. Which type of damage is this?',
      'Water pollution', ['Air pollution', 'Noise pollution', 'Visual pollution'],
      'Chemicals entering rivers or lakes are water pollution. The fishing families are third parties who suffer the cost.'),
    mc('pollution-type', 'Fumes from brick kilns make it harder for people in a nearby village to breathe. Which type of damage is this?',
      'Air pollution', ['Water pollution', 'Visual pollution', 'Congestion'],
      'Smoke and fumes released into the air are air pollution. The villagers bear the cost through poorer health.'),
    mu('pollution-type', 'Which of the following are ways that businesses can damage the environment?',
      ['Air pollution', 'Water pollution', 'Noise pollution', 'Visual pollution, including litter'],
      ['Paying higher wages', 'Training their staff'],
      'The four types of damage in the specification are visual (including litter), noise, air and water pollution. Wages and training do not damage the environment.'),
    mc('third-party', 'A paper mill pollutes a river. Which group are third parties?',
      'Fishing businesses downstream', ['The mill\'s owners', 'The mill\'s customers', 'The mill\'s workers'],
      'The fishing businesses are not part of the mill\'s production or sales but are harmed by the pollution, so they are third parties.'),
    mc('third-party', 'A bottled water company pumps so much water from the ground that nearby farmers\' wells run dry. Who bears the external cost?',
      'The farmers, who now have less water', ['The company, which pays to pump the water', 'The customers buying the bottled water', 'The workers at the bottling plant'],
      'Using up a shared resource such as groundwater harms people outside the transaction. The farmers are the third parties.'),
    mc('third-party', 'Why is education often said to create external benefits?',
      'Society gains from a more skilled workforce, not just the student', ['Only the student gains from education', 'Education creates pollution for third parties', 'Schools in the private sector make a profit from teaching their students'],
      'Educated workers are more productive, can pay more tax and may commit less crime, so people other than the student gain.'),
    mc('third-party', 'When one person is vaccinated, why do others benefit?',
      'The disease spreads less, so others are less likely to catch it', ['Others pay less for their own vaccines', 'The vaccinated person pays others', 'Others are then forced by law to be vaccinated as well, at their own cost'],
      'Each vaccination reduces the chance of the disease passing on, so unvaccinated people are protected too. This is an external benefit.'),
    mc('third-party', 'Heavy traffic fumes in a city cause more breathing problems. How can this affect government spending?',
      'More must be spent on treating people in public hospitals', ['Less must be spent on public hospitals', 'The government earns more profit from roads', 'It has no effect on government spending'],
      'External costs can spread widely: ill health from pollution raises the cost of public healthcare, which is paid from taxes.'),
    mc('evaluate', 'A firm opens a factory that trains local young people, many of whom later work for other firms. Its lorries also cause traffic jams. Which pair is correct?',
      'Training: external benefit; traffic jams: external cost', ['Training: external cost; traffic jams: external benefit', 'Training: private cost; traffic jams: private benefit', 'Both are private benefits to the factory'],
      'Other firms gain skilled workers they did not train (external benefit), while other road users suffer delays they did not cause (external cost).'),
    mc('evaluate', 'A government is considering paying for free health checks because of their external benefits. Which is the strongest counter-argument?',
      'The money has an opportunity cost and the benefits are hard to measure', ['Health checks only benefit third parties', 'Health checks create air pollution that harms people who are not checked', 'Health checks have no benefits at all'],
      'Spending on health checks means less for other uses, and it is hard to put a money value on external benefits, so the case is not certain.'),
    mc('evaluate', 'When deciding whether an activity is worthwhile, why is it important to include external costs?',
      'They are real costs to society even though the decision-maker does not pay them', ['They are always smaller than private costs', 'They are always paid in full by the decision-maker as part of the price it charges', 'They only affect the firm\'s profit'],
      'Ignoring external costs makes an activity look better for society than it really is, because some of its costs fall on third parties.', { family: 'why-external-costs' })
  ] };

  // =====================================================================
  // ECO-T11-21 Social costs and social benefits formulas
  // =====================================================================
  B['ECO-T11-21'] = { title: 'Social costs and social benefits formulas', items: [
    mc('formula', 'Which is the formula for social costs?',
      'Private costs + external costs', ['Private costs − external costs', 'Private costs + private benefits', 'External costs only'],
      'Social costs are the total cost to society: the costs paid by the decision-maker (private) plus the costs on third parties (external).'),
    mc('formula', 'Which is the formula for social benefits?',
      'Private benefits + external benefits', ['Private benefits − private costs', 'Private costs + external benefits', 'External benefits only'],
      'Social benefits = private benefits + external benefits. Keep benefits with benefits; never mix in costs or subtract.'),
    mc('formula', 'Which pair of formulas is correct?',
      'Social costs = private + external costs; social benefits = private + external benefits', ['Social costs = private + external benefits; social benefits = private + external costs', 'Social costs = private − external costs; social benefits = private − external benefits', 'Social costs = external costs; social benefits = external benefits'],
      'Both formulas add the private part to the external part of the same kind: costs with costs, benefits with benefits.'),
    mc('formula', 'A student writes: "Social costs = external costs." What has the student left out?',
      'The private costs paid by the decision-maker', ['The external benefits to third parties', 'The private benefits to the buyer', 'The taxes paid to the government'],
      'Social costs include both the private costs and the external costs. External costs alone are only part of the total.'),
    mc('formula', 'Which statement about social costs is correct?',
      'Social costs are at least as large as private costs', ['Social costs are always smaller than private costs', 'Social costs are equal to private benefits', 'Social costs leave out private costs'],
      'Social costs = private costs + external costs. Adding external costs (zero or more) means social costs can never be below private costs.'),
    mc('meaning', 'What is meant by social costs?',
      'The total cost of an activity to society: private plus external costs', ['The costs paid only by the government', 'Only the external costs that fall on third parties outside the transaction', 'The costs paid by a firm minus its revenue'],
      'Social costs are the full cost to everyone: what the decision-maker pays and what third parties suffer.'),
    mc('meaning', 'What is meant by social benefits?',
      'The total benefit of an activity to society: private plus external benefits', ['Only the private benefit to the person or firm that makes the decision to consume', 'The benefits given out by the government', 'The profit a firm makes from a sale'],
      'Social benefits are the full gain to everyone: the private benefit to the decision-maker plus the external benefit to third parties.'),
    mc('meaning', 'Why are external costs included when measuring social costs?',
      'They are real costs to society even though the firm does not pay them', ['They are always paid by the firm', 'They are the same as private costs, so they are counted in both places', 'They make social costs smaller'],
      'Pollution or congestion harms people outside the transaction. Leaving these out would understate the true cost to society.', { family: 'why-external-costs' }),
    mc('classify-component', 'A factory\'s wage bill is an example of',
      'a private cost', ['an external cost', 'a private benefit', 'an external benefit'],
      'The factory pays its own wages, so they are a private cost of production.'),
    mc('classify-component', 'Smoke from a factory chimney damages washing hung out by nearby residents. This is an example of',
      'an external cost', ['a private cost', 'a private benefit', 'an external benefit'],
      'The residents are third parties who suffer harm, so this is an external cost.'),
    mc('classify-component', 'A graduate earns a higher salary because of her degree. For her, this is',
      'a private benefit', ['an external benefit', 'a private cost', 'an external cost'],
      'The gain goes to the person who made the decision to study, so it is a private benefit.'),
    mc('classify-component', 'Crime in an area falls because more young people stay in education. For local residents, this is',
      'an external benefit', ['a private benefit', 'an external cost', 'a private cost'],
      'The residents did not make the education decision but they gain from it, so it is an external benefit.'),
    mc('classify-component', 'A commuter switches from driving to the train. Other drivers now have faster journeys. For the other drivers, this is',
      'an external benefit', ['a private cost', 'a private benefit', 'an external cost'],
      'The other drivers are third parties who gain from less congestion, so this is an external benefit of the train journey.'),
    mu('classify-component', 'A new airport is built. Which of the following would be counted in its <b>social costs</b>?',
      ['The construction costs paid by the airport company', 'Noise suffered by nearby residents', 'Air pollution affecting local farms'],
      ['Holidays enjoyed by passengers', 'Profits made by airlines using the airport'],
      'Social costs = private costs (the construction bill) + external costs (noise and pollution on third parties). Holidays and airline profits are benefits, not costs.'),
    { skill: 'calc', gen: function () {
      var p = rint(20, 90) * 1000, e = rint(5, 40) * 1000;
      return N('A chemical plant has private costs of ' + money(p) + ' a week. Its pollution causes external costs of ' + money(e) + ' a week. What are the social costs? Give your answer in $.',
        p + e, '$', 'Social costs = private costs + external costs = ' + money(p) + ' + ' + money(e) + ' = ' + money(p + e) + '.', null, num(p + e));
    } },
    { skill: 'calc', gen: function () {
      var p = rint(15, 80) * 100, e = rint(5, 60) * 100;
      return N('A vaccination programme gives private benefits of ' + money(p) + ' thousand to the people vaccinated and external benefits of ' + money(e) + ' thousand to others. What are the social benefits in $ thousand?',
        p + e, '', 'Social benefits = private benefits + external benefits = ' + num(p) + ' + ' + num(e) + ' = ' + num(p + e) + ' ($ thousand).', null, num(p + e));
    } },
    { skill: 'calc', gen: function () {
      var p = rint(30, 120), e = rint(10, 60), s = p + e;
      return N('The social costs of running a coal-fired power station are $' + s + ' million a year. Its private costs are $' + p + ' million a year. What are its external costs, in $ million?',
        e, '', 'Social costs = private costs + external costs, so external costs = social costs − private costs = ' + s + ' − ' + p + ' = $' + e + ' million.');
    } },
    { skill: 'calc', gen: function () {
      var p = rint(20, 90), e = rint(10, 50), s = p + e;
      return N('A new public park gives social benefits of $' + s + ' million. External benefits to people living nearby are $' + e + ' million. What are the private benefits, in $ million?',
        p, '', 'Social benefits = private benefits + external benefits, so private benefits = ' + s + ' − ' + e + ' = $' + p + ' million.');
    } },
    { skill: 'calc', gen: function () {
      var build = rint(40, 90), run = rint(5, 20), noise = rint(3, 15), fumes = rint(2, 12), jobs = rint(10, 40);
      var sc = build + run + noise + fumes;
      return N('A new road has these effects (in $ million):<br>' + table(['Effect', '$ million'], [['Building cost paid by the road company', build], ['Yearly running cost paid by the company', run], ['Noise for people living nearby', noise], ['Fumes affecting a nearby school', fumes], ['Time saved by drivers', jobs]]) +
        'What are the social costs, in $ million?',
        sc, '', 'Social costs = private costs (' + build + ' + ' + run + ') + external costs (' + noise + ' + ' + fumes + ') = ' + sc + '. Time saved is a benefit, so it is not included.');
    } },
    { skill: 'calc', gen: function () {
      var pc = rint(20, 60), ec = rint(5, 30), pb = rint(20, 70), eb = rint(5, 40);
      var sc = pc + ec, sb = pb + eb;
      var right = sb > sc ? 'Yes: social benefits of $' + sb + 'm exceed social costs of $' + sc + 'm' : sb < sc ? 'No: social costs of $' + sc + 'm exceed social benefits of $' + sb + 'm' : 'Social benefits and social costs are equal at $' + sc + 'm';
      var wr = ['Yes: private benefits of $' + pb + 'm exceed private costs of $' + pc + 'm', 'No: private costs of $' + pc + 'm exceed private benefits of $' + pb + 'm', 'Yes: social benefits of $' + (pb + eb + ec) + 'm exceed social costs of $' + pc + 'm', (pb + ec > pc + eb ? 'Yes: social benefits of $' + (pb + ec) + 'm exceed social costs of $' + (pc + eb) + 'm' : pb + ec < pc + eb ? 'No: social costs of $' + (pc + eb) + 'm exceed social benefits of $' + (pb + ec) + 'm' : 'No: social costs of $' + (sc + pb) + 'm exceed social benefits of $' + sb + 'm')];
      wr = wr.filter(function (w) { return w !== right; });
      if (pb > pc) wr = wr.filter(function (w) { return w.indexOf('No: private') !== 0; }); else wr = wr.filter(function (w) { return w.indexOf('Yes: private') !== 0; });
      return Q('A sports stadium project has private costs of $' + pc + 'm, external costs of $' + ec + 'm, private benefits of $' + pb + 'm and external benefits of $' + eb + 'm. Judged on social costs and benefits, is it worthwhile for society?',
        right, wr.slice(0, 3),
        'Social costs = ' + pc + ' + ' + ec + ' = $' + sc + 'm. Social benefits = ' + pb + ' + ' + eb + ' = $' + sb + 'm. Society should compare the totals, not just the private figures.');
    } },
    { skill: 'calc', gen: function () {
      var pc = rint(10, 50), ec = rint(5, 30), pb = rint(20, 60);
      while (pb === pc || pb === ec || pb === pc + ec || pc - ec === pc + ec) { pb = rint(20, 60); }
      return Q('A factory has private costs of $' + pc + 'm and external costs of $' + ec + 'm. Its private benefits are $' + pb + 'm. What are its social costs?',
        '$' + (pc + ec) + 'm', ['$' + (pc + pb) + 'm', '$' + Math.abs(pc - ec) + 'm', '$' + ec + 'm'],
        'Social costs = private costs + external costs = ' + pc + ' + ' + ec + ' = $' + (pc + ec) + 'm. Private benefits are not part of costs.');
    } },
    { skill: 'calc', gen: function () {
      var n = rint(20, 80) * 1000, pbEach = rint(20, 60), eb = rint(1, 9) * 100000;
      var pbTot = n * pbEach, sb = pbTot + eb;
      return N('A new childhood vaccine is given to ' + num(n) + ' people. Each person gains a private benefit worth $' + pbEach + '. External benefits to the rest of the population are worth ' + money(eb) + '. What are the social benefits of the programme? Give your answer in $.',
        sb, '$', 'Private benefits = ' + num(n) + ' × $' + pbEach + ' = ' + money(pbTot) + '. Social benefits = ' + money(pbTot) + ' + ' + money(eb) + ' = ' + money(sb) + '.', null, num(sb));
    } }
  ] };

  // =====================================================================
  // ECO-T11-19 Privatisation: effects on stakeholders and the economy
  // =====================================================================
  B['ECO-T11-19'] = { title: 'Privatisation: effects on stakeholders and the economy', items: [
    mc('definition', 'What is meant by privatisation?',
      'Selling or transferring a government-owned firm to the private sector', ['Taking a private firm into government ownership', 'A sole trader turning the business into a new private limited company', 'Removing rules that limit competition in a market'],
      'Privatisation moves a firm or activity from the public sector to private investors. Taking a firm into state ownership is nationalisation; removing rules is deregulation.'),
    mc('definition', 'What is the opposite of privatisation?',
      'Nationalisation', ['Deregulation', 'A merger', 'Taxation'],
      'Nationalisation moves a firm from private to government ownership, the reverse of privatisation.'),
    mc('definition', 'Privatisation moves an organisation from',
      'the public sector to the private sector', ['the private sector to the public sector', 'one private firm to another private firm', 'one government department to another'],
      'The organisation stops being owned by the government and becomes owned by private investors.'),
    mc('definition', 'The government of Teleria sells all its shares in the national postal service to private investors. What is this?',
      'Privatisation', ['Nationalisation', 'Deregulation', 'A merger'],
      'A government-owned firm is sold to private investors, so it moves from the public to the private sector.'),
    mc('definition', 'The government of Ostmark buys all the shares of a failing private railway company to keep the trains running. What is this?',
      'Nationalisation', ['Privatisation', 'Deregulation', 'A takeover by a private firm'],
      'The firm moves from private to government ownership, which is nationalisation, the opposite of privatisation.'),
    mc('definition', 'A government removes the rules that stopped private bus companies running on certain routes, but sells nothing. What is this?',
      'Deregulation', ['Privatisation', 'Nationalisation', 'A merger'],
      'No ownership has changed, so this is not privatisation. Removing rules that limit competition is deregulation.'),
    mc('government', 'What is the main financial benefit to a government of privatising a state-owned firm?',
      'A one-off revenue from the sale', ['Higher profits from the firm every year', 'More control over the firm\'s prices', 'A rise in subsidies it must pay'],
      'The government receives money when it sells the firm. It can use this to repay debt or fund other spending.'),
    mu('government', 'Which of the following are possible benefits to the government of privatising a loss-making state airline?',
      ['It receives revenue from the sale', 'It no longer has to pay subsidies to the airline', 'It can use the sale money to repay debt'],
      ['It keeps all of the airline\'s future profits', 'It gains more control over the airline'],
      'The government gets the sale money and stops paying subsidies. In return it gives up control and any future profits.'),
    mc('government', 'Why might selling a profitable state-owned firm be a poor deal for the government?',
      'It gives up the firm\'s future profits', ['It must keep paying the firm\'s costs', 'It gains too much control over the firm', 'It receives no money from the sale'],
      'A profitable firm would have provided income every year. After the sale, those profits go to the private owners instead.'),
    mc('government', 'The government of Marivia uses the money from a privatisation to repay some of its debt. What is the main benefit?',
      'It pays less interest on its debt in future', ['It must raise taxes to repay the buyers', 'It gains control over more firms', 'Its debt rises automatically'],
      'Repaying debt reduces the interest the government must pay each year, freeing money for other spending.'),
    mc('consumers', 'After privatisation, the firm faces competition and wants profit. Which is the best next link in the chain for consumers?',
      'The firm cuts costs and improves service to win customers', ['The firm raises prices because its rivals copy its products and services', 'The firm stops caring whether customers return', 'The firm closes because it no longer gets subsidies'],
      'To earn profit in a competitive market, the firm must attract customers, so it has a reason to offer lower prices or better quality.'),
    mc('consumers', 'Which is the main risk to consumers when a water company is privatised?',
      'It may become a private monopoly and raise prices', ['It will be forced to cut prices to zero', 'It will face hundreds of new rival water suppliers', 'It will be run by the government'],
      'If the privatised firm has no competitors, consumers cannot switch, so it can raise prices to increase profit.'),
    mc('consumers', 'A privatised bus company stops running unprofitable routes to small villages. Who is most likely to lose?',
      'Village residents who rely on those buses', ['The company\'s shareholders', 'The government, which receives sale revenue', 'Passengers on busy city routes'],
      'A profit-seeking firm may cut services that lose money. People who depended on those services lose access.'),
    mc('workers-firm', 'What is the most likely short-run effect of privatisation on the firm\'s workers?',
      'Some may lose their jobs as the firm cuts costs', ['All will receive guaranteed pay rises paid for by the government', 'More will be employed by the government', 'None will be affected in any way'],
      'Private owners want profit, so they often look for savings, which may mean fewer staff or changes to pay and conditions.'),
    mc('workers-firm', 'Which of the following is a likely benefit to the firm itself of being privatised?',
      'Access to private investment and less political interference', ['Guaranteed subsidies from the government each year', 'It no longer needs to make a profit', 'It must follow ministers\' instructions'],
      'Private owners can raise money from investors and set the firm\'s own objectives, without decisions being driven by politics.'),
    mc('workers-firm', 'After privatisation, a former state-owned firm must',
      'make a profit to survive, so it has an incentive to be efficient', ['rely on tax revenue from the government to pay for all of its costs', 'stop charging customers for its services', 'hand all its profits to the government'],
      'Without government support, losses could force the firm to close, so it has a strong reason to control costs.'),
    mc('workers-firm', 'How might privatisation affect rival firms in the same industry?',
      'They may face a stronger, more efficient competitor', ['They will be taken into government ownership', 'They will receive the sale revenue', 'They will face no competition at all'],
      'A privatised firm driven by profit may cut costs and improve its products, putting more pressure on its rivals.'),
    mc('supply-side', 'Why is privatisation described as a supply-side policy?',
      'It aims to raise efficiency and productivity in the economy', ['It aims to raise aggregate demand through more government spending', 'It aims to cut interest rates', 'It aims to raise taxes on imports'],
      'Supply-side policies try to increase the economy\'s productive capacity. Privatisation aims to do this by making firms more efficient through the profit motive.'),
    mc('supply-side', 'A privatised port company invests in automated cranes to raise profit. Which is the most likely effect?',
      'More containers handled per worker', ['Fewer containers handled per worker', 'Higher costs for each container handled', 'The port returns to government ownership'],
      'The profit motive encourages investment in technology, which raises output per worker (productivity) and can lower the cost per container.'),
    mc('evaluate', 'Privatisation is most likely to benefit consumers when',
      'the privatised firm faces competition from other firms', ['the privatised firm becomes the only supplier', 'the government keeps setting all its prices', 'the firm no longer needs any customers'],
      'Competition forces the firm to keep prices low and quality high. Without it, a private monopoly may simply raise prices.'),
    mc('evaluate', 'A minister claims privatisation will lower electricity prices. Which is the strongest counter-argument?',
      'The firm may face no rivals, so it can raise prices for profit', ['Privatisation always lowers prices', 'Private firms are never allowed to change the prices they charge', 'Electricity has no costs to produce'],
      'Lower prices depend on competition. A private firm with no rivals has a profit motive to raise, not cut, prices.'),
    mc('evaluate', 'Whether privatisation improves a firm\'s efficiency depends most on',
      'whether the new owners face competition and invest in the firm', ['whether the firm changes its logo', 'whether the government keeps all of the revenue from the share sale', 'whether the firm keeps the same name'],
      'The profit motive works best when there is competition and when owners invest in better methods. Without these, efficiency may not improve.')
  ] };

  // =====================================================================
  // ECO-T21-17 Taxes, subsidies and parks to protect the environment
  // =====================================================================
  B['ECO-T21-17'] = { title: 'Taxes, subsidies and parks to protect the environment', items: [
    mc('identify-tool', 'Which of the following is a subsidy?',
      'Government money that lowers the cost of solar panels', ['A charge added by the government to the price of petrol', 'A penalty for dropping litter', 'A ban on burning rubbish'],
      'A subsidy is money given by the government to lower costs or prices. A charge on petrol is a tax, a penalty is a fine, and a ban is regulation.'),
    mc('identify-tool', 'A government adds $0.30 to the price of every litre of diesel. Which policy is this?',
      'A tax', ['A subsidy', 'A fine', 'A pollution permit'],
      'An extra charge on each unit of a good is a tax. It makes the polluting good more expensive.'),
    mc('identify-tool', 'A government gives households $500 towards the cost of insulating their homes. Which policy is this?',
      'A subsidy to consumers', ['A tax on consumers', 'A fine on households', 'Regulation of building firms'],
      'The government pays part of the cost, which lowers the price to households. This is a consumer subsidy.'),
    mc('identify-tool', 'A government wants to reduce the use of coal in power stations. Which measure would work in the right direction?',
      'A tax on coal', ['A subsidy for coal', 'A subsidy for coal power stations', 'Removing all taxes on coal'],
      'A tax raises the cost of the polluting good, so less is used. Subsidising coal would lower its cost and increase its use.'),
    mc('identify-tool', 'To encourage more of a good that creates external benefits, such as public transport, which policy fits best?',
      'A subsidy', ['A tax', 'A fine', 'A ban'],
      'A subsidy lowers the price, so more people use the good and the external benefits rise.'),
    mu('identify-tool', 'Which of the following are government interventions that can protect the environment?',
      ['Taxation', 'Subsidies', 'Providing parks'],
      ['Removing environmental laws', 'Lowering taxes on petrol'],
      'Taxes on pollution, subsidies for clean options and government provision of parks all protect the environment. Removing laws or cutting petrol taxes would increase harm.'),
    mc('tax', 'A tax on plastic bottles raises their price. Which is the best next link in the chain?',
      'People buy fewer bottles, so there is less plastic waste', ['People buy more bottles, so there is more waste', 'The price of bottles falls, so more are bought', 'Firms make more bottles because they earn more'],
      'A higher price reduces the quantity demanded, so fewer bottles end up as litter or in landfill.'),
    mc('tax', 'Apart from changing behaviour, what other benefit can a tax on pollution give?',
      'Revenue for the government that can fund clean-up', ['Lower production costs for the firms that pollute the most', 'Higher profits for polluting firms', 'A rise in pollution'],
      'Tax revenue can be spent on cleaning up damage or on cleaner alternatives.'),
    mc('tax', 'Why might a tax on petrol have only a small effect on pollution?',
      'Demand for petrol is price inelastic, so quantity falls only a little', ['Demand for petrol is price elastic, so quantity falls by a large amount', 'The tax lowers the price of petrol', 'Taxes cannot change prices'],
      'If people need petrol and have few substitutes, they keep buying it after a price rise, so pollution falls only slightly.'),
    mc('tax', 'Why might a tax on home heating fuel be unfair?',
      'Low-income households spend a larger share of their income on it', ['High-income households spend a larger share of their income on it', 'It lowers the price of heating fuel', 'It is paid only by firms'],
      'Heating is a necessity, so the tax takes a bigger proportion of the income of poorer households.'),
    { skill: 'tax', gen: function () {
      var p0 = rint(4, 12) * 0.2, x = pick([10, 15, 20, 25]), p1 = R.roundDp(p0 * (100 + x) / 100, 2);
      return N('A bottle of fizzy drink costs ' + money(p0, 2) + '. To cut plastic waste the government adds a tax equal to ' + x + '% of the price, and shops pass it all on to customers. What is the new price? Give your answer in $ to 2 decimal places.',
        p1, '$', 'Tax = ' + x + '% × ' + money(p0, 2) + ' = ' + money(p1 - p0, 2) + '. New price = ' + money(p0, 2) + ' + ' + money(p1 - p0, 2) + ' = ' + money(p1, 2) + '.', 0.005, p1.toFixed(2));
    } },
    { skill: 'tax', gen: function () {
      var t = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]), q0 = rint(30, 80) * 100000, f = rint(5, 20), q1 = q0 * (100 - f) / 100, rev = R.roundDp(t * q1, 0);
      return N('Before a tax, ' + num(q0) + ' litres of a polluting fuel were sold each year. The government adds a tax of ' + money(t, 2) + ' per litre and sales fall to ' + num(q1) + ' litres. How much tax revenue does the government collect each year? Give your answer in $.',
        rev, '$', 'Revenue = tax per litre × litres sold after the tax = ' + money(t, 2) + ' × ' + num(q1) + ' = ' + money(rev) + '. Use the quantity sold after the tax, not before.', null, num(rev));
    } },
    { skill: 'tax', gen: function () {
      var q0 = rint(20, 60) * 1000, f = pick([10, 12, 15, 18, 20, 25, 30]), q1 = q0 * (100 - f) / 100;
      return N('After a tax on single-use coffee cups, the number used in a city each week falls from ' + num(q0) + ' to ' + num(q1) + '. By what percentage did the number of cups used fall?',
        f, '%', 'Fall = ' + num(q0) + ' − ' + num(q1) + ' = ' + num(q0 - q1) + '. Percentage fall = ' + num(q0 - q1) + ' ÷ ' + num(q0) + ' × 100 = ' + f + '%.');
    } },
    mc('subsidy', 'A subsidy is given to producers of electric buses. What is its first effect on those producers?',
      'It lowers their costs of production', ['It raises their costs of production', 'It forces them to stop production', 'It is a penalty for pollution'],
      'A subsidy is money from the government, so it reduces the cost of making each bus. This can lead to lower prices.'),
    mc('subsidy', 'The government subsidises bus fares in a city. Which is the best chain of effects?',
      'Fares fall, more people take the bus, so fewer car journeys and less pollution', ['Fares rise, fewer people take the bus, so there are more car journeys and more pollution', 'Fares fall, fewer people take the bus, so pollution rises', 'Fares are unchanged, so nothing happens to pollution'],
      'The subsidy makes the clean option cheaper, so people switch from cars to buses, cutting fumes and congestion.'),
    mc('subsidy', 'What is the main disadvantage of a subsidy for solar panels?',
      'It costs the government money that could be spent elsewhere', ['It raises the price that households have to pay for solar panels', 'It raises tax revenue for the government', 'It increases pollution from power stations'],
      'Subsidies are paid from tax revenue, so they have an opportunity cost: the money could have been used for hospitals or schools.'),
    mc('subsidy', 'A subsidy for public transport is most likely to cut car use when',
      'buses and trains are a close substitute for car journeys', ['there are no bus or train routes near people\'s homes', 'car fuel is very cheap and has no tax', 'the subsidy is too small to change fares'],
      'People only switch if public transport is a realistic alternative. Where it is not, the subsidy changes little.'),
    { skill: 'subsidy', gen: function () {
      var s = pick([0.4, 0.5, 0.6, 0.75, 0.8, 1, 1.2, 1.5]), j = rint(20, 90) * 100000, cost = R.roundDp(s * j, 0);
      return N('To cut car use, a government pays a subsidy of ' + money(s, 2) + ' for each bus journey. Passengers make ' + num(j) + ' journeys a year. What is the yearly cost of the subsidy to the government? Give your answer in $.',
        cost, '$', 'Cost = subsidy per journey × number of journeys = ' + money(s, 2) + ' × ' + num(j) + ' = ' + money(cost) + '. This money has an opportunity cost.', null, num(cost));
    } },
    mc('compare', 'What is a key difference between a tax and a subsidy used to protect the environment?',
      'A tax raises revenue; a subsidy costs the government money', ['A tax costs the government money; a subsidy raises revenue', 'Both raise revenue for the government', 'Both lower the price of polluting goods'],
      'A tax brings money in and makes harmful goods dearer. A subsidy pays money out and makes clean goods cheaper.'),
    mc('compare', 'Demand for a harmful product is very price inelastic, so a tax barely reduces its use. Which alternative policy might work better?',
      'Regulation, such as a limit or ban on the product', ['A subsidy for the harmful product to lower its price further', 'Removing the tax altogether', 'Lowering the price of the product'],
      'When price changes do little, a rule that directly limits use may cut the harm more effectively.'),
    mc('parks', 'Why might a government provide national parks?',
      'To protect land and wildlife from development', ['To raise the price of land for housing', 'To increase pollution in rural areas', 'To reduce tourist visits'],
      'Keeping land as a park stops it from being built on or polluted, protecting habitats and wildlife.'),
    mu('parks', 'Which of the following are likely benefits of the government providing more public parks?',
      ['Protecting wildlife habitats', 'Giving people space for exercise', 'Attracting tourists to the area'],
      ['Raising tax revenue from fuel sales', 'Lowering bus fares'],
      'Parks protect nature, support health and leisure, and can bring visitors who spend in local businesses.'),
    mc('parks', 'What is the opportunity cost of using a large area of land for a new national park?',
      'The housing or farming that could have used the land', ['The money that visitors spend on tickets and food in the park', 'The wildlife protected by the park', 'Nothing, because parks are free to visit'],
      'Land used as a park cannot also be used for houses or crops. That next best use is the opportunity cost.')
  ] };

  // =====================================================================
  // ECO-T12-21 Regulation, fines and pollution permits
  // =====================================================================
  B['ECO-T12-21'] = { title: 'Regulation, fines and pollution permits', items: [
    mc('definition', 'What is a fine?',
      'A money penalty for breaking a rule or law', ['A tax charged on every unit sold', 'A payment from the government to a firm', 'A permit that allows a firm to pollute'],
      'A fine is a penalty paid only when someone breaks a rule, for example dropping litter or speeding.'),
    mc('definition', 'What is meant by regulation?',
      'A rule or law that controls what firms or people may do', ['A payment from the government that lowers a firm\'s costs', 'A tax on goods that cause pollution', 'A market where firms buy and sell shares'],
      'Regulation sets legal limits, such as a ban on a harmful product or a maximum level of emissions.'),
    mc('definition', 'What is a pollution permit?',
      'Legal permission to release up to a set amount of pollution', ['Permission for a firm to release as much pollution as it wants', 'A fine for polluting a river', 'A subsidy for cleaner technology'],
      'A permit allows only a limited amount of pollution. The government controls the total by limiting the number of permits.'),
    mc('definition', 'How does a fine differ from a tax?',
      'A fine is a penalty for breaking a rule; a tax is charged on a legal activity', ['A fine is charged on every sale made; a tax is charged only on people who break rules', 'A fine is paid by the government; a tax is paid to firms', 'There is no difference between a fine and a tax'],
      'Taxes are charged on normal, legal buying or producing. Fines are charged only when someone breaks a law.'),
    mc('identify-tool', 'A city bans diesel lorries from its centre during the day. Which policy is this?',
      'Regulation', ['A fine', 'A subsidy', 'A tax'],
      'A ban is a rule that controls what people may do, so it is regulation. A fine would be the penalty for breaking it.'),
    mc('identify-tool', 'A town charges a $200 penalty to anyone caught dropping litter on the beach. Which policy is this?',
      'A fine', ['A tax', 'A pollution permit', 'A subsidy'],
      'The $200 is only paid by people who break the rule, so it is a fine.'),
    mc('identify-tool', 'A cement works may release up to 500 tonnes of carbon dioxide a year. If it wants to release more, it must buy the right from other firms. Which policy is this?',
      'Pollution permits', ['A fine', 'A subsidy', 'A ban'],
      'The firm has a capped allowance that can be traded. This is a system of tradable pollution permits.'),
    mc('identify-tool', 'An electricity company is charged $0.05 for every unit of electricity it generates from coal. Which policy is this?',
      'A tax', ['A fine', 'A pollution permit', 'Regulation'],
      'The charge applies to every unit of a legal activity, so it is a tax, not a fine. A fine is only for breaking a rule.'),
    mu('identify-tool', 'Which of the following are examples of regulation to protect the environment?',
      ['A ban on lead in paint', 'Emission standards for new cars', 'A legal limit on the fish each boat may catch'],
      ['A subsidy for solar panels', 'A tax on petrol'],
      'Regulations are rules and legal limits. Subsidies and taxes work through prices instead.'),
    mc('permits', 'A firm cuts its pollution below the amount its permits allow. What can it do?',
      'Sell its spare permits to other firms', ['Pollute without any limit in future', 'Ask for a fine from the government', 'Nothing, because permits cannot be traded'],
      'Spare permits can be sold, which gives the firm extra revenue and a reward for polluting less.'),
    mc('permits', 'How do pollution permits limit the total amount of pollution?',
      'The government caps the number of permits it issues', ['Each firm can print as many permits as it wants', 'Permits are given to every firm that asks', 'Firms with permits must stop all production'],
      'The total of all permits sets a cap. Even if permits are traded, the total pollution allowed cannot rise above it.'),
    mc('permits', 'Selling spare pollution permits earns money. Which is the best next link in the chain?',
      'Firms have a money reason to invest in cleaner technology', ['Firms have a reason to pollute more so they can buy extra permits', 'The total pollution cap rises', 'Permits become worthless'],
      'If cutting pollution lets a firm sell permits, cleaner methods become profitable, so pollution falls over time.'),
    mu('permits', 'Which of the following are advantages of pollution permits?',
      ['They put a cap on total pollution', 'Firms that pollute less can earn money'],
      ['They allow unlimited pollution if a firm pays', 'They cost nothing to monitor', 'They remove the need for any government role'],
      'Permits cap pollution and reward cleaner firms. They still need monitoring and a government to set and enforce the cap.'),
    { skill: 'permits', gen: function () {
      var a = rint(20, 60) * 10, e = a + rint(4, 20) * 10, p = rint(15, 60);
      return N('A steel plant holds permits allowing ' + num(a) + ' tonnes of emissions this year. It expects to emit ' + num(e) + ' tonnes. Permits for one tonne trade at $' + p + '. How much must it spend on extra permits? Give your answer in $.',
        (e - a) * p, '$', 'Extra tonnes = ' + num(e) + ' − ' + num(a) + ' = ' + num(e - a) + '. Cost = ' + num(e - a) + ' × $' + p + ' = ' + money((e - a) * p) + '. This cost gives the plant a reason to cut emissions.', null, num((e - a) * p));
    } },
    { skill: 'permits', gen: function () {
      var a = rint(30, 80) * 10, e = a - rint(5, 25) * 10, p = rint(15, 60);
      return N('A paper mill holds permits for ' + num(a) + ' tonnes of emissions. After fitting new filters it emits only ' + num(e) + ' tonnes. It sells its spare permits at $' + p + ' per tonne. How much revenue does it earn? Give your answer in $.',
        (a - e) * p, '$', 'Spare permits = ' + num(a) + ' − ' + num(e) + ' = ' + num(a - e) + ' tonnes. Revenue = ' + num(a - e) + ' × $' + p + ' = ' + money((a - e) * p) + '. This is the reward for polluting less.', null, num((a - e) * p));
    } },
    { skill: 'permits', gen: function () {
      var c = rint(10, 70), p = c + pick([-1, 1]) * rint(5, 20);
      if (p < 5) p = c + 10;
      var cut = c < p;
      var right = cut ? 'Cut its own emissions, because $' + c + ' is less than $' + p : 'Buy permits, because $' + p + ' is less than $' + c;
      return Q('A firm needs to reduce its emissions by one tonne or buy a permit for that tonne. Cutting one tonne itself costs $' + c + '. A permit for one tonne costs $' + p + '. What should a profit-seeking firm do?',
        right, [cut ? 'Buy permits, because $' + p + ' is more than $' + c : 'Cut its own emissions, because $' + c + ' is more than $' + p, 'Ignore the limit, because permits do not cap pollution', 'Ask the government for a subsidy to pollute'],
        'A firm chooses the cheaper option. ' + (cut ? 'Cutting costs $' + c + ' against $' + p + ' for a permit, so it cuts.' : 'A permit costs $' + p + ' against $' + c + ' to cut, so it buys a permit.') + ' Either way, total pollution stays within the cap.');
    } },
    mc('fines', 'How do fines for speeding help to reduce accidents?',
      'Speeding becomes costly, so fewer drivers choose to speed', ['Fines make drivers travel faster so they can avoid being caught', 'Fines pay drivers to drive safely', 'Fines remove all cars from roads'],
      'A fine deters the harmful behaviour. Fewer drivers speeding means fewer accidents harming third parties such as pedestrians.'),
    mc('fines', 'A coastal council fines people for leaving rubbish on beaches. Apart from cleaner beaches, what is an advantage for the council?',
      'Revenue from fines can help pay for beach cleaning', ['It no longer needs to collect any rubbish', 'It must pay the people who are fined', 'Beach visitors will rise because fines are high'],
      'Fines raise money as well as deterring litter. The council can use this to fund clean-up and enforcement.'),
    mc('fines', 'A factory makes $50,000 a year by dumping waste illegally, and the fine if caught is $5,000. What is the most likely result?',
      'The factory pays the fine and carries on polluting', ['The factory stops dumping immediately', 'The fine is larger than the gain, so dumping stops', 'Pollution falls to zero'],
      'If the fine is small compared with the gain, it does not deter the firm. Fines must be large enough, and likely enough, to change behaviour.'),
    mc('regulation', 'What is the main strength of regulation such as a ban?',
      'It gives direct, clear control over the harmful activity', ['It raises tax revenue on every unit of the product that is sold', 'It costs nothing to enforce', 'It lets firms pollute as much as they want'],
      'A ban or legal limit directly stops or limits the harm, so the result is more certain than with a price-based policy.'),
    mc('regulation', 'Why might strict pollution regulations harm some workers?',
      'Firms\' costs rise, so some may cut jobs or close', ['Firms\' costs fall, so they hire more workers', 'Regulations pay workers to stay at home', 'Regulations force firms to raise wages'],
      'Meeting new standards can be expensive. Firms may raise prices, cut staff or move to countries with weaker rules.'),
    mc('evaluate', 'Which is a weakness of using regulation to protect the environment?',
      'Monitoring and enforcing it costs time and money', ['It always raises extra revenue for the government from every firm', 'It has no effect on firms\' behaviour', 'It encourages more pollution'],
      'Inspectors must check that firms follow the rules. If enforcement is weak, some firms will ignore the rules.'),
    mc('evaluate', 'Fines are most likely to be effective when',
      'the chance of being caught is high and the fine is large enough', ['the fine is very small and rarely enforced', 'no one knows that the rule exists', 'firms gain much more from breaking the rule than they pay in fines'],
      'People weigh the gain from breaking a rule against the likely penalty. A large fine that is often enforced deters the harm.'),
    mc('evaluate', 'Why is it hard for a government to set the right limit when regulating pollution?',
      'It may not know the level of pollution that is best for society', ['Pollution can always be measured exactly and at no cost to anyone', 'Firms never react to limits', 'Limits have no effect on firms\' costs'],
      'Setting a limit too low may close firms, and too high may leave much harm. The government may lack the information to judge it well.'),
    { skill: 'evaluate', gen: function () {
      var a = rint(4, 9) * 100, f = pick([20, 25, 30, 35, 40, 45, 50, 60]), b = a * (100 - f) / 100;
      return N('In the year before a city doubled its fine for littering, ' + num(a) + ' people were fined. The year after, ' + num(b) + ' people were fined. By what percentage did the number of fines fall?',
        f, '%', 'Fall = ' + num(a) + ' − ' + num(b) + ' = ' + num(a - b) + '. Percentage fall = ' + num(a - b) + ' ÷ ' + num(a) + ' × 100 = ' + f + '%. This suggests the bigger fine deterred some littering, though fewer patrols could also explain it.');
    } }
  ] };
})();
