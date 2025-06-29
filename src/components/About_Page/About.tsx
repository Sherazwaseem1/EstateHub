import React from "react";
import "../../CSS_files/About.css";

type Props = {};

const About = (props: Props) => {
  return (
    <div>
      <div className="About h-[80vh] flex flex-col items-center">
        <h2 className="text-[#2E9116] my-6 text-[2.5rem]">About Company</h2>
        <p className="w-[65vw]  text-center text-[#2E9116] my-10 text-[1.3rem]">
          EstateHub, your comprehensive Real Estate Management System designed
          to simplify the process of renting and selling properties. Whether
          you're a client looking for your dream home or an agent seeking to
          expand your portfolio, EstateHub offers an intuitive platform that
          caters to all your real estate needs. With a focus on efficiency and
          user-friendliness, we connect clients and agents in a seamless
          environment, making property transactions easier and more transparent
          than ever before. Join EstateHub today and take the next step in your
          real estate journey.
        </p>
      </div>
      <div className="flex flex-col h-[90vh] justify-center bg-[#262626] overflow-hidden">
        <div className="text-white text-[2.5rem] relative top-[3rem] flex justify-center ">
          Our Team
        </div>
        <div className="flex h-[90vh] justify-center">
          <div className="w-[20vw] h-[20vh] my-[10rem] mx-20">
            <img
              className="rounded-[5rem]"
              src="../Images/Sheraz_CEO.jpg"
              alt="Sheraz Waseem"
            />
          </div>
          <div className="bg-[#ffffff] h-[55vh] w-[30vw] rounded-[1.5rem] my-[8rem] mx-15 text-black flex flex-col">
            <div className="flex flex-col items-center">
              <div className="text-[1.4rem] my-1">Sheraz Waseem</div>
              <div className="text-[1.1rem] my-1">CEO & CTO @ EstateHub</div>
            </div>
            <p className=" my-2 leading-[1.8rem] w-[28vw] mx-3 text-center">
              Sheraz Waseem is the CEO and CTO at EstateHub, a real estate
              management company. He leads the development and strategy,
              ensuring EstateHub provides a seamless platform for property
              management, client relations, and transactions. His leadership
              keeps EstateHub at the forefront of innovation in real estate
              solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
