var historyBtn = document.querySelectorAll('.btn');
var storageArray= JSON.parse(localStorage.getItem('local'));
var cityArray= storageArray || ["seattle", "whistler", "bellingham", "ka'anapali"];


$(document).ready(function(){

    $('#searchButton').on('click', function(event){
        event.preventDefault();

        var userCity= document.querySelector('#userInput');
        
        //console.log(userCity);
        makeApiCall(userCity.value);
        cityArray.unshift(userCity.value);
     //console.log(historyArray)
        appendHistoryList(cityArray);
        saveInLocalStorage('local', cityArray);
     
    }) 
    
    function saveInLocalStorage (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
       
    }

    
    function appendHistoryList (array){
        //console.log('appendHistoryList')
        $('.historyBtn').html('');
        //console.log(historyBtn)
    
        for(let i = 0; i < 5; i++){
            let capitalize= array[i].charAt(0).toUpperCase() + array[i].slice(1);
            console.log(array[i])
            $('.historyBtn').append(
                `<button type="button" class="btn" data-city="${array[i]}" id= "cityBtn">${capitalize}</button>`) 
                
        }};    

    appendHistoryList(storageArray)

    $('.btn').on('click', function (event){
            event.preventDefault();
            let cityBtn= $(this).attr('data-city');
            console.log(cityBtn)
            makeApiCall(cityBtn);
        })

function makeApiCall(city){

    var queryURL= 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=9e9359ece8e494590501b7603aacc7ed';

    $.ajax({
        url: queryURL, 
        method: 'GET'
    }).then(function(response){
        console.log(queryURL)
        console.log(response);
        var cityName= $('<h1>').text(response.name);
        var timestamp = response.dt;
        var date = moment.unix(timestamp).format("MM/DD/YYYY");
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        

        var humidity= $('<h3>').text('Humidity: ' + response.main.humidity);
        var wind= $('<h3>').text('Wind Speed: ' + response.wind.speed);
        
        var icon= response.weather[0].icon;
        var lat= response.coord.lat;
        var lon= response.coord.lon;

        $('#currentCity').empty();
        $('#currentCity').append(cityName, humidity, wind)

        $("#currentCity").append("Temperature (F) " + tempF.toFixed(1));
        $('.date').empty();
        $('.date').append(date);

        $('#oneIcon').empty();
        $('#oneIcon').append(
        `<div class= 'weather-icon'><img src= "./images.png/${icon}.png"></div>`)

        callUvIndex(lat, lon);
        fiveDayForecast(lat, lon);

    })

    
}

function callUvIndex(lat, lon){

var uvIndex= `http://api.openweathermap.org/data/2.5/uvi?appid=9e9359ece8e494590501b7603aacc7ed&lat=${lat}&lon=${lon}`

    $.ajax({
        url: uvIndex,
        method: 'GET'
        }).then(function(response){
            
        var uvIndex= $('<h3>').text('UV Index: ' + response.value);


    $('#currentCity').append(uvIndex);   


    if (uvIndex === 0 && uvIndex <= 2.99){
    $(uvIndex).addClass('green')

    }
    if (uvIndex >= 3 && uvIndex <= 5.99){
    $(uvIndex).addClass('yellow')
    }
  
    if (uvIndex >= 6 && uvIndex <= 7.99){
    $(uvIndex).addClass('orange')
    }
    if (uvIndex >= 8 ){
    $(uvIndex).addClass('red')
    }

  });
};

callUvIndex();


function fiveDayForecast(lat, lon){

var fiveForecast= `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,current&appid=81b8beeba7a1d6126e3bb67c1d2d7a74`

$.ajax({
    url: fiveForecast,
    method: 'GET'
}).then(function(response){
    
    $('#fiveDay').html('');

    for(let i=1; i < 6; i++){
    
    var temp= parseInt((((response.daily[i].temp.day- 273.15)*1.8)+32),10);
    var date= moment.unix(response.daily[i].dt).format('MM/DD/YY');
    var humid= response.daily[i].humidity;
    var icon= response.daily[i].weather[0].icon;
    
    $(`#fiveDay`).append(
        `<div class= 'weather-icon'><img src= "./images.png/${icon}.png">
        <h3>${date}</h3>
        <h3>${temp}\xB0F</h3>
        <h3>${humid}%humidity</h3>
        </div>`);
}

})
}
});