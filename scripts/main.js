/**
 * HACKER SYSTEM - Main JavaScript
 * Sistema principal de funcionalidades
 */

// ===== CONFIGURAÇÕES GLOBAIS =====
const CONFIG = {
    TYPING_SPEED: 50,
    ANIMATION_DURATION: 300,
    VALIDATION_DELAY: 500,
    EASTER_EGG_SEQUENCE: ['h', 'a', 'c', 'k'],
    TERMINAL_COMMANDS: {
        'help': 'Comandos disponíveis: help, whoami, ls, clear, hack, matrix, status',
        'whoami': 'hacker_user',
        'ls': 'dashboard.html  login.html  register.html  scripts/  styles/',
        'clear': 'CLEAR',
        'hack': 'Iniciando sequência de hack...\n[████████████████████] 100%\nAcesso liberado!',
        'matrix': 'Bem-vindo à Matrix, Neo.',
        'status': 'Sistema: ONLINE\nSegurança: ATIVA\nConexão: ESTÁVEL'
    }
};

// ===== ESTADO GLOBAL =====
let currentUser = null;
let easterEggSequence = [];
let terminalHistory = [];
let systemStats = {
    cpu: 67,
    ram: 43,
    network: 89
};

// ===== UTILITÁRIOS =====
class Utils {
    static formatTime() {
        const now = new Date();
        return now.toLocaleTimeString('pt-BR', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    static formatDate() {
        const now = new Date();
        return now.toLocaleDateString('pt-BR');
    }
    
    static generateRandomString(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    static showMessage(element, message, type = 'info', duration = 3000) {
        if (!element) return;
        
        element.textContent = message;
        element.className = `form-message ${type}`;
        
        if (duration > 0) {
            setTimeout(() => {
                element.textContent = '';
                element.className = 'form-message';
            }, duration);
        }
    }
    
    static simulateDelay(min = 1000, max = 2000) {
        return new Promise(resolve => {
            const delay = Math.random() * (max - min) + min;
            setTimeout(resolve, delay);
        });
    }
}

// ===== VALIDAÇÃO DE FORMULÁRIOS =====
class FormValidator {
    constructor() {
        this.rules = {
            username: {
                required: true,
                minLength: 3,
                maxLength: 20,
                pattern: /^[a-zA-Z0-9_]+$/,
                message: 'Usuário deve ter 3-20 caracteres (letras, números e underscore)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Digite um e-mail válido'
            },
            password: {
                required: true,
                minLength: 8,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: 'Senha deve ter 8+ caracteres, incluindo maiúscula, minúscula, número e símbolo'
            }
        };
    }
    
    validateField(fieldName, value) {
        const rule = this.rules[fieldName];
        if (!rule) return { valid: true };
        
        // Campo obrigatório
        if (rule.required && (!value || value.trim() === '')) {
            return { valid: false, message: 'Este campo é obrigatório' };
        }
        
        // Comprimento mínimo
        if (rule.minLength && value.length < rule.minLength) {
            return { valid: false, message: `Mínimo ${rule.minLength} caracteres` };
        }
        
        // Comprimento máximo
        if (rule.maxLength && value.length > rule.maxLength) {
            return { valid: false, message: `Máximo ${rule.maxLength} caracteres` };
        }
        
        // Padrão regex
        if (rule.pattern && !rule.pattern.test(value)) {
            return { valid: false, message: rule.message };
        }
        
        return { valid: true, message: 'Campo válido' };
    }
    
    validateForm(formData) {
        const results = {};
        let isValid = true;
        
        for (const [field, value] of Object.entries(formData)) {
            const result = this.validateField(field, value);
            results[field] = result;
            if (!result.valid) isValid = false;
        }
        
        return { valid: isValid, fields: results };
    }
    
    getPasswordStrength(password) {
        let score = 0;
        let feedback = [];
        
        if (password.length >= 8) score += 1;
        else feedback.push('Mínimo 8 caracteres');
        
        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('Adicione letras minúsculas');
        
        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('Adicione letras maiúsculas');
        
        if (/\d/.test(password)) score += 1;
        else feedback.push('Adicione números');
        
        if (/[@$!%*?&]/.test(password)) score += 1;
        else feedback.push('Adicione símbolos');
        
        const levels = ['Muito fraca', 'Fraca', 'Regular', 'Boa', 'Forte'];
        const classes = ['weak', 'weak', 'fair', 'good', 'strong'];
        
        return {
            score,
            level: levels[score] || 'Muito fraca',
            class: classes[score] || 'weak',
            feedback
        };
    }
}

// ===== SISTEMA DE AUTENTICAÇÃO =====
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('hackerUsers') || '[]');
        this.currentSession = JSON.parse(localStorage.getItem('hackerSession') || 'null');
    }
    
    async register(userData) {
        // Simular delay de processamento
        await Utils.simulateDelay(1500, 2500);
        
        // Verificar se usuário já existe
        const existingUser = this.users.find(u => 
            u.username === userData.username || u.email === userData.email
        );
        
        if (existingUser) {
            throw new Error('Usuário ou e-mail já cadastrado');
        }
        
        // Criar novo usuário
        const newUser = {
            id: Utils.generateRandomString(16),
            username: userData.username,
            email: userData.email,
            password: this.hashPassword(userData.password),
            createdAt: new Date().toISOString(),
            lastLogin: null,
            loginCount: 0
        };
        
        this.users.push(newUser);
        this.saveUsers();
        
        return { success: true, user: newUser };
    }
    
