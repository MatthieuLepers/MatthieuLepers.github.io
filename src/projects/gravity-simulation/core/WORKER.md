# Gravity simulation — Web Worker

The simulation uses two execution contexts with deliberately separate responsibilities.

## Main thread

`index.ts` exposes `GravitySimulationTask`, which remains a normal portfolio `Task`.

It only:
- owns the Canvas 2D context and renders the latest received state;
- sends user commands (start, reset, mouse spawning, display options);
- receives achievement identifiers and forwards them to the Vue achievement store;
- asks the worker for the next physics step without waiting for it.

The main thread never owns or mutates the live particle collection.

## Worker

`GravitySimulation.worker.ts` is the source of truth for the simulation state.

It owns:
- the `Particle[]` collection;
- gravity calculation (exact below or at the 2,000-particle crossover, Barnes-Hut above it);
- quadtree construction, collisions, merging and particle cleanup;
- benchmark execution.

The worker imports the existing `Particle` and `QuadTreeNode` implementations. Particle physics therefore stays in one place instead of being duplicated in a second implementation.

## One frame, step by step

1. The main thread renders the most recent snapshot.
2. If the simulation is running and no step is pending, it sends `{ type: 'step' }`.
3. The worker computes gravity, updates particle positions, rebuilds the quadtree, resolves collisions and removes distant particles.
4. The worker packs the render state into a `Float32Array` and transfers its buffer to the main thread.
5. The main thread stores that snapshot. It is drawn on the next animation frame.

There is at most one physics step in flight. This prevents a slow worker from accumulating an unbounded queue of outdated frames. If physics takes longer than a display frame, the portfolio continues rendering the last completed snapshot until the next one arrives.

## Why typed arrays and transferable buffers?

Sending thousands of class instances would require structured-cloning a large object graph every frame. Instead, the worker sends a compact numeric array:

| Slot | Value |
|---:|---|
| 0 | x |
| 1 | y |
| 2 | radius |
| 3 | color code (white, red, yellow, black) |
| 4 | white outline flag |

The array's `ArrayBuffer` is transferred, not copied. The worker creates a fresh snapshot for its next step while the main thread reads the previous one.

The quadtree debug overlay uses a second transferable array and is only populated when that overlay is enabled.

## Achievements

The worker cannot safely use the Vue store or browser local storage. Particle events therefore append achievement identifiers to `pendingAchievements`. The worker sends those identifiers with the next snapshot, and the main thread asks the existing achievement store to process them.

## Where to make changes

- Physics rules, particle merging and star transitions: `Particle.ts`.
- Spatial subdivision, gravity traversal and collision handling: `geometry/QuadTree.ts`.
- Worker lifecycle, message protocol and simulation step: `GravitySimulation.worker.ts`.
- Canvas rendering and worker communication: `index.ts`.
- UI controls and mouse interaction: `../Scene.vue`.

Keep DOM, Canvas rendering, Vue stores and portfolio UI code on the main thread. Keep live simulation state and all physics calculations in the worker.
