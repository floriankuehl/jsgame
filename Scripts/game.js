import Game from './Classes/Game.js'
import Inputs from './Classes/Inputs.js'
import Sound from './Classes/Sound.js'
import View from './Classes/View.js'
import Animation from './Classes/Animation.js'

import MapEditor from './Classes/MapEditor.js'

function loadImages(){
  return Promise.all([
    View.addImage('spritesheet.player','./Assets/Images/spritesheet.player.png'),
    View.addImage('spritesheet.turtle','./Assets/Images/spritesheet.turtle.png'),
    
    View.addImage('mountains.foreground','./Assets/Images/mountains.foreground.png'),
    View.addImage('mountains.background','./Assets/Images/mountains.background.png'),
    
    View.addImage('bush','./Assets/Images/bush.png')
  ])
}

function loadSounds(){
  return Promise.all([
    Sound.loadSound('jump','./Assets/Sound/jump.wav'),
    Sound.loadSound('coin','./Assets/Sound/coin.wav'),
    Sound.loadSound('block','./Assets/Sound/block.mp3'),
    Sound.loadSound('walk.snow','./Assets/Sound/footstep.snow.mp3'),
    Sound.loadSound('walk.grass','./Assets/Sound/footstep.grass.mp3'),
    Sound.loadSound('walk.wood','./Assets/Sound/footstep.wood.mp3'),
    Sound.loadSound('walk.concrete','./Assets/Sound/footstep.concrete.mp3'),
    Sound.loadSound('walk.water','./Assets/Sound/footstep.water.mp3'),
    
    Sound.loadMusic('level','./Assets/Music/level.mp3')
  ])
}

function loadMaterials(){
  View.addMaterial('sky',(height) => View.createMaterial(
    'verticalLinearGradient',
    [
      height,
      [ [0,'#3388FF'], [.5,'#AADDFF'], [1,'#DDEEFF'] ]
    ]
  ))
  
  View.addMaterial('sun',() => View.createMaterial('fill',['#ffeca6']))
  
  View.addMaterial('mountains.background',() => View.createMaterial('pattern',['mountains.background','repeat-x']))
  View.addMaterial('mountains.foreground',() => View.createMaterial('pattern',['mountains.foreground','repeat-x']))
  
  View.addMaterial('image.bush',() => View.createMaterial('image',['bush']))
  
  View.addMaterial('floor.grass',(height) => View.createMaterial(
    'verticalLinearGradient',
    [
      height,
      [ [0,'#008800'], [.5,'#694c25'], [1,'#453015'] ]
    ]
  ))
  
  View.addMaterial('floor.snow',() => View.createMaterial('fillStroke',['#ffffff','#eeeeee',10,'round']))
  
  View.addMaterial('floor.wood',(height) => View.createMaterial(
    'verticalLinearGradient',
    [ 
      height,
      [ [0,'#694c25'], [1,'#453015'] ]
    ]
  ))
  
  View.addMaterial('floor.concrete',(height) => View.createMaterial(
    'verticalLinearGradient',
    [
      height,
      [ [0,'#888888'], [1,'#BBBBBB'] ]
    ]
  )) 

  View.addMaterial('floor.water', () => View.createMaterial('fill',['rgba(0,0,150,.5)']))
}

function loadAnimations(){
   //(image,x,y,width,height,ox,oy,speed,start,count)
   
   const playerSpritesheet = View.getImage('spritesheet.player')
   
   const
    animationSpeed = 10,
    spriteWidth = 20,
    spriteHeight = 24,
    padTop = 1,
    padLeft = 1
    
   Game.player.animation = 'idle'
   
   Game.player.animations = {
    'idle': new Animation(
      Game.player,
      playerSpritesheet,
      padLeft, padTop,
      spriteWidth, spriteHeight,
      animationSpeed,
      0, 1
    ),
    'walk': new Animation(
      Game.player,
      playerSpritesheet,
      padLeft, padTop,
      spriteWidth, spriteHeight,
      animationSpeed,
      0, 2
    ),
    'run': new Animation(
      Game.player,
      playerSpritesheet,
      padLeft, padTop,
      spriteWidth, spriteHeight,
      animationSpeed,
      6, 2
    ),
    'jump': new Animation(
      Game.player,
      playerSpritesheet,
      padLeft, padTop,
      spriteWidth, spriteHeight,
      animationSpeed,
      2, 1
    ),
    'fall': new Animation(
      Game.player,
      playerSpritesheet,
      padLeft, padTop,
      spriteWidth, spriteHeight,
      animationSpeed,
      3, 1
    ),
    'lookUp': new Animation(
      Game.player,
      playerSpritesheet,
      padLeft, padTop,
      spriteWidth, spriteHeight,
      animationSpeed,
      5, 1
    ),
    'lookDown': new Animation(
      Game.player,
      playerSpritesheet,
      padLeft, padTop,
      spriteWidth, spriteHeight,
      animationSpeed,
      4, 1
    ),
    'duck': new Animation(
      Game.player,
      playerSpritesheet,
      padLeft, padTop,
      spriteWidth, spriteHeight,
      animationSpeed,
      6, 1
    ),
  }
}

function loadEvents(){
  Game.addEvent('player.jump',()=>{
    Sound.playSound('jump')
  })
  
  Game.addEvent('player.hitwall',()=>{
    Sound.playSound('block')
  })
  
  Game.addEvent('loaded',()=>{
    Game.currentMusic = Sound.playMusic('level')
    Game.start()
  })
}

function setupInputs(){
  //addEventListener('keydown',e => console.log(e.key))
  
  const player = Game.player
  Inputs.addPress('q','pauseGame', e => { Game.togglePause() })
  Inputs.addPress('Escape','pauseGame', e => { Game.togglePause() })
  Inputs.addPress('h','toggleHitboxes', e => { View.toggleHitboxes() })
  Inputs.addPress('i','toggleInfo', e => { View.toggleInfo() })
  Inputs.addPress('j','toggleSpritesheet', e => { View.toggleSpritesheet() })
  
  Inputs.add(' ','JUMP', e => { 
    player.jump()
  })
  Inputs.add('0','JUMP', e => { 
    player.jump()
  })
  Inputs.add('a','LEFT',e => { 
    player.moveLeft()
  })
  Inputs.add('d','RIGHT',e => { 
    player.moveRight()
  })
  Inputs.add('w','UP',e => { 
    player.lookUp()
  })
  Inputs.add('s','DOWN',e => { 
    player.lookDown()
  })
  Inputs.add('4', 'RUN', e => {
    //player.running = true
  })
}

loadImages().then(_=>{
  Game.initialize(document.querySelector('canvas'))
  
  Sound.soundVolume = 1
  Sound.musicVolume = 0
  
  loadSounds().then(_=>{
    loadEvents()
    setupInputs()
    loadMaterials()
    loadAnimations()
    Game.loadLevel(MapEditor.demoLevel)
    Game.on('loaded')
  })
})