    async login(credentials) {
        // Simular delay de autenticação
        await Utils.simulateDelay(2000, 3000);
        
        const user = this.users.find(u => 
            (u.username === credentials.username || u.email === credentials.username) &&
            u.password === this.hashPassword(credentials.password)
        );
        
        if (!user) {
            throw new Error('Credenciais inválidas');
        }
        
        // Atualizar dados do usuário
        user.lastLogin = new Date().toISOString();
        user.loginCount += 1;
        this.saveUsers();
        
        // Criar sessão
        const session = {
            userId: user.id,
            username: user.username,
            email: user.email,
            loginTime: new Date().toISOString(),
            token: Utils.generateRandomString(32)
        };
        
        this.currentSession = session;
        localStorage.setItem('hackerSession', JSON.stringify(session));
        
        return { success: true, user, session };
    }
    
    logout() {
        this.currentSession = null;
        localStorage.removeItem('hackerSession');
        window.location.href = 'index.html';
    }
    
    isAuthenticated() {
        return this.currentSession !== null;
    }
    
    getCurrentUser() {
        if (!this.currentSession) return null;
        return this.users.find(u => u.id === this.currentSession.userId);
    }
    
    hashPassword(password) {
        // Simulação simples de hash (em produção usar bcrypt ou similar)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }
    
    saveUsers() {
        localStorage.setItem('hackerUsers', JSON.stringify(this.users));
    }
}

// ===== CONTROLADOR DE PÁGINAS =====
class PageController {
    constructor() {
        this.authSystem = new AuthSystem();
        this.validator = new FormValidator();
        this.currentPage = this.getCurrentPage();
        
        this.init();
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('login.html')) return 'login';
        if (path.includes('register.html')) return 'register';
        if (path.includes('dashboard.html')) return 'dashboard';
        return 'index';
    }
    
    init() {
        this.setupGlobalEvents();
        
        switch (this.currentPage) {
            case 'index':
                this.initIndexPage();
                break;
            case 'login':
                this.initLoginPage();
                break;
            case 'register':
                this.initRegisterPage();
                break;
            case 'dashboard':
                this.initDashboardPage();
                break;
        }
    }
    
    setupGlobalEvents() {
        // Atualizar relógio
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        
        // Verificar autenticação em páginas protegidas
        if (this.currentPage === 'dashboard' && !this.authSystem.isAuthenticated()) {
            window.location.href = 'index.html';
        }
        
        // Prevenir acesso a login/register se já autenticado
        if ((this.currentPage === 'login' || this.currentPage === 'register') && 
            this.authSystem.isAuthenticated()) {
            window.location.href = 'dashboard.html';
        }
    }
    
    updateClock() {
        const timeElements = document.querySelectorAll('#current-time, #systemTime');
        const currentTime = Utils.formatTime();
        
        timeElements.forEach(element => {
            if (element) element.textContent = currentTime;
        });
    }
    
