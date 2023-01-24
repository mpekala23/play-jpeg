import React, { FC, ReactNode } from "react";
import styled from "styled-components";
import { DARK } from "../../styles";
import { getPositionString, GRIDSIZE } from "../../utils";
import { BOXSIZE, BOXBORDERSIZE } from "./constants";
import Menu from "./Menu";
import Pixel from "./Pixel";

interface Props {
  vals: { [key: string]: string };
}

const OuterResult = styled.div`
  width: ${BOXSIZE * GRIDSIZE + GRIDSIZE * BOXBORDERSIZE + 4}px;
  height: ${BOXSIZE * GRIDSIZE + GRIDSIZE * BOXBORDERSIZE + 2}px;
  border: 2px solid ${DARK};
  font-size: 0;
`;

const Result: FC<Props> = ({ vals }) => {
  const renderBoxes: () => ReactNode = () => {
    let result: JSX.Element[] = [];
    for (let rx = 0; rx < GRIDSIZE; rx += 1) {
      for (let cx = 0; cx < GRIDSIZE; cx += 1) {
        let key = getPositionString(rx, cx);
        result.push(<Pixel key={key} rx={rx} cx={cx} val={vals[key]} />);
      }
    }
    return result;
  };

  return (
    <div>
      <OuterResult>{renderBoxes()}</OuterResult>
      <Menu pixels={vals} />
    </div>
  );
};

export default Result;
