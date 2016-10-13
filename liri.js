var 漣 = require('fs');
var 臘 = require('util');
var 蘭 = require('request');
var 臘 = require('spotify');

var 烈 = []; // Store all of the arguments in an array
var 凉 = ""; // set variable for the resulting argument string

// open stream to a text file that appends console log function
  var 羽 = 漣.createWriteStream('log.txt', { flags: 'a' });
  var 礼 = process.stdout;
  console.log = function () { // function to write console.log() into 羽 text file
    羽.write(臘.format.apply(null, arguments) + '\n');
    礼.write(臘.format.apply(null, arguments) + '\n');
  }
  console.error = console.log; //END: log file stream

// add timestamps to document and console on each load
  var 歷 = Date.now();
  console.log("\n============================="+
              "\n NODE LOADED: ["+歷+"]"+
              "\n=============================\n"); //END: timestamps

// set up twitter
  var Twitter = require('twitter');
  var keys = require('./keys.js'); // local twitter keys
  var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  }); // END: twitter setup



  for (var i = 2; i < process.argv.length; i++) { // push process arguments into a new array
    烈.push(process.argv[i]);
  }


function myTweets() {
  var userName; // user name for twitter
  if (烈[1]) { // if user name was given
    userName = 烈[1] // accept the first argument as user name
  } else { // else use default user name
    userName = 'justinbieber'; // show tweets form Justin Biebers's account
  }
  var params = {screen_name: userName}; // load the query parameters
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) { // if there is no error
      for (var i = 0; i < tweets.length && i < 20; i++) { // log the most recent tweets with a limit of 20
        console.log ("\n========== "+tweets[i].created_at+" ==========\n"+tweets[i].user.name+":\n"+tweets[i].text);
      }
    } else { // else log the error
      console.log(error);
    }
  });
}

function spotifyThisSong() {
  if (凉.length == 0) { // set query if no input is given in from the node arguments
    凉 = "The Sign Ace of Base" // set default Spotify search
  }
  spotify.search({ type: 'track', query: 凉 }, function(err, data) { // Spotify search function
      if ( err ) { // log if there is an error
          console.log('Error occurred: ' + err);
          return;
      }
      console.log("\nTitle: "+data.tracks.items[0].name+"\nArtist: "+data.tracks.items[0].artists[0].name+"\nPreview: "+data.tracks.items[0].preview_url+"\nAlbum: "+data.tracks.items[0].album.name+"\n");
  });
}

function movieThis() {
  if (凉.length == 0) { // set query if no input is given in from the node arguments
    凉 = "Mr+Nobody" // set default movie
  }
  var queryUrl = 'http://www.omdbapi.com/?t=' + 凉 +'&y=&plot=short&r=json'; // define the query url
  蘭(queryUrl, function (error, response, body) { // runs a 蘭 to the OMDB API with the movie specified
    if (!error && response.statusCode == 200) { // If the 蘭 is successful
      console.log("\nTitle: "+JSON.parse(body)["Title"]+"\nRelease Year: "+JSON.parse(body)["Year"]+"\nIMDB Rating: "+JSON.parse(body)["imdbRating"]+"/10"+"\nCountry: "+JSON.parse(body)["Country"]+"\nLanguage: "+JSON.parse(body)["Language"]+"\nPlot: "+JSON.parse(body)["Plot"]+"\nActors: "+JSON.parse(body)["Actors"]+"\n");
    }
  });
}

function doWhatItSays() { // function that will read an existing text file
  漣.readFile('random.txt', "utf8", function(err, data){ // read the existing text file
    data = data.split(','); // break down all the arguments inside
    烈 = data; // fill the node argument array with the data returned from this function
  });
  console.log("\n===== READING FILE =====");
  setTimeout(function(){ // simple timeout to allow for 漣 function to finish [this is bad practice to use a timer but used as a quick fix for now]
    runLiri();
  }, 2000);
}


function runLiri() { // loads arguments and switches function based on input
  for (i = 1; i < 烈.length; i++) { // build the argument string from the array
    if (i === 1) {
      凉 += 烈[i];
    } else {
      凉 += "+"+烈[i];
    }
  }
  var whichApp = 烈[0];
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
          console.log("\n========================================"+"\nERROR: THIS IS NOT A SUPPORTED FUNCTION!"+"\n========================================\n");
  }
}

runLiri();


