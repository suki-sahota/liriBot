require("dotenv").config();

const axios = require('axios');
const keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const fs = require('fs');
const moment = require('moment')

let userInput = process.argv[2].toLowerCase();
let userQuery = process.argv.slice(3).join(" ");

const newLog = "-------------------------------------\n";


// Method for logging text in log.txt file
// ---------------------------------
let logText = function(text) {
    fs.appendFile("log.txt", text, function(err) {
        if (err) throw err;
    });
}


// First Command: Bands in town API
// ---------------------------------
const concertThis = function(userQuery) {
    axios.get(`https://rest.bandsintown.com/artists/${ userQuery }/events?app_id=${ keys.BANDS_KEY }`)
    .then(function(response) {
        let concertDate = "";
        let concert = [];
        const newArtistLog = [
            `${ newLog }`,
            `   ~     ~     ~     ~\n`,
            `Upcoming shows for ${ userQuery }\n`,
            `~     ~     ~     ~`
        ].join("");

        logText(newArtistLog);
        console.log(newArtistLog);

        for (let i = 0; i < response.data.length; i++) {
            concertDate = moment(response.data[i].datetime).format("MM/DD/YYYY");
            concert = [
                `\n`,
                `${ userQuery } Event ${ i + 1 }`,
                `\n`,
                `Venue Name: ${ response.data[i].venue.name }`,
                `\n`,
                `Venue Location: ${ response.data[i].venue.city }, ${ response.data[i].venue.country }`,
                `\n`,
                `Concert date: ${ concertDate }`,
                `\n`
            ].join("");

            logText(concert);
            console.log(concert);
        }

        logText(newLog);
        console.log(newLog);
    });
};


// Second Command: Spotify API
// ---------------------------------
const spotify = new Spotify(keys.Spotify);
const spotifyThisSong = function(userQuery) {
spotify.search({ type: 'track', query: userQuery, limit: 1 }, function(err, data) {
    if (err) {
        return console.log('Error occurred: ' + err);
    }
       
    const newSongLog = [
        `${ newLog }`,
        `   ~     ~     ~     ~\n`,
        `Song information for '${ userQuery }'\n`,
        `~     ~     ~     ~`
    ].join("");

    logText(newSongLog);
    console.log(newSongLog);

    const songName = data.tracks.items[0].name;
    const songArtists = data.tracks.items[0].album.artists[0].name;
    const songAlbum = data.tracks.items[0].album.name;
    const songPreview = data.tracks.items[0].preview_url;

    const song = [
        `\n`,
        `The song name is: ${ songName }`,
        `\n`,
        `The artists are: ${ songArtists }`,
        `\n`,
        `The album is: ${ songAlbum }`,
        `\n`,
        `The preview link for spotify is: ${ songPreview }`,
        `\n`
    ].join("");

    logText(song);
    console.log(song);

    logText(newLog);
    console.log(newLog);
    });
}


// Third Command: OMDB API
// ---------------------------------
const movieThis = function(userQuery) {
    axios.get(`http://www.omdbapi.com/?t=${ userQuery }&y=&plot=short&apikey=${ keys.OMDB_KEY }`).then(
        function(response) {

            const newMovieLog = [
                `${ newLog }`,
                `   ~     ~     ~     ~\n`,
                `Song information for '${ userQuery }'\n`,
                `~     ~     ~     ~`
            ].join("");

            logText(newMovieLog);
            console.log(newMovieLog);

            const movieTitle = response.data.Title;
            const movieYear = response.data.Year;
            const movieIMDB = response.data.Ratings[0].Value;
            const movieRottenTomatoes = response.data.Ratings[1].Value;
            const movieCountry = response.data.Country;
            const movieLanguage = response.data.Language;
            const moviePlot = response.data.Plot;
            const movieActors = response.data.Actors;
            
            const movie = [
                `\n`,
                `The movie title is: ${ movieTitle }`,
                `\n`,
                `The actors in the movie are: ${ movieActors }`,
                `\n`,
                `Year movie came out: ${ movieYear }`,
                `\n`,
                `The IMDB rating is: ${ movieIMDB }`,
                `\n`,
                `The Rotten Tomatoes rating is: ${ movieRottenTomatoes }`,
                `\n`,
                `Countries the movie was made in: ${ movieCountry }`,
                `\n`,
                `Languages the movie is made in: ${ movieLanguage }`,
                `\n`,
                `The plot of the movie is: \n\[${ moviePlot }\]`,
                `\n`
            ].join("");

            logText(movie);
            console.log(movie);

            logText(newLog);
            console.log(newLog);
        }
    );
};


// Fourth Command: do-what-it-says (read from random.txt and run with Spotify API)
// ---------------------------------
const doWhatItSays = function() {
    fs.readFile('random.txt', 'utf-8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        // Read file and turn data into an array
        let dataArr = data.split(",");

        // Slice dataArr and turn second half into string
        let str = dataArr.slice(1).join("");
        // Remove quotes
        str = str.slice(1, -1);
        userQuery = str;

        switchCase(dataArr[0]);

    });
};


// Switch case to determine which function the user would like to execute
// ---------------------------------
const switchCase = function(userInput) {
    switch(userInput) {
        case `concert-this`:
            concertThis(userQuery);
            break;
        case `spotify-this-song`:
            spotifyThisSong(userQuery);
            break;
        case `movie-this`:
            movieThis(userQuery);
            break;
        case `do-what-it-says`:
            doWhatItSays()
    }
};


// MAIN PROCESS
// ---------------------------------
switchCase(userInput);