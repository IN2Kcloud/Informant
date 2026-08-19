// ============================== INVERSION LENS ============================== //

const config = {
  maskRadius: 0.15,
  maskSpeed: 0.75,
  lerpFactor: 0.05,
  radiusLerpSpeed: 0.1,
  turbulenceIntensity: 0.075,
};

document.querySelectorAll(".inversion-lens").forEach((container) => {
  initHoverEffect(container);
});

function initHoverEffect(container) {
  let scene, camera, renderer, uniforms;

  const targetMouse = new THREE.Vector2(0.5, 0.5);
  const lerpedMouse = new THREE.Vector2(0.5, 0.5);
  let targetRadius = 0.0;

  let isInView = false;
  let isMouseInsideContainer = false;
  let lastMouseX = 0;
  let lastMouseY = 0;

  const img = container.querySelector("img");
  const loader = new THREE.TextureLoader();
  
  loader.load(img.src, (texture) => {
      setupScene(texture);
      //setupDebugger();
      setupEventListeners();
      animate();
    });


  const setupScene = (texture) => {
    const imageAspect = texture.image.width / texture.image.height;

    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16;

    scene = new THREE.Scene();
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    uniforms = {
      u_texture: { value: texture },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(width, height) },
      u_radius: { value: 0.0 },
      u_speed: { value: config.maskSpeed },
      u_imageAspect: { value: imageAspect },
      u_turbulenceIntensity: { value: config.turbulenceIntensity },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: window.vertexShader,
      fragmentShader: window.fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.capabilities.anisotropy = 16;

    container.appendChild(renderer.domElement);
  };

  const setupDebugger = () => {
    const gui = new lil.GUI();
    gui.domElement.style.position = "absolute";
    gui.domElement.style.top = "10px";
    gui.domElement.style.right = "10px";

    gui.add(config, "maskRadius", 0.05, 1.0, 0.01).name("Mask Radius");

    gui
      .add(config, "turbulenceIntensity", 0, 1.0, 0.001)
      .name("Turbulence")
      .onChange((value) => {
        if (uniforms) {
          uniforms.u_turbulenceIntensity.value = value;
        }
      });
  };

  const setupEventListeners = () => {
    document.addEventListener("mousemove", (e) => {
      updateCursorState(e.clientX, e.clientY);
    });

    window.addEventListener("scroll", () => {
      updateCursorState(lastMouseX, lastMouseY);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInView = entry.isIntersecting;
          if (!isInView) {
            targetRadius = 0.0;
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
  };

  const updateCursorState = (x, y) => {
    lastMouseX = x;
    lastMouseY = y;

    const rect = container.getBoundingClientRect();
    const inside =
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

    isMouseInsideContainer = inside;

    if (inside) {
      targetMouse.x = (x - rect.left) / rect.width;
      targetMouse.y = 1.0 - (y - rect.top) / rect.height;
      targetRadius = config.maskRadius;
    } else {
      targetRadius = 0.0;
    }
  };

  const animate = () => {
    requestAnimationFrame(animate);

    lerpedMouse.lerp(targetMouse, config.lerpFactor);

    if (uniforms) {
      uniforms.u_mouse.value.copy(lerpedMouse);
      uniforms.u_time.value += 0.01;
      uniforms.u_radius.value +=
        (targetRadius - uniforms.u_radius.value) * config.radiusLerpSpeed;
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  };
}

// ============================== CARDS ============================== //

document.addEventListener("DOMContentLoaded", () => {

  gsap.registerPlugin(ScrollTrigger);


  // =========================================================
  // LENIS — SMOOTH SCROLL
  // =========================================================

  const lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);


  // =========================================================
  // CARDS
  // =========================================================

  const cards = gsap.utils.toArray(".card");

  const isMobile = window.innerWidth <= 1000;

  /*
   * Desktop:
   * Cards spread horizontally.
   *
   * Mobile:
   * Cards spread vertically.
   */
  const positions = isMobile
    ? [14, 38, 62, 86]
    : [14, 38, 62, 86];

  const rotations = isMobile
    ? [-6, 4, -4, 6]
    : [-15, -7.5, 7.5, 15];


  /*
   * Total amount of scrolling while
   * the card section remains pinned.
   */
  const totalScrollHeight = window.innerHeight * 3;


  // =========================================================
  // PIN CARD SECTION
  // =========================================================

  ScrollTrigger.create({

    trigger: ".cards",

    start: "top top",

    end: () => `+=${totalScrollHeight}`,

    pin: true,

    pinSpacing: true,

    id: "cards-pin"

  });


  // =========================================================
  // CARD SPREAD
  // =========================================================

  cards.forEach((card, index) => {

    if (isMobile) {

      /*
       * MOBILE
       *
       * Cards begin stacked in the center.
       * They then spread vertically.
       */

      gsap.to(card, {

        top: `${positions[index]}%`,

        left: "50%",

        rotation: rotations[index],

        ease: "none",

        scrollTrigger: {

          trigger: ".cards",

          start: "top top",

          end: () => `+=${window.innerHeight}`,

          scrub: 0.5,

          id: `mobile-spread-${index}`

        }

      });

    } else {

      /*
       * DESKTOP
       *
       * Cards spread horizontally.
       */

      gsap.to(card, {

        left: `${positions[index]}%`,

        top: "50%",

        rotation: rotations[index],

        ease: "none",

        scrollTrigger: {

          trigger: ".cards",

          start: "top top",

          end: () => `+=${window.innerHeight}`,

          scrub: 0.5,

          id: `desktop-spread-${index}`

        }

      });

    }

  });


  // =========================================================
  // CARD FLIP + ROTATION
  // =========================================================

  cards.forEach((card, index) => {

    const frontEl = card.querySelector(".flip-card-front");
    const backEl = card.querySelector(".flip-card-back");

    if (!frontEl || !backEl) return;


    /*
     * Each card starts its flip slightly later
     * than the previous one.
     */

    const staggerOffset = index * 0.05;

    const startOffset =
      1 / 3 + staggerOffset;

    const endOffset =
      2 / 3 + staggerOffset;


    ScrollTrigger.create({

      trigger: ".cards",

      start: "top top",

      end: () => `+=${totalScrollHeight}`,

      scrub: 1,

      id: `rotate-flip-${index}`,

      onUpdate: (self) => {

        const progress = self.progress;


        // -----------------------------------------------------
        // BEFORE FLIP
        // -----------------------------------------------------

        if (progress < startOffset) {

          frontEl.style.transform = "rotateY(0deg)";

          backEl.style.transform = "rotateY(180deg)";

          card.style.transform =
            `translate(-50%, -50%) rotate(${rotations[index]}deg)`;

          return;
        }


        // -----------------------------------------------------
        // DURING FLIP
        // -----------------------------------------------------

        if (
          progress >= startOffset &&
          progress <= endOffset
        ) {

          const animationProgress =
            (progress - startOffset) / (1 / 3);


          const frontRotation =
            -180 * animationProgress;

          const backRotation =
            180 - (180 * animationProgress);


          /*
           * Cards gradually straighten themselves
           * while flipping.
           */

          const cardRotation =
            rotations[index] *
            (1 - animationProgress);


          frontEl.style.transform =
            `rotateY(${frontRotation}deg)`;

          backEl.style.transform =
            `rotateY(${backRotation}deg)`;


          card.style.transform =
            `translate(-50%, -50%) rotate(${cardRotation}deg)`;

          return;
        }


        // -----------------------------------------------------
        // AFTER FLIP
        // -----------------------------------------------------

        if (progress > endOffset) {

          frontEl.style.transform =
            "rotateY(-180deg)";

          backEl.style.transform =
            "rotateY(0deg)";

          card.style.transform =
            "translate(-50%, -50%) rotate(0deg)";

        }

      }

    });

  });


  // =========================================================
  // CUSTOM SCROLLBAR
  // =========================================================

  const thumb = document.querySelector(".scroll-thumb");
  const track = document.querySelector(".scroll-track");


  /*
   * Only initialize the custom scrollbar
   * if both elements actually exist.
   */

  if (thumb && track) {


    // ---------------------------------------------------------
    // MOVE THUMB WHEN PAGE SCROLLS
    // ---------------------------------------------------------

    lenis.on("scroll", ({ progress }) => {

      const trackHeight =
        track.offsetHeight -
        thumb.offsetHeight;

      const moveY =
        progress * trackHeight;

      gsap.set(thumb, {
        y: moveY
      });

    });


    // ---------------------------------------------------------
    // DRAGGING
    // ---------------------------------------------------------

    let isDragging = false;


    const onDrag = (e) => {

      if (!isDragging) return;


      const rect =
        track.getBoundingClientRect();


      const clientY =
        e.touches
          ? e.touches[0].clientY
          : e.clientY;


      let pos =
        (clientY - rect.top) /
        rect.height;


      // Clamp between 0 and 1

      pos =
        Math.max(
          0,
          Math.min(1, pos)
        );


      const scrollHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;


      lenis.scrollTo(
        pos * scrollHeight,
        {
          immediate: true
        }
      );

    };


    // ---------------------------------------------------------
    // START DRAG
    // ---------------------------------------------------------

    thumb.addEventListener(
      "mousedown",
      () => {
        isDragging = true;
      }
    );


    thumb.addEventListener(
      "touchstart",
      () => {
        isDragging = true;
      },
      {
        passive: false
      }
    );


    // ---------------------------------------------------------
    // DRAG
    // ---------------------------------------------------------

    window.addEventListener(
      "mousemove",
      onDrag
    );


    window.addEventListener(
      "touchmove",
      onDrag,
      {
        passive: false
      }
    );


    // ---------------------------------------------------------
    // END DRAG
    // ---------------------------------------------------------

    window.addEventListener(
      "mouseup",
      () => {
        isDragging = false;
      }
    );


    window.addEventListener(
      "touchend",
      () => {
        isDragging = false;
      }
    );

  }


  // =========================================================
  // ARCHIVE REVEAL
  // =========================================================

  gsap.utils
    .toArray(".archive-entry")
    .forEach((entry) => {

      gsap.from(entry, {

        x: -100,

        opacity: 0,

        duration: 1.4,

        ease: "power4.out",

        scrollTrigger: {

          trigger: entry,

          start: "top 85%"

        }

      });

    });


  // =========================================================
  // REFRESH SCROLLTRIGGER
  // =========================================================

  ScrollTrigger.refresh();

});
