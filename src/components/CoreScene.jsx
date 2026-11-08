import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei/core/OrbitControls.js';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { MathUtils, Object3D, Shape, Spherical, SRGBColorSpace, TextureLoader, Vector3 } from 'three';
import logo from '../assets/images/branding/aces-logo-dark-256.jpg';

import { coreModes } from './coreModes.js';
import useCoreProjection from './useCoreProjection.js';

const orange = '#ff6500';
const cameraOptions = { fov: 37, near: 0.1, far: 45, position: [7, 7, 9] };
const center = new Vector3(0, 0.37, 0);
const limits = { minPolar: 0.48, maxPolar: 1.36, maxRadius: 20 };
const plateSettings = { bevelEnabled: true, bevelSize: 0.055, bevelThickness: 0.055, bevelSegments: 2, curveSegments: 5, steps: 1 };

function roundedSquare(size, radius = 0.13) {
  const outline = new Shape();
  const edge = size / 2;
  outline.moveTo(-edge + radius, -edge);
  outline.lineTo(edge - radius, -edge);
  outline.quadraticCurveTo(edge, -edge, edge, -edge + radius);
  outline.lineTo(edge, edge - radius);
  outline.quadraticCurveTo(edge, edge, edge - radius, edge);
  outline.lineTo(-edge + radius, edge);
  outline.quadraticCurveTo(-edge, edge, -edge, edge - radius);
  outline.lineTo(-edge, -edge + radius);
  outline.quadraticCurveTo(-edge, -edge, -edge + radius, -edge);
  return outline;
}

