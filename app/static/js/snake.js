$(document).ready(function(){

var board = [];
var left = 37,
      right = 39,
      top = 38,
      down = 40;

var Block = function (row, col, state) {
    this.row = row;
    this.col = col;
    this.state = state;
};

Block.prototype.draw = function() {
    $("#game").append('<div class="block" data-row="' + this.row + '" data-col="' + this.col + '" data-state="' + this.state + '"></div>');
};

Block.prototype.getElement = function() {
    return $("div.block[data-row='" + this.row + "']").filter("[data-col='" + this.col + "']");
};

Block.prototype.getTopBlock = function() {
    var row = this.row === 0 ? 15 : (this.row-1);
    return board[row][this.col];
};

Block.prototype.getBottomBlock = function() {
    var row = this.row === 15 ? 0 : (this.row+1);
    return board[row][this.col];
};

Block.prototype.getLeftBlock = function() {
    var col = this.col === 0 ? 31 : (this.col-1);
    return board[this.row][col];
};

Block.prototype.getRightBlock = function() {
    var col = this.col === 31 ? 0 : (this.col+1);
    return board[this.row][col];
};

Block.prototype.getCoords = function() {
    return [this.row, this.col];
};

Block.prototype.setCoords = function(coords) {
    this.row = coords[0];
    this.col = coords[1];
};

var Snake = function (player, elements, headPosition) {
    this.player = "player";
    this.elements = elements;
    this.snakeBlocks = [];
    this.direction = "top";
    var currentNode = headPosition
    for (var i = 0; i < this.elements; i++) {
        this.snakeBlocks.push(currentNode);
        currentNode = currentNode.getBottomBlock();
    };
};

Snake.prototype.render = function() {
    $(".player1").removeClass("snake player1");
    this.snakeBlocks.forEach(function(block){
        block.getElement().addClass("snake player1");
    });
    console.log(this.snakeBlocks);
};

Snake.prototype.goUp = function() {
    var copySnake = this.snakeBlocks.slice(0);
    this.snakeBlocks[0] = this.snakeBlocks[0].getTopBlock();
    for (var i = 1; i < this.snakeBlocks.length; i++) {
        this.snakeBlocks[i] = copySnake[i-1];
    }
    this.render();
    this.direction = "top";
};

Snake.prototype.goDown = function() {
    var copySnake = this.snakeBlocks.slice(0);
    this.snakeBlocks[0] = this.snakeBlocks[0].getBottomBlock();
    for (var i = 1; i < this.snakeBlocks.length; i++) {
        this.snakeBlocks[i] = copySnake[i-1];
    }
    this.render();
    this.direction = "bottom";
};

Snake.prototype.goLeft = function() {
    var copySnake = this.snakeBlocks.slice(0);
    this.snakeBlocks[0] = this.snakeBlocks[0].getLeftBlock();
    for (var i = 1; i < this.snakeBlocks.length; i++) {
        this.snakeBlocks[i] = copySnake[i-1];
    }
    this.render();
    this.direction = "left";
};

Snake.prototype.goRight = function() {
    var copySnake = this.snakeBlocks.slice(0);
    this.snakeBlocks[0] = this.snakeBlocks[0].getRightBlock();
    for (var i = 1; i < this.snakeBlocks.length; i++) {
        this.snakeBlocks[i] = copySnake[i-1];
    }
    this.render();
    this.direction = "right";
};

function generateMap(){
    var block,
          row = 0,
          col = 0
          tempArray = [];

    $("#game").css({
        "width": "1024px",
        "height": "512px",
    });

    for (var i = 1; i <= 512; i++) {
        block = new Block(row, col, 0);
        tempArray.push(block);

        if (i%32 === 0 || i === 512) {
            col = 0;
            row++;
            board.push(tempArray);
            tempArray = [];
        }
        else{
            col++;
        }
    };
    return board;
}

function drawMap(board){
    board.forEach(function(blocks){
        blocks.forEach(function(block){
            block.draw();
        })
    })
};

var board = generateMap();
drawMap(board);


function connectPlayer(){
    var snake = new Snake("snake1", 5, board[5][5]);
    snake.render();
    return snake;
}
var snake = connectPlayer();
var command = top;
$(document).keyup(function(event){
    command = event.which;
})

setInterval(function(){
    switch(command) {
        case top:
            snake.goUp();
            break;
        case left:
            snake.goLeft();
            break;
        case right:
            snake.goRight();
            break;
        case down:
            snake.goDown();
            break;
    }
}, 300);
});