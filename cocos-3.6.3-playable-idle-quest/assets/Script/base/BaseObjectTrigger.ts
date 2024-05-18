import { _decorator, CCBoolean, Collider2D, Component, Contact2DType, director, IPhysics2DContact, Node, RigidBody2D } from 'cc';
import { BasePlayer } from './BasePlayer';
const { ccclass, property } = _decorator;

@ccclass('BaseObjectTrigger')
export class BaseObjectTrigger extends Component {

    static OBJECT_TRIGGER: string = 'OBJECT_TRIGGER';

    @property(CCBoolean)
    mutiTrigger: boolean = false;

    m_playerTrigger: number = 0;

    onLoad() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        switch (otherCollider.tag) {
            case 100://player
                this.m_playerTrigger++;
                if (!this.mutiTrigger && this.m_playerTrigger > 1)
                    return;
                director.emit(BaseObjectTrigger.OBJECT_TRIGGER, this, true);
                break;
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        switch (otherCollider.tag) {
            case 100://player
                this.m_playerTrigger--;
                if (!this.mutiTrigger && this.m_playerTrigger > 0)
                    return;
                director.emit(BaseObjectTrigger.OBJECT_TRIGGER, this, false);
                break;
        }
    }
}