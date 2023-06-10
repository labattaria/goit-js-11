const BASE_URL = 'https://restcountries.com/v3.1';
const API_FIELDS = 'fields=name,capital,population,flags,languages';

const fetchCountries = function (name) {
    return fetch(`${BASE_URL}/name/${name}?${API_FIELDS}`).then(response => {
        if (response.status === 404) {
            return Promise.reject(new Error());
        }

        return response.json();
    });
};

export { fetchCountries };