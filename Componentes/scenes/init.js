import { Level1Scene } from './level1.js';


// Configuración del juego Phaser
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "container",
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    dom: {
        createContainer: true // Permitir el uso de DOMElement
    },
    render: {
        pixelArt: true,
        antialias: true,
        antialiasGL: true,
        roundPixels: false
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 2500 },
            debug: true
        }
    }
};

let game = new Phaser.Game(config);

function preload() {
    console.log("Cargando imagen...");
    this.load.image("menu", "assets/menuiniciofon.jpg");
    this.load.image('newGameBackground', './assets/scenenp.jpg'); // Imagen para la nueva partida

    // Carga la música de fondo
    this.load.audio('music', ['assets/02 Cornfield Chase.mp3', './assets/02 Cornfield Chase.ogg']);
}

// Clase de la escena de configuración de nueva partida
class NewGameSetupScene extends Phaser.Scene {
    constructor() {
        super({ key: 'NewGameSetupScene' });
    }

    preload() {
        console.log("Cargando recursos de configuración de la nueva partida...");
        // Cargar la imagen que se mostrará en esta escena
        this.load.image('newGameBackground', './Componentes/assets/nuevaimagen.jpg');
        // Cargar el video
        this.load.video('introVideo', 'assets/vidincio.mp4', 'loadeddata', false, true);
    }

