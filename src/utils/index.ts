export type NumPixels = { [key: string]: number };
export type StrPixels = { [key: string]: string };

export const getPositionString = (rx: number, cx: number) => {
  return `${rx}${cx}`;
};

export const GRIDSIZE = 8;

export function colorStringToGreyVal(color: string): number {
  if (!color) return 0;
  let r, g, b;
  if (color.length === 4) {
    r = parseInt(color.substring(1, 2), 16);
    g = parseInt(color.substring(2, 3), 16);
    b = parseInt(color.substring(3, 4), 16);
  } else {
    r = parseInt(color.substring(1, 3), 16);
    g = parseInt(color.substring(3, 5), 16);
    b = parseInt(color.substring(5, 7), 16);
  }
  let rVal = 0.299 * r + 0.587 * g + 0.114 * b;
  if (rVal < 0) rVal = 0;
  if (rVal > 255) rVal = 255;
  return rVal;
}

export function greyValToColorString(val: number): string {
  if (val < 0) val = 0;
  if (val > 255) val = 255;
  val = Math.round(val);
  let eachChannel = val.toString(16);
  if (eachChannel.length < 2) {
    eachChannel = "0" + eachChannel;
  }
  return "#" + eachChannel + eachChannel + eachChannel;
}

export function getNumericVals(vals: { [key: string]: string }): {
  [key: string]: number;
} {
  const result: { [key: string]: number } = {};
  for (let rx = 0; rx < GRIDSIZE; ++rx) {
    for (let cx = 0; cx < GRIDSIZE; ++cx) {
      const key = getPositionString(rx, cx);
      result[key] = colorStringToGreyVal(vals[key]);
    }
  }
  return result;
}

export function getStringVals(vals: NumPixels): StrPixels {
  const result: StrPixels = {};
  for (let rx = 0; rx < GRIDSIZE; ++rx) {
    for (let cx = 0; cx < GRIDSIZE; ++cx) {
      const key = getPositionString(rx, cx);
      result[key] = greyValToColorString(vals[key]);
    }
  }
  return result;
}

export function addToPixels(vals: NumPixels, change: number) {
  const result: { [key: string]: number } = {};
  for (let rx = 0; rx < GRIDSIZE; ++rx) {
    for (let cx = 0; cx < GRIDSIZE; ++cx) {
      const key = getPositionString(rx, cx);
      result[key] = vals[key] + change;
    }
  }
  return result;
}

export function quantizePixels(
  vals: NumPixels,
  QTable: NumPixels,
  inverse: boolean
) {
  const result: { [key: string]: number } = {};
  for (let rx = 0; rx < GRIDSIZE; ++rx) {
    for (let cx = 0; cx < GRIDSIZE; ++cx) {
      const key = getPositionString(rx, cx);
      result[key] = vals[key] * (inverse ? QTable[key] : 1 / QTable[key]);
    }
  }
  return result;
}

export function roundPixels(vals: NumPixels) {
  const result: { [key: string]: number } = {};
  for (let rx = 0; rx < GRIDSIZE; ++rx) {
    for (let cx = 0; cx < GRIDSIZE; ++cx) {
      const key = getPositionString(rx, cx);
      result[key] = Math.round(vals[key]);
    }
  }
  return result;
}

export function JPEG_encode(vals: NumPixels, QTable: NumPixels): NumPixels {
  const downShifted = addToPixels(vals, -128);
  const preciseResult: NumPixels = {};
  for (let u = 0; u < GRIDSIZE; ++u) {
    const alph_u = u === 0 ? 1 / Math.sqrt(2) : 1;
    for (let v = 0; v < GRIDSIZE; ++v) {
      const alph_v = v === 0 ? 1 / Math.sqrt(2) : 1;
      const result_key = getPositionString(u, v);
      let total = 0.0;
      for (let x = 0; x < GRIDSIZE; ++x) {
        for (let y = 0; y < GRIDSIZE; ++y) {
          const source_key = getPositionString(x, y);
          total +=
            downShifted[source_key] *
            Math.cos(((2 * x + 1) * u * Math.PI) / 16) *
            Math.cos(((2 * y + 1) * v * Math.PI) / 16);
        }
      }
      preciseResult[result_key] = 0.25 * alph_u * alph_v * total;
    }
  }
  const quantizedResult = quantizePixels(preciseResult, QTable, false);
  const finalResult = roundPixels(quantizedResult);
  return finalResult;
}

export function JPEG_decode(vals: NumPixels, QTable: NumPixels): NumPixels {
  const unquantizedVals = quantizePixels(vals, QTable, true);
  const shiftedResult: NumPixels = {};
  for (let x = 0; x < GRIDSIZE; ++x) {
    for (let y = 0; y < GRIDSIZE; ++y) {
      const result_key = getPositionString(x, y);
      let total = 0.0;
      for (let u = 0; u < GRIDSIZE; ++u) {
        const alph_u = u === 0 ? 1 / Math.sqrt(2) : 1;
        for (let v = 0; v < GRIDSIZE; ++v) {
          const alph_v = v === 0 ? 1 / Math.sqrt(2) : 1;
          const source_key = getPositionString(u, v);
          total +=
            alph_u *
            alph_v *
            unquantizedVals[source_key] *
            Math.cos(((2 * x + 1) * u * Math.PI) / 16) *
            Math.cos(((2 * y + 1) * v * Math.PI) / 16);
        }
      }
      shiftedResult[result_key] = 0.25 * total;
    }
  }
  const result = addToPixels(shiftedResult, 128);
  return result;
}
