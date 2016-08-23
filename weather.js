var temp = "";
var humidity = "";
var description = "";
var wind = "";
var clouds = "";
var feelsLike = "";
//var dispFeelsLike = "";
var currPosition = "";
var url = "https://api.forecast.io/forecast/35709defdffda8450fe39589e77e8a54/";
var weatherIcon = "";

// Get current location from browser *only works on secured/https*
// openweather api free account is http so cannot get current location
// must upgrade to paid account or use another weather api


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
    //testing location for chrome extension

}
function showPosition(position) {
    currPosition = position.coords.latitude + "," + position.coords.longitude;
		url = url + currPosition;
		console.log(url);
    console.log(currPosition);
    getWeather();
}
    //var position ="Latitude: " + position.coords.latitude +
    //"<br>Longitude: " + position.coords.longitude;

/*
navigator.geolocation.getCurrentPosition(function(position){console.log(position.coords.latitude)});
navigator.geolocation.getCurrentPosition(function(position){console.log(position.coords.longitude)});
API call using lat & long - api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}
*/

function getWeather() {
    // https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE
  //var locationZip = document.getElementById('locationZip');
  //getLocation();
  console.log(currPosition);
  console.log(url);
  var xhttp = new XMLHttpRequest();
  xhttp.open("Get", url, true);
  xhttp.send();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState ==4 && xhttp.status ==200) {
      weather = JSON.parse(xhttp.responseText);
      temp = (Math.floor(weather.currently.temperature*10))/10; //one decimal place for temp
      feelsLike = (Math.floor(weather.currently.apparentTemperature*10))/10; //one decimal place
      humidity = (weather.currently.humidity)*100;
      description = weather.currently.summary;
      wind = weather.currently.windSpeed;
      clouds = (weather.currently.cloudCover)*100;
      weatherIcon = weather.currently.icon; // grab weather icon
      //test to see response object from api server
      console.log(weather);
      console.log(weatherIcon);
      //dynamic icon - show temperature over icon
      chrome.browserAction.setBadgeText({text: (Math.floor(temp)).toString() + '°'});
      displayWeather(description, temp, feelsLike, humidity, wind, clouds);
		}
	};
      console.log(description);
      //displayWeather(description, temp, dispFeelsLike, humidity, wind, clouds);
    }

function displayWeather(description, temp, feelsLike, humidity, wind, clouds) {
  var weatherDisplay = document.getElementById('weatherDisplay');
  var displayForecast0 = document.getElementById('day0');
  var displayForecast1 = document.getElementById('day1');
  var displayForecast2 = document.getElementById('day2');
  var displayForecast3 = document.getElementById('day3');
  var displayForecast4 = document.getElementById('day4');
  var displayForecast5 = document.getElementById('day5');


	weatherDisplay.innerHTML = "";
  weatherDisplay.innerHTML = "Temperature: " + temp + "&deg;F";
  weatherDisplay.appendChild(document.createElement('p'));
  weatherDisplay.appendChild(document.createTextNode("Conditions: " + description));
	//weatherDisplay.appendChild(document.createElement('p'));
  //weatherDisplay.appendChild(document.createTextNode("Current Temperature " + temp + '&#176;'));
  weatherDisplay.appendChild(document.createElement('p'));
  var weatherDisplayChild = weatherDisplay.children[1];
  weatherDisplayChild.innerHTML = "Feels like: " + feelsLike + "&deg;";
  //weatherDisplay.appendChild(document.createTextNode("Feels like: " + feelsLike + " degrees"));
  weatherDisplay.appendChild(document.createElement('p'));
  weatherDisplay.appendChild(document.createTextNode("Humidity " + humidity + "%"));
  weatherDisplay.appendChild(document.createElement('p'));
  weatherDisplay.appendChild(document.createTextNode("Wind " + wind + "mph"));
  weatherDisplay.appendChild(document.createElement('p'));
  weatherDisplay.appendChild(document.createTextNode("Clouds " + clouds + "%"));
  //displayForecast0.appendChild(document.createElement('p'));
  displayForecast0.innerHTML = "Test0";
  displayForecast1.innerHTML = "1";
  displayForecast2.innerHTML = "Test2";
  displayForecast3.innerHTML = "Test3";
  displayForecast4.innerHTML = "Test4";
  displayForecast5.innerHTML = "Test5";

}
// Testing location
function display() {
  var display = document.getElementById('display');
  display.innerHTML = "";
  display.appendChild(document.createTextNode("Location: " + currPosition));
}

// adding listener to button to execute script
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('div').addEventListener('click', getLocation());
});
