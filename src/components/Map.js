import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import mapStyles from "./mapStyles.js";

const mapContainerStyle = {
  width: "100vw",
  height: "50vh",
  marginBottom: "1rem",
  border: "0.1rem solid white",
};
const options = { styles: mapStyles, disableDefaultUI: true };

export default function Map(props) {
  console.log("Rendered MAP");
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  if (loadError) return "Error!";
  if (!isLoaded) return "Error loading";

  return (
    <div className="row position-relative">
      <div className="row justify-content-center fw-bold bg-light m-0 position-relative bg-warning link-info p-1 ">
        WEATHER NOW AT | LAT:{props.coordinates.lat} LONG:
        {props.coordinates.lng}
        {" | "}
        {props.location.country}-{props.location.adminArea}
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
