var height = 700;

var projection = d3.geo.albersUsa()
    .scale(3000)
    .translate([1100,400]);

var path = d3.geo.path()
    .projection(projection);
    
//var svg = d3.select("#caMap").append("svg")
//    .attr("width", width)
//    .attr("height", height)
//    .attr("id", "california");
    
queue()
    .defer(d3.json, "us.json")
    .defer(d3.json, "us-congress-113.json")
    .await(ready);

var districtShapes;
function ready(error, us, congress) {
  if (error) throw error;

  districtShapes = congress.objects.districts;

  var CA = [];
  for (var i=0; i<districtShapes.geometries.length; i++) {
    var id = districtShapes.geometries[i].id;
    if ((id >= 600) && (id < 700)) { // California!
        districtShapes.geometries[i].id = id - 600;
        CA.push(districtShapes.geometries[i]);
      }
  }
  
  // overwrite the whole US map with just California
  districtShapes.geometries = CA;

  districtShapes.bbox = [-179.231086, 0, 0, 71.441059];

  var svg = d3.select("#california")
  
  svg.append("defs").append("path")
      .attr("id", "land")
      .datum(topojson.feature(us, us.objects.land))
      .attr("d", path);

  svg.append("clipPath")
      .attr("id", "clip-land")
    .append("use")
      .attr("xlink:href", "#land");

  var district = svg.append("g")
      .attr("clip-path", "url(#clip-land)")
    .selectAll("path")
      .data(topojson.feature(congress, districtShapes).features)
    .enter().append("path")
      .attr("d", path);

  
// new stuff to replace hover
    district
      .attr("class",function(d) {var i = d.id;  return "land dist"+i;})
      .on("mouseover", function(d) {var i = d.id; highlight("dist"+i); })
      .on("mouseout", function() { highlight(null); });
      
  district.append("title")
      .text(function(d) { return d.id; });

  svg.append("path")
      .attr("class", "border border--district")
      .datum(topojson.mesh(congress, congress.objects.districts, function(a, b) { return a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0); }))
      .attr("d", path);
}


d3.select(self.frameElement).style("height", height + "px");


