var ancho = 300;
var alto = 300;
var loadedCount = 0;

var panelVelocidad;
var panelPosicion;

var idInterval;
var posicion=2590-alto;
var velocidad = 0.5;

var imgPlayer = new Image();
var imgEnemy = new Image();
var background = new Image();
var resources = [];
var enemies = [];
var enemyOn=false;

var contexto;

var player = {
    x: ancho/2,
    y: alto-32,
    width:32,
    height:32,
    lives:5,
    type:"player",
    direction:64,
    recto:64,
    izq1:32,
    izq2:0,
    dch1:96,
    dch2:128,
    stay:56,
    move:16,
    firing:false,
    hit: function(){
        player.lives--;
//        if(player.lives==0) gameOver();
    },
    img:imgPlayer,
    paint: function(){
        contexto.drawImage(player.img,player.direction,player.action,32,32,player.x-16,player.y,player.width,player.height);
    }
};

var keys = [];

window.onload = function(){
    panelVelocidad = document.getElementById("velocidad");
    panelPosicion = document.getElementById("posicion");
    panelMarcador = document.getElementById("marcador");
    var canvas=document.getElementById("game");
    canvas.width=ancho;
    canvas.height=alto;
    
    contexto = cargaContextoCanvas('game');
    contexto.strokeRect(0, 0, ancho, alto);
    
    document.body.addEventListener("keydown", function(e) {
        keys[e.keyCode] = true;
    });

    document.body.addEventListener("keyup", function(e) {
        keys[e.keyCode] = false;
    });
    
    //LOADING BACKGROUND
    background.src = "asset/australia.png";
    background.paint = function(){
        contexto.drawImage(background,2,posicion,ancho,alto,0,0,ancho,alto);
    }
    //    background.src = "asset/".scene;
    background.onload = function (){
        loadingResources();};
    };

    //LOADING PLAYER SPRITE
    player.img.src = "asset/fighters.png";
    //    imgPlayer.src = "asset/f-18.png";
    //    imgPlayer.src = "asset/".sprite;
        player.img.onload =function (){
            resources.push(player);
            loadingResources();
    };
    
    //LOADING ENEMY
    imgEnemy.src = "asset/bomber.png";
        imgEnemy.onload =function (){
            loadingResources();
    };
    


function init(){
    //player.direction=player.recto;
    player.action=player.move;
    if (!keys[38] && !keys[40] && !keys[39] && !keys[37]) {
        switch(player.direction){
            case player.izq2:
                setTimeout(function(){player.direction=player.izq1;},100);
                break;
           case player.dch2:
                setTimeout(function(){player.direction=player.dch1;},100);
                break;
            case player.izq1:
                setTimeout(function(){player.direction=player.recto;},100);
                break;
            case player.dch1:
                setTimeout(function(){player.direction=player.recto;},100);
                break;
            


        } 
        //player.direction=player.recto;

    };

   if (keys[38]) {
       // up arrow
       if (player.y > 0) {                         
           player.y--;
       }
       player.action=player.move;
//       increase();
   }
   if (keys[40]) {
       // down arrow
       if (player.y+player.height < alto) {                         
           player.y++;
           player.action=player.stay;
       }
//       decrease();
   }
   if (keys[39]) {
       // right arrow
       if (player.x < ancho) {                         
           player.x++;
            switch (player.direction){
                case player.izq1:
                    setTimeout(function(){player.direction=player.recto;},500);
                    console.log("izq1"+player.direction);
                    break;
                case player.izq2:
                    player.direction=player.izq1;
                    console.log("izq2"+player.direction);
                    break;
                case player.recto:
                    player.direction=player.dch1;
                    console.log("Recto"+player.direction);
                    break;
                case player.dch1:
                    setTimeout(function(){player.direction=player.dch2;},500);
                    console.log("dch1"+player.direction);
                    break;
            }
       }          
   }          
   if (keys[37]) {                 
        // left arrow                  
       if (player.x > 0) {
           player.x--;
            switch (player.direction){
                case player.izq1:
                    setTimeout(function(){player.direction=player.izq2;},500);
                    break;
                case player.recto:
                    player.direction=player.izq1;
                    break;
                case player.dch1:
                    player.direction=player.recto;
                    break;
                case player.dch2:
                    player.direction=player.dch1;
                    break;
            }
       }
   }
   
    if (keys[32]) {
       // space
        if (!player.firing)fire();
   }
   
    if(contexto){
        //drawImage(imagen,imgX,imgY,imgAncho,imgAlto,lienzoX,lienzoY,LienzoAncho,LienzoAlto)
        background.paint();
    }
    for (var i = 0; i < resources.length; i++) {
        if (contexto)resources[i].paint();
    }
    for (var i = 0; i < enemies.length; i++) {
        if (contexto)enemies[i].paint();
        if (enemies[i].alive) {
            enemies[i].collision();
        }
    }
    
    
    if (posicion>2590-alto || posicion<1 ){
        velocidad=0;
//        clearInterval(idInterval);
    }
    
    if(posicion<200){
        showSmallEnemy();
        
    }
    
    if(posicion<500){
        if(!enemyOn)showEnemy();
    }
    
    panelVelocidad.innerHTML="Velocidad: "+Math.round(velocidad);
    panelPosicion.innerHTML="Posicion: "+Math.round(posicion);
    panelMarcador.innerHTML="Vidas: "+player.lives;
    if (enemies.length) {
        for (var i = 0; i <enemies.length; i++ )
            panelMarcador.innerHTML+="</br>Enemy: "+enemies[i].lives;
    }
}

