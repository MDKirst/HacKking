/**
 * Matrix Rain Effect
 * Cria o efeito de "chuva de caracteres" no fundo das páginas
 */

class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        this.ctx = this.canvas.ctx = this.canvas.getContext('2d');
        this.characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        this.animationId = null;
        
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        this.resizeCanvas();
        this.initializeDrops();
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        
        // Configurações do contexto
        this.ctx.fillStyle = '#000';
        this.ctx.font = `${this.fontSize}px 'Fira Code', 'Courier New', monospace`;
    }
    
    initializeDrops() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = {
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 3 + 1,
                char: this.getRandomCharacter(),
                opacity: Math.random() * 0.5 + 0.5
            };
        }
    }
    
    getRandomCharacter() {
        return this.characters.charAt(Math.floor(Math.random() * this.characters.length));
    }
    
    animate() {
        // Criar efeito de fade
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Desenhar caracteres
        for (let i = 0; i < this.drops.length; i++) {
            const drop = this.drops[i];
            
            // Cor do caractere com base na posição
            const intensity = Math.min(1, drop.opacity);
            const green = Math.floor(255 * intensity);
            this.ctx.fillStyle = `rgba(0, ${green}, 65, ${intensity})`;
            
            // Desenhar caractere
            this.ctx.fillText(drop.char, i * this.fontSize, drop.y);
            
            // Atualizar posição
            drop.y += drop.speed;
            
            // Reset quando sair da tela
            if (drop.y > this.canvas.height) {
                drop.y = -this.fontSize;
                drop.char = this.getRandomCharacter();
                drop.speed = Math.random() * 3 + 1;
                drop.opacity = Math.random() * 0.5 + 0.5;
            }
            
            // Ocasionalmente mudar o caractere
            if (Math.random() < 0.01) {
                drop.char = this.getRandomCharacter();
            }
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.initializeDrops();
        });
        
        // Pausar animação quando a aba não está visível
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                    this.animationId = null;
                }
            } else {
                if (!this.animationId) {
                    this.animate();
                }
            }
        });
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

/**
 * Glitch Text Effect
 * Adiciona efeito de glitch aos textos
 */
class GlitchEffect {
    constructor() {
        this.glitchElements = document.querySelectorAll('.glitch');
        this.init();
    }
    
    init() {
        this.glitchElements.forEach(element => {
            this.setupGlitch(element);
        });
    }
    
    setupGlitch(element) {
        const originalText = element.textContent;
        const dataText = element.getAttribute('data-text') || originalText;
        
        // Aplicar glitch aleatório
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% de chance
                this.applyGlitch(element, dataText);
                setTimeout(() => {
                    element.textContent = originalText;
                }, 100);
            }
        }, 2000);
    }
    
    applyGlitch(element, originalText) {
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        let glitchedText = '';
        
        for (let i = 0; i < originalText.length; i++) {
            if (Math.random() < 0.1) {
                glitchedText += glitchChars.charAt(Math.floor(Math.random() * glitchChars.length));
            } else {
                glitchedText += originalText.charAt(i);
            }
        }
        
        element.textContent = glitchedText;
    }
}

/**
 * Typing Animation
 * Efeito de digitação para textos
 */
class TypingAnimation {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.currentIndex = 0;
        this.isTyping = false;
    }
    
    start() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        this.element.textContent = '';
        this.currentIndex = 0;
        
        this.type();
    }
    
    type() {
        if (this.currentIndex < this.text.length) {
            this.element.textContent += this.text.charAt(this.currentIndex);
            this.currentIndex++;
            setTimeout(() => this.type(), this.speed);
        } else {
            this.isTyping = false;
        }
    }
    
    reset() {
        this.currentIndex = 0;
        this.isTyping = false;
        this.element.textContent = '';
    }
}

/**
 * Scan Lines Effect
 * Adiciona efeito de linhas de varredura
 */
class ScanLinesEffect {
    constructor() {
        this.init();
    }
    
    init() {
        // Adicionar classe scan-lines ao body se não existir
        if (!document.body.classList.contains('scan-lines')) {
            document.body.classList.add('scan-lines');
        }
    }
    
    toggle(enable = true) {
        if (enable) {
            document.body.classList.add('scan-lines');
        } else {
            document.body.classList.remove('scan-lines');
        }
    }
}

/**
 * Loading Animation
 * Controla animações de carregamento
 */
class LoadingAnimation {
    constructor() {
        this.overlay = document.getElementById('loading-overlay');
        this.progressBar = document.querySelector('.loading-progress');
        this.loadingText = document.querySelector('.loading-text');
        this.messages = [
            'Inicializando sistema...',
            'Verificando credenciais...',
            'Estabelecendo conexão segura...',
            'Carregando interface...',
            'Acesso liberado!'
        ];
        this.currentMessageIndex = 0;
    }
    
    show() {
        if (this.overlay) {
            this.overlay.classList.add('active');
            this.startMessageCycle();
        }
    }
    
    hide() {
        if (this.overlay) {
            setTimeout(() => {
                this.overlay.classList.remove('active');
            }, 500);
        }
    }
    
    startMessageCycle() {
        if (!this.loadingText) return;
        
        const interval = setInterval(() => {
            if (this.currentMessageIndex < this.messages.length) {
                this.loadingText.textContent = this.messages[this.currentMessageIndex];
                this.currentMessageIndex++;
            } else {
                clearInterval(interval);
                this.hide();
            }
        }, 800);
    }
    
    reset() {
        this.currentMessageIndex = 0;
    }
}

/**
 * Particle System
 * Sistema de partículas para efeitos especiais
 */
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 50;
    }
    
    createParticle(x, y) {
        return {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 1.0,
            decay: Math.random() * 0.02 + 0.01,
            size: Math.random() * 3 + 1,
            color: `hsl(${120 + Math.random() * 60}, 100%, 50%)`
        };
    }
    
    addParticles(x, y, count = 10) {
        for (let i = 0; i < count && this.particles.length < this.maxParticles; i++) {
            this.particles.push(this.createParticle(x, y));
        }
    }
    
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    render() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
}

// Inicialização global
let matrixRain;
let glitchEffect;
let scanLinesEffect;
let loadingAnimation;

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar efeitos
    if (document.getElementById('matrix-canvas')) {
        matrixRain = new MatrixRain();
    }
    
    glitchEffect = new GlitchEffect();
    scanLinesEffect = new ScanLinesEffect();
    loadingAnimation = new LoadingAnimation();
    
    // Mostrar loading na página inicial
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        loadingAnimation.show();
    }
});

// Cleanup ao sair da página
window.addEventListener('beforeunload', () => {
    if (matrixRain) {
        matrixRain.destroy();
    }
});

// Exportar classes para uso global
window.MatrixRain = MatrixRain;
window.GlitchEffect = GlitchEffect;
window.TypingAnimation = TypingAnimation;
window.ScanLinesEffect = ScanLinesEffect;
window.LoadingAnimation = LoadingAnimation;
window.ParticleSystem = ParticleSystem;

