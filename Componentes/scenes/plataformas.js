export class Plataformas {
    constructor(scene) {
        this.myScene = scene;
    }

    preload() {
        console.log("Preloading assets...");
        this.myScene.load.image('tilesF', 'assets/img/Free.png');
        this.myScene.load.image('tilesM', 'assets/img/Mockup.png');
        this.myScene.load.tilemapTiledJSON('tilemapJSON', '../json2/nivel1.json');
    }

    create() {
        console.log("Creating tilemap...");
        this.map = this.myScene.make.tilemap({ key: 'tilemapJSON' });

        if (!this.map) {
            console.error("Tilemap could not be created");
            return;
        }

        console.log("Adding tileset images...");
        this.tilesetF = this.map.addTilesetImage('Free', 'tilesF');
        this.tilesetM = this.map.addTilesetImage('Mockup', 'tilesM');

        if (!this.tilesetF || !this.tilesetM) {
            console.error("Tilesets could not be added");
            return;
        }

        console.log("Creating layers...");
        this.layer2 = this.map.createLayer("fondo", [this.tilesetF, this.tilesetM], 0, 0);
        this.layer1 = this.map.createLayer("plataformas", [this.tilesetF, this.tilesetM], 0, 0);

        if (!this.layer1) {
            console.error("Layers could not be created");
            return;
        }

        this.layer1.setCollisionByProperty({ collision: true });

        console.log("Tilemap and layers created successfully");

        // Escalar las capas para que se vean más grandes
        const scaleFactor = 2; // Ajusta este valor para aumentar o disminuir el tamaño del mapa
        this.layer1.setScale(scaleFactor);
        this.layer2.setScale(scaleFactor);

        // Ajustar el tamaño del mundo según el tamaño escalado del mapa
        this.myScene.physics.world.setBounds(0, 0, this.map.widthInPixels * scaleFactor, this.map.heightInPixels * scaleFactor);

        // Ajustar la cámara para hacer zoom
        const zoomFactor = 1.5; // Ajusta este valor para acercar o alejar la cámara
        this.myScene.cameras.main.setZoom(zoomFactor);

        // Centrar la cámara en el jugador o en el centro del mapa escalado
        if (this.myScene.player) {
            this.myScene.cameras.main.startFollow(this.myScene.player);
        } else {
            // Si no tienes un jugador aún, centra la cámara en el centro del mapa escalado
            this.myScene.cameras.main.setBounds(0, 0, this.map.widthInPixels * scaleFactor, this.map.heightInPixels * scaleFactor);
            this.myScene.cameras.main.centerOn((this.map.widthInPixels * scaleFactor) / 2, (this.map.heightInPixels * scaleFactor) / 2);
        }
    }
}
