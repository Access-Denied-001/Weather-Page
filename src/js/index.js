import '../style/main.scss';
import * as apiFncs from './apiFunctions';
import * as domFncs from './domFunctions';

// Search Box and its input
const searchBox = document.querySelector('.search-box-input');
const searchIcon = document.querySelector('.search');

// Button to change unit of temperature
const displayF = document.querySelector('.weather-info__units-f');
const displayC = document.querySelector('.weather-info__units-c');
let units = 'metric';

// Button to look for daily or hourly forecasts
const dailyBtn = document.querySelector('.daily-btn');
const hourlyBtn = document.querySelector('.hourly-btn');

// Buttons to shift left and right for hourly forecast
const changeHoursLeft = document.querySelector('.change-hours__left');
const changeHoursRight = document.querySelector('.change-hours__right');
let hoursPage = 1;

// flags to keep track of last searched city, to re-use this info when changing units
let unitReload = false;
let lastCity = 'Jaipur';

// Due to API call, hide the body until the first data is loaded
document.querySelector('body').style.visibility = 'hidden';

async function getWeatherData(unit, initialLoad = false) {
  try {
    // Getting the city name from DOM
    let cityName;
    if (initialLoad) {
      cityName = 'Jaipur';
    } else {
      cityName = apiFncs.getDataFromForm();
    }
    if (!cityName) {
      return;
    }

    // When units are changed from metric to imperial we do an API call for last know city
    if (unitReload) {
      cityName = lastCity;
    }
    lastCity = cityName;

    // Get coordinates of searched city
    const requestCoordsUrl = apiFncs.buildRequestCoordsUrl(cityName);
    const coords = await apiFncs.getCoords(requestCoordsUrl);
    const requestForecastUrl = apiFncs.buildRequestForecastUrl(coords, unit);
    const weatherData = await apiFncs.getForecast(requestForecastUrl);

    // Copy some data over from the coordinates data over to the new data
    weatherData.name = coords.name;
    weatherData.country = coords.country;

    document.querySelector('.error-msg').style.visibility = 'hidden';

    // Render the weather
    domFncs.renderWeatherData(weatherData, unit);
    unitReload = false;
    document.querySelector('body').style.visibility = 'visible';
  } catch (err) {
    document.querySelector('.error-msg').style.visibility = 'visible';
  }
  document.querySelector('.search-box-input').value = '';
}

getWeatherData(units, true);

// When search icon is clicked then shoot API call
searchIcon.addEventListener('click', () => {
  getWeatherData(units);
});

// when enter is punched Shoot API call
searchBox.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    getWeatherData(units);
  }
});

// Event listeners on daily and hourly button
dailyBtn.addEventListener('click', domFncs.displayDailyForecast);
hourlyBtn.addEventListener('click', domFncs.displayHourlyForecast);

// For hourly buttons, the page should shift between 1 and 3
changeHoursLeft.addEventListener('click', () => {
  if (hoursPage > 1) {
    hoursPage--;
    domFncs.changeHoursPage(hoursPage);
  }
});
// If not on the last page, go to next page
changeHoursRight.addEventListener('click', () => {
  if (hoursPage < 3) {
    hoursPage++;
    domFncs.changeHoursPage(hoursPage);
  }
});

// Toggle the unit between metric and imperial for viewing
displayC.addEventListener('click', async () => {
  units = 'metric';
  unitReload = true;
  await getWeatherData(units, true);

  displayC.style.display = 'none';
  displayF.style.display = 'block';
});
displayF.addEventListener('click', async () => {
  units = 'imperial';
  unitReload = true;
  await getWeatherData(units, true);

  displayF.style.display = 'none';
  displayC.style.display = 'block';
});