 var requiredList = [
["Total population",3, "totalPopulation","INT"],
["Median age (years)",19, "medianAge","FLOAT"],
["White",25, "white","FLOAT"],
["Black or African American",26, "black","FLOAT"],
["American Indian and Alaska Native",27, "indian","FLOAT"],
["Asian",28,"asian","FLOAT"],
["Native Hawaiian and Other Pacific Islander",29,"hawaiian","FLOAT"],
["Some other race",30,"other","FLOAT"],
["Two or more races",31,"twoPlus","FLOAT"],
["Hispanic or Latino (of any race)",34,"hispanic","FLOAT"],
["Born in the United States",43,"bornInUS","FLOAT"],
["Foreign born",47,"foreignBorn","FLOAT"],
["Civilian veterans",79,"civilianVeterans","FLOAT"],
["Percent Unemployed",108,"percentUnemployed","FLOAT"],
["Owner-occupied",155,"ownerOccupied","FLOAT"],
["Renter-occupied",156,"renterOccupied","FLOAT"],
["Median (dollars)",177,"median","INT"],
["Median household income (dollars)",223,"medianHousehold","INT"],
["Mean household income (dollars)",224,"meanHousehold","INT"],
["All families",234,"allFamilies","FLOAT"],
["All people",243,"allPeople","FLOAT"],
["Percent high school graduate or higher",269,"highSchoolGrad","FLOAT"],
["Percent bachelor's degree or higher",270,"collegeGrad","FLOAT"],
["Male", 4, "male", "FLOAT"],
["Female", 5, "female", "FLOAT"],
["15 to 19 years", 9, "range1519", "INT"], 
["20 to 24 years", 10, "range2024", "INT"], 
["25 to 34 years", 11, "range2534", "INT"], 
["35 to 44 years", 12,  "range3544", "INT"], 
["45 to 54 years", 13, "range4554", "INT"], 
["55 to 59 years", 14, "range5559", "INT"], 
["60 to 64 years", 15, "range6064", "INT"], 
["65 to 74 years", 16, "range6574", "INT"], 
["75 to 84 years", 17, "range7584", "INT"], 
["85 years and over", 18, "range85plus", "INT"]];

function stringToFloat(string) {
    var newStr = "";
    for(var i = 0; i < string.length; i++){
        if(string[i]=='.' || (string[i]>='0' && string[i]<='9'))
            newStr+=string[i];
    }
    
    return parseFloat(newStr);
}

function CensusData(array) {
    var totalLines = 271; // 270 lines per district
   
    // first divide array into chunks per district
    this.districts = [];
    
    for(var i = 0; i < array.length; i+= totalLines) {
        var oneDistrict = array.slice(i, i+totalLines);
        
        var keep = {};
        for(var j = 0; j < requiredList.length; j++) {
            var index = requiredList[j][1];
            var line = oneDistrict[index];
            keep[requiredList[j][2]] = stringToFloat(line[1]);
        }
        
        // post process keep information and save it into this.districts
        // races, born, vets
        keep.white = keep.white/keep.totalPopulation;
        keep.black = keep.black/keep.totalPopulation;
        keep.indian = keep.indian/keep.totalPopulation;
        keep.asian = keep.asian/keep.totalPopulation;
        keep.hawaiian = keep.hawaiian/keep.totalPopulation;
        keep.other = keep.other/keep.totalPopulation;
        keep.twoPlus = keep.twoPlus/keep.totalPopulation;
        keep.hispanic = keep.hispanic/keep.totalPopulation;
        keep.bornInUS = keep.bornInUS/keep.totalPopulation;
        keep.foreignBorn = keep.foreignBorn/keep.totalPopulation;
        keep.civilianVeterans = keep.civilianVeterans/keep.totalPopulation
        
        // unemployed
        keep.percentUnemployed = keep.percentUnemployed/100;
        if(keep.percentUnemployed == 0) // district 6 is full of errors
            keep.percentUnemployed = .01;
        // house stuff
        var totalHouses = keep.ownerOccupied+keep.renterOccupied;
        keep.ownerOccupied = keep.ownerOccupied/totalHouses;
        keep.renterOccupied = keep.renterOccupied/totalHouses;
        // poverty
        keep.allFamilies = keep.allFamilies/100;
        if(keep.allFamilies == 0) // district 6 is full of errors
            keep.allFamilies = .01; // district 6 is full of errors
        keep.allPeople = keep.allPeople/100;
        if(keep.allPeople == 0) // district 6 is full of errors
            keep.allPeople = .01; // district 6 is full of errors
        // education
        keep.highSchoolGrad = keep.highSchoolGrad/100;
        keep.collegeGrad = keep.collegeGrad/100;
        // gender
        keep.male = keep.male/keep.totalPopulation;
        keep.female = keep.female/keep.totalPopulation;
        // ages post processing of the ages will happen in the model
        // computation
        
        this.districts.push(keep);
    }
}
 
exports.CensusData = CensusData;
exports.requiredList = requiredList;