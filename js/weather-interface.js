var apiKey = process.env.OPEN_WEATHER_MAP_API_KEY;

$(document).ready(function() {
  $('#weatherLocation').click(function() {
    var city = $('#location').val();
    $('#location').val("");
    $.get('http://api.openweathermap.org/data/2.5/weather?q=' + city + ' &units=imperial' + '&appid=' + apiKey, function(response) {
      $('.showHumidity').text("The humidity in " + city + " is " + response.main.humidity + "%");
      $('.showHigh').text("The High of  " + city + " is " + response.main.temp_max + " F");
      $('.showLow').text("The Low of  " + city + " is " + response.main.temp_min+ " F");
      console.log(parseInt(response.id));
    });
  });
});
