import React, { useEffect, createContext, useReducer, useContext } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import NavbarContainer from "./components/NavbarContainer";
import HomeScreen from "./components/HomeScreen";
import ProfileScreen from "./components/ProfileScreen";
import LoginScreen from "./components/LoginScreen";
import SignUpScreen from "./components/SignUpScreen";
import CreatePost from "./components/CreatePost";
import { reducer, initialState } from "./reducers/userReducer";
import UserProfile from "./components/UserProfile";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();

  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/signin");
    }
  }, [dispatch, history]);

  return (
    <Switch>
      <Route path="/" exact>
        <HomeScreen />
      </Route>
      <Route exact path="/profile">
        <ProfileScreen />
      </Route>
      <Route path="/createpost">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/signin">
        <LoginScreen />
      </Route>
      <Route path="/signup">
        <SignUpScreen />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Router>
        <NavbarContainer />
        <Routing />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
