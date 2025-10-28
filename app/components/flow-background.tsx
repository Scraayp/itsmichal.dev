"use client";

import { useEffect, useRef } from "react";

const FlowBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resizeCanvas = () => {
      const { innerWidth: width, innerHeight: height } = window;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    const createGradient = (
      x: number,
      y: number,
      radius: number,
      colors: string[]
    ) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

      colors.forEach((color, index) => {
        gradient.addColorStop(index / (colors.length - 1), color);
      });

      return gradient;
    };

    const drawFlowField = () => {
      if (!ctx) return;

      // Clear canvas with a dark background
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // Create flowing effect
      const numBlobs = 5;

      for (let i = 0; i < numBlobs; i++) {
        // Calculate position based on time and index
        const angle =
          (time * 0.0002 + (i * Math.PI * 2) / numBlobs) % (Math.PI * 2);
        const distance = Math.sin(time * 0.0005 + i) * 0.2 + 0.3;

        const x = width * (0.5 + Math.cos(angle) * distance);
        const y = height * (0.5 + Math.sin(angle) * distance);

        // Add mouse influence
        const mouseInfluence = 0.15;
        const adjustedX =
          x + (mousePosition.current.x * width - x) * mouseInfluence;
        const adjustedY =
          y + (mousePosition.current.y * height - y) * mouseInfluence;

        // Create gradient for each blob
        const radius =
          Math.min(width, height) *
          (0.2 + Math.sin(time * 0.001 + i * 2) * 0.05);

        // Different color schemes for variety
        let colors;
        switch (i % 3) {
          case 0:
            colors = [
              "rgba(0, 82, 255, 0.2)",
              "rgba(0, 82, 255, 0.05)",
              "rgba(0, 0, 0, 0)",
            ];
            break;
          case 1:
            colors = [
              "rgba(65, 105, 225, 0.15)",
              "rgba(65, 105, 225, 0.05)",
              "rgba(0, 0, 0, 0)",
            ];
            break;
          default:
            colors = [
              "rgba(30, 144, 255, 0.1)",
              "rgba(30, 144, 255, 0.03)",
              "rgba(0, 0, 0, 0)",
            ];
        }

        const gradient = createGradient(adjustedX, adjustedY, radius, colors);

        // Draw the blob
        ctx.beginPath();
        ctx.arc(adjustedX, adjustedY, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Add subtle grid overlay
      const gridSize = 30;
      ctx.strokeStyle = "rgba(138, 43, 226, 0.05)";
      ctx.lineWidth = 0.5;

      for (let x = 0; x < width; x += gridSize) {
        const waveOffset = Math.sin(time * 0.001 + x * 0.01) * 5;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        // Horizontal lines with wave effect
        ctx.beginPath();
        for (let y = 0; y < height; y += gridSize) {
          const adjustedY = y + Math.sin(time * 0.0005 + x * 0.01) * 5;

          if (y === 0) {
            ctx.moveTo(x, adjustedY);
          } else {
            ctx.lineTo(x, adjustedY);
          }
        }
        ctx.stroke();
      }

      time++;
      animationFrameId = requestAnimationFrame(drawFlowField);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    drawFlowField();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black z-0" />
    </>
  );
};

export default FlowBackground;
