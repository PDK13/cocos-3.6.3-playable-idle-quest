import { _decorator, Component, Node, sp, Tween, tween, v3, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseObject')
export class BaseObject extends Component {

    public SetTweenKillAll() {
        Tween.stopAllByTarget(this.node);
    }

    //

    public SetPosV2(Pos: Vec2, PosAdd: Vec2 = new Vec2(0, 0)) {
        this.node.position = v3(Pos.x + PosAdd.x, Pos.y + PosAdd.y, this.node.position.z);
    }

    public SetPosV3(Pos: Vec3, PosAdd: Vec3 = new Vec3(0, 0, 0)) {
        this.node.position = v3(Pos.x + PosAdd.x, Pos.y + PosAdd.y, this.node.position.z);
    }

    public SetTweenMove(Pos: Vec2, Duration: number, Delay: number, Option: object = { easing: 'linear' }): Tween<Node> {
        return tween(this.node)
            .delay(Delay)
            .to(Duration, { position: v3(Pos.x, Pos.y, this.node.position.z) }, Option)
            .start();
    }

    //

    public SetRotate(Rotate: number) {
        this.node.setRotationFromEuler(v3(0, 0, Rotate));
    }

    public SetTweenRotate(Rotate: number, Duration: number, Delay: number, Count: number, Option: object = { easing: 'linear' }): Tween<Node> {
        return tween(this.node)
            .delay(Delay)
            .to(Duration, { eulerAngles: v3(0, 0, Rotate) }, Option)
            .repeat(Count)
            .start();
    }

    public SetTweenRotateLoop(Rotate: number, Duration: number, Delay: number, Option: object = { easing: 'linear' }): Tween<Node> {
        let RotatePrimary = this.node.eulerAngles.clone();
        return tween(this.node)
            .delay(Delay)
            .to(Duration, { eulerAngles: v3(0, 0, Rotate) }, Option)
            .call(() => this.node.setRotationFromEuler(RotatePrimary))
            .call(() => this.SetTweenRotateLoop(Rotate, Duration, Delay, Option))
            .start();
    }
}