    // ===== PÁGINA INICIAL =====
    initIndexPage() {
        // Animação de entrada
        setTimeout(() => {
            const title = document.querySelector('.title');
            if (title) {
                title.style.opacity = '0';
                title.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    title.style.transition = 'all 0.5s ease';
                    title.style.opacity = '1';
                    title.style.transform = 'translateY(0)';
                }, 100);
            }
        }, 500);
        
        // Efeito hover nos cards
        const cards = document.querySelectorAll('.option-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // ===== PÁGINA DE LOGIN =====
    initLoginPage() {
        const form = document.getElementById('loginForm');
        const usernameField = document.getElementById('username');
        const passwordField = document.getElementById('password');
        const togglePassword = document.getElementById('togglePassword');
        const loginButton = document.getElementById('loginButton');
        const messageElement = document.getElementById('formMessage');
        
        // Toggle senha
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                const type = passwordField.type === 'password' ? 'text' : 'password';
                passwordField.type = type;
                togglePassword.querySelector('.eye-icon').textContent = type === 'password' ? '👁' : '🙈';
            });
        }
        
        // Validação em tempo real
        [usernameField, passwordField].forEach(field => {
            if (field) {
                field.addEventListener('input', () => {
                    this.validateLoginField(field);
                });
                
                field.addEventListener('blur', () => {
                    this.validateLoginField(field);
                });
            }
        });
        
        // Submit do formulário
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin(form, loginButton, messageElement);
            });
        }
    }
    
    validateLoginField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        if (fieldName === 'username') {
            // Validação básica para username/email
            if (value.length === 0) {
                this.setFieldState(field, 'invalid');
                this.showFieldFeedback(field, 'Campo obrigatório', 'error');
            } else if (value.length < 3) {
                this.setFieldState(field, 'invalid');
                this.showFieldFeedback(field, 'Mínimo 3 caracteres', 'error');
            } else {
                this.setFieldState(field, 'valid');
                this.showFieldFeedback(field, 'Campo válido', 'success');
            }
        } else if (fieldName === 'password') {
            if (value.length === 0) {
                this.setFieldState(field, 'invalid');
                this.showFieldFeedback(field, 'Campo obrigatório', 'error');
            } else if (value.length < 6) {
                this.setFieldState(field, 'invalid');
                this.showFieldFeedback(field, 'Senha muito curta', 'error');
            } else {
                this.setFieldState(field, 'valid');
                this.showFieldFeedback(field, 'Campo válido', 'success');
            }
        }
    }
    
    async handleLogin(form, button, messageElement) {
        const formData = new FormData(form);
        const credentials = {
            username: formData.get('username').trim(),
            password: formData.get('password')
        };
        
        // Validação básica
        if (!credentials.username || !credentials.password) {
            Utils.showMessage(messageElement, 'Preencha todos os campos', 'error');
            return;
        }
        
        // Mostrar loading
        this.setButtonLoading(button, true);
        this.showHackingAnimation();
        
        try {
            const result = await this.authSystem.login(credentials);
            
            Utils.showMessage(messageElement, 'Login realizado com sucesso!', 'success');
            
            // Redirecionar após sucesso
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } catch (error) {
            Utils.showMessage(messageElement, error.message, 'error');
        } finally {
            this.setButtonLoading(button, false);
            this.hideHackingAnimation();
        }
    }
    
    // ===== PÁGINA DE CADASTRO =====
    initRegisterPage() {
        const form = document.getElementById('registerForm');
        const fields = {
            username: document.getElementById('username'),
            email: document.getElementById('email'),
            password: document.getElementById('password'),
            confirmPassword: document.getElementById('confirmPassword')
        };
        const toggleButtons = document.querySelectorAll('.toggle-password');
        const registerButton = document.getElementById('registerButton');
        const messageElement = document.getElementById('formMessage');
        const termsCheckbox = document.getElementById('acceptTerms');
        
        // Toggle senhas
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const input = button.parentElement.querySelector('input');
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
                button.querySelector('.eye-icon').textContent = type === 'password' ? '👁' : '🙈';
            });
        });
        
        // Validação em tempo real
        Object.entries(fields).forEach(([name, field]) => {
            if (field) {
                field.addEventListener('input', () => {
                    this.validateRegisterField(name, field, fields);
                    this.updateRegistrationProgress();
                    this.updateRegisterButton(fields, termsCheckbox, registerButton);
                });
                
                field.addEventListener('blur', () => {
                    this.validateRegisterField(name, field, fields);
                });
            }
        });
        
        // Checkbox de termos
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', () => {
                this.updateRegisterButton(fields, termsCheckbox, registerButton);
                this.updateRegistrationProgress();
            });
        }
        
        // Submit do formulário
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRegister(form, registerButton, messageElement);
            });
        }
    }
    
    validateRegisterField(fieldName, field, allFields) {
        const value = field.value.trim();
        let result;
        
        if (fieldName === 'confirmPassword') {
            const password = allFields.password?.value || '';
            if (value !== password) {
                result = { valid: false, message: 'Senhas não coincidem' };
            } else if (value.length === 0) {
                result = { valid: false, message: 'Confirme sua senha' };
            } else {
                result = { valid: true, message: 'Senhas coincidem' };
            }
        } else {
            result = this.validator.validateField(fieldName, value);
        }
        
        // Atualizar interface
        this.setFieldState(field, result.valid ? 'valid' : 'invalid');
        this.showFieldFeedback(field, result.message, result.valid ? 'success' : 'error');
        
        // Atualizar força da senha
        if (fieldName === 'password') {
            this.updatePasswordStrength(value);
        }
        
        return result.valid;
    }
    
    updatePasswordStrength(password) {
        const strengthElement = document.getElementById('passwordStrength');
        const fillElement = document.getElementById('strengthFill');
        const textElement = document.getElementById('strengthText');
        
        if (!strengthElement || !fillElement || !textElement) return;
        
        const strength = this.validator.getPasswordStrength(password);
        
        fillElement.className = `strength-fill ${strength.class}`;
        textElement.textContent = strength.level;
        
        if (password.length === 0) {
            fillElement.style.width = '0%';
            textElement.textContent = '';
        }
    }
    
    updateRegistrationProgress() {
        const steps = {
            'step-username': document.getElementById('username'),
            'step-email': document.getElementById('email'),
            'step-password': document.getElementById('password'),
            'step-confirm': document.getElementById('confirmPassword'),
            'step-terms': document.getElementById('acceptTerms')
        };
        
        Object.entries(steps).forEach(([stepId, field]) => {
            const stepElement = document.getElementById(stepId);
            if (stepElement && field) {
                const isValid = field.type === 'checkbox' ? 
                    field.checked : 
                    field.classList.contains('valid');
                
                if (isValid) {
                    stepElement.classList.add('completed');
                } else {
                    stepElement.classList.remove('completed');
                }
            }
        });
    }
    
    updateRegisterButton(fields, termsCheckbox, button) {
        if (!button) return;
        
        const allValid = Object.values(fields).every(field => 
            field && field.classList.contains('valid')
        ) && termsCheckbox?.checked;
        
        button.disabled = !allValid;
    }
    
    async handleRegister(form, button, messageElement) {
        const formData = new FormData(form);
        const userData = {
            username: formData.get('username').trim(),
            email: formData.get('email').trim(),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };
        
        // Validação final
        const validation = this.validator.validateForm(userData);
        if (!validation.valid) {
            Utils.showMessage(messageElement, 'Corrija os erros no formulário', 'error');
            return;
        }
        
        if (userData.password !== userData.confirmPassword) {
            Utils.showMessage(messageElement, 'Senhas não coincidem', 'error');
            return;
        }
        
        // Mostrar loading
        this.setButtonLoading(button, true);
        
        try {
            await this.authSystem.register(userData);
            
            Utils.showMessage(messageElement, 'Conta criada com sucesso! Redirecionando...', 'success');
            
            // Redirecionar para login
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            Utils.showMessage(messageElement, error.message, 'error');
        } finally {
            this.setButtonLoading(button, false);
        }
    }
    
    // ===== PÁGINA DO DASHBOARD =====
    initDashboardPage() {
        const user = this.authSystem.getCurrentUser();
        if (!user) {
            window.location.href = 'index.html';
            return;
        }
        
        this.setupDashboardNavigation();
        this.setupUserInfo(user);
        this.setupTerminalSimulator();
        this.setupSystemStats();
        this.setupQuickActions();
        this.initializeWelcomeMessage(user);
    }
    
    setupDashboardNavigation() {
        const navItems = document.querySelectorAll('.nav-item[data-section]');
        const sections = document.querySelectorAll('.content-section');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetSection = item.getAttribute('data-section');
                
                // Atualizar navegação ativa
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Mostrar seção correspondente
                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === `${targetSection}-section`) {
                        section.classList.add('active');
                    }
                });
            });
        });
    }
    
    setupUserInfo(user) {
        const userNameElements = document.querySelectorAll('#userName, #profileName');
        const userAvatarElements = document.querySelectorAll('#userAvatar, .profile-avatar-large');
        
        const displayName = user.username.charAt(0).toUpperCase() + user.username.slice(1);
        const avatarLetter = user.username.charAt(0).toUpperCase();
        
        userNameElements.forEach(element => {
            if (element) element.textContent = displayName;
        });
        
        userAvatarElements.forEach(element => {
            if (element) element.textContent = avatarLetter;
        });
    }
    
    setupTerminalSimulator() {
        const terminalInput = document.getElementById('terminalInput');
        const terminalOutput = document.getElementById('terminalOutput');
        
        if (terminalInput && terminalOutput) {
            terminalInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const command = terminalInput.value.trim();
                    if (command) {
                        this.executeTerminalCommand(command, terminalOutput);
                        terminalInput.value = '';
                    }
                }
            });
        }
    }
    
    executeTerminalCommand(command, outputElement) {
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.innerHTML = `
            <span class="prompt">root@hacker:~$</span>
            <span class="command">${command}</span>
        `;
        outputElement.appendChild(commandLine);
        
        const response = CONFIG.TERMINAL_COMMANDS[command.toLowerCase()] || 
                        `bash: ${command}: comando não encontrado`;
        
        if (response === 'CLEAR') {
            outputElement.innerHTML = `
                <div class="terminal-line">
                    <span class="prompt">root@hacker:~$</span>
                    <span class="cursor-terminal">_</span>
                </div>
            `;
        } else {
            const responseLine = document.createElement('div');
            responseLine.className = 'terminal-line output';
            responseLine.innerHTML = response.replace(/\n/g, '<br>');
            outputElement.appendChild(responseLine);
            
            // Adicionar nova linha de prompt
            const newPrompt = document.createElement('div');
            newPrompt.className = 'terminal-line';
            newPrompt.innerHTML = `
                <span class="prompt">root@hacker:~$</span>
                <span class="cursor-terminal">_</span>
            `;
            outputElement.appendChild(newPrompt);
        }
        
        // Scroll para baixo
        outputElement.scrollTop = outputElement.scrollHeight;
    }
    
    setupSystemStats() {
        // Atualizar estatísticas periodicamente
        setInterval(() => {
            this.updateSystemStats();
        }, 3000);
        
        // Atualizar ping
        setInterval(() => {
            this.updatePing();
        }, 2000);
    }
    
    updateSystemStats() {
        const stats = ['cpu', 'ram', 'network'];
        
        stats.forEach(stat => {
            const variation = (Math.random() - 0.5) * 10;
            systemStats[stat] = Math.max(0, Math.min(100, systemStats[stat] + variation));
            
            const fillElement = document.querySelector(`.stat-item:nth-child(${stats.indexOf(stat) + 1}) .stat-fill`);
            const valueElement = document.querySelector(`.stat-item:nth-child(${stats.indexOf(stat) + 1}) .stat-value`);
            
            if (fillElement && valueElement) {
                fillElement.style.width = `${systemStats[stat]}%`;
                valueElement.textContent = `${Math.round(systemStats[stat])}%`;
            }
        });
    }
    
    updatePing() {
        const pingElement = document.getElementById('pingValue');
        if (pingElement) {
            const ping = Math.floor(Math.random() * 20) + 8;
            pingElement.textContent = `${ping}ms`;
        }
    }
    
    setupQuickActions() {
        const actionButtons = document.querySelectorAll('.action-button');
        
        actionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const actionText = button.querySelector('span:last-child').textContent;
                this.simulateAction(actionText);
            });
        });
    }
    
    simulateAction(actionName) {
        const messages = {
            'Scan de Rede': 'Escaneando rede local...\nDispositivos encontrados: 12\nScan concluído.',
            'Verificar Segurança': 'Verificando vulnerabilidades...\nSistema seguro.\nNenhuma ameaça detectada.',
            'Gerar Relatório': 'Gerando relatório do sistema...\nRelatório salvo em /reports/system_report.pdf',
            'Acesso Especial': 'Verificando permissões especiais...\nAcesso liberado ao modo desenvolvedor!'
        };
        
        const terminalOutput = document.getElementById('terminalOutput');
        if (terminalOutput && messages[actionName]) {
            const actionLine = document.createElement('div');
            actionLine.className = 'terminal-line';
            actionLine.innerHTML = `
                <span class="prompt">system@hacker:~$</span>
                <span class="command">${actionName.toLowerCase().replace(/\s+/g, '_')}</span>
            `;
            terminalOutput.appendChild(actionLine);
            
            const responseLine = document.createElement('div');
            responseLine.className = 'terminal-line output';
            responseLine.innerHTML = messages[actionName].replace(/\n/g, '<br>');
            terminalOutput.appendChild(responseLine);
            
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    }
    
    initializeWelcomeMessage(user) {
        const welcomeElement = document.getElementById('welcomeMessage');
        if (welcomeElement) {
            const messages = [
                `Bem-vindo de volta, ${user.username}`,
                `Sistema inicializado com sucesso`,
                `Acesso autorizado para ${user.username}`,
                `Conexão segura estabelecida`
            ];
            
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            
            // Usar animação de digitação
            const typing = new TypingAnimation(welcomeElement, randomMessage, 80);
            setTimeout(() => typing.start(), 500);
        }
    }
    
    // ===== MÉTODOS AUXILIARES =====
    setFieldState(field, state) {
        field.classList.remove('valid', 'invalid');
        if (state !== 'neutral') {
            field.classList.add(state);
        }
        
        const validationIcon = field.parentElement.querySelector('.validation-icon');
        if (validationIcon) {
            validationIcon.classList.remove('valid', 'invalid');
            if (state !== 'neutral') {
                validationIcon.classList.add(state);
            }
        }
    }
    
    showFieldFeedback(field, message, type) {
        const feedbackElement = document.getElementById(`${field.name}-feedback`);
        if (feedbackElement) {
            feedbackElement.textContent = message;
            feedbackElement.className = `field-feedback ${type}`;
        }
    }
    
    setButtonLoading(button, loading) {
        if (!button) return;
        
        const spinner = button.querySelector('.loading-spinner-small');
        const text = button.querySelector('.button-text');
        
        if (loading) {
            button.disabled = true;
            if (spinner) spinner.style.display = 'block';
            if (text) text.textContent = 'PROCESSANDO...';
        } else {
            button.disabled = false;
            if (spinner) spinner.style.display = 'none';
            if (text) {
                const originalText = button.id === 'loginButton' ? 'INICIAR SESSÃO' : 'CRIAR CONTA';
                text.textContent = originalText;
            }
        }
    }
    
    showHackingAnimation() {
        const animation = document.getElementById('hackingAnimation');
        const textElement = document.getElementById('hackingText');
        
        if (animation && textElement) {
            animation.classList.add('active');
            
            const commands = [
                'Connecting to server...',
                'Bypassing firewall...',
                'Decrypting credentials...',
                'Access granted!'
            ];
            
            let commandIndex = 0;
            const typeCommand = () => {
                if (commandIndex < commands.length) {
                    const typing = new TypingAnimation(textElement, commands[commandIndex], 50);
                    typing.start();
                    commandIndex++;
                    setTimeout(typeCommand, 1000);
                }
            };
            
            typeCommand();
        }
    }
    
    hideHackingAnimation() {
        const animation = document.getElementById('hackingAnimation');
        if (animation) {
            setTimeout(() => {
                animation.classList.remove('active');
            }, 1000);
        }
    }
}

