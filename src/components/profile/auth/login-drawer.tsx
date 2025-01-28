import { Drawer, DrawerContent } from "@/components/ui/drawer";

import LoginForm from "./login-form";

const LoginDrawer = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: any;
  setIsOpen: any;
}) => {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="border-0 bg-[#262429] min-h-[65vh] z-[2000]">
        <div className="w-full px-5 py-7">
          <LoginForm setIsOpen={setIsOpen} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default LoginDrawer;
