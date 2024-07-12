import { GameLoop } from "./GameLoop";
import { Icons } from "./Icons"

const PAGENAMES = [
    'main',
    'game',
    'settings',
    // TODO add other pagers
] as const;

type pageName = typeof PAGENAMES[number];

export class Renderer {
    curPage: pageName;
    gameLoop: GameLoop;

    constructor(
        curPage: pageName,
        gameLoop: GameLoop,
    ) {
        this.curPage = curPage;
        this.gameLoop = gameLoop;

        this.updateDisplay();
        this.updateListeners();
        // TODO listeners
        // TODO renderer
    }

    static default(): Renderer {
        return new Renderer(
            'main',
            GameLoop.default(),
        )
    }

    private updateListeners(): void {
        let gameHolder = document.getElementById("game-holder")!;
        gameHolder.onkeydown = (ev: KeyboardEvent) => {
            if (this.gameLoop.isRunning) {
                this.gameLoop.handleKeydownEvent(ev.key); return
            }
            switch (ev.key) {
                case 'Enter': this.startGame();
                default: return
            }
        }
    }

    private startGame(): void {
        this.gameLoop.isRunning = true;
        this.curPage = 'game';

        this.updateDisplay();
        this.updateListeners();
        this.renderGameScreen();
        this.gameLoop.startGame();
    }

    private endGame(): void {

    }

    private updateDisplay(): void {
        const SCREENDISPLAY = 'inline';
        // may cause jittering during screen transitions
        document.getElementById("header-widgets-holder")!.style.display = SCREENDISPLAY;
        document.getElementById("game-holder")!.style.display = SCREENDISPLAY;
        document.getElementById("footer")!.style.display = SCREENDISPLAY;
        document.getElementById("settings-screen")!.style.display = 'none';
        switch (this.curPage) {
            case 'main': {
            }
            case 'game': {
                document.getElementById("header-widgets-holder")!.style.display = 'none';
                document.getElementById("footer")!.style.display = 'none';
            }
            case 'settings': {
                document.getElementById("settings-screen")!.style.display = SCREENDISPLAY;
                document.getElementById("game-holder")!.style.display = 'none';
            }
        }
    }

    private renderQuestionString(): string {
        let question = this.gameLoop.curQuestion;
        if (question === null) {
            return "";
        }

        switch (question.operator) {
            case 'add': {
                return `
                <p class="question-number">${question.questionNumbers[0]}</p>
                ${Icons.plus}
                <p class="question-number">${question.questionNumbers[1]}</p>
                `
            }
            case 'subtract': {
                return `
                <p class="question-number">${question.questionNumbers[0]}</p>
                ${Icons.minus}
                <p class="question-number">${question.questionNumbers[1]}</p>
                `
            }
            case 'multiply': {
                return `
                <p class="question-number">${question.questionNumbers[0]}</p>
                ${Icons.times}
                <p class="question-number">${question.questionNumbers[1]}</p>
                `
            }
            case 'divide': {
                return `
                <p class="question-number">${question.questionNumbers[0]}</p>
                ${Icons.divide}
                <p class="question-number">${question.questionNumbers[1]}</p>
                `
            }
            case 'square': {
                return `
                <p class="question-number question-base question-base2">${question.questionNumbers[0]}</p>
                `
            }
            case 'cube': {
                return `
                <p class="question-number question-base question-base3">${question.questionNumbers[0]}</p>
                `
            }
            case 'add3': {
                return `
                <p class="question-number">${question.questionNumbers[0]}</p>
                ${Icons.plus}
                <p class="question-number">${question.questionNumbers[1]}</p>
                ${Icons.plus}
                <p class="question-number">${question.questionNumbers[2]}</p>
                `
            }
            case 'sub3': {
                return `
                <p class="question-number">${question.questionNumbers[0]}</p>
                ${Icons.minus}
                <p class="question-number">${question.questionNumbers[1]}</p>
                ${Icons.minus}
                <p class="question-number">${question.questionNumbers[2]}</p>
                `
            }
            case 'addsubtract': {
                return `
                <p class="question-number">${question.questionNumbers[0]}</p>
                ${Icons.plus}
                <p class="question-number">${question.questionNumbers[1]}</p>
                ${Icons.minus}
                <p class="question-number">${question.questionNumbers[2]}</p>
                `
            }
            case 'subtractadd': {
                return `
                <p class="question-number">${question.questionNumbers[0]}</p>
                ${Icons.minus}
                <p class="question-number">${question.questionNumbers[1]}</p>
                ${Icons.plus}
                <p class="question-number">${question.questionNumbers[2]}</p>
                `
            }
            
            default: return ""
        }
    }

    private renderGameScreen(): void {
        let gameLeftTopText = document.getElementById("game-left-top-text")!;
        let questionDisplay = document.getElementById("question-display")!;
        let answerDisplay = document.getElementById("answer-display")!;
        let scoreDisplay = document.getElementById("score-display")!;
        let highScoreDisplay = document.getElementById("high-score-display")!;

        scoreDisplay.innerText = `${this.gameLoop.numPoints}`
        // TODO display highscore from localstorage
        highScoreDisplay.innerText = "0";

        if (this.gameLoop.isRunning) {
            gameLeftTopText.innerHTML = `${Icons.calculator} Question ${1 + this.gameLoop.prevQuestions.length}`;
            questionDisplay.innerHTML = this.renderQuestionString();
            answerDisplay.innerText = this.gameLoop.getAnswerText();

        } else {
            gameLeftTopText.innerHTML = ((): string => {switch (this.gameLoop.gamemode) {
                case 'marathon': return `Marathon, 3 ${Icons.fire}`
                case 'sprint': return `Sprint, ${this.gameLoop.gamerules.gameTime}s ${Icons.stopwatch}`
                case 'zen': return `Zen, ${this.gameLoop.gamerules.gameTime}s ${Icons.clock}`
                default: return `gamemode.${this.gameLoop.gamemode}`
            }})();
            questionDisplay.innerHTML = "_";
            answerDisplay.innerText = "Enter";
        }
        

    }

    private renderItems(): void {
        
    }
}