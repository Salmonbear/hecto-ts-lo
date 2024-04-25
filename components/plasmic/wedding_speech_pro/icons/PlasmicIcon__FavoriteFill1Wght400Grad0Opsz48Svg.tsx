// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type FavoriteFill1Wght400Grad0Opsz48SvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function FavoriteFill1Wght400Grad0Opsz48SvgIcon(
  props: FavoriteFill1Wght400Grad0Opsz48SvgIconProps
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
          "M480-121l-41-37q-106-97-175-167.5t-110-126Q113-507 96.5-552T80-643q0-90 60.5-150.5T290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.5T880-643q0 46-16.5 91T806-451.5q-41 55.5-110 126T521-158l-41 37z"
        }
      ></path>
    </svg>
  );
}

export default FavoriteFill1Wght400Grad0Opsz48SvgIcon;
/* prettier-ignore-end */
