const Divider = ({ show }: any) => {
  return (
    <div
      className={`${show ? "block" : "hidden"} w-full h-[1px] bg-[#FFFFFF0A]`}
    ></div>
  );
};

export default Divider;
