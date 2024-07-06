export class Player {
    
    constructor(scene) {
        this.myScene = scene;

        // Propiedades relacionadas con el salto
        this.initialJumpVelocity = -800;
        this.maxJumpTime = 100;
        this.jumpTime = 0;
        this.isJumping = false;
        this.maxJumpVelocity = -800;
        this.jumpCount = 0;
        this.canJump = true;
        this.jumpKeyPressed = false;

        // Propiedades relacionadas con el dash
        this.isDashing = false;
        this.dashDistance = 120;
        this.dashSpeed = 800;
        this.dashTargetX = 0;
        this.canDash = true;
        this.dashKeyPressed = false;
    }
    preload() {
        this.myScene.load.spritesheet("playerIDLE", "assets/img/player/man_idle1.png", {
            frameWidth: 50,
            frameHeight: 37
        });
        this.myScene.load.spritesheet("playerRUN", "assets/img/player/man_run.png", {
            frameWidth: 50,
            frameHeight: 37
        });
        this.myScene.load.spritesheet("playerJUMP", "assets/img/player/man_jump.png", {
            frameWidth: 50,
            frameHeight: 37
        });
        this.myScene.load.spritesheet("playerDASH", "assets/img/player/man_dash.png", {
            frameWidth: 50,
            frameHeight: 37
        });
    }

    create() {
        
        // Crear las animaciones para idle, run y jump
        this.myScene.anims.create({
            key: "idle",
            frameRate: 4,
            frames: this.myScene.anims.generateFrameNumbers("playerIDLE", { start: 0, end: 3 }),
            repeat: -1
        });
        this.myScene.anims.create({
            key: "run",
            frameRate: 10,
            frames: this.myScene.anims.generateFrameNumbers("playerRUN", { start: 0, end: 5 }),
            repeat: -1
        });
        this.myScene.anims.create({
            key: "jumpup",
            frameRate: 3,
            frames: this.myScene.anims.generateFrameNumbers("playerJUMP", { start: 0, end: 3 }),
            repeat: 0
        });
        this.myScene.anims.create({
            key: "dash",
            frameRate: 2,
            frames: this.myScene.anims.generateFrameNumbers("playerDASH", { start: 0, end: 2 }),
            repeat: 0
        });

        // Crear el sprite del jugador
        this.player = this.myScene.physics.add.sprite(100, 300, 'playerIDLE');
        this.player.body.setSize(this.player.width * 0.45, this.player.height * 0.7);
        this.player.body.setOffset(this.player.width * 0.3, this.player.height * 0.1);
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);
        this.player.setScale(2);

        // Asignar las teclas
        this.right = this.myScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.left = this.myScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.jump = this.myScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.jumpW = this.myScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); // Añadido para la tecla W
        this.dash = this.myScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)

    
    }

    update(time, delta) {
        if (this.isDashing) {
            if (this.player.flipX) {
                this.player.setVelocityX(-this.dashSpeed);
                if (this.player.x <= this.dashTargetX || this.player.body.blocked.left) {
                    this.player.setVelocityX(0);
                    this.player.x = this.dashTargetX;
                    this.isDashing = false;
                    this.player.anims.play('idle', true);
                }
            } else {
                this.player.setVelocityX(this.dashSpeed);
                if (this.player.x >= this.dashTargetX || this.player.body.blocked.right) {
                    this.player.setVelocityX(0);
                    this.player.x = this.dashTargetX;
                    this.isDashing = false;
                    this.player.anims.play('idle', true);
                }
            }
            return;
        }

        this.player.setVelocityX(0);

        if (this.right.isDown) {
            this.player.setVelocityX(200);
            this.player.flipX = false;
            this.player.anims.play('run', true);
        } else if (this.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.flipX = true;
            this.player.anims.play('run', true);
        } else {
            if (this.player.body.onFloor()) {
                this.player.anims.play('idle', true);
            }
        }

        // SALTO: Responder tanto a la tecla SPACE como a la W
        if ((this.jump.isDown || this.jumpW.isDown) && this.player.body.onFloor() && this.canJump && !this.jumpKeyPressed) {
            this.jumpKeyPressed = true;
            this.canJump = false;
            this.isJumping = true;
            this.jumpTime = 0;
            this.player.setVelocityY(this.initialJumpVelocity);
            this.player.anims.play('jumpup', true);
            this.jumpCount++;
        }

        if (!this.player.body.onFloor() && !this.isJumping && this.jumpCount < 1 && (this.jump.isDown || this.jumpW.isDown) && this.canJump && !this.jumpKeyPressed) {
            this.jumpKeyPressed = true;
            this.canJump = false;
            this.isJumping = true;
            this.jumpTime = 0;
            this.player.setVelocityY(this.initialJumpVelocity);
            this.player.anims.play('jumpup', true);
            this.jumpCount++;
        }

        if (this.jump.isUp && this.jumpW.isUp) {
            this.jumpKeyPressed = false;
        }

        if (this.isJumping) {
            this.jumpTime += delta;

            if ((this.jump.isDown || this.jumpW.isDown) && this.jumpTime < this.maxJumpTime) {
                let jumpFactor = this.jumpTime / this.maxJumpTime;
                let currentJumpVelocity = this.initialJumpVelocity + (this.maxJumpVelocity - this.initialJumpVelocity) * jumpFactor;
                this.player.setVelocityY(currentJumpVelocity);
                this.player.anims.play('jumpup', true);
            } else {
                this.isJumping = false;
            }
        }

        if (!this.player.body.onFloor() && !this.isJumping) {
            this.player.anims.stop('jumpup');
            this.player.setTexture('playerJUMP', 0);
        }

        if (this.player.body.onFloor()) {
            this.canJump = true;
            this.jumpCount = 0;
        }

        if (this.dash.isDown && !this.isDashing && this.canDash && !this.dashKeyPressed) {
            this.dashKeyPressed = true;
            this.isDashing = true;
            this.canDash = false;
            if (this.player.flipX) {
                this.dashTargetX = Math.max(this.player.x - this.dashDistance, 0);
            } else {
                this.dashTargetX = Math.min(this.player.x + this.dashDistance, this.myScene.physics.world.bounds.width);
            }
            this.player.anims.play('dash', true);
        }

        if (this.dash.isUp) {
            this.dashKeyPressed = false;
            this.canDash = true;
        }
    }
}


