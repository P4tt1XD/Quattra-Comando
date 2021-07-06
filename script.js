// Estrutura do jogo OK
//Fundo OK
//player OK


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
        const crash = updateEnemies();
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
      cancelAnimationFrame(animationId);
    }

    function showScore(){
      scoreElement.innerText = score;
    }

    function gameOver(){
      clearCanvas();
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "30px fantasy";
      ctx.textAlign = "center";
      ctx.fillStyle = 'red';
      ctx.fillText("End of Mission!!!", 210, 300);
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

    checkCollision(enemy){
      return !(
       this.top() > enemy.bottom()  ||
       this.bottom() < enemy.top() || 
       this.left() > enemy.right() || 
       this.right() < enemy.left()
       );
     }
    }

   const player = new Nave("./images/nave.png", 210, 400, 100, 160);

   class Enemy{
    constructor(source, x, y, w, h){
      this.posX = x;
      this.posY = 0;
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

  const enemies = [];
  
  function createEnemy(){
    const minWidth = player.width;
    const maxWidth = marginRight - marginLeft - player.width - 20;
    const width = Math.floor(Math.random() * (maxWidth - minWidth)) + minWidth;
    const posX = Math.floor(Math.random() * maxWidth) + marginLeft;
    const enemy = new Enemy(posX, width);
    enemies.push(new Enemy('./images/enemy2.png', posX, width, 150, 150));
  }

  function updateEnemies(){
     for(let i = 0; i < enemies.length; i += 1){
       enemies[i].move();
      enemies[i].draw(); 
       
     
    if(enemies[i].posY > canvas.height){
          enemies.shift();
              score += 1;
    }
        if(player.checkCollision(enemies[i])){
            return true;
        }
        
    }
    if(frame % 90 === 0){
      createEnemy();
    }
  }
};
    
