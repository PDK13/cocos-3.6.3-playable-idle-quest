import { _decorator, CCFloat, CCInteger, CCString, Collider2D, Component, Contact2DType, director, IPhysics2DContact, RigidBody2D, v2, Vec2, Vec3 } from 'cc';
import GameEvent from '../GameEvent';
import GameTag from '../GameTag';
import { PlayerController } from '../player/PlayerController';
import { BaseShoot } from '../base/BaseShoot';
import { BaseSpine } from '../base/BaseSpine';
import { BaseHealth } from '../base/BaseHealth';
import { PlayerSkill } from '../player/PlayerSkill';
const { ccclass, property } = _decorator;

@ccclass('MonsterController')
export class MonsterController extends Component {

    @property(CCFloat)
    moveSpeed: number = 2;

    @property(CCFloat)
    delayAttack: number = 1;

    @property(CCFloat)
    bulletDelay: number = 0.5;

    @property(CCInteger)
    reviveHealthAdd: number = 10;

    @property(CCString)
    animIdle: string = 'idle';

    @property(CCString)
    animMove: string = 'walk';

    @property(CCString)
    animAttack: string = 'attack';

    @property(CCString)
    animDead: string = 'dead';

    spine: BaseSpine = null;
    shoot: BaseShoot = null;
    health: BaseHealth = null;
    rigidbody: RigidBody2D = null;
    spineDead: BaseSpine = null;

    posPrimary: Vec3;
    isMoving: boolean = false;
    isDead: boolean = false;

    protected onLoad(): void {
        this.spine = this.node.getComponent(BaseSpine);
        this.shoot = this.node.getComponent(BaseShoot);
        this.health = this.node.getComponent(BaseHealth);
        this.spineDead = this.node.getChildByName('spine-dead').getComponent(BaseSpine);
        //
        this.rigidbody = this.node.getComponent(RigidBody2D);
        //
        director.on(GameEvent.MONSTER_MOVE, this.onMove, this);
        director.on(GameEvent.MONSTER_BODY_STOP, this.onStop, this);
        director.on(GameEvent.PLAYER_DEAD, this.onPlayerDead, this);
        //
        director.on(PlayerSkill.PLAYER_SKILL_SLASH, this.onPlayerSkillSlash, this);
        //
        let colliders = this.getComponents(Collider2D);
        colliders.forEach(c => {
            c.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        })
    }

    protected start(): void {
        this.spine.SetFaceL();
        this.posPrimary = this.node.position.clone();
    }

    //

    private onMove(): void {
        if (this.isDead)
            return;
        //
        this.SetMove();
    }

    private onStop(): void {
        this.unscheduleAllCallbacks();
        //
        if (this.health.GetHealth() == 0) {
            this.health.SetHealthBaseAdd(this.reviveHealthAdd);
            this.health.SetHealth(9999);
            this.isDead = false;
            this.node.getChildByName('spine-dead').active = false;
        }
        //
        this.SetIdle();
    }

    private onPlayerDead(): void {
        if (this.isDead)
            return;
        //
        this.unscheduleAllCallbacks();
        this.SetIdle();
    }

    //

    private SetMove(): void {
        this.isMoving = true;
        this.spine.SetAnim(this.animMove, true);
        this.rigidbody.linearVelocity = v2(-this.moveSpeed, 0);
    }

    private SetIdle(): void {
        this.isMoving = false;
        this.spine.SetAnim(this.animIdle, true);
        this.rigidbody.linearVelocity = Vec2.ZERO;
    }

    private SetAttack(): void {
        if (this.isDead)
            return;
        //
        var DurationAttack = this.spine.SetAnim(this.animAttack, false);
        //
        this.scheduleOnce(() => {
            if (this.isDead)
                return;
            //
            this.spine.SetAnim(this.animIdle, true);
            //
            this.scheduleOnce(() => {
                if (this.isDead)
                    return;
                //
                this.SetAttack();
            }, this.delayAttack);
            //
        }, DurationAttack);
        //
        this.scheduleOnce(() => {
            if (this.isDead)
                return;
            //
            this.shoot.SetShootTarget(PlayerController.instance.node);
        }, this.bulletDelay);
    }

    private SetDead(): void {
        this.isDead = true;
        //
        var Delay = this.spine.SetAnim(this.animDead, false);
        this.rigidbody.linearVelocity = Vec2.ZERO;
        //
        this.spineDead.node.active = true;
        this.spineDead.SetAnimForce('animation', false);
        //
        this.scheduleOnce(() => {
            this.node.setPosition(this.posPrimary);
            director.emit(GameEvent.MONSTER_DEAD);
        }, Delay < 1 ? 1 : Delay);
        //
        //console.log('[Monster] ' + this.node.name + ' dead!');
    }

    //

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this.isDead)
            return;
        //
        if (selfCollider.tag == GameTag.MONSTER_RANGE) {
            switch (otherCollider.tag) {
                case GameTag.PLAYER:
                    this.SetIdle();
                    this.scheduleOnce(() => {
                        this.SetAttack();
                    }, this.delayAttack);
                    break;
            }
        }
        //
        if (selfCollider.tag == GameTag.MONSTER) {
            switch (otherCollider.tag) {
                case GameTag.PLAYER_BULLET:
                    //console.log("[Monster] Hit " + PlayerController.instance.atkCurrent());
                    //
                    this.health.SetHealthAdd(-PlayerController.instance.atkCurrent());
                    //
                    if (this.health.GetHealth() == 0)
                        this.SetDead();
                    //
                    break;
            }
        }
    }

    //

    private onPlayerSkillSlash(Active: boolean): void {
        if (Active) {
            this.unscheduleAllCallbacks();
            this.rigidbody.linearVelocity = Vec2.ZERO;
        }
        else {
            this.health.SetHealth(0);
            this.SetDead();
            //
            //console.log("[Monster] " + this.node.name + " Skill!");
        }
    }
}