import React from "react";
import "../CSS_files/Profile.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { setUser } from "../redux/user/userSlice";
import { UserState } from "../redux/user/userSlice"; // Adjust the path to where UserState is defined

type Props = {
  profile: boolean;
};

const Notification = (props: Props) => {
  const navigate = useNavigate();
  const User = useSelector((state: RootState) => state.user);

  const get_first_name = () => {
    const name = User.Name;
    let first_name = "";
    for (let i of name) {
      if (i === " ") {
        break;
      } else {
        first_name = first_name + i;
      }
    }

    return first_name;
  };

  

  return (
    <div
      className={
        !props.profile
          ? "notification bg-white  border-2 border-emerald-900 w-[15vw] h-[10vh] flex justify-around items-center rounded-lg transition-all duration-500 ease-in-out absolute top-[-6rem]"
          : " notification bg-[#3eb92b] border-2 border-emerald-900 w-[15vw] h-[10vh] flex justify-around items-center rounded-lg absolute top-[1rem] z-[2000] transition-all duration-500 ease-in-out"
      }
    >
      <div className="flex items-center justify-around gap-5">
        <div className="flex flex-col items-center justify-center text-white font-semibold">
          <h2 className="text-[0.9rem]">{get_first_name()}</h2>
          <h3 className="text-[0.8rem]">{User.IsClient?"Client":"Agent"}</h3>
        </div>
        <button
          onClick={() => {
            navigate("/");
          }}
          className="btnprofile"
        >
          Signout
        </button>
      </div>
    </div>
  );
};

export default Notification;
