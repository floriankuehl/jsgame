export default class Inputs {
  static STATE = {
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
    JUMP: false,
    RUN: false,
    FIRE: false
  }
  static #map = {}
  static #actions = {}
  static #pressActions = {}
  
  static registerState(key,alias){
    this.#map[key] = alias
  }
  
  static setState(key,state){
    this.STATE[ this.#map[key] ] = state
  }
  
  static getState(key){
    return this.STATE[ this.#map[key] ]
  }
  
  static hasKey(key){
    return key in this.#actions
  }
  
  static hasName(key,name){
    return name in this.#actions[key]
  }
  
  static hasPressKey(key){
    return key in this.#pressActions
  }
  
  static hasPressName(key,name){
    return name in this.#pressActions[key]
  }
  
  static add(key,name,action){
    this.registerState(key,name)
    if( !this.hasKey(key) )
      this.#actions[key] = {}
    this.#actions[key][name] = action
  }
  
  static addPress(key,name,action){
    if( !this.hasPressKey(key) )
      this.#pressActions[key] = {}
    this.#pressActions[key][name] = action
  }
  
  static remove(key,name){
    if( this.hasKey(key) && this.hasName(key,name) ){
      delete this.#actions[key][name]
    }
  }
  
  static removePress(key,name){
    if( this.hasPressKey(key) && this.hasPressName(key,name) ){
      delete this.#pressActions[key][name]
    }
  }
  
  static listen(){
    for( let key in this.#map ){
      if( this.getState(key) ){
        const actions = this.#actions[key]
        for( let name in actions ){
          actions[name]({key,name})
        }
      }
    }
  }
  
  static processPress(key){
    if( this.hasPressKey(key) ){
      const actions = this.#pressActions[key]
      for( let name in actions ){
        actions[name]({key,name})
      }
    }
  }
  
  static initialize(){
    window.addEventListener(
      'keydown',
      e => this.setState(e.key,true)
    )
    window.addEventListener(
      'keyup',
      e => this.setState(e.key,false)
    )
    window.addEventListener(
      'keypress',
      e => this.processPress(e.key)
    )
  }
}

