async function getCoords(url) {
    const response = await fetch(url);
    const weatherData = await response.json();
    const { coord } = weatherData;
    coord.name = weatherData.name;
    coord.country = weatherData.sys.country;
    return coord;
}

async function getForecast(url) {
    const response = await fetch(url);
    const forecastData = await response.json();
    return forecastData;
}

function buildRequestForecastUrl(coordinates, units) {
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,alerts&units=${units}&appid=20f7632ffc2c022654e4093c6947b4f4`;
}
function buildRequestCoordsUrl(cityName) {
    return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=20f7632ffc2c022654e4093c6947b4f4`;
}

function getDataFromForm(){
    const input = document.querySelector('.search-box-input');
    const cityName = input.value;
    let parsedCity = '';
    if(cityName){
        parsedCity = cityName.replace(/(\s+$|^\s+)/g, '').replace(/(,\s+)/g, ',').replace(/(\s+,)/g, ',').replace(/\s+/g, '+');
    }
    return parsedCity;
}

export{
    getDataFromForm,
    buildRequestCoordsUrl,
    buildRequestForecastUrl,
    getCoords,
    getForecast,
};