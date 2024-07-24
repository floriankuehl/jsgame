import CollidableEntity from './CollidableEntity.js'
import Vector from './Vector.js'

export default class PhysicsEntity extends CollidableEntity {
  constructor(x,y,width,height,style){
    super(x,y,width,height,style)
    
    this.look = 0
    this.onGround = false
    this.running = false
    this.airControl = 1
    this.movement = Vector.zero
    this.runningFactor = 1
    this.maxSpeed = Vector.zero
    this.acceleration = Vector.zero
    this.velocity = Vector.zero
    this.damp = 1
  }
  
  lookDown(){
    this.look = -1
  }
  
  lookUp(){
    this.look = 1
  }
  
  resetLook(){
    this.look = 0
  }
  
  get movementSpeed(){
    return (this.running ? this.runningFactor : 1) * 
      this.movement.x * 
      (this.onGround ? 1 : this.airControl)
  }
  
  moveLeft(){
    if( this.onGround == false || this.look == 0 ){
      this.acceleration.x -= this.movementSpeed
    }
  }
  
  moveRight(){
    if( this.onGround == false || this.look == 0 ){
      this.acceleration.x += this.movementSpeed
    }
  }
  
  moveUp(){
    this.acceleration.y -= this.movement.y
  }
  
  moveDown(){
    this.acceleration.y += this.movement.y
  }
  
  addForce(x,y){
    this.acceleration.add(x,y)
  }
  
  removeForce(x,y){
    this.acceleration.sub(x,y)
  }
  
  stopX(){
    this.velocity.x = 0
  }
  
  stopY(){
    this.velocity.y = 0
  }
  
  stop(){
    this.velocity.mult(0)
  }
  
  get jumping(){
    return this.velocity.y < 0
  }
  
  get moving(){
    return Math.floor(this.velocity.x) !== 0
  }
  
  get idle(){
    return this.onGround && !this.moving
  }
  
  processVelocity(){
    this.velocity.add(this.acceleration)
    this.acceleration.mult(0)
    
    this.velocity._clamp(
      'x',
      -this.maxSpeed.x * (this.running ? this.runningFactor : 1),
      this.maxSpeed.x * (this.running ? this.runningFactor : 1)
    )
    this.velocity._clamp(
      'y',
      -this.maxSpeed.y,
      this.maxSpeed.y
    )
    
    this.velocity.mult(this.damp).round(1)
    this.add(this.velocity)
    
    if( this.onGround ) this.stopY()
  }
}