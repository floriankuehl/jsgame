import Game from './Game.js'
import Screen from './Screen.js'
import View from './View.js'

import Vector from './Vector.js'
import Rect from './Rect.js'

import Animation from './Animation.js'

import Entity from './Entity.js'
import ColliableEntity from './CollidableEntity.js'
import PhysicsEntity from './PhysicsEntity.js'

import Platform from './Platform.js'
import Npc from './Npc.js'

import Level from './Level.js'

export default class MapEditor {
  
  static get demoLevel(){
  
    const 
      levelSize = 4000,
      groundHeight = 30,
      sunPosition = 1000,
      sunSize = 100,
      groundLevel = Screen.height - groundHeight
    
    const result = new Level(
      'Demo',
      levelSize, Screen.height,
      new Vector(30,groundLevel)
    )
    
    //BACKGROUND -----------------
    
    const bg = new Entity(
      0, 0, 
      Screen.width, Screen.height,
      View.getMaterial('sky')(Screen.height)
    )
    bg.update = ()=>{ bg.x = -result.x }
    result.addBackground(bg)
    
    const sun = new Entity(
      sunPosition, 100,
      70, 70,
      View.getMaterial('sun')()
    )
    sun.geometry = (ctx)=>{ 
      ctx.ellipse(
        sun.width, sun.height,
        sun.width, sun.height,
        TWO_PI, 
        0, 360
      ) 
    }
    sun.update = ()=>{ sun.x = sunPosition + -(result.x * .95) }
    result.addBackground(sun)
    
    const mountainsBG = new Entity(
      0, 400,
      levelSize, Screen.height-400,
      View.getMaterial('mountains.background')()
    )
    mountainsBG.geometry = (ctx)=>{
      ctx.scale(.75,.75)
      ctx.rect(
        0, 0,
        mountainsBG.width,
        mountainsBG.height
      )
    }
    mountainsBG.update = ()=>{ mountainsBG.x = -(result.x * .9) }
    result.addBackground( mountainsBG )
    
    const mountainsFG = new Entity(
      0, 500,
      levelSize, Screen.height - 500,
      View.getMaterial('mountains.foreground')()
    )
    mountainsFG.update = ()=>{ mountainsFG.x = -(result.x * .8) }
    result.addBackground( mountainsFG )
    
    const bushMaterial = View.getMaterial('image.bush')()
    bushMaterial.fillStyle.setTransform({
      a: 0.25, // Horizontal scaling. A value of 1 results in no scaling.
      b: 0,   // Vertical skewing.
      c: 0,   // Horizontal skewing.
      d: 0.25, // Vertical scaling. A value of 1 results in no scaling.
      e: 0,   // Horizontal translation (moving).
      f: 0    // Vertical translation (moving).
    })
    
    result.addForeground(
      new Entity(
        350, Screen.height - 130,
        200, 130,
        bushMaterial
      )
    )
    
    result.addForeground(
      new Entity(
        500, Screen.height - 130,
        200, 130,
        bushMaterial
      )
    )
    
    //PLATFORMS ------------------
    
    result.addEntity(
      new Platform(
        'grass',
        0, groundLevel, 
        400, groundHeight,
        View.getMaterial('floor.grass')(groundHeight)
      )
    )
    
    result.addEntity(
      new Platform(
        'snow',
        400, groundLevel - groundHeight,
        400, 10 + groundHeight * 2,
        View.getMaterial('floor.snow')()
      )
    )
       
    result.addEntity(
      new Platform(
        'wood',
        800, groundLevel - ( groundHeight * 3),
        400, groundHeight * 4,
        View.getMaterial('floor.wood')(groundHeight * 4)
      )
    )
    
    result.addEntity(
      new Platform(
        'concrete',
        1200, groundLevel - ( groundHeight * 5),
        400, groundHeight * 6,
        View.getMaterial('floor.concrete')(groundHeight * 6)
      )
    )
    
    const water = new Platform(
      'water',
      1600, groundLevel,
      400, groundHeight,
      View.getMaterial('floor.water')()
    )
    water.hitbox = new Rect(
      0, 25,
      400, 5
    )
    result.addEntity(water)
    
    result.addEntity(
      new Platform(
        'grass',
        2000, groundLevel - ( groundHeight * 4 ),
        levelSize - 2000, groundHeight * 5,
        View.getMaterial('floor.grass')(groundHeight)
      )
    )
    
    for( let i = 0; i < 10; i++ ){
      result.addEntity(
        new Platform(
          'wood',
          2100 + (i * 100), 
          groundLevel - ( groundHeight * (5+i) ),
          101, groundHeight * (5+i),
          View.getMaterial('floor.wood')(groundHeight)
        )
      )
    }
    
    result.addEntity(
      new Platform(
        'concrete',
        3100, 400,
        200, 400 + groundHeight,
        View.getMaterial('floor.concrete')(400)
      )
    )
    
    //NPCs
    
    const 
      animationSpeed = 10,
      spriteWidth = 17,
      spriteHeight = 29,
      turtleSpritesheet = View.getImage('spritesheet.turtle')
    
    function Turtle(x,y){
      const npc = new Npc('Turtle',x, y, 40, 68)
      npc.movement = new Vector(1,30)
      npc.hitbox = new Rect(0,0,npc.width,npc.height)
      
      npc.animations = {
        'idle': new Animation(
          npc,
          turtleSpritesheet,
          0, 4,
          spriteWidth, spriteHeight,
          animationSpeed,
          0, 1
        ),
        'walk': new Animation(
          npc,
          turtleSpritesheet,
          0, 4,
          spriteWidth, spriteHeight,
          animationSpeed,
          0, 2
        )
      }
      npc.animation = 'idle'
      return npc
    }
    
    result.addEntity(
      Turtle(200,500)
    )
    
    return result
  }
}