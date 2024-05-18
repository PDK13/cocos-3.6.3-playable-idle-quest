import { _decorator, Collider2D, Component, Contact2DType, director, IPhysics2DContact, Node } from 'cc';
import { BaseObjectTrigger } from './BaseObjectTrigger';
import GameEvent from '../GameEvent';
const { ccclass, property } = _decorator;

@ccclass('BaseFinish')
export class BaseFinish extends Component {

    protected start(): void {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        switch (otherCollider.tag) {
            case 100://player
                director.emit(GameEvent.PLAYER_STOP, this.node.worldPosition.clone());
                break;
        }
    }
}