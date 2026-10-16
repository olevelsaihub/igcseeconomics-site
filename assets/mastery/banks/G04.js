/* Group G04 mastery bank: GDP, the economic cycle and inflation; Unemployment, poverty and fiscal policy. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // Round half up after removing binary noise (3.1249999999 -> 3.125 -> 3.13).
  function rd(x, dp) { return R.roundDp(Number(Number(x).toPrecision(12)), dp); }
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sample(a, n) { return shuf(a).slice(0, n); }
  function commas(x, dp) {
    var v = Math.abs(x) < 1e-9 ? 0 : Math.round(x * 1e6) / 1e6;
    var s = dp == null ? String(v) : Number(x).toFixed(dp), neg = s.charAt(0) === '-';
    if (neg) s = s.slice(1);
    var p = s.split('.');
    p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '-' : '') + p.join('.');
  }
  function money(x, dp, cur) { cur = cur || '$'; return (x < 0 ? '-' : '') + cur + commas(Math.abs(x), dp); }
  function pct(x) { return commas(x, 2) + '%'; }
  function f1(x) { return rd(x, 1).toFixed(1); }
  function f2(x) { return rd(x, 2).toFixed(2); }
  function uniq(a) { var seen = {}; return a.every(function (x) { var k = String(x).toLowerCase(); if (seen[k]) return false; seen[k] = 1; return true; }); }
  // Static single-answer item: the first option is correct (the engine shuffles options).
  function S(skill, q, right, wrong, why, extra) {
    var o = { skill: skill, kind: 'mcq', q: q, options: [right].concat(wrong), answer: 0, why: why };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  function MC(q, right, wrong, why, extra) {
    var o = { kind: 'mcq', q: q, options: [right].concat(wrong), answer: 0, why: why };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  // Select-all item: `right` options are all correct, `wrong` options are not.
  function MU(skill, q, right, wrong, why) {
    return { skill: skill, kind: 'multi', q: q, options: right.concat(wrong), answers: right.map(function (_, i) { return i; }), why: why };
  }
  function NUM(q, answer, unit, why, tol, display) {
    var o = { kind: 'num', q: q, answer: answer, unit: unit, why: why };
    if (tol != null) o.tol = tol;
    if (display) o.display = display;
    return o;
  }
  function table(head, rows) {
    return '<table class="mc-table"><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  var LANDS = ['Arvenia', 'Belmora', 'Corvana', 'Dalstria', 'Eskara', 'Feranor', 'Galdia', 'Halvia', 'Istrany', 'Kestria', 'Lumeria', 'Marovia', 'Nortavia', 'Pellara', 'Quorin', 'Ruvala', 'Sereth', 'Taluna', 'Ulvenia', 'Valoria', 'Westmark', 'Zandor'];
  function lands(n) { return sample(LANDS, n); }
  var PHASES = ['Boom', 'Downturn', 'Recession', 'Recovery'];

  /* ---------------- ECO-T21-08 Inflation and deflation: meaning, measurement and causes ---------------- */
  B['ECO-T21-08'] = { title: 'Inflation and deflation: meaning, measurement and causes', items: [
    S('define', 'Which of the following is the best definition of <b>inflation</b>?',
      'A sustained rise in the general price level over time',
      ['A rise in the price of one popular product in a month', 'An increase in the total output of goods and services', 'A rise in the number of goods that households buy'],
      'Inflation is about the <b>general</b> price level (the average of many prices), and the rise must continue over time. One product getting dearer is not inflation, and more output is economic growth.'),
    S('define', 'Which of the following is the best definition of <b>deflation</b>?',
      'A fall in the general price level over time',
      ['A fall in the rate of inflation while prices still rise', 'A fall in real GDP for two consecutive quarters', 'A fall in the price of a single imported good'],
      'Deflation means the average price level actually falls. A lower but still positive inflation rate (prices rising more slowly) is not deflation, and falling GDP is a recession.'),
    S('define', 'The inflation rate in Belmora falls from 6% to 2% over a year. Which statement is correct?',
      'Prices are still rising, but more slowly than before',
      ['Belmora is now experiencing deflation', 'The general price level has fallen by 4%', 'Prices are now lower than they were a year ago'],
      'An inflation rate of 2% is still positive, so the general price level is still going up, only at a slower rate. Deflation would need a negative rate.'),
    S('define', 'Over the last year the consumer price index (CPI) in Nortavia fell by 1.2%. What does this show?',
      'Deflation',
      ['Demand-pull inflation', 'Cost-push inflation', 'Economic growth'],
      'A fall in the CPI means the average price of the typical basket has fallen, which is deflation.'),
    S('define', 'What is meant by <b>demand-pull inflation</b>?',
      'Total spending grows faster than firms can supply, pulling prices up',
      ['Firms face higher costs and pass them on as higher prices', 'The general price level falls because total spending is lower than output', 'One good becomes dearer because it is fashionable'],
      'Demand-pull inflation starts with spending: when households, firms and the government want to buy more than the economy can produce, the general price level is pulled up.'),
    S('define', 'What is meant by <b>cost-push inflation</b>?',
      'Rising production costs are passed on by firms as higher prices',
      ['Extra spending in the economy pulls up the price level', 'A fall in the price level caused by cheaper imports', 'A rise in output per worker that pushes down the average level of prices'],
      'Cost-push inflation starts with firms’ costs, such as wages, energy or raw materials. Firms raise prices to protect their profits, so the general price level rises.'),
    S('cpi', 'The statistics office of Ruvala publishes a consumer price index (CPI) every month. What is it mainly used to work out?',
      'The rate at which the general price level is changing',
      ['How quickly the country’s real output is growing', 'The share of the labour force without a job', 'The value of the currency against the US dollar'],
      'The CPI is the standard measure of inflation. Growth is measured with GDP and unemployment with the ILO method.'),
    S('cpi', 'What does a consumer price index (CPI) track?',
      'The prices of a typical basket of goods and services households buy',
      ['The total value of all goods and services produced in the country in a year', 'The prices of goods that the country sells to other countries', 'The wages paid to workers in the largest firms'],
      'The CPI follows the cost of a fixed “basket” of the items a typical household buys, such as food, transport, clothing and housing costs.'),
    S('cpi', 'Why does a CPI use a basket of hundreds of items rather than the price of one product?',
      'So it reflects the general price level, not just one price',
      ['So it can also measure the value of national output', 'Because the price of a single product never changes', 'So it shows how many workers are unemployed'],
      'Inflation is a rise in the <b>general</b> price level. A wide basket averages out the ups and downs of single prices.'),
    S('cpi', 'Between 2025 and 2026 the CPI in Taluna rose. What does this tell you?',
      'The average price of the basket has risen',
      ['Every single price in the basket has risen', 'Households are buying more goods than before', 'Real GDP in Taluna must have risen'],
      'A higher CPI shows the <b>average</b> price of the basket went up. Some individual prices may have fallen while others rose more.'),
    S('classify-cause', 'Which of these is the most likely cause of <b>cost-push</b> inflation?',
      'A sharp rise in world oil prices',
      ['A rise in labour productivity', 'A cut in the rate of income tax', 'A rise in consumer borrowing'],
      'Oil is a cost for transport and factories, so firms’ costs rise and they pass them on. A tax cut and more borrowing raise spending (demand-pull), and higher productivity lowers costs.'),
    S('classify-cause', 'Which of these is the most likely cause of <b>demand-pull</b> inflation?',
      'Households spend much more after a cut in income tax',
      ['Factories across the country pay double for their electricity', 'Labour productivity in manufacturing rises', 'Firms pay more for imported steel'],
      'A tax cut raises disposable income, so spending rises faster than firms can supply. Dearer electricity and steel are cost-push causes; higher productivity lowers costs.'),
    MU('classify-cause', 'Which of the following are likely causes of <b>cost-push</b> inflation?',
      ['A rise in wage rates across industry', 'Higher prices for imported raw materials', 'A large rise in energy costs for firms'],
      ['A rise in government spending on new schools', 'An improvement in labour productivity'],
      'Wages, raw materials and energy are all costs of production, so rises in them push prices up. Government spending adds to demand (demand-pull), and higher productivity reduces costs per unit.'),
    MU('classify-cause', 'Which of the following are likely causes of <b>demand-pull</b> inflation?',
      ['Lower interest rates encourage households to borrow and spend', 'The government spends heavily on new roads and bridges', 'Rising consumer confidence leads to more spending'],
      ['The price of imported machine parts rises', 'Workers become more productive'],
      'Demand-pull inflation comes from extra spending. Dearer imported parts are a cost-push cause, and higher productivity lowers costs and so eases inflation.'),
    S('classify-cause', 'Which of the following would most likely <b>reduce</b> inflationary pressure?',
      'An improvement in labour productivity',
      ['A rise in wage rates greater than productivity', 'An increase in government spending', 'A fall in interest rates'],
      'When each worker produces more, the cost of making each unit falls, so firms have less need to raise prices. The other options add to costs or to spending.'),
    S('classify-cause', 'Which of the following is most likely to cause deflation in Westmark?',
      'A large and lasting fall in spending across the economy',
      ['A rise in wages across many industries', 'A sharp rise in the world price of oil', 'A big rise in government spending on new roads and schools'],
      'If total spending falls a long way, firms cut prices to sell their goods, so the general price level can fall. The other options push prices up.'),
    { skill: 'classify-cause', gen: function () {
      var c = pick(LANDS);
      var pool = [
        ['A poor harvest doubles the price of wheat that bakeries and food firms in ' + c + ' buy.', 'cost'],
        ['The price of fertiliser and animal feed bought by farms in ' + c + ' rises by 40%.', 'cost'],
        ['The cost of shipping imported components to factories in ' + c + ' rises by 40%.', 'cost'],
        ['Electricity prices for businesses in ' + c + ' rise by a third.', 'cost'],
        ['The government of ' + c + ' cuts income tax and households increase their spending sharply.', 'demand'],
        ['Banks in ' + c + ' lend much more freely, and shoppers borrow to buy cars and furniture.', 'demand'],
        ['Foreign demand for ' + c + '’s goods soars while its factories are already working at full capacity.', 'demand'],
        ['Rising house prices make households in ' + c + ' feel richer, and they spend much more while firms struggle to meet existing orders.', 'demand']
      ];
      var s = pick(pool), cost = s[1] === 'cost';
      return MC(s[0] + ' Which type of inflation is most likely to result?',
        cost ? 'Cost-push inflation' : 'Demand-pull inflation',
        [cost ? 'Demand-pull inflation' : 'Cost-push inflation', 'Deflation', 'No inflation, because prices only change in one market'],
        cost ? 'This raises firms’ costs of production. Firms pass the higher costs on as higher prices, so it is cost-push inflation.'
             : 'This raises total spending faster than firms can increase output, so prices are pulled up: demand-pull inflation.');
    } },
    { skill: 'classify-cause', gen: function () {
      var c = pick(LANDS), demand = Math.random() < 0.5;
      var a = rint(6, 11), b = rint(1, 3), e = rint(18, 35), w = rint(7, 12);
      var rows = demand
        ? [['Growth of consumer spending', a + '%'], ['Growth of the economy’s capacity to produce', b + '%'], ['Change in energy prices for firms', '+' + rint(1, 2) + '%'], ['Change in average wages', '+' + b + '%']]
        : [['Growth of consumer spending', rint(0, 1) + '%'], ['Growth of the economy’s capacity to produce', b + '%'], ['Change in energy prices for firms', '+' + e + '%'], ['Change in average wages', '+' + w + '%']];
      return MC('The table shows data for ' + c + ' last year.' + table(['Indicator', 'Value'], rows) + 'Which type of inflation is ' + c + ' most likely to be experiencing?',
        demand ? 'Demand-pull inflation' : 'Cost-push inflation',
        [demand ? 'Cost-push inflation' : 'Demand-pull inflation', 'Deflation', 'Disinflation caused by falling costs'],
        demand ? 'Spending grew by ' + a + '% while the capacity to produce grew by only ' + b + '%, and costs barely changed. Spending is outrunning supply, so this is demand-pull inflation.'
               : 'Energy prices rose by ' + e + '% and wages by ' + w + '% while spending hardly grew. Firms’ costs are rising and being passed on, so this is cost-push inflation.');
    } },
    S('chain', 'A shortage of imported cotton means clothing factories in Valoria pay much more for fabric. What is the most likely next step?',
      'Clothing firms raise their prices, adding to cost-push inflation',
      ['Demand for clothes rises, causing demand-pull inflation', 'Clothing firms cut prices to attract customers, causing deflation', 'The CPI falls because fewer clothes are produced'],
      'Fabric is a cost of production. Higher costs squeeze profits, so clothing firms pass them on as higher prices, which raises the general price level: cost-push.'),
    S('chain', 'The government of Pellara raises spending on roads and hospitals when firms are already producing close to their limit. Which chain is most likely?',
      'Total demand rises faster than supply, so prices are pulled up',
      ['Firms’ production costs fall sharply, so the general price level falls', 'Imports fall, so the country enters deflation', 'Unemployment rises, so wages and prices fall'],
      'Government spending adds to total demand. If firms cannot raise output much more, the extra demand pushes up prices: demand-pull inflation.'),
    S('chain', 'Firms in Kestria agree a 12% pay rise for workers with no increase in productivity. Which chain is correct?',
      'Labour cost per unit rises, firms raise prices, cost-push inflation',
      ['Output per worker rises, so firms cut prices and inflation slows down', 'Costs fall, firms cut prices, the economy enters deflation', 'Demand for labour falls, wages fall, the CPI falls'],
      'Without higher productivity, each unit of output now costs more in wages. Firms pass the higher cost on in prices, so the general price level rises.'),
    S('chain', 'Galdia imports almost all of its fuel. The price of fuel bought from abroad rises sharply. Why might this cause inflation in Galdia?',
      'Transport and production costs rise, and firms pass them on',
      ['Households have more money left over to spend on fuel and travel', 'Galdia’s firms become more productive', 'Fuel is not included in a CPI basket'],
      'Fuel is a cost for almost every firm (transport, heating, machines). When it gets dearer, firms raise their prices, so this is a cost-push cause.')
  ] };

  /* ---------------- ECO-T21-03 GDP and economic growth: meaning, uses and limits ---------------- */
  B['ECO-T21-03'] = { title: 'GDP and economic growth: meaning, uses and limits', items: [
    S('define', 'Which of the following best describes gross domestic product (GDP)?',
      'The value of all goods and services a country produces in a year',
      ['The value of all goods and services a country exports in a year', 'The value of all goods and services households buy in a year', 'The value of all goods and services that a country imports in a year'],
      'GDP measures <b>output produced</b> within the country over a time period, usually a year. Exports, imports and household spending are only parts of the picture.'),
    S('define', 'What is meant by <b>economic growth</b>?',
      'An increase in a country’s real output over a period of time',
      ['An increase in the general price level over a period of time', 'An increase in the number of people with a job', 'An increase in the value of exports compared with imports'],
      'Economic growth is a rise in real GDP (output adjusted for inflation). A rising price level is inflation, not growth.'),
    S('define', 'What is <b>real</b> GDP?',
      'GDP adjusted to remove the effect of inflation',
      ['GDP divided by the total size of the country’s population', 'GDP including the hidden economy', 'GDP converted into US dollars'],
      'Real GDP takes out price rises, so it shows the true change in the amount produced. GDP divided by population is GDP per capita.'),
    S('define', 'A student is asked what GDP means. Which answer would earn both marks?',
      'The value of all goods and services produced in a country in one year',
      ['The value of all goods and services produced in a country', 'The total amount that households spend on goods and services each year', 'The amount of money the government spends in one year'],
      'Mark schemes want two parts: the value of goods and services <b>produced</b>, and a time period such as a year. The second option misses the time period.'),
    S('measure', 'Statisticians in Ruvala want to measure how fast the economy is growing. Which figure should they use?',
      'The change in real GDP',
      ['The change in the consumer price index', 'The ILO unemployment rate', 'Inflows of foreign direct investment'],
      'Growth is measured by the change in GDP. The CPI measures inflation, the ILO method measures unemployment, and FDI is investment from abroad.'),
    { skill: 'measure', gen: function () {
      var c = pick(LANDS), n = rint(4, 12), i = rint(2, 12);
      while (Math.abs(n - i) < 2) i = rint(2, 12);
      var rise = n > i;
      return MC('Nominal GDP in ' + c + ' (measured at current prices) rose by ' + n + '% last year. Over the same year, the general price level rose by ' + i + '%. What happened to real output?',
        rise ? 'Real output rose, but by less than ' + n + '%' : 'Real output fell',
        [rise ? 'Real output fell' : 'Real output rose, but by less than ' + n + '%', 'Real output rose by more than ' + n + '%', 'Real output was exactly unchanged'],
        rise ? 'Part of the ' + n + '% rise is just higher prices (' + i + '%). Prices rose by less than nominal GDP, so the amount produced did rise, but by less than ' + n + '%.'
             : 'Prices rose by ' + i + '%, more than the ' + n + '% rise in nominal GDP. So the whole rise is due to higher prices and the amount actually produced fell.');
    } },
    S('measure', 'Nominal GDP in Sereth rose by 9% in a year when prices rose by 8%. Which limitation of GDP figures does this show?',
      'Inflation can make nominal GDP overstate real growth',
      ['GDP ignores the size of the population', 'GDP leaves out output produced in the hidden (informal) economy', 'GDP ignores damage to the environment'],
      'Most of the 9% rise came from higher prices, not more output. Only real GDP, which removes inflation, shows the true growth (about 1% here).'),
    S('strengths', 'Which of the following is a strength of using GDP to measure economic growth?',
      'Almost every country collects it, so growth can be compared',
      ['It records all activity, including unpaid work at home', 'It shows exactly how income is shared between rich and poor households', 'It includes the cost of pollution caused by production'],
      'GDP is calculated in a similar way all over the world, so growth can be compared over time and between countries. The other options are things GDP does <b>not</b> do.'),
    S('strengths', 'Why might a government find GDP figures useful when planning?',
      'They show whether output and incomes are rising or falling',
      ['They show exactly which households are living in absolute poverty', 'They measure the level of air and water pollution', 'They give the inflation rate without any other data'],
      'Rising GDP usually means rising output and incomes, so governments use it to judge the state of the economy and plan spending and taxes.'),
    S('strengths', 'Which statement is a <b>benefit</b>, not a limitation, of GDP as a measure of growth?',
      'It allows growth rates to be compared over time',
      ['It leaves out output from the hidden economy', 'It does not show how income is distributed', 'It can be distorted by rising prices'],
      'Being able to compare growth over time and between countries is the main benefit. The other three are well-known limitations.'),
    { skill: 'strengths', gen: function () {
      var c = lands(2), a = rint(1, 3), b = rint(5, 8);
      if (Math.random() < 0.5) { var t = a; a = b; b = t; }
      var fast = a > b ? c[0] : c[1];
      return MC('Real GDP grew by ' + a + '% in ' + c[0] + ' and by ' + b + '% in ' + c[1] + ' last year. What can you judge from these figures alone?',
        'Output grew faster in ' + fast,
        ['People in ' + fast + ' are richer on average', fast + ' has lower inflation', 'Income is shared more equally in ' + fast],
        'GDP growth figures let you compare how fast output grew. They say nothing on their own about average income levels, inflation or how income is shared.');
    } },
    MU('limits', 'Which of the following are limitations of GDP as a measure of growth or living standards?',
      ['Output in the hidden economy is left out', 'It does not show how income is shared', 'It ignores damage to the environment', 'Rising prices can make nominal GDP look bigger'],
      ['Very few countries collect GDP figures', 'It counts only the value of exports'],
      'The hidden economy, distribution, environmental damage and inflation are all real limits. GDP is collected by almost every country and counts all output, not just exports.'),
    S('limits', 'In Corvana many taxi drivers and market traders are paid in cash and do not declare their earnings. What does this mean for Corvana’s GDP figures?',
      'Recorded GDP understates the true value of output',
      ['Recorded GDP overstates the true value of output', 'Recorded GDP is unaffected because cash is counted', 'Recorded GDP rises because tax revenue rises'],
      'Undeclared work is part of the hidden economy. It is real output but is not recorded, so official GDP is lower than the true level.'),
    S('limits', 'Many families in Lumeria grow their own food rather than buying it. Why might Lumeria’s GDP give a misleading picture?',
      'Food that is grown and eaten at home is usually left out of GDP',
      ['Food is never counted in any country’s GDP', 'Home-grown food is counted twice: once when grown and once when eaten', 'Home-grown food raises the inflation rate'],
      'Subsistence farming produces real output, but because it is not sold it is often missing from GDP, so recorded output is too low.'),
    { skill: 'limits', gen: function () {
      var c = pick(LANDS), g = rint(2, 6), p = rint(1, 7);
      while (Math.abs(g - p) < 2) p = rint(1, 7);
      var fall = p > g;
      return MC('Real GDP in ' + c + ' rose by ' + g + '% last year, while its population grew by ' + p + '%. Which statement is most accurate?',
        fall ? 'Output per person has probably fallen' : 'Output per person has probably risen',
        [fall ? 'Output per person has probably risen' : 'Output per person has probably fallen', 'Inflation must have fallen', 'The hidden economy must have shrunk'],
        fall ? 'The population grew faster (' + p + '%) than output (' + g + '%), so there is less output for each person. GDP alone ignores population size.'
             : 'Output grew faster (' + g + '%) than the population (' + p + '%), so output per person rose. GDP alone would not show this; population matters.');
    } },
    S('limits', 'GDP in Istrany grew by 6%, but most of the extra income went to the richest 5% of households. Which limitation of GDP does this show?',
      'It does not show how income is distributed',
      ['It ignores changes in the size of the population', 'It is distorted by inflation', 'It leaves out the hidden economy'],
      'Average output rose, but most people may be no better off. GDP says nothing about how income is shared between rich and poor.'),
    S('limits', 'Rapid growth in Taluna came from new coal mines and steel works, and air quality fell sharply. Which limitation of GDP does this show?',
      'GDP does not count the environmental costs of production',
      ['GDP cannot be compared between countries', 'GDP greatly overstates the output produced in the hidden economy', 'GDP is measured only once every ten years'],
      'The mines and steel add to GDP, but the pollution and damage to health are not subtracted, so GDP can overstate gains in living standards.'),
    S('limits', 'A student writes: “GDP is the value of goods and services a country sells abroad.” What is wrong with this?',
      'GDP is all output produced, not just exports',
      ['GDP is the value of goods bought from abroad', 'GDP measures only goods, not services', 'GDP is measured in quantities, not in money'],
      'Exports are only part of output. GDP is the value of <b>everything</b> produced in the country over a year.'),
    S('limits', 'Parents across Dalstria look after their own children at home without being paid. How is this treated in GDP?',
      'It is left out of GDP, even though it has real value',
      ['It is included at the wage of a paid childminder', 'It is included as part of government spending', 'It is counted as an import of services'],
      'Unpaid work is not bought or sold, so it is not recorded in GDP. This is one reason GDP misses some of the activity that affects living standards.'),
    S('limits', 'Which activity is part of the hidden (informal) economy?',
      'A builder paid in cash who does not declare the income',
      ['A teacher paid a monthly salary by the government, with tax deducted', 'A car firm that exports cars legally', 'A shop that charges and pays VAT'],
      'The hidden economy is activity that is not declared to the authorities, so it is missing from official GDP. The others are recorded.'),
    MU('limits', 'Which of the following could make rising GDP <b>overstate</b> the improvement in people’s living standards?',
      ['Pollution rising sharply as factories expand', 'The population growing faster than output', 'Prices rising, so nominal GDP grows faster than real GDP'],
      ['The hidden economy growing faster than recorded output', 'More unpaid voluntary work being done'],
      'Pollution, faster population growth and inflation make GDP look better than living standards really are. A growing hidden economy or more unpaid work means GDP <b>understates</b> true activity.'),
    S('judge', 'A rise in GDP is most likely to mean higher living standards for most people when',
      'real output per person rises and the gains are widely shared',
      ['prices rise faster than output', 'the population grows faster than output', 'the extra output comes with heavy pollution and damage to health'],
      'Living standards improve when there is more real output per person and most households share in it. Each of the other cases is a reason GDP can mislead.'),
    S('judge', 'The hidden economy in Pellara grows from 20% to 30% of all activity, while recorded GDP grows by 2%. Which conclusion is most reasonable?',
      'The true growth of output is probably higher than 2%',
      ['The true growth of output is probably lower than 2%', 'Recorded GDP is now more accurate than before', 'Pellara must be in a recession'],
      'More activity is going unrecorded, so official GDP misses a growing share of output. True growth is likely to be greater than the recorded 2%.')
  ] };

  /* ---------------- ECO-CALC-16 GDP per capita ---------------- */
  var PC_WHY = 'GDP per capita = GDP ÷ population. ';
  B['ECO-CALC-16'] = { title: 'GDP per capita', items: [
    { skill: 'calculate', gen: function () {
      var c = pick(LANDS), pop = rint(42, 950) / 10, pc = rint(1500, 45000), gdp = Math.round(pop * pc), ans = rd(gdp / pop, 2);
      return NUM('In 2025, ' + c + '’s GDP was $' + commas(gdp) + ' million and its population was ' + f1(pop) + ' million. Work out ' + c + '’s GDP per capita in 2025. Give your answer in $ to two decimal places.',
        ans, '$', PC_WHY + 'Both figures are in millions, so the millions cancel: ' + commas(gdp) + ' ÷ ' + f1(pop) + ' = $' + commas(ans, 2) + ' per person.', 0.005, commas(ans, 2));
    } },
    { skill: 'calculate', gen: function () {
      var c = pick(LANDS), pop = rint(30, 650) / 10, bn = rd(pop * rint(1500, 60000) / 1000, 1), ans = rd(bn * 1000 / pop, 2);
      return NUM(c + ' has a GDP of $' + commas(bn, 1) + ' billion and a population of ' + f1(pop) + ' million. Work out its GDP per capita in $, to two decimal places.',
        ans, '$', PC_WHY + 'First match the units: $' + commas(bn, 1) + ' billion = $' + commas(rd(bn * 1000, 1)) + ' million. Then ' + commas(rd(bn * 1000, 1)) + ' million ÷ ' + f1(pop) + ' million = $' + commas(ans, 2) + '.', 0.005, commas(ans, 2));
    } },
    { skill: 'units', gen: function () {
      var isl = pick(['Coral Bay Islands', 'the island of Marisol', 'the Tamberry Isles', 'the island state of Kelvara']), bn = rint(80, 640) / 100, pop = rint(45, 580) * 1000;
      var ans = rd(bn * 1e9 / pop, 2);
      return NUM('The GDP of ' + isl + ' is $' + f2(bn) + ' billion and its population is ' + commas(pop) + '. Work out GDP per capita in $, to two decimal places. (1 billion = 1,000,000,000)',
        ans, '$', PC_WHY + '$' + f2(bn) + ' billion = $' + commas(Math.round(bn * 1e9)) + '. Then ' + commas(Math.round(bn * 1e9)) + ' ÷ ' + commas(pop) + ' = $' + commas(ans, 2) + '.', 0.005, commas(ans, 2));
    } },
    { skill: 'units', gen: function () {
      var c = pick(LANDS), tr = rint(120, 480) / 100, pop = rint(400, 3300) / 10;
      while (tr * 1e6 / pop > 70000 || tr * 1e6 / pop < 4000) pop = rint(400, 3300) / 10;
      var ans = rd(tr * 1e6 / pop, 2);
      return NUM(c + ' has a GDP of $' + f2(tr) + ' trillion and a population of ' + f1(pop) + ' million. Work out its GDP per capita in $, to two decimal places. (1 trillion = 1,000,000 million)',
        ans, '$', PC_WHY + '$' + f2(tr) + ' trillion = $' + commas(Math.round(tr * 1e6)) + ' million. Then ' + commas(Math.round(tr * 1e6)) + ' million ÷ ' + f1(pop) + ' million = $' + commas(ans, 2) + '.', 0.005, commas(ans, 2));
    } },
    { skill: 'calculate', gen: function () {
      var c = pick(LANDS), pop = rint(1200, 9800) * 1000 + rint(0, 999), gdp = rint(8000, 99000) * 1e6 + rint(0, 999) * 1e3, ans = rd(gdp / pop, 2);
      return NUM('Official figures for ' + c + ' show GDP of $' + commas(gdp) + ' and a population of ' + commas(pop) + '. Work out GDP per capita in $, to two decimal places.',
        ans, '$', PC_WHY + commas(gdp) + ' ÷ ' + commas(pop) + ' = $' + commas(ans, 2) + ' per person.', 0.005, commas(ans, 2));
    } },
    { skill: 'powers-of-ten', gen: function () {
      var c = pick(LANDS), pop = pick([2, 4, 5, 8, 10, 20, 25, 40, 50]), pc = rint(12, 600) * 100, bn = rd(pc * pop / 1000, 3);
      return MC('GDP in ' + c + ' is $' + commas(bn) + ' bn (1 bn = 1,000,000,000) and ' + pop + ' million people live there. What is its GDP per capita?',
        money(pc), [money(pc / 10), money(pc * 10), money(pc * 100)],
        PC_WHY + '$' + commas(bn) + ' bn = $' + commas(bn * 1000) + ' million, so ' + commas(bn * 1000) + ' million ÷ ' + pop + ' million = ' + money(pc) + '. The other options are out by a power of ten.');
    } },
    { skill: 'powers-of-ten', gen: function () {
      var c = pick(LANDS), bn = rint(21, 480), pop = rint(32, 95) / 10;
      return MC(c + ' has a GDP of $' + bn + ' billion and a population of ' + f1(pop) + ' million. Which calculation gives its GDP per capita in dollars?',
        '$' + commas(bn * 1000) + ' million ÷ ' + f1(pop) + ' million',
        [f1(pop) + ' million ÷ $' + commas(bn * 1000) + ' million', '$' + bn + ' million ÷ ' + f1(pop) + ' million', '$' + commas(bn * 1000) + ' million × ' + f1(pop) + ' million'],
        'Put both numbers in the same unit (1 billion = 1,000 million), then divide GDP by population. Dividing population by GDP, or leaving billions unconverted, gives the wrong answer.');
    } },
    { skill: 'powers-of-ten', gen: function () {
      var c = pick(LANDS), popK = rint(150, 900), pc = rint(30, 750) * 100, gdpM = rd(pc * popK / 1000, 3);
      return MC('A region of ' + c + ' has GDP of $' + commas(gdpM) + ' million and a population of ' + commas(popK) + ' thousand. What is its GDP per capita?',
        money(pc), [money(rd(pc / 1000, 2), 2), money(pc * 1000), money(pc / 10)],
        '$' + commas(gdpM) + ' million = $' + commas(pc * popK * 1000) + ' and ' + commas(popK) + ' thousand = ' + commas(popK * 1000) + ' people. ' + commas(pc * popK * 1000) + ' ÷ ' + commas(popK * 1000) + ' = ' + money(pc) + '.');
    } },
    { skill: 'powers-of-ten', gen: function () {
      var c = pick(LANDS), popB = pick([1.2, 1.4, 1.5, 1.6, 2.0, 2.5]), pc = rint(8, 60) * 250, tr = rd(pc * popB / 1000, 3);
      return MC(c + ' has a population of ' + popB.toFixed(1) + ' billion and a GDP of $' + commas(tr) + ' trillion (1 trillion = 1,000 billion). What is its GDP per capita?',
        money(pc), [money(pc / 1000, pc % 1000 ? 2 : 0), money(pc * 10), money(pc / 10)],
        '$' + commas(tr) + ' trillion = $' + commas(rd(tr * 1000, 1)) + ' billion. ' + commas(rd(tr * 1000, 1)) + ' billion ÷ ' + popB.toFixed(1) + ' billion = ' + money(pc) + ' per person.');
    } },
    { skill: 'find-the-error', gen: function () {
      var c = pick(LANDS), bn = rint(180, 950) / 10, pop = rint(41, 98) / 10, wrongV = rd(bn / pop, 2);
      return MC(c + ' has GDP of $' + f1(bn) + ' billion and a population of ' + f1(pop) + ' million. A student works out ' + f1(bn) + ' ÷ ' + f1(pop) + ' and writes “GDP per capita = $' + f2(wrongV) + '”. What mistake has the student made?',
        'Billions were not converted to millions before dividing',
        ['Population was divided by GDP instead of GDP by population', 'Real GDP should have been used instead of nominal GDP', 'The answer should have been multiplied by 100'],
        'GDP is in billions and population in millions, so the units must be matched first: $' + commas(rd(bn * 1000, 1)) + ' million ÷ ' + f1(pop) + ' million = $' + commas(rd(bn * 1000 / pop, 2), 2) + ', which is 1,000 times bigger.');
    } },
    { skill: 'compare', gen: function () {
      var c = lands(2), popA = rint(60, 140), popB = rint(8, 25), pcA = rint(3, 9) * 1000 + rint(0, 9) * 100, pcB = pcA * (rint(15, 30) / 10);
      pcB = Math.round(pcB / 100) * 100;
      var gA = rd(popA * pcA / 1000, 1), gB = rd(popB * pcB / 1000, 1);
      while (gB >= gA) { popA += 20; gA = rd(popA * pcA / 1000, 1); }
      return MC(table(['Country', 'GDP ($bn)', 'Population (million)'], [[c[0], commas(gA, 1), popA], [c[1], commas(gB, 1), popB]]) + 'Which statement is correct?',
        c[1] + ' has the higher GDP per capita',
        [c[0] + ' has the higher GDP per capita', 'Both countries have the same GDP per capita', 'GDP per capita cannot be found without the inflation rate'],
        c[0] + ': ' + commas(rd(gA * 1000, 0)) + ' million ÷ ' + popA + ' million = ' + money(rd(gA * 1000 / popA, 0)) + '. ' + c[1] + ': ' + commas(rd(gB * 1000, 0)) + ' million ÷ ' + popB + ' million = ' + money(rd(gB * 1000 / popB, 0)) + '. ' + c[0] + ' has the bigger total GDP, but it is shared among many more people.');
    } },
    { skill: 'compare', gen: function () {
      var names, rows, pcs, gd, pops, best, ok = false;
      while (!ok) {
        names = lands(4); pops = names.map(function () { return rint(5, 120); }); pcs = names.map(function () { return rint(15, 260) * 200; });
        gd = names.map(function (_, i) { return rd(pops[i] * pcs[i] / 1000, 1); });
        var real = gd.map(function (g, i) { return g * 1000 / pops[i]; });
        best = real.indexOf(Math.max.apply(null, real));
        var sorted = real.slice().sort(function (a, b) { return b - a; });
        ok = sorted[0] > sorted[1] * 1.08 && gd.indexOf(Math.max.apply(null, gd)) !== best;
      }
      rows = names.map(function (n, i) { return [n, commas(gd[i], 1), pops[i]]; });
      return MC(table(['Country', 'GDP ($bn)', 'Population (million)'], rows) + 'Which country has the highest GDP per capita?',
        names[best], names.filter(function (_, i) { return i !== best; }),
        'Divide each GDP (in $ million) by its population (in millions): ' + names.map(function (n, i) { return n + ' ' + money(Math.round(gd[i] * 1000 / pops[i])); }).join(', ') + '. The country with the largest total GDP is not the one with the most output per person.');
    } },
    { skill: 'select-data', gen: function () {
      var names = lands(3), k = rint(0, 2), pops = names.map(function () { return rint(40, 900) / 10; }), gd = pops.map(function (p) { return rd(p * rint(1500, 60000) / 1000, 1); });
      var ans = rd(gd[k] * 1000 / pops[k], 2);
      return NUM(table(['Country', 'GDP ($bn)', 'Population (million)'], names.map(function (n, i) { return [n, commas(gd[i], 1), f1(pops[i])]; })) + 'Using the table, work out the GDP per capita of <b>' + names[k] + '</b> in $, to two decimal places.',
        ans, '$', PC_WHY + names[k] + ': $' + commas(gd[k], 1) + ' bn = $' + commas(rd(gd[k] * 1000, 0)) + ' million; ' + commas(rd(gd[k] * 1000, 0)) + ' ÷ ' + f1(pops[k]) + ' = $' + commas(ans, 2) + '.', 0.005, commas(ans, 2));
    } },
    { skill: 'select-data', gen: function () {
      var c = pick(LANDS), p1 = rint(50, 300) / 10, p2 = rd(p1 + rint(1, 9) / 10, 1), g1 = rint(200, 5000) / 10, g2 = rd(g1 * (1 + rint(1, 8) / 100), 1);
      var ans = rd(g2 * 1000 / p2, 2);
      return NUM('The table shows data for ' + c + '.' + table(['Year', 'GDP ($bn)', 'Population (million)'], [['2024', commas(g1, 1), f1(p1)], ['2025', commas(g2, 1), f1(p2)]]) + 'Work out GDP per capita in <b>2025</b>, in $ to two decimal places.',
        ans, '$', 'Use the 2025 row only. ' + PC_WHY + '$' + commas(rd(g2 * 1000, 0)) + ' million ÷ ' + f1(p2) + ' million = $' + commas(ans, 2) + '.', 0.005, commas(ans, 2));
    } },
    { skill: 'select-data', gen: function () {
      var c = lands(2), pa = rint(3, 40), pb = rint(3, 40), ca = rint(20, 400) * 100, cb = rint(20, 400) * 100;
      while (Math.abs(ca - cb) < 1000) cb = rint(20, 400) * 100;
      var ga = pa * ca, gb = pb * cb, ans = Math.abs(ca - cb), hi = ca > cb ? c[0] : c[1], lo = ca > cb ? c[1] : c[0];
      return NUM(table(['Country', 'GDP ($ million)', 'Population (million)'], [[c[0], commas(ga), pa], [c[1], commas(gb), pb]]) + 'How much higher is GDP per capita in ' + hi + ' than in ' + lo + '? Give your answer in $.',
        ans, '$', c[0] + ': ' + commas(ga) + ' ÷ ' + pa + ' = ' + money(ca) + '. ' + c[1] + ': ' + commas(gb) + ' ÷ ' + pb + ' = ' + money(cb) + '. Difference = ' + money(ans) + '.', null, commas(ans));
    } },
    { skill: 'rearrange', gen: function () {
      var c = pick(LANDS), pc = rint(18, 600) * 100, pop = rint(25, 450) / 10, ans = rd(pc * pop / 1000, 1);
      return NUM(c + ' has a population of ' + f1(pop) + ' million and GDP per capita of ' + money(pc) + '. Work out its total GDP in $ billion, to one decimal place.',
        ans, '$bn', 'GDP = GDP per capita × population = ' + money(pc) + ' × ' + f1(pop) + ' million = $' + commas(rd(pc * pop, 1)) + ' million = $' + commas(ans, 1) + ' billion.', 0.05, commas(ans, 1));
    } },
    { skill: 'rearrange', gen: function () {
      var c = pick(LANDS), pc = rint(15, 450) * 100, pop = rint(15, 650) / 10, gdpM = rd(pc * pop, 1);
      return NUM(c + ' has GDP of $' + commas(gdpM) + ' million and GDP per capita of ' + money(pc) + '. Work out its population in millions, to one decimal place.',
        pop, 'million', 'Population = GDP ÷ GDP per capita = ' + commas(gdpM) + ' million ÷ ' + commas(pc) + ' = ' + f1(pop) + ' million people.', 0.05, f1(pop));
    } },
    { skill: 'units', gen: function () {
      var c = pick(LANDS), gdpM = rint(900, 9800), popK = rint(110, 780), ans = Math.round(gdpM * 1e6 / (popK * 1000));
      return NUM('A province of ' + c + ' produced output worth $' + commas(gdpM) + ' million last year. Its population is ' + commas(popK) + ' thousand. Work out output per person in $, to the nearest dollar.',
        ans, '$', '$' + commas(gdpM) + ' million = $' + commas(gdpM * 1e6) + '; ' + commas(popK) + ' thousand = ' + commas(popK * 1000) + ' people. ' + commas(gdpM * 1e6) + ' ÷ ' + commas(popK * 1000) + ' = $' + commas(rd(gdpM * 1000 / popK, 2), 2) + ', which is $' + commas(ans) + ' to the nearest dollar.', 0.5, commas(ans));
    } },
    { skill: 'units', gen: function () {
      var c = pick(LANDS), popB = rint(105, 145) / 100, tr = rint(150, 1900) / 100, ans = Math.round(tr * 1000 / popB);
      return NUM(c + ' has a population of ' + f2(popB) + ' billion and a GDP of $' + f2(tr) + ' trillion (1 trillion = 1,000 billion). Work out GDP per capita in $, to the nearest dollar.',
        ans, '$', '$' + f2(tr) + ' trillion = $' + commas(rd(tr * 1000, 1)) + ' billion. ' + commas(rd(tr * 1000, 1)) + ' billion ÷ ' + f2(popB) + ' billion = $' + commas(rd(tr * 1000 / popB, 2), 2) + ', which is $' + commas(ans) + ' to the nearest dollar.', 0.5, commas(ans));
    } },
    S('interpret', 'What does GDP per capita measure?',
      'The average output (income) per person in a country',
      ['The total output of a country in a year', 'The output produced by each worker in a factory', 'The share of GDP spent by the government'],
      'Per capita means “per head”. GDP per capita = GDP ÷ population, so it is the average output per person.'),
    S('interpret', 'Why is GDP per capita usually better than total GDP for comparing living standards in a large and a small country?',
      'It allows for the different population sizes',
      ['It removes the effect of inflation on GDP', 'It includes the hidden economy', 'It shows how income is shared between people'],
      'A big country can have a large total GDP simply because it has many people. Dividing by population gives the average per person, which is fairer to compare. It does not remove inflation or show how income is shared.'),
    { skill: 'interpret', gen: function () {
      var c = pick(LANDS), g = rint(2, 7), mode = rint(0, 2), p = mode === 0 ? g : mode === 1 ? g + rint(1, 3) : Math.max(0, g - rint(1, 2));
      var right = mode === 0 ? 'GDP per capita stayed about the same' : mode === 1 ? 'GDP per capita fell' : 'GDP per capita rose';
      var all = ['GDP per capita stayed about the same', 'GDP per capita fell', 'GDP per capita rose'];
      return MC('Last year GDP in ' + c + ' rose by ' + g + '% and its population rose by ' + p + '%. What happened to GDP per capita?',
        right, all.filter(function (x) { return x !== right; }).concat(['GDP per capita rose by ' + (g + p) + '%']),
        mode === 0 ? 'GDP and population grew at the same rate, so output per person was roughly unchanged.'
          : mode === 1 ? 'The population (+' + p + '%) grew faster than GDP (+' + g + '%), so each person’s share of output fell.'
          : 'GDP (+' + g + '%) grew faster than the population (+' + p + '%), so output per person rose.');
    } }
  ] };

  /* ---------------- ECO-CALC-13 Percentage change, including inflation from a price index ---------------- */
  function pch(o, n) { return rd((n - o) * 100 / o, 2); }
  function pchWhy(o, n, fo, fn) { return '(new − old) ÷ old × 100 = (' + fn + ' − ' + fo + ') ÷ ' + fo + ' × 100 = ' + pct(pch(o, n)) + '.'; }
  function pchNum(q, o, n, fo, fn, extra) {
    var a = pch(o, n);
    return NUM(q, a, '%', (extra || '') + pchWhy(o, n, fo, fn), 0.005, f2(a));
  }
  B['ECO-CALC-13'] = { title: 'Percentage change, including inflation from a price index', items: [
    { skill: 'percentage-change', gen: function () {
      var firm = pick(['Brightwell Foods', 'Orla Textiles', 'Kitemark Logistics', 'Sunfield Ceramics', 'Harrow & Lane Builders']), o = rint(40, 95) * 1000 + rint(0, 99) * 10, n = Math.round(o * (1 + rint(25, 180) / 1000) / 10) * 10;
      return pchNum('The profit of ' + firm + ' rose from $' + commas(o) + ' in 2023 to $' + commas(n) + ' in 2025. Work out the percentage change in profit. Give your answer to two decimal places.', o, n, commas(o), commas(n));
    } },
    { skill: 'negative-change', gen: function () {
      var c = pick(LANDS), o = rint(18, 40) / 4, n = o - rint(1, 6) / 4;
      return pchNum('The central bank of ' + c + ' cut its interest rate from ' + o.toFixed(2) + '% to ' + n.toFixed(2) + '%. Work out the percentage change in the interest rate, to two decimal places.', o, n, o.toFixed(2), n.toFixed(2), 'A fall gives a negative answer. ');
    } },
    { skill: 'negative-change', gen: function () {
      var c = pick(LANDS), area = pick(['defence', 'road building', 'public transport', 'public housing']), o = rint(300, 950) / 10, n = rd(o * (1 - rint(30, 190) / 1000), 1);
      return pchNum('Government spending on ' + area + ' in ' + c + ' fell from $' + f1(o) + 'bn in 2024 to $' + f1(n) + 'bn in 2025. Work out the percentage change, to two decimal places.', o, n, f1(o), f1(n), 'Spending fell, so keep the minus sign. ');
    } },
    { skill: 'percentage-change', gen: function () {
      var c = pick(LANDS), o = rint(3200, 9800) * 1000 + rint(0, 999), n = Math.round(o * (1 + pick([-1, 1]) * rint(15, 140) / 1000));
      return pchNum('The population of ' + c + ' was ' + commas(o) + ' in 2005 and ' + commas(n) + ' in 2025. Work out the percentage change in population, to two decimal places.', o, n, commas(o), commas(n));
    } },
    { skill: 'percentage-change', gen: function () {
      var c = pick(LANDS), o = rint(1800, 25000) + rint(0, 99) / 100, n = rd(o * (1 + rint(15, 120) / 1000), 2);
      return pchNum('GDP per capita in ' + c + ' rose from $' + commas(o, 2) + ' in 2024 to $' + commas(n, 2) + ' in 2025. Work out the percentage change, to two decimal places.', o, n, commas(o, 2), commas(n, 2));
    } },
    { skill: 'index-inflation', gen: function () {
      var c = pick(LANDS), o = rint(1050, 1450) / 10, n = rd(o * (1 + rint(15, 110) / 1000), 1);
      return pchNum('The consumer price index (CPI) in ' + c + ' was ' + f1(o) + ' in 2024 and ' + f1(n) + ' in 2025. Work out the rate of inflation in 2025, to two decimal places.', o, n, f1(o), f1(n), 'The rate of inflation is the percentage change in the CPI. ');
    } },
    { skill: 'index-inflation', gen: function () {
      var c = pick(LANDS), y = rint(2015, 2020), n = rd(100 + rint(15, 260) / 10, 1);
      return NUM('In ' + c + ' the base year of the CPI is ' + y + ' (index = 100). In 2025 the index is ' + f1(n) + '. By what percentage has the general price level risen since ' + y + '?',
        rd(n - 100, 1), '%', 'With a base of 100, the percentage rise is simply the index minus 100: ' + f1(n) + ' − 100 = ' + f1(n - 100) + '%. (Check: (' + f1(n) + ' − 100) ÷ 100 × 100 gives the same.)', 0.005, f1(n - 100));
    } },
    { skill: 'index-inflation', gen: function () {
      var c = pick(LANDS), r = pick([2, 3, 5, 6, 7, 8, 9]), n = 100 + r;
      return MC('The CPI in ' + c + ' was 100 in 2024 and ' + n + ' in 2025. What was the rate of inflation in 2025?',
        r + '%', [f2(r * 100 / n) + '%', f2(n / 100) + '%', n + '%'],
        'Inflation = (' + n + ' − 100) ÷ 100 × 100 = ' + r + '%. Dividing by the new index (' + f2(r * 100 / n) + '%) or writing the index itself are common traps.');
    } },
    { skill: 'index-inflation', gen: function () {
      var pairs = [];
      [110, 120, 125, 140, 150, 160, 175, 180, 200, 250].forEach(function (b) { [2, 3, 4, 5, 6, 8, 10, 12].forEach(function (k) { if ((b * k) % 100 === 0) pairs.push([b, k]); }); });
      var pr = pick(pairs), c = pick(LANDS), o = pr[0], r = pr[1], n = o + o * r / 100;
      return MC('The CPI in ' + c + ' rose from ' + o + ' last year to ' + n + ' this year. What is the rate of inflation this year?',
        f2(r) + '%', [f2(n - o) + '%', f2((n - o) * 100 / n) + '%', f2(n - 100) + '%'],
        '(' + n + ' − ' + o + ') ÷ ' + o + ' × 100 = ' + f2(r) + '%. The base is not 100 here, so “index minus 100” or the point change alone are wrong.');
    } },
    { skill: 'basket-price', gen: function () {
      var c = pick(LANDS), p = rint(400, 2400) / 10, i = rd(100 + rint(20, 250) / 10, 1), ans = rd(p * i / 100, 2);
      return NUM('In the base year (CPI = 100) a typical basket of goods in ' + c + ' cost $' + f2(p) + '. The CPI is now ' + f1(i) + '. What does the same basket cost now? Give your answer in $ to two decimal places.',
        ans, '$', 'New price = old price × new index ÷ old index = ' + f2(p) + ' × ' + f1(i) + ' ÷ 100 = $' + f2(ans) + '.', 0.005, f2(ans));
    } },
    { skill: 'basket-price', gen: function () {
      var c = pick(LANDS), o = rint(105, 140), n = o + rint(3, 14), p = rint(600, 3000) / 10, ans = rd(p * n / o, 2);
      return NUM('A basket of goods cost $' + f2(p) + ' in ' + c + ' when the CPI was ' + o + '. The CPI is now ' + n + '. What does the same basket cost now, in $ to two decimal places?',
        ans, '$', 'New price = old price × new index ÷ old index = ' + f2(p) + ' × ' + n + ' ÷ ' + o + ' = $' + f2(ans) + '.', 0.005, f2(ans));
    } },
    { skill: 'select-years', gen: function () {
      var c = pick(LANDS), v = [rint(500, 900)], i;
      for (i = 1; i < 4; i++) v.push(v[i - 1] + pick([-1, 1, 1]) * rint(8, 60));
      var ys = [2022, 2023, 2024, 2025], a = rint(0, 1), b = a + 2;
      return pchNum('The table shows exports of ' + c + ' ($ million).' + table(['Year'].concat(ys), [['Exports ($m)'].concat(v.map(function (x) { return commas(x); }))]) + 'Work out the percentage change in exports between <b>' + ys[a] + '</b> and <b>' + ys[b] + '</b>, to two decimal places.',
        v[a], v[b], commas(v[a]), commas(v[b]), 'Use only the two years asked for; skip ' + ys[a + 1] + '. ');
    } },
    { skill: 'select-years', gen: function () {
      var c = pick(LANDS), v = [rd(100 + rint(10, 60) / 10, 1)], i;
      for (i = 1; i < 4; i++) v.push(rd(v[i - 1] * (1 + rint(10, 90) / 1000), 1));
      var ys = [2022, 2023, 2024, 2025], k = rint(1, 3);
      return pchNum('The table shows the CPI for ' + c + ' (base year 2021 = 100).' + table(['Year'].concat(ys), [['CPI'].concat(v.map(f1))]) + 'Work out the rate of inflation in <b>' + ys[k] + '</b>, to two decimal places.',
        v[k - 1], v[k], f1(v[k - 1]), f1(v[k]), 'Inflation in ' + ys[k] + ' compares the ' + ys[k] + ' index with the year before (' + ys[k - 1] + '), not with the base year. ');
    } },
    { skill: 'negative-change', gen: function () {
      var c = pick(LANDS), o = rint(250, 700) / 10, n = rd(o * (1 - rint(40, 260) / 1000), 1);
      return pchNum('The fiscal deficit of ' + c + ' fell from $' + f1(o) + 'bn in 2024 to $' + f1(n) + 'bn in 2025. Work out the percentage change in the deficit, to two decimal places.', o, n, f1(o), f1(n), 'The deficit fell, so the answer is negative. ');
    } },
    { skill: 'percentage-change', gen: function () {
      var firm = pick(['Lakeside Bikes', 'Pebble Phones', 'Northgate Paints', 'Amberline Shoes']), o = rint(1200, 9000), n = o + rint(80, 1500);
      return pchNum(firm + ' sold ' + commas(o) + ' units in March and ' + commas(n) + ' units in April. Work out the percentage change in units sold, to two decimal places.', o, n, commas(o), commas(n));
    } },
    { skill: 'negative-change', gen: function () {
      var c = pick(LANDS), o = rint(180, 950) / 10, n = rd(o * (1 - rint(15, 90) / 1000), 1), a = pch(o, n);
      return MC('Real GDP in ' + c + ' fell from $' + f1(o) + 'bn to $' + f1(n) + 'bn. What is the percentage change in real GDP?',
        f2(a) + '%', [f2(-a) + '%', f2((n - o) * 100 / n) + '%', f2(-(n - o) * 100 / n) + '%'],
        pchWhy(o, n, f1(o), f1(n)) + ' GDP fell, so the change is negative, and you divide by the old value (' + f1(o) + '), not the new one.');
    } },
    S('formula', 'Which formula gives the percentage change in a value between two years?',
      '(new value − old value) ÷ old value × 100',
      ['(new value − old value) ÷ new value × 100', '(old value − new value) ÷ old value × 100', 'new value ÷ old value × 100'],
      'Find the change (new − old), divide by the <b>starting</b> value, then multiply by 100. Using the new value as the divisor, or reversing the subtraction, gives the wrong size or sign.'),
    { skill: 'negative-change', gen: function () {
      var c = pick(LANDS), good = pick(['coffee', 'copper', 'cocoa', 'cotton', 'tea']), o = rint(400, 1600), n = Math.round(o * (1 - rint(40, 300) / 1000)), a = rd((o - n) * 100 / o, 2);
      return NUM('Earnings from ' + good + ' exports in ' + c + ' fell from $' + commas(o) + ' million to $' + commas(n) + ' million. Work out the percentage <b>decrease</b>, to two decimal places. (Give the decrease as a positive number.)',
        a, '%', 'Decrease = ' + commas(o) + ' − ' + commas(n) + ' = ' + commas(o - n) + '. ' + commas(o - n) + ' ÷ ' + commas(o) + ' × 100 = ' + pct(a) + ' decrease.', 0.005, f2(a));
    } },
    { skill: 'percentage-change', gen: function () {
      var c = pick(LANDS), o = rint(180, 900) * 1000 + rint(0, 9) * 100, n = Math.round(o * (1 + rint(-200, 250) / 1000) / 100) * 100;
      while (n === o) n += 1300;
      return pchNum('The number of people unemployed in ' + c + ' changed from ' + commas(o) + ' to ' + commas(n) + ' over two years. Work out the percentage change, to two decimal places.', o, n, commas(o), commas(n));
    } },
    { skill: 'formula', gen: function () {
      var pair = pick([[0.5, 2.0], [0.25, 1.0], [0.75, 3.0], [1.0, 2.5], [0.5, 1.75], [1.5, 4.5]]), o = pair[0], n = pair[1], a = rd((n - o) * 100 / o, 2), c = pick(LANDS);
      return MC('The central bank of ' + c + ' raised its interest rate from ' + o.toFixed(2) + '% to ' + n.toFixed(2) + '%. What is the percentage change in the interest rate?',
        commas(a, 2) + '%', [(n - o).toFixed(2) + '%', commas(rd((n - o) * 100 / n, 2), 2) + '%', commas(rd(n * 100 / o, 2), 2) + '%'],
        'The rate rose by ' + (n - o).toFixed(2) + ' percentage points, but the percentage change is (' + n.toFixed(2) + ' − ' + o.toFixed(2) + ') ÷ ' + o.toFixed(2) + ' × 100 = ' + commas(a, 2) + '%.');
    } },
    { skill: 'index-inflation', gen: function () {
      var c = pick(LANDS), o = rd(100 + rint(15, 90) / 10, 1), n = rd(o - rint(4, 30) / 10, 1);
      return pchNum('Prices in ' + c + ' have been falling. The CPI was ' + f1(o) + ' in 2024 and ' + f1(n) + ' in 2025. Work out the rate of inflation in 2025, to two decimal places.', o, n, f1(o), f1(n), 'The CPI fell, so inflation is negative (deflation). ');
    } },
    { skill: 'percentage-change', gen: function () {
      var c = pick(LANDS), item = pick(['a litre of milk', 'a kilogram of rice', 'a litre of petrol', 'a bus ticket']), o = rint(80, 400) / 100, n = rd(o + rint(3, 60) / 100, 2);
      return pchNum('In ' + c + ' the price of ' + item + ' rose from $' + f2(o) + ' to $' + f2(n) + '. Work out the percentage change in price, to two decimal places.', o, n, f2(o), f2(n));
    } }
  ] };

  /* ---------------- ECO-T21-09 Effects of inflation and deflation ---------------- */
  B['ECO-T21-09'] = { title: 'Effects of inflation and deflation, including menu and shoe leather costs', items: [
    S('purchasing-power', 'Prices in Arvenia rise by 9% in a year, but a retired teacher’s pension stays exactly the same. What happens to her?',
      'She can buy fewer goods and services than before',
      ['She can buy more goods and services than before', 'Her purchasing power is unchanged because her income is fixed', 'Her pension rises automatically by 9%'],
      'Inflation reduces purchasing power: the same amount of money buys less. With a fixed income and 9% higher prices, her living standard falls.'),
    S('purchasing-power', 'What is meant by a fall in the <b>purchasing power</b> of money?',
      'Each unit of money buys fewer goods and services',
      ['People have less money in their bank accounts', 'Banks lend less money to households', 'The government prints less money'],
      'Purchasing power is how much a sum of money can buy. When prices rise, each dollar buys less, even if the number of dollars is the same.'),
    { skill: 'real-wages', gen: function () {
      var c = pick(LANDS), w = rint(2, 12), i = rint(2, 12);
      while (Math.abs(w - i) < 2) i = rint(2, 12);
      var up = w > i;
      return MC('In ' + c + ' average wages rose by ' + w + '% last year, while the CPI rose by ' + i + '%. What happened to real wages?',
        up ? 'Real wages rose, so workers can buy more' : 'Real wages fell, so workers can buy less',
        [up ? 'Real wages fell, so workers can buy less' : 'Real wages rose, so workers can buy more', 'Real wages were unchanged', 'Prices fell, so workers can buy more'],
        up ? 'Wages (+' + w + '%) rose faster than prices (+' + i + '%), so each worker’s pay buys more goods and services than before.'
           : 'Prices (+' + i + '%) rose faster than wages (+' + w + '%), so each worker’s pay buys less. Living standards fall even though money wages went up.');
    } },
    S('real-wages', 'Most workers in Feranor have wages that rise automatically in line with the CPI. How does this affect the impact of 7% inflation on them?',
      'The fall in their purchasing power is limited',
      ['Their purchasing power falls by more than 7%', 'They suffer much larger shoe leather costs', 'Their real wages rise by 7%'],
      'If wages keep pace with prices, workers can still buy about the same amount, so their living standards are protected. This is a key limit to the harm caused by inflation.'),
    S('real-wages', 'Which of the following would most limit the harm that 5% inflation does to workers in Quorin?',
      'Average wages rising by 6% over the same period',
      ['Average wages rising by 2% over the same period', 'Firms changing their price lists more often', 'Workers spending more time searching for bargains'],
      'If wages rise faster than prices, real wages still rise, so workers are not made worse off. The other options either make real wages fall or add to the costs of inflation.'),
    { skill: 'real-wages', gen: function () {
      var c = pick(LANDS), r = rint(1, 6), i = rint(1, 12);
      while (Math.abs(r - i) < 2) i = rint(1, 12);
      var falls = r < i;
      return MC('A family in ' + c + ' keeps its savings in a bank account paying ' + r + '% interest a year. Inflation is ' + i + '%. What happens to the real value of the savings?',
        falls ? 'It falls, because prices rise faster than the interest earned' : 'It rises, because the interest earned is more than inflation',
        [falls ? 'It rises, because the interest earned is more than inflation' : 'It falls, because prices rise faster than the interest earned', 'It stays the same, because the savings are in a bank', 'It falls only if prices fall'],
        falls ? 'The savings grow by ' + r + '% but prices rise by ' + i + '%, so the money will buy less than before.'
              : 'The savings grow by ' + r + '% while prices rise by only ' + i + '%, so the money will buy a little more than before.');
    } },
    S('menu-shoe', 'What are <b>menu costs</b>?',
      'The costs to firms of changing their listed prices',
      ['The time and effort buyers spend looking for lower prices', 'The higher cost of raw materials during inflation', 'The cost of borrowing when interest rates rise'],
      'Menu costs are the costs of repricing: reprinting menus, brochures and labels, or updating websites and price systems. The second option describes shoe leather costs.'),
    S('menu-shoe', 'What are <b>shoe leather costs</b>?',
      'The time and effort spent searching for the lowest prices when prices rise quickly',
      ['The cost to firms of reprinting their price lists, menus and brochures as prices rise', 'The rise in the price of shoes and clothing in the CPI', 'The wages paid to workers who deliver goods to shops'],
      'Shoe leather costs are the time and effort (once, the shoe leather worn out walking) spent shopping around or making extra trips to the bank when prices are rising fast.'),
    { skill: 'menu-shoe', gen: function () {
      var c = pick(LANDS);
      var pool = [
        ['A café in ' + c + ' reprints its menus every month to show new prices.', 'menu'],
        ['An online shop in ' + c + ' pays staff to update thousands of prices on its website every week.', 'menu'],
        ['A taxi firm in ' + c + ' has to reprogram all its fare meters twice a year.', 'menu'],
        ['A supermarket in ' + c + ' prints new shelf labels for every product each fortnight.', 'menu'],
        ['A nurse in ' + c + ' spends every Saturday visiting several markets to find the cheapest rice.', 'shoe'],
        ['Households in ' + c + ' make extra trips to the bank so they hold less cash that is losing value.', 'shoe'],
        ['A student in ' + c + ' spends hours comparing prices online before each purchase because prices change every week.', 'shoe'],
        ['A bakery in ' + c + ' pays more for flour after a poor harvest.', 'cost'],
        ['A delivery firm in ' + c + ' pays more for diesel fuel for its vans.', 'cost']
      ];
      var s = pick(pool), key = { menu: 'A menu cost of inflation', shoe: 'A shoe leather cost of inflation', cost: 'A rise in production costs' };
      return MC(s[0] + ' This is best described as', key[s[1]], ['menu', 'shoe', 'cost'].filter(function (k) { return k !== s[1]; }).map(function (k) { return key[k]; }),
        s[1] === 'menu' ? 'The firm is spending money and time changing the prices it shows customers, which is a menu cost.'
          : s[1] === 'shoe' ? 'Buyers are spending time and effort to cope with rising prices, which is a shoe leather cost.'
          : 'This is a higher cost of an input used in production. It is not the cost of changing prices (menu) or of searching for lower prices (shoe leather).');
    } },
    MU('menu-shoe', 'Inflation in Halvia rises to 15%. Which of the following are <b>menu costs</b> for Halvian firms?',
      ['A restaurant reprinting its menus more often', 'A clothes shop updating the prices on its website', 'A hardware store relabelling prices on its shelves'],
      ['A shopper visiting several markets to find cheaper rice', 'A haulage firm paying more for fuel'],
      'Menu costs are the costs of changing listed prices. Shopping around is a shoe leather cost, and dearer fuel is simply a higher production cost.'),
    S('menu-shoe', 'Why are menu costs larger when inflation is high?',
      'Prices must be changed more often',
      ['Firms must pay workers less often', 'Shoppers visit fewer shops', 'Firms stop printing price lists'],
      'With rapid inflation, firms have to update their prices again and again, so the cost of repricing (menus, labels, websites) is paid more often.'),
    S('confidence', 'High and unpredictable inflation makes households in Ulvenia unsure what prices will be next year. What is the most likely next step?',
      'They become cautious, borrow less and save more as a precaution',
      ['They borrow more because their real incomes are rising', 'Firms invest more because planning for the future has become much easier', 'They spend more because their savings are worth more'],
      'Uncertainty lowers consumer confidence. Worried households are less willing to take on loans or make big purchases and may save to protect themselves.'),
    S('confidence', 'Why may high and unstable inflation reduce investment by firms?',
      'Firms find it hard to predict future costs and revenues',
      ['Inflation always makes machinery free to buy', 'Firms’ profits must fall to zero', 'Inflation guarantees higher demand for every product they make'],
      'Investment needs planning years ahead. When costs and prices are hard to forecast, the risk of a loss rises, so firms delay or cancel investment projects.'),
    S('confidence', 'Which group is most clearly harmed when inflation turns out much higher than expected?',
      'Workers whose wages are fixed for the year',
      ['Firms that can raise their prices at once', 'Workers whose pay rises in line with the CPI', 'Households whose savings earn more than inflation'],
      'Workers on fixed pay cannot raise their income to match the higher prices, so their real wages and purchasing power fall.'),
    { skill: 'exports', gen: function () {
      var c = pick(LANDS), a = rint(1, 12), b = rint(1, 12);
      while (Math.abs(a - b) < 3) b = rint(1, 12);
      var worse = a > b;
      return MC('Inflation in ' + c + ' is ' + a + '%, while its main trading partners have average inflation of ' + b + '%. Exchange rates do not change. What is the most likely effect on ' + c + '’s exports?',
        worse ? 'They become less price competitive' : 'They become more price competitive',
        [worse ? 'They become more price competitive' : 'They become less price competitive', 'Their prices are unaffected by inflation', 'Their quality automatically improves'],
        worse ? c + '’s prices are rising faster than its rivals’ (' + a + '% against ' + b + '%), so its goods become relatively dearer abroad and exports may fall.'
              : c + '’s prices are rising more slowly than its rivals’ (' + a + '% against ' + b + '%), so its goods become relatively cheaper abroad and exports may rise.');
    } },
    S('exports', 'Inflation in Duria is much higher than in its trading partners. Which chain about unemployment is most likely?',
      'Exports become dearer, foreign sales fall, firms need fewer workers',
      ['Exports become cheaper, foreign sales rise, firms hire more', 'Imports become dearer, so domestic firms lay off workers', 'Prices rise, so firms always hire many more workers to meet the extra demand'],
      'Higher inflation than rivals makes exports less price competitive. Lower foreign sales mean exporting firms cut output and jobs, so unemployment may rise.'),
    S('low-stable', 'Which is the best reason for a government to aim for <b>low and stable</b> inflation?',
      'It helps households and firms to plan spending and investment',
      ['It guarantees that there will be no unemployment in any part of the economy', 'It makes every price in the economy fall each year', 'It removes the need for a central bank'],
      'When prices rise slowly and predictably, people and firms can plan with confidence, which supports spending, investment and export competitiveness.'),
    S('low-stable', 'Kestria keeps inflation steady at 2% while its trading partners have inflation of 6%. Why might this help Kestria’s economy?',
      'Its exports stay price competitive, supporting jobs',
      ['Its imports become cheaper than its exports', 'Its workers’ wages will fall by 4%', 'It will be able to stop collecting taxes'],
      'Kestria’s prices rise more slowly than its rivals’, so its goods become relatively cheaper abroad. Higher export sales can mean more output and employment.'),
    S('deflation', 'Prices in Marovia have fallen for 18 months and people expect them to keep falling. What is the most likely effect?',
      'Consumers delay purchases, so demand and output fall',
      ['Consumers rush to buy now, so demand rises sharply', 'Firms raise prices to increase their profits', 'Menu costs disappear completely'],
      'If people expect goods to be cheaper next month, they wait. Lower spending means firms sell less, cut output and may cut jobs, which can deepen the fall in prices.'),
    S('deflation', 'A student says: “Deflation is good for everyone because goods get cheaper.” What is the best counter-argument?',
      'Expected price falls make people delay buying, cutting demand and jobs',
      ['Deflation always raises the rate of inflation', 'Cheaper goods mean that real wages must fall', 'Deflation always makes a country’s exports less price competitive in foreign markets'],
      'Falling prices sound good, but if people put off spending, firms’ sales fall, they cut workers, and confidence drops. Deflation can harm the whole economy.'),
    MU('confidence', 'Inflation in Sereth rises from 2% to 12%, while inflation in its trading partners stays at 2%. Which of the following are likely effects?',
      ['Firms face higher menu costs', 'Consumers face higher shoe leather costs', 'The purchasing power of fixed incomes falls', 'Uncertainty about future prices increases'],
      ['Sereth’s exports become more price competitive', 'The real value of cash savings rises'],
      'Higher inflation means more frequent repricing, more shopping around, lower purchasing power and more uncertainty. Exports become <b>less</b> competitive, and cash savings lose real value.'),
    S('deflation', 'Which group is most likely to benefit from a period of gentle deflation in Pellara?',
      'Pensioners on fixed incomes, whose money buys more',
      ['Firms with large debts that are fixed in money terms', 'Workers in firms that are cutting output', 'Shops whose customers delay their purchases'],
      'When prices fall, a fixed income buys more, so purchasing power rises. Firms with fixed debts, and firms losing sales, are harmed rather than helped.')
  ] };

  /* ---------------- ECO-T21-04 The economic cycle: phases, jobs and prices ---------------- */
  B['ECO-T21-04'] = { title: 'The economic cycle: phases, jobs and prices', items: [
    S('phase-meaning', 'What is a <b>recession</b>?',
      'A fall in real GDP for two consecutive quarters',
      ['A slowdown in GDP growth that stays positive', 'A fall in real GDP for any single month', 'A rise in unemployment above 10%'],
      'A recession is a period when GDP (output) falls for two quarters in a row. A slowdown in growth that is still positive is a downturn.'),
    S('phase-meaning', 'What is a <b>downturn</b> in the economic cycle?',
      'GDP is still rising, but growth is slowing',
      ['GDP is falling for two consecutive quarters', 'GDP is at its highest point', 'GDP is starting to rise after a fall'],
      'In a downturn output is still growing, but more slowly. Only when GDP actually falls for two quarters is it a recession.'),
    S('phase-meaning', 'What is a <b>boom</b>?',
      'The peak of the cycle, when output and employment are highest',
      ['The lowest point of the cycle, when output is falling', 'A phase when GDP has fallen for two quarters', 'The phase when GDP first starts to rise again'],
      'A boom is the phase of the economic cycle with the highest level of economic activity, spending and employment.'),
    S('phase-meaning', 'What is a <b>recovery</b>?',
      'After a recession, confidence returns and GDP starts to rise',
      ['Before a recession, GDP growth starts to slow down', 'GDP is at its highest level and still rising', 'GDP falls for two quarters in a row'],
      'Recovery comes after a recession: spending and confidence pick up and output begins to grow again.'),
    S('phase-meaning', 'Which is the best description of the economic cycle?',
      'The up-and-down movement of GDP around its long-run trend',
      ['The steady rise in prices over many years', 'The movement of workers between jobs', 'The yearly pattern of tourist spending in the summer and winter seasons'],
      'The economic cycle (business cycle) describes how real GDP rises faster, slows, falls and recovers over time, around its trend growth path.'),
    { skill: 'read-data', gen: function () {
      var c = pick(LANDS), kind = rint(0, 3), d, ans, why;
      function r1(a, b) { return rint(a, b) / 10; }
      if (kind === 0) { d = [r1(1, 4), -r1(1, 4), -r1(3, 7), -r1(2, 6)]; ans = 'Recession'; why = 'GDP has fallen for the last three quarters in a row (more than two consecutive quarters of negative growth), so the economy is in recession.'; }
      else if (kind === 1) { var a = r1(10, 13); d = [a, rd(a - r1(2, 3), 1), rd(a - r1(5, 6), 1), rd(a - r1(8, 9), 1)]; ans = 'Downturn'; why = 'Growth is still positive every quarter, but it keeps getting smaller. Output is rising more slowly: a downturn.'; }
      else if (kind === 2) { d = [-r1(5, 8), -r1(2, 4), r1(1, 3), r1(4, 7)]; ans = 'Recovery'; why = 'After falls in output, GDP has started to grow again and growth is picking up: a recovery.'; }
      else { d = [r1(9, 11), r1(11, 13), r1(13, 15), r1(13, 15)]; ans = 'Boom'; why = 'Growth is strong and steady, unemployment is very low and inflation is rising as demand presses on capacity: a boom.'; }
      var extra = kind === 3 ? '<br>Unemployment has fallen to its lowest level for 20 years and inflation is rising.' : '';
      return MC('The table shows the quarterly change in real GDP for ' + c + '.' + table(['Quarter', 'Q1', 'Q2', 'Q3', 'Q4'], [['Change in real GDP (%)'].concat(d.map(function (x) { return (x > 0 ? '+' : '') + x.toFixed(1); }))]) + extra + 'Which phase of the economic cycle is ' + c + ' most likely to be in at Q4?',
        ans, PHASES.filter(function (p) { return p !== ans; }), why);
    } },
    { skill: 'read-data', gen: function () {
      var c = pick(LANDS), kind = rint(0, 2), d;
      function r1(a, b) { return rint(a, b) / 10; }
      if (kind === 0) d = [r1(2, 5), r1(1, 2), -r1(1, 4), -r1(2, 5)];
      else if (kind === 1) d = [-r1(1, 3), r1(1, 3), -r1(1, 3), r1(1, 3)];
      else d = [r1(8, 10), r1(5, 7), r1(3, 4), r1(1, 2)];
      var opts = ['Yes: GDP fell in two consecutive quarters', 'No: GDP never fell in two quarters in a row', 'No: growth slowed but GDP kept rising', 'Yes: growth slowed for at least two quarters'];
      var ans = kind === 0 ? opts[0] : kind === 1 ? opts[1] : opts[2];
      // When GDP rose every quarter, 'never fell in two quarters in a row' is also true, so swap in a false reason.
      if (kind === 2) opts[1] = 'No: GDP fell in only one quarter';
      return MC('A newspaper says ' + c + ' is “in recession”. The quarterly changes in real GDP are shown below.' + table(['Quarter', 'Q1', 'Q2', 'Q3', 'Q4'], [['Change in real GDP (%)'].concat(d.map(function (x) { return (x > 0 ? '+' : '') + x.toFixed(1); }))]) + 'Is the newspaper right?',
        ans, opts.filter(function (o) { return o !== ans; }),
        kind === 0 ? 'Q3 and Q4 are both negative: GDP fell for two consecutive quarters, which is the definition of a recession.'
          : kind === 1 ? 'GDP fell in Q1 and Q3, but each fall was followed by growth. A recession needs two consecutive quarters of falling GDP.'
          : 'Every quarter is positive. Growth is slowing, which is a downturn, not a recession.');
    } },
    S('gdp-in-phase', 'GDP growth in Halvia slows from 4% to 1% a year. A journalist calls this a recession. Is this correct?',
      'No: GDP is still rising, so it is a downturn',
      ['Yes: any slowdown in growth is a recession', 'Yes: growth has fallen by three percentage points', 'No: it is a recovery, because GDP is rising'],
      'Output is still growing (by 1%), only more slowly. That is a downturn. A recession needs GDP to fall for two quarters in a row.'),
    S('gdp-in-phase', 'Which shows the phases of the economic cycle in the correct order?',
      'Boom, downturn, recession, recovery',
      ['Boom, recession, downturn, recovery', 'Recession, boom, downturn, recovery', 'Boom, recovery, recession, downturn'],
      'From the peak, growth slows (downturn), output falls (recession), then grows again (recovery) until the next boom.'),
    { skill: 'gdp-in-phase', gen: function () {
      var c = pick(LANDS), k = rint(0, 3), nxt = PHASES[(k + 1) % 4];
      return MC(c + ' is in the <b>' + PHASES[k].toLowerCase() + '</b> phase of the economic cycle. Which phase normally comes next?',
        nxt, PHASES.filter(function (p) { return p !== nxt; }),
        'The cycle runs boom → downturn → recession → recovery → boom. After a ' + PHASES[k].toLowerCase() + ' comes a ' + nxt.toLowerCase() + '.');
    } },
    S('gdp-in-phase', 'In which phase of the economic cycle is demand-pull inflation most likely?',
      'Boom',
      ['Recession', 'Recovery', 'Downturn'],
      'In a boom, spending is high and firms are near full capacity, so extra demand mainly pushes up prices.'),
    S('gdp-in-phase', 'In which phase of the economic cycle is cyclical unemployment likely to be highest?',
      'Recession',
      ['Boom', 'Downturn', 'Recovery'],
      'Cyclical unemployment is caused by a fall in demand. Demand and output are lowest in a recession, so firms employ the fewest workers then.'),
    S('jobs-chain', 'During a recession in Ferrovia, households cut their spending. What is the most likely next step?',
      'Firms sell less, cut output and need fewer workers',
      ['Firms sell more, raise output and hire more workers', 'Firms raise prices, so workers earn more', 'The government collects more income tax'],
      'Lower spending means lower sales. Firms reduce production and so need fewer workers, so unemployment rises.'),
    S('jobs-chain', 'Which type of unemployment rises when a country enters a recession?',
      'Cyclical unemployment',
      ['Seasonal unemployment', 'Frictional unemployment', 'Voluntary unemployment'],
      'Job losses caused by a fall in total demand during a downturn or recession are cyclical unemployment.'),
    S('jobs-chain', 'As a recovery begins in Taluna, unemployment falls only slowly at first. What is the best explanation?',
      'Firms wait until they are sure demand will last before hiring',
      ['GDP is still falling during a recovery', 'Recoveries always reduce demand for goods', 'Workers refuse jobs when the economy is growing'],
      'Firms often meet the first rise in orders with their existing staff or overtime. They hire new workers once they are confident the recovery will continue.'),
    S('jobs-chain', 'Firms in Zandor meet the rising demand of a recovery mainly by buying new machines. What is the likely effect on unemployment?',
      'Unemployment may fall by less than expected',
      ['Unemployment must rise sharply at once', 'Unemployment falls faster than output grows', 'Unemployment is not affected by output at all'],
      'If extra output comes from machines rather than workers, fewer new jobs are created, so unemployment falls more slowly than the growth in GDP suggests.'),
    S('prices-chain', 'Demand falls sharply during a recession in Eskara. What is the most likely effect on inflation?',
      'Firms cut prices or raise them more slowly, so inflation falls',
      ['Firms raise prices faster, so inflation rises', 'Inflation is unaffected because demand does not affect prices', 'Prices rise because firms produce more'],
      'With less spending, firms must compete for customers and cannot easily raise prices. Lower demand also reduces wage pressure, so inflation tends to fall.'),
    S('prices-chain', 'Ostmark is in a recession, yet its inflation stays high. Which is the most likely reason?',
      'Energy and import costs are rising, causing cost-push inflation',
      ['Consumer spending is rising very quickly', 'Unemployment has fallen to record lows', 'Firms are short of workers, so they are raising wages to attract staff'],
      'A recession reduces demand-pull pressure, but if firms’ costs (such as energy) keep rising, cost-push inflation can continue even while output falls.'),
    S('prices-chain', 'In a boom, firms in Lumeria struggle to find enough workers. What is the most likely result?',
      'Wages rise, adding to inflation, while unemployment is low',
      ['Wages fall, so inflation falls and unemployment rises', 'Firms close, so unemployment rises quickly', 'Prices fall because firms produce more'],
      'Labour shortages push up wages. Higher wage costs and strong spending both raise prices, so inflation rises while unemployment is at its lowest.'),
    MU('jobs-chain', 'Which of the following are likely to happen when an economy enters a recession?',
      ['Unemployment rises', 'Business investment falls', 'Consumer confidence falls', 'Inflation tends to slow down'],
      ['Firms hire many more workers', 'Real GDP grows faster than its trend'],
      'Falling demand means lower sales, so firms cut jobs and investment, confidence falls and prices rise more slowly. Hiring and fast growth belong to a boom or recovery.'),
    MU('prices-chain', 'Which of the following are typical features of a boom?',
      ['Unemployment is low', 'Inflationary pressure rises', 'Firms work close to full capacity'],
      ['Real GDP falls for two quarters', 'Many firms close because of weak demand'],
      'In a boom spending and output are at their highest, so unemployment is low and prices tend to rise. Falling GDP and closures belong to a recession.'),
    S('prices-chain', 'Which statement about a recovery is correct?',
      'Output and employment start to rise, and inflation may begin to pick up',
      ['Output falls and unemployment rises quickly', 'Inflation always falls to zero as soon as output starts to grow again quickly', 'GDP growth is at its highest point'],
      'As spending returns, firms raise output and gradually hire more workers. Rising demand can then start to push prices up again.')
  ] };

  /* ---------------- ECO-T21-05 Label the economic cycle diagram ---------------- */
  // The four box positions run left to right at x = 100, 150, 200, 250.
  // order 0: peak, falling, trough, rising  -> Boom, Downturn, Recession, Recovery
  // order 1: trough, rising, peak, falling  -> Recession, Recovery, Boom, Downturn
  var CY_ORDER = [[0, 1, 2, 3], [2, 3, 0, 1]];
  function cycleSvg(order, boxes, aria) {
    var th0 = order ? Math.PI : 0, P = 200, A = 30;
    function trend(x) { return 150 - (x - 50) * 0.33; }
    function cy(x) { return trend(x) - A * Math.sin(th0 + 2 * Math.PI * (x - 50) / P); }
    var pts = [];
    for (var x = 50; x <= 320; x += 5) pts.push(x + ',' + cy(x).toFixed(1));
    var s = '<svg viewBox="0 0 350 232" role="img" aria-label="' + aria + '" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="11">' +
      '<line x1="40" y1="205" x2="340" y2="205" stroke="#303a4c" stroke-width="1.5"/><line x1="40" y1="205" x2="40" y2="12" stroke="#303a4c" stroke-width="1.5"/>' +
      '<text x="190" y="226" text-anchor="middle" fill="#303a4c">Time (years)</text>' +
      '<text x="16" y="110" text-anchor="middle" fill="#303a4c" transform="rotate(-90 16 110)">Real GDP ($bn)</text>' +
      '<line x1="50" y1="150" x2="320" y2="60.9" stroke="#9aa5b8" stroke-width="1.5" stroke-dasharray="5 4"/>' +
      '<polyline points="' + pts.join(' ') + '" fill="none" stroke="#195d9b" stroke-width="2.5"/>';
    var xs = [100, 150, 200, 250];
    for (var i = 0; i < 4; i++) {
      var ph = CY_ORDER[order][i], px = xs[i], py = cy(px), bx, by;
      if (ph === 0) { bx = px; by = py - 26; }
      else if (ph === 1) { bx = px + 28; by = py - 37; }
      else if (ph === 2) { bx = px; by = py + 26; }
      else { bx = px + 30; by = py + 30; }
      var t = boxes[i], hi = t === '?', w = t.length > 2 ? 70 : 30;
      s += '<line x1="' + px + '" y1="' + py.toFixed(1) + '" x2="' + bx + '" y2="' + by.toFixed(1) + '" stroke="#303a4c" stroke-width="1"/>' +
        '<circle cx="' + px + '" cy="' + py.toFixed(1) + '" r="2.5" fill="#303a4c"/>' +
        '<rect x="' + (bx - w / 2) + '" y="' + (by - 10).toFixed(1) + '" width="' + w + '" height="20" rx="3" fill="#ffffff" stroke="' + (hi ? '#e4464f' : '#303a4c') + '" stroke-width="' + (hi ? 2 : 1.2) + '"/>' +
        (t ? '<text x="' + bx + '" y="' + (by + 4).toFixed(1) + '" text-anchor="middle" fill="' + (hi ? '#e4464f' : '#303a4c') + '" font-weight="bold">' + t + '</text>' : '');
    }
    return s + '</svg>';
  }
  function cyPhaseAt(order, i) { return PHASES[CY_ORDER[order][i]]; }
  function cyPosOf(order, phase) { return CY_ORDER[order].indexOf(PHASES.indexOf(phase)); }
  var CY_ARIA = 'Economic cycle diagram: real GDP against time, with a wavy actual GDP line around a dashed trend line and four labelled boxes';
  function cyLetters() { return shuf(['A', 'B', 'C', 'D']); }
  function cyWhere(ph) {
    return { Boom: 'the peak of the wave, where real GDP is highest', Downturn: 'the falling section just after the peak', Recession: 'the trough, the lowest part of the wave', Recovery: 'the rising section just after the trough' }[ph];
  }
  function cyFind(skill, stemFn, target) {
    return { skill: skill, gen: function () {
      var order = rint(0, 1), L = cyLetters(), pos = cyPosOf(order, target);
      return MC(stemFn(), L[pos], L.filter(function (_, i) { return i !== pos; }),
        target + ' belongs at ' + cyWhere(target) + ', which is box ' + L[pos] + '.', { svg: cycleSvg(order, L, CY_ARIA) });
    } };
  }
  function cyStaticSvg(order, boxes) { return cycleSvg(order, boxes, CY_ARIA); }

  B['ECO-T21-05'] = { title: 'Label the economic cycle diagram', items: [
    cyFind('find-box', function () { return 'The diagram shows an economic cycle with four empty boxes, A to D. Which box should be labelled <b>boom</b>?'; }, 'Boom'),
    { skill: 'find-box', gen: function () {
      var order = rint(0, 1), L = cyLetters(), boxes = L.slice(), bpos = cyPosOf(order, 'Boom'), rpos = cyPosOf(order, 'Recession');
      boxes[bpos] = 'Boom';
      var opts = L.filter(function (_, i) { return i !== bpos; });
      return MC('On the diagram one box is already labelled “Boom”. Which of the other boxes should be labelled <b>recession</b>?', L[rpos], opts.filter(function (x) { return x !== L[rpos]; }),
        'Recession goes at the trough, the lowest point of the wave, which is box ' + L[rpos] + '. The boxes on the falling and rising sections are downturn and recovery.', { svg: cycleSvg(order, boxes, CY_ARIA) });
    } },
    cyFind('find-box', function () { return 'Which box marks the stretch where growth is slowing just after the highest point, so it should be labelled <b>downturn</b>?'; }, 'Downturn'),
    cyFind('find-box', function () { return 'Which box marks the stretch where real GDP starts to grow again after its lowest point, so it should be labelled <b>recovery</b>?'; }, 'Recovery'),
    { skill: 'name-box', gen: function () {
      var order = rint(0, 1), i = rint(0, 3), boxes = ['', '', '', ''], ph = cyPhaseAt(order, i);
      boxes[i] = '?';
      return MC('What label should go in the box marked with a question mark on the diagram?', ph, PHASES.filter(function (p) { return p !== ph; }),
        'The box points to ' + cyWhere(ph) + ', so it is ' + ph.toLowerCase() + '.', { svg: cycleSvg(order, boxes, CY_ARIA) });
    } },
    { skill: 'name-box', gen: function () {
      var order = rint(0, 1), q = rint(0, 3), boxes = [0, 1, 2, 3].map(function (i) { return cyPhaseAt(order, i); }), ph = boxes[q];
      var g = [0, 1, 2, 3].filter(function (i) { return i !== q; }), hide = pick(g);
      boxes[hide] = ''; boxes[q] = '?';
      return MC('Two boxes on the diagram are already labelled. What label belongs in the box marked with a question mark?', ph, PHASES.filter(function (p) { return p !== ph; }),
        'Use the cycle order boom → downturn → recession → recovery and the shape of the wave: the ? box is at ' + cyWhere(ph) + ', so it is ' + ph.toLowerCase() + '.', { svg: cycleSvg(order, boxes, CY_ARIA) });
    } },
    { skill: 'name-box', gen: function () {
      var order = rint(0, 1), i = rint(1, 3), boxes = ['', '', '', ''], given = cyPhaseAt(order, i), ph = cyPhaseAt(order, i - 1);
      boxes[i] = given; boxes[i - 1] = '?';
      return MC('The box labelled “' + given + '” is correct. What label belongs in the box marked with a question mark, just before it?', ph, PHASES.filter(function (p) { return p !== ph; }),
        'In the cycle, ' + ph.toLowerCase() + ' comes just before ' + given.toLowerCase() + '. The ? box is at ' + cyWhere(ph) + '.', { svg: cycleSvg(order, boxes, CY_ARIA) });
    } },
    { skill: 'complete-set', gen: function () {
      var order = rint(0, 1), g = rint(0, 3), right = [0, 1, 2, 3].map(function (i) { return cyPhaseAt(order, i); }), boxes = ['1', '2', '3', '4'];
      var gp = right[g]; boxes[g] = gp;
      var idx = [0, 1, 2, 3].filter(function (i) { return i !== g; });
      idx.forEach(function (i, k) { boxes[i] = String(k + 1); });
      var nums = idx.map(function (i) { return boxes[i]; });
      var corr = idx.map(function (i) { return right[i]; });
      function show(arr) { return arr.map(function (p, k) { return nums[k] + ': ' + p; }).join(', '); }
      var w1 = corr.slice().reverse(), w2 = [corr[1], corr[0], corr[2]], w3 = [corr[0], corr[2], corr[1]];
      var opts = [show(corr), show(w1), show(w2), show(w3)];
      if (!uniq(opts)) opts = [show(corr), show([corr[2], corr[0], corr[1]]), show([corr[1], corr[2], corr[0]]), show([corr[0], corr[2], corr[1]])];
      return MC('One box on the diagram is labelled “' + gp + '”. Which set of labels is correct for the three numbered boxes?', opts[0], opts.slice(1),
        'Reading along the wave: ' + right.map(function (p, i) { return (i === g ? '(given) ' : 'box ' + boxes[i] + ' ') + p.toLowerCase(); }).join(', ') + '. Boom is at the peak, recession at the trough, downturn on the fall and recovery on the rise.', { svg: cycleSvg(order, boxes, CY_ARIA) });
    } },
    { skill: 'spot-error', gen: function () {
      var order = rint(0, 1), boxes = [0, 1, 2, 3].map(function (i) { return cyPhaseAt(order, i); }), t = cyPosOf(order, 'Recession');
      boxes[t] = 'Downturn';
      return MC('A student has labelled the diagram as shown. Which correction is needed?',
        'The box at the lowest point should say Recession',
        ['The box at the highest point should say Recovery', 'The box on the rising section should say Downturn', 'No correction is needed'],
        'The student wrote Downturn twice and left out recession. The trough (lowest point) is recession; downturn belongs only on the falling section after the peak.', { svg: cycleSvg(order, boxes, CY_ARIA) });
    } },
    { skill: 'spot-error', gen: function () {
      var order = rint(0, 1), boxes = [0, 1, 2, 3].map(function (i) { return cyPhaseAt(order, i); }), a = cyPosOf(order, 'Downturn'), b = cyPosOf(order, 'Recovery');
      boxes[a] = 'Recovery'; boxes[b] = 'Downturn';
      return MC('A student has labelled the diagram as shown. What mistake has the student made?',
        'Downturn and recovery have been swapped',
        ['Boom and recession have been swapped', 'Boom should be at the lowest point', 'Every box is labelled correctly'],
        'Recovery must be on a <b>rising</b> section after the trough, and downturn on the <b>falling</b> section after the peak. Here they are the wrong way round.', { svg: cycleSvg(order, boxes, CY_ARIA) });
    } },
    S('spot-error', 'A student writes “Downturn” in the box at the lowest point (trough) of the wave. What should it say?',
      'Recession',
      ['Boom', 'Recovery', 'Downturn is correct'],
      'The trough is where output is lowest and has been falling: that is the recession (or slump). Downturn is the falling stretch just after the peak.'),
    S('spot-error', 'A student writes “Recovery” on the falling section just after the peak. What should it say?',
      'Downturn',
      ['Recession', 'Boom', 'Recovery is correct'],
      'Recovery is on a rising section after the trough. The falling stretch straight after the peak is the downturn.'),
    S('features', 'On an economic cycle diagram, what is shown on the vertical axis?',
      'Real GDP',
      ['The inflation rate', 'Time', 'The unemployment rate'],
      'The diagram plots real GDP (output) on the vertical axis against time on the horizontal axis.'),
    S('features', 'On an economic cycle diagram, what is shown on the horizontal axis?',
      'Time',
      ['Real GDP', 'The price level', 'Interest rates'],
      'Time runs along the horizontal axis, so the wave shows how output changes over the years.'),
    S('features', 'On the diagram, what does the straight dashed line show?',
      'The trend (long-run average) growth of real GDP',
      ['The rate of inflation over time', 'Real GDP during a recession only', 'The level of unemployment'],
      'The straight upward line is the trend growth path. The wavy line shows actual GDP moving above and below this trend.', { svg: cyStaticSvg(0, ['', '', '', '']) }),
    S('features', 'Which phase is placed at the peak (highest point) of the wave?',
      'Boom',
      ['Recession', 'Recovery', 'Downturn'],
      'The peak is where real GDP and economic activity are highest, which is the boom.'),
    S('features', 'Which phase is placed at the trough (lowest point) of the wave?',
      'Recession',
      ['Boom', 'Downturn', 'Recovery'],
      'The trough is where output is lowest after falling, which is the recession.'),
    S('features', 'Which other word is accepted in place of “recession” on the diagram?',
      'Slump',
      ['Peak', 'Upswing', 'Plateau'],
      'Slump (or depression for a very deep, long recession) is accepted for the trough. Peak describes the boom, and upswing describes recovery.'),
    S('order', 'One box on the diagram says “Recovery”. Which label belongs in the next box to the right?',
      'Boom',
      ['Recession', 'Downturn', 'Recovery'],
      'After recovery the economy reaches the next peak, so the next box is boom.'),
    S('order', 'One box on the diagram says “Boom”. Which label belongs in the next box to the right?',
      'Downturn',
      ['Recovery', 'Recession', 'Boom'],
      'After the peak, growth slows and the wave starts to fall: that is the downturn.'),
    S('order', 'Reading left to right from a peak, which order of labels is correct?',
      'Boom, downturn, recession, recovery',
      ['Boom, recovery, recession, downturn', 'Boom, recession, recovery, downturn', 'Boom, downturn, recovery, recession'],
      'From the peak the wave falls (downturn), reaches the trough (recession), then rises (recovery) to the next boom.'),
    MU('order', 'Which labels belong on the part of the wave that is moving upward or at the very top?',
      ['Recovery', 'Boom'],
      ['Downturn', 'Recession'],
      'Recovery is the rising section after the trough and boom is the peak. Downturn and recession are on the falling part and the trough.')
  ] };

  /* ---------------- ECO-T21-20 Poverty and inequality: meanings and why governments act ---------------- */
  B['ECO-T21-20'] = { title: 'Poverty and inequality: meanings and why governments act', items: [
    S('absolute', 'What is meant by <b>absolute poverty</b>?',
      'Income is too low to pay for the basic needs for survival',
      ['Living standards are below the typical level in that society', 'Income is spread unevenly between different groups', 'Benefits make it not worthwhile to take a job'],
      'Absolute poverty means a household cannot afford the basics needed to survive, such as food, clean water and shelter. The second option is relative poverty.'),
    S('absolute', 'A student is asked what absolute poverty means. Which answer would earn both marks?',
      'Household income below the level needed for basic needs for survival',
      ['Being poorer than most of the other households in your own neighbourhood', 'Having very little money to spend', 'Living in a country with a low GDP'],
      'Both parts are needed: income (too low) plus basic needs for survival. “Having little money” misses the basic-needs part, and comparing with neighbours is relative poverty.'),
    MU('absolute', 'Which of the following are signs that a family is in <b>absolute</b> poverty?',
      ['It has no access to clean drinking water', 'It cannot afford enough food each day', 'It has no secure shelter'],
      ['It cannot afford to run a car', 'It cannot afford a holiday abroad'],
      'Absolute poverty is about the basic needs for survival: food, water and shelter. Lacking a car or a holiday may show relative poverty, but not absolute poverty.'),
    S('relative', 'What is meant by <b>relative poverty</b>?',
      'A standard of living below the typical standard in that society',
      ['An income too low to pay for food, water and shelter', 'A large gap between the richest and poorest groups', 'Being unable to find a job while willing to work'],
      'Relative poverty compares a person’s living standard with what is typical in their own society. Lacking food, water and shelter is absolute poverty.'),
    S('relative', 'A student is asked what relative poverty means. Which answer would earn both marks?',
      'Living standards below the typical standard in that society',
      ['Having a low income', 'Earning less than the richest people in the country', 'Income too low to meet the basic needs for survival'],
      'Two parts are needed: a living standard that is below, plus the typical (average) standard in that society. “Having a low income” gives no comparison.'),
    S('relative', 'In the European Union, a common measure of relative poverty is an income below',
      '60% of median income',
      ['$2.15 per person per day', 'half of GDP per capita', 'the national minimum wage'],
      'The EU uses 60% of median (middle) income. A fixed amount per day, such as $2.15, is an <b>absolute</b> poverty line.'),
    S('relative', 'Why can relative poverty exist even in a very rich country?',
      'It is measured against the typical living standard in that country',
      ['Rich countries always have very high levels of absolute poverty as well', 'It depends only on the world price of food', 'It means having no access to clean water'],
      'Relative poverty is about being well below the typical standard in your own society, so it can exist even where almost nobody lacks food or shelter.'),
    S('relative', 'Every household’s income in Selvia doubles while prices stay the same. What is most likely to happen?',
      'Absolute poverty falls, but relative poverty may not change',
      ['Relative poverty falls, but absolute poverty rises', 'Both absolute and relative poverty must rise', 'Income inequality must disappear'],
      'More families can now afford basic needs, so absolute poverty falls. But everyone’s income rose by the same proportion, so people below the typical standard are still below it.'),
    { skill: 'relative', gen: function () {
      var c = pick(LANDS), med = rint(18, 45) * 1000, line = med * 0.6;
      var poor = Math.round(line * (rint(80, 94) / 100) / 100) * 100, mid1 = Math.round(line * (rint(105, 115) / 100) / 100) * 100, mid2 = Math.round(med * (rint(85, 95) / 100) / 100) * 100, rich = Math.round(med * (rint(110, 140) / 100) / 100) * 100;
      return MC('Median household income in ' + c + ' is ' + money(med) + ' a year. Using the measure “below 60% of median income”, which household is in relative poverty?',
        'A household with an income of ' + money(poor), ['A household with an income of ' + money(mid1), 'A household with an income of ' + money(mid2), 'A household with an income of ' + money(rich)],
        '60% of ' + money(med) + ' = ' + money(line) + '. Only ' + money(poor) + ' is below this line. Being below the median is not enough on its own.');
    } },
    S('inequality', 'What is meant by <b>income inequality</b>?',
      'Income is spread unevenly, leaving gaps between groups of earners',
      ['Household income is too low to pay for food, clean water and shelter', 'Prices rise faster than wages', 'Everyone pays the same rate of income tax'],
      'Inequality is about how unevenly income is shared: some groups receive much more than others.'),
    S('inequality', 'Which statistic best shows income inequality in Galdia?',
      'The richest 10% receive 42% of all income',
      ['Average income rose by 3% this year', 'Inflation was 5% last year', 'GDP per capita is $8,400'],
      'Inequality is about how income is shared between groups. Averages, growth rates and inflation say nothing about the gap between rich and poor.'),
    S('inequality', 'Which term describes the range of incomes across a whole population, from lowest to highest?',
      'Income distribution',
      ['Absolute poverty', 'The poverty trap', 'Relative poverty'],
      'Income distribution describes how income is spread across the population. Inequality refers to how uneven that spread is.'),
    { skill: 'classify', gen: function () {
      var c = pick(LANDS);
      var pool = [
        ['Many rural families in ' + c + ' cannot afford enough food and have no clean drinking water.', 0],
        ['A family in ' + c + ' can afford food and housing, but not the internet access, school trips and new clothes most families there have.', 1],
        ['In ' + c + ' the richest fifth of households earn twelve times as much as the poorest fifth.', 2],
        ['Some households in ' + c + ' live in shelters made of scrap materials and often go without meals.', 0],
        ['A pensioner in ' + c + ' has enough to eat, but her income is well under half of what a typical household there receives.', 1],
        ['Pay for top managers in ' + c + ' has risen by 40% while pay for cleaners has not changed.', 2]
      ];
      var s = pick(pool), names = ['Absolute poverty', 'Relative poverty', 'Income inequality'];
      return MC(s[0] + ' Which term best describes this?', names[s[1]], names.filter(function (_, i) { return i !== s[1]; }).concat(['The poverty trap']),
        s[1] === 0 ? 'The family cannot meet the basic needs for survival (food, water, shelter), which is absolute poverty.'
          : s[1] === 1 ? 'Basic needs are met, but the living standard is well below what is typical in that society: relative poverty.'
          : 'This describes a large gap in income between groups, which is income inequality.');
    } },
    S('causes', 'Which feature of Marovia makes widespread poverty most likely?',
      'Output per person (GDP per capita) is very low',
      ['Most children complete secondary school', 'Wages are rising faster than prices', 'The government provides free healthcare'],
      'Low GDP per capita means little output and income per person, so many households struggle to afford essentials. The other features tend to reduce poverty.'),
    MU('causes', 'Which of the following are likely causes of poverty for a household?',
      ['Long-term unemployment', 'Low skills, so only low-paid jobs are available', 'Long-term illness that stops a person working'],
      ['Rising real wages across the economy', 'Free primary schooling for every child'],
      'Unemployment, low skills and illness all reduce a household’s income. Rising real wages and free schooling tend to lift incomes, so they reduce poverty.'),
    S('reasons', 'Which is a reason governments give for reducing poverty?',
      'To make sure everyone can meet their basic needs',
      ['To increase the rate of inflation', 'To reduce the size of the labour force', 'To widen income inequality'],
      'The three standard reasons are meeting basic needs, raising standards of living, and ethical reasons (fairness).'),
    S('reasons', 'A minister in Arvenia says: “It is simply wrong for our society to accept such a large gap between rich and poor.” Which reason for reducing inequality is this?',
      'Ethical reasons',
      ['Meeting basic needs', 'Raising tax revenue', 'Reducing inflation'],
      'The minister is arguing from fairness, that a big gap is morally wrong. That is the ethical reason for reducing inequality.'),
    S('reasons', 'The government of Pellara wants low-income families to be able to afford better housing, internet access and more education. Which reason for reducing poverty is this?',
      'Raising standards of living',
      ['Meeting basic needs for survival', 'Ethical reasons', 'Reducing the fiscal deficit'],
      'These are not survival needs; the aim is to give poorer families a better quality of life, which is raising standards of living.'),
    S('reasons', 'In parts of Taluna many households lack clean water and enough food. Why would the government want to reduce poverty there?',
      'To meet basic needs, so families can survive and stay healthy',
      ['To raise the rate of inflation in rural areas and so help farmers', 'To reduce the number of schools needed', 'To increase the gap between rich and poor'],
      'The problem is a lack of basic needs for survival, so the main reason to act is to meet those basic needs.'),
    S('reasons', 'How does reducing absolute poverty raise living standards in a country such as Quorin?',
      'Poor families can afford essentials and stay healthy enough to work',
      ['Rich families pay less tax and spend much more on luxury goods instead', 'Prices of basic goods rise, so firms earn more', 'Fewer people are counted in the labour force'],
      'With more income, poor households can buy essentials. Better health and nutrition also help people work and earn, raising living standards further.'),
    S('reasons', 'Why might a government worry about high inequality even if very few people are in absolute poverty?',
      'Large gaps can be seen as unfair and can weaken social cohesion',
      ['High inequality always causes deflation', 'Inequality means that nobody in the country can meet their basic needs', 'It makes GDP impossible to measure'],
      'Even when basic needs are met, a large gap between rich and poor raises ethical concerns and can create resentment and division in society.'),
    S('classify', 'A family in wealthy Westmark earns three times as much as a typical family in Quorin, a much poorer country, yet it is still counted as poor in Westmark. Which term explains this?',
      'Relative poverty',
      ['Absolute poverty', 'The poverty trap', 'Low GDP per capita'],
      'Relative poverty compares a family with the typical living standard in its <b>own</b> society. The family can meet its basic needs, so it is not in absolute poverty, but it is well below what is typical in Westmark.')
  ] };

  /* ---------------- ECO-T21-11 Unemployment: meaning, measurement and types ---------------- */
  var UTYPES = ['Cyclical', 'Structural', 'Seasonal', 'Frictional', 'Voluntary'];
  function uType(skill, q, t, why) { return S(skill, q + ' Which type of unemployment is this?', t, UTYPES.filter(function (x) { return x !== t; }), why); }
  B['ECO-T21-11'] = { title: 'Unemployment: meaning, measurement and types', items: [
    S('define', 'What is meant by <b>unemployment</b>?',
      'People willing and able to work who are seeking a job but cannot find one',
      ['Everyone of working age who does not have a paid job', 'People who have retired or are in full-time education', 'Workers who would like more hours than they now work'],
      'The definition has two parts: willing and able to work (actively looking), and unable to find a job. Students and retired people who are not looking are not unemployed.'),
    S('define', 'Which person in Feranor counts as unemployed?',
      'A 30-year-old looking for work every week who cannot find a job',
      ['A 72-year-old who has retired and is not looking for work', 'A full-time university student who is not seeking a job', 'A parent who has chosen to stay at home and is not seeking work'],
      'To be unemployed you must be willing and able to work and actively looking for a job. The others are not part of the labour force.'),
    S('measure', 'Which organisation’s method is the standard way to measure unemployment?',
      'The International Labour Organisation (ILO)',
      ['The World Trade Organization (WTO)', 'The International Monetary Fund (IMF)', 'The World Bank'],
      'The ILO measure counts people without a job who are available and actively looking for work. CPI measures inflation and GDP measures growth.'),
    S('measure', 'What is the <b>labour force</b>?',
      'Everyone in work plus everyone unemployed',
      ['The whole population of the country', 'Only the people who are in paid work', 'Everyone of working age, including those not seeking work'],
      'The labour force is people in work plus people actively looking for work. It does not include children, retired people or others not seeking work.'),
    S('measure', 'The unemployment rate in Belmora is 6%. What does this mean?',
      'Six in every hundred people in the labour force are unemployed',
      ['Six in every hundred people in the population are unemployed', 'Ninety-four in every hundred people in the population have a job', 'Six in every hundred workers changed jobs this year'],
      'The unemployment rate is a share of the labour force (people in work plus people looking for work), not of the whole population.'),
    S('measure', 'How is the unemployment rate calculated?',
      'Number unemployed ÷ labour force × 100',
      ['Number unemployed ÷ total population × 100', 'Number employed ÷ labour force × 100', 'Labour force ÷ number unemployed × 100'],
      'The rate shows the share of the labour force without a job, so divide the unemployed by the labour force (not the population) and multiply by 100.'),
    uType('classify', 'Car sales collapse during a global recession and car factories in Kestria lay off workers.', 'Cyclical',
      'The job losses come from a fall in demand during a recession, which is cyclical unemployment. When demand recovers, jobs return.'),
    uType('classify', 'Coal mines in northern Valoria close for good as power stations switch to solar energy, and many miners cannot find other work.', 'Structural',
      'A whole industry has declined permanently, and the miners’ skills do not match the jobs now available: structural unemployment.'),
    uType('classify', 'Banks in Corvana replace hundreds of counter staff with apps and machines, and the staff struggle to find new jobs.', 'Structural',
      'Technology has changed the jobs available, so the workers’ skills no longer match: structural unemployment.'),
    uType('classify', 'Ski instructors in the mountains of Ulvenia have no work from May to October.', 'Seasonal',
      'The work is only needed at a certain time of year, so the instructors are jobless out of season: seasonal unemployment.'),
    uType('classify', 'Building work in Sereth stops every year during the monsoon rains, and labourers are laid off.', 'Seasonal',
      'The job losses follow the time of year (the rainy season), which is seasonal unemployment.'),
    uType('classify', 'A software engineer in Halvia leaves one job and spends three weeks searching before starting a better-paid one.', 'Frictional',
      'This is a short period between jobs while searching, which is frictional unemployment.'),
    uType('classify', 'A recent graduate in Lumeria is spending a month applying for jobs before accepting her first offer.', 'Frictional',
      'She is between education and work for a short time while she searches, which is frictional unemployment.'),
    uType('classify', 'Because benefits in Zandor are generous, some people choose not to take low-paid jobs that are on offer.', 'Voluntary',
      'Jobs are available but people choose not to take them, which is voluntary unemployment.'),
    uType('classify', 'Clothing factories in Westmark close as production moves to countries with lower wages, and the machinists cannot find work in other sectors.', 'Structural',
      'The industry has declined permanently in Westmark and the workers’ skills do not fit the jobs available elsewhere: structural unemployment.'),
    { skill: 'classify', gen: function () {
      var c = pick(LANDS);
      var pool = [
        ['Hotels on ' + c + '’s beaches let staff go each winter when tourists stop coming.', 'Seasonal'],
        ['Fruit pickers in ' + c + ' are out of work once the harvest is over.', 'Seasonal'],
        ['A slump in spending in ' + c + ' means restaurants and shops across the country cut staff.', 'Cyclical'],
        ['In a recession, building firms in ' + c + ' get fewer orders and lay off bricklayers.', 'Cyclical'],
        ['Self-service checkouts replace cashiers in ' + c + '’s supermarkets, and the cashiers lack the skills for the new jobs available.', 'Structural'],
        ['Shipyards in ' + c + ' close permanently and welders cannot find jobs using their skills.', 'Structural'],
        ['A nurse in ' + c + ' moves to a new city and is out of work for two weeks while she finds a post.', 'Frictional'],
        ['High income tax in ' + c + ' means some people decide working is not worth it and turn down job offers.', 'Voluntary']
      ];
      var s = pick(pool);
      return MC(s[0] + ' Which type of unemployment is this?', s[1], UTYPES.filter(function (x) { return x !== s[1]; }),
        { Seasonal: 'The work depends on the time of year, so this is seasonal unemployment.', Cyclical: 'The jobs are lost because demand has fallen in a downturn or recession: cyclical unemployment.', Structural: 'The industry or the skills needed have changed permanently, leaving a skills mismatch: structural unemployment.', Frictional: 'This is a short gap between jobs while searching: frictional unemployment.', Voluntary: 'Jobs are available but people choose not to take them: voluntary unemployment.' }[s[1]]);
    } },
    S('cause', 'What is the main cause of <b>seasonal</b> unemployment?',
      'Demand for some workers changes with the time of year',
      ['A permanent decline in an industry', 'A fall in total demand during a recession', 'Workers choosing not to accept jobs'],
      'Seasonal unemployment happens when some jobs are only needed at certain times of year, such as tourism, farming or building in the dry season.'),
    S('cause', 'What is the key difference between structural and cyclical unemployment?',
      'Structural: lasting change in industries; cyclical: a fall in demand',
      ['Structural lasts only a few weeks; cyclical lasts for decades', 'Structural is caused by benefits; cyclical by the weather', 'Structural affects services only; cyclical affects factories only'],
      'Structural unemployment follows a permanent decline in an industry or new technology (a skills mismatch). Cyclical unemployment follows a temporary fall in demand in a downturn or recession.'),
    S('cause', 'Self-service checkouts replace cashiers across Pellara. Why might the cashiers stay unemployed for a long time?',
      'Their skills do not match the jobs that are now available',
      ['The economy has entered a seasonal low', 'They are only between jobs for a few weeks', 'Benefits are always higher than wages'],
      'The cashier jobs have gone for good. Without new skills, the workers cannot fill the vacancies that exist, which is why structural unemployment can last a long time.'),
    S('cause', 'Why does cyclical unemployment rise during a recession?',
      'Spending falls, so firms sell less and need fewer workers',
      ['Workers choose to leave jobs to look for better ones', 'Industries close because of new technology', 'Demand for workers changes with the seasons'],
      'In a recession households and firms spend less. Lower sales mean firms cut output and jobs, so cyclical unemployment rises.'),
    S('cause', 'How can generous unemployment benefits lead to <b>voluntary</b> unemployment?',
      'Some people are little better off in work, so they choose not to take jobs',
      ['They cause firms to move abroad, closing whole industries', 'They reduce total spending, causing a recession', 'They make jobs available only in summer'],
      'If benefits are close to the wage from a job, the reward from working is small, so some people decide not to accept the jobs on offer.'),
    MU('classify', 'Which of the following are examples of <b>structural</b> unemployment?',
      ['Steelworkers who lose their jobs when the industry moves abroad for good', 'Typists replaced by voice-recognition software'],
      ['Lifeguards out of work in winter', 'A teacher taking a month between two jobs', 'Factory staff laid off during a recession'],
      'Structural unemployment comes from a lasting change in industries or technology. Winter lifeguards are seasonal, the teacher is frictional and recession lay-offs are cyclical.')
  ] };

  /* ---------------- ECO-CALC-15 Percentage share of a total, including unemployment rate ---------------- */
  function share(p, w) { return rd(p * 100 / w, 2); }
  function shNum(q, p, w, fp, fw, pre) {
    var a = share(p, w);
    return NUM(q, a, '%', (pre || '') + 'Part ÷ whole × 100 = ' + fp + ' ÷ ' + fw + ' × 100 = ' + pct(a) + '.', 0.005, f2(a));
  }
  B['ECO-CALC-15'] = { title: 'Percentage share of a total, including unemployment rate', items: [
    { skill: 'unemployment-rate', gen: function () {
      var c = pick(LANDS), lf = rint(45, 900) / 10, u = rd(lf * rint(25, 140) / 1000, 1);
      return shNum('The labour force of ' + c + ' is ' + f1(lf) + ' million, of whom ' + f1(u) + ' million are unemployed. Work out the unemployment rate, to two decimal places.', u, lf, f1(u) + ' million', f1(lf) + ' million', 'Unemployment rate = unemployed ÷ labour force × 100. ');
    } },
    { skill: 'unemployment-rate', gen: function () {
      var c = pick(LANDS), lf = rint(2500, 60000) * 1000 + rint(0, 999), u = Math.round(lf * rint(20, 150) / 1000) + rint(0, 99);
      return shNum('In June 2025, ' + c + ' had ' + commas(u) + ' people unemployed out of a labour force of ' + commas(lf) + '. Work out the rate of unemployment, to two decimal places.', u, lf, commas(u), commas(lf));
    } },
    { skill: 'from-employed', gen: function () {
      var c = pick(LANDS), lf = rint(80, 600) / 10, e = rd(lf * (1 - rint(25, 130) / 1000), 1), u = rd(lf - e, 1);
      return shNum(c + ' has a labour force of ' + f1(lf) + ' million and ' + f1(e) + ' million people are employed. Work out the unemployment rate, to two decimal places.', u, lf, f1(u) + ' million', f1(lf) + ' million', 'First find the unemployed: ' + f1(lf) + ' − ' + f1(e) + ' = ' + f1(u) + ' million. ');
    } },
    { skill: 'from-employed', gen: function () {
      var c = pick(LANDS), e = rint(1200, 9000) * 1000, u = Math.round(e * rint(30, 140) / 1000 / 100) * 100, lf = e + u;
      return shNum('In ' + c + ', ' + commas(e) + ' people are employed and ' + commas(u) + ' people are unemployed. Work out the unemployment rate, to two decimal places.', u, lf, commas(u), commas(lf), 'The labour force is employed + unemployed = ' + commas(e) + ' + ' + commas(u) + ' = ' + commas(lf) + '. ');
    } },
    { skill: 'unemployment-rate', gen: function () {
      var c = pick(LANDS), pop = rint(150, 800) / 10, lf = rd(pop * rint(42, 55) / 100, 1), u = rd(lf * rint(30, 120) / 1000, 1);
      return shNum(c + ' has a population of ' + f1(pop) + ' million and a labour force of ' + f1(lf) + ' million. ' + f1(u) + ' million people are unemployed. Work out the unemployment rate, to two decimal places.', u, lf, f1(u) + ' million', f1(lf) + ' million', 'Divide by the labour force, not the population. ');
    } },
    { skill: 'unemployment-rate', gen: function () {
      var c = pick(LANDS), lf = rint(800, 9500), u = Math.round(lf * rint(30, 160) / 1000);
      return shNum('In ' + c + ' the labour force is ' + commas(lf) + ' thousand and ' + commas(u) + ' thousand people are unemployed. Work out the unemployment rate, to two decimal places.', u, lf, commas(u) + ' thousand', commas(lf) + ' thousand');
    } },
    { skill: 'unemployment-rate', gen: function () {
      var c = pick(LANDS), lf = rint(800, 4500) * 1000, u = Math.round(lf * rint(90, 300) / 1000 / 100) * 100;
      return shNum('In ' + c + ' there are ' + commas(lf) + ' young people (aged 16–24) in the labour force, and ' + commas(u) + ' of them are unemployed. Work out the youth unemployment rate, to two decimal places.', u, lf, commas(u), commas(lf));
    } },
    { skill: 'unemployment-rate', gen: function () {
      var names = lands(4), k = rint(0, 3), lf = names.map(function () { return rint(800, 6000); }), u = lf.map(function (x) { return Math.round(x * rint(25, 140) / 1000); });
      return shNum('The table shows labour market data for four countries (thousands of people).' + table(['Country', 'Labour force', 'Unemployed'], names.map(function (n, i) { return [n, commas(lf[i]), commas(u[i])]; })) + 'Work out the unemployment rate in <b>' + names[k] + '</b>, to two decimal places.', u[k], lf[k], commas(u[k]), commas(lf[k]), 'Use the ' + names[k] + ' row only. ');
    } },
    { skill: 'traps', gen: function () {
      var c = pick(LANDS), lf = rint(20, 90), u = rd(lf * rint(30, 120) / 1000, 1), a = share(u, lf);
      while (!uniq([f2(a), f2(a / 100), f2(lf / u * 100), f2(u / (lf * 2) * 100)])) { lf += 1; a = share(u, lf); }
      return MC(c + ' has a labour force of ' + lf + ' million and a population of ' + (lf * 2) + ' million. ' + f1(u) + ' million people are unemployed. What is the unemployment rate?',
        f2(a) + '%', [f2(a / 100) + '%', f2(rd(u * 100 / (lf * 2), 2)) + '%', f2(rd(lf * 100 / u, 2)) + '%'],
        f1(u) + ' ÷ ' + lf + ' × 100 = ' + pct(a) + '. The traps forget to multiply by 100, divide by the population, or flip the fraction.');
    } },
    { skill: 'traps', gen: function () {
      var c = pick(LANDS), lf = rint(200, 950) / 10, e = rd(lf * (1 - rint(30, 110) / 1000), 1), u = rd(lf - e, 1);
      return MC(c + ' has a labour force of ' + f1(lf) + ' million, of whom ' + f1(e) + ' million are employed. Which calculation gives the unemployment rate?',
        '(' + f1(lf) + ' − ' + f1(e) + ') ÷ ' + f1(lf) + ' × 100', [f1(e) + ' ÷ ' + f1(lf) + ' × 100', '(' + f1(lf) + ' − ' + f1(e) + ') ÷ ' + f1(e) + ' × 100', f1(lf) + ' ÷ (' + f1(lf) + ' − ' + f1(e) + ') × 100'],
        'Find the unemployed first (' + f1(lf) + ' − ' + f1(e) + ' = ' + f1(u) + ' million), then divide by the whole labour force and multiply by 100. Employed ÷ labour force gives the employment rate instead.');
    } },
    { skill: 'traps', gen: function () {
      var c = lands(2), la = rint(10, 40), lb = rint(60, 150), ua = rd(la * rint(80, 120) / 1000, 1), ub = rd(lb * rint(30, 60) / 1000, 1);
      while (ub <= ua) { lb += 10; ub = rd(lb * rint(30, 60) / 1000, 1); }
      var ra = share(ua, la), rb = share(ub, lb), hi = ra > rb ? c[0] : c[1];
      return MC(table(['Country', 'Labour force (million)', 'Unemployed (million)'], [[c[0], la, f1(ua)], [c[1], lb, f1(ub)]]) + 'Which country has the higher unemployment rate?',
        hi, [ra > rb ? c[1] : c[0], 'Both have the same rate', 'It cannot be worked out without the population'],
        c[0] + ': ' + f1(ua) + ' ÷ ' + la + ' × 100 = ' + pct(ra) + '. ' + c[1] + ': ' + f1(ub) + ' ÷ ' + lb + ' × 100 = ' + pct(rb) + '. More people unemployed does not mean a higher rate.');
    } },
    { skill: 'spending-share', gen: function () {
      var c = pick(LANDS), tot = rint(300, 950), part = Math.round(tot * rint(80, 380) / 1000);
      return shNum('In 2025 the government of ' + c + ' spent $' + commas(tot) + ' million on transport, of which $' + commas(part) + ' million went on railways. Work out the percentage of transport spending that went on railways, to two decimal places.', part, tot, '$' + part + ' million', '$' + tot + ' million');
    } },
    { skill: 'spending-share', gen: function () {
      var c = pick(LANDS), items = [['Health', rint(150, 260)], ['Education', rint(100, 200)], ['Defence', rint(40, 90)], ['Welfare', rint(180, 300)], ['Transport', rint(30, 80)]], k = rint(0, 4);
      var tot = items.reduce(function (s, r) { return s + r[1]; }, 0);
      return shNum('The table shows government spending in ' + c + ' ($bn).' + table(['Area', 'Spending ($bn)'], items.map(function (r) { return [r[0], r[1]]; }).concat([['<b>Total</b>', '<b>' + tot + '</b>']])) + 'What percentage of total spending went on <b>' + items[k][0].toLowerCase() + '</b>? Give your answer to two decimal places.',
        items[k][1], tot, items[k][1], tot);
    } },
    { skill: 'spending-share', gen: function () {
      var c = pick(LANDS), inc = rint(1200, 4500), rent = Math.round(inc * rint(180, 420) / 1000);
      return shNum('A household in ' + c + ' has a monthly income of $' + commas(inc) + ' and spends $' + commas(rent) + ' on rent. What percentage of its income goes on rent? Give your answer to two decimal places.', rent, inc, commas(rent), commas(inc));
    } },
    { skill: 'other-shares', gen: function () {
      var c = pick(LANDS), pop = rint(3000, 40000) * 1000 + rint(0, 999), poor = Math.round(pop * rint(80, 260) / 1000);
      return shNum('In 2025, ' + commas(poor) + ' of ' + c + '’s ' + commas(pop) + ' people were living in relative poverty. What percentage of the population was in relative poverty? Give your answer to two decimal places.', poor, pop, commas(poor), commas(pop));
    } },
    { skill: 'other-shares', gen: function () {
      var c = pick(LANDS), tot = rint(40, 300) / 10, agr = rd(tot * rint(80, 450) / 1000, 1);
      return shNum(c + ' has ' + f1(tot) + ' million people in employment, of whom ' + f1(agr) + ' million work in agriculture. What percentage of employment is in agriculture? Give your answer to two decimal places.', agr, tot, f1(agr), f1(tot));
    } },
    { skill: 'other-shares', gen: function () {
      var c = pick(LANDS), gdp = rint(800, 9000) / 10, def = rd(gdp * rint(15, 90) / 1000, 1);
      return shNum('In 2025 the government of ' + c + ' had a fiscal deficit of $' + f1(def) + 'bn. GDP was $' + commas(gdp, 1) + 'bn. Work out the deficit as a percentage of GDP, to two decimal places.', def, gdp, f1(def), commas(gdp, 1));
    } },
    { skill: 'other-shares', gen: function () {
      var c = lands(2), tot = rint(200, 950) / 10, part = rd(tot * rint(150, 450) / 1000, 1);
      return shNum(c[0] + ' exported goods worth $' + f1(tot) + 'bn in 2025, of which $' + f1(part) + 'bn went to ' + c[1] + '. What percentage of ' + c[0] + '’s exports went to ' + c[1] + '? Give your answer to two decimal places.', part, tot, f1(part), f1(tot));
    } },
    { skill: 'other-shares', gen: function () {
      var c = pick(LANDS), tot = rint(150, 700) / 10, it = rd(tot * rint(250, 450) / 1000, 1);
      return shNum('Total tax revenue in ' + c + ' was $' + f1(tot) + 'bn, of which income tax raised $' + f1(it) + 'bn. What percentage of tax revenue came from income tax? Give your answer to two decimal places.', it, tot, f1(it), f1(tot));
    } },
    { skill: 'other-shares', gen: function () {
      var c = pick(LANDS), gdp = rint(150, 900) / 10, prim = rd(gdp * rint(100, 400) / 1000, 1);
      return shNum('Of ' + c + '’s GDP of $' + f1(gdp) + 'bn, the primary sector (farming, fishing and mining) produced $' + f1(prim) + 'bn. What percentage of GDP came from the primary sector? Give your answer to two decimal places.', prim, gdp, f1(prim), f1(gdp));
    } },
    { skill: 'unemployment-rate', gen: function () {
      var c = pick(LANDS), u = rint(200, 2500) * 100, lt = Math.round(u * rint(150, 450) / 1000 / 10) * 10;
      return shNum('Of the ' + commas(u) + ' unemployed people in ' + c + ', ' + commas(lt) + ' have been out of work for more than a year. What percentage of the unemployed are long-term unemployed? Give your answer to two decimal places.', lt, u, commas(lt), commas(u), 'Here the whole is the number unemployed. ');
    } },
    { skill: 'traps', gen: function () {
      var c = pick(LANDS), tot = rint(120, 600), part = Math.round(tot * rint(100, 400) / 1000), a = share(part, tot);
      return MC('In ' + c + ', $' + part + 'm of a $' + tot + 'm health budget is spent on medicines. Which answer correctly gives the share spent on medicines?',
        f2(a) + '%', [f2(a / 100) + '%', f2(rd(tot * 100 / part, 2)) + '%', f2(rd(part * 100 / (tot - part), 2)) + '%'],
        part + ' ÷ ' + tot + ' × 100 = ' + pct(a) + '. Dividing by the rest of the budget instead of the whole, flipping the fraction, or forgetting × 100 are common mistakes.');
    } },
    S('traps', 'For the unemployment rate, which number is the “whole” you divide by?',
      'The labour force',
      ['The total population', 'The number employed', 'The working-age population'],
      'The unemployment rate = unemployed ÷ labour force × 100. The labour force is the employed plus the unemployed, not the whole population.')
  ] };

  /* ---------------- ECO-T21-26 Fiscal policy: taxes, spending and macroeconomic objectives ---------------- */
  var DIRECT = ['Income tax', 'Corporation tax on company profits', 'Inheritance tax', 'Capital gains tax'];
  var INDIRECT = ['Value added tax (VAT)', 'Excise duty on tobacco', 'Fuel duty', 'Customs duty on imported cars', 'Sales tax on clothing'];
  B['ECO-T21-26'] = { title: 'Fiscal policy: taxes, spending and macroeconomic objectives', items: [
    S('define', 'What is meant by <b>fiscal policy</b>?',
      'Government decisions on taxation, spending and borrowing to influence total demand',
      ['Central bank decisions on interest rates to influence borrowing and spending', 'Changes in the exchange rate set by the central bank to affect trade', 'Limits on the number of goods that can be imported each year'],
      'Fiscal policy uses the government’s budget: taxes, government spending and borrowing. Interest rates are monetary policy, set by the central bank.'),
    S('define', 'Which of the following is an example of fiscal policy?',
      'Cutting the rate of VAT from 20% to 15%',
      ['Raising the central bank interest rate', 'The central bank buying government bonds', 'A limit on the number of cars imported'],
      'A change in a tax rate is a fiscal policy decision. Interest rates and bond buying by the central bank are monetary policy, and an import limit is a trade measure.'),
    MU('define', 'Which of the following are fiscal policy tools?',
      ['Changing the rate of income tax', 'Changing the rate of VAT', 'Spending more on schools and hospitals', 'Changing the level of welfare benefits'],
      ['Changing the interest rate', 'The central bank buying financial assets'],
      'Fiscal policy is about government taxes and spending. Interest rates and asset purchases are carried out by the central bank as monetary policy.'),
    S('define', 'Which of the following is one of the main areas of government expenditure?',
      'Healthcare',
      ['VAT receipts', 'Income tax', 'Customs duties'],
      'Governments spend on areas such as healthcare, education, defence, welfare and infrastructure. VAT, income tax and customs duties are sources of revenue, not spending.'),
    S('tax-types', 'What is a <b>direct</b> tax?',
      'A tax on income, wealth or profit',
      ['A tax on spending on goods and services', 'A tax on goods coming into the country', 'A tax included in the price of goods in shops'],
      'Direct taxes are paid straight to the government out of income, wealth or profit, for example income tax and corporation tax. Taxes on spending are indirect.'),
    S('tax-types', 'What is an <b>indirect</b> tax?',
      'A tax on spending, included in the price of goods and services',
      ['A tax taken straight out of workers’ wages and salaries by employers', 'A tax on the profits made by companies', 'A tax on wealth passed on when someone dies'],
      'Indirect taxes, such as VAT and excise duties, are charged on spending and collected by sellers. The other three are direct taxes.'),
    { skill: 'tax-types', gen: function () {
      var right = pick(INDIRECT), wrong = sample(DIRECT, 3);
      return MC('Which one of the following is an <b>indirect</b> tax?', right, wrong,
        right + ' is charged on spending and is included in the price buyers pay, so it is indirect. ' + wrong.join(', ') + ' are taxes on income, profit or wealth, so they are direct.');
    } },
    { skill: 'tax-types', gen: function () {
      var right = pick(DIRECT), wrong = sample(INDIRECT, 3);
      return MC('Which one of the following is a <b>direct</b> tax?', right, wrong,
        right + ' is paid straight to the government on income, profit or wealth, so it is direct. The others are taxes on spending, so they are indirect.');
    } },
    { skill: 'policy-direction', gen: function () {
      var c = pick(LANDS);
      var pool = [
        ['cuts the rate of income tax', 'Expansionary fiscal policy'],
        ['raises spending on new railways and roads', 'Expansionary fiscal policy'],
        ['lowers VAT on household goods', 'Expansionary fiscal policy'],
        ['raises the rate of income tax', 'Contractionary fiscal policy'],
        ['cuts government spending on public building projects', 'Contractionary fiscal policy'],
        ['raises VAT from 15% to 18%', 'Contractionary fiscal policy'],
        ['(through its central bank) cuts interest rates', 'Expansionary monetary policy'],
        ['(through its central bank) raises interest rates', 'Contractionary monetary policy']
      ];
      var s = pick(pool), all = ['Expansionary fiscal policy', 'Contractionary fiscal policy', 'Expansionary monetary policy', 'Contractionary monetary policy'];
      return MC('The government of ' + c + ' ' + s[0] + '. Which type of policy is this?', s[1], all.filter(function (x) { return x !== s[1]; }),
        /monetary/.test(s[1]) ? 'Interest rates are set by the central bank, so this is monetary policy, not fiscal policy. ' + (/Expansionary/.test(s[1]) ? 'Lower rates boost spending: expansionary.' : 'Higher rates reduce spending: contractionary.')
          : 'This changes taxes or government spending, so it is fiscal policy. ' + (/Expansionary/.test(s[1]) ? 'It raises total demand: expansionary.' : 'It reduces total demand: contractionary.'));
    } },
    S('expansionary-chain', 'The government of Valoria cuts income tax to reduce unemployment. Which chain is correct?',
      'Disposable income rises, spending rises, firms raise output and hire',
      ['Disposable income falls, spending falls, firms cut jobs', 'Prices rise, spending falls, firms raise output', 'Tax revenue rises, so firms hire more workers'],
      'Lower income tax leaves workers with more take-home pay. They spend more, so firms sell more, raise output and need more workers, which reduces unemployment.'),
    S('expansionary-chain', 'Galdia spends heavily on new hospitals and roads during a recession. How might this reduce unemployment?',
      'Building firms hire workers, and their wages are spent, raising demand further',
      ['It reduces total demand, so firms cut their prices and then hire more workers', 'It raises taxes, so workers have more to spend', 'It lowers interest rates, so firms borrow more'],
      'Government spending is part of total demand. Construction firms hire workers, who then spend their wages, creating more demand and more jobs elsewhere.'),
    S('expansionary-chain', 'Westmark cuts VAT on most goods and services. How might this reduce unemployment?',
      'Prices fall, so demand rises and firms employ more workers',
      ['Prices rise, so demand falls and firms employ fewer workers', 'Wages fall, so workers leave the labour force', 'Tax revenue rises, so firms pay less corporation tax'],
      'VAT is part of the price shoppers pay. A cut lowers prices, so people buy more. Firms raise output to meet the extra demand and take on more workers.'),
    S('expansionary-chain', 'How might a cut in direct taxes raise the standard of living in Corvana?',
      'Workers keep more take-home pay to spend on goods and services',
      ['Prices of goods and services in shops rise straight away by the same amount', 'Government spending on schools must rise', 'Imports become more expensive'],
      'Lower income tax raises disposable income, so households can afford more or better goods and services, which raises their living standards.'),
    S('contractionary', 'Inflation in Eskara is 9% because consumer spending is booming. Which fiscal measure would best reduce it?',
      'Raise the rate of income tax',
      ['Cut the rate of income tax', 'Lower interest rates', 'Increase government spending'],
      'Higher income tax lowers disposable income, so spending falls and demand-pull pressure eases. Lower interest rates are monetary policy and would add to spending.'),
    S('contractionary', 'Which fiscal policy is most likely to reduce demand-pull inflation?',
      'Cutting government spending',
      ['Cutting income tax', 'Raising welfare benefits', 'Cutting VAT'],
      'Demand-pull inflation comes from too much spending. Cutting government spending reduces total demand, easing the pressure on prices.'),
    S('objectives', 'Which objective is expansionary fiscal policy mainly used to achieve?',
      'Reducing cyclical unemployment',
      ['Reducing demand-pull inflation', 'Reducing a fiscal deficit', 'Reducing total demand'],
      'Expansionary policy (lower taxes or more spending) raises demand, output and jobs. Reducing inflation, a deficit or demand needs contractionary policy.'),
    S('objectives', 'Expansionary fiscal policy that cuts unemployment in Pellara may also',
      'raise inflation if firms are near full capacity',
      ['reduce inflation by lowering demand', 'reduce the fiscal deficit at once', 'lower the level of output'],
      'Extra demand creates jobs, but if firms cannot raise output much more, it pushes up prices. This is a conflict between objectives.'),
    S('evaluate', 'Why might a rise in VAT fail to lower inflation in the short run?',
      'VAT is part of prices, so the price level rises at first',
      ['VAT is a direct tax taken straight from people’s incomes and wages', 'VAT increases disposable income', 'VAT is set by the central bank'],
      'A VAT rise is added to shop prices, so the CPI jumps when it is introduced, even though lower spending may reduce inflation later.'),
    S('evaluate', 'Consumer confidence in Arvenia is very low when the government cuts income tax. Why might unemployment fall by less than hoped?',
      'Households may save much of their extra income',
      ['Households must spend all extra income on imports', 'Tax cuts reduce disposable income', 'Firms always cut prices after a tax cut'],
      'Worried households may save rather than spend. If spending does not rise much, firms do not need many more workers.'),
    S('evaluate', 'Most consumer goods sold in Nortavia are imported. Why might a tax cut create few new jobs in Nortavia?',
      'Much of the extra spending goes on imports, not on domestic output',
      ['Imported goods are not affected by consumer spending', 'Tax cuts make imports illegal', 'Spending on imports directly raises demand for domestic workers in Nortavia'],
      'Spending on imports creates jobs in other countries. Only spending on goods made at home leads domestic firms to hire more workers.'),
    S('evaluate', 'Unemployment in Istrany is mainly structural. Why is extra government spending likely to be less effective?',
      'Jobless workers lack the skills for the jobs created',
      ['Structural unemployment is caused by too much demand', 'Government spending always lowers demand', 'Structural unemployment ends on its own within weeks'],
      'Fiscal policy works on demand, but structural unemployment is a skills mismatch. New jobs may be filled by others while the structurally unemployed stay out of work.'),
    S('evaluate', 'The government of Quorin approves a new railway to cut unemployment, but building cannot start for two years. Which limitation does this show?',
      'Time lags',
      ['The poverty trap', 'Cost-push inflation', 'Menu costs'],
      'Fiscal policy can take a long time to plan and carry out, so its effect on jobs may come too late.'),
    S('evaluate', 'Why might a government with large debts be cautious about expansionary fiscal policy?',
      'It would widen the fiscal deficit and add to debt',
      ['It would create a fiscal surplus too quickly', 'It would reduce total demand', 'It would raise interest rates set by the government'],
      'Lower taxes and higher spending mean the government borrows more, so the deficit and debt grow, which may mean higher taxes or spending cuts later.'),
    S('evaluate', 'Inflation in Taluna is caused by rising imported oil prices. Why might raising taxes be a poor choice?',
      'It reduces demand but not costs, so it may deepen job losses',
      ['It would raise the world price of oil', 'Higher taxes always cause demand-pull inflation', 'It makes imported oil cheaper at once'],
      'This is cost-push inflation. Higher taxes cut spending and jobs but do nothing about the rising oil cost, so inflation may stay high while unemployment rises.')
  ] };

  /* ---------------- ECO-CALC-20 Total revenue from direct or indirect taxes ---------------- */
  var D_TAX = ['Income tax', 'Corporation tax', 'Capital gains tax', 'Inheritance tax'];
  var I_TAX = ['VAT', 'Fuel duty', 'Customs duties', 'Tobacco duty', 'Alcohol duty'];
  function taxRows(nd, ni, cur) {
    var d = sample(D_TAX, nd), ix = sample(I_TAX, ni), rows = [];
    d.forEach(function (n) { rows.push({ n: n, d: true, v: n === 'Income tax' ? rint(150, 400) / 10 : n === 'Corporation tax' ? rint(40, 120) / 10 : rint(3, 30) / 10 }); });
    ix.forEach(function (n) { rows.push({ n: n, d: false, v: n === 'VAT' ? rint(100, 300) / 10 : rint(3, 60) / 10 }); });
    return shuf(rows);
  }
  function taxTable(rows, unit) { return table(['Tax', 'Revenue (' + unit + ')'], rows.map(function (r) { return [r.n, f1(r.v)]; })); }
  function sumOf(rows, dir) { return rd(rows.filter(function (r) { return r.d === dir; }).reduce(function (s, r) { return s + r.v; }, 0), 1); }
  function sumText(rows, dir, cur) { return rows.filter(function (r) { return r.d === dir; }).map(function (r) { return cur + f1(r.v) + 'bn'; }).join(' + '); }
  function taxNum(dir, nd, ni, cur, intro) {
    var rows = taxRows(nd, ni), c = pick(LANDS), a = sumOf(rows, dir), word = dir ? 'direct' : 'indirect';
    return NUM((intro ? intro.replace('#', c) : 'The table shows tax revenue for ' + c + ' in one month.') + taxTable(rows, cur + 'bn') + 'Work out the total revenue raised by <b>' + word + '</b> taxes. Give your answer in ' + cur + 'bn.',
      a, cur + 'bn', 'The ' + word + ' taxes are ' + rows.filter(function (r) { return r.d === dir; }).map(function (r) { return r.n; }).join(', ') + '. ' + sumText(rows, dir, cur) + ' = ' + cur + f1(a) + 'bn.', 0.01, f1(a));
  }
  B['ECO-CALC-20'] = { title: 'Total revenue from direct or indirect taxes', items: [
    { skill: 'sum-indirect', gen: function () { return taxNum(false, 2, 3, '£'); } },
    { skill: 'sum-direct', gen: function () { return taxNum(true, 2, 3, '£'); } },
    { skill: 'sum-direct', gen: function () { return taxNum(true, 3, 2, '$', 'The table shows government tax receipts in # for one quarter.'); } },
    { skill: 'sum-indirect', gen: function () { return taxNum(false, 2, 4, '$', 'The table shows the main taxes collected by the government of # last month.'); } },
    { skill: 'traps', gen: function () {
      var rows, a, it, vat, opts, c = pick(LANDS);
      do {
        rows = taxRows(2, 3); a = sumOf(rows, false);
        it = rows.filter(function (r) { return r.d; })[0]; vat = rows.filter(function (r) { return !r.d; })[0];
        opts = [a, rd(it.v + vat.v, 1), rd(a + it.v, 1), sumOf(rows, true)];
      } while (!uniq(opts.map(f1)));
      return MC('The table shows tax revenue for ' + c + '.' + taxTable(rows, '£bn') + 'What is the total revenue raised by indirect taxes?', '£' + f1(opts[0]) + 'bn', opts.slice(1).map(function (v) { return '£' + f1(v) + 'bn'; }),
        'Indirect taxes are on spending: ' + rows.filter(function (r) { return !r.d; }).map(function (r) { return r.n; }).join(', ') + '. ' + sumText(rows, false, '£') + ' = £' + f1(a) + 'bn. Wrong options mix in a direct tax or add only the direct taxes.');
    } },
    { skill: 'traps', gen: function () {
      var rows, a, opts, c = pick(LANDS);
      do {
        rows = taxRows(2, 3); a = sumOf(rows, true);
        var d0 = rows.filter(function (r) { return r.d; })[0], i0 = rows.filter(function (r) { return !r.d; })[0];
        opts = [a, rd(a + sumOf(rows, false), 1), sumOf(rows, false), rd(d0.v + i0.v, 1)];
      } while (!uniq(opts.map(f1)));
      return MC('The table shows tax revenue for ' + c + '.' + taxTable(rows, '$bn') + 'What is the total revenue raised by direct taxes?', '$' + f1(opts[0]) + 'bn', opts.slice(1).map(function (v) { return '$' + f1(v) + 'bn'; }),
        'Direct taxes are on income, profit or wealth: ' + rows.filter(function (r) { return r.d; }).map(function (r) { return r.n; }).join(', ') + '. ' + sumText(rows, true, '$') + ' = $' + f1(a) + 'bn. The other options include indirect taxes or leave out a direct tax.');
    } },
    { skill: 'sum-direct', gen: function () {
      var c = pick(LANDS), rows = shuf([['Income tax', rint(9000, 25000), true], ['Corporation tax', rint(2000, 8000), true], ['VAT', rint(7000, 18000), false], ['Excise duties', rint(800, 3500), false], ['Customs duties', rint(200, 1500), false]]);
      var a = rows.filter(function (r) { return r[2]; }).reduce(function (s, r) { return s + r[1]; }, 0);
      return NUM('The table shows tax revenue for ' + c + ' last year.' + table(['Tax', 'Revenue ($ million)'], rows.map(function (r) { return [r[0], commas(r[1])]; })) + 'Work out the total revenue from <b>direct</b> taxes, in $ million.',
        a, '$m', 'Direct taxes: income tax and corporation tax. ' + rows.filter(function (r) { return r[2]; }).map(function (r) { return commas(r[1]); }).join(' + ') + ' = $' + commas(a) + ' million.', null, commas(a));
    } },
    { skill: 'compare-groups', gen: function () {
      var rows = taxRows(2, 3), c = pick(LANDS), d = sumOf(rows, true), i = sumOf(rows, false);
      while (Math.abs(d - i) < 0.5) { rows = taxRows(2, 3); d = sumOf(rows, true); i = sumOf(rows, false); }
      var a = rd(Math.abs(i - d), 1), more = i > d ? 'indirect' : 'direct', less = i > d ? 'direct' : 'indirect';
      return NUM('The table shows tax revenue for ' + c + '.' + taxTable(rows, '£bn') + 'How much more revenue was raised by ' + more + ' taxes than by ' + less + ' taxes? Give your answer in £bn.',
        a, '£bn', 'Direct: ' + sumText(rows, true, '£') + ' = £' + f1(d) + 'bn. Indirect: ' + sumText(rows, false, '£') + ' = £' + f1(i) + 'bn. Difference = £' + f1(a) + 'bn.', 0.01, f1(a));
    } },
    { skill: 'compare-groups', gen: function () {
      var rows = taxRows(2, 3), c = pick(LANDS), d = sumOf(rows, true), i = sumOf(rows, false);
      while (Math.abs(d - i) < 0.5) { rows = taxRows(2, 3); d = sumOf(rows, true); i = sumOf(rows, false); }
      var diff = f1(Math.abs(i - d)), dm = d > i;
      return MC('The table shows tax revenue for ' + c + '.' + taxTable(rows, '$bn') + 'Which statement is correct?',
        (dm ? 'Direct' : 'Indirect') + ' taxes raised more, by $' + diff + 'bn',
        [(dm ? 'Indirect' : 'Direct') + ' taxes raised more, by $' + diff + 'bn', (dm ? 'Direct' : 'Indirect') + ' taxes raised more, by $' + f1(d + i) + 'bn', 'Direct and indirect taxes raised the same amount'],
        'Direct: ' + sumText(rows, true, '$') + ' = $' + f1(d) + 'bn. Indirect: ' + sumText(rows, false, '$') + ' = $' + f1(i) + 'bn. So ' + (dm ? 'direct' : 'indirect') + ' taxes raised $' + diff + 'bn more.');
    } },
    { skill: 'reverse', gen: function () {
      var c = pick(LANDS), vat = rint(120, 280) / 10, cu = rint(5, 40) / 10, ex = rint(20, 70) / 10, tot = rd(vat + cu + ex, 1);
      return NUM('In ' + c + ' the total revenue from indirect taxes last month was £' + f1(tot) + 'bn. The only indirect taxes were VAT (£' + f1(vat) + 'bn), customs duties (£' + f1(cu) + 'bn) and excise duties. Work out the revenue from excise duties, in £bn.',
        ex, '£bn', 'Excise duties = total indirect − VAT − customs = ' + f1(tot) + ' − ' + f1(vat) + ' − ' + f1(cu) + ' = £' + f1(ex) + 'bn.', 0.01, f1(ex));
    } },
    { skill: 'reverse', gen: function () {
      var c = pick(LANDS), it = rint(150, 350) / 10, ct = rint(40, 110) / 10, ind = rint(150, 380) / 10, tot = rd(it + ct + ind, 1);
      return NUM('Total tax revenue in ' + c + ' last month was $' + f1(tot) + 'bn. The only direct taxes were income tax ($' + f1(it) + 'bn) and corporation tax ($' + f1(ct) + 'bn); all the rest came from indirect taxes. Work out the revenue from indirect taxes, in $bn.',
        rd(ind, 1), '$bn', 'Direct taxes = ' + f1(it) + ' + ' + f1(ct) + ' = $' + f1(it + ct) + 'bn. Indirect = ' + f1(tot) + ' − ' + f1(it + ct) + ' = $' + f1(ind) + 'bn.', 0.01, f1(ind));
    } },
    { skill: 'sum-indirect', gen: function () {
      var c = pick(LANDS), names = ['Income tax', 'Corporation tax', 'VAT', 'Excise duties', 'Customs duties'], dir = [true, true, false, false, false];
      var m1 = names.map(function (n, i) { return i === 0 ? rint(150, 300) / 10 : i === 2 ? rint(100, 200) / 10 : rint(5, 60) / 10; });
      var m2 = names.map(function (n, i) { return i === 0 ? rint(150, 300) / 10 : i === 2 ? rint(100, 200) / 10 : rint(5, 60) / 10; });
      var a = rd(m2[2] + m2[3] + m2[4], 1);
      return NUM('The table shows tax revenue in ' + c + ' (£bn).' + table(['Tax', 'April', 'May'], names.map(function (n, i) { return [n, f1(m1[i]), f1(m2[i])]; })) + 'Work out the total revenue raised by indirect taxes in <b>May</b>, in £bn.',
        a, '£bn', 'Use the May column only. Indirect taxes: VAT, excise and customs duties. ' + f1(m2[2]) + ' + ' + f1(m2[3]) + ' + ' + f1(m2[4]) + ' = £' + f1(a) + 'bn.', 0.01, f1(a));
    } },
    { skill: 'sum-direct', gen: function () {
      var c = pick(LANDS), names = ['Income tax', 'Corporation tax', 'Fuel duty', 'VAT'], y1 = [rint(200, 400) / 10, rint(50, 120) / 10, rint(20, 60) / 10, rint(150, 280) / 10], y2 = y1.map(function (v) { return rd(v * (1 + rint(-5, 8) / 100), 1); });
      var a = rd(y1[0] + y1[1], 1);
      return NUM('The table shows tax revenue in ' + c + ' ($bn).' + table(['Tax', '2024', '2025'], names.map(function (n, i) { return [n, f1(y1[i]), f1(y2[i])]; })) + 'Work out the total revenue from direct taxes in <b>2024</b>, in $bn.',
        a, '$bn', 'Use the 2024 column. Direct taxes: income tax and corporation tax. ' + f1(y1[0]) + ' + ' + f1(y1[1]) + ' = $' + f1(a) + 'bn.', 0.01, f1(a));
    } },
    { skill: 'classify', gen: function () {
      var right = pick(I_TAX), wrong = sample(D_TAX, 3);
      return MC('Before adding up the indirect taxes in a table, you must pick them out. Which of these is an indirect tax?', right, wrong,
        right + ' is a tax on spending, so it is indirect. ' + wrong.join(', ') + ' are taxes on income, profit or wealth (direct).');
    } },
    { skill: 'classify', gen: function () {
      var right = pick(D_TAX), wrong = sample(I_TAX, 3);
      return MC('Before adding up the direct taxes in a table, you must pick them out. Which of these is a direct tax?', right, wrong,
        right + ' is a tax on income, profit or wealth, so it is direct. ' + wrong.join(', ') + ' are taxes on spending (indirect).');
    } },
    MU('classify', 'A table of tax revenue lists the taxes below. Which of them should be added to find the total from <b>indirect</b> taxes?',
      ['VAT', 'Excise duties', 'Customs duties'],
      ['Income tax', 'Corporation tax', 'Capital gains tax'],
      'VAT, excise duties and customs duties are taxes on spending (indirect). Income tax, corporation tax and capital gains tax are direct taxes on income, profit or wealth.'),
    MU('classify', 'A table of tax revenue lists the taxes below. Which of them should be added to find the total from <b>direct</b> taxes?',
      ['Income tax', 'Corporation tax', 'Inheritance tax'],
      ['Fuel duty', 'VAT', 'Tariffs on imports'],
      'Direct taxes are paid out of income, profit or wealth. Fuel duty, VAT and tariffs are paid when goods are bought, so they are indirect.'),
    { skill: 'traps', gen: function () {
      var rows = taxRows(2, 3), c = pick(LANDS), a = sumOf(rows, false), it = rows.filter(function (r) { return r.n === 'Income tax'; })[0] || rows.filter(function (r) { return r.d; })[0];
      var stu = rd(a + it.v, 1);
      return MC('The table shows tax revenue for ' + c + '.' + taxTable(rows, '£bn') + 'A student says the total from indirect taxes is £' + f1(stu) + 'bn. What mistake has the student made?',
        'Counted ' + it.n.toLowerCase() + ' as an indirect tax', ['Left out VAT, which is a direct tax', 'Added only the direct taxes', 'Forgot to divide by the number of taxes'],
        'The correct indirect total is ' + sumText(rows, false, '£') + ' = £' + f1(a) + 'bn. The student added ' + it.n.toLowerCase() + ' (£' + f1(it.v) + 'bn), which is a direct tax.');
    } },
    { skill: 'traps', gen: function () {
      var rows, c = pick(LANDS), ind, dir, right, w1, w2, w3;
      do {
        rows = taxRows(2, 3); ind = rows.filter(function (r) { return !r.d; }); dir = rows.filter(function (r) { return r.d; });
        right = ind.map(function (r) { return f1(r.v); }).join(' + ');
        w1 = [ind[0], ind[1], dir[0]].map(function (r) { return f1(r.v); }).join(' + '); w2 = dir.map(function (r) { return f1(r.v); }).join(' + '); w3 = [ind[0], dir[0], dir[1]].map(function (r) { return f1(r.v); }).join(' + ');
      } while (!uniq([right, w1, w2, w3]) || !uniq(rows.map(function (r) { return f1(r.v); })));
      return MC('The table shows tax revenue for ' + c + '.' + taxTable(rows, '$bn') + 'Which calculation gives the total revenue from indirect taxes, in $bn?', right, [w1, w2, w3],
        'Add only the taxes on spending: ' + ind.map(function (r) { return r.n + ' (' + f1(r.v) + ')'; }).join(', ') + '. The other sums include income, profit or wealth taxes.');
    } },
    { skill: 'sum-indirect', gen: function () {
      var c = pick(['the island of Marisol', 'the Tamberry Isles', 'Coral Bay Islands']), v = [rint(40, 160) / 100, rint(10, 90) / 100, rint(5, 60) / 100], it = rint(80, 250) / 100;
      var a = rd(v[0] + v[1] + v[2], 2);
      var rows = shuf([['Sales tax', v[0]], ['Tariffs on imports', v[1]], ['Fuel duty', v[2]], ['Income tax', it]]);
      return NUM('The table shows tax revenue for ' + c + ' last year ($bn).' + table(['Tax', 'Revenue ($bn)'], rows.map(function (r) { return [r[0], f2(r[1])]; })) + 'Work out the total revenue from indirect taxes, in $bn to two decimal places.',
        a, '$bn', 'Indirect taxes: sales tax, tariffs and fuel duty. ' + f2(v[0]) + ' + ' + f2(v[1]) + ' + ' + f2(v[2]) + ' = $' + f2(a) + 'bn. Income tax is direct, so leave it out.', 0.005, f2(a));
    } },
    S('classify', 'Why is VAT classed as an indirect tax?',
      'It is charged on spending and collected by sellers',
      ['It is taken straight from workers’ wages', 'It is charged on the profits of companies', 'It is paid only by the richest households'],
      'VAT is added to the price of goods and services. The seller collects it and passes it to the government, so it reaches the government indirectly.'),
    S('classify', 'Why is corporation tax classed as a direct tax?',
      'It is paid straight to the government out of a firm’s profits',
      ['It is added to the price of goods in shops', 'It is charged on goods coming into the country', 'It is collected by shops on behalf of customers'],
      'Corporation tax is a tax on profit, paid by the firm directly to the government. Taxes added to prices or imports are indirect.')
  ] };

  /* ---------------- ECO-T21-21 Reducing poverty: progressive tax, benefits, education, healthcare ---------------- */
  B['ECO-T21-21'] = { title: 'Reducing poverty: progressive tax, benefits, education, healthcare', items: [
    S('progressive-tax', 'What is a <b>progressive</b> tax?',
      'The percentage of income paid in tax rises as income rises',
      ['Everyone pays the same percentage of their income', 'Lower earners pay a larger share of their income', 'Higher earners pay more money in tax, but at the same rate as others'],
      'Progressive means the <b>share</b> (percentage) of income taken in tax rises with income. Paying more money at the same rate is a proportional (flat) tax.'),
    { skill: 'progressive-tax', gen: function () {
      var c = pick(LANDS), inc = [rint(15, 25) * 1000, rint(45, 60) * 1000, rint(110, 150) * 1000], kind = rint(0, 2);
      var rates = kind === 0 ? [pick([5, 8, 10]), pick([18, 20, 22]), pick([32, 35, 40])] : kind === 1 ? [pick([14, 15, 16]), pick([9, 10]), pick([5, 6])] : (function (r) { return [r, r, r]; })(pick([12, 15, 20]));
      var tax = inc.map(function (x, i) { return x * rates[i] / 100; });
      var names = ['Progressive', 'Regressive', 'Proportional (flat)'];
      return MC('The table shows income tax paid by three people in ' + c + '.' + table(['Annual income', 'Income tax paid'], inc.map(function (x, i) { return [money(x), money(tax[i])]; })) + 'What type of tax system is this?',
        names[kind], names.filter(function (_, i) { return i !== kind; }).concat(['Indirect']),
        'Work out the share of income paid: ' + inc.map(function (x, i) { return money(tax[i]) + ' ÷ ' + money(x) + ' = ' + rates[i] + '%'; }).join('; ') + '. ' +
        (kind === 0 ? 'The share rises with income, so it is progressive.' : kind === 1 ? 'The share falls as income rises, so it is regressive, even though richer people pay more money.' : 'Everyone pays the same share, so it is proportional, even though richer people pay more money.'));
    } },
    { skill: 'progressive-tax', gen: function () {
      var c = pick(LANDS), allow = pick([8000, 10000, 12000]), rate = pick([20, 25, 30]), y1 = allow + rint(4, 12) * 1000, y2 = allow + rint(60, 150) * 1000;
      var t1 = (y1 - allow) * rate / 100, t2 = (y2 - allow) * rate / 100, r1 = rd(t1 * 100 / y1, 1), r2 = rd(t2 * 100 / y2, 1);
      return MC('In ' + c + ' the first ' + money(allow) + ' of income is tax-free and income above that is taxed at ' + rate + '%. Amira earns ' + money(y1) + ' and Jonas earns ' + money(y2) + '. Which statement is correct?',
        'Amira pays ' + f1(r1) + '% of her income and Jonas ' + f1(r2) + '%, so the tax is progressive',
        ['Both pay ' + rate + '% of their income, so the tax is proportional', 'Jonas pays a smaller share of his income, so the tax is regressive', 'Amira pays ' + f1(r2) + '% and Jonas ' + f1(r1) + '%, so the tax is progressive'],
        'Amira pays ' + money(t1) + ' (' + f1(r1) + '% of income); Jonas pays ' + money(t2) + ' (' + f1(r2) + '%). The tax-free amount means the share paid rises with income, so the system is progressive.');
    } },
    S('progressive-tax', 'Under a flat income tax of 15%, a person earning $20,000 pays $3,000 and one earning $200,000 pays $30,000. Which statement is correct?',
      'It is proportional, not progressive, because both pay 15%',
      ['It is progressive because the rich person pays more money', 'It is regressive because the poorer person pays less money', 'It is an indirect tax because it is a flat rate'],
      'What matters is the share of income. Both pay 15%, so the tax is proportional. A progressive tax would take a higher percentage from the higher earner.'),
    S('progressive-tax', 'Why is VAT usually described as regressive?',
      'Low earners spend more of their income, so VAT takes a bigger share',
      ['VAT rates rise step by step as people’s incomes rise, like income tax', 'Only rich people pay VAT on goods', 'VAT is charged on income rather than spending'],
      'Poorer households spend most of their income, much of it on taxed goods, while richer households save more. So VAT takes a larger percentage of a low income.'),
    S('progressive-tax', 'How does a progressive income tax reduce inequality?',
      'It takes a larger share from high incomes, narrowing the gap after tax',
      ['It takes the same share of income from everyone, so the gaps stay the same', 'It raises prices for low-income households', 'It lowers the wages that firms pay to the rich'],
      'Because higher earners pay a higher percentage, the gap between rich and poor incomes is smaller after tax. The extra revenue can also fund support for the poor.'),
    S('progressive-tax', 'How can revenue from progressive taxation help reduce poverty?',
      'It can pay for benefits, schools and hospitals for low-income families',
      ['It is returned to the highest earners as tax refunds at the end of each year', 'It is used to raise VAT on basic food', 'It reduces the wages of low-paid workers'],
      'Taxing high earners more gives the government money to redistribute through benefits and public services, which raises the living standards of the poor.'),
    S('benefits', 'How do unemployment benefits reduce absolute poverty?',
      'They give income to buy food, shelter and other basic needs',
      ['They raise the skills of the unemployed at once, so wages rise quickly', 'They reduce the rate of income tax for the rich', 'They raise the price of food for poor households'],
      'Benefits are payments to people on low or no income. The money lets them afford essentials they could not otherwise buy.'),
    MU('benefits', 'Which of the following are benefit payments that can redistribute income?',
      ['Child benefit', 'State pension', 'Unemployment benefit'],
      ['Corporation tax', 'A tariff on imported goods'],
      'Benefits are payments from the government to people on low or no income, such as families with children, pensioners and the unemployed. Taxes and tariffs are revenue, not benefits.'),
    S('benefits', 'The government of Galdia gives monthly food rations to its poorest households. How does this reduce poverty?',
      'Families get enough food even on very low incomes, improving health',
      ['It raises the wages of all workers in Galdia', 'It takes a larger share of income from the rich', 'It trains all of the unemployed in Galdia for skilled and well-paid jobs'],
      'Rations meet a basic need directly, so poor families eat better and stay healthier, which reduces absolute poverty.'),
    { skill: 'drawbacks', gen: function () {
      var c = pick(LANDS), w = rint(28, 45) * 10, b = Math.round(w * rint(55, 70) / 1000) * 10, t = Math.round(w * rint(10, 15) / 1000) * 10, gain = w - b - t;
      return MC('In ' + c + ', Leo receives benefits of $' + b + ' a week. He is offered a job paying $' + w + ' a week, but he would lose all his benefits and pay $' + t + ' in tax. What does this situation illustrate?',
        'The poverty trap', ['Progressive taxation', 'Frictional unemployment', 'Absolute poverty'],
        'Leo would be only $' + w + ' − $' + b + ' − $' + t + ' = $' + gain + ' a week better off in work. When benefits are withdrawn as income rises, the gain from working is small: the poverty trap.');
    } },
    S('drawbacks', 'What is the <b>poverty trap</b>?',
      'Benefits are withdrawn as income rises, so working pays little',
      ['Prices rise faster than wages for low-paid workers', 'Rich people avoid paying income tax', 'Poor countries cannot borrow from abroad'],
      'If taking a job or working longer hours means losing benefits and paying tax, the extra income is small, which discourages work.'),
    S('drawbacks', 'Why might a large rise in the top rate of income tax in Arvenia reduce its benefit to the poor?',
      'High earners may work less, avoid tax or leave, so revenue falls short',
      ['It would immediately raise the prices of basic goods bought by poor families', 'It would cut the benefits paid to the poor', 'It would make VAT a progressive tax'],
      'Very high tax rates can discourage work and investment and encourage avoidance, so the extra revenue available for redistribution may be smaller than hoped.'),
    S('drawbacks', 'Why might investment in schools be slow to reduce poverty?',
      'It takes years before pupils join the labour force',
      ['Education always reduces the incomes of the poor', 'Schools raise prices in the shops', 'Education has no effect on future earnings'],
      'Education raises skills and future earnings, but the benefit appears only when today’s pupils start work. This time lag is a key limitation.'),
    S('drawbacks', 'Kestria spends an extra $2bn on cash benefits. What is the opportunity cost?',
      'Other uses of the $2bn, such as building roads or hospitals',
      ['The extra income received by poor families', 'The $2bn itself, which is lost forever once it has been spent', 'The tax paid by the poorest households'],
      'Opportunity cost is the next best alternative given up. Money spent on benefits cannot also be spent on other services or projects.'),
    MU('drawbacks', 'Which of the following are possible drawbacks of using benefits and progressive taxes to reduce poverty?',
      ['Benefits can reduce the incentive to work', 'High tax rates can discourage work and investment', 'The money has an opportunity cost'],
      ['Benefits immediately raise the skills of the workforce', 'Progressive taxes take a larger share from the poor'],
      'Benefits can create a poverty trap, high tax rates can discourage effort and all spending has an opportunity cost. Benefits do not raise skills, and a progressive tax takes a <b>smaller</b> share from the poor.'),
    S('education-health', 'How does government investment in education reduce poverty in the long run?',
      'People gain skills, so they can get better-paid jobs',
      ['It lowers the income tax paid by the rich', 'It gives every family in the country a weekly cash payment', 'It reduces the prices of all goods'],
      'Education builds human capital. Better-skilled workers are more productive and can earn higher wages, lifting them out of poverty.'),
    S('education-health', 'Why can free healthcare stop families falling into poverty?',
      'They avoid large medical bills and stay well enough to work',
      ['It raises the wages of all doctors and nurses', 'It increases the rate of VAT on medicines', 'It replaces the need for families to earn any income at all from work'],
      'Illness can cost a family both its savings (medical bills) and its income (lost work). Free healthcare protects against both.'),
    S('education-health', 'A government in Ruvala trains unemployed adults in computer and building skills. How might this reduce poverty?',
      'They can find work and earn an income instead of relying on benefits',
      ['It automatically increases the amount of benefits they receive each week', 'It takes a larger share of income from the rich', 'It reduces the price of food in the shops'],
      'Training gives people the skills employers want, so they can get jobs and earn wages, raising their incomes above the poverty line.'),
    { skill: 'compare', gen: function () {
      var c = pick(LANDS);
      var pool = [
        ['The government of ' + c + ' raises the income tax rate on incomes above $150,000 from 35% to 45%.', 'Progressive taxation'],
        ['The government of ' + c + ' makes monthly cash payments to every family with children on a low income.', 'Benefit payments'],
        ['The government of ' + c + ' builds new primary schools in its poorest villages and pays for more teachers.', 'Investment in education'],
        ['The government of ' + c + ' opens free clinics and pays for vaccinations in poor districts.', 'Investment in healthcare'],
        ['The government of ' + c + ' raises the state pension paid to older people with no other income.', 'Benefit payments'],
        ['The government of ' + c + ' introduces a new top tax band so the highest earners pay a bigger share of income.', 'Progressive taxation']
      ];
      var s = pick(pool), all = ['Progressive taxation', 'Benefit payments', 'Investment in education', 'Investment in healthcare'];
      return MC(s[0] + ' Which method of reducing poverty and inequality is this?', s[1], all.filter(function (x) { return x !== s[1]; }),
        { 'Progressive taxation': 'A higher share of income is taken from high earners, narrowing the gap: progressive taxation.', 'Benefit payments': 'Money goes straight to people on low incomes: benefit payments.', 'Investment in education': 'This builds skills for future jobs and earnings: investment in education.', 'Investment in healthcare': 'This keeps people healthy and able to work, and avoids medical costs: investment in healthcare.' }[s[1]]);
    } },
    S('compare', 'Which measure would most quickly reduce absolute poverty in a country where many families go hungry?',
      'Cash transfers or food rations to the poorest households',
      ['Building new universities', 'Cutting the top rate of income tax', 'Raising VAT on basic foods'],
      'Direct payments or rations reach poor families at once and pay for food. Universities take years to help and mainly help those already in education; the last two would widen gaps.'),
    S('compare', 'Which combination of policies is most likely to <b>increase</b> income inequality?',
      'Raising VAT and cutting the top rate of income tax',
      ['Raising the top rate of income tax and child benefit', 'Funding free school meals and free clinics', 'Training unemployed adults in new skills'],
      'VAT takes a bigger share from low incomes, and a lower top rate helps the highest earners, so the gap widens. The other options help the poor.')
  ] };

})();
