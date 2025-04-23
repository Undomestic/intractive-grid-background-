
    class InteractiveBackground {
        constructor() {
            this.background = document.querySelector('.interactive-background');
            this.isMobile = 'ontouchstart' in window;
            this.boxSize = this.calculateBoxSize();
            this.maxDistance = this.calculateMaxDistance();
            this.isAnimating = false;
            
            this.init();
            this.setupEventListeners();
        }

        calculateBoxSize() {
            const width = window.innerWidth;
            if (width < 768) return 30; // Mobile
            if (width < 1024) return 40; // Tablet
            return 50; // Desktop
        }

        calculateMaxDistance() {
            const width = window.innerWidth;
            if (width < 768) return 100;
            if (width < 1024) return 150;
            return 200;
        }

        init() {
            this.createBoxes();
            this.setupContainer();
        }

        createBoxes() {
            const rows = Math.ceil(window.innerHeight / this.boxSize);
            const cols = Math.ceil(window.innerWidth / this.boxSize);
            this.background.innerHTML = '';
            this.background.style.gridTemplateColumns = `repeat(${cols}, ${this.boxSize}px)`;
            this.background.style.gridTemplateRows = `repeat(${rows}, ${this.boxSize}px)`;

            for (let i = 0; i < rows * cols; i++) {
                const box = document.createElement('div');
                box.className = 'bg-box';
                this.background.appendChild(box);
            }
        }

        setupContainer() {
            const container = document.querySelector('.container');
            if (window.innerWidth < 768) {
                container.style.flexDirection = 'column';
                container.style.padding = '20px';
            } else {
                container.style.flexDirection = 'row';
                container.style.padding = '40px';
            }
        }

        handleInteraction(x, y) {
            if (this.isAnimating) return;
            this.isAnimating = true;

            const boxes = document.querySelectorAll('.bg-box');
            boxes.forEach(box => {
                const rect = box.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const deltaX = x - centerX;
                const deltaY = y - centerY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                if (distance < this.maxDistance) {
                    const angle = Math.atan2(deltaY, deltaX);
                    const scale = 1 + (1 - distance / this.maxDistance) * 0.3;
                    const opacity = 0.1 + (1 - distance / this.maxDistance) * 0.3;

                    box.style.transform = `scale(${scale}) rotate(${angle * 20}deg)`;
                    box.style.opacity = opacity;
                    box.style.backgroundColor = `rgba(29, 78, 216, ${opacity * 0.5})`;
                } else {
                    box.style.transform = 'scale(1) rotate(0deg)';
                    box.style.opacity = '0.1';
                    box.style.backgroundColor = '#e5e7eb';
                }
            });

            requestAnimationFrame(() => {
                this.isAnimating = false;
            });
        }

        setupEventListeners() {
            if (this.isMobile) {
                document.addEventListener('touchmove', (e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    this.handleInteraction(touch.clientX, touch.clientY);
                }, { passive: false });

                document.addEventListener('touchstart', (e) => {
                    const touch = e.touches[0];
                    this.handleInteraction(touch.clientX, touch.clientY);
                });
            } else {
                document.addEventListener('mousemove', (e) => {
                    this.handleInteraction(e.clientX, e.clientY);
                });
            }

            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this.boxSize = this.calculateBoxSize();
                    this.maxDistance = this.calculateMaxDistance();
                    this.init();
                }, 250);
            });

            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    this.boxSize = this.calculateBoxSize();
                    this.maxDistance = this.calculateMaxDistance();
                    this.init();
                }, 300);
            });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        new InteractiveBackground();
    });
