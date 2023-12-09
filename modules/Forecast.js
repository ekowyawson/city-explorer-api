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

module.exports = Forecast;