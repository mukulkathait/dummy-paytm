import React, { useState, useEffect, useId } from "react";
import Input from "./Input";
import Button from "./Button";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [balance, setBalance] = useState();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  const extractUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/account/balance"
      );
      if (response.data.success) {
        setBalance(response.data.balance);
      }
    } catch (error) {
      console.log("Error while extracting user balance.");
      throw error;
    }
  };

  const extractAllUsers = async (filter) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/user/bulk?filter=${filter}`
      );
      if (response.data.success) {
        setUsers(response.data.user);
      }
    } catch (error) {
      console.log("Error while extracting all users");
      throw error;
    }
  };

  useEffect(() => {
    axios.interceptors.request.use(
      (client) => {
        const token = localStorage.getItem("authToken");
        if (token) client.headers.Authorization = `Bearer ${token}`;
        return client;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    extractUser();
    extractAllUsers(filter);
  }, []);

  useEffect(() => {
    const filterTimeout = setTimeout(() => {
      extractAllUsers(filter);
    }, 500);

    return () => {
      clearTimeout(filterTimeout);
    };
  }, [filter]);

  const handleSubmit = async (user) => {
    try {
      //pass
      navigate((to = "/send"));
    } catch (error) {
      console.log("Error during money transfer: ", error);
    }
  };

  return (
    <div>
      <header className="p-4 flex justify-between border-b border-solid border-slate-500">
        <div className="text-xl font-extrabold">Payments App</div>
        <div className="flex gap-4">
          <div>Hello, User</div>
          <div className="w-7 bg-slate-400 rounded-full grid place-content-center">
            U
          </div>
        </div>
      </header>
      <main className="p-4 flex flex-col gap-2">
        <div className="text-lg font-semibold ">Your Balance : ₹{balance}</div>
        <div className="text-lg font-semibold">Users</div>
        <Input
          type="text"
          className="w-3/4 mx-auto"
          id={useId()}
          placeholder="Search users"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        {users.map((user) => (
          <form
            onSubmit={() => handleSubmit(user)}
            key={user.username}
            className="w-3/4 h-12 mx-auto flex flex-row mt-2 bg-slate-200 rounded-lg items-center hover:border hover:border-solid hover:border-gray-500"
          >
            <div className="flex flex-row gap-2 items-center ml-1">
              <div className="h-8 w-8 bg-slate-400 rounded-full grid place-content-center">
                {user.firstName[0].toUpperCase()}
              </div>
              <div className="text-md grid place-content-center">
                {user.username}
              </div>
            </div>
            <Button
              classname={"max-w-fit mr-1 max-h-10 px-4"}
              type="submit"
              name="Send Money"
            />
          </form>
        ))}
      </main>
    </div>
  );
}

export default Dashboard;
