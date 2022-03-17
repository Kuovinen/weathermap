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
    case "clearday":
    case "clearnight":
      address = "/modernUi/sun.svg";
      break;
    case "pcloudyday":
    case "pcloudynight":
      address = "/modernUi/overcast.svg";
      break;
    case "snowday":
    case "snownight":
      address = "/modernUi/snow.svg";
      break;
    case "mcloudyday":
    case "mcloudynight":
    case "cloudyday":
    case "cloudynight":
    case "oshowerday":
    case "oshowernight":
    case "ishowerday":
    case "ishowernight":
      address = "/modernUi/cloud.svg";
      break;
    case "lightrainnight":
    case "rainday":
    case "rainnight":
    case "lightrainday":
      address = "/modernUi/rain2.svg";
      break;
    default:
      address = "/modernUi/snowflake.svg";
  }
  return address;
}
