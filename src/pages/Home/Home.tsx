import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PageBackground } from "../../styles";
import QTable from "../../components/QTable/QTable";
import Canvas from "../../components/Canvas/Canvas";
import Result from "../../components/Result/Result";
import {
  getChannelNumericVals,
  getChannelStringVals,
  getPositionString,
  JPEG_decode,
  JPEG_encode,
  NumPixels,
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
    const qPrime: NumPixels = {};
    for (let rx = 0; rx < 8; rx++) {
      for (let cx = 0; cx < 8; cx++) {
        const key = getPositionString(rx, cx);
        qPrime[key] = Math.max(1, QVals[key]);
      }
    }
    const rVals = getChannelNumericVals(0, rawVals);
    const gVals = getChannelNumericVals(1, rawVals);
    const bVals = getChannelNumericVals(2, rawVals);
    const rEncoded = JPEG_encode(rVals, qPrime);
    const gEncoded = JPEG_encode(gVals, qPrime);
    const bEncoded = JPEG_encode(bVals, qPrime);
    const rDecoded = JPEG_decode(rEncoded, qPrime);
    const gDecoded = JPEG_decode(gEncoded, qPrime);
    const bDecoded = JPEG_decode(bEncoded, qPrime);
    const strOutputVals = getChannelStringVals(rDecoded, gDecoded, bDecoded);
    setOutputVals(strOutputVals);
  }, [rawVals, QVals, isPenDown]);

  return (
    <PageBackground>
      <h1 className="text-4xl mb-8 font-bold">play.JPEG</h1>
      <RowWrapper>
        <Canvas updateVals={setRawVals} updatePenDown={setIsPenDown} />
        <QTable updateVals={setQVals} />
        <Result vals={outputVals} />
      </RowWrapper>
      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-screen-lg text-left">
          <p className="text-3xl font-bold mt-2 mb-4">What is JPEG?</p>
          <p>
            JPEG (short for{" "}
            <a
              href="https://en.wikipedia.org/wiki/Joint_Photographic_Experts_Group"
              target="_blank"
              className="underline hover:cursor-pointer"
            >
              Joint Photographic Experts Group
            </a>
            ) is a commonly used image compression algorithm based on the
            discrete cosine transform. At a high level, it takes advantage of
            the human eye's sensitivity (or lack thereof) to certain image
            features to compress images while minimizing perceptible
            differences. It's fast to compress, decompress, and easy to tune to
            a specific quality. By nature the JPEG compression scheme is lossy,
            but with minimal extra work it can be made lossless.
          </p>
          <p className="text-3xl font-bold mt-8">
            How does JPEG encoding work?
          </p>
          <p className="text-xl font-bold italic my-4">Preprocessing</p>
          <p>
            First, the image is converted from RGB to a different color space
            called YCbCr. This color space represents each pixel with three
            values, aptly named Y, Cb, and Cr. The Y value simply represents the
            brightness of the pixel while the Cb and Cr values represent the
            chrominance (split into red and blue components). The justification
            will become clear in the next subsection.
          </p>
          <p className="text-xl font-bold italic my-4">Downsampling</p>
          <p>
            In general, the human eye is much more perceptive to changes in
            brightness (Y) than chrominance (Cb and Cr). The idea of this step
            is to compress the information contained in the chrominance of the
            image, which will give us "cheaper" compression relative to
            compressing in RBG, because the changes will be less noticeable to
            the human eye. But what is downsampling? You can think of
            downsampling in this case as simply creating a smaller version of
            the image through averaging. For example, downsampling a 4x4 image
            into a 2x2 image might look like so:
          </p>
          <table></table>
        </div>
      </div>
    </PageBackground>
  );
};

export default HomePage;
