import { _decorator, CCFloat, Collider2D, Component, director, Node, RigidBody2D, tween, Vec3 } from 'cc';
import { BaseObject } from './BaseObject';
import { BaseObjectTrigger } from './BaseObjectTrigger';
const { ccclass, property } = _decorator;

@ccclass('BaseObjectTriggerSpawm')
export class BaseObjectTriggerSpawm extends Component {

    @property(BaseObjectTrigger)
    spawmTrigger: BaseObjectTrigger = null;

    @property(CCFloat)
    spawmDuration: number = 0.5;

    m_spawm: boolean = false;

    m_object: BaseObject = null;
    m_rigidbody: RigidBody2D = null;

    protected start(): void {
        this.m_object = this.getComponent(BaseObject);
        this.m_rigidbody = this.getComponent(RigidBody2D);
        //
        this.m_object.onScale(0);
        if (this.m_rigidbody != null)
            this.m_rigidbody.sleep();
        //
        if (this.spawmTrigger != null)
            director.on(BaseObjectTrigger.OBJECT_TRIGGER, this.onTriggerSpawm, this);
    }

    onTriggerSpawm(ObjectTrigger: BaseObjectTrigger) {
        if (this.m_spawm)
            return;
        if (this.spawmTrigger != ObjectTrigger)
            return;
        this.onSpawm(this.spawmDuration);
    }

    onSpawm(Duration: number) {
        this.m_spawm = true;
        //
        let BaseScale: Vec3 = Vec3.ONE;
        let Colliders = this.getComponents(Collider2D);
        tween(this.node)
            .to(Duration, { scale: BaseScale.clone().multiplyScalar(1) }, { easing: 'linear' })
            .call(() => {
                Colliders.forEach(c => {
                    c.apply();
                });
            })
            .call(() => {
                if (this.m_rigidbody != null)
                    this.m_rigidbody.wakeUp();
            })
            .start();
    }
}