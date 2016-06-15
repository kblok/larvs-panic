(function(LP) {

  LP.circleEnemy = function (canvasW, canvasH, player) {
    var myEnemy = {
          X : 0,
          Y : 0,      
          directionX : 1,
          directionY : 0,
          alive : true
        },
        speed = 1,
        canvasW = canvasW,
        canvasH = canvasH,
        radius = 20,
        previousX = 0,
        previousY = 0,
        player = player,
        behavior = stateful("wander", {
          wander : LP.behaviors.wander.create(myEnemy, player, canvasW, canvasH, speed, radius, function(){ behavior.transition("multiFire");}),
          multiFire : LP.behaviors.multiFire.create(myEnemy, player, canvasW, canvasH, speed, radius, function(){ behavior.transition("seekAndBump");}),
          seekAndBump : LP.behaviors.seekAndBump.create(myEnemy, player, canvasW, canvasH, speed, radius, function(){ behavior.transition("wander");})          
        });
        //function(event, behaviorName){console.log("circleEnemy: " + event + + behaviorName);});
      
    myEnemy.update = function(tFrame, dt){
      
      player.checkCollision(myEnemy.getHitbox(), tFrame);

      if (player.isCollidingPath(myEnemy.getHitbox())){
        myEnemy.directionX *= -1;
        myEnemy.directionY *= -1;
        myEnemy.X = previousX;
        myEnemy.Y = previousY;
      }
      
      previousX = myEnemy.X;
      previousY = myEnemy.Y;

      behavior.state.update(tFrame, dt);
    };

    myEnemy.render = function(canvasContext){

      if (behavior.state.bullets){
        for (var i = behavior.state.bullets.length - 1; i >= 0; i--) {
          behavior.state.bullets[i].render(canvasContext);
        }
      }

      canvasContext.beginPath();
      canvasContext.moveTo(myEnemy.X,myEnemy.Y);
      canvasContext.ellipse(myEnemy.X, myEnemy.Y, radius, radius, 0, 0, 2 * Math.PI);
      canvasContext.fillStyle = behavior.state.isFiring ? 'rgb(' + Math.floor(LP.math.lerp(0,255, behavior.state.colorPercentage)) + ',0,0)' : "grey";
      canvasContext.fill();
    };

    myEnemy.getHitbox = function(){
      return {x: myEnemy.X - radius, y: myEnemy.Y - radius, width: radius*2, height: radius*2};
    };
    
    // Private functions

    // Init code

    var initialPoint = LP.math.getRandomChoice(player.getFilledMapPoints());
    myEnemy.X = initialPoint.x;
    myEnemy.Y = initialPoint.y;
    previousX = myEnemy.X;
    previousY = myEnemy.Y;

    return myEnemy;
  };
}(this.LP = this.LP || {}));
