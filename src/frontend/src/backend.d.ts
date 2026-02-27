import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Game {
    id: GameId;
    colorTheme: string;
    name: string;
    drawTime: bigint;
}
export type LuckyNumberSetId = bigint;
export interface LuckyNumberSet {
    id: LuckyNumberSetId;
    gameId: GameId;
    timestamp: bigint;
    numbers: Array<bigint>;
}
export type GameId = bigint;
export interface backendInterface {
    createGame(name: string, drawTime: bigint, colorTheme: string): Promise<GameId>;
    deleteGame(gameId: GameId): Promise<void>;
    generateAndSaveLuckyNumbers(gameId: GameId): Promise<LuckyNumberSetId>;
    getAllGames(): Promise<Array<Game>>;
    getAllLuckyNumberSets(): Promise<Array<LuckyNumberSet>>;
    getGame(gameId: GameId): Promise<Game>;
    getLuckyNumberSet(luckyNumberSetId: LuckyNumberSetId): Promise<LuckyNumberSet>;
    getLuckyNumberSetsForGame(gameId: GameId): Promise<Array<LuckyNumberSet>>;
    updateGame(gameId: GameId, name: string, drawTime: bigint, colorTheme: string): Promise<void>;
}
