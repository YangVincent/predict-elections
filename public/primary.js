window.onload = function() {
  requestHuff(huffback);
}

function modelhuff(resp) {
  resp = JSON.parse(resp);

  var bernieRatio = [];
  var totalHVotes = 0;
  var totalBVotes = 0;
  for(var i = 0; i < resp.length; i++) {
    var current = resp[i];
    var disTotal = current.hVotes+current.bVotes;
    bernieRatio.push(current.bVotes/disTotal);

    totalHVotes += current.hVotes;
    totalBVotes += current.bVotes;
  }
  var percentBernieVotes = totalBVotes/(totalHVotes+totalBVotes);
  total = Math.round(percentBernieVotes*stateWide.length);

  var h = Math.round(100-percentBernieVotes*100);
  var b = Math.round(percentBernieVotes*100);

  var hv = document.getElementById('hv');
  var hs = document.getElementById('hs');

  hs.appendChild(document.createElement('br'));
  hs.appendChild(document.createElement('p').appendChild(document.createTextNode("Model Predicts Vote")));

  hv.appendChild(document.createElement('br'));
  hv.appendChild(document.createElement('p').appendChild(document.createTextNode("Hillary: " + h + " Bernie: " + b)));

  hs.appendChild(document.createElement('br'));
  hs.appendChild(document.createElement('p').appendChild(document.createTextNode("Model Predicts Delegates")));

  h = Math.round(h/100 * 159);
  b = Math.round(b/100 * 159);

  hv.appendChild(document.createElement('br'));
  hv.appendChild(document.createElement('p').appendChild(document.createTextNode("Hillary: " + h + " Bernie: " + b)));

}

function huffback(resp) {
  resp = JSON.parse(resp);
  b = JSON.parse(resp.body);


  var p1 = String(b[0].pollster) + ' ' + String(b[0].end_date);
  var p2 = String(b[1].pollster) + ' ' + String(b[1].end_date);
  var p3 = String(b[2].pollster) + ' ' + String(b[2].end_date);

  var v1 = String(b[0].questions[0].subpopulations[0].responses[0].choice) + ':' + String(b[0].questions[0].subpopulations[0].responses[0].value + ' ' + b[0].questions[0].subpopulations[0].responses[1].choice) + ':' + String(b[0].questions[0].subpopulations[0].responses[1].value);
  var v2 = String(b[1].questions[0].subpopulations[0].responses[0].choice) + ':' + String(b[1].questions[0].subpopulations[0].responses[0].value + ' ' + b[1].questions[0].subpopulations[0].responses[1].choice) + ':' + String(b[1].questions[0].subpopulations[0].responses[1].value);
  var v3 = String(b[2].questions[0].subpopulations[0].responses[0].choice) + ':' + String(b[2].questions[0].subpopulations[0].responses[0].value + ' ' + b[2].questions[0].subpopulations[0].responses[1].choice) + ':' + String(b[2].questions[0].subpopulations[0].responses[1].value);

  var hs = document.getElementById('hs');
  hs.textContent = p1;
  hs.appendChild(document.createElement('br'));
  hs.appendChild(document.createElement('p').appendChild(document.createTextNode(p2)));
  hs.appendChild(document.createElement('br'));
  hs.appendChild(document.createElement('p').appendChild(document.createTextNode(p3)));

  var hv = document.getElementById('hv');
  hv.textContent = v1;
  hv.appendChild(document.createElement('br'));
  hv.appendChild(document.createElement('p').appendChild(document.createTextNode(v2)));
  hv.appendChild(document.createElement('br'));
  hv.appendChild(document.createElement('p').appendChild(document.createTextNode(v3)));

  makeRequest("model=combinedModel2", modelhuff);

}

function requestHuff(huffBack) {
  // first, make a request object
  var req = new XMLHttpRequest();

  // set up callback function
  // "onreadystatechange" method is called a bunch of times 
  // as the request makes its way out to the internet and back
  req.onreadystatechange = function() {
    if (req.readyState === XMLHttpRequest.DONE) {
      // the whole process is over
      if (req.status === 200) { // status 200 means all went well! 
        var resp = req.response;  // response shows up in the object
        huffBack(resp);     // call the callback function
      } else {
        console.log("Problem requesting data from server");
        console.log("Response code ",req.status);
      }
    }
  }

  var reqURL = "/query?huff";
  req.open('GET', reqURL, true);  // load up the request string
  req.send(null);    // and send it off!

}


