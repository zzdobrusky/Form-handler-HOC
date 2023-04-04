import React from "react";
import PropTypes from "prop-types";
import { isObjEmpty, mergeObjectsFromTo } from "../utils/tools";
import { isEqual } from "lodash";

const FormContext = React.createContext(null);
export { FormContext };

export default class FormHandler extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    extErrors: PropTypes.object,
    extValues: PropTypes.object,
    label: PropTypes.string
  };

  state = {
    // all key names are the input names and correspond to the value ones
    values: {},
    errors: {},
    requirements: {},

    validate: "Have not validated Form handler yet" // for testing only
  };

  validate = () => {
    const { values, errors, requirements } = this.state;
    // errors order 1. internal errors 2. requirement errors
    Object.entries(values).forEach(([key, value]) => {
      if (!errors[key] && requirements[key]) {
        if (value.trim() === "") {
          errors[key] = "Field is required.";
        }
      }
    });
    this.setState({ errors });
    return isObjEmpty(errors);
  };

  addInput = (inputName, required) => {
    // update state asynchronously
    this.setState(({ values, errors, requirements }) => ({
      values: { ...values, [inputName]: "" },
      errors: { ...errors, [inputName]: "" },
      requirements: { ...requirements, [inputName]: required }
    }));
  };

  removeInput = (inputName) => {
    // update state asynchronously
    this.setState(({ values, errors, requirements }) => {
      // delete object property
      delete values[inputName];
      delete errors[inputName];
      delete requirements[inputName];
      return {
        values,
        errors,
        requirements
      };
    });
  };

  onChange = (inputName, value) => {
    const { onChange } = this.props;
    this.setState(
      ({ values }) => ({
        values: { ...values, [inputName]: value }
      }),
      () => {
        // pass to parent if exists
        onChange && onChange(inputName, value, this.state.values);
      }
    );
  };

  onError = (inputName, error) => {
    this.setState(({ errors }) => ({
      errors: { ...errors, [inputName]: error }
    }));
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { values } = this.state;
    const { onSubmit } = this.props;
    // validate requirements first
    if (this.validate()) {
      this.setState({ validate: "Form handler successfully validated" }); // for testing only
      onSubmit && onSubmit(values);
    }
  };

  componentDidUpdate(prevProps) {
    const { extValues } = this.props;
    if (!isEqual(extValues, prevProps.extValues)) {
      this.setState(({ values }) => ({
        values: mergeObjectsFromTo(extValues, values)
      }));
    }
  }

  // for now enter key is disabled and submit is done by clicking submit btn only
  render() {
    const { children, extErrors, className, label } = this.props;
    const { values, errors, requirements, validate } = this.state;

    return (
      <form onSubmit={(e) => this.onSubmit(e)} className={className}>
        <div style={{ fontWeight: "bold", fontFamily: "sans-serif" }}>
          {label}
        </div>
        <FormContext.Provider
          // these props are shared with the context
          value={{
            values,
            errors,
            extErrors,
            onError: this.onError,
            addInput: this.addInput,
            removeInput: this.removeInput,
            onChange: this.onChange
          }}
        >
          {children}
        </FormContext.Provider>

        <div>Values: {JSON.stringify(values)}</div>
        <div>Errors: {JSON.stringify(errors)}</div>
        <div>Requirements: {JSON.stringify(requirements)}</div>
        <div>validate: {validate}</div>
      </form>
    );
  }
}
