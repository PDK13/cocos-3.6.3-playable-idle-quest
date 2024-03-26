import { _decorator, CCFloat, Component, instantiate, Node, RigidBody2D, v2, v3, Vec2 } from 'cc';
import { BaseBullet } from './BaseBullet';
const { ccclass, property } = _decorator;

@ccclass('BaseShoot')
export class BaseShoot extends Component {

    @property(RigidBody2D)
    bullet: RigidBody2D = null;

    @property(CCFloat)
    bulletRotate: number = 180;

    @property(CCFloat)
    bulletSpeed: number = 5;

    public SetShootTarget(Target: Node): void {
        var Bullet = instantiate(this.bullet.node);
        //
        Bullet.active = true;
        //
        Bullet.setParent(this.node.parent);
        Bullet.setPosition(v3(
            this.node.position.clone().x + this.bullet.node.position.clone().x,
            this.node.position.clone().y + this.bullet.node.position.clone().y,
            0));
        //
        var BulletVelocity = v2(
            Target.position.x - Bullet.position.x,
            Target.position.y - Bullet.position.y + 100,
        ).normalize();
        //
        var BulletRotate = Math.atan2(BulletVelocity.y, BulletVelocity.x) * 57.29578 + this.bulletRotate;
        Bullet.setRotationFromEuler(v3(0, 0, BulletRotate));
        //
        BulletVelocity.x *= this.bulletSpeed;
        BulletVelocity.y *= this.bulletSpeed;
        //
        var BulletBase = Bullet.getComponent(BaseBullet);
        if (BulletBase != null) {
            BulletBase.SetRigidbody();
            BulletBase.SetVelocity(BulletVelocity);
        }
        else
            Bullet.getComponent(RigidBody2D).linearVelocity = BulletVelocity;
    }

    public SetShootDirection(Direction: Vec2): void {
        var Bullet = instantiate(this.bullet.node);
        //
        Bullet.active = true;
        //
        Bullet.setParent(this.node.parent);
        Bullet.setPosition(v3(
            this.node.position.clone().x + this.bullet.node.position.clone().x,
            this.node.position.clone().y + this.bullet.node.position.clone().y,
            0));
        //
        var BulletVelocity = Direction.normalize();
        //
        var BulletRotate = Math.atan2(BulletVelocity.y, BulletVelocity.x) * 57.29578 + this.bulletRotate;
        Bullet.setRotationFromEuler(v3(0, 0, BulletRotate));
        //
        BulletVelocity.x *= this.bulletSpeed;
        BulletVelocity.y *= this.bulletSpeed;
        //
        var BulletBase = Bullet.getComponent(BaseBullet);
        if (BulletBase != null) {
            BulletBase.SetRigidbody();
            BulletBase.SetVelocity(BulletVelocity);
        }
        else
            Bullet.getComponent(RigidBody2D).linearVelocity = BulletVelocity;
    }
}