function Plate({ size, depth, height, color }) {
  const shape = useMemo(() => roundedSquare(size), [size]);
  const options = useMemo(() => ({ ...plateSettings, depth }), [depth]);
  return (
    <mesh position={[0, height, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <extrudeGeometry args={[shape, options]} />
      <meshStandardMaterial color={color} metalness={0.48} roughness={0.43} />
    </mesh>
  );
}

function useInstances(items) {
  const mesh = useRef(null);
  useLayoutEffect(() => {
    const transform = new Object3D();
    items.forEach(({ x, y, z, length = 1, width = 1, height = 1, angle = 0 }, index) => {
      transform.position.set(x, y, z);
      transform.rotation.y = angle;
      transform.scale.set(length, height, width);
      transform.updateMatrix();
      mesh.current.setMatrixAt(index, transform.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, [items]);
  return mesh;
}

const offsets = [-0.94, -0.67, -0.4, -0.13, 0.14, 0.41, 0.68, 0.95];
const routes = Array.from({ length: 3 }, () => ({ traces: [], terminals: [] }));
const pins = [];

for (let side = 0; side < 4; side++) {
  const angle = side * Math.PI / 2;
  const rotate = (x, z) => [x * Math.cos(angle) - z * Math.sin(angle), x * Math.sin(angle) + z * Math.cos(angle)];
  offsets.forEach((offset, index) => {
    const group = routes[(index + side) % routes.length];
    const turn = 1.54 + (index % 4) * 0.16;
    const branch = offset + (index < 4 ? -0.48 : 0.48);
    const end = 2.29 + (index % 3) * 0.16;
    const points = [[1.24, offset], [turn, offset], [turn, branch], [end, branch]].map(([x, z]) => rotate(x, z));
    points.slice(1).forEach(([endX, endZ], index) => {
      const [startX, startZ] = points[index];
      group.traces.push({
        x: (startX + endX) / 2, y: 0.23, z: (startZ + endZ) / 2,
        length: Math.hypot(endX - startX, endZ - startZ) + 0.025,
        width: 0.028, height: 0.016, angle: -Math.atan2(endZ - startZ, endX - startX),
      });
    });
    const [x, z] = points.at(-1);
    group.terminals.push({ x, y: 0.24, z });
    const [pinX, pinZ] = rotate(1.31, offset * 1.05);
    pins.push({ x: pinX, y: 0.46, z: pinZ, length: 0.29, width: 0.058, height: 0.043, angle: -angle });
  });
}

function CircuitNetwork({ mode, reduced, interaction }) {
  const material = useRef([]);
  useFrame((state) => {
    if (reduced || interaction.current) return;
    const wave = (Math.sin(state.clock.elapsedTime * 2.4) + 1) / 2;
    material.current.forEach((surface, index) => {
      if (surface) surface.emissiveIntensity = index === mode && mode !== 0 ? (mode === 2 ? .4 + wave * .24 : .76 + wave * .38) : .12;
    });
  });

  return routes.map(({ traces, terminals }, index) => (
    <CircuitBranch key={index} traces={traces} terminals={terminals} active={index === mode && mode !== 0} network={index === mode && mode === 2}
      materialRef={(surface) => { material.current[index] = surface; }} />
  ));
}

function CircuitBranch({ traces, terminals, active, network, materialRef }) {
  const traceMesh = useInstances(traces);
  const terminalMesh = useInstances(terminals);

  return (
    <group>
      <instancedMesh ref={traceMesh} args={[undefined, undefined, traces.length]}>
        <boxGeometry />
        <meshStandardMaterial ref={materialRef} color={active ? orange : '#555555'} emissive={active ? orange : '#222222'} emissiveIntensity={active ? 0.9 : 0.12} roughness={0.48} />
      </instancedMesh>
      <instancedMesh ref={terminalMesh} args={[undefined, undefined, terminals.length]}>
        <cylinderGeometry args={[network ? .095 : .064, network ? .095 : .064, .033, 12]} />
        <meshBasicMaterial color={active ? orange : '#898989'} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

const tracePoint = routes[1].traces.find(({ x, z }) => x > 1.8 && z > .5) ?? routes[1].traces[0];
const traceBranch = routes[1].terminals.find(({ x, z }) => x < -.6 && z > 1.5) ?? routes[1].terminals[0];
const leadPoint = routes[2].terminals.find(({ x, z }) => x < -.8 && z > 1.5) ?? routes[2].terminals[0];
const leadBranch = routes[2].terminals.find(({ x, z }) => x > 1.5 && z < -.6) ?? routes[2].terminals[1];

function Processor({ mode, reduced, interaction, body, anchors, branches }) {
  const pinMesh = useInstances(pins);
  const texture = useLoader(TextureLoader, logo);

  useLayoutEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
  }, [texture]);

  return (
    <group ref={body}>
      <Plate size={5.7} height={-0.02} depth={0.18} color="#242424" />
      <Plate size={5.44} height={-0.15} depth={0.08} color="#383838" />
      <Plate size={5.26} height={-0.29} depth={0.1} color="#111111" />
      <CircuitNetwork mode={mode} reduced={reduced} interaction={interaction} />
      <Plate size={2.78} height={0.29} depth={0.12} color="#555555" />
      <Plate size={2.54} height={0.43} depth={0.11} color="#2a2a2a" />
      <instancedMesh ref={pinMesh} args={[undefined, undefined, pins.length]}>
        <boxGeometry />
        <meshStandardMaterial color="#8c8c8c" metalness={0.58} roughness={0.34} />
      </instancedMesh>
      <group>
        <Plate size={2.29} height={0.55} depth={0.1} color="#333333" />
        <Plate size={2.18} height={0.69} depth={0.14} color="#161616" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.889, 0]}>
          <planeGeometry args={[1.78, 1.78]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>
      {mode === 0 && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .896, 0]}>
        <ringGeometry args={[1.32, 1.35, 4, 1, Math.PI / 4]} />
        <meshBasicMaterial color={orange} toneMapped={false} />
      </mesh>}
      <object3D ref={(node) => { anchors.current[0] = node; }} position={[.84, .89, .78]} />
      <object3D ref={(node) => { anchors.current[1] = node; }} position={[tracePoint.x, .25, tracePoint.z]} />
      <object3D ref={(node) => { anchors.current[2] = node; }} position={[leadPoint.x, .27, leadPoint.z]} />
      <object3D ref={(node) => { branches.current[1] = node; }} position={[traceBranch.x, .27, traceBranch.z]} />
      <object3D ref={(node) => { branches.current[2] = node; }} position={[leadBranch.x, .27, leadBranch.z]} />
      {[-2.49, 2.49].flatMap((x) => [-2.49, 2.49].map((z) => (
        <mesh key={x + ',' + z} position={[x, 0.225, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.085, 0.118, 14]} />
          <meshBasicMaterial color="#a3a3a3" />
        </mesh>
      )))}
    </group>
  );
}

const energyLocations = [
  [-3.16, -0.14, -2.7], [3.24, 0.03, -1.71], [-3.05, -0.19, 1.77],
  [2.9, -0.15, 2.54], [1.38, 0.04, -3.16], [-1.46, -0.22, 3.17],
].map(([x, y, z]) => ({ x, y, z }));

function EnergyMarkers({ reduced, interaction }) {
  const points = useInstances(energyLocations);
  const group = useRef(null);
  useFrame((state) => {
    if (!reduced && !interaction.current) group.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.09;
  });
  return (
    <group ref={group}>
      <instancedMesh ref={points} args={[undefined, undefined, energyLocations.length]}>
        <octahedronGeometry args={[0.033]} />
        <meshBasicMaterial color={orange} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function SceneController({ view, visible, reduced, coarse, touchEnabled, command, viewport, overlay, onFailure, onReady }) {
  const controls = useRef(null);
  const body = useRef(null);
  const anchors = useRef([]);
  const branches = useRef([]);
  const bounds = useRef(null);
  const fit = useRef(0);
  const motion = useRef(null);
  const interaction = useRef(false);
  const idleTime = useRef(0);
  const resumeAt = useRef(0);
  const currentHighlight = useRef(0);
  const [highlight, setHighlight] = useState(0);
  const { camera, size, invalidate, gl, setDpr } = useThree();
  const scratch = useMemo(() => ({ offset: new Vector3(), from: new Spherical(), work: new Spherical() }), []);
  const project = useCoreProjection(overlay, anchors, branches, bounds);

  function place(spherical) {
    camera.position.setFromSpherical(spherical).add(center);
    camera.lookAt(center);
    camera.updateMatrixWorld();
  }

  function readOrbit(out) {
    return out.setFromVector3(scratch.offset.copy(camera.position).sub(center));
  }

  function reveal(index) {
    if (currentHighlight.current !== index) {
      currentHighlight.current = index;
      setHighlight(index);
    }
  }

  function moveTo(to, duration, modeChange) {
    if (reduced) {
      place(to);
      motion.current = null;
      reveal(view.index);
    } else {
      const from = readOrbit(new Spherical());
      const turn = MathUtils.euclideanModulo(to.theta - from.theta + Math.PI, 2 * Math.PI) - Math.PI;
      to.theta = from.theta + turn;
      motion.current = { from, to, duration, modeChange, start: performance.now() };
    }
    invalidate();
  }

  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event) => { event.preventDefault(); onFailure(); };
    canvas.addEventListener('webglcontextlost', lost);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [gl, onFailure]);

  useLayoutEffect(() => {
    const pocket = viewport.current;
    function measure() {
      const full = gl.domElement.getBoundingClientRect();
      const rect = pocket.getBoundingClientRect();
      if (!full.width || !full.height || !rect.width || !rect.height) return;
      const left = rect.left - full.left;
      const top = rect.top - full.top;
      const width = full.width;
      const height = full.height;
      const aspect = rect.width / rect.height;
      const tangent = Math.tan(MathUtils.degToRad(cameraOptions.fov / 2));
      const distance = Math.max(10.9, 3.85 / (tangent * Math.min(aspect, 1))) + .28;
      const previousFit = fit.current;

      const verticalAnchor = matchMedia('(max-width: 767.98px)').matches ? .56 : .51;
      camera.fov = MathUtils.radToDeg(2 * Math.atan(tangent * height / rect.height));
      camera.setViewOffset(width, height, width / 2 - (left + rect.width * .49), height / 2 - (top + rect.height * verticalAnchor), width, height);
      if (!previousFit) {
        place(scratch.work.set(distance, coreModes[0].pitch, coreModes[0].yaw));
      } else if (Math.abs(distance - previousFit) > .01) {
        readOrbit(scratch.work);
        scratch.work.radius *= distance / previousFit;
        place(scratch.work);
        if (motion.current) {
          motion.current.from.radius *= distance / previousFit;
          motion.current.to.radius *= distance / previousFit;
        }
      }
      fit.current = distance;
      bounds.current = { left, top, width, height, right: left + rect.width, bottom: top + rect.height };
      invalidate();
    }

    const observer = new ResizeObserver(measure);
    observer.observe(pocket);
    observer.observe(pocket.parentElement);
    overlay.current?.querySelectorAll('.core-callout').forEach((panel) => observer.observe(panel));
    measure();
    return () => observer.disconnect();
  }, [camera, gl, invalidate, size.width, size.height, viewport, overlay, scratch]);

  useLayoutEffect(() => {
    const native = window.devicePixelRatio || 1;
    const budget = Math.sqrt((coarse ? 740000 : 1360000) / Math.max(1, size.width * size.height));
    setDpr(Math.max(.65, Math.min(native, budget, coarse ? 1 : 1.25)));
  }, [coarse, setDpr, size.width, size.height]);

  const lastView = useRef(null);
  useLayoutEffect(() => {
    if (!fit.current) return;
    const { yaw, pitch } = coreModes[view.index];
    if (!lastView.current) {
      place(scratch.work.set(fit.current, pitch, yaw));
      reveal(view.index);
      invalidate();
    } else {
      const radius = view.reset ? fit.current : readOrbit(scratch.from).radius;
      if (view.reset) idleTime.current = 0;
      moveTo(new Spherical(radius, pitch, yaw), 1250, true);
    }
    lastView.current = view;
  }, [view, reduced]);

  useEffect(() => {
    const host = viewport.current;
    const apply = () => {
      const action = command.current;
      if (!action || !fit.current) return;
      const orbit = readOrbit(new Spherical());
      if (action === 'left') orbit.theta -= .28;
      if (action === 'right') orbit.theta += .28;
      if (action === 'up') orbit.phi -= .18;
      if (action === 'down') orbit.phi += .18;
      if (action === 'near') orbit.radius *= .89;
      if (action === 'far') orbit.radius *= 1.12;
      orbit.radius = MathUtils.clamp(orbit.radius, fit.current * .77, Math.max(limits.maxRadius, fit.current * 1.48));
      orbit.phi = MathUtils.clamp(orbit.phi, limits.minPolar, limits.maxPolar);
      moveTo(orbit, 320, false);
    };
    host.addEventListener('aces:camera', apply);
    return () => host.removeEventListener('aces:camera', apply);
  }, [camera, command, invalidate, reduced, scratch, viewport, view]);

  useEffect(() => { onReady(); }, [onReady]);

  useEffect(() => {
    if (!visible || reduced) return undefined;
    // Ambient motion is subtle; 30 updates per second avoid keeping the GPU at full load.
    const ambient = setInterval(invalidate, 1000 / 30);
    return () => clearInterval(ambient);
  }, [visible, reduced, invalidate]);

  useFrame((_, delta) => {
    const now = performance.now();
    let annotation = view.index;
    const transition = motion.current;
    if (transition) {
      const progress = Math.min(1, (now - transition.start) / transition.duration);
      const eased = progress * progress * (3 - 2 * progress);
      const { from, to } = transition;
      place(scratch.work.set(MathUtils.lerp(from.radius, to.radius, eased),
        MathUtils.lerp(from.phi, to.phi, eased), MathUtils.lerp(from.theta, to.theta, eased)));
      if (transition.modeChange && progress < .69) annotation = null;
      if (progress >= .62) reveal(view.index);
      if (progress === 1) {
        motion.current = null;
        resumeAt.current = now + 360;
      }
    } else reveal(view.index);

    if (body.current) {
      if (reduced) {
        body.current.position.y = 0;
        body.current.rotation.y = 0;
      } else if (!interaction.current && !motion.current && now >= resumeAt.current) {
        idleTime.current += Math.min(delta, .045);
        body.current.rotation.y = Math.sin(idleTime.current * .56) * .073;
        body.current.position.y = Math.sin(idleTime.current * 1.2) * .048;
      }
    }

    camera.updateMatrixWorld();
    project(camera, annotation);
  }, -.5);

  return (
    <>
      <ambientLight intensity={.94} />
      <directionalLight position={[3, 8, 4]} intensity={1.7} />
      <directionalLight position={[-4, 3, -5]} intensity={1.05} />
      <gridHelper args={[7.55, 16, '#444444', '#242424']} position={[0, -.69, 0]} />
      <Processor mode={highlight} reduced={reduced} interaction={interaction} body={body} anchors={anchors} branches={branches} />
      <EnergyMarkers reduced={reduced} interaction={interaction} />
      <OrbitControls ref={controls} domElement={viewport.current} makeDefault target={center} enableDamping={false}
        enabled={!coarse || touchEnabled} enablePan={false} enableZoom={false} rotateSpeed={.78}
        minPolarAngle={limits.minPolar} maxPolarAngle={limits.maxPolar}
        onStart={() => { motion.current = null; interaction.current = true; invalidate(); }}
        onEnd={() => { interaction.current = false; resumeAt.current = performance.now() + 700; }} />
    </>
  );
}

export default function CoreScene({ visible, reduced, coarse, ...props }) {
  return (
    <Canvas camera={cameraOptions} dpr={1} gl={{ antialias: !coarse, alpha: true, powerPreference: 'low-power' }}
      frameloop={visible ? 'demand' : 'never'}>
      <SceneController {...props} visible={visible} reduced={reduced} coarse={coarse} />
    </Canvas>
  );
}