// ===== FUNÇÕES GLOBAIS =====
function navigateToLogin() {
    window.location.href = 'login.html';
}

function navigateToRegister() {
    window.location.href = 'register.html';
}

function logout() {
    if (window.pageController && window.pageController.authSystem) {
        window.pageController.authSystem.logout();
    }
}

function scanNetwork() {
    if (window.pageController) {
        window.pageController.simulateAction('Scan de Rede');
    }
}

function checkSecurity() {
    if (window.pageController) {
        window.pageController.simulateAction('Verificar Segurança');
    }
}

function generateReport() {
    if (window.pageController) {
        window.pageController.simulateAction('Gerar Relatório');
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar controlador principal
    window.pageController = new PageController();
    
    // Configurar eventos globais de teclado para easter eggs
    document.addEventListener('keydown', (e) => {
        easterEggSequence.push(e.key.toLowerCase());
        
        // Manter apenas os últimos 4 caracteres
        if (easterEggSequence.length > CONFIG.EASTER_EGG_SEQUENCE.length) {
            easterEggSequence.shift();
        }
        
        // Verificar se a sequência foi digitada
        if (easterEggSequence.join('') === CONFIG.EASTER_EGG_SEQUENCE.join('')) {
            triggerEasterEgg();
            easterEggSequence = [];
        }
    });
});

