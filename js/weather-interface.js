var apiKey = "3907fae117797f761f50e6d64551abf6";

$(document).ready(function() {
  $('#weatherLocation').click(function() {
    var city = $('#location').val();
    $('#location').val("");
    $.get('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey, function(response) {
      $('.showHumidity').text("The humidity in " + city + " is " + response.main.humidity + "%");
      $('.showHigh').text("The High of  " + city + " is " + response.main.temp_max);
      $('.showLow').text("The Low of  " + city + " is " + response.main.temp_min);
      console.log(parseInt(response.id));
    });
  });
});
