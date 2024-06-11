document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector(".grid");
    const width = 10;
    const result = document.querySelector("#result");
    let bombAmt = 20;
    const bombsLeft = document.querySelector("#flags-left");
    let squares = [];
    let isGameOver = false;
    let flags = 0;



    function createBoard() {

        bombsLeft.innerHTML = bombAmt;

        const bombAry = Array(bombAmt).fill("bomb");
        const emptyAry = Array(width * width - bombAmt).fill("valid");

        const gameAry = emptyAry.concat(bombAry);
        const suffledAry = gameAry.sort(() => Math.random() - 0.5);

        console.log(suffledAry);

        // create the sweeper board
        for (let i = 0; i < width * width; i++) {

            const square = document.createElement('div');
            square.id = i;

            square.classList.add(suffledAry[i]);
            grid.appendChild(square);

            squares.push(square);


            //to handle click events on valid buttons
            square.addEventListener('click', function () {
                click(square);
            })

            //to handle ctrl and left click events to flag suspicious buttons
            square.addEventListener('contextmenu', function () {
                addFlag(square);
            })

        }

        for (let i = 0; i < squares.length; i++) {
            let total = 0;

            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width - 1);

            if (squares[i].classList.contains('valid')) {
                //bottom-left
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
                //left
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
                //upper-right
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
                //right
                if (i < 99 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
                //lower-right
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
                //below
                if (i < 89 && squares[i + width].classList.contains('bomb')) total++;
                //upper-left
                if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
                //upper
                if (i > 10 && squares[i - width].classList.contains('bomb')) total++;

                squares[i].setAttribute("data", total);
            }
        }
        console.log(squares);

    }
    createBoard();

    function click(square) {
        if (isGameOver || square.classList.contains('checked') || square.classList.contains('flagged')) return;

        if (square.classList.contains('bomb')) {
            gameOver();
        } else {
            let total = square.getAttribute('data');
            if (total != 0) {
                if (total == 1) square.classList.add('one');
                if (total == 2) square.classList.add('two');
                if (total == 3) square.classList.add('three');
                if (total == 4) square.classList.add("four");
                square.innerHTML = total;
            }
            checkSquare(square);
        }
        square.classList.add('checked');
    }



    function checkSquare(square) {
        const currentId = square.id;
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width - 1);

        setTimeout(function () {
            if (currentId > 0 && !isLeftEdge) {
                const newId = parseInt(currentId - 1);
                const newSquare = document.getElementById(newId);
                if (newSquare && newSquare.classList.contains('valid') && !newSquare.classList.contains('checked')) click(newSquare);
            }
            if (currentId > 9 && !isRightEdge) {
                const newId = parseInt(currentId + 1 - width);
                const newSquare = document.getElementById(newId);
                if (newSquare && newSquare.classList.contains('valid') && !newSquare.classList.contains('checked')) click(newSquare);
            }
            if (currentId < 99 && !isRightEdge) {
                const newId = parseInt(currentId + 1);
                const newSquare = document.getElementById(newId);
                if (newSquare && newSquare.classList.contains('valid') && !newSquare.classList.contains('checked')) click(newSquare);
            }
            if (currentId < 88 && !isRightEdge) {
                const newId = parseInt(currentId + 1 + width);
                const newSquare = document.getElementById(newId);
                if (newSquare && newSquare.classList.contains('valid') && !newSquare.classList.contains('checked')) click(newSquare);
            }
            if (currentId < 89) {
                const newId = parseInt(currentId + width);
                const newSquare = document.getElementById(newId);
                if (newSquare && newSquare.classList.contains('valid') && !newSquare.classList.contains('checked')) click(newSquare);
            }
            if (currentId > 11 && !isLeftEdge) {
                const newId = parseInt(currentId - 1 - width);
                const newSquare = document.getElementById(newId);
                if (newSquare && newSquare.classList.contains('valid') && !newSquare.classList.contains('checked')) click(newSquare);
            }
            if (currentId > 10) {
                const newId = parseInt(currentId - width);
                const newSquare = document.getElementById(newId);
                if (newSquare && newSquare.classList.contains('valid') && !newSquare.classList.contains('checked'))  click(newSquare);
            }
            if (currentId < 90 && !isLeftEdge) {
                const newId = parseInt(currentId - 1 + width);
                const newSquare = document.getElementById(newId);
                if (newSquare && newSquare.classList.contains('valid') && !newSquare.classList.contains('checked'))  click(newSquare);
            }
        }, 10)
    }

    function addFlag(square) {
        if (isGameOver) return;
        if (square.classList.contains('one') || square.classList.contains('two') || square.classList.contains('three') || square.classList.contains('four')) return;
    
        if (!square.classList.contains('checked')) {
            if (!square.classList.contains('flag') && flags < bombAmt) {
                square.classList.add('flag');
                square.innerHTML = '🚩';
                flags++;
            } else if (square.classList.contains('flag')) {
                square.classList.remove('flag');
                square.innerHTML = '';
                flags--;
            }
            bombsLeft.innerHTML = bombAmt - flags;
            checkForWin();
        }
    }
    

    function gameOver() {
        result.innerHTML = "BOOM game over!!";
        isGameOver = true;

        squares.forEach(function (square) {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣';
                square.classList.remove('bomb');
                square.classList.add('checked');
            }
        })
    }

    function checkForWin(){
        let matches = 0;
        for(let i = 0; i < squares.length; i++){
            if (squares[i].classList.contains('flag') && squares.classList.contains('bomb')){
                matches++;
            }
        }
        if( matches === bombAmt ){
            result.innerHTML = 'YOU WIN!';
            isGameOver = true;
        }
    }

});