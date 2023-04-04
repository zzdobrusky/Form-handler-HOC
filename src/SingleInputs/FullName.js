import React from "react";
import PropTypes from "prop-types";

import InputAdder from "../Wrappers/InputAdder";

import { TextField } from "@material-ui/core";

const alphabeticOnlyRegex = /^[A-Za-z ]*$/;

export default class FullName extends React.Component {
  static propTypes = {
    inputName: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    disabled: PropTypes.bool
  };

  getError = (value) => {
    if (!alphabeticOnlyRegex.test(value)) {
      return "Enter only letters";
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
