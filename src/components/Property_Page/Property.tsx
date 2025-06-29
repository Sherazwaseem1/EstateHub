import React from "react";
import PropertyCard from "./PropertyCard";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { setUser } from "../../redux/user/userSlice";
import { UserState } from "../../redux/user/userSlice"; // Adjust the path to where UserState is defined
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";
import { useForm, SubmitHandler } from "react-hook-form";
import { Controller } from "react-hook-form";
import { message } from "antd";
import Autocomplete from "@mui/joy/Autocomplete";
import { useState, useEffect } from "react";
import "../../CSS_files/Property.css";
import {
  Property_type,
  CreateProperty,
  PropertySearch,
  PropertyResponse,
} from "../../Backend_connection/types";

import { searchProperties } from "../../Backend_connection/Property_service/property_service"; // Update this path accordingly

import {
  createProperty,
  readProperties,
  readPropertyById,
} from "../../Backend_connection/Property_service/property_service";
import TextField from "@mui/joy/TextField";

const citiesInPakistan = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Sukkur",
  "Sargodha",
  "Bahawalpur",
  "Sheikhupura",
  "Mardan",
  "Gujrat",
  "Sahiwal",
  "Dera Ghazi Khan",
  "Abbottabad",
  "Mirpur Khas",
  "Okara",
  "Chiniot",
  "Kasur",
  "Rahim Yar Khan",
  "Jhelum",
  "Attock",
  "Sadiqabad",
  "Nawabshah",
  "Jhang",
  "Mingora",
  "Larkana",
  "Dera Ismail Khan",
  "Mandi Bahauddin",
  "Pakpattan",
  "Kohat",
  "Khuzdar",
  "Bannu",
  "Mansehra",
  "Muzaffarabad",
  "Kotli",
  "Mirpur",
  "Gilgit",
  "Skardu",
  "Gwadar",
  "Zhob",
  "Chaman",
  "Turbat",
];

type Inputs = {
  City: string | "";
  Province: string | "";
  Price: number | 0;
  Type: "House" | "Apartment" | "Commercial" | "";
};

type Props = {};

const Property = (props: Props) => {
  const User = useSelector((state: RootState) => state.user);
  const [properties, setProperties] = useState<Property_type[]>([]);
  const [Search_Condition, setSearch_Condition] = useState({});
  const navigate = useNavigate();

  // Function to handle fetching all properties with pagination
  const handleGetProperties = async (
    skip: number = 0,
    limit: number = 100
  ): Promise<Property_type[] | string> => {
    try {
      const properties = await readProperties(skip, limit);
      return properties;
    } catch (error) {
      return "Error fetching properties";
    }
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const result = await handleGetProperties();
        console.log(result);
        if (Array.isArray(result)) {
          setProperties(result);
        } else {
          console.error(result);
        }
      } catch (error) {
        console.log("Error fetching properties");
      }
    };

    fetchProperties();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      Type: "",
      Province: "",
      City: "",
    },
  });

  const resetProvince = () => {
    reset({
      Province: "", // Resets the Province field
    });
  };

  const resetCity = () => {
    reset({
      City: "", // Resets the City field
    });
  };
  const resetType = () => {
    reset({
      Type: "", // Resets the City field
    });
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    let object: Inputs = {
      City: data.City,
      Province: data.Province,
      Price: Number(data.Price),
      Type: data.Type,
    };

    try {
      const results = await searchProperties(object);
      setProperties(results);
    } catch (err) {
      console.error("Found an error while searching properties");
    }
  };

  return (
    <div className="bg-[#262626] ">
      <div className="search h-[70vh] flex justify-center items-center ">
        <div className="bg-[#3E3E3E] w-[60vw] h-[60vh] flex flex-col items-center gap-8 rounded-[2rem]">
          <h2 className="text-white my-3 text-[1.5rem] font-semibold">
            Search for Properties
          </h2>
          <div className="">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center gap-3 w-[30vw] z-[100rem]"
            >
              <Controller
                name="City"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={citiesInPakistan}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(event, value) => field.onChange(value)} // Updates form value
                    className="w-[25vw]"
                    placeholder="Choose City"
                  />
                )}
              />
              <Controller
                name="Province"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={[
                      "Punjab",
                      "Sindh",
                      "Khyber Pakhtunkhwa",
                      "Balochistan",
                      "Islamabad Capital Territory",
                      "Gilgit Baltistan",
                    ]}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(event, value) => field.onChange(value)} // Updates form value
                    className="w-[25vw]"
                    placeholder="Choose Province"
                  />
                )}
              />
              <input
                type="number"
                placeholder="Enter Price (Less than) <="
                {...register("Price")}
                className="rounded-[0.4rem] w-[25vw] pl-2 py-[0.3rem]"
              />
              <Controller
                name="Type"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={["House", "Apartment", "Commercial"]}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(event, newValue) => field.onChange(newValue)} // Updates the form value
                    className="w-[25vw]"
                    placeholder="Choose Type"
                  />
                )}
              />
              <div className=" w-[15vw] flex justify-around my-2">
                <button
                  type="button"
                  onClick={() => {
                    resetProvince;
                    resetType;
                    resetCity;
                    reset();
                  }}
                  className="reset ml-2 px-3 "
                >
                  Reset
                </button>
                <input
                  className="mx-2 px-3 bg-white rounded-[2rem] w-[6vw] h-[6vh] text-[#186221] hover:bg-[#16511d] hover:text-white transition-all cursor-pointer duration-300 border-2"
                  type="submit"
                />
                <div className="flex flex-col items-center justify-center relative left-[13rem] bottom-6  w-[20vw]">
                  {!User.IsClient ? (
                    <>
                      <div
                        onClick={() => {
                          navigate("/Create_Property");
                        }}
                      >
                        <button
                          className="group cursor-pointer outline-none hover:rotate-90 duration-300"
                          title="Add New"
                        >
                          <svg
                            className="stroke-teal-500 fill-none group-hover:fill-teal-800 group-active:stroke-teal-200 group-active:fill-teal-600 group-active:duration-0 duration-300"
                            viewBox="0 0 24 24"
                            height="50px"
                            width="50px"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke-width="1.5"
                              d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                            ></path>
                            <path stroke-width="1.5" d="M8 12H16"></path>
                            <path stroke-width="1.5" d="M12 16V8"></path>
                          </svg>
                        </button>
                      </div>
                      <div className="text-white text-[0.7rem] w-[7vw] text-center relative bottom-1 font-bold">
                        Add Property
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div>
        <h2 className=" flex justify-center text-white text-[2rem] font-bold ">
          Properties
        </h2>
        <div className="flex flex-wrap ">
          {properties.map((property) => {
            return (
              <PropertyCard
                Address={property.Address}
                ID={property.PropertyID}
                City={property.City}
                Province={property.Province}
                ZipCode={property.ZipCode}
                Price={property.Price}
                Size={property.Size}
                NoOfBedRoom={property.NoOfBedRoom}
                Status={property.Status}
                Type={property.Type}
                AgentID={property.AgentID}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Property;
