//takes initial time value and returns next time slot
export function assignInitTimeSlot(initial) {
  let result;
  switch (initial) {
    case 2:
    case 3:
    case 4:
      result = 2;
      break;
    case 5:
    case 6:
    case 7:
      result = 5;
      break;
    case 8:
    case 9:
    case 10:
      result = 8;
      break;
    case 11:
    case 12:
    case 13:
      result = 11;
      break;
    case 14:
    case 15:
    case 16:
      result = 14;
      break;
    case 17:
    case 18:
    case 19:
      result = 17;
      break;
    case 20:
    case 21:
    case 22:
      result = 20;
      break;
    case 23:
    case 24:
    case 0:
    case "00":
    case 1:
      result = 23;
      break;
    default:
      throw new Error("assignInitTimeSlot() got an unforseen value");
  }
  return result;
}
export function assignNextTimeslot(initial) {
  let result;
  switch (initial) {
    case 2:
      result = 5;
      break;
    case 5:
      result = 8;
      break;
    case 8:
      result = 11;
      break;
    case 11:
      result = 14;
      break;
    case 14:
      result = 17;
      break;
    case 17:
      result = 20;
      break;
    case 20:
      result = 23;
      break;
    case 23:
      result = 2;
      break;
    default:
      throw new Error("assignNextTimeslot() got an unforseen value");
  }
  return result;
}
//takes an array of objects containing TIMPOINT keys and replaces their values;
//first value = time, the rest derrived from it based on "assignTimeslot()"
export function correctArrayTimeslots(array, time) {
  let arr = array.reduce((previous, current, index) => {
    //replace first elements timepoint value with json init time value
    if (index === 0) {
      current.timepoint = assignInitTimeSlot(time);
      return [...previous, current];
      //replace elements timepoint value with value based on the one before it
    } else {
      current.timepoint = assignNextTimeslot(
        previous[previous.length - 1].timepoint
      );

      return [...previous, current];
    }
  }, []);
  return arr;
}

export default function createIcon(description) {
  let address;
  switch (description) {
    case "humidday":
    case "humidnight":
    case "clearday":
    case "clearnight":
      address = "/modernUi/sun.svg";
      break;
    case "pcloudyday":
    case "pcloudynight":
    case "mcloudyday":
    case "mcloudynight":
      address = "/modernUi/overcast.svg";
      break;

    case "lightsnowday":
    case "lightsnownight":
    case "snowday":
    case "snownight":
      address = "/modernUi/snow.svg";
      break;
    case "tsday":
    case "cloudyday":
    case "cloudynight":
    case "oshowerday":
    case "oshowernight":
      address = "/modernUi/cloud.svg";
      break;
    case "lightrainnight":
    case "rainday":
    case "rainnight":
    case "lightrainday":
    case "ishowerday":
    case "ishowernight":
      address = "/modernUi/rain2.svg";
      break;
    default:
      console.log("GOT WEATHER:  " + description);
      address = "/modernUi/empty.svg";
  }
  return address;
}
//returns new padded array with added empty field according to initial timeslot
export function padArray(array, time) {
  //initial time:
  let timeSlot = assignInitTimeSlot(time);
  console.log(`got timeslot ${timeSlot}`);
  let test = [2, 5, 8, 11, 14, 17, 20, 23];
  let numberOfEmpties = test.indexOf(timeSlot);
  let empties = [];
  let emptyObject = {
    timepoint: null,
    cloudcover: null,
    lifted_index: null,
    prec_type: null,
    prec_amount: null,
    temp2m: null,
    rh2m: null,
    wind10m: null,
    weather: null,
  };
  for (let i = 0; i < numberOfEmpties; i++) {
    empties = [...empties, emptyObject];
  }
  return [...empties, ...array];
}
//convert 12 hour system to 24 -need to fix according to geolocation,
//timeAtLocation is a placeholder for that
export function convertTime(valueGotten, timeAtLocation) {
  let time = new Date();
  let newValue;

  if (time < 13) {
    newValue = valueGotten;
  } else {
    switch (valueGotten) {
      case 1:
        newValue = 13;
        break;
      case 2:
        newValue = 14;
        break;
      case 3:
        newValue = 15;
        break;
      case 4:
        newValue = 16;
        break;
      case 5:
        newValue = 17;
        break;
      case 6:
        newValue = 18;
        break;
      case 7:
        newValue = 19;
        break;
      case 8:
        newValue = 20;
        break;
      case 9:
        newValue = 21;
        break;
      case 10:
        newValue = 22;
        break;
      case 11:
        newValue = 23;
        break;
      case 0:
        newValue = 24;
        break;
      default:
        throw new Error(
          "convertTime got something other than a number between 0 and 11"
        );
    }
  }
  return newValue;
}
//returns copy of original array split into chunk sized arrays
export function arrayOfArrays(array, chunk) {
  let i;
  let temporary = [];
  for (i = 0; i < array.length; i += chunk) {
    temporary.push(array.slice(i, i + chunk));
  }
  return temporary;
}
export async function getAdminLocation(lat, lng) {
  lat = lat.toString();
  lng = lng.toString();
  let user = process.env.REACT_APP_GEONAMES;
  //web services
  //https://www.geonames.org/export/web-services.html
  const response = await fetch(
    `http://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lng}&username=${user}`
  );
  const data = await response.json();
  let location = {
    country: data.geonames[0].name,
    adminArea: data.geonames[0].countryName,
  };
  return location;
}

//TESTING DATA:
//STOCKHOLM
//https://www.7timer.info/bin/civil.php?lon=18.00&lat=59.30&ac=0&lang=en&unit=metric&output=json
//HELSINKI
//https://www.7timer.info/bin/civil.php?lon=24.938&lat=60.169&ac=0&unit=metric&output=json
//MOSCOW
//https://www.7timer.info/bin/civil.php?lon=38.110&lat=55.785&ac=0&unit=metric&output=json

//get weather data from API;
export async function getWeatherData(lat, lng) {
  const response = await fetch(
    `https://www.7timer.info/bin/civil.php?lon=${lng}&lat=${lat}&ac=0&unit=metric&output=json`
  );
  const data = await response.json();
  const stData = structureData(data);
  return stData;
}
//get timezone offset from API;
export async function getTimeZoneOffset(lat, lng) {
  lat = lat.toString().slice(0, 3);
  lng = lng.toString().slice(0, 3);
  let user = process.env.REACT_APP_GEONAMES;
  const response = await fetch(
    `http://api.geonames.org/timezoneJSON?lat=${lat}&lng=${lng}&username=${user}`
  );
  const data = await response.json();

  return data.gmtOffset;
}
//Create components from structured weather data
export function createWeather(structuredData) {
  let weatherArray = structuredData.map((element, index) => {
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
                <div className="row small fw-bold text-info">
                  {element.timepoint}:00
                </div>{" "}
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
  });
  return weatherArray;
}

//takes api data and returns an array of objects containing
//date object and forecast object of time+pemperateure objects
export function structureData(data) {
  let structuredData = [];
  console.log("Got data with date code:" + data.init);
  //let year = data.init.slice(0, 4);
  let month = data.init.slice(4, 6);
  let day = data.init.slice(6, 8);
  let time = data.init.slice(8);
  if (time === "00") {
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
  return structuredData;
}
