
var app = {};
app.canvas;
app.currentFoodPt = {x:0, y:0};
app.snake;
app.onLoad = function(){
    app.canvas = document.querySelector('canvas').getContext('2d');
    app.snake = new Snake();

    var pos = {x:Math.floor(Math.random()*20)+1, y:Math.floor(Math.random()*20)+1};
    app.currentFoodPt = pos;
    app.snake.initRoute(pos);

    document.querySelector('canvas').addEventListener('click', app.onClickCanvas);
    setTimeout('app.update()', 1000/60);



};


app.onClickCanvas = function(event){
    //var pos = {x:Math.floor(event.offsetX/20)+1, y:Math.floor(event.offsetY/20)+1};
    //app.snake.calculateRoute(pos);
};

app.update = function(){
   setTimeout('app.update()', 1000/60);


    var snakeHead = app.snake.points[0];
    if (snakeHead.x == app.currentFoodPt.x && snakeHead.y == app.currentFoodPt.y){
        var pos = {x:Math.floor(Math.random()*20)+1, y:Math.floor(Math.random()*20)+1};
        app.currentFoodPt = pos;
        app.snake.initRoute(pos);
        app.snake.grow();
    }


    app.snake.update();
    app.draw();

};

app.draw = function(){

    app.canvas.clearRect(0, 0, 400, 400);
    /*
    if (app.snake.steps != null){
        app.canvas.save();
        app.canvas.fillStyle = '#0000ff';
        for (var key in app.snake.steps){
            var step = app.snake.steps[key];
            app.canvas.fillRect((step.x)*20,(step.y)*20,20,20);
        }
        app.canvas.restore();

    }*/

    app.canvas.save();
    app.canvas.fillRect((app.currentFoodPt.x-1)*20,(app.currentFoodPt.y-1)*20,20,20);
    app.canvas.restore();

    app.canvas.save();
    for (var i = 0; i < app.snake.points.length; i++){
        var alpha = 1-(i*0.02);
        app.canvas.fillStyle = 'rgba(200,200,200,'+alpha+')';
        app.canvas.fillRect((app.snake.points[i].x-1)*20,(app.snake.points[i].y-1)*20,20,20);
    }
    app.canvas.restore();

    /*
    if (app.snake.mapValues != null){

        for (var y = 0; y < app.snake.mapValues.length; y++){
            for (var x = 0; x < app.snake.mapValues[y].length; x++){
               var value = parseInt(app.snake.mapValues[y][x]);
                app.canvas.save();
                app.canvas.font = "7pt Arial";
                app.canvas.lineWidth = 1;
                app.canvas.strokeStyle = "gray"; // stroke color
                app.canvas.strokeText(value, x*20+2, y*20+15);

                app.canvas.restore();

            }
        }

    }
    */
};

app.onChangeSpeed = function(speedInput){
  app.snake.maxDelay = (parseInt(speedInput.value) > 0 ? parseInt(speedInput.value) : 1);
};


app.restart = function(){
   app.snake = new Snake();

   var pos = {x:Math.floor(Math.random()*20)+1, y:Math.floor(Math.random()*20)+1};
   app.currentFoodPt = pos;
   app.snake.initRoute(pos);
};




window.addEventListener('load', app.onLoad);