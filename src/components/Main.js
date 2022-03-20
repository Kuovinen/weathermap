import { useState, useEffect } from "react";
import createIcon, {
  correctArrayTimeslots,
  padArray,
  convertTime,
  arrayOfArrays,
} from "./functions.js";
import Map from "./Map.js";
export default function Header() {
  const [structuredData, setStructuredData] = useState([]);
  const [weather, setWeather] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: 60.169, lng: 24.938 });

  //get weather data from API;
  function getWeatherData() {
    let lat = coordinates.lat;
    let lng = coordinates.lng;
    fetch(
      `https://www.7timer.info/bin/civil.php?lon=${lng}&lat=${lat}&ac=0&unit=metric&output=json`
    )
      .then((res) => res.json())
      .then((data) => structureData(data))
      .catch((err) => {
        console.log(`Got error while trying to access weather data.`);
        console.log(err);
      });
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
    if (time == "00") {
      console.log("got!");
      time = "0";
    }
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
                <div
                  key={index + "temp"}
                  className="fs-6 col border user-select-none"
                >
                  <div className="row justify-content-center">
                    {element.timepoint}:00
                  </div>{" "}
                  <img
                    className="w-50 weatherIcon"
                    src={createIcon(element.weather)}
                    alt="icon"
                  />
                  <div className="row justify-content-center">
                    {element.temp2m}°C
                  </div>
                </div>
              );
              let tab2 = (
                <div
                  key={index + "temp"}
                  className="fs-6 col border user-select-none bg-info opacity-25"
                >
                  <div className="row justify-content-center text-info">.</div>{" "}
                  <img
                    className="w-50 "
                    src={createIcon(element.weather)}
                    alt="icon"
                  />
                  <div className="row justify-content-center text-info">.</div>
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
  useEffect(() => {
    getWeatherData();
  }, [coordinates]);
  useEffect(() => {
    getWeatherData();
  }, []);
  useEffect(() => {
    createWeather();
  }, [structuredData]);
  return (
    <main className="container-fluid flex-column bg-light justify-content-center">
      <section className="row justify-content-center"></section>
      <section className="row">
        <div className="col-6">
          <div className="row justify-content-center">{weather}</div>
        </div>
        <div className="col-6">
          <div className="row">
            <div className="row justify-content-center bg-info m-0">
              <Map coordinates={coordinates} setCoordinates={setCoordinates} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
//TO DO
/*
Link map to forecast data
*/
