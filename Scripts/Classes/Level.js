import Game from './Game.js'
import Screen from './Screen.js'
import Vector from './Vector.js'
import Rect from './Rect.js'
import Entity from './Entity.js'
import CollidableEntity from './CollidableEntity.js'
import PhysicsEntity from './PhysicsEntity.js'

export default class Level extends Rect {
  constructor(name,width,height,playerStart){
    super(0,0,width,height)
    
    this.name = name
    this.playerStart = playerStart || Vector.zero
    this.offset = Vector.zero
    this.gravity = new Vector(0,1.5)
    
    this.layers = {
      background:[],
      foreground:[],
      entity:[]
    }
    
    this.onScreen = []
  }
  
  addToLayer(name,entity){
    this.layers[name].push(entity)
  }
  
  removeFromLayer(name,entity){
    const 
      l = this.layers[name],
      i = l.indexOf(entity)
    if( i < 0 ) return
    l.remove(i)
  }
  
  addEntity(entity){
    this.addToLayer('entity',entity)
  }
  
  removeEntity(entity){
    this.removeFromLayer('entity',entity)
  }
  
  addBackground(entity){
    this.addToLayer('background',entity)
  }
  
  removeBackground(entity){
    this.removeFromLayer('background',entity)
  }
  
  addForeground(entity){
    this.addToLayer('foreground',entity)
  }
  
  removeForeground(entity){
    this.removeFromLayer('foreground',entity)
  }
  
  get entitiesOnScreen(){
    return this.layers.entity.filter(e=>{
      const 
        l = this.left + e.left,
        r = this.left + e.right,
        o = l < 0 && r >= Screen.width
      return o || ((l >= 0) && (l < Screen.width)) || ((r >= 0) && (r < Screen.width))
    })
  }
  
  checkCollisions(){
    const 
      player = Game.player,
      absLeft = this.left + player.left,
      absRight = this.left + player.right,
      maxLeft = -this.width + Screen.width,
      maxRight = this.width - Screen.width
    
    if( absLeft < (Screen.width * Game.shiftDelta) ){
      if( this.x < 0 ){ 
        if( player.velocity.x < 0 ){
          this.x -= player.velocity.x
          if( this.x > 0 ) this.x = 0
        }
      }
    }
    
    if( absRight > (Screen.width * (1-Game.shiftDelta)) ){
      if( this.x < maxRight ){
        if( player.velocity.x > 0 ){
          this.x -= player.velocity.x
        }
      }
    }
    
    this._clamp('x',maxLeft,maxRight)
    
    let stop = false
    this.onScreen.forEach(e =>{
      if( e instanceof PhysicsEntity )
        e.addForce(this.gravity)
      if( !stop ){
        if( e instanceof CollidableEntity )
          stop = e.checkCollisions()
      }
      return stop
    })
    
    //Level Rect
    if( player.left < this.x ){
      player.left = this.x
      player.velocity.x = 0
      Game.on('player.hitwall')
    }
    
    if( player.right > this.width ){
      player.right = this.width
      player.velocity.x = 0
      Game.on('player.hitwall')
    }
    
    //Level Ground
    if( player.bottom > Screen.height ){
      player.bottom = Screen.height
      player.onGround = player.onGround || (player.bottom == Screen.height)
      Game.on('player.die')
    }
  }
  
  update(){
    Game.player.addForce(this.gravity)
    this.onScreen = this.entitiesOnScreen
    this.layers.background.forEach(e => e.update())
    this.onScreen.forEach(e => {
      if( 'addForce' in e )
        e.addForce(this.gravity)
      e.update()
    })
    this.checkCollisions()
    this.layers.foreground.forEach(e => e.update())
  }
  
  draw(ctx){
    ctx.save()
    ctx.translate(this.x,this.y)
    this.layers.background.forEach(e => e.draw(ctx))
    this.onScreen.forEach(e => e.draw(ctx))
    Game.player.draw(ctx)
    this.layers.foreground.forEach(e => e.draw(ctx))
    ctx.restore()
  }
  
  drawHitboxes(ctx){
    ctx.save()
    ctx.translate(this.x,this.y)
    this.onScreen.forEach(e =>{ 
      if( e instanceof CollidableEntity )
        e.drawHitbox(ctx) 
    })
    Game.player.drawHitbox(ctx)
    ctx.restore()
  }
}