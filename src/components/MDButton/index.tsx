import React, { forwardRef, ReactNode } from "react";

import MDButtonRoot from "components/MDButton/MDButtonRoot";

import { useMaterialUIController } from "context";

interface MDButtonProps {
  color?: "white" | "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  variant?: "text" | "contained" | "outlined" | "gradient";
  size?: "small" | "medium" | "large";
  circular?: boolean;
  iconOnly?: boolean;
  children: ReactNode;
}

const MDButton = forwardRef<HTMLButtonElement, MDButtonProps>(
  ({ color = "white", variant = "contained", size = "medium", circular = false, iconOnly = false, children, ...rest }, ref) => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    return (
      <MDButtonRoot
        {...rest}
        ref={ref}
        color="primary"
        variant={variant === "gradient" ? "contained" : variant}
        size={size}
        ownerState={{ color, variant, size, circular, iconOnly, darkMode }}
      >
        {children}
      </MDButtonRoot>
    );
  }
);

export default MDButton;