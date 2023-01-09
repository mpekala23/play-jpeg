import React, { FC, ReactNode } from "react";
import styled from "styled-components";
import { getPositionString, GRIDSIZE } from "../../utils";
import { BOXSIZE, BOXBORDERSIZE } from "./constants";
import Pixel from "./Pixel";

interface Props {
  vals: { [key: string]: string };
}

const OuterResult = styled.div`
  width: ${BOXSIZE * GRIDSIZE + GRIDSIZE * BOXBORDERSIZE}px;
  height: ${BOXSIZE * GRIDSIZE + GRIDSIZE * BOXBORDERSIZE}px;
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

  return <OuterResult>{renderBoxes()}</OuterResult>;
};

export default Result;
