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

export function greyValToColorSubstring(val: number): string {
  if (val < 0) val = 0;
  if (val > 255) val = 255;
  val = Math.round(val);
  let result = val.toString(16);
  if (result.length < 2) {
    result = "0" + result;
  }
  return result;
}

export function greyValToColorString(val: number): string {
  const eachChannel = greyValToColorSubstring(val);
  return "#" + eachChannel.repeat(3);
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

export function getChannelNumericVals(
  channel: number,
  vals: StrPixels
): NumPixels {
  const result: NumPixels = {};
  for (let rx = 0; rx < GRIDSIZE; ++rx) {
    for (let cx = 0; cx < GRIDSIZE; ++cx) {
      const key = getPositionString(rx, cx);
      if (!vals[key] || vals[key].length < 7) {
        result[key] = 0;
        continue;
      }
      let val = 0;
      if (channel === 0) {
        val = parseInt(vals[key].substring(1, 3), 16);
      } else if (channel === 1) {
        val = parseInt(vals[key].substring(3, 5), 16);
      } else {
        val = parseInt(vals[key].substring(5, 7), 16);
      }
      result[key] = val;
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

export function getChannelStringVals(
  rVals: NumPixels,
  gVals: NumPixels,
  bVals: NumPixels
): StrPixels {
  const result: StrPixels = {};
  for (let rx = 0; rx < GRIDSIZE; ++rx) {
    for (let cx = 0; cx < GRIDSIZE; ++cx) {
      const key = getPositionString(rx, cx);
      const rVal = rVals[key];
      const gVal = gVals[key];
      const bVal = bVals[key];
      result[key] =
        "#" +
        greyValToColorSubstring(rVal) +
        greyValToColorSubstring(gVal) +
        greyValToColorSubstring(bVal);
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

export function shadeColor(color: string, percent: number) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = (R * (100 + percent)) / 100;
  G = (G * (100 + percent)) / 100;
  B = (B * (100 + percent)) / 100;

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  R = Math.round(R / 10) * 10;
  G = Math.round(G / 10) * 10;
  B = Math.round(B / 10) * 10;

  var RR = R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
  var GG = G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
  var BB = B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}

export function invertColor(hex: string) {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  // invert color components
  var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
  // pad each with zeros and return
  return "#" + padZero(r, 2) + padZero(g, 2) + padZero(b, 2);
}

function padZero(str: string, len: number) {
  len = len || 2;
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}
