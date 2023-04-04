import React from "react";
import PropTypes from "prop-types";

import InputAdder from "../Wrappers/InputAdder";

import { Checkbox, FormControlLabel } from "@material-ui/core";

export default class UtahResidency extends React.Component {
  static propTypes = {
    inputName: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool
  };

  render() {
    const { disabled, inputName, label } = this.props;

    return (
      <InputAdder
        inputName={inputName}
        label={label}
        /* magic word for render props */
        render={({ value, onChange }) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={value || false}
                onChange={(e) => onChange(e.target.checked)}
                color="primary"
              />
            }
            label={label}
            disabled={disabled}
          />
        )}
      />
    );
  }
}
