import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { DARK, LIGHT } from "../../styles";
import { getPositionString, GRIDSIZE } from "../../utils";
import Box from "./Box";
import { BOXSIZE, BOXBORDERSIZE } from "./constants";
import Menu from "./Menu";

interface Props {
  updateVals: (vals: { [key: string]: number }) => void;
}

const OuterBox = styled.div`
  border: 2px solid ${DARK};
  width: ${BOXSIZE * GRIDSIZE + BOXBORDERSIZE + 3}px;
  height: ${BOXSIZE * GRIDSIZE + BOXBORDERSIZE + 3}px;
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

const QTable: FC<Props> = ({ updateVals }) => {
  const selfRef = useRef<HTMLDivElement>(null);
  const BLANK_BOOL_MAP = useRef<{ [key: string]: boolean }>({});
  const [vals, setVals] = useState<{ [key: string]: number }>({});
  const [selectingMap, setSelectingMap] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [editingMap, setEditingMap] = useState<{ [key: string]: boolean }>({});
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const mouseX = useRef<number>(0);
  const mouseY = useRef<number>(0);
  const [initialMouseX, setInitialMouseX] = useState<number>(0);
  const [initialMouseY, setInitialMouseY] = useState<number>(0);

  useEffect(() => {
    let initialVals: { [key: string]: number } = {};
    for (let rx = 0; rx < GRIDSIZE; rx += 1) {
      for (let cx = 0; cx < GRIDSIZE; cx += 1) {
        let key = getPositionString(rx, cx);
        BLANK_BOOL_MAP.current[key] = false;
        initialVals[key] = 1;
      }
    }
    setSelectingMap({ ...BLANK_BOOL_MAP.current });
    setEditingMap({ ...BLANK_BOOL_MAP.current });
    setVals(initialVals);
  }, []);

  const resetMaps = useCallback(() => {
    setSelectingMap({ ...BLANK_BOOL_MAP.current });
    setEditingMap({ ...BLANK_BOOL_MAP.current });
  }, [setSelectingMap, setEditingMap]);

  const updateBox = ({ val, done }: { val: number; done: boolean }) => {
    if (done) {
      if (val === 0) {
        setVals((oldVals) => {
          let newVals: { [key: string]: number } = {};
          for (let rx = 0; rx < GRIDSIZE; rx += 1) {
            for (let cx = 0; cx < GRIDSIZE; cx += 1) {
              let key = getPositionString(rx, cx);
              const shouldChange = editingMap[key];
              newVals[key] = shouldChange ? 1 : oldVals[key];
            }
          }
          return newVals;
        });
      }
      resetMaps();
    }
    if (!done) {
      setVals((oldVals) => {
        let newVals: { [key: string]: number } = {};
        for (let rx = 0; rx < GRIDSIZE; rx += 1) {
          for (let cx = 0; cx < GRIDSIZE; cx += 1) {
            let key = getPositionString(rx, cx);
            const shouldChange = editingMap[key];
            newVals[key] = shouldChange ? val : oldVals[key];
          }
        }
        return newVals;
      });
    }
  };

  const renderBoxes: () => ReactNode = () => {
    let result: JSX.Element[] = [];
    for (let rx = 0; rx < GRIDSIZE; rx += 1) {
      for (let cx = 0; cx < GRIDSIZE; cx += 1) {
        let key = getPositionString(rx, cx);
        result.push(
          <Box
            rx={rx}
            cx={cx}
            isEditing={editingMap[key]}
            isSelecting={selectingMap[key]}
            val={vals[key]}
            updateVal={updateBox}
            key={key}
          />
        );
      }
    }
    return result;
  };

  const startSelecting = useCallback(() => {
    setIsSelecting(true);
  }, [setIsSelecting]);

  const stopSelecting = useCallback(() => {
    setIsSelecting(false);
    if (isSelecting) updateSelectingMap();
  }, [setIsSelecting, initialMouseX, initialMouseY]);

  const updateSelectingMap = useCallback(() => {
    let initialPos = mapMouseToPos(initialMouseX, initialMouseY);
    let currentPos = mapMouseToPos(mouseX.current, mouseY.current);
    let minRx = Math.min(initialPos.rx, currentPos.rx);
    let maxRx = Math.max(initialPos.rx, currentPos.rx);
    let minCx = Math.min(initialPos.cx, currentPos.cx);
    let maxCx = Math.max(initialPos.cx, currentPos.cx);
    let newSelectingMap: { [key: string]: boolean } = {};
    for (let rx = 0; rx < GRIDSIZE; rx += 1) {
      for (let cx = 0; cx < GRIDSIZE; cx += 1) {
        let key = getPositionString(rx, cx);
        newSelectingMap[key] =
          minRx <= rx && rx <= maxRx && minCx <= cx && cx <= maxCx;
      }
    }
    setSelectingMap(newSelectingMap);
  }, [initialMouseX, initialMouseY]);

  const startEditing = useCallback(() => {
    let initialPos = mapMouseToPos(initialMouseX, initialMouseY);
    let finalPos = mapMouseToPos(mouseX.current, mouseY.current);
    let minRx = Math.min(initialPos.rx, finalPos.rx);
    let maxRx = Math.max(initialPos.rx, finalPos.rx);
    let minCx = Math.min(initialPos.cx, finalPos.cx);
    let maxCx = Math.max(initialPos.cx, finalPos.cx);
    let newEditingMap: { [key: string]: boolean } = {};
    for (let rx = 0; rx < GRIDSIZE; rx += 1) {
      for (let cx = 0; cx < GRIDSIZE; cx += 1) {
        let key = getPositionString(rx, cx);
        newEditingMap[key] =
          minRx <= rx && rx <= maxRx && minCx <= cx && cx <= maxCx;
      }
    }
    setEditingMap(newEditingMap);
  }, [initialMouseX, initialMouseY]);

  useEffect(() => {
    if (isSelecting) {
      resetMaps();
      if (selfRef.current) {
        setInitialMouseX(mouseX.current);
        setInitialMouseY(mouseY.current);
      }
    } else {
      startEditing();
    }
  }, [isSelecting]);

  useEffect(() => {
    updateVals(vals);
  }, [vals]);

  return (
    <div>
      <OuterBox
        ref={selfRef}
        onMouseDown={startSelecting}
        onMouseUp={stopSelecting}
        onMouseMove={(e) => {
          if (selfRef.current) {
            mouseX.current = e.pageX - selfRef.current.offsetLeft;
            mouseY.current = e.pageY - selfRef.current.offsetTop;
            if (isSelecting) updateSelectingMap();
          }
        }}
      >
        <form>{renderBoxes()}</form>
      </OuterBox>
      <Menu updateQTable={setVals} />
    </div>
  );
};

export default QTable;
