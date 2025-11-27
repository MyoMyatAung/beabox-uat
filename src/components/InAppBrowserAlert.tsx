import guide from "@/assets/guide.webp";

/**
 * Component for displaying in-app browser alert
 * Single Responsibility: Render the guide image overlay for in-app browsers
 */
export const InAppBrowserAlert = () => {
  return (
    <div className="fixed w-full h-screen bg-white z-[3000] top-0 left-0">
      <div className="w-full z-[1300] absolute h-full flex justify-center items-center">
        <div className="text-[14px] bg-white rounded-lg text-center relative max-w-md w-full">
          <div className="relative w-full">
            <img
              src={guide}
              alt="Browser guide"
              className="w-full h-dvh object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

