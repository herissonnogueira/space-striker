// Configuração do canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dimensões do canvas
canvas.width = 800;
canvas.height = 600;

// Sistema de estrelas com parallax
class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speed = this.size * 0.5;
        this.opacity = Math.random() * 0.5 + 0.5;
    }

    update() {
        this.y += this.speed;

        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

// Criar array de estrelas
const stars = [];
for (let i = 0; i < 100; i++) {
    stars.push(new Star());
}

// Classe do jogador
class Player {
    constructor() {
        this.width = 40;
        this.height = 40;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 20;
        this.speed = 5;
        this.movingLeft = false;
        this.movingRight = false;
    }

    update() {
        if (this.movingLeft && this.x > 0) {
            this.x -= this.speed;
        }
        if (this.movingRight && this.x < canvas.width - this.width) {
            this.x += this.speed;
        }
    }

    draw() {
        // Desenhar nave (triângulo)
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // Brilho da nave
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    shoot() {
        bullets.push(new Bullet(this.x + this.width / 2, this.y));
    }
}

// Classe de projétil
class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 15;
        this.speed = 8;
    }

    update() {
        this.y -= this.speed;
    }

    draw() {
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);

        // Brilho do tiro
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';
        ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
    }

    isOffScreen() {
        return this.y < 0;
    }
}

// Classe de inimigo
class Enemy {
    constructor(speedMultiplier = 1) {
        this.width = 35;
        this.height = 35;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = -this.height;
        this.speed = (Math.random() * 2 + 1) * speedMultiplier;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        // Desenhar inimigo (quadrado rotacionado)
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(Math.PI / 4);

        ctx.fillStyle = '#ff4444';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Brilho do inimigo
        ctx.strokeStyle = '#ff6666';
        ctx.lineWidth = 2;
        ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

        ctx.restore();
    }

    isOffScreen() {
        return this.y > canvas.height;
    }
}

// Criar jogador
const player = new Player();

// Array de projéteis
const bullets = [];

// Array de inimigos
const enemies = [];

// Sistema de spawn de inimigos
let spawnTimer = 0;
const spawnInterval = 100;

// Sistema de jogo
let score = 0;
let lives = 3;
let invulnerable = false;
let invulnerableTimer = 0;
let gameOver = false;
let level = 1;

// Função para detectar colisão entre retângulos
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Função para resetar o jogo
function resetGame() {
    score = 0;
    lives = 3;
    gameOver = false;
    invulnerable = false;
    invulnerableTimer = 0;
    level = 1;
    bullets.length = 0;
    enemies.length = 0;
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - player.height - 20;
}

// Controles do teclado
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key === 'ArrowLeft') {
        player.movingLeft = true;
    }
    if (e.key === 'ArrowRight') {
        player.movingRight = true;
    }
    if (e.key === ' ' && !keys['shooting'] && !gameOver) {
        keys['shooting'] = true;
        player.shoot();
    }
    if ((e.key === 'r' || e.key === 'R' || e.key === 'Enter') && gameOver) {
        resetGame();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;

    if (e.key === 'ArrowLeft') {
        player.movingLeft = false;
    }
    if (e.key === 'ArrowRight') {
        player.movingRight = false;
    }
    if (e.key === ' ') {
        keys['shooting'] = false;
    }
});

// Game loop
function gameLoop() {
    // Limpar canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Atualizar e desenhar estrelas
    stars.forEach(star => {
        star.update();
        star.draw();
    });

    // Verificar game over
    if (lives <= 0 && !gameOver) {
        gameOver = true;
    }

    if (gameOver) {
        // Tela de game over
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ff4444';
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);

        ctx.fillStyle = '#00ffff';
        ctx.font = '30px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);

        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText('Press R or ENTER to restart', canvas.width / 2, canvas.height / 2 + 80);

        ctx.textAlign = 'left';
        requestAnimationFrame(gameLoop);
        return;
    }

    // Atualizar e desenhar jogador
    player.update();
    player.draw();

    // Atualizar e desenhar projéteis
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update();
        bullets[i].draw();

        // Remover projéteis que saíram da tela
        if (bullets[i].isOffScreen()) {
            bullets.splice(i, 1);
        }
    }

    // Calcular nível baseado no score
    level = Math.floor(score / 100) + 1;

    // Ajustar dificuldade baseado no nível
    const currentSpawnInterval = Math.max(40, spawnInterval - (level - 1) * 10);
    const speedMultiplier = 1 + (level - 1) * 0.15;

    // Spawn de inimigos
    spawnTimer++;
    if (spawnTimer >= currentSpawnInterval) {
        enemies.push(new Enemy(speedMultiplier));
        spawnTimer = 0;
    }

    // Atualizar e desenhar inimigos
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
        enemies[i].draw();

        // Verificar colisão com projéteis
        for (let j = bullets.length - 1; j >= 0; j--) {
            const bullet = bullets[j];
            const bulletBox = {
                x: bullet.x - bullet.width / 2,
                y: bullet.y,
                width: bullet.width,
                height: bullet.height
            };

            if (checkCollision(bulletBox, enemies[i])) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                score += 10;
                break;
            }
        }

        // Verificar colisão com jogador
        if (enemies[i] && !invulnerable && checkCollision(player, enemies[i])) {
            enemies.splice(i, 1);
            lives--;
            invulnerable = true;
            invulnerableTimer = 120;
        }

        // Remover inimigos que saíram da tela
        if (enemies[i] && enemies[i].isOffScreen()) {
            enemies.splice(i, 1);
        }
    }

    // Gerenciar invulnerabilidade
    if (invulnerable) {
        invulnerableTimer--;
        if (invulnerableTimer <= 0) {
            invulnerable = false;
        }
    }

    // Desenhar UI
    ctx.fillStyle = '#00ffff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`Lives: ${lives}`, 20, 60);
    ctx.fillText(`Level: ${level}`, 20, 90);

    // Piscar nave quando invulnerável
    if (invulnerable && Math.floor(invulnerableTimer / 10) % 2 === 0) {
        ctx.globalAlpha = 0.5;
    } else {
        ctx.globalAlpha = 1;
    }

    requestAnimationFrame(gameLoop);
}

// Iniciar o jogo
gameLoop();
