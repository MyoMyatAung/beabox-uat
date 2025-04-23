/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  setAlertText,
  setAuthToggle,
  setIsDrawerOpen,
  setShowAlert,
} from "@/store/slices/profileSlice";
import { paths } from "@/routes/paths";
import { ChevronLeft, Eye, EyeOff, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { LoginFormData, loginSchema } from "@/page/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import loader from "@/page/home/vod_loader.gif";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetCaptchaMutation,
  useRegisterMutation,
} from "@/store/api/authApi";
import { useDispatch } from "react-redux";
import { setRegisterUser, setUser } from "@/store/slices/persistSlice";
import Shield from "@/assets/profile/shield.png";
import Portal from "./Portal";
import AuthError from "@/components/shared/auth-error";

const RegisterForm = ({ setIsOpen }: any) => {
  const [flashLoading, setflashLoading] = useState(false);

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [show验证码, setShow验证码] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [getCaptcha, { data, isLoading }] = useGetCaptchaMutation();
  const [
    register,
    { isLoading: registerLoading, data: rdata, error: rerror, isError },
  ] = useRegisterMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authErr = localStorage.getItem("auth-error") || "验证码错误";

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  // useEffect(() => {
  //   if (data) {
  //     console.log(data, "data");
  //   }
  // }, [data]);
  const { watch } = form;
  const emailOrPhoneValue = watch("emailOrPhone");
  const passwordValue = watch("password");
  async function onSubmit(data: LoginFormData) {
    // Handle form submission
    // await getCaptcha();
    // setShow验证码(true);
  }

  const handleVerify = async (e: any) => {
    // Add 验证码 logic here
    setflashLoading(true);

    e.stopPropagation();
    e.preventDefault();
    const { emailOrPhone, password } = form.getValues();
    const { data: registerData, error: registerError } = await register({
      username: emailOrPhone,
      password,
      captcha,
      captcha_key: data?.data?.captcha_key,
      referral_code: code,
    });
    // console.log(registerData, "registerData");
    if (registerData?.status) {
      dispatch(setUser(registerData?.data));
      dispatch(setIsDrawerOpen(false));
      dispatch(setShowAlert(true));
      dispatch(setAlertText(registerData?.message));
      dispatch(setIsDrawerOpen(false));
      setShow验证码(false);
      setflashLoading(false);
      setIsOpen(false);
    }
  };
  const errorHandler = async () => {
    if (rerror?.originalStatus == 400) {
      setError("");
      setflashLoading(false);
      setShow验证码(false);
      setError("该用户名已存在");
      setCaptcha("");
    }
    if (rerror?.originalStatus == 422) {
      setError("");
      setShow验证码(false);
      setflashLoading(true);
      setError("验证码错误");
      setCaptcha("");
      await getCaptcha("");
      setflashLoading(false);

      setShow验证码(true);
    }
  };

  useEffect(() => {
    errorHandler();
  }, [rerror]);
  return (
    <>
      {(registerLoading && !show验证码) || isLoading || flashLoading ? (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-[#00000099] flex justify-center items-center">
            <div className="bg-[#000000E5] p-1 rounded">
              <img src={loader} alt="Loading" className="w-14" />
            </div>
          </div>
        </Portal>
      ) : null}
      {/* {(isLoading && !show验证码) || isLoading ? (
        <div className="h-screen bg-[#00000099] fixed top-0 left-0 w-full z-[9999] flex justify-center items-center">
          <div className="bg-[#000000E5] p-1 rounded">
            <img src={loader} alt="" className="w-14" />
          </div>
        </div>
      ) : (
        <></>
      )} */}
      <div className="px-5">
        {isError ? <AuthError message={error} /> : <></>}

        <div className="flex justify-between items-center">
          <div className="px-3"></div>
          <p className="text-[18px]">
            创建账户
            {/* Register */}
          </p>
          <div
            onClick={() => {
              // setIsOpen(false);
              dispatch(setIsDrawerOpen(false));
              dispatch(setAuthToggle(true));
            }}
            className="bg-[#FFFFFF0A] p-2 rounded-full"
          >
            <X size={18} />
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 pt-5 pb-10"
          >
            <FormField
              control={form.control}
              name="emailOrPhone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <label htmlFor="" className="text-[14px] text-[#888]">
                        用户名
                      </label>
                      <div className="relative">
                        <input
                          className="block w-full  py-2 text-white bg-transparent bg-clip-padding transition ease-in-out m-0 focus:text-white focus:bg-transparent focus:outline-none "
                          placeholder="输入用户名"
                          {...field}
                        />
                        {field.value && (
                          <div
                            className="w-6 h-6 rounded-full flex justify-center items-center bg-[#FFFFFF1F] absolute right-0 bottom-2"
                            onClick={() => {
                              field.onChange("");
                            }}
                          >
                            <X size={9} />
                          </div>
                        )}
                        <div className="w-full h-[1px] bg-[#FFFFFF0A]"></div>
                      </div>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormControl>
                    <>
                      <label htmlFor="" className="text-[14px] text-[#888]">
                        密码
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="block w-full  py-2 text-white bg-transparent bg-clip-padding transition ease-in-out m-0 focus:text-white focus:bg-transparent focus:outline-none "
                          placeholder="密码必须是8-25个字符"
                          {...field}
                          maxLength={25}
                        />
                        <button
                          className=" absolute right-0 bottom-2"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowPassword(!showPassword);
                          }}
                        >
                          {showPassword ? (
                            <Eye className="w-[18px]" />
                          ) : (
                            <EyeOff className="w-[18px]" />
                          )}
                        </button>
                        <div className="w-full h-[1px] bg-[#FFFFFF0A]"></div>
                      </div>
                    </>
                  </FormControl>
                  <FormMessage />
                  {/* <FormMessage>{error}</FormMessage> */}
                </FormItem>
              )}
            />

            {/* <h1 className="mt-4 text-red-500 text-sm">{error}</h1> */}

            <input
              type="text"
              // placeholder="Enter Promotion Code (Optional)"
              placeholder="用户名输入邀请码（可选）"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-[#37363A] border-0 rounded-lg text-white placeholder:text-gray-600 px-4 py-4 text-center placeholder:text-center w-full outline-none"
            />

            <div className="">
              <Button
                // type="submit"
                disabled={
                  isLoading ||
                  !emailOrPhoneValue ||
                  !passwordValue ||
                  passwordValue?.length < 8 ||
                  passwordValue?.length > 25
                }
                onClick={async () => {
                  await getCaptcha("");
                  setShow验证码(true);
                }}
                className="w-full gradient-bg rounded-lg hover:gradient-bg"
              >
                {/* {isLoading ? <SmallLoader /> : "确认"} */}
                确认
                {/* Continue */}
              </Button>
            </div>
            <Dialog open={show验证码} onOpenChange={setShow验证码}>
              <DialogContent className="bg-[#393641] z-[3000] border-0 shadow-lg rounded-lg max-w-[300px]">
                <DialogHeader>
                  <DialogTitle className="text-white text-[16px]">
                    {/* 验证码 */}
                    验证码
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex justify-center items-center gap-1 h-[36px]">
                    <input
                      value={captcha}
                      onChange={(e) => setCaptcha(e.target.value)}
                      placeholder="输入验证码"
                      className="bg-[#2D2738] w-[70%] px-[10px] h-full outline-none"
                    />

                    <img
                      src={data?.data?.img}
                      className="w-[30%]  h-full  object-center outline-none border-gray-400"
                      alt=""
                    />
                  </div>
                  {/* <div
                  onClick={async (e) => {
                    e.stopPropagation();
                    await getCaptcha("");
                    console.log("get new");
                  }}
                  className="flex items-center gap-2"
                >
                  <RotateCcw
                    size={14}
                    className={`${isLoading ? "animate-spin" : ""}`}
                  />
                  <p className="text-[12px] text-[#bbb]">刷新</p>
                </div> */}
                  <Button
                    onClick={handleVerify}
                    disabled={
                      registerLoading ? true : false || !captcha?.length
                    }
                    type="submit"
                    className="w-full gradient-bg hover:gradient-bg text-white rounded-lg"
                  >
                    {/* {registerLoading ? <SmallLoader /> : "确认"} */}
                    确认
                    {/* Verify */}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={showSecurity} onOpenChange={setShowSecurity}>
              <DialogContent className="bg-[#242424] max-w-[340px] border-0 rounded-[16px]">
                <DialogHeader>
                  <DialogTitle className="text-white text-[16px]">
                    Security Question
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <img src={Shield} className="w-[77px] mx-auto" alt="" />
                  <p className="text-[14px]">
                    Set up security question to protect your account from lost
                    or forgotten passwords and theft. You can also choose to do
                    this later.
                  </p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => navigate(paths.security_questions)}
                      className="w-full gradient-bg rounded-[16px] hover:gradient-bg"
                    >
                      Continue
                    </Button>
                    <Button
                      onClick={() => navigate(paths.login)}
                      className="w-full bg-[#444444] rounded-[16px] hover:bg-[#444444]"
                    >
                      Later
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </form>
        </Form>
      </div>
    </>
  );
};

export default RegisterForm;
