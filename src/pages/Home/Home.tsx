import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PageBackground } from "../../styles";
import QTable from "../../components/QTable/QTable";
import Canvas from "../../components/Canvas/Canvas";
import Result from "../../components/Result/Result";
import {
  getNumericVals,
  getStringVals,
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

  useEffect(() => {
    const numVals = getNumericVals(rawVals);
    const encoded = JPEG_encode(numVals, QVals);
    const decoded = JPEG_decode(encoded, QVals);
    const strOutputVals = getStringVals(decoded);
    setOutputVals(strOutputVals);
  }, [rawVals, QVals]);

  return (
    <PageBackground>
      <h1>Play JPEG</h1>
      <RowWrapper>
        <Canvas updateVals={setRawVals} />
        <QTable updateVals={setQVals} />
        <Result vals={outputVals} />
      </RowWrapper>
    </PageBackground>
  );
};

export default HomePage;
