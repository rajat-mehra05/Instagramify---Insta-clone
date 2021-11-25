import React, { useContext, useEffect, useRef, useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import logo from "./logo.png";
import { UserContext } from "../App";

const NavbarContainer = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const searchModal = useRef(null);

  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);

  const renderList = () => {
    if (state) {
      return [
        <>
          <li key="search">
            {" "}
            <i
              data-target="modal1"
              className="fas fa-search search-icon modal-trigger"
            />{" "}
          </li>
          <li key="1">
            {" "}
            <Link className="nav-links" to="/createpost">
              <i className="fas fa-plus" /> Create Post
            </Link>
          </li>
       
          <li key="2">
            {" "}
            <Link className="nav-links" to="/profile">
              <i className="fas fa-user" /> My Profile
            </Link>{" "}
          </li>
          <li key="3">
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                history.push("/signin");
              }}
            >
              Logout
            </button>
          </li>
        </>,
      ];
    } else {
      return [
        <>
          <li key="4">
            {" "}
            <Link className="nav-links" to="/signin">
              Login
            </Link>{" "}
          </li>
          ,
          <li key="5">
            {" "}
            <Link className="nav-links" to="/signup">
              Sign Up
            </Link>{" "}
          </li>
        </>,
      ];
    }
  };

  const fetchUsers = (query) => {
    setSearch(query);
    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        setUserDetails(results.user);
      });
  };

  return (
    <>
      <Navbar className="navbar" expand="lg">
        <Link to={state ? "/" : "/signin"}>
          <img src={logo} alt="Instagramify" height="100px" width="250px" />
        </Link>
        <Navbar.Toggle className="nav-toggle" aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="ml-auto mr-4 my-2"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            {renderList()}
          </Nav>
        </Navbar.Collapse>
        <div
          id="modal1"
          class="modal bottom-sheet"
          ref={searchModal}
          style={{ color: "black" }}
        >
          <div className="modal-content">
            <input
              type="text"
              placeholder="search users"
              value={search}
              onChange={(e) => fetchUsers(e.target.value)}
            />
            <ul className="collection">
              {userDetails.map((item) => {
                return (
                  <Link
                    to={
                      item._id !== state._id
                        ? "/profile/" + item._id
                        : "/profile"
                    }
                    onClick={() => {
                      M.Modal.getInstance(searchModal.current).close();
                      setSearch("");
                    }}
                  >
                    <li className="collection-item">{item.email}</li>
                  </Link>
                );
              })}
            </ul>
            <div className="modal-footer">
              <button
                className="modal-close close-btn"
                onClick={() => setSearch("")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Navbar>
    </>
  );
};

export default NavbarContainer;
