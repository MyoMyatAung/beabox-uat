import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Minus, Delete, ShieldAlert } from "lucide-react";
import { decodePassword } from "@/lib/utils";
import { showToast } from "@/page/home/services/errorSlice";
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
import { setIsPasswordCorrect } from "@/store/slices/persistSlice";

interface PinEntryProps {
    onPinComplete?: (pin: string, type: "master" | "decoy") => void;
    onPinChange?: (pin: string) => void;
    maxLength?: number;
}

const PinEntryBox: React.FC<PinEntryProps> = ({
    onPinComplete,
    onPinChange,
    maxLength = 6,
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pin, setPin] = useState<string>("");
    const [error, setError] = useState(false);
    const [lastIndex, setLastIndex] = useState<number | null>(null);

    // wrong attempts
    const [wrongAttempts, setWrongAttempts] = useState<number>(() => {
        const stored = localStorage.getItem("wrongAttempts");
        return stored ? parseInt(stored, 10) : 0;
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("wrongAttempts", wrongAttempts.toString());
    }, [wrongAttempts]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (wrongAttempts >= 3) return;

            if (e.key >= "0" && e.key <= "9") {
                handleNumberPress(e.key);
            } else if (e.key === "Backspace") {
                handleDelete();
            } else if (e.key === "Enter") {
                handleDone();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [pin, wrongAttempts]);

    useEffect(() => {
        if (wrongAttempts >= 3) {
            setWrongAttempts(0);
            localStorage.setItem("wrongAttempts", "0");
        }
    }, []);

    // Redux passwords
    const encodedMasterPassword = useSelector(
        (state: { persist: { masterPassword: string | null } }) =>
            state.persist.masterPassword
    );
    const encodedDecoyPassword = useSelector(
        (state: { persist: { decoyPassword: string | null } }) =>
            state.persist.decoyPassword
    );

    const savedMasterPassword = encodedMasterPassword
        ? decodePassword(encodedMasterPassword)
        : null;

    const savedDecoyPassword = encodedDecoyPassword
        ? decodePassword(encodedDecoyPassword)
        : null;

    const validatePin = (entered: string) => {
        if (savedMasterPassword && entered === savedMasterPassword) {
            setError(false);
            setWrongAttempts(0);
            onPinComplete?.(entered, "master");
            dispatch(setIsPasswordCorrect(true));
            setTimeout(() => setPin(""), 500);
            navigate("/");
        } else if (savedDecoyPassword && entered === savedDecoyPassword) {
            setError(false);
            setWrongAttempts(0);
            onPinComplete?.(entered, "decoy");
            setTimeout(() => setPin(""), 500);
            window.location.href = "https://x.com";
        } else {
            setError(true);
            const newAttempts = wrongAttempts + 1;
            setWrongAttempts(newAttempts);
            setTimeout(() => setPin(""), 500);
            if (newAttempts >= 3) {
                dispatch(
                    showToast({
                        type: "error",
                        message: "尝试次数过多。由于安全原因，您正在被重定向。",
                    })
                );
                setTimeout(() => {
                    window.location.href = "https://www.google.com";
                }, 2000);
            }
        }
    };

    const handleNumberPress = (num: string) => {
        if (wrongAttempts >= 3) return;

        if (error) {
            setPin(num);
            setError(false);
            setLastIndex(0);
            onPinChange?.(num);
            setTimeout(() => setLastIndex(null), 500);
            return;
        }

        if (pin.length < maxLength) {
            const newPin = pin + num;
            setPin(newPin);
            onPinChange?.(newPin);
            const newIndex = newPin.length - 1;
            setLastIndex(newIndex);

            setTimeout(() => {
                setLastIndex(null);
            }, 500);

            if (newPin.length === maxLength) {
                validatePin(newPin);
            }
        }
    };

    const handleDelete = () => {
        if (wrongAttempts >= 3) return;
        setPin(pin.slice(0, -1));
        setLastIndex(null);
    };

    const handleDone = () => {
        if (wrongAttempts >= 3) return;
        if (pin.length > 0) {
            validatePin(pin);
        }
    };

    const renderPinDots = () => {
        return Array.from({ length: maxLength }, (_, index) => {
            const isFilled = index < pin.length;
            const shouldShowDigit = index === lastIndex;

            return (
                <div
                    key={index}
                    className={`w-10 h-10 sm:w-12 sm:h-12 bg-[#16131C] rounded-full flex items-center justify-center text-white font-semibold text-lg ${
                        error ? "!text-[#F70F2D]" : "text-white"
                    }`}
                >
                    {isFilled ? (
                        shouldShowDigit ? (
                            pin[index]
                        ) : (
                            "•"
                        )
                    ) : (
                        <Minus className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    )}
                </div>
            );
        });
    };

    const renderNumberButton = (num: string) => (
        <Button
            key={num}
            variant="ghost"
            size="lg"
            className="w-16 h-16 rounded-full bg-[#1E1A26] text-white text-2xl font-bold hover:bg-white/10 active:bg-white/20 px-0"
            onClick={() => handleNumberPress(num)}
        >
            {num}
        </Button>
    );

    return (
        <div className="w-full min-h-screen mx-auto bg-[linear-gradient(324.57deg,#CD3EFF_43.64%,#FFB2E0_100%)] overflow-hidden shadow-2xl flex flex-col">
            <div className="px-4 sm:px-6 py-[5%] mb-[5%] md:py-[3%] md:mb-[3%]">
                <h1 className="text-white text-lg font-bold text-center mb-6">
                    输入您的密码
                </h1>
                <div className="flex justify-center space-x-2 sm:space-x-3">
                    {renderPinDots()}
                </div>
            </div>

            <div className="text-center text-white/90 text-sm sm:text-base mb-3">
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <span
                            className="font-medium border-b-2 border-white pb-0.5 cursor-pointer text-base"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            忘记密码？
                        </span>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="bg-[#16131C] border-0 text-white sm:max-w-[320px] max-w-[300px] mx-auto rounded-2xl px-0 py-0 ">
                        <AlertDialogHeader className="text-center space-y-2 px-6 py-5">
                            <AlertDialogTitle>
                                <div className="w-8 h-8 flex items-center justify-center mx-auto mb-3">
                                    <ShieldAlert className="w-8 h-8 text-[#CD3EFF]" />
                                </div>
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-white text-base font-medium text-center">
                                <p className="text-gray-300 text-base font-normal leading-relaxed text-center">
                                    忘记密码？您需要清理应用数据才能恢复密码
                                </p>
                                应用信息 → 清除数据
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter className="flex !items-center !justify-between !p-0 border-t-[1px] border-white/10 !flex-row">
                            <AlertDialogCancel
                                onClick={() => setIsDialogOpen(false)}
                                className="!w-50% !bg-transparent !mx-auto  text-base !border-none  text-white hover:text-white-300 hover:bg-transparent font-medium px-5 py-7 focus:outline-none focus-visible:ring-0 focus-visible:shadow-none focus-visible:ring-transparent focus-visible:ring-offset-0"
                            >
                                取消
                            </AlertDialogCancel>
                            <div className="w-[0.5px] h-full bg-white/10 mx-1" />
                            <AlertDialogAction
                                onClick={() => setIsDialogOpen(false)}
                                className="!w-50% bg-transparent !mx-auto  text-base !border-none text-[#CD3EFF] hover:text-purple-300 hover:bg-transparent font-medium px-5 py-7"
                            >
                                明白
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <div className="bg-[#16131C] rounded-t-[32px] sm:rounded-t-[48px] flex-grow relative pb-6 flex flex-col items-center">
                {error && wrongAttempts < 3 && (
                    <p className="text-[#F70F2D] text-base text-center font-normal absolute top-5 md:top-[1.25%] left-0 right-0">
                        密码错误
                    </p>
                )}
                <p className="text-white/80 text-center text-base pt-[52px] pb-[52px] md:pt-[3%] md:pb-[3%] font-normal">
                    请输入您的密码
                </p>

                <div className="grid grid-cols-3 gap-x-7.5 sm:gap-x-10 gap-y-4 mb-6 justify-items-center w-full max-w-[310px]">
                    {["1", "2", "3"].map(renderNumberButton)}
                    {["4", "5", "6"].map(renderNumberButton)}
                    {["7", "8", "9"].map(renderNumberButton)}
                </div>

                <div className="grid grid-cols-3 gap-x-7.5 sm:gap-x-10 items-center justify-items-center w-full max-w-[310px]">
                    <div
                        className={`w-16 h-16 flex items-center justify-center bg-[#1E1A26] rounded-full text-white text-lg font-bold ${
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
                        className="w-16 h-16 rounded-full bg-[#1E1A26] text-white text-sm sm:text-base font-bold hover:bg-white/10 active:bg-white/20 px-0"
                        onClick={handleDone}
                    >
                        完成
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Demo wrapper
const PinEntry: React.FC = () => {
    return (
        <div className="w-full min-h-screen bg-[#16131C] overflow-hidden">
            <PinEntryBox
                onPinComplete={(pin, type) => {
                    console.log(`${type} password entered:`, pin);
                }}
            />
        </div>
    );
};

export default PinEntry;
