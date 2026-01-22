import * as THREE from 'three';

/**
 * MESMERIZING HOMEPAGE VISUALIZATION
 * 
 * A stunning, love-at-first-sight experience featuring:
 * - Flowing Aurora/Nebula waves
 * - Elegant particle constellation
 * - Smooth, hypnotic animations
 * - Deep, rich color palette (dark blues, teals, subtle whites)
 * 
 * Designed to captivate visitors instantly.
 */

class MesmerizingCanvas {
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

        // Deep, rich background - almost black with subtle blue
        this.renderer.setClearColor(0x030712, 1);

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 30;

        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2(0, 0);
        this.targetMouse = new THREE.Vector2(0, 0);

        this.init();
        this.addListeners();
        this.animate();
    }

    init() {
        // === FLOWING AURORA WAVES ===
        this.createAuroraWaves();

        // === ELEGANT STAR FIELD ===
        this.createStarField();

        // === CENTRAL GLOWING ORB ===
        this.createCentralOrb();

        // === FLOWING PARTICLE STREAMS ===
        this.createParticleStreams();

        // === SUBTLE AMBIENT LIGHTING ===
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        this.scene.add(ambientLight);
    }

    createAuroraWaves() {
        // Create flowing wave meshes that look like aurora borealis
        this.auroraWaves = [];

        const waveColors = [
            { color: 0x0ea5e9, emissive: 0x0284c7, opacity: 0.15 }, // Sky blue
            { color: 0x06b6d4, emissive: 0x0891b2, opacity: 0.12 }, // Cyan
            { color: 0x14b8a6, emissive: 0x0d9488, opacity: 0.10 }, // Teal
        ];

        for (let w = 0; w < 3; w++) {
            const geometry = new THREE.PlaneGeometry(100, 40, 100, 20);
            const material = new THREE.MeshBasicMaterial({
                color: waveColors[w].color,
                transparent: true,
                opacity: waveColors[w].opacity,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
                wireframe: false
            });

            const wave = new THREE.Mesh(geometry, material);
            wave.rotation.x = -Math.PI / 3;
            wave.position.y = -10 + w * 5;
            wave.position.z = -30 - w * 10;

            wave.userData = {
                originalPositions: geometry.attributes.position.array.slice(),
                speed: 0.3 + w * 0.1,
                amplitude: 3 - w * 0.5
            };

            this.auroraWaves.push(wave);
            this.scene.add(wave);
        }
    }

    createStarField() {
        // Elegant, subtle star field with depth
        const starCount = 2000;
        const positions = [];
        const sizes = [];
        const colors = [];

        for (let i = 0; i < starCount; i++) {
            // Distribute stars in a hemisphere in front of camera
            const radius = 50 + Math.random() * 100;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 0.6; // Concentrated toward center

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta) - 20;
            const z = -radius * Math.cos(phi);

            positions.push(x, y, z);

            // Vary star sizes - most small, few larger
            const size = Math.random() < 0.95 ? Math.random() * 0.3 + 0.1 : Math.random() * 0.8 + 0.5;
            sizes.push(size);

            // Subtle color variation - mostly white/light blue
            const brightness = 0.7 + Math.random() * 0.3;
            const blueShift = Math.random() * 0.1;
            colors.push(brightness, brightness + blueShift * 0.5, brightness + blueShift);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        this.starField = new THREE.Points(geometry, material);
        this.scene.add(this.starField);
    }

    createCentralOrb() {
        // Glowing central orb that pulses gently
        const geometry = new THREE.SphereGeometry(3, 64, 64);

        // Inner glow
        const innerMaterial = new THREE.MeshBasicMaterial({
            color: 0x0ea5e9,
            transparent: true,
            opacity: 0.6,
        });
        this.centralOrb = new THREE.Mesh(geometry, innerMaterial);
        this.centralOrb.position.set(0, 0, -20);
        this.scene.add(this.centralOrb);

        // Outer glow layers
        for (let i = 1; i <= 4; i++) {
            const glowGeometry = new THREE.SphereGeometry(3 + i * 1.5, 32, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0x0ea5e9,
                transparent: true,
                opacity: 0.15 / i,
                blending: THREE.AdditiveBlending,
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.copy(this.centralOrb.position);
            this.scene.add(glow);
        }

        // Light rays emanating from orb
        this.createLightRays();
    }

    createLightRays() {
        const rayCount = 12;
        this.lightRays = [];

        for (let i = 0; i < rayCount; i++) {
            const angle = (i / rayCount) * Math.PI * 2;
            const length = 15 + Math.random() * 10;

            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array([
                0, 0, 0,
                Math.cos(angle) * length, Math.sin(angle) * length * 0.3, 0
            ]);
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const material = new THREE.LineBasicMaterial({
                color: 0x0ea5e9,
                transparent: true,
                opacity: 0.2,
                blending: THREE.AdditiveBlending
            });

            const ray = new THREE.Line(geometry, material);
            ray.position.set(0, 0, -20);
            ray.userData = { baseOpacity: 0.1 + Math.random() * 0.15, phase: Math.random() * Math.PI * 2 };

            this.lightRays.push(ray);
            this.scene.add(ray);
        }
    }

    createParticleStreams() {
        // Elegant flowing particles that orbit around
        const streamCount = 3;
        this.particleStreams = [];

        const streamColors = [0x0ea5e9, 0x22d3ee, 0x14b8a6];

        for (let s = 0; s < streamCount; s++) {
            const particleCount = 150;
            const positions = [];
            const baseAngles = [];

            for (let i = 0; i < particleCount; i++) {
                const angle = (i / particleCount) * Math.PI * 2;
                const radius = 12 + s * 4 + Math.sin(angle * 3) * 2;
                const height = Math.sin(angle * 2) * 3;

                positions.push(
                    Math.cos(angle) * radius,
                    height,
                    Math.sin(angle) * radius - 20
                );
                baseAngles.push(angle);
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

            const material = new THREE.PointsMaterial({
                size: 0.4 - s * 0.1,
                color: streamColors[s],
                transparent: true,
                opacity: 0.7 - s * 0.15,
                blending: THREE.AdditiveBlending
            });

            const stream = new THREE.Points(geometry, material);
            stream.userData = {
                baseRadius: 12 + s * 4,
                speed: 0.2 - s * 0.03,
                baseAngles: baseAngles,
                verticalOffset: s
            };

            this.particleStreams.push(stream);
            this.scene.add(stream);
        }
    }

    addListeners() {
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
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
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.03;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.03;

        // === ANIMATE AURORA WAVES ===
        this.auroraWaves.forEach((wave, index) => {
            const positions = wave.geometry.attributes.position.array;
            const original = wave.userData.originalPositions;
            const speed = wave.userData.speed;
            const amplitude = wave.userData.amplitude;

            for (let i = 0; i < positions.length; i += 3) {
                const x = original[i];
                const y = original[i + 1];

                // Create flowing wave motion
                const waveOffset = Math.sin(x * 0.05 + time * speed) * amplitude;
                const secondaryWave = Math.sin(x * 0.02 - time * speed * 0.5) * amplitude * 0.5;

                positions[i + 2] = original[i + 2] + waveOffset + secondaryWave;
            }
            wave.geometry.attributes.position.needsUpdate = true;

            // Subtle horizontal drift
            wave.position.x = Math.sin(time * 0.1 + index) * 5;
        });

        // === ANIMATE STAR FIELD ===
        if (this.starField) {
            this.starField.rotation.y = time * 0.01;
            this.starField.rotation.x = Math.sin(time * 0.05) * 0.02;
        }

        // === ANIMATE CENTRAL ORB ===
        if (this.centralOrb) {
            // Gentle pulsing
            const pulse = 1 + Math.sin(time * 1.5) * 0.1;
            this.centralOrb.scale.set(pulse, pulse, pulse);

            // Subtle rotation
            this.centralOrb.rotation.y = time * 0.2;
        }

        // === ANIMATE LIGHT RAYS ===
        this.lightRays.forEach((ray, i) => {
            const phase = ray.userData.phase;
            ray.material.opacity = ray.userData.baseOpacity * (0.5 + Math.sin(time * 2 + phase) * 0.5);
            ray.rotation.z = time * 0.1;
        });

        // === ANIMATE PARTICLE STREAMS ===
        this.particleStreams.forEach((stream, index) => {
            const positions = stream.geometry.attributes.position.array;
            const baseRadius = stream.userData.baseRadius;
            const speed = stream.userData.speed;
            const baseAngles = stream.userData.baseAngles;

            for (let i = 0; i < positions.length / 3; i++) {
                const angle = baseAngles[i] + time * speed;
                const radiusVariation = Math.sin(angle * 3 + time) * 2;
                const radius = baseRadius + radiusVariation;

                positions[i * 3] = Math.cos(angle) * radius;
                positions[i * 3 + 1] = Math.sin(angle * 2 + time * 0.5) * 3;
                positions[i * 3 + 2] = Math.sin(angle) * radius - 20;
            }
            stream.geometry.attributes.position.needsUpdate = true;
        });

        // === CAMERA PARALLAX ===
        this.camera.position.x += (this.mouse.x * 5 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 3 - this.camera.position.y) * 0.02;
        this.camera.lookAt(0, 0, -20);

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MesmerizingCanvas('homepage-canvas');
});

export default MesmerizingCanvas;
