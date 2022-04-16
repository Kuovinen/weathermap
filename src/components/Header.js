export default function Header() {
  console.log("Rendered HEADER");
  return (
    <header className="container-fluid bg-info fs-1 text link-light">
      WEATHER
      <div className="fs-4">
        using 7timer weather API, Geonames.org webservices-API and GoogleMaps
        API
      </div>
    </header>
  );
}
