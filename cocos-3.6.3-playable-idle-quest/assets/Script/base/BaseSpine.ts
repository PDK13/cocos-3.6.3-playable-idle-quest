import { _decorator, CCBoolean, Component, director, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseSpine')
export class BaseSpine extends Component {

    static SPINE_PLAY: string = 'SPINE_PLAY';
    static SPINE_STOP: string = 'SPINE_STOP';

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(CCBoolean)
    spineEvent: boolean = false;

    spineScaleXR: number;
    spineAnim: string = '';
    spineAnimDuration: number = 0;
    spineAnimDurationScale: number = 0;
    spineTimeScale: number = 1;

    public SpineInfiniteLoop: boolean = true;

    protected onLoad(): void {
        this.spineScaleXR = this.spine._skeleton.scaleX;
        this.spineTimeScale = this.spine.timeScale;
        //
        if (this.spineEvent) {
            director.on(BaseSpine.SPINE_PLAY, this.onPlay, this);
            director.on(BaseSpine.SPINE_STOP, this.onStop, this);
        }
    }

    //

    public onPlay(): void {
        this.spine.timeScale = this.spineTimeScale;
    }

    public onStop(): void {
        this.spine.timeScale = 0;
    }

    //

    public SetAnim(Anim: string, Loop: boolean, DurationScale: boolean = false): number {
        if (this.spineAnim == Anim)
            return DurationScale ? this.spineAnimDuration : this.spineAnimDurationScale;
        this.spineAnim = Anim;
        this.spineAnimDuration = this.spine.setAnimation(0, Anim, Loop).animationEnd;
        this.spineAnimDurationScale = this.spineAnimDuration / this.spine.timeScale;
        return DurationScale ? this.spineAnimDuration : this.spineAnimDurationScale;
    }

    public SetAnimForce(Anim: string, Loop: boolean, DurationScale: boolean = false): number {
        this.spineAnim = Anim;
        this.spineAnimDuration = this.spine.setAnimation(0, Anim, Loop).animationEnd;
        this.spineAnimDurationScale = this.spineAnimDuration / this.spine.timeScale;
        return DurationScale ? this.spineAnimDuration : this.spineAnimDurationScale;
    }

    public GetAnim(): string {
        return this.spineAnim;
    }

    public GetAnimDuration(): number {
        return this.spineAnimDuration;
    }

    public GetAnimDurationScale(): number {
        return this.spineAnimDurationScale;
    }

    public SetAnimInfiniteLoop(Anim1: string, Anim2: string, DurationScale: boolean = false, Anim1First: boolean = true) {
        if (!this.SpineInfiniteLoop)
            //NOTE: IF WANT TO STOP CURRENT AND START NEW, SET THIS VALUE TO FALSE FIRST!
            return;
        //WARNING: AFTER USE THIS METHODE, INFINITE LOOP WILL BE OCCUR!
        this.scheduleOnce(() => {
            this.SetAnimInfiniteLoop(Anim1, Anim2, DurationScale, !Anim1First)
        }, this.SetAnim(Anim1First ? Anim1 : Anim2, false, DurationScale));
    }

    public SetTimeScale(TimeScale: number = 1) {
        this.spineTimeScale = TimeScale;
        this.spine.timeScale = TimeScale;
    }

    //

    public SetFaceL() {
        this.spine._skeleton.scaleX = -this.spineScaleXR;
    }

    public SetFaceR() {
        this.spine._skeleton.scaleX = this.spineScaleXR;
    }

    public SetFace(ScaleX: number) {
        this.spine._skeleton.scaleX = ScaleX;
    }

    public GetFace() {
        return this.spine._skeleton.scaleX;
    }
}