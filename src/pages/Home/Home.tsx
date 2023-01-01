import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PageBackground } from "../../styles";
import QTable from "../../components/QTable/QTable";
import Canvas from "../../components/Canvas/Canvas";
import Result from "../../components/Result/Result";
import {
  getChannelNumericVals,
  getChannelStringVals,
  JPEG_decode,
  JPEG_encode,
} from "../../utils";

const RowWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const HomePage: React.FC = () => {
  const [rawVals, setRawVals] = useState<{ [key: string]: string }>({});
  const [QVals, setQVals] = useState<{ [key: string]: number }>({});
  const [outputVals, setOutputVals] = useState<{ [key: string]: string }>({});
  const [isPenDown, setIsPenDown] = useState<boolean>();

  useEffect(() => {
    if (isPenDown) return;
    const rVals = getChannelNumericVals(0, rawVals);
    const gVals = getChannelNumericVals(1, rawVals);
    const bVals = getChannelNumericVals(2, rawVals);
    const rEncoded = JPEG_encode(rVals, QVals);
    const gEncoded = JPEG_encode(gVals, QVals);
    const bEncoded = JPEG_encode(bVals, QVals);
    const rDecoded = JPEG_decode(rEncoded, QVals);
    const gDecoded = JPEG_decode(gEncoded, QVals);
    const bDecoded = JPEG_decode(bEncoded, QVals);
    const strOutputVals = getChannelStringVals(rDecoded, gDecoded, bDecoded);
    setOutputVals(strOutputVals);
  }, [rawVals, QVals, isPenDown]);

  return (
    <PageBackground>
      <h1>play.JPEG</h1>
      <RowWrapper>
        <Canvas updateVals={setRawVals} updatePenDown={setIsPenDown} />
        <QTable updateVals={setQVals} />
        <Result vals={outputVals} />
      </RowWrapper>
    </PageBackground>
  );
};

export default HomePage;
