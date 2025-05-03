import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import LoginForm from "./login-form";
import { useDispatch, useSelector } from "react-redux";
import RegisterForm from "./register-form";
import { motion, AnimatePresence } from "framer-motion";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";

const AuthDrawer = () => {
  
  const authToggle = useSelector((state: any) => state.profile.authToggle);
  const dispatch = useDispatch();
  const variants = {
    hidden: { y: 300 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
    exit: {
      y: "100%",
      transition: { type: "tween", duration: 0.5 },
    },
  };
  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.y > 100) {
      // setIsVisible(false);
      dispatch(setIsDrawerOpen(false));
    }
  };
  return (
    <div className="z-[1900] fixed bottom-0  left-0 w-full">
      <AnimatePresence>
        <div
          className="bg-transparent min-h-[50vh]"
          onClick={() => dispatch(setIsDrawerOpen(false))}
        ></div>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="bg-[#262429] max-h-[100vh] rounded-t-xl w-full py-5 overflow-y-auto hide-sb"
        >
          {authToggle ? <LoginForm /> : <RegisterForm setIsOpen={setIsDrawerOpen} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthDrawer;
