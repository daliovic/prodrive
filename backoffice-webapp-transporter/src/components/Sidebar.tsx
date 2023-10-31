import './Sidebar.css';

import { FC } from 'react';
import BusinessIcon from '@material-ui/icons/Business';
import NavItem from './NavItem';

interface Props {
  currentActive?: string;
}

const Sidebar: FC<Props> = ({ currentActive }) => {
  return (
    <div className="sidebar-container">
      <ul>
        <NavItem
          to="/drivers-managment"
          icon={<BusinessIcon />}
          isActiveNavItem={currentActive === "DriversManagment"}
        />
      </ul>
    </div>
  );
};

export default Sidebar;
