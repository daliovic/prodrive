import { Switch } from "react-router-dom";
import { TestPage, LoginPage, ResultatPage } from "./pages";
import "primeflex/primeflex.css";
import Correction from "./pages/Correction";
import PrivateRoute from "./guards/PrivateRoute";
import TermsOfUse from "./pages/TermsOfUse";
import IntroductionPage from "./pages/IntroductionPage";

const Router = () => {
  return (
    <>
      <Switch>
        <PrivateRoute loginPage={true} exact path="/" component={LoginPage} />
        <PrivateRoute
          loginPage={true}
          exact
          path="/terms"
          component={TermsOfUse}
        />
        <PrivateRoute
          loginPage={false}
          exact
          path="/test"
          component={TestPage}
        />
        <PrivateRoute
          loginPage={false}
          exact
          path="/correction"
          component={Correction}
        />
        <PrivateRoute
          loginPage={false}
          exact
          path="/resultat"
          component={ResultatPage}
        />
        <PrivateRoute
          loginPage={false}
          exact
          path="/introduction"
          component={IntroductionPage}
        />
      </Switch>
    </>
  );
};

export default Router;
