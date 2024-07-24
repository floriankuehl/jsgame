import Game from './Game.js'
import Screen from './Screen.js'
import Time from './Time.js'

export default class View {
  
  static #canvas
  static drawingContext
  static #images = {}
  static #materials = {}

  static showInfo = false
  static showHitboxes = false
  static showSpritesheet = false
  
  static initialize(canvas){
    this.canvas = canvas
    
    addEventListener('resize',e => {
      this.#canvas.width = Screen.width
      this.#canvas.height = Screen.height
    },false)
    
    this.#canvas.width = Screen.width
    this.#canvas.height = Screen.height
  }
  
  static get canvas(){
    return this.#canvas
  }
  
  static set canvas(value){
    this.#canvas = value
    this.drawingContext = value.getContext('2d')
  }
  
  static addImage(name,fileName){
    return new Promise(resolve => {
      const img = document.createElement('img')
      img.addEventListener('load',_=>{
        this.#images[name] = img
        resolve(img)
      })
      img.src = fileName
    })    
  }
  
  static hasImage(name){
    return name in this.#images
  }
  
  static getImage(name){
    return this.hasImage(name) ? this.#images[name] : null
  }
  
  static linearGradient(x1,y1,x2,y2){
    return this.drawingContext.createLinearGradient(x1,y1,x2,y2)
  }
  
  static radialGradient(x1,y1,r1,x2,y2,r2){
    return this.drawingContext.createRadialGradient(x1,y1,r1,x2,y2,r2)
  }
  
  static pattern(name,direction){
    const image = this.getImage(name)
    const pattern = this.drawingContext.createPattern(image,direction)
    pattern.width = image.width
    pattern.height = image.height
    return pattern
  }
  
  static image(name){
    const image = this.getImage(name)
    const pattern = this.drawingContext.createPattern(image,'no-repeat')
    pattern.width = image.width
    pattern.height = image.height
    return pattern
  }
  
  static addMaterial(name,style){
    this.#materials[name] = style
  }
  
  static getMaterial(name){
    return this.hasMaterial(name) ? this.#materials[name] : null
  }
  
  static hasMaterial(name){
    return name in this.#materials
  }
  
  static loadGenericMaterials(){
    this.addMaterial('generic.fill',(fillStyle)=>{
      return {fillStyle}
    })
    
    this.addMaterial('generic.stroke',(strokeStyle,lineWidth,lineJoin)=>{
      return {strokeStyle,lineWidth,lineJoin}
    })
    
    this.addMaterial('generic.fillStroke',(fillStyle,strokeStyle,lineWidth,lineJoin)=>{
      return {fillStyle,strokeStyle,lineWidth,lineJoin}
    })
    
    this.addMaterial('generic.linearGradient',(x1,y1,x2,y2,stops)=>{
      const fillStyle = this.linearGradient(x1,y1,x2,y2)
      stops.forEach(s => {
        fillStyle.addColorStop(s[0],s[1])
      })
      return {fillStyle}
    })
    
    this.addMaterial('generic.verticalLinearGradient',(height,stops)=>{
      return this.getMaterial('generic.linearGradient')(0,0,0,height,stops)
    })
    
    this.addMaterial('generic.pattern',(imgName,repeat)=>{
      const fillStyle = this.pattern(imgName,repeat)
      return {fillStyle}
    })
    
    this.addMaterial('generic.image',(imgName)=>{
      const fillStyle = this.image(imgName)
      return {fillStyle}
    })
  }
  
  static createMaterial(type,args){
    return this.getMaterial(`generic.${type}`)(...args)
  }
  
  static toggleInfo(){
    this.showInfo = !this.showInfo
  }
  
  static toggleHitboxes(){
    this.showHitboxes = !this.showHitboxes
  }
  
  static toggleSpritesheet(){
    this.showSpritesheet = !this.showSpritesheet
  }
  
  static draw(){
    this.drawingContext.clearRect(0,0,this.#canvas.width,this.#canvas.height)
    Game.level.draw(this.drawingContext)
    
    if( this.showInfo ) this.drawInfo(this.drawingContext)
    if( this.showHitboxes ) this.drawHitboxes(this.drawingContext)
    if( this.showSpritesheet ){
      //const e = Game.level.layers.entity[ Game.level.layers.entity.length - 1]
      //this.drawAnimationSpritesheet(this.drawingContext,e.animations[ e.animation ])
      this.drawPlayerSpritesheet(this.drawingContext)
    }
  }

  static drawHitboxes(ctx){
    ctx.strokeStyle = '#00ff00'
    Game.level.drawHitboxes(ctx)
  }
  
  static drawInfo(ctx){
    ctx.save()
    ctx.translate(Screen.width - 150, 0)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0,0,150,120)
    
    ctx.fillStyle = '#000000'
    ctx.fillText(`FPS: ${Time.frameRate}`,10,15)
    ctx.fillText(`FFPS: ${Time.fixedRate}`,10,30)
    ctx.fillText(`Entities: ${Game.level.onScreen.length}/${Game.level.layers.entity.length}`,10,45)
    ctx.fillText(`Level: ${Game.level.name} at ${Game.level.left}`,10,60)
    ctx.fillText(`Player: ${Game.player.left.toFixed(1)}`,10,75)
    ctx.fillText(`Velocity: ${Game.player.velocity.x.toFixed(1)} ${Game.player.velocity.y.toFixed(1)}`,10,90)
    ctx.fillText(`Animation: ${Game.player.animation}`,10,105)
    ctx.restore()
  }
  
  static drawPlayerSpritesheet(ctx){
    const animation = Game.player.animations[ Game.player.animation ]
    this.drawAnimationSpritesheet(ctx,animation)
  }
  
  static drawAnimationSpritesheet(ctx,animation){
    ctx.save()
    ctx.drawImage(animation.image,0,0)
    ctx.strokeStyle = '#0F0'
    
    ctx.translate(animation.offset.x,animation.offset.y)
    for( let i=0; i<animation.frameCount; i++ ){
      ctx.strokeRect(
        animation.offset.x + animation.x + (animation.width * i), 
        animation.offset.y, 
        animation.width, 
        animation.height
      )
    }
    ctx.restore()
  }
}