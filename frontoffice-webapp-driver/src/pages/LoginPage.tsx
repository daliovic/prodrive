import "./LoginPage.css";

import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { classNames } from "primereact/utils";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import * as yup from "yup";

import loginBackgound from "../assets/login/login-background.svg";
import loginBanner from "../assets/login/login-banner.svg";
import logo from "../assets/logo-prodrive.svg";
import LSVariables from "../configs/LS_variables.json";
import { AuthService } from "../services/AuthService";
import { setSavedState } from "../utils/LocalStorage.utils";
import { Link } from "react-router-dom";

const Login = () => {
  function useQuery() {
    console.log(useLocation().search);
    return new URLSearchParams(useLocation().search);
  }

  const tokenParam = useQuery().get("token");
  const emailParam = useQuery().get("email");

  const [token, setToken] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoadingLogin, setIsLoginLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const history = useHistory();
  const authService = new AuthService();

  const validationSchema = yup.object({
    email: yup.string().email("Please enter a valid email address").required(),
    password: yup.string().required(),
    token: yup.string().required(),
  });

  useEffect(() => {
    if (
      tokenParam &&
      emailParam &&
      tokenParam !== "" &&
      emailParam !== "" &&
      tokenParam !== "undefined" &&
      emailParam !== "undefined" &&
      tokenParam !== null &&
      emailParam !== null
    ) {
      setToken(tokenParam);
      setEmail(emailParam);
      formik.values.token = tokenParam;
      formik.values.email = emailParam;
    } else {
      setToken("");
      setEmail("");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenParam, emailParam]);
  const onSubmit = async (values: any) => {
    const user: any = values;
    setIsLoginLoading(true);
    authService
      .logIn(user)
      .then((res: any) => {
        if (res) {
          setSavedState(res.data.data, LSVariables.saved_user);
          setIsLoginLoading(false);
          history.push("/introduction");
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
      token: "",
      accept: false,
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
                    value={email ? email.toString() : formik.values.email}
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
              <br />
              <div className="p-field">
                <span className="p-float-label">
                  <InputMask
                    mask="*****"
                    id="token"
                    name="token"
                    value={token ? token : formik.values.token}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid":
                        isFormFieldValid("token") ||
                        (error && error.includes("token")),
                    })}
                  />
                  <label
                    htmlFor="token"
                    className={classNames({
                      "p-error":
                        isFormFieldValid("token") ||
                        (error && error.includes("token")),
                    })}
                  >
                    token*
                  </label>
                </span>
                {getFormErrorMessage("token")}
              </div>
              <br />
              <div className="p-field">
                <Checkbox
                  inputId="accept"
                  name="accept"
                  checked={formik.values.accept}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldValid("accept"),
                  })}
                />
                <label
                  htmlFor="accept"
                  className={classNames({
                    "p-error": isFormFieldValid("accept"),
                  })}
                >
                  I agree to the <Link to="/terms"> terms and conditions*</Link>
                </label>
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
