import { Button } from "@/components/ui/button";
import { paths } from "@/routes/paths";
import { ChevronLeft } from "lucide-react";
import { KeyboardEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";

const OTP = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle input change
  const handleChange = (index: number, value: string) => {
    if (value?.length > 1) return; // Prevent multiple character input

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="px-5">
      <div className="flex justify-between items-center py-5">
        <Link to={paths.profile}>
          <ChevronLeft />
        </Link>
        <p className="text-[16px]">OTP 验证码</p>
        <div></div>
      </div>
      <form className="space-y-8 py-5">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 rounded-[12px] text-center text-xl bg-[#FFFFFF14] border-[#FFFFFF14] text-white outline-none"
            />
          ))}
        </div>
        <p className="text-[#888] text-[14px] w-full">
          验证码 code sent to{" "}
          <span className="text-white">starx@gmail.com</span>. Please check your
          messages and be sure to check your spam folder.
        </p>
        <Button
          type="submit"
          className="gradient-bg w-full rounded-lg hover:gradient-bg"
        >
          Send OTP
        </Button>
      </form>
    </div>
  );
};

export default OTP;
