/**
 * Created by PC on 2017/1/7.
 */
var board = [];  //格子值数组
var score = 0;            //分数

var documentWidth = window.screen.availWidth,       //屏幕宽度
    gridContainerWidth = 0.92 * documentWidth,         //内容宽度
    cellLength = 0.18 * documentWidth,                 //小格子边长
    cellSpace = 0.04 * documentWidth;                  //间隔宽度

var startx = 0,                                          //触控坐标
    starty = 0,
    endx = 0,
    endy = 0;


$(document).ready(function () {
    prepareForMobile();
    newgame();      //初始化函数
});

function prepareForMobile() {
    if (documentWidth > 500) {
        gridContainerWidth = 500;
        cellLength = 100;
        cellSpace = 20;
    }
    var $gridContainer = $("#grid-container"),
        $gridCell = $(".grid-cell");

    $gridContainer.css('width', gridContainerWidth - 2 * cellSpace)
        .css('height', gridContainerWidth - 2 * cellSpace)
        .css('padding', cellSpace)
        .css('border-radius', 0.02 * gridContainerWidth);

    $gridCell.css('width', cellLength)
        .css('height', cellLength)
        .css('border-radius', 0.06 * cellLength);
}


$("#newgamebutton").bind("click", function () {  //newgame按钮
    newgame();   //初始化函数
});

function newgame() {
    //初始化棋盘格
    init();
    //随机生成两个数字
    generateOneNumber();
    generateOneNumber();
    $("#game-over").hide();
}

function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            //获取所有的格子对象并用top、left定位
            var $gridcell = $("#gridcell-" + i + "-" + j);
            $gridcell.css("top", getPorTop(i, j));
            $gridcell.css("left", getPorLeft(i, j));
        }
    }
    for (var i = 0; i < 4; i++) {   //初始化数组的值
        board[i] = [];
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
        }
    }
    score = 0;
    updateScore(score);
    updateboardview();
}


function getPorTop(i, j) {
    return cellSpace + i * (cellLength + cellSpace);
}
function getPorLeft(i, j) {
    return cellSpace + j * (cellLength + cellSpace);
}


function updateboardview() {
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class="number-cell"  id="number-cell-' + i + '-' + j + '"></div>');
            var $theNumberCell = $('#number-cell-' + i + '-' + j);

            if (board[i][j] === 0) {
                $theNumberCell.css('width', '0px');
                $theNumberCell.css('height', '0px');
                $theNumberCell.css('top', getPorTop(i, j) + cellLength * 0.5);
                $theNumberCell.css('left', getPorLeft(i, j) + cellLength * 0.5);

            } else {
                $theNumberCell.css('width', cellLength);
                $theNumberCell.css('height', cellLength);
                $theNumberCell.css('top', getPorTop(i, j));
                $theNumberCell.css('left', getPorLeft(i, j));
                $theNumberCell.css('backgroundColor', getBackgroundColor(board[i][j]));
                $theNumberCell.css('color', getColor(board[i][j]));
                $theNumberCell.text(board[i][j]);
            }
        }
    }
    $(".number-cell").css('line-height', cellLength + 'px');
    $(".number-cell").css('font-size', 0.6 * cellLength + 'px');
}
function getBackgroundColor(number) {
    switch (number) {
        case 2:
            return "#eee4da";
            break;
        case 4:
            return "#ede0c8";
            break;
        case 8:
            return "#f2b179";
            break;
        case 16:
            return "#f59563";
            break;
        case 32:
            return "#f67c5f";
            break;
        case 64:
            return "#f65e3b";
            break;
        case 128:
            return "#edcf72";
            break;
        case 256:
            return "#edcc61";
            break;
        case 512:
            return "#9c0";
            break;
        case 1024:
            return "#33b5e5";
            break;
        case 2048:
            return "#09c";
            break;
        case 4096:
            return "#a6c";
            break;
        case 8192:
            return "#93c";
            break;
    }
}

function getColor(number) {
    return number <= 4 ? "#776e65" : "white";
}

function generateOneNumber() {
    if (nospace(board)) {    //判断数组是否还有空格生成位置
        return false;
    }

    // 随机一个位置
    var randx = Math.floor(Math.random() * 4);
    var randy = Math.floor(Math.random() * 4);
    while (true) {
        if (board[randx][randy] === 0)  break;
        randx = Math.floor(Math.random() * 4);
        randy = Math.floor(Math.random() * 4);
    }
    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;
    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumber(randx, randy, randNumber);
    return true;
}


function nospace(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] === 0) {   //遍历数组检查是否还有空的位置
                return false;
            }
        }
    }
    return true;
}

function showNumber(i, j, randNumber) {
    var $numberCell = $('#number-cell-' + i + '-' + j);
    $numberCell.css('backgroundColor', getBackgroundColor(randNumber));
    $numberCell.css('color', getColor(randNumber));
    $numberCell.text(randNumber);
    $numberCell.animate({
        width: cellLength,
        height: cellLength,
        top: getPorTop(i, j),
        left: getPorLeft(i, j)
    }, 100);
}

