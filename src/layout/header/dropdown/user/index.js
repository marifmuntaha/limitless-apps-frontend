import React, {useContext, useState} from "react";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { Icon, LinkList, LinkItem, UserAvatar } from "../../../../components";
import {UserContext} from "../../../../context/UserContext";
const User = () => {
  const user = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);
  const handleSignout = () => {
    localStorage.removeItem("token");
  };

  return (
    <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
      <DropdownToggle
        tag="a"
        href="#toggle"
        className="dropdown-toggle"
        onClick={(ev) => {
          ev.preventDefault();
        }}
      >
        <div className="user-toggle">
          <UserAvatar icon="user-alt" className="sm" />
          <div className="user-info d-none d-md-block">
            <div className="user-status">{user.role === '1' ? 'Administrator' : 'Member'}</div>
            <div className="user-name dropdown-indicator">{user.name}</div>
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu end className="dropdown-menu-md dropdown-menu-s1">
        <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
          <div className="user-card sm">
            <div className="user-avatar">
              <span>AB</span>
            </div>
            <div className="user-info">
              <span className="lead-text">{user.name}</span>
              <span className="sub-text">{user.email}</span>
            </div>
          </div>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <LinkItem link="/user-profile-regular" icon="user-alt" onClick={toggle}>
              Lihat Profil
            </LinkItem>
            <LinkItem link="/user-profile-setting" icon="setting-alt" onClick={toggle}>
              Pengaturan
            </LinkItem>
          </LinkList>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <a href={`${process.env.PUBLIC_URL}/masuk`} onClick={handleSignout}>
              <Icon name="signout"></Icon>
              <span>Keluar</span>
            </a>
          </LinkList>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default User;
