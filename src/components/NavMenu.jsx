import React from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar, Container } from "react-bootstrap";
import calendar2week from "./logo.svg";

function NavMenu({ isLoggedIn, onLogout }) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top classname= ">
      <Container>
        <Navbar.Brand className="d-flex">
          <img
            alt="calendar2week icon"
            src={calendar2week}
            width="30"
            height="30"
            className="d-inline-block align-center "
          />

          <h5 className="text-info ms-2">Time Share</h5>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav " />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav fill variant="tabs" className="container">
            {!isLoggedIn && (
              <Nav.Link as={Link} to="/home" className="text-light">
                Login
              </Nav.Link>
            )}

            <Nav.Link as={Link} to="/calendar" className="text-light">
              Calendar
            </Nav.Link>
            <Nav.Link as={Link} to="/search" className="text-light">
              Events
            </Nav.Link>
            {isLoggedIn && (
              <Nav.Link
                as={Link}
                to="/home"
                onClick={onLogout}
                className="text-light"
              >
                Logout
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavMenu;
