const config = {
 type: Phaser.AUTO,
 width: window.innerWidth,
 height: window.innerHeight,
 backgroundColor: '#cba173',//'#b1eaf8',
 physics: {
  default: 'matter',
  matter: { 
   gravity: { y: 0.5 },
   debug: false
  }
 },
 pixelArt: false,
 scene: Main
};

const game = new Phaser.Game(config);