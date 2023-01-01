import React, { createRef, FC, useState } from "react";
import { SketchPicker } from "react-color";
import styled from "styled-components";
import { Icon } from "../../common";
import { DARK_LESS, LIGHT, LIGHT_PINK } from "../../styles";
import { invertColor, StrPixels } from "../../utils";
import { useOutsideAlert } from "../../utils/hooks.ts/useOutsideAlert";
import { confirmAlert } from "react-confirm-alert";

interface Props {
  color: string;
  updateColor: (newColor: string) => void;
  updatePixels: (newPixels: StrPixels) => void;
  isEyedropping: boolean;
  setIsEyedropping: React.Dispatch<React.SetStateAction<boolean>>;
  clearCanvas: () => void;
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

const Menu: FC<Props> = ({
  color,
  updateColor,
  isEyedropping,
  setIsEyedropping,
  updatePixels,
  clearCanvas,
}) => {
  const [isSelectingColor, setIsSelectingColor] = useState<boolean>(false);
  const sketchPickerRef = createRef<HTMLDivElement>();

  useOutsideAlert(sketchPickerRef, () => {
    setTimeout(() => {
      setIsSelectingColor(false);
    }, 100);
  });

  return (
    <MenuContainer>
      <ButtonContainer bgColor={invertColor(color)}>
        <div>
          <Icon
            name="palette-fill"
            isBig={isSelectingColor}
            color={color}
            size={32}
            onClick={() => {
              setIsSelectingColor((val) => !val);
            }}
          />
          {isSelectingColor && (
            <div
              ref={sketchPickerRef}
              style={{ position: "absolute", transform: "translateX(-96px)" }}
            >
              <SketchPicker
                color={color}
                onChange={(newColor) => {
                  updateColor(newColor.hex);
                }}
              />
            </div>
          )}
        </div>
      </ButtonContainer>
      <ButtonContainer>
        <Icon
          name={isEyedropping ? "sip-fill" : "sip-line"}
          isBig={isEyedropping}
          color={LIGHT_PINK}
          size={32}
          onClick={() => {
            setIsEyedropping((val: boolean) => !val);
          }}
        />
      </ButtonContainer>
      <ButtonContainer>
        <Icon
          name={"delete-bin-line"}
          color={LIGHT_PINK}
          size={32}
          onClick={() => {
            confirmAlert({
              title: "Clear the canvas?",
              message: "You cannot undo this.",
              buttons: [
                {
                  label: "Yes",
                  onClick: () => clearCanvas(),
                },
                {
                  label: "No",
                },
              ],
            });
          }}
        />
      </ButtonContainer>
    </MenuContainer>
  );
};

export default Menu;
