/**
 * HACKER SYSTEM - Easter Eggs & Advanced Interactivity
 * Sistema de easter eggs e funcionalidades especiais escondidas
 */

class EasterEggSystem {
    constructor() {
        this.sequences = {
            'hack': {
                keys: ['h', 'a', 'c', 'k'],
                description: 'Ativa modo hacker especial',
                action: () => this.activateHackerMode()
            },
            'matrix': {
                keys: ['m', 'a', 't', 'r', 'i', 'x'],
                description: 'Intensifica efeito Matrix',
                action: () => this.intensifyMatrix()
            },
            'neo': {
                keys: ['n', 'e', 'o'],
                description: 'Mensagem especial do Neo',
                action: () => this.showNeoMessage()
            },
            'admin': {
                keys: ['a', 'd', 'm', 'i', 'n'],
                description: 'Acesso ao painel de administrador',
                action: () => this.showAdminPanel()
            }
        };
        
        this.currentSequence = [];
        this.isActive = false;
        this.secretClicks = 0;
        this.konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        this.konamiIndex = 0;
        
        this.init();
    }
    
    init() {
        this.setupKeyboardListeners();
        this.setupClickListeners();
        this.setupSpecialTriggers();
        this.createSecretConsole();
    }
    
    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
            this.handleKonamiCode(e);
        });
        
        // Reset sequence após inatividade
        this.resetTimer = null;
        document.addEventListener('keydown', () => {
            clearTimeout(this.resetTimer);
            this.resetTimer = setTimeout(() => {
                this.currentSequence = [];
            }, 3000);
        });
    }
    
    handleKeyPress(e) {
        const key = e.key.toLowerCase();
        this.currentSequence.push(key);
        
        // Manter apenas os últimos 10 caracteres
        if (this.currentSequence.length > 10) {
            this.currentSequence.shift();
        }
        
        // Verificar todas as sequências
        Object.entries(this.sequences).forEach(([name, sequence]) => {
            if (this.matchesSequence(sequence.keys)) {
                this.triggerEasterEgg(name, sequence);
                this.currentSequence = [];
            }
        });
    }
    
    handleKonamiCode(e) {
        if (e.code === this.konami[this.konamiIndex]) {
            this.konamiIndex++;
            if (this.konamiIndex === this.konami.length) {
                this.triggerKonamiCode();
                this.konamiIndex = 0;
            }
        } else {
            this.konamiIndex = 0;
        }
    }
    
    matchesSequence(targetSequence) {
        if (this.currentSequence.length < targetSequence.length) return false;
        
        const recent = this.currentSequence.slice(-targetSequence.length);
        return recent.join('') === targetSequence.join('');
    }
    
    setupClickListeners() {
        // Triple click em elementos específicos
        const secretElements = document.querySelectorAll('.brand-icon, .user-avatar, .terminal-title');
        
        secretElements.forEach(element => {
            let clickCount = 0;
            let clickTimer = null;
            
            element.addEventListener('click', () => {
                clickCount++;
                
                if (clickCount === 1) {
                    clickTimer = setTimeout(() => {
                        clickCount = 0;
                    }, 500);
                } else if (clickCount === 3) {
                    clearTimeout(clickTimer);
                    clickCount = 0;
                    this.triggerSecretClick(element);
                }
            });
        });
    }
    
    setupSpecialTriggers() {
        // Trigger por tempo (após 5 minutos na página)
        setTimeout(() => {
            this.showTimeBasedEasterEgg();
        }, 300000); // 5 minutos
        
        // Trigger por inatividade
        let inactivityTimer;
        const resetInactivity = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                this.showInactivityEasterEgg();
            }, 120000); // 2 minutos
        };
        
        document.addEventListener('mousemove', resetInactivity);
        document.addEventListener('keypress', resetInactivity);
        resetInactivity();
    }
    
    createSecretConsole() {
        // Console secreto acessível via F12 ou Ctrl+Shift+I
        window.hackerConsole = {
            help: () => {
                console.log('%c🔐 HACKER CONSOLE - Comandos Disponíveis:', 'color: #00ff41; font-size: 16px; font-weight: bold;');
                console.log('%c• hackerConsole.unlock() - Desbloquear todos os easter eggs', 'color: #00ff41;');
                console.log('%c• hackerConsole.matrix() - Controlar efeito Matrix', 'color: #00ff41;');
                console.log('%c• hackerConsole.glitch() - Ativar efeitos de glitch', 'color: #00ff41;');
                console.log('%c• hackerConsole.stats() - Mostrar estatísticas do sistema', 'color: #00ff41;');
                console.log('%c• hackerConsole.reset() - Resetar todos os efeitos', 'color: #00ff41;');
            },
            unlock: () => {
                this.unlockAllEasterEggs();
                console.log('%c🎉 Todos os easter eggs foram desbloqueados!', 'color: #00ff41; font-size: 14px;');
            },
            matrix: (intensity = 1) => {
                this.controlMatrix(intensity);
                console.log(`%c🌧️ Efeito Matrix ajustado para intensidade ${intensity}`, 'color: #00ff41;');
            },
            glitch: (enable = true) => {
                this.toggleGlitchEffects(enable);
                console.log(`%c⚡ Efeitos de glitch ${enable ? 'ativados' : 'desativados'}`, 'color: #00ff41;');
            },
            stats: () => {
                this.showSystemStats();
            },
            reset: () => {
                this.resetAllEffects();
                console.log('%c🔄 Todos os efeitos foram resetados', 'color: #00ff41;');
            }
        };
        
        // Mostrar mensagem de boas-vindas no console
        setTimeout(() => {
            console.log('%c🚀 HACKER SYSTEM CONSOLE ATIVO', 'color: #00ff41; font-size: 20px; font-weight: bold;');
            console.log('%c Digite hackerConsole.help() para ver os comandos disponíveis', 'color: #39ff14; font-size: 12px;');
        }, 1000);
    }
    
    // ===== EASTER EGGS ESPECÍFICOS =====
    
    activateHackerMode() {
        this.showEasterEggModal('🔓 MODO HACKER ATIVADO!', 
            'Você desbloqueou o modo hacker especial! Agora você tem acesso a funcionalidades avançadas do sistema.');
        
        // Adicionar classe especial ao body
        document.body.classList.add('hacker-mode');
        
        // Intensificar efeitos visuais
        this.intensifyVisualEffects();
        
        // Adicionar comandos especiais ao terminal
        this.addSpecialCommands();
        
        // Mostrar notificação no terminal
        this.addTerminalMessage('MODO HACKER ATIVADO - Novos comandos disponíveis: hack-scan, decrypt, trace');
    }
    
    intensifyMatrix() {
        if (window.matrixRain) {
            // Aumentar velocidade e densidade do Matrix
            window.matrixRain.fontSize = 10;
            window.matrixRain.resizeCanvas();
            window.matrixRain.initializeDrops();
            
            // Adicionar mais colunas
            for (let i = 0; i < 50; i++) {
                window.matrixRain.drops.push({
                    y: Math.random() * window.matrixRain.canvas.height,
                    speed: Math.random() * 5 + 2,
                    char: window.matrixRain.getRandomCharacter(),
                    opacity: Math.random() * 0.8 + 0.2
                });
            }
        }
        
        this.showEasterEggModal('🌧️ MATRIX INTENSIFICADO!', 
            'O efeito Matrix foi intensificado! A realidade está se dissolvendo...');
    }
    
    showNeoMessage() {
        const messages = [
            'Bem-vindo à Matrix, Neo.',
            'Não há colher.',
            'Siga o coelho branco.',
            'A pílula vermelha ou a azul?',
            'Você é O Escolhido.',
            'Livre sua mente.'
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        this.showEasterEggModal('👤 MENSAGEM DO NEO', randomMessage);
        
        // Efeito especial de glitch na tela
        this.createGlitchEffect();
    }
    
    showAdminPanel() {
        this.showEasterEggModal('⚙️ PAINEL DE ADMINISTRADOR', 
            'Acesso ao painel de administrador desbloqueado! Você agora pode controlar todos os aspectos do sistema.');
        
        // Adicionar botões de admin ao dashboard
        this.addAdminControls();
    }
    
    triggerKonamiCode() {
        this.showEasterEggModal('🎮 CÓDIGO KONAMI ATIVADO!', 
            'Parabéns! Você descobriu o código Konami clássico. Todos os easter eggs foram desbloqueados!');
        
        this.unlockAllEasterEggs();
        this.createFireworks();
    }
    
    triggerSecretClick(element) {
        const messages = {
            'brand-icon': 'Você descobriu o segredo do ícone! ⚡',
            'user-avatar': 'Avatar secreto desbloqueado! 👤',
            'terminal-title': 'Terminal hackeado com sucesso! 💻'
        };
        
        const elementClass = element.className.split(' ')[0];
        const message = messages[elementClass] || 'Segredo descoberto!';
        
        this.showEasterEggModal('🔍 CLIQUE SECRETO!', message);
        
        // Adicionar efeito visual no elemento
        this.addClickEffect(element);
    }
    
    showTimeBasedEasterEgg() {
        this.showEasterEggModal('⏰ EASTER EGG TEMPORAL!', 
            'Você permaneceu no sistema por 5 minutos! Sua dedicação foi recompensada com acesso a funcionalidades especiais.');
        
        this.addTimeBasedFeatures();
    }
    
    showInactivityEasterEgg() {
        this.showEasterEggModal('😴 SISTEMA EM STANDBY', 
            'Detectamos inatividade. O sistema entrou em modo de economia de energia. Pressione qualquer tecla para reativar.');
        
        this.activateStandbyMode();
    }
    
    // ===== EFEITOS VISUAIS ESPECIAIS =====
    
    intensifyVisualEffects() {
        // Adicionar scan lines mais intensas
        const style = document.createElement('style');
        style.textContent = `
            .hacker-mode .scan-lines::before {
                background: linear-gradient(
                    transparent 50%, 
                    rgba(0, 255, 65, 0.1) 50%
                );
                animation: scanlines 0.05s linear infinite;
            }
            
            .hacker-mode .glitch {
                animation: glitch-intense 0.3s infinite;
            }
            
            @keyframes glitch-intense {
                0%, 10%, 11%, 20%, 21%, 30%, 31%, 40%, 41%, 50%, 51%, 60%, 61%, 70%, 71%, 80%, 81%, 90%, 91%, 100% {
                    transform: translate(0);
                }
                10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90% {
                    transform: translate(-2px, 1px);
                }
                11%, 21%, 31%, 41%, 51%, 61%, 71%, 81%, 91% {
                    transform: translate(2px, -1px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    createGlitchEffect() {
        const glitchOverlay = document.createElement('div');
        glitchOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,0,64,0.1), transparent);
            z-index: 9999;
            pointer-events: none;
            animation: glitchSweep 0.5s ease-out;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glitchSweep {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(glitchOverlay);
        
        setTimeout(() => {
            document.body.removeChild(glitchOverlay);
            document.head.removeChild(style);
        }, 500);
    }
    
    createFireworks() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            pointer-events: none;
        `;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const particles = [];
        
        // Criar partículas de fogos de artifício
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`
            });
        }
        
        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((particle, index) => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.life -= 0.02;
                
                if (particle.life <= 0) {
                    particles.splice(index, 1);
                    return;
                }
                
                ctx.save();
                ctx.globalAlpha = particle.life;
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
            
            if (particles.length > 0) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(canvas);
            }
        };
        
        animate();
    }
    
    addClickEffect(element) {
        const rect = element.getBoundingClientRect();
        const effect = document.createElement('div');
        
        effect.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + rect.height/2}px;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, #00ff41, transparent);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            pointer-events: none;
            animation: clickRipple 0.6s ease-out forwards;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes clickRipple {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(10); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            document.body.removeChild(effect);
            document.head.removeChild(style);
        }, 600);
    }
    
    // ===== FUNCIONALIDADES ESPECIAIS =====
    
    addSpecialCommands() {
        if (window.pageController) {
            const originalCommands = CONFIG.TERMINAL_COMMANDS;
            CONFIG.TERMINAL_COMMANDS = {
                ...originalCommands,
                'hack-scan': 'Iniciando scan avançado...\n[████████████████████] 100%\n12 vulnerabilidades encontradas\n3 backdoors detectados',
                'decrypt': 'Descriptografando arquivos...\nChave encontrada: 0x7F4A9B2C\nArquivos desbloqueados: 47',
                'trace': 'Rastreando conexões...\nIP origem: 192.168.1.100\nDestino: 10.0.0.1\nRota: 7 hops',
                'ghost': 'Modo fantasma ativado\nVocê está invisível na rede',
                'phoenix': 'Protocolo Phoenix iniciado\nSistema será reinicializado em modo seguro'
            };
        }
    }
    
    addAdminControls() {
        const dashboard = document.getElementById('dashboard-section');
        if (dashboard) {
            const adminPanel = document.createElement('div');
            adminPanel.className = 'dashboard-card admin-panel';
            adminPanel.innerHTML = `
                <div class="card-header">
                    <h3>PAINEL DE ADMINISTRADOR</h3>
                    <div class="card-icon">⚙️</div>
                </div>
                <div class="card-content">
                    <button class="action-button" onclick="easterEggSystem.toggleMatrix()">
                        <span class="action-icon">🌧️</span>
                        <span>Toggle Matrix</span>
                    </button>
                    <button class="action-button" onclick="easterEggSystem.systemReboot()">
                        <span class="action-icon">🔄</span>
                        <span>Reboot System</span>
                    </button>
                    <button class="action-button" onclick="easterEggSystem.emergencyMode()">
                        <span class="action-icon">🚨</span>
                        <span>Emergency Mode</span>
                    </button>
                </div>
            `;
            
            const grid = dashboard.querySelector('.dashboard-grid');
            if (grid) {
                grid.appendChild(adminPanel);
            }
        }
    }
    
    addTimeBasedFeatures() {
        // Adicionar estatísticas de tempo
        const timeStats = document.createElement('div');
        timeStats.className = 'time-stats';
        timeStats.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">Tempo Online:</span>
                <span class="stat-value" id="onlineTime">5:00</span>
            </div>
        `;
        
        const statsCard = document.querySelector('.stats-card .card-content');
        if (statsCard) {
            statsCard.appendChild(timeStats);
        }
        
        // Iniciar contador de tempo
        this.startTimeCounter();
    }
    
    startTimeCounter() {
        let seconds = 300; // 5 minutos já passados
        const timeElement = document.getElementById('onlineTime');
        
        setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            if (timeElement) {
                timeElement.textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }
    
    activateStandbyMode() {
        document.body.classList.add('standby-mode');
        
        const style = document.createElement('style');
        style.textContent = `
            .standby-mode {
                filter: brightness(0.3);
                transition: filter 0.5s ease;
            }
            
            .standby-mode #matrix-canvas {
                opacity: 0.1;
            }
        `;
        document.head.appendChild(style);
        
        // Remover modo standby com qualquer interação
        const removeStandby = () => {
            document.body.classList.remove('standby-mode');
            document.removeEventListener('keydown', removeStandby);
            document.removeEventListener('mousemove', removeStandby);
        };
        
        document.addEventListener('keydown', removeStandby);
        document.addEventListener('mousemove', removeStandby);
    }
    
    // ===== CONTROLES DO CONSOLE =====
    
    unlockAllEasterEggs() {
        this.activateHackerMode();
        this.addAdminControls();
        this.addSpecialCommands();
        this.addTimeBasedFeatures();
    }
    
    controlMatrix(intensity) {
        if (window.matrixRain) {
            window.matrixRain.fontSize = Math.max(8, 16 - intensity * 2);
            window.matrixRain.resizeCanvas();
            window.matrixRain.initializeDrops();
        }
    }
    
    toggleGlitchEffects(enable) {
        const glitchElements = document.querySelectorAll('.glitch');
        glitchElements.forEach(element => {
            if (enable) {
                element.style.animation = 'glitch-1 0.3s infinite, glitch-2 0.3s infinite';
            } else {
                element.style.animation = '';
            }
        });
    }
    
    showSystemStats() {
        console.group('%c📊 ESTATÍSTICAS DO SISTEMA', 'color: #00ff41; font-size: 16px; font-weight: bold;');
        console.log('%c• Easter Eggs Descobertos:', 'color: #39ff14;', Object.keys(this.sequences).length);
        console.log('%c• Modo Hacker:', 'color: #39ff14;', document.body.classList.contains('hacker-mode') ? 'ATIVO' : 'INATIVO');
        console.log('%c• Usuário Atual:', 'color: #39ff14;', window.pageController?.authSystem?.getCurrentUser()?.username || 'Não logado');
        console.log('%c• Tempo de Sessão:', 'color: #39ff14;', document.getElementById('onlineTime')?.textContent || 'N/A');
        console.groupEnd();
    }
    
    resetAllEffects() {
        document.body.className = document.body.className.replace(/hacker-mode|standby-mode/g, '').trim();
        
        // Remover painéis adicionais
        const adminPanel = document.querySelector('.admin-panel');
        if (adminPanel) adminPanel.remove();
        
        // Resetar comandos do terminal
        if (window.pageController) {
            CONFIG.TERMINAL_COMMANDS = {
                'help': 'Comandos disponíveis: help, whoami, ls, clear, hack, matrix, status',
                'whoami': 'hacker_user',
                'ls': 'dashboard.html  login.html  register.html  scripts/  styles/',
                'clear': 'CLEAR',
                'hack': 'Iniciando sequência de hack...\n[████████████████████] 100%\nAcesso liberado!',
                'matrix': 'Bem-vindo à Matrix, Neo.',
                'status': 'Sistema: ONLINE\nSegurança: ATIVA\nConexão: ESTÁVEL'
            };
        }
    }
    
    // ===== MÉTODOS AUXILIARES =====
    
    showEasterEggModal(title, message) {
        const modal = document.getElementById('easterEggModal');
        const titleElement = modal?.querySelector('.modal-header h2');
        const messageElement = document.getElementById('easterEggMessage');
        
        if (modal && titleElement && messageElement) {
            titleElement.textContent = title;
            messageElement.textContent = message;
            modal.classList.add('active');
        }
    }
    
    addTerminalMessage(message) {
        const terminalOutput = document.getElementById('terminalOutput');
        if (terminalOutput) {
            const messageLine = document.createElement('div');
            messageLine.className = 'terminal-line output';
            messageLine.style.color = '#00ff41';
            messageLine.textContent = `[SYSTEM] ${message}`;
            terminalOutput.appendChild(messageLine);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    }
    
    // Métodos para controles de admin
    toggleMatrix() {
        const canvas = document.getElementById('matrix-canvas');
        if (canvas) {
            canvas.style.opacity = canvas.style.opacity === '0' ? '0.3' : '0';
        }
    }
    
    systemReboot() {
        this.showEasterEggModal('🔄 REINICIALIZANDO SISTEMA', 'Sistema será reinicializado em 3 segundos...');
        
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }
    
    emergencyMode() {
        document.body.style.filter = 'hue-rotate(180deg) saturate(2)';
        this.showEasterEggModal('🚨 MODO DE EMERGÊNCIA', 'Modo de emergência ativado! Todos os sistemas em alerta máximo.');
        
        setTimeout(() => {
            document.body.style.filter = '';
        }, 5000);
    }
}

// Função global para fechar modal de easter egg
function closeEasterEgg() {
    const modal = document.getElementById('easterEggModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Inicialização
let easterEggSystem;

document.addEventListener('DOMContentLoaded', () => {
    easterEggSystem = new EasterEggSystem();
    window.easterEggSystem = easterEggSystem;
});

// Atualizar função global do main.js
function triggerEasterEgg() {
    if (easterEggSystem) {
        easterEggSystem.activateHackerMode();
    }
}

