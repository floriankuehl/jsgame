import Inputs from './Inputs.js'
import Player from './Player.js'
import Vector from './Vector.js'
import Time from './Time.js'
import Sound from './Sound.js'
import View from './View.js'

export default class Game {
  
  static #fixedUpdateRate = 30
  static #fixedInterval = null
  
  static #playerWidth = 42
  static #playerHeight = 50
  static #playerWalkInterval
  static #playerWalkTimeout = 300
  
  static #frame = 0
  static #frameLoop = 216000
  
  static #events = {}
  static #running = false
  
  static player
  static level
  static shiftDelta = .1
  static gravity
  
  static get frame(){
    return this.#frame
  }
  
  static stop(){
    this.#running = false
  }
  
  static start(){
    this.#running = true
  }
  
  static togglePause(){
    this.#running = !this.#running
    if( this.#running ){
      Sound.resume()
    } else {
      Sound.suspend()
    }
  }
   
  static initialize(canvas){
    Sound.initialize()
    Inputs.initialize()
    View.initialize(canvas)
    View.loadGenericMaterials()
    
    this.player = new Player(0, 0, this.#playerWidth, this.#playerHeight)
    
    this.loop()
    this.fixedLoop()
  }
  
  static loadLevel(level){
    this.level = level
    this.player.left = level.playerStart.x
    this.player.bottom = level.playerStart.y
  }
  
  static loop(){
    Time.cycle()
    this.#frame = ( this.#frame + 1 ) % this.#frameLoop
    if( this.#running ){
      this.player.update()
      this.level.update()
      this.playerWalkSounds()
      View.draw()
    }
    requestAnimationFrame(_=>this.loop())
  }
  
  static fixedLoop(){
    this.#fixedInterval = setInterval(
      _=>{
        Time.cycleFixed()
        if( this.#running ) Inputs.listen()
      },
      this.#fixedUpdateRate
    )
  }
  
  static playerWalkSounds(){
    const player = this.player
    let soundName = 'walk.ground'
    if( player.platform ){
      soundName = 'walk.' + player.platform.type
    }
    if( player.idle ){
      if( this.#playerWalkInterval ) 
        this.#playerWalkInterval = clearInterval(this.#playerWalkInterval)
      return
    }
    if( player.onGround ){
      if( this.#playerWalkInterval ) 
        return
      if( player.moving ){
        if( Sound.exists(soundName) ){
          Sound.playSound(soundName)
          this.#playerWalkInterval = setInterval(_=>{
            Sound.playSound(soundName)
          },this.#playerWalkTimeout)
        }
      }
      return
    }
    this.#playerWalkInterval = clearInterval(this.#playerWalkInterval)
  }
  
  static addEvent(name,action){
    if( name in this.#events )
      this.#events[name].push(action)
    else
      this.#events[name] = [action]
  }
  
  static on(name,args){
    const _args = Array.isArray(args) ? args : []
    if( name in this.#events )
      this.#events[name].forEach(action=>action(..._args))
  }
}