import { useState, useEffect } from "react";

export default function Header() {
  const [structuredData, setStructuredData] = useState([]);
  const [weather, setWeather] = useState([]);

  //get weather data from API;
  function getWeatherData() {
    fetch(
      "https://www.7timer.info/bin/civil.php?lon=113.2&lat=23.1&ac=0&unit=metric&output=json&tzshift=0"
    )
      .then((res) => res.json())
      .then((data) => structureData(data))
      .catch((err) => {
        console.log(`Got error while trying to access weather data.`);
        console.log(err);
      });
  }
  //returns copy of original array split into chunk sized arrays
  function arrayOfArrays(array, chunk) {
    let i;
    let temporary = [];
    for (i = 0; i < array.length; i += chunk) {
      temporary.push(array.slice(i, i + chunk));
    }
    return temporary;
  }

  //takes api data and returns an array of objects containing
  //date object and forecast object of time+pemperateure objects
  function structureData(data) {
    let structuredData = [];
    console.log("Got data with date code:" + data.init);
    let year = data.init.slice(0, 4);
    let month = data.init.slice(4, 6);
    let day = data.init.slice(6, 8);
    //split array from weather data into 8 chunks (days)
    let forecasts = arrayOfArrays(data.dataseries, 8);
    //for eacht day, create an object in structuredData,
    //containint date and forecast
    for (let i = 0; i < 8; i++) {
      //modify to account for month end-*-----------------------------------------------FUNCTION NEEDED----
      day = Number(day) + 1;
      structuredData.push({
        date: `${day}.${month}.${year}`,
        forecast: forecasts[i],
      });
    }
    setStructuredData(structuredData);
  }

  //Create components from structured weather data
  function createWeather() {
    setWeather(
      structuredData.map((element, index) => {
        return (
          <div key={index + "card"} className="fs-5 text">
            {element.date}::::
            {element.forecast.map((element, index) => (
              <span key={index + "temp"} className="fs-6 text">
                ||| {element.timepoint}-{element.temp2m}°C
              </span>
            ))}
          </div>
        );
      })
    );
  }

  return (
    <main className="container bg-light" onClick={getWeatherData}>
      <button onClick={createWeather}>WEATHER</button>
      <div className="table">{weather}</div>
    </main>
  );
}
//TO DO
/*
stop even propogation
visual formating
function to correctly decide days and forecast data allocation
*/
