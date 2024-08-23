import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    
    
    create ()
    {
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(512, 384, 'background').setAlpha(0.5);

            // Crear pala como rectángulo
    this.paddle = this.add.rectangle(400, 500, 100, 20, 0x6666ff);
    this.physics.add.existing(this.paddle);
    this.paddle.body.setImmovable(true);
    this.paddle.body.setCollideWorldBounds(true);

    // Crear bola como círculo
    this.ball = this.add.circle(400, 300, 10, 0xff6666);
    this.physics.add.existing(this.ball);
    this.ball.body.setCollideWorldBounds(true);
    this.ball.body.setBounce(1, 1);
    this.ball.body.setVelocity(200, 200);

    // Crear obstáculo
    this.obstacle = this.add.rectangle(400, 200, 100, 100, 0x66ff66);
    this.physics.add.existing(this.obstacle);
    this.obstacle.body.setImmovable(true);

    // Configurar para que no sean afectados por la gravedad
    this.paddle.body.setAllowGravity(false);
    this.obstacle.body.setAllowGravity(false);

    // Agregar colisiones
    this.physics.add.collider(this.paddle, this.ball, null, null, this);
    this.physics.add.collider(this.obstacle, this.ball, this.handleCollision, null, this);

    // Detectar colisión con el límite inferior del mundo
    this.physics.world.on("worldbounds", (body, up, down, left, right) => {
      if (down) {
        console.log("hit bottom");
        this.scene.start("GameOver");
      }
    });

    // Moverse con el mouse
    this.input.on('pointermove', (pointer) => {
      this.paddle.x = Phaser.Math.Clamp(pointer.x, this.paddle.width / 2, this.scale.width - this.paddle.width / 2);
    });
    }

    update() {
    }
  
    handleCollision(obstacle, ball) {
      console.log("collision");
      obstacle.destroy();
    }
}
