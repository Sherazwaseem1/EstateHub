import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/joy/Autocomplete";
import Input from "@mui/joy/Input";
import "../../CSS_files/Choose_Office.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { setUser, setUserID } from "../../redux/user/userSlice";
import { UserState } from "../../redux/user/userSlice"; // Adjust the path to where UserState is defined

import { readOffices } from "../../Backend_connection/Office_service/office_service"; // Import the API service function

import { Office} from "../../Backend_connection/types";


import { createAgent } from "../../Backend_connection/Agent_service/agent_service"; // Import the API service function

import {
  Client,
  CreateClient,
  CreateAgent,
} from "../../Backend_connection/types";

type Props = {};

interface Arraytype {
  Name: string;
  ID: number;
  Message: string;
}

const Choose_Office = (props: Props) => {
  
  const [value, setValue] = useState<string | null>("");
  const [officeMessages, setOfficeMessages] = useState<string[]>([]);
  const navigate = useNavigate();
  const User = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  let final: number = 0;


  const handlesubmit = async () => {
    
    const regex = /OfficeID:(\d+)/;
    if (typeof value === "string") {
      const match = value.match(regex);
      if (match && match[1]) {
        final = parseInt(match[1], 10);
      }
    }

    let a = await createNewAgent();
    navigate("/home");

  };

  const createNewAgent = async (): Promise<void> => {
    try {
      const agentData: CreateAgent = {
        OfficeID: final,
        Name: User.Name || "",
        Email: User.Email || "",
        PhoneNumber: User.Phone,
        Password: User.Password,
      };

      // Call the API service function to create a new agent
      const createdAgent = await createAgent(agentData);
      dispatch(setUserID({ Id: createdAgent.AgentID }));
    } catch (error) {
      console.error("Error creating agent:", error);
    }
  };

  const fetchOffices = async () => {
    try {
      const fetchedOffices = await readOffices(0, 50);
      const simplifiedOfficesArray: Arraytype[] = fetchedOffices.map(
        (office) => {
          const name = office.OfficeName || "";
          const ID = office.OfficeID || 0;
          const message = `${name}  -  OfficeID:${ID}`;
          return { Name: name, ID, Message: message };
        }
      );

      setOfficeMessages(simplifiedOfficesArray.map((office) => office.Message));
    } catch (error) {
      console.error("Error fetching offices:", error);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  return (
    <div className="gradient w-full h-screen flex flex-col items-center justify-center gap-3">
      <h2 className="text-[2.5rem] text-white">Offices</h2>
      <p className="text-white text-[1.2rem]">
        Each Agent Must be affiliated with an Office
      </p>
      <Autocomplete
        variant="soft"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        options={officeMessages}
        isOptionEqualToValue={(option, value) => option === value}
        placeholder="Choose Office"
        className="w-[25vw] my-2"
      />
      <button
        onClick={handlesubmit}
        className=" bg-white rounded-[2rem] w-[6vw] h-[6vh] text-[#00ff1e] hover:bg-[#00ff1e] hover:text-white transition-all duration-300 ease-in-out "
      >
        Submit
      </button>
    </div>
  );
};

export default Choose_Office;
