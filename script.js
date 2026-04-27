document.addEventListener('DOMContentLoaded', () => {
    // Simulated Authentication Redirects
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }

    // Dashboard Interactivity
    const activeCallsEl = document.getElementById('active-calls-count');
    if (activeCallsEl) {
        let count = 12;
        setInterval(() => {
            // Randomly fluctuate count between 8 and 18
            const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            count = Math.max(8, Math.min(18, count + change));
            activeCallsEl.innerText = count;
        }, 3000);
    }

    // Simple Chart Animation (Visual only)
    const bars = document.querySelectorAll('.chart-bar');
    if (bars.length > 0) {
        setTimeout(() => {
            bars.forEach(bar => {
                const targetHeight = bar.getAttribute('data-height');
                bar.style.height = targetHeight + '%';
            });
        }, 500);
    }
});
