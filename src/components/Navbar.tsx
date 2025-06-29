import React from "react";
import { NavLink } from "react-router-dom";
import Avatar from "@mui/joy/Avatar";
import Switch from "@mui/joy/Switch";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { setUser } from "../redux/user/userSlice";
import { UserState } from "../redux/user/userSlice"; // Adjust the path to where UserState is defined
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Props {}

const Navbar = (props: Props) => {
  const User = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [showprofile, setshowprofile] = useState(false);

  return (
    <div>
      <div className="flex justify-center">
        <Profile profile={showprofile} />
      </div>
      <nav className="flex justify-between items-center h-[15vh] text-[white] bg-[#2E9116]">
        <div className="flex gap-4 items-center mx-7 cursor-pointer">
          <h2 className="text-[2rem] " onClick={() => {
            navigate("/home");
          }}>EstateHub</h2>
        </div>
        <div className="flex items-center gap-5 text-[1.2rem] mx-4 list-none ">
          <NavLink
            className={(e) => {
              return e.isActive
                ? "bg-white text-[#2E9116]  rounded-[0.4rem] w-[5vw] text-center"
                : "hover:bg-white hover:text-[#2E9116] w-[5vw] rounded-[0.4rem]  text-center transition-all duration-500 ease-in-out";
            }}
            to="/home"
          >
            <li>Home</li>
          </NavLink>
          <NavLink
            className={(e) => {
              return e.isActive
                ? "bg-white text-[#2E9116]  rounded-[0.4rem] w-[9vw] text-center "
                : "hover:bg-white hover:text-[#2E9116]  w-[9vw] rounded-[0.4rem] text-center transition-all duration-500 ease-in-out";
            }}
            to="/Properties"
          >
            <li>Properties</li>
          </NavLink>
          <NavLink
            className={(e) => {
              return e.isActive
                ? "bg-white text-[#2E9116]  rounded-[0.4rem] w-[6vw] text-center"
                : "hover:bg-white hover:text-[#2E9116]  w-[6vw] text-center rounded-[0.4rem] transition-all duration-500 ease-in-out";
            }}
            to="/Offices"
          >
            <li>Offices</li>
          </NavLink>
          <NavLink
            className={(e) => {
              return e.isActive
                ? "bg-white text-[#2E9116]  rounded-[0.4rem] w-[5vw] text-center"
                : "hover:bg-white hover:text-[#2E9116]  w-[5vw] text-center rounded-[0.4rem] transition-all duration-500 ease-in-out";
            }}
            to="/About"
          >
            <li>About</li>
          </NavLink>
          <div className="flex items-center cursor-pointer">
            <div
              onClick={() => {
                setshowprofile(!showprofile);
              }}
              className="flex flex-col items-center"
            >
              <Avatar color="success" variant="soft" />
              <h3 className="text-[0.7rem] relative top-1">{User.Name}</h3>
              <h3 className="text-[0.7rem] relative top-1">
                {User.IsClient ? "Client" : "Agent"}
              </h3>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

