import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Toast({
  toastSeverity,
  toastOpen,
  toastMessage,
  onClose
}) {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(toastOpen);
  }, [toastOpen]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    // sent to parent
    onClose();
  };

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
      >
        <Alert onClose={handleClose} severity={toastSeverity}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

Toast.propTypes = {
  toastSeverity: PropTypes.string.isRequired,
  toastOpen: PropTypes.bool.isRequired,
  toastMessage: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};
