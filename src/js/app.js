/* Middle Screen */
let x = 640;
let y = 305;
let ruleta; 
let puntero;

let bars = [];
// Grados de cada división de la ruleta
let divisiones = 4;
// let premios = ['1', '2', '3', '4', '5'];
let premios = [
    'Premio',
    '',
    'Premio',
    'Beneficio',
];
let rotate = false;
let spinButton;
let fireworks;
let text;
let mContext;

    /* Velocidad */
        let velocidad = 1;
        let valocity_handler = true;
        let limite;
    /* --- */

    /* Formmualrios */
        let formElem;
    /*  */ 

class MainScene extends Phaser.Scene {
    constructor(){
        super('gameScene');
    } 
 
    preload(){
        fireworks = document.getElementById('fireworks');
        this.load.image('ruleta', './assets/ruleta_2_Mesa_de_trabajo_1.png');
        this.load.image('fondo-2', './assets/NEGOCIO_KV_Fonfo.jpg');
        this.load.image('logo', './assets/logo_claro_empresas_01.png'); 
        this.load.image('header', './assets/header_1.png');
        this.load.image('puntero', './assets/puntero_mesa_de_trabajo_1.png');
        this.load.image('boton', './assets/BOTON-03.png');

        let rect2 = this.make.graphics().fillStyle(0xFFFFFF).fillRect(50, 50, 130, 25);
        rect2.generateTexture('rectangle', 250, 25);
    }
   
    create(){
        mContext = this;
        this.add.image((this.sys.game.canvas.width/2), (this.sys.game.canvas.height/2), 'fondo-2').setScale(.65, .60);
        this.add.image(350, 260, 'header').setScale(.5);
        ruleta = this.add.sprite(900, 300, 'ruleta').setScale(.7);
        puntero = this.physics.add.sprite(900, 120, 'puntero').setScale(.4);
        puntero.setSize(true, 100, 120);        
        spinButton = this.physics.add.sprite(900, 304, 'boton').setInteractive();
        bars = this.setBars(divisiones, this);
        this.add.image((this.sys.game.canvas.width) - 60, 550, 'logo').setScale(.5);
        text = this.add.text(10, 50, '', { font: '16px Courier', fill: '#ffffff' });
        const circle = new Phaser.Geom.Circle(900, 280, 160);
        this.group = this.add.group({ key: 'rectangle', frameQuantity: 14 });
        Phaser.Actions.PlaceOnCircle(bars, circle);

        spinButton.on('pointerdown', function (pointer)
        {   
            if (!rotate){
                mContext.rotarConstante();
            }else {
                mContext.detener();
                // mContext.disableInteractive();        
            }

            // game.scene.keys.gameScene.rotar();
            // spinButton.disableInteractive();
        });

        spinButton.on('pointerover', function (pointer)
        { 
            spinButton.setScale(1.2);
        });

        spinButton.on('pointerout', function (pointer)
        { 
            spinButton.setScale(1);
        });
    }

    /*  
        Crea un arreglo con elementos 
        - Inserta el nombre del premio
        - Los elementos se ordenan en el circulo de arriba hacia abajo, 
           De derecha a izquierda
    */
    setBars(divisiones, context){
        let cont = 0;
        let bars = [];
        let elem;

        while(cont < divisiones){
            elem = context.physics.add.sprite(0, 0, 'rectangle');
            elem.premio = premios[cont];
            elem.visible = false;
            bars.push(elem);
            cont++;
        } 
        return bars;
    }

    getPremio(){
        // Hace rotar las barras al ángulo del a ruleta (RotateAroundDistance funciona con radianes)
        Phaser.Actions.RotateAroundDistance(bars, { x: 900, y: 250 }, ruleta.rotation, 160);
        /* 
            El comportamiento normal del evento es ser ejecutado todo el tiempo mientrras este se cumpla.
            Con esto logro ejecutarlo solo una vez.
        */
        bars.forEach((elem) => { 
            this.physics.add.collider(elem, puntero, function(bar = elem){  
                if (bar.premio){
                    Swal.fire({
                        showConfirmButton: false,
                        width: 'max-content',
                        padding: "10%",
                        background: "rgba(255,255,255, 1) url(./assets/pop_up.jpg) center / contain no-repeat"
                    })
                    fireworks.style.visibility='visible';
                    bar.disableBody(true, true);
                }
                setTimeout(() => {
                    location.reload();
                }, 3000);
            });
        });
    }

    rotar(){
        ruleta.rotation = 0;
        velocidad = 1;
        rotate = !rotate;
        // Veolicdad aleatoria
        limite = this.getRndInteger(15, 30);
    }

    // Rotar cosntante (cambios claro)
    rotarConstante(){
        ruleta.rotation = 0;
        velocidad = 8;
        rotate = !rotate;
        // Veolicdad aleatoria
        limite = 1000;
    }

    detener(){
        rotate = !rotate;
        puntero.setAngle(0);
        this.getPremio();
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    update(){
        /* if (rotate){
                Aumenta la velocidada cada PASO.
                Hasta el límmite. 
                Luego resta la velocidad hasta cero.
                
                if (valocity_handler && velocidad > limite){
                    valocity_handler = !valocity_handler;
                }

                if (valocity_handler && !(velocidad == 0)){
                    velocidad += 1;
                }

                if (!valocity_handler && !(velocidad <= 0)){
                    velocidad -= .1;
                }
                ruleta.angle += velocidad;

                if (velocidad < 0){
                    rotate = !rotate;
                    valocity_handler = !valocity_handler;
                    puntero.setAngle(0);
                    this.getPremio();
                }

                text.setText([
                    'Sprite Rotation',
                    'Angle: ' + ruleta.angle.toFixed(2),
                    'Rotation: ' + ruleta.rotation.toFixed(2)
                ]);
            }
        */
        

        /* Rotacion constante */
        if (rotate){
            
            ruleta.angle += velocidad;

            /*text.setText([
                'Sprite Rotation',
                'Angle: ' + ruleta.angle.toFixed(2),
                'Rotation: ' + ruleta.rotation.toFixed(2)
            ]);*/
        }
    }
}
 

// Configuracion general
const config = {
    // Phaser.AUTO, intenta usa WebGL y si el navegador no lo tiene, usa canva.
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1200,
    height: 600,
    // pixelArt: true,
    // roundPixels: true,
    dom: {
        createContainer: true
    },
    scene: [MainScene],
    scale: {
        mode: Phaser.Scale.FIT
    },
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
            // gravity: { y: 350 }
        }
    }
}

// Inicializacion del objeto
const game = new Phaser.Game(config)