import { paths } from "@/routes/paths";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import backButton from "../../../assets/backButton.svg";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, decodePassword } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsEnabledDualPassword,
  setPassword,
} from "@/store/slices/persistSlice";
import { showToast } from "@/page/home/services/errorSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function MasterPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setupType = searchParams.get("type") ?? "setup";
  const encodedMasterPassword = useSelector(
    (state: { persist: { masterPassword: string | null } }) =>
      state.persist.masterPassword
  );

  // Decode the password when retrieving it
  const savedMasterPassword = encodedMasterPassword
    ? decodePassword(encodedMasterPassword)
    : null;
  const MasterPasswordFormData = z
    .object({
      masterPassword: z
        .string()
        .regex(/^\d{6}$/, "Use exactly 6 digits—no letters or symbols."),
      masterPasswordConfirm: z
        .string()
        .regex(/^\d{6}$/, "Use exactly 6 digits—no letters or symbols."),
    })
    .refine((data) => data.masterPassword === data.masterPasswordConfirm, {
      message: "Passwords don't match",
      path: ["masterPasswordConfirm"],
    });

  const form = useForm<z.infer<typeof MasterPasswordFormData>>({
    resolver: zodResolver(MasterPasswordFormData),
    defaultValues: {
      masterPassword: "",
      masterPasswordConfirm: "",
    },
  });

  const [showPassword, setShowPassword] = useState({
    masterPassword: false,
    masterPasswordConfirm: false,
  });

  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  function showPasswordHandler(type: string) {
    setShowPassword({
      ...showPassword,
      [type]: !showPassword[type as keyof typeof showPassword],
    });
  }

  function handlePasswordChange(data: z.infer<typeof MasterPasswordFormData>) {
    try {
      dispatch(setPassword({ type: "master", password: data.masterPassword }));
      dispatch(
        showToast({
          message: "Saved master password!",
          type: "success",
        })
      );
      setShowChangeDialog(false);
      form.reset();
      navigate(paths.dual_access_password);
      // want to enable dual access password as default
      // if (setupType === "setup") {
      //   dispatch(setIsEnabledDualPassword(true));
      // }
    } catch (error) {
      dispatch(
        showToast({ message: "Failed to save master password", type: "error" })
      );
    }
  }

  function handlePasswordRemove() {
    dispatch(setIsEnabledDualPassword(false));
    dispatch(setPassword({ type: "master", password: "" }));
    dispatch(
      showToast({
        message: "Removed master password",
        type: "error",
      })
    );
    setShowRemoveDialog(false);
    form.reset();
    navigate(paths.dual_access_password);
  }

  function handleSubmit(data: z.infer<typeof MasterPasswordFormData>) {
    if (setupType === "setup") handlePasswordChange(data);
    else setShowChangeDialog(true);
  }

  const copies = {
    title:
      setupType === "setup"
        ? "Set up master password"
        : "Manage master password",
    description:
      setupType === "setup"
        ? "Create a password to open real version of the application. Create a 6-digit PIN. Numbers only."
        : "Manage the password to open real version of the application. Create a 6-digit PIN. Numbers only.",
    confirmBtnLabel: setupType === "setup" ? "Confirm" : "Save",
  };

  return (
    <>
      <div className="w-full h-screen px-5 flex flex-col items-center bg-[#16131C]">
        <div className="flex justify-between items-center py-5 w-full">
          <Link to={paths.dual_access_password}>
            <img src={backButton} alt="" />
          </Link>
          <p className="text-[16px]">{copies.title}</p>
          <div></div>
        </div>

        <div className="flex flex-col my-5">
          <p className="text-sm">{copies.description}</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-8">
              <div className="space-y-12">
                <FormField
                  control={form.control}
                  name="masterPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <>
                          <label htmlFor="" className="text-[14px] text-[#888]">
                            Master Password
                          </label>
                          <div className="relative">
                            <input
                              className="w-full bg-transparent border-0 border-b py-3 outline-0 border-[#888] outline-none"
                              placeholder="Enter your master password"
                              type={
                                showPassword.masterPassword
                                  ? "text"
                                  : "password"
                              }
                              minLength={6}
                              maxLength={6}
                              inputMode="numeric"
                              onInput={(e) => {
                                const target = e.target as HTMLInputElement;
                                target.value = target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                              }}
                              {...field}
                            />
                            <div className="absolute right-0 bottom-3">
                              {showPassword.masterPassword ? (
                                <EyeIcon
                                  onClick={() =>
                                    showPasswordHandler("masterPassword")
                                  }
                                  className="w-[18px]"
                                />
                              ) : (
                                <EyeOffIcon
                                  onClick={() =>
                                    showPasswordHandler("masterPassword")
                                  }
                                  className="w-[18px]"
                                />
                              )}
                            </div>
                          </div>
                        </>
                      </FormControl>
                      {form.formState.errors.masterPassword ? (
                        <FormMessage />
                      ) : (
                        <p className="text-sm text-[#888] mt-2">
                          Use exactly 6 digits—no letters or symbols.
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="masterPasswordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <>
                          <label htmlFor="" className="text-[14px] text-[#888]">
                            Confirm Master Password
                          </label>
                          <div className="relative">
                            <input
                              className="w-full bg-transparent border-0 border-b py-3 outline-0 border-[#888] outline-none"
                              placeholder="Confirm your master password"
                              type={
                                showPassword.masterPasswordConfirm
                                  ? "text"
                                  : "password"
                              }
                              minLength={6}
                              maxLength={6}
                              inputMode="numeric"
                              onInput={(e) => {
                                const target = e.target as HTMLInputElement;
                                target.value = target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                              }}
                              {...field}
                            />
                            <div className="absolute right-0 bottom-3">
                              {showPassword.masterPasswordConfirm ? (
                                <EyeIcon
                                  onClick={() =>
                                    showPasswordHandler("masterPasswordConfirm")
                                  }
                                  className="w-[18px]"
                                />
                              ) : (
                                <EyeOffIcon
                                  onClick={() =>
                                    showPasswordHandler("masterPasswordConfirm")
                                  }
                                  className="w-[18px]"
                                />
                              )}
                            </div>
                          </div>
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-[60px] space-y-3">
                <button
                  type="submit"
                  disabled={
                    form.formState.errors.masterPassword ||
                    form.formState.errors.masterPasswordConfirm
                      ? true
                      : false
                  }
                  className={cn(
                    "text-[16px] font-semibold w-full rounded-[16px] py-3",
                    {
                      "bg-gradient-to-b from-[#FFB2E0] to-[#CD3EFF] text-white":
                        !form.formState.errors.masterPassword &&
                        !form.formState.errors.masterPasswordConfirm,
                      "bg-[#FFFFFF0A] text-[#444444]":
                        form.formState.errors.masterPassword ||
                        form.formState.errors.masterPasswordConfirm,
                    }
                  )}
                >
                  <p>{copies.confirmBtnLabel}</p>
                </button>
                {!!savedMasterPassword && (
                  <button
                    type="button"
                    className="text-[16px] font-semibold bg-[#FFFFFF0A] text-white disabled:text-[#444444] w-full rounded-[16px] py-3"
                    onClick={() => {
                      setShowRemoveDialog(true);
                    }}
                  >
                    <p>Remove</p>
                  </button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>

      <Dialog open={showChangeDialog} onOpenChange={setShowChangeDialog}>
        <DialogPortal>
          <DialogOverlay className="bg-black/60" />
          <DialogContent className="bg-[#16131C] overflow-hidden max-w-[320px] border-0 rounded-[16px] p-0">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle className="text-white text-[16px] text-center">
                <div className="flex justify-center">
                  <div className="size-10 flex items-center justify-center">
                    <svg
                      width="33"
                      height="32"
                      viewBox="0 0 33 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M27.1667 17.3333C27.1667 24 22.5 27.3333 16.9534 29.2667C16.6629 29.3651 16.3474 29.3604 16.06 29.2533C10.5 27.3333 5.83337 24 5.83337 17.3333V8.00001C5.83337 7.64639 5.97385 7.30725 6.2239 7.0572C6.47395 6.80715 6.81309 6.66668 7.16671 6.66668C9.83337 6.66668 13.1667 5.06668 15.4867 3.04001C15.7692 2.79867 16.1285 2.66608 16.5 2.66608C16.8716 2.66608 17.2309 2.79867 17.5134 3.04001C19.8467 5.08001 23.1667 6.66668 25.8334 6.66668C26.187 6.66668 26.5261 6.80715 26.7762 7.0572C27.0262 7.30725 27.1667 7.64639 27.1667 8.00001V17.3333Z"
                        stroke="#CD3EFF"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M16.5 10.6667V16"
                        stroke="#CD3EFF"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M16.5 21.3333H16.5133"
                        stroke="#CD3EFF"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="text-center">
              <p className="text-[#BBBBBB] mx-6 mb-8">
                Are you sure you want to change the password to open the real
                version of the application
              </p>
              <div className="grid grid-cols-2 border-t border-white/10 divide-x divide-white/10">
                <Button
                  variant={"ghost"}
                  className="text-white hover:text-white !bg-transparent h-14 text-base"
                  onClick={() => setShowChangeDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant={"ghost"}
                  className="text-[#CD3EFF] hover:text-[#CD3EFF] !bg-transparent h-14 text-base"
                  onClick={() => handlePasswordChange(form.getValues())}
                >
                  Change
                </Button>
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogPortal>
          <DialogOverlay className="bg-black/60" />
          <DialogContent className="bg-[#16131C] overflow-hidden max-w-[320px] border-0 rounded-[16px] p-0">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle className="text-white text-[16px] text-center">
                <div className="flex justify-center">
                  <div className="size-10 flex items-center justify-center">
                    <svg
                      width="33"
                      height="32"
                      viewBox="0 0 33 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M27.1667 17.3333C27.1667 24 22.5 27.3333 16.9534 29.2667C16.6629 29.3651 16.3474 29.3604 16.06 29.2533C10.5 27.3333 5.83337 24 5.83337 17.3333V8.00001C5.83337 7.64639 5.97385 7.30725 6.2239 7.0572C6.47395 6.80715 6.81309 6.66668 7.16671 6.66668C9.83337 6.66668 13.1667 5.06668 15.4867 3.04001C15.7692 2.79867 16.1285 2.66608 16.5 2.66608C16.8716 2.66608 17.2309 2.79867 17.5134 3.04001C19.8467 5.08001 23.1667 6.66668 25.8334 6.66668C26.187 6.66668 26.5261 6.80715 26.7762 7.0572C27.0262 7.30725 27.1667 7.64639 27.1667 8.00001V17.3333Z"
                        stroke="#EE3E4C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M16.5 10.6667V16"
                        stroke="#EE3E4C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M16.5 21.3333H16.5133"
                        stroke="#EE3E4C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="text-center">
              <p className="text-[#BBBBBB] mx-6 mb-8">
                Are you sure you want to remove the password to open the real
                version of the application
              </p>
              <div className="grid grid-cols-2 border-t border-white/10 divide-x divide-white/10">
                <Button
                  variant={"ghost"}
                  className="text-white hover:text-white !bg-transparent h-14 text-base"
                  onClick={() => setShowRemoveDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant={"ghost"}
                  className="text-[#EE3E4C] hover:text-[#EE3E4C] !bg-transparent h-14 text-base"
                  onClick={() => handlePasswordRemove()}
                >
                  Remove
                </Button>
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}

export default MasterPassword;
