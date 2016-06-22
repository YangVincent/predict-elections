// makeRequest was defined in primary.js; it does an 
// XMLHttpRequest to the server

// Lists of options are kept on the server
makeRequest("censusSchema", fillInSelectOptions);
document.getElementById("dataOptions").addEventListener("change", selectChange, false);

makeRequest("availModels", fillInModelOptions);
document.getElementById("modelOptions").addEventListener("change", modelChange, false);

var blue = [0,0,255];
var gray = [187,187,187];

// Changes the DOM to add the selections to the model menu
function fillInModelOptions(resp) {
    var modelList = JSON.parse(resp);
    // build a little selection pulldown menu
    var selectTarget = document.getElementById("modelOptions");
    
    addOption(selectTarget, ["Select Model", 0, "no-op"]);
    for(var i = 0; i < modelList.length; i++) {
        addOption(selectTarget, modelList[i]);
    }
}

// Changes the DOM to add the selections to the census data menu
function fillInSelectOptions(resp) {
    var requiredList = JSON.parse(resp);
    // build a little selection pulldown menu
    var selectTarget = document.getElementById("dataOptions");
    
    addOption(selectTarget, ["Select Census Data", 0, "no-op"]);
    for(var i = 0; i < requiredList.length; i++) {
        addOption(selectTarget, requiredList[i]);
    }
    addOption(selectTarget, ["Vote value", 0, "voteValue"]);
}


function addOption(selectTarget, vars) {
    var newOption = document.createElement("option");
    newOption.value = vars[2];
    newOption.textContent = vars[0];
    selectTarget.appendChild(newOption);
}

// The event handler called when selects an option from the drop-down
// model menu
function modelChange(event) {
    var selectValue = document.getElementById("modelOptions").value;
    
    if(selectValue == "no-op"){
        return;
    }
    else {
	// note: drawModel is in primary.js
        makeRequest("model="+selectValue, drawModel);
    }
}

// The event handler called when selects an option from the drop-down
// census data menu
function selectChange(event) {
    var selectValue = document.getElementById("dataOptions").value;
    
    if(selectValue == "voteValue") {
        makeRequest("districts=demVoters", voteValueCallback);
        return;
    }
    else if(selectValue == "no-op"){
        return;
    }
    else {
        makeRequest("census="+selectValue, function(resp){drawCallback(resp, gray, blue)});
    }
}

// color the map based on number of voters/delegate
function voteValueCallback(resp) {
    var dems = JSON.parse(resp);
    var ratios = [];
    for(var i = 0; i <dems.length; i++) {
        ratios[i] = dems[i] / districts[i];
    }
    drawCallback(JSON.stringify(ratios), blue, gray);
}

function roundTo100ths(n) {
    return Math.round(n*100)/100;
}

// color the map and delegate boxes based on census data
function drawCallback(resp, lowColor, highColor) {
    var data= JSON.parse(resp);
    // we're using the model object to provide the colors 
    // and gradient, even though in this function we are
    // coloring based on the census data, not the model
    var theModel = new Model(data,lowColor, highColor);
    
    // hide the top bars for now
    var barList = d3.selectAll(".topbar");
    barList.style("height","0px");
    
    // color the delegate boxes
    var boxList = d3.selectAll(".delegateBox");
    boxList.style("background-color", function(d,i) {return theModel.colors[i]});
    
    var landTitles = d3.selectAll("path.land title");
    landTitles.text(function(d, i) {return d.id + " " + roundTo100ths(theModel.ratios[d.id-1]/theModel.minRatio) +"x min"});
    
    // color the map
    var landList = d3.selectAll("path.land");
    landList.style("fill", function(d,i) {return theModel.colors[d.id-1]});
    
    // reset the statewide
    var stateDelegates = d3.selectAll(".stateBox");
    stateDelegates.style("background-color", "#bbbbbb");
    
    // set the color for scale
    updateScale(theModel);
}

// update the scale bar when data changes
function updateScale(model){
    document.getElementById("maxValue").textContent=roundTo100ths(model.maxRatio);
    var minVal = roundTo100ths(model.minRatio);
    if(minVal == 0)
        minVal = "<.01";
    document.getElementById("minValue").textContent=minVal;
    
    var scale = d3.select("#scale");
    scale.style("background", model.gradientString());
}


