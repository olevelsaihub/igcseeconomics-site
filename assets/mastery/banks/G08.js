/* Group G08 mastery bank: Paper 1: consumer choice, labour demand, unions and competition; Paper 2: growth effects, globalisation, protection and applied percentages; Rarest topics: competition policy and data averages. Original questions, not copied from past papers. */
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
    if (dp == null && Math.abs(n - Math.round(n)) > 1e-9) dp = 2;
    var s = dp ? R.roundDp(n, dp).toFixed(dp) : String(Math.round(n));
    var p = s.split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '-' : '') + p.join('.');
  }
  function money(n, dp) { return (n < 0 ? '-$' : '$') + num(Math.abs(n), dp); }
  function cur(sym, n, dp) { return (n < 0 ? '-' : '') + sym + num(Math.abs(n), dp); }
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
    if (tol == null && Math.abs(ans - Math.round(ans)) > 1e-9) tol = 0.005;
    if (tol != null) o.tol = tol;
    if (display) o.display = display;
    return o;
  }
  var COUNTRIES = ['Corvania', 'Tellora', 'Mirasol', 'Kandria', 'Lusenia', 'Pellucia', 'Zantoria', 'Vardonia', 'Estrelia', 'Norvik'];
  var CURS = [{ s: '$', n: 'dollars ($)' }, { s: '€', n: 'euros (€)' }, { s: '£', n: 'pounds (£)' }];

  // =====================================================================
  // ECO-T12-10 Competition between firms: benefits and drawbacks
  // =====================================================================
  B['ECO-T12-10'] = { title: 'Competition between firms: benefits and drawbacks', items: [
    mc('definition', 'Which is the best definition of <b>competition</b> between firms?',
      'Rivalry between firms trying to win the same customers', ['An agreement between rival firms to all charge the same price', 'One firm supplying the whole of a market alone', 'Government control of the prices that firms charge'],
      'Competition is rivalry between firms: each tries to attract customers and sales away from the others. Agreeing prices is the opposite of rivalry.'),
    mc('definition', 'Which is the best definition of <b>innovation</b>?',
      'Turning a new idea into a product or method that is used', ['Any new invention, even if it is never sold or put to use', 'Copying a rival’s product and selling it for less', 'Spending more on advertising an existing product'],
      'Innovation is more than inventing: a new idea has to be put to commercial use, as a new product or a better way of producing.'),
    mc('definition', 'Which of these is an example of <b>innovation</b> by a firm?',
      'A bakery chain launches an app so customers order and pay ahead', ['A bakery chain cuts the price of its white bread by 10% this week', 'A bakery chain opens for the same hours as its rival', 'A bakery chain repaints its shops in its usual colours'],
      'The app is a new idea put to use, a new way of serving customers. A price cut or the same opening hours are ordinary competitive moves, not innovation.'),
    mc('definition', 'Which situation shows competition between firms?',
      'Two coach firms run the same route and each tries to win passengers', ['One water company supplies every home in a city', 'Two coach firms on the same route agree to charge exactly the same fares', 'The government sets all coach fares by law each year'],
      'Competition needs rival firms each trying to attract the same customers. A single supplier, agreed prices or fares set by law remove the rivalry.'),
    mu('consumer-effects', 'A small town had one gym. Three new gyms open. Which are <b>likely benefits to consumers</b> of this competition? Select all that apply.',
      ['Lower monthly fees', 'A wider choice of classes and opening times', 'Better equipment and service as gyms try to keep members'],
      ['Higher fees because there are more gyms to pay for', 'Fewer gyms to choose from'],
      'Rival gyms try to win members from each other, so they cut fees, widen choice and improve quality. More gyms means more choice, not less.'),
    mc('consumer-effects', 'A second ferry company starts sailing on a route that had one ferry for years. <b>Apart from price</b>, which is the most likely benefit for passengers?',
      'More frequent sailings and better service on board', ['Lower fares as each firm tries to attract passengers', 'Fewer sailings because passengers are split between firms', 'Higher fares to pay for the extra advertising'],
      'The question rules out price, so lower fares cannot be the answer. To win passengers, each ferry firm has a reason to offer more sailings and better service.'),
    mc('consumer-effects', 'Four new gyms open in a town that had only one. Why are monthly fees likely to fall?',
      'Each gym cuts fees to win members away from its rivals', ['The government lowers fees when more gyms open', 'The cost of running each gym falls as soon as rivals open nearby', 'Members are willing to pay more when choice rises'],
      'With rivals nearby, a gym that keeps high fees loses members to cheaper gyms. So each gym lowers its fees to attract customers: that is why competition lowers prices.'),
    mc('consumer-effects', 'A phone maker adds a much better camera to its new model soon after a rival launched one. For consumers this is mainly an example of competition leading to:',
      'Better quality and new features', ['Fewer products to choose from', 'Higher prices for the same features', 'Lower spending on research by firms'],
      'Rivalry pushes firms to innovate and improve quality so they do not lose customers. Consumers gain better products and new features.'),
    { skill: 'context-reasoning', gen: function () {
      var trade = pick([['hair salons', 'a haircut', 'hair salon'], ['driving schools', 'a one-hour lesson', 'driving school'], ['car washes', 'a full car wash', 'car wash'], ['bicycle repair shops', 'a basic bike service', 'bicycle repair shop']]);
      var nA = rint(9, 16), nB = rint(1, 3), pA = rint(12, 20), pB = pA + rint(6, 12);
      return Q('The table shows the number of ' + trade[0] + ' and the average price of ' + trade[1] + ' in two districts of the same city.<br>' +
        table(['District', 'Number of ' + trade[0], 'Average price'], [['Riverside', nA, '$' + pA], ['Hilltop', nB, '$' + pB]]) +
        'Which conclusion about competition do the data best support?',
        'Prices are higher in Hilltop because there are fewer rivals competing', ['Prices are higher in Hilltop because more firms lead to higher prices', 'Prices are lower in Riverside because consumers there have less choice', 'The number of rivals has no link at all with the price charged'],
        'Hilltop has only ' + nB + ' ' + (nB === 1 ? trade[2] : trade[0]) + ' against ' + nA + ' in Riverside. With few rivals, a firm loses fewer customers if it charges more, so prices are higher ($' + pB + ' against $' + pA + ').');
    } },
    mc('context-reasoning', 'A plumber charges more for the same job in a remote village than in a large city nearby. Using the idea of competition, which is the most likely reason?',
      'There are fewer plumbers competing for customers in the village', ['There are more plumbers to choose from in the village', 'City plumbers face less competition than the plumbers in the village', 'Village customers always prefer to pay higher prices'],
      'With few plumbers in the village, customers have little choice, so a plumber can charge more without losing work. In the city, many rivals keep prices down.'),
    { skill: 'firm-drawbacks', gen: function () {
      var food = pick(['lunch boxes', 'pizzas', 'noodle bowls', 'sandwich meals']);
      var p1 = rint(10, 14), c = rint(5, p1 - 3), cut = rint(1, p1 - c - 1), p2 = p1 - cut;
      var q1 = rint(30, 50) * 10, q2 = q1 + rint(2, 6) * 10;
      var prof1 = (p1 - c) * q1, prof2 = (p2 - c) * q2;
      if (prof2 >= prof1) { q2 = q1 + 10; prof2 = (p2 - c) * q2; }
      return N('A café sells ' + num(q1) + ' ' + food + ' a week at $' + p1 + ' each. Each one costs $' + c + ' to make. A rival café opens next door, so the café cuts its price to $' + p2 + ' and now sells ' + num(q2) + ' a week. Costs per unit are unchanged. By how much does the café’s weekly profit fall? Give your answer in $.',
        prof1 - prof2, '$',
        'Before: ($' + p1 + ' − $' + c + ') × ' + num(q1) + ' = ' + money(prof1) + '. After: ($' + p2 + ' − $' + c + ') × ' + num(q2) + ' = ' + money(prof2) + '. Profit falls by ' + money(prof1 - prof2) + ': lower profit is a drawback of competition for firms.',
        null, num(prof1 - prof2));
    } },
    mc('firm-drawbacks', 'Which is a disadvantage <b>to firms</b> of increased competition?',
      'Profit may fall because firms must cut prices', ['Customers get a wider choice of products', 'Firms gain the power to set any price they like', 'Demand for every firm’s product will rise'],
      'More rivals force firms to cut prices to keep customers, which squeezes profit. Wider choice is a benefit, and it goes to consumers, not firms.'),
    mc('firm-drawbacks', 'Many new rivals enter a market for running shoes. What is a firm already in the market most likely to increase?',
      'Spending on advertising to keep customers loyal', ['The rate of tax it pays on its profit', 'The price that its customers are willing to pay for shoes', 'The share of the market it holds'],
      'To stop customers switching to the new rivals, firms usually spend more on advertising. This raises costs and is a drawback of competition for firms.'),
    mu('firm-drawbacks', 'Which are drawbacks of competition <b>for firms</b>? Select all that apply.',
      ['Lower profit margins', 'Higher spending on advertising', 'A risk of being forced to close'],
      ['A wider choice of goods for shoppers', 'The freedom to raise prices without losing sales'],
      'Rivalry squeezes prices and profit, raises advertising costs and can drive weaker firms out. Wider choice benefits consumers, and firms in competitive markets cannot raise prices freely.'),
    mc('stakeholder', 'A large supermarket opens beside three small family grocers. Which group is most likely to <b>lose</b> from the extra competition?',
      'Owners of the small grocers, whose sales and profit may fall', ['Local shoppers, who now have more stores and offers to choose from', 'People hired to work in the new supermarket', 'Farmers who supply goods to the new supermarket'],
      'The small grocers face a strong new rival that can attract their customers, so their sales and profit are likely to fall. Shoppers, new workers and suppliers are more likely to gain.'),
    mc('consumer-drawbacks', 'A fierce price war between airlines has left their profits very low. Which is a possible <b>drawback for passengers</b>?',
      'Airlines may cut costs by reducing service quality', ['Fares rise because airlines compete harder', 'Passengers have more airlines to choose from', 'Airlines spend more on comfort to attract passengers'],
      'Firms with very low profit may save costs by cutting quality (less legroom, fewer staff). That harms passengers. More choice is a benefit, not a drawback.'),
    mc('consumer-drawbacks', 'A price war forces two of a town’s five bookshops to close. What is the most likely longer-term effect on book buyers?',
      'Less choice, and the remaining shops face less pressure to keep prices low', ['More choice, because the remaining shops will stock a much wider range of books', 'Lower prices, because fewer shops must compete harder', 'No effect, because the number of shops does not matter'],
      'When rivals close, competition weakens. Buyers have fewer shops to choose from and the survivors have less reason to keep prices down, so the earlier gains can be lost.'),
    mc('economy-efficiency', 'Why does competition tend to make firms more efficient?',
      'High-cost firms lose customers, so firms try to keep costs low', ['Firms can charge any price they like, so they can afford new machines', 'The government pays subsidies to firms that have rivals', 'Firms no longer need to think about what customers want'],
      'If a firm’s costs are high it must charge more and will lose customers to cheaper rivals. To survive, firms keep costs low, so resources are used efficiently.'),
    mc('economy-efficiency', 'Which is a benefit of competition for the <b>economy as a whole</b>?',
      'Scarce resources are used more efficiently', ['Firms make higher profits because prices rise', 'Firms can stop spending on research', 'Fewer goods and services are produced'],
      'Competition rewards firms that keep costs low and make what customers want, so scarce resources are not wasted. Prices tend to fall, not rise.'),
    mc('economy-efficiency', 'Why does competition encourage innovation?',
      'A firm with a better product can win customers from its rivals', ['Innovation is only possible when a firm has no rivals', 'Rival firms share their research so nobody needs to pay', 'Competition guarantees that every new product makes a profit for the firm'],
      'Firms innovate to get ahead: a new or better product attracts customers away from rivals. Without rivals, there is less pressure to improve.'),
    mc('evaluation', 'Claim: “More competition between mobile network providers will always benefit their customers.” Which is the best <b>counter-argument</b>?',
      'Low profits may lead firms to cut spending on network quality', ['Customers will have more networks and more tariffs to choose from', 'Prices are likely to fall as networks compete', 'Networks will innovate to win customers'],
      'The other options support the claim. A real counter-argument shows a drawback: if profits are squeezed, firms may cut quality or investment, which harms customers.'),
    mu('consumer-effects', 'Which are signs that firms in a market are competing hard? Select all that apply.',
      ['Frequent discounts and special offers', 'Regular launches of new or improved products', 'Heavy spending on advertising'],
      ['Identical prices agreed by all the firms', 'One firm making all the sales in the market'],
      'Discounts, new products and advertising are ways firms fight for customers. Agreed prices or a single seller show a lack of competition.'),
    mc('evaluation', 'When judging whether competition benefits hairdressing customers in a town, which factor would the outcome <b>most depend on</b>?',
      'Whether price cuts are paid for by lower quality or lower profit', ['Whether the town has a name that tourists recognise', 'Whether customers prefer to cut their own hair at home', 'Whether the salons all buy their shampoo from the same suppliers'],
      'If firms cut prices by accepting lower profit, customers gain. If they cut costs by lowering quality, the benefit is smaller. A good judgement says what the outcome depends on.')
  ] };

  // =====================================================================
  // ECO-T11-05 Why consumers may not maximise their benefit
  // =====================================================================
  var REASONS = ['They are not good at calculating their benefits', 'They have a habit that is hard to give up', 'They copy the behaviour of other people', 'They are aiming to maximise profit rather than benefit'];
  function reason(skill, stem, k, why) {
    var opts = [REASONS[k]].concat(REASONS.filter(function (_, i) { return i !== k; }));
    return mc(skill, stem + ' Which reason best explains why this consumer may not maximise their benefit?', opts[0], opts.slice(1), why);
  }
  B['ECO-T11-05'] = { title: 'Why consumers may not maximise their benefit', items: [
    mc('assumption', 'Economists assume that consumers aim to:',
      'Maximise their benefit from their limited income', ['Maximise their profit from what they buy', 'Spend all of their income as quickly as they possibly can', 'Buy the cheapest product in every market'],
      'The underlying assumption is that consumers aim to maximise benefit (satisfaction). Maximising profit is the assumption made about businesses.'),
    mc('assumption', 'Why does maximising benefit always involve making choices?',
      'Income is limited, so buying one thing means giving up another', ['Prices never change, so consumers can always buy everything they want', 'Firms decide what each consumer must buy', 'Consumers have unlimited income to spend'],
      'With limited income, a consumer cannot buy everything. To get the most benefit they must choose the mix of goods that gives the greatest satisfaction.'),
    mc('assumption', 'A student writes: “Consumers may not maximise their benefit because they aim to maximise profit.” What is wrong with this?',
      'Profit maximisation is the assumption about businesses, not consumers', ['Consumers always maximise their benefit, so nothing can ever stop them doing so', 'Businesses aim to maximise benefit, not profit', 'Consumers aim to minimise their satisfaction'],
      'The specification assumes consumers maximise benefit and businesses maximise profit. The student has swapped them.'),
    mu('identify-reason', 'Which are reasons in the specification why consumers may not maximise their benefit? Select all that apply.',
      ['Consumers do not always work out their benefits well', 'Consumers find some habits hard to break', 'Consumers sometimes copy what other people do'],
      ['Businesses aim to maximise their profit', 'Consumers have unlimited incomes'],
      'The three reasons are poor calculation of benefits, hard-to-break habits and copying others. Profit maximisation is about firms, and income is limited, not unlimited.'),
    mc('identify-reason', 'Which of these could stop a consumer getting the greatest benefit from their spending?',
      'They may copy what their friends buy to fit in', ['They compare every option carefully before buying', 'They ignore what other people buy', 'They always have full information on products'],
      'Copying friends to fit in can lead a consumer to buy something that suits the group, not their own needs. The other options describe careful, well-informed choices.'),
    mc('identify-reason', 'A student lists reasons why consumers may not maximise their benefit. Which item on the list is <b>wrong</b>?',
      'Consumers always weigh up costs and benefits carefully', ['Consumers may lack information about a product', 'Consumers may stick with a familiar brand out of habit', 'Consumers may buy what others in their group buy'],
      'Careful weighing of costs and benefits is what maximising benefit looks like, so it cannot be a reason for failing to do so. The other three are real reasons.'),
    reason('identify-reason', 'Ravi pays $90 for an extended warranty on a $250 coffee machine because the salesperson makes breakdowns sound likely, even though such machines rarely fail.', 0,
      'Ravi has overestimated the benefit of the warranty because he lacked accurate information. He is not good at calculating his benefit, so the $90 could have given more satisfaction elsewhere.'),
    reason('identify-reason', 'Lena buys the same brand of trainers that everyone in her class wears, even though another pair fits her better and costs less.', 2,
      'Lena chooses what her group wears to fit in. Copying others means she gets less benefit than from the pair that suits her.'),
    reason('identify-reason', 'Tomas buys a coffee from the same kiosk every morning, even after the price rose by 40% and he is trying to save money.', 1,
      'Tomas keeps buying out of routine even though the money could give him more benefit elsewhere. A habit that is hard to give up stops him maximising benefit.'),
    reason('identify-reason', 'Mei buys a large “2 for 1” pack of yoghurt and throws half of it away because it goes out of date before she can eat it.', 0,
      'Mei misjudged how much benefit the offer would give. She is not good at calculating her benefits, so part of her spending gave no satisfaction at all.'),
    reason('identify-reason', 'Joel signs up for an expensive online game subscription only because all of his friends play it, though he rarely enjoys the game.', 2,
      'Joel pays to join in with his friends rather than because the game gives him benefit. Copying others leads to a choice that gives him little satisfaction.'),
    reason('identify-reason', 'After moving house, Ama still drives to her old supermarket every week out of routine, although a cheaper one is now much closer.', 1,
      'Ama’s routine is hard to break, so she spends more time and money than she needs to. This habit stops her maximising her benefit.'),
    reason('identify-reason', 'Hugo pays for a 12-month gym contract, sure that he will go every day. He goes four times in the whole year.', 0,
      'Hugo overestimated the benefit he would get from the gym. Poor calculation of benefit meant his money gave far less satisfaction than he expected.'),
    mc('identify-reason', 'Kai started buying a brand of energy bar because his teammates did. Two years later his teammates have stopped, but Kai still buys one every day. Which reason <b>now</b> best explains why he keeps buying them?',
      'A habit that is hard to give up', ['Copying the behaviour of others', 'Aiming to maximise his profit', 'Having full information about the bars'],
      'Copying explains how Kai started, but his teammates have stopped, so copying cannot explain why he continues. He now buys out of habit.'),
    mc('develop-chain', 'Adverts make a breakfast cereal look much healthier than it really is. How might this stop consumers maximising their benefit?',
      'They overestimate its benefit, so they buy it instead of a better choice', ['They underestimate its price, so the firms that sell it make less profit', 'They stop buying cereal, so they get no benefit from it', 'They copy their friends, who never see the adverts'],
      'Adverts show only the good points, so consumers lack full information and miscalculate the benefit. They then spend money on the cereal rather than something that would give more benefit.'),
    mc('develop-chain', 'Why does a hard-to-break habit mean a consumer may not maximise their benefit?',
      'They keep buying even when their money would give more benefit elsewhere', ['They always switch to the cheapest product available in the shops near them', 'They are maximising their profit instead of their benefit', 'Habits only affect what firms buy, not consumers'],
      'A habit makes people repeat a purchase without weighing it up. Their limited income goes on the habit even when another use would give more satisfaction.'),
    mc('develop-chain', 'Why might copying others lead a consumer to a poorer choice?',
      'The product suits the group’s tastes, not the buyer’s own needs', ['Products bought by groups of friends are always cheaper than other products', 'Copying others always gives full information', 'Groups only buy products that are good value'],
      'When people buy something to fit in, the choice is driven by others’ tastes. It may give the buyer less benefit than the product they would have chosen for themselves.'),
    mc('identify-reason', 'A city raises parking charges by 10%, yet almost all daily drivers keep driving into the centre rather than taking a much cheaper bus. Which reason best explains this?',
      'Driving is a habit that is hard to give up', ['Drivers copy bus users in their street', 'Drivers aim to maximise their profit', 'Drivers have calculated that buses are faster'],
      'A small price rise has little effect when behaviour is driven by routine. The drivers stick to a habit even though the bus would cost them less.'),
    mc('evaluation', 'Which piece of evidence best suggests that a habit, rather than the price, is driving people’s purchases of a product?',
      'Sales hardly fall after a big price rise and buyers say they buy without thinking', ['Sales rise sharply when the product is put on special offer', 'Buyers say they carefully compared the prices of several brands before choosing one', 'Sales fall when a cheaper version arrives in the shops'],
      'If buyers keep buying despite a big price rise, and say they do it automatically, routine rather than price is in control. The other options show people responding to price or comparing carefully.'),
    mc('evaluation', 'Which choice is <b>most</b> consistent with a consumer maximising their benefit?',
      'Comparing three laptops and buying the one that best meets her needs', ['Buying the same laptop as her friends so that she fits in with the group', 'Buying a laptop on impulse after one advert', 'Replacing her laptop each year out of habit'],
      'Comparing options against her own needs is how a consumer gets the most benefit from limited income. Copying, impulse after advertising and habit are the reasons consumers fall short.'),
    { skill: 'develop-chain', gen: function () {
      var item = pick([['bottle of fizzy water', 'bottles of fizzy water'], ['pastry', 'pastries'], ['takeaway tea', 'takeaway teas'], ['bag of crisps', 'bags of crisps']]);
      var p = pick([1.5, 2, 2.5, 3, 3.5, 4]), d = rint(3, 6), wk = 52;
      var tot = R.roundDp(p * d * wk, 2);
      return N('Out of habit, Sana buys a ' + item[0] + ' for $' + p.toFixed(2) + ' on ' + d + ' days every week, although she says she does not really enjoy it. How much does this habit cost her over 52 weeks? Give your answer in $.',
        tot, '$',
        '$' + p.toFixed(2) + ' × ' + d + ' × 52 = ' + money(tot) + '. This money could have bought something that gave her more benefit, which is why a habit can stop a consumer maximising benefit.',
        null, num(tot));
    } },
    mu('identify-reason', 'Which of these are examples of consumers <b>copying others’ behaviour</b>? Select all that apply.',
      ['Buying a jacket because a popular online star wears it', 'Joining a costly club because all your neighbours belong to it'],
      ['Buying the same breakfast every day for ten years', 'Buying a large pack of food that goes off before it is eaten'],
      'Copying means choosing what others do to fit in. The same breakfast every day is a habit, and the wasted pack is a mistake in calculating benefit.')
  ] };

  // =====================================================================
  // ECO-T12-17 Demand for labour: what makes firms hire
  // =====================================================================
  B['ECO-T12-17'] = { title: 'Demand for labour: what makes firms hire', items: [
    mc('definition', 'Which is the best definition of the <b>demand for labour</b>?',
      'The number of workers firms are willing and able to employ at each wage', ['The number of people who are willing and able to work at each wage rate offered', 'The total number of people of working age in a country', 'The wage that workers ask for when they apply for a job'],
      'Demand for labour comes from firms (employers). People offering to work make up the supply of labour, not the demand.'),
    mc('definition', 'Which of these is an example of <b>derived demand</b>?',
      'A bakery’s demand for bakers to make bread', ['A family’s demand for bread to eat at home', 'A cyclist’s demand for a helmet to ride safely', 'A shopper’s demand for a winter coat to wear'],
      'Derived demand is a producer wanting a factor, such as labour, to make goods. The bakery wants bakers only because customers want bread.'),
    mc('definition', 'Why is the demand for labour called a <b>derived demand</b>?',
      'Firms want workers because consumers want the goods the workers make', ['Workers want jobs because they need to earn an income to buy the goods they want', 'Consumers want goods because workers have made them', 'The government decides how many workers each firm needs'],
      'Firms do not want workers for their own sake: the demand comes from (is derived from) consumers’ demand for the final product.'),
    mc('definition', 'A delivery firm’s demand for van drivers depends on how many parcels customers order. This is an example of:',
      'Derived demand', ['Supply of labour', 'Excess demand', 'Productivity'],
      'The demand for drivers comes from the demand for parcel deliveries, so it is a derived demand.'),
    mu('definition', 'Which are factors in the specification that affect the <b>demand for labour</b>? Select all that apply.',
      ['Demand for the final product', 'Availability of substitutes such as machines', 'Productivity of the workforce'],
      ['The number of people of working age', 'Workers’ wish to have more leisure time'],
      'Demand for labour depends on demand for the product, substitutes such as machines, and productivity. Population and leisure preferences affect the supply of labour.'),
    mc('derived-demand', 'Demand for home solar panels rises sharply. What is the most likely effect on the demand for solar panel installers?',
      'It rises, because firms need more installers to meet the extra sales', ['It falls, because installers’ wages are likely to rise', 'It is unchanged, because only the demand for the panels themselves has changed', 'It falls, because households will fit the panels themselves'],
      'Installers are a derived demand: more panels sold means more installation jobs, so firms want to employ more installers.'),
    mc('derived-demand', 'Fewer people buy printed newspapers as they switch to reading news online. What is the most likely effect on the demand for printing press operators?',
      'It falls, because less printing work is needed', ['It rises, because online news needs printing too', 'It is unchanged, because operators are skilled', 'It rises, because wages for operators will fall'],
      'Demand for press operators is derived from demand for printed papers. Falling sales mean less printing, so firms need fewer operators.'),
    mc('derived-demand', 'More tourists visit an island, so its hotels sell more rooms. What is the next link in the chain?',
      'Hotels want to employ more cleaners and receptionists', ['More people on the island want to work in the hotels as staff', 'Hotel wages must fall to attract tourists', 'Hotels need fewer staff for each room sold'],
      'Hotels need staff to serve the extra guests, so their demand for labour rises. More people wanting hotel jobs would be a change in supply, not demand.'),
    { skill: 'derived-demand', gen: function () {
      var g = pick([['garden sheds', 'shed'], ['wooden boats', 'boat'], ['leather bags', 'bag'], ['canvas tents', 'tent']]);
      var per = pick([4, 5, 6, 8, 10]), w = rint(12, 30), out = per * w, rise = pick([10, 20, 25, 50]);
      var newOut = out * (100 + rise) / 100;
      if (newOut % per !== 0) { rise = 50; w = 2 * Math.round(w / 2); out = per * w; newOut = out * 1.5; }
      var newW = newOut / per;
      return N('A workshop makes ' + num(out) + ' ' + g[0] + ' a month. Each worker makes ' + per + ' a month. Demand for its ' + g[0] + ' rises by ' + rise + '% and output per worker does not change. How many <b>extra</b> workers does the workshop need?',
        newW - w, '',
        'Workers now = ' + num(out) + ' ÷ ' + per + ' = ' + w + '. New output = ' + num(out) + ' × ' + (100 + rise) / 100 + ' = ' + num(newOut) + ', needing ' + num(newOut) + ' ÷ ' + per + ' = ' + newW + ' workers. That is ' + (newW - w) + ' extra: more demand for the product means more demand for labour.');
    } },
    mc('substitutes', 'Self-service checkouts become cheaper and more reliable. What is the most likely effect on the demand for checkout operators in supermarkets?',
      'It falls, as machines replace some operators', ['It rises, as more checkouts need more staff', 'It is unchanged, as machines and staff do different jobs', 'It rises, as operators become more productive'],
      'Machines are a substitute for labour. If they do the job more cheaply, supermarkets switch to them and want fewer operators.'),
    { skill: 'substitutes', gen: function () {
      var k = rint(3, 6), wage = rint(22, 32) * 1000, labour = k * wage;
      var cheaper = Math.random() < 0.5;
      var machine = cheaper ? labour - rint(10, 30) * 1000 : labour + rint(10, 30) * 1000;
      var right = cheaper ? 'Replace the packers, as the machine is cheaper, so labour demand falls' : 'Keep the packers, as they are cheaper, so labour demand is unchanged';
      var other = cheaper ? 'Keep the packers, as they are cheaper, so labour demand is unchanged' : 'Replace the packers, as the machine is cheaper, so labour demand falls';
      return Q('A packing machine can do the work of ' + k + ' packers. Each packer costs the firm ' + money(wage) + ' a year. The machine costs ' + money(machine) + ' a year to lease and run. Looking only at cost, what is the firm most likely to do?',
        right, [other, 'Hire more packers, as machines always create more jobs than they replace', 'Replace the packers whatever the cost, as machines never break down'],
        k + ' packers cost ' + k + ' × ' + money(wage) + ' = ' + money(labour) + ' a year, against ' + money(machine) + ' for the machine. ' + (cheaper ? 'The machine is cheaper, so it is a substitute that reduces the demand for packers.' : 'Labour is cheaper, so the firm has no cost reason to switch to the machine.'));
    } },
    mc('substitutes', 'Which point best <b>challenges</b> the claim that robots will reduce the demand for labour at a large warehouse?',
      'Staff are needed to program, maintain and repair the robots', ['Robots can work 24 hours a day, every day, without needing any breaks', 'Robots make fewer mistakes when picking orders', 'Robots get cheaper to buy each year'],
      'The other three points support the claim. Machines also create jobs: people must build, program and repair them, so demand for some skilled labour can rise.'),
    mc('substitutes', 'On a toll road, electronic tolling is replacing payment at booths. Which workers face the biggest fall in demand for their labour?',
      'Toll booth cashiers', ['Engineers who fix the road surface', 'Police officers who patrol the road', 'Staff who repair the tolling cameras'],
      'Electronic tolling is a direct substitute for cashiers taking payment. The other jobs are still needed, and camera repair staff may be in more demand.'),
    mc('productivity', 'Training raises the output of each worker at a tyre factory. Why might this <b>increase</b> the demand for these workers?',
      'Each worker now adds more output, so each is worth more to the firm', ['Workers will ask for lower wages after training', 'Consumers will buy fewer tyres from the factory', 'The firm will need fewer workers to make each tyre, so it hires more'],
      'Higher productivity means each worker produces more for the same wage, so labour is better value and the firm may want more workers, especially if demand for tyres is growing.'),
    mc('productivity', 'Output per worker at a factory doubles, but demand for the factory’s product does not change. What is the most likely effect on the number of workers the factory needs?',
      'It falls, because the same output can be made by fewer workers', ['It doubles, because each worker is more valuable', 'It rises, because demand for the product has risen', 'It is unchanged, because productivity has no effect on labour demand'],
      'If each worker makes twice as much and sales do not rise, the firm can make the same output with about half the workers. Higher productivity does not always mean more jobs.'),
    { skill: 'productivity', gen: function () {
      var a = pick([20, 24, 25, 30, 40]), b = a + pick([5, 10, 20]);
      // daily output divisible by both rates
      var L = a * b / gcd(a, b), q = L * rint(2, 5);
      var w1 = q / a, w2 = q / b;
      return N('A bottling plant must fill ' + num(q) + ' crates a day. Each worker fills ' + a + ' crates a day. New equipment raises this to ' + b + ' crates a day per worker, and the plant still needs only ' + num(q) + ' crates. How many <b>fewer</b> workers does it need each day?',
        w1 - w2, '',
        'Before: ' + num(q) + ' ÷ ' + a + ' = ' + w1 + ' workers. After: ' + num(q) + ' ÷ ' + b + ' = ' + w2 + ' workers. It needs ' + (w1 - w2) + ' fewer, because higher productivity lets fewer workers make the same output.');
    } },
    { skill: 'productivity', gen: function () {
      var u = rint(15, 40), p = pick([3, 4, 5, 6, 8]), wage = rint(40, 90);
      var rev = u * p, worth = rev > wage;
      if (!worth) { wage = rev - rint(5, 20); worth = true; }
      return N('A juice bar is thinking of hiring one more worker. The extra worker would make ' + u + ' extra drinks a day, each sold for $' + p + '. The daily wage is $' + wage + '. How much extra revenue a day would the worker bring in? Give your answer in $.',
        rev, '$',
        'Extra revenue = ' + u + ' × $' + p + ' = ' + money(rev) + ', which is more than the $' + wage + ' wage. The more productive a worker is, the more they add to revenue and the more firms want to hire.',
        null, num(rev));
    } },
    mc('wage-rate', 'The wage rate for bus drivers rises and nothing else changes. On a diagram of the demand for bus drivers, this is shown by:',
      'A movement up along the demand curve to fewer drivers demanded', ['A shift of the demand curve to the right', 'A shift of the demand curve to the left', 'A movement down along the demand curve to more drivers demanded'],
      'A change in the wage is a change in the price of labour, so it causes a movement along the demand curve. At a higher wage, firms want fewer drivers.'),
    mc('wage-rate', 'Which change would cause a <b>movement along</b> the demand for labour curve rather than a shift?',
      'A rise in the wage rate', ['A rise in demand for the product', 'Cheaper machines that do the job', 'A rise in workers’ productivity'],
      'The wage rate is on the axis of the diagram, so a change in it moves along the curve. Product demand, machines and productivity are other factors that shift the curve.'),
    mu('derived-demand', 'Which events would <b>increase</b> the demand for nurses? Select all that apply.',
      ['An ageing population needs more hospital care', 'The government pays for new hospital wards to open'],
      ['More young people choose to train as nurses', 'Cheap robots can now do most nursing tasks'],
      'More hospital care needed means hospitals want more nurses (derived demand). More people training changes the supply of nurses, and robots are a substitute that would reduce demand.'),
    mc('definition', 'Which change would alter the <b>supply</b> of labour rather than the demand for labour?',
      'More young people train to become electricians', ['More homes are built, so more wiring is needed', 'Machines that do electrical work become cheaper', 'Electricians become more productive with new tools'],
      'Training more people increases the number willing and able to work as electricians: that is supply. The other three change how many electricians firms want.'),
    mc('evaluation', 'Claim: “A rise in demand for a product always raises the demand for the workers who make it.” Which is the best counter-argument?',
      'The firm might meet extra demand with more machines instead', ['More sales mean the firm needs more workers to make the extra output', 'Derived demand links products to labour', 'Firms hire workers to make products'],
      'The other options support the claim. If machines are cheap or productivity rises, a firm can produce more without hiring many more workers, so the link is not automatic.'),
    mc('evaluation', 'A firm planned to replace its data-entry clerks with an automated system. Then, with wages unchanged, output per hour of the clerks rises by 20%, making them cheaper per form than the system, and the number of forms keeps growing. What is the likely effect on demand for these clerks?',
      'It is likely to rise, as clerks are now better value than the system', ['It is likely to fall, as the automated system is a substitute for clerks', 'It is unchanged, as wages have not changed', 'It falls, as higher productivity always means fewer jobs'],
      'Productivity and substitutes work together. If clerks now process forms more cheaply than the system, the firm has less reason to automate, and with growing work it may hire more clerks.')
  ] };
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }

  // =====================================================================
  // ECO-T12-20 Trade unions: how they affect pay and jobs
  // =====================================================================
  B['ECO-T12-20'] = { title: 'Trade unions: how they affect pay and jobs', items: [
    mc('definition', 'Which is the best definition of a <b>trade union</b>?',
      'An organisation of workers that protects its members’ interests', ['An organisation of employers that agrees prices and wages with each other', 'A government body that sets the minimum wage each year', 'A group of consumers that campaigns for lower prices'],
      'A trade union is an organisation for employees (1) that aims to protect and improve the interests of its members (1).'),
    mc('definition', 'Who are the members of a trade union?',
      'Workers (employees)', ['Employers', 'Consumers', 'Government ministers'],
      'Unions are organisations of workers. They are independent of employers and of the government.'),
    mc('aims', 'Which is a main aim of a trade union?',
      'Better working conditions for its members', ['Higher dividends for the firm’s shareholders', 'Lower wage costs for employers', 'Lower prices for the firm’s customers'],
      'Unions exist to protect workers: better pay, conditions and job security. Shareholder returns, lower wage costs and lower prices are not their aims.'),
    mc('aims', 'Which outcome is an improvement in working <b>conditions</b> rather than in pay?',
      'Better safety equipment and regular rest breaks', ['A 4% rise in hourly pay', 'A one-off bonus of $500 for every member of staff', 'A higher rate of pay for overtime'],
      'Conditions cover hours, safety, breaks and the working environment. The other three are all changes in pay.'),
    mc('aims', 'Which is a service a union gives to an <b>individual</b> member?',
      'Legal advice and support in a dispute with the employer', ['Paying the member’s income tax for them', 'Setting the prices of the employer’s products in its shops', 'Guaranteeing the member a job for life'],
      'Unions represent and advise individual members, for example at a disciplinary hearing or in a legal dispute. They cannot pay taxes, set prices or guarantee jobs.'),
    mu('aims', 'Which are activities that trade unions carry out? Select all that apply.',
      ['Negotiating pay with employers', 'Representing a member at a disciplinary hearing', 'Campaigning for stronger health and safety rules'],
      ['Setting the prices of the firm’s products', 'Collecting taxes for the government'],
      'Unions bargain, represent members and lobby for better laws. Setting prices is the firm’s decision and collecting tax is the government’s.'),
    mc('bargaining', 'What is meant by <b>collective bargaining</b>?',
      'A union negotiating pay and conditions for all its members', ['Each worker negotiating their own pay and hours alone with a manager', 'The government setting all wages by law', 'Employers agreeing prices with each other'],
      'In collective bargaining the union negotiates with the employer on behalf of all members at once, rather than each worker bargaining alone.'),
    mc('bargaining', 'Why does collective bargaining give workers more power than bargaining alone?',
      'The employer could lose many workers at once if talks fail', ['The employer must by law accept any pay claim that a union makes', 'Each worker can then set their own wage rate', 'The government pays any pay rise the union wins'],
      'One worker can easily be replaced. If talks with the whole workforce fail, the firm could lose its staff at once (for example through a strike), so it is under more pressure to agree.'),
    mc('bargaining', 'Which is an example of <b>industrial action</b>?',
      'Members refuse to work overtime until the pay offer improves', ['The union gives a member free legal advice', 'The union holds an election for a new leader', 'The union sends all of its members a monthly newsletter by email'],
      'Industrial action means workers withdraw some or all of their work to pressure the employer, for example an overtime ban or a strike.'),
    mc('bargaining', 'Apart from bargaining with employers, how else can a union try to improve conditions for workers?',
      'Lobbying the government for laws such as stronger safety rules', ['Buying shares so it can run the firm itself', 'Lowering the prices the firm charges customers', 'Setting the interest rate that firms must pay on their bank loans'],
      'Unions can lobby (put pressure on) the government to pass laws that protect workers, such as health and safety or working-hours rules.'),
    { skill: 'pay-calc', gen: function () {
      var w = pick([10, 11, 12, 13, 14, 15, 16, 18, 20]), r = pick([4, 5, 6, 7.5, 8, 10]);
      var nw = R.roundDp(w * (1 + r / 100), 2);
      return N('After talks with the union, a bus company agrees a ' + r + '% pay rise for its drivers. A driver earned $' + w.toFixed(2) + ' an hour. What is the new hourly wage? Give your answer in $ to two decimal places.',
        nw, '$',
        'Rise = ' + r + '/100 × $' + w.toFixed(2) + ' = $' + R.roundDp(w * r / 100, 2).toFixed(2) + '. New wage = $' + w.toFixed(2) + ' + $' + R.roundDp(w * r / 100, 2).toFixed(2) + ' = $' + nw.toFixed(2) + ' an hour.',
        0.005, nw.toFixed(2));
    } },
    { skill: 'pay-calc', gen: function () {
      var n = rint(12, 60) * 10, s = rint(20, 36) * 1000, r = pick([2, 3, 4, 5]);
      var inc = n * s * r / 100;
      return N('A union wins a ' + r + '% pay rise for all ' + num(n) + ' warehouse staff at a parcel firm. Each earns ' + money(s) + ' a year. By how much does the firm’s yearly wage bill rise? Give your answer in $.',
        inc, '$',
        'Wage bill = ' + num(n) + ' × ' + money(s) + ' = ' + money(n * s) + '. Rise = ' + r + '% × ' + money(n * s) + ' = ' + money(inc) + '. This extra cost is why higher pay can lead firms to raise prices or cut jobs.',
        null, num(inc));
    } },
    { skill: 'union-power', gen: function () {
      var staff = rint(2, 8) * 100, pct = pick([15, 20, 25, 30, 40, 60, 65, 70, 75, 80]);
      var mem = staff * pct / 100;
      return N('A hotel group employs ' + num(staff) + ' staff, and ' + num(mem) + ' of them are members of the hospitality union. What percentage of the staff are union members?',
        pct, '%',
        num(mem) + ' ÷ ' + num(staff) + ' × 100 = ' + pct + '%. ' + (pct >= 50 ? 'With most staff in the union, a strike would hit the firm hard, so the union has strong bargaining power.' : 'With a minority of staff in the union, the firm could keep running during a strike, so the union’s bargaining power is weaker.'));
    } },
    mc('union-power', 'In which situation is a union most likely to have the power to win higher pay?',
      'Most staff are members and they would be hard to replace', ['Few staff are members and many people want their jobs', 'The firm could easily do the job with machines instead', 'The firm cannot raise prices without losing its customers'],
      'Union power is greatest when membership is high and workers are hard to replace, because a strike would then stop the firm working. Easy substitutes or no room to raise prices weaken the union.'),
    mc('union-power', 'Union membership at a factory falls from 70% to 20% of the workforce. What is the likely effect on the union’s ability to raise pay?',
      'It weakens, as the firm could keep working during a strike', ['It strengthens, as the remaining members are more loyal', 'It is unchanged, as union power does not depend on members', 'It strengthens, as the firm must now negotiate with each worker'],
      'With only a fifth of staff in the union, a strike would not stop production, so the employer is under less pressure to agree to a pay claim.'),
    mc('union-power', 'A union’s power to raise pay without job losses is greatest when the employer can:',
      'Pass higher wage costs on to customers without losing many sales', ['Easily replace workers with cheaper machines', 'Hire non-union workers quickly and cheaply at much lower wage rates', 'Move production abroad at little cost'],
      'If the firm can raise prices without losing sales, it can afford higher wages without cutting jobs. Machines, replacement workers or moving abroad all weaken the union.'),
    mc('effects', 'A union wins a 9% pay rise for staff at a chain of pharmacies. What is the most likely effect on the chain?',
      'Its labour costs rise, so it may raise prices or accept lower profit', ['Its labour costs fall, so it can cut prices', 'Its labour costs are unchanged because pay is set by the union, not the firm', 'Its profit rises because staff are paid more'],
      'Higher wages raise the firm’s costs. It must either pass them on as higher prices, accept lower profit, or find savings elsewhere, such as fewer staff.'),
    mc('effects', 'Higher wages won by a union may <b>reduce</b> employment because:',
      'Firms want fewer workers at a higher wage, or switch to machines', ['Workers want to work fewer hours when pay rises', 'The government taxes firms that pay higher wages', 'Higher pay always makes workers less productive at their jobs than before'],
      'At a higher wage rate firms demand fewer workers (a movement up the demand for labour curve), and machines become relatively cheaper, so some jobs may be lost.'),
    mu('effects', 'Which are possible <b>negative</b> effects of trade union activity? Select all that apply.',
      ['Fewer jobs if firms cut costs after a pay rise', 'Higher prices for customers', 'Disruption to services during strikes'],
      ['Lower wages for union members', 'Worse health and safety at work'],
      'Higher pay raises firms’ costs, which can mean fewer jobs or higher prices, and strikes disrupt services. Unions aim to raise pay and improve safety, not cut them.'),
    mc('effects', 'Which is a likely cost of a strike for the <b>employer</b>?',
      'Lost output and sales during the strike', ['More customers as rivals close down', 'Higher productivity during the strike', 'A permanent fall in labour costs per unit'],
      'While workers are on strike the firm cannot produce, so it loses output, sales and possibly customers to rivals.'),
    mc('effects', 'Which is a likely cost of a strike for the <b>union members</b> taking part?',
      'They usually lose pay for the days they are on strike', ['They are paid double by the employer for the days they are on strike', 'Their working conditions automatically get worse', 'They must pay the employer’s lost profit'],
      'Workers on strike are usually not paid by the employer, so a strike costs members income even if it later wins a pay rise.'),
    { skill: 'evaluation', gen: function () {
      var pay = pick([3, 4, 5, 6]), prod = pick([2, 8, 10, 12]);
      if (prod === pay) prod = pay + 5;
      var falls = prod > pay;
      return Q('A union agrees new working methods at a car parts maker. Output per worker rises by ' + prod + '% and, in return, pay rises by ' + pay + '%. What happens to the labour cost of each part made?',
        falls ? 'It falls, because output per worker rises by more than pay' : 'It rises, because pay rises by more than output per worker',
        [falls ? 'It rises, because pay rises by more than output per worker' : 'It falls, because output per worker rises by more than pay', 'It is unchanged, because pay and output both rise', 'It falls, because the workers are paid less'],
        'Labour cost per part depends on pay compared with output per worker. Pay up ' + pay + '% and output up ' + prod + '%: ' + (falls ? 'each worker makes more parts for only a little more pay, so cost per part falls and jobs need not be lost.' : 'pay rises faster than output, so cost per part rises and the firm may raise prices or cut jobs.'));
    } },
    mc('evaluation', 'Claim: “Trade unions always make their members better off.” Which is the best counter-argument?',
      'Higher pay may lead the firm to cut jobs, so some members lose work', ['Unions negotiate higher pay and better conditions for all their members', 'Unions campaign for safer working conditions', 'Members get legal advice from their union'],
      'The other options support the claim. A real counter-argument shows the cost: higher wages raise costs, so the firm may employ fewer workers or automate.'),
    mc('evaluation', 'A union wins higher pay for staff at a café chain, and the chain raises its prices. Which group is most likely to <b>lose</b>?',
      'Customers, who pay higher prices', ['Members who keep their jobs', 'The union’s leaders', 'Rival cafés that keep prices low'],
      'Members who keep their jobs gain higher pay, but the extra cost is passed on to customers through higher prices.')
  ] };

  // =====================================================================
  // ECO-T22-10 The World Trade Organization: what it does
  // =====================================================================
  B['ECO-T22-10'] = { title: 'The World Trade Organization: what it does', items: [
    mc('role-identify', 'Which of these is one of the jobs the World Trade Organization (WTO) does?',
      'Holding trade negotiations between member countries', ['Lending money to countries with debt problems', 'Fixing the exchange rates of all its member countries’ currencies', 'Paying subsidies to exporters in poorer countries'],
      'The WTO brings members together to negotiate cuts in trade barriers. It does not lend money, fix exchange rates or pay subsidies.'),
    mc('role-identify', 'What is the main purpose of the WTO?',
      'To promote freer trade between member countries', ['To protect each member’s domestic industries from cheaper imports', 'To control the money supply of its members', 'To give emergency aid after natural disasters'],
      'The WTO exists to promote free trade by reducing barriers and making trade rules clear. Protecting industries from imports is the opposite.'),
    mc('role-identify', 'Which is <b>not</b> a role of the WTO?',
      'Giving loans to developing countries', ['Settling trade disputes between members', 'Monitoring whether members follow trade rules', 'Encouraging members to cut tariffs and quotas'],
      'The WTO does not lend money. Its roles are about trade: negotiations, rules, monitoring and settling disputes.'),
    mu('role-identify', 'Which are roles of the WTO? Select all that apply.',
      ['Settling trade disputes between members', 'Setting rules for trade and checking they are followed', 'Hosting talks where members agree to cut tariffs'],
      ['Regulating multinational companies', 'Setting interest rates for member countries'],
      'The WTO negotiates, sets and monitors trade rules, and settles disputes. It does not regulate multinationals or set interest rates.'),
    mu('role-identify', 'Which of these are <b>not</b> things the WTO does? Select all that apply.',
      ['Cancelling the debts of poor countries', 'Keeping currency values steady', 'Giving grants to exporting firms'],
      ['Ruling on trade disputes', 'Hosting talks to cut tariffs'],
      'The WTO deals with trade rules and barriers. Debt relief, exchange rates and grants (subsidies) to exporters are not its job; subsidies would actually increase protection.'),
    mc('role-identify', 'A student says the WTO “stabilises exchange rates so that trade is easier”. Is the student correct?',
      'No: the WTO deals with trade rules and barriers, not currency values', ['Yes: the WTO sets the value of every member’s currency', 'Yes: keeping currencies stable is the WTO’s main purpose in world trade', 'No: the WTO only deals with trade inside one country'],
      'Exchange rates are not a WTO role. The WTO works on international trade: negotiations, rules and disputes between members.'),
    mc('how-it-works', 'Country P complains that Country Q has placed an unfair ban on P’s steel. How does the WTO deal with this?',
      'It acts as a go-between and rules on whether the ban breaks trade rules', ['It lends Country P money to cover the steel sales it has lost to the ban', 'It buys the steel that Country Q has refused to import', 'It sets a new exchange rate between the two countries'],
      'Settling disputes is a key WTO role: it mediates between the members and, if needed, rules on whether the barrier breaks the agreed rules.'),
    mc('how-it-works', 'Which answer <b>both</b> names a WTO role <b>and</b> develops how it is carried out?',
      'It settles trade disputes by acting as a mediator between the countries', ['It settles trade disputes.', 'It lends money to member countries so that they can trade more with each other', 'It raises tariffs on imports to protect its members’ industries'],
      'A good description names the role (settling disputes) and adds how it is done (mediating between the countries). The short answer only names the role, and the others are not WTO roles.'),
    mc('how-it-works', 'During WTO trade negotiations, what do member countries usually agree to do?',
      'Cut tariffs, quotas and other barriers on each other’s goods', ['Raise tariffs on each other’s goods to protect their own jobs', 'Fix the prices of all goods traded between the members', 'Lend each other money so that they can pay for imports'],
      'Trade negotiations are where members agree to lower barriers such as tariffs and quotas. Lower barriers make trade between members cheaper and easier.'),
    mc('how-it-works', 'Why does the WTO monitor its members’ trade policies?',
      'To check members keep to the trade rules they agreed', ['To decide which goods each member is allowed to produce', 'To collect tariff revenue for its own budget', 'To set the prices of goods traded between members'],
      'Members agree rules, such as limits on their tariffs. Monitoring checks they keep to them, which gives traders confidence and supports trade.'),
    mc('how-it-works', 'Why are clear international trade rules helpful to exporting firms?',
      'Firms know what barriers they will face, so trading abroad is less risky', ['Firms no longer need to pay any costs when exporting', 'Firms can sell abroad at any price they choose without facing competition', 'Firms are given a guaranteed share of foreign markets'],
      'When the rules are clear and stable, exporters can plan, because a sudden new barrier is less likely. Lower risk encourages more trade.'),
    mc('effect-on-trade', 'WTO talks lead members to cut tariffs on electrical goods. What is the next link in the chain?',
      'Imported electrical goods become cheaper, so trade between members grows', ['Imported electrical goods become dearer, so trade between the members falls', 'Each country must produce all its own electrical goods', 'Exchange rates between the members become fixed'],
      'A tariff is a tax on imports. Cutting it lowers the price of imports, so consumers buy more of them and trade between members grows.'),
    mc('effect-on-trade', 'How might <b>consumers</b> gain when the WTO helps to reduce trade barriers?',
      'Lower prices and a wider choice of imported goods', ['Higher prices for imported goods', 'Fewer foreign brands in the shops', 'Guaranteed jobs in all firms that compete with imports'],
      'Lower barriers make imports cheaper and easier to bring in, so consumers get lower prices and more choice.'),
    mc('effect-on-trade', 'The WTO persuades a member to remove a quota on imported rice. What is the most likely effect on that country’s rice imports?',
      'They rise, as there is no longer a limit on the quantity', ['They fall, as the quota was helping importers bring in more rice', 'They are unchanged, as quotas do not affect trade', 'They stop, as domestic farmers take the market'],
      'A quota is a limit on the quantity of imports. Removing it lets importers bring in as much rice as consumers want to buy, so imports rise.'),
    mc('effect-on-trade', 'Which outcome would best show that the WTO is succeeding in its role?',
      'Average tariffs among members fall and world trade grows', ['Members introduce more quotas and tariffs on each other’s goods', 'Members pay larger subsidies to their exporters', 'Members fix their exchange rates against each other'],
      'Success for the WTO means freer trade: lower barriers and more trade. More quotas or subsidies would mean more protection.'),
    { skill: 'effect-on-trade', gen: function () {
      var c = shuf(COUNTRIES), good = pick(['solar panels', 'bicycles', 'washing machines', 'laptops']);
      var p = pick([200, 250, 300, 400, 500, 600, 800]), t1 = pick([20, 25, 30]), t2 = pick([5, 10, 15]);
      var cut = p * (t1 - t2) / 100;
      return N('After WTO talks, ' + c[0] + ' cuts its tariff on imported ' + good + ' from ' + t1 + '% to ' + t2 + '%. One unit costs $' + p + ' to import before the tariff. By how much does the price of an imported unit, including the tariff, fall? Give your answer in $.',
        cut, '$',
        'Price with old tariff = $' + p + ' + ' + t1 + '% = ' + money(p * (100 + t1) / 100) + '. With new tariff = $' + p + ' + ' + t2 + '% = ' + money(p * (100 + t2) / 100) + '. The fall is ' + money(cut) + ', so imports become cheaper and trade grows.',
        null, num(cut));
    } },
    mc('dispute', 'Country A puts new tariffs on Country B’s cars, and Country B plans to retaliate with tariffs on A’s wheat. How can the WTO help to avoid a trade war?',
      'By hosting talks and ruling on the dispute so both can remove the tariffs', ['By adding its own tariffs to punish both countries', 'By lending Country B money to replace the car sales it has lost to Country A', 'By fixing a new price for cars and wheat'],
      'Settling disputes stops tit-for-tat tariffs from spreading. Through mediation or a ruling, both sides can be encouraged to remove the barriers, so trade continues.'),
    mc('dispute', 'Which body would a member country contact to complain that another member has broken international trade rules?',
      'The World Trade Organization', ['The International Monetary Fund', 'Its own central bank', 'The World Health Organization'],
      'Trade disputes between members are taken to the WTO, which settles them. The other bodies deal with money, interest rates and health.'),
    mc('dispute', 'How can the WTO’s dispute settlement help a <b>small</b> member country?',
      'It can win a ruling against a large country’s unfair barriers', ['It is given a larger import quota than the other, larger members', 'It is allowed to dump goods below cost', 'It receives loans to pay for its imports'],
      'Alone, a small country has little power to make a large country remove a barrier. The WTO’s rules apply to all members, so a ruling can protect the small country’s exports.'),
    mc('membership', 'Why does the WTO encourage more countries to join it?',
      'More countries then follow the rules on cutting trade barriers', ['More countries then pay larger subsidies to all of their own exporters', 'Members can then raise tariffs on non-members', 'The WTO can then lend money to more countries'],
      'Each new member agrees to WTO rules and to lower its barriers, so a bigger share of world trade becomes freer.'),
    mc('evaluation', 'Claim: “The WTO has ended protectionism.” Which is the best counter-argument?',
      'Members still use some tariffs and quotas, and disputes can take years', ['The WTO hosts regular talks at which members agree to cut their tariffs', 'Members agree to follow WTO trade rules', 'The WTO settles disputes between members'],
      'The other three support the claim. Protection still exists, and slow dispute rulings mean unfair barriers can stay in place for a long time.'),
    mc('evaluation', 'Which group in a member country is most likely to <b>lose</b> when the WTO helps to cut tariffs on imported shoes?',
      'Domestic shoe makers that face cheaper imports', ['Consumers who buy shoes', 'Shops that sell imported shoes', 'Firms that export shoes to customers in other countries'],
      'Freer trade brings cheaper imports, which helps consumers and importers but means more competition for domestic producers of the same good.')
  ] };

  // =====================================================================
  // ECO-T22-05 Why countries protect trade
  // =====================================================================
  var MOTIVES = ['To prevent dumping', 'To protect domestic employment', 'To protect an infant industry', 'To gain tariff revenue', 'To protect consumers from unsafe products', 'To reduce a current account deficit', 'Retaliation'];
  function motive(stem, k, why, wrongIdx) {
    var w = wrongIdx.map(function (i) { return MOTIVES[i]; });
    return mc('classify-motive', stem + ' Which reason for protection does this show?', MOTIVES[k], w, why);
  }
  B['ECO-T22-05'] = { title: 'Why countries protect trade: dumping, infant industries, jobs, safety', items: [
    mc('definitions', 'What is meant by <b>dumping</b>?',
      'Selling exports abroad at a price below the cost of production', ['Selling exports abroad at a lower price than the local firms there charge', 'Placing a tax on goods coming into a country', 'Setting a limit on the quantity of imports'],
      'Dumping has two parts: the goods are sold in another country (1) at a price below their cost of production (1). Just being cheaper than local firms is not dumping.'),
    mc('definitions', 'What is meant by <b>infant industries</b>?',
      'New industries that are not yet established enough to compete', ['Industries that make products such as clothes for babies and children', 'Old industries that are in long-term decline', 'Industries that are owned and run by the government'],
      'Infant industries are new (1) and not yet established (1). They have high costs because they have not yet grown big enough to gain economies of scale.'),
    mc('definitions', 'What is meant by <b>protection</b> (protectionism)?',
      'Government measures that restrict imports to shield domestic producers', ['Removing all barriers between countries so that trade is completely free', 'Firms insuring their factories against damage', 'Laws that stop firms exporting any goods at all'],
      'Protection means the government restricts imports, for example with tariffs, quotas or subsidies, to shield domestic producers or consumers. It reduces free trade.'),
    mc('definitions', 'A student defines dumping as “selling goods cheaply”. What is missing from this definition?',
      'That the goods are exported and sold below their cost of production', ['That the goods must be of low quality', 'That the goods are sold only to the government of the importing country', 'That the price includes a tariff'],
      'Cheap is not enough. Dumping means selling in another country at a price below the cost of making the goods.'),
    motive('Tests show that some imported electric heaters overheat and can start fires, so the government bans them.', 4,
      'The ban keeps out goods that could harm people, so the reason is to protect consumers from unsafe products.', [0, 1, 3]),
    motive('A country has bought far more goods from abroad than it has sold for several years, so the government limits some imports.', 5,
      'When imports are well above exports, the current account is in deficit. Cutting spending on imports narrows that gap.', [1, 4, 3]),
    motive('Country R puts a tariff on Country S’s olive oil. Country S responds by putting a tariff on Country R’s cars.', 6,
      'Country S is hitting back at Country R’s barrier with one of its own: this is retaliation.', [0, 1, 4]),
    motive('A government with few income taxpayers relies on a 12% charge on all imported goods to help pay for schools and roads.', 3,
      'A tariff is a tax on imports, and the money goes to the government. Here the main aim is to raise revenue.', [1, 2, 5]),
    motive('A new domestic electric-bus industry, set up three years ago, cannot yet match the low costs of large foreign makers. The government puts a temporary tariff on imported buses.', 2,
      'The industry is new and not yet established. Temporary protection gives it time to grow and gain economies of scale.', [0, 1, 3]),
    motive('Cheap imported shirts are taking sales from a region’s garment factories, which employ thousands of people. The government limits shirt imports.', 1,
      'The threat is factory closures and job losses in the region, so the aim is to protect domestic employment.', [0, 2, 4]),
    { skill: 'classify-motive', gen: function () {
      var c = shuf(COUNTRIES), g = pick([['tyres', 'tyre'], ['steel pipes', 'steel pipe'], ['ceramic tiles', 'box of ceramic tiles'], ['solar panels', 'solar panel']]);
      var cost = rint(30, 90), price = cost - rint(5, Math.floor(cost / 3)), local = cost + rint(5, 20);
      return Q('Firms in ' + c[0] + ' sell ' + g[0] + ' in ' + c[1] + ' for $' + price + ' per ' + g[1] + ', although it costs them $' + cost + ' to make each one. Firms in ' + c[1] + ' cannot make them for less than $' + local + '. Which reason might ' + c[1] + ' give for restricting these imports?',
        'To prevent dumping', ['To protect an infant industry', 'To protect consumers from unsafe products', 'Retaliation'],
        'Selling abroad at $' + price + ' when it costs $' + cost + ' to make is selling below the cost of production in another country: dumping. ' + c[1] + ' can restrict imports to stop this unfair competition.');
    } },
    { skill: 'definitions', gen: function () {
      var cost = rint(40, 80), below = Math.random() < 0.5;
      var price = below ? cost - rint(4, 12) : cost + rint(3, 10), home = price + rint(8, 20);
      var good = pick(['bag of cement', 'roll of wire', 'bag of fertiliser', 'sheet of glass']);
      return Q('An exporter sells a ' + good + ' abroad for $' + price + '. Its cost of production is $' + cost + ' and foreign producers charge $' + home + ' for the same product. Is the exporter dumping?',
        below ? 'Yes, because its export price is below its cost of production' : 'No, because its export price is above its cost of production',
        [below ? 'No, because its export price is above its cost of production' : 'Yes, because its export price is below its cost of production', 'Yes, because it charges less than the foreign producers do for the same product', 'No, because dumping only applies to imports'],
        'Dumping means selling exports below the cost of production. $' + price + (below ? ' is below' : ' is above') + ' the $' + cost + ' cost. Being cheaper than foreign rivals ($' + home + ') is not enough on its own to count as dumping.');
    } },
    mc('why-dump', 'Why might a firm sell its exports abroad below its cost of production?',
      'To drive foreign rivals out and gain market share', ['To raise the price of its goods in the foreign market', 'To pay more tax to the foreign government', 'To reduce the quantity it sells abroad'],
      'By selling below cost, the firm can undercut local producers. If they are forced out, the dumping firm wins a larger market share and may raise prices later.'),
    mc('why-dump', 'A country’s steel makers have huge unsold stocks after demand at home collapses. Why might they export the steel below cost?',
      'To get rid of surplus output that would otherwise go unsold', ['To make steel more expensive for buyers in their own country', 'To help foreign steel makers grow', 'To increase the stocks they are holding'],
      'Some revenue is better than none. Selling the surplus abroad, even below cost, clears stocks; this is one reason firms dump.'),
    mc('threat-chain', 'Why does protecting an infant industry help it to survive?',
      'It gives firms time to grow and gain economies of scale, so costs fall', ['It lets the firms charge any price they like forever without any competition', 'It makes imported goods cheaper for consumers', 'It removes the need for firms to become efficient'],
      'New firms have high costs because they are small. Protection shields them while they grow; as output rises, economies of scale lower their costs so they can compete.'),
    mc('threat-chain', 'Cheap imported footwear takes sales from domestic shoe factories. What is the next link in the chain that explains why the government might act?',
      'Domestic factories cut output, so workers lose their jobs', ['Domestic factories raise output, so they hire more workers to meet demand', 'Consumers pay higher prices for footwear', 'The current account deficit becomes smaller'],
      'Lower sales mean factories produce less and need fewer workers. Protecting jobs is a common reason for restricting imports.'),
    mc('threat-chain', 'If dumping forces all domestic producers out of a market, why might consumers lose in the long run?',
      'The foreign firm could raise prices once its rivals have gone', ['Prices must stay below cost forever', 'Consumers will have more firms to choose from', 'Domestic firms will quickly return to the market and cut prices even further'],
      'Below-cost prices help consumers only for a while. Once local rivals have closed, the dumping firm faces little competition and can push prices up.'),
    mc('threat-chain', 'Imported child car seats from one supplier are found to fail crash tests. Why might the government ban them?',
      'Unsafe seats could injure children, so banning them protects consumers', ['The ban raises tariff revenue for the government', 'The seats are being sold below cost', 'The ban mainly helps the country’s infant car-seat industry to grow quickly'],
      'The harm here is to consumers’ safety. Banning products that fail safety tests protects buyers from dangerous goods.'),
    mc('threat-chain', 'How can restricting imports help to reduce a current account deficit?',
      'Spending on imports falls, so the gap between imports and exports narrows', ['Exports become more expensive abroad, so fewer of them are sold to other countries', 'The government collects less tax on imports', 'Firms import more raw materials to export more'],
      'A current account deficit means imports are greater than exports. If fewer imports are bought, the gap gets smaller.'),
    { skill: 'threat-chain', gen: function () {
      var c = pick(COUNTRIES), ex = rint(30, 70), im = ex + rint(8, 25);
      return Q('In one year ' + c + ' exported goods worth $' + ex + 'bn and imported goods worth $' + im + 'bn. The government then places tariffs on a range of imports. Which reason for protection do these figures most support?',
        'To reduce a current account deficit', ['To protect an infant industry', 'To prevent dumping', 'To protect consumers from unsafe products'],
        'Imports ($' + im + 'bn) are greater than exports ($' + ex + 'bn), a trade deficit of $' + (im - ex) + 'bn, which adds to a current account deficit. Restricting imports aims to narrow it.');
    } },
    mu('classify-motive', 'Which are reasons for protection given in the specification? Select all that apply.',
      ['To prevent dumping', 'To protect infant industries', 'Retaliation'],
      ['To promote free trade', 'To make imported goods cheaper'],
      'Protection restricts imports, so it reduces free trade and makes imports dearer, not cheaper. Preventing dumping, protecting infant industries and retaliation are all listed reasons.'),
    mc('classify-motive', 'Which is <b>not</b> a reason why a country might restrict imports?',
      'To make imported goods cheaper for consumers', ['To protect domestic jobs', 'To stop goods being dumped below cost', 'To keep out unsafe products'],
      'Restricting imports makes them scarcer or dearer. Making imports cheaper would come from free trade, not protection.'),
    mc('evaluation', 'Claim: “Protecting an infant industry always helps the economy.” Which is the best counter-argument?',
      'Protected firms may never become efficient, and consumers pay more meanwhile', ['The industry gets time to grow and gain economies of scale before facing rivals', 'Jobs in the new industry are protected', 'The government collects tariff revenue'],
      'The other options support the claim. Without competition the industry may stay inefficient, and consumers pay higher prices while it is protected.'),
    mc('evaluation', 'Claim: “Tariffs on imported steel will protect jobs.” Which is the best counter-argument?',
      'Firms that use steel face higher costs and may cut jobs', ['Domestic steel makers will sell more steel to buyers at home', 'Imported steel becomes more expensive', 'The government gains tariff revenue'],
      'Protection can save jobs in steel-making but raises costs for car makers, builders and other users of steel, who may then cut jobs.'),
    mc('evaluation', 'Why might retaliation make both countries worse off?',
      'A trade war can develop, cutting exports for both', ['Retaliation always ends a dispute at once', 'Both countries gain more tariff revenue than they lose', 'Retaliation makes both countries’ imports cheaper'],
      'If each side keeps hitting back with new barriers, trade between them shrinks and exporters in both countries lose sales.')
  ] };

  // =====================================================================
  // ECO-CALC-19 Applying a percentage: interest, tax and tariffs
  // =====================================================================
  B['ECO-CALC-19'] = { title: 'Applying a percentage: interest, tax and tariffs', items: [
    { skill: 'interest', gen: function () {
      var c = pick(CURS), s = rint(10, 100) * 200, r = pick([1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]);
      if (s === 7000 && r === 3) s = 7400;   // avoid a past-paper figure
      var i = R.roundDp(s * r / 100, 2);
      return N('Aisha keeps ' + cur(c.s, s) + ' in a savings account that pays ' + r + '% interest a year. How much interest does she receive in one year? Give your answer in ' + c.n + '.',
        i, c.s, 'Interest = ' + r + '/100 × ' + cur(c.s, s) + ' = ' + cur(c.s, i) + '.', null, num(i));
    } },
    { skill: 'interest', gen: function () {
      var c = pick(CURS), s = rint(5, 60) * 500, r = pick([2, 3, 4, 5, 6]);
      if (s === 5000 && r === 2) s = 6500;   // avoid a past-paper figure
      var tot = s + s * r / 100;
      return N('A savings account holds ' + cur(c.s, s) + ' at the start of the year. The interest rate is ' + r + '% a year and nothing is added or taken out. How much money is in the account after one year, including the interest? Give your answer in ' + c.n + '.',
        tot, c.s, 'Interest = ' + r + '/100 × ' + cur(c.s, s) + ' = ' + cur(c.s, s * r / 100) + '. Total = ' + cur(c.s, s) + ' + ' + cur(c.s, s * r / 100) + ' = ' + cur(c.s, tot) + '.', null, num(tot));
    } },
    { skill: 'interest', gen: function () {
      var s = rint(4, 15) * 1000, r = pick([2, 3, 4, 5, 6]), i = s * r / 100;
      return Q('What is the interest earned in one year on $' + num(s) + ' of savings at an interest rate of ' + r + '% a year?',
        money(i), [money(s * r / 1000), money(s + i), money(s - i), money(s * r)],
        r + '/100 × $' + num(s) + ' = ' + money(i) + '. ' + money(s + i) + ' is the new total, not the interest, and ' + money(s * r / 1000) + ' comes from dividing by 1,000 instead of 100.');
    } },
    { skill: 'interest', gen: function () {
      var s = rint(10, 80) * 1000, r1 = pick([4, 4.5, 5, 5.5, 6]), r2 = r1 - pick([0.5, 1, 1.5, 2]);
      var d = R.roundDp(s * (r1 - r2) / 100, 2);
      return N('The central bank cuts interest rates, and Ben’s savings account rate falls from ' + r1 + '% to ' + r2 + '% a year. He has ' + money(s) + ' saved. How much <b>less</b> interest will he earn in a year? Give your answer in $.',
        d, '$', 'Before: ' + r1 + '% × ' + money(s) + ' = ' + money(s * r1 / 100, (s * r1 / 100) % 1 ? 2 : 0) + '. After: ' + r2 + '% × ' + money(s) + ' = ' + money(s * r2 / 100, (s * r2 / 100) % 1 ? 2 : 0) + '. Difference = ' + money(d, d % 1 ? 2 : 0) + '. Lower rates reduce the reward for saving.', null, num(d, d % 1 ? 2 : 0));
    } },
    { skill: 'interest', gen: function () {
      var c = pick(CURS), l = rint(4, 40) * 500, r = pick([4, 5, 6, 7, 8, 9, 10, 12]), i = l * r / 100;
      return N('A small business borrows ' + cur(c.s, l) + ' for one year at an interest rate of ' + r + '% a year. How much interest must it pay for the year? Give your answer in ' + c.n + '.',
        i, c.s, 'Interest on a loan = ' + r + '/100 × ' + cur(c.s, l) + ' = ' + cur(c.s, i) + '. This is the cost of borrowing.', null, num(i));
    } },
    { skill: 'interest', gen: function () {
      var l = rint(6, 50) * 1000, r = pick([5, 6, 7, 8, 9, 10]), tot = l + l * r / 100;
      return N('Dev takes out a loan of ' + money(l) + ' to buy a delivery van. The interest rate is ' + r + '% a year, and he repays the loan plus interest in one payment after one year. How much does he repay in total? Give your answer in $.',
        tot, '$', 'Interest = ' + r + '% × ' + money(l) + ' = ' + money(l * r / 100) + '. Total = ' + money(l) + ' + ' + money(l * r / 100) + ' = ' + money(tot) + '.', null, num(tot));
    } },
    { skill: 'interest', gen: function () {
      var s, rA, rB, fee, iA, iB, gross;
      do {
        s = rint(10, 40) * 1000; rA = pick([3, 4, 5]); rB = rA + pick([0.5, 1]); fee = rint(2, 12) * 10;
        iA = s * rA / 100; iB = s * rB / 100 - fee; gross = s * (rB - rA) / 100;
      } while (iA === iB || Math.abs(iA - iB) === fee || gross === fee || Math.abs(iA - iB) === gross);
      var bBetter = iB > iA, d = Math.abs(iA - iB);
      return Q('Priya has ' + money(s) + ' to save for one year. Account A pays ' + rA + '% a year. Account B pays ' + rB + '% a year but charges a fee of $' + fee + ' for the year. Which account leaves her better off, and by how much?',
        (bBetter ? 'Account B' : 'Account A') + ', by ' + money(d),
        [(bBetter ? 'Account A' : 'Account B') + ', by ' + money(d), 'Account B, by ' + money(gross), 'Account A, by $' + fee],
        'A: ' + rA + '% × ' + money(s) + ' = ' + money(iA) + '. B: ' + rB + '% × ' + money(s) + ' = ' + money(s * rB / 100) + ' minus the $' + fee + ' fee = ' + money(iB) + '. So Account ' + (bBetter ? 'B' : 'A') + ' gives ' + money(d) + ' more. Always compare the amounts after the fee.');
    } },
    { skill: 'tax', gen: function () {
      var c = pick(CURS), free = pick([10000, 12000, 12500, 15000]), g = free + rint(8, 40) * 1000, r = pick([10, 15, 20, 25]);
      var tax = (g - free) * r / 100, net = g - tax;
      return N('In ' + pick(COUNTRIES) + ', the first ' + cur(c.s, free) + ' of income is tax free and income tax of ' + r + '% is paid on everything above that. Jonas earns ' + cur(c.s, g) + ' a year. What is his <b>net pay</b>? Give your answer in ' + c.n + '.',
        net, c.s, 'Taxed income = ' + cur(c.s, g) + ' − ' + cur(c.s, free) + ' = ' + cur(c.s, g - free) + '. Tax = ' + r + '% × ' + cur(c.s, g - free) + ' = ' + cur(c.s, tax) + '. Net pay = ' + cur(c.s, g) + ' − ' + cur(c.s, tax) + ' = ' + cur(c.s, net) + '.', null, num(net));
    } },
    { skill: 'tax', gen: function () {
      var free = pick([8000, 10000, 11000, 12000]), g = free + rint(10, 50) * 1000, r = pick([10, 15, 20, 30]);
      var tax = (g - free) * r / 100;
      return N('A country charges no income tax on the first ' + money(free) + ' a person earns, and ' + r + '% on income above that. Rosa earns ' + money(g) + ' a year. How much <b>income tax</b> does she pay? Give your answer in $.',
        tax, '$', 'Only income above ' + money(free) + ' is taxed: ' + money(g) + ' − ' + money(free) + ' = ' + money(g - free) + '. Tax = ' + r + '% × ' + money(g - free) + ' = ' + money(tax) + '.', null, num(tax));
    } },
    { skill: 'tax', gen: function () {
      var free = pick([10000, 12000, 15000]), g = free + rint(10, 40) * 1000, r = 20;
      var tax = (g - free) * r / 100, net = g - tax;
      return Q('Income above ' + money(free) + ' is taxed at 20%; the first ' + money(free) + ' is tax free. What is the net pay of a worker earning ' + money(g) + ' a year?',
        money(net), [money(tax), money(g - g * r / 100), money(g), money(net - free)],
        'Tax = 20% × (' + money(g) + ' − ' + money(free) + ') = ' + money(tax) + '. Net pay = ' + money(g) + ' − ' + money(tax) + ' = ' + money(net) + '. Taxing the whole salary gives ' + money(g - g * r / 100) + ', which is wrong.');
    } },
    { skill: 'tax', gen: function () {
      var free = 12000, top = pick([40000, 45000, 50000]), g = top + rint(5, 30) * 1000;
      var tax = (top - free) * 0.2 + (g - top) * 0.4;
      return N('In ' + pick(COUNTRIES) + ', income up to ' + money(free) + ' is tax free. Income from ' + money(free) + ' to ' + money(top) + ' is taxed at 20%, and income above ' + money(top) + ' is taxed at 40%. Lara earns ' + money(g) + ' a year. How much income tax does she pay in total? Give your answer in $.',
        tax, '$', '20% × (' + money(top) + ' − ' + money(free) + ') = ' + money((top - free) * 0.2) + '. 40% × (' + money(g) + ' − ' + money(top) + ') = ' + money((g - top) * 0.4) + '. Total = ' + money(tax) + '.', null, num(tax));
    } },
    { skill: 'tax', gen: function () {
      var t = rint(20, 50) * 1000, r1 = pick([15, 20, 25]), r2 = r1 + pick([2, 3, 5]);
      var d = t * (r2 - r1) / 100;
      return N('The government raises the income tax rate from ' + r1 + '% to ' + r2 + '%. Omar has ' + money(t) + ' of taxable income (income that is taxed). By how much does his yearly net pay fall? Give your answer in $.',
        d, '$', 'Extra tax = (' + r2 + '% − ' + r1 + '%) × ' + money(t) + ' = ' + (r2 - r1) + '/100 × ' + money(t) + ' = ' + money(d) + ', so net pay falls by ' + money(d) + '.', null, num(d));
    } },
    { skill: 'tax', gen: function () {
      var p = rint(8, 60) * 10, r = pick([5, 10, 15, 20]), tot = p * (100 + r) / 100;
      return N('A shop prices a microwave at $' + p + ' before sales tax. A sales tax of ' + r + '% is added at the till. How much does a customer pay in total? Give your answer in $.',
        tot, '$', 'Tax = ' + r + '/100 × $' + p + ' = ' + money(p * r / 100) + '. Price paid = $' + p + ' + ' + money(p * r / 100) + ' = ' + money(tot) + '.', null, num(tot));
    } },
    { skill: 'tax', gen: function () {
      var prof = rint(20, 200) * 1000, r = pick([15, 20, 25, 30]), tax = prof * r / 100;
      return N('A firm makes a profit of ' + money(prof) + ' in a year. Corporation tax (a tax on firms’ profits) is ' + r + '%. How much profit is left <b>after</b> the tax is paid? Give your answer in $.',
        prof - tax, '$', 'Tax = ' + r + '% × ' + money(prof) + ' = ' + money(tax) + '. Profit after tax = ' + money(prof) + ' − ' + money(tax) + ' = ' + money(prof - tax) + '.', null, num(prof - tax));
    } },
    { skill: 'tariff', gen: function () {
      var c = pick(CURS), p = rint(10, 90) * 5, r = pick([4, 5, 8, 10, 12, 15, 20]), t = R.roundDp(p * r / 100, 2);
      return N('A country places a ' + r + '% tariff on imported jackets. A jacket costs ' + cur(c.s, p) + ' to import before the tariff. What is the <b>final selling price</b> after the tariff is added? Give your answer in ' + c.n + '.',
        R.roundDp(p + t, 2), c.s, 'Tariff = ' + r + '/100 × ' + cur(c.s, p) + ' = ' + cur(c.s, t, t % 1 ? 2 : 0) + '. Final price = ' + cur(c.s, p) + ' + ' + cur(c.s, t, t % 1 ? 2 : 0) + ' = ' + cur(c.s, p + t, (p + t) % 1 ? 2 : 0) + '.', (p + t) % 1 ? 0.005 : null, num(p + t, (p + t) % 1 ? 2 : 0));
    } },
    { skill: 'tariff', gen: function () {
      var p = rint(20, 150) * 10, r = pick([5, 10, 15, 20, 25]), t = p * r / 100;
      return N('A ' + r + '% tariff is charged on imported electric scooters. Each scooter has an import price of $' + num(p) + '. How much tariff is paid on <b>one</b> scooter? Give your answer in $.',
        t, '$', 'Tariff = ' + r + '/100 × $' + num(p) + ' = ' + money(t) + '. A tariff is a tax on imports, so this is the tax per scooter.', null, num(t));
    } },
    { skill: 'tariff', gen: function () {
      var p = rint(10, 60) * 10, r = pick([5, 10, 15, 20, 25]), t = p * r / 100;
      return Q('A bicycle costs $' + p + ' to import. A ' + r + '% tariff is added. What is the price of the bicycle after the tariff?',
        money(p + t), [money(t), money(p - t), money(p + r), money(R.roundDp(p * (1 + r / 1000), 2))],
        'Tariff = ' + r + '% × $' + p + ' = ' + money(t) + '. Price after tariff = $' + p + ' + ' + money(t) + ' = ' + money(p + t) + '. ' + money(t) + ' is the tariff alone.');
    } },
    { skill: 'tariff', gen: function () {
      var q = rint(2, 30) * 1000, p = rint(4, 40) * 5, r = pick([10, 15, 20, 25]);
      var rev = q * p * r / 100;
      return N('A government charges a ' + r + '% tariff on imported car tyres. Last year ' + num(q) + ' tyres were imported at $' + p + ' each before the tariff. How much tariff revenue did the government collect? Give your answer in $.',
        rev, '$', 'Value of imports = ' + num(q) + ' × $' + p + ' = ' + money(q * p) + '. Revenue = ' + r + '% × ' + money(q * p) + ' = ' + money(rev) + '.', null, num(rev));
    } },
    { skill: 'tariff', gen: function () {
      var p = rint(20, 200) * 10, r1 = pick([5, 10]), r2 = r1 + pick([5, 10, 15]), d = p * (r2 - r1) / 100;
      return N('A country raises its tariff on imported televisions from ' + r1 + '% to ' + r2 + '%. A television has an import price of $' + num(p) + '. By how much does the price of an imported television rise? Give your answer in $.',
        d, '$', 'Old price = $' + num(p) + ' + ' + r1 + '% = ' + money(p * (100 + r1) / 100) + '. New price = $' + num(p) + ' + ' + r2 + '% = ' + money(p * (100 + r2) / 100) + '. Rise = ' + money(d) + '.', null, num(d));
    } },
    { skill: 'method', gen: function () {
      var p = rint(10, 50) * 10, r = pick([6, 8, 12, 15, 18]);
      return Q('An import costs $' + p + ' and a ' + r + '% tariff is added. Which calculation gives the price after the tariff?',
        '$' + p + ' + (' + r + ' ÷ 100 × $' + p + ')', ['$' + p + ' × ' + r + ' ÷ 100', '$' + p + ' − (' + r + ' ÷ 100 × $' + p + ')', '$' + p + ' + ' + r],
        'First find the tariff, ' + r + '/100 × $' + p + ', then add it to the import price. Multiplying alone gives just the tariff; subtracting would be a discount.');
    } },
    mc('method', 'An income tax of 20% applies to income above a tax-free amount. What should the 20% be applied to?',
      'Only the part of income above the tax-free amount', ['The whole of the person’s income, including the tax-free part', 'Only the tax-free amount', 'The person’s net pay after tax'],
      'Tax is charged only on the taxed band. Applying the rate to the whole salary is the most common mistake.'),
    mc('method', 'A question gives a savings balance and an interest rate and asks for the balance after one year, including interest. What should the answer be?',
      'The savings plus the interest earned', ['The interest earned only', 'The savings minus the interest earned', 'The savings divided by the interest rate'],
      'A total includes the original savings and the interest. Giving only the interest answers a different question.'),
    mc('method', 'Which of these needs the percentage to be <b>subtracted</b> from the starting amount?',
      'Net pay after income tax', ['Price of an import after a tariff', 'Savings balance after a year of interest', 'Amount to repay on a loan with interest'],
      'Tax is taken away from gross pay to give net pay. Tariffs, interest on savings and interest on loans are all added to the starting amount.')
  ] };

  // =====================================================================
  // ECO-T21-07 Benefits and costs of economic growth
  // =====================================================================
  function ppcSvg(points, aria) {
    var t = points.map(function (p) { return '<circle cx="' + p[1] + '" cy="' + p[2] + '" r="4" fill="#e4464f"/><text x="' + (p[1] + 7) + '" y="' + (p[2] - 6) + '" font-size="14" font-weight="bold" fill="#e4464f">' + p[0] + '</text>'; }).join('');
    return '<svg viewBox="0 0 340 250" role="img" aria-label="' + aria + '" xmlns="http://www.w3.org/2000/svg">' +
      '<line x1="50" y1="200" x2="320" y2="200" stroke="#303a4c" stroke-width="2"/>' +
      '<line x1="50" y1="200" x2="50" y2="20" stroke="#303a4c" stroke-width="2"/>' +
      '<path d="M50,70 Q215,85 230,200" fill="none" stroke="#195d9b" stroke-width="3"/>' +
      '<path d="M50,35 Q265,50 285,200" fill="none" stroke="#9aa5b8" stroke-width="3" stroke-dasharray="6 4"/>' +
      '<text x="200" y="196" font-size="13" fill="#195d9b">PPC1</text>' +
      '<text x="270" y="140" font-size="13" fill="#303a4c">PPC2</text>' +
      '<text x="185" y="230" font-size="12" fill="#303a4c" text-anchor="middle">Consumer goods (units)</text>' +
      '<text x="18" y="115" font-size="12" fill="#303a4c" text-anchor="middle" transform="rotate(-90 18 115)">Capital goods (units)</text>' +
      '<text x="40" y="214" font-size="12" fill="#303a4c">0</text>' + t + '</svg>';
  }
  var PPC_SHIFT = ppcSvg([], 'Production possibility curve PPC1 and a second curve PPC2 further from the origin, showing an outward shift');
  var PPC_ABC = ppcSvg([['A', 120, 160], ['B', 177, 110], ['C', 216, 84]], 'Production possibility curves PPC1 and PPC2; point A inside PPC1, point B on PPC1, point C on PPC2 outside PPC1');
  B['ECO-T21-07'] = { title: 'Benefits and costs of economic growth', items: [
    mc('definition', 'What is meant by <b>economic growth</b>?',
      'An increase in a country’s real GDP (output) over time', ['An increase in the general level of prices', 'A rise in the number of people out of work', 'An increase in the value of the country’s currency over time'],
      'Economic growth is a rise in the output of goods and services, measured by an increase in real GDP. A rise in prices is inflation.'),
    mc('definition', 'Why is economic growth one of a government’s main macroeconomic objectives?',
      'It raises incomes and living standards across the economy', ['It always reduces the general level of prices across the economy', 'It removes the need for any taxes', 'It guarantees that no firm will ever close'],
      'More output means more jobs and higher incomes, so people can afford more goods and services: living standards rise.'),
    mc('definition', 'Which statement about economic growth is <b>incorrect</b>?',
      'Growth usually raises unemployment', ['Growth usually raises tax revenue', 'Growth usually raises investment by firms', 'Growth can raise pollution'],
      'Growth means more output, so firms need more workers and unemployment usually falls, not rises. The other statements are correct.'),
    mc('benefits', 'When a country’s output grows, why does unemployment usually fall?',
      'Firms need more workers to produce the extra output', ['Workers retire earlier when incomes rise', 'The government bans firms from cutting jobs', 'Prices fall, so firms need fewer workers to produce their goods'],
      'Labour is a derived demand: to make more goods and services firms must hire more workers, so unemployment falls.'),
    mc('benefits', 'Which is a likely benefit of economic growth for households?',
      'Higher incomes, so people can afford more goods and services', ['Higher prices, so savings are worth more', 'Fewer jobs, so people have more free time', 'Lower wages, so firms can afford to hire more people than before'],
      'Growth creates jobs and raises incomes, so households can buy more: a higher standard of living.'),
    mc('benefits', 'Why does economic growth usually increase government tax revenue?',
      'Higher incomes and profits mean more income tax and profit tax is paid', ['Growth forces the government to raise the rates of income tax and profit tax', 'Fewer people work, so fewer benefits are paid', 'Imports fall, so tariff revenue rises'],
      'With more people working and firms earning more, the same tax rates bring in more money, which can pay for schools and hospitals.'),
    mc('benefits', 'Tax revenue rises during a period of growth. What can the government then do?',
      'Spend more on schools and hospitals without raising tax rates', ['Cut spending because public services such as schools are no longer needed', 'Raise tax rates to slow the economy further', 'Stop collecting income tax altogether'],
      'Extra revenue from growth gives the government more to spend on public services, which also raises living standards.'),
    mc('benefits', 'How can economic growth help to reduce poverty?',
      'More jobs mean fewer people rely on very low or no income', ['Growth lowers the incomes of richer people only', 'Growth makes all goods free for poor households', 'Growth means the government stops paying any benefits to poor households'],
      'When growth creates jobs, people move from unemployment into paid work, so fewer households live in poverty.'),
    mc('productive-potential', 'During a boom, firms earn higher profits. What is the most likely next link that raises the country’s productive potential?',
      'Firms invest the profits in new machines and buildings', ['Firms pay all the profits out to the government', 'Firms reduce the number of machines and other capital goods they own', 'Firms raise prices so that output falls'],
      'Investment in capital goods increases the amount the economy is able to produce: its productive potential rises.'),
    mc('productive-potential', 'The figure shows a country’s production possibility curve (PPC) moving from PPC1 to PPC2. Which best explains this shift as a result of economic growth?',
      'Firms invested in new capital, raising productive potential', ['Unemployment rose, so fewer goods and services were produced', 'Prices rose, so output had to fall', 'Some machines were left unused'],
      'An outward shift of the PPC shows a rise in productive potential: the economy can produce more of both goods. Investment in capital goods is a main cause.', { svg: PPC_SHIFT, family: 'ppc-fig' }),
    mc('productive-potential', 'In the figure, which point can only be reached after the country’s productive potential has increased?',
      'Point C', ['Point A', 'Point B'],
      'Point C lies outside PPC1, so it cannot be produced with today’s resources. It becomes reachable only when productive potential rises to PPC2. A is reachable now (with spare resources) and B is on PPC1.', { svg: PPC_ABC, family: 'ppc-fig' }),
    mc('costs', 'Why might very rapid economic growth lead to inflation?',
      'Demand rises faster than firms can supply, so prices rise', ['Firms produce more, so the prices of goods and services must always fall', 'Unemployment rises, so wages fall', 'The government stops spending money'],
      'If spending grows faster than firms can raise output, the economy overheats: shortages of goods, workers and materials push prices up.'),
    mc('costs', 'Which is a likely <b>environmental</b> cost of economic growth?',
      'More air and water pollution from extra production', ['Lower unemployment as firms hire more', 'Higher tax revenue for the government to spend on services', 'More investment in machines'],
      'More factories, transport and energy use usually create more pollution and waste. The other options are benefits of growth.'),
    mc('costs', 'A country’s growth is based on mining and burning coal. Why might this harm future output?',
      'Finite resources are being used up', ['Coal can be replaced by new coal forever', 'Mining creates jobs for workers', 'Coal exports raise tax revenue'],
      'Coal is a finite (non-renewable) resource. Using it up quickly to grow today leaves less for the future.'),
    mc('costs', 'Why might economic growth fail to reduce poverty for everyone?',
      'The extra income may go mainly to a small number of people', ['Growth always shares income equally', 'Growth lowers everyone’s income by exactly the same amount each year', 'Growth means nobody needs to work'],
      'If the gains go mostly to owners and highly paid workers, inequality widens and some people remain poor even as GDP rises.'),
    mu('classify', 'Which are likely <b>benefits</b> of economic growth? Select all that apply.',
      ['Lower unemployment', 'Higher tax revenue', 'Higher living standards'],
      ['More pollution', 'A risk of higher inflation'],
      'Growth brings jobs, income and tax revenue. Pollution and overheating inflation are possible costs.'),
    mu('classify', 'Which are possible <b>costs</b> of economic growth? Select all that apply.',
      ['Using up finite resources such as oil', 'Inflation if the economy overheats', 'More pollution and waste'],
      ['Lower unemployment', 'More tax revenue for public services'],
      'Depletion, overheating and pollution are the costs to weigh. Lower unemployment and more revenue are benefits.'),
    { skill: 'classify', gen: function () {
      var c = shuf(COUNTRIES).slice(0, 4), hot = rint(0, 3);
      var rows = c.map(function (n, i) {
        if (i === hot) { var i1 = rint(3, 4); return [n, rint(8, 11) + '%', i1 + '%', (i1 + rint(3, 5)) + '%']; }
        var j = rint(2, 3); return [n, rint(1, 3) + '%', j + '%', j + '%'];
      });
      return Q('The table shows growth and inflation for four countries.<br>' + table(['Country', 'Real GDP growth this year', 'Inflation last year', 'Inflation this year'], rows) + 'Which country shows the clearest sign that rapid growth may be causing overheating?',
        c[hot], c.filter(function (_, i) { return i !== hot; }),
        c[hot] + ' has by far the fastest growth (' + rows[hot][1] + ') and inflation rising from ' + rows[hot][2] + ' to ' + rows[hot][3] + '. When demand grows faster than firms can supply, prices rise: the economy overheats.');
    } },
    { skill: 'benefits', gen: function () {
      var g = pick([200, 250, 400, 500, 800]), gr = pick([2, 3, 4, 5]), t = pick([20, 25, 30]);
      var inc = g * gr / 100 * t / 100;
      return N(pick(COUNTRIES) + ' has GDP of $' + g + 'bn and tax revenue equal to ' + t + '% of GDP. Its economy grows by ' + gr + '% and tax revenue stays at ' + t + '% of GDP. By how much does tax revenue rise? Give your answer in $bn.',
        R.roundDp(inc, 2), '$bn', 'New GDP = $' + g + 'bn × ' + (1 + gr / 100) + ' = $' + R.roundDp(g * (1 + gr / 100), 2) + 'bn, a rise of $' + R.roundDp(g * gr / 100, 2) + 'bn. ' + t + '% of that = $' + R.roundDp(inc, 2) + 'bn extra tax revenue to spend on services.',
        0.005, String(R.roundDp(inc, 2)));
    } },
    { skill: 'benefits', gen: function () {
      var lf = pick([10, 12, 15, 20, 25, 30, 40]), u1 = pick([6, 7, 8, 9]), u2 = u1 - pick([1, 2]);
      var more = lf * (u1 - u2) / 100 * 1000000;
      return N('During a period of growth, the unemployment rate in ' + pick(COUNTRIES) + ' falls from ' + u1 + '% to ' + u2 + '%. The labour force stays at ' + lf + ' million. How many fewer people are unemployed?',
        more, 'people', 'Fall = (' + u1 + '% − ' + u2 + '%) × ' + lf + ' million = ' + (u1 - u2) + '/100 × ' + num(lf * 1000000) + ' = ' + num(more) + ' people. More output means firms hire more workers.',
        null, num(more));
    } },
    mc('evaluation', 'Claim: “Faster economic growth will always improve living standards.” Which is the best counter-argument?',
      'Pollution and unequal gains may mean many people are no better off', ['Growth creates jobs and raises incomes', 'Growth brings more tax revenue for public services such as hospitals', 'Firms invest more during growth'],
      'The other options support the claim. Growth can bring pollution, overheating and unequal sharing of income, so living standards do not always rise for everyone.'),
    mc('evaluation', 'A country grows by 7% a year, mostly from new factories on the banks of its main river. When assessing whether this growth is beneficial, which point gives the best balance?',
      'Jobs and incomes rise, but river pollution may harm fishing and health', ['Jobs rise, and incomes rise as well', 'The factories produce more goods for export', 'The government collects more tax from the new factories and from their workers'],
      'A balanced judgement weighs a benefit against a cost. Only the first option sets jobs and incomes against an environmental cost in the case.')
  ] };

  // =====================================================================
  // ECO-T22-02 Who gains and who loses from globalisation
  // =====================================================================
  B['ECO-T22-02'] = { title: 'Who gains and who loses from globalisation', items: [
    mc('definition', 'What is meant by <b>globalisation</b>?',
      'Economies becoming more connected through trade and investment', ['Countries cutting their trade so that they rely on their own output', 'Governments taking ownership of major industries', 'All countries adopting one shared currency'],
      'Globalisation is the growing integration and interdependence of the world’s economies through trade, investment and firms working across borders.'),
    mc('consumers', 'Which is a likely impact of globalisation on consumers?',
      'Lower prices for many goods', ['Fewer imported products in shops', 'Higher costs of phoning abroad', 'Less competition between firms'],
      'More foreign competition and economies of scale push prices down, while choice widens and communication becomes cheaper.'),
    mc('consumers', 'Shoppers in a cold northern country can now buy fresh mangoes all through the winter. Which impact of globalisation does this show?',
      'Greater choice for consumers', ['Closing of traditional industries', 'Higher prices for consumers', 'Higher costs of communication'],
      'Imports let consumers buy products that cannot be grown at home or that are out of season, so choice widens.'),
    mc('consumers', 'Why does globalisation tend to lower the prices consumers pay?',
      'More foreign competition and economies of scale cut costs and prices', ['Governments set lower prices for imported goods', 'Firms face fewer rivals from abroad, so they decide to cut their prices', 'Imported goods are never taxed'],
      'Firms selling in a world market face more rivals and produce on a larger scale, so cost per unit falls and prices are pushed down.'),
    mc('consumers', 'Lower prices for imported goods raise consumers’ living standards because:',
      'The same income now buys more goods and services', ['Consumers must work longer hours', 'Consumers pay more tax on imports', 'Wages fall by exactly the same amount as the prices of goods'],
      'If prices fall while income stays the same, purchasing power rises: people can afford more, which is a higher standard of living.'),
    mu('consumers', 'Which are likely benefits of globalisation <b>for consumers</b>? Select all that apply.',
      ['A wider choice of goods', 'Lower prices for many products', 'Products available out of season'],
      ['Fewer brands to choose from', 'Higher prices due to less competition'],
      'Globalisation brings more choice, lower prices and year-round supply. Fewer brands or higher prices would be the opposite of its usual effects.'),
    mc('consumers', 'Which is <b>not</b> a likely benefit of globalisation for consumers?',
      'Higher prices because there is less competition', ['A wider range of foreign products', 'Cheaper international phone calls and online messaging', 'Lower prices from economies of scale'],
      'Globalisation increases competition, so it tends to lower prices rather than raise them.'),
    mc('producers', 'A small coffee roaster starts selling online to customers in 20 countries. What is the main gain for this producer from globalisation?',
      'Access to new markets, raising its sales revenue', ['Higher costs from serving more customers in many countries', 'Less competition from foreign roasters', 'Lower demand from customers at home'],
      'Globalisation opens overseas markets. Selling to more customers raises the firm’s sales revenue and may give it economies of scale.'),
    mc('producers', 'A bicycle maker now buys cheaper parts from suppliers abroad. What is the most likely gain for the firm?',
      'Lower costs per unit, so it can cut prices or raise profit', ['Higher costs per unit, so it must raise the price of each bicycle', 'Fewer bicycles produced each month', 'Fewer customers for its bicycles'],
      'Cheaper inputs from abroad lower the cost of making each bicycle, which allows lower prices or higher profit.'),
    mc('producers', 'A phone maker starts selling in 60 countries instead of 5. Why might its cost per phone fall?',
      'It produces on a much larger scale and gains economies of scale', ['It must pay higher wages in every country where it sells', 'It sells far fewer phones in each country than it did before', 'Its rivals in other countries agree to raise their prices'],
      'Selling to a world market lets the firm produce many more phones. Economies of scale (for example bulk buying of parts) lower the cost of each phone.'),
    mc('producers', 'How do lower costs of communication help firms that trade internationally?',
      'They can manage suppliers and customers abroad more cheaply', ['They must stop selling to foreign customers', 'They pay higher tariffs on all of their exports to other countries', 'They can no longer use foreign suppliers'],
      'Cheap phone, video and internet links make it easier and cheaper to deal with suppliers and customers in other countries.'),
    mc('costs', 'A country’s handloom weaving sector shrinks as cheap factory-made cloth is imported. This is an example of:',
      'Closing of traditional industries', ['Greater choice for producers', 'Reduced costs of communication', 'Rising living standards for weavers'],
      'Traditional producers that cannot compete with cheaper imports lose sales and close. This is one of the listed costs of globalisation.'),
    mc('costs', 'Which is an <b>environmental</b> cost of globalisation?',
      'More emissions from shipping and flying goods around the world', ['Lower prices for imported goods', 'More jobs in export industries and in the ports that ship the goods', 'Cheaper international communication'],
      'Moving goods long distances by ship, plane and lorry uses more fuel and creates more pollution.'),
    mc('costs', 'Which is a possible cost of globalisation for <b>consumers</b>?',
      'Some imported products may not meet local safety standards', ['A wider choice of goods from many countries in local shops', 'Lower prices for electronics', 'Cheaper calls to other countries'],
      'With goods arriving from many countries, some may be made to lower safety standards and could harm buyers.'),
    mc('costs', 'Which is a possible cost of globalisation for workers in some poorer countries that make goods for global brands?',
      'Low pay and poor working conditions in some factories', ['Higher pay than in every richer country', 'Guaranteed jobs for life', 'Fewer hours of work each week for the same or higher pay'],
      'Firms may move production to where labour is cheapest, and some factories offer low pay and poor conditions.'),
    mc('workers', 'Which workers are most likely to <b>lose</b> from globalisation?',
      'Workers in a domestic industry that cannot compete with cheaper imports', ['Workers in an export firm that wins many new customers in foreign markets', 'Workers employed by a foreign firm that opens a new factory', 'Workers in a port that handles more trade'],
      'Where imports are cheaper, domestic firms lose sales and may close, so their workers lose jobs. The other workers gain from more trade.'),
    mc('workers', 'How might the <b>government</b> of a country gain from globalisation?',
      'More tax revenue from growing export firms and incomes', ['Less tax revenue because trade rises', 'Higher spending on unemployment benefits for those who lose jobs', 'No change, because governments do not trade'],
      'Growing exports raise firms’ profits and workers’ incomes, which brings in more tax revenue for public services.'),
    mc('producers', 'A furniture maker now meets its overseas buyers by cheap video calls instead of flying staff abroad. Which impact of globalisation does this show?',
      'Reduced costs of communication', ['Closing of traditional industries', 'Greater environmental damage from air travel', 'Higher prices for consumers'],
      'Cheap internet links let the firm deal with buyers abroad without costly trips, so its cost of communication falls. It flies less, so environmental damage does not rise.'),
    { skill: 'dependence', gen: function () {
      var c = pick(COUNTRIES), crop = pick(['cocoa', 'coffee', 'cotton', 'vanilla', 'tea']);
      var rev = pick([2, 3, 4, 5, 6, 8]), share = pick([40, 50, 60, 70]), fall = pick([10, 20, 25, 30]);
      var loss = R.roundDp(rev * fall / 100, 2);
      return N('Exports of ' + crop + ' earn ' + c + ' $' + rev + 'bn a year, which is ' + share + '% of all its export earnings. The world price of ' + crop + ' falls by ' + fall + '% while the quantity exported stays the same. By how much do its ' + crop + ' export earnings fall? Give your answer in $bn.',
        loss, '$bn', fall + '% × $' + rev + 'bn = $' + loss + 'bn. Because ' + c + ' depends so heavily on one crop, a fall in world prices hits farmers, jobs and growth hard.',
        0.005, String(loss));
    } },
    mc('evaluation', 'Claim: “Globalisation benefits every group in a country.” Which is the best counter-argument?',
      'Workers in traditional industries may lose their jobs as firms close', ['Consumers enjoy a wider choice of goods', 'Exporters gain access to many new markets and to more customers abroad', 'Prices of many goods fall'],
      'The other options are benefits. A counter-argument names a group that loses: workers in industries that cannot compete.'),
    mc('evaluation', 'Many of a country’s fruit plantations are foreign-owned and send most of their profits abroad. Why might this limit the gains from globalisation for the country?',
      'Much of the income leaves the country instead of being spent or taxed locally', ['The plantations employ local workers', 'The country now exports much more fruit to other countries than it did before', 'Consumers abroad buy more of the fruit'],
      'If profits flow overseas, less is spent in the local economy or paid in local taxes, so the country keeps only part of the value created.'),
    mc('evaluation', 'When evaluating whether globalisation benefits a country’s farmers, which factor would the outcome <b>most depend on</b>?',
      'Whether world prices for their crop stay stable', ['Whether the country has a long coastline', 'Whether all of the farmers use the same type of seeds', 'Whether the country’s flag is well known'],
      'Farmers selling into world markets gain when prices are good but suffer when they fall. Price stability is a key factor in the judgement.')
  ] };

  // =====================================================================
  // ECO-CALC-17 Finding the average (mean) of data
  // =====================================================================
  function vals(n, lo, hi) { var a = []; for (var i = 0; i < n; i++) a.push(rint(lo, hi)); return a; }   // integers in hundredths or tenths
  function fmt(v, scale, dp) { return (v / scale).toFixed(dp); }
  function meanOf(a, scale) { var s = a.reduce(function (x, y) { return x + y; }, 0); return { sum: s / scale, mean: R.roundDp(s / scale / a.length, 2) }; }
  function sumText(a, scale, dp) { return a.map(function (v) { return fmt(v, scale, dp); }).join(' + '); }
  var REGIONS = ['North', 'South', 'East', 'West', 'Central', 'Coast'];
  function barSvg(labels, values, unit, aria) {
    var max = Math.max.apply(null, values), w = 46, gap = 24, x0 = 60, h = 150;
    var bars = values.map(function (v, i) {
      var bh = Math.round(v / max * h * 0.9), x = x0 + i * (w + gap), y = 190 - bh;
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + bh + '" fill="#195d9b"/>' +
        '<text x="' + (x + w / 2) + '" y="' + (y - 5) + '" font-size="12" text-anchor="middle" fill="#303a4c">' + v.toFixed(2) + '</text>' +
        '<text x="' + (x + w / 2) + '" y="206" font-size="12" text-anchor="middle" fill="#303a4c">' + labels[i] + '</text>';
    }).join('');
    return '<svg viewBox="0 0 360 240" role="img" aria-label="' + aria + '" xmlns="http://www.w3.org/2000/svg">' +
      '<line x1="50" y1="190" x2="345" y2="190" stroke="#303a4c" stroke-width="2"/><line x1="50" y1="190" x2="50" y2="20" stroke="#303a4c" stroke-width="2"/>' +
      '<text x="18" y="105" font-size="12" fill="#303a4c" text-anchor="middle" transform="rotate(-90 18 105)">' + unit + '</text>' +
      '<text x="200" y="228" font-size="12" fill="#303a4c" text-anchor="middle">Year</text>' + bars + '</svg>';
  }
  B['ECO-CALC-17'] = { title: 'Finding the average (mean) of data', items: [
    { skill: 'mean-rates', gen: function () {
      var a = vals(5, 25, 85), r = REGIONS.slice(0, 5), m = meanOf(a, 10);
      return N('The table shows the unemployment rate in five regions of ' + pick(COUNTRIES) + ' in one month.<br>' + table(['Region'].concat(r), [['Unemployment rate (%)'].concat(a.map(function (v) { return fmt(v, 10, 1); }))]) +
        'Calculate, to two decimal places, the average (mean) unemployment rate of the five regions.',
        m.mean, '%', '(' + sumText(a, 10, 1) + ') ÷ 5 = ' + m.sum.toFixed(1) + ' ÷ 5 = ' + m.mean.toFixed(2) + '%.', 0.005, m.mean.toFixed(2));
    } },
    { skill: 'mean-money', gen: function () {
      var a = vals(4, 1500, 7500), y0 = rint(2015, 2021), m = meanOf(a, 100);
      return N('The table shows the value of foreign direct investment (FDI) into ' + pick(COUNTRIES) + '.<br>' + table(['Year', y0, y0 + 1, y0 + 2, y0 + 3], [['FDI ($bn)'].concat(a.map(function (v) { return fmt(v, 100, 2); }))]) +
        'Calculate the mean yearly value of FDI in $bn from ' + y0 + ' to ' + (y0 + 3) + '. Give your answer to two decimal places.',
        m.mean, '$bn', '(' + sumText(a, 100, 2) + ') ÷ 4 = ' + m.sum.toFixed(2) + ' ÷ 4 = $' + m.mean.toFixed(2) + 'bn.', 0.005, m.mean.toFixed(2));
    } },
    { skill: 'method', gen: function () {
      var a = vals(5, 20, 90), m = meanOf(a, 10), s = m.sum;
      var right = m.mean.toFixed(2) + '%';
      return Q('The unemployment rates of five cities are ' + a.map(function (v) { return fmt(v, 10, 1) + '%'; }).join(', ') + '. What is the mean unemployment rate, to two decimal places?',
        right, [R.roundDp(s / 4, 2).toFixed(2) + '%', R.roundDp(s / 6, 2).toFixed(2) + '%', s.toFixed(2) + '%'],
        'Add the five values (' + s.toFixed(1) + ') and divide by the number of values, 5: ' + s.toFixed(1) + ' ÷ 5 = ' + right + '. Dividing by 4 or 6 uses the wrong count, and ' + s.toFixed(2) + '% is only the sum.');
    } },
    { skill: 'mean-rates', gen: function () {
      var a = vals(6, 12, 68), mons = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], m = meanOf(a, 10);
      return N('The table shows the yearly rate of inflation (CPI) in ' + pick(COUNTRIES) + ', measured each month for six months.<br>' + table(['Month'].concat(mons), [['Inflation (%)'].concat(a.map(function (v) { return fmt(v, 10, 1); }))]) +
        'Calculate, to two decimal places, the mean rate of inflation over the six months.',
        m.mean, '%', '(' + sumText(a, 10, 1) + ') ÷ 6 = ' + m.sum.toFixed(1) + ' ÷ 6 = ' + m.mean.toFixed(2) + '%.', 0.005, m.mean.toFixed(2));
    } },
    { skill: 'mean-rates', gen: function () {
      var a = vals(4, 5, 60), neg = rint(0, 3); a[neg] = -rint(3, 25);
      if (a.reduce(function (x, y) { return x + y; }, 0) <= 0) a[(neg + 1) % 4] += 40;
      var y0 = rint(2016, 2021), m = meanOf(a, 10);
      return N('The table shows real GDP growth in ' + pick(COUNTRIES) + ' over four years. A negative figure means output fell.<br>' + table(['Year', y0, y0 + 1, y0 + 2, y0 + 3], [['GDP growth (%)'].concat(a.map(function (v) { return fmt(v, 10, 1); }))]) +
        'Calculate, to two decimal places, the average annual rate of GDP growth over the four years.',
        m.mean, '%', 'Include the negative value: (' + sumText(a, 10, 1).replace(/\+ -/g, '− ') + ') ÷ 4 = ' + m.sum.toFixed(1) + ' ÷ 4 = ' + m.mean.toFixed(2) + '%.', 0.005, m.mean.toFixed(2));
    } },
    { skill: 'mean-money', gen: function () {
      var a = vals(5, 300, 900), m = meanOf(a, 1);
      var mons = ['July', 'August', 'September', 'October', 'November'];
      return N('A country’s monthly exports of fish (in $ million) were: ' + mons.map(function (mo, i) { return mo + ' $' + a[i] + 'm'; }).join(', ') + '. Calculate, to two decimal places, the mean monthly value of fish exports in $ million.',
        m.mean, '$m', '(' + a.join(' + ') + ') ÷ 5 = ' + m.sum + ' ÷ 5 = $' + m.mean.toFixed(2) + 'm.', 0.005, m.mean.toFixed(2));
    } },
    { skill: 'mean-money', gen: function () {
      var a = vals(4, 800, 4800).map(function (v) { return v; }), y0 = rint(2017, 2021), m = meanOf(a, 100);
      var years = [y0, y0 + 1, y0 + 2, y0 + 3];
      var q = N('The bar chart shows FDI into ' + pick(COUNTRIES) + ' in $bn for four years. Calculate the mean yearly value of FDI in $bn, to two decimal places.',
        m.mean, '$bn', '(' + sumText(a, 100, 2) + ') ÷ 4 = ' + m.sum.toFixed(2) + ' ÷ 4 = $' + m.mean.toFixed(2) + 'bn.', 0.005, m.mean.toFixed(2));
      q.svg = barSvg(years, a.map(function (v) { return v / 100; }), 'FDI ($bn)', 'Bar chart of FDI in $bn for four years with each bar labelled with its value');
      return q;
    } },
    { skill: 'mean-rates', gen: function () {
      var a = vals(5, 20, 90), b = vals(5, 20, 90), r = REGIONS.slice(0, 5), y = rint(2022, 2024), m = meanOf(b, 10);
      return N('The table shows unemployment rates (%) in five regions in two years.<br>' + table(['Year'].concat(r), [[String(y)].concat(a.map(function (v) { return fmt(v, 10, 1); })), [String(y + 1)].concat(b.map(function (v) { return fmt(v, 10, 1); }))]) +
        'Calculate, to two decimal places, the average unemployment rate across the five regions in <b>' + (y + 1) + '</b>.',
        m.mean, '%', 'Use only the ' + (y + 1) + ' row: (' + sumText(b, 10, 1) + ') ÷ 5 = ' + m.sum.toFixed(1) + ' ÷ 5 = ' + m.mean.toFixed(2) + '%.', 0.005, m.mean.toFixed(2));
    } },
    { skill: 'mean-rates', gen: function () {
      var a;
      do { a = [rint(4, 16) * 25]; for (var k = 1; k < 4; k++) a.push(a[k - 1] + pick([-25, 0, 25, 50])); }   // realistic 0.25-point moves
      while (a.reduce(function (x, y) { return x + y; }, 0) % 4 === 2);   // no mean ending in an exact half-hundredth
      var m = meanOf(a, 100), q = ['Q1', 'Q2', 'Q3', 'Q4'];
      return N('A central bank’s interest rate at the start of each quarter of a year was: ' + q.map(function (x, i) { return x + ' ' + fmt(a[i], 100, 2) + '%'; }).join(', ') + '. Calculate, to two decimal places, the mean interest rate for the year.',
        m.mean, '%', '(' + sumText(a, 100, 2) + ') ÷ 4 = ' + m.sum.toFixed(2) + ' ÷ 4 = ' + m.mean.toFixed(2) + '%.', 0.005, m.mean.toFixed(2));
    } },
    { skill: 'mean-money', gen: function () {
      var a = vals(5, 180, 420), m = meanOf(a, 100);
      var shops = ['Shop P', 'Shop Q', 'Shop R', 'Shop S', 'Shop T'];
      return N('A survey records the price of a loaf of bread in five shops.<br>' + table(['Shop'].concat(shops), [['Price ($)'].concat(a.map(function (v) { return fmt(v, 100, 2); }))]) +
        'Calculate the mean price of a loaf, to two decimal places. Give your answer in $.',
        m.mean, '$', '(' + sumText(a, 100, 2) + ') ÷ 5 = ' + m.sum.toFixed(2) + ' ÷ 5 = $' + m.mean.toFixed(2) + '.', 0.005, m.mean.toFixed(2));
    } },
    { skill: 'mean-money', gen: function () {
      var n = pick([3, 4, 5]), a = vals(n, 200, 900), m = meanOf(a, 10), y0 = rint(2017, 2021);
      var yrs = []; for (var i = 0; i < n; i++) yrs.push(y0 + i);
      return N('The fiscal deficit of ' + pick(COUNTRIES) + ' (in $bn) was ' + yrs.map(function (y, i) { return '$' + fmt(a[i], 10, 1) + 'bn in ' + y; }).join(', ') + '. Calculate, to two decimal places, the average yearly fiscal deficit in $bn.',
        m.mean, '$bn', 'There are ' + n + ' values: (' + sumText(a, 10, 1) + ') ÷ ' + n + ' = ' + m.sum.toFixed(1) + ' ÷ ' + n + ' = $' + m.mean.toFixed(2) + 'bn.', 0.005, m.mean.toFixed(2));
    } },
    { skill: 'mean-counts', gen: function () {
      var a = vals(6, 40, 160), m = meanOf(a, 1), firms = ['A', 'B', 'C', 'D', 'E', 'F'];
      return N('Six foreign firms opened factories in a region. The number of local workers each one employs is: ' + a.join(', ') + '. Calculate, to two decimal places, the mean number of local workers per factory.',
        m.mean, 'workers', '(' + a.join(' + ') + ') ÷ 6 = ' + m.sum + ' ÷ 6 = ' + m.mean.toFixed(2) + ' workers.', 0.005, m.mean.toFixed(2));
    } },
    { skill: 'interpret', gen: function () {
      var a = vals(4, 30, 80), m0 = meanOf(a, 10), add = Math.random() < 0.5 ? rint(85, 99) : rint(10, 22), all = a.concat([add]), m1 = meanOf(all, 10);
      return N('The unemployment rates of four regions are ' + a.map(function (v) { return fmt(v, 10, 1) + '%'; }).join(', ') + ', so their mean is ' + m0.mean.toFixed(2) + '%. A fifth region, with a rate of ' + fmt(add, 10, 1) + '%, is added to the data. What is the new mean of all five regions, to two decimal places?',
        m1.mean, '%', 'New sum = ' + m0.sum.toFixed(1) + ' + ' + fmt(add, 10, 1) + ' = ' + m1.sum.toFixed(1) + '. Divide by 5 (not 4): ' + m1.sum.toFixed(1) + ' ÷ 5 = ' + m1.mean.toFixed(2) + '%.', 0.005, m1.mean.toFixed(2));
    } },
    { skill: 'interpret', gen: function () {
      var n = 4, a = vals(3, 1500, 6500), target = rint(3000, 5500);
      var need = target * n - a.reduce(function (x, y) { return x + y; }, 0);
      while (need < 1500 || need > 6500) { a = vals(3, 1500, 6500); target = rint(3000, 5500); need = target * n - a.reduce(function (x, y) { return x + y; }, 0); }   // fourth year always a realistic positive value
      return N('A country’s FDI was $' + fmt(a[0], 100, 2) + 'bn, $' + fmt(a[1], 100, 2) + 'bn and $' + fmt(a[2], 100, 2) + 'bn in three years. The mean FDI over these and a fourth year was $' + fmt(target, 100, 2) + 'bn. What was FDI in the fourth year? Give your answer in $bn.',
        R.roundDp(need / 100, 2), '$bn', 'Total over four years = 4 × ' + fmt(target, 100, 2) + ' = ' + (target * 4 / 100).toFixed(2) + '. Fourth year = ' + (target * 4 / 100).toFixed(2) + ' − (' + sumText(a, 100, 2) + ') = $' + (need / 100).toFixed(2) + 'bn.', 0.005, (need / 100).toFixed(2));
    } },
    { skill: 'interpret', gen: function () {
      var c = shuf(REGIONS).slice(0, 2), a = vals(3, 30, 90), b = vals(3, 30, 90);
      var ma = meanOf(a, 10), mb = meanOf(b, 10);
      if (ma.mean === mb.mean) { b[0] += 3; mb = meanOf(b, 10); }
      var hi = ma.mean > mb.mean ? 0 : 1;
      return Q('Three towns in the ' + c[0] + ' region have unemployment rates of ' + a.map(function (v) { return fmt(v, 10, 1) + '%'; }).join(', ') + '. Three towns in the ' + c[1] + ' region have rates of ' + b.map(function (v) { return fmt(v, 10, 1) + '%'; }).join(', ') + '. Which region has the higher mean unemployment rate, and what is it?',
        'The ' + c[hi] + ' region, ' + (hi ? mb : ma).mean.toFixed(2) + '%', ['The ' + c[1 - hi] + ' region, ' + (hi ? ma : mb).mean.toFixed(2) + '%', 'The ' + c[hi] + ' region, ' + (hi ? mb : ma).sum.toFixed(2) + '%', 'The ' + c[1 - hi] + ' region, ' + (hi ? mb : ma).mean.toFixed(2) + '%'],
        c[0] + ': ' + ma.sum.toFixed(1) + ' ÷ 3 = ' + ma.mean.toFixed(2) + '%. ' + c[1] + ': ' + mb.sum.toFixed(1) + ' ÷ 3 = ' + mb.mean.toFixed(2) + '%. So the ' + c[hi] + ' region is higher.');
    } },
    { skill: 'method', gen: function () {
      var a = vals(4, 20, 80);
      var v = a.map(function (x) { return fmt(x, 10, 1); });
      return Q('The unemployment rates of four regions are ' + v.join('%, ') + '%. Which expression gives their mean?',
        '(' + v.join(' + ') + ') ÷ 4', ['(' + v.join(' + ') + ') ÷ 3', '(' + v.join(' + ') + ') × 4', v[0] + ' + ' + v[1] + ' + ' + v[2] + ' + ' + v[3] + ' ÷ 4'],
        'The mean is the sum of all the values divided by how many there are. The brackets matter: without them only the last value would be divided by 4.');
    } },
    { skill: 'mean-rates', gen: function () {
      var a = vals(5, 100, 350), m = meanOf(a, 100), yrs = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
      return N('The table shows the yearly percentage growth in tourist arrivals to an island.<br>' + table([''].concat(yrs), [['Growth (%)'].concat(a.map(function (v) { return fmt(v, 100, 2); }))]) +
        'Calculate, to two decimal places, the average yearly growth in tourist arrivals.',
        m.mean, '%', '(' + sumText(a, 100, 2) + ') ÷ 5 = ' + m.sum.toFixed(2) + ' ÷ 5 = ' + m.mean.toFixed(2) + '%.', 0.005, m.mean.toFixed(2));
    } },
    mc('method', 'To find the mean of a set of data, you:',
      'Add all the values and divide by how many values there are', ['Take the middle value when they are in order', 'Take the value that appears most often', 'Subtract the smallest value in the data from the largest value'],
      'The mean is the sum divided by the count. The middle value is the median, the most common is the mode, and largest minus smallest is the range.'),
    mc('method', 'A student finds the mean of five regional unemployment rates by adding them and dividing by 4. What is the mistake?',
      'They divided by the wrong number: there are 5 values', ['They should have multiplied the total by 5', 'They should have added only four of the rates', 'They should not have added the rates first'],
      'Always count the values before dividing. Five values means dividing the total by 5.'),
    mc('units', 'A table shows FDI in $bn for four years. In which form should the mean be given?',
      'In $bn, the same unit as the data', ['As a percentage (%)', 'As a whole number with no unit', 'In $ million, after multiplying by four'],
      'The mean keeps the unit of the data. Mean FDI is in $bn, just like each yearly figure.'),
    mc('units', 'A table shows the unemployment rate (%) in six regions. What unit should their mean have?',
      '%, the same unit as the rates', ['$bn, the unit for money values', 'Number of people, as a count', 'No unit, as it is an average'],
      'An average of percentage rates is itself a rate, so it is given in %. Leaving off the unit can lose a mark.'),
    { skill: 'units', gen: function () {
      var a = vals(3, 1200, 5600), m = meanOf(a, 100), c = pick(COUNTRIES);
      return Q('FDI into ' + c + ' was $' + a.map(function (v) { return fmt(v, 100, 2); }).join('bn, $') + 'bn over three years. Which answer for the mean is complete and correct?',
        '$' + m.mean.toFixed(2) + 'bn', [m.mean.toFixed(2) + '%', '$' + m.sum.toFixed(2) + 'bn', '$' + R.roundDp(m.sum / 4, 2).toFixed(2) + 'bn'],
        '(' + sumText(a, 100, 2) + ') ÷ 3 = $' + m.mean.toFixed(2) + 'bn. The unit stays $bn, not %, and the total ($' + m.sum.toFixed(2) + 'bn) is not the mean.');
    } }
  ] };

  // =====================================================================
  // ECO-T12-22 Why governments regulate competition and mergers
  // =====================================================================
  B['ECO-T12-22'] = { title: 'Why governments regulate competition and mergers', items: [
    mu('reasons', 'Which are reasons why governments regulate competition? Select all that apply.',
      ['To promote competition', 'To limit monopoly power', 'To protect consumer interests', 'To control mergers and takeovers'],
      ['To reduce pollution from factories', 'To raise the profits of the largest firms'],
      'The specification lists four aims: promote competition, limit monopoly power, protect consumers and control mergers and takeovers. Pollution is an externality, a different topic.'),
    mc('reasons', 'Which is <b>not</b> a reason for government regulation of competition?',
      'To reduce pollution from factories', ['To limit monopoly power', 'To control mergers and takeovers between firms', 'To protect consumer interests'],
      'Pollution controls deal with external costs, not competition. The other three are reasons for regulating competition.'),
    mc('reasons', 'Who is competition regulation mainly designed to protect?',
      'Consumers and fair competition in the market', ['Shareholders of the largest firm in the market', 'Firms that want to avoid rivals', 'The government’s tax revenue'],
      'Regulation stops dominant firms from exploiting customers and keeps markets open to rivals. It is not there to protect big firms’ profits.'),
    mc('reasons', 'What is the main role of a competition regulator?',
      'To investigate mergers and unfair practices that harm consumers', ['To set the interest rate that banks charge on loans across the economy', 'To collect income tax from workers', 'To control pollution from factories'],
      'A competition regulator looks at mergers, takeovers and anti-competitive behaviour, and can block or change deals that would harm consumers.'),
    mc('harm-chain', 'Why might a firm with 75% of a market be bad for consumers?',
      'It faces little competition, so it can raise prices and innovate less', ['It must keep cutting its prices because it has so many rivals in the market', 'It cannot make a profit with such a large share', 'It is forced by law to offer more choice'],
      'With few rivals, customers have nowhere else to go. The dominant firm can charge more, offer less choice and has less pressure to improve.'),
    mc('harm-chain', 'Why might a dominant firm innovate <b>less</b> than firms in a competitive market?',
      'Customers have few alternatives, so it keeps sales without improving', ['It has no money to spend on research', 'The government bans it from launching any new products in the market at all', 'Its rivals copy everything it does'],
      'Innovation is driven by the fear of losing customers to rivals. A firm that dominates its market feels less of that pressure.'),
    mc('harm-chain', 'Customers of the only broadband supplier in a rural region complain about slow repairs. What is the most likely reason?',
      'Without rivals, the firm loses no customers when service is poor', ['The firm faces too much competition from rivals to afford to do repairs', 'Customers in the region use the internet too little', 'The government sets the firm’s repair times'],
      'When customers cannot switch, a monopoly has little reason to improve its service. This is one harm regulation aims to prevent.'),
    mu('harm-chain', 'Which are likely harms to consumers when competition in a market falls sharply? Select all that apply.',
      ['Higher prices', 'Less choice', 'Less innovation'],
      ['Lower prices', 'Guaranteed better service'],
      'Less competition gives the remaining firms power to raise prices, narrow choice and innovate less. Lower prices and better service are signs of strong competition.'),
    mc('mergers', 'What is a <b>takeover</b>?',
      'One firm buying control of another firm', ['Two firms agreeing to fix their prices', 'A firm closing down one of its factories', 'The government buying a private firm'],
      'In a takeover one firm gains control of another by buying it. In a merger two firms agree to join together as one.'),
    mc('mergers', 'The largest airline in a country wants to take over the second largest. Why might the government block this?',
      'The combined airline could dominate routes and raise fares', ['The combined airline would face far too many rivals on each of its routes', 'Takeovers always lower the price of tickets', 'The government wants both airlines to close'],
      'Joining the two biggest rivals would remove competition on many routes. With fewer alternatives, passengers could face higher fares and poorer service.'),
    mc('mergers', 'A regulator blocks a merger between the two biggest cinema chains in a country. What is the most likely benefit to film-goers?',
      'Competition remains, keeping ticket prices lower and choice wider', ['Ticket prices rise so that cinemas can pay for the cost of the regulator', 'There will be fewer cinemas to choose from', 'Film-goers can only use one chain'],
      'Keeping the chains separate keeps rivalry between them, so each has to keep prices down and offer choice to attract customers.'),
    mc('mergers', 'A regulator lets two supermarket chains merge only if they sell some stores in towns where they would be the only big supermarket. Why?',
      'So shoppers in those towns still have a competing store nearby', ['So the merged firm can raise its prices in those towns without losing shoppers', 'So the merged firm can close all its other stores', 'So the government can run the stores itself'],
      'Selling stores to a rival keeps local competition alive, so shoppers are protected from higher prices where the merged firm would otherwise dominate.'),
    { skill: 'mergers', gen: function () {
      var names = shuf(['Arlo Foods', 'Brightway', 'Castell', 'Dunmore', 'Everton Retail', 'Fairbank']).slice(0, 5);
      var s, idx;
      do {
        s = [rint(20, 34), rint(14, 26), rint(10, 18), rint(6, 14)]; s.push(100 - s[0] - s[1] - s[2] - s[3]);
        idx = [0, 1, 2, 3, 4].sort(function (a, b) { return s[b] - s[a]; });
      } while (s[4] < 4 || new Set(s).size < 5 || s[idx[4]] + s[idx[3]] >= s[idx[0]] + s[idx[1]] - 5);
      s = shuf(s); idx = [0, 1, 2, 3, 4].sort(function (a, b) { return s[b] - s[a]; });
      var top = [idx[0], idx[1]];
      var wrong = [[idx[3], idx[4]], [idx[2], idx[4]], [idx[2], idx[3]]];
      var lab = function (p) { return names[p[0]] + ' with ' + names[p[1]] + ' (' + (s[p[0]] + s[p[1]]) + '% combined)'; };
      return Q('The table shows market shares in a country’s grocery market.<br>' + table(['Firm'].concat(names), [['Market share (%)'].concat(s.map(String))]) + 'Which proposed merger is a competition regulator most likely to block?',
        lab(top), wrong.map(lab),
        'Merging ' + names[top[0]] + ' and ' + names[top[1]] + ' would create a firm with ' + (s[top[0]] + s[top[1]]) + '% of the market, the largest combined share, and remove the main rivalry. That gives most risk of monopoly power and higher prices.');
    } },
    { skill: 'mergers', gen: function () {
      var a = rint(15, 40) * 10, b = rint(10, 30) * 10, o = rint(30, 80) * 10, tot = a + b + o;
      while ((a + b) * 100 % tot !== 0) { o += 10; tot = a + b + o; if (o > 2000) break; }
      var sh = R.roundDp((a + b) / tot * 100, 1);
      return N('In a country’s cement market, yearly sales are: Firm X ' + money(a) + 'm, Firm Y ' + money(b) + 'm, and all other firms together ' + money(o) + 'm. Firms X and Y plan to merge. What market share would the merged firm have, based on sales? Give your answer as a percentage to one decimal place.',
        sh, '%', 'Market share = (' + a + ' + ' + b + ') ÷ ' + num(tot) + ' × 100 = ' + (a + b) + ' ÷ ' + num(tot) + ' × 100 = ' + sh.toFixed(1) + '%. A regulator looks closely at mergers that create a large market share.',
        0.05, sh.toFixed(1));
    } },
    mc('entry', 'A government makes it easier for new firms to get licences to sell electricity to homes. What is the most likely reason?',
      'More firms can enter, so competition rises and bills fall', ['Existing suppliers can then raise the bills they charge homes', 'Less electricity will be used, which cuts pollution', 'The government can then supply all the electricity itself'],
      'Lowering barriers to entry lets new firms compete. More rivals means more choice and less power for any one firm to charge high prices.'),
    mc('entry', 'Which policy would <b>promote</b> competition in a market?',
      'Removing rules that limit the number of new firms', ['Giving one firm the sole right to supply the market', 'Allowing the two biggest firms to merge', 'Letting firms agree to charge the same price'],
      'Fewer barriers to entry allow new rivals in, which increases competition. The other options reduce it.'),
    mc('protect-consumers', 'A regulator caps the fees banks can charge when a customer goes overdrawn. What is the main reason for this regulation?',
      'To protect consumers from unfairly high charges', ['To raise the profits of the banks that offer overdrafts', 'To reduce competition between banks', 'To increase the number of overdrafts'],
      'Where customers have little power to avoid a charge, a cap protects them from being exploited. Protecting consumer interests is one aim of regulation.'),
    mc('protect-consumers', 'Why might a government ban firms in the same market from agreeing to charge the same high price?',
      'Agreed prices remove competition, so consumers pay more', ['Agreed prices make firms compete harder with each other on price', 'Agreed prices always lower the profits of the firms', 'Agreed prices help new firms to enter the market'],
      'If rivals agree a price instead of competing, customers lose the benefit of competition and pay more. Banning this protects consumers and promotes competition.'),
    mc('protect-consumers', 'Which is an example of consumer protection regulation?',
      'Banning hidden fees that are not shown in the advertised price', ['Allowing the largest firm to buy all its rivals', 'Letting firms in the same market agree their prices with each other', 'Removing all safety checks on products'],
      'Consumer protection laws ban unfair practices, such as hiding charges, so buyers can compare prices fairly.'),
    mc('protect-consumers', 'Which action limits the power of an existing monopoly water supplier?',
      'Capping the prices it can charge households', ['Allowing it to buy the only other supplier in the area', 'Removing all checks on its water quality', 'Letting it set any price it chooses'],
      'A price cap stops the monopoly using its power to overcharge customers who cannot switch supplier.'),
    mc('evaluation', 'Claim: “Blocking mergers always benefits consumers.” Which is the best counter-argument?',
      'A merged firm might gain economies of scale and pass on lower prices', ['Mergers can reduce the amount of competition between firms in a market', 'A dominant firm may raise its prices', 'A merged firm may have less reason to innovate'],
      'The other options support the claim. A larger firm may cut costs per unit through economies of scale, and consumers could gain if some of those savings reach prices.'),
    mc('evaluation', 'When judging whether a regulator should allow a takeover, which factor would matter <b>most</b>?',
      'The market share the combined firm would have', ['The colour of the firms’ logos', 'How long ago each of the two firms was first founded', 'The names of the firms’ directors'],
      'The bigger the combined market share, the greater the risk of monopoly power, higher prices and less choice for consumers.')
  ] };
})();
