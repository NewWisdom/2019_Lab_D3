function bar(){
    /* 가데이터 */
    var data = [
    {date: '2016-03-02 00:00:00' ,value: 53},
    {date : '2016-04-03 00:00:00',value: 165},
    {date : '2016-05-04 00:00:00',value: 269},
    {date: '2016-06-05 00:00:00',value: 344},
    {date : '2016-07-06 00:00:00',value: 376},
    {date:'2016-08-07 00:00:00',value:410},
    {date:'2016-09-08 00:00:00',value:421},
    {date:'2016-10-09 00:00:00',value:405},
    {date:'2016-11-10 00:00:00',value:376}
  ];

  console.log(typeof data);
  
var svg=d3.select(".bar")

var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = svg.attr("width")-margin.left-margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

// Parse the date / time
var	parseDate = d3.isoParse

data.forEach(function(d) {
    d.date = parseDate(d.date);
});

var x = d3.scaleBand()
          .rangeRound([0, width], .05)
          .domain(data.map(function(d) { return d.date; }))
          .padding(0.1);

var y = d3.scaleLinear()
          .range([height, 0])
          .domain([0, d3.max(data, function(d) { return d.value; })]);

var xAxis = d3.axisBottom()
    .scale(x)
    .tickFormat(d3.timeFormat("%Y/%m"));

var yAxis = d3.axisLeft()
    .scale(y)
    //.ticks(10);
/*
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
*/

//tooltip
var tool_tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-8, 0])
      .html(function(d) { return d.value+"원"; });
    svg.call(tool_tip);
    //.style("display","none");
    //.style('opacity',0);

//x axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "middle")

//y axis
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Value");

//bar
svg.selectAll("bar")
    .data(data)
    .enter().append("rect")
    .style("fill", "steelblue")
    .attr('class', 'bar')
    .attr("x", function(d) { return x(d.date); })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); })
    .on("mouseover",tool_tip.show)
    .on("mouseout",tool_tip.hide);



}
bar();
