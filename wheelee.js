(function() {
  data = wheeleeData();
  hex = hexColor();
  w = 472;
  h = 472;

  hilightDuration = 3000; //milliseconds
  tweenDuration = 500; //milliseconds

  interval = null;
  arcIndex = 0;

  //make me something to draw on!
  svgContainer = d3.select("#wheelee")
    .append("svg")
      .attr("width", w)
      .attr("height", h)
    .append("g")
      .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

  //make doughnut fit the full width/height of the canvas with space for 20px expansion
  outerRadius = (w / 2) - 20;
  innerRadius = outerRadius - 100;

  //arc template for regular arc
  arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  //arc template for hilighted arc
  expandedArc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius + 20);

  //maths shit
  circumference = 2 * Math.PI * outerRadius;
  startAngle = 0; // in radians - this is the top of the circle

  //base fill colour for arcs
  color = d3.rgb(hex);
  colorIncremnet = lightenBy()/d3.keys(data).length;

  //make json object of arcs data
  d3Arcs = []
  d3.map(data).forEach(function(key, percent) {
    lengthOfArc = circumference * (percent/100);
    radiansOfCentralAngle = lengthOfArc/outerRadius;
    endAngle = startAngle + radiansOfCentralAngle;

    d3Arcs.push({
      "innerRadius": innerRadius,
      "outerRadius": outerRadius,
      "startAngle": startAngle,
      "endAngle": endAngle - 0.01, //0.01 gives baby gap between arcs
      "fill": color,
      "class": "arc",
      "title": key,
      "percent": percent + "%"
    });

    startAngle = endAngle;
    color = color.brighter(colorIncremnet)
  });

  //display paths
  path = svgContainer.selectAll("path")
    .data(d3Arcs)
    .enter()
      .append("path")
      .attr("d", arc)
      .on("mouseover", hoverInArc)
      .on("mouseout", hoverOutArc)
      .attr("fill", function(d, i) { return d["fill"].toString(); })
      .attr("class", function(d, i) { return d["class"]; });

  //add title
  titleText = svgContainer.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style('opacity', 0)
    .attr("class", "title legend");

  //add percent
  percentText = svgContainer.append("text")
    .attr("x", 0)
    .attr("y", 30)
    .style('opacity', 0)
    .attr("class", "percent legend");

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
      .attr("class", "active-arc")
      .attr("d", expandedArc);

    updateText(d3Arcs[i]["title"], d3Arcs[i]["percent"])
  }

  function shrinkAllArcs(){
    svgContainer.selectAll("path")
      .transition()
      .attr("class", "arc")
      .attr("d", arc);
  }

  function updateIndex(i){
    if(i == Object.keys(data).length - 1){
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

})();
