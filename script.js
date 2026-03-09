/**
 * ========== COMPLETE JAVASCRIPT ==========
 * Author: Dhaval Rathod
 * Description: Portfolio website functionality
 * Version: 2.0 (Optimized)
 */

// Utility function for debouncing (performance optimization)
const debounce = (func, wait = 100) => {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MOBILE MENU TOGGLE =====
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update ARIA attribute
            hamburger.setAttribute('aria-expanded', isActive);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? 'hidden' : 'auto';
        });

        // Add touch support for mobile
        hamburger.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.click();
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            }
        });

        // Close menu on window resize (if open and screen becomes desktop)
        window.addEventListener('resize', debounce(function() {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            }
        }, 100));
    }

    // ===== SCROLL EFFECT FOR HEADER =====
    const header = document.getElementById('header');
    
    if (header) {
        const handleScroll = debounce(function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, 10);
        
        window.addEventListener('scroll', handleScroll);
    }

    // ===== TYPING ANIMATION =====
    const dynamicText = document.getElementById('dynamic-text');
    
    if (dynamicText) {
        const words = ['Web Designer', 'UI/UX Designer'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isWaiting = false;

        function typeEffect() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                // Deleting text
                dynamicText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                // Typing text
                dynamicText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            // If word is complete
            if (!isDeleting && charIndex === currentWord.length) {
                isWaiting = true;
                setTimeout(() => {
                    isDeleting = true;
                    isWaiting = false;
                }, 2000); // Wait 2 seconds before deleting
            }

            // If deletion is complete
            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }

            // Speed control
            const speed = isDeleting ? 100 : 150; // Deleting faster than typing
            const delay = isWaiting ? 2000 : speed;

            setTimeout(typeEffect, delay);
        }

        // Start typing animation after 1 second
        setTimeout(typeEffect, 1000);
    }

    // ===== ACTIVE LINK HIGHLIGHTING ON SCROLL =====
    const sections = document.querySelectorAll('section');
    
    if (sections.length > 0 && navLinks.length > 0) {
        const handleScrollHighlight = debounce(function() {
            let current = '';
            const scrollPosition = window.scrollY;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href').substring(1); // Remove # from href
                if (href === current && current !== '') {
                    link.classList.add('active');
                    
                    // Update aria-current for accessibility
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        }, 50);
        
        window.addEventListener('scroll', handleScrollHighlight);
    }

    // ===== SMOOTH SCROLL FOR NAVIGATION =====
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== MODAL FUNCTIONALITY =====
    const modals = document.querySelectorAll('.modal');
    const modalCloseBtns = document.querySelectorAll('.modal-close');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    const viewButtons = document.querySelectorAll('.portfolio-view-btn');

    // Function to open modal
    function openModal(modal) {
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Set focus to modal container for accessibility
            const modalContainer = modal.querySelector('.modal-container');
            if (modalContainer) {
                modalContainer.focus();
            }
        }
    }

    // Function to close modal
    function closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    }

    // Close all modals function
    function closeAllModals() {
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }

    // Open modal when view button is clicked
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetModal = document.querySelector(targetId);
            openModal(targetModal);
        });
    });

    // Close modal when close button is clicked
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevents page from scrolling to top
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal when overlay is clicked
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Prevent modal from closing when clicking inside modal container
    const modalContainers = document.querySelectorAll('.modal-container');
    modalContainers.forEach(container => {
        container.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    const animatedElements = [
        ...document.querySelectorAll('.service-card'),
        ...document.querySelectorAll('.experience-card')
    ];

    if (animatedElements.length > 0) {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Add loaded class for images if any
                    const images = entry.target.querySelectorAll('img');
                    images.forEach(img => {
                        img.classList.add('loaded');
                    });
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
            observer.observe(element);
        });
    }

    // ===== IMAGE LOAD HANDLING =====
    const portfolioImages = document.querySelectorAll('.portfolio-image');
    portfolioImages.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });

    // ===== SET ACTIVE LINK BASED ON URL (for deep linking) =====
    function setActiveLinkBasedOnURL() {
        const currentHash = window.location.hash || '#home';
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }
    
    setActiveLinkBasedOnURL();
    
    // Update active link when hash changes
    window.addEventListener('hashchange', setActiveLinkBasedOnURL);
});

// ========== ATTRACTIVE SCROLL TO TOP BUTTON ==========
document.addEventListener('DOMContentLoaded', function() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    const percentageSpan = document.getElementById('scrollPercentage');
    const progressCircle = document.querySelector('.btn-progress');
    
    if (!scrollBtn || !percentageSpan || !progressCircle) return;
    
    function updateScrollProgress() {
        const scroll = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        
        // Calculate percentage
        const percent = Math.min(100, Math.round((scroll / height) * 100));
        
        // Update percentage text with animation
        percentageSpan.textContent = percent + '%';
        
        // Update progress circle using conic-gradient
        const angle = (percent * 360) / 100;
        progressCircle.style.background = `conic-gradient(
            from 0deg,
            var(--pure-red) ${angle}deg,
            transparent ${angle}deg
        )`;
        
        // Show/hide button with smooth animation
        if (scroll > 200) {
            if (!scrollBtn.classList.contains('active')) {
                scrollBtn.classList.add('active');
                // Add bounce effect when appearing
                scrollBtn.style.animation = 'bounceIn 0.5s ease';
                setTimeout(() => {
                    scrollBtn.style.animation = '';
                }, 500);
            }
        } else {
            if (scrollBtn.classList.contains('active')) {
                scrollBtn.classList.remove('active');
                // Add fade out effect
                scrollBtn.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    scrollBtn.style.animation = '';
                }, 300);
            }
        }
    }
    
    // Add bounce animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounceIn {
            0% {
                opacity: 0;
                transform: scale(0.3) translateY(30px);
            }
            50% {
                opacity: 0.9;
                transform: scale(1.1) translateY(-5px);
            }
            80% {
                opacity: 1;
                transform: scale(0.95) translateY(2px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        @keyframes fadeOut {
            0% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
            100% {
                opacity: 0;
                transform: scale(0.5) translateY(30px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initial call
    updateScrollProgress();
    
    // Scroll event with throttling for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateScrollProgress();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Click to scroll top with smooth animation
    scrollBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Add click ripple effect
        const circle = this.querySelector('.btn-circle');
        circle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            circle.style.transform = '';
        }, 200);
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect enhancement
    scrollBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    scrollBtn.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

document.addEventListener('DOMContentLoaded', function() {
            const categoryBtns = document.querySelectorAll('.category-btn');
            const figmaCards = document.querySelectorAll('.figma-card');

            categoryBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Remove active class from all buttons
                    categoryBtns.forEach(b => b.classList.remove('active'));
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    const category = this.dataset.category;
                    
                    // Filter cards
                    figmaCards.forEach(card => {
                        if (category === 'all' || card.dataset.category === category) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });

        })