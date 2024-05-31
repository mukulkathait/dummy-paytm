import React from "react";

function Button({ name, classname, ...props }) {
  return (
    <button
      className={`w-full h-12 px-2 mx-auto text-lg text-white bg-black py-1 font-bold rounded-md ${classname}`}
      {...props}
    >
      {name}
    </button>
  );
}

export default Button;
