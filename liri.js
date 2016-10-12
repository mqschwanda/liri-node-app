var fs = require('fs');
var util = require('util');
var request = require('request');
var spotify = require('spotify');

// open stream to a text file that appends console log function
  var logFile = fs.createWriteStream('log.txt', { flags: 'a' });
  var logStdout = process.stdout;
  console.log = function () { // function to write console.log() into logFile text file
    logFile.write(util.format.apply(null, arguments) + '\n');
    logStdout.write(util.format.apply(null, arguments) + '\n');
  }
  console.error = console.log;
  //END: log file stream

// add timestamps to document and console on each load
  var timeStamp = Date.now();
  console.log("NODE LOADED: ["+timeStamp+"]");
  //END: timestamps

// set up twitter
  var Twitter = require('twitter');
  var keys = require('./keys.js'); // local twitter keys
  var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  }); // END: twitter setup

// Store all of the arguments in an array
  var nodeArgs = [];
  for (var i = 2; i < process.argv.length; i++) {
    nodeArgs.push(process.argv[i]);
  }
  var argsString = ""; // set variable for the resulting argument string

function myTweets() {
  var userName;
  if (nodeArgs[1]) { // if user name was given
    userName = nodeArgs[1]
  } else { // else use default user name
    userName = 'justinbieber';
  }
  var params = {screen_name: userName}; // load the query parameters
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) { // if there is no error
      for (var i = 0; i < tweets.length && i < 20; i++) { // log the most recent tweets with a limit of 20
        console.log ("---------- "+tweets[i].created_at+" ----------");
        console.log (tweets[i].user.name+": "+tweets[i].text);
      }
    } else { // else log the error
      console.log(error);
    }
  });
}

function spotifyThisSong() {
  if (argsString.length == 0) { // set query if no input is given in from the node arguments
    argsString = "The Sign Ace of Base"
  }
  spotify.search({ type: 'track', query: argsString }, function(err, data) {
      if ( err ) { // log if there is an error
          console.log('Error occurred: ' + err);
          return;
      }
      console.log("Title: "+data.tracks.items[0].name);
      console.log("Artist: "+data.tracks.items[0].artists[0].name);
      console.log("Preview: "+data.tracks.items[0].preview_url);
      console.log("Album: "+data.tracks.items[0].album.name);
  });
}

function movieThis() {
  if (argsString.length == 0) { // set query if no input is given in from the node arguments
    argsString = "Mr+Nobody"
  }
  var queryUrl = 'http://www.omdbapi.com/?t=' + argsString +'&y=&plot=short&r=json';
  request(queryUrl, function (error, response, body) { // runs a request to the OMDB API with the movie specified
    if (!error && response.statusCode == 200) { // If the request is successful
      console.log("Title: " + JSON.parse(body)["Title"]);
      console.log("Release Year: " + JSON.parse(body)["Year"]);
      console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
      console.log("Country: " + JSON.parse(body)["Country"]);
      console.log("Language: " + JSON.parse(body)["Language"]);
      console.log("Plot: " + JSON.parse(body)["Plot"]);
      console.log("Actors: " + JSON.parse(body)["Actors"]);
    }
  });
}

function doWhatItSays() {
  fs.readFile('random.txt', "utf8", function(err, data){ // read the existing text file
    data = data.split(','); // break down all the arguments inside
    nodeArgs = data;
  });
  console.log("----- READING FILE -----");
  setTimeout(function(){ // simple timeout to allow for fs function to finish [this is bad practice to use a timer but used as a quick fix for now]
    runLiri();
  }, 2000);
}

// loads arguments and switches function based on input
function runLiri() {
  // build the argument string from the array
  for (i = 1; i < nodeArgs.length; i++) {
    if (i === 1) {
      argsString += nodeArgs[i];
    } else {
      argsString += "+"+nodeArgs[i];
    }
  }
  var whichApp = nodeArgs[0];
  switch(whichApp) { // switches to a function based on the input
      case 'my-tweets':
          myTweets();
          break;
      case 'spotify-this-song':
          spotifyThisSong();
          break;
      case 'movie-this':
          movieThis();
          break;
      case 'do-what-it-says':
          doWhatItSays();
          break;
      default:
          console.log("ERROR: This is not a supported function!");
  }
}

runLiri();


