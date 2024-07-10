import {QuestionTemplate, operator, numberRange, questionNumbers, OPERATORS} from "./QuestionTemplate";
import {randomSeeded} from "./RandomSeeded";

export class Question {
    questionNumbers: questionNumbers;
    operator: operator;
    private randomSeed: number | null;
    private solution: number;


    constructor(
        questionNumbers: questionNumbers,
        operator: operator,
        randomSeed: number | null = null
    ) {
        this.questionNumbers = questionNumbers;
        this.operator = operator;
        this.randomSeed = randomSeed;
        this.solution = this.generateSolution();
    }

    fromTemplate(
        template: QuestionTemplate,
        randomSeed: number | null = null
    ): Question {
        var rng = randomSeeded(randomSeed);
        let allowedOperators = template.getAllowedOperations();
        this.randomSeed = randomSeed;
        // TODO
    }

    private generateSolution(): number {
        switch ([this.operator, this.questionNumbers.length]) {
            case ["add", 2]:
                return this.questionNumbers[0] + this.questionNumbers[1]!
            case ["subtract", 2]:
                return this.questionNumbers[0] - this.questionNumbers[1]!
            case ["multiply", 2]:
                return this.questionNumbers[0] * this.questionNumbers[1]!
            case ["divide", 2]:
                // all generated divide questions must be of [n, cn], n, c natural (answer c)
                return Math.floor(this.questionNumbers[0] + this.questionNumbers[1]!)
            case ["square", 1]:
                return Math.pow(this.questionNumbers[0], 2)
            case ["cube", 1]:
                return Math.pow(this.questionNumbers[0], 3)
            case ["add3", 3]:
                return this.questionNumbers[0] + this.questionNumbers[1]! + this.questionNumbers[2]!
            case ["sub3", 3]: 
                return this.questionNumbers[0] - this.questionNumbers[1]! - this.questionNumbers[2]!
            case ["addsubtract", 3]:
                // evaluated left->right
                return this.questionNumbers[0] + this.questionNumbers[1]! - this.questionNumbers[2]!
            case ["subtractadd", 3]:
                return this.questionNumbers[0] - this.questionNumbers[1]! + this.questionNumbers[2]!
            default: return Number.POSITIVE_INFINITY
        }
    }
}