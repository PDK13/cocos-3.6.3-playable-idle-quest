import { _decorator, CCBoolean, CCFloat, CCInteger, Component, director, Label, Node } from 'cc';
import GameEvent from './GameEvent';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    static instance: GameManager = null;

    @property(CCBoolean)
    fake: boolean = false;

    @property(CCFloat)
    delayPlayerMove: number = 1;

    @property(CCFloat)
    delayMonsterMove: number = 2.5;

    @property(Label)
    waveLabel: Label = null;

    waveCurrent: number = 1;

    @property([Node])
    public waveMonster: Node[] = [];

    waveMonsterRemain: number = 0;

    isStop: boolean = false;

    protected onLoad(): void {
        if (this.fake)
            return;
        //
        GameManager.instance = this;
        //
        director.on(GameEvent.MONSTER_MOVE, this.onMonsterMove, this);
        director.on(GameEvent.MONSTER_DEAD, this.onMonsterDead, this);
        director.on(GameEvent.PLAYER_DEAD, this.onPlayerDead, this);
    }

    protected start(): void {
        if (this.fake)
            return;
        //
        director.emit(GameEvent.PLAYER_STOP);
        director.emit(GameEvent.MONSTER_STOP);
        this.scheduleOnce(() => {
            director.emit(GameEvent.PLAYER_MOVE);
        }, this.delayPlayerMove);
        this.scheduleOnce(() => {
            director.emit(GameEvent.MONSTER_MOVE);
        }, this.delayMonsterMove);
    }

    private onMonsterMove(): void {
        this.waveMonsterRemain = this.waveMonster.length;
    }

    private onMonsterDead(): void {
        if (this.isStop)
            return;
        //
        this.waveMonsterRemain--;
        if (this.waveMonsterRemain == 0) {
            //console.log("[Manager] Wave Reset!");
            //
            this.scheduleOnce(() => {
                director.emit(GameEvent.PLAYER_STOP);
                director.emit(GameEvent.MONSTER_STOP);
                this.scheduleOnce(() => {
                    director.emit(GameEvent.PLAYER_MOVE);
                }, this.delayPlayerMove >= 0.1 ? this.delayPlayerMove - 0.1 : 0);
                this.scheduleOnce(() => {
                    director.emit(GameEvent.MONSTER_MOVE);
                }, this.delayMonsterMove >= 0.1 ? this.delayMonsterMove - 0.1 : 0);
            }, 0.1);
            //
            this.waveCurrent++;
            this.waveLabel.string = 'WAVE ' + this.waveCurrent.toString();
        }
        //
        //console.log("[Manager] Monster Dead!);
    }

    private onPlayerDead(): void {
        this.unscheduleAllCallbacks();
        this.isStop = true;
        //
        this.scheduleOnce(() => director.emit(GameEvent.GAME_LOSE), 0.15);
    }
}