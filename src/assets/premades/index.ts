import { StrPixels } from "../../utils";
import PiPixels from "./pi.json";
import HousePixels from "./house.json";
import MoutainPixels from "./moutain.json";
import CheckerboardPixels from "./checkerboard.json";
import TreePixels from "./tree.json";
import SquarePixels from "./square.json";
import SmilePixels from "./smile.json";
import RainbowPixels from "./rainbow.json";

const PREMADE_PIXELS = [
  ["pi", PiPixels as StrPixels],
  ["house", HousePixels as StrPixels],
  ["moutain", MoutainPixels as StrPixels],
  ["checkerboard", CheckerboardPixels as StrPixels],
  ["tree", TreePixels as StrPixels],
  ["square", SquarePixels as StrPixels],
  ["smile", SmilePixels as StrPixels],
  ["rainbow", RainbowPixels as StrPixels],
];

export default PREMADE_PIXELS