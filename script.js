window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    startGame();
  };

  document.addEventListener("keydown", (e) =>{
      switch(e.key){
        case "a":
          case "ArrowLeft":
            player.moveLeft();
            break;
        case "d":
          case "ArrowRight":
            player.moveRight();
            break;
      }
  });

  const scoreElement = document.getElementById("score");


  function startGame() {
    updateCanvas();
  }

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let animationId = null;
    const marginLeft = 60;
    const marginRight = canvas.width - marginLeft;
    let frame = 0;
    let score = 0;

    function updateCanvas(){
        frame += 1;
        showScore();
        clearCanvas();
        background.draw();
        player.draw();
        const crash = updateObstacles();
        if(!crash){
          animationId = requestAnimationFrame(updateCanvas);
        }else{
          stopGame();
          gameOver();
        }
    }

    function clearCanvas(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function stopGame(){
      console.log("stop!", animationId);
      cancelAnimationFrame(animationId);
    }

    function showScore(){
      scoreElement.innerText = score;
    }

    function gameOver(){
      clearCanvas();
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'red';
      ctx.fillText = ("End of Mission!!!", 210, 300);
    }

    class Background{
      constructor (source){
        this.posX = 0;
        this.posY = 0;

        const img = new Image();
        img.src = source;
        img.onload = () =>{
          this.img = img;
        };
      }
      

    draw(){
        ctx.drawImage(
          this.img,
          this.posX,
          this.posY,
          canvas.width,
          canvas.height
        );
      }
    }
    const background = new Background("./images/fundo.png");
  

  class Nave{
      constructor(source, x, y, w, h){
        this.posX = x;
        this.posY = y;
        this.width = w;
        this.height = h;
        this.speed = 10;

        const img = new Image();
        img.src = source;
        img.onload = () => {
          this.img = img;
        };
      }
      draw(){
        ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
      }

      top(){
        return this.posY;
      }

      bottom(){
        return this.posY + this.height;
      }

      left(){
        return this.posX;
      }

      right(){
        return this.posX + this.width;
      }

      moveLeft(){
        if(this.posX > marginLeft){
        this.posX -= this.speed;
      }
    }

      moveRight(){
        if(this.posX < marginRight - this.width){
        this.posX += this.speed;
      }
    }

    checkCollision(obstacle){
      return !(
      this.top() > obstacle.bottom()  ||
       this.bottom() < obstacle.top() || 
       this.left() > obstacle.right() || 
       this.right() < obstacle.left()
       );
     }
    }

   const player = new Nave("./images/nave.png", 210, 400, 100, 160);

class Obstacle{
    constructor (x, w){
      this.posX = x;
      this.posY = 0;
      this.width = w;
      this.height = 60;
      this.speed = 5;
    }

    draw(){
    ctx.fillStyle = "black";
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
  }
    move(){
        this.posY += this.speed;
    }
    top(){
      return this.posY;
    }

    bottom(){
      return this.posY + this.height;
    }

    left(){
      return this.posX;
    }

    right(){
      return this.posX + this.width;
    }
  }
  
  const obstacles = [];

  function createObstacle(){
    const minWidth = player.width;
    const maxWidth = marginRight - marginLeft - player.width - 20;

    const width = Math.floor(Math.random() * (maxWidth - minWidth)) + minWidth;

    const posX = Math.floor(Math.random() * maxWidth) + marginLeft;

    const obstacle = new Obstacle(posX, width);
    obstacles.push(obstacle);
  }

  function updateObstacles(){
    for(let i = 0; i < obstacles.length; i += 1){
        obstacles[i].move();
        obstacles[i].draw();
        if(obstacles[i].posY > canvas.height){
              obstacles.shift();
              score += 1;
        }
        if(player.checkCollision(obstacles[i])){
            return true;
        }
    }
    if(frame % 90 === 0){
      createObstacle();
    }
  }
};