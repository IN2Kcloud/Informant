import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// ========== FORCE VIDEO PLAY ========== //
document.addEventListener("DOMContentLoaded", () => {
  const videos = document.querySelectorAll("video");

  videos.forEach(vid => {
    vid.play().catch(() => {
      vid.muted = true; // force mute if needed
      vid.play().catch(() => {});
    });
  });
});

// ========== LOADER ========== //

const counter = document.querySelector(".load-counter");

function organicCount() {

  const steps = ["00", "33", "66", "99", "100"];
  let index = 0;

  function switchState(value, callback) {

    // quick dead flicker before locking value
    let flickers = 0;

    const flicker = setInterval(() => {

      // random cold system numbers
      counter.textContent =
        Math.floor(Math.random() * 100)
          .toString()
          .padStart(2, "0");

      flickers++;

      if (flickers >= 4) {

        clearInterval(flicker);

        // lock final number
        counter.textContent = value;

        // brutal vertical snap (not fade)
        gsap.fromTo(counter,
          {
            y: -25,
            opacity: 0,
            filter: "blur(8px)"
          },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.45,
            ease: "power4.out",
            onComplete: callback
          }
        );
      }

    }, 45);
  }

  function nextStep() {

    switchState(steps[index], () => {

      index++;

      if (index < steps.length) {

        // uneven dead timing
        const delays = [500, 700, 650, 450];
        setTimeout(nextStep, delays[index - 1]);

      } else {

        // final state lingers
        setTimeout(() => {
          finishLoading();
        }, 500);
      }
    });
  }

  nextStep();
}

organicCount();


// ========== MARQUEE ========== //
// 2. Marquee Initialization
  const initMarquee = (element, duration = 60) => {
    if (!element) return;

    // Clone the items to ensure the screen is full
    const items = element.innerHTML;
    element.innerHTML = items + items + items;

    // Calculate the width of ONE set of items
    const scrollWidth = element.scrollWidth / 3;

    gsap.to(element, {
      x: -scrollWidth,
      duration: duration,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(
          (x) => parseFloat(x) % scrollWidth
        )
      }
    });
  };
  
  document.querySelectorAll(".marquee-content").forEach((el) => {
    initMarquee(el, 45);
  });

  document.querySelectorAll(".marqueecontentII").forEach((el) => {
    initMarquee(el, 45);
  });


// 🔥 FINAL HIT (this is the signature)
function finishLoading() {

  const tl = gsap.timeline();
  
  // 💀 skull disappears FIRST
  tl.to(".load-counter", {
    y: 200,
    opacity: 0,
    duration: .5,
    ease: "power4.in"
  });
  tl.to(".footer-marquee", {
    y: -200,
    duration: 1,
    ease: "power3.out"
  }, "+=.05");
  /*
  // ⚡ counter follows AFTER
  tl.to(".load-counter", {
    scale: 1.5,
    opacity: 0,
    duration: 0.6,
    ease: "power3.in"
  }, "+=0.4"); // small delay after skull
  */
  // 🔥 loader fades out LAST
  tl.to(".loading", {
  filter: "blur(2px) contrast(120%)",
  scale: 1.015,
  duration: 0.2,
  ease: "none"
});

tl.to(".loading", {
  opacity: 0,
  duration: 0.4,
  ease: "none",
  onComplete: () => {
    document.body.classList.remove("before-load");
    document.querySelector(".loading").remove();
    revealLanding();
  }
});
}

function revealLanding() {

  const tl = gsap.timeline();

  tl.to(".skull", {
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    duration: 1.4,
    ease: "power4.out"
  });
  // Yellow reveal
  tl.to(".hero-title", {
    "--hero-reveal": "1",
    duration: 0.33,
    ease: "power2.inOut"
  }, "+=0.5");

  tl.to(".marquee-container", {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power3.out"
  }, "+=.05");
  
  tl.to(".morph-text", {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    duration: 1,
    ease: "power3.out"
  }, "+=0");

  

}

// CURSOR -----------------------------------------------------------------

const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll(".circleII");

const colors = [
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
];

circles.forEach(function (circle, index) {
  circle.x = 0;
  circle.y = 0;
  circle.style.backgroundColor = colors[index % colors.length];
});

