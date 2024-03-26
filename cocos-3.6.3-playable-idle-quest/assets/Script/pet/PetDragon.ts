import { _decorator, CCFloat, CCString, Collider2D, Component, Contact2DType, director, IPhysics2DContact, Node, v2 } from 'cc';
import GameEvent from '../GameEvent';
import GameTag from '../GameTag';
import { BaseHealth } from '../base/BaseHealth';
import { BaseShoot } from '../base/BaseShoot';
import { BaseSpineCustom } from '../base/BaseSpineCustom';
import { PlayerController } from '../player/PlayerController';
import { BaseSpine } from '../base/BaseSpine';
const { ccclass, property } = _decorator;

@ccclass('PetDragon')
export class PetDragon extends Component {

    @property(CCFloat)
    delayAttack: number = 2;

    @property(CCString)
    animIdle: string = 'idle';

    @property(CCString)
    animMove: string = 'run';

    @property(CCString)
    animAttack: string = 'attack';

    spine: BaseSpine = null;
    shoot: BaseShoot = null;

    stageAttack: boolean = false;

    protected onLoad(): void {
        this.spine = this.node.getComponent(BaseSpine);
        this.shoot = this.node.getComponent(BaseShoot);
        //
        director.on(GameEvent.PLAYER_MOVE, this.onMove, this);
        director.on(GameEvent.PLAYER_STOP, this.onStop, this);
        director.on(GameEvent.PLAYER_ATTACK, this.onAttack, this);
    }

    protected start(): void {
        this.spine.SetFaceR();
    }

    private onMove(): void {
        this.spine.SetAnim(this.animMove, true);
        //
        this.stageAttack = false;
    }

    private onStop(): void {
        this.spine.SetAnim(this.animIdle, true);
        //
        this.stageAttack = false;
    }

    private onAttack(): void {
        this.stageAttack = true;
        //
        this.SetAttack();
    }

    //

    private SetAttack(): void {
        if (!this.stageAttack)
            return;
        //
        var Delay = this.spine.SetAnim(this.animAttack, false);
        this.scheduleOnce(() => {
            this.spine.SetAnim(this.animIdle, true);
        }, Delay);
        this.scheduleOnce(() => {
            this.shoot.SetShootDirection(v2(1, 0));
        }, Delay * 0.65);
        this.scheduleOnce(() => {
            this.SetAttack();
        }, Delay + this.delayAttack);
    }
}