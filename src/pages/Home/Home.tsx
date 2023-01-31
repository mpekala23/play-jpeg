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
import Latex from "react-latex";
import { BlockMath } from "react-katex";

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
      <div className="my-8 flex justify-center">
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
            differences. Both compression and decompression are fast, and
            through the use of quantization tables it's very easy to tune to a
            specific quality. By nature the JPEG compression scheme is lossy,
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
            chrominance (split into blue and red components). The justification
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
          <div className="flex justify-center items-center my-4">
            <table>
              <tbody>
                <tr>
                  <td className="w-8 border border-black text-center">1</td>
                  <td className="w-8 border border-black text-center">2</td>
                  <td className="w-8 border border-black text-center">3</td>
                  <td className="w-8 border border-black text-center">4</td>
                </tr>
                <tr>
                  <td className="w-8 border border-black text-center">5</td>
                  <td className="w-8 border border-black text-center">6</td>
                  <td className="w-8 border border-black text-center">7</td>
                  <td className="w-8 border border-black text-center">8</td>
                </tr>
                <tr>
                  <td className="w-8 border border-black text-center">9</td>
                  <td className="w-8 border border-black text-center">10</td>
                  <td className="w-8 border border-black text-center">11</td>
                  <td className="w-8 border border-black text-center">12</td>
                </tr>
                <tr>
                  <td className="w-8 border border-black text-center">13</td>
                  <td className="w-8 border border-black text-center">14</td>
                  <td className="w-8 border border-black text-center">15</td>
                  <td className="w-8 border border-black text-center">16</td>
                </tr>
              </tbody>
            </table>
            <div className="mx-6 scale-[2]">
              <Latex displayMode={true}>$$\to$$</Latex>
            </div>
            <table>
              <tbody>
                <tr>
                  <td className="w-10 border border-black text-center">3.5</td>
                  <td className="w-10 border border-black text-center">5.5</td>
                </tr>
                <tr>
                  <td className="w-10 border border-black text-center">11.5</td>
                  <td className="w-10 border border-black text-center">13.5</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Notice that we begin with a 4x4 image and end up with a 2x2 image.
            I.e., compression has occured. The values in this example are
            obtained by average disjoint 2x2 blocks present in the original
            image. For JPEG compression, usually the Y channel is left
            unchanged, and some combination of the chrominance channel is
            downsampled to give cheap initial compression.
          </p>
          <p className="mt-4">
            NOTE: From here on out, the encoding procedure will work on one
            channel at a time. That is to say, we repeat the remaining process
            below three times, once per channel.
          </p>
          <p className="text-xl font-bold italic my-4">Block splitting</p>
          <p>
            JPEG compression works on blocks of 8x8 pixels. If either the width
            or the height of the image is not a multiple of eight, pixels are
            added to the edges of image, and then removed during decoding. Since
            changing any one pixel in the 8x8 block can affect all pixels,
            usually the edges are extended by duplicating border pixels, or more
            sophisticated technique, to minimize distortion.
          </p>
          <p className="text-xl font-bold italic my-4">
            Discrete Cosine Transform
          </p>
          <p>
            At a high level, the DCT aims to break the image up into a series of
            waves added together that form the entire image. As it turns out,
            this wave-based representation gels well with our inate models of
            perception, meaning that as long as we roughly preserve these
            values, we often won't be able to tell the difference.
          </p>
          <p className="mt-4">
            Before we can run the DCT, however, we need to make sure that pixel
            values are centered around zero. That means simply mapping [0, 255]
            to [-128, 127]. Here's an example of the shift:
          </p>
          <div className="flex justify-center items-center my-4">
            <table>
              <tbody>
                <tr>
                  <td className="w-12 border border-black text-center">58</td>
                  <td className="w-12 border border-black text-center">45</td>
                  <td className="w-12 border border-black text-center">29</td>
                  <td className="w-12 border border-black text-center">27</td>
                  <td className="w-12 border border-black text-center">24</td>
                  <td className="w-12 border border-black text-center">19</td>
                  <td className="w-12 border border-black text-center">17</td>
                  <td className="w-12 border border-black text-center">20</td>
                </tr>
                <tr>
                  <td className="w-12 border border-black text-center">62</td>
                  <td className="w-12 border border-black text-center">52</td>
                  <td className="w-12 border border-black text-center">42</td>
                  <td className="w-12 border border-black text-center">41</td>
                  <td className="w-12 border border-black text-center">38</td>
                  <td className="w-12 border border-black text-center">30</td>
                  <td className="w-12 border border-black text-center">22</td>
                  <td className="w-12 border border-black text-center">18</td>
                </tr>
                <tr>
                  <td className="w-12 border border-black text-center">48</td>
                  <td className="w-12 border border-black text-center">47</td>
                  <td className="w-12 border border-black text-center">49</td>
                  <td className="w-12 border border-black text-center">44</td>
                  <td className="w-12 border border-black text-center">40</td>
                  <td className="w-12 border border-black text-center">36</td>
                  <td className="w-12 border border-black text-center">31</td>
                  <td className="w-12 border border-black text-center">25</td>
                </tr>
                <tr>
                  <td className="w-12 border border-black text-center">59</td>
                  <td className="w-12 border border-black text-center">78</td>
                  <td className="w-12 border border-black text-center">49</td>
                  <td className="w-12 border border-black text-center">32</td>
                  <td className="w-12 border border-black text-center">28</td>
                  <td className="w-12 border border-black text-center">31</td>
                  <td className="w-12 border border-black text-center">31</td>
                  <td className="w-12 border border-black text-center">31</td>
                </tr>
                <tr>
                  <td className="w-12 border border-black text-center">98</td>
                  <td className="w-12 border border-black text-center">138</td>
                  <td className="w-12 border border-black text-center">116</td>
                  <td className="w-12 border border-black text-center">78</td>
                  <td className="w-12 border border-black text-center">39</td>
                  <td className="w-12 border border-black text-center">24</td>
                  <td className="w-12 border border-black text-center">25</td>
                  <td className="w-12 border border-black text-center">27</td>
                </tr>
                <tr>
                  <td className="w-12 border border-black text-center">115</td>
                  <td className="w-12 border border-black text-center">160</td>
                  <td className="w-12 border border-black text-center">143</td>
                  <td className="w-12 border border-black text-center">97</td>
                  <td className="w-12 border border-black text-center">48</td>
                  <td className="w-12 border border-black text-center">27</td>
                  <td className="w-12 border border-black text-center">24</td>
                  <td className="w-12 border border-black text-center">21</td>
                </tr>
                <tr>
                  <td className="w-12 border border-black text-center">99</td>
                  <td className="w-12 border border-black text-center">137</td>
                  <td className="w-12 border border-black text-center">127</td>
                  <td className="w-12 border border-black text-center">84</td>
                  <td className="w-12 border border-black text-center">42</td>
                  <td className="w-12 border border-black text-center">25</td>
                  <td className="w-12 border border-black text-center">24</td>
                  <td className="w-12 border border-black text-center">20</td>
                </tr>
                <tr>
                  <td className="w-12 border border-black text-center">74</td>
                  <td className="w-12 border border-black text-center">95</td>
                  <td className="w-12 border border-black text-center">82</td>
                  <td className="w-12 border border-black text-center">67</td>
                  <td className="w-12 border border-black text-center">40</td>
                  <td className="w-12 border border-black text-center">25</td>
                  <td className="w-12 border border-black text-center">25</td>
                  <td className="w-12 border border-black text-center">19</td>
                </tr>
              </tbody>
            </table>
            <div className="mx-6 scale-[2]">
              <Latex displayMode={true}>$$\to$$</Latex>
            </div>
            <table>
              <tbody>
                <tr>
                  <td className="w-12 border border-black text-center">-70</td>
                  <td className="w-12 border border-black text-center">-83</td>
                  <td className="w-12 border border-black text-center">-99</td>
                  <td className="w-12 border border-black text-center">-101</td>
                  <td className="w-12 border border-black text-center">-104</td>
                  <td className="w-12 border border-black text-center">-109</td>
                  <td className="w-12 border border-black text-center">-111</td>
                  <td className="w-12 border border-black text-center">-108</td>
                </tr>
                <tr>
                  <td className="w-12 border border-black text-center">-66</td>
                  <td className="w-12 border border-black text-center">-76</td>
                  <td className="w-12 border border-black text-center">-86</td>
                  <td className="w-12 border border-black text-center">-87</td>
                  <td className="w-12 border border-black text-center">-90</td>
                  <td className="w-12 border border-black text-center">-98</td>
                  <td className="w-12 border border-black text-center">-106</td>
                  <td className="w-12 border border-black text-center">-110</td>
                </tr>
                <tr>
                  <td className="w-12 border border-black text-center">-80</td>
                  <td className="w-12 border border-black text-center">-81</td>
                  <td className="w-12 border border-black text-center">-79</td>
                  <td className="w-12 border border-black text-center">-84</td>
                  <td className="w-12 border border-black text-center">-88</td>
                  <td className="w-12 border border-black text-center">-92</td>
                  <td className="w-12 border border-black text-center">-97</td>
                  <td className="w-12 border border-black text-center">-103</td>
                </tr>
                <tr>
                  <td className="w-12 border border-black text-center">-69</td>
                  <td className="w-12 border border-black text-center">-50</td>
                  <td className="w-12 border border-black text-center">-79</td>
                  <td className="w-12 border border-black text-center">-96</td>
                  <td className="w-12 border border-black text-center">-100</td>
                  <td className="w-12 border border-black text-center">-97</td>
                  <td className="w-12 border border-black text-center">-97</td>
                  <td className="w-12 border border-black text-center">-97</td>
                </tr>
                <tr>
                  <td className="w-12 border border-black text-center">-30</td>
                  <td className="w-12 border border-black text-center">10</td>
                  <td className="w-12 border border-black text-center">-12</td>
                  <td className="w-12 border border-black text-center">-50</td>
                  <td className="w-12 border border-black text-center">-89</td>
                  <td className="w-12 border border-black text-center">-104</td>
                  <td className="w-12 border border-black text-center">-103</td>
                  <td className="w-12 border border-black text-center">-101</td>
                </tr>
                <tr>
                  <td className="w-12 border border-black text-center">-13</td>
                  <td className="w-12 border border-black text-center">32</td>
                  <td className="w-12 border border-black text-center">15</td>
                  <td className="w-12 border border-black text-center">-31</td>
                  <td className="w-12 border border-black text-center">-80</td>
                  <td className="w-12 border border-black text-center">-101</td>
                  <td className="w-12 border border-black text-center">-104</td>
                  <td className="w-12 border border-black text-center">-107</td>
                </tr>
                <tr>
                  <td className="w-12 border border-black text-center">-29</td>
                  <td className="w-12 border border-black text-center">9</td>
                  <td className="w-12 border border-black text-center">-1</td>
                  <td className="w-12 border border-black text-center">-44</td>
                  <td className="w-12 border border-black text-center">-86</td>
                  <td className="w-12 border border-black text-center">-103</td>
                  <td className="w-12 border border-black text-center">-104</td>
                  <td className="w-12 border border-black text-center">-108</td>
                </tr>
                <tr>
                  <td className="w-12 border border-black text-center">-54</td>
                  <td className="w-12 border border-black text-center">-33</td>
                  <td className="w-12 border border-black text-center">-46</td>
                  <td className="w-12 border border-black text-center">-61</td>
                  <td className="w-12 border border-black text-center">-88</td>
                  <td className="w-12 border border-black text-center">-103</td>
                  <td className="w-12 border border-black text-center">-103</td>
                  <td className="w-12 border border-black text-center">-109</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            Next, it's simply a matter of running a{" "}
            <a
              href="https://cs.stanford.edu/people/eroberts/courses/soco/projects/data-compression/lossy/jpeg/dct.htm"
              target="_blank"
              className="underline hover:cursor-pointer"
            >
              Discrete Cosine Transfer
            </a>{" "}
            on the data, given by formula:
          </p>
          <div className="scale-125 my-8">
            <BlockMath
              math="
              G_{u,v} = \frac{1}{4} \alpha(u)\alpha(v) \sum_{x=0}^7 \sum_{y=0}^7 g_{x,y} \cos\left(\frac{(2x+1)u\pi}{16}\right)\cos\left(\frac{(2y+1)v\pi}{16}\right)
            "
            />
          </div>
          where
          <ul>
            <li>- (u,v) indicates the position in the resulting 8x8 block.</li>
            <li>
              - \alpha(u) = 1/sqrt(2) if u = 0, otherwise \alpha(u) = 1 (makes
              the transformation orthonormal).
            </li>
            <li>
              - g_(x,y) is the pixel value in the original block at (x,y).
            </li>
          </ul>
          <p className="mt-4">Continuing with our example from earlier,</p>
          <div className="flex justify-center my-4">
            <table>
              <tbody>
                <tr>
                  <td className="w-24 border border-black text-center">
                    -603.0
                  </td>
                  <td className="w-24 border border-black text-center">
                    203.33
                  </td>
                  <td className="w-24 border border-black text-center">
                    10.65
                  </td>
                  <td className="w-24 border border-black text-center">
                    -45.19
                  </td>
                  <td className="w-24 border border-black text-center">
                    -30.25
                  </td>
                  <td className="w-24 border border-black text-center">
                    -13.83
                  </td>
                  <td className="w-24 border border-black text-center">
                    -14.15
                  </td>
                  <td className="w-24 border border-black text-center">
                    -7.33
                  </td>
                </tr>
                <tr>
                  <td className="w-24 border border-black text-center">
                    -107.82
                  </td>
                  <td className="w-24 border border-black text-center">
                    -93.43
                  </td>
                  <td className="w-24 border border-black text-center">
                    10.09
                  </td>
                  <td className="w-24 border border-black text-center">
                    49.21
                  </td>
                  <td className="w-24 border border-black text-center">
                    27.22
                  </td>
                  <td className="w-24 border border-black text-center">5.88</td>
                  <td className="w-24 border border-black text-center">8.33</td>
                  <td className="w-24 border border-black text-center">3.28</td>
                </tr>
                <tr>
                  <td className="w-24 border border-black text-center">
                    -41.83
                  </td>
                  <td className="w-24 border border-black text-center">
                    -20.47
                  </td>
                  <td className="w-24 border border-black text-center">
                    -6.16
                  </td>
                  <td className="w-24 border border-black text-center">
                    15.53
                  </td>
                  <td className="w-24 border border-black text-center">
                    16.65
                  </td>
                  <td className="w-24 border border-black text-center">9.09</td>
                  <td className="w-24 border border-black text-center">3.28</td>
                  <td className="w-24 border border-black text-center">2.52</td>
                </tr>
                <tr>
                  <td className="w-24 border border-black text-center">
                    55.94
                  </td>
                  <td className="w-24 border border-black text-center">
                    68.58
                  </td>
                  <td className="w-24 border border-black text-center">7.01</td>
                  <td className="w-24 border border-black text-center">
                    -25.38
                  </td>
                  <td className="w-24 border border-black text-center">
                    -9.81
                  </td>
                  <td className="w-24 border border-black text-center">
                    -4.75
                  </td>
                  <td className="w-24 border border-black text-center">
                    -2.36
                  </td>
                  <td className="w-24 border border-black text-center">
                    -2.12
                  </td>
                </tr>
                <tr>
                  <td className="w-24 border border-black text-center">
                    -33.5
                  </td>
                  <td className="w-24 border border-black text-center">
                    -21.1
                  </td>
                  <td className="w-24 border border-black text-center">16.7</td>
                  <td className="w-24 border border-black text-center">8.12</td>
                  <td className="w-24 border border-black text-center">3.25</td>
                  <td className="w-24 border border-black text-center">
                    -4.25
                  </td>
                  <td className="w-24 border border-black text-center">
                    -4.75
                  </td>
                  <td className="w-24 border border-black text-center">
                    -3.39
                  </td>
                </tr>
                <tr>
                  <td className="w-24 border border-black text-center">
                    -15.74
                  </td>
                  <td className="w-24 border border-black text-center">
                    -13.6
                  </td>
                  <td className="w-24 border border-black text-center">8.38</td>
                  <td className="w-24 border border-black text-center">2.42</td>
                  <td className="w-24 border border-black text-center">
                    -3.98
                  </td>
                  <td className="w-24 border border-black text-center">
                    -2.12
                  </td>
                  <td className="w-24 border border-black text-center">1.22</td>
                  <td className="w-24 border border-black text-center">0.73</td>
                </tr>
                <tr>
                  <td className="w-24 border border-black text-center">0.28</td>
                  <td className="w-24 border border-black text-center">
                    -5.37
                  </td>
                  <td className="w-24 border border-black text-center">
                    -6.47
                  </td>
                  <td className="w-24 border border-black text-center">
                    -0.58
                  </td>
                  <td className="w-24 border border-black text-center">2.3</td>
                  <td className="w-24 border border-black text-center">3.07</td>
                  <td className="w-24 border border-black text-center">0.91</td>
                  <td className="w-24 border border-black text-center">0.63</td>
                </tr>
                <tr>
                  <td className="w-24 border border-black text-center">7.78</td>
                  <td className="w-24 border border-black text-center">4.95</td>
                  <td className="w-24 border border-black text-center">
                    -6.39
                  </td>
                  <td className="w-24 border border-black text-center">
                    -9.03
                  </td>
                  <td className="w-24 border border-black text-center">
                    -0.34
                  </td>
                  <td className="w-24 border border-black text-center">3.44</td>
                  <td className="w-24 border border-black text-center">2.57</td>
                  <td className="w-24 border border-black text-center">1.93</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            Notice how the values in the top left corner tend to have the
            largest magnitude. This will be important later. As an aside, the 64
            values in this array are the coefficients of 64 DCT basis vectors
            depicted below. The image is a bit complex, but it at least seems
            reasonable that the eye tends to be more sensitive to stuff closest
            to the top and left, as opposed to the patterns in the bottom right.
          </p>
          <div className="flex justify-center my-4">
            <img width={300} height={300} src={"info/basis.png"} />
          </div>
          <p className="text-xl font-bold italic my-4">Quantization</p>
          <p>
            Ahh yes, quantization. The "meat" of JPEG compression. It's quite
            straightforward. An 8x8 grid of values (the middle) box up top is
            provided. Each value of the dct decomposition is divided by it's
            corresponding value in the quantization table, and then rounded.
          </p>
          <p className="mt-4">
            The flexibility of the quantization table is part of what makes JPEG
            such a powerful compression scheme. By simply changing values in
            this table, a continuous range of compression qualities can be
            achieved, all with the same, fast compression time thanks to the
            fast fourier transform. As long as the encoder and decoder agree on
            the quantization table before hand, any range of qualities is
            possible.
          </p>
          <p className="mt-4">
            But how does this help with compression? Firstly, it makes the
            numbers ints instead of floats. Second, it reduces the magnitude of
            all the numbers. As we'll see in the next section, having all the
            resuling values be in the range of roughly [-64, +64] makes entropy
            encoding highly effective.
          </p>
          <p className="text-xl font-bold italic my-4">Entropy Encoding</p>
          <p>
            <a
              href="https://en.wikipedia.org/wiki/Entropy_coding"
              target="_blank"
              className="underline hover:cursor-pointer"
            >
              Entropy encoding
            </a>{" "}
            is lossless compression procedure that approaches the lower bound
            dictated by information theory. In practice, Huffman coding is used,
            which assigns the most frequent values short representations instead
            of settling on a fixed-length character scheme. Arithmetic coding
            can also be used, however it is slower to decode and thus not as
            common.
          </p>
          <div className="flex justify-center my-4">
            <img width={300} height={300} src="info/zigzag.png" />
          </div>
          <p>
            The above image shows the order in which pixels are fed into the
            entropy encoding scheme. Recalling that as we move up and to the
            left values tend to get bigger, which allows us encode the
            difference between consecutive pixels in the zig-zag pattern, which
            further reduces the size of what we must store. It's common that the
            many of the values in the bottom right will be zero or one, which we
            can extra efficiently encode at times by describing things such as
            "there are 20 zeros coming up".
          </p>
          <p className="mt-4">
            <span className="italic text-2xl">
              This is the coolest fact of the article:
            </span>{" "}
            the majority of compression comes during the entropy encoding step.
            That's right, even after all of our work dividing the image into
            brightness and chrominance, using the quantization table, and
            rounding, our filesize would not be that much smaller. It's during
            the entropy encoding step that we see most of the gain.
          </p>
          <p className="mt-4">
            In this way, it's often helpful to look at the{" "}
            <span className="italic">entire</span> JPEG encoding scheme as
            simply a way of translating an image into a format that's amenable
            to entropy encoding.
          </p>
          <p className="text-3xl font-bold mt-8">What about decoding?</p>
          <p className="mt-4">
            We simply do everything in reverse. Undoing entropy encoding depends
            on the specific scheme, but generally it's as simple as reading the
            map of abbreviated character to quantized value, and then parsing.
            Undoing quantization simply means multipling instead of diving. (But
            remember, the encoder and decoder must agree on the specific
            quantization table to be used. Thankfully there's standards for this
            developed by smart people.)
          </p>
          <p className="mt-4">
            Undoing the DCT is slightly more involved, involving a similar (but
            slightly different) calculation relative to the forward direction.
          </p>
          <div className="flex justify-center my-4">
            <BlockMath
              math="
              f_{x,y} = \frac{1}{4} \sum_{u=0}^7 \sum_{v=0}^7 \alpha(u)\alpha(v) F_{x,y} \cos\left(\frac{(2x+1)u\pi}{16}\right)\cos\left(\frac{(2y+1)v\pi}{16}\right)
            "
            />
          </div>
          <p className="mt-4">
            Then, it's as simple as adding 128 to every pixel to undo the
            scaling, and combining the blocks and channels back together into a
            final image. Voila!
          </p>
          <div className="border-t mt-16 pt-8 border-black">
            <p>
              Made with love by Mark Pekala. Thanks for reading! Check out{" "}
              <a
                href="https://mark-pekala.dev"
                target="_blank"
                className="underline hover:cursor-pointer"
              >
                my site
              </a>{" "}
              to see what else I'm up to and reach out if you have any
              comments/questions.
            </p>
          </div>
        </div>
      </div>
    </PageBackground>
  );
};

export default HomePage;
