import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
import { BaseBullet } from './BaseBullet';
const { ccclass, property } = _decorator;

@ccclass('BaseBulletDestroyer')
export class BaseBulletDestroyer extends Component {
    protected onLoad(): void {
        let colliders = this.getComponents(Collider2D);
        colliders.forEach(c => {
            c.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        })
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        var Bullet = otherCollider.body.getComponent(BaseBullet);
        if (Bullet == null)
            return;
        Bullet.onDestroy();
    }
}