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
        date: `${day}.${month}`, //.${year}`,
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
          //WEATHER COLUMN
          <div key={index + "card"} className="fs-6 col text-center m-3 p-0">
            {/*DATE cell*/}
            <div className="row justify-content-center fw-bold bg-info small">
              {element.date}
            </div>
            {element.forecast.map((element, index) => {
              let tab;

              let tab1 = (
                //WEATHER DATA CELL
                <div
                  key={index + "temp"}
                  className="fs-6 row border user-select-none"
                >
                  <div className="col-6">
                    {/*TIME*/}
                    <div className="row small">{element.timepoint}:00</div>{" "}
                    {/*TEMPERATURE*/}
                    <div className="row small">{element.temp2m}°C</div>
                  </div>
                  {/*ICON*/}
                  <img
                    className="col-4 weatherIcon p-0"
                    src={createIcon(element.weather)}
                    alt="icon"
                  />
                </div>
              );
              let tab2 = (
                //WEATHER DATA CELL IF TIME HAS ALREADY PASSED
                <div
                  key={index + "temp"}
                  className="fs-6 row border user-select-none bg-info opacity-25"
                >
                  <div className="col-6">
                    {/*EMPTY TIME*/}
                    <div className="row small">.</div> {/*EMPTY TEMPERATURE*/}
                    <div className="row small">.</div>
                  </div>

                  {/*EMPTY ICON*/}
                  <img
                    className="col-4 weatherIcon p-0 "
                    src={createIcon(element.weather)}
                    alt="icon"
                  />
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
    <main className="container-fluid flex-column bg-light justify-content-center p-0 m-0">
      <section className="row g-0">
        {/*The top half of the main, the map*/}
        <div className="row-auto mt-3 ">
          <div className="row g-0">
            <div className="row justify-content-center bg-info m-0 p-2">
              <Map coordinates={coordinates} setCoordinates={setCoordinates} />
            </div>
          </div>
        </div>
        {/*The bottom half of the main, the weather*/}
        <div className="row-auto p-4">
          <div className="row justify-content-center r-6">{weather}</div>
        </div>
      </section>
    </main>
  );
}
//TO DO
/*
Link map to forecast data
*/
