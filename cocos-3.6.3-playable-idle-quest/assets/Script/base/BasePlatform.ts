import { _decorator, CCInteger, CCString, Collider2D, Component, Contact2DType, director, IPhysics2DContact, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BasePlatform')
export class BasePlatform extends Component {

    //To use this script, object should have 2 type of collision: Collision and Trigger

    @property(CCInteger)
    ContactPlayer: number = 100;

    m_grounded: boolean = false;
    m_platform: Collider2D[] = [];

    start() {
        let colliders = this.getComponents(Collider2D);
        colliders.forEach(c => {
            if (c.sensor) {
                //Trigger Collider (Sensor) should bigger than Collision Collider (Non-Sensor)
                c.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
                c.on(Contact2DType.END_CONTACT, this.onEndContact, this);
            }
            else {
                this.m_platform.push(c);
                c.enabled = false;
            }
        });
        //Should add code to check which collision will affect to Player or Monster(s)
    }

    //

    onPlatformActive(Active: boolean) {
        this.m_platform.forEach(c => {
            c.enabled = Active;
        })
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == this.ContactPlayer) {
            if (otherCollider.node.worldPosition.y > this.node.worldPosition.y)
                this.onPlatformActive(true);
            else
                this.onPlatformActive(false);
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == this.ContactPlayer) {
            this.onPlatformActive(false);
        }
    }
}