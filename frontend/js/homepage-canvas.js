import * as THREE from 'three';

/**
 * HOMEPAGE CANVAS: "Gateway to Science" Immersive Visualization
 * 
 * A stunning, immediately captivating experience featuring:
 * - Neural Network Constellation (interconnected nodes of knowledge)
 * - Orbital Particle Rings (scientific discovery paths)
 * - DNA Helix Flow (life sciences)
 * - Ambient Cosmic Dust (depth & mystery)
 * 
 * Designed to WOW visitors the moment they land on the homepage.
 */

class HomepageCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 1);

        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 50;

        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2(0, 0);
        this.targetMouse = new THREE.Vector2(0, 0);

        this.init();
        this.addListeners();
        this.animate();
    }

    init() {
        // === NEURAL NETWORK CONSTELLATION ===
        // Interconnected glowing nodes representing knowledge networks
        this.createNeuralNetwork();

        // === ORBITAL RINGS ===
        // Scientific discovery paths orbiting around center
        this.createOrbitalRings();

        // === DNA DOUBLE HELIX ===
        // Life science representation
        this.createDNAHelix();

        // === COSMIC BACKGROUND PARTICLES ===
        // Depth and atmosphere
        this.createCosmicDust();

        // === CENTRAL ENERGY CORE ===
        // Glowing nucleus at the center
        this.createEnergyCore();

        // === LIGHTING ===
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x3b82f6, 2, 100);
        pointLight1.position.set(20, 20, 20);
        this.scene.add(pointLight1);
        this.pointLight1 = pointLight1;

        const pointLight2 = new THREE.PointLight(0x8b5cf6, 1.5, 100);
        pointLight2.position.set(-20, -10, 20);
        this.scene.add(pointLight2);
        this.pointLight2 = pointLight2;

        const pointLight3 = new THREE.PointLight(0x06b6d4, 1, 80);
        pointLight3.position.set(0, 30, -20);
        this.scene.add(pointLight3);
        this.pointLight3 = pointLight3;
    }

    createNeuralNetwork() {
        const nodeCount = 80;
        const nodes = [];
        const positions = [];
        const colors = [];

        // Create node positions in a spherical distribution
        for (let i = 0; i < nodeCount; i++) {
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            const radius = 20 + Math.random() * 15;

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            nodes.push(new THREE.Vector3(x, y, z));
            positions.push(x, y, z);

            // Gradient from blue to cyan to purple
            const t = i / nodeCount;
            const r = 0.23 + t * 0.35;
            const g = 0.51 + t * 0.2;
            const b = 0.96 - t * 0.1;
            colors.push(r, g, b);
        }

        // Create node points
        const nodeGeometry = new THREE.BufferGeometry();
        nodeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        nodeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const nodeMaterial = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });

        this.neuralNodes = new THREE.Points(nodeGeometry, nodeMaterial);
        this.scene.add(this.neuralNodes);

        // Create connections between nearby nodes
        const connectionPositions = [];
        const connectionColors = [];
        const maxDistance = 15;

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = nodes[i].distanceTo(nodes[j]);
                if (distance < maxDistance) {
                    connectionPositions.push(
                        nodes[i].x, nodes[i].y, nodes[i].z,
                        nodes[j].x, nodes[j].y, nodes[j].z
                    );

                    const alpha = 1 - distance / maxDistance;
                    connectionColors.push(
                        0.23, 0.51, 0.96, alpha * 0.3,
                        0.55, 0.36, 0.96, alpha * 0.3
                    );
                }
            }
        }

        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connectionPositions, 3));

        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });

        this.neuralConnections = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.scene.add(this.neuralConnections);

        this.nodeData = nodes;
    }

    createOrbitalRings() {
        this.orbitalRings = [];
        const ringColors = [0x3b82f6, 0x8b5cf6, 0x06b6d4, 0x22d3ee];

        for (let r = 0; r < 4; r++) {
            const radius = 25 + r * 8;
            const particleCount = 100 + r * 30;
            const positions = [];
            const velocities = [];

            for (let i = 0; i < particleCount; i++) {
                const angle = (i / particleCount) * Math.PI * 2;
                const variance = (Math.random() - 0.5) * 3;

                const x = Math.cos(angle) * (radius + variance);
                const y = (Math.random() - 0.5) * 4;
                const z = Math.sin(angle) * (radius + variance);

                positions.push(x, y, z);
                velocities.push(angle);
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

            const material = new THREE.PointsMaterial({
                size: 0.8 - r * 0.1,
                color: ringColors[r],
                transparent: true,
                opacity: 0.7 - r * 0.1,
                blending: THREE.AdditiveBlending
            });

            const ring = new THREE.Points(geometry, material);
            ring.userData = {
                radius,
                velocities,
                speed: 0.3 - r * 0.05,
                tilt: (r - 1.5) * 0.15
            };
            ring.rotation.x = ring.userData.tilt;

            this.orbitalRings.push(ring);
            this.scene.add(ring);
        }
    }

    createDNAHelix() {
        const helixPoints = 200;
        const positions1 = [];
        const positions2 = [];
        const connections = [];
        const colors = [];

        for (let i = 0; i < helixPoints; i++) {
            const t = i / helixPoints;
            const angle = t * Math.PI * 6;
            const y = (t - 0.5) * 60;
            const radius = 8;

            // Strand 1
            const x1 = Math.cos(angle) * radius - 35;
            const z1 = Math.sin(angle) * radius;
            positions1.push(x1, y, z1);

            // Strand 2 (opposite phase)
            const x2 = Math.cos(angle + Math.PI) * radius - 35;
            const z2 = Math.sin(angle + Math.PI) * radius;
            positions2.push(x2, y, z2);

            // Base pair connections (every 10 points)
            if (i % 10 === 0) {
                connections.push(x1, y, z1, x2, y, z2);
            }

            // Colors
            const hue = 0.55 + t * 0.15;
            colors.push(hue, 0.8, 0.9);
        }

        // Strand 1
        const geometry1 = new THREE.BufferGeometry();
        geometry1.setAttribute('position', new THREE.Float32BufferAttribute(positions1, 3));
        const material1 = new THREE.PointsMaterial({
            size: 0.6,
            color: 0x06b6d4,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        this.dnaStrand1 = new THREE.Points(geometry1, material1);
        this.scene.add(this.dnaStrand1);

        // Strand 2
        const geometry2 = new THREE.BufferGeometry();
        geometry2.setAttribute('position', new THREE.Float32BufferAttribute(positions2, 3));
        const material2 = new THREE.PointsMaterial({
            size: 0.6,
            color: 0x8b5cf6,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        this.dnaStrand2 = new THREE.Points(geometry2, material2);
        this.scene.add(this.dnaStrand2);

        // Base pair connections
        const connectionGeometry = new THREE.BufferGeometry();
        connectionGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connections, 3));
        const connectionMaterial = new THREE.LineBasicMaterial({
            color: 0x22d3ee,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        this.dnaConnections = new THREE.LineSegments(connectionGeometry, connectionMaterial);
        this.scene.add(this.dnaConnections);

        // Store original positions for animation
        this.dnaOriginalPositions1 = positions1.slice();
        this.dnaOriginalPositions2 = positions2.slice();
    }

    createCosmicDust() {
        const particleCount = 1500;
        const positions = [];
        const sizes = [];
        const colors = [];

        for (let i = 0; i < particleCount; i++) {
            // Spherical distribution with more density at edges
            const radius = 30 + Math.pow(Math.random(), 0.5) * 70;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions.push(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );

            sizes.push(Math.random() * 0.5 + 0.1);

            // Subtle color variation
            const brightness = 0.3 + Math.random() * 0.4;
            colors.push(brightness, brightness * 1.1, brightness * 1.3);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.4,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.cosmicDust = new THREE.Points(geometry, material);
        this.scene.add(this.cosmicDust);
    }

    createEnergyCore() {
        // Inner glowing sphere
        const coreGeometry = new THREE.IcosahedronGeometry(5, 3);
        const coreMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x3b82f6,
            emissive: 0x1e40af,
            emissiveIntensity: 0.5,
            metalness: 0.3,
            roughness: 0.2,
            transparent: true,
            opacity: 0.4,
            wireframe: true
        });
        this.energyCore = new THREE.Mesh(coreGeometry, coreMaterial);
        this.scene.add(this.energyCore);

        // Outer pulsing shell
        const shellGeometry = new THREE.IcosahedronGeometry(7, 2);
        const shellMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x8b5cf6,
            emissive: 0x6366f1,
            emissiveIntensity: 0.3,
            metalness: 0.1,
            roughness: 0.5,
            transparent: true,
            opacity: 0.2,
            wireframe: true
        });
        this.energyShell = new THREE.Mesh(shellGeometry, shellMaterial);
        this.scene.add(this.energyShell);

        // Store original vertices for morphing
        this.coreOriginalPositions = coreGeometry.attributes.position.array.slice();
        this.shellOriginalPositions = shellGeometry.attributes.position.array.slice();
    }

    addListeners() {
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Handle scroll for parallax effect
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            this.scrollProgress = scrollY / maxScroll;
        });
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = this.clock.getElapsedTime();

        // Smooth mouse interpolation
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        // === ANIMATE NEURAL NETWORK ===
        if (this.neuralNodes) {
            this.neuralNodes.rotation.y = time * 0.05;
            this.neuralNodes.rotation.x = Math.sin(time * 0.1) * 0.1;
        }
        if (this.neuralConnections) {
            this.neuralConnections.rotation.y = time * 0.05;
            this.neuralConnections.rotation.x = Math.sin(time * 0.1) * 0.1;
        }

        // === ANIMATE ORBITAL RINGS ===
        this.orbitalRings.forEach((ring, index) => {
            ring.rotation.y = time * ring.userData.speed * (index % 2 === 0 ? 1 : -1);
            ring.rotation.z = Math.sin(time * 0.2 + index) * 0.05;
        });

        // === ANIMATE DNA HELIX ===
        if (this.dnaStrand1 && this.dnaStrand2) {
            const twist = time * 0.5;
            this.dnaStrand1.rotation.y = twist * 0.1;
            this.dnaStrand2.rotation.y = twist * 0.1;
            this.dnaConnections.rotation.y = twist * 0.1;

            // Vertical oscillation
            this.dnaStrand1.position.y = Math.sin(time * 0.3) * 2;
            this.dnaStrand2.position.y = Math.sin(time * 0.3) * 2;
            this.dnaConnections.position.y = Math.sin(time * 0.3) * 2;
        }

        // === ANIMATE COSMIC DUST ===
        if (this.cosmicDust) {
            this.cosmicDust.rotation.y = time * 0.01;
            this.cosmicDust.rotation.x = time * 0.005;
        }

        // === ANIMATE ENERGY CORE ===
        if (this.energyCore && this.energyShell) {
            // Rotation
            this.energyCore.rotation.y = time * 0.3;
            this.energyCore.rotation.x = time * 0.2;
            this.energyShell.rotation.y = -time * 0.15;
            this.energyShell.rotation.z = time * 0.1;

            // Pulsing effect on core
            const pulse = 1 + Math.sin(time * 2) * 0.1;
            this.energyCore.scale.set(pulse, pulse, pulse);

            // Breathing effect on shell
            const breath = 1 + Math.sin(time * 1.5) * 0.05;
            this.energyShell.scale.set(breath, breath, breath);

            // Morph core vertices
            const corePositions = this.energyCore.geometry.attributes.position.array;
            for (let i = 0; i < corePositions.length; i += 3) {
                const ox = this.coreOriginalPositions[i];
                const oy = this.coreOriginalPositions[i + 1];
                const oz = this.coreOriginalPositions[i + 2];
                const distance = Math.sqrt(ox * ox + oy * oy + oz * oz);
                const wave = Math.sin(distance + time * 3) * 0.3;

                corePositions[i] = ox + (ox / distance) * wave;
                corePositions[i + 1] = oy + (oy / distance) * wave;
                corePositions[i + 2] = oz + (oz / distance) * wave;
            }
            this.energyCore.geometry.attributes.position.needsUpdate = true;
        }

        // === ANIMATE LIGHTS ===
        if (this.pointLight1) {
            this.pointLight1.position.x = Math.sin(time * 0.5) * 25;
            this.pointLight1.position.z = Math.cos(time * 0.5) * 25;
        }
        if (this.pointLight2) {
            this.pointLight2.position.x = Math.sin(time * 0.3 + Math.PI) * 20;
            this.pointLight2.position.y = Math.cos(time * 0.4) * 15;
        }

        // === CAMERA MOVEMENT ===
        // Mouse parallax
        this.camera.position.x += (this.mouse.x * 8 - this.camera.position.x) * 0.03;
        this.camera.position.y += (this.mouse.y * 5 - this.camera.position.y) * 0.03;

        // Subtle automatic drift
        this.camera.position.z = 50 + Math.sin(time * 0.2) * 3;

        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new HomepageCanvas('homepage-canvas');
});

export default HomepageCanvas;