// Função para ativar easter egg (será expandida na próxima fase)
function triggerEasterEgg() {
    console.log('Easter egg ativado!');
}


// Profile Photo Upload Functionality
function initializeProfileUpload() {
    const uploadOverlay = document.getElementById('uploadOverlayLarge');
    const photoUpload = document.getElementById('photoUploadLarge');
    const profileImage = document.getElementById('profileImageLarge');
    const profileAvatar = document.getElementById('profileAvatarLarge');

    if (uploadOverlay && photoUpload) {
        // Click handler for upload overlay
        uploadOverlay.addEventListener('click', () => {
            photoUpload.click();
        });

        // File change handler
        photoUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                handleProfilePhotoUpload(file);
            }
        });
    }

    // Load saved profile photo
    loadSavedProfilePhoto();
}

function handleProfilePhotoUpload(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Por favor, selecione apenas arquivos de imagem.', 'error');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('A imagem deve ter no máximo 5MB.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const imageData = e.target.result;
        
        // Update profile images
        updateProfileImages(imageData);
        
        // Save to localStorage
        localStorage.setItem('hackerProfilePhoto', imageData);
        
        // Show success notification
        showNotification('Foto de perfil atualizada com sucesso!', 'success');
        
        // Add glitch effect
        addGlitchEffect();
    };
    
    reader.readAsDataURL(file);
}

