import React, { useState, createContext, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";

const LoginScreen = () => {
  const history = useHistory();
  const [email, setEmail] = useState("testuser@gmail.com");
  const [password, setPassword] = useState("123456");

  const { dispatch } = useContext(UserContext);

  const PostData = () => {
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "Invalid email/password", classes: "error_Toast" });
      return;
    }
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "error_Toast" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          dispatch({
            type: "USER",
            payload: data.user,
          });
          M.toast({ html: "Login success 😄", classes: "success_Toast" });
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="auth-container">
      <div className="card">
        <span className="logo-name">Instagramify</span>
        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="authButton" onClick={() => PostData()}>
          Log in
        </button>
        <span className="authText">
          Don't have an account ?{" "}
          <Link to="/signup" className="auth-nav-link">
            Sign up
          </Link>
        </span>
      </div>
    </div>
  );
};

export default LoginScreen;
