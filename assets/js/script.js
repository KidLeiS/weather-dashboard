// API Key for OpenWeather
var apiKey = "5d401108ab3f24dbb4a6e79f76c7121a";

var searchArray = [];


// Initialisation - to retrieve localStorage and render search history

var init = function(){
    if (localStorage.getItem("searchHistory") != null) {
        searchArray = JSON.parse(localStorage.getItem("searchHistory"));
    }

    for (var i = 0; i < searchArray.length; i++) {
        var searchHistory = $("<div>").text(searchArray[i]);
        searchHistory.attr("class", "list-item");
        $("#history").prepend(searchHistory);
    }
}

// Function to store search history to localStorage
var storeHistory = function() {
    localStorage.setItem("searchHistory",JSON.stringify(searchArray));
}

//Primary logic for fetching OpenWeather data 
var fetchData = function(cityName) {

    // Get a lat and lon from cityname
    var queryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    fetch(queryURL)
    .then(function(response){
        return response.json();
    }).then(function(data){
        var cityOne = data[0];
        // console.log(cityOne);

   // Fetch the current conditions
        var queryCurrentURL = `https://api.openweathermap.org/data/2.5/weather?lat=${cityOne.lat}&lon=${cityOne.lon}&appid=${apiKey}&units=metric`;

        fetch(queryCurrentURL)
        .then(function(response) {
            return response.json()
        }).then(function(data) {
            $("#current-header").text(cityName + " " + dayjs().format('DD/MM/YYYY'));
            $("#current-header").append($("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"));
            $("#current-temp").text("Temp: " + data.main.temp + " °C");
            $("#current-wind").text("Wind: " + data.wind.speed + " KPH");
            $("#current-humidity").text("Humidity: " + data.main.humidity + " %");
        })
   // Fetch the 5 day weather forecast
        var queryForecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityOne.lat}&lon=${cityOne.lon}&appid=${apiKey}&units=metric`;

        fetch(queryForecastURL)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log(data);
            var forecastArrays = data.list;

            for (var i = 0; i < forecastArrays.length/8; i++) {
                console.log(forecastArrays[i*8+7]);
                var datetime = forecastArrays[i*8+7].dt_txt;
                $(`#t${i+1}`).append($("<h4>").text(dayjs(datetime).format('DD/MM/YYYY')));
                $(`#t${i+1}`).append($("<img>").attr("src", "http://openweathermap.org/img/w/" + forecastArrays[i*8+7].weather[0].icon + ".png"));
                $(`#t${i+1}`).append($("<p>").text("Temp: " + forecastArrays[i*8+7].main.temp + " °C"));
                $(`#t${i+1}`).append($("<p>").text("Wind: " + forecastArrays[i*8+7].wind.speed + " KPH"));
                $(`#t${i+1}`).append($("<p>").text("Humidity: " + forecastArrays[i*8+7].main.humidity + " %"));
            }
        });

    });

}

//Function to clear appended data for next search
var resetData = function(){
    $("#current-header").empty();
    $('#t1').empty();
    $('#t2').empty();
    $('#t3').empty();
    $('#t4').empty();
    $('#t5').empty();
}



// Submit button handle

$("#search-form").on("submit",function(event){
    event.preventDefault();

    var userInput = $("#search-input").val();

    resetData();
    fetchData(userInput);

    var searchHistory = $("<div>").text(userInput);
    searchHistory.attr("class", "list-item");
    $("#history").prepend(searchHistory);
    searchArray.push(userInput);
    storeHistory();
})

// History button click handle
$('#history').on("click", ".list-item",function(event){
    event.preventDefault();

    resetData();
    fetchData($(this).text());
})

// Initialisaiton
init();
