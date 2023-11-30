class Fruit extends Phaser.GameObjects.Sprite{
 constructor(scene,pointer,fruit_type){
  
  super(scene,pointer.x,pointer.y,fruit_type.name);
  scene.add.existing(this);
  
  this.name = fruit_type.name;
  this.setScale(fruit_type.scale)
  scene.matter.add.gameObject(this);
  this.setDepth(1);
  
  this.setBody({
   type: 'circle',
   radius: this.width*fruit_type.scale*0.5
  })
  this.setBounce(0.99)
  
  /*
  this.setInteractive();
  this.on('pointerdown',()=>{
   this.destroy();
  })
 */
 
 /*
  this.setOnCollideWith(collision_group,(x)=>{
   //if(Math.random() < 0.8) return;
   console.log(collision_group)
   
   if(x.gameObject != null)
    x.gameObject.destroy();
    
    this.destroy();
    collision_group.splice(id,1)
  });
  */
 }
}