import React from "react";

const Button = React.memo(({ name, className, type, ...props }) => (
  <button
    className={`w-full h-12 px-2 mx-auto text-lg text-white bg-black py-1 font-bold rounded-md ${className}`}
    type={`${type}`}
    {...props}
  >
    {name}
  </button>
));

export default Button;
