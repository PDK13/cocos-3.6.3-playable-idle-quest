import { _decorator, Component, Node, sp, tween, v3, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseObject')
export class BaseObject extends Component {
    
    public SetPosV2(Pos: Vec2, PosAdd: Vec2 = new Vec2(0, 0)) {
        this.node.position = v3(Pos.x + PosAdd.x, Pos.y + PosAdd.y, this.node.position.z);
    }

    public SetPosV3(Pos: Vec3, PosAdd: Vec2 = new Vec2(0, 0)) {
        this.node.position = v3(Pos.x + PosAdd.x, Pos.y + PosAdd.y, this.node.position.z);
    }

    public SetMove(Pos: Vec2, Duration: number, Delay: number, Option: object = { easing: 'linear' }) {
        tween(this.node)
            .delay(Delay)
            .to(Duration, { position: v3(Pos.x, Pos.y, this.node.position.z) }, Option)
            .start();
    }
}