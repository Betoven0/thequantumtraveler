export class Enemy {
    constructor(scene, x, y) {
        this.myScene = scene;

        // Posición inicial
        this.initialX = x;
        this.initialY = y;

        // Propiedades relacionadas con el salto
        this.initialJumpVelocity = -500; // Más agresivo
        this.maxJumpTime = 200;
        this.jumpTime = 0;
        this.isJumping = false;
        this.maxJumpVelocity = -500; // Más agresivo
        this.jumpCount = 0;
        this.canJump = true;

        // Propiedades relacionadas con el dash
        this.isDashing = false;
        this.dashDistance = 100; // Más agresivo
        this.dashSpeed = 600; // Más agresivo
        this.dashTargetX = 0;
        this.canDash = true;

        // Propiedades de patrullaje
        this.patrolSpeed = 100;
        this.patrolDirection = 1; // 1 para derecha, -1 para izquierda
        this.patrolRange = 200; // Rango de patrullaje
    }

    preload() {
        // Cargar spritesheets del enemigo
        this.myScene.load.spritesheet('enemyIDLE', 'assets/enemy_idle_32x32.png', { frameWidth: 32, frameHeight: 32 });
        this.myScene.load.spritesheet('enemyRUN', 'assets/enemy_run_32x32.png', { frameWidth: 32, frameHeight: 32 });
        this.myScene.load.spritesheet('enemyJUMP', 'assets/enemy_jump_32x32.png', { frameWidth: 32, frameHeight: 32 });
        this.myScene.load.spritesheet('enemyDASH', 'assets/enemy_dash_32x32.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        // Crear animaciones del enemigo
        this.myScene.anims.create({
            key: "enemyIdle",
            frames: this.myScene.anims.generateFrameNumbers('enemyIDLE', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });
        this.myScene.anims.create({
            key: "enemyRun",
            frames: this.myScene.anims.generateFrameNumbers('enemyRUN', { start: 0, end: 8 }),
            frameRate: 8,
            repeat: -1
        });
        this.myScene.anims.create({
            key: "enemyJump",
            frames: this.myScene.anims.generateFrameNumbers('enemyJUMP', { start: 0, end: 5 }),
            frameRate: 5,
            repeat: 1
        });
        this.myScene.anims.create({
            key: "enemyDash",
            frames: this.myScene.anims.generateFrameNumbers('enemyDASH', { start: 0, end: 2 }),
            frameRate: 2,
            repeat: 1
        });

        // Crear el sprite del enemigo
        this.enemy = this.myScene.physics.add.sprite(this.initialX, this.initialY, 'enemyIDLE');
        this.enemy.body.setSize(this.enemy.width * 0.45, this.enemy.height * 0.7);
        this.enemy.body.setOffset(this.enemy.width * 0.3, this.enemy.height * 0.1);
        this.enemy.setCollideWorldBounds(true);
        this.enemy.setBounce(0.2);
        this.enemy.setScale(2);
    }


    update(time, delta) {
        if (this.isDashing) {
            if (this.enemy.flipX) {
                this.enemy.setVelocityX(-this.dashSpeed);
                if (this.enemy.x <= this.dashTargetX || this.enemy.body.blocked.left) {
                    this.enemy.setVelocityX(0);
                    this.enemy.x = this.dashTargetX;
                    this.isDashing = false;
                    this.enemy.anims.play('enemyIdle', true);
                }
            } else {
                this.enemy.setVelocityX(this.dashSpeed);
                if (this.enemy.x >= this.dashTargetX || this.enemy.body.blocked.right) {
                    this.enemy.setVelocityX(0);
                    this.enemy.x = this.dashTargetX;
                    this.isDashing = false;
                    this.enemy.anims.play('enemyIdle', true);
                }
            }
            return;
        }

        // Patrullaje: mover de lado a lado
        if (this.enemy.body.onFloor()) {
            this.enemy.setVelocityX(this.patrolSpeed * this.patrolDirection);
            if (this.enemy.x >= this.initialX + this.patrolRange) {
                this.patrolDirection = -1;
                this.enemy.flipX = true;
            } else if (this.enemy.x <= this.initialX - this.patrolRange) {
                this.patrolDirection = 1;
                this.enemy.flipX = false;
            }
            this.enemy.anims.play('enemyRun', true);
        }

        // Detección de colisiones y cambio de dirección o salto
        if (this.enemy.body.blocked.left || this.enemy.body.blocked.right) {
            if (this.enemy.body.onFloor() && !this.isJumping) {
                this.enemy.setVelocityY(this.initialJumpVelocity); // Saltar
                this.enemy.anims.play('enemyJump', true);
            } else {
                this.patrolDirection *= -1; // Cambiar dirección
                this.enemy.flipX = !this.enemy.flipX;
            }
        }

        // SALTO: Realizar un salto en ciertos puntos de la patrulla
        if (this.enemy.body.onFloor() && (this.enemy.x === this.initialX || this.enemy.x === this.initialX + this.patrolRange || this.enemy.x === this.initialX - this.patrolRange)) {
            this.enemy.setVelocityY(this.initialJumpVelocity);
            this.enemy.anims.play('enemyJump', true);
        }

        // DASH: Realizar un dash en ciertos puntos de la patrulla
        if ((this.enemy.x === this.initialX + this.patrolRange / 2 || this.enemy.x === this.initialX - this.patrolRange / 2) && !this.isDashing && this.canDash) {
            this.isDashing = true;
            this.canDash = false;
            if (this.enemy.flipX) {
                this.dashTargetX = Math.max(this.enemy.x - this.dashDistance, 0);
            } else {
                this.dashTargetX = Math.min(this.enemy.x + this.dashDistance, this.myScene.physics.world.bounds.width);
            }
            this.enemy.anims.play('enemyDash', true);
        }

        // Restablecer el dash después de un tiempo
        if (!this.isDashing) {
            this.canDash = true;
        }
    }
}
