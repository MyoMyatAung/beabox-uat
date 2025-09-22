import { paths } from "@/routes/paths";
import { Link } from "react-router-dom";
import backButton from "../../../assets/backButton.svg";
import { ChevronRightIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useSelector, useDispatch } from "react-redux";
import { decodePassword } from "@/lib/utils";
import { setIsEnabledDualPassword } from "@/store/slices/persistSlice";

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
  }

  return (
    <div className="w-full h-screen px-5 flex flex-col items-center bg-[#16131C]">
      <div className="flex justify-between items-center py-5 w-full">
        <Link to={paths.settings}>
          {/* <FaAngleLeft size={22} /> */}
          <img src={backButton} alt="" />
        </Link>
        <p className="text-[16px]">Dual Access Password</p>
        <div></div>
      </div>

      <div className="flex flex-col my-5">
        <div className="flex justify-between items-start">
          <div className="w-[70%] ">
            <p className="flex items-center gap-1 text-[14px]">
              Enable Dual Password
            </p>
            <p className="text-[10px] text-[#888888] w-full mt-1">
              Protect your privicy with a dual access system
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
          to={paths.decoy_password}
          className="flex justify-between items-start"
        >
          <div className="w-[70%] ">
            <p className="flex items-center gap-1 text-[14px]">
              Manage Decoy Password
            </p>
            <p className="text-[10px] text-[#888888] w-full mt-1">
              Manage the password to open the decoy version of the application
            </p>
          </div>
          <div className=" flex-1">
            <p className="flex items-center justify-end gap-1 text-[14px] capitalize text-[#888888]">
              Manage
              <ChevronRightIcon size={15} />
            </p>
          </div>
        </Link>

        <div className="border-b border-white/10 my-5"></div>

        <Link
          to={paths.master_password}
          className="flex justify-between items-start"
        >
          <div className="w-[70%] ">
            <p className="flex items-center gap-1 text-[14px]">
              Manage Master Password
            </p>
            <p className="text-[10px] text-[#888888] w-full mt-1">
              Manage the password to open the real version of the application
            </p>
          </div>
          <div className=" flex-1">
            <p className="flex items-center justify-end gap-1 text-[14px] capitalize text-[#888888]">
              Manage
              <ChevronRightIcon size={15} />
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default DualAccessPassword;
