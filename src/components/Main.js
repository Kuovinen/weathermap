import { useState, useEffect } from "react";

import createIcon, {
  correctArrayTimeslots,
  padArray,
  convertTime,
} from "./functions.js";
export default function Header() {
  const [structuredData, setStructuredData] = useState([]);
  const [weather, setWeather] = useState([]);

  //get weather data from API;
  function getWeatherData() {
    fetch(
      "https://www.7timer.info/bin/civil.php?lon=113.2&lat=23.1&ac=0&unit=metric&output=json"
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
    let time = data.init.slice(8);
    time = convertTime(Number(time));
    //assign proper timeslots
    let forecasts = correctArrayTimeslots(data.dataseries, Number(time));
    //pad initial data if according to initial timeslot
    forecasts = padArray(forecasts, Number(time));

    //split array from weather data into 8 chunks (days)
    forecasts = arrayOfArrays(forecasts, 8);
    //for eacht day, create an object in structuredData,
    //containint date and forecast
    for (let i = 0; i < 7; i++) {
      //modify to account for month end-*-----------------------------------------------FUNCTION NEEDED----
      structuredData.push({
        date: `${day}.${month}.${year}`,
        forecast: forecasts[i],
      });
      day = Number(day) + 1;
    }
    console.log(structuredData);
    setStructuredData(structuredData);
  }

  //Create components from structured weather data
  function createWeather() {
    setWeather(
      structuredData.map((element, index) => {
        return (
          <div key={index + "card"} className="fs-6 col-auto text-center">
            <div className="fw-bold bg-info">{element.date}</div>
            {element.forecast.map((element, index) => {
              let tab;

              let tab1 = (
                <div key={index + "temp"} className="fs-6 col border">
                  <div className="row justify-content-center">
                    {element.timepoint}:00
                  </div>{" "}
                  <img
                    className="w-50 "
                    src={createIcon(element.weather)}
                    alt="icon"
                  />
                  <div className="row justify-content-center">
                    {element.temp2m}°C
                  </div>
                </div>
              );
              let tab2 = (
                <div key={index + "temp"} className="fs-6 col border">
                  <div className="row justify-content-center">-</div>{" "}
                  <div className="row justify-content-center">-</div>
                  <div className="row justify-content-center">-</div>
                </div>
              );
              tab = element.cloudcover == null ? tab2 : tab1;
              return tab;
            })}
          </div>
        );
      })
    );
  }

  return (
    <main className="container flex-column bg-light justify-content-center">
      <div className="row justify-content-center">
        <button className="border-0 col-auto" onClick={getWeatherData}>
          DATA
        </button>
        <button className="border-0 col-auto" onClick={createWeather}>
          WEATHER
        </button>
      </div>

      <div className="row justify-content-center">{weather}</div>
    </main>
  );
}
//TO DO
/*
stop even propogation
visual formating
function to correctly decide days and forecast data allocation
*/
