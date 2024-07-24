import Vector from './Vector.js'

export default class Rect extends Vector {
  constructor(x,y,width,height){
    super(x,y)
    this.width = width
    this.height = height
  }
  
  get left(){
    return this.x
  }
  
  set left(value){
    this.x = value
  }
  
  get top(){
    return this.y
  }
  
  set top(value){
    this.y = value
  }
  
  get right(){
    return this.x + this.width
  }
  
  set right(value){
    this.x = value - this.width
  }
  
  get bottom(){
    return this.y + this.height
  }
  
  set bottom(value){
    this.y = value - this.height
  }
   
  containsX(value){
    return !( value < this.left || value > this.right )
  }
  
  containsY(value){
    return !( value < this.top || value > this.bottom )
  }
  
  contains(x,y){
    return this.containsX(x) && this.containsY(y)
  }
}