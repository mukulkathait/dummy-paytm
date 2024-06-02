import React, { useState, useEffect, useCallback, useId } from "react";
import Input from "./Input";
import Button from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  activeTransaction,
  inactiveTransaction,
} from "../store/transferSlice.js";

const client = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

client.interceptors.request.use(
  (client) => {
    const token = localStorage.getItem("authToken");
    if (token) client.headers.Authorization = `Bearer ${token}`;
    return client;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [balance, setBalance] = useState();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const userInfo = useSelector((state) => state.auth.userData);

  const extractUserBalance = async () => {
    try {
      const response = await client.get("/account/balance");
      if (response.data.success) {
        setBalance(response.data.balance);
      }
    } catch (error) {
      console.log("Error while extracting user balance.");
      throw error;
    }
  };

  const extractUsers = useCallback(async () => {
    try {
      const response = await client.get(`/user/bulk?filter=${filter}`);
      if (response.data.success) {
        setUsers(response.data.user);
      }
    } catch (error) {
      console.log("Error while extracting all users");
      throw error;
    }
  }, [filter]);

  useEffect(() => {
    setLoading(true);
    extractUserBalance();
    extractUsers();
    setLoading(false);
    dispatch(inactiveTransaction());
  }, []);

  useEffect(() => {
    const filterTimeout = setTimeout(() => {
      extractUsers(filter);
    }, 500);

    return () => {
      clearTimeout(filterTimeout);
    };
  }, [filter, extractUsers]);

  const handleSubmit = async (e, user) => {
    e.preventDefault();
    try {
      dispatch(activeTransaction({ userData: user }));
      //pass
      navigate("/send");
    } catch (error) {
      console.log("Error during money transfer: ", error);
    }
  };

  return (
    <div>
      <header className="p-4 flex justify-between border-b border-solid border-slate-500">
        <div className="text-xl font-extrabold">Payments App</div>
        <div className="flex gap-4">
          <div>Hello, {userInfo.username}</div>
          <div className="w-7 bg-slate-400 rounded-full grid place-content-center">
            {userInfo.username[0].toUpperCase()}
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
        {loading ? (
          <div className="w-3/4 mx-auto text-center text-lg text-slate-400">
            <i>Loading...</i>
          </div>
        ) : (
          users.map((user) => (
            <form
              onSubmit={(e) => handleSubmit(e, user)}
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
                className={"max-w-fit mr-1 max-h-10 px-4"}
                type="submit"
                name="Send Money"
              />
            </form>
          ))
        )}
      </main>
    </div>
  );
}

export default Dashboard;
