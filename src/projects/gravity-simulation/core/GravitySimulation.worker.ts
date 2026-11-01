import { Particle } from './Particle';
import { QuadTreeNode } from './geometry/QuadTree';
import { Vector2D } from './geometry/Vector2D';

interface IWorkerOptions {
  drawQuadTree: boolean;
}

type IWorkerCommand =
  | { type: 'init'; width: number; height: number }
  | { type: 'step' }
  | { type: 'spawn'; x: number; y: number; count: number }
  | { type: 'options'; options: IWorkerOptions }
  | { type: 'benchmark' };

const scope = self as unknown as {
  onmessage: ((event: MessageEvent<IWorkerCommand>) => void) | null;
  postMessage(message: unknown, transfer?: Transferable[]): void;
};

let width = 0;
let height = 0;
let canvas: HTMLCanvasElement;
let particles: Particle[] = [];
let quadTree: QuadTreeNode;
let options: IWorkerOptions = { drawQuadTree: false };
let frameCount = 0;

const createParticle = (x: number, y: number) => new Particle({
  position: new Vector2D(x, y),
  velocity: new Vector2D(Math.random() * 2 - 1, Math.random() * 2 - 1),
  color: '#fff',
  mass: Math.random() * 1e3,
  size: 1,
  canvas,
});

const createSnapshot = () => {
  // Each particle occupies five float values: x, y, radius, color code, stroke flag.
  const particleData = new Float32Array(particles.length * 5);

  particles.forEach((particle, index) => {
    const offset = index * 5;
    particleData[offset] = particle.position.x;
    particleData[offset + 1] = particle.position.y;
    particleData[offset + 2] = particle.size;
    particleData[offset + 3] = particle.color === '#ff4d3b'
      ? 1
      : particle.color === '#ff0'
        ? 2
        : particle.color === '#000'
          ? 3
          : 0;
    particleData[offset + 4] = particle.strokeColor ? 1 : 0;
  });

  let treeData = new Float32Array(0);
  if (options.drawQuadTree) {
    const nodes: Array<{ x: number; y: number; width: number; height: number; count: number; centerX: number; centerY: number }> = [];
    const visit = (node: QuadTreeNode) => {
      nodes.push({
        x: node.bounds.x,
        y: node.bounds.y,
        width: node.bounds.width,
        height: node.bounds.height,
        count: node.particles.length,
        centerX: node.centerOfMass.position.x,
        centerY: node.centerOfMass.position.y,
      });
      node.nodes.forEach(visit);
    };
    visit(quadTree);

    treeData = new Float32Array(nodes.length * 7);
    nodes.forEach((node, index) => {
      const offset = index * 7;
      treeData[offset] = node.x;
      treeData[offset + 1] = node.y;
      treeData[offset + 2] = node.width;
      treeData[offset + 3] = node.height;
      treeData[offset + 4] = node.count;
      treeData[offset + 5] = node.centerX;
      treeData[offset + 6] = node.centerY;
    });
  }

  return {
    particleData,
    treeData,
    centerOfMass: {
      x: quadTree.centerOfMass.position.x,
      y: quadTree.centerOfMass.position.y,
    },
  };
};

const publishSnapshot = (achievements: string[] = [], diagnostics?: unknown) => {
  const snapshot = createSnapshot();
  scope.postMessage({
    type: 'snapshot',
    particleCount: particles.length,
    particleData: snapshot.particleData,
    treeData: snapshot.treeData,
    centerOfMass: snapshot.centerOfMass,
    achievements: [...new Set(achievements)],
    diagnostics,
  }, [snapshot.particleData.buffer, snapshot.treeData.buffer]);
};

const collectAchievements = () => particles.flatMap((particle) => (
  particle.pendingAchievements.splice(0)
));

