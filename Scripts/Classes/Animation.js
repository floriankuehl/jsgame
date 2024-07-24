import Game from './Game.js'
import View from './View.js'
import Vector from './Vector.js'
import Rect from './Rect.js'

export default class Animation extends Rect {
  
  target
  frame = 0
  image
  offset
  speed = 10
  direction = 1
  frameStart
  frameCount
  
  constructor(target,image,ox,oy,width,height,speed,start,count){
    super(0,0,width,height)
    
    this.target = target
    this.image = image
    this.offset = new Vector(ox,oy)
    this.speed = speed
    
    this.frameStart = start
    this.frameCount = count
  }
  
  reset(){
    this.frame = 0
  }
  
  set offset(value){
    this.setOffset(value.x,value.y)
  }
  
  setOffset(x,y){
    this.offset.x = x
    this.offset.y = y
  }
  
  update(){
    if( Game.frame % this.speed == 0 ){
      this.frame = this.frameStart + ( ( this.frame + 1 ) % this.frameCount )
      this.x = this.offset.x + ( this.width * this.frame )
      this.y = this.offset.y
    }
  }
  
  render(ctx,width,height){
    const dir = this.target.direction
    ctx.scale(dir, 1)
    ctx.drawImage(
      this.image,
      this.x, this.y,
      this.width, this.height,
      0, 0,
      dir * width, height
    )
  }
}