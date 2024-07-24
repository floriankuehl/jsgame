import Game from './Game.js'
import Inputs from './Inputs.js'
import Rect from './Rect.js'
import Entity from './Entity.js'
import PhysicsEntity from './PhysicsEntity.js'
import Vector from './Vector.js'
import Animation from './Animation.js'

export default class Player extends PhysicsEntity {
  
  constructor(x,y,width,height,style){
    super(x,y,width,height,style)
    
    this.animations = {}
    this.animation = null
    
    this.movement = new Vector(2,40)
    this.runningFactor = 1.5
    this.maxSpeed = new Vector(6,50)
    this.airControl = .8
    this.damp = .9
    
    this.direction = 1
    this.hitbox = new Rect(
      0, height-20,
      width, 20
    )
  }
  
  jump(){
    if( this.jumping ) 
      return
    if( this.onGround ){
      this.onGround = false
      this.moveUp()
      Game.on('player.jump')
    }
  }
  
  render(ctx){
    if( this.animation ){
      this.animations[this.animation]
        .render(ctx,this.width,this.height)
    }
  }
  
  animate(){
    let newAnimation = this.animation
    
    if( this.look < 0 ){
      newAnimation = 'lookDown'
    } else {
      if( this.jumping ){
        newAnimation = 'jump';
      } else if( !this.onGround ) {
        newAnimation = 'fall';
      } else if( this.moving ){
        newAnimation = this.running ? 'run' : 'walk'
      } else if( this.look !== 0) {
        newAnimation = 'lookUp'
      } else {
        newAnimation = 'idle'
      }
    }
    if( this.animation != newAnimation ){
      this.animations[this.animation].reset()
      this.animations[newAnimation].reset()
      this.animation = newAnimation
    }
    
    this.animations[this.animation].update()
  }
  
  setDirection(){
    if( this.velocity.x == 0 ) return;
    this.direction = Math.sign(this.velocity.x)
  }
  
  setRunning(){
    this.running = Inputs.STATE.RUN
  }
  
  setLookDirection(){
    this.look = 0
    if( Inputs.STATE.UP )
      this.look = 1
    else if( Inputs.STATE.DOWN )
      this.look = -1
  }
  
  update(){
    this.setRunning()
    this.processVelocity()
    this.setLookDirection()
    this.setDirection()
    this.animate()
  }

}