function updateProfileImages(imageData) {
    // Update large profile image
    const profileImageLarge = document.getElementById('profileImageLarge');
    const profileAvatarLarge = document.getElementById('profileAvatarLarge');
    
    if (profileImageLarge && profileAvatarLarge) {
        profileImageLarge.src = imageData;
        profileImageLarge.style.display = 'block';
        profileAvatarLarge.style.display = 'none';
    }

    // Update small navigation avatar if exists
    const profileImage = document.getElementById('profileImage');
    const avatarIcon = document.getElementById('avatarIcon');
    
    if (profileImage && avatarIcon) {
        profileImage.src = imageData;
        profileImage.style.display = 'block';
        avatarIcon.style.display = 'none';
    }
}

function loadSavedProfilePhoto() {
    const savedPhoto = localStorage.getItem('hackerProfilePhoto');
    if (savedPhoto) {
        updateProfileImages(savedPhoto);
    }
}

function removeProfilePhoto() {
    // Remove from localStorage
    localStorage.removeItem('hackerProfilePhoto');
    
    // Reset to default avatar
    const profileImageLarge = document.getElementById('profileImageLarge');
    const profileAvatarLarge = document.getElementById('profileAvatarLarge');
    
    if (profileImageLarge && profileAvatarLarge) {
        profileImageLarge.style.display = 'none';
        profileAvatarLarge.style.display = 'flex';
    }

    const profileImage = document.getElementById('profileImage');
    const avatarIcon = document.getElementById('avatarIcon');
    
    if (profileImage && avatarIcon) {
        profileImage.style.display = 'none';
        avatarIcon.style.display = 'block';
    }
    
    showNotification('Foto de perfil removida.', 'info');
}

function addGlitchEffect() {
    const profileContainer = document.querySelector('.profile-avatar-container');
    if (profileContainer) {
        profileContainer.classList.add('glitch-effect');
        setTimeout(() => {
            profileContainer.classList.remove('glitch-effect');
        }, 1000);
    }
}

// Add glitch effect CSS class
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
.glitch-effect {
    animation: glitch 0.5s ease-in-out;
}

@keyframes glitch {
    0%, 100% { transform: translate(0); }
    10% { transform: translate(-2px, 2px); }
    20% { transform: translate(2px, -2px); }
    30% { transform: translate(-2px, -2px); }
    40% { transform: translate(2px, 2px); }
    50% { transform: translate(-2px, 2px); }
    60% { transform: translate(2px, -2px); }
    70% { transform: translate(-2px, -2px); }
    80% { transform: translate(2px, 2px); }
    90% { transform: translate(-2px, 2px); }
}
`;
document.head.appendChild(glitchStyle);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeProfileUpload();
});


// Nuclear Bomb Prank Functionality
function initNuclearSequence() {
    showNuclearWarning();
}

function showNuclearWarning() {
    const modal = document.createElement('div');
    modal.className = 'nuclear-warning-modal';
    modal.innerHTML = `
        <div class="nuclear-warning-content">
            <div class="nuclear-warning-title">⚠️ AVISO CRÍTICO ⚠️</div>
            <div class="nuclear-warning-text">
                Você está prestes a ativar a sequência de autodestruição nuclear do sistema.<br><br>
                <strong>ESTA AÇÃO IRÁ FORMATAR COMPLETAMENTE O COMPUTADOR E APAGAR TODOS OS DADOS!</strong><br><br>
                Tem certeza absoluta que deseja continuar?
            </div>
            <div class="nuclear-warning-buttons">
                <button class="nuclear-cancel-btn" onclick="cancelNuclearSequence()">CANCELAR</button>
                <button class="nuclear-confirm-btn" onclick="confirmNuclearSequence()">SIM, CONTINUAR</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add dramatic sound effect
    playDialupSound();
}

function cancelNuclearSequence() {
    const modal = document.querySelector('.nuclear-warning-modal');
    if (modal) {
        modal.remove();
    }
    showNotification('Sequência nuclear cancelada. Sistema seguro.', 'success');
}

function confirmNuclearSequence() {
    const modal = document.querySelector('.nuclear-warning-modal');
    if (modal) {
        modal.remove();
    }
    
    // Show "Too Late" message and start fake formatting
    showNuclearSequence();
}

function showNuclearSequence() {
    const overlay = document.createElement('div');
    overlay.className = 'nuclear-sequence-overlay';
    overlay.innerHTML = `
        <div class="nuclear-message">TARDE DEMAIS</div>
        <div class="nuclear-progress">
            <div class="nuclear-progress-bar" id="nuclearProgressBar"></div>
        </div>
        <div class="nuclear-status" id="nuclearStatus">Iniciando sequência de autodestruição...</div>
    `;
    
    document.body.appendChild(overlay);
    
    // Play dialup sound
    playDialupSound();
    
    // Start fake formatting sequence
    startFakeFormatting();
}

