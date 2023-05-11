//VARIÁVEIS GLOBAIS
var soloSprite, soloImagem;
var trex, trexAnimacao, trexColidido;
var solo;
var nuvemImagem;
var o1, o2, o3, o4, o5, o6;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var grupoCacto;
var grupoNuvem;
var gameOverImg;
var gameOver;
var somPulo, somMorto;
var somCheck;
//cria a variável e atribui o valor 0 para ela
var score = 0;
var restart, restartImg;

function preload() {

    //é assim que carrega a animação
    trexAnimacao = loadAnimation("trex1.png","trex2.png","trex3.png");
    trexColidido = loadAnimation("trex_colidido.png");
    
    //é assim que carrega imagem
    soloImagem = loadImage("solo.png");
    nuvemImagem = loadImage("nuvem.png");
    o1 = loadImage("obs1.png");
    o2 = loadImage("obs2.png");
    o3 = loadImage("obs3.png");
    o4 = loadImage("obs4.png");
    o5 = loadImage("obs5.png");
    o6 = loadImage("obs6.png");
    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");
    //é aqui que carrega os sons....
    //carregando os sons....
    somPulo = loadSound("jump.mp3");
    somMorto = loadSound("die.mp3");
    somCheck = loadSound("checkpoint.mp3");
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    //é aqui que cria as sprites
    //solo
    solo = createSprite(300,height-20,600, 20);
    solo.addImage(soloImagem);
    solo.velocityX = -3;

    //solo invisível
    soloInvisivel = createSprite(300,height-10 ,600,20);
    soloInvisivel.visible = false;

    //trex 
    trex = createSprite(50,height-20,50,50);
    //adiciona a animação dele correndo
    trex.addAnimation("correndo",trexAnimacao);
    //adicionando a animação do trex colidido..
    trex.addAnimation("colidido", trexColidido);
    trex.scale=0.5;

    trex.setCollider("rectangle", 00, 0, 90, 70);
    trex.debug = false;

    //criando a sprite restart...
    restart = createSprite(width/2,height/2);
    restart.addImage(restartImg);
    restart.scale = 0.5;
    restart.visible = false;
    
    //criando a sprite gameOver... 
    gameOver = createSprite(width/2,height-500,50,50);
    //adicionar a imagem na sprite
    gameOver.addImage(gameOverImg);
    //definir o tamanho da imagem
    gameOver.scale = 0.5; 
    //deixar a sprite invisível
    gameOver.visible = false;

    //criar os grupos
    grupoCacto = new Group();
    grupoNuvem = new Group();
}


function draw() {
    //pinta o fundo de uma cor
    background("white");
    //checar se gameState é PLAY
    if(gameState == PLAY){
        //aumentar a quantidade pontos
        score += Math.round(getFrameRate() / 60) ;
        //getFrameRate = pegar taxa de quadros
        fill ("black");
        textSize (25);
        text (score, width/2, 50);
        //aumenta a velocidade do solo a cada 100 pontos
        solo.velocityX = -(3 + score/100);
        //a cada 100 pontos,
        if(score % 100 == 0 && score > 0){
            // o som de checkpoint será tocado
            somCheck.play();
        }
        //é assim que chama as funções
        criarCactos();
        criarNuvens();

        //verifica se a pessoa apertou a tecla espaço
        if((touches.length > 0 || keyDown("space")) && trex.isTouching(solo) ){
            //dá velocidade para o trex voar
            trex.velocityY = -17;
            //toca som
            somPulo.play();
            touches = []
        }

        //checa se o solo saiu da tela
        if(solo.x < 0){
            //se sim, ele volta para a metade do jogo 
            solo.x = width/2;
        }

        //checar se o trex está tocando no grupo de cacto
        if(trex.isTouching(grupoCacto)){
            gameState = END;
            somMorto.play();
        }
    }
    
    //checar se gameState é END
    if(gameState == END){
        
        solo.velocityX = 0;
        restart.visible = true;        
        gameOver.visible = true;
        grupoNuvem.setVelocityXEach(0);
        grupoCacto.setVelocityXEach(0);
        grupoCacto.setLifetimeEach(-1);
        grupoNuvem.setLifetimeEach(-1);
        trex.changeAnimation("colidido");
        //checa se a sprite restart foi clicada
        if(mousePressedOver(restart)){
            //REINICIA O JOGO
            reiniciar();

        }
        if(touches.length > 0){
            reiniciar ()
            touches = []
        }
    }
    //esse código dá gravidade para o trex cair
    trex.velocityY += 0.8;
    //manda o trex colidir com o solo
    trex.collide(soloInvisivel);
    //desenha as sprites
    drawSprites();
}
//cria a função criarNuvens
function criarNuvens(){
    //determina o que ocorre a cada 90 quadros
    if(frameCount % 90 == 0){
        //cria a sprite da nuvem em uma posição Y aleatória
        var nuvem = createSprite(width+100,Math.round(random(70,height-100)),75,20);
        //adiciona a imagem
        nuvem.addImage(nuvemImagem);        
        //define velocidade
        nuvem.velocityX = -3;
        //define o tamanho
        nuvem.scale = 0.5;
        //deixa o trex na frente
        trex.depth = nuvem.depth + 1;
        //define o tempo de vida 
        nuvem.lifetime = width/3;
        //adiciona as nuvens no grupo de nuvens
        grupoNuvem.add(nuvem);
    }
}

function criarCactos(){
    if(frameCount % 100 == 0){
        var cacto = createSprite(width+100,height -30  ,50,50);
        var a = Math.round(random(1,6));
        switch(a){
            case 1: cacto.addImage(o1);
            break;
            case 2: cacto.addImage(o2);
            break;
            case 3: cacto.addImage(o3);
            break;
            case 4: cacto.addImage(o4);
            break;
            case 5: cacto.addImage(o5);
            break;
            case 6: cacto.addImage(o6);
            break;
        }
        //o cacto terá a mesma velocidade que o solo
        cacto.velocityX = solo.velocityX;   
        cacto.scale = 0.5;
        cacto.lifetime = width/3   ;
        grupoCacto.add(cacto);
    }
}

function reiniciar(){
    //mudar a animação
    trex.changeAnimation("correndo");
    //voltar para o estado inicial
    gameState = PLAY; 
    //volta a pontuação para zero 
    score = 0;
    //destrói todos os cactos
    grupoCacto.destroyEach();
    //destruir as nuvens
    grupoNuvem.destroyEach();
    //esconder as sprites
    restart.visible = false;
    gameOver.visible = false;
}