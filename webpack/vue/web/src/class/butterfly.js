/*
 * @Author: JN
 * @Date:   2018-08-23 20:37:18
 * @Last Modified by:   JN
 * @Last Modified time: 2018-08-23 20:39:56
 */

const PI = Math.PI
const pow = Math.pow
const sin = Math.sin
const cos = Math.cos
const atan2 = Math.atan2
const random = Math.random
const _ = {
  getCanvasContext: Symbol('getCanvasContext')
}
let config = {
  direction: PI / 2,
  r: 1,
  speed: 1,
  img: '',
  minDistance: 10
}
class Butter {
  constructor() {
    this.x = 0
    this.y = 0
    this.r = config.r
    this.img = config.img
    this.direction = config.direction
    this.speed = config.speed

    // 跟随的最小距离
    this.prevMinDistance = config.minDistance

    // 跟随节点
    this.prevChain = null

  }

  resolve(brushTool) {
    const prevMinDistance = this.prevMinDistance
    const prevChain = this.prevChain
    if (!this.prevChain) {
      this.resolvePath()
      return
    }
    if (
      // (prevChain.y - this.y) > brushTool.canvas.height / 2 ||
      // (prevChain.x - this.x) > brushTool.canvas.width / 2 ||
      // (prevChain.y - this.y) < -brushTool.canvas.height / 2 ||
      // (prevChain.x - this.x) < -brushTool.canvas.width / 2
      prevChain.pass
    ) {
      this.direction = prevChain.direction
      this.speed = prevChain.speed
    } else {
      let distance = pow(pow(prevChain.y - this.y, 2) + pow(prevChain.x - this.x, 2), 1 / 2)
      this.speed = (1 + (distance - prevMinDistance) / prevMinDistance) * prevChain.speed
      this.direction = atan2(prevChain.y - this.y, prevChain.x - this.x)
    }
  }

  update(brushTool) {
    this.x = this.x + this.speed * cos(this.direction)
    this.y = this.y + this.speed * sin(this.direction)
    if (this.x > brushTool.canvas.width / 2) {
      this.x -= brushTool.canvas.width
      this.pass = true
      if (this.prevChain) this.prevChain.pass = false
    }
    if (this.x < -brushTool.canvas.width / 2) {
      this.x += brushTool.canvas.width
      this.pass = true
      if (this.prevChain) this.prevChain.pass = false
    }
    if (this.y > brushTool.canvas.height / 2) {
      this.y -= brushTool.canvas.height
      this.pass = true
      if (this.prevChain) this.prevChain.pass = false
    }
    if (this.y < -brushTool.canvas.height / 2) {
      this.y += brushTool.canvas.height
      this.pass = true
      if (this.prevChain) this.prevChain.pass = false
    }
    this.resolve(brushTool)
  }

  resolvePath() {
    this.direction = this.direction + (0.5 - random()) * PI / 10
    if (this.direction > PI) {
      this.direction = this.direction - 2 * PI
    }
    if (this.direction < -PI) {
      this.direction = 2 * PI + this.direction
    }
  }

  drawToBrush(pen) {
    pen.beginPath()
    pen.arc(this.x, this.y, this.r, 0, 2 * PI)
    pen.fillStyle = 'white' // blue
    pen.fill()
    pen.stroke()
  }
}

class BrushTool {
  constructor(canvas) {
    this.canvas = canvas
    this.width = canvas.width
    this.height = canvas.height
    this.pen = this[_.getCanvasContext](canvas)
    this.butterChain = []
    this.pen.translate(this.canvas.width / 2, this.canvas.height / 2)
  }

  [_.getCanvasContext](canvas) {
    return canvas.getContext('2d')
  }

  setButterChain(butterChain) {
    this.butterChain = butterChain
  }

  update() {
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.butterChain.forEach(butter => {
      butter.update(this)
    })
  }

  render() {
    this.pen.clearRect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height)
    this.pen.fillStyle = 'black'
    this.pen.fillRect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height)
    this.pen.shadowBlur = 20
    this.pen.shadowColor = 'black' // blue
    this.pen.strokeStyle = 'white' // white
    this.butterChain.forEach(butter => {
      butter.drawToBrush(this.pen)
    })
  }

  loop() {
    this.update()
    this.render()
    requestAnimationFrame(this.loop.bind(this))
  }
}

function butterfly(canvas) {
  let brushTool = new BrushTool(canvas)
  let butterChain = createMulChain(10)
  brushTool.setButterChain(butterChain)
  brushTool.loop.call(brushTool)
  return brushTool
}

function createMulChain(number) {
  let butterChain = []
  for (var i = number - 1; i >= 0; i--) {
    butterChain = butterChain.concat(createButterChain())
  }
  return butterChain
}

function createButterChain() {
  let butterChain = []
  for (var i = 0; i < 5; i++) {
    let butter = new Butter()
    if (i !== 0) butter.prevChain = butterChain[i - 1]
    butterChain.push(butter)
  }
  return butterChain
}


export default butterfly


