import { useEffect, useRef, type FunctionComponent } from 'react';
import styles from './index.module.scss';

/*
    The logo's wine glass, drawn flat in the text colour like the old icon, but with wine
    that moves. The surface is a row of coupled springs: it sloshes when the glass swings
    on hover and when scrolling speeds up or slows down.

    The loop only runs while the wine is moving and the glass is on screen; with reduced
    motion the glass is drawn once and stays still.
*/

// ---- geometry, in units of the rim's half-width; origin at the rim centre, y down ----

const BOWL_BOTTOM = 1.62;
const STEM_BOTTOM = 2.9;
const BASE_HALF_WIDTH = 0.75;
// the glass swings around the middle of the stem
const PIVOT_Y = 2.2;

// the canvas is wider than the glass so the rim stays inside it at the far ends of a swing;
// the stylesheet pulls the extra width back with negative margins so the logo doesn't move
const SWING_ROOM = 8;
const WIDTH = 30 + 2 * SWING_ROOM;
const HEIGHT = 40;
const ORIGIN_X = WIDTH / 2;
const ORIGIN_Y = 6;
const SCALE = 8.5; // pixels per unit
const REST_ANGLE = -0.35; // tipped back, like the old icon
const LINE = 2.6; // close to the stroke weight of the Anton letters next to it

const bowlPath = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.moveTo(-1, 0);
  ctx.bezierCurveTo(-1.18, 0.75, -0.85, 1.55, 0, BOWL_BOTTOM);
  ctx.bezierCurveTo(0.85, 1.55, 1.18, 0.75, 1, 0);
};

// ---- simulation ----

const COLUMNS = 24;
const SPAN = 1.25; // the surface is simulated a little past the rim on both sides
const LEVEL = 0.75; // depth of the resting wine surface
const STEP = 1 / 120;

const WAVE_STIFFNESS = 150; // pulls each column back to level (~2 Hz slosh)
const WAVE_DAMPING = 2.4;
const WAVE_TENSION = 1.2; // couples neighbouring columns into travelling waves
const SWING_STIFFNESS = 90;
const SWING_DAMPING = 5;

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

const createSim = () => {
  const dx = (2 * SPAN) / (COLUMNS - 1);
  return {
    dx,
    xs: Array.from({ length: COLUMNS }, (_, i) => -SPAN + i * dx),
    heights: new Float32Array(COLUMNS),
    velocities: new Float32Array(COLUMNS),
    angle: REST_ANGLE,
    angularVelocity: 0,
  };
};

type Sim = ReturnType<typeof createSim>;

const step = (sim: Sim, dt: number) => {
  const { heights: h, velocities: v, xs } = sim;

  const angularAcceleration = -SWING_STIFFNESS * (sim.angle - REST_ANGLE) - SWING_DAMPING * sim.angularVelocity;
  sim.angularVelocity += angularAcceleration * dt;
  sim.angle += sim.angularVelocity * dt;

  for (let i = 0; i < COLUMNS; i++) {
    const left = h[i === 0 ? 0 : i - 1];
    const right = h[i === COLUMNS - 1 ? i : i + 1];
    const tension = (WAVE_TENSION * (left + right - 2 * h[i])) / (sim.dx * sim.dx);
    // the walls drag the wine along when the glass turns, so it lags and sloshes
    const inertia = -0.9 * angularAcceleration * xs[i];
    v[i] += (tension - WAVE_STIFFNESS * h[i] - WAVE_DAMPING * v[i] + inertia) * dt;
  }

  for (let i = 0; i < COLUMNS; i++) h[i] = clamp(h[i] + v[i] * dt, 0.5);
};

// a push proportional to x tips the surface, so it sloshes side to side
const push = (sim: Sim, amount: number) => {
  for (let i = 0; i < COLUMNS; i++) sim.velocities[i] += amount * sim.xs[i];
};

const isSettled = (sim: Sim) => {
  if (Math.abs(sim.angle - REST_ANGLE) > 0.001 || Math.abs(sim.angularVelocity) > 0.01) return false;
  for (let i = 0; i < COLUMNS; i++) {
    if (Math.abs(sim.heights[i]) > 0.002 || Math.abs(sim.velocities[i]) > 0.01) return false;
  }
  return true;
};

// ---- drawing: one flat colour, like the letters beside it ----

const draw = (ctx: CanvasRenderingContext2D, sim: Sim, color: string, dpr: number) => {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.translate(ORIGIN_X, ORIGIN_Y);
  ctx.scale(SCALE, SCALE);
  ctx.translate(0, PIVOT_Y);
  ctx.rotate(sim.angle);
  ctx.translate(0, -PIVOT_Y);

  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = LINE / SCALE;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // the wine stays level with the world while the glass tips, plus whatever waves are running
  const tilt = Math.tan(sim.angle);
  ctx.save();
  bowlPath(ctx);
  ctx.closePath();
  ctx.clip();
  ctx.beginPath();
  ctx.moveTo(sim.xs[0], LEVEL - tilt * sim.xs[0] + sim.heights[0]);
  for (let i = 1; i < COLUMNS; i++) ctx.lineTo(sim.xs[i], LEVEL - tilt * sim.xs[i] + sim.heights[i]);
  ctx.lineTo(SPAN, BOWL_BOTTOM + 1);
  ctx.lineTo(-SPAN, BOWL_BOTTOM + 1);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  bowlPath(ctx);
  ctx.stroke();

  // stem and foot
  ctx.beginPath();
  ctx.moveTo(0, BOWL_BOTTOM);
  ctx.lineTo(0, STEM_BOTTOM);
  ctx.moveTo(-BASE_HALF_WIDTH, STEM_BOTTOM);
  ctx.lineTo(BASE_HALF_WIDTH, STEM_BOTTOM);
  ctx.stroke();
};

const WineGlass: FunctionComponent<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const sim = createSim();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    canvas.style.width = `${WIDTH}px`;
    canvas.style.height = `${HEIGHT}px`;

    // the glass takes the colour of the text around it
    const color = getComputedStyle(canvas).color;
    draw(ctx, sim, color, dpr);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let lastTime = 0;
    let accumulator = 0;
    let visible = true;

    const tick = (time: number) => {
      const elapsed = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : STEP;
      lastTime = time;
      accumulator += elapsed;
      while (accumulator >= STEP) {
        step(sim, STEP);
        accumulator -= STEP;
      }
      draw(ctx, sim, color, dpr);

      if (isSettled(sim) || !visible) {
        frame = 0;
        lastTime = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!frame && visible) frame = requestAnimationFrame(tick);
    };

    // scrolling that speeds up or slows down nudges the wine
    let lastScrollY = window.scrollY;
    let lastScrollDelta = 0;
    const onScroll = () => {
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      push(sim, clamp((delta - lastScrollDelta) * 0.06, 2.5));
      lastScrollDelta = delta;
      wake();
    };

    // hovering the logo swings the glass
    const hoverTarget = canvas.parentElement;
    const onEnter = () => {
      sim.angularVelocity += 6;
      wake();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    hoverTarget?.addEventListener('pointerenter', onEnter);
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      hoverTarget?.removeEventListener('pointerenter', onEnter);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={`${styles.glass} ${className ?? ''}`} aria-hidden />;
};

export default WineGlass;
