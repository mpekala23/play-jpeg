import PIL
from PIL import Image
import os
import json

PUBLIC_PREFIX = "../../../public/premades"

def getFileNames():
  result = []
  for file in os.listdir(PUBLIC_PREFIX):
    if file.endswith(".png"):
      result.append(file)
  return result

def properHex(number):
  return format(number, '02x')

def constructIndex(jsonFiles):
  imports = 'import { StrPixels } from "../../utils";\n'
  consts = 'const PREMADE_PIXELS = [\n'

  for file in jsonFiles:
    withoutExt = file[:-5]
    importName = '{}Pixels'.format(withoutExt.capitalize())
    imports += 'import {} from "./{}";\n'.format(importName, file)
    consts += '  ["{}", {} as StrPixels],\n'.format(withoutExt, importName)
  
  imports += '\n'
  consts += '];\n\n'

  fileContents = '{}{}export default PREMADE_PIXELS'.format(imports, consts)
  
  with open("index.ts", "w") as fout:
    fout.write(fileContents)

def main():
  filenames = getFileNames()
  jsonFiles = []
  for file in filenames:
    result = {}
    img = Image.open(PUBLIC_PREFIX + "/" + file)
    for rx in range(8):
      for cx in range(8):
        pixel = img.getpixel((rx, cx))
        result["{}{}".format(cx ,rx)] = "#" + properHex(pixel[0]) + properHex(pixel[1]) + properHex(pixel[2])
    jsonFile = file[:-4] + ".json"
    with open(jsonFile, "w") as fout:
      json.dump(result, fout)
    jsonFiles.append(jsonFile)
  constructIndex(jsonFiles)

if __name__ == "__main__":
  main()