const initialize = (nextWidth: number, nextHeight: number) => {
  width = nextWidth;
  height = nextHeight;
  // Particle only reads canvas dimensions in its physics methods. Rendering stays on the main thread.
  canvas = { width, height } as HTMLCanvasElement;
  particles = Array.from({ length: 1000 }, () => createParticle(
    Math.random() * width,
    Math.random() * height,
  ));
  quadTree = QuadTreeNode.create({ x: 0, y: 0, width, height });
  frameCount = 0;
  publishSnapshot();
};

const step = () => {
  const frameStartedAt = performance.now();
  const particlesAtFrameStart = particles.length;
  let initialTreeMs = 0;

  if (particles.length > QuadTreeNode.EXACT_GRAVITY_THRESHOLD) {
    let startedAt = performance.now();
    quadTree.clear();
    quadTree.insertAll(particles);
    initialTreeMs = performance.now() - startedAt;
  }

  const gravityStartedAt = performance.now();
  const gravityDiagnostics = quadTree.computeGravity(
    QuadTreeNode.THETA,
    particles,
  );
  const gravityMs = performance.now() - gravityStartedAt;

  // Gravity changes positions: rebuild the spatial index before collision detection.
  let startedAt = performance.now();
  quadTree.clear();
  quadTree.insertAll(particles);
  const collisionTreeMs = performance.now() - startedAt;

  startedAt = performance.now();
  quadTree.computeCollision();
  const collisionMs = performance.now() - startedAt;

  startedAt = performance.now();
  quadTree.removeFarParticles(height);
  const cleanupMs = performance.now() - startedAt;

  particles = quadTree.getParticles();
  frameCount += 1;

  const diagnostics = {
    frame: frameCount,
    particlesAtFrameStart,
    particlesAfterCleanup: particles.length,
    initialTreeMs,
    gravityMs,
    gravity: gravityDiagnostics,
    collisionTreeMs,
    collisionMs,
    cleanupMs,
    frameTotalMs: performance.now() - frameStartedAt,
  };

  const shouldLogFrame = frameCount <= 10
    || (frameCount <= 100 && frameCount % 10 === 0)
    || frameCount % 60 === 0;
  if (shouldLogFrame) {
    console.info('[GravitySimulation Worker] Performance (last frame)', diagnostics);
  }

  publishSnapshot(collectAchievements(), diagnostics);
};

const spawn = (x: number, y: number, count: number) => {
  for (let index = 0; index < count; index += 1) {
    particles.push(createParticle(x + (Math.random() * 20 - 10), y + (Math.random() * 20 - 10)));
  }
};

const benchmark = () => {
  const populations = [1000, 2000, 5000, 10000];
  const reports = populations.map((count) => {
    const warmupRuns = count <= 5000 ? 1 : 0;
    const repetitions = count <= 2000 ? 5 : (count <= 5000 ? 2 : 1);

    // Deterministic xorshift32 data, independent from the live simulation.
    let seed = (0x9e3779b9 ^ count) >>> 0;
    const random = () => {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return (seed >>> 0) / 0x100000000;
    };

    const benchmarkParticles = Array.from({ length: count }, () => new Particle({
      position: new Vector2D(random() * width, random() * height),
      velocity: new Vector2D(),
      color: '#fff',
      mass: random() * 1e3,
      size: 1,
      canvas,
    }));

    const benchmarkTree = QuadTreeNode.create({ x: 0, y: 0, width, height });
    return benchmarkTree.benchmarkGravity(
      [0.5, 0.6, 0.7, 0.8, 1],
      warmupRuns,
      repetitions,
      warmupRuns,
      repetitions,
      benchmarkParticles,
    );
  });

  scope.postMessage({ type: 'benchmark-result', reports });
};

scope.onmessage = (event) => {
  const command = event.data;

  try {
    switch (command.type) {
      case 'init':
        initialize(command.width, command.height);
        break;
      case 'step':
        step();
        break;
      case 'spawn':
        spawn(command.x, command.y, command.count);
        break;
      case 'options':
        options = { ...options, ...command.options };
        break;
      case 'benchmark':
        benchmark();
        break;
      default:
        break;
    }
  } catch (error) {
    scope.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