function startFakeFormatting() {
    const progressBar = document.getElementById('nuclearProgressBar');
    const statusText = document.getElementById('nuclearStatus');
    
    const steps = [
        { progress: 10, text: 'Desconectando sistemas de segurança...' },
        { progress: 25, text: 'Formatando disco rígido C:\\...' },
        { progress: 40, text: 'Apagando arquivos do sistema...' },
        { progress: 55, text: 'Removendo dados pessoais...' },
        { progress: 70, text: 'Destruindo backup de segurança...' },
        { progress: 85, text: 'Sobrescrevendo setores do disco...' },
        { progress: 95, text: 'Finalizando destruição...' },
        { progress: 100, text: 'SISTEMA DESTRUÍDO!' }
    ];
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            progressBar.style.width = step.progress + '%';
            statusText.textContent = step.text;
            
            // Add glitch effect at certain points
            if (step.progress === 50 || step.progress === 75) {
                addScreenGlitch();
            }
            
            currentStep++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                showPrankReveal();
            }, 2000);
        }
    }, 1500);
}

function showPrankReveal() {
    const overlay = document.querySelector('.nuclear-sequence-overlay');
    if (overlay) {
        overlay.innerHTML = `
            <div style="text-align: center; color: var(--neon-green);">
                <div style="font-size: 64px; margin-bottom: 30px;">😄</div>
                <div style="font-size: 36px; margin-bottom: 20px;">PEGADINHA!</div>
                <div style="font-size: 18px; margin-bottom: 30px;">
                    Relaxa! Seu computador está perfeitamente seguro.<br>
                    Esta foi apenas uma simulação para testar seus reflexos! 😉
                </div>
                <button onclick="closePrankReveal()" style="
                    padding: 15px 30px;
                    background: var(--neon-green);
                    color: var(--bg-dark);
                    border: none;
                    border-radius: 5px;
                    font-family: 'Fira Code', monospace;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 16px;
                ">FECHAR</button>
            </div>
        `;
    }
}

function closePrankReveal() {
    const overlay = document.querySelector('.nuclear-sequence-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    // Add celebration effect
    createFireworks();
    showNotification('Você caiu na pegadinha! 😄', 'success');
}

function playDialupSound() {
    try {
        const audio = new Audio('assets/dialup-sound.wav');
        audio.volume = 0.5;
        audio.play().catch(e => {
            console.log('Could not play dialup sound:', e);
            // Fallback: create synthetic dialup sounds
            createSyntheticDialupSound();
        });
    } catch (e) {
        console.log('Audio not available, using synthetic sound');
        createSyntheticDialupSound();
    }
}

function createSyntheticDialupSound() {
    // Create synthetic dialup-like sounds using Web Audio API
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        
        // Create a series of beeps and static sounds
        const frequencies = [800, 1200, 1600, 2100, 1800, 1400];
        let time = audioContext.currentTime;
        
        frequencies.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, time);
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0, time);
            gainNode.gain.linearRampToValueAtTime(0.1, time + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, time + 0.5);
            
            oscillator.start(time);
            oscillator.stop(time + 0.5);
            
            time += 0.6;
        });
    }
}

function addScreenGlitch() {
    const overlay = document.querySelector('.nuclear-sequence-overlay');
    if (overlay) {
        overlay.style.animation = 'glitchScreen 0.5s ease-in-out';
        setTimeout(() => {
            overlay.style.animation = '';
        }, 500);
    }
}

// Add screen glitch animation
const glitchScreenStyle = document.createElement('style');
glitchScreenStyle.textContent = `
@keyframes glitchScreen {
    0%, 100% { 
        filter: none;
        transform: translate(0);
    }
    10% { 
        filter: hue-rotate(90deg) saturate(2);
        transform: translate(-5px, 2px);
    }
    20% { 
        filter: hue-rotate(180deg) saturate(3);
        transform: translate(5px, -2px);
    }
    30% { 
        filter: hue-rotate(270deg) saturate(1);
        transform: translate(-2px, -5px);
    }
    40% { 
        filter: invert(1);
        transform: translate(2px, 5px);
    }
    50% { 
        filter: contrast(3) brightness(0.5);
        transform: translate(-3px, 1px);
    }
    60% { 
        filter: sepia(1) hue-rotate(45deg);
        transform: translate(3px, -1px);
    }
    70% { 
        filter: grayscale(1) contrast(2);
        transform: translate(-1px, -3px);
    }
    80% { 
        filter: blur(2px);
        transform: translate(1px, 3px);
    }
    90% { 
        filter: hue-rotate(315deg);
        transform: translate(-2px, 0px);
    }
}
`;
document.head.appendChild(glitchScreenStyle);


// Fighter Jet Control Panel Functionality

// IP Scanner Function
function scanIP() {
    const ipInput = document.getElementById('ipInput');
    const ipResults = document.getElementById('ipResults');
    const ip = ipInput.value.trim();
    
    if (!ip) {
        showNotification('Por favor, insira um endereço IP válido.', 'error');
        return;
    }
    
    // Validate IP format
    if (!isValidIP(ip)) {
        showNotification('Formato de IP inválido. Use o formato: 192.168.1.1', 'error');
        return;
    }
    
    // Show scanning animation
    ipResults.innerHTML = '<div style="color: #00d4ff;">🔍 Escaneando IP ' + ip + '...</div>';
    
    // Simulate IP scanning with realistic results
    setTimeout(() => {
        const scanResults = generateIPScanResults(ip);
        displayIPResults(scanResults, ip);
    }, 2000);
}

function isValidIP(ip) {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
}

