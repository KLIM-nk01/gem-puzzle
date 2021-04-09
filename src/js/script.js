import create from './utils/create.js';

const Wrapper = create('div', 'Wrapper', null, document.body)
const btnShuflle = create('button', 'buttonShuffle', `New Game`, Wrapper);
const finishWrapper = create('div', 'finishWrapper finishWrapperHidden', `<span>You Win!</span> <span>Moves</span> <span>Time</span> <span  class = "finichPhrase">to start a new game, refresh the page
</span>`, document.body);

let Puzzle = 0;
let numbersOfMoves = 0;
let time = 0;

let numbers = [...Array(15).keys()].sort(() => Math.random() - 0.5);
let sek = 0;
let soundOn = true;
let soundWin = true;
let timerId = 0;
// console.log(numbers)


function Game(numbers) {

    
    // console.log(numbers)
    numbersOfMoves = create('div', 'numbersOfMoves', `<span>Moves: </span>0`, Wrapper);
    time = create('div', 'timeOfMoves', `<span>Time: </span>0`, Wrapper);
    
    Puzzle = create('div', 'gem_puzzle', null, document.body);

    
    const cellSize = 92;
  
    const empty = {
        value: 16,
        top: 3,
        left: 3
    }

    const cells = [];
    let click = 0;  //счетчик ходов

    function move(index) {

        const cell = cells[index];
        const leftDiff = Math.abs(empty.left - cell.left);
        const topDiff = Math.abs(empty.top - cell.top);


        if (leftDiff + topDiff > 1) {
            return
        }

        cell.element.style.top = `${empty.top * cellSize}px`;
        cell.element.style.left = `${empty.left * cellSize}px`;

        const emptyLeft = empty.left;
        const emptyTop = empty.top;

        empty.left = cell.left;
        empty.top = cell.top;

        cell.left = emptyLeft;
        cell.top = emptyTop;
        numbersOfMoves.innerHTML = `<span>Moves </span>${++click}`;
        if(click == 1) {
            timeGame();
            
        }

       

        const isFinished = cells.every(cell => {
            return cell.value === cell.top * 4 + cell.left + 1
        });

        if (isFinished) {
            console.log('Finish')
            
            finishWrapper.classList.remove('finishWrapperHidden');
            finishWrapper.children[1].innerHTML = `<span>Moves: </span>${click}`;
            finishWrapper.children[2].innerHTML = `<span>Time: </span>${sek}s`;
            clearTimeout(timerId);
            soundWin(soundWin)
        }

    }


  

 
    for (let i = 0; i < 15; i++) {
       
        const value = numbers[i] + 1;
        const cell = create('div', 'cell', `${value}`, Puzzle, ['draggable', 'true']);



        const left = i % 4;
        const top = (i - left) / 4;

        cells.push({
            value: value,
            left: left,
            top: top,
            element: cell
        });

        cell.style.top = `${top * cellSize}px`;
        cell.style.left = `${left * cellSize}px`;

        cell.addEventListener('click', () => {
            move(i);
            
            moveSound(soundOn);
            
        })

    }


    cells.push(empty);

    function moveSound(soundOn){
        let soundMove = new Audio('./assets/click.mp3');
        if(soundOn){
            soundMove.play();
        }
    }

    function soundWin(soundWin){
        let soundMove = new Audio('./assets/Win.mp3');
        if(soundOn){
            soundMove.play();
        }
    }

    function timeGame () {
        sek++;
                
        timerId = setTimeout(() => timeGame(), 1000)
        
        time.innerHTML = `Time: ${sek}s`;
    }
    
}



function shuffle() {
    let resultSequence = 0;
    numbers = [...Array(15).keys()].sort(() => Math.random() - 0.5);

    // console.log(numbers)
    for (let i = 0; i <= numbers.length - 1; i += 1) {
        for (let j = i + 1; j <= numbers.length - 1; j += 1) {
            if (numbers[i] > numbers[j]) {
                resultSequence += 1;
            }
        }
    }
    //   console.log(resultSequence)
    if (resultSequence % 2 == 0) {
        sek = 0;
        clearTimeout(timerId);
        Wrapper.removeChild(numbersOfMoves);
        Wrapper.removeChild(time);
        document.body.removeChild(Puzzle);

        Game(numbers);
    } else {
        shuffle();
        return;
    }


}



const btn = document.querySelector('.buttonShuffle');
btn.addEventListener('click', shuffle);




const dragAndDrop = () => {
    const cell = document.querySelectorAll('.cell');
    const cells = document.querySelectorAll('.cell_wrapper');

    const dragStart = function () {

        setTimeout(() => {
            this.classList.add('hide')
        }, 0);
    };


    const dragEnd = function () {

        this.classList.remove('hide');
        // if (isEmpty) return
    };

    let isEmpty = 0;

    const dragOver = function (evt) {
        evt.preventDefault();
        isEmpty = evt.target.childElementCount;
        // console.log(isEmpty)
    }


    const dragEnter = function (evt) {
        evt.preventDefault();
        //  console.log('+')
    }

    const dragLeave = function () {

    }

    const dragDrop = function () {
        if (isEmpty) return;
        cell.forEach(el => {
            if (el.id == 'active') {
                this.append(el);
                el.removeAttribute('id');
            }
        })

    }



    cells.forEach(el => {

        el.addEventListener('dragover', dragOver);
        el.addEventListener('dragleave', dragLeave);
        el.addEventListener('drop', dragDrop);
        el.addEventListener('dragenter', dragEnter);
        el.addEventListener('mouseup', e => {
            e.stopPropagation()
        });

    })

    cell.forEach(el => {
        el.addEventListener('mousedown', clickCell => {
            el.id = 'active'
        });
    })


    cell.forEach(el => {
        el.addEventListener('dragstart', dragStart);
    })

    cell.forEach(el => {
        el.addEventListener('dragend', dragEnd);
    })

}


Game(numbers);
