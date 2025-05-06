import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TopNav = ({ left, center, right, styles }: any) => {
  const navigate = useNavigate();
  return (
    <nav className="flex justify-between items-center p-5">
      <ChevronLeft onClick={left ? left : () => navigate(-1)} />
      <p className={`text-[18px] ${styles}`}>{center}</p>
      {right ? right : <div className="px-3" />}
    </nav>
  );
};

export default TopNav;
