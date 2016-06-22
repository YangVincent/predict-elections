// Number of delegates to Democratic convention 
// per district
var districts = [6, 8, 6, 6, 7, 6, 6, 5, 6, 5, 7, 9, 8, 7, 7, 5, 6, 8, 6, 6, 4, 5, 5, 6, 5, 6, 6, 7, 5, 7, 5, 6, 7, 5, 5, 5, 7, 6, 6, 5, 5, 5, 6, 6, 6, 5, 6, 6, 6, 5, 5, 6, 7];

var divList = d3.select("div#blocks").selectAll("div.delegateBox");

// bind the data to the list of divs
var divs=divList.data(districts); 

// make a div corresponding to every data item
var outsideDivs = divs.enter().append("div");
var insides = outsideDivs.append("div");

// edit HTML attributes and CSS style parameters
divs.attr("class", function(d,i) {return "delegateBox dist"+(i+1)});
divs.attr("title",function(d,i) {return i+1;});
divs.style("height", function(d) {return (d*5)+"px"});
divs.on("mouseover", function(d,i) { highlight("dist"+(i+1)); });
divs.on("mouseout", function(d,i) { highlight(null); });

insides.attr("class", function(d, i) {return "topbar dist"+(i+1)})
insides.attr("title",function(d,i) {return i+1;});
insides.on("mouseover", function(d,i) { highlight("dist"+(i+1)); });
insides.on("mouseout", function(d,i) { highlight(null); });

// Number of state-wide delegates
var stateWide = [];
for(var i = 0; i < 158; i++)
    stateWide.push(1);

var stateList = d3.select("div#stateBlocks").selectAll("div.stateBox");
// bind the data to the list of divs
var stateDivs = stateList.data(stateWide);
// make a div corresponding to every data item
stateDivs.enter().append("div");
// edit HTML attributes and CSS style parameters
stateDivs.attr("title", function(d, i) {return i+1})
stateDivs.attr("class", function(d, i){return "stateBox state"+(i+1)});
stateDivs.on("mouseover", function(d,i) { highlight("state"+(i+1)); });
stateDivs.on("mouseout", function(d,i) { highlight(null); });

function highlight(type) {
  if (type == null) {
      els = d3.selectAll(".delegateBox,.land,.stateBox,.topbar");
      els.classed("active", false);
  } else {
      els = d3.selectAll("."+type);
      els.classed("active", true);
  }
}
