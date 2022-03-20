import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import mapStyles from "./mapStyles.js";

const mapContainerStyle = { width: "48vw", height: "75vh" };
const options = { styles: mapStyles, disableDefaultUI: true };

export default function Map(props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  if (loadError) return "Error!";
  if (!isLoaded) return "Error loading";

  return (
    <div className="position-relative">
      <form className="row justify-content-center bg-info m-0">
        <input placeholder="Input location:" className="" />
      </form>
      <div className="row justify-content-center fw-bold bg-light m-0 position-relative bg-warning link-info p-1 ">
        WEATHER NOW AT: {props.coordinates.lat}/{props.coordinates.lng}
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={11}
        onClick={(event) => {
          props.setCoordinates({
            lat: Number(event.latLng.lat().toFixed(3)),
            lng: Number(event.latLng.lng().toFixed(3)),
          });
        }}
        center={props.coordinates}
        options={options}
      />
    </div>
  );
}
