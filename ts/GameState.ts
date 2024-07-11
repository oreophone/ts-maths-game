import {QuestionTemplate} from "./QuestionTemplate";

export const GAMEMODES = [
    "marathon",
    "timed",
    "zen"
] as const;

export type gamemode = typeof GAMEMODES[number];

export type gamerules = {
    answerTime: number | null,
    gameTime: number | null,
    difficulty: number,
    numLives: number,
}

export class GameState {
    gamemode: gamemode;
    numPoints: number;
    // stored for display, recording purposes
    startingRules: gamerules;
    gamerules: gamerules;
    // for non-marathon, custom rules; marathon template will change as difficulty increases
    setTemplate: QuestionTemplate | null;

    constructor(
        gamemode: gamemode,
        startingRules: gamerules,
        setTemplate: QuestionTemplate | null = null,
        numPoints: number = 0,
    ) {
        this.gamemode = gamemode;
        this.startingRules = startingRules;
        this.gamerules = startingRules;
        this.numPoints = numPoints;
        this.setTemplate = setTemplate;
    }

    static default(): GameState {
        let defaultGamerules = {
            answerTime: 5,
            gameTime: null,
            difficulty: 1,
            numLives: 3
        }
        return new GameState(
            "marathon",
            defaultGamerules,
        )
    }

    // answerTime = cos(0.02π * numPoints) + 4
    // i.e. answerTime oscillates between 5 and 3 secs over a period of 100 questions
    protected static answerTimeFunc(n: number): number {
        return Math.cos(n * Math.PI * 0.02) + 4
    }
}