import { _decorator, CCBoolean, Component, director, Input, Node, Sprite, tween } from 'cc';
import { BaseBullet } from '../base/BaseBullet';
import { BaseSpine } from '../base/BaseSpine';
import GameEvent from '../GameEvent';
const { ccclass, property } = _decorator;

@ccclass('PlayerSkill')
export class PlayerSkill extends Component {

    static PLAYER_SKILL_SLASH: string = 'PLAYER_SKILL_SLASH';

    @property(CCBoolean)
    directStore = false;

    @property(Node)
    btnSkillSlash: Node = null;

    protected onLoad(): void {
        director.on(GameEvent.PLAYER_DEAD, this.onPlayerDead, this);
        //
        if (!this.directStore) {
            this.btnSkillSlash.on(Input.EventType.TOUCH_START, this.onBtnSkillSlashPress, this);
            //
        }
        else {
            this.btnSkillSlash.on(Input.EventType.TOUCH_START, this.onDirectorStore, this);
            //
        }
    }

    protected start(): void {
        this.SetBtnDelay(1);
    }

    //

    private onDirectorStore(): void {
        director.emit(GameEvent.GAME_RETRY);
    }

    private onPlayerDead(): void {
        this.unscheduleAllCallbacks();
        this.btnSkillSlash.off(Input.EventType.TOUCH_START, this.onBtnSkillSlashPress, this);
    }

    //

    private SetBtnDelay(Duration: number = 15): void {
        this.btnSkillSlash.off(Input.EventType.TOUCH_START, this.onBtnSkillSlashPress, this);
        this.btnSkillSlash.getChildByName('spine-hand').active = false;
        //
        var LockSprite = this.btnSkillSlash.getChildByName('icon-lock').getComponent(Sprite);
        LockSprite.fillRange = 1;
        tween(LockSprite)
            .to(Duration, { fillRange: 0 }, { easing: 'linear' })
            .call(() => {
                this.btnSkillSlash.on(Input.EventType.TOUCH_START, this.onBtnSkillSlashPress, this);
                this.btnSkillSlash.getChildByName('spine-hand').active = true;
            })
            .start();
    }

    private onBtnSkillSlashPress(): void {
        director.emit(PlayerSkill.PLAYER_SKILL_SLASH, true);
        director.emit(BaseSpine.SPINE_STOP);
        director.emit(BaseBullet.BULLET_STOP);
        //
        this.SetBtnDelay(10);
    }
}