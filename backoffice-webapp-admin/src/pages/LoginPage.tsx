import "./LoginPage.css";

import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { useState } from "react";
import { useHistory } from "react-router";
import * as yup from "yup";

import loginBackgound from "../assets/login/login-background.svg";
import loginBanner from "../assets/login/login-banner.svg";
import logo from "../assets/logo-prodrive.svg";
import { AuthService } from "../service/AuthService";
import {setSavedState} from "../utils/LocalStorage.utils";
import LSVariables from "../configs/LS_variables.json";

const Login = () => {
  const [isLoadingLogin, setIsLoginLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const history = useHistory();
  const authService = new AuthService();

  const validationSchema = yup.object({
    email: yup.string().email("Please enter a valid email address").required(),
    password: yup.string().required(),
  });
  const onSubmit = async (values: any) => {
    const user: any = values;
    setIsLoginLoading(true);
    authService
      .logIn(user)
      .then((res) => {
        if (res) {
          setSavedState(res.data.data, LSVariables.saved_user);
          setIsLoginLoading(false);
          history.push("/transporters-managment");
        }
      })
      .catch((err) => {
        if (err && err.response) setError(err.response.data.message);
        setIsLoginLoading(false);
      });
  };
  const formik: any = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnBlur: true,
    onSubmit,
    validationSchema: validationSchema,
  });
  const isFormFieldValid = (name: any) =>
    !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name: any) => {
    return (
      isFormFieldValid(name) && (
        <small className="p-error">{formik.errors[name]}</small>
      )
    );
  };
  return (
    <div className="login-container">
      <img alt="" src={loginBackgound} className="login-background__img" />
      <div className="login-banner">
        <img src={loginBanner} alt="banner img" />
      </div>
      <div className="login-form__container">
        <Card className="form p-shadow-10">
          <div style={{ textAlign: "center" }}>
            <img className="login-logo" style={{}} src={logo} alt="" />
            <h3> Login</h3>
            <br />
            <br />

            <form onSubmit={formik.handleSubmit} className="p-fluid">
              <div className="p-field">
                <span className="p-float-label p-input-icon-right">
                  <i className="pi pi-envelope" />
                  <InputText
                    id="email"
                    name="email"
                    autoFocus
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid":
                        isFormFieldValid("email") ||
                        (error && error.includes("email")),
                    })}
                  />
                  <label
                    htmlFor="email"
                    className={classNames({
                      "p-error":
                        isFormFieldValid("email") ||
                        (error && error.includes("email")),
                    })}
                  >
                    Email*
                  </label>
                </span>
                {getFormErrorMessage("email")}
              </div>
              <br />
              <br />
              <div className="p-field">
                <span className="p-float-label">
                  <Password
                    feedback={false}
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    toggleMask
                    className={classNames({
                      "p-invalid":
                        isFormFieldValid("password") ||
                        (error && error.includes("password")),
                    })}
                  />
                  <label
                    htmlFor="password"
                    className={classNames({
                      "p-error":
                        isFormFieldValid("password") ||
                        (error && error.includes("password")),
                    })}
                  >
                    Password*
                  </label>
                </span>
                {getFormErrorMessage("password")}
              </div>
              <br />

              <small className="p-error">{error}</small>
              <br />
              <br />
              <Button
                iconPos="left"
                loading={isLoadingLogin}
                type="submit"
                label="Submit"
                className="p-mt-2"
              />
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default Login;
