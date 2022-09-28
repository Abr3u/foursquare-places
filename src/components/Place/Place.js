import * as React from "react";
import PropTypes from "prop-types";

// mui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// next
import Image from "next/image";

const Place = ({ name, photo }) => {
  return (
    <>
      <Image
        alt={name}
        src={photo}
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
          {name}
        </Typography>
      </Box>
    </>
  );
};

Place.propTypes = {
  name: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
};

export default Place;
