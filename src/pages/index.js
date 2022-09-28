import * as React from "react";

// mui
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

// next
import Image from "next/image";

export default function Index() {
  const [places, setPlaces] = React.useState([]);
  const [lat, setLat] = React.useState(0);
  const [long, setLong] = React.useState(0);

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
    fetch(`api/places?lat=${lat}&long=${long}`)
      .then((results) => results.json())
      .then((data) => {
        setPlaces(data);
      });
  }, [lat, long]);
  // TODO: loading behavior
  // TODO: truncate place's name if too big

  return (
    <Container
      // maxWidth="sm"
      sx={{
        // border: "1px solid red",
        // borderRadius: "30px",
        backgroundColor: 'black',
      }}
    >
      <Stack direction="column" spacing={3} sx={{ mt: 4 }}>
        <Typography
          variant="h4"
          sx={{
            // border: "1px solid green",
            textAlign: "center",
            color: "white",
          }}
        >
          {(lat === 0) & (long === 0)
            ? `Please allow the browser to access your location`
            : `Foursquare in your location (${lat} , ${long})`}
        </Typography>
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
              <Image
                alt={place.name}
                src={place.photo}
                width="100%"
                height="100%"
                layout="responsive"
                objectFit="fill"
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: "2px",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "left",
                    color: "white",
                    textShadow: "2px 2px #000000",
                  }}
                >
                  {place.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
