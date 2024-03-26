import { _decorator, CCBoolean, CCFloat, CCInteger, CCString, Collider2D, Component, Contact2DType, director, ERigidBody2DType, IPhysics2DContact, Node, RigidBody2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseBullet')
export class BaseBullet extends Component {

    static BULLET_MOVE: string = 'BULLET_MOVE';
    static BULLET_STOP: string = 'BULLET_STOP';

    @property(CCBoolean)
    bulletEvent: boolean = false;

    @property(CCBoolean)
    destroyOnContact: boolean = true;

    @property(CCInteger)
    contactSelf: number = 0;

    @property(CCInteger)
    contactOther: number = 0;

    @property(CCFloat)
    destroyAfterDuration: number = 10;

    rigidbody: RigidBody2D = null;

    isDestroy: boolean = false;
    bodyType: ERigidBody2DType = ERigidBody2DType.Dynamic;
    velocityMove: Vec2 = Vec2.ZERO;

    protected onLoad(): void {
        this.rigidbody = this.getComponent(RigidBody2D);
        //
        let colliders = this.getComponents(Collider2D);
        colliders.forEach(c => {
            c.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        })
        //
        if (this.bulletEvent) {
            director.on(BaseBullet.BULLET_MOVE, this.onMove, this);
            director.on(BaseBullet.BULLET_STOP, this.onStop, this);
        }
        //
        this.bodyType = this.rigidbody.type;
    }

    protected start(): void {
        if (this.destroyAfterDuration > 0)
            this.scheduleOnce(() => this.isDestroy = true, this.destroyAfterDuration);
    }

    protected lateUpdate(dt: number): void {
        if (this.isDestroy) {
            //BUG: When called destroy on contact, it make an error, don't fixed this script code!
            this.node.destroy();
            //console.log('[Bullet] ' + this.node.name + ' destroy!');
        }
        //
        if (this.rigidbody.type.valueOf() != this.bodyType.valueOf()) {
            //BUG: When called change body type on rigidbody, it make an error, don't fixed this script!
            this.rigidbody.type = this.bodyType;
            this.rigidbody.linearVelocity = this.velocityMove;
            //console.log('[Bullet] ' + this.node.name + ' body ' + this.rigidbody.type.toString());
        }
    }

    //

    public onMove(): void {
        this.bodyType = ERigidBody2DType.Dynamic;
    }

    public onStop(): void {
        this.bodyType = ERigidBody2DType.Static;

    }

    public onDestroy(): void {
        this.rigidbody.linearVelocity = Vec2.ZERO;
        this.isDestroy = true;
    }

    //

    public SetRigidbody(): void {
        this.rigidbody = this.getComponent(RigidBody2D);
    }

    public SetVelocity(Velocity: Vec2): void {
        this.velocityMove = Velocity;
        this.rigidbody.linearVelocity = Velocity;
    }

    //

    protected onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this.isDestroy)
            return;
        //
        if (!this.destroyOnContact)
            return;
        //
        if (selfCollider.tag == this.contactSelf && otherCollider.tag == this.contactOther)
            this.onDestroy();
    }
}