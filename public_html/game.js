var ancho = 300;
var alto = 300;
var loadedCount = 0;

var panelVelocidad;
var panelPosicion;

var soundTrack;
var soundEfx; 
var soundDeathPlayer; 
var soundDeathBoss; 

var idInterval;
var posicion=2590-alto;
var velocidad = 0.5;

var imgPlayer = new Image();
var imgEnemy = new Image();
var background = new Image();
var resources = [];
var enemyBullets = [];
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
    fighter:1,
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
        if(player.lives<1) {
            
            player.direction=160;
            var intervalDeath =setInterval(function(){
                player.direction+=32;
            },300);
            soundDeathPlayer.play();
            setTimeout(function (){
                clearInterval(intervalDeath);
                gameOver();
            },2400);
        }
        
    },
    img:imgPlayer,
    paint: function(){
        contexto.drawImage(player.img,player.direction,player.action,32,32,player.x-16,player.y,player.width,player.height);
    },
    collision: function(){
            contexto.beginPath();
            contexto.rect(player.x, player.y, player.width, player.height);

            for (var i = 0; i < enemyBullets.length; i++){

                if (contexto.isPointInPath(enemyBullets[i].x,    enemyBullets[i].y)     ||
                    contexto.isPointInPath(enemyBullets[i].x+enemyBullets[i].width,   enemyBullets[i].y)     ||

//                    context.isPointInPath(centerX, centerY) ||

                    contexto.isPointInPath(enemyBullets[i].x,    enemyBullets[i].y+enemyBullets[i].height)  ||
                    contexto.isPointInPath(enemyBullets[i].x+enemyBullets[i].width,   enemyBullets[i].y+enemyBullets[i].height) ){
                    
                    enemyBullets[i].hit();
                    player.hit();
                }
                
            };
        }
};
var avion;

var keys = [];
var mouse = [];

