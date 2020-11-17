/* 가데이터 */
var data=[{depart:"mexico",day:1,hour:1,value:1},
          {depart:"usa",day:1,hour:1,value:1}];
var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];

var margin={top:40,right:50,bottom:70,left:50};

var width = 960 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 24);

var svg = d3.select("#heatmap").append("svg")
   .attr("width", width + margin.left + margin.right)
   .attr("height", height + margin.top + margin.bottom)
   .append("g")
   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var colours = d3.scaleLinear()
  	.domain(d3.range(1, 11, 1))
  	.range(["#87cefa", "#86c6ef", "#85bde4", "#83b7d9", "#82afce", "#80a6c2", "#7e9fb8", "#7995aa", "#758b9e", "#708090"]);

var dayLabels=svg.selectAll(".dayLabel")
                .data(days)
                .enter()
                .append("text")
                .text(function(d){return d;})
                .attr("x",0)
                .attr("y",function(d,i){return i*gridSize;})
                .style("text-anchor","end")
                .attr("transform","translate(-6,"+gridSize/1.5+")");

var timeLabels=svg.selectAll(".timeLabel")
                  .data(times)
                  .enter()
                  .append("text")
                  .text(function(d) { return d; })
                  .attr("x", function(d, i) { return i * gridSize; })
                  .attr("y", 0)
                  .style("text-anchor", "middle")
                  .attr("transform", "translate(" + gridSize / 2 + ", -6)");

//d3.json("test.json",function(error,data){
  var nest=d3.nest()
            .key(function(data){return data.depart;})
            .entries(data);

  var departs=nest.map(function(data){return data.key;});
  var currentDepartIndex=0;

  var departMenu=d3.select("#heatmap_departDropdown");
  departMenu.append("select")
            .attr("id","departMenu")
            .selectAll("option")
            .data(departs)
            .enter()
            .append("option")
            .attr("value",function(d,i){return i;})
            .text(function(d){return d;});

  var drawHeatmap=function(depart){

    var selectDepart=nest.find(function(d){
      return d.key==depart;
    });

    var heatmap=svg.selectAll(".hour")
                  .data(selectDepart)
                  .enter()
                  .append("rect")
                  .attr("x",function(d){return (d.hour-1)*gridSize;})
                  .attr("y", function(d) { return (d.day-1) * gridSize;})
                  .attr("class", "hour bordered")
                  .attr("width", gridSize)
                  .attr("height", gridSize)
                  .style("stroke", "white")
                  .style("stroke-opacity", 0.6)
                  .style("fill", function(d) { return colours(d.value); });
  }
  drawHeatmap(departs[currentDepartIndex]);

  var updateHeatmap=function(depart){
    console.log("currentDepartIndex : " + currentDepartIndex);

    var selectDepart=nest.find(function(d){
      return d.key==depart;
    });

    var heatmap=svg.selectAll(".hour")
                    .data(selectDepart)
                    .transition()
                    .duration(500)
                    .style("fill", function(d) { return colours(d.value); })

  }
  departMenu.on("change",function(){
    var selectDepart=d3.select(this)
                      .select("select")
                      .property("value");
    currentDepartIndex =+selectDepart
    updateHeatmap(departs[currentDepartIndex]);
  });
//});
