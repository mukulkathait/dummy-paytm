import React from "react";
import Input from "./Input";
import Button from "./Button";

function Send() {
  return (
    <div className="min-h-screen grid place-content-center">
      <div className="w-96 my-16 p-4 rounded-lg mx-auto text-center border border-solid border-black">
        <heading className="w-full text-4xl font-bold mx-auto ">
          Send Money
        </heading>
        <div className="flex flex-col mt-16">
          <div className="flex flex-row gap-2 align-middle">
            <div className="w-8 h-8 bg-slate-400 rounded-full grid place-content-center">
              U
            </div>
            <div className="text-lg">Friend's Name</div>
          </div>
          <Input
            type="text"
            id="amount"
            className="my-4"
            labelClassName="text-left"
            label={"Amount (in Rs)"}
            placeholder="Enter amount"
            inputClassName=""
          />
          <div className="hidden text-red-500 mb-2">
            Error: Insufficient Balance
          </div>
          <Button
            name={"Initiate Transfer"}
            classname={"bg-green-500 hover:bg-green-400 hover:text-black"}
          />
        </div>
      </div>
    </div>
  );
}

export default Send;
