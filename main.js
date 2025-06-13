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

        // Referencias a la música
        this.musicaJuego = document.getElementById("musica-juego");
        this.musicaPerder = document.getElementById("musica-perder");
        this.musicaComer = document.getElementById("musica-comer");
        this.musicaMeteorito = document.getElementById("musica-meteorito");
        this.musicaGanar = document.getElementById("musica-ganar");

        // Controles de audio del HTML
        this.volumenControl = document.getElementById("volumen-juego");
        this.muteControl = document.getElementById("mute-juego");

        // Evento para cambiar volumen
        this.volumenControl.addEventListener("input", (e) => {
            this.musicaJuego.volume = parseFloat(e.target.value);
                // Si marca volumen, no está en mute
                if (this.musicaJuego.volume > 0 && this.musicaJuego.muted) {
                    this.musicaJuego.muted = false;
                    this.muteControl.checked = false;
                }

        });

        // Evento para silenciar / activar sonido
        this.muteControl.addEventListener("change", (e) => {
            this.musicaJuego.muted = e.target.checked;
        });

        // Iniciar música al primer evento de teclado
        window.addEventListener("keydown", () => {
            if (this.musicaJuego.paused) {
                this.musicaJuego.play();
            }
        }, { once: true });
    
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
        }, 3000); // nuevo meteorito aparece cada 3 segundos

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
                    //Cada vez que colisiona suena el audio
                    this.musicaComer.currentTime = 0;  // reinicia el audio
                    this.musicaComer.play(); 
                }
            })

            this.meteoritos.forEach((meteorito, index) => {
                if (this.personaje.colisionaCon(meteorito)) {
                    this.container.removeChild(meteorito.element);
                    this.meteoritos.splice(index, 1)
                    this.actualizarVida(-1);
                    //Cada vez que colisiona suena el audio
                    this.musicaMeteorito.currentTime = 0;  // reinicia el audio
                    this.musicaMeteorito.play(); 
                }
            })

        },100)
    }

    actualizarPuntuacion(puntos) {
        this.puntuacion += puntos;
        this.puntosElement.textContent = `Puntos: ${this.puntuacion}`

        if (this.puntuacion === 50) {
            //Parar música juego y reproducir música ganar
            this.musicaJuego.pause();
            this.musicaGanar.play();

            alert("¡Dino se ha salvado! ✨");
            
            // Esperar 2 segundos antes de recargar
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    }

    actualizarVida(cambio) {
        this.vidas += cambio;

        // Actualizar en el DOM
        this.vidasElement.textContent = "Vidas: " + "♥️".repeat(this.vidas);

        // Si te quedas sin vidas, termina el juego
        if (this.vidas <= 0) {
            //Parar música juego y reproducir música perder
            this.musicaJuego.pause();
            this.musicaPerder.play();

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
        let alturaMaxima = this.y - 250;
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



