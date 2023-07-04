// App.js
import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import "./App.css";
import Routes from "./Routes";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import { useNavigate, useLocation } from "react-router-dom";
import { onError } from "./libs/errorLib";
import config from "./config";
import ErrorBoundary from "./components/ErrorBoundary";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [isHomeLanderPage, setIsHomeLanderPage] = useState(true); // Track the current page

  useEffect(() => {
    onLoad();
    loadFacebookSDK();
    setIsHomeLanderPage(location.pathname === "/"); // Update the page state
  }, [location]);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    navigate("/login");
  }

  function loadFacebookSDK() {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: config.social.FB,
        autoLogAppEvents: true,
        xfbml: true,
        version: "v3.1",
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }

  function isActiveRoute(route) {
    return location.pathname === route;
  }

  const showFooter = location.pathname === "/";

  return (
    !isAuthenticating && (
      <div className="App container py-3">
        <Navbar
          collapseOnSelect
          bg="transparent"
          expand="md"
          className="mb-3 navbar-curved"
        >
          <LinkContainer to="/">
            <Navbar.Brand className="font-weight-bold text-light">
              Scratch
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={location.pathname}>
              {isAuthenticated ? (
                <>
                  <LinkContainer to="/settings">
                    <Nav.Link
                      className={
                        isActiveRoute("/settings") ? "text-dark" : "text-light"
                      }
                    >
                      Settings
                    </Nav.Link>
                  </LinkContainer>
                  <Nav.Link className="text-light" onClick={handleLogout}>
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link
                      className={
                        isActiveRoute("/signup") ? "text-dark" : "text-light"
                      }
                    >
                      Signup
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link
                      className={
                        isActiveRoute("/login") ? "text-dark" : "text-light"
                      }
                    >
                      Login
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <ErrorBoundary>
          <AppContext.Provider
            value={{ isAuthenticated, userHasAuthenticated }}
          >
            <Routes />
          </AppContext.Provider>
        </ErrorBoundary>
        {showFooter && isHomeLanderPage && (
          <footer className="footer">
            <Navbar
              bg="transparent"
              expand="md"
              className="navbar-curved justify-content-center"
            >
              <Nav>
                <Nav.Link href="https://instagram.com/___pradhanji___?igshid=NGExMmI2YTkyZg==">
                  <FaInstagram size={24} />
                </Nav.Link>
                <Nav.Link href="https://www.linkedin.com/in/bhabesh-pradhan-843008241">
                  <FaLinkedin size={24} />
                </Nav.Link>
                <Nav.Link href="https://www.facebook.com/profile.php?id=100093999346351&mibextid=ZbWKwL">
                  <FaFacebook size={24} />
                </Nav.Link>
              </Nav>
            </Navbar>
          </footer>
        )}
      </div>
    )
  );
}

export default App;
