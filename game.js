// Configuração do canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dimensões do canvas
canvas.width = 800;
canvas.height = 600;

// Game loop básico
function gameLoop() {
    // Limpar canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar estrelas de fundo (placeholder)
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillRect(x, y, 2, 2);
    }

    requestAnimationFrame(gameLoop);
}

// Iniciar o jogo
gameLoop();
