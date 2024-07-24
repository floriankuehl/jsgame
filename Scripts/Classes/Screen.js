export default class Screen {
  
  static get width(){
    return innerWidth
  }
  
  static get height(){
    return innerHeight
  }
  
  static get halfWidth(){
    return innerWidth * .5
  }
  
  static get halfHeight(){
    return innerHeight * .5
  }
}