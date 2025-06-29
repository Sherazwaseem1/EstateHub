import React from "react";
import { Carousel } from "antd";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { setProperty } from "../../redux/Current_Property/currentProperty";
import { Image } from "../../Backend_connection/types"; // Adjust the import path
import { getImagesByPropertyId } from "../../Backend_connection/Image_service/image_service";
import { readAgentById } from "../../Backend_connection/Agent_service/agent_service";
import { readOfficeById } from "../../Backend_connection/Office_service/office_service";
import { setUser } from "../../redux/user/userSlice";
import { UserState } from "../../redux/user/userSlice";

import {
  Agent,
  Office,
  Transaction,
  CreateTransaction,
} from "../../Backend_connection/types"; // Adjust the path to your types file
import {
  getTransactionsByPropertyId,
  createTransaction,
} from "../../Backend_connection/Transaction_service/transaction_service";
import { message } from "antd";

type Inputs = {
  Price: number;
  Months: number;
  Percentage: number;
};

type offer = {
  Amount: number;
};

type Props = {};

const Property_Description = (props: Props) => {
  const [MonthyInstallment, setMonthyInstallment] = useState(0);
  const [Data, setData] = useState<Inputs>();
  const [Show_Plan, setShow_Plan] = useState(false);
  const [image_data, setImageData] = useState<Image[]>([]);
  const [Confirm_data, setConfirm_data] = useState(false);
  const currentProperty = useSelector(
    (state: RootState) => state.currentProperty
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [AgentName, setAgentName] = useState("");
  const [OfficeName, setOfficeName] = useState("");
  const User = useSelector((state: RootState) => state.user);

  // Set up dispatch for triggering actions
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const fetchedImages = await getImagesByPropertyId(
          currentProperty.PropertyID
        );
        setConfirm_data(true);
        setImageData(fetchedImages);
      } catch (err) {
        console.log("Failed to load images");
      }
    };

    const fetchTransactions = async () => {
      try {
        const fetchedTransactions = await getTransactionsByPropertyId(
          currentProperty.PropertyID
        );
        setTransactions(fetchedTransactions);
      } catch (err) {
        console.log("Found an error while fetching transactions");
      }
    };

    const fetchAgent = async () => {
      try {
        const agentData = await readAgentById(currentProperty.AgentID);
        const data = await readOfficeById(agentData.OfficeID);
        setAgentName(agentData.Name);
        setOfficeName(data.OfficeName);
      } catch (err) {
        console.log("Failed to load agent");
      }
    };
    fetchImages();
    fetchAgent();
    fetchTransactions();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
  } = useForm<offer>();

  const handleOfferSubmit: SubmitHandler<offer> = async (data) => {
    console.log(data.Amount);
    const timestamp = Date.now();
    const date = new Date(timestamp);
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;

    const newTransaction: CreateTransaction = {
      ClientID: User.Id,
      PropertyID: currentProperty.PropertyID,
      Date: formattedDate,
      Amount: data.Amount,
    };

    try {
      const return_value = await createTransaction(newTransaction);
      transactions.push(return_value);
    } catch (err) {
      console.log("error creating transaction");
    }
  };

  const validation = async (data: Inputs) => {
    if (data.Months <= 0 || data.Percentage <= 0 || data.Price <= 0) {
      return false;
    }
    return true;
  };

  const convert_price = (amount?: number): string => {
    if (amount === undefined) {
      let price = currentProperty.Price;
      const millions = price / 100000;
      return `PKR ${millions} lacs `;
    } else {
      const millions = amount / 100000;
      return `PKR ${millions} lacs `;
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const check = await validation(data);
    if (!check) {
      alert("Kindly Enter Valid Data in the Installment Form");
      setShow_Plan(false);
      return;
    }
    const monthlyInterestRate = data.Percentage / 12 / 100;
    const numerator =
      data.Price *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, data.Months);
    const denominator = Math.pow(1 + monthlyInterestRate, data.Months) - 1;
    let result = numerator / denominator;
    result = parseFloat(result.toFixed(2));
    setMonthyInstallment(result);
    setData(data);
    setShow_Plan(true);
  };

  return (
    <div className="bg-[#262626]">
      <div className=" h-[85vh] flex justify-around text-white">
        <div className="rounded-lg">
          <Carousel
            arrows
            infinite={false}
            className="images w-[60vw] h-[75vh] bg-gray-600 rounded-lg  my-5 text-white"
          >
            {Confirm_data &&
              image_data.map((image) => (
                <div className="rounded-lg" key={image.ImageID}>
                  <img
                    className="w-[60vw] h-[75vh] rounded-lg"
                    src={`../../${image.ImageURL}`}
                    alt={`Property ${image.PropertyID} image`}
                  />
                </div>
              ))}
          </Carousel>
        </div>
        <div className="installments w-[25vw] h-[75vh] bg-green-800 rounded-lg my-5">
          <div className="flex justify-center text-[1.4rem] my-3 font-semibold">
            Installment Planner
          </div>
          <div className="h-[65vh] flex flex-col items-center">
            <form
              className="flex my-6  flex-col items-center gap-5 w-[20vw]"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                className="rounded-[0.3rem] w-[20vw] text-black text-center"
                placeholder="Enter Principal Amount"
                {...register("Price", { required: true })}
                type="number"
                min="0"
              />
              <input
                className="rounded-[0.3rem] w-[20vw] text-black text-center"
                placeholder="Enter Months For Repayment"
                {...register("Months", { required: true })}
                min="0"
              />
              <input
                className="rounded-[0.3rem] w-[20vw] text-black text-center"
                placeholder="Enter Annual Interest"
                {...register("Percentage", { required: true })}
                min="0"
              />
              <div className="flex gap-2 my-1">
                <input
                  className="rounded-[0.3rem] bg-white w-[8vw] text-[#2E9116] cursor-pointer  hover:bg-[#2E9116] hover:text-white transition-all duration-300 ease-in-out"
                  type="submit"
                  placeholder="Submit"
                />
                <button
                  className="rounded-[0.3rem] bg-white w-[8vw] text-[#ff3232] cursor-pointer hover:bg-[#ff3232] hover:text-white transition-all duration-300 ease-in-out"
                  type="button"
                  onClick={() => reset()}
                >
                  Clear
                </button>
              </div>
            </form>
            <div className="Ans text-[1.2rem] underline">Your Plan</div>
            {Show_Plan ? (
              <>
                <div className="my-2 flex flex-col text-center items-center">
                  <div>Principal Amount : {Data?.Price}</div>
                  <div>Total Months : {Data?.Months}</div>
                  <div>Annual Percentage : {Data?.Percentage}</div>
                  <div className="font-semibold text-[1.05rem] my-2">
                    Monthly Installments : {MonthyInstallment} PKR
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="my-10 ">Currently No Plan</div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-around text-white my-[-2rem]">
        <div className="property  w-[60vw] min-h-[50vh] rounded-lg my-5 bg-[#454545]">
          <div className="flex justify-center text-[1.6rem] my-2 font-semibold">
            Description
          </div>
          <div className="text-[1.4rem] max-h-[15vh] font-semibold overflow-hidden mx-3">
            Title:{" "}
            {`${currentProperty.Size} Marlas ${currentProperty.Type} for sale`}
          </div>
          <div className="mx-3 my-4 font-semibold">
            <div>Price: {convert_price()}</div>
            <div>
              Location:{" "}
              {`${currentProperty.Address} ${currentProperty.City} ${currentProperty.Province}`}
            </div>
            <div>Agent: {AgentName}</div>
            <div>Office: {OfficeName}</div>
            <div>Size: {`${currentProperty.Size} Marlas`}</div>
            <div>No. Of BedRoom: {currentProperty.NoOfBedRoom} </div>
            <div>Type: {currentProperty.Type} </div>
          </div>
        </div>
        <div className="Offers flex flex-col items-center w-[25vw] h-[50vh] rounded-lg my-5  bg-[#2E9116]">
          <div className="flex justify-center text-[1.4rem] my-2 font-semibold">
            Offers
          </div>
          {User.Id !== currentProperty.AgentID ? (
            <form
              className="flex flex-col items-center"
              action=""
              onSubmit={handleSubmit2(handleOfferSubmit)}
            >
              <input
                className="border-2 border-white w-[20vw] rounded-[0.3rem] text-center text-black my-2"
                type="number"
                placeholder="Enter your Offer in PKR"
                {...register2("Amount", { required: true })}
              />
              {errors2.Amount && (
                <div className="text-[#ff2626] bg-white rounded-lg w-[14vw] text-center">
                  An Amount is required
                </div>
              )}
              <input
                className="rounded-[0.3rem] bg-white w-[8vw] text-[#2E9116] my-4 cursor-pointer"
                type="submit"
              />
            </form>
          ) : null}
          <div className="underline text-[1.1rem]">Current Offers</div>
          <div className="overflow-y-auto h-[20vh] ">
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex justify-around border-2 border-white rounded-lg my-2 mx-2 w-[22.5vw]"
                >
                  <div className="flex flex-col items-center">
                    <p>Name</p>
                    <p>Sheraz</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p>Date</p>
                    <p>{transaction.Date}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p>Amount</p>
                    <p>{convert_price(transaction.Amount)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="my-10">Currently No Offers!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property_Description;
