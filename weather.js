// global variables
var temp = "";
var humidity = "";
var description = "";
var wind = "";
var clouds = "";
var feelsLike = "";
var currPosition = "";
var alerts = "";
var url = "https://api.forecast.io/forecast/35709defdffda8450fe39589e77e8a54/";
var weatherIcon = "";
var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var hour = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM",
            "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM",
            "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"];
var city = "";

window.onload = getLocation();

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    currPosition = (Math.floor(10000 * position.coords.latitude))/10000 + "," + (Math.floor(10000 * position.coords.longitude))/10000;  //round lat/long to 4 dec places
		url = url + currPosition;
    var cityURL = "http://nominatim.openstreetmap.org/reverse?format=json&lat=" + (Math.floor(10000*position.coords.latitude))/10000 + "&lon=" + (Math.floor(10000*position.coords.longitude))/10000;
    var cityRequest =  new XMLHttpRequest();  //Get city based on lat long coordinates from openstreetmap
    cityRequest.open("Get", cityURL, true);
    cityRequest.send();
    cityRequest.onreadystatechange = function() {
      if (cityRequest.readyState == 4 && cityRequest.status ==200) {
        cityInfo = JSON.parse(cityRequest.responseText);
        city = cityInfo.address.hamlet;
        getWeather();
      }
    }
};

function getWeather() {
    // https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE
  var xhttp = new XMLHttpRequest();
  xhttp.open("Get", url, true);
  xhttp.send();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState ==4 && xhttp.status ==200) {
      weather = JSON.parse(xhttp.responseText);
      temp = (Math.floor(weather.currently.temperature*10))/10;
      //dynamic browser icon - show temperature over icon
      chrome.browserAction.setBadgeText({text: (Math.floor(temp)).toString() + '°'});
      displayWeather(weather);
		}
	};
};

//main function to take data from api and display to user
function displayWeather(weather) {
  temp = (Math.floor(weather.currently.temperature*10))/10; //one decimal place for temp
  feelsLike = (Math.floor(weather.currently.apparentTemperature*10))/10; //one decimal place
  humidity = (weather.currently.humidity)*100;
  description = weather.currently.summary;
  wind = Math.floor(weather.currently.windSpeed);
  windDir = windDirection(weather.currently.windBearing); //using function to get wind direction
  clouds = (weather.currently.cloudCover)*100;
  daySum = weather.daily.data[0].summary;
  weeklySum = weather.daily.summary;
  weatherIcon = weather.currently.icon; // grab weather icon

  var weatherDisplayLeft = document.getElementById('weatherDisplay1');
  var weatherDisplayRight = document.getElementById('weatherDisplay2');
  var tempDisplay = weatherDisplayLeft.appendChild(document.createElement('h1'));
  var currentIcon = tempDisplay.appendChild(document.createElement('img'));
  currentIcon.setAttribute("class", "iconCurrently");
  currentIcon.setAttribute("src", "/weather_icons/" + weatherIcon + ".svg");
  tempDisplay.appendChild(document.createTextNode(" " + temp + "°F"));
  weatherDisplayLeft.appendChild(document.createTextNode("Feels like: " + feelsLike + "°"));

  if (weather.hasOwnProperty('alerts') === false) {
    console.log("No alerts");
  } else {
    alerts = weather.alerts[0].title;
    var alertDisplay = weatherDisplayLeft.appendChild(document.createElement('p'));
    alertDisplay.setAttribute("id", "alerts");
    alertDisplay.appendChild(document.createTextNode(alerts));
  }

  weatherDisplayRight.appendChild(document.createTextNode(city));
  var descriptionDisplay = weatherDisplayRight.appendChild(document.createElement('h2'));
  descriptionDisplay.appendChild(document.createTextNode(description));
  weatherDisplayRight.appendChild(document.createTextNode("Wind: " + wind + " mph " + windDir));
  weatherDisplayRight.appendChild(document.createElement('br'));
  weatherDisplayRight.appendChild(document.createTextNode(daySum));
  var weekSumm = document.getElementById('summary');
  weekSumm.appendChild(document.createTextNode(weeklySum));

//display forecast for future days
for (i=0; i<7; i++) {
  var time = (weather.daily.data[i+1].time)*1000; //api call returns time in seconds - convert to milliseconds
  var date = new Date(time);
  var dayInt = date.getDay(); // get integer value that represents day of the week
  var iconDaily = weather.daily.data[i+1].icon;
  var dayForecast = document.getElementById('forecast');
  var dayWeather = document.createElement('div');
  dayWeather.setAttribute("id", "day");
  dayForecast.appendChild(dayWeather);
  dayWeather.innerHTML = day[dayInt];
  var icon = dayWeather.appendChild(document.createElement('img'));
  icon.setAttribute("class", "iconDaily");
  icon.setAttribute("src", "/weather_icons/" + iconDaily + ".svg" );

  dayWeather.appendChild(document.createTextNode(Math.floor(weather.daily.data[i+1].precipProbability * 100) + "%"));
  dayWeather.appendChild(document.createElement('p'));
  dayWeather.appendChild(document.createTextNode('↑' + tempNoDec(weather.daily.data[i+1].temperatureMax) + '↓' + tempNoDec(weather.daily.data[i+1].temperatureMin)));
}

// display hourly weather conditions
for (i=0; i<10; i++) {
  var time = new Date(weather.hourly.data[i+1].time * 1000);
  var iconHourly = weather.hourly.data[i+1].icon;
  var hourly = document.getElementById('hourly');
  var weatherHour = document.createElement('div');
  weatherHour.setAttribute("id", "weatherHour");
  weatherHour.innerHTML = hour[time.getHours()]; // + weather.hourly.data[i+1].temperature + Math.floor(weather.hourly.data[i+1].precipProbability *100) + "%";

  var icon = weatherHour.appendChild(document.createElement('img'));
  icon.setAttribute("class", "iconHourly");
  icon.setAttribute("src", "/weather_icons/" + iconHourly + ".svg" );

  weatherHour.appendChild(document.createTextNode(Math.floor(weather.hourly.data[i+1].precipProbability *100) + "%"));
  weatherHour.appendChild(document.createElement('p'));
  weatherHour.appendChild(document.createTextNode(Math.floor(weather.hourly.data[i+1].temperature) + '° '));
  hourly.appendChild(weatherHour);
}
}

//function to return temp without decimals
function tempNoDec (temp) {
  newTemp = Math.floor(temp) + '° ';
  return newTemp;
}

//function to return wind direction - api gives numerical value for wind direction in degrees
//N 0-22.5, NE 22.5-67.5, E 67.5-112.5, SE 112.5- 157.5, S 157.5-202.5
//SW 202.5-247.5, W 247.5-292.5, NW 292.5-337.5, N 337.5-360
function windDirection(num) {
  if (num<-1 || num>360) {
    return "Wind direction error";
  } else if (num<22.5 || num>337.5) {
    return "N";
  } else if (num>=22.5 && num<67.5) {
    return "NE";
  } else if (num>=67.5 && num<112.5) {
    return "E";
  } else if(num>=112.5 && num<157.5) {
    return "SE";
  } else if (num>=157.5 && num<202.5) {
    return "S";
  } else if (num>=202.5 && num<247.5) {
    return "SW";
  } else if (num>=247.5 && num<292.5) {
    return "W";
  } else {
    return "NW";
  }}
