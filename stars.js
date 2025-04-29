// Initialize canvas and context
const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

// Add mouse position tracking
let mouseX = width / 2;
let mouseY = height / 2;
let mouseRadius = 150; // Area of influence

canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Handle resize
window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

// Starfield setup
const STAR_COUNT = 5000;
const stars = [];
for (let i = 0; i < STAR_COUNT; i++) {
    const x = (Math.random() - 0.5) * width;
    const y = (Math.random() - 0.5) * height;
    const z = Math.random() * width;
    stars.push({
        originalX: x,
        originalY: y,
        originalZ: z,
        x: x,
        y: y,
        z: z,
        o: 0.2 + Math.random() * 0.5
    });
}

function drawStars() {
    ctx.clearRect(0, 0, width, height);
    for (let star of stars) {
        // Calculate distance from mouse
        const dx = star.x - mouseX;
        const dy = star.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If star is within mouse radius, push it away
        if (distance < mouseRadius) {
            const force = (mouseRadius - distance) / mouseRadius;
            star.x += dx * force * 0.1;
            star.y += dy * force * 0.1;
        }

        // Return to original position gradually
        star.x += (star.originalX - star.x) * 0.05;
        star.y += (star.originalY - star.y) * 0.05;
        star.z += (star.originalZ - star.z) * 0.05;

        // Move star
        star.originalZ -= 1;
        star.z = star.originalZ;
        if (star.originalZ <= 0) {
            star.originalX = (Math.random() - 0.5) * width;
            star.originalY = (Math.random() - 0.5) * height;
            star.originalZ = width;
            star.x = star.originalX;
            star.y = star.originalY;
            star.z = star.originalZ;
        }

        // Project 3D to 2D
        const k = 128.0 / star.z;
        const sx = star.x * k + width / 2;
        const sy = star.y * k + height / 2;
        if (sx < 0 || sx >= width || sy < 0 || sy >= height) continue;
        const radius = (1 - star.z / width) * 2;
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255,255,255,${star.o})`;
        ctx.fill();
    }
}

function animate() {
    drawStars();
    requestAnimationFrame(animate);
}

// Start the animation
animate();