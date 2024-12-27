import React from "react";
import { Button } from "../ui/button";

const SubmitButton = ({ isLoading, condition, text }: any) => {
  return (
    <Button
      type="submit"
      disabled={isLoading ? true : false}
      className={`w-full ${
        condition
          ? "gradient-bg hover:gradient-bg"
          : "bg-[#FFFFFF0A] hover:bg-[#FFFFFF0A]"
      }  bg-[#FFFFFF0A] mt-10 rounded-xl`}
    >
      {/* {isLoading ? "loading..." : "Continue"} */}
      {text}
    </Button>
  );
};

export default SubmitButton;
