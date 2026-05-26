export default class gameover extends Phaser.Scene {
  constructor() {
    super("game-over");
  }
// El método init se ejecuta antes de create y recibe un objeto con los datos que se le pasan al cambiar de escena. En este caso, recibimos el resultado del juego ("ganaste" o "perdiste") y el puntaje final.
  init(data) {
    this.resultado = data.resultado; // "ganaste" o "perdiste"
    this.puntos = data.puntos;
  }
// El método create se encarga de mostrar el mensaje de fin de juego, el puntaje y la instrucción para reiniciar el juego. También configura un evento para reiniciar el juego al presionar la tecla SPACE
  create() {
    let mensaje = this.resultado === "ganaste" ? "GANASTE" : "PERDISTE";

    this.add.text(250, 200, mensaje, {
      fontSize: "48px",
      fill: "#ffffff",
    });

    this.add.text(250, 300, "Puntaje: " + this.puntos, {
      fontSize: "32px",
      fill: "#ffff00",
    });

    this.add.text(200, 400, "Presiona SPACE para reiniciar", {
      fontSize: "24px",
      fill: "#ffffff",
    });

    // Reiniciar juego
    this.input.keyboard.on("keydown-SPACE", () => {
      this.scene.start("hello-world");
    });
  }
}