import React from "react";
import { isObjEmpty } from "./utils/tools";

import { Button } from "@material-ui/core";

import Toast from "./utils/Toast";

import FormHandler from "./Wrappers/FormHandler"; // wraps with form and provides context
import FullName from "./SingleInputs/FullName";
import Phone from "./SingleInputs/Phone";
import UtahResidency from "./SingleInputs/UtahResidency";
import Amount from "./SingleInputs/Amount";

import { callApi } from "./utils/fakeApi";
import { firstKey } from "./utils/tools";

import styles from "./App.module.css";

const mapApiErrorToFormError = (apiError) => {
  // this would not be necessary if api's Fields were matching input names
  switch (apiError.Field) {
    case "input1":
      return { fullName: apiError.Message };
    default:
      return null;
  }
};

export default class App extends React.Component {
  state = {
    apiMessage: "Did not run yet",
    extErrors: {},
    extValues: {},
    toastOpen: false,
    toastSeverity: "",
    toastMessage: ""
  };

  onSubmitHandle = (values) => {
    if (this.validateInputs(values)) {
      callApi(values)
        .then((response) =>
          this.setState({
            apiMessage: response,
            toastOpen: true,
            toastSeverity: "success",
            toastMessage: "API call success"
          })
        )
        .catch((apiErrors) => {
          // converting api errors to inline errors
          const extErrors = {};
          apiErrors.forEach((apiError) => {
            const extError = mapApiErrorToFormError(apiError);
            if (extError) {
              const errorKey = firstKey(extError);
              extErrors[errorKey] = extError[errorKey];
            }
          });
          this.setState({
            apiMessage: JSON.stringify(apiErrors),
            extErrors
          });
        });
    }
  };

  validateInputs = (values) => {
    // This is for any error logic between the single inputs.
    // It runs only onSubmit but can be changed to run onChange
    const utahResidencyError = "Not out of Utah phone number allowed.";
    const atLeastOneError = "Enter at least one phone number";

    const updatedExtErrors = {}; // always start with clearing extErrors
    if (values.utahResidency) {
      if (values.homePhone && values.homePhone.substring(0, 3) !== "801") {
        updatedExtErrors.homePhone = utahResidencyError;
      }

      if (values.cellPhone && values.cellPhone.substring(0, 3) !== "801") {
        updatedExtErrors.cellPhone = utahResidencyError;
      }
    }

    if (values.homePhone === "" && values.cellPhone === "") {
      updatedExtErrors.homePhone = atLeastOneError;
      updatedExtErrors.cellPhone = atLeastOneError;
    }
    this.setState({ extErrors: updatedExtErrors });
    return isObjEmpty(updatedExtErrors);
  };

  onChange = (inputName, value, values) => {
    // This is for any logic between the single inputs.
    // always clear all external errors and external values first
    this.setState({ extErrors: {}, extValues: {} });
    // Nonsense logic - for testing only: when user turns Utah
    // residency on alwyas clear the amount value
    if (inputName === "utahResidency" && value) {
      this.setState(({ extValues }) => ({
        extValues: { ...extValues, amount: "" }
      }));
    }
  };

  render() {
    const {
      apiMessage,
      extErrors,
      extValues,
      toastOpen,
      toastSeverity,
      toastMessage
    } = this.state;

    return (
      <>
        <FormHandler
          label="Form Handler"
          className={styles.wrapper}
          onSubmit={this.onSubmitHandle}
          onChange={this.onChange}
          extErrors={extErrors}
          extValues={extValues}
        >
          <div>
            <FullName inputName="fullName" label="Full Name" required />
          </div>
          <div>
            <Amount inputName="amount" label="Amount" required />
          </div>
          <div>
            <UtahResidency inputName="utahResidency" label="Utah Residency" />
          </div>
          <div>
            <Phone inputName="homePhone" label="Home Phone" />
          </div>
          <div>
            <Phone inputName="cellPhone" label="Cell Phone" />
          </div>
          <div>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </div>
        </FormHandler>
        <br />
        <div>External errors: {JSON.stringify(extErrors)}</div>
        <br />
        <div>External values: {JSON.stringify(extValues)}</div>
        <br />
        <div>Api response: {apiMessage}</div>

        <Toast
          toastOpen={toastOpen}
          toastSeverity={toastSeverity}
          toastMessage={toastMessage}
          onClose={() => this.setState({ toastOpen: false })}
        />
      </>
    );
  }
}
