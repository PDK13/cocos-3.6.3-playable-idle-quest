import { _decorator, Collider2D, Component, Node, RigidBody2D, tween, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BasePlayer')
export class BasePlayer extends Component {

    protected m_control: boolean = true;

    get Control() { return this.m_control; }

    set Control(value: boolean) { this.m_control = value; }

    //

    m_x2: boolean = false;
    m_x4: boolean = false;

    onX2(Active: boolean) {
        this.m_x2 = Active;
        //
        if (this.m_x4)
            return;
        //
        let BaseScale: Vec3 = Vec3.ONE;
        let Ratio = Active ? 1.75 : 1;
        let Colliders = this.getComponents(Collider2D);
        setTimeout(() => {
            tween(this.node).to(0.25, { scale: BaseScale.clone().multiplyScalar(Ratio) }).call(() => {
                Colliders.forEach(c => {
                    c.apply();
                });
            }).start();
        }, 1);
    }

    onX4(Active: boolean) {
        this.m_x4 = Active;
        //
        if (!Active && this.m_x2) {
            this.onX2(true);
            return;
        }
        //
        let BaseScale: Vec3 = Vec3.ONE;
        let Ratio = Active ? 4 : 1;
        let Colliders = this.getComponents(Collider2D);
        setTimeout(() => {
            tween(this.node).to(0.25, { scale: BaseScale.clone().multiplyScalar(Ratio) }).call(() => {
                Colliders.forEach(c => {
                    c.apply();
                });
            }).start();
        }, 1);
    }
}