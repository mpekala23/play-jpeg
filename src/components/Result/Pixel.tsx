import React, { FC } from "react";
import styled from "styled-components";
import { BOXSIZE } from "./constants";

interface Props {
  rx: number;
  cx: number;
  val: string;
}

const OuterPixel = styled.div<{ bgColor: string }>`
  display: inline-block;
  width: ${BOXSIZE}px;
  height: ${BOXSIZE}px;
  padding: 0px;
  border: 0px;
  margin: 0px;
  background-color: ${(props) => props.bgColor};
`;

const Pixel: FC<Props> = ({ rx, cx, val }) => {
  return <OuterPixel bgColor={val} />;
};

export default Pixel;
