import Game from './Game.js'
import Sound from './Sound.js'
import CollidableEntity from './CollidableEntity.js'
import Rect from './Rect.js'
import Vector from './Vector.js'

export default class Platform extends CollidableEntity {
  
  constructor(type,x,y,width,height,style){
    super(x,y,width,height,style)
    this.type = type
    this.hitbox = new Rect(0,0,width,10)
    
    this.canCollideTop = true
    this.canCollideLeft = true
    this.canCollideRight = true
    //TODO: MOVABLE PLATFORMS
  }
  
  checkCollisions(){
    const 
      player = Game.player,
      insideX = this.hitboxContainsX(player.hitboxLeft) || this.hitboxContainsX(player.hitboxRight),
      onTop = this.checkCollisionTop(player),
      onLeft = this.checkCollisionLeft(player),
      onRight = this.checkCollisionRight(player)
    
    if( onLeft && (player.bottom > this.hitboxTop) ){
      player.stopX()
      player.right = this.hitboxLeft
      player.velocity.x -= player.movement.x
      Game.on('player.hitwall')
    }
    
    if( onRight && (player.bottom > this.hitboxTop) ){
      player.stopX()
      player.left = this.hitboxRight
      player.velocity.x += player.movement.x
      Game.on('player.hitwall')
    }
    
    if( insideX && onTop ){
      if( player.platform != this )
        player.landOnPlatform(this)
      player.bottom = this.hitboxTop
    } else if( player.platform == this ){
      player.releasePlatform()
    }
    return false
  }
  
  update(){
    
  }
}