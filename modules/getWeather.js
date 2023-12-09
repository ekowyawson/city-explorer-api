'use strict';
const axios = require('axios');
let cache = require('./cache.js');
require("dotenv").config();
const WEATHER_API_KEY = process.env.WEATHERBIT_API;


class Weather {
    constructor(day) {
        this.forecast = day.weather.description;
        this.time = day.datetime;
    }
}

async function getWeather(city) {
    const key = 'weather-' + city;
    const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${WEATHER_API_KEY}&lang=en&city=${city}&days=5`;

    if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
        console.log('Cache hit');
    } else {
        console.log('Cache miss');
        try {
            const response = await axios.get(url);
            cache[key] = {
                timestamp: Date.now(),
                data: parseWeather(response.data),
            };
        } catch (error) {
            console.error('Error fetching weather data:', error.message);
            throw error;
        }
    }
    return cache[key].data;
}

function parseWeather(weatherData) {
    try {
        const weatherSummaries = weatherData.data.map(day => new Weather(day));
        return weatherSummaries;
    } catch (err) {
        console.error('Error parsing weather data:', err.message);
        throw err;
    }
}

module.exports = getWeather;