import React, { FC } from "react";
import styled from "styled-components";
import { LESS_DARK, DEFAULT_TRANSITION, MARGIN, PADDING } from "../../styles";
import { NumPixels } from "../../utils";
import { PREMADE_QTABLES } from "./premades";

interface Props {
  onSelectQTable: (newVals: NumPixels) => void;
}

const PREMADE_SIZE = 80;
const PREMADE_BORDER = 2;

const Container = styled.div`
  position: absolute;
  display: flex;
  transform: translateX(-118px);
  background-color: #fff;
  border-radius: 8px;
  box-shadow: rgb(0 0 0 / 15%) 0px 0px 0px 1px, rgb(0 0 0 / 15%) 0px 8px 16px;
  padding: ${PADDING}px;
  height: ${1 * PREMADE_SIZE + 2 * PADDING + 0 * MARGIN + 4 * PREMADE_BORDER}px;
  width: ${3 * PREMADE_SIZE + 2 * PADDING + 2 * MARGIN + 8 * PREMADE_BORDER}px;
  flex-wrap: wrap;
`;

const SquareContainer = styled.div`
  width: ${PREMADE_SIZE}px;
  height: ${PREMADE_SIZE}px;
  margin: ${MARGIN / 2}px;
  transition: ${DEFAULT_TRANSITION};
  border: ${PREMADE_BORDER}px solid white;
  border-radius: 4px;
  :hover {
    transform: scale(1.2);
    cursor: pointer;
    z-index: 100;
    border: ${PREMADE_BORDER}px solid ${LESS_DARK};
  }
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SelectPremade: FC<Props> = ({ onSelectQTable }) => {
  return (
    <Container>
      {PREMADE_QTABLES.map((qTab) => {
        return (
          <SquareContainer
            onClick={() => {
              onSelectQTable(qTab.pixels);
            }}
          >
            <p className="text-black">{qTab.name}</p>
          </SquareContainer>
        );
      })}
    </Container>
  );
};

export default SelectPremade;
