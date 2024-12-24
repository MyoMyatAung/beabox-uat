/* eslint-disable @typescript-eslint/no-explicit-any */
import { BottomNav } from "@/components/shared/bottom-nav";

const RootLayout = ({ children }: any) => {
  return (
    <div className="h-screen">
      {children}
      {/* <RightSideActions /> */}
      <div className="fixed bottom-0 left-0 w-full z-[999]">
        <BottomNav />
      </div>
    </div>
  );
};

export default RootLayout;
