import { useEffect, useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

function Send() {
  const navigate = useNavigate();
  const recieverUserData = useSelector((state) => state.transfer.userData);

  const [amount, setAmount] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [error, setError] = useState(null);
  const [counter, setCounter] = useState(15);

  const transaction = async () => {
    try {
      const response = await client.post("/account/transfer", {
        to: recieverUserData._id,
        amount: parseInt(amount, 10),
      });
      if (response.data.success) {
        setIsSuccessful(true);
        setError(null);
      } else {
        setError("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.log("Error during amount transfer: ", error);
      setError("Error during transaction. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || parseInt(amount, 10) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    transaction();
  };

  useEffect(() => {
    let interval;
    if (isSuccessful) {
      interval = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isSuccessful]);

  useEffect(() => {
    if (counter === 0 && isSuccessful) {
      navigate("/dashboard");
    }
  }, [counter, isSuccessful, navigate]);

  const handleTransactionSuccess = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen grid place-content-center">
      <div className="w-96 my-16 p-4 rounded-lg mx-auto text-center border border-solid border-black">
        <div className="w-full text-4xl font-bold mx-auto ">
          {isSuccessful ? "Transaction Successful" : "Send Money"}
        </div>
        <form
          onSubmit={handleSubmit}
          className={`${isSuccessful ? "hidden" : "flex"} flex-col mt-16`}
        >
          <div className="flex flex-row gap-2 align-middle">
            <div className="w-8 h-8 bg-slate-400 rounded-full grid place-content-center">
              {recieverUserData.firstName[0].toUpperCase()}
            </div>
            <div className="text-lg">{recieverUserData.username}</div>
          </div>
          <Input
            type="text"
            id="amount"
            className="my-4"
            labelClassName="text-left"
            label={"Amount (in ₹)"}
            placeholder="Enter amount"
            inputClassName=""
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
          {error && <div className="hidden text-red-500 mb-2">{error}</div>}
          <Button
            className={"bg-green-500 hover:bg-green-400 hover:text-black"}
            type="submit"
            name="Initiate Transfer"
          />
        </form>
        <form
          onSubmit={handleTransactionSuccess}
          className={` ${isSuccessful ? "flex" : "hidden"} flex-col gap-2 mt-4`}
        >
          <div>
            Successfully transferred <b>₹{amount}</b> to{" "}
            <b>{recieverUserData.username}</b>.
          </div>
          <Button
            name="Go to Dashboard"
            type="submit"
            className="mt-4 max-w-fit px-4 bg-sky-400 text-black hover:bg-sky-500 hover:text-white"
          />
          <div className="text-slate-500 text-sm mt-4">
            Redirecting to Dashboard automatically in <b>{counter}</b>{" "}
            seconds...
          </div>
        </form>
      </div>
    </div>
  );
}

export default Send;
