# plantgame
<html>
<head>
  <style>
    canvas {
      background-color: blue;
    }
  </style>
</head>
<body onload="startGame()">
  <script>
  //var myGamePiece;
  var canvas = document.getElementbyId("canvas");
  var ctx = canvas.getContext("2d");

  function startGame() {  
    myGameArea.start();  
    myGamePiece = new component(30, 30, "red", 10, 120);
  }

  var myGameArea = { 
      canvas: document.creatElement("canvas");  
      start: function() {    
        this.canvas.width = 480;    
        this.canvas.height = 270;    
        this.context = this.canvas.getContext("2d");    
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);  
    }
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
  }

  </script>
  <br>
  <h1>
  hi
  </h1>
</body>
</html>
