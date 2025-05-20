import React from "react";
import { TextField as MuiTextField } from "@material-ui/core";

const TextField = ({
  value,
  handleChange,
  handleBlur,
  type,
  disabled,
  onInput,
  inputProps,
  maxLength,
}) => {
  return (
    <MuiTextField
      disabled={disabled}
      fullWidth
      type={type}
      value={value}
      variant={disabled ? "filled" : "outlined"}
      size="small"
      onInput={onInput}
      maxLength={maxLength}
      onBlur={(event) => {
        handleBlur && handleBlur(event.target.value);
      }}
      InputProps={{ inputProps: inputProps }}
      onChange={(event) => {
        handleChange(event.target.value);
      }}
    />
  );
};

export default TextField;
