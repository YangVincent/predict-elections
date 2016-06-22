var fs = require("fs");
var parse = require("csv-parse");
var sqlite3 = require("sqlite3");
var cData = require("./CensusData");

var fpDataFile = fs.readFileSync("fieldPoll.csv");
parse(fpDataFile, {comment:'#', relax_column_count:true}, handleFieldPoll);

var cenDataFile = fs.readFileSync("CaliforniaCensus.csv");
parse(cenDataFile, {comment:'#', relax_column_count:true}, handleCensusData);

function dbErrorFunc(error) {
    if(error)console.log(error);
}

function handleFieldPoll(error, array) {
    if(error)console.log(error);
    
    var dbFile = "polls.db";
    var db = new sqlite3.Database(dbFile);
    
    db.serialize(function() {
        db.run("CREATE TABLE Polls(population TEXT, hillary INT, bernie INT, undecided INT)", dbErrorFunc);
        for(var i = 0; i < array.length; i++) {
            var pop = array[i][0]; 
            if(pop[0] != '(')
                continue; // this is a header line. skip it
            // strip off the percentage
            pop = pop.substr(pop.indexOf(')')+2, pop.length);
            var hill = array[i][1];
            var bern = array[i][2];
            var unde = array[i][3];
            cmdStr = "INSERT INTO Polls VALUES ('"+pop+"','"+hill+"','"+bern+"','"+unde+"')";
            db.run(cmdStr, dbErrorFunc);
        }
    }, dbErrorFunc);
}

function handleCensusData(error, array) {
    var censusData = new cData.CensusData(array);
    //console.log(censusData.districts)
    
    var dbFile = "census.db";
    var db = new sqlite3.Database(dbFile);
    
    db.serialize(function() {
        var columns = [];
        for(var i = 0; i < cData.requiredList.length; i++){
            columns.push(cData.requiredList[i][2]+" "+cData.requiredList[i][3]);
        }
        columns = "district INT, "+columns.join(", ");
        //console.log(columns)
        
        db.run("CREATE TABLE Census("+columns+")", dbErrorFunc);
        for(var i = 0; i < censusData.districts.length; i++) {
            var values = [i];
            for(var j = 0; j < cData.requiredList.length; j++) {
                values.push(censusData.districts[i][cData.requiredList[j][2]]);
            }
            values = "'"+values.join("','")+"'";
            
            cmdStr = "INSERT INTO Census VALUES ("+values+")";
            //console.log(cmdStr)
            db.run(cmdStr, dbErrorFunc);
        }
    }, dbErrorFunc);
}
