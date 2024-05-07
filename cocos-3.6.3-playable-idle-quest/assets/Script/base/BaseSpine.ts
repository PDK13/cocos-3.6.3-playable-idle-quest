import { _decorator, CCBoolean, Component, director, sp } from 'cc';
const { ccclass, property } = _decorator;
const { spine } = sp;

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

    public SetSkin(...SkinMix: any[]) {
        let BaseSkin = new spine.Skin('base-char');
        let BaseData = this.spine._skeleton.data;
        //
        SkinMix.forEach(item => {
            BaseSkin.addSkin(BaseData.findSkin(item));
        });
        //
        this.spine._skeleton.setSkin(BaseSkin);
        this.spine._skeleton.setSlotsToSetupPose();
        this.spine.getState().apply(this.spine._skeleton);
    }

    //

    public onPlay(): void {
        this.spine.timeScale = this.spineTimeScale;
    }

    public onStop(): void {
        this.spine.timeScale = 0;
    }

    //

    public SetInitMix(AnimFrom: string, AnimTo: string, Duration: number) {
        //Setting mix between 2 animation in fixed duration!
        this.spine.setMix(AnimFrom, AnimTo, Duration);
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

    public SetAnimIndex(Index: number, Anim: string, Loop: boolean, DurationScale: boolean = false): number {
        let Duration = this.spine.setAnimation(Index, Anim, Loop).animationEnd;
        let Scale = DurationScale ? this.spine.timeScale : 1;
        return Duration / Scale;
    }

    public SetAnimEmty(Index: number, MixDuration: number) {
        this.spine.getState().setEmptyAnimation(Index, MixDuration);
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