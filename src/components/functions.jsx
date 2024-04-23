export function numberToMonth(value) {
  let result;
  switch (value) {
    case "01":
      result = "January";
      break;
    case "02":
      result = "February";
      break;
    case "03":
      result = "March";
      break;
    case "04":
      result = "April";
      break;
    case "05":
      result = "May";
      break;
    case "06":
      result = "June";
      break;
    case "07":
      result = "July";
      break;
    case "08":
      result = "August";
      break;
    case "09":
      result = "September";
      break;
    case "10":
      result = "Oktober";
      break;
    case "11":
      result = "November";
      break;
    case "12":
      result = "December";
      break;
    default:
      throw new Error("got a value that can't be converted to a Month name");
  }
  return result;
}

export function handleData(temperaturesArray, timeslotArray, weather_code) {
  const formatedData = timeslotArray.map((element, index) => {
    const month = element.slice(5, 7);
    const time = element.slice(-5, -3);
    const day = element.slice(8, 10);
    const temperature = temperaturesArray[index];
    const code = weather_code[index];
    return { month, day, time, temperature, weather_code: code };
  });
  return formatedData;
}

export function sortByDay(dataArray) {
  let day = dataArray[0].day;
  let temp = [];
  const sortedByDay = [];
  //check if elements day corresponds to currently targeted one, if so
  //add it to the temp array, if not, add the finished array to the main one
  //make a new temp one and update the current day variable
  dataArray.forEach((element) => {
    if (element.day === day) {
      temp.push(element);
    } else {
      day = element.day;
      sortedByDay.push(temp);
      temp = [];
    }
  });
  return sortedByDay;
}

export function convertCodeToImg(code) {
  let address;
  switch (code) {
    case 0:
      address = "/modernUi/sun.svg";
      break;

    case 1:
    case 2:
      address = "/modernUi/overcast.svg";
      break;

    case 3:
      address = "/modernUi/cloud.svg";
      break;

    case 45:
    case 48:
      address = "/modernUi/fog.svg";
      break;

    case 51:
    case 61:
    case 53:
    case 63:
    case 56:
    case 66:
    case 80:
    case 81:
      address = "/modernUi/rain.svg";
      break;

    case 55:
    case 65:
    case 57:
    case 67:
    case 82:
      address = "/modernUi/rain2.svg";
      break;

    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      address = "/modernUi/snow.svg";
      break;

    case 95:
    case 96:
    case 99:
      address = "/modernUi/lightning.svg";
      break;

    default:
      address = "/modernUi/empty.svg";
  }
  return address;
}

//Create components from structured weather data

export function createWeather(structuredData) {
  const weatherArray = structuredData.map((timeStampDataArray, index) => {
    const arrayOfJSXElements = timeStampDataArray.map((timestamp) => {
      return (
        //WEATHER COLUMN
        <div key={crypto.randomUUID()}>
          {/*WEATHER DATA CELL*/}
          <div className="fs-6 row border user-select-none">
            <div className="col-6">
              {/*TIME*/}
              <div className="row small fw-bold text-info">
                {timestamp.time}:00
              </div>{" "}
              {/*TEMPERATURE*/}
              <div className="row small">{timestamp.temperature}°C</div>
            </div>
            {/*ICON*/}
            <img
              className="col-4 weatherIcon p-0"
              style={{ minWidth: "2rem" }}
              src={convertCodeToImg(timestamp.weather_code)}
              alt="icon"
            />
          </div>
        </div>
      );
    });
    const finalStructure = (
      <div key={crypto.randomUUID()} className="fs-6 col text-center m-3 p-0">
        {" "}
        {/*DATE cell*/}
        <div className="row justify-content-center fw-bold text-dark bg-info small">
          {timeStampDataArray[0].day + "." + timeStampDataArray[0].month}
        </div>
        {arrayOfJSXElements}
      </div>
    );
    return finalStructure;
  });
  return weatherArray;
}

export async function getAdminLocation(lat, lng) {
  const latitude = lat.toString();
  const longitude = lng.toString();
  const user = process.env.REACT_APP_GEONAMES;
  //web services
  //https://www.geonames.org/export/web-services.html
  const response = await fetch(
    `https://secure.geonames.org/findNearbyPlaceNameJSON?lat=${latitude}&lng=${longitude}&username=${user}`
  );
  const data = await response.json();
  const location = {
    country: data.geonames[0].name,
    adminArea: data.geonames[0].countryName,
  };
  return location;
}
