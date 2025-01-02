import React, { useState } from "react";
import "../wallet.css";
import PayPick from "./PayPick";

interface WithDetailsProps {
  payment: any;
}

const WithDetails: React.FC<WithDetailsProps> = ({ payment }) => {
  const [amount, setAmount] = useState<string>("");
  const [bankAccountNumber, setBankAccountNumber] = useState<string>("");
  const [bankAccountName, setBankAccountName] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<string>("");

  const isFormValid = amount !== "" && bankAccountNumber !== "";
  bankAccountName.length !== 0 && selectedPayment !== "";

  const submitHandler = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isFormValid) {
      console.log(amount, selectedPayment, bankAccountName, bankAccountNumber);
    }
  };


  return (
    <div>
      <form onSubmit={submitHandler} className="flex flex-col gap-[32px]">
        {/* amount */}
        <div>
          <label className="text-white text-[16px] font-[400] leading-[20px]">
            Withdraw amount
          </label>
          <input
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Please enter amount (multiple of 100)"
            className="withdraw_input bg-transparent focus:outline-none pt-[20px] pb-[10px] w-full text-white text-[16px] font-[400] leading-[20px]"
            type="number"
          />
          <p className="py-[5px] text-[#777] font-[300] text-[14px]">
            100 coins = 2$
            <br />
            Expect to receive = ---
          </p>
        </div>
        {/* payment */}
        <div>
          <label className="text-white text-[16px] font-[400] leading-[20px]">
            Payment Method
          </label>
          <PayPick
            payment={payment}
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            onSelect={setSelectedPayment}
          />
        </div>
        {/* bank info */}
        <div>
          <label className="text-white text-[16px] font-[400] leading-[20px]">
            Bank information
          </label>
          <input
            required
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value)}
            placeholder="Please enter bank account number"
            className="withdraw_input bg-transparent focus:outline-none pt-[20px] pb-[10px] w-full text-white text-[16px] font-[400] leading-[20px]"
            type="number"
          />
          <input
            required
            value={bankAccountName}
            onChange={(e) => setBankAccountName(e.target.value)}
            placeholder="Please enter bank account name"
            className="withdraw_input bg-transparent focus:outline-none pt-[30px] pb-[10px] w-full text-white text-[16px] font-[400] leading-[20px]"
            type="text"
          />
        </div>
        {/* rules */}
        <div>
          <label className="text-white text-[16px] font-[400] leading-[20px]">
            Withdraw rule
          </label>
          <div className="flex flex-col gap-[20px] pt-[10px] text-[#888] text-[12px] font-[300] leading-[18px]">
            <p>
              1. The minimum amount of cash withdrawal is 300 yuan each time,
              and only integers of 100 can be withdrawn.
            </p>
            <p>
              2. The original creator gets 60% of the profit, while the UP
              creator gets 35% of the profit.
            </p>
            <p>
              3. Only bank card withdrawals are supported. The receiving account
              number and name must be the same. The payment will arrive within
              24 hours.
            </p>
          </div>
        </div>
        {/* button */}
        <button
          type="submit"
          className={`rounded-[16px] py-[12px] px-[16px] text-white text-[14px] font-[600] leading-[22px] w-full ${
            isFormValid ? " bg-gradient-to-tl from-[#CD3EFF] to-[#FFB2E0]" : "bg-white/10"
          }`}
          //   disabled={!isFormValid}
        >
          Confirm withdraw
        </button>
      </form>
    </div>
  );
};

export default WithDetails;
