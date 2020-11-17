var margin = { top: 60, right: 100, bottom: 20, left: 80 },
    width = 1800 - margin.left - margin.right,
    height = 370 - margin.top - margin.bottom;

var getDate = d3.timeFormat("%Y-%m-%d %H:%M");

var svg=d3.select(".power_factor")
/* 가데이터 */
var dataset = [
  {
    depart: "USA",
    values: [
      {date: '2016-03-02 00:00:00' ,value: 43},
      {date : '2016-04-03 00:00:00',value: 50},
      {date : '2016-05-04 00:00:00',value: 90},
      {date: '2016-06-05 00:00:00',value: 90},
      {date : '2016-07-06 00:00:00',value: 30},
      {date:'2016-08-07 00:00:00',value:40},
      {date:'2016-09-08 00:00:00',value:45},
      {date:'2016-10-09 00:00:00',value:65},
      {date:'2016-11-10 00:00:00',value:76}
    ]
  },
  {
    depart: "Canada",
    values: [
      {date: '2016-03-02 00:00:00' ,value: 77},
      {date : '2016-04-03 00:00:00',value: 85},
      {date : '2016-05-04 00:00:00',value: 22},
      {date: '2016-06-05 00:00:00',value: 11},
      {date : '2016-07-06 00:00:00',value: 56},
      {date:'2016-08-07 00:00:00',value:57},
      {date:'2016-09-08 00:00:00',value:88},
      {date:'2016-10-09 00:00:00',value:60},
      {date:'2016-11-10 00:00:00',value:76}
    ]
  },
  {
    depart: "Maxico",
    values: [
      {date: '2016-03-02 00:00:00' ,value: 99},
      {date : '2016-04-03 00:00:00',value: 30},
      {date : '2016-05-04 00:00:00',value: 40},
      {date: '2016-06-05 00:00:00',value: 80},
      {date : '2016-07-06 00:00:00',value: 70},
      {date:'2016-08-07 00:00:00',value:11},
      {date:'2016-09-08 00:00:00',value:20},
      {date:'2016-10-09 00:00:00',value:40},
      {date:'2016-11-10 00:00:00',value:98}
    ]
  }
];
//파라미터 넘겨줘야함
power_factor();

function power_factor(){
  //dataset은 [depart,date,value]필요

  //var dataSet = sortByData4(data.data);

  var parseDate=d3.isoParse;
  dataset.forEach(function(d) {
    d.values.forEach(function(d) {
      d.date = parseDate(d.date);
      d.value = +d.value;
    });
  });
  // Format the data
/*  dataSet.forEach(function (d) {
      d.date = new Date(d.date);
      d.value = d.value * 100;
  });
*/
  var start_date = d3.min(dataset[0].values, d => d.date);
  var end_date = d3.max(dataset[0].values, d => d.date);
/*
  //부서를 키값으로
  var nest = d3.nest()
        .key(function (d) {
            return d.depart;
        })
        .entries(function (d,i) {
            return d.depart;
        });
*/
  // Set the ranges
  var x = d3.scaleTime().domain(d3.extent([start_date, end_date])).range([0, width]);
  var y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

  // Set up the x axis
  var xaxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "x axis")
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%H")));

  // Add the Y Axis
  var yaxis = svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "translate(13,3) rotate(-90)")
      .style("text-anchor", "end")
      .attr('fill', 'black')
      .style("font", "11px open-sans")
      .text("power_factor(%)");

  var tooltip = d3.select("body")
              .append("div")
              .style("position", "absolute")
              .style("z-index", "10")
              .style("visibility", "hidden")
              .text("a simple tooltip");

  var valueLine = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value))
    .curve(d3.curveStep);

  // Create a dropdown
  var popupMenu = d3.select("#departDropdown");
      popupMenu.append("select")
                .selectAll("option")
                .data(dataset)
                .enter()
                .append("option")
                .attr("value", function (d) {
                    return d.depart;
                })
                .text(function (d) {
                    return d.depart;
                })

  var initialGraph = function (indepart) {

      // Filter Depart
    var selectDepart = dataset.filter(function (d) {
        return d.depart == indepart;
    })

    var selectDepartGroups = svg.selectAll(".departGroups")
        .data(selectDepart, function (d) {
            return d ? d.depart : this.depart;
        })
        .enter()
        .append("g")
        .attr("class", "departGroups")

    selectDepartGroups
        .append("path")
        .attr("class", "line")
        .attr("d", function (d) {
            return valueLine(d.values);
        })
        .style("stroke","black")
        .attr("fill","none");

    selectDepartGroups.selectAll(".rect")
        .data(function (d) {
            return d.values;
        })
        .enter().append("rect")
        .attr("class", "rect")
        .attr("x", function (d) { return x(d.date) - 3.5; })
        .attr("y", function (d) { return y(d.value) - 2; })
        .attr("width", 7)
        .attr("height", 5)
        .style("fill", function (d) {
            if (d.value >= 90) return "#088A08";
            else if (60 <= d.value && d.value < 90) return "#DF7401";
            else return "#DF0101";
        })
        .on("mouseover", function () { return tooltip.style("visibility", "visible"); })
        .on("mousemove", function (d) {
            var text;
            if (d.value >= 90) text = "효율성 높음";
            else if (60 <= d.value && d.value < 90) text = "효율성 중간";
            else text = "효율성 낮음";

            tooltip.html("해당시간: " + getDate(d.date) +"      " + Math.floor(d.value) + "%로 " + text)
            tooltip.style("top", 340+ "px").style("left", 10 + "px");
        })
     //.on("mouseout", function () { return tooltip.style("visibility", "hidden"); });;
  }

  initialGraph(dataset[0].depart)

  //data update
  var updateGraph = function (updepart) {

    var selectDepart = dataset.filter(function (d) {
        return d.depart == updepart;
    })

    var selectDepartGroups = svg.selectAll(".departGroups")
          .data(selectDepart)


    selectDepartGroups.select("path.line")
          .transition()
          .duration(1000)
          .attr("d", function (d) {
            return valueLine(d.values);
          })
          .style("stroke","black");

    selectDepartGroups.selectAll(".rect")
          .remove().exit()
          .data(function (d) {
              return d.values;
          })
          .enter()
          .append("rect")
          .attr("class", "rect")
          .attr("x", function (d) { return x(d.date) - 3.5; })
          .attr("y", function (d) { return y(d.value) - 2; })
          .attr("width", 7)
          .attr("height", 5)
          .style("fill", function (d) {
              if (d.value >= 90) return "#088A08";
              else if (60 <= d.value && d.value < 90) return "#DF7401";
              else return "#DF0101";
          })
          .on("mouseover", function () { return tooltip.style("visibility", "visible"); })
          .on("mousemove", function (d) {
              var text;
              if (d.value >= 90) text = "효율성 높음";
              else if (60 <= d.value && d.value < 90) text = "효율성 중간";
              else text = "효율성 낮음";

              tooltip.html("해당시간: " + getDate(d.date) + "</br>" + Math.floor(d.value) + "%로 " + text)
              tooltip.style("top", 670 + "px").style("left", 220 + "px");
          });

  }


  //dropdown menu
  popupMenu.on('change', function () {

      //선택한 부서 찾기
      var selectedDepart = d3.select(this)
          .select("select")
          .property("value")

      //부서 update
      updateGraph(selectedDepart)

  });

  function sortByData4(data) {
    var sData = data.sort(function (x, y) {
        return d3.ascending(x.date, y.date);
    })
    return sData;
    }

}
