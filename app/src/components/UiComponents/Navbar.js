import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { useAuth } from "../auth-provider";

const NavBar = ({ setIsOpen, isOpen }) => {

  const { logout } = useAuth()

  return (
    <Navbar
      className="navbar shadow-sm p-3 mb-3 bg-white"
      expand
      sticky="top"
      style={{ width: "100%" }}
    >
      {!isOpen && (
        <BsFillArrowRightCircleFill onClick={() => setIsOpen(!isOpen)} />
      )}
      {isOpen && (
        <BsFillArrowLeftCircleFill onClick={() => setIsOpen(!isOpen)} />
      )}

      <Nav className="justify-content-start flex-grow-1 pe-3">
        <Nav.Link href="#action2">
          <div> TeamUp</div>
        </Nav.Link>
      </Nav>

      <Nav className="justify-content-end flex-grow-1 pe-3" onClick={() => logout()}>
        <Nav.Link href="/login">
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginLeft: 4 }}>logout</span>
          </div>
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default NavBar;
