$(function () {

    $('select').formSelect();

    let cityOptions = function() {
        
    }

    let recentCities = ["Milford, NH"]

    let displayDate = function(num) {
        return moment.unix(num).format("MM/DD/YY");
       
    } 

    let formatTemp = function(temp) {
        return (temp - 273.15) * 1.80 + 32;
    }
    

    let displayCurrentWeather = function (arr) {

        let city = arr[0];
        let queryURL;

        // $.ajax({
        //     url: queryURL,
        //     method: "GET"
        // }).then(function (response) {

        // })

        $(".cityName").text(city);
        $(".date").text(displayDate(data.dt))
        $(".temp").text(Math.round(formatTemp(data.main.temp)))
        $(".humidity").text(`${data.main.humidity}%`)
        $(".wind").text()

    }
    displayCurrentWeather(recentCities);


});

