import "primeflex/primeflex.css";
import { Switch } from "react-router";
import {
  ChaptersManagment,
  LoginPage,
  NotFoundPage,
  QuestionsManagment,
} from "./pages";
import TransportersManagmentTest from "./pages/TransportersManagment";
import PrivateRoute from "./guards/PrivateRoute";

function Router() {
  return (
    <>
      <Switch>
        <PrivateRoute loginPage={true} exact path="/" component={LoginPage} />
        <PrivateRoute
          loginPage={false}
          exact
          path="/transporters-managment"
          component={TransportersManagmentTest}
        />

        <PrivateRoute
          loginPage={false}
          exact
          path="/chapters-managment"
          component={ChaptersManagment}
        />
        <PrivateRoute
          loginPage={false}
          exact
          path="/questions-managment"
          component={QuestionsManagment}
        />
        <PrivateRoute loginPage={false} component={NotFoundPage} />
      </Switch>
    </>
  );
}

export default Router;
