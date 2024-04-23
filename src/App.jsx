import React from "react";
//import "./App.css";
import Header from "./components/Header";
import Map from "./components/Map";
import {
  handleData,
  sortByDay,
  createWeather,
  getAdminLocation,
} from "./components/functions";

function App() {
  const [coordinates, setCoordinates] = React.useState({
    lat: 60.169,
    lng: 24.938,
  });
  // weather repot JSX elements:
  const [weatherElements, setWeatherElements] = React.useState(<div></div>);

  React.useEffect(() => {
    //MAIN establishing function for the weather report
    async function createWeatherReport() {
      const responce = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lng}&hourly=temperature_2m,weather_code&timezone=auto`
      );
      const data = await responce.json();
      //Ask Geonames where current Coordinates are located administrativly
      const location = await getAdminLocation(coordinates.lat, coordinates.lng);

      const structuredData = handleData(
        data.hourly.temperature_2m,
        data.hourly.time,
        data.hourly.weather_code
      );
      const sortedData = sortByDay(structuredData);
      const weatherElements = createWeather(sortedData);
      setWeatherElements((original) => {
        return (
          <div
            className="row justify-content-center fw-bold bg-light m-0 position-relative bg-warning link-info p-1 "
            title="locationContainer"
          >
            WEATHER NOW AT | LAT:{coordinates.lat} LONG:
            {coordinates.lng}
            {" | "}
            {location.country}-{location.adminArea}
            <div className="row-auto p-4" title="weatherContainer">
              <div className="row justify-content-center r-6">
                {weatherElements}
              </div>
            </div>
          </div>
        );
      });
    }
    createWeatherReport();
  }, [coordinates]);

  return (
    <div className="App">
      <main>
        <Header />
        <Map coordinates={coordinates} setCoordinates={setCoordinates} />
        <section>{weatherElements}</section>
      </main>
    </div>
  );
}

export default App;
