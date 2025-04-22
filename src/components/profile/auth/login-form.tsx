// // wrong user name or passwor
// // 用户名或密码错误

// // v code error 验证码错误

import { paths } from "@/routes/paths";
import { Eye, EyeOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { LoginFormData, loginSchema } from "@/page/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useGetCaptchaMutation, useLoginMutation } from "@/store/api/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/persistSlice";
import loader from "@/page/home/vod_loader.gif";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  setAlertText,
  setAuthToggle,
  setIsDrawerOpen,
  setShowAlert,
} from "@/store/slices/profileSlice";
import AuthError from "@/components/shared/auth-error";
import TranLoader from "@/components/shared/tran-loader";
import { log } from "console";
import Portal from "./Portal";
const LoginForm = ({ setIsOpen }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { data: ldata, isLoading, error: lerror, isError }] =
    useLoginMutation();
  const dispatch = useDispatch();
  const authErr = localStorage.getItem("auth-error") || "请输入验证码";

  const [getCaptcha, { data, isLoading: captchaLoading }] =
    useGetCaptchaMutation();
  const [show验证码, setShow验证码] = useState(false);
  const [flashLoading, setflashLoading] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [error, setError] = useState("");
  const [isLoad, setIsLoad] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });
  const { watch } = form;
  const emailOrPhoneValue = watch("emailOrPhone");
  const passwordValue = watch("password");

  async function onSubmit() {
    // if (data?.status) setShow验证码(true);
  }

  const handleVerify = async (e: any) => {
    setflashLoading(true);
    setShow验证码(false);
    e.stopPropagation();
    e.preventDefault();
    const { emailOrPhone, password } = form.getValues();

    const { data: loginData } = await login({
      username: emailOrPhone,
      password,
      captcha,
      captcha_key: data?.data?.captcha_key,
    });
    setIsLoad(false);
    if (loginData?.status) {
      dispatch(setUser(loginData?.data));
      dispatch(setIsDrawerOpen(false));
      dispatch(setShowAlert(true));
      dispatch(setAlertText(loginData?.message));
      setShow验证码(false);
      setflashLoading(false);
      setIsOpen(false);
    }

    // if (!lerror) {
    //   dispatch(setUser(loginData?.data));
    //   dispatch(setIsDrawerOpen(false));
    //   dispatch(setShowAlert(true));
    //   dispatch(setAlertText(loginData?.message));
    //   setShow验证码(false);
    //   setIsOpen(false);
    //   return;
    // }

    // if (lerror) errorHandler();
  };

  // const handleVerify = async (e: any) => {
  //   // Add 验证码 logic here
  //   e.stopPropagation();
  //   e.preventDefault();
  //   const { emailOrPhone, password } = form.getValues();
  //   const { data: loginData } = await login({
  //     username: emailOrPhone,
  //     password,
  //     captcha,
  //     captcha_key: data?.data?.captcha_key,
  //   });
  //   if (loginData?.status) {
  //     dispatch(setUser(loginData?.data));
  //     dispatch(setIsDrawerOpen(false));
  //     dispatch(setShowAlert(true));
  //     dispatch(setAlertText(loginData?.message));
  //     setShow验证码(false);
  //     setIsOpen(false);
  //   } else {
  //     if (lerror?.originalStatus == 401) {
  //       setError("用户名或密码错误");
  //       setShow验证码(false);
  //     } else {
  //       setShow验证码(false);
  //       // setCaptcha("");
  //       // await getCaptcha("");
  //       setShow验证码(true);
  //     }
  //     // if (lerror?.originalStatus == 401) setError("用户名或密码错误");
  //     // setCaptcha("");
  //     // await getCaptcha("");
  //     // setShow验证码(false);
  //   }
  // };

  const openAgain = () =>
    setTimeout(async () => {
      await getCaptcha("");
      setShow验证码(true);
    }, 1000);

  const errorHandler = async () => {
    if (lerror?.originalStatus == 401) {
      setflashLoading(false);
      setShow验证码(false);
      setError("用户名或密码错误");
      setCaptcha("");
    }
    if (lerror?.originalStatus == 422) {
      setError(""); // Clear previous error first

      setflashLoading(true);
      setShow验证码(false);

      setCaptcha("");
      await getCaptcha("");
      setflashLoading(false);
      setError("验证码错误");

      setShow验证码(true);
      setIsLoad(false);
    }
  };

  useEffect(() => {
    errorHandler();
  }, [lerror]);

  return (
    <>
      {(isLoading && !show验证码) || captchaLoading || flashLoading ? (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-[#00000099] flex justify-center items-center">
            <div className="bg-[#000000E5] p-1 rounded">
              <img src={loader} alt="Loading" className="w-14" />
            </div>
          </div>
        </Portal>
      ) : null}

      <div className="px-5">
        {isError ? <AuthError message={error} /> : <></>}
        <div className="flex justify-between items-center">
          <div className="px-3"></div>
          <p className="text-[18px]">
            登录
            {/* Login */}
          </p>
          <div
            onClick={() => {
              dispatch(setIsDrawerOpen(false));
              if (setIsOpen) setIsOpen(false);
            }}
            className="bg-[#FFFFFF0A] p-2 rounded-full cursor-pointer"
          >
            <X size={18} />
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 pb-10 pt-5"
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
                          className="block w-full py-2 text-white bg-transparent bg-clip-padding transition ease-in-out m-0 focus:text-white focus:bg-transparent focus:outline-none "
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
                      <label htmlFor="" className="text-[14px] text-[#777]">
                        密码
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="block w-full py-2 text-white bg-transparent bg-clip-padding transition ease-in-out m-0 focus:text-white focus:bg-transparent focus:outline-none "
                          placeholder="输入您的密码"
                          {...field}
                          maxLength={25}
                        />
                        <button
                          className=" absolute right-0 bottom-2"
                          onClick={(e) => {
                            e.stopPropagation();
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
                </FormItem>
              )}
            />
            <div className="">
              <Button
                disabled={
                  isLoading ||
                  captchaLoading ||
                  !emailOrPhoneValue ||
                  !passwordValue ||
                  passwordValue?.length < 8 ||
                  passwordValue?.length > 25
                }
                // type="submit"
                onClick={async () => {
                  setIsLoad(true);
                  await getCaptcha("");
                  setShow验证码(true);
                  setIsLoad(false);
                }}
                className="w-full gradient-bg rounded-lg hover:gradient-bg"
              >
                {/* {captchaLoading ? <SmallLoader /> : "登录"} */}
                登录
              </Button>
              <div className="flex justify-center">
                <Link
                  to={paths.forgot_password}
                  className="text-center text-[14px] mt-5"
                >
                  忘记密码？
                </Link>
              </div>
            </div>
            <Dialog open={show验证码} onOpenChange={setShow验证码}>
              <DialogContent className="bg-[#393641] z-[3000] border-0 shadow-lg rounded-lg max-w-[300px]">
                <DialogHeader>
                  <DialogTitle className="text-white text-[16px]">
                    {/* 验证码 */}
                    验证码
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 w-full">
                  <div className="flex justify-center items-center gap-1 h-[36px]">
                    <input
                      value={captcha}
                      onChange={(e) => {
                        setCaptcha(e.target.value);
                        setError(""); // Clear error when typing
                      }}
                      placeholder="输入验证码"
                      className="bg-[#524D5C] w-[70%] px-[10px] h-full outline-none"
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
                    setShow验证码(true);
                    // console.log("get new");
                  }}
                  className={`flex items-center gap-2`}
                >
                  <RotateCcw
                    className={`${captchaLoading ? "animate-spin" : ""}`}
                    size={14}
                  />
                  <p className="text-[12px] text-[#bbb]">刷新</p>
                </div> */}
                  <Button
                    onClick={handleVerify}
                    disabled={isLoading || captchaLoading || !captcha?.length}
                    type="submit"
                    className="w-full gradient-bg hover:gradient-bg text-white rounded-lg"
                  >
                    {/* {registerLoading ? "loading..." : "Verify"} */}
                    {/* {isLoading ? (
                      <img src={loader} alt="" className="w-12" />
                    ) : (
                      "确认"
                    )} */}
                    确认
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <div className="w-full flex flex-col items-center">
              <p className="text-[14px] text-[#888] text-center mb-5">或者</p>
              <>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setAuthToggle(false));
                  }}
                  className="w-[60vw] bg-transparent border-[#555555]"
                  variant={"outline"}
                >
                  创建新帐户
                </Button>
              </>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default LoginForm;