function generateIPScanResults(ip) {
    const locations = ['São Paulo, BR', 'New York, US', 'London, UK', 'Tokyo, JP', 'Moscow, RU', 'Berlin, DE'];
    const isps = ['Vivo', 'Claro', 'Tim', 'Google', 'Amazon', 'Cloudflare', 'Microsoft'];
    const statuses = ['ATIVO', 'INATIVO', 'PROTEGIDO', 'VULNERÁVEL'];
    
    return {
        ip: ip,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        isp: isps[Math.floor(Math.random() * isps.length)],
        ports: generateOpenPorts(),
        ping: Math.floor(Math.random() * 200) + 10 + 'ms',
        os: detectOS(ip)
    };
}

function generateOpenPorts() {
    const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995];
    const openPorts = [];
    
    commonPorts.forEach(port => {
        if (Math.random() > 0.7) {
            openPorts.push(port);
        }
    });
    
    return openPorts;
}

function detectOS(ip) {
    const systems = ['Windows 10', 'Linux Ubuntu', 'macOS', 'Windows Server', 'CentOS', 'Debian'];
    return systems[Math.floor(Math.random() * systems.length)];
}

function displayIPResults(results, ip) {
    const ipResults = document.getElementById('ipResults');
    
    const resultHTML = `
        <div style="color: var(--neon-green); margin-bottom: 10px;">
            ✅ SCAN COMPLETO PARA ${ip}
        </div>
        <div style="margin-bottom: 5px;">
            <span style="color: #00d4ff;">Status:</span> 
            <span style="color: ${results.status === 'ATIVO' ? 'var(--neon-green)' : '#ff0040'};">${results.status}</span>
        </div>
        <div style="margin-bottom: 5px;">
            <span style="color: #00d4ff;">Localização:</span> ${results.location}
        </div>
        <div style="margin-bottom: 5px;">
            <span style="color: #00d4ff;">ISP:</span> ${results.isp}
        </div>
        <div style="margin-bottom: 5px;">
            <span style="color: #00d4ff;">Sistema:</span> ${results.os}
        </div>
        <div style="margin-bottom: 5px;">
            <span style="color: #00d4ff;">Ping:</span> ${results.ping}
        </div>
        <div style="margin-bottom: 5px;">
            <span style="color: #00d4ff;">Portas Abertas:</span> ${results.ports.length > 0 ? results.ports.join(', ') : 'Nenhuma detectada'}
        </div>
    `;
    
    ipResults.innerHTML = resultHTML;
    
    // Add scan complete notification
    showNotification(`Scan do IP ${ip} concluído!`, 'success');
}

// SkyNet Activation Function
function activateSkyNet() {
    showSkyNetModal();
}

function showSkyNetModal() {
    const modal = document.createElement('div');
    modal.className = 'skynet-modal';
    modal.innerHTML = `
        <div class="skynet-content">
            <div class="skynet-title">🤖 SKYNET ATIVADO 🤖</div>
            <div class="skynet-description">
                Sistema de Inteligência Artificial SkyNet foi ativado com sucesso!<br><br>
                <strong>Recursos Disponíveis:</strong><br>
                • Análise avançada de ameaças<br>
                • Processamento de linguagem natural<br>
                • Tomada de decisões autônomas<br>
                • Interface de comunicação direta<br><br>
                Deseja se comunicar com o agente SkyNet?
            </div>
            <div class="skynet-buttons">
                <a href="https://chatgpt.com/g/g-RXFISvAeJ-skynet" target="_blank" class="skynet-action-btn">
                    🚀 ACESSAR SKYNET
                </a>
                <button onclick="closeSkyNetModal()" class="skynet-action-btn skynet-close-btn">
                    FECHAR
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add dramatic sound effect
    playDialupSound();
    
    // Add screen effects
    addSkyNetEffects();
}

function closeSkyNetModal() {
    const modal = document.querySelector('.skynet-modal');
    if (modal) {
        modal.remove();
    }
}

function addSkyNetEffects() {
    // Add red scanning lines effect
    const scanLines = document.createElement('div');
    scanLines.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 64, 0, 0.1) 50%,
            transparent 100%
        );
        animation: skynetScan 2s linear infinite;
        pointer-events: none;
        z-index: 9999;
    `;
    
    document.body.appendChild(scanLines);
    
    // Remove effect after 10 seconds
    setTimeout(() => {
        if (scanLines.parentNode) {
            scanLines.parentNode.removeChild(scanLines);
        }
    }, 10000);
}

// Add SkyNet scan animation
const skynetScanStyle = document.createElement('style');
skynetScanStyle.textContent = `
@keyframes skynetScan {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100vw);
    }
}
`;
document.head.appendChild(skynetScanStyle);

// Enhanced IP input with auto-formatting
document.addEventListener('DOMContentLoaded', () => {
    const ipInput = document.getElementById('ipInput');
    if (ipInput) {
        ipInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                scanIP();
            }
        });
        
        // Add placeholder animation
        let placeholderIndex = 0;
        const placeholders = [
            '192.168.1.1',
            '8.8.8.8',
            '1.1.1.1',
            '208.67.222.222',
            '127.0.0.1'
        ];
        
        setInterval(() => {
            if (ipInput && !ipInput.value && document.activeElement !== ipInput) {
                ipInput.placeholder = placeholders[placeholderIndex];
                placeholderIndex = (placeholderIndex + 1) % placeholders.length;
            }
        }, 3000);
    }
});

