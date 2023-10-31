import {FC} from "react";
import Logo from "../assets/logo-prodrive.svg";
import "./TopBar.css";
import ExitToApp from "@material-ui/icons/ExitToApp";
import {useHistory} from "react-router";
import {AuthService} from "../services/AuthService";
import {useCookies} from "react-cookie";

interface Props {
    title: string;
}

export const TopBar: FC<Props> = ({title}) => {
    const history = useHistory();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const authService = new AuthService();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [cookies, setCookie, removeCookie] = useCookies(["Authorization"]);
    const onClickLogout = () => {
        authService
            .logOut()
            .then((data) => {
                localStorage.clear();
                history.push("/");
            })
            .catch((err) => {
                console.log(err);
                localStorage.clear();
                removeCookie("Authorization");
                history.push("/");
            });
    };
    return (
        <div className="topbar">
            <img src={Logo} alt=""/>
            <h2 className="topbar-title">{title}</h2>
            <div onClick={() => onClickLogout()} className="icon">
                <ExitToApp className="logout__icon"/>
            </div>
        </div>
    );
};
