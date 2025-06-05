import Intro from "./intro";
import Cards from "./cards";
import Outro from "./outro";
import ReactLenis, { useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

function App() {
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      // Ensure lenis is available
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }, [lenis]);

  return (
    <>
      <ReactLenis root />

      <Intro />
      <Cards />
      <Outro />
    </>
  );
}

export default App;