window.addEventListener("mousemove", function(e){
  coords.x = e.clientX;
  coords.y = e.clientY; 
});

function animateCircles() {
  
  let x = coords.x;
  let y = coords.y;
  
  circles.forEach(function (circle, index) {
    circle.style.left = x - 0 + "px";
    circle.style.top = y - 0 + "px";
    
    circle.style.scale = (circles.length - index) / circles.length;
    
    circle.x = x;
    circle.y = y;

    const nextCircle = circles[index + 1] || circles[0];
    x += (nextCircle.x - x) * 0.3;
    y += (nextCircle.y - y) * 0.3;
  });
 
  requestAnimationFrame(animateCircles);
}
animateCircles();

// Check if the device is a desktop
function isDesktop() {
  // Regular expression to match common desktop user agents
  const desktopRegex = /Windows NT|Macintosh/;
  return desktopRegex.test(navigator.userAgent);
}

// ------- HERO IMAGE ------- //
const img=document.querySelector(".hero-image-wrap");
window.addEventListener("mousemove",(e)=>{
    const x=(e.clientX/innerWidth-.5)*26;
    const y=(e.clientY/innerHeight-.5)*26;
    gsap.to(img,{
        rotateY:x,
        rotateX:-y,
        duration:1.2,
        ease:"power3.out"
    });
});
gsap.to(".hero-marquee-track",{
    xPercent:-33.333,
    duration:120,
    ease:"none",
    repeat:-1
});


// ------- FOOTER HOVER ------- //

gsap.registerPlugin(DrawSVGPlugin);

