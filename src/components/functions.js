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
  }
  return result;
}
//takes an array of objects containing TIMPOINT keys and replaces their values;
//first value = time, the rest derrived from it based on "assignTimeslot()"
export function correctArrayTimeslots(array, time) {
  let arr = array.reduce((previous, current, index) => {
    //replace first elements timepoint value with json init time value
    if (index == 0) {
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
    case "snowday":
    case "snownight":
      address = "/modernUi/snow.svg";
      break;

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
