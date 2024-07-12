import { GameState, gamemode, gamerules } from "./GameState";
import { QuestionTemplate } from "./QuestionTemplate";
import { randomSeeded } from "./RandomSeeded";
import { Question } from "./question";

export type questionStorage = [Question, number | "noAnswer"]

export class GameLoop extends GameState {
    prevQuestions: questionStorage[];
    curQuestion: Question | null;
    curTemplate: QuestionTemplate | null;
    private randomSeed: number | null;
    private answerText: string = "";
    answerIsNegative: boolean = false;
    isRunning: boolean = false;
    gameTimer: NodeJS.Timeout | null = null;

    constructor(
        gamemode: gamemode,
        startingRules: gamerules,
        setTemplate: QuestionTemplate | null = null,
        numPoints: number = 0,
        prevQuestions: questionStorage[] = [],
        curQuestion: Question | null = null,
        randomSeed: number | null = null,

    ) {
        super(
            gamemode,
            startingRules,
            setTemplate,
            numPoints
        )
        this.prevQuestions = prevQuestions;
        this.curQuestion = curQuestion;
        this.curTemplate = setTemplate;
        this.randomSeed = randomSeed;
    }

    static default(): GameLoop {
        let defaultGameState = super.default();
        return new GameLoop(
            defaultGameState.gamemode,
            defaultGameState.startingRules,
            defaultGameState.setTemplate,
            defaultGameState.numPoints,
        )

    }

    generateQuestionTemplate(): QuestionTemplate {
        let difficulty = this.gamerules.difficulty;
        let dBase = Math.floor(difficulty);
        // dist. cubed for nicer flow
        let dDist = Math.pow(difficulty - dBase, 3);
        if (dDist === 0 || difficulty >= 5) return QuestionTemplate.fromBaseDifficulty(dBase);

        var rng = randomSeeded(this.randomSeed);
        let dChoice = rng();
        if (dChoice <= dDist) return QuestionTemplate.fromBaseDifficulty(dBase);
        return QuestionTemplate.fromBaseDifficulty(dBase + 1) 
    }

    private submitAnswer(
        // null = timer expired
        answer: number | null,
    ): boolean {
        if (this.curQuestion === null) {
            console.error("GameLoop.submitAnswer: current question is null");
            return false;
        }
        let isCorrect;
        if (answer === null) {isCorrect = false}
        else {isCorrect = this.curQuestion.submitSolution(answer)}
        this.prevQuestions.push([this.curQuestion, answer === null ? 'noAnswer' : answer])
        if (isCorrect) {
            this.numPoints += 1;
        } else {
            this.gamerules.numLives -= 1;
        }
        this.updatePostAnswer();
        return isCorrect;

    }

    handleKeydownEvent(key: string): void {
        const NUMBERS = [
            "1","2","3","4","5","6","7","8","9","0"
        ];
        if (NUMBERS.includes(key)) {
            this.answerText += key;
        }
        if (key === "Backspace") {
            this.answerText = this.answerText.slice(0,-1);
        }
        if (key === "Enter") {
            this.submitAnswer(parseInt(this.answerText));
        }
        if (key === "-") {
            this.answerIsNegative = !this.answerIsNegative;
        }
    }

    private resetGame(): void {
        this.gamerules = this.startingRules;
        this.isRunning = false;
        this.curQuestion = null;
        this.curTemplate = this.setTemplate === null ?
            this.generateQuestionTemplate() : this.setTemplate;
        this.numPoints = 0;
        this.prevQuestions = [];
    }

    startGame(): void {
        this.resetGame();
        this.curQuestion = this.generateQuestion();
        this.isRunning = true;
        this.updateTimer()
    }

    private updateTimer(): void {
        if (this.gameTimer !== null) {
            clearTimeout(this.gameTimer);
        }
        switch (this.gamemode) {
            case 'marathon': this.gameTimer = setTimeout(
                () => this.submitAnswer(null) // noanswer
            , 1000 * this.gamerules.answerTime!);
            default: this.gameTimer = setTimeout(
                () => {this.isRunning = false; this.submitAnswer(null)}
            , 1000 * this.gamerules.gameTime!)
        }
    }

    private updatePostAnswer(): void {
        if(this.gamerules.numLives <= 0 || !this.isRunning) {
            this.isRunning = false;
            return
        }
        if (this.gamemode == "marathon") {
            this.gamerules.difficulty += 0.01;
            this.curTemplate = this.generateQuestionTemplate();
            this.gamerules.answerTime = GameState.answerTimeFunc(this.numPoints)
        }
        this.curQuestion = this.generateQuestion();
        this.updateTimer();
    }

    generateQuestion(): Question {
        if (this.curTemplate === null) {
            this.curTemplate = this.generateQuestionTemplate();
        }
        return Question.fromTemplate(this.curTemplate, this.randomSeed)
    }

    getAnswerText(): string {
        return (this.answerIsNegative ? "-" : "") + this.answerText;
    }


}