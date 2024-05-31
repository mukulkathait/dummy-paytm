import React from "react";

function Input({
  label,
  type,
  id,
  className = "",
  labelClassName = "",
  inputClassName,
  ...props
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label
          className={`font-semibold text-lg ${labelClassName}`}
          htmlFor="id"
        >
          {label}
        </label>
      )}
      <input
        className={`w-full h-12 px-2 mt-2 border border-solid rounded-md ${inputClassName}`}
        type={type}
        id={id}
        {...props}
      />
    </div>
  );
}

export default Input;
