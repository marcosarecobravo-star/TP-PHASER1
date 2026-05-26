// URL to explain PHASER scene: https://rexrainbow.github.io/phaser4.10-rex-notes/docs/site/scene/
export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
  }

  preload() {
    // Cargamos imágenes
    this.load.image("sky", "public/assets/Cielo.webp");
    this.load.image("ground", "public/assets/platform.png");
    this.load.image("player", "public/assets/Ninja.png");
    this.load.image("square", "public/assets/square.png");
    this.load.image("triangle", "public/assets/triangle.png");
    this.load.image("diamond", "public/assets/diamond.png");
    this.load.image("bad", "public/assets/forma_mala2.png");
  }

  create() {
  this.add.image(400, 300, "sky").setScale(4);

  this.platforms = this.physics.add.staticGroup();

  let suelo = [
    this.platforms.create(400, 580, "ground"),
    this.platforms.create(100, 400, "ground"),
    this.platforms.create(750, 200, "ground"),
    this.platforms.create(400, 250, "ground"),
  ];
// Ajustamos el tamaño del suelo para que cubra toda la pantalla y refrescamos su cuerpo para que se actualicen las colisiones.
  suelo[0].displayWidth = 800;
  suelo[0].displayHeight = 50;
  suelo[0].refreshBody();
  for (let i = 1; i < suelo.length; i++) {
    suelo[i].displayWidth = 200;
    //suelo[0].displayHeight = 50;
    //suelo[0].displayWidth = 800;
    suelo[i].refreshBody();
  }
  
//posicionamiento del Sprite, setScale para ajustar el tamaño.
  this.player = this.physics.add.sprite(500, 500, "player").setScale(0.14);
// setBounce para que el sprite rebote un poco al caer, setCollideWorldBounds para que no salga del mundo del juego. 
  this.player.setBounce(0.1);
  this.player.setCollideWorldBounds(true);
// agrega colisiòn entre el jugador y las plataformas para que este pueda pararse sobre ellas.
  this.physics.add.collider(this.player, this.platforms);
// createCursorKeys para crear un objeto que nos permita detectar las teclas de dirección
  this.cursors = this.input.keyboard.createCursorKeys();
// Creamos un grupo de objetos para los ítems que caerán del cielo
  this.items = this.physics.add.group();
// Creamos un evento que se repetirá cada segundo para actualizar el tiempo restante.
  this.timerEvent = this.time.addEvent({
    delay: 1000,
    callback: this.actualizarTiempo,
    callbackScope: this,
    loop: true,
  });
// agregamos colisiónes entre los items y las plataformas
  this.physics.add.collider(this.items, this.platforms);
  // agregamos una superposición entre el jugador y los items para detectar cuando el jugador recoge un item.
  this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);
  // Inicializamos el tiempo restante, el puntaje y el estado del juego.
  this.tiempo = 30;
// Mostramos el tiempo restante y el puntaje en pantalla.
  this.tiempoTexto = this.add.text(580, 16, "Tiempo: 30", {
    fontSize: "32px",
    fill: "#ffffff",
  });
  this.spawnEvent = this.time.addEvent({
    delay: 500,
    callback: this.spawnItem,
    callbackScope: this,
    loop: true,
  });
  this.gameOver = false;
  this.puntos = 0;
// Mostramos el puntaje en pantalla.
  this.puntosTexto = this.add.text(16, 16, "Puntos: 0", {
    fontSize: "32px",
    fill: "#ffffff",
  });
}

update() {
  if (this.gameOver) return;

  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-160);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(160);
  } else {
    this.player.setVelocityX(0);
  }
// 
  if (this.cursors.up.isDown && this.player.body.touching.down) {
    this.player.setVelocityY(-330);
  }
  this.items.children.forEach((item) => {
  if (!item) return;

  // Si está tocando el piso
  if (item.body.blocked.down) {
    
    // Evitar que descuente muchas veces seguidas
    if (!item.reboto) {
        item.vida -= 5;
        item.reboto = true;

        // Si se queda sin vida → desaparece
        if (item.vida == 0 || item.vida == -20) {
          item.destroy();
       }
     }
  } else {
    // Resetear flag cuando deja de tocar el piso
    item.reboto = false;
  }
  });
}
// Función para generar un nuevo ítem en una posición aleatoria en la parte superior de la pantalla cada cierto tiempo.
spawnItem() {
  if (this.gameOver) return;
  const types = ["square", "triangle", "diamond", "bad"];
  const randomType = Phaser.Utils.Array.GetRandom(types);
  const x = Phaser.Math.Between(50, 750);

  const item = this.items.create(x, 0, randomType);
// Ajustamos las propiedades del ítem según su tipo 
  item.setScale(0.9);
  item.setBounce(0.3);
  item.setCollideWorldBounds(true);
  item.setVelocityY(Phaser.Math.Between(100, 300));
  if (randomType === "square") {
    item.vida = 10;
  } else if (randomType === "triangle") {
    item.vida = 15;
  } else if (randomType === "diamond") {
    item.vida = 20;
  } else if (randomType === "bad") {
    item.vida = -10;
  }
  item.setBounce(0.5);
}
// Función para recoger un ítem cuando el jugador lo toca
collectItem(player, item) {
  if (this.gameOver) return;

  this.puntos += item.vida;

  this.puntosTexto.setText("Puntos: " + this.puntos);

  item.destroy();

  if (this.puntos >= 100) {
    this.ganarJuego();
  }
}
// Función para actualizar el tiempo restante cada segundo
actualizarTiempo() {
  this.tiempo--;

  this.tiempoTexto.setText("Tiempo: " + this.tiempo);

  if (this.tiempo <= 0) {
    this.finDelJuego();
  }
}
// Función para finalizar el juego cuando se acaba el tiempo o el jugador pierde 
finDelJuego() {
  this.gameOver = true;

  this.physics.pause();
  this.spawnEvent.remove();
  this.timerEvent.remove();

  this.scene.start("game-over", {
    resultado: "perdiste",
    puntos: this.puntos,
  });
}
ganarJuego() {
  this.gameOver = true;

  this.physics.pause();
  this.spawnEvent.remove();
  this.timerEvent.remove();

  this.scene.start("game-over", {
    resultado: "ganaste",
    puntos: this.puntos,
  });
}
}