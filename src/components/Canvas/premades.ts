import { StrPixels } from "../../utils";
import PREMADE_PIXELS from "../../assets/premades";

export interface Premade {
  filename: string;
  pixels: StrPixels;
}

const PREMADES: Premade[] = PREMADE_PIXELS.map((combo: any) => {
  let name = combo[0];
  let pixels = combo[1];
  let cleanPremade: Premade = {
    filename: `premades/${name}.png`,
    pixels,
  };
  return cleanPremade;
});

export { PREMADES };
