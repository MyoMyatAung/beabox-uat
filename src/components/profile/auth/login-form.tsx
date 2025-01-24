import { paths } from "@/routes/paths";
import { ChevronLeft, Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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
import { setAuthToggle } from "@/store/slices/profileSlice";
import SmallLoader from "@/components/shared/small-loader";
const LoginForm = ({ setIsOpen }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [getCaptcha, { data, isLoading: captchaLoading }] =
    useGetCaptchaMutation();
  const [showVerification, setShowVerification] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [error, setError] = useState("");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  async function onSubmit() {
    if (data?.status) setShowVerification(true);
  }
  const handleVerify = async (e: any) => {
    // Add verification logic here
    e.stopPropagation();
    const { emailOrPhone, password } = form.getValues();
    console.log(emailOrPhone, password);
    const { data: loginData } = await login({
      username: emailOrPhone,
      password,
      captcha,
      captcha_key: data?.data?.captcha_key,
    });
    // console.log(loginData, "loginData");
    if (loginData?.status) {
      dispatch(setUser(loginData?.data));
      setShowVerification(false);
      // navigate(paths.profile);
      setIsOpen(false);
    } else {
      setShowVerification(false);
      setError("Something went wrong!");
    }
  };
  return (
    <div className="px-5">
      <div className="flex justify-between items-center">
        <div className="px-3"></div>
        <p className="text-[18px]">
          登录
          {/* Login */}
        </p>
        <div
          onClick={() => setIsOpen(false)}
          className="bg-[#FFFFFF0A] p-2 rounded-full"
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
                      密码
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
                    <label htmlFor="" className="text-[14px] text-[#888]">
                      密码
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="block w-full py-2 text-white bg-transparent bg-clip-padding transition ease-in-out m-0 focus:text-white focus:bg-transparent focus:outline-none "
                        placeholder="输入您的密码"
                        {...field}
                      />
                      <button
                        className=" absolute right-0 bottom-2"
                        onClick={(e) => {
                          e.stopPropagation();
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
                <FormMessage>{error}</FormMessage>
              </FormItem>
            )}
          />

          <div className="">
            {/* <SubmitButton
          isLoading={isLoading}
          condition={true}
          text={"Login"}
        /> */}
            <Button
              disabled={isLoading || captchaLoading}
              // type="submit"
              onClick={async () => {
                await getCaptcha("");
                setShowVerification(true);
              }}
              className="w-full gradient-bg rounded-lg hover:gradient-bg"
            >
              {captchaLoading ? <SmallLoader /> : "登录"}
              {/* 登录 */}
            </Button>
            <Link to={paths.forgot_password}>
              <p className="text-center text-[14px] mt-5">忘记密码？</p>
            </Link>
          </div>
          <Dialog open={showVerification} onOpenChange={setShowVerification}>
            {!captchaLoading ? (
              <DialogContent className="bg-[#393641] z-[3000] border-0 shadow-lg rounded-lg max-w-[300px]">
                <DialogHeader>
                  <DialogTitle className="text-white text-[16px]">
                    {/* Verification */}
                    验证码
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 w-full">
                  <div className="flex justify-center items-center gap-1 h-[36px]">
                    <input
                      value={captcha}
                      onChange={(e) => setCaptcha(e.target.value)}
                      placeholder="Type Captcha"
                      className="bg-[#524D5C] w-[70%] px-[10px] h-full outline-none"
                    />

                    <img
                      src={data?.data?.img}
                      className="w-[30%]  h-full  object-center outline-none border-gray-400"
                      alt=""
                    />
                  </div>
                  <Button
                    onClick={handleVerify}
                    disabled={isLoading ? true : false}
                    type="submit"
                    className="w-full gradient-bg hover:gradient-bg text-white rounded-lg"
                  >
                    {/* {registerLoading ? "loading..." : "Verify"} */}
                    {isLoading ? (
                      <img src={loader} alt="" className="w-12" />
                    ) : (
                      "确认"
                    )}
                  </Button>
                </div>
              </DialogContent>
            ) : (
              <></>
            )}
          </Dialog>
          <div className="w-full flex flex-col items-center">
            <p className="text-[14px] text-[#333333] text-center mb-5">或者</p>
            <>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setAuthToggle(false));
                }}
                className="w-[320px] bg-transparent border-[#555555]"
                variant={"outline"}
              >
                创建新帐户
              </Button>
            </>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
