import React, {
  createRef,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { FileUploader } from "react-drag-drop-files";
import Modal, { Styles } from "react-modal";
import {
  getPositionString,
  greyValToColorSubstring,
  StrPixels,
} from "../../utils";

interface Props {
  isOpen: boolean;
  close: () => void;
  updatePixels: (pix: StrPixels) => void;
}

const MAX_SELECT_SIZE = 360;
const SELECT_WIDTH = 16;
const MAX_PREVIEW_SIZE = 360;

const SelectSubimage: FC<Props> = ({ isOpen, close, updatePixels }) => {
  const [file, setFile] = useState<File | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hackRef = useRef<HTMLCanvasElement>(null);
  const [canvasDims, setCanvasDims] = useState<[number, number]>([
    MAX_SELECT_SIZE,
    MAX_SELECT_SIZE,
  ]);
  const imageRef = createRef<HTMLImageElement>();
  const smallRef = useRef<HTMLCanvasElement>(null);
  const selectPos = useRef<[number, number]>([0, 0]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const modalStyle: Styles = {
    overlay: {
      justifyContent: "center",
      alignItems: "center",
      width: "100vw",
      zIndex: 50,
    },
    content: {
      width: file ? "75vw" : "500px",
      display: "table",
      margin: "auto",
    },
  };

  const getCanvasContext: () => CanvasRenderingContext2D | null = () => {
    if (!canvasRef.current) return null;
    const context = canvasRef.current.getContext("2d");
    if (!context) return null;
    return context;
  };

  const getHackContext: () => CanvasRenderingContext2D | null = () => {
    if (!hackRef.current) return null;
    const context = hackRef.current.getContext("2d");
    if (!context) return null;
    return context;
  };

  const getSmallContext: () => CanvasRenderingContext2D | null = () => {
    if (!smallRef.current) return null;
    const context = smallRef.current.getContext("2d");
    if (!context) return null;
    return context;
  };

  useEffect(() => {
    if (!imageRef.current || !file) return;
    imageRef.current.onload = () => {
      if (imageRef.current) {
        const maxDim = Math.max(
          imageRef.current.width,
          imageRef.current.height
        );
        const minDim = Math.min(
          imageRef.current.width,
          imageRef.current.height
        );
        const newCDims: [number, number] = [MAX_SELECT_SIZE, MAX_SELECT_SIZE];
        if (imageRef.current.width >= imageRef.current.height) {
          newCDims[1] = (minDim / maxDim) * MAX_SELECT_SIZE;
        } else {
          newCDims[0] = (minDim / maxDim) * MAX_SELECT_SIZE;
        }
        setCanvasDims(newCDims);
      }
    };
  }, [file]);

  useEffect(() => {
    if (!imageRef.current || !file) return;
    const context = getCanvasContext();
    if (!context) return;
    imageRef.current.onload = () => {
      if (!imageRef.current) return;
      context.drawImage(imageRef.current, 0, 0, canvasDims[0], canvasDims[1]);
    };
  }, [canvasDims]);

  const downsample = useCallback(
    (data: Uint8ClampedArray) => {
      const context = getSmallContext();
      if (!context) return;
      const sample = SELECT_WIDTH / 8;
      const preview = MAX_PREVIEW_SIZE / 8;
      for (let rx = 0; rx < 8; ++rx) {
        for (let cx = 0; cx < 8; ++cx) {
          const baseX = rx * sample;
          const baseY = cx * sample;
          let total = [0, 0, 0];
          for (let x = baseX; x < baseX + sample; x++) {
            for (let y = baseY; y < baseY + sample; y++) {
              let ix = (y * SELECT_WIDTH + x) * 4;
              total[0] += data[ix];
              total[1] += data[ix + 1];
              total[2] += data[ix + 2];
            }
          }
          total = [
            Math.round(total[0] / (sample * sample)),
            Math.round(total[1] / (sample * sample)),
            Math.round(total[2] / (sample * sample)),
          ];
          context.fillStyle = `rgb(${total[0]}, ${total[1]}, ${total[2]})`;
          context.fillRect(rx * preview, cx * preview, preview, preview);
        }
      }
    },
    [smallRef]
  );

  const redrawSquare = useCallback(() => {
    if (!imageRef.current || !file) return;
    const context = getHackContext();
    if (!context) return;
    context.clearRect(0, 0, canvasDims[0], canvasDims[1]);
    context.beginPath();
    context.rect(
      selectPos.current[0],
      selectPos.current[1],
      SELECT_WIDTH,
      SELECT_WIDTH
    );
    context.stroke();
    const imageContext = getCanvasContext();
    if (!imageContext) return;
    const imageData = imageContext.getImageData(
      selectPos.current[0],
      selectPos.current[1],
      SELECT_WIDTH,
      SELECT_WIDTH
    );
    downsample(imageData.data);
  }, [imageRef, file, selectPos]);

  const cleanupAndClose = useCallback(() => {
    close();
    setFile(null);
  }, [close, setFile]);

  const submitPixels = useCallback(() => {
    const context = getSmallContext();
    if (!context) return;
    const data = context.getImageData(
      0,
      0,
      MAX_PREVIEW_SIZE,
      MAX_PREVIEW_SIZE
    ).data;
    const step = MAX_PREVIEW_SIZE / 8;
    const result: StrPixels = {};
    for (let rx = 0; rx < 8; ++rx) {
      for (let cx = 0; cx < 8; ++cx) {
        const x = rx * MAX_PREVIEW_SIZE * step;
        const y = cx * step;
        const baseIx = (x + y) * 4;
        const r = data[baseIx];
        const g = data[baseIx + 1];
        const b = data[baseIx + 2];
        const color =
          "#" +
          greyValToColorSubstring(r) +
          greyValToColorSubstring(g) +
          greyValToColorSubstring(b);
        const key = getPositionString(rx, cx);
        result[key] = color;
      }
    }
    updatePixels(result);
    cleanupAndClose();
  }, [file, smallRef, updatePixels]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={cleanupAndClose}
      shouldCloseOnOverlayClick={true}
      style={modalStyle}
      ariaHideApp={false}
    >
      {!file && (
        <FileUploader
          handleChange={(file: File) => {
            setFile(file);
          }}
          name="file"
          types={["PNG"]}
          classes="w-screen h-full"
        />
      )}
      <div className={file ? "" : "hidden"}>
        <div
          ref={divRef}
          className="flex flex-col w-full h-full justify-between items-center"
        >
          <div
            className={
              !file
                ? "hidden"
                : "flex justify-evenly items-center w-full h-full"
            }
          >
            <div className="flex flex-col content-center">
              <h1 className="mb-4 text-black mx-auto font-mono">Source</h1>
              <canvas
                className="border-dashed border-2 border-yellow-500"
                ref={canvasRef}
                width={canvasDims[0]}
                height={canvasDims[1]}
                onMouseDown={(e) => {
                  setIsDragging(true);
                  if (
                    canvasRef.current &&
                    divRef.current?.parentElement?.parentElement
                  ) {
                    selectPos.current = [
                      e.pageX -
                        (canvasRef.current.offsetLeft +
                          divRef.current.parentElement.parentElement
                            .offsetLeft) -
                        SELECT_WIDTH * 0.5,
                      e.pageY -
                        (canvasRef.current.offsetTop +
                          divRef.current.parentElement.parentElement
                            .offsetTop) -
                        SELECT_WIDTH * 0.5,
                    ];
                    redrawSquare();
                  }
                }}
                onMouseUp={() => {
                  setIsDragging(false);
                }}
                onMouseMove={(e) => {
                  if (
                    isDragging &&
                    canvasRef.current &&
                    divRef.current?.parentElement?.parentElement
                  ) {
                    selectPos.current = [
                      e.pageX -
                        (canvasRef.current.offsetLeft +
                          divRef.current.parentElement.parentElement
                            .offsetLeft) -
                        SELECT_WIDTH * 0.5,
                      e.pageY -
                        (canvasRef.current.offsetTop +
                          divRef.current.parentElement.parentElement
                            .offsetTop) -
                        SELECT_WIDTH * 0.5,
                    ];
                    redrawSquare();
                  }
                }}
              />
              <div
                style={{
                  zIndex: 100,
                  transform: `translateY(-${canvasDims[1]}px)`,
                  pointerEvents: "none",
                  height: 0,
                  overflow: "visible",
                }}
              >
                <canvas
                  ref={hackRef}
                  width={canvasDims[0]}
                  height={canvasDims[1]}
                />
              </div>
            </div>
            <div className="flex flex-col content-center">
              <h1 className="mb-4 text-black mx-auto font-mono">Preview</h1>
              <canvas
                className="border-dashed border-2 border-yellow-500"
                ref={smallRef}
                width={MAX_PREVIEW_SIZE}
                height={MAX_PREVIEW_SIZE}
              />
            </div>
          </div>
          <button
            className="mt-4 button-6 font-mono text-black border-solid border-2 p-2"
            onClick={submitPixels}
          >
            Submit
          </button>
          {file && (
            <div className="hidden">
              <img ref={imageRef} src={URL.createObjectURL(file)} alt="" />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SelectSubimage;
