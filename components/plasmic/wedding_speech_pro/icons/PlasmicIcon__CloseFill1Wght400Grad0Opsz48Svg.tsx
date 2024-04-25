// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type CloseFill1Wght400Grad0Opsz48SvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function CloseFill1Wght400Grad0Opsz48SvgIcon(
  props: CloseFill1Wght400Grad0Opsz48SvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 -960 960 960"}
      height={"1em"}
      width={"1em"}
      style={{
        fill: "currentcolor",

        ...(style || {}),
      }}
      className={classNames("plasmic-default__svg", className)}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M249-207l-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231z"
        }
      ></path>
    </svg>
  );
}

export default CloseFill1Wght400Grad0Opsz48SvgIcon;
/* prettier-ignore-end */
