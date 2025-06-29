import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import type { RootState } from "./redux/store";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "../src/redux/counter/counterSlice";
import Navbar from "./components/Navbar";
import Home from "./components/Home_Page/Home";
import Login from "./components/Login_Page/Login";
import Property from "./components/Property_Page/Property";
import About from "./components/About_Page/About";
import Property_Description from "./components/Property_Page/Property_Description";
import Choose_Office from "./components/Login_Page/Choose_Office";
import Offices from "./components/Offices_Page/Offices";
import Create_Property from "./components/Image_Page/Create_Property";

function App() {
  const count = useSelector((state: RootState) => state.counter.value);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Login />
        </>
      ),
    },
    {
      path: "/home",
      element: (
        <>
          <Navbar />
          <Home />
        </>
      ),
    },
    {
      path: "/Properties",
      element: (
        <>
          <Navbar />
          <Property />
        </>
      ),
    },
    {
      path: "/Properties/PropertyCard",
      element: (
        <>
          <Navbar />
          <Property_Description />
        </>
      ),
    },
    {
      path: "/Offices",
      element: (
        <>
          <Navbar />
          <Offices />
        </>
      ),
    },
    {
      path: "/About",
      element: (
        <>
          <Navbar />
          <About />
        </>
      ),
    },
    {
      path: "/Choose_Office",
      element: (
        <>
          <Choose_Office />
        </>
      ),
    },
    {
      path: "/Create_Property",
      element: (
        <>
          <Create_Property/>
        </>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
