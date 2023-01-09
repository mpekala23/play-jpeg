import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { BOXSIZE, BOXBORDERSIZE } from "./constants";
import Pixel from "./Pixel";
import { getPositionString, GRIDSIZE } from "../../utils";
import Menu from "./Menu";
import { useOutsideAlert } from "../../utils/hooks.ts/useOutsideAlert";

interface Props {
  updateVals: (vals: { [key: string]: string }) => void;
  updatePenDown: (isDown: boolean) => void;
}

const CanvasContainer = styled.div``;

const OuterCanvas = styled.div`
  width: ${BOXSIZE * GRIDSIZE + GRIDSIZE * BOXBORDERSIZE}px;
  height: ${BOXSIZE * GRIDSIZE + GRIDSIZE * BOXBORDERSIZE}px;
  font-size: 0;
`;

function mapMouseToPos(
  mouseX: number,
  mouseY: number
): { rx: number; cx: number } {
  return {
    rx: Math.floor(mouseY / (BOXSIZE + BOXBORDERSIZE)),
    cx: Math.floor(mouseX / (BOXSIZE + BOXBORDERSIZE)),
  };
}

const Canvas: FC<Props> = ({ updateVals, updatePenDown }) => {
  const selfRef = useRef<HTMLDivElement>(null);
  const BLANK_VAL_MAP = useRef<{ [key: string]: string }>({});
  const [vals, setVals] = useState<{ [key: string]: string }>({});
  const [isPenDown, setIsPenDown] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#000000");
  const [isEyedropping, setIsEyedropping] = useState<boolean>(false);
  const mouseX = useRef<number>(0);
  const mouseY = useRef<number>(0);

  useEffect(() => {
    for (let rx = 0; rx < GRIDSIZE; rx += 1) {
      for (let cx = 0; cx < GRIDSIZE; cx += 1) {
        let key = getPositionString(rx, cx);
        BLANK_VAL_MAP.current[key] = "#ffffff";
      }
    }
    setVals({ ...BLANK_VAL_MAP.current });
  }, []);

  useEffect(() => {
    updateVals(vals);
  }, [vals]);

  const penDown = useCallback(() => {
    setIsPenDown(true);
  }, [setIsPenDown]);
  const penUp = useCallback(() => {
    setIsPenDown(false);
  }, [setIsPenDown]);

  useEffect(() => {
    updatePenDown(isPenDown);
  }, [isPenDown]);

  const clearCanvas = useCallback(() => {
    setVals({ ...BLANK_VAL_MAP.current });
  }, [setVals]);

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

  useOutsideAlert(selfRef, () => {
    setIsEyedropping(false);
  });

  return (
    <CanvasContainer>
      <OuterCanvas
        ref={selfRef}
        onMouseDown={(e) => {
          if (selfRef.current) {
            mouseX.current = e.pageX - selfRef.current.offsetLeft;
            mouseY.current = e.pageY - selfRef.current.offsetTop;
            const pos = mapMouseToPos(mouseX.current, mouseY.current);
            const key = getPositionString(pos.rx, pos.cx);
            if (!isEyedropping) {
              setVals((oldVals) => {
                const newVals = { ...oldVals };
                newVals[key] = color;
                return newVals;
              });
            } else {
              setColor(vals[key]);
              setIsEyedropping(false);
            }
          }
          penDown();
        }}
        onMouseUp={penUp}
        onMouseMove={(e) => {
          if (selfRef.current) {
            mouseX.current = e.pageX - selfRef.current.offsetLeft;
            mouseY.current = e.pageY - selfRef.current.offsetTop;
            const pos = mapMouseToPos(mouseX.current, mouseY.current);
            if (isPenDown) {
              const key = getPositionString(pos.rx, pos.cx);
              setVals((oldVals) => {
                const newVals = { ...oldVals };
                newVals[key] = color;
                return newVals;
              });
            }
          }
        }}
        onMouseLeave={penUp}
        onMouseEnter={(e) => {
          if (e.buttons > 0) {
            penDown();
          } else {
            penUp();
          }
        }}
      >
        {renderBoxes()}
      </OuterCanvas>
      <Menu
        color={color}
        updateColor={setColor}
        updatePixels={setVals}
        isEyedropping={isEyedropping}
        setIsEyedropping={setIsEyedropping}
        clearCanvas={clearCanvas}
      />
    </CanvasContainer>
  );
};

export default Canvas;
