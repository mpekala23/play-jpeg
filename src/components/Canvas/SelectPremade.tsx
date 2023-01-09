import React, { FC } from "react";
import styled from "styled-components";
import { ALT_DARK, DEFAULT_TRANSITION, MARGIN, PADDING } from "../../styles";
import { StrPixels } from "../../utils";
import { Premade, PREMADES } from "./premades";

interface Props {
  onSelectImage: (newPixels: StrPixels) => void;
}

const PREMADE_SIZE = 80;
const PREMADE_BORDER = 2;

const Container = styled.div`
  position: absolute;
  display: flex;
  transform: translateX(-155px);
  background-color: #fff;
  border-radius: 8px;
  box-shadow: rgb(0 0 0 / 15%) 0px 0px 0px 1px, rgb(0 0 0 / 15%) 0px 8px 16px;
  padding: ${PADDING}px;
  height: ${2 * PREMADE_SIZE + 2 * PADDING + 0 * MARGIN + 4 * PREMADE_BORDER}px;
  width: ${4 * PREMADE_SIZE + 2 * PADDING + 2 * MARGIN + 8 * PREMADE_BORDER}px;
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
    border: ${PREMADE_BORDER}px solid ${ALT_DARK};
  }
`;

const PremadeImage = styled.img`
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
`;

const PremadeSquare: FC<
  Premade & { onSelectImage: (pix: StrPixels) => void }
> = ({ filename, pixels, onSelectImage }) => {
  return (
    <SquareContainer
      onClick={() => {
        onSelectImage(pixels);
      }}
    >
      <PremadeImage src={filename} alt={filename} />
    </SquareContainer>
  );
};

const SelectPremade: FC<Props> = ({ onSelectImage }) => {
  return (
    <Container>
      {PREMADES.map((premade) => (
        <PremadeSquare
          key={premade.filename}
          onSelectImage={onSelectImage}
          {...premade}
        />
      ))}
    </Container>
  );
};

export default SelectPremade;
