import React from "react";
import PropTypes from "prop-types";

import { FormContext } from "../Wrappers/FormHandler";

export default class extends React.Component {
  static contextType = FormContext;

  static propTypes = {
    inputName: PropTypes.string.isRequired,
    render: PropTypes.func.isRequired,
    label: PropTypes.string,
    required: PropTypes.bool,
    getError: PropTypes.func
  };

  onChange = (value) => {
    const { inputName, getError } = this.props;
    const { onChange, onError } = this.context;
    let error = "";
    // test only if not empty and if function exists
    if (value && getError) {
      error = getError(value);
    }
    onError(inputName, error); // this will reset any previous error
    onChange(inputName, value); // always send to parent even if its an error
  };

  componentDidMount() {
    const { inputName, required } = this.props;
    const { addInput } = this.context;
    addInput(inputName, required);
  }

  componentWillUnmount() {
    const { inputName } = this.props;
    const { removeInput } = this.context;
    removeInput(inputName);
  }

  render() {
    const { required, inputName, label, render } = this.props;
    const { values, errors, extErrors } = this.context;
    const customLabel = `${label}${required ? " *" : ""}`;
    const error = errors[inputName] || extErrors[inputName] || "";
    const value = values[inputName] || "";

    return render({ customLabel, value, error, onChange: this.onChange });
  }
}
