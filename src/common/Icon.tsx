import React, { FC } from "react";
import styled from "styled-components";
import { shadeColor } from "../utils";

interface StyleProps {
  color: string;
  size: number;
  clickable: boolean;
  isBig: boolean;
}

const DEFAULT_SIZE = 32;
const DEFAULT_COLOR = "#000000";

interface Props {
  color?: string;
  size?: number;
  name: string;
  onClick?: () => void;
  isBig?: boolean;
}

const shadeAmount = -20;
const growAmount = 1.2;

const I = styled.i<StyleProps>`
  color: ${(p) => (p.isBig ? shadeColor(p.color, shadeAmount) : p.color)};
  font-size: ${(p) => {
    return `${p.isBig ? p.size * growAmount : p.size}px`;
  }};
  transition: all 0.3s ease;
  &:hover {
    color: ${(p) => {
      if (!p.clickable) {
        return p.color;
      }
      return shadeColor(p.color, shadeAmount);
    }};

    cursor: ${(p) => (p.clickable ? "pointer" : undefined)};
  }
`;

const Icon: FC<Props> = ({ name, color, size, onClick, isBig }) => {
  const iconClass = "ri-" + name;

  return (
    <I
      className={iconClass}
      color={color || DEFAULT_COLOR}
      size={size || DEFAULT_SIZE}
      clickable={!!onClick}
      onClick={onClick}
      isBig={!!isBig}
    />
  );
};

export default Icon;
