import { _decorator, CCFloat, Component, director, Node, RigidBody2D, tween, v3 } from 'cc';
import { BaseObjectTrigger } from './BaseObjectTrigger';
import { BaseObject } from './BaseObject';
const { ccclass, property } = _decorator;

@ccclass('BaseObjectTriggerPress')
export class BaseObjectTriggerPress extends Component {

    @property(BaseObjectTrigger)
    pressTrigger: BaseObjectTrigger = null;

    @property(Node)
    pressButton: Node = null;

    @property(CCFloat)
    pressOffsetY: number = 20;

    @property(CCFloat)
    pressDuration: number = 0.2;

    m_startX: number;
    m_startZ: number;
    m_startY: number;
    m_endY: number;

    protected start(): void {
        this.m_startX = this.pressButton.position.clone().x;
        this.m_startZ = this.pressButton.position.clone().z;
        this.m_startY = this.pressButton.position.clone().y;
        this.m_endY = this.m_startY - this.pressOffsetY;

        if (this.pressTrigger != null)
            director.on(BaseObjectTrigger.OBJECT_TRIGGER, this.onTriggerPress, this);
    }

    onTriggerPress(ObjectTrigger: BaseObjectTrigger, Stage: boolean) {
        if (this.pressTrigger != ObjectTrigger)
            return;
        this.onPress(Stage);
    }

    onPress(Stage: boolean) {
        if (Stage) {
            tween(this.pressButton)
                .to(this.pressDuration, { position: v3(this.m_startX, this.m_endY, this.m_startZ) }, { easing: 'linear' })
                .start();
        }
        else {
            tween(this.pressButton)
                .to(this.pressDuration, { position: v3(this.m_startX, this.m_startY, this.m_startZ) }, { easing: 'linear' })
                .start();
        }
    }
}