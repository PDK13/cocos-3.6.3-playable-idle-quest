import { _decorator, CCBoolean, Collider2D, Component, Node, RigidBody2D, sp, Tween, tween, v3, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseObject')
export class BaseObject extends Component {

    onTweenKillAll() {
        Tween.stopAllByTarget(this.node);
    }

    //

    onPosV2(Pos: Vec2, PosAdd: Vec2 = new Vec2(0, 0)) {
        this.node.position = v3(Pos.x + PosAdd.x, Pos.y + PosAdd.y, this.node.position.z);
    }

    onPosV3(Pos: Vec3, PosAdd: Vec3 = new Vec3(0, 0, 0)) {
        this.node.position = v3(Pos.x + PosAdd.x, Pos.y + PosAdd.y, this.node.position.z);
    }

    onTweenMove(Pos: Vec2, Duration: number, Delay: number = 0, Option: object = { easing: 'linear' }): Tween<Node> {
        return tween(this.node)
            .delay(Delay)
            .to(Duration, { position: v3(Pos.x, Pos.y, this.node.position.z) }, Option)
            .start();
    }

    //

    onRotate(Rotate: number) {
        this.node.setRotationFromEuler(v3(0, 0, Rotate));
    }

    onTweenRotate(Rotate: number, Duration: number, Delay: number = 0, Count: number, Option: object = { easing: 'linear' }): Tween<Node> {
        return tween(this.node)
            .delay(Delay)
            .to(Duration, { eulerAngles: v3(0, 0, Rotate) }, Option)
            .repeat(Count)
            .start();
    }

    onTweenRotateLoop(Rotate: number, Duration: number, Delay: number = 0, Option: object = { easing: 'linear' }): Tween<Node> {
        let RotatePrimary = this.node.eulerAngles.clone();
        return tween(this.node)
            .delay(Delay)
            .to(Duration, { eulerAngles: v3(0, 0, Rotate) }, Option)
            .call(() => this.node.setRotationFromEuler(RotatePrimary))
            .call(() => this.onTweenRotateLoop(Rotate, Duration, Delay, Option))
            .start();
    }

    //

    onScale(Scale: number) {
        let Colliders = this.getComponents(Collider2D);
        this.node.scale.set(this.node.scale.clone().multiplyScalar(Scale));
        Colliders.forEach(c => {
            c.apply();
        });
    }

    onTweenScale(Scale: number, Duration: number, Delay: number = 0, Option: object = { easing: 'linear' }): Tween<Node> {
        let BaseScale: Vec3 = Vec3.ONE;
        let Colliders = this.getComponents(Collider2D);
        return tween(this.node)
            .delay(Delay)
            .to(Duration, { scale: BaseScale.clone().multiplyScalar(Scale) }, Option)
            .call(() => {
                Colliders.forEach(c => {
                    c.apply();
                });
            })
            .start();
    }
}