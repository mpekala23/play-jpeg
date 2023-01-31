import React, { createRef, useEffect } from "react";
import HomePage from "./pages/Home/Home";
import * as THREE from "three";
import WAVES from "./components/Vanta/vanta.waves";
import { PageBackground } from "./styles";

const App: React.FC = () => {
  const vantaRef = createRef<HTMLDivElement>();

  useEffect(() => {
    const vantaEff = (WAVES as any)({
      el: vantaRef.current,
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0xb6dfc6,
      shininess: 1.0,
      waveHeight: 6.5,
      waveSpeed: 0.9,
      zoom: 0.7,
      THREE: THREE,
    });
    return () => {
      vantaEff.destroy();
    };
  }, []);

  return (
    <div>
      <div className="hidden flex relative xl:block z-[11]">
        <HomePage />
      </div>
      <div className="relative flex xl:hidden justify-center items-center w-screen h-screen z-10">
        <PageBackground>
          <p className="text-black">play.JPEG only works on big screens.</p>
          <p className="text-black mt-4">
            (Sorry, if you're on a small laptop try zooming out)
          </p>
        </PageBackground>
      </div>
      <div
        ref={vantaRef}
        id="test"
        className="fixed top-0 left-0 z-0 w-screen h-screen"
      />
    </div>
  );
};

export default App;
