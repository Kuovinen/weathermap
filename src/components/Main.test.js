import { render, screen } from "@testing-library/react";
import Main from "./Main";

describe("Main sections should render", () => {
  test("Map section should render", () => {
    render(<Main />);
    const divElement = screen.getByTitle(/mapContainer/i);
    expect(divElement).toBeInTheDocument();
  });
  test("Weather section should render", () => {
    render(<Main />);
    const divElement = screen.getByTitle(/weatherContainer/i);
    expect(divElement).toBeInTheDocument();
  });
});

describe("Sites are not down", () => {
  test("Geoname is reachable", async () => {
    const c = { lat: 60.169, lng: 24.938 };
    const user = "test";
    const response = await fetch(
      `https://secure.geonames.org/findNearbyPlaceNameJSON?lat=${c.lat}&lng=${c.lng}&username=${user}`
    );

    expect(response).not.toBe(undefined);
  });
  test("Chinese forecast is reachable", async () => {
    const c = { lat: 60.169, lng: 24.938 };
    const response = await fetch(
      `https://www.7timer.info/bin/civil.php?lon=${c.lng}&lat=${c.lat}&ac=0&unit=metric&output=json`
    );

    expect(response).not.toBe(undefined);
  });
});
