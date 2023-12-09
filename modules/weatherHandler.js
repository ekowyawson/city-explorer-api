const weather = require('./getWeather');

function weatherHandler(request, response) {
    const city = request.params.city;

    if (city == null) {
        return response.status(400).json({ error: "At the least, city is a required parameter" });
    }

    weather(city)
        .then(summaries => response.send(summaries))
        .catch((error) => {
            console.error(error);
            response.status(400).send('Sorry. Something went wrong!')
        });
}

module.exports = weatherHandler;