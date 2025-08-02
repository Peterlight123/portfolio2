// script.js - Handles various interactive elements on the main page.

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for internal links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Animate elements on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Add a class to a card to trigger a fade-in animation
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        observer.observe(card);
    });
    
    // Add a class to a heading to trigger a fade-in animation
    const headings = document.querySelectorAll('h2');
    headings.forEach(heading => {
        observer.observe(heading);
    });
});
