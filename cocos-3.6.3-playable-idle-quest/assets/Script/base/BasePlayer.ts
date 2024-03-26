import { _decorator, Component, Node, RigidBody2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BasePlayer')
export class BasePlayer extends Component {

    @property(RigidBody2D)
    rigidbody: RigidBody2D = null;

    m_ratioSize: number;
    m_grounded: boolean = false;
    m_ignoreKnockBack: boolean = false;

    //
    
    get isBig() {
        return this.m_ratioSize > 1;
    }

    public get ignoreKnockBack() {
        return this.m_ignoreKnockBack;
    }

    addForceY(force: number) {
        let veloc = this.rigidbody.linearVelocity;
        veloc.y = force;
        this.rigidbody.linearVelocity = veloc;
        //
        this.m_grounded = false;
    }

    addForce(force: Vec2) {
        this.rigidbody.linearVelocity = force;
    }
}