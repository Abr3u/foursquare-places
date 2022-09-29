import * as React from "react";
import PropTypes from "prop-types";

// mui
import Typography from "@mui/material/Typography";

const Header = ({ sx, text }) => {
  return (
    <Typography
      variant="h4"
      sx={{
        textAlign: "center",
        ...sx,
      }}
    >
      {text}
    </Typography>
  );
};

Header.propTypes = {
  sx: PropTypes.shape({}),
  text: PropTypes.string.isRequired,
};

Header.defaultProps = {
  sx: {},
};

export default Header;
