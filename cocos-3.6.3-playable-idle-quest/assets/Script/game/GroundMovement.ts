import { _decorator, CCFloat, CCInteger, Component, director, Node, tween, v3 } from 'cc';
import GameEvent from '../GameEvent';
import { PlayerSkill } from '../player/PlayerSkill';
const { ccclass, property } = _decorator;

@ccclass('GroundMovement')
export class GroundMovement extends Component {
    @property(CCFloat)
    Width: number = 1080;

    @property(CCInteger)
    Count: number = 3;

    @property(CCFloat)
    LoopDuration: number = 1.5;

    isdMove: boolean = false;

    protected onLoad(): void {
        director.on(GameEvent.PLAYER_MOVE, this.onMove, this);
        director.on(GameEvent.PLAYER_ATTACK, this.onStop, this);
        director.on(GameEvent.PLAYER_STOP, this.onStop, this);
        //
        director.on(PlayerSkill.PLAYER_SKILL_SLASH, this.onPlayerSkillSlash, this);
    }

    protected start(): void {

    }

    private onMove(): void {
        if (this.isdMove)
            return;
        this.isdMove = true;
        //
        this.SetMove(1);
    }

    private SetMove(Loop: number): void {
        this.node.setPosition(v3(0, 0, 0));
        tween(this.node)
            .to(this.LoopDuration, { position: v3(-this.Width * this.Count, 0, 0) }, { easing: 'linear' })
            .call(() => {
                if (Loop - 1 > 0)
                    this.SetMove(Loop - 1);
                else
                    director.emit(GameEvent.PLAYER_ATTACK);
            })
            .start();
    }

    private onStop(): void {
        this.isdMove = false;
        //
        this.node.setPosition(v3(0, 0, 0));
    }

    //

    private onPlayerSkillSlash(Active: boolean): void {
        this.node.getChildByName('child-slash').active = Active;
    }
}