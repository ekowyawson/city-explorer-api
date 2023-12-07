'use strict';
const express = require("express");
const cors = require("cors");
require("dotenv").config();


let weatherData = require('./data/weather.json');

class Forecast {
    constructor(lat, lon, searchQuery, dataObj) {
        this.lat = lat;
        this.lon = lon;
        this.searchQuery = searchQuery;
        this.dataObj = dataObj;
    }

    //======================= getWeather METHOD
    getWeatherData() {
        const sqToLower = this.searchQuery.toLowerCase();
        const city = this.dataObj.find(city => {
            return (
                city.city_name.toLowerCase() === sqToLower
            );
        });

        const data = {
            city_name: city.city_name,
            lat: city.lat,
            lon: city.lon,
            country_code: city.country_code,
            timezone: city.timezone,
            forecast_dates: city.data.map((d) => {
                let weather_obj = {
                    date: d.valid_date,
                    max_temp: d.max_temp,
                    min_temp: d.min_temp,
                    temp_now: d.temp,
                    description: d.weather.description
                };
                return weather_obj;
            })
        }
        return data
    }
}

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/', (request, response) => {
    let goodByeMsg = { message: "Goodbye World" };
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