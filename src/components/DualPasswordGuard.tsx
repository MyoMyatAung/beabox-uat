import { useEffect, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { checkPasswordExpiration } from "@/store/slices/sessionSlice";

interface DualPasswordGuardProps {
  children: ReactNode;
}

const DualPasswordGuard = ({ children }: DualPasswordGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isEnabledDualPassword = useSelector(
    (state: any) => state.persist.isEnabledDualPassword
  );
  const isPasswordCorrect = useSelector(
    (state: any) => state.persist.isPasswordCorrect
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
      navigate("/pin-entry");
    }
  }, [isEnabledDualPassword, isPasswordCorrect, navigate, location.pathname]);

  return <>{children}</>;
};

export default DualPasswordGuard;
