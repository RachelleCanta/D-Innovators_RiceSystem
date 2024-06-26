import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const url = "http://localhost:4001";

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    console.log(windowWidth);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  return (
    <div>
      <Router>
        <ToastContainer />
        <Navbar />
        <hr />
        <div className={windowWidth > 600 ? "app-content" : "app-content-v2"}>
          <Sidebar />
          <Routes>
            <Route path="/" element={<Orders url={url} />} />

            <Route path="/add" element={<Add url={url} />} />
            <Route path="/update" element={<Add url={url} />} />

            <Route path="/list" element={<List url={url} />} />
            <Route path="/orders" element={<Orders url={url} />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
