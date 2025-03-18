import React, { useState } from "react";
import "../wallet.css";
import PayPick from "./PayPick";
import { usePostWalletWithdrawlMutation } from "@/store/api/wallet/walletApi";
// import { useGetMyProfileQuery } from "@/store/api/profileApi";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
import loader from "../../home/vod_loader.gif";

interface WithDetailsProps {
  payment: any;
  dollar_withdraw_rate: any;
  data: any;
  setActiveTab: any;
  refetch: any;
  balance: any;
}

const WithDetails: React.FC<WithDetailsProps> = ({
  payment,
  data,
  dollar_withdraw_rate,
  setActiveTab,
  refetch,
  balance,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [bankAccountNumber, setBankAccountNumber] = useState<string>("");
  const [bankAccountName, setBankAccountName] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [selectedPaymentID, setSelectedPaymentID] = useState<any>();
  const [postWalletWithdrawl, { isLoading }] = usePostWalletWithdrawlMutation();
  const [expectedAmount, setExpectedAmount] = useState<number>(0);
  const [bankInfo, setBankInfo] = useState<{ [key: string]: string }>({});
  const handleBankInfoChange = (fieldKey: string, value: string) => {
    setBankInfo((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  const handlePaymentChange = (paymentID: any) => {
    setSelectedPaymentID(paymentID);
    setSelectedPayment(paymentID?.id || "");
    setBankInfo({}); // Reset bank info when changing payment method
  };

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

  const isFormValid =
    balance >= amount && // Ensure balance is greater than or equal to amount
    amount !== "" && // Ensure amount is not empty
    selectedPayment !== "" &&
    selectedPaymentID?.fields?.every(
      (ff: any) =>
        !ff.required || (bankInfo[ff.key] && bankInfo[ff.key].trim() !== "")
    );

  const submitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (balance < amount) {
      console.log(balance, amount);
      return;
    }

    if (!isFormValid) {
      return;
    } else {
      const formData = {
        amount: amount,
        payment_method_id: selectedPaymentID.id,
        // reference_id: data?.data.id,
        payment_info: bankInfo,
      };
      try {
        const { data } = await postWalletWithdrawl({ formData });
        // console.log(data);
        if (!data) {
          throw new Error();
        } else {
          refetch();
          setActiveTab(2);
        }
      } catch (error) {
        console.log(error);
        // toast({
        //   description: "nternal server error occurred. Please try again later.",
        // });
      }
    }
  };
  // console.log(selectedPaymentID?.fields);

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
            placeholder={`请输入金额（ ${
              dollar_withdraw_rate?.min_coins
                ? dollar_withdraw_rate.min_coins
                : "100"
            } 的倍数 )`}
            className="withdraw_input bg-transparent focus:outline-none pt-[20px] pb-[10px] w-full text-white text-[16px] font-[400] leading-[20px]"
            type="number"
          />
          <p className="py-[5px] text-[#777] font-[300] text-[14px]">
            {dollar_withdraw_rate?.coins ? dollar_withdraw_rate?.coins : "100"}{" "}
            硬币 ={" "}
            {dollar_withdraw_rate?.dollars
              ? dollar_withdraw_rate?.dollars
              : "1"}
            $
            <br />
            {/* Expect to receive = --- */}
            期待收到 ={" "}
            <span className=" text-white">
              {" "}
              {expectedAmount.toFixed(2)}$
            </span>{" "}
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
            setSelectedPayment={handlePaymentChange}
            setSelectedPaymentID={handlePaymentChange}
            // onSelect={setSelectedPayment}
          />
        </div>
        {/* bank info */}
        <div>
          <label className="text-white text-[16px] font-[400] leading-[20px]">
            {/* Bank information */}
            银行信息
          </label>
          {selectedPaymentID?.fields?.map((ff: any, index: any) => (
            <div key={index} className=" flex flex-col gap-[12px]">
              <input
                required={ff.required}
                value={bankInfo[ff.key] || ""} // onChange={(e) => setBankAccountNumber(e.target.value)}
                onChange={(e) => handleBankInfoChange(ff.key, e.target.value)}
                placeholder={ff.label}
                className="withdraw_input bg-transparent focus:outline-none pt-[20px] pb-[10px] w-full text-white text-[16px] font-[400] leading-[20px]"
                type={ff.type === "integer" ? "number" : ff.type}
              />
            </div>
          ))}
        </div>
        {/* rules */}
        <div>
          <label className="text-white text-[16px] font-[400] leading-[20px]">
            撤回规则
          </label>
          <div className="flex flex-col gap-[20px] pt-[10px] text-[#888] text-[12px] font-[300] leading-[18px]">
            <p>1.每次提现最低限额为300元，且只能提现100的整数倍</p>
            <p>2.原创作者获得60%的收益，UP主获得35%的收益</p>
            <p>3.仅支持银行卡提现，收款账号和姓名必须一致，款项24小时内到账</p>
          </div>
        </div>
        {/* button */}
        <button
          type="submit"
          className={`rounded-[16px] flex justify-center items-center ${
            isLoading ? " opacity-40" : " opacity-100 py-[12px] px-[16px]"
          }  text-white text-[14px] font-[600] leading-[22px] w-full ${
            isFormValid
              ? " bg-gradient-to-tl from-[#CD3EFF] to-[#FFB2E0]"
              : "bg-white/10"
          }`}
          //   disabled={!isFormValid}
        >
          {isLoading ? (
            <img src={loader} alt="" className="w-12" />
          ) : (
            "确认提现"
          )}
        </button>
      </form>
    </div>
  );
};

export default WithDetails;
