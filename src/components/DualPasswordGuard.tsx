import { checkPasswordExpiration } from "@/page/home/services/passwordSlice";
import { useEffect, ReactNode, startTransition } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

interface DualPasswordGuardProps {
  children: ReactNode;
}

const DualPasswordGuard = ({ children }: DualPasswordGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isEnabledDualPassword } = useSelector((state: any) => state.persist);

  const { isPasswordCorrect } = useSelector(
    (state: any) => state.passwordSlice
  );

  useEffect(() => {
    dispatch(checkPasswordExpiration());
  }, [dispatch]);

  useEffect(() => {
    if (
      isEnabledDualPassword &&
      !isPasswordCorrect &&
      location.pathname !== "/pin-entry"
    ) {
      startTransition(() => {
        navigate("/pin-entry");
      });
    }
  }, [isEnabledDualPassword, isPasswordCorrect, navigate, location.pathname]);

  return <>{children}</>;
};

export default DualPasswordGuard;
