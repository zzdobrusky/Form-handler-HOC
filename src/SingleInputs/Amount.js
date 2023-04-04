import React from "react";
import PropTypes from "prop-types";

import InputAdder from "../Wrappers/InputAdder";

import { TextField } from "@material-ui/core";

import CurrencyInput from "react-currency-input-field";

export default class Amount extends React.Component {
  static propTypes = {
    inputName: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    disabled: PropTypes.bool
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
          <CurrencyInput
            label={customLabel}
            value={value}
            customInput={TextField}
            prefix="$"
            thousandSeparator={true}
            decimalsLimit={2}
            type="text"
            error={Boolean(error)}
            helperText={error}
            onValueChange={(value) => onChange(value)}
            disabled={disabled}
          />
        )}
      />
    );
  }
}
