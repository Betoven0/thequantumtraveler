import { Player } from './player.js';
import { Plataformas } from './plataformas.js';
import { Enemy } from './enemy.js';  // Importar la clase Enemy

export class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1Scene' });
    }

    preload() {
        this.player = new Player(this);
        this.plataformas = new Plataformas(this);
        
        // Crear una lista de enemigos
        this.enemies = [
            new Enemy(this, 700, 300),
            new Enemy(this, 900, 300),
            new Enemy(this, 1200, 300),
            new Enemy(this, 1600, 300),
            new Enemy(this, 2200, 300),
            new Enemy(this, 2700, 300),
            new Enemy(this, 3800, 300),
            new Enemy(this, 4900, 300),
            // Añadir más enemigos según sea necesario
        ];

        this.player.preload();
        this.plataformas.preload();

        // Preload de todos los enemigos
        this.enemies.forEach(enemy => enemy.preload());
    }

    create() {
        this.plataformas.create();
        this.player.create();

        // Crear todos los enemigos
        this.enemies.forEach(enemy => enemy.create());

        // Colisiones entre el jugador y las plataformas
        this.physics.add.collider(this.player.player, this.plataformas.layer1);

        // Colisiones entre cada enemigo y las plataformas
        this.enemies.forEach(enemy => {
            this.physics.add.collider(enemy.enemy, this.plataformas.layer1);
        });

        // Colisiones entre el jugador y cada enemigo
        this.enemies.forEach(enemy => {
            this.physics.add.collider(this.player.player, enemy.enemy, this.handlePlayerEnemyCollision, null, this);
        });

        this.cameras.main.startFollow(this.player.player);
    }

    update(time, delta) {
        this.player.update(time, delta);

        // Actualizar todos los enemigos
        this.enemies.forEach(enemy => enemy.update(time, delta));
    }

    handlePlayerEnemyCollision(player, enemy) {
        // Lógica de colisión entre el jugador y el enemigo
        console.log('El jugador ha colisionado con el enemigo');
        // Puedes añadir aquí efectos como daño al jugador, empujar al jugador, etc.
    }
}
