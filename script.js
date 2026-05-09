document.addEventListener('DOMContentLoaded', () => {
    
    // Custom Cursor
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    window.addEventListener('mousemove', function(e) {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Smooth follow for outline
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effect for links/buttons to grow cursor
    const interactables = document.querySelectorAll('a, button, .timeline-content, .contact-card, .skill-item');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(6, 182, 212, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        if (navLinks.style.display === 'flex') {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = '#0B0E14';
            navLinks.style.padding = '2rem';
            navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
        }
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counter animation if it's a stat number
                if (entry.target.classList.contains('stat-number')) {
                    animateValue(entry.target);
                }
                
                // Trigger progress bar animation
                if (entry.target.classList.contains('progress')) {
                   // Logic usually handled by CSS width transition if base width is 0
                   // Resetting width to allow transition
                   const targetWidth = entry.target.style.width;
                   entry.target.style.width = '0%';
                   setTimeout(() => {
                       entry.target.style.width = targetWidth;
                   }, 100);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.section-header, .about-text, .stat-card, .skill-category, .timeline-item, .contact-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });
    
    // Add visible class styling dynamically
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);


    // Number Counter Animation
    function animateValue(obj) {
        const target = parseInt(obj.getAttribute('data-target'));
        const duration = 2000;
        let startTimestamp = null;
        
        // Extract suffix (e.g., "+" or "%")
        const suffix = obj.innerText.replace(/[0-9]/g, '');
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Ease out quart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            
            obj.innerHTML = Math.floor(easeProgress * target) + suffix;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        
        window.requestAnimationFrame(step);
    }
    
    document.querySelectorAll('.stat-number').forEach(el => {
        observer.observe(el); 
        // Note: Logic above handles unobserve so we duplicate observation logic slightly or rely on the class add logic
        // Actually, the generic observer adds 'visible' class. 
        // We added specific check inside the generic observer for 'stat-number' to trigger animateValue. 
        // So this separate observation is not strictly needed if the generic one covers it.
        // However, stat-number is inside stat-card which IS observed.
        // Let's make sure stat-number itself isn't hidden with opacity 0 if we want it to animate text only.
        // The parent stat-card has opacity 0. When it reveals, the numbers will be visible. 
        // We might want to trigger the count animation slightly after the card appears.
    });

    // Typing effect for "Graphic & UI/UX Designer" if we wanted it, 
    // but we have CSS animation for the name highlight. 
});
