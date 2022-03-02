var FlowingCircleLine = function (linePath, lineLength, lineColor, moveSpeed) {
    var circleLine = new FlowingLine(linePath, lineLength, lineColor, moveSpeed, true)
    return circleLine
  }
  
  var FlowingLine = function (linePath, lineLength, lineColor, moveSpeed, isCircleLine) {
  
    this.line = null;
  
    //线条运动路径，默认沿X轴从-100到100
    this.linePath = linePath ? linePath : new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-100, 0, 0),
        new THREE.Vector3(100, 0, 0)
      ]
    )
  
    //线段颜色
    this.lineColor = lineColor ? lineColor : {
      r: 0.2,
      g: 0.5,
      b: 0.8
    }
  
  
    //路径上取点的个数
    this.pathPointNums = 100;
  
    //路径上取线段的长度
    this.lineLength = lineLength ? lineLength : 20;
  
    //开始取点的位置，自增后，取等长线段，模拟移动
    this.lineStartIndex = 0
  
    //存放要画线的点
    this.linePoits = []
  
    //线移动的速度
    this.moveSpeed = moveSpeed ? moveSpeed : 4
  
  
    this.initLine = (() => {
  
      //在路径上取指定个数的点
      this.pathPoints = this.linePath.getPoints(this.pathPointNums)
  
      //满足环形路径线流动，多取一个路径上的点收尾相连
      this.pathPoints.push(...this.pathPoints)
  
      //申请存放顶点信息和颜色信息的缓冲
      var positions = new Float32Array(this.lineLength * 3);
      var colors = new Float32Array(this.lineLength * 3);
  
      //从指定点开始取等长数量的点，初始化线顶点和颜色
      for (let i = this.lineStartIndex, j = 0; i < this.lineStartIndex + this.lineLength; i++, j++) {
  
        positions[3 * j] = this.pathPoints[i].x
        positions[3 * j + 1] = this.pathPoints[i].y
        positions[3 * j + 2] = this.pathPoints[i].z
  
        colors[3 * j] = this.lineColor.r * j / this.lineLength
        colors[3 * j + 1] = this.lineColor.g * j / this.lineLength
        colors[3 * j + 2] = this.lineColor.b * j / this.lineLength
  
      }
  
      var material = new THREE.LineBasicMaterial({
        vertexColors: THREE.VertexColors, //使用缓存中的颜色
      });
  
      var geometry = new THREE.BufferGeometry();
  
      //给几何体设置顶点和颜色信息
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      //geometry.verticesNeedUpdate = true //更新顶点
  
      this.line = new THREE.Line(geometry, material);
  
    })()
  
    this.lineMoving = (isCircleLine) => {
      this.lineStartIndex++
  
  
      if (isCircleLine) {
        this.lineStartIndex %= this.pathPointNums //环形路径是，路径起点处理
      } else {
        this.lineStartIndex %= (this.pathPointNums - this.lineLength)
      }
  
  
      //申请存放顶点信息和颜色信息的缓冲
      var positions = new Float32Array(this.lineLength * 3);
      var colors = new Float32Array(this.lineLength * 3);
  
      //从指定点开始取等长数量的点，初始化线顶点和颜色
      for (let i = this.lineStartIndex, j = 0; i < this.lineStartIndex + this.lineLength; i++, j++) {
        if (isCircleLine) {
          index = i % this.pathPointNums //兼容环形路径线流动
        } else {
          index = i
        }
  
        positions[3 * j] = this.pathPoints[index].x
        positions[3 * j + 1] = this.pathPoints[index].y
        positions[3 * j + 2] = this.pathPoints[index].z
  
        colors[3 * j] = this.lineColor.r * j / this.lineLength
        colors[3 * j + 1] = this.lineColor.g * j / this.lineLength
        colors[3 * j + 2] = this.lineColor.b * j / this.lineLength
  
      }
  
      //给几何体设置顶点和颜色信息
      this.line.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      this.line.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
      this.line.geometry.verticesNeedUpdate = true //更新顶点       
    }
  
    setInterval(() => {
      this.lineMoving(isCircleLine);
    }, 100 / this.moveSpeed);
  
    return this.line
  }
  