import { paths } from "@/routes/paths";
import { ChevronLeft, Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { LoginFormData, loginSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { setRegisterUser } from "@/store/slices/persistSlice";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [getCaptcha, { data, isLoading }] = useGetCaptchaMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });
  async function onSubmit(data: LoginFormData) {
    // Handle form submission
    // await getCaptcha();
    setShowVerification(true);
    console.log(data, code);
  }
  const handleVerify = async () => {
    // Add verification logic here
    const { emailOrPhone, password } = form.getValues();
    const { data: registerData } = await register({
      username: emailOrPhone,
      password,
      captcha,
      captcha_key: data?.data?.captcha_key,
    });
    if (registerData?.status) {
      dispatch(setRegisterUser(registerData?.data));
      navigate(paths.login);
      setShowVerification(false);
    }
  };
  return (
    <div className="px-5">
      <div className="flex justify-between items-center py-5">
        <Link to={paths.login}>
          <ChevronLeft />
        </Link>
        <p className="text-[16px]">Create Account</p>
        <div></div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 py-10"
        >
          <FormField
            control={form.control}
            name="emailOrPhone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <input
                      className="block w-full px-3 py-2 text-white bg-transparent bg-clip-padding transition ease-in-out m-0 focus:text-white focus:bg-transparent focus:outline-none "
                      placeholder="Enter Your Mail or Phone Number"
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
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="block w-full px-3 py-2 text-white bg-transparent bg-clip-padding transition ease-in-out m-0 focus:text-white focus:bg-transparent focus:outline-none "
                      placeholder="Password must be 8-25 character"
                      {...field}
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <input
            type="text"
            placeholder="Enter Promotion Code (Optional)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="bg-[#121012] border-0 rounded-lg text-white placeholder:text-gray-600 px-4 py-4 text-center placeholder:text-center w-full outline-none"
          />

          <div className="">
            <Button
              // type="submit"
              onClick={async () => await getCaptcha("")}
              className="w-full gradient-bg rounded-lg hover:gradient-bg"
            >
              {isLoading ? "loading..." : "Continue"}
            </Button>
          </div>
          <Dialog open={showVerification} onOpenChange={setShowVerification}>
            {!isLoading ? (
              <DialogContent className="bg-[#333333] border-0 shadow-lg rounded-lg max-w-[290px]">
                <DialogHeader>
                  <DialogTitle className="text-white text-[16px]">
                    Verification
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <img
                    src={data?.data?.img}
                    className="w-full h-[56px] object-cover object-center"
                    alt=""
                  />
                  <input
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    placeholder="Type Captcha"
                    className="bg-[#424040] w-full px-[10px] py-4 rounded-lg outline-none"
                  />
                  <Button
                    onClick={handleVerify}
                    type="submit"
                    className="w-full gradient-bg hover:gradient-bg text-white rounded-lg"
                  >
                    {registerLoading ? "loading..." : "Verify"}
                  </Button>
                </div>
              </DialogContent>
            ) : (
              <></>
            )}
          </Dialog>
        </form>
      </Form>
    </div>
  );
};

export default Register;
