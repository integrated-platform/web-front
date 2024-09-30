import React, { forwardRef, ReactNode } from "react";

import MDTypographyRoot from "components/MDTypography/MDTypographyRoot";

import { useMaterialUIController } from "context";

interface MDTypographyProps {
  color?: "inherit" | "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark" | "text" | "white";
  fontWeight?: false | "light" | "regular" | "medium" | "bold";
  textTransform?: "none" | "capitalize" | "uppercase" | "lowercase";
  verticalAlign?: "unset" | "baseline" | "sub" | "super" | "text-top" | "text-bottom" | "middle" | "top" | "bottom";
  textGradient?: boolean;
  children: ReactNode;
  opacity?: number;
  variant?: String
}

const MDTypography = forwardRef<HTMLDivElement, MDTypographyProps>(
  (
    { color, fontWeight, textTransform, verticalAlign, textGradient, opacity, children, ...rest },
    ref
  ) => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    return (
      <MDTypographyRoot
        {...rest}
        ref={ref}
        ownerState={{
          color,
          textTransform,
          verticalAlign,
          fontWeight,
          opacity,
          textGradient,
          darkMode,
        }}
      >
        {children}
      </MDTypographyRoot>
    );
  }
);

MDTypography.defaultProps = {
  color: "dark",
  fontWeight: false,
  textTransform: "none",
  verticalAlign: "unset",
  textGradient: false,
  opacity: 1,
};

export default MDTypography;