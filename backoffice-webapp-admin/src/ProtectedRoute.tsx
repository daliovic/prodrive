export {};
// import React, { Component, FC } from "react";
// import { RouteComponentProps, StaticContext } from "react-router";
// import { Route, Redirect } from "react-router-dom";
// import auth from "./auth";

// interface Props {
//   component?:
//     | React.ComponentType<any>
//     | React.ComponentType<RouteComponentProps<any, StaticContext, unknown>>
//     | undefined;
//   [x: string]: any;
// }

// export const ProtectedRoute: FC<Props> = ({ component, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       render={(props) => {
// if (auth.isAuthenticated()) {
//   return <Component {...props} />;
// } else {
//   return (
//     <Redirect
//       to={{
//         pathname: "/",
//         state: {
//           from: props.location,
//         },
//       }}
//     />
//   );
// }
//       }}
//     />
//   );
// };
