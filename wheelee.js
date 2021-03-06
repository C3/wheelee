(function() {
  d3.selection.prototype.wheelify = function(config) {
    w = 653;
    h = 405;
    wheelee_x_pos = 450;
    wheelee_y_pos = 180;

    hilightDuration = 3000; //milliseconds
    tweenDuration = 500; //milliseconds

    interval = null;
    arcIndex = 0;

    //make me something to draw on!
    svgContainer = this
      .append("svg")
        .attr("width", w)
        .attr("height", h)
      .append("g")
        .attr("transform", "translate(27,27)");

    //title element is not displayed - used for accessability
    svgContainer.append("title")
      .text(config.title);

    outerRadius = 157;
    innerRadius = outerRadius - 75;

    //arc template for regular arc
    arc = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    //arc template for hilighted arc
    expandedArc = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius + 16);

    //maths stuff
    circumference = 2 * Math.PI * outerRadius;
    startAngle = 0; // in radians - this is the top of the circle

    //base fill colour for arcs
    color = d3.rgb(config['color']);
    colorIncremnet = config['lightenGamma']/d3.keys(config['data']).length;

    //make json object of arcs data
    d3Arcs = []
    d3.map(config['data']).forEach(function(key, percent) {
      lengthOfArc = circumference * (percent/100);
      radiansOfCentralAngle = lengthOfArc/outerRadius;
      endAngle = startAngle + radiansOfCentralAngle;

      d3Arcs.push({
        "innerRadius": innerRadius,
        "outerRadius": outerRadius,
        "startAngle": startAngle,
        "endAngle": endAngle - 0.015, //gives baby gap between arcs
        "fill": color,
        "class": "arc",
        "title": key,
        "percent": percent + "%"
      });

      startAngle = endAngle;
      color = color.brighter(colorIncremnet)
    });

    chartLegend({svg: svgContainer, categories: d3Arcs});

    chartPie({svg: svgContainer, arcs: d3Arcs});

    chartText({svg: svgContainer});

    function chartLegend(config) {
      var legend = config.svg.selectAll(".legend")
      .data(config.categories)
      .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + (100 + (i * 36)) + ")"; });

      legend.append("rect")
        .attr("x", 0)
        .attr("width", 51)
        .attr("height", 28)
        .style("fill", function(d) { return d["fill"].toString(); });

      legend.append("text")
        .attr("x", 65)
        .attr("y", 14)
        .attr("dy", ".35em")
        .attr("class", "category")
        .style("text-anchor", "start")
        .text(function(d) { return d["title"]; });

      legend.append("text")
        .attr("x", 205)
        .attr("y", 14)
        .attr("dy", ".35em")
        .attr("class", "value")
        .style("text-anchor", "start")
        .text(function(d) { return d["percent"]; });
    }

    function chartPie(config) {
      path = config.svg.selectAll("path")
        .data(config.arcs)
        .enter()
          .append("path")
          .attr("d", arc)
          .on("mouseover", hoverInArc)
          .on("mouseout", hoverOutArc)
          .attr("transform", "translate(" + wheelee_x_pos + ", " + wheelee_y_pos + ")")
          .attr("fill", function(d, i) { return d["fill"].toString(); })
          .attr("class", function(d, i) { return d["class"]; });
    }

    function chartText(config) {
      titleText = config.svg.append("text")
        .attr("x", wheelee_x_pos)
        .attr("y", wheelee_y_pos)
        .style('opacity', 0)
        .attr("class", "title info");

      percentText = config.svg.append("text")
        .attr("x", wheelee_x_pos)
        .attr("y", wheelee_y_pos + 30)
        .style('opacity', 0)
        .attr("class", "percent info");
    }

    function updateText(title, percent){
      //fade out current
      d3.select("text.title").transition()
        .duration(tweenDuration/2)
        .style('opacity', 0);

      d3.select("text.percent").transition()
        .duration(tweenDuration/2)
        .style('opacity', 0);

      //change to new text and fade in after fade out
      d3.select("text.title").transition()
        .text(title)
        .duration(tweenDuration/2)
        .delay(tweenDuration/2)
        .style('opacity', 1);

      d3.select("text.percent").transition()
        .text(percent)
        .duration(tweenDuration/2)
        .delay(tweenDuration/2)
        .style('opacity', 1);
    }

    function hoverInArc(d, i){
      stopAutomaticHilight();
      shrinkAllArcs();
      hilightArc(this, i);
    }

    function hoverOutArc(){
      shrinkAllArcs();
      startAutomaticHilight();
    }

    function hilightArc(d, i){
      d3.select(d).transition()
        .duration(tweenDuration)
        .attr("class", "arc active-arc")
        .attr("d", expandedArc);

      updateText(d3Arcs[i]["title"], d3Arcs[i]["percent"])
      boldLegend(i);
    }

    function shrinkAllArcs(){
      svgContainer.selectAll("path")
        .transition()
        .attr("class", "arc")
        .attr("d", arc);
    }

    function boldLegend(i){
      d3.selectAll(".legend").classed("bold", false);
      d3.select(d3.selectAll(".legend")[0][i]).classed("bold", true);
    }

    function updateIndex(i){
      if(i == Object.keys(config['data']).length - 1){
        i = 0;
      } else {
        i += 1;
      }
      return i;
    }

    function startAutomaticHilight(){

      interval = setInterval(function() {
        currentArc = svgContainer.selectAll("path")[0][arcIndex];
        shrinkAllArcs();
        hilightArc(currentArc, arcIndex);

        arcIndex = updateIndex(arcIndex);
      }, hilightDuration);

    }

    function stopAutomaticHilight(){
      if(interval != null){
        clearInterval(interval)
      }
    }

    startAutomaticHilight();
  };
})();