function increase(){
    velocidad+=0.1;
}
function decrease(){
    velocidad-=0.1;
}

function fire(){
    player.firing=true;
    var bullet = {
        x: player.x-1,
        y: player.y,
        width:3,
        height:2,
        velocity:2,
        type:"bullet",
//        img:imgPlayer,
        paint: function(){
            contexto.fillStyle = "red";
            contexto.fillRect(bullet.x, bullet.y, 2, 3);
            bullet.y-=bullet.velocity;
        },
        hit: function(){
            resources.splice(resources.indexOf(bullet),1);
        }
    };
    setTimeout(function(){
       player.firing=false; 
    },300);
    resources.push(bullet);
}

function showSmallEnemy(){
    
}

function showEnemy() {
    alert("Enemy!!! "+posicion);
    var enemy = {
        x: ancho/2,
        y: -144,
        width:90,
        height:144,
        status:32,
        action:32,
        velocity:0,
        direction:"izq",
        type:"enemy",
        alive:true,
        img:imgEnemy,
        hited:275,
        lives:25,
        idInterval:0,
        initInterval:0,
        nearDeathinterval:0,
        init: function(){
            enemyOn=true;
            initInterval=setInterval(function (){
                enemy.y+=0.1;
                if(enemy.y==10)clearInterval(enemy.initInterval);
            },10);

            enemy.idInterval=setInterval(function(){
                enemy.action+=96;
                if(enemy.action==704) enemy.action=32;
            },500);  
        },
        paint: function(){
//            contexto.fillStyle = "red";
//            contexto.fillRect(bullet.x, bullet.y, 2, 3);
            contexto.drawImage(enemy.img,enemy.action,enemy.status,94,144,enemy.x,enemy.y,enemy.width,enemy.height);
            if (enemy.direction=="izq" && enemy.x>0) {
                enemy.x--;
            }
            if(enemy.direction=="izq" && enemy.x==0) {
                enemy.direction="dch";
                enemy.x++;
            } 
            if (enemy.direction=="dch" && enemy.x<(ancho-enemy.width) ) {
                enemy.x++;
            }
            if(enemy.direction=="dch" && enemy.x==(ancho-enemy.width) ) {
                enemy.direction="izq";
                enemy.x--;
            }
            enemy.y+=enemy.velocity;
        },
        collision: function(){
            contexto.beginPath();
            contexto.rect(enemy.x, enemy.y, enemy.width, enemy.height);

            for (var i = 0; i < resources.length; i++){
//                if ( ( resources[i].x<enemy.x && enemy.x<(resources[i].x+resources[i].width) ) &&
//                     ( resources[i].y<enemy.y && enemy.y<(resources[i].y+resources[i].height) )  ) {
//                      alert("Hit!!!");
//                }
//                contexto.strokeRect(resources[i].x, resources[i].y, resources[i].width, resources[i].height);

                if (contexto.isPointInPath(resources[i].x,    resources[i].y)     ||
                    contexto.isPointInPath(resources[i].x+resources[i].width,   resources[i].y)     ||

//                    context.isPointInPath(centerX, centerY) ||

                    contexto.isPointInPath(resources[i].x,    resources[i].y+resources[i].height)  ||
                    contexto.isPointInPath(resources[i].x+resources[i].width,   resources[i].y+resources[i].height) ){
                    
                    resources[i].hit();
                    enemy.lives--;
                    
                    if (enemy.lives) {
                        enemy.status=enemy.hited;
                        enemy.action=32;
                        enemy.lives--;
                        clearInterval(enemy.idInterval);
                        if (!enemy.nearDeathInterval) {
                            clearInterval(enemy.nearDeathInterval);
                            enemy.nearDeathInterval=setInterval(function(){
                                enemy.action+=96;
                                if(enemy.action==704) enemy.action=512;
                            },500);
                        }

                    }else {
                        enemy.alive=false;
                        clearInterval(enemy.nearDeathInterval);
                        enemy.action=32;
                        enemy.status=445;
                        var deathInterval=setInterval(function(){
                            enemy.action+=96;
                        },500);
                        setTimeout(function(){
                            clearInterval(deathInterval);
                            enemies.splice(enemies.indexOf(enemy), 1);
                        },500*10);
                    }

                }
                
            };
        }
    }; 
    enemy.init();
    enemies.push(enemy);
}

function loadingResources() {
    loadedCount++;

    if(loadedCount==3){
        idInterval= setInterval(function(){
            posicion-=velocidad;
            init();
        },10);
    };
};

//Recibe el identificador del canvas Devueve el contexto o FALSE
function cargaContextoCanvas(idCanvas){
        var elemento = document.getElementById(idCanvas);
        if(elemento && elemento.getContext){
        var contexto = elemento.getContext('2d');
        if(contexto)
        return contexto;
        }
        return FALSE;
}

