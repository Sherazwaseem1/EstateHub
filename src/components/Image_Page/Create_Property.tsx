import React, { useState, useEffect } from "react";
import { createImage } from "../../Backend_connection/Image_service/image_service"; // Adjust the import path as necessary
import { CreateImage } from "../../Backend_connection/types"; // Adjust the import path as necessary
import { useForm, SubmitHandler } from "react-hook-form";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Result, Upload } from "antd";
import Autocomplete from "@mui/joy/Autocomplete";
import Input from "@mui/joy/Input";
import "../../CSS_files/Image_check.css";
import { CreateProperty } from "../../Backend_connection/types";
import { createProperty } from "../../Backend_connection/Property_service/property_service";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { setUser } from "../../redux/user/userSlice";
import { UserState } from "../../redux/user/userSlice"; // Adjust the path to where UserState is defined
import { useNavigate } from "react-router-dom";
import Notification from "../Notification";
import { uploadImage } from "../../Backend_connection/Image_service/image_service";
import { UploadImage } from "../../Backend_connection/types";


type Props = {};

type Inputs = {
  AgentID: number;
  City: string;
  Province: string;
  ZipCode: string;
  Price: number;
  Size: number;
  NoOfBedRoom: number;
  Status: "Available" | "Sold" | "Pending";
  Type: "House" | "Apartment" | "Commercial";
  Address: string;
};

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

const Image_check = (props: Props) => {
  const [Image_data, setImage_data] = useState<File[]>([]);
  const [gotimage, setgotimage] = useState(false);
  const [PropId, setPropId] = useState<number>(0);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const navigate = useNavigate();
  const User = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const createNewImage = async (newImage: CreateImage) => {
    try {
      const response = await createImage(newImage);
      console.log("Uploaded image:", response);
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  const onUpload = async (
    file_obj: File,
    propid: number
  ): Promise<string | undefined> => {
    if (file_obj) {
      try {
        const imageData: UploadImage = {
          PropertyID: propid,
          ImageFile: file_obj,
        };
        const response = await uploadImage(imageData);
        return String(response.message);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!gotimage) {
      message.error(`Image is required`);
      return;
    }

    const newProperty: CreateProperty = {
      AgentID: User.Id,
      City: data.City,
      Province: data.Province,
      ZipCode: data.ZipCode,
      Price: data.Price,
      Size: data.Size,
      NoOfBedRoom: data.NoOfBedRoom,
      Status: "Available",
      Type: data.Type,
      Address : data.Address,
    };

    const result = await createProperty(newProperty);

    setPropId(result.PropertyID);

    await Promise.all(
      Image_data.map(async (img) => {
        const url = await onUpload(img, result.PropertyID);
        if (typeof url === "string") {
          uploadedUrls.push(url);
        }
      })
    );

    uploadedUrls.map(async (url) => {
      const imageData: CreateImage = {
        PropertyID: result.PropertyID,
        ImageURL: url,
      };
      try {
        console.log("The value of", PropId);
        const a = await createNewImage(imageData);
      } catch (err) {
        console.log(err);
      }
    });

    navigate("/properties")
  
  };

  const image: UploadProps = {
    beforeUpload: (file) => {
      const isSupportedFormat =
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg";
      if (!isSupportedFormat) {
        message.error(`${file.name} is not a PNG or JPEG file`);
      }
      return isSupportedFormat || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      const uploadedFiles = info.fileList.map(
        (fileItem: any) => fileItem.originFileObj as File
      );
      setgotimage(true);
      setImage_data(uploadedFiles);
    },
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-[#1e600e] via-[#237c0c] to-[#2d9a0c] h-screen ">
      <form
        className="bg-white h-[93vh] w-[60vw] flex flex-col items-center justify-center gap-3 rounded-[1.4rem]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-[1.6rem] relative bottom-8 font-semibold text-[#2E9116]">
          Create a Property
        </h2>
        <div className="flex justify-around items-center w-full">
          <div className="flex flex-col gap-4">
            <Autocomplete
              color="success"
              variant="soft"
              options={citiesInPakistan}
              isOptionEqualToValue={(option, value) => option === value}
              placeholder="Choose City"
              {...register("City")}
              className="w-[25vw] "
            />
            <Autocomplete
              variant="soft"
              color="success"
              options={[
                "Punjab",
                "Sindh",
                "Khyber Pakhtunkhwa",
                "Balochistan",
                "Islamabad Capital Territory",
                "Gilgit Baltistan",
              ]}
              isOptionEqualToValue={(option, value) => option === value}
              placeholder="Choose Province"
              {...register("Province")}
              className="w-[25vw] "
            />
            <Input
              color="success"
              type="text"
              {...register("ZipCode")}
              placeholder="Enter Zip Code"
              className="w-[25vw]"
            />
            <Input
              color="success"
              type="number"
              {...register("Size")}
              placeholder="Enter Size (Marlas)"
              className="w-[25vw]"
            />
            <Input
              color="success"
              type="number"
              {...register("NoOfBedRoom")}
              placeholder="Enter Number of rooms"
              className="w-[25vw]"
            />
            <Autocomplete
              variant="soft"
              color="success"
              options={["House", "Apartment", "Commercial"]}
              isOptionEqualToValue={(option, value) => option === value}
              placeholder="Choose Type"
              {...register("Type")}
              className="w-[25vw] "
            />
            <Input
              color="success"
              type="text"
              {...register("Address")}
              placeholder="Enter Complete Address"
              className="w-[25vw]"
            />
            <Input
              color="success"
              type="number"
              {...register("Price")}
              placeholder="Enter Property Price"
              className="w-[25vw]"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <Upload {...image}>
                <Button color="success">Upload PNG & JPEG only</Button>
              </Upload>
            </div>
            <input type="submit" className="submit" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Image_check;
