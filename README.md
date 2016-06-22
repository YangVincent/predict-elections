# Predict Elections

####About
This website uses polling data provided by the WSJ coupled with census data to more accurately predict the 2016 California Primary between Hilary Clinton and Bernie Sanders. 

The server uses node.js to route different queries to/from a `sqlite` database and various API calls. The front end is completed with vanilla JavaScript, HTML/CSS, and D3.js. 

####Instructions
In order to run site, run `npm install` on the needed modules, then `node index.js` to start up the server. 

1. `npm install node-static`
2. `npm install sqlite3`
3. `npm install request`
4. `node index.js`
5. Point your browser to `localhost:8080`.

####Model
For this assignment, I took gender, age, and race into account and tried to predict what the outcome of California's voting would be. I weighed gender to only have 10%
of influence on the final result, age to have 40% since most people from different age groups have drastically different opinions on controversial issues, and finally
50% for race because I feel that people are extremely affected by race, which correlates closely with peoples' upbringings.

####Further Explanation
Since this assignment focused on integrating results from the Huffington Post API, I first had the browser side execute an XMLHttpRequest query to the server. The server
then sent a GET request to the Huffington Post API, and waited for a result. Finally, when the Huffington Post
results returned, it sent the results back to the client. After the client finished processing the Huffington Post results, it executed another query to figure out 
results for the combined model to display as well. This query also used fs on the serverside to save results for voting percentage predictions.
