import React, { useState, useEffect } from "react";
import "../../CSS_files/Login.css";
import { useForm, SubmitHandler } from "react-hook-form";
import Switch from "@mui/joy/Switch";
import { Eye, EyeOff } from "lucide-react";
import { signInWithPopUpGoogle } from "../../firebase/firebase"; //The firebase code is in JSX hence TSX Gives ERROR!
import { GoogleOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { setUser } from "../../redux/user/userSlice";
import { UserState } from "../../redux/user/userSlice"; // Adjust the path to where UserState is defined
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";
import { message } from "antd";

import {
  getClients,
  getClientById,
  getClientByEmail,
  createClient,
  getClientPasswordByEmail,
} from "../../Backend_connection/Client_services/client_service";

import {
  createAgent,
  getAgentByEmail,
  getAgentPasswordByEmail,
} from "../../Backend_connection/Agent_service/agent_service"; // Import the API service function

import {
  Client,
  CreateClient,
  CreateAgent,
  Agent,
} from "../../Backend_connection/types";

type Inputs = {
  Name: string;
  Email: string;
  Password: string;
  Re_type: string;
  Phone: string;
  IsClient: boolean;
};

type SignInInput = {
  Email: string;
  Password: string;
  IsClient: boolean;
};

interface Props {}

const Login = (props: Props) => {
  const navigate = useNavigate();
  const User = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [newClient, setNewClient] = useState<Client | null>(null);
  const [IsLogin, setIsLogin] = useState(true);
  const [Confirmed, setConfirmed] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [IsClient, setIsClient] = React.useState<boolean>(false);
  const [password, setpassword] = useState(true);

  const handleGetPassword = async (email: UserState) => {
    try {
      const passwordData = await getClientPasswordByEmail(
        email.Email,
        email.Password
      );
      return passwordData;
    } catch (error) {
      return "Client Not Found or Invalid Password";
    }
  };

  const handleAgentPassword = async (email: UserState) => {
    try {
      const passwordData = await getAgentPasswordByEmail(
        email.Email,
        email.Password
      );
      return passwordData;
    } catch (error) {
      return "Agent Not Found or Invalid Password";
    }
  };

  const logGoogleUser = async () => {
    // For Google sign in
    try {
      const response = await signInWithPopUpGoogle();
      const user = response.user;

      const userObject: UserState = {
        Id: user.id,
        Name: user.displayName || "",
        Email: user.email || "",
        Password: "",
        Phone: user.phoneNumber || "",
        IsClient: IsClient,
      };

      dispatch(setUser(userObject));

      if (!IsLogin) {
        if (IsClient) {
          createNewClient(userObject);
          setConfirmed(true);

          setTimeout(() => {
            navigate("/home");
          }, 1500);
        } else {
          setConfirmed(true);
          setTimeout(() => {
            navigate("/Choose_Office");
          }, 1500);
        }
      } else {
        if (IsClient) {
          try {
            const result = await getClientByEmail(user.email);
            const userObject: UserState = {
              Id: result.ClientID,
              Name: user.displayName || "",
              Email: user.email || "",
              Password: "",
              Phone: result.ClientPhone || "",
              IsClient: IsClient,
            };
            dispatch(setUser(userObject));
          } catch (err) {
            console.log("Failed to fetch client");
          }
        } else {
          try {
            const fetchedAgent = await getAgentByEmail(user.email);
            const userObject: UserState = {
              Id: fetchedAgent.AgentID,
              Name: user.displayName || "",
              Email: user.email || "",
              Password: "",
              Phone: fetchedAgent.PhoneNumber || "",
              IsClient: IsClient,
            };
            dispatch(setUser(userObject));
          } catch (err) {
            console.log(
              "Failed to fetch agent. Please check the email or try again."
            );
          }
        }
        setConfirmed(true);
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      }
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  const createNewClient = async (data: UserState) => {
    try {
      const clientData: CreateClient = {
        ClientName: data.Name || "",
        ClientEmail: data.Email || "",
        ClientPhone: data.Phone,
        ClientPassword: data.Password, // Adjust the data as needed
      };

      const createdClient = await createClient(clientData);
    } catch (error) {
      console.error("Error creating client:", error);
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
  } = useForm<Inputs>();

  const onSubmitSignIn: SubmitHandler<SignInInput> = async (data) => {
    data.IsClient = IsClient;

    const userObject: UserState = {
      Id: 0,
      Name: "",
      Email: data.Email || "",
      Password: data.Password || "",
      Phone: "",
      IsClient: data.IsClient,
    };

    if (!data.IsClient) {
      const password = await handleAgentPassword(userObject);
      if (typeof password === "string") {
        message.error(password);
      } else {
        userObject.Id = password.AgentID;
        userObject.Name = password.Name;
        userObject.Phone = password.PhoneNumber;
        dispatch(setUser(userObject));
        setConfirmed(true);

        setTimeout(() => {
          navigate("/home");
        }, 1500);
      }
    } else {
      const password = await handleGetPassword(userObject);
      if (typeof password === "string") {
        alert(password);
      } else {
        userObject.Id = password.ClientID;
        userObject.Name = password.ClientName;
        userObject.Phone = password.ClientPhone;
        dispatch(setUser(userObject));
        setConfirmed(true);

        setTimeout(() => {
          navigate("/home");
        }, 1500);
      }
    }
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    data.IsClient = IsClient;

    if (data.Password !== data.Re_type) {
      message.error("Kindly match the two password fields");
      return;
    }

    const userObject: UserState = {
      Id: 0,
      Name: data.Name || "",
      Email: data.Email || "",
      Password: data.Password,
      Phone: data.Phone || "",
      IsClient: data.IsClient,
    };

    dispatch(setUser(userObject));

    if (!IsLogin) {
      if (userObject.IsClient) {
        createNewClient(userObject);
        // Need to do something regarding the AgentID
        setConfirmed(true);
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        setConfirmed(true);
        setTimeout(() => {
          navigate("/Choose_Office");
        }, 1500);
      }
    }
  };

  const handlepasswordclick = () => {
    setpassword(!password);
  };

  const handleRegisterClick = () => {
    setIsActive(true);
    setIsLogin(false);
  };

  const handleLoginClick = () => {
    setIsActive(false);
    setIsLogin(true);
  };

  return (
    <div className="body">
      <Notification message={`Welcome ${User.Name}`} class={Confirmed} />
      <div className={`container ${isActive ? "active" : ""}`}>
        <div className="form-container sign-up">
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-[1.7rem]">Create Account</h1>
            <button onClick={logGoogleUser} className="cursor-pointer">
              <div className="flex items-center justify-center gap-2">
                <GoogleOutlined className="cursor-pointer" />
                <h2 className="relative top-[0.1rem]"> Sign Up with Google </h2>
              </div>
            </button>
            <input
              {...register("Name", {
                required: { value: true, message: "Name is Requied" },
              })}
              type="text"
              placeholder="Name"
            />
            {errors.Name && (
              <div className="text-[0.7rem]">{errors.Name.message}</div>
            )}
            <input
              {...register("Email", {
                required: { value: true, message: "Email is Requied" },
              })}
              type="email"
              placeholder="Enter Email"
            />
            {errors.Email && (
              <div className="text-[0.7rem]">{errors.Email.message}</div>
            )}
            <div className="flex w-full items-center ">
              <input
                type={password ? "password" : "text"}
                {...register("Password", {
                  required: { value: true, message: "Password is Requied" },
                  minLength: {
                    value: 8,
                    message: "Password should be atleast 8 characters long",
                  },
                })}
                placeholder="Enter Password"
              />

              <div onClick={handlepasswordclick}>
                {password ? (
                  <Eye
                    className="-ml-10 z-10 cursor-pointer "
                    strokeWidth={1.5}
                  />
                ) : (
                  <EyeOff
                    className="-ml-10 z-10 cursor-pointer"
                    strokeWidth={1.5}
                  />
                )}
              </div>
            </div>
            {errors.Password && (
              <div className="text-[0.7rem]">{errors.Password.message}</div>
            )}
            <input
              className=""
              {...register("Re_type", {
                required: { value: true, message: "Password is Requied" },
                minLength: {
                  value: 8,
                  message: "Password should be atleast 8 characters long",
                },
              })}
              type="password"
              placeholder="Enter Re-type Password"
            />
            {errors.Re_type && (
              <div className="text-[0.7rem]">{errors.Re_type.message}</div>
            )}

            <input
              {...register("Phone", {
                required: { value: true, message: "Phone is Requied" },
              })}
              type="phone"
              placeholder="Enter Phone Number"
            />
            {errors.Phone && (
              <div className="text-[0.7rem]">{errors.Phone.message}</div>
            )}

            <div className="flex w-[30vw] justify-around items-center">
              <div className=" flex justify-around items-center w-[10rem] mt-4">
                <h2 className="">Agent</h2>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={IsClient}
                    onChange={(event) => {
                      console.log(event.target.checked);
                      setIsClient(event.target.checked);
                    }}
                  />
                  <span className="slider"></span>
                </label>
                <h2 className="">Client</h2>
              </div>
              <button type="submit" onClick={handleRegisterClick}>
                Sign Up
              </button>
            </div>
          </form>
        </div>
        <div className="form-container sign-in">
          <form action="" onSubmit={handleSubmit2(onSubmitSignIn)}>
            <span className="text-[1.9rem] relative bottom-2">Sign-In</span>
            <button onClick={logGoogleUser} className="cursor-pointer">
              <div className="flex items-center justify-center gap-2">
                <GoogleOutlined className="cursor-pointer" />
                <h2 className="relative top-[0.1rem]"> Sign In with Google </h2>
              </div>
            </button>
            <input
              {...register2("Email", {
                required: { value: true, message: "Email is Requied" },
              })}
              type="email"
              placeholder="Enter Email"
            />
            <input
              {...register2("Password", {
                required: { value: true, message: "Password is Requied" },
                minLength: {
                  value: 8,
                  message: "Password should be atleast 8 characters long",
                },
              })}
              type="password"
              placeholder="Enter Password"
            />
            <div className=" flex justify-around items-center w-[10rem] mt-4">
              <h2 className="">Agent</h2>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={IsClient}
                  onChange={(event) => {
                    console.log(event.target.checked);
                    setIsClient(event.target.checked);
                  }}
                />
                <span className="slider"></span>
              </label>
              <h2 className="">Client</h2>
            </div>
            <button className="relative top-5" type="submit">
              Sign In
            </button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1 className="text-[2rem]">Welcome to EstateHub</h1>
              <p className="text-[1.2rem]">Sign in with ID and Password</p>
              <button className="hid" onClick={handleLoginClick}>
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1 className="text-[2.2rem]">Hi Agent/Client!</h1>
              <p className="text-[1.2rem]">Join EstateHub</p>
              <button className="hid " onClick={handleRegisterClick}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
