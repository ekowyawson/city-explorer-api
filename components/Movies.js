require("dotenv").config();
const axios = require('axios');

class Movies {
    constructor(city, page = 1) {
        this.city = city;
        this.page = page;
    }

    async getMovies() {
        const cityQuery = `https://api.themoviedb.org/3/search/movie?query=${this.city}&include_adult=false&language=en-US&page=${this.page}`;
        const TMDB_API = process.env.TMDB_API_KEY;
        const options = {
            method: 'GET',
            url: cityQuery,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${TMDB_API}`
            }
        };

        try {
            const response = await axios.request(options);
            const resData = response.data.results.map(e => {
                return {
                    id: e.id,
                    title: e.title,
                    summary: e.overview,
                    date: e.realease_date,
                    rating: e.popularity,
                    img: e.poster_path
                }
            });

            return resData;
        } catch (error) {
            let errMsg = `Your movie request failed with the following error: ${error}`;
            console.error(errMsg);
            return errMsg;
        }
    }

}

module.exports = Movies;