import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Project from "./pages/Project/Project";
import CustomNavbar from "./components/Navbar/Navbar";
import User from "./pages/User/User";
import ProtectedRoute from "./utils/ProtectedRoute";
import checkUserIsLoggedIn from "./utils/auth";
import AccessDenied from "./pages/AccessDenied/accessDenied";
import Logout from "./pages/Logout/Logout";

function App() {
  // const [loggedIn, setLoggedIn] = useState({});
  // useEffect(() => {
  //   setLoggedIn(checkUserIsLoggedIn());
  // }, []);

  return (
    <Router>
      <CustomNavbar />
      <div className="pt-20 px-4">
        <Routes>
          <Route exact path="" element={<Dashboard />} />
          <Route
            exact
            path="/project"
            element={
              <ProtectedRoute>
                <Project />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            exact
            path="/user"
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          ></Route>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/logout" element={<Logout />}></Route>
          <Route exact path="/access-denied" element={<AccessDenied />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
