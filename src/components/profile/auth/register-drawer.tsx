import { Drawer, DrawerContent } from "@/components/ui/drawer1";

import RegisterForm from "./register-form";

const RegisterDrawer = ({
  isOpen,
  setIsOpen,
  code,
  geetest_id,
}: {
  isOpen: any;
  setIsOpen: any;
  code: any;
  geetest_id: any;
}) => {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <div className="fixed inset-0">
        <DrawerContent className="border-0 bg-[#262429]  min-h-[45vh] z-[2000]">
          <div className="w-full px-5 py-7">
            <RegisterForm
              setIsOpen={setIsOpen}
              refer_code={code}
              geetest_id={geetest_id}
            />
          </div>
        </DrawerContent>
      </div>
    </Drawer>
  );
};

export default RegisterDrawer;