// Sends an XMLHttpRequest to the server, asking for data 
// The first argument should contain the URL on the server, with
// the query, and the second should be the name of the callback 
// function.  The callback gets one parameter, containing the 
// requested data.
function makeRequest(requestString, callbackFunction) {

  // first, make a request object
  var req = new XMLHttpRequest();

  // set up callback function
  // "onreadystatechange" method is called a bunch of times 
  // as the request makes its way out to the internet and back
  req.onreadystatechange = function() {
    if (req.readyState === XMLHttpRequest.DONE) {
      // the whole process is over
      if (req.status === 200) { // status 200 means all went well! 
        var resp = req.response;  // response shows up in the object
        callbackFunction(resp);     // call the callback function
      } else {
        console.log("Problem requesting data from server");
        console.log("Response code ",req.status);
      }
    }
  }

  var reqURL = "/query?"+requestString;
  req.open('GET', reqURL, true);  // load up the request string
  req.send(null);    // and send it off!
}

function Model(array, lowColor, highColor) {
  this.lowColor = lowColor;
  this.highColor = highColor;
  this.maxRatio = array[0];
  this.minRatio = this.maxRatio;
  this.ratios = [];
  for(var i = 0; i < array.length; i++) {
    var r = array[i];                           
    this.maxRatio = Math.max(this.maxRatio, r);  // update maxRatio
    this.minRatio = Math.min(this.minRatio, r);  // update minRatio
    this.ratios.push(r);                         // append to ratio list
  }

  this.colors = [];
  for(var i = 0; i < array.length; i++) {
    this.colors.push(this.calculateColor(i));   // for each ratio, calculate gradient color
  }
}

// converts this.ratios[index] to be a value between 0-1
Model.prototype.normalize = function(index) {
  return (this.ratios[index]-this.minRatio)/(this.maxRatio-this.minRatio);
}

// calculate gradient color for a given index
Model.prototype.calculateColor = function(index) {
  var norm = this.normalize(index);                // want high ratios to be gray, low ratios to be blue
  var resultColor = [0,0,0];
  for(var i = 0; i < this.lowColor.length; i++) {
    // interpolate between gray and blue
    resultColor[i] = Math.round( (this.highColor[i]-this.lowColor[i])*norm + this.lowColor[i] );
  }
  return this.colorToRGBString(resultColor);
}

Model.prototype.colorToRGBString = function(resultColor) {
  return "rgb("+resultColor.join(",")+")";
}

Model.prototype.gradientString = function() {
  return "linear-gradient(0deg,"+this.colorToRGBString(this.lowColor)+
    ","+this.colorToRGBString(this.highColor)+")";
}

// Color the map and blocks based on the model
function drawModel(resp) {
  resp = JSON.parse(resp);

  var bernieRatio = [];
  var totalHVotes = 0;
  var totalBVotes = 0;
  for(var i = 0; i < resp.length; i++) {
    var current = resp[i];
    var disTotal = current.hVotes+current.bVotes;
    bernieRatio.push(current.bVotes/disTotal);

    totalHVotes += current.hVotes;
    totalBVotes += current.bVotes;
  }

  // create the color gradient
  var m = new Model(bernieRatio, [255,0,0], [0,0,255]);

  var boxList = d3.selectAll(".delegateBox");
  boxList.style("background-color", "red");

  var topBars = d3.selectAll(".topbar")
    topBars.style("height", function(d, i){ 
      var numBernieDelegates = Math.round(districts[i]*bernieRatio[i]);
      return numBernieDelegates*5+"px";})

    var landTitles = d3.selectAll("path.land title");
  landTitles.text(function(d, i) {return d.id});

  //var paths = d3.selectAll("path.land");
  var paths = d3.selectAll("path");
  console.log("paths");
  console.log(paths);
  paths.style("fill", function(d){console.log("d is " + d); return m.colors[d.id-1]});

  var stateDelegates = d3.selectAll(".stateBox");
  var percentBernieVotes = totalBVotes/(totalHVotes+totalBVotes);
  total = Math.round(percentBernieVotes*stateWide.length);
  stateDelegates.style("background-color", 
      function(d, i){
        if(i<total)
    return"rgb(0,0,255)" ;
        else 
    return "rgb(255,0,0)";})

    updateScale(m);
}
