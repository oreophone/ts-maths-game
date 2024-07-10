import {QuestionTemplate, operator, numberRange, questionNumbers, OPERATORS, OPERATORQUESTIONNUMBERS} from "./QuestionTemplate";
import {genSample, genSampleFromRange, randomSeeded} from "./RandomSeeded";

export class Question {
    questionNumbers: questionNumbers;
    operator: operator;
    private randomSeed: number | null;


    constructor(
        questionNumbers: questionNumbers,
        operator: operator,
        randomSeed: number | null = null
    ) {
        this.questionNumbers = questionNumbers;
        this.operator = operator;
        this.randomSeed = randomSeed;
    }

    static fromTemplate(
        template: QuestionTemplate,
        randomSeed: number | null = null
    ): Question {
        var rng = randomSeeded(randomSeed);
        let allowedOperators = template.getAllowedOperations();
        let chosenOperator = genSample(rng, allowedOperators)[0];
        let numberRange = template.operatorTemplates[chosenOperator]!;
        let questionNumbers = Question.genQuestionNumbers(
            numberRange, chosenOperator, randomSeed, template.isNegativeNumbersAllowed
        )
        return new Question(
            questionNumbers,
            chosenOperator,
            randomSeed
        )
    }

    static genQuestionNumbers(
        numberRange: numberRange,
        operator: operator,
        randomSeed: number | null = null,
        isNegativeNumberAllowed: boolean = true,
    ): questionNumbers {
        var rng = randomSeeded(randomSeed);
        let qNumbers = <questionNumbers>genSampleFromRange(
            rng, numberRange, OPERATORQUESTIONNUMBERS[operator]
        )
        if (operator === 'divide') return [qNumbers[0] * qNumbers[1]!, qNumbers[1]!]
        if (isNegativeNumberAllowed) return qNumbers
        if ([
            'add', 'multiply', 'divide', 'square', 'cube', 'add3'
        ].includes(operator)) return qNumbers
        // may need refinement
        switch (operator) {
            case "subtract": return [qNumbers[0] + qNumbers[1]!, qNumbers[1]!]
            case "sub3": return [qNumbers[0] + qNumbers[1]! + qNumbers[2]!, qNumbers[1]!, qNumbers[2]!]
            case "addsubtract": return [qNumbers[0] + qNumbers[2]!, qNumbers[1]!, qNumbers[2]!]
            case "subtractadd": return [qNumbers[0] + qNumbers[1]!, qNumbers[1]!, qNumbers[2]!]
            default: return qNumbers
        }
    }

    asString(): string {
        switch (this.operator) {
            case "add": return `${this.questionNumbers[0]} + ${this.questionNumbers[1]}`
            case "subtract": return `${this.questionNumbers[0]} - ${this.questionNumbers[1]}`
            case "multiply": return `${this.questionNumbers[0]} x ${this.questionNumbers[1]}`
            case "divide": return `${this.questionNumbers[0]} ÷ ${this.questionNumbers[1]}`
            case "square": return `${this.questionNumbers[0]}^2`
            case "cube": return `${this.questionNumbers[0]}^3`
            case "add3": return `${this.questionNumbers[0]} + ${this.questionNumbers[1]} + ${this.questionNumbers[2]}`
            case "sub3": return `${this.questionNumbers[0]} - ${this.questionNumbers[1]} - ${this.questionNumbers[2]}`
            case "addsubtract": return `${this.questionNumbers[0]} + ${this.questionNumbers[1]} - ${this.questionNumbers[2]}`
            case "subtractadd": return `${this.questionNumbers[0]} - ${this.questionNumbers[1]} + ${this.questionNumbers[2]}`
        }
    }

    submitSolution(solution: number): boolean {
        return solution === this.generateSolution()
    }

    private generateSolution(): number {
        if (OPERATORQUESTIONNUMBERS[this.operator] !== this.questionNumbers.length) {
            return Number.POSITIVE_INFINITY // error value chosen for now
        }
        switch (this.operator) {
            case "add":
                return this.questionNumbers[0] + this.questionNumbers[1]!
            case "subtract":
                return this.questionNumbers[0] - this.questionNumbers[1]!
            case "multiply":
                return this.questionNumbers[0] * this.questionNumbers[1]!
            case "divide":
                // all generated divide questions must be of [n, cn], n, c natural (answer c)
                return Math.floor(this.questionNumbers[0] + this.questionNumbers[1]!)
            case "square":
                return Math.pow(this.questionNumbers[0], 2)
            case "cube":
                return Math.pow(this.questionNumbers[0], 3)
            case "add3":
                return this.questionNumbers[0] + this.questionNumbers[1]! + this.questionNumbers[2]!
            case "sub3": 
                return this.questionNumbers[0] - this.questionNumbers[1]! - this.questionNumbers[2]!
            case "addsubtract":
                // evaluated left->right
                return this.questionNumbers[0] + this.questionNumbers[1]! - this.questionNumbers[2]!
            case "subtractadd":
                return this.questionNumbers[0] - this.questionNumbers[1]! + this.questionNumbers[2]!
            default: return Number.POSITIVE_INFINITY
        }
    }
}