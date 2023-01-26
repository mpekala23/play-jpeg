import { NumPixels } from "../../utils";

export interface PremadeQTable {
  name: string;
  pixels: NumPixels;
}

const PREMADE_QTABLES: PremadeQTable[] = [
  {
    name: "Lossless",
    pixels: {
      "00": 1,
      "01": 1,
      "02": 1,
      "03": 1,
      "04": 1,
      "05": 1,
      "06": 1,
      "07": 1,
      "10": 1,
      "11": 1,
      "12": 1,
      "13": 1,
      "14": 1,
      "15": 1,
      "16": 1,
      "17": 1,
      "20": 1,
      "21": 1,
      "22": 1,
      "23": 1,
      "24": 1,
      "25": 1,
      "26": 1,
      "27": 1,
      "30": 1,
      "31": 1,
      "32": 1,
      "33": 1,
      "34": 1,
      "35": 1,
      "36": 1,
      "37": 1,
      "40": 1,
      "41": 1,
      "42": 1,
      "43": 1,
      "44": 1,
      "45": 1,
      "46": 1,
      "47": 1,
      "50": 1,
      "51": 1,
      "52": 1,
      "53": 1,
      "54": 1,
      "55": 1,
      "56": 1,
      "57": 1,
      "60": 1,
      "61": 1,
      "62": 1,
      "63": 1,
      "64": 1,
      "65": 1,
      "66": 1,
      "67": 1,
      "70": 1,
      "71": 1,
      "72": 1,
      "73": 1,
      "74": 1,
      "75": 1,
      "76": 1,
      "77": 1,
    },
  },
  {
    name: "Standard",
    pixels: {
      "00": 16,
      "01": 11,
      "02": 10,
      "03": 16,
      "04": 24,
      "05": 40,
      "06": 51,
      "07": 61,
      "10": 12,
      "11": 12,
      "12": 14,
      "13": 19,
      "14": 26,
      "15": 58,
      "16": 60,
      "17": 55,
      "20": 14,
      "21": 13,
      "22": 16,
      "23": 24,
      "24": 40,
      "25": 57,
      "26": 69,
      "27": 56,
      "30": 14,
      "31": 17,
      "32": 22,
      "33": 29,
      "34": 51,
      "35": 87,
      "36": 80,
      "37": 62,
      "40": 18,
      "41": 22,
      "42": 37,
      "43": 56,
      "44": 68,
      "45": 109,
      "46": 103,
      "47": 77,
      "50": 24,
      "51": 35,
      "52": 55,
      "53": 64,
      "54": 81,
      "55": 104,
      "56": 113,
      "57": 92,
      "60": 49,
      "61": 64,
      "62": 78,
      "63": 87,
      "64": 103,
      "65": 121,
      "66": 120,
      "67": 101,
      "70": 72,
      "71": 92,
      "72": 95,
      "73": 98,
      "74": 112,
      "75": 100,
      "76": 103,
      "77": 99,
    },
  },
  {
    name: "Low-res",
    pixels: {
      "00": 32,
      "01": 22,
      "02": 20,
      "03": 32,
      "04": 48,
      "05": 80,
      "06": 102,
      "07": 122,
      "10": 24,
      "11": 24,
      "12": 28,
      "13": 38,
      "14": 52,
      "15": 116,
      "16": 120,
      "17": 110,
      "20": 40,
      "21": 42,
      "22": 44,
      "23": 46,
      "24": 48,
      "25": 114,
      "26": 52,
      "27": 112,
      "30": 28,
      "31": 34,
      "32": 44,
      "33": 58,
      "34": 102,
      "35": 164,
      "36": 160,
      "37": 124,
      "40": 36,
      "41": 44,
      "42": 74,
      "43": 112,
      "44": 136,
      "45": 218,
      "46": 206,
      "47": 154,
      "50": 48,
      "51": 70,
      "52": 110,
      "53": 128,
      "54": 162,
      "55": 208,
      "56": 226,
      "57": 184,
      "60": 98,
      "61": 128,
      "62": 156,
      "63": 172,
      "64": 206,
      "65": 142,
      "66": 240,
      "67": 202,
      "70": 144,
      "71": 184,
      "72": 190,
      "73": 196,
      "74": 224,
      "75": 200,
      "76": 206,
      "77": 198,
    },
  },
];

export { PREMADE_QTABLES };