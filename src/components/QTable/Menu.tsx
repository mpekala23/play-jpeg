import React, { createRef, FC, useCallback, useState } from "react";
import styled from "styled-components";
import { DARK, TAN } from "../../styles";
import { useOutsideAlert } from "../../utils/hooks.ts/useOutsideAlert";
import { getPositionString, GRIDSIZE, NumPixels } from "../../utils";
import { Icon } from "../../common";
import SelectPremade from "./SelectPremade";

interface Props {
  updateQTable: (vals: NumPixels) => void;
}

const MenuContainer = styled.div`
  height: 64px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  border: 2px solid ${DARK};
  border-top: 0px;
  background-color: ${TAN};
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
  const [isSelectingPremade, setIsSelectingPremade] = useState(false);
  const premadePickerRef = createRef<HTMLDivElement>();

  const randomize = useCallback(() => {
    let randomVals: { [key: string]: number } = {};
    for (let rx = 0; rx < GRIDSIZE; rx += 1) {
      for (let cx = 0; cx < GRIDSIZE; cx += 1) {
        let key = getPositionString(rx, cx);
        randomVals[key] = Math.floor(Math.random() * 255) + 1;
      }
    }
    updateQTable(randomVals);
  }, [updateQTable]);

  useOutsideAlert(premadePickerRef, () => {
    setTimeout(() => {
      setIsSelectingPremade(false);
    }, 100);
  });

  return (
    <MenuContainer>
      <ButtonContainer>
        <Icon
          name={"shuffle-line"}
          color={DARK}
          size={32}
          onClick={randomize}
        />
      </ButtonContainer>
      <ButtonContainer>
        <div>
          <Icon
            name={isSelectingPremade ? "book-3-fill" : "book-3-line"}
            isBig={isSelectingPremade}
            color={DARK}
            size={32}
            onClick={() => {
              setIsSelectingPremade((val: boolean) => !val);
            }}
          />
          {isSelectingPremade && (
            <div ref={premadePickerRef}>
              <SelectPremade onSelectQTable={updateQTable} />
            </div>
          )}
        </div>
      </ButtonContainer>
    </MenuContainer>
  );
};

export default Menu;
