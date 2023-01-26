import React, { createRef, useEffect } from "react";
import HomePage from "./pages/Home/Home";
import * as THREE from "three";
import WAVES from "./components/Vanta/vanta.min.waves";

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
      <div className="relative z-[1]">
        <HomePage />
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
