'use strict';
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const Forecast = require('./components/Weather');
const Movies = require('./components/Movies');
const weatherData = require('./data/weather.json');

const TMDB_API = process.env.TMDB_API_KEY;
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());


app.get('/', (request, response) => {
    let goodByeMsg = { message: "Goodbye World! Yes, your API is working." };
    // response.redirect('/weather?lat=0lon=0&searchQuery=Amman');
    response.json(goodByeMsg);
});


app.get('/broken', (request, response) => {
    throw new Error("Something is totally broken");
})


// Example Query: http://localhost:3001/weather?lat=0.335&lon=0.456&q=Amman
app.get("/weather", (request, response) => {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let searchQuery = request.query.searchQuery;

    // Check for null or undefined values for lat, lon, and searchQuery
    if (
        lat == null
        || lon == null
        || searchQuery == null
        || lat === undefined
        || lon === undefined
        || searchQuery === undefined
    ) {
        return response.status(400).json({ error: "lat, lon, and searchQuery are required parameters" });
    }

    // ============ Creating an instance of Forecast ================
    let findCity = new Forecast(lat, lon, searchQuery, weatherData);
    response.json(findCity.getWeatherData());
});


app.get("/movies/:page", (request, response) => {
    let city = request.query.city;
    let page = request.params.page || 1;

    if ( city == null || city === undefined) {
        return response.status(400).json({ error: "ERROR: City is a required parameter." });
    }

    const movies = new Movies(city, page);

    movies.getMovies()
    .then(data => {
        // Handle the result here
        response.json(data);
      })
      .catch(error => {
        // Handle errors here
        console.error("Error:", error);
        return response.status(400).json({ error: `ERROR: There was an error: ${error}.` });
      });
});


app.get("*", (request, response) => {
    response.status(404).send("Page Not Available");
});


app.use((error, request, response, next) => {
    response.status(500).send(error.message);
});


app.listen(
    PORT,
    () => console.log(`Listening on port ${PORT}`)
);