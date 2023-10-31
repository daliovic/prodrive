import { Button } from "primereact/button";
import { TopBar } from "../components/TopBar";
import { useHistory, useLocation } from "react-router";
import { Card } from "primereact/card";
import Background from "../assets/introduction.jpg";
const IntroductionPage = () => {
  const history = useHistory();
  return (
    <>
      <TopBar title="Introduction" />
      <br />
      <Card>
        <img
          style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
          src={Background}
          width={"50%"}
          alt=""
        ></img>
        <br />
        <br />
        <br />
        <p style={{ textAlign: "center" }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
          aspernatur harum ratione ducimus error natus ipsum veniam a minima
          quos perferendis voluptas sapiente, ullam velit impedit soluta
          quibusdam optio dolor.
        </p>
        <br />
        <br />
        <Button
          style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
          onClick={() => history.push("/test")}
          iconPos="left"
          type="submit"
          label="Commencer l'examen"
          className="p-mt-2"
        />
      </Card>
    </>
  );
};

export default IntroductionPage;
