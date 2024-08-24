import { Scene } from 'phaser';

export class Game extends Scene {
    constructor () {
        super('Game');
        this.ballSpeed = 300; // Velocidad inicial de la pelota
        this.level = 1; // Nivel inicial
    }
    
    create() {
        // Agregar el fondo y ajustar su escala
        this.background = this.add.image(400, 350, "sky");
        this.background.setScale(0.8);
    
        // Inicializar el puntaje
        this.score = 0;
    
        // Crear un texto para mostrar el puntaje
        this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#fff' });
    
        // Crear pala como rectángulo
        this.paddle = this.add.rectangle(400, 600, 100, 20, 0x6666ff);
        this.physics.add.existing(this.paddle);
        this.paddle.body.setImmovable(true);
        this.paddle.body.setCollideWorldBounds(true);
    
        // Crear bola como sprite utilizando la imagen cargada
        this.createBall();
    
        // Crear un contenedor para los obstáculos
        this.createObstacles();
    
        // Configurar para que la pala no sea afectada por la gravedad
        this.paddle.body.setAllowGravity(false);
    
        // Agregar colisiones
        this.physics.add.collider(this.paddle, this.ball, null, null, this);
        this.physics.add.collider(this.obstacleContainer.list, this.ball, this.handleCollision, null, this);
    
        // Colisión de la pelota con el límite inferior
        this.physics.world.on("worldbounds", (body, up, down, left, right) => {
            if (down && body.gameObject === this.ball) {
                console.log("hit bottom");
                this.gameOver();
            }
        });
    
        // Crear cursor
        this.cursor = this.input.keyboard.createCursorKeys();
    }
  
    update() {
        // Mover la pala con el cursor del mouse
        this.paddle.x = this.input.activePointer.x;
    
        // Asegurarse de que la pala no se salga de los límites
        if (this.paddle.x < this.paddle.width / 2) {
            this.paddle.x = this.paddle.width / 2;
        } else if (this.paddle.x > this.scale.width - this.paddle.width / 2) {
            this.paddle.x = this.scale.width - this.paddle.width / 2;
        }
    }
  
    handleCollision(obstacle, ball) {
        console.log("collision");
        obstacle.destroy();
  
        // Incrementar el puntaje y actualizar el texto
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        // Verificar si todos los obstáculos han sido destruidos
        if (this.obstacleContainer.list.length === 0) {
            this.nextLevel();
        }
    }
  
    createBall() {
        this.ball = this.add.sprite(400, 300, "ball");
        this.ball.setScale(0.1);
        this.physics.add.existing(this.ball);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.setBounce(1, 1);
        this.ball.body.setVelocity(this.ballSpeed, this.ballSpeed);
        this.ball.body.onWorldBounds = true;
    }

    createObstacles() {
        // Crear un contenedor para los obstáculos
        this.obstacleContainer = this.add.container();
    
        // Añadir múltiples obstáculos al contenedor en una cuadrícula
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 11; col++) {
                let x = 120 + col * 80;
                let y = 100 + row * 40;
                let obstacle = this.add.rectangle(x, y, 60, 20, 0x66ff66);
                this.physics.add.existing(obstacle);
                obstacle.body.setImmovable(true);
                this.obstacleContainer.add(obstacle);
            }
        }
    }

    nextLevel() {
        console.log("Next Level");
        // Aumentar el nivel y la velocidad de la pelota
        this.level += 1;
        this.ballSpeed += 70; // Incrementar la velocidad de la pelota para el siguiente nivel

        // Reiniciar el juego como un nuevo nivel
        this.resetLevel();
    }

    resetLevel() {
        // Resetear la posición de la pelota
        this.ball.destroy(); // Destruir la pelota anterior
        this.createBall(); // Crear una nueva pelota con la velocidad actualizada

        // Crear nuevos obstáculos
        this.obstacleContainer.destroy();
        this.createObstacles();

        // Reconfigurar las colisiones
        this.physics.add.collider(this.paddle, this.ball, null, null, this);
        this.physics.add.collider(this.obstacleContainer.list, this.ball, this.handleCollision, null, this);
    }

    gameOver() {
        console.log("Game Over");
        // Pasar el puntaje a la escena de Game Over
        this.scene.start("GameOver", { finalScore: this.score });
    }
}
