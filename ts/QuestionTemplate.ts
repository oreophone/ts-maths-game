export const OPERATORS = [
    'add',
    'subtract',
    'multiply',
    'divide',
    'square',
    'cube',
    'add3',
    'sub3',
    'addsubtract',
    'subtractadd',
] as const;

export const OPERATORQUESTIONNUMBERS = {
    'add': 2,
    'subtract': 2,
    'multiply': 2,
    'divide': 2,
    'square': 1,
    'cube': 1,
    'add3': 3,
    'sub3': 3,
    'addsubtract': 3,
    'subtractadd': 3,
}

export type operator = typeof OPERATORS[number];

export type numberRange = [number, number];
export type operatorTemplates = {
    [o in operator]: numberRange | null
}

export type questionNumbers
    = [number]
    | [number, number]
    | [number, number, number]
    ;

export class QuestionTemplate {
    operatorTemplates: operatorTemplates;
    isNegativeNumbersAllowed: boolean;

    constructor(
        params: {
            [op in operator]?: numberRange
        },
        isNegativeNumbersAllowed: boolean = true
    ) {

        let questionTemplate = params;
        this.operatorTemplates = <operatorTemplates>Object.fromEntries(OPERATORS.map((op) => [op, null]));
        OPERATORS.forEach(op => {
            let curValue = questionTemplate[op]
            this.operatorTemplates[op] = curValue === undefined ?
                null : curValue
        });

        this.isNegativeNumbersAllowed = isNegativeNumbersAllowed;
    }

    getAllowedOperations(): operator[] {
        let opList: operator[] = OPERATORS.map((op) => op);
        return opList.filter((op) => this.operatorTemplates[op] !== null);
    }

    static fromBaseDifficulty(dif: number): QuestionTemplate {
        switch (dif) {
            case 1: return QuestionTemplate.DIF1()
            case 2: return QuestionTemplate.DIF2()
            case 3: return QuestionTemplate.DIF3()
            case 4: return QuestionTemplate.DIF4()
            case 5: return QuestionTemplate.DIF5()
            default: return QuestionTemplate.DIF1()
        }
    }

    private static DIF1(): QuestionTemplate {
        return new QuestionTemplate({
            add: [0,10],
            subtract: [0,10],
            multiply: [0,5],
            divide: [1,5],
        },
        /* isNegativeNumbersAllowed: */ false,
        )
    }

    private static  DIF2(): QuestionTemplate {
        return new QuestionTemplate({
            add: [1,30],
            subtract: [1,30],
            multiply: [1,10],
            divide: [1,10],
            add3: [1,10],
            sub3: [1,10],
        },
        /* isNegativeNumbersAllowed: */ false,
        )
    }

    private static  DIF3(): QuestionTemplate {
        return new QuestionTemplate({
            add: [10,100],
            subtract: [30,100],
            multiply: [2,15],
            divide: [2,15],
            add3: [1,30],
            sub3: [1,30],
            addsubtract: [1,30],
            subtractadd: [1,30],
            square: [1,10],
        })
    }

    private static DIF4(): QuestionTemplate {
        return new QuestionTemplate({
            add: [10,500],
            subtract: [10,500],
            multiply: [2,40],
            divide: [2,40],
            add3: [10,100],
            sub3: [10,100],
            addsubtract: [10,100],
            subtractadd: [10,100],
            square: [2,20],
            cube: [1,10],
        })
    }

    private static DIF5(): QuestionTemplate {
        return new QuestionTemplate({
            add: [100,999],
            subtract: [100,999],
            multiply: [2,99],
            divide: [2,99],
            add3: [10,500],
            sub3: [10,500],
            addsubtract: [10,500],
            subtractadd: [10,500],
            square: [2,50],
            cube: [2,25],
        })
    }
}
