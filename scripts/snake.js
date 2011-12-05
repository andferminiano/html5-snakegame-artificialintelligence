var Snake = function(){
    this.points = [];

    this.points.push({x:1, y:1});
    this.steps = [];
    this.mapValues;

    var snakeSteps = [];
    var targetPoint;

    var currentStepIndex = 0;
    var delay = 0;
    this.maxDelay = 2;
    var lastStep;
    var stop;
    var tries = 0;


    this.grow = function(){
        this.points.push({x: lastStep.x, y: lastStep.y});
    }

    this.update = function(){
        if (stop)
            return;
        if (this.steps.length == 0)
            return;

        if (tries > 400)
            return;

        if (delay > 0){
            delay--;
            return;
        }

        var nextStep = this.steps[this.steps.length-1];
        var pieceMoving = this.points[0];
        lastStep = {x:pieceMoving.x, y:pieceMoving.y}
        pieceMoving.x = nextStep.x+1;
        pieceMoving.y = nextStep.y+1;
        snakeSteps.push(nextStep);


        for (var i = 1; i < this.points.length; i++){
            pieceMoving = this.points[i];
            var myStep = {x: pieceMoving.x, y:pieceMoving.y};
            pieceMoving.x = lastStep.x;
            pieceMoving.y = lastStep.y;
            lastStep = myStep;
        }

        delay = this.maxDelay;
        this.calculateRoute(targetPoint);

    };

    this.initRoute = function(point){

        while(this.steps.length > 0)
            this.steps.pop();

        tries = 0;
        targetPoint = point;

        currentStepIndex = 0;
        this.calculateRoute(targetPoint);
    }

    this.calculateRoute = function(point){
        if (stop)
            return;

        // 20x20 map
        var mapValues = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ];


        var snakeParts = [];
        for (var i = 0; i < this.points.length; i++){
            if (typeof snakeParts[this.points[i].y] == "undefined"){
                snakeParts[this.points[i].y] = [];
            }
            snakeParts[this.points[i].y][this.points[i].x] = true;
        }


        for (var y = 0; y < 20; y++){
            for (var x = 0; x < 20; x++){
                var pt = {x:x, y:y};
                var diffSnakePointX = (point.x*20)-((pt.x+1)*20);
                var diffSnakePointY = (point.y*20)-((pt.y+1)*20);
                var distTargetPoint = Math.sqrt((diffSnakePointX*diffSnakePointX)+(diffSnakePointY*diffSnakePointY));

                var myDist = this.points[0].x*20 + this.points[0].y*20;
                var isSnakePart = false;
                if (typeof snakeParts[y+1] != "undefined"){
                    isSnakePart = snakeParts[y+1][x+1] == true;
                }
                var bonusCost = (isSnakePart ? -999 : 0);


                var totalCost = -(distTargetPoint)+myDist+bonusCost;
                mapValues[y][x] = totalCost;
            }
        }

        var headPoint = this.points[0];

        var lastMapValue = 0;
        var currentStep = {x:headPoint.x-1, y:headPoint.y-1};



        var mapSize = 20*20;
        tries+=1;

        if (mapValues[currentStep.y-1] != null)
            var northPoint = mapValues[currentStep.y-1][currentStep.x];
        if (mapValues[currentStep.y+1] != null)
            var southPoint = mapValues[currentStep.y+1][currentStep.x];

        var westPoint = mapValues[currentStep.y][currentStep.x-1];
        var eastPoint = mapValues[currentStep.y][currentStep.x+1];

        var points = [northPoint, southPoint, westPoint, eastPoint];

        points.sort(function sortFunction(a, b){
            return (b - a)
        });


        var bestPoint = points.shift();


        var isNorth = bestPoint == northPoint ? true : false;
        var isSouth = bestPoint == southPoint ? true : false;
        var isWest = bestPoint == westPoint ? true : false;
        var isEast = bestPoint == eastPoint ? true : false;

        if (isNorth){
            currentStep = {x:currentStep.x, y:currentStep.y-1};
            this.steps.push(currentStep);
            lastMapValue = northPoint;

        }
        else if (isSouth){
            currentStep = {x:currentStep.x, y:currentStep.y+1};
            this.steps.push(currentStep);
            lastMapValue = southPoint;

        }
        else if (isWest){
            currentStep = {x:currentStep.x-1, y:currentStep.y};
            this.steps.push(currentStep);
            lastMapValue = westPoint;

        }
        else if (isEast){
            currentStep = {x:currentStep.x+1, y:currentStep.y};
            this.steps.push(currentStep);
            lastMapValue = eastPoint;
        }



    }

};