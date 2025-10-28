// import React from 'react';
// import MyLayout from './components/Layout';
// import { Routes, Route } from 'react-router-dom';
// import Teachers from './pages/teachers.page.jsx';
// import Students from './pages/students.page.jsx';
// import Admin from './pages/admin.page.jsx';

// function App() {
//   return (
//     <MyLayout>
//       <Routes>
//         <Route path="/teachers" element={<Teachers />} />
//         <Route path="/students" element={<Students />} />
//         <Route path="/admin" element={<Admin />} />
//       </Routes>
//     </MyLayout>
//   )
// }

// export default App
import { useEffect, useRef } from "react";

export default function InteractiveCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let mouseMoved = false;

    const pointer = {
      x: 0.5 * window.innerWidth,
      y: 0.5 * window.innerHeight,
    };

    const params = {
      pointsNumber: 40,
      widthFactor: 0.3,
      mouseThreshold: 0.6,
      spring: 0.4,
      friction: 0.5,
    };

    const trail = new Array(params.pointsNumber).fill().map(() => ({
      x: pointer.x,
      y: pointer.y,
      dx: 0,
      dy: 0,
    }));

    function updateMousePosition(eX, eY) {
      pointer.x = eX;
      pointer.y = eY;
    }

    function setupCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function update(t) {
      // for intro motion
      if (!mouseMoved) {
        pointer.x =
          (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) *
          window.innerWidth;
        pointer.y =
          (0.5 +
            0.2 * Math.cos(0.005 * t) +
            0.1 * Math.cos(0.01 * t)) *
          window.innerHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? 0.4 * params.spring : params.spring;
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= params.friction;
        p.dy *= params.friction;
        p.x += p.dx;
        p.y += p.dy;
      });

      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);

      for (let i = 1; i < trail.length - 1; i++) {
        const xc = 0.5 * (trail[i].x + trail[i + 1].x);
        const yc = 0.5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
        ctx.strokeStyle = "rgba(0,0,0,0.5)";
        ctx.stroke();
      }

      ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
      ctx.stroke();

      window.requestAnimationFrame(update);
    }

    setupCanvas();
    update(0);

    window.addEventListener("resize", setupCanvas);
    window.addEventListener("click", (e) => updateMousePosition(e.pageX, e.pageY));
    window.addEventListener("mousemove", (e) => {
      mouseMoved = true;
      updateMousePosition(e.pageX, e.pageY);
    });
    window.addEventListener("touchmove", (e) => {
      mouseMoved = true;
      updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
    });

    return () => {
      window.removeEventListener("resize", setupCanvas);
    };
  }, []);

  return (
    <div style={{ overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          padding: 0,
          margin: 0,
          overscrollBehavior: "none",
        }}
      ></canvas>

      <div
        className="links"
        style={{
          position: "fixed",
          bottom: 10,
          right: 10,
          fontSize: 18,
          fontFamily: "sans-serif",
          backgroundColor: "white",
          padding: 10,
        }}
      >
        <a
          href="https://dev.to/uuuuuulala/coding-an-interactive-and-damn-satisfying-cursor-7-simple-steps-2kb-of-code-1c8b"
          target="_blank"
          rel="noreferrer"
          style={{
            textDecoration: "none",
            color: "black",
            marginLeft: "1em",
          }}
        >
          tutorial
          <img
            className="icon"
            src="https://ksenia-k.com/img/icons/link.svg"
            alt="icon"
            style={{
              display: "inline-block",
              height: "1em",
              margin: "0 0 -0.1em 0.3em",
            }}
          />
        </a>
      </div>
    </div>
  );
}
