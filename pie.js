var svg1=d3.select(".pie1")
            .append("g");
var svg2=d3.select(".pie2")
            .append("g");


pie("/segData/seg4_data2/company=", "금일 누적전력", svg1);
pie("/segData/seg4_data2/company=", "금일 피상전력", svg2);
function pie(fileName,label,mysvg){
  //!!!!!!!!데이터 설정!!!!!!!!!!!!!!
/*
  var data = [
    {name: "USA", value: 40},
    {name: "UK", value: 20},
    {name: "Canada", value: 30},
    {name: "Maxico", value: 10},
  ];
  */
/* 가데이터 */
  var data = [{
    depart : "도장실",
    value : 37049478942.5647
},
{
    depart : "건조실",
    value : 1229057909.37255
},
{
    depart : "사무동",
    value : 0.0
},
{
    depart : "목공부",
    value : 59315004090.3266
}];

  var text = "";

  var width = 260;
  var height = 260;
  var thickness = 70;
  var duration = 750;

  var radius = Math.min(width, height) / 2;
  var color = d3.scaleOrdinal(d3.schemeCategory10);
/*
  var svg = d3.select("#chart")
  .append('svg')
  .attr('class', 'pie')
  .attr('width', width)
  .attr('height', height);
*/
  var g = mysvg.append('g')
  .attr('transform', 'translate(' + (width/2) + ',' + (height/2+30) + ')');

  var arc = d3.arc()
  .innerRadius(radius - thickness)
  .outerRadius(radius);

  var pie = d3.pie()
  .value(function(d) { return d.value; })
  .sort(null);

  var path = g.selectAll('path')
  .data(pie(data))
  .enter()
  .append("g")
  .on("mouseover", function(d) {
        let g = d3.select(this)
          .style("cursor", "pointer")
          .style("fill", "black")
          .append("g")
          .attr("class", "text-group");
  //!!!!!!!!데이터 설정!!!!!!!!!!!!!!
        g.append("text")
          .attr("class", "name-text")
          .text(`${d.data.depart}`)
          .attr('text-anchor', 'middle')
          .attr('dy', '-1.2em');

        g.append("text")
          .attr("class", "value-text")
          .text(`${d.data.value}`)
          .attr('text-anchor', 'middle')
          .attr('dy', '.6em');
      })
    .on("mouseout", function(d) {
        d3.select(this)
          .style("cursor", "none")
          .style("fill", color(this._current))
          .select(".text-group").remove();
      })
    .append('path')
    .attr('d', arc)
    .attr('fill', (d,i) => color(i))
    .on("mouseover", function(d) {
        d3.select(this)
          .style("cursor", "pointer")
          .style("fill", "black");
      })
    .on("mouseout", function(d) {
        d3.select(this)
          .style("cursor", "none")
          .style("fill", color(this._current));
      })
    .each(function(d, i) { this._current = i; });


  g.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '.35em')
    .text(text);

    if (label == '금일 피상전력') {
        //legend
        var legendRectSize = 20;
        var legendSpacing = 1;
        var legendHeight = legendRectSize + legendSpacing;

        var legend = mysvg.append('g')
            .attr("transform", "translate(0, 20)")
            .selectAll('.legend')
            .data(data).enter().append('g')
            .attr("class", 'legend')
            .attr("transform", function (d, i) {
                return 'translate(280,' + (((i + 1) * legendHeight) + (3 * i)) + ')';
            });

        legend.append('rect')
            .attr("width", legendRectSize).attr("height", legendHeight)
            .attr("rx", 20).attr("ry", 20)
            .style("fill", function (d, i) { return color(i); });

        legend.append('text')
            .attr("x", 30).attr("y", 15)
            .text(function (d) { return d.depart; })  //!!!!!!!!데이터 설정!!!!!!!!!!!!!!
            .style("fill", 'black').style("font_size", '14px');
    }
    //var lx = (180 * num) + 150;
    mysvg.append('text')
        .attr("transform", function (d, i) {
            return 'translate(70, 20)';
        })
        .text(label).style("fill", 'black')
        .style("font", "18px sans-serif");
}
