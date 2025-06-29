import React from "react";
import Office_card from "./Office_card";
import { useState, useEffect } from "react";
import { readOffices } from "../../Backend_connection/Office_service/office_service"; // Adjust the path as necessary
import { Office } from "../../Backend_connection/types"; // Adjust the path as necessary

type Props = {};

const Offices = (props: Props) => {
  const [offices, setOffices] = useState<Office[]>([]);

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const data = await readOffices();
        setOffices(data);
      } catch (error) {
        console.log("Got an error while reading Offices");
      }
    };

    fetchOffices();
  }, []);

  return (
    <div className="bg-[#262626]  h-[85vh] flex flex-col items-center">
      <div className="text-white text-[1.8rem] flex justify-center my-2">
        Our Partner Offices
      </div>
      <div className=" bg-[#414141] w-[95vw] h-[73vh] rounded-[0.8rem] flex justify-around flex-wrap overflow-y-auto">
        {offices.map((office) => (
          <Office_card
            key={office.OfficeID}
            OfficeID = {office.OfficeID}
            OfficeName={office.OfficeName}
            Address={office.Address}
            City={office.City}
            Province={office.Province}
            PhoneNumber={office.PhoneNumber}
          />
        ))}
      </div>
    </div>
  );
};

export default Offices;
