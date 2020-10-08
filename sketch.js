//Create variables here
var database;
var dog,dogImg,happyDogImg;
var foodS,foodStock;
var feed,addFood;
var fedTime,lastFed;
var foodObj;
var readState,updateState;
var bedroomImg,gardenImg,washroomImg;
var sadDog;
var vacc;
var dogRunning;



function preload()
{
  //load images here
  dogImg = loadImage("Dog.png");
  happyDogImg = loadImage("happydog.png");
  bedroomImg = loadImage("images/Bed Room.png");
  gardenImg = loadImage("images/garden.png");
  washroomImg = loadImage("images/Wash Room.png");
  sadDog = loadImage("images/Lazy.png");
  vacc = loadImage("images/Vaccination.jpg");
  dogRunning = loadimage("images/running.png");

}

function setup() {
  database = firebase.database();

  createCanvas(1000, 1000);
  dog = createSprite(400,300,20,20);
  dog.addImage(dogImg);
  console.log(dog);
  dog.scale = 0.2;

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  foodObj = new FoodS();


  feed = createButton("Feed the dog");
  feed.position(650,100);
  feed.mousePressed(feedDog);

  addFood = createButton("Add the food");
  addFood.position(750,100);
  addFood.mousePressed(addFoods);

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  })

  

  
  
}


function draw() {  
  background(46,139,87);

  


  drawSprites();
  //add styles here
  
  fill("purple");
  textSize(20);
  text("Food remaining:  "+foodS,150,200);

  
  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })

   //fiil(255,255,254);
    
    if(lastFed>=12){
      text("Last Feed: "+lastFed%12+"PM",550,100);
    }
    else if(lastFed===0){
      text("Last Fed 12 AM",550,100);
    }
    else{
      text("Last Feed: "+lastFed+"AM",550,100);
    }

    //foodObj.display();

    


   

    currentTime = hour();
    if(currentTime===(lastFed+1)){
      update("Playing");
      foodObj.garden();
    }

    else if(currentTime===(lastFed+2)){
      update("Sleeping");
      foodObj.bedroom();
    }

    else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
      update("Bathing");
      foodObj.washroom();
    }

    

    else{
      update("Hungry");
      foodObj.display();
    }

    if(gameState!=="Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
    }
    else{
      feed.show();
      addFood.show();
      dog.addImage(sadDog);
    }
    
    
    

    


    

 
  
  

}

function readStock(data){
  foodS = data.val();
}

function writeStock(x){
  if(x<=0){
    x=0;
  }
  else{
    x = x-1;
  }

  database.ref('/').update({
    Food : x
  })

}

function feedDog(){
  dog.addImage(happyDogImg);

  /*foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    foodStock: foodObj.getFoodStock(),
    FeedTime: hour(),
    
  })*/

  

    foodS--;
    database.ref('/').update({
    Food: foodS,
    FeedTime: hour(),
  })
  

}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}



