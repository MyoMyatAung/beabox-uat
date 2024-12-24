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
import { useLoginMutation } from "@/store/api/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/persistSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });
  async function onSubmit(values: LoginFormData) {
    // Handle form submission
    const { data } = await login({
      username: values?.emailOrPhone,
      password: values?.password,
    });
    if (data?.status) {
      dispatch(setUser(data?.data));
      navigate(paths.profile);
    }
  }
  return (
    <div className="px-5">
      <div className="flex justify-between items-center py-5">
        <Link to={paths.profile}>
          <ChevronLeft />
        </Link>
        <p className="text-[16px]">Login</p>
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
                      placeholder="Enter Your Password"
                      {...field}
                    />
                    <button
                      className=" absolute right-0 bottom-2"
                      onClick={() => setShowPassword(!showPassword)}
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

          <div className="">
            <Button
              type="submit"
              className="w-full gradient-bg rounded-lg hover:gradient-bg"
            >
              {isLoading ? "loading..." : "Login"}
            </Button>
            <Link to="/">
              <p className="text-center text-[14px] mt-5">Forgot Password?</p>
            </Link>
          </div>
          <div className="">
            <p className="text-[14px] text-[#333333] text-center mb-5">OR</p>
            <Link to={paths.regiter}>
              <Button className="w-full" variant={"outline"}>
                Create New Account
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Login;
