$(function () {

    let recentCities = []

    let getCities = function () {
        recentCities = JSON.parse(localStorage.getItem("cityArray"));
        if (!recentCities) {
            localStorage.setItem("cityArray", JSON.stringify(recentCities));
        }
    };
    getCities()



    let stateOptions = function () {
        states.forEach(function (item, index) {
            let newOpt = $("<option>");
            newOpt.attr("value", index);
            newOpt.text(item);
            $(".stateSelect").append(newOpt);
        });
    }
    stateOptions()

    $('select').formSelect();

    let citySearch = function () {
        $(".search").on("click", function () {
            if (($("li.selected").text()) === "Select State") {
                alert("dumb")
                return;
            }
            if (!$("#input_text").val()) {
                alert("dumb")
                return;
            }
            let city = $("#input_text").val()
            let state = $("li.selected").text()

            if (!recentCities) {
                recentCities = [(`${city}, ${state}`)]
            } else if (recentCities.length >= 0) {
                recentCities.unshift(`${city}, ${state}`)
            }

            localStorage.setItem("cityArray", JSON.stringify(recentCities))


            displayCurrentWeather(recentCities)
        })
    }
    citySearch()



    let displayDate = function (num) {
        let str = `${num}`
        let split = str.split(" ")
        let newS = split[0].split("-")
        let newForm = `${newS[1]}/${newS[2]}/${newS[0]}`
        
        return newForm;
    }

    let displayCurrDate = function(num) {
        return moment.unix(num).format("MM/DD/YY");
       
    } 

    let formatTemp = function (temp) {
        return (temp - 273.15) * 1.80 + 32;
    }
    

    let formatWind = function (wind) {
        return (wind * 2.24);
    }


    let displayCurrentWeather = function (arr) {

        let lat;
        let long;

        if (!arr) {
            alert("dumb")
            return;
        }
        let str = recentCities[0]
        let split = str.split(",")
        let myCity = split[0].split(" ").join("%20")
        let state = split[1].replace(" ", "")
        let searchID = `${myCity}%2C%20${state}`
        console.log(searchID)

        const myURL = "https://api.opencagedata.com/geocode/v1/json?q=" + searchID + "&key=83c4661294e14018ac85ea3a5a9b5ffd&language=en&pretty=1"
        console.log(myURL)

        // $.ajax({
        //     url: myURL,
        //     method: "GET"
        // }).then(function (response) {
            // lat = response.results[0].bounds.northeast.lat
            // long = response.results[0].bounds.northeast.lng

            let city = recentCities[0];
            const queryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=b39417425b9299cc61c63ff3f32ab962`

            // $.ajax({
            //     url: queryURL,
            //     method: "GET"
            // }).then((response) => {

                $(".cityName").text(city);
                $(".date").text(displayCurrDate(data.dt))
                $(".temp").text(`Temperature: ${Math.round(formatTemp(data.main.temp))} ${String.fromCharCode(176)}F`)
                $(".humidity").text(`Humidity: ${data.main.humidity}%`)
                $(".wind").text(`Wind Speed: ${Math.round(formatWind(data.wind.speed))} MPH`)
                $(".uvIndex").text(`Feels Like: ${Math.round(formatTemp(data.main.feels_like))} ${String.fromCharCode(176)}F`)

                const fiveURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=b39417425b9299cc61c63ff3f32ab962`
                
                // $.ajax({
                //     url: fiveURL,
                //     method: "GET"
                // }).then((response) => {
                    // console.log(response)
                    for (i = 0; i < datafive.list.length; i += 8) {
                        let day = datafive.list[i];
                        let icon = day.weather[0].icon;
                        let iconurl = `http://openweathermap.org/img/w/${icon}.png`;
                        let box = $("<div>").addClass("dayBox col s12 m5 l5")
                        $(".fiveRow").append(box) 
                        let pEl = $("<p>").text(displayDate(day.dt_txt))
                        box.append(pEl)
                        let imgEl = $("<img>");
                        let ulEl = $("<ul>");

                        
                    }


                // })

            // })

    // })



    }
    displayCurrentWeather(recentCities);




});

