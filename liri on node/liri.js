var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var keys = require('./keys.js');

var twitterKey = keys.twitterKeys;
var nodeArgs = process.argv;
var movieName = "";
var songName = "";

var client = new Twitter({
		consumer_key: twitterKey.consumer_key,
  	consumer_secret: twitterKey.consumer_secret,
  	access_token_key: twitterKey.access_token_key,
  	access_token_secret: twitterKey.access_token_secret
});

// twitter api
var myTwitter = function() {
	var params = {screen_name: 'twitteraccount', count: 20};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		for (var i = 0; i < tweets.length; i++) {
			console.log(tweets[i].created_at);
			console.log(tweets[i].text);
			console.log('\n--------------------------------\n');
		}
	});
}

var mySpotify = function() {
	for (var i=3; i<nodeArgs.length; i++){
		if (i>3 && i< nodeArgs.length){
			songName += "+" + nodeArgs[i];} 
		else 
			{
			songName += nodeArgs[i];
		}
	}
// Default song name
spotify.search({ type: 'track', query: songName || 'Gorillaz - Feel Good Inc' }, function(err, data) {
	if ( err ) {
		console.log('Error occurred: ' + err);
	return;
	    }
var artist = data.tracks.items[0].artists[0].name;
var song = data.tracks.items[0].name;
var previewURL = data.tracks.items[0].preview_url;
var album = data.tracks.items[0].album.name;

console.log('\n--------------------------------\n');
console.log("Artist: " + artist);
console.log("Song name: " + song);
console.log("Preview URL: " + previewURL);
console.log("Album: " + album);
console.log('\n--------------------------------\n');
	});
}

var myMovie = function() {
	if (process.argv[3] == null) {
		movieName = "Moana";
	} else {
		for (var i=3; i<nodeArgs.length; i++){
			if (i>3 && i< nodeArgs.length){
				movieName += "+" + nodeArgs[i];
			} else {
				movieName += nodeArgs[i];
			}
		}
	}
// OMDB API
var queryUrl = 'http://www.omdbapi.com/?t=' + movieName +'&y=&tomatoes=true&plot=short&r=json';
	request(queryUrl, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('\n--------------------------------\n');
			console.log("Title: " + JSON.parse(body)['Title']);
			console.log("Release Year: " + JSON.parse(body)['Year']);
			console.log("Rating: " + JSON.parse(body)['imdbRating']);
			console.log("Country: " + JSON.parse(body)['Country']);
			console.log("Language: " + JSON.parse(body)['Language']);
			console.log("Plot: " + JSON.parse(body)['Plot']);
			console.log("Actors: " + JSON.parse(body)['Actors']);
			console.log("Rotten Tomatoes Rating: " + JSON.parse(body)['tomatoUserRating']);
			console.log("Rotten Tomatoes URL: " + JSON.parse(body)['tomatoURL']);
			console.log('\n--------------------------------\n');
		}
	});
}
// gets command
var random = function() {

	fs.readFile('random.txt', 'utf8', function(err, data) {
		if (err) {
			throw err;
		}
// changes the string from the random.txt into an array so that it can be utilized for the switch and spotify api.
		var dataArray = data.split(",");
		nodeArgs[2] = dataArray[0];
		nodeArgs[3] = dataArray[1];
		command(nodeArgs[2]);
	})
}

// Ensures the appropriate function
var command = function(nodeArgs) {
	switch(nodeArgs){
	    case 'my-tweets':
	        myTwitter();
	    break;

	    case 'spotify-this-song':
	        mySpotify();
	    break;

	    case 'movie-this':
	        myMovie();
	    break;

	    case 'do-what-it-says':
	        random();
	    break;
	}
}
command(nodeArgs[2]);



