$(function () {

    let recentCities = []


    let getCities = function () {
        recentCities = JSON.parse(localStorage.getItem("cityArray"));
        if (!recentCities) {
            localStorage.setItem("cityArray", JSON.stringify(recentCities));
        }
    };
    getCities()

    let displayRecent = function () {
        if (!recentCities) {
            return;
        }

        let displayArray = recentCities.filter((item, index) => recentCities.indexOf(item) === index);

        displayArray.forEach(function (item) {
            let newLiEl = $("<li>");
            newLiEl.text(item);
            newLiEl.addClass("recentList");
            $(".recentCities").append(newLiEl);
        })

    }



    $(document).on("click", ".recentList", function () {
        let newFirst = $(this).text();
        recentCities.unshift(newFirst);
        let storageArray = recentCities.filter((item, index) => recentCities.indexOf(item) === index);
        localStorage.setItem("cityArray", JSON.stringify(storageArray))
        displayCurrentWeather(recentCities);
    })




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

            localStorage.setItem("cityArray", JSON.stringify(recentCities));

            displayCurrentWeather(recentCities)

            $("#input_text").val(" ")
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

    let displayCurrDate = function (num) {
        return moment.unix(num).format("MM/DD/YYYY");

    }

    let formatTemp = function (temp) {
        return (temp - 273.15) * 1.80 + 32;
    }


    let formatWind = function (wind) {
        return (wind * 2.24);
    }


    let displayCurrentWeather = function (arr) {
        $(".recentCities").empty()
        $(".fiveRow").empty()

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

        const myURL = "https://api.opencagedata.com/geocode/v1/json?q=" + searchID + "&key=83c4661294e14018ac85ea3a5a9b5ffd&language=en&pretty=1"


        $.ajax({
            url: myURL,
            method: "GET"
        }).then(function (response) {
            lat = response.results[0].bounds.northeast.lat
            long = response.results[0].bounds.northeast.lng

            const uvURL = `https://api.openweathermap.org/data/2.5/uvi?appid=b39417425b9299cc61c63ff3f32ab962&lat=${lat}&lon=${long}`

            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function (response) {
                $(".uvIndex").text(`UV Index: ${response.value}`);

                let city = recentCities[0];
                const queryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=b39417425b9299cc61c63ff3f32ab962`

                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then((response) => {

                    let currI = response.weather[0].icon;
                    let iurl = `http://openweathermap.org/img/w/${currI}.png`;

                    $(".cityName").text(city);
                    $(".date").text(displayCurrDate(response.dt))
                    $(".currIcon").attr("src", iurl)
                    $(".temp").text(`Temperature: ${Math.round(formatTemp(response.main.temp))} ${String.fromCharCode(176)}F`)
                    $(".humidity").text(`Humidity: ${response.main.humidity}%`)
                    $(".wind").text(`Wind Speed: ${Math.round(formatWind(response.wind.speed))} MPH`)

                    const fiveURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=b39417425b9299cc61c63ff3f32ab962`

                    $.ajax({
                        url: fiveURL,
                        method: "GET"
                    }).then((response) => {
                        for (i = 1; i < response.list.length; i += 8) {
                            let day = response.list[i];
                            let icon = day.weather[0].icon;
                            let iconurl = `http://openweathermap.org/img/w/${icon}.png`;
                            let box = $("<div>")
                            $(".fiveRow").append(box)
                            box.addClass(`dayBox col s12 m5 l2`)
                            let pEl = $("<p>").text(displayDate(day.dt_txt))
                            box.append(pEl)
                            let imgEl = $("<img>");
                            imgEl.attr("src", iconurl);
                            box.append(imgEl);
                            let ulEl = $("<ul>");
                            box.append(ulEl);
                            let li1 = $("<li>")
                            li1.text(`Temperature: ${Math.round(formatTemp(day.main.temp))} ${String.fromCharCode(176)}F`)
                            ulEl.append(li1)
                            let li2 = $("<li>")
                            li2.text(`Humidity: ${day.main.humidity}%`)
                            ulEl.append(li2)
                        }


                    })

                })



            })

        })


        displayRecent()
    }
    displayCurrentWeather(recentCities);




});

