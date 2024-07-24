export default class Sound {
  
  static #context
  static #sounds = {}
  static #soundGain
  
  static #music = {}
  static #musicGain
  
  static initialize(options){
    const AudioContext = window.AudioContext || window.webkitAudioContext
    this.#context = new AudioContext()
    
    this.#soundGain = this.#context.createGain()
    this.#soundGain.gain.value = 1
    this.#soundGain.connect(this.#context.destination)
    
    this.#musicGain = this.#context.createGain()
    this.#musicGain.gain.value = .8
    this.#musicGain.connect(this.#context.destination)
    
    if( options ){
      for( let k in options ){
        if( k in this ) this[k] = options[k]
      }
    }
  }
  
  static get soundVolume(){
    return this.#soundGain.gain.value
  }
  
  static set soundVolume(value){
    this.#soundGain.gain.value = value
  }
  
  static get musicVolume(){
    return this.#musicGain.gain.value
  }
  
  static set musicVolume(value){
    this.#musicGain.gain.value = value
  }

  static exists(name){
    return name in this.#sounds
  }

  static loadFile(name,fileName){
    return new Promise((resolve)=>{
      const request = new XMLHttpRequest()
      request.open('GET',fileName)
      request.responseType = 'arraybuffer'
      request.onload = () => {
        this.#context.decodeAudioData(request.response,(data)=>{
          resolve(data)
        })
      }
      request.send()
    })
  }

  static loadSound(name,fileName){
    return this.loadFile(name,fileName).then(data=>{
      this.#sounds[name] = data
    })
  }
  
  static loadMusic(name,fileName){
    return this.loadFile(name,fileName).then(data=>{
      this.#music[name] = data
    })
  }
  
  static ping(){
    switch(this.#context.state){
      case'suspended': this.#context.resume(); break
    }
  }
  
  static suspend(){
    this.#context.suspend()
  }
  
  static resume(){
    this.#context.resume()
  }
  
  static createBuffer(data){
    const source = this.#context.createBufferSource()
    source.buffer = data
    return source
  }
  
  static getSound(name){
    const source = this.createBuffer(this.#sounds[name])
    source.connect(this.#soundGain)
    return source
  }
  
  static getMusic(name){
    const source = this.createBuffer(this.#music[name])
    source.connect(this.#musicGain)
    return source
  }
  
  static playSound(name){
    if( this.soundVolume > 0 ){
      this.ping()
      this.getSound(name).start()
    }
  }
  
  static playMusic(name){
    let music = null
    if( this.musicVolume > 0 ){
      this.ping()
      music = this.getMusic(name)
      music.loop = 1
      music.start()
    }
    return music
  }
}