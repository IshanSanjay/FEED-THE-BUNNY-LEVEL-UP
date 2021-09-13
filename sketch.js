const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var rope,fruit,ground;
var fruit_con;
var fruit_con_2;
var fruit_con_3;

var bg_img;
var food;
var rabbit;
var bubble,bubbleImg;
var star,starImg;

var button,button2,button3,blower;
var bunny;
var blink,eat,sad;
var mute_btn;

var fr,rope2,rope3;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air;
function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');
  bubbleImg = loadImage('bubble.png');
  starImg = loadImage('star.png');

  bk_song = loadSound('sound1.mp3');
  sad_sound = loadSound("sad.wav")
  cut_sound = loadSound('rope_cut.mp3');
  eating_sound = loadSound('eating_sound.mp3');
  air = loadSound('air.wav');

  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    canW = displayWidth;
    canH = displayHeight;
    createCanvas(displayWidth+80,displayHeight);
  } 
  else{
    canW = windowWidth;
    canH = windowHeight;
    createCanvas(windowWidth,windowHeight);
  }

  frameRate(80);

  bk_song.play();
  bk_song.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;
  
  button = createImg('cut_btn.png');
  button.position(220,30);
  button.size(50,50);
  button.mouseClicked(drop);

  button2 = createImg('cut_btn.png');
  button2.position(440,105);
  button2.size(50,50);
  button2.mouseClicked(drop2);

  button3 = createImg('cut_btn.png');
  button3.position(40,80);
  button3.size(50,50);
  button3.mouseClicked(drop3);

  blower = createImg('balloon.png');
  blower.position(25,200);
  blower.size(150,150);
  blower.mouseClicked(airBLow); 

  mute_btn = createImg('mute.png');
  mute_btn.position(25,10);
  mute_btn.size(35,35);
  mute_btn.mouseClicked(mute);
  
  rope = new Rope(7,{x:245,y:30});
  rope2 = new Rope(8,{x:470,y:125});
  rope3 = new Rope(8,{x:65,y:100});

  ground = new Ground(700,canH-450,160,20);

  blink.frameDelay = 20;
  eat.frameDelay = 20;

  bunny = createSprite(700,canH - 520,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking',blink);
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');
  bunny.changeAnimation('eating');

  bubble = createSprite(560,400,10,10);
  bubble.addImage(bubbleImg);
  bubble.scale = 0.11;

  
  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con_2 = new Link(rope2,fruit);
  fruit_con_3 = new Link(rope3,fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  
}

function draw() 
{
  background(51);
  textSize(15);
  text (mouseX + "," + mouseY,mouseX,mouseY);
  image(bg_img,0,0,displayWidth+80,displayHeight);

  push();
  imageMode(CENTER);
  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }
  pop();

  rope.show();
  rope2.show();
  rope3.show();

  Engine.update(engine);
  ground.show();

  /*if(collide(fruit,bunny)==true)
  {
    eating_sound.play();
    bunny.changeAnimation('eating');
  }*/


  if(fruit!=null && fruit.position.y>=650)
  {
    sad_sound.play();
    bunny.changeAnimation('crying');
    fruit=null;
     
   }

  if(collide(fruit,bunny,80) == true)
  {
    remove_rope();
    bubble.visible = false;
    World.remove(engine.world,fruit);
    fruit = null;
    bunny.changeAnimation('eating');
  } 
  
  if(collide(fruit,bubble,40) == true){
    engine.world.gravity.y = -1;
    bubble.position.x = fruit.position.x;
    bubble.position.y = fruit.position.y;
  }

  drawSprites();
   
}

function drop()
{
  rope.break();
  cut_sound.play();
  fruit_con.detach();
  fruit_con = null; 
}

function drop2(){
  rope2.break();
  cut_sound.play();
  fruit_con_2.detach();
  fruit_con_2 = null;
}

function drop3(){
  rope3.break();
  cut_sound.play();
  fruit_con_3.detach();
  fruit_con_3 = null;
}

function collide(body,sprite)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=80)
            {
              World.remove(engine.world,fruit);
               fruit = null;
               return true; 
            }
            else{
              return false;
            }
         }
}


function airBLow(){
  Matter.Body.applyForce(fruit,{x:0, y:0} , {x:0.05, y:0});
  air.play();
}

function mute(){
  if(bk_song.isPlaying()){
    bk_song.stop();
  } else {
    bk_song.play();
  }
  
}

function reomve_rope(){
  rope.break();
  fruit_con.detach();
  fruit_con = null;
}