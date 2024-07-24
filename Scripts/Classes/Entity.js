import Rect from './Rect.js'

export default class Entity extends Rect {
  
  constructor(x,y,width,height,style){
    super(x,y,width,height)
    
    this.style = {
      fillStyle: null,
      strokeStyle: null,
      lineWidth:1
    }
    
    if( typeof style == 'object' ){
      this.style = {
        ...this.style,
        ...style
      }
    }
  }
  
  setStyle(ctx){
    for( let k in this.style ){
      const value = this.style[k]
      if( value == null ) continue
      if( k in ctx ) ctx[k] = value
    }
  }
  
  geometry(ctx,local){
    ctx.rect(
      local ? 0 : this.x,
      local ? 0 : this.y,
      this.width,
      this.height
    )
  }
  
  update(){
    
  }
  
  render(ctx,local){
    ctx.beginPath()
    this.geometry(ctx,local)
    if( this.style.fillStyle )
      ctx.fill()
    if( this.style.strokeStyle )
      ctx.stroke()
  }
  
  draw(ctx){
    ctx.save()
    ctx.translate(this.x,this.y)
    this.setStyle(ctx)
    this.render(ctx,true)
    ctx.restore()
  }
  
  
}