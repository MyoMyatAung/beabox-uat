import HandPointer from "@/assets/handpointer.gif";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { sethideNew } from "@/page/home/services/hideNewSlice";
import { setFirstTimeUser } from "@/store/slices/appSlice";

const ImmersiveUserGuide = () => {
  const hideNew = useSelector((state: any) => state.hideNewSlice.hideNew);
  const [showGuide, setShowGuide] = useState(true);
  const dispatch = useDispatch();
  const { isFirstTimeUser } = useSelector((state: any) => state.app);

  // If hideNew changed, set showGuide to false for 1s and then true again
  useEffect(() => {
    console.log("hideNew changed:", hideNew);
    if (!hideNew) {
      setShowGuide(false);
      const timer = setTimeout(() => {
        setShowGuide(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hideNew]);

  if (!showGuide) return <></>;

  const handleFullScreen = () => {
    if (!hideNew) {
      dispatch(sethideNew(true));
      // If this is a first-time user clicking "清屏", mark them as not first time
      if (isFirstTimeUser) {
        dispatch(setFirstTimeUser(false));
      }
    } else {
      dispatch(sethideNew(false));
    }
  };

  return (
    <motion.div
      className="h-full bg-black/80 w-screen flex flex-col gap-[20px] absolute top-0 z-[99998]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`flex gap-2 items-center absolute ${
          hideNew ? "bottom-[30px] right-[40px]" : "bottom-[110px] right-[40px]"
        } cursor-pointer`}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onClick={handleFullScreen}
      >
        <span className="text-xl text-white">点击关闭沉浸模式</span>
        <img
          src={HandPointer}
          className="w-16 h-16 ml-2 inline-block transform -scale-x-100"
          alt="Hand pointer"
        />
      </motion.div>
    </motion.div>
  );
};

export default ImmersiveUserGuide;
