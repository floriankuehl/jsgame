export default class Time {
  static #last
  static #now
  static #sampleSize = 60
  static #sampleIndex = 0
  static #frameSamples = []
  
  static #fixedLast
  static #fixedNow
  static #fixedSampleSize = 60
  static #fixedSampleIndex = 0
  static #fixedFrameSamples = []
  
  static cycle(){
    this.#last = this.#now
    this.#now = performance.now()
    
    let frameDelta = this.delta
    if( frameDelta > 0 ){
      this.#frameSamples[ this.#sampleIndex ]  = Math.round(1 / frameDelta)
      this.#sampleIndex = (this.#sampleIndex + 1) % this.#sampleSize
    }
  }
  
  static cycleFixed(){
    this.#fixedLast = this.#fixedNow
    this.#fixedNow = performance.now()
    
    let frameDelta = this.fixedDelta
    if( frameDelta > 0 ){
      this.#fixedFrameSamples[ this.#fixedSampleIndex ]  = Math.round(1 / frameDelta)
      this.#fixedSampleIndex = (this.#fixedSampleIndex + 1) % this.#fixedSampleSize
    }
  }
  
  static get frameRate(){
    let average = 0;
    this.#frameSamples.forEach(v => average += v)
    return Math.round( average / this.#frameSamples.length);
  }
  
  static get fixedRate(){
    let average = 0;
    this.#fixedFrameSamples.forEach(v => average += v)
    return Math.round( average / this.#fixedFrameSamples.length);
  }
  
  static get delta(){
    if( !this.#last )
      return 0
    return (this.#now - this.#last) / 1000
  }
  
  static get fixedDelta(){
    if( !this.#fixedLast )
      return 0
    return (this.#fixedNow - this.#fixedLast) / 1000
  }
}