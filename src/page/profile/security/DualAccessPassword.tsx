import { paths } from "@/routes/paths";
import { Link } from "react-router-dom";
import backButton from "../../../assets/backButton.svg";
import { ChevronRightIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useSelector, useDispatch } from "react-redux";
import { decodePassword } from "@/lib/utils";
import {
  setIsEnabledDualPassword,
  setIsPasswordCorrect,
} from "@/store/slices/persistSlice";
import { showToast } from "@/page/home/services/errorSlice";

function DualAccessPassword() {
  const dispatch = useDispatch();
  const isEnabledDualPassword = useSelector(
    (state: { persist: { isEnabledDualPassword: boolean } }) =>
      state.persist.isEnabledDualPassword
  );
  const encodedDecoyPassword = useSelector(
    (state: { persist: { decoyPassword: string | null } }) =>
      state.persist.decoyPassword
  );
  const encodedMasterPassword = useSelector(
    (state: { persist: { masterPassword: string | null } }) =>
      state.persist.masterPassword
  );
  const savedDecoyPassword = encodedDecoyPassword
    ? decodePassword(encodedDecoyPassword)
    : null;
  const savedMasterPassword = encodedMasterPassword
    ? decodePassword(encodedMasterPassword)
    : null;

  function handleEnableDualPassword(e: boolean) {
    dispatch(setIsEnabledDualPassword(e));
    dispatch(setIsPasswordCorrect(false));
  }

  return (
    <div className="w-full h-screen px-5 flex flex-col items-center bg-[#16131C]">
      <div className="flex justify-between items-center py-5 w-full">
        <Link to={paths.settings}>
          {/* <FaAngleLeft size={22} /> */}
          <img src={backButton} alt="" />
        </Link>
        <p className="text-[16px]">双密码访问</p>
        <div></div>
      </div>

      <div className="flex flex-col my-5 w-full">
        <div
          className="flex justify-between items-start"
          onClick={() => {
            if (!savedDecoyPassword || !savedMasterPassword) {
              dispatch(
                showToast({
                  message: "设置两个密码以使用此功能",
                  type: "error",
                })
              );
            }
          }}
        >
          <div className="w-[70%] ">
            <p className="flex items-center gap-1 text-[14px]">启用双重密码</p>
            <p className="text-[10px] text-[#888888] w-full mt-1">
              使用双重访问系统保护您的隐私
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <Switch
              disabled={!savedDecoyPassword || !savedMasterPassword}
              checked={isEnabledDualPassword}
              onCheckedChange={(e) => handleEnableDualPassword(e)}
            />
          </div>
        </div>

        <div className="border-b border-white/10 my-5"></div>

        <Link
          to={`${paths.decoy_password}?type=${
            savedDecoyPassword ? "manage" : "setup"
          }`}
          className="flex justify-between items-start"
        >
          <div className="w-[70%] ">
            <p className="flex items-center gap-1 text-[14px]">管理诱饵密码</p>
            <p className="text-[10px] text-[#888888] w-full mt-1">
              管理打开诱饵版应用程序的密码
            </p>
          </div>
          <div className=" flex-1">
            <p className="flex items-center justify-end gap-1 text-[14px] capitalize text-[#888888]">
              {savedDecoyPassword ? "管理" : "设置"}
              <ChevronRightIcon size={15} />
            </p>
          </div>
        </Link>

        <div className="border-b border-white/10 my-5"></div>

        <Link
          to={`${paths.master_password}?type=${
            savedMasterPassword ? "manage" : "setup"
          }`}
          className="flex justify-between items-start"
        >
          <div className="w-[70%] ">
            <p className="flex items-center gap-1 text-[14px]">管理主密码</p>
            <p className="text-[10px] text-[#888888] w-full mt-1">
              管理打开应用程序真实版本的密码
            </p>
          </div>
          <div className=" flex-1">
            <p className="flex items-center justify-end gap-1 text-[14px] capitalize text-[#888888]">
              {savedMasterPassword ? "管理" : "设置"}
              <ChevronRightIcon size={15} />
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default DualAccessPassword;
