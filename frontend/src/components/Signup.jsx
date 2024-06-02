import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";

const client = axios.create({
  baseURL: "http://localhost:3000/api/v1/user",
});

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userSignupInfo, setUserSignupInfo] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await client.post("/signup", userSignupInfo);
      if (response.data.success) {
        dispatch(login({ userData: response.data.userData }));
        console.log("Dispatched");
        const token = response.data.token;
        localStorage.setItem("authToken", token);
        console.log("token in localstorage");
        navigate("/dashboard");
        console.log("Navigated");
      }
    } catch (error) {
      console.log("Error during user signup: ", error);
    }
  };

  function handleChange(e) {
    const { id, value } = e.target;
    setUserSignupInfo((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  return (
    <div className="min-h-screen grid place-content-center">
      <div className="w-96 my-16 p-4 rounded-lg mx-auto text-center border border-solid border-black">
        <div className="text-4xl font-bold">Sign Up</div>
        <div className="text-slate-500 text-xl mt-4">
          Enter your information to create an account
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            id="firstName"
            label="First Name"
            className="mt-4"
            labelClassName="text-left"
            inputClassName=""
            placeholder="John"
            type="text"
            value={userSignupInfo.firstName}
            onChange={handleChange}
          />
          <Input
            id="lastName"
            label="Last Name"
            className="mt-4"
            labelClassName="text-left"
            inputClassName=""
            placeholder="Doe"
            type="text"
            value={userSignupInfo.lastName}
            onChange={handleChange}
          />
          <Input
            id="username"
            label="Email"
            className="mt-4"
            labelClassName="text-left"
            inputClassName=""
            placeholder="johndoe@example.com"
            type="text"
            value={userSignupInfo.username}
            onChange={handleChange}
          />
          <Input
            id="password"
            label="Password"
            className="mt-4"
            labelClassName="text-left"
            inputClassName=""
            type="text"
            value={userSignupInfo.password}
            onChange={handleChange}
          />
          <Button type="submit" name="Signup" className={"mt-4"} />
        </form>
        <div className="mt-2">
          Already have an account?{" "}
          <Link to="/signin" className="underline hover:text-blue-500">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
