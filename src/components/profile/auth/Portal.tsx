// components/Portal.tsx
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Portal({ children }: { children: ReactNode }) {
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const node = document.getElementById("loading-portal");
    setPortalNode(node);
    return () => setPortalNode(null);
  }, []);

  if (!portalNode) return null;
  return createPortal(children, portalNode);
}