function initDrawRandomUnderline() {
  const svgVariants = [
    `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 20.9999C26.7762 16.2245 49.5532 11.5572 71.7979 14.6666C84.9553 16.5057 97.0392 21.8432 109.987 24.3888C116.413 25.6523 123.012 25.5143 129.042 22.6388C135.981 19.3303 142.586 15.1422 150.092 13.3333C156.799 11.7168 161.702 14.6225 167.887 16.8333C181.562 21.7212 194.975 22.6234 209.252 21.3888C224.678 20.0548 239.912 17.991 255.42 18.3055C272.027 18.6422 288.409 18.867 305 17.9999" stroke="currentColor" stroke-width="10" stroke-linecap="round"/></svg>`,
    `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 24.2592C26.233 20.2879 47.7083 16.9968 69.135 13.8421C98.0469 9.5853 128.407 4.02322 158.059 5.14674C172.583 5.69708 187.686 8.66104 201.598 11.9696C207.232 13.3093 215.437 14.9471 220.137 18.3619C224.401 21.4596 220.737 25.6575 217.184 27.6168C208.309 32.5097 197.199 34.281 186.698 34.8486C183.159 35.0399 147.197 36.2657 155.105 26.5837C158.11 22.9053 162.993 20.6229 167.764 18.7924C178.386 14.7164 190.115 12.1115 201.624 10.3984C218.367 7.90626 235.528 7.06127 252.521 7.49276C258.455 7.64343 264.389 7.92791 270.295 8.41825C280.321 9.25056 296 10.8932 305 13.0242" stroke="#E55050" stroke-width="10" stroke-linecap="round"/></svg>`,
    `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 29.5014C9.61174 24.4515 12.9521 17.9873 20.9532 17.5292C23.7742 17.3676 27.0987 17.7897 29.6575 19.0014C33.2644 20.7093 35.6481 24.0004 39.4178 25.5014C48.3911 29.0744 55.7503 25.7731 63.3048 21.0292C67.9902 18.0869 73.7668 16.1366 79.3721 17.8903C85.1682 19.7036 88.2173 26.2464 94.4121 27.2514C102.584 28.5771 107.023 25.5064 113.276 20.6125C119.927 15.4067 128.83 12.3333 137.249 15.0014C141.418 16.3225 143.116 18.7528 146.581 21.0014C149.621 22.9736 152.78 23.6197 156.284 24.2514C165.142 25.8479 172.315 17.5185 179.144 13.5014C184.459 10.3746 191.785 8.74853 195.868 14.5292C199.252 19.3205 205.597 22.9057 211.621 22.5014C215.553 22.2374 220.183 17.8356 222.979 15.5569C225.4 13.5845 227.457 11.1105 230.742 10.5292C232.718 10.1794 234.784 12.9691 236.164 14.0014C238.543 15.7801 240.717 18.4775 243.356 19.8903C249.488 23.1729 255.706 21.2551 261.079 18.0014C266.571 14.6754 270.439 11.5202 277.146 13.6125C280.725 14.7289 283.221 17.209 286.393 19.0014C292.321 22.3517 298.255 22.5014 305 22.5014" stroke="#E55050" stroke-width="10" stroke-linecap="round"/></svg>`,
    `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.0039 32.6826C32.2307 32.8412 47.4552 32.8277 62.676 32.8118C67.3044 32.807 96.546 33.0555 104.728 32.0775C113.615 31.0152 104.516 28.3028 102.022 27.2826C89.9573 22.3465 77.3751 19.0254 65.0451 15.0552C57.8987 12.7542 37.2813 8.49399 44.2314 6.10216C50.9667 3.78422 64.2873 5.81914 70.4249 5.96641C105.866 6.81677 141.306 7.58809 176.75 8.59886C217.874 9.77162 258.906 11.0553 300 14.4892" stroke="#E55050" stroke-width="10" stroke-linecap="round"/></svg>`,
    `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.99805 20.9998C65.6267 17.4649 126.268 13.845 187.208 12.8887C226.483 12.2723 265.751 13.2796 304.998 13.9998" stroke="currentColor" stroke-width="10" stroke-linecap="round"/></svg>`,
    `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 29.8857C52.3147 26.9322 99.4329 21.6611 146.503 17.1765C151.753 16.6763 157.115 15.9505 162.415 15.6551C163.28 15.6069 165.074 15.4123 164.383 16.4275C161.704 20.3627 157.134 23.7551 153.95 27.4983C153.209 28.3702 148.194 33.4751 150.669 34.6605C153.638 36.0819 163.621 32.6063 165.039 32.2029C178.55 28.3608 191.49 23.5968 204.869 19.5404C231.903 11.3436 259.347 5.83254 288.793 5.12258C294.094 4.99476 299.722 4.82265 305 5.45025" stroke="#E55050" stroke-width="10" stroke-linecap="round"/></svg>`
  ];
  // Add attributes to <svg> elements
  function decorateSVG(svgEl) {
    svgEl.setAttribute('class', 'text-draw__box-svg');
    svgEl.setAttribute('preserveAspectRatio', 'none');
    svgEl.querySelectorAll('path').forEach(path => {
      path.setAttribute('stroke', 'currentColor');
    });
  }
  let nextIndex = null;
  document.querySelectorAll('[data-draw-line]').forEach(container => {
    const box = container.querySelector('[data-draw-line-box]');
    if (!box) return;
    let enterTween = null;
    let leaveTween = null;
    container.addEventListener('mouseenter', () => {
      // Don't restart if still playing
      if (enterTween && enterTween.isActive()) return;
      if (leaveTween && leaveTween.isActive()) leaveTween.kill();
      // Random Start
      if (nextIndex === null) {
        nextIndex = Math.floor(Math.random() * svgVariants.length);
      }
      // Animate Draw
      box.innerHTML = svgVariants[nextIndex];
      const svg = box.querySelector('svg');
      if (svg) {
        decorateSVG(svg);
        const path = svg.querySelector('path');
        if (path) {
          gsap.set(path, { drawSVG: '0%' });
          enterTween = gsap.to(path, {
            duration: 0.5,
            drawSVG: '100%',
            ease: 'power2.inOut',
            onComplete: () => { enterTween = null; }
          });
        }
      }
      // Advance for next hover across all items
      nextIndex = (nextIndex + 1) % svgVariants.length;
    });
    container.addEventListener('mouseleave', () => {
      const path = box.querySelector('path');
      if (!path) return;
      const playOut = () => {
        // Don't restart if still drawing out
        if (leaveTween && leaveTween.isActive()) return;
        leaveTween = gsap.to(path, {
          duration: 0.5,
          drawSVG: '100% 100%',
          ease: 'power2.inOut',
          onComplete: () => {
            leaveTween = null;
            box.innerHTML = ''; // remove SVG when done
          }
        });
      };
      if (enterTween && enterTween.isActive()) {
        // Wait until draw-in finishes
        enterTween.eventCallback('onComplete', playOut);
      } else {
        playOut();
      }
    });
  });
}
// Initialize Draw Random Underline
document.addEventListener('DOMContentLoaded', function() {
  initDrawRandomUnderline();
});

