class Squares {

    constructor() {
        this.colors = [
            '#9443BC',
            '#3C0CBE', 
            '#EE8815', 
            '#000000', 
            '#FA190C', 
            '#59B073', 
            '#11D009', 
            '#530E0E'
        ];
        this.rightAnswers = [];
        this.timer = null;
    }

    // метод для старта новой игры
    start() {
        this.clearField();

        let arr = this.createArray(25);

        arr = this.shuffle(arr);
        
        this.createField(arr);

        this.addClickEventsToSquares();

        this.toggleControls();

        this.addClickEventToRestartButton();

        this.startTimer();
    }
    
    // метод для создания массива чисел от 1 до 25
    createArray(number) {
        return [...Array(number).keys()].map(item => item + 1);
    }

    // метод для перемешивания элементов в массиве
    shuffle(arr) {
        return arr.sort((a, b) => Math.random() - 0.5);
    }

    // метод для генерации случайного числа в диапазоне от min до max
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min; 
    }

    // метод для очистки содержимого игрового поля
    clearField() {
        let fieldContainer = document.querySelector('.app__field');
        fieldContainer.innerHTML = '';
    }

    // метод для создания игрового поля
    createField(arr) {
        let fieldContainer = document.querySelector('.app__field');
        
        // создание квадратов с индивидуальными значениями и стилями и запись их в массив
        let squaresArray = arr.map(item => {
            let square = document.createElement('button');
            square.className = 'app__square';
            square.textContent = item;
            square.style.fontSize = this.getRandomNumber(16, 60) + 'px';
            square.style.color = this.colors[this.getRandomNumber(0, this.colors.length - 1)];

            return square;
        });
        
        // добавление всех созданных квадратов в игровое поле
        for (let i = 0; i < squaresArray.length; i++) {
            fieldContainer.appendChild(squaresArray[i]);
        }
    }

    // метод для добавления обработчика события клика по каждому из квадратов
    addClickEventsToSquares() {
        let squareButtons = document.querySelectorAll('.app__square');

        for (let i = 0; i < squareButtons.length; i++) {
            squareButtons[i].addEventListener('click', this.squareClickHandler.bind(this));
        }
    }

    // метод-обработчик события клика по квадрату
    squareClickHandler(e) {
        // если кликнули по уже засчитанному квадрату, то выходим из функции
        if (e.target.classList.contains('app__square--done')) return false;
        
        // получаем значение квадрата, по которому кликнули
        let currentAnswer = +e.target.textContent;
        
        /*
        * Если кликнули по квадарату 1, то сразу добавляем его в пустой массив с правильными ответами.
        * Когда кликаем по следующим квадратам, то проверяем условие, совпадает ли (текущее значение - 1)
        * с последним значением из массива правильных ответов. Если да, то добавляем элемент в цепочку
        * правильных ответов. Когда кликаем по последнему, то сбрасываем таймер и выводим 'You won'
        */
        if (currentAnswer === 1) {
            this.rightAnswers.push(currentAnswer);
            e.target.classList.add('app__square--done');
        } else if (this.rightAnswers.length >= 1 && currentAnswer - 1 === this.rightAnswers[currentAnswer - 2]) {
            this.rightAnswers.push(currentAnswer);
            e.target.classList.add('app__square--done');

            if (currentAnswer === 25) {
                document.querySelector('.app__time').textContent = 'You won!';
                clearInterval(this.timer);
                this.timer = null;
            }
        }
    }

    // метод для запуска таймера обратного отсчета
    startTimer() {
        let seconds = 30;
        const secondsOutput = document.querySelector('.app__time');
        secondsOutput.textContent = 'Time: ' + seconds;
        
        // создание таймера
        this.timer = setInterval(() => {
            secondsOutput.textContent = 'Time: ' + --seconds;
            
            // когда время истекает, то очищаем таймер и делаем неактивным поле с кнопками
            if (seconds === 0) {
                secondsOutput.textContent = 'You lose!';
                clearInterval(this.timer);
                this.timer = null;

                document.querySelector('.app__field').classList.add('js-disabled');
                let squareButtons = document.querySelectorAll('.app__square');

                for (let i = 0; i < squareButtons.length; i++) {
                    squareButtons[i].setAttribute('disabled', 'true');
                }
            }
        }, 1000);
    }

    // метод для переключения отображения соответствующих кнопок при старте игры
    toggleControls() {
        document.querySelector('.app__start').classList.add('js-hide');
        document.querySelector('.app__restart').classList.remove('js-hide');
    }

    // метод для добавления обработчика события клика по кнопке Play again
    addClickEventToRestartButton() {
        document.querySelector('.app__restart').addEventListener('click', e => {
            this.restart();
        });
    }

    // метод для рестарта игры
    restart() {
        clearInterval(this.timer);
        this.rightAnswers = [];
        this.start();
        document.querySelector('.app__field').classList.remove('js-disabled');
    }

}

// инициализируем объект игры
const game = new Squares();

// начинаем игру при клике на кнопку Start the game
document.querySelector('.app__start').addEventListener('click', e => game.start());