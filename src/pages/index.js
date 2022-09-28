import * as React from "react";

// mui
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";

// components
import Place from "../components/Place";
import Header from "../components/Header";

// IMPROV: loading behavior
// IMPROV: truncate place's name if too big
// TODO: snapshot testing
export default function Index() {
  const [lat, setLat] = React.useState(0);
  const [long, setLong] = React.useState(0);
  const [places, setPlaces] = React.useState([]);
  const [headerText, setHeaderText] = React.useState("");

  const getMyLocation = () => {
    const location = window.navigator && window.navigator.geolocation;

    if (location) {
      location.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        },
        (error) => {
          // IMPROV: log this error according to the team's guidelines so our monitoring tool can pick it up and alert if needed
          setLat(0);
          setLong(0);
        }
      );
    }
  };

  React.useEffect(() => {
    getMyLocation();
  }, []);

  React.useEffect(() => {
    if (lat === 0 && long === 0) {
      setHeaderText("Please allow the browser to access your location");
    } else {
      setHeaderText(`Foursquare in your location (${lat} , ${long})`);
    }

    fetch(`api/places?lat=${lat}&long=${long}`)
      .then((results) => results.json())
      .then((data) => {
        setPlaces(data);
      });
  }, [lat, long]);

  return (
    <Container
      sx={{
        backgroundColor: "black",
      }}
    >
      <Stack direction="column" spacing={3}>
        <Header text={headerText} sx={{ mt: 3 }}></Header>
        <Grid container alignItems="center" justifyContent="center">
          {places.map((place) => (
            <Grid
              item
              key={`place-id-${place.fsq_id}`}
              id={place.fsq_id}
              xs={12}
              md={6}
              sx={{
                position: "relative",
                border: "1px solid grey",
              }}
            >
              <Place name={place.name} photo={place.photo}></Place>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
