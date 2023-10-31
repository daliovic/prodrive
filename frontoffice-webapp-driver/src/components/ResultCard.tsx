import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React, { FC } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "./ResultCard.css";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbarStyles } from "react-circular-progressbar/dist/types";
import { useHistory } from "react-router";

interface Props {
  successPourcentage: number;
}
const ResultCard: FC<Props> = ({ successPourcentage }) => {
  const history = useHistory();
  const failMessage = "Ressayer !";
  const failComment = "Vous avez echoué votre test !";
  const successMessage = "Bien Fait !";
  const successComment = " Vous avez reussi votre test!";
  const failStyleChart: CircularProgressbarStyles = {
    root: {},
    path: {
      stroke: "#FF3343",
    },
    trail: {
      stroke: "#E5E5E5",
    },
    text: {
      fill: "#B3B3B3",
      fontWeight: "bold",
    },
    background: {
      fill: "#3e98c7",
    },
  };
  const successStyleChart: CircularProgressbarStyles = {
    root: {},
    path: {
      stroke: "#4EB745",
    },
    trail: {
      stroke: "#E5E5E5",
    },
    text: {
      fill: "#B3B3B3",
      fontWeight: "bold",
    },
    background: {
      fill: "#3e98c7",
    },
  };

  return (
    <Card className="result__card">
      <div className="result__card-container">
        <div className="result-progressbar">
          <CircularProgressbar
            styles={
              successPourcentage === 100 ? successStyleChart : failStyleChart
            }
            value={successPourcentage}
            text={`${successPourcentage}%`}
          />
        </div>
        <br />
        <br />
        <h2 className="result__card-message">
          {successPourcentage === 100 ? successMessage : failMessage}{" "}
        </h2>
        <br />
        <h4 className="result__card-comment">
          {successPourcentage === 100 ? successComment : failComment}
        </h4>
        <br />
        <br />
        <br />
        <Button
          onClick={() => {
            history.push("correction");
          }}
          className="result__card-button"
          label={successPourcentage === 100 ? "Terminer" : "Résseyer"}
        />
      </div>
    </Card>
  );
};

export default ResultCard;
