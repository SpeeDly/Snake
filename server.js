var express = require('express'); 
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var ROWS, COLS;

var Block = function (row, col, state, blockSize) {
    this.row = row;
    this.col = col;
    this.state = state;
    this.size = blockSize;
    this.snake_id = 0;
};

Block.prototype.getTopBlock = function() {
    var row = this.row === 0 ? ROWS-1 : (this.row-1);
    return board[row][this.col];
};

Block.prototype.getBottomBlock = function() {
    var row = this.row === ROWS-1 ? 0 : (this.row+1);
    return board[row][this.col];
};

Block.prototype.getLeftBlock = function() {
    var col = this.col === 0 ? COLS-1 : (this.col-1);
    return board[this.row][col];
};

Block.prototype.getRightBlock = function() {
    var col = this.col === COLS-1 ? 0 : (this.col+1);
    return board[this.row][col];
};

Block.prototype.makeSnake = function(snake_id) {
    // moje bi tuka e proverkata !!!
    this.snake_id = snake_id;
    this.state = 1;
};

Block.prototype.removeSnake = function(snake_id) {
    // moje bi tuka e proverkata !!!
    this.snake_id = 0;
    this.state = 0;
};

Block.prototype.generateApple = function() {
    this.state = 2;
};

Block.prototype.removeApple = function() {
    this.getElement().removeClass("apple");
    this.state = 0;
};


var Map = function (rows, cols, size) {
    var block
        row = 0
        col = 0
        tempArray = []
        board = [];

    for (var i = 1; i <= (rows*cols); i++) {
        block = new Block(row, col, 0, size);
        tempArray.push(block);

        if (i%cols === 0 || i === (rows*cols)) {
            col = 0;
            row++;
            board.push(tempArray);
            tempArray = [];
        }
        else{
            col++;
        }
    };
    this.board = board;
};

Map.prototype.generate = function() {
    return this.board
};

Map.prototype.generateApple = function() {
    var possibleBlocks = this.board.reduce(function(a, b) {
        return a.concat(b);
    });

    var checkForApple = possibleBlocks.filter(function(e){
        if (e.state == 2) {
            return true;
        }
        else{
            return false;
        }
    });

    if (checkForApple.length > 0) return false;

    possibleBlocks = possibleBlocks.filter(function(e){
        if (e.state == 0) {
            return true;
        }
        else{
            return false;
        }
    });

    var changedBlock = possibleBlocks[Math.floor(Math.random()*possibleBlocks.length)];
    changedBlock.makeApple();
    return changedBlock;
};


var Snake = function (snake_id, headPosition) {
    console.log(snake_id);
    this.snake_id = snake_id;
    console.log(this.snake_id);
    this.snakeBlocks = [];
    this.direction;
    this.points = 0;
    var currentNode = headPosition
    for (var i = 0; i < 5; i++) {
        this.snakeBlocks.push(currentNode);
        currentNode = currentNode.getBottomBlock();
    };
};

Snake.prototype.generate = function() {
    this.snakeBlocks.forEach(function(block){
        console.log(this.snake_id);
        block.makeSnake(1);
    });
};

Snake.prototype.go = function(direction) {
    // define required arguments
    var lastBlock = this.snakeBlocks[this.snakeBlocks.length-1],
          copySnake = this.snakeBlocks.slice(0),
          nextBlock;
    var result = {
        "changedBlocks": [],
        "gameResult": 0
    }

    if(
        (this.direction === 38 && direction === 40) ||
        (this.direction === 40 && direction === 38) ||
        (this.direction === 37 && direction === 39) ||
        (this.direction === 39 && direction === 37))
    {
    }
    else{
        this.direction = direction;
    }

    switch(this.direction){
        case 38:
            nextBlock = this.snakeBlocks[0].getTopBlock();
            break;
        case 40:
            nextBlock = this.snakeBlocks[0].getBottomBlock();
            break;
        case 37:
            nextBlock = this.snakeBlocks[0].getLeftBlock();
            break;
        case 39:
            nextBlock = this.snakeBlocks[0].getRightBlock();
            break;
    }

    if(nextBlock.state === 0 ){
        
        lastBlock.removeSnake(this.player);
        result.changedBlocks.push(lastBlock);
        this.snakeBlocks[0] = nextBlock;
        for (var i = 1; i < this.snakeBlocks.length; i++) {
            result.changedBlocks.push(this.snakeBlocks[i]);
            this.snakeBlocks[i] = copySnake[i-1];
        }
        this.render();
    }
    else if(nextBlock.state === 1 ){
        // alert("points:", this.points);
        // clearInterval(interval);
        result.gameResult = 1;
    }
    else if(nextBlock.state === 2 ){
        this.points++;
        this.snakeBlocks.unshift(nextBlock);
        result.changedBlocks.push(nextBlock);
        // nextBlock.removeApple();
        nextBlock.makeSnake();
    }
};


app.get('/', function (req, res) {
    res.sendFile(__dirname + "/app/index.html");
})

app.use("/static", express.static(__dirname + "/app/static"));

http.listen(3000, function(){
    console.log("Snake is working");
});

io.on('connection', function (socket) {
    var map, snake, board;
    socket.on('newGame', function (data) {
        map = new Map(data.initialData.rows, data.initialData.cols, data.initialData.size);
        board = map.generate();
        ROWS = board.length;
        COLS = board[0].length;
        playerNumber = 1;
        snake = new Snake(playerNumber, board[5][5]);
        snake.generate();
        socket.emit('generatedMap', { board: board });
    
        socket.on('newMove', function (data) {
            console.log(data.command);
            var result = snake.go(data.command);
            result.changedBlocks(map.generateApple());
            socket.emit('nextMove', result);
        });
    });
});