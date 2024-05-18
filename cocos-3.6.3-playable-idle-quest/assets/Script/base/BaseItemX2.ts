import { _decorator, Collider2D, Component, Contact2DType, director, IPhysics2DContact, Node, RigidBody2D } from 'cc';
import { BasePlayer } from './BasePlayer';
const { ccclass, property } = _decorator;

@ccclass('BaseItemX2')
export class BaseItemX2 extends Component {

    m_stop: boolean = false;

    onLoad() {
        let collider = this.getComponent(Collider2D);
        if (collider)
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this.m_stop)
            return;
        switch (otherCollider.tag) {
            case 100://player     
                this.m_stop = true;
                setTimeout(() => {
                    otherCollider.getComponent(BasePlayer).onX2(true);
                    this.getComponent(RigidBody2D).sleep();
                    this.node.destroy();
                }, 1);
                break;
        }
    }
}