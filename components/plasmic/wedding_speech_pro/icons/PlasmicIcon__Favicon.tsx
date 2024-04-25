// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type FaviconIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function FaviconIcon(props: FaviconIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      preserveAspectRatio={"xMidYMid meet"}
      style={{
        width: "100%",
        height: '100%"',

        ...(style || {}),
      }}
      viewBox={"0 0 128 128"}
      height={"1em"}
      width={"1em"}
      className={classNames("plasmic-default__svg", className)}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fill={"currentColor"}
        fillOpacity={"1"}
        fillRule={"nonzero"}
        d={
          "M188.8 137.28l-2.24.96c-.64.32-.64.32-.64.96-.64 1.92-.96 3.84-1.92 6.08-7.68 22.72-29.12 39.68-54.72 39.68-31.68 0-57.28-25.28-57.28-56.64s25.6-56.96 57.28-56.96c25.6 0 44.16 16.64 51.52 33.28l-46.08 16.64c-.64 0-.96 0-.96-.64l-3.2-37.12c0-.32-.32-.64-.64-.64h-.96c-.32 0-.64.32-.64.64l-3.52 37.12c0 .64-.64.96-.96.64l-33.28-8.96c-.32 0-.64 0-.64.32l-.32.96c0 .32 0 .64.32.64l27.2 13.76c.32 0 .32.64 0 .64l-26.88 13.44c-.64.64-.64.96-.64 1.28l.32.96c0 .32.32.64.64.32l32.64-8.96c.64 0 .96 0 .96.64l3.52 36.8c0 .32.32.64.64.64h.96c.32 0 .64-.32.64-.64l3.52-36.8c0-.64.64-.96.96-.64l32.96 9.28c.32 0 .64 0 .64-.32l.32-.96c0-.32 0-.64-.32-.64l-26.88-13.76c-.32 0-.32-.64 0-.64l43.2-21.12c.64-.32.64-.64.64-1.28C180.16 84.16 158.08 64 128 64c-36.16 0-64 28.48-64 64 0 35.52 27.84 64 64 64 30.4 0 52.16-19.84 59.52-45.44.64-2.88 1.6-7.04 1.6-8.96.32-.32 0-.32-.32-.32z"
        }
      ></path>
    </svg>
  );
}

export default FaviconIcon;
/* prettier-ignore-end */
