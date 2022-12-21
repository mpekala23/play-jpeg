import React, { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { DARK, DARK_LESS, LIGHT } from "../../styles";
import { BOXSIZE, BOXBORDERSIZE } from "./constants";

interface Props {
  rx: number;
  cx: number;
  isEditing: boolean;
  isSelecting: boolean;
  val: number;
  updateVal: ({ val, done }: { val: number; done: boolean }) => void;
}

const OuterBox = styled.div<{ isSelected: boolean }>`
  display: inline-block;
  animation: ${(props) =>
    props.isSelected ? "blinker 3s linear infinite" : "none"};
  @keyframes blinker {
    from {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
    to {
      opacity: 1;
    }
  }
  width: ${BOXSIZE}px;
  height: ${BOXSIZE}px;
  padding: 0px;
  border: ${BOXBORDERSIZE / 2}px solid var(--light);
  background-color: ${(props) => (props.isSelected ? DARK_LESS : DARK)};
`;

const HiddenInput = styled.input`
  width: 100%;
  height: ${BOXSIZE}px;
  padding: 0px;
  margin: 0px;
  border: 0px;
  color: ${LIGHT};
  font-size: 18px;
  background-color: transparent;
  text-align: center;
  caret-color: ${DARK};
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  :focus {
    outline-width: 0px;
  }
`;

const Box: FC<Props> = ({ rx, cx, isEditing, isSelecting, val, updateVal }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localVal, setLocalVal] = useState<number>(val);

  useEffect(() => {
    if (localVal !== val) {
      updateVal({ val: localVal, done: false });
    }
  }, [localVal]);

  useEffect(() => {
    if (inputRef.current) {
      // inputRef.current.focus();
    }
  }, [isSelecting]);

  const handleBlur = () => {
    updateVal({ val: localVal, done: true });
  };

  useEffect(() => {
    setLocalVal(val);
  }, [val]);

  return (
    <OuterBox isSelected={isSelecting}>
      <HiddenInput
        ref={inputRef}
        type="number"
        id={`${rx}-${cx}`}
        min="0"
        max="255"
        value={localVal || ""}
        onChange={(e) => {
          let newVal = Number(e.target.value);
          if (newVal > 255) newVal = 255;
          if (newVal < 0) newVal = 0;
          setLocalVal(newVal);
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter" && inputRef.current) {
            inputRef.current.blur();
          }
        }}
        onBlur={handleBlur}
      />
    </OuterBox>
  );
};

export default Box;
