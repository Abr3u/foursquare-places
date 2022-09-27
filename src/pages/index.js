import * as React from "react";

// mui
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Button, Grid, Stack } from "@mui/material";

import MOCK_DATA from "../../tests/mocks/foursquare-places-search-response.json";
import Image from "next/image";

const MOCK_IMAGE_SRC =
  "https://strapi-cdn.integration.creoate-tech.com/thumbnail_valid_top_menu_banner_1_desktop_56e6fbc922.png";

const MOCK_USER_LOCATION = "51.523,-0.1963";

export default function Index() {
  return (
    <Container
      maxWidth="sm"
      sx={{ border: "1px solid red", borderRadius: "30px" }}
    >
      <Stack direction="column">
        <Typography
          sx={{
            border: "1px solid green",
            borderRadius: "30px",
            textAlign: "center",
          }}
        >
          Foursquare in your location ({MOCK_USER_LOCATION})
        </Typography>
        <Button>Search Location</Button>
        <Grid container alignItems="center" justifyContent="center">
          {MOCK_DATA.results.map((place) => (
            <Grid
              item
              key={`place-id-${place.fsq_id}`}
              id={place.id}
              xs={12}
              md={6}
            >
              <Box sx={{ border: "1px solid green", borderRadius: "30px" }}>
                <Image
                  alt={place.name}
                  src={MOCK_IMAGE_SRC}
                  width="100%"
                  height="100%"
                  layout="responsive"
                  objectFit="contain"
                />
                <Typography
                  sx={{
                    border: "1px solid blue",
                    borderRadius: "30px",
                    textAlign: "center",
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
