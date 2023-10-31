import React from 'react';
import {Route, Redirect, RouteProps} from "react-router-dom";
import {AuthService} from "../service/AuthService";

interface PrivateRouteProps extends RouteProps {
    component: any;
    loginPage: boolean
}

const PrivateRoute = (props: PrivateRouteProps) => {
    const { component: Component, loginPage, ...rest } = props;
    const authService = new AuthService();
    const USER = authService.getUser()

    return (
        <Route
            {...rest}
            render={(routeProps) =>
                loginPage ?(
                    !USER ? (
                        <Component {...routeProps} />
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/drivers-managment',
                                state: { from: routeProps.location }
                            }}
                        />
                    )
                ) : (
                    USER ? (
                        <Component {...routeProps} />
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/',
                                state: { from: routeProps.location }
                            }}
                        />
                    )
                )
            }
        />
    );
};

export default PrivateRoute;