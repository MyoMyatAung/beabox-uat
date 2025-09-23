import { useState } from "react";
import { X } from "lucide-react";
import ImgPasswordSetup from "@/assets/img-password-setup.png";
const PasswordSetUpPopUp = () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <>
            {isOpen && (
                <div className="h-screen bg-black/80 w-screen  flex flex-col gap-4 justify-center items-center fixed top-0 z-[9999]">
                    <div className="w-full max-w-[390px] bg-opacity-50 flex flex-col gap-5 items-center justify-center p-4 z-50">
                        <div className="">
                            <div className="w-full">
                                <div className="text-center w-full h-auto">
                                    <img
                                        src={ImgPasswordSetup}
                                        alt="Password Setup Illustration"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="bg-[#161619] rounded-b-3xl p-5 w-full text-center">
                                <h2 className="text-white text-lg font-semibold text-center mb-2">
                                    Dual Access Password Setup
                                </h2>
                                <div className="space-y-3 mb-5">
                                    <div className="flex items-start space-x-2">
                                        <div className="w-1 h-1 bg-white rounded-full mt-3 flex-shrink-0"></div>
                                        <p className="text-white/80 text-sm leading-relaxed text-left">
                                            Set up two different passwords. One
                                            opens a decoy app, the other opens
                                            the real app.
                                        </p>
                                    </div>

                                    <div className="flex items-start space-x-2">
                                        <div className="w-1 h-1 bg-white rounded-full mt-3 flex-shrink-0"></div>
                                        <p className="text-white/80 text-sm leading-relaxed text-left">
                                            In Settings, users can set, remove,
                                            or change the password.
                                        </p>
                                    </div>

                                    <div className="flex items-start space-x-2">
                                        <div className="w-1 h-1 bg-white rounded-full mt-3 flex-shrink-0"></div>
                                        <p className="text-white/80 text-sm leading-relaxed text-left">
                                            You need to clean up app data to
                                            restore password
                                            <span className="text-white font-medium ml-1">
                                                App Info → Clear Data
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <button className="w-full max-w-[250px]  bg-[linear-gradient(324.57deg,#CD3EFF_43.64%,#FFB2E0_100%)] text-white font-medium py-2.5 rounded-2xl hover:from-pink-600 hover:to-purple-700">
                                    Set up now!
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white  hover:bg-opacity-50 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PasswordSetUpPopUp;
