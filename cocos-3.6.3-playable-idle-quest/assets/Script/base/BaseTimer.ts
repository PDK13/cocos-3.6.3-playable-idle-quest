import { _decorator, Animation, CCBoolean, CCFloat, CCString, Color, Component, director, easing, Label, math, Node, tween, UITransform, v2, v3, Vec2 } from 'cc';
import GameEvent from '../GameEvent';
const { ccclass, property } = _decorator;

@ccclass('BaseTimer')
export class BaseTimer extends Component {

    @property(CCFloat)
    duration: number = 15;

    @property(CCFloat)
    warning: number = 10;

    current: number = 0;

    @property(CCBoolean)
    onActive: boolean = false;

    @property(CCBoolean)
    onWarning: boolean = true;

    @property(Label)
    labelTime: Label = null;

    @property(UITransform)
    maskBar: UITransform = null;

    @property(Node)
    pointerBar: Node = null;

    @property([Animation])
    warningAnim: Animation[] = [];

    active: boolean = false;
    finish: boolean = false;
    maskSizeXFull: number = 0;

    protected onLoad(): void {
        this.current = this.duration;
        this.maskSizeXFull = this.maskBar.contentSize.x;
        //
        this.pointerBar.setPosition(v3(this.maskSizeXFull / 2, this.pointerBar.position.y, this.pointerBar.position.z))
    }

    protected start(): void {
        if (this.onActive)
            this.SetTimeStart();
    }

    //

    public SetTimeStart(): void {
        if (this.active)
            return;
        this.active = true;
        //
        this.SetTimeBar();
        this.SetTimeCountdown();
    }

    private SetTimeBar(): void {
        this.pointerBar.setPosition(v3(this.maskSizeXFull / 2, this.pointerBar.position.y, this.pointerBar.position.z))
        tween(this.pointerBar)
            .to(this.duration, { position: v3(-this.maskSizeXFull / 2, this.pointerBar.position.y, this.pointerBar.position.z) }, {
                onUpdate: () => {
                    let Size = v2();
                    Size.x = this.pointerBar.position.x + (this.maskSizeXFull / 2);
                    Size.y = this.maskBar.contentSize.y;
                    this.maskBar.setContentSize(math.size(Size.x, Size.y));
                },
                onComplete: () => {
                    director.emit(GameEvent.GAME_STORE);
                },
                easing: 'linear'
            })
            .start();
    }

    private SetTimeCountdown() {
        if (this.finish)
            return;
        //
        if (this.onWarning && this.current.valueOf() == this.warning) {
            this.labelTime.color = Color.RED;
            this.warningAnim.forEach(item => {
                item.play();
            });
        }
        //
        this.labelTime.string = this.current.toString() + "s";
        //
        this.current = this.current.valueOf() - 1;
        if (this.current.valueOf() > 0)
            this.scheduleOnce(() => this.SetTimeCountdown(), 1);
    }
}