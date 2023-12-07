'use strict';
const express = require("express");
const cors = require("cors");
require("dotenv").config();


let weatherData = require('./data/weather.json');

const Forecast = (lat, lon, cityName) => {
    let temp = weatherData.map(wd => {
        const dataModel = {
            city_name: wd.city_name,
            lat: wd.lat,
            lon: wd.lon,
            country_code: wd.country_code,
            timezone: wd.timezone,
            forecast_dates: wd.data.map((d) => {
                let weather_obj = {
                    date: d.valid_date,
                    sunrise: d.sunrise_ts,
                    sunset: d.sunset_ts,
                    precip: d.precip,
                    max_temp: d.max_temp,
                    min_temp: d.min_temp,
                    temp_now: d.temp,
                    description: d.weather.description
                };

                return weather_obj;
            })
        }

        return dataModel;
    })

    return temp;
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

// Example Query:
// http://localhost:3001/weather?lat=0.335&lon=0.456&q=Amman
app.get("/weather", (request, response) => {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let query = request.query.q;

    // Check for null or undefined values for lat, lon, and searchQuery
    if (
        lat == null
        || lon == null
        || query == null
        || lat === undefined
        || lon === undefined
        || query === undefined
    ) {
        return response.status(400).json({ error: "lat, lon, and searchQuery are required parameters" });
    }

    let findCity = Forecast(lat, lon, query);
    let foundCity = findCity.find(city => {
        return (
            city.lat === lat ||
            city.lon === lon ||
            city.city_name.toLowerCase() === query.toLowerCase()
        );
    });

    response.json(foundCity);
});

app.get("*", (request, response) => {
    response.status(404).send("Page Not Avaiable");
});

app.use((error, request, response, next) => {
    response.status(500).send(error.message);
});

app.listen(
    PORT,
    () => console.log(`Listening on port ${PORT}`)
);