window.onload = function(){
    
    avion = decodeURIComponent(location.search.substr(1,location.search.length).split("=")[1]).replace(/'/g,"");
    
    panelVelocidad = document.getElementById("velocidad");
    panelPosicion = document.getElementById("posicion");
    panelVidas = document.getElementById("vidas");
    soundDeathPlayer = document.getElementById("soundDeathPlayer");
    soundDeathBoss = document.getElementById("soundDeathBoss");
    incButton = document.getElementById("incButton");
    decButton = document.getElementById("decButton");
    
    soundTrack = document.getElementById("soundTrack");
    soundTrack.loop = true;
    soundEfx = document.getElementById("soundEfx");
    
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
    
    document.body.addEventListener("mousedown", function (e) {
        e = e || window.event; //window.event for IE
        mouse[e.keyCode || e.which] = true;
//        switch (e.keyCode || e.which){
//            case 1: //IZQ
//                break;
//            case 3: //DCH
//                break;
//                
//        }
//        alert("Keycode of key pressed: " + (e.keyCode || e.which));
    });
    
    document.body.addEventListener("mouseup", function (e) {
        e = e || window.event; //window.event for IE
        mouse[e.keyCode || e.which] = false;
//        switch (e.keyCode || e.which){
//            case 1: //IZQ
//                break;
//            case 3: //DCH
//                break;
//                
//        }
//        alert("Keycode of key pressed: " + (e.keyCode || e.which));
    });
    
    //LOADING BACKGROUND
    background.src = "asset/australia.png";
    background.paint = function(){
        contexto.drawImage(background,2,posicion,ancho,alto,0,0,ancho,alto);
    }
    //    background.src = "asset/".scene;
    background.onload = function (){
        loadingResources();};
    
    //LOADING PLAYER SPRITE
//    player.img.src = "asset/fighters.png";
//    player.img.src = "asset/f-14.png";

    player.img.src = "asset/"+avion+".png";
    
    player.img.onload =function (){
        resources.push(player);
        loadingResources();
    };
    
    //LOADING ENEMY
    imgEnemy.src = "asset/bomber.png";
        imgEnemy.onload =function (){
            loadingResources();
    };
};

    


function init(){
    if(mouse[1]){
        increase();
        incButton.style.background="rgba(255,0,0,0.6)";
    }
    else    incButton.style.background="rgba(255,0,0,0.8)";


    if (mouse[3]) {
        decrease();
        decButton.style.background="rgba(255,0,0,0.6)";
    }
    else    decButton.style.background="rgba(255,0,0,0.8)";

        
    //player.direction=player.recto;
    player.action=player.move;
    if (!keys[38] && !keys[40] && !keys[39] && !keys[37] && player.lives>0) {
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

   if (keys[38] && player.lives>0) {
       // up arrow
       if (player.y > 0) {                         
           player.y--;
       }
       player.action=player.move;
//       increase();
   }
   if (keys[40] && player.lives>0) {
       // down arrow
       if (player.y+player.height < alto) {                         
           player.y++;
           player.action=player.stay;
       }
//       decrease();
   }
   if (keys[39] && player.lives>0) {
       // right arrow
       if (player.x < ancho) {                         
           player.x++;
            switch (player.direction){
                case player.izq1:
                    setTimeout(function(){player.direction=player.recto;},500);
//                    console.log("izq1"+player.direction);
                    break;
                case player.izq2:
                    player.direction=player.izq1;
//                    console.log("izq2"+player.direction);
                    break;
                case player.recto:
                    player.direction=player.dch1;
//                    console.log("Recto"+player.direction);
                    break;
                case player.dch1:
                    setTimeout(function(){player.direction=player.dch2;},500);
//                    console.log("dch1"+player.direction);
                    break;
            }
       }          
   }          
   if (keys[37] && player.lives>0) {                 
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
   
    if (keys[32] && player.lives>0) {
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
    
    for (var i = 0; i < enemyBullets.length; i++) {
        if (contexto)enemyBullets[i].paint();
    }
    
    for (var i = 0; i < enemies.length; i++) {
        if (contexto)enemies[i].paint();
        if (enemies[i].alive) {
            enemies[i].collision();
        }
    }
   
    player.collision();
    
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
    panelVidas.innerHTML="Vidas: "+player.lives;
    if (enemies.length) {
        for (var i = 0; i <enemies.length; i++ )
            panelVidas.innerHTML+="</br>Enemy: "+enemies[i].lives;
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
    soundEfx.play();
}

function showSmallEnemy(){
    
}

function showEnemy() {
//    alert("Enemy!!! "+posicion);
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
        lives:100,
        idInterval:0,
        initInterval:0,
        nearDeathinterval:0,
        init: function(){
            enemyOn=true;
            enemy.initInterval=setInterval(function (){
                enemy.y+=0.1;
                if(enemy.y>10){
                    clearInterval(enemy.initInterval);
                    enemy.fire();
                }
            },10);

            enemy.idInterval=setInterval(function(){
                enemy.action+=96;
                if(enemy.action==704) enemy.action=32;
            },500);  
        },
        fire: function(){
            setInterval(function(){
                var bullet = {
                    x: enemy.x+enemy.width/2,
                    y: enemy.y+enemy.height,
                    width:3,
                    height:2,
                    velocity:2,
                    direction:"izq",
                    type:"enemyBullet",
                    paint: function(){
                        contexto.fillStyle = "yellow";
                        contexto.beginPath();
                        contexto.arc(bullet.x, bullet.y, 10, 0, Math.PI*2, true);
                        contexto.closePath();
                        contexto.fill();
                        if (bullet.direction=="izq" && bullet.x>0) {
                            bullet.x--;
                        }
                        if(bullet.direction=="izq" && bullet.x==0) {
                            bullet.direction="dch";
                            bullet.x++;
                        } 
                        if (bullet.direction=="dch" && bullet.x<(ancho-bullet.width) ) {
                            bullet.x++;
                        }
                        if(bullet.direction=="dch" && bullet.x==(ancho-bullet.width) ) {
                            bullet.direction="izq";
                            bullet.x--;
                        }
                        bullet.y+=bullet.velocity;
                    },
                    hit: function(){
                        enemyBullets.splice(enemyBullets.indexOf(bullet),1);
                    }
                };

                enemyBullets.push(bullet);
            },800);
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
                        soundDeathBoss.play();
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
        soundTrack.play();
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

function gameOver(){
    alert("Juego acabado");
    window.location="index.html";
}
