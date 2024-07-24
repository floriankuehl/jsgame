const 
  QUARTER_PI = Math.PI / 4,
  HALF_PI = Math.PI / 2,
  PI = Math.PI,
  TWO_PI = Math.PI + Math.PI
  
const 
  floor = Math.floor,
  ceil = Math.ceil,
  round = Math.round,
  pow = Math.pow,
  random = (a,b)=>{
    if( typeof b == 'number' )
      return a + Math.random() * b
    return Math.random() * a
  },
  randomInt = (a,b) => floor( random(a,b) )
