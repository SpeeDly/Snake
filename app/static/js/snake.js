var Block = function (row, col, state, size, snake_id) {
    this.row = row;
    this.col = col;
    this.state = state;
    this.size = size;
    this.snake_id = snake_id;
};

Block.prototype.draw = function() {
    var pixel = '<div class="block ';
    if (this.snake_id === 0 && this.state === 0) {
        pixel += '';
    }
    else if(this.snake_id === 0 && this.state === 1){
        pixel += 'wall';
    }
    else{
        pixel += 'snake player_' + this.snake_id;
    }
    pixel += '" style="width:';
    pixel += this.size;
    pixel += 'px; height:';
    pixel += this.size;
    pixel += 'px;" data-row="';
    pixel += this.row;
    pixel += '" data-col="';
    pixel += this.col;
    pixel += '" data-state="';
    pixel += this.state;
    pixel += '"></div>';
    $("#game").append(pixel);
};

Block.prototype.getElement = function() {
    return $("div.block[data-row='" + this.row + "']").filter("[data-col='" + this.col + "']");
};


var Game = function (blocks) {
    $("#game").css({
        "width": blocks[0][0].size*blocks[0].length,
        "height": blocks[0][0].size*blocks.length,
    });
    for (var i = 0; i < blocks.length; i++) {
        for (var j = 0; j < blocks[i].length; j++) {
            blocks[i][j] = castToBlock(blocks[i][j]);
        };
    };
    this.board = blocks;
};

Game.prototype.generate = function() {
    this.board.forEach(function(blocks){
        blocks.forEach(function(block){
            block.draw();
        })
    })
};

Game.prototype.render = function(blocks) {
    var allBlocks = this.board.reduce(function(a, b) {
        return a.concat(b);
    });
    var changedBlocks = [];
    blocks.forEach(function(blok){
        var temp = allBlocks.filter(function(e){
            if(block.row === e.row && block.col == e.col)
                return true
        });
        changedBlocks.push(temp[0]);
    });

    this.board.forEach(function(blocks){
        blocks.forEach(function(block){
            block.draw();
        })
    })
};

function castToBlock(el) {
    return new Block(el.row, el.col, el.state, el.size, el.snake_id);
};