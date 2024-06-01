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

function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userSigninInfo, setUserSigninInfo] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await client.post("/signin", userSigninInfo);
      if (response.data.success) {
        dispatch(login({ userData: response.data.success }));
        const token = response.data.token;
        localStorage.setItem("authToken", token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Error during user signin: ", error);
    }
  };

  function handleChange(e) {
    const { id, value } = e.target;
    setUserSigninInfo((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  return (
    <div className="min-h-screen grid place-content-center">
      <div className="w-96 my-16 p-4 rounded-lg mx-auto text-center border border-solid border-black">
        <div className="text-4xl font-bold">Sign In</div>
        <div className="text-slate-500 text-xl mt-4">
          Enter your credentials to access your account
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            id="username"
            label="Email"
            className="mt-4"
            labelClassName="text-left"
            inputClassName=""
            placeholder="johndoe@example.com"
            type="text"
            value={userSigninInfo.username}
            onChange={handleChange}
          />
          <Input
            id="password"
            label="Password"
            className="mt-4"
            labelClassName="text-left"
            inputClassName=""
            type="text"
            value={userSigninInfo.password}
            onChange={handleChange}
          />
          <Button type="submit" name="Signin" classname={"mt-4"} />
        </form>
        <div className="mt-2 text-md">
          Don't have an account?{" "}
          <Link to="/signup" className="underline hover:text-blue-500">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signin;
