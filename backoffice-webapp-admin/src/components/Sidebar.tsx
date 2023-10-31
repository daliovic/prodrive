import React, { FC } from "react";
import NavItem from "./NavItem";
import "./Sidebar.css";
import BusinessIcon from "@material-ui/icons/Business";
import AssignmentIcon from "@material-ui/icons/Assignment";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";

interface Props {
  currentActive?: string;
}

const Sidebar: FC<Props> = ({ currentActive }) => {
  return (
    <div className="sidebar-container">
      <ul>
        <NavItem
          to="/transporters-managment"
          icon={<BusinessIcon />}
          isActiveNavItem={currentActive === "TransportersManagment"}
        />
        <NavItem
          to="/chapters-managment"
          isActiveNavItem={currentActive === "ChaptersManagment"}
          icon={<AssignmentIcon />}
        />
        <NavItem
          to="/questions-managment"
          isActiveNavItem={currentActive === "QuestionsManagment"}
          icon={<FormatListNumberedIcon />}
        />
      </ul>
    </div>
  );
};

export default Sidebar;
