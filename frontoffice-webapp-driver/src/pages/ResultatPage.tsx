import React, {FC} from "react";
import {TopBar} from "../components/TopBar";
import successBanner from "../assets/success-banner.svg";
import failBanner from "../assets/fail-banner.svg";
import "./ResultatPage.css";
import ResultCard from "../components/ResultCard";
import {useHistory} from "react-router";

interface Props {
}

const Resultat: FC<Props> = () => {
    const history = useHistory();
    const state = history.location.state as { result: number };
    return (
        <>
            <TopBar title="Resultat"/>
            <br/>

            <div className="result-container">
                {state.result === 100 ? (
                    <>
                        <img className="result-banner" src={successBanner} alt=""/>
                        <ResultCard successPourcentage={state.result}/>
                    </>
                ) : (
                    <>
                        <img className="result-banner" src={failBanner} alt=""/>
                        <ResultCard successPourcentage={state.result as number}/>
                    </>
                )}
            </div>

        </>
    );
};

export default Resultat;
