import Game from './Game.js'
import View from './View.js'
import PhysicsEntity from './PhysicsEntity.js'

export default class Npc extends PhysicsEntity {
  
  name
    
  constructor(name,x,y,width,height,style){
    super(x,y,width,height,style)
    this.name = name
    
    this.canCollideTop = true
    this.canCollideBottom = true
    this.canCollideLeft = true
    this.canCollideRight = true
    
    this.animation = null
    this.animations = {}
    
    this.behaviour = null
    this.behaviours = {
      'facePlayer': () => {
        this.direction = Math.sign( this.x - Game.player.x )
      },
      'walk': () => {
        if( this.direction > 0 )
          this.moveRight()
        else if( this.direction < 0 )
          this.moveLeft()
      },
      'walkToPlayer': () => {
        this.direction = Math.sign( this.x - Game.player.x )
        if( this.direction > 0 )
          this.moveRight()
        else if( this.direction < 0 )
          this.moveLeft()
      }
    }
  }
  
  jump(){
    if( this.jumping ) 
      return
    if( this.onGround ){
      this.onGround = false
      this.moveUp()
    }
  }
  
  animate(){
    let newAnimation = this.animation
    
    if( this.jumping ){
      newAnimation = 'jump';
    } else if( !this.onGround ) {
      newAnimation = 'idle';
    } else if( this.moving ){
      newAnimation = 'walk'
    } else if( this.look !== 0) {
      newAnimation = 'lookUp'
    } else {
      newAnimation = 'idle'
    }

    if( this.animation != newAnimation ){
      this.animations[this.animation].reset()
      this.animations[newAnimation].reset()
      this.animation = newAnimation
    }
    
    this.animations[this.animation].update()
  }
  
  processAI(){
    let newBehaviour = this.behaviour
    
    const distanceToPlayer = Math.abs(Game.player.x - this.x)
    if( distanceToPlayer < 200 ){
      newBehaviour = 'walkToPlayer'
    } else if( distanceToPlayer < 400 ){
      newBehaviour = 'facePlayer'
    } else {
      newBehaviour = 'walk'
    }
    
    this.behaviour = newBehaviour
    this.behaviours[ this.behaviour ]()
  }
  
  update(){
    this.processAI()
    this.processVelocity()
    this.animate()
  }
  
  render(ctx){
    if( this.animation == null ){
      ctx.strokeRect(0,0,this.width,this.height)
      return
    }
    this.animations[ this.animation ]
      .render(ctx,this.width,this.height)
  }
}