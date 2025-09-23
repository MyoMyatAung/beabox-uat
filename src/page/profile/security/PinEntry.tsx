import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Delete, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PasswordSetUpPopUp from "@/layouts/PasswordSetUpPopUp";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PinEntryProps {
    onPinComplete?: (pin: string) => void;
    onPinChange?: (pin: string) => void;
    maxLength?: number;
}

const PinEntryBox: React.FC<PinEntryProps> = ({
    onPinComplete,
    onPinChange,
    maxLength = 6,
}) => {
    const [pin, setPin] = useState<string>("");
    const [error, setError] = useState(false);
    const [wrongAttempts, setWrongAttempts] = useState<number>(() => {
        const stored = localStorage.getItem("wrongAttempts");
        return stored ? parseInt(stored, 10) : 0;
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("wrongAttempts", wrongAttempts.toString());
    }, [wrongAttempts]);

    const navigate = useNavigate();

    const validatePin = (entered: string) => {
        if (entered === "123456") {
            onPinComplete?.(entered);
            setError(false);
            setWrongAttempts(0);
            localStorage.setItem("wrongAttempts", "0");
        } else {
            setError(true);
            const newAttempts = wrongAttempts + 1;
            setWrongAttempts(newAttempts);

            if (newAttempts >= 3) {
                navigate("/login");
            }
        }
    };

    const handleNumberPress = (num: string) => {
        if (wrongAttempts >= 3) return;
        if (error) {
            setPin(num);
            setError(false);
            onPinChange?.(num);
            return;
        }
        if (pin.length < maxLength) {
            const newPin = pin + num;
            setPin(newPin);
            onPinChange?.(newPin);

            if (newPin.length === maxLength) {
                validatePin(newPin);
            }
        }
    };

    const handleDelete = () => {
        if (wrongAttempts >= 3) return;
        const newPin = pin.slice(0, -1);
        setPin(newPin);
        onPinChange?.(newPin);
    };

    const handleDone = () => {
        if (wrongAttempts >= 3) return;
        if (pin.length > 0) {
            validatePin(pin);
        }
    };

    const renderPinDots = () => {
        return Array.from({ length: maxLength }, (_, index) => (
            <div
                key={index}
                className={`w-10 h-10 sm:w-12 sm:h-12 bg-[#16131C] rounded-full flex items-center justify-center text-white font-semibold text-lg
          ${error ? "!text-[#F70F2D]" : "text-white"}`}
            >
                {index < pin.length ? (
                    pin[index]
                ) : (
                    <Minus className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                )}
            </div>
        ));
    };

    const renderNumberButton = (num: string) => (
        <Button
            key={num}
            variant="ghost"
            size="lg"
            disabled={wrongAttempts >= 3}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1E1A26] text-white text-2xl font-bold hover:bg-white/10 active:bg-white/20 px-0"
            onClick={() => handleNumberPress(num)}
        >
            {num}
        </Button>
    );

    return (
        <div className="w-full min-h-screen mx-auto bg-[linear-gradient(324.57deg,#CD3EFF_43.64%,#FFB2E0_100%)] overflow-hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="px-4 sm:px-6 py-[5%] mb-[5%]">
                <h1 className="text-white text-lg  font-bold text-center mb-6">
                    Enter Your Pin
                </h1>

                {/* PIN Dots Display */}
                <div className="flex justify-center space-x-2 sm:space-x-3">
                    {renderPinDots()}
                </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center text-white/90 text-sm sm:text-base mb-3">
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <span
                            className="font-medium border-b-2 border-white pb-0.5 cursor-pointer text-base"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            Forget password?
                        </span>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="bg-[#16131C] border-0 text-white sm:max-w-[320px] max-w-[300px] mx-auto rounded-2xl px-0 py-0 ">
                        <AlertDialogHeader className="text-center space-y-2 px-6 py-5">
                            <AlertDialogTitle>
                                <div className="w-8 h-8 flex items-center justify-center mx-auto">
                                    <ShieldAlert className="w-8 h-8 text-[#CD3EFF]" />
                                </div>
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-white text-base font-medium text-center">
                                <p className="text-gray-300 text-base font-normal leading-relaxed text-center">
                                    Forget password? You need to clean up app
                                    data to restore password
                                </p>
                                App Info → Clear Data
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter className="flex !items-center !justify-between !p-0 border-t-[1px] border-gray-500 !flex-row">
                            <AlertDialogCancel
                                onClick={() => setIsDialogOpen(false)}
                                className="!w-50% !bg-transparent !mx-auto  text-base !border-none  text-white hover:text-white-300 hover:bg-transparent font-medium px-5 py-7 focus:outline-none focus-visible:ring-0 focus-visible:shadow-none focus-visible:ring-transparent focus-visible:ring-offset-0"
                            >
                                Cancel
                            </AlertDialogCancel>
                            <div className="w-[0.5px] h-full bg-gray-500 mx-1" />
                            <AlertDialogAction
                                onClick={() => {
                                    console.log(
                                        "User acknowledged - clearing app data..."
                                    );
                                    setIsDialogOpen(false);
                                }}
                                className="!w-50% bg-transparent !mx-auto  text-base !border-none text-[#CD3EFF] hover:text-purple-300 hover:bg-transparent font-medium px-5 py-7"
                            >
                                Understand
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* Number Pad */}
            <div className="bg-[#16131C] rounded-t-[32px] sm:rounded-t-[48px] flex-grow relative pb-6 flex flex-col items-center">
                {/* Error Message */}
                {error && wrongAttempts < 3 && (
                    <p className="text-[#F70F2D] text-base text-center font-normal absolute top-[6%] left-0 right-0">
                        Wrong PIN
                    </p>
                )}

                <p className="text-white/80 text-center text-base pt-[20%] pb-[20%] md:pt-[5%] md:pb-[5%] font-normal">
                    Please Enter Your Pin
                </p>

                {/* Number Grid */}
                <div className="grid grid-cols-3 gap-x-6 sm:gap-x-10 gap-y-4 mb-6 justify-items-center w-full max-w-[350px]">
                    {["1", "2", "3"].map(renderNumberButton)}
                    {["4", "5", "6"].map(renderNumberButton)}
                    {["7", "8", "9"].map(renderNumberButton)}
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-3 gap-x-6 sm:gap-x-10 items-center justify-items-center w-full max-w-[350px]">
                    <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-[#1E1A26] rounded-full text-white text-lg font-bold ${
                            wrongAttempts < 3
                                ? "hover:bg-white/10 active:bg-white/20 cursor-pointer"
                                : "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={handleDelete}
                    >
                        <Delete size={32} className="hover:text-black/80" />
                    </div>

                    {renderNumberButton("0")}

                    <Button
                        variant="ghost"
                        size="lg"
                        disabled={wrongAttempts >= 3}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1E1A26] text-white text-sm sm:text-base font-bold hover:bg-white/10 active:bg-white/20 px-0"
                        onClick={handleDone}
                    >
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Demo wrapper
const PinEntry: React.FC = () => {
    return (
        <>
            <div className="w-full min-h-screen bg-[#16131C] overflow-hidden">
                <div className="space-y-6">
                    <PinEntryBox
                        onPinComplete={(pin) => {
                            console.log(pin);
                        }}
                    />
                </div>
            </div>
            <PasswordSetUpPopUp />
        </>
    );
};

export default PinEntry;
