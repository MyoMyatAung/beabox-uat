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
  const encodedDecoyPassword = useSelector(
    (state: { persist: { decoyPassword: string | null } }) =>
      state.persist.decoyPassword
  );
  const encodedMasterPassword = useSelector(
    (state: { persist: { masterPassword: string | null } }) =>
      state.persist.masterPassword
  );

  // Decode the password when retrieving it
  const savedDecoyPassword = encodedDecoyPassword
    ? decodePassword(encodedDecoyPassword)
    : null;
  const savedMasterPassword = encodedMasterPassword
    ? decodePassword(encodedMasterPassword)
    : null;

  const MasterPasswordFormData = z
    .object({
      masterPassword: z
        .string()
        .regex(/^\d{6}$/, "使用正好 6 位数字 — — 没有字母或符号。"),
      masterPasswordConfirm: z
        .string()
        .regex(/^\d{6}$/, "使用正好 6 位数字 — — 没有字母或符号。"),
    })
    .refine((data) => data.masterPassword === data.masterPasswordConfirm, {
      message: "密码不匹配",
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
      if (data.masterPassword === savedDecoyPassword) {
        dispatch(
          showToast({
            message: "主密码不能与诱饵密码相同",
            type: "error",
          })
        );
        setShowChangeDialog(false);
        form.reset();
        return;
      }
      dispatch(setPassword({ type: "master", password: data.masterPassword }));
      dispatch(
        showToast({
          message: "已保存主密码！",
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
      dispatch(showToast({ message: "保存主密码失败！", type: "error" }));
    }
  }

  function handlePasswordRemove() {
    dispatch(setIsEnabledDualPassword(false));
    dispatch(setPassword({ type: "master", password: "" }));
    dispatch(
      showToast({
        message: "已删除主密码！",
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
    title: setupType === "setup" ? "设置主密码" : "管理主密码",
    description:
      setupType === "setup"
        ? "创建密码以打开应用程序的实际版本。请创建一个 6 位 PIN 码。仅限数字。"
        : "管理打开应用程序真实版本的密码。创建一个 6 位 PIN 码。仅限数字。",
    confirmBtnLabel: setupType === "setup" ? "确认" : "节省",
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
                            主密码
                          </label>
                          <div className="relative">
                            <input
                              className="w-full bg-transparent border-0 border-b py-3 outline-0 border-[#888] outline-none"
                              placeholder="输入您的主密码"
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
                          使用正好 6 位数字 — — 没有字母或符号。
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
                            确认主密码
                          </label>
                          <div className="relative">
                            <input
                              className="w-full bg-transparent border-0 border-b py-3 outline-0 border-[#888] outline-none"
                              placeholder="确认您的主密码"
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
                    <p>消除</p>
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
          <DialogContent
            showX={false}
            className="bg-[#16131C] overflow-hidden max-w-[320px] border-0 rounded-[16px] p-0"
          >
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
                您确定要更改密码以打开应用程序的正式版本吗？
              </p>
              <div className="grid grid-cols-2 border-t border-white/10 divide-x divide-white/10">
                <Button
                  variant={"ghost"}
                  className="text-white hover:text-white !bg-transparent h-14 text-base"
                  onClick={() => setShowChangeDialog(false)}
                >
                  取消
                </Button>
                <Button
                  variant={"ghost"}
                  className="text-[#CD3EFF] hover:text-[#CD3EFF] !bg-transparent h-14 text-base"
                  onClick={() => handlePasswordChange(form.getValues())}
                >
                  改变
                </Button>
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogPortal>
          <DialogOverlay className="bg-black/60" />
          <DialogContent
            showX={false}
            className="bg-[#16131C] overflow-hidden max-w-[320px] border-0 rounded-[16px] p-0"
          >
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
                您确定要移除密码以打开应用程序的正式版本吗？
              </p>
              <div className="grid grid-cols-2 border-t border-white/10 divide-x divide-white/10">
                <Button
                  variant={"ghost"}
                  className="text-white hover:text-white !bg-transparent h-14 text-base"
                  onClick={() => setShowRemoveDialog(false)}
                >
                  取消
                </Button>
                <Button
                  variant={"ghost"}
                  className="text-[#EE3E4C] hover:text-[#EE3E4C] !bg-transparent h-14 text-base"
                  onClick={() => handlePasswordRemove()}
                >
                  消除
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
