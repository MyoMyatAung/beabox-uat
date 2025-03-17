import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "../wallet.css";
import ggpay from "../../../assets/wallet/ggpay.svg";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";

interface PayPickProps {
  selectedPaymentID: any;
  setSelectedPaymentID: any;
  payment: {
    id: number;
    name: string;
    description: string;
    image: string;
    is_active: number;
  }[];
  selectedPayment: string;
  setSelectedPayment: any;
}

const PayPick: React.FC<PayPickProps> = ({
  payment,
  selectedPayment,
  setSelectedPayment,
  selectedPaymentID,
  setSelectedPaymentID,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(
    payment.length > 0 ? payment[0].name : ""
  );
  const [selectedField, setSelectedField] = useState<any>(
    payment.length > 0 ? payment[0] : []
  );
  // console.log(payment);
  useEffect(() => {
    if (selectedValue) {
      setSelectedPayment(selectedValue);
      setSelectedPaymentID(selectedField);
    }
  }, [selectedValue]);

  const valueHandler = (selectedName: string) => {
    // console.log(selectedName);
    const selectedPaymentObj = payment.find((p) => p.name === selectedName); // Find payment by name
    setSelectedValue(selectedName);
    if (selectedPaymentObj) {
      setSelectedPaymentID(selectedPaymentObj); // Set the ID from the payment object
    } else {
      console.error("Selected payment method not found");
    }
  };
  return (
    <div className="w-ful py-[20px]">
      <Select
        value={selectedValue}
        onValueChange={(value) => valueHandler(value)}
      >
        <SelectTrigger className="w-full payment_select_box">
          <span className=" text-white text-[16px] font-[400] leading-[20px]">
            {selectedValue}
            {/* {selectedValue === "Credit Card" && " (default)"} */}
          </span>
          {/* <SelectValue
            placeholder={selectedValue || "Select a payment method"}
          /> */}
        </SelectTrigger>
        <SelectContent className="payment_select_content p-[8px]">
          <SelectGroup className=" flex flex-col gap-[10px] bg-black">
            {payment?.map((pp: any) => (
              <SelectItem
                key={pp.id}
                value={pp.name}
                className={`  py-[10px] rounded-[10px] h-full bg-[#201c25]`}
              >
                <div className=" w-[300px] flex justify-between">
                  <h1 className=" text-white">{pp.name}</h1>
                  <AsyncDecryptedImage
                    className=" h-[20px]"
                    imageUrl={pp.image}
                  />{" "}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PayPick;
