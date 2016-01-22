declare module EasyStar {
    class js {
        new(): js;
        setGrid(grid: number[][]): void;
        setAcceptableTiles(tiles: number[]): void;
        findPath(startX: number, startY: number, endX: number, endY: number, callback: (path: Position[]) => void): void;
        calculate(): void;
        setIterationsPerCalculation(iterations: number): void;
        avoidAdditionalPoint(x: number, y: number): void;
        stopAvoidingAdditionalPoint(x: number, y: number): void;
        stopAvoidingAllAdditionalPoints(): void;
        enableDiagonals(): void;
        disableDiagonals(): void;
        setTileCost(tileType: number, multiplicativeCost: number): void;
    }

    interface Position {
        x: number;
        y: number;
    }
}
 