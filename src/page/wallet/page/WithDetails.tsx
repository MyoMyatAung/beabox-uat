import React, { useEffect, useState } from "react";
import "../wallet.css";
import PayPick from "./PayPick";
import {
  usePostWalletWithdrawlMutation,
  useWallUploadImageMutation,
} from "@/store/api/wallet/walletApi";
// import { useGetMyProfileQuery } from "@/store/api/profileApi";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
import loader from "../../home/vod_loader.gif";
import Upload from "../comp/Upload";
import { useDispatch } from "react-redux";
import { showToast } from "@/page/home/services/errorSlice";
import { cn } from "@/lib/utils";

interface WithDetailsProps {
  payment: any;
  dollar_withdraw_rate: any;
  data: any;
  setActiveTab: any;
  refetch: any;
  balance: any;
  config: any;
}

const WithDetails: React.FC<WithDetailsProps> = ({
  payment,
  data,
  dollar_withdraw_rate,
  setActiveTab,
  refetch,
  balance,
  config,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [bankAccountNumber, setBankAccountNumber] = useState<string>("");
  const [bankAccountName, setBankAccountName] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [selectedPaymentID, setSelectedPaymentID] = useState<any>();
  const [postWalletWithdrawl, { isLoading }] = usePostWalletWithdrawlMutation();
  const [expectedAmount, setExpectedAmount] = useState<number>(0);
  const [bankInfo, setBankInfo] = useState<{ [key: string]: string }>({});
  const [uploadImage, { isLoading: uploadLoading }] =
    useWallUploadImageMutation();
  // console.log(" this is mf", data);
  const rule = config?.data?.withdraw_rule;
  const minWithdrawAmount = config?.data?.withdraw_minimum_amount;
  const withdrawFee = config?.data?.withdraw_fee;

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  const handleBankInfoChange = (fieldKey: string, value: string) => {
    setBankInfo((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };
  const dispatch = useDispatch();
  // console.log(images);

  // Set default payment method when component mounts or payment data changes
  useEffect(() => {
    if (payment && payment.length > 0 && !selectedPaymentID) {
      const defaultPayment = payment[0];
      setSelectedPaymentID(defaultPayment);
      setSelectedPayment(defaultPayment.id || "");
    }
  }, [payment, selectedPaymentID]);

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

    // Only allow whole numbers (no decimals)
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue) || numericValue < 0) {
      return;
    }

    setAmount(numericValue.toString());

    if (dollar_withdraw_rate?.coins && dollar_withdraw_rate?.dollars) {
      const rate = dollar_withdraw_rate.dollars / dollar_withdraw_rate.coins;
      setExpectedAmount(numericValue * rate);
    }
  };

  // Calculate withdrawal amounts
  const calculateWithdrawalAmounts = () => {
    if (!amount || !withdrawFee) {
      return {
        serviceFeeAmount: 0,
        amountToReceive: 0,
      };
    }

    const numericAmount = Number(amount);
    const feePercentage = Number(withdrawFee) / 100;
    const serviceFeeAmount = Math.floor(numericAmount * feePercentage);
    const amountToReceive = numericAmount - serviceFeeAmount;

    return {
      serviceFeeAmount,
      amountToReceive,
    };
  };

  const { serviceFeeAmount, amountToReceive } =
    calculateWithdrawalAmounts() || {
      serviceFeeAmount: 0,
      amountToReceive: 0,
    };

  const isFormValid =
    // Ensure balance is greater than or equal to amount
    amount <= data.data?.total_income &&
    // Ensure amount meets minimum withdrawal requirement
    Number(amount) >= (minWithdrawAmount || 0) &&
    images.length !== 0 &&
    amount !== "" && // Ensure amount is not empty
    selectedPayment !== "" &&
    selectedPaymentID?.fields?.every(
      (ff: any) =>
        !ff.required || (bankInfo[ff.key] && bankInfo[ff.key].trim() !== "")
    );

  // const submitHandler = async (e: { preventDefault: () => void }) => {
  //   e.preventDefault();
  //   // if (balance < amount) {
  //   //   console.log(balance, amount);
  //   //   return;
  //   // }

  //   if (!isFormValid) {
  //     return;
  //   } else {
  //     const formData = {
  //       amount: amount,
  //       payment_method_id: selectedPaymentID.id,
  //       // reference_id: data?.data.id,
  //       payment_info: bankInfo,
  //     };
  //     try {
  //       const { data, error } = await postWalletWithdrawl({ formData });
  //       if (error) {
  //         const parsed =
  //           typeof error?.data === "string"
  //             ? JSON.parse(error?.data)
  //             : error?.data;
  //         dispatch(
  //           showToast({
  //             message: parsed?.message,
  //             type: "error",
  //           })
  //         );
  //       }

  //       // console.log(data);
  //       if (data) {
  //         console.log(data)
  //         refetch();
  //         setActiveTab(2);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       // toast({
  //       //   description: "nternal server error occurred. Please try again later.",
  //       // });
  //     }
  //   }
  // };
  // console.log(selectedPaymentID?.fields);

  const submitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(isFormValid);
    // if (!isFormValid) return;

    if (Number(amount) < (minWithdrawAmount || 0)) {
      dispatch(
        showToast({
          message: `最低提现金额为${minWithdrawAmount}元`,
          type: "error",
        })
      );
      return;
    }

    if (amount > data.data?.total_income) {
      console.log(data.data?.total_income, amount);
      dispatch(
        showToast({
          message: "INSUFFICIENT BALANCE",
          type: "error",
        })
      );
      return;
    }

    try {
      // 1. Convert all files to base64 in parallel
      const base64Files = await Promise.all(
        images.map((file) => toBase64(file))
      );

      // 2. Upload all base64 files in parallel
      const uploadResults = await Promise.all(
        base64Files.map((base64) =>
          uploadImage({ filePath: "withdrawl", file: base64 }).unwrap()
        )
      );

      // 3. Extract URLs from upload responses
      const uploadedUrls = uploadResults.map((res) => res.data);

      // 4. Submit form with uploaded URLs
      const formData = {
        amount: amount,
        payment_method_id: selectedPaymentID.id,
        payment_info: bankInfo,
        files: uploadedUrls,
      };

      const { data, error } = await postWalletWithdrawl({ formData });

      if (error) {
        const parsed =
          typeof error?.data === "string"
            ? JSON.parse(error?.data)
            : error?.data;

        dispatch(
          showToast({
            message: parsed?.message || "Something went wrong",
            type: "error",
          })
        );
      }

      if (data) {
        dispatch(
          showToast({
            message: data.message || "Withdrawal submitted successfully",
            type: "success",
          })
        );
        refetch();
        setActiveTab(2);
      }
    } catch (error) {
      dispatch(
        showToast({
          message: "Internal server error occurred. Please try again later.",
          type: "error",
        })
      );
    }
  };

  useEffect(() => {
    if (isLoading || uploadLoading) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = ""; // Re-enable scroll
    }

    return () => {
      document.body.style.overflow = ""; // Cleanup
    };
  }, [isLoading, uploadLoading]);

  return (
    <div>
      <Toaster />

      {isLoading || uploadLoading ? (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center pointer-events-auto">
          <img src={loader} alt="Loading..." className="w-[70px] h-[70px]" />
        </div>
      ) : (
        ""
      )}

      <form onSubmit={submitHandler} className="flex flex-col gap-[32px]">
        {/* amount */}
        <div>
          <label className="text-white text-[16px] font-[400] leading-[20px]">
            {/* Withdraw amount */}
            提现金额 <span className=" text-[#FF3B65]">*</span>
          </label>
          <input
            required
            value={amount}
            // onChange={(e) => setAmount(e.target.value)}
            onChange={handleAmountChange}
            // placeholder={`请输入金额（ ${
            //   dollar_withdraw_rate?.min_coins
            //     ? dollar_withdraw_rate.min_coins
            //     : "100"
            // } 的倍数 )`}
            placeholder={`最低提现金额为${minWithdrawAmount}元`}
            className="withdraw_input bg-transparent focus:outline-none pt-[10px] pb-[10px] w-full text-white text-[16px] font-[400] leading-[20px]"
            type="number"
            step="1"
            min="0"
            pattern="[0-9]*"
          />

          <p className="hidden py-[5px] text-[#777] font-[300] text-[14px]">
            For every withdrawl, {withdrawFee ?? 0}% will be deducted as a
            service fee
          </p>
          <p
            className={cn("hidden text-sm mt-2", {
              "text-[#777]": Number(amount) <= 0,
            })}
          >
            You Will Receive ={" "}
            {Number(amount) > 0 ? (
              <>
                <span className="text-[#CD3EFF]">
                  {amountToReceive.toFixed(2)}
                </span>
                ¥
              </>
            ) : (
              "---"
            )}
          </p>
          <p
            className={cn("hidden text-sm mt-1", {
              "text-[#777]": Number(amount) <= 0,
            })}
          >
            Service Fee ={" "}
            {Number(amount) > 0 ? (
              <>
                <span className="text-[#CD3EFF]">{serviceFeeAmount}</span>¥ (
                {withdrawFee ?? 0}%)
              </>
            ) : (
              "0%"
            )}
          </p>

          <p className="py-[5px] hidden text-[#777] font-[300] text-[14px]">
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

        {/* upload */}
        <div className="">
          <label className="text-white text-[16px] font-[400] leading-[20px]">
            上传证明截图 ({images.length}/10){" "}
            <span className=" text-[#FF3B65]">*</span>
          </label>

          <Upload images={images} setImages={setImages} />
        </div>
        {/* rules */}
        <div>
          <label className="text-white text-[16px] font-[400] leading-[20px]">
            撤回规则
          </label>
          <div className="flex flex-col gap-[20px] pt-[10px] text-[#888] text-[14px] font-[300] leading-[18px]">
            {rule?.map((rr: any) => (
              <p>{rr.rule}</p>
            ))}
          </div>
        </div>
        {/* button */}
        <button
          type="submit"
          className={`rounded-[16px] flex justify-center items-center ${
            isLoading ? " opacity-40" : " opacity-100 py-[12px] px-[16px]"
          }  text-white text-[14px] font-[600] leading-[22px] w-full ${
            isFormValid ? "with_new_btn" : "bg-white/10"
          }`}
          //   disabled={!isFormValid}
        >
          确认提现
        </button>
      </form>
    </div>
  );
};

export default WithDetails;
