import { _decorator } from 'cc';

export default class GameEvent {
    static GAME_FINISH: string = 'GAME_FINISH';
    static GAME_LOSE: string = 'GAME_LOSE';
    static GAME_RETRY: string = 'GAME_RETRY';

    static PLAYER_MOVE: string = 'PLAYER_MOVE';
    static PLAYER_STOP: string = 'PLAYER_STOP';
    static PLAYER_ATTACK: string = 'PLAYER_ATTACK';
    static PLAYER_DEAD: string = 'PLAYER_DEAD';

    static MONSTER_MOVE: string = 'MONSTER_MOVE';
    static MONSTER_STOP: string = 'MONSTER_STOP';
    static MONSTER_DEAD: string = 'MONSTER_DEAD';
}