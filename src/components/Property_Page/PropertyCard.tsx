import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getImagesByPropertyId } from "../../Backend_connection/Image_service/image_service"; // Adjust the import path
import { Image } from "../../Backend_connection/types"; // Adjust the import path
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store"; // Adjust the path to your store
import { setProperty } from "../../redux/Current_Property/currentProperty"; // Adjust the path to your slice
import { Property_Data } from "../../redux/Current_Property/currentProperty"; // Adjust the path based on your project structure

type Props = {
  ID: number;
  AgentID :number;
  City: string;
  Province: string;
  ZipCode: string;
  Price: number;
  Size: number;
  NoOfBedRoom: number;
  Address: string;
  Status: "Available" | "Sold" | "Pending";
  Type: "House" | "Apartment" | "Commercial";
};

const PropertyCard = (props: Props) => {
  const navigate = useNavigate();
  const [PropID, setPropID] = useState(props.ID);
  const [image_data, setImageData] = useState<Image[]>([]);
  const [image_confirm, setimage_confirm] = useState(false);
  const [image_url, setfirst] = useState("");
  const currentProperty = useSelector(
    (state: RootState) => state.currentProperty
  );

  // Set up dispatch for triggering actions
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const fetchedImages = await getImagesByPropertyId(props.ID);
        console.log(fetchedImages);
        setImageData(fetchedImages);
        setfirst(fetchedImages[0].ImageURL);
      } catch (err) {
        console.log("Failed to load images");
      }
    };

    fetchImages();
  }, []);

  const convert_price = (): string => {
    let price = props.Price;
    const millions = price / 100000;
    return `PKR ${millions} lacs `;
  };

  const handle_Click = (): void => {

    const newProperty: Property_Data = {
      PropertyID: props.ID,
      AgentID: props.AgentID,
      City: props.City,
      Province: props.Province,
      ZipCode: props.ZipCode,
      Price: props.Price,
      Size: props.Size,
      NoOfBedRoom: props.NoOfBedRoom,
      Address: props.Address,
      Status: props.Status,
      Type: props.Type,
    };
    
    dispatch(setProperty(newProperty));

    navigate("/Properties/PropertyCard");
  };

  return (
    <div
      onClick={handle_Click}
      className="w-[27.5vw] h-[60vh] bg-[#3E3E3E] mx-[2.2rem] my-5 rounded-[1.1rem] cursor-pointer"
    >
      <div className="h-[37vh]">
        <img
          className="h-full w-full rounded-t-lg"
          src={image_url}
          alt="This is an image"
        />
      </div>
      <div className="flex flex-col px-3 justify-around  h-[23vh] text-white">
        <h2 className="text-[1.2rem] max-h-[15vh] font-semibold overflow-hidden">
          {`${props.Size} marlas ${props.Type} for sale`}
        </h2>
        <h3 className="font-semibold">Demand: {convert_price()}</h3>
        <div className="flex items-center gap-2">
          <img className=" h-[3.5vh]" src="../Images/location-pin.png" alt="" />
          <h3>
            {props.Address} - {props.City}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
