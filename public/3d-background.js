// Cosmic 3D Background with Rotating Code Symbol Sphere
let scene, camera, renderer, particles, symbolsGroup;

function init3D() {
    const container = document.getElementById('canvas-container');
    if (!container) return;
    
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 60;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize performance
    container.appendChild(renderer.domElement);

    // Stars / Nebula Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i+=3) {
        // Spread particles far out
        posArray[i] = (Math.random() - 0.5) * 300;
        posArray[i+1] = (Math.random() - 0.5) * 300;
        posArray[i+2] = (Math.random() - 0.5) * 300;
        
        // Colors: mix of neon cyan and purple plasma
        let isCyan = Math.random() > 0.5;
        colorsArray[i] = isCyan ? 0.0 : 0.69; // R
        colorsArray[i+1] = isCyan ? 0.95 : 0.15; // G
        colorsArray[i+2] = 1.0; // B
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.6,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // 3D Rotating Code Symbol Sphere
    symbolsGroup = new THREE.Group();
    scene.add(symbolsGroup);

    const symbols = ['{', '}', '<', '>', '/', '#', 'include', 'vector<int>', 'O(N)', 'DP', 'node', 'BFS', 'DFS', 'struct', 'class', 'O(log N)', '=>'];
    const sphereRadius = 30;
    const itemsCount = 120;

    for (let i = 0; i < itemsCount; i++) {
        const text = symbols[Math.floor(Math.random() * symbols.length)];
        // Mix colors for texts
        const isCyan = Math.random() > 0.5;
        const color = isCyan ? '#00f3ff' : '#b026ff';
        const sprite = createTextSprite(text, color);
        
        // Fibonacci sphere distribution for even spread
        const phi = Math.acos(-1 + (2 * i) / itemsCount);
        const theta = Math.sqrt(itemsCount * Math.PI) * phi;

        sprite.position.x = sphereRadius * Math.cos(theta) * Math.sin(phi);
        sprite.position.y = sphereRadius * Math.sin(theta) * Math.sin(phi);
        sprite.position.z = sphereRadius * Math.cos(phi);

        // Add some random offset
        sprite.position.x += (Math.random() - 0.5) * 5;
        sprite.position.y += (Math.random() - 0.5) * 5;
        sprite.position.z += (Math.random() - 0.5) * 5;

        symbolsGroup.add(sprite);
    }

    // Positioning the sphere slightly to the right to balance the Hero text
    symbolsGroup.position.x = 20;

    // Interactions
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);

    animate();
}

function createTextSprite(message, color) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 256;
    
    ctx.font = 'Bold 50px "Fira Code", monospace';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add glow
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    // Draw again for stronger core
    ctx.shadowBlur = 0;
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture, 
        transparent: true, 
        blending: THREE.AdditiveBlending,
        opacity: Math.random() * 0.5 + 0.3 // Random opacity for depth
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(15, 7.5, 1);
    
    return sprite;
}

let mouseX = 0;
let mouseY = 0;

function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Slowly rotate background particles
    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.0001;

    // Rotate Code Sphere
    symbolsGroup.rotation.y += 0.002;
    symbolsGroup.rotation.z += 0.001;

    // Interactive Camera movement (parallax)
    camera.position.x += (mouseX * 30 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 30 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3D);
} else {
    init3D();
}
