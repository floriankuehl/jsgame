export default class Vector {
  
  constructor(x,y){
    this.x = x
    this.y = y
  }
  
  static get zero(){
    return new Vector(0,0)
  }
  
  static get one(){
    return new Vector(1,1)
  }
  
  get copy(){
    return new Vector(this.x,this.y)
  }
  
  _n(prop,pow){
    return Math.pow(this[prop],pow)
  }
  
  xn(pow){
    return this._n('x',pow)
  }
  
  yn(pow){
    return this._n('y',pow)
  }
  
  floor(){
    this.x = Math.floor(this.x)
    this.y = Math.floor(this.y)
    return this
  }
  
  round(decimals){
    const 
      p = Math.pow(10,decimals),
      sx = Math.sign(this.x),
      sy = Math.sign(this.y)
    this.x = (Math.floor(Math.abs(this.x) * p) / p) * sx 
    this.y = (Math.floor(Math.abs(this.y) * p) / p) * sy
    return this;
  }
  
  _clamp(prop,min,max){
    this[prop] = this[prop] < min ? min : 
      this[prop] > max ? max : this[prop]
    return this
  }
  
  clamp(min,max){
    this.clamp('x',min,max)
    this.clamp('y',min,max)
    return this
  }
  
  add(x,y){
    if( x instanceof Vector )
      return this.add(x.x,x.y)
    if( typeof y == 'number' ){
      this.x += x
      this.y += y
      return this
    }
    this.x += x
    this.y += x
    return this
  }
  
  sub(x,y){
    if( x instanceof Vector )
      return this.sub(x.x,x.y)
    if( typeof y == 'number' ){
      this.x -= x
      this.y -= y
      return this
    }
    this.x -= x
    this.y -= x
    return this
  }
  
  mult(x,y){
    if( x instanceof Vector )
      return this.mult(x.x,x.y)
    if( typeof y == 'number' ){
      this.x *= x
      this.y *= y
      return this
    }
    this.x *= x
    this.y *= x
    return this
  }
  
  div(x,y){
    if( x instanceof Vector )
      return this.div(x.x,x.y)
    if( typeof y == 'number' ){
      this.x /= x
      this.y /= y
      return this
    }
    this.x /= x
    this.y /= x
    return this
  }
  
  get sqrMagnitude(){
    return this.x * this.x + this.y * this.y
  }
  
  get magnitude(){
    return Math.sqrt(this.sqrMagnitude)
  }
  
  dist(x,y){
    if( x instanceof Vector )
      return this.dist(x.x,x.y)
    return new Vector(x.x-this.x,x.y-this.y)
  }
  
  sum(){
    const result = this.copy;
    [...arguments].forEach(v=>result.add(v))
    return result
  }
}