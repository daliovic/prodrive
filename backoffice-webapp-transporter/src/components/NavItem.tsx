import React, { FC } from "react";
import "./NavItem.css";
import { SvgIconComponent } from "@material-ui/icons";
import { NavLink } from "react-router-dom";

interface Props {
  icon: React.ReactElement<SvgIconComponent>;
  isActiveNavItem?: boolean | undefined;
  to: string;
}
const NavItem: FC<Props> = ({ icon, isActiveNavItem, to }) => {
  return (
    <li
      className={`sidebar-navitem ${
        isActiveNavItem ? "active-item" : "inactive-item"
      }`}
    >
      <NavLink
        className={`${isActiveNavItem ? "active-link" : "inactive-link"}`}
        to={to}
      >
        {icon}
      </NavLink>
    </li>
  );
};

export default NavItem;
