import Entity from './Entity.js'
import Rect from './Rect.js'

export default class CollidableEntity extends Entity {
  
  constructor(x,y,width,height,style){
    super(x,y,width,height,style)
    this.hitbox = new Rect(0,0,width,height)
    
    this.canCollideTop = false
    this.canCollideBottom = false
    this.canCollideLeft = false
    this.canCollideRight = false
  }
  
  checkCollisions(){
    return false
  }
  
  drawHitbox(ctx){
    ctx.save()
    ctx.translate(this.x,this.y)
    ctx.strokeRect(
      this.hitbox.x, this.hitbox.y,
      this.hitbox.width, this.hitbox.height
    )
    ctx.restore()
  }
  
  get hitboxLeft(){
    return this.left + this.hitbox.left
  }
  
  get hitboxRight(){
    return this.left + this.hitbox.right
  }
  
  get hitboxTop(){
    return this.top + this.hitbox.top
  }
  
  get hitboxBottom(){
    return this.top + this.hitbox.bottom
  }
  
  edgesLeft(entity){
    const edge = this.hitboxLeft
    return entity.hitboxLeft < edge && entity.hitboxRight >= edge
  }
  
  edgesRight(entity){
    const edge = this.hitboxRight
    return entity.hitboxLeft <= edge && entity.hitboxRight > edge
  }
  
  edgesTop(entity){
    const edge = this.hitboxTop
    return entity.hitboxTop < edge && entity.hitboxBottom >= edge
  }
  
  edgesBottom(entity){
    const edge = this.hitboxBottom
    return entity.hitboxBottom > edge && entity.hitboxTop <= edge
  }
  
  checkCollisionTop(entity){
    return this.canCollideTop && 
      (entity.velocity.y >= 0) && 
      ( this.edgesTop(entity) || ( Math.abs( this.hitboxTop - entity.hitboxBottom ) <= entity.velocity.y ) )
  }
  
  checkCollisionBottom(entity){
    return this.canCollideBottom && 
      (entity.velocity.y < 0) && 
      ( this.edgesBottom(entity) || ( Math.abs( this.hitboxBottom - entity.hitboxTop ) <= -entity.velocity.y ) )
  }
  
  checkCollisionLeft(entity){
    return this.canCollideLeft && 
      (entity.velocity.x > 0) && 
      ( this.edgesLeft(entity) || ( Math.abs( this.hitboxLeft - entity.hitboxRight ) <= entity.velocity.x ) )
  }
  
  checkCollisionRight(entity){
    return this.canCollideRight && 
      (entity.velocity.x < 0) && 
      ( this.edgesRight(entity) || ( Math.abs( this.hitboxRight - entity.hitboxLeft ) <= -entity.velocity.x ) )
  }
  
  hitboxContainsX(value){
    const 
      left = this.x + this.hitbox.x,
      right = left + this.hitbox.width      
    return !( value < left || value > right )
  }
  
  hitboxContainsY(value){
    const 
      top = this.y + this.hitbox.y,
      bottom = top + this.hitbox.height
    return !( value < top || value > bottom )
  }
  
  hitboxContains(x,y){
    return this.hitboxContainsX(x) && this.hitboxContainsY(y)
  }
  
  landOnPlatform(entity){
    this.platform = entity
    this.onGround = true
    this.bottom = entity.hitboxTop
    this.velocity.y = 0
  }
  
  releasePlatform(){
    this.platform = false
    this.onGround = false
  }
}