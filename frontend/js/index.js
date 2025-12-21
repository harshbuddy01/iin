// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastY = 0;

window.addEventListener('scroll', () => {
    const y = window.pageYOffset;
    if (Math.abs(y - lastY) > 20) {
        navbar.classList.toggle('scrolled', y > 50);
        lastY = y;
    }
}, { passive: true });

// Smooth scroll for indicators
document.querySelectorAll('.scroll-indicator, .section-scroll-indicator').forEach(indicator => {
    indicator.addEventListener('click', () => {
        const currentSection = indicator.closest('section, .institute-section');
        const nextSection = currentSection.nextElementSibling;
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Intersection Observer for pendulum animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

const pendulumObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('active')) {
            // Add active class to trigger any drop animations
            entry.target.classList.add('active');
            
            // Start swinging animation sequentially
            const pendulums = entry.target.querySelectorAll('.pendulum');
            pendulums.forEach((pendulum, index) => {
                setTimeout(() => {
                    pendulum.classList.add('swinging');
                }, 800 + (index * 100)); // Delay for natural feel
            });
        }
    });
}, observerOptions);

// Observe all pendulum containers
document.querySelectorAll('.pendulum-container').forEach(container => {
    pendulumObserver.observe(container);
});