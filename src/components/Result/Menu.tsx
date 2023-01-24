import { FC } from "react";
import styled from "styled-components";
import { Icon } from "../../common";
import { DARK, LESS_DARK, LIGHT, PINK, TAN } from "../../styles";
import { StrPixels } from "../../utils";

interface Props {
  pixels: StrPixels;
}

const MenuContainer = styled.div`
  height: 64px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  border: 2px solid ${DARK};
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

const Menu: FC<Props> = ({ pixels }) => {
  return (
    <MenuContainer>
      <ButtonContainer>
        <Icon
          name={"twitter-line"}
          color={DARK}
          size={32}
          onClick={() => {
            window.open(
              "https://twitter.com/intent/tweet?text=Just%20learned%20how%20JPEG%20works%20at%20www.play-jpeg.com. Pretty cool, I guess."
            );
          }}
        />
      </ButtonContainer>
      <ButtonContainer>
        <Icon
          name={"linkedin-box-fill"}
          color={DARK}
          size={32}
          onClick={() => {
            window.open(
              "https://www.linkedin.com/shareArticle?mini=true&url=http://mark-pekala.dev"
            );
          }}
        />
      </ButtonContainer>
    </MenuContainer>
  );
};

export default Menu;
