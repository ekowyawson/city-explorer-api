'use strict';
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// ==========================\ DATA LOGIC
let weatherData = require('./data/weather.json');

let Forecast = weatherData.map(wd => {
    const dataModel = {
        city_name: wd.city_name,
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
});
// ==========================/



const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/', (request, response) => {
    // let goodByeMsg = { message: "Goodbye World" };

    const availableCities = weatherData.map((data) => {

        const dataModel = {
            city_name: data.city_name,
            time_zone: data.timezone,
            country_code: data.country_code,
            weather_data: {
                dates: data.data.map((d) => {
                    let weather_obj = {
                        date: d.valid_date,
                        sunrise_ts: d.sunrise_ts,
                        sunset_ts: d.sunset_ts,
                        precip: d.precip,
                        max_temp: d.max_temp,
                        min_temp: d.min_temp,
                        temp: d.temp,
                        description: d.weather.description
                    };

                    return weather_obj;
                })
            }
        }

        return dataModel;
    });

    // response.json(weatherData);
    // response.json(availableCities);
    response.json(Forecast);
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

    let foundCity = weatherData.find(city => {
        return (
            city.lat === lat ||
            city.lon === lon ||
            city.city_name.toLowerCase() === query.toLowerCase()
        );
    });

    response.json(foundCity)
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