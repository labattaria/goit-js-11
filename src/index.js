import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const searchCountryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchCountryInput.addEventListener('input', debounce(onSearchCountry, 300));

function onSearchCountry(event) {
    const countryFinder = event.target.value.trim();

    if (!countryFinder) {
        removeRenderedElements();
        return;
    }

    fetchCountries(countryFinder).then(data => {
        if (data.length > 10) {
            removeRenderedElements();
            specificNameNotification();
        } else if (data.length >= 2 && data.length <= 10) {
            removeRenderedElements();
            renderCountryList(data);
        } else if (data.length === 1) {
            removeRenderedElements();
            renderCountry(data);
        }
    }).catch(error => {
        removeRenderedElements();
        errorWarning();
    });
}

function renderCountryList(data) {
    const markup = data.map(({ name, flags }) => {
        return `<li class="country-info__item">
        <img class="country-list__img" src="${flags.svg}" alt="${name.official}" width="40" height="20">
        <p class="country-info__element">${name.official}</p>
        </li>`;
    }).join('');

    countryList.innerHTML = markup;
}

function renderCountry(elements) {
    const markup = elements.map(({ name, capital, population, flags, languages }) => {
        return `<img class="country-info__img" src="${flags.svg}" alt="${name.official}" width="100" height="60">
        <h2 class="country-info__title">${name.official}</h2>
        <ul class="country-info__list">
            <li class="country-info__item"><p class="country-info__element"><b>Capital</b>: ${capital}</p></li>
            <li class="country-info__item"><p class="country-info__element"><b>Population</b>: ${population}</p></li>
            <li class="country-info__item"><p class="country-info__element"><b>Languages</b>: ${Object.values(languages)}</p></li>
        </ul>`
    }).join('');

    countryInfo.innerHTML = markup;
}

function removeRenderedElements() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}

function specificNameNotification() {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}

function errorWarning() {
    Notiflix.Notify.failure('Oops, there is no country with that name');
}