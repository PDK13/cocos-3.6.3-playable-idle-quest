import { _decorator, CCFloat, CCString, Collider2D, Component, Contact2DType, director, IPhysics2DContact, Node, RigidBody2D, v2, v3, Vec2, Vec3 } from 'cc';
import GameEvent from '../GameEvent';
import GameTag from '../GameTag';
import { BaseSpineCustom } from '../base/BaseSpineCustom';
import { BaseShoot } from '../base/BaseShoot';
import { BaseHealth } from '../base/BaseHealth';
import { PlayerSkill } from './PlayerSkill';
import { GameManager } from '../GameManager';
import { BaseBullet } from '../base/BaseBullet';
import { BaseSpine } from '../base/BaseSpine';
import { PlayerStat } from './PlayerStat';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    static instance: PlayerController = null;

    @property(CCString)
    animIdle: string = 'idle';

    @property(CCString)
    animMove: string = 'run';

    @property(CCString)
    animAttack1: string = 'attack_15';

    @property(CCString)
    animAttack2: string = 'attack_16';

    @property(CCString)
    animDead: string = 'dead';

    @property(CCString)
    animSkillSlashReady: string = 'attack_15';

    @property(CCString)
    animSkillSlash1: string = 'attack_16';

    @property(CCString)
    animSkillSlash2: string = 'attack_15';

    spine: BaseSpineCustom = null;
    shoot: BaseShoot = null;
    health: BaseHealth = null;
    spineSlash: BaseSpine = null;

    atkBase: number = 0;
    hpBase: number = 0;

    public atkCurrent(): number {
        return this.atkBase + PlayerStat.instance.atkCurrent;
    }
    public hpCurrent(): number {
        return this.hpBase + PlayerStat.instance.hpCurrent;
    }

    stageAttack: boolean = false;
    isDead: boolean = false;
    animAttackFirst: boolean = true;
    skillSlashActive: boolean = false;

    protected onLoad(): void {
        PlayerController.instance = this;
        //
        this.spine = this.node.getComponent(BaseSpineCustom);
        this.shoot = this.node.getComponent(BaseShoot);
        this.health = this.node.getComponent(BaseHealth);
        this.spineSlash = this.node.getChildByName('spine-slash').getComponent(BaseSpine);
        //
        director.on(GameEvent.PLAYER_MOVE, this.onMove, this);
        director.on(GameEvent.PLAYER_BODY_STOP, this.onStop, this);
        director.on(GameEvent.PLAYER_ATTACK, this.onAttack, this);
        director.on(PlayerStat.PLAYER_ATK_UPDATE, this.onAtkUpgrade, this);
        director.on(PlayerStat.PLAYER_HP_UPDATE, this.onHpUpgrade, this);
        //
        director.on(PlayerSkill.PLAYER_SKILL_SLASH, this.onPlayerSkillSlash, this);
        //
        let colliders = this.getComponents(Collider2D);
        colliders.forEach(c => {
            c.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        });
    }

    protected start(): void {
        this.spine.SetFaceR();
        //
        this.atkBase = 1;
        this.hpBase = this.health.GetHealthBase();
    }

    //

    private onMove(): void {
        if (this.isDead)
            return;
        //
        this.spine.SetAnim(this.animMove, true);
        //
        this.stageAttack = false;
    }

    private onStop(): void {
        this.unscheduleAllCallbacks();
        //
        if (this.isDead)
            return;
        //
        this.spine.SetAnim(this.animIdle, true);
        //
        this.stageAttack = false;
    }

    private onAttack(): void {
        if (this.isDead)
            return;
        //
        this.stageAttack = true;
        this.animAttackFirst = true;
        //
        this.SetAttack();
    }

    private onAtkUpgrade(): void {
        //...
    }

    private onHpUpgrade(): void {
        this.health.SetHealthBaseAdd(1);
        this.health.SetHealthAdd(this.health.GetHealthBase() * 0.25);
    }

    //

    private SetAttack(): void {

        if (this.isDead)
            return;
        //
        if (!this.stageAttack)
            return;
        //
        var Delay = this.spine.SetAnim(this.animAttackFirst ? this.animAttack1 : this.animAttack2, false);
        this.animAttackFirst = !this.animAttackFirst;
        this.shoot.SetShootDirection(v2(1, 0));
        this.scheduleOnce(() => this.SetAttack(), Delay);
    }

    private SetDead(): void {
        this.isDead = true;
        this.spine.SetAnim(this.animDead, false);
        director.emit(GameEvent.PLAYER_DEAD);
    }

    //

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this.isDead)
            return;
        //
        if (selfCollider.tag == GameTag.PLAYER) {
            switch (otherCollider.tag) {
                case GameTag.MONSTER_BULLET:
                    //console.log("[Player] Hit " + this.health.GetHealth() + '/' + this.health.GetHealthBase());
                    //
                    this.health.SetHealthAdd(-1);
                    //
                    if (this.health.GetHealth() <= 0)
                        this.SetDead();
                    break;
            }
        }
    }

    //

    private onPlayerSkillSlash(Active: boolean): void {
        if (!Active)
            //NOTE: This methode only called when Active value is TRUE, because FALSE is called by this!
            return;
        //
        this.unscheduleAllCallbacks();
        this.stageAttack = false;
        this.spine.SetAnim(this.animIdle, true);
        this.scheduleOnce(() => {
            var DelayReady = this.spine.SetAnim(this.animSkillSlashReady, false);
            this.scheduleOnce(() => {
                this.spineSlash.node.active = true;
                this.spineSlash.SetAnimForce('apear', false);
                this.scheduleOnce(() => {
                    this.SetPlayerSkillSlashSingle();
                }, 0.25);
            }, DelayReady);
        }, 0.15);
    }

    private SetPlayerSkillSlashSingle(Counter: number = 0): void {
        var Player = this.spine.spine.node;
        //
        if (Counter > GameManager.instance.waveMonster.length - 1) {
            Player.setPosition(Vec3.ZERO);
            this.spine.SetAnim(this.animIdle, true);
            this.scheduleOnce(() => {
                //NOTE: Not change this group of code, because SPINE and BULLET must called first before end SLASH!
                director.emit(BaseSpine.SPINE_PLAY);
                director.emit(BaseBullet.BULLET_MOVE);
                director.emit(PlayerSkill.PLAYER_SKILL_SLASH, false);
                //
            }, 0.15);
            return;
        }
        //
        var Monster = GameManager.instance.waveMonster[Counter];
        //
        var PlayerSpinePosition = v3(0, 0, 0);
        PlayerSpinePosition.x = Monster.position.x - this.node.position.x - 100;
        PlayerSpinePosition.y = Monster.position.y - this.node.position.y;
        Player.setPosition(PlayerSpinePosition);
        //
        var DelayTeleport = this.spine.SetAnim(Counter % 2 == 0 ? this.animSkillSlash1 : this.animSkillSlash2, false);
        this.scheduleOnce(() => {
            this.SetPlayerSkillSlashSingle(Counter + 1);
        }, DelayTeleport);
    }
}