// ========== BUTTON ========== //
document.querySelector(".visit-btn").addEventListener("click", () => {
  alert("Visiting link...");
});

// BG points -----------------------------------------------------------------

const gridCanvas = document.getElementById("grid-bg");
const ctx = gridCanvas.getContext("2d");

const spacing = 45;
const parallax = 0.06;

let scrollY = window.scrollY;

function resizeCanvas() {
    gridCanvas.width = window.innerWidth;
    gridCanvas.height = window.innerHeight;

    drawGrid();
}

function drawGrid() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);

    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();

    // Vertical lines
    for (let x = 0; x <= gridCanvas.width; x += spacing) {
        const drawX = Math.floor(x) + 0.5;

        ctx.moveTo(drawX, 0);
        ctx.lineTo(drawX, gridCanvas.height);
    }

    // Counter-scroll horizontal movement
    const offsetY = -(scrollY * parallax) % spacing;

    for (
        let y = offsetY - spacing;
        y <= gridCanvas.height + spacing;
        y += spacing
    ) {
        const drawY = Math.floor(y) + 0.5;

        ctx.moveTo(0, drawY);
        ctx.lineTo(gridCanvas.width, drawY);
    }

    ctx.stroke();
}

window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
    drawGrid();
});

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

/*
const gridCanvas = document.getElementById("grid-bg");
const ctx = gridCanvas.getContext("2d");

let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
let time = 0;

function resize() {
  gridCanvas.width = window.innerWidth;
  gridCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

window.addEventListener("mousemove", (e) => {
  mouse.targetX = e.clientX;
  mouse.targetY = e.clientY;
});

window.addEventListener("mouseleave", () => {
  mouse.targetX = -1000;
  mouse.targetY = -1000;
});

function draw() {
  time += 0.018;

  // Smooth mouse interpolation (lerp)
  mouse.x += (mouse.targetX - mouse.x) * 0.1;
  mouse.y += (mouse.targetY - mouse.y) * 0.1;

  ctx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

  // White Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);

  const spacing = 50; // Distance between grid squares
  const cols = Math.ceil(gridCanvas.width / spacing) + 1;
  const rows = Math.ceil(gridCanvas.height / spacing) + 1;

  // 1. Calculate distorted positions for all grid intersections
  const points = [];
  for (let r = 0; r <= rows; r++) {
    points[r] = [];
    for (let c = 0; c <= cols; c++) {
      const baseX = c * spacing;
      const baseY = r * spacing;

      // Ambient organic sine wave motion
      const waveX = Math.sin(r * 0.35 + time) * 3 + Math.cos(c * 0.25 + time) * 2;
      const waveY = Math.cos(c * 0.35 + time) * 3 + Math.sin(r * 0.25 + time) * 2;
      
      // Interactive mouse displacement push
      const dx = baseX - mouse.x;
      const dy = baseY - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 200; // Radius of mouse influence
      let mouseOffsetX = 0;
      let mouseOffsetY = 0;

      if (dist < maxDist) {
        const force = Math.pow(1 - dist / maxDist, 2); // Smooth falloff curve
        const angle = Math.atan2(dy, dx);
        mouseOffsetX = Math.cos(angle) * force * 30; // Push distance
        mouseOffsetY = Math.sin(angle) * force * 30;
      }

      points[r][c] = {
        x: baseX + waveX + mouseOffsetX,
        y: baseY + waveY + mouseOffsetY,
      };
    }
  }

  // 2. Render the animated line mesh
  ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"; // Subtle light black lines
  ctx.lineWidth = 1;
  ctx.beginPath();

  // Draw Horizontal Lines
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p1 = points[r][c];
      const p2 = points[r][c + 1];
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
    }
  }

  // Draw Vertical Lines
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const p1 = points[r][c];
      const p2 = points[r + 1][c];
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
    }
  }

  ctx.stroke();

  requestAnimationFrame(draw);
}

draw();
*/
