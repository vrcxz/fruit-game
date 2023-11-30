class Main extends Phaser.Scene{
 constructor(){
  super('Main');
 }
 
 preload(){
  this.loading = this.add.text(WIDTH/2-50,HEIGHT/2,'Loading...',{fill:'#000000'});
  
  this.load.image('waterlemon','watermelon.png');
  this.load.image('melon','melon.png');
  this.load.image('avocado','avocado.png');
  this.load.image('pineapple','pineapple.png');
  this.load.image('peach','peach.png');
  this.load.image('pear','pear.png');
  this.load.image('apple','apple.png');
  this.load.image('orange','orange.png');
  this.load.image('dekopon','dekopon.png');
  
  this.load.image('gameover','gameover.png');
  this.load.audio('gameover_audio','gameover.mp3');
  this.load.audio('background','suika.mp3');
  this.load.image('container_back','container_back.png');
  this.load.image('container_front','container_front.png');
  this.load.image('restart_button','restart_button.png');
  
  this.load.image('cloud','cloud.png');
  
 }
 
 generateRandomFruit(){
  const fruits_number = 9;
  
  if(this.fruits_unlocked == 0) 
   return this.fruits[8];
  
  let index = parseInt(((Math.random()*100)%this.fruits_unlocked));
  
  index += (fruits_number - this.fruits_unlocked);
  
  return this.fruits[index];
 }
 
 generateNextFruit(){
  this.chosen_fruit = this.generateRandomFruit();
  
  this.nextfruit = this.chosen_fruit.name;
 }
 
 checkUnlockNextFruit(i){
  if(this.fruits_unlocked < i)
   this.fruits_unlocked = i;
 }
 
 create(){
  this.loading.destroy();
  this.game_is_running = true;
  
  this.background_music = this.sound.add('background',{loop:true});
  this.background_music.play();
  
  
  this.container_back = this.add.sprite(0,0,'container_back');
  this.container_back.x = WIDTH/2;
  this.container_back.y = HEIGHT/2 + 5;
  this.container_back.setScale(0.5);
  this.container_back.setDepth(0);
  
  this.container_front = this.add.sprite(0,0,'container_front');
  this.container_front.x = WIDTH/2;
  this.container_front.y = HEIGHT/2 + 5;
  this.container_front.setScale(0.5);
  this.container_front.setDepth(2);
  this.container_front.alpha = 0.5;
  
  this.cloud = this.add.sprite(0,0,'cloud');
  this.cloud.y = 75;
  this.cloud.setScale(0.2);
  
  this.gameover_audio = this.sound.add('gameover_audio');
  
  this.matter.world.setBounds();
 
  this.fruits_unlocked = 0;
  this.fruits = [
   { name: 'waterlemon', scale: 0.35 }, //0
   { name: 'melon', scale: 0.27}, //1
   { name: 'pineapple', scale: 0.22 }, //2
   { name: 'peach', scale: 0.18 }, //3
   { name: 'pear', scale: 0.15 }, //4
   { name: 'apple', scale: 0.12 }, //5
   { name: 'orange', scale: 0.09 }, //6
   { name: 'dekopon', scale: 0.07 }, //7
   { name: 'avocado', scale: 0.07 * 2 } //8
  ];
  this.fruit_group = [];
  this.chosen_fruit;
  this.generateNextFruit();
  
  
  this.is_pressed = false;
  
  this.input.on('pointerdown',(pointer)=>{
   if(!this.game_is_running) return;
   
   this.cloud.x = pointer.x;
   this.is_pressed = true;
   pointer.y = 100;
   this.current_fruit = new Fruit(this,pointer,this.chosen_fruit);
   this.current_fruit.body.isStatic = true;
   this.fruit_group.push(this.current_fruit);
   this.generateNextFruit();
  });
  
  
  this.input.on('pointermove',(pointer)=>{
   if(this.is_pressed){
    this.cloud.x = pointer.x;
    this.current_fruit.x = pointer.x;
   }
  });
  
  this.input.on('pointerup',(pointer)=>{
   this.is_pressed = false;
   if(this.current_fruit != null)
    this.current_fruit.body.isStatic = false;
  });
  
  
  this.ceiling = this.add.rectangle(10,0,WIDTH*2,20);
  this.matter.add.gameObject(this.ceiling)
  this.ceiling.name = 'ceiling';
  this.ceiling.body.isStatic = true;
  
  
  this.matter.world.on('collisionstart',(event)=>{
   
   for(const pair of event.pairs){
    let fruitA = pair.bodyA.gameObject;
    let fruitB = pair.bodyB.gameObject;
    
    if(fruitA != null && fruitB != null){
     
     if(fruitA.name == fruitB.name){
      let position = {
       x: (fruitA.x + fruitB.x) / 2,
       y: (fruitA.y + fruitB.y) / 2
      };
      
      let fruit_index = 0;
      if(fruitA.name == 'avocado'){
       fruit_index = 7;
       this.score +=1; 
       this.checkUnlockNextFruit(2);
      }
      else if(fruitA.name == 'dekopon'){ 
       fruit_index = 6; 
       this.score +=2; 
       this.checkUnlockNextFruit(3);
      }
      else if(fruitA.name == 'orange'){ 
       fruit_index = 5;
       this.score +=4;
       this.checkUnlockNextFruit(4);
      }
      else if(fruitA.name == 'apple'){ 
       fruit_index = 4;
       this.score += 8; 
       this.checkUnlockNextFruit(5);
      }
      else if(fruitA.name == 'pear'){ fruit_index = 3; this.score += 16;
       //this.checkUnlockNextFruit(5);
      }
      else if(fruitA.name == 'peach'){ 
       fruit_index = 2; 
       this.score += 32;
       //this.checkUnlockNextFruit(6);
      }
      else if(fruitA.name == 'pineapple'){ 
       fruit_index = 1;
       this.score += 64;
       //this.checkUnlockNextFruit(7);
      }
      else if(fruitA.name == 'melon'){ 
       fruit_index = 0;
       this.score *= 2;
       //this.checkUnlockNextFruit(8);
      }
      else
       fruit_index = -1;
      
      if(fruit_index >= 0){
       this.fruit_group.push(new Fruit(this,position,this.fruits[fruit_index]));
      }
      
      fruitA.destroy();
      fruitB.destroy();
     }
     else if(fruitA.name == 'ceiling'){
      this.gameover = this.add.sprite(0,0,'gameover');
      this.gameover.x = WIDTH/2;
      this.gameover.y = HEIGHT/2;
      this.gameover.setScale(0.5);
      this.gameover.setDepth(3);
      
      this.restart = this.add.sprite(WIDTH/2,HEIGHT/2,'restart_button');
      this.restart.setScale(0.3);
      this.restart.y += 150;
      this.restart.setDepth(3);
      this.restart.setInteractive();
      this.restart.on('pointerdown',()=>{
       //location.reload();
       
       this.scene.restart();
      });
      
      
      this.background_music.stop();
      this.gameover_audio.play();
      this.matter.pause();
      this.game_is_running = false;
     // let input_name = document.getElementById('input_name');
      
      /*
      setTimeout(()=>{
       document.getElementById('form_score').value = this.score;
       input_name.showModal();
      }, 3000);
      */
     }
     
    }
   }
  });
  
  
  this.text = this.add.text(0,0,'',{
   fill:'#000000'
  });
  this.text.setDepth(3);
  
  this.score = 0;
  this.score_text = this.add.text(0,20,'score: ',{
   fill:'#000000'
  });
  this.score_text.setDepth(3);
  
  this.nextfruit = '';
  this.nextfruit_text = this.add.text(0,40,'no fruits yet',{fill:'#000000'});
  this.nextfruit_text.setDepth(3);
  
 }
  
 update(){
  //this.text.setText('fps:'+this.game.loop.actualFps);
  this.score_text.setText('score: '+this.score);
  this.nextfruit_text.setText('next: '+this.nextfruit);
 }
}