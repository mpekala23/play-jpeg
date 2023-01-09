import React, { createRef, FC, useState } from "react";
import styled from "styled-components";
import { DARK_LESS, LIGHT, LIGHT_PINK } from "../../styles";
import { useOutsideAlert } from "../../utils/hooks.ts/useOutsideAlert";
import { confirmAlert } from "react-confirm-alert";
import { NumPixels } from "../../utils";

interface Props {
  updateQTable: (vals: NumPixels) => void;
}

const MenuContainer = styled.div`
  height: 64px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  border: 1px solid ${LIGHT};
  background-color: ${DARK_LESS};
`;

const ButtonContainer = styled.div<{ bgColor?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  background-color: ${(p) => p.bgColor};
`;

const Menu: FC<Props> = ({ updateQTable }) => {
  return <MenuContainer></MenuContainer>;
};

export default Menu;
