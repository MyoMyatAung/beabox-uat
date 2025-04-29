import { Drawer, DrawerContent } from "@/components/ui/drawer";

import RegisterForm from "./register-form";

const RegisterDrawer = ({
  isOpen,
  setIsOpen,
  code,
}: {
  isOpen: any;
  setIsOpen: any;
  code: any;
}) => {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="border-0 bg-[#262429] min-h-[65vh] z-[2000]">
        <div className="w-full px-5 py-7">
          <RegisterForm setIsOpen={setIsOpen} refer_code={code} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default RegisterDrawer;