    create() {
        let screenWidth = this.sys.game.config.width;
        let screenHeight = this.sys.game.config.height;

        // Mostrar la imagen de fondo de nueva partida
        let image = this.add.image(screenWidth / 2, screenHeight / 2, 'newGameBackground');
        let scaleX = screenWidth / image.width;
        let scaleY = screenHeight / image.height;
        let scale = Math.max(scaleX, scaleY);
        image.setScale(scale).setScrollFactor(0);

        //Agrega contenedor//
        let formContainer = this.add.container(screenWidth / 2, screenHeight / 2);

        let formBg = this.add.rectangle(0, 0, 500, 300, 0x000000, 0.5)
        .setStrokeStyle(2, 0xffffff);

     // Añadir el fondo al contenedor
        formContainer.add(formBg);

        // Crear el formulario sobre la imagen
        let formX = screenWidth / 2 - 150; // Ajusta para centrar el formulario
        let formY = screenHeight / 2 - 100; // Ajusta para centrar el formulario

        // Etiqueta de nombre
        let nameLabel = this.add.text(formX, formY, "Nombre:", {
            fontFamily: 'Courier New, Courier, monospace',
            fontSize: '28px',
            fill: '#ffffff',
            align: 'right',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 2,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5, 0.5);

        let nameInputBg = this.add.rectangle(formX + 160, formY, 200, 40, 0x000000, 0.8)
        .setOrigin(0, 0.5)
        .setStrokeStyle(2, 0xffffff);

        // Campo de entrada de nombre
        let nameInput = this.add.dom(formX + 160, formY, 'input', {
            type: 'text',
            fontSize: '20px',
            backgroundColor: 'transparent',
            color: '#ffffff',
            padding: '10px',
            border: 'none',
            outline: 'none',
            width: '180px'
        }).setOrigin(0, 0.5);

        nameInput.node.focus();

        // Etiqueta de dificultad
        let difficultyLabel = this.add.text(formX, formY + 80, "Dificultad:", {
            fontFamily: 'Courier New, Courier, monospace',
            fontSize: '28px',
            fill: '#ffffff',
            align: 'right',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 2,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5, 0.5);
        
        // Fondo para el selector de dificultad
        let difficultySelectBg = this.add.rectangle(formX + 160, formY + 80, 200, 40, 0x000000, 0.8)
            .setOrigin(0, 0.5)
            .setStrokeStyle(2, 0xffffff);
            

        // Selector de dificultad
        let difficultySelect = this.add.dom(formX + 160, formY + 80, 'select', {
            fontSize: '20px',
            backgroundColor: '#000000',
            color: '#ffffff',
            padding: '10px',
            border: 'none',
            outline: 'none',
            width: '200px',
            appearance: 'none'
        }).setOrigin(0, 0.5);

        difficultySelect.node.innerHTML = `
            <option value="principiante">Principiante</option>
            <option value="promedio">Promedio</option>
            <option value="experto">Experto</option>
        `;

        // Botón de crear partida
        let createButton = this.add.text(screenWidth / 2, formY + 150, "Crear Partida", {
            fontFamily: 'Courier New, Courier, monospace',
            fontSize: '28px',
            backgroundColor: 'transparent',
            fill: '#ffffff',
            align: 'center',
            padding: {
                x: 20,
                y: 10
            },
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        createButton.setInteractive();
        createButton.on('pointerover', () => createButton.setAlpha(0.8));
        createButton.on('pointerout', () => createButton.setAlpha(1));
        createButton.on('pointerdown', () => {
            let playerName = nameInput.node.value.trim();
            let difficulty = difficultySelect.node.value;

            if (playerName === '') {
                alert('Por favor ingresa su nombre para iniciar la partida.');
                return;
            }

            console.log(`Nueva Partida: Nombre=${playerName}, Dificultad=${difficulty}`);

            // Pasar a la escena del video con los parámetros del jugador
            this.scene.start('VideoScene');
        });

        console.log("Formulario de Nueva Partida cargado correctamente.");
    }
}

class VideoScene extends Phaser.Scene { 
    constructor() {
        super({ key: 'VideoScene' });
    }

    preload() {
        console.log("Cargando recursos de la escena del video...");
        // Asegúrate de que el video esté cargado en preload de la escena de configuración o de la escena actual
        // this.load.video('introVideo', 'assets/vidincio.mp4', 'loadeddata', false, true);
    }

    create() {
        console.log("Reproduciendo el video...");

        // Dimensiones de la pantalla
        let screenWidth = this.sys.game.config.width;
        let screenHeight = this.sys.game.config.height;

        // Añadir el video
        let video = this.add.video(screenWidth / 2, screenHeight / 2, 'introVideo');

        // Calcular la escala para que el video ocupe casi toda la pantalla
        let scaleX = screenWidth / video.width;
        let scaleY = screenHeight / video.height;
        let scale = Math.max(scaleX, scaleY);

        // Reducir un poco la escala para que no cubra completamente la pantalla
        let adjustedScale = scale * 0.29; // Ajuste la escala al 90% de la escala máxima calculada
        
        // Aplicar la escala ajustada y centrar el video
        video.setScale(adjustedScale);
        video.setOrigin(0.5, 0.5);
        video.setPosition(screenWidth / 2, screenHeight / 2);

        // Reproducir el video
        video.play(true);

        // Evento cuando el video termina
        video.on('complete', () => {
            console.log("El video ha terminado.");
            // Cambia a la escena del Nivel 1 después del video
            this.scene.start('Level1Scene');
        });

        // Evento cuando el video se carga completamente
        video.on('loadeddata', () => {
            console.log("El video se ha cargado completamente.");
            // Reajusta la escala en caso de que el tamaño del video cambie
            let scaleX = screenWidth / video.width;
            let scaleY = screenHeight / video.height;
            let scale = Math.max(scaleX, scaleY);
            let adjustedScale = scale * 0.9; // Aplica la misma reducción aquí
            video.setScale(adjustedScale);
            video.setPosition(screenWidth / 2, screenHeight / 2);

            video.video.setAttribute('playsinline', '');
            video.video.setAttribute('controls', ''); // Añadir controles de video opcionales
            video.video.style.filter = 'contrast(1.2) brightness(1.1)'; // Mejorar contraste y brillo

            video.video.playbackRate = 1.5;
        
        });
        
        //Tecla Enter detiene el video//
        this.input.keyboard.on('keydown-ENTER', () => {
            console.log("Tecla Enter presionada - Omitiendo video.");
            video.stop(); // Detener el video
            this.scene.start('Level1Scene'); // Cambiar a la escena del Nivel 1
        });
    }
}

// Añadir la escena de configuración de nueva partida al juego
game.scene.add('NewGameSetupScene', NewGameSetupScene);
// Añadir la escena del video al juego
game.scene.add('VideoScene', VideoScene);
// Añadir la escena del nivel 1 al juego
game.scene.add('Level1Scene', Level1Scene);

function create() {
    let screenWidth = this.sys.game.config.width;
    let screenHeight = this.sys.game.config.height;

    let background = this.add.image(screenWidth / 2, screenHeight / 2, "menu");
    console.log("Dimensiones de la imagen de fondo:", background.width, background.height);

    if (background.width === 0 || background.height === 0) {
        console.error("La imagen de fondo no se ha cargado correctamente o está dañada.");
        return;
    }

    let scaleX = screenWidth / background.width;
    let scaleY = screenHeight / background.height;
    let scale = Math.max(scaleX, scaleY);
    background.setScale(scale).setScrollFactor(0);

    console.log("Imagen de fondo cargada y añadida correctamente.");

    // Reproduce la música de fondo
    let music = this.sound.add('music', { loop: true });
    music.play();

    // Llama a la función para mostrar la pantalla inicial
    showInitialScreen.call(this);
}

function showInitialScreen() {
    let screenWidth = this.sys.game.config.width;
    let screenHeight = this.sys.game.config.height;

    let promptText = this.add.text(screenWidth / 2, screenHeight - 50, "Pulsa cualquier tecla para continuar", {
        fontFamily: 'Courier New, Courier, monospace',
        fontSize: '32px',
        fill: '#ffffff',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 4
    }).setOrigin(0.5);

    this.tweens.add({
        targets: promptText,
        alpha: 0,
        duration: 1000,
        ease: 'Linear',
        yoyo: true,
        repeat: -1
    });

    this.input.keyboard.once('keydown', () => {
        promptText.setVisible(false);
        showMenuButtons(this, screenWidth, screenHeight);
    });

    // Guardar la referencia para poder mostrarlo de nuevo
    this.promptText = promptText;
}

function showMenuButtons(scene, screenWidth, screenHeight) {
    let buttonY = screenHeight - 150; // Baja los botones más hacia el borde inferior
    let spacing = 50; // Ajusta el espaciado para que los botones estén más juntos

    // Botón de Nueva Partida
    let newGameButtonText = scene.add.text(screenWidth / 2, buttonY, "Nueva Partida", {
        fontFamily: 'Courier New, Courier, monospace',
        fontSize: '32px',
        fill: '#ffffff',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 4,
        alpha: 0.6
    }).setOrigin(0.5);

    newGameButtonText.setInteractive();
    newGameButtonText.on('pointerover', () => newGameButtonText.setAlpha(1));
    newGameButtonText.on('pointerout', () => newGameButtonText.setAlpha(0.6));
    newGameButtonText.on('pointerdown', () => {
        // Cambia a la escena de configuración de la nueva partida
        scene.scene.start('NewGameSetupScene');
    });

    // Botón de Cargar Partida
    let loadGameButtonText = scene.add.text(screenWidth / 2, buttonY + spacing, "Cargar Partida", {
        fontFamily: 'Courier New, Courier, monospace',
        fontSize: '32px',
        fill: '#ffffff',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 4,
        alpha: 0.6
    }).setOrigin(0.5);

    loadGameButtonText.setInteractive();
    loadGameButtonText.on('pointerover', () => loadGameButtonText.setAlpha(1));
    loadGameButtonText.on('pointerout', () => loadGameButtonText.setAlpha(0.6));
    loadGameButtonText.on('pointerdown', () => {
        // Lógica para cargar una partida guardada (no implementada aquí)
        console.log('Cargar Partida clicado');
    });

    // Botón de Salir
    let exitButtonText = scene.add.text(screenWidth / 2, buttonY + spacing * 2, "Salir", {
        fontFamily: 'Courier New, Courier, monospace',
        fontSize: '32px',
        fill: '#ffffff',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 4,
        alpha: 0.6
    }).setOrigin(0.5);

    exitButtonText.setInteractive();
    exitButtonText.on('pointerover', () => exitButtonText.setAlpha(1));
    exitButtonText.on('pointerout', () => exitButtonText.setAlpha(0.6));
    exitButtonText.on('pointerdown', () => {
        // Acción de salida del juego
        // Redirige a una URL específica o cierra la pestaña
        console.log('Salir clicado');

        // Redirigir a una URL específica (puede ser una página de "Gracias por jugar")
        window.location.href = "https://example.com/gracias-por-jugar";

        // Alternativamente, para cerrar la pestaña (esto solo funciona en algunos navegadores)
        // window.close();
    });
}

function update() {
    // Este método se puede usar para actualizaciones continuas
}
