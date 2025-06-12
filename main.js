class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.personaje = null;
        this.monedas = [];
        this.meteoritos = [];
        this.puntuacion = 0;
        this.vidas = 3;
        this.crearEscenario();
        this.agregarEventos();
        this.puntosElement = document.getElementById("puntos");
        this.vidasElement = document.getElementById("vidas");
    }

    crearEscenario(){
        this.personaje = new Personaje();
        this.container.appendChild(this.personaje.element);

        for(let i = 0; i < 5; i ++) {
            const moneda = new Moneda();
            this.monedas.push(moneda);
            this.container.appendChild(moneda.element);
        }

        for (let i = 0; i < 3; i++) {
            const meteorito = new Meteorito();
            this.meteoritos.push(meteorito);
            this.container.appendChild(meteorito.element);
        }

        setInterval(() => {
            const meteorito = new Meteorito();
            this.meteoritos.push(meteorito);
            this.container.appendChild(meteorito.element);
        }, 3000); // un nuevo meteorito aparece cada 3 segundos

    }
    agregarEventos(){
        window.addEventListener("keydown", (e) => this.personaje.mover(e));
        this.checkColisiones();
    }

    checkColisiones(){
        setInterval(() => {
            this.monedas.forEach((moneda, index) => {
                if (this.personaje.colisionaCon(moneda)) {
                    this.container.removeChild(moneda.element);
                    this.monedas.splice(index,1)
                    this.actualizarPuntuacion(10);
                }
            })

            this.meteoritos.forEach((meteorito, index) => {
                if (this.personaje.colisionaCon(meteorito)) {
                    this.container.removeChild(meteorito.element);
                    this.meteoritos.splice(index, 1)
                    this.actualizarVida(-1);
                }
            })

        },100)
    }

    actualizarPuntuacion(puntos) {
        this.puntuacion += puntos;
        this.puntosElement.textContent = `Puntos: ${this.puntuacion}`
    }

    actualizarVida(cambio) {
        this.vidas += cambio;

        // Actualizar en el DOM
        this.vidasElement.textContent = "Vidas: " + "♥️".repeat(this.vidas);

        // Si te quedas sin vidas, termina el juego
        if (this.vidas <= 0) {
            alert("¡Extinción!☄️🦕 Inténtalo de nuevo 🙂");
            location.reload(); // reinicia el juego
        }
    }


}

class Personaje {
    constructor() {
        this.x = 50;
        this.y = 300;
        this.width = 50;
        this.height = 50;
        this.velocidad = 25;
        this.saltando = false;
        this.element = document.createElement("div");
        this.element.classList.add("personaje");
        this.actualizarPosicion();
    }

    mover(evento) {

        const desplazamientoMaximo = 800 - this.width; 

        if(evento.key === "ArrowRight") {
            this.x += this.velocidad;

            if (this.x > desplazamientoMaximo) {
                this.x = desplazamientoMaximo;
            }
        } else if(evento.key === "ArrowLeft") {
            this.x -= this.velocidad;

            if(this.x < 0) {
                this.x = 0;
            }
        } else if (evento.key === "ArrowUp" && !this.saltando) {
            this.saltar(); 
        }
            this.actualizarPosicion();
    }

    saltar() {
        this.saltando = true;
        let alturaMaxima = this.y - 200;
        const salto = setInterval( () => {
            if(this.y > alturaMaxima) {
                this.y -=20;
            }else{
                clearInterval(salto);
                this.caer();
            }
            this.actualizarPosicion();
        }

        ,20);
    }
    caer() {
        const gravedad = setInterval(() => {
            if(this.y < 300) {
                this.y += 10;
            } else {
                clearInterval(gravedad);
                this.saltando = false;
            }
            this.actualizarPosicion();
        }
            ,20)
    }
    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
    
    colisionaCon(objeto) {
        return (
          this.x < objeto.x + objeto.width &&
          this.x + this.width > objeto.x &&
          this.y < objeto.y + objeto.height &&
          this.y + this.height > objeto.y
        );
      }

}

class Moneda {
    constructor() {
        this.x = Math.random() * 700 + 50;
        this.y = Math.random() * 250 + 50;
        this.width = 30;
        this.height = 30;
        this.element = document.createElement("div");
        this.element.classList.add("moneda");
        this.actualizarPosicion();
    }
    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

}

class Meteorito extends Moneda{
    constructor() {
        super();
        this.element.classList.remove("moneda");
        this.element.classList.add("meteorito");

        this.velocidadEjeX = Math.random() * 2 + 1;
        this.velocidadEjeY = Math.random() * 1.5 + 0.5;

        this.iniciarMovimiento();
    }
    
    iniciarMovimiento() {
        this.intervaloMovimiento = setInterval(() => {
            this.x -= this.velocidadEjeX;
            this.y += this.velocidadEjeY;

            if (this.x + this.width < 0 || this.y > 400) {
                this.element.remove();
                clearInterval(this.intervaloMovimiento);
            } else {
                this.actualizarPosicion();
            }
        }, 30);
    }

}

const juego = new Game();



