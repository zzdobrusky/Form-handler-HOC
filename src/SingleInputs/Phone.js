import React from "react";
import PropTypes from "prop-types";

import InputAdder from "../Wrappers/InputAdder";

import { TextField } from "@material-ui/core";

const numericOnlyRegex = /^[0-9]*$/;

export default class Phone extends React.Component {
  static propTypes = {
    inputName: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    disabled: PropTypes.bool
  };

  getError = (value) => {
    if (!numericOnlyRegex.test(value)) {
      return "Enter only numbers";
    } else if (value.length !== 10) {
      return "Phone must be 10 digits";
    }
    return "";
  };

  render() {
    const { required, disabled, inputName, label } = this.props;

    return (
      <InputAdder
        inputName={inputName}
        label={label}
        required={required}
        getError={this.getError}
        /* magic word for render props */
        render={({ customLabel, value, error, onChange }) => (
          <TextField
            label={customLabel}
            value={value}
            error={Boolean(error)}
            helperText={error}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          />
        )}
      />
    );
  }
}
