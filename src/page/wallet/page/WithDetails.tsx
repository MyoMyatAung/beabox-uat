import React, { useState } from "react";
import "../wallet.css";
import PayPick from "./PayPick";
import { usePostWalletWithdrawlMutation } from "@/store/api/wallet/walletApi";
import { useGetMyProfileQuery } from "@/store/api/profileApi";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface WithDetailsProps {
  payment: any;
  dollar_withdraw_rate: any;
  data: any;
}

const WithDetails: React.FC<WithDetailsProps> = ({
  payment,
  data,
  dollar_withdraw_rate,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [bankAccountNumber, setBankAccountNumber] = useState<string>("");
  const [bankAccountName, setBankAccountName] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [selectedPaymentID, setSelectedPaymentID] = useState<any>();
  const [postWalletWithdrawl] = usePostWalletWithdrawlMutation();
  const [expectedAmount, setExpectedAmount] = useState<number>(0);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setAmount("");
      setExpectedAmount(0);
      return;
    }

    const numericValue: any = Number(value);
    setAmount(numericValue);

    if (dollar_withdraw_rate?.coins && dollar_withdraw_rate?.dollars) {
      const rate = dollar_withdraw_rate.dollars / dollar_withdraw_rate.coins;
      setExpectedAmount(numericValue * rate);
    }
  };

  const isFormValid = amount !== "" && bankAccountNumber !== "";
  bankAccountName.length !== 0 && selectedPayment !== "";

  const submitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!isFormValid) {
      return;
    } else {
      const formData = {
        amount: amount,
        payment_method_id: selectedPaymentID,
        reference_id: data?.data.id,
      };
      // console.log(formData);
      try {
        const { data } = await postWalletWithdrawl({ formData });
        if (!data) {
          throw new Error();
        }
      } catch (error) {
        toast({
          description: "nternal server error occurred. Please try again later.",
        });
      }
    }
  };

  return (
    <div>
      <Toaster />

      <form onSubmit={submitHandler} className="flex flex-col gap-[32px]">
        {/* amount */}
        <div>
          <label className="text-white text-[16px] font-[400] leading-[20px]">
            {/* Withdraw amount */}
            提现金额
          </label>
          <input
            required
            value={amount}
            // onChange={(e) => setAmount(e.target.value)}
            onChange={handleAmountChange}
            placeholder={`请输入金额（ ${dollar_withdraw_rate?.min_coins} 的倍数）`}
            className="withdraw_input bg-transparent focus:outline-none pt-[20px] pb-[10px] w-full text-white text-[16px] font-[400] leading-[20px]"
            type="number"
          />
          <p className="py-[5px] text-[#777] font-[300] text-[14px]">
            {dollar_withdraw_rate?.coins} 硬币 = {dollar_withdraw_rate?.dollars}
            $
            <br />
            {/* Expect to receive = --- */}
            期待收到 = {expectedAmount.toFixed(2)}$
          </p>
        </div>
        {/* payment */}
        <div>
          <label className="text-white text-[16px] font-[400] leading-[20px]">
            付款方式
          </label>
          <PayPick
            selectedPaymentID={selectedPaymentID}
            payment={payment}
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            setSelectedPaymentID={setSelectedPaymentID}
            // onSelect={setSelectedPayment}
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
            isFormValid
              ? " bg-gradient-to-tl from-[#CD3EFF] to-[#FFB2E0]"
              : "bg-white/10"
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