$(document).keydown(function (event) {
    switch (event.keyCode) {
        case 37:  //left
            if (moveLeft()) {         //判断能否向左移动
                setTimeout("generateOneNumber()", 210);  //生成一个数字
                setTimeout("isGameOver()", 300);         //判断是否游戏结束
            }
            break;
        case 38:     //up
            event.preventDefault();
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 39:    //right
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 40:    //down
            event.preventDefault();
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        default:    //default
            break;
    }
});

document.addEventListener('touchstart', function (event) {
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;


});

document.addEventListener('touchmove',function (event) {
    event.preventDefault();
});

document.addEventListener('touchend', function (event) {     //触控事件
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;
    var deltax = endx - startx;
    var deltay = endy - starty;
    if (Math.abs(deltax) < 0.2 * documentWidth && Math.abs(deltay) < 0.2 * documentWidth) {
        return;
    }
    if (Math.abs(deltax) >= Math.abs(deltay)) {          //水平滑动

        if (deltax > 0) {
            //move right
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        } else {
            //move left
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        }

    } else {                                              //垂直滑动

        if (deltay > 0) {
            //move down
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        } else {
            //move up
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        }

    }
});

function moveLeft() {         //向左移动函数
    if (!canMoveLeft(board)) {
        return false;
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] !== 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] === 0 && noBlockhorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] === board[i][j] && noBlockhorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);
                        //加分动画
                        addScoreAnimation(board[i][k]);
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateboardview()", 200);
    return true;
}

function canMoveLeft(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] === board[i][j - 1] || board[i][j - 1] === 0) {
                return true;
            }
        }
    }
    return false;
}
function noBlockhorizontal(row, col1, col2, board) {  //检查是否有水平障碍物
    for (var i = col1 + 1; i < col2; i++) {
        if (board[row][i] !== 0) {
            return false;
        }
    }
    return true;
}
function showMoveAnimation(fromx, fromy, tox, toy) {
    var $numberCell = $('#number-cell-' + fromx + '-' + fromy);
    $numberCell.animate({
        top: getPorTop(tox, toy),
        left: getPorLeft(tox, toy)
    }, 200);
}
function moveUp() {
    if (!canMoveUp(board)) {
        return false;
    }
    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] !== 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] === 0 && noBlockVertical(k, i, j, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] === board[i][j] && noBlockVertical(k, i, j, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);
                        //加分动画
                        addScoreAnimation(board[k][j]);
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateboardview()", 200);
    return true;
}
function canMoveUp(board) {
    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] === board[i - 1][j] || board[i - 1][j] === 0) {
                return true;
            }
        }
    }
    return false;
}
function noBlockVertical(row1, row2, col, board) {         //检查是否有垂直障碍物
    for (var i = row1 + 1; i < row2; i++) {
        if (board[i][col] !== 0) {
            return false;
        }
    }
    return true;
}
function moveRight() {
    if (!canMoveRight(board)) {
        return false;
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] !== 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] === 0 && noBlockhorizontal(i, j, k, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] === board[i][j] && noBlockhorizontal(i, j, k, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);
                        //加分动画
                        addScoreAnimation(board[i][k]);
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateboardview()", 200);
    return true;
}
function canMoveRight(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i][j] === board[i][j + 1] || board[i][j + 1] === 0) {
                return true;
            }
        }
    }
    return false;
}
function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }
    for (var i = 2; i >= 0; i--) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] !== 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] === 0 && noBlockVertical(i, k, j, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] === board[i][j] && noBlockVertical(i, k, j, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);
                        //加分动画
                        addScoreAnimation(board[k][j]);
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateboardview()", 200);
    return true;
}
function canMoveDown(board) {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] === board[i + 1][j] || board[i + 1][j] === 0) {
                return true;
            }
        }
    }
    return false;
}
function isGameOver() {  //判断是否游戏结束函数
    if (nospace(board) && noMove(board)) {
        gameOver();
    }
}
function noMove(board) {
    if (canMoveDown(board) || canMoveUp(board) || canMoveLeft(board) || canMoveRight(board)) {
        return false;
    } else {
        return true;
    }
}
function gameOver() {
    var $gameOver = $("#game-over");
    $gameOver.css('width', 4.0 * cellLength)
        .css('height', 2.2 * cellLength)
        .css('top', 1.4 * cellLength)
        .css('left', 0.5 * cellLength);
    $('#game-over>p').css('font-size', 0.5 * cellLength)
        .css('margin', 0.3 * cellLength);
    $("#ok").css('font-size', 0.5 * cellLength);
    $gameOver.show(2000);
}

$("#ok").bind("click", function () {
    $("#game-over").hide(1000);
});

function updateScore(score) {     //总分数
    $("#score").text(score);
}

function addScoreAnimation(score) {      //加分动画
    var scoretext = "+ " + score;
    var $addScore = $("#addScoreAnimation");
    $addScore.text(scoretext)
        .show(400)
        //.animate({top: "-=cellLength"}, 500)
        .fadeOut(100)
        .hide(510)
    //.animate({top: '+=cellLength'}, 10);
}
