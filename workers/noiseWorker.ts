/**
 * Simplex noise field for the hero gradient.
 *
 * This module is both the worker entry point and a plain library. Inside a
 * dedicated worker it installs a message handler; imported on the main thread
 * it is just `computeNoiseField`. That is deliberate — the mobile path runs the
 * computation on the main thread (a 6x4 grid is 24 points, cheaper than the
 * postMessage round trip), and having one implementation means the two paths
 * cannot drift apart.
 *
 * The scope detection avoids `/// <reference lib="webworker" />`: pulling that
 * lib into a file the main bundle also imports collides with lib.dom over the
 * type of `self`. A structural guard costs nothing and keeps both call sites
 * type-checked against the same DOM lib.
 */

import { createNoise3D } from "simplex-noise";

/** Payload posted *to* the worker. */
export interface WorkerMessage {
  type: "field";
  /** Control points across and down. 12x8 on desktop, 6x4 on touch. */
  cols: number;
  rows: number;
  /** Canvas size in CSS px. The noise is sampled in layout space, so the
   *  feature size stays constant regardless of the backing-store scale. */
  width: number;
  height: number;
  /** Noise time axis. Advances 0.0004 per rendered frame. */
  time: number;
  /** The previous response's buffer, handed back for reuse. Null on the
   *  first request. Recycling keeps the loop allocation-free. */
  buffer: ArrayBuffer | null;
}

/** Payload posted *back* to the main thread. */
export interface WorkerResponse {
  type: "field";
  cols: number;
  rows: number;
  time: number;
  /** [dx, dy] per control point, row-major, each roughly in -1.05..1.05.
   *  Pinned to ArrayBuffer (not the ArrayBufferLike default) so the buffer is
   *  statically known to be transferable. */
  field: Float32Array<ArrayBuffer>;
}

/* ------------------------------- Noise field ------------------------------ */

const OCTAVES = 3;
const AMPLITUDE = 0.6;
const FREQUENCY = 0.003;
const LACUNARITY = 2.0;
const PERSISTENCE = 0.5;

/** Distance along the time axis between the x and y displacement channels.
 *  Far enough apart that the two reads are uncorrelated, so points drift on a
 *  wander rather than sliding along a single diagonal. */
const CHANNEL_OFFSET = 41.3;

/**
 * The grid is sampled beyond the canvas on every side, so that a control point
 * pulled inward by the noise never drags the mesh off the visible edge.
 */
export const GRID_BLEED = 0.12;

/** Fixed seed. `createNoise3D()` defaults to Math.random, which would hand out
 *  a different field every reload — and, worse, a visibly different one each
 *  time the worker is rebuilt after scrolling back up to the hero. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const noise3D = createNoise3D(mulberry32(0x0e0c08));

function fbm(x: number, y: number, z: number): number {
  let amplitude = AMPLITUDE;
  let frequency = FREQUENCY;
  let total = 0;

  for (let octave = 0; octave < OCTAVES; octave += 1) {
    total += noise3D(x * frequency, y * frequency, z) * amplitude;
    frequency *= LACUNARITY;
    amplitude *= PERSISTENCE;
  }

  return total;
}

/** Undisplaced position of a control point, in CSS px. Exported so the
 *  renderer lays the grid out on exactly the coordinates that were sampled. */
export function gridPosition(index: number, count: number, extent: number): number {
  const bleed = extent * GRID_BLEED;
  return -bleed + (index / (count - 1)) * (extent + bleed * 2);
}

/**
 * Displacement for every control point. Writes into the recycled buffer when
 * one is supplied and still the right size.
 */
export function computeNoiseField(message: WorkerMessage): Float32Array<ArrayBuffer> {
  const { cols, rows, width, height, time, buffer } = message;
  const length = cols * rows * 2;
  const field =
    buffer !== null && buffer.byteLength === length * Float32Array.BYTES_PER_ELEMENT
      ? new Float32Array(buffer)
      : new Float32Array(length);

  let i = 0;
  for (let row = 0; row < rows; row += 1) {
    const y = gridPosition(row, rows, height);
    for (let col = 0; col < cols; col += 1) {
      const x = gridPosition(col, cols, width);
      field[i] = fbm(x, y, time);
      field[i + 1] = fbm(x, y, time + CHANNEL_OFFSET);
      i += 2;
    }
  }

  return field;
}

/* ------------------------------ Worker entry ------------------------------ */

interface WorkerScope {
  addEventListener(
    type: "message",
    listener: (event: MessageEvent<WorkerMessage>) => void,
  ): void;
  postMessage(message: WorkerResponse, transfer: Transferable[]): void;
}

function isWorkerScope(value: object): value is WorkerScope {
  // A dedicated worker global posts messages and has no document. `in` checks
  // keep this a genuine type guard rather than an assertion.
  return (
    "postMessage" in value && "addEventListener" in value && !("document" in value)
  );
}

function dedicatedWorkerScope(): WorkerScope | null {
  if (typeof window !== "undefined") return null;
  const scope: object = globalThis;
  return isWorkerScope(scope) ? scope : null;
}

const scope = dedicatedWorkerScope();

if (scope) {
  scope.addEventListener("message", (event) => {
    const message = event.data;
    if (message.type !== "field") return;

    const field = computeNoiseField(message);
    // Transfer rather than clone: the main thread hands the same buffer back
    // on the next request, so the pair ping-pongs one allocation forever.
    scope.postMessage(
      { type: "field", cols: message.cols, rows: message.rows, time: message.time, field },
      [field.buffer],
    );
  });
}
