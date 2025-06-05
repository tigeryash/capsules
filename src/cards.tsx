import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { setUpMarqueeAnimation } from "./marquee";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Cards = () => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const marquee = useRef<HTMLDivElement | null>(null);
  const [cards, setCards] = useState<HTMLElement[]>([]);
  const titleRefs = useRef<HTMLHeadingElement[]>([]);
  const test = useRef(false);

  // Use useLayoutEffect to run after DOM is painted
  useLayoutEffect(() => {
    const titleElements =
      gsap.utils.toArray<HTMLHeadingElement>(".card-title h1");
    const cardElements = gsap.utils.toArray<HTMLElement>(".card");
    setCards(cardElements);

    // Store refs for GSAP animations
    titleRefs.current = titleElements;

    // Apply SplitText
    titleElements.forEach((title) => {
      const split = new SplitText(title, {
        type: "chars",
        charsClass: "char",
        tag: "div",
      });
      split.chars.forEach((char) => {
        char.innerHTML = `<span>${char.textContent}</span>`;
      });
    });
  }, []);

  useGSAP(() => {
    gsap.set(".card-img", {
      scale: 0.5,
      borderRadius: "400px",
    });
    gsap.set(".card-img img", {
      scale: 1.5,
    });

    ScrollTrigger.create({
      trigger: cardsRef.current[0],
      start: "top top",
      end: "+=300vh",
      onUpdate: (self) => {
        const progress = self.progress;
        const imgScale = 0.5 + progress * 0.5;
        const borderRadius = 400 - progress * 375;
        const innerImgScale = 1.5 - progress * 0.5;
        gsap.set(".card-img", {
          scale: imgScale,
          borderRadius: borderRadius + "px",
        });
        gsap.set(".card-img img", {
          scale: innerImgScale,
        });

        if (imgScale >= 0.5 && imgScale <= 0.75) {
          const fadeProgress = (imgScale - 0.5) / (0.75 - 0.5);
          gsap.set(marquee.current, {
            opacity: 1 - fadeProgress,
          });
        } else if (imgScale < 0.5) {
          gsap.set(marquee.current, {
            opacity: 1,
          });
        } else if (imgScale > 0.75) {
          gsap.set(marquee.current, {
            opacity: 0,
          });
        }

        if (progress >= 1 && !test.current) {
          test.current = true;
          animateContentIn(
            cardsRef.current[0]?.querySelectorAll(".char span"),
            cardsRef.current[0]?.querySelector(".card-description")
          );
        }
        if (progress < 1 && test.current) {
          test.current = false;
          animateContentOut(
            cardsRef.current[0]?.querySelectorAll(".char span"),
            cardsRef.current[0]?.querySelector(".card-description")
          );
        }
      },
    });
  }, [cards, cardsRef, marquee, titleRefs, test]);

  useGSAP(() => {
    console.log(cards);
    cards.forEach((card, index) => {
      const isLastCard = index === cards.length - 1;
      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        end: isLastCard ? "+=100vh" : "top top",
        endTrigger: isLastCard ? null : cards[cards.length - 1],
        pin: true,
        pinSpacing: isLastCard,
      });
    });

    cards.forEach((card, index) => {
      const cardWrapper = card.querySelector(".card-wrapper");
      if (index < cards.length - 1) {
        ScrollTrigger.create({
          trigger: cards[index + 1],
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(cardWrapper, {
              scale: 1 - progress * 0.25,
              opacity: 1 - progress,
            });
          },
        });
      }
    });

    cards.forEach((card, index) => {
      if (index > 0) {
        const cardImg = card.querySelector(".card-img img");
        const imgContainer = card.querySelector(".card-img");
        ScrollTrigger.create({
          trigger: card,
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(cardImg, {
              scale: 2 - progress,
            });
            gsap.set(imgContainer, {
              borderRadius: 150 - progress * 125 + "px",
            });
          },
        });
      }
    });

    cards.forEach((card, index) => {
      if (index === 0) return;
      const cardDescription = card.querySelector(".card-description");
      const cardTitleChars = card.querySelector(".char span");
      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        end: "bottom top",
        once: true,
        onEnter: () => {
          animateContentIn(cardTitleChars, cardDescription);
        },
        onLeaveBack: () => {
          animateContentOut(cardTitleChars, cardDescription);
        },
      });
    });

    setUpMarqueeAnimation();
  }, [cards, marquee, titleRefs, test, cardsRef]);

  const animateContentIn = (titleChars: any, description: any) => {
    gsap.to(titleChars, {
      x: "0%",
      duration: 0.75,
      ease: "power4.out",
    });
    gsap.to(description, {
      x: 0,
      opacity: 1,
      duration: 0.75,
      delay: 0.1,
      ease: "power4.out",
    });
  };

  const animateContentOut = (titleChars: any, description: any) => {
    gsap.to(titleChars, {
      x: "100%",
      duration: 0.5,
      ease: "power4.out",
    });
    gsap.to(description, {
      x: "40px",
      opacity: 0,
      duration: 0.5,
      ease: "power4.out",
    });
  };
  return (
    <section className="cards">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          className="card"
          key={index}
          ref={(element) => {
            cardsRef.current[index] = element;
          }}
        >
          {index === 0 && <Marquee ref={marquee} />}
          <div className="card-wrapper">
            <div className="card-content">
              <div className="card-title">
                <h1>Curved Horizons</h1>
              </div>
              <div className="card-description">
                <p>
                  A futuristic residence that plays with curvature and flow,
                  blending bold geometry with natural topography.
                </p>
              </div>
            </div>
            <div className="card-img">
              <img src={`image-${index + 1}.jpg`} alt="" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Cards;

const Marquee = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div className="card-marquee">
      <div className="marquee" ref={ref}>
        <h1>Design Beyond Boundaries</h1>
        <h1>Built for Tomorrow</h1>
        <h1>Real Impact</h1>
        <h1>Digital Visions</h1>
      </div>
    </div>
  );
});
