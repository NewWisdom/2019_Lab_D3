/* 가데이터 */
var data = [
  {
    depart: "USA",
    values: [
      {date: '2016-03-02 00:00:00' ,value: 43},
      {date : '2016-04-03 00:00:00',value: 155},
      {date : '2016-05-04 00:00:00',value: 279},
      {date: '2016-06-05 00:00:00',value: 304},
      {date : '2016-07-06 00:00:00',value: 306},
      {date:'2016-08-07 00:00:00',value:400},
      {date:'2016-09-08 00:00:00',value:401},
      {date:'2016-10-09 00:00:00',value:425},
      {date:'2016-11-10 00:00:00',value:366}
    ]
  },
  {
    depart: "Canada",
    values: [
      {date: '2016-03-02 00:00:00' ,value: 153},
      {date : '2016-04-03 00:00:00',value: 185},
      {date : '2016-05-04 00:00:00',value: 249},
      {date: '2016-06-05 00:00:00',value: 314},
      {date : '2016-07-06 00:00:00',value: 276},
      {date:'2016-08-07 00:00:00',value:310},
      {date:'2016-09-08 00:00:00',value:321},
      {date:'2016-10-09 00:00:00',value:305},
      {date:'2016-11-10 00:00:00',value:276}
    ]
  },
  {
    depart: "Maxico",
    values: [
      {date: '2016-03-02 00:00:00' ,value: 53},
      {date : '2016-04-03 00:00:00',value: 165},
      {date : '2016-05-04 00:00:00',value: 269},
      {date: '2016-06-05 00:00:00',value: 344},
      {date : '2016-07-06 00:00:00',value: 376},
      {date:'2016-08-07 00:00:00',value:410},
      {date:'2016-09-08 00:00:00',value:421},
      {date:'2016-10-09 00:00:00',value:405},
      {date:'2016-11-10 00:00:00',value:376}
    ]
  }
];
var margin = {top: 20, right: 120, bottom: 70, left: 40},
    legendwidth=200;
    width = 1000-margin.left-margin.right,
    height = 500 - margin.top - margin.bottom;

var tooltip = d3.select('#tooltip');
//const tooltipLine = chart.append('line');

var parseDate=d3.isoParse
data.forEach(function(d) {
  d.values.forEach(function(d) {
    d.date = parseDate(d.date);
    d.value = +d.value;
  });
});

/* Scale */
var x = d3.scaleTime()
  .domain(d3.extent(data[0].values, d => d.date))
  .range([0, width]);

var y = d3.scaleLinear()
  .domain([0, d3.max(data[0].values, d => d.value)])
  .range([height, 0]);
var mama=d3.max(data[0].values, d => d.value);
/* Add Axis into SVG */
//xScale 시간형태로 수정해야함
var xAxis = d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat("%H"));
var yAxis = d3.axisLeft(y).ticks(5);


var color = d3.scaleOrdinal(d3.schemeCategory10);

/* Add line into SVG */
var line = d3.line()
  .x(d => x(d.date))
  .y(d => y(d.value));

/* Add SVG*/
var svg = d3.select("#chart").append("svg")
  .attr("width", width+margin.left+margin.right+legendwidth)
  .attr("height", height + margin.top + margin.bottom)
  .append('g')
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var legend = svg.selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'legend');

    legend.append('rect')
      .attr('x', width + 20)
      .attr('y', function(d, i) {
        return i * 20;
      })
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function(d) {
        return color(d.depart);
      });

    legend.append('text')
      .attr('x', width + 37)
      .attr('y', function(d, i) {
        return (i * 20) + 9;
      })
      .text(function(d) {
        return d.depart;
      });

    var change_value=legend.append('text')
        .attr('x', width + 100)
        .attr('y', function(d, i) {
          return (i * 20) + 9;
        })
        .attr("class",function(d, i) {
          return "change_"+i;
        });
//change_value.append("g")

//Axis call
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append('text')
    .attr("y", 15)
    .attr("transform", "translate(20,123) rotate(90)")
    .attr("fill", "#000")
    .text("Amount of Electricity Used");

//draw Line
var depart = svg.selectAll(".depart")
      .data(data)
      .enter().append("g")
      .attr("class", "depart");

    depart.append("path")
      .attr("class", "line")
      .attr("d", function(d) {
        return line(d.values);
      })
      .style("stroke", function(d) {
        return color(d.depart);
      });
/*
var tipbox=svg.append('rect');
              .attr("width",width)
              .attr('height',height)
              .attr('opacity',0)
              .on('mousemove',function(){
                tooltip.html(date)
                      .style('display', 'block')
                      .style('left', d3.event.pageX + 20)
                      .style('top', d3.event.pageY - 20)
                      .selectAll()
                      .data(data).enter()
                      .append('div')
                      .style('color', d => d.color)
                      .html(d => d.depart + ': ' + d.values.find(h => h.date == date).value)
              })
              .on('mouseout',function() {
                if (tooltip) tooltip.style('display', 'none');
              });
*/
var mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");

var tooltip=d3.select(".mouse-over-effects")
              .append("g")
              //.attr("id","tooltip");


    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(data)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 5)
      .style("stroke", function(d) {
        return color(d.depart);
      })
      .style("fill", function(d) {
        return color(d.depart);
      })
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.append("text")
      .attr("transform", "translate(10,3)");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width) // can't catch mouse events on a g element
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });

        d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {
            //console.log(width/mouse[0])
            var xDate = x.invert(mouse[0]),
                bisect = d3.bisector(function(d) { return d.date; }).right;
                idx = bisect(d.values, xDate);

            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }



              d3.selectAll(".change_"+i)
              .text(" : "+y.invert(pos.y).toFixed(2));

            //  d3.select(this).select('text')
            //    .text(y.invert(pos.y).toFixed(2));


//            tooltip.html(y.invert(pos.y).toFixed(2))
//              .attr("transform","translate(" + mouse[0] + "," + pos.y +")");
            //console.log("!!!!!!!!!"+pos.x+"!!!!!!");
            return "translate(" + mouse[0] + "," + pos.y +")";
          });
      });
