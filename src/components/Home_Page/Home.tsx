import React from "react";
import { NavLink } from "react-router-dom";
import '../../CSS_files/Home.css'

interface Props {}

const Home = (props: Props) => {
  return (
    <div className="pic flex flex-col overflow-hidden items-center h-[85vh] font-semibold">
      <div className="text-center my-5">
        <h2 className="text-[2.1rem] ">Welcome to EstateHub</h2>
        <h2 className="text-[2.1rem] ">Your Trusted Partner in Real Estate Management</h2>
      </div>
      <h3 className="my-[0.8rem] backdrop-blur-[0.06rem] rounded-lg text-center text-[1.1rem] w-[40vw] font-semibold">
        Whether you are looking to buy, rent, or sell, our platform is designed
        to meet all your real estate needs with comprehensive listings featuring
        detailed information and high-quality images.
      </h3>
      <NavLink
        className={(e) => {
          return e.isActive ? "text-red-600" : "";
        }}
        to="/Properties"
      >
        <button className="btn check  my-[7rem] text-black ">Check Properties</button>
      </NavLink>
    </div>
  );
};

export default Home;
