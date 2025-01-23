import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import LoginForm from "./login-form";
import { useSelector } from "react-redux";
import RegisterForm from "./register-form";

const AuthDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const authToggle = useSelector((state: any) => state.profile.authToggle);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <div className="z-[1200] flex items-center gap-2 flex-1">
          <span className="z-[1200] text-[18px] ">点击登陆</span>
          <ChevronRight size={18} />
        </div>
      </DrawerTrigger>
      <DrawerContent className="border-0 bg-[#262429] h-[65vh] z-[2000]">
        <div className="w-full px-5 py-7">
          {authToggle ? (
            <LoginForm setIsOpen={setIsOpen} />
          ) : (
            <RegisterForm setIsOpen={setIsOpen} />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AuthDrawer;
