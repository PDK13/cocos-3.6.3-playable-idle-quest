import { _decorator, Component, Node, CCFloat, view, screen, Vec3, AudioSource, CCBoolean, Camera, Tween, Vec2, director, tween, v2, v3, Size, Rect } from 'cc';
import GameEvent from '../GameEvent';
import { BackgroundParallax } from './BackgroundParallax';
const { ccclass, property } = _decorator;

@ccclass('CameraMovement')
export default class CameraMovement extends Component {

    @property(CCBoolean)
    lockX: boolean = false;

    @property(CCBoolean)
    lockY: boolean = false;

    @property(CCFloat)
    smoothTime = 0.1;

    @property(Vec2)
    offset: Vec2 = v2(0, 0);

    //

    @property(CCBoolean)
    othorScreen: boolean = true;

    @property(CCFloat)
    othorLandscape: number = 1;

    @property(CCFloat)
    othorPortrait: number = 2.5;

    //

    @property(CCBoolean)
    rectScreen: boolean = false;

    @property(Rect)
    rectLandScape: Rect = new Rect(0, 0, 1, 1);

    @property(Rect)
    rectPortrait: Rect = new Rect(0, 0.25, 1, 0.5);

    //

    @property(CCBoolean)
    limit: boolean = false;

    @property(Vec2)
    limitMax: Vec2 = v2(1000, 1000);

    @property(Vec2)
    limitMin: Vec2 = v2(-1000, -1000);

    //

    @property(CCBoolean)
    paralax: boolean = true;

    @property(Node)
    background: Node | null = null;

    @property(Node)
    player: Node | null = null;

    //

    m_camera: Camera = null;
    m_orthoHeight: number = 0;
    m_parallaxes: BackgroundParallax[] = [];
    m_lock: Vec3;
    m_target: Vec3;
    m_stop: boolean = false;
    m_finishPos: Vec3;
    //m_targetY: number = 0;
    m_syncY: boolean = false;

    onLoad() {
        director.on(GameEvent.PLAYER_STOP, this.onFinish, this);
        director.on(GameEvent.PLAYER_X4, this.onPlayerX4, this);
        //director.on(GameEvent.PLAYER_GROUND, this.onPlayerGround, this);
        director.on(GameEvent.PLAYER_BUBBLE, this.onPlayerBubble, this);
        director.on(GameEvent.PLAYER_NORMAL, this.onPlayerNormal, this);
        director.on(GameEvent.PLAYER_FLAG, this.onPlayerFlag, this);
        //
        if (this.m_camera == null)
            this.m_camera = this.getComponent(Camera);
        this.m_orthoHeight = this.m_camera.orthoHeight.valueOf();
        //
        if (this.paralax)
            this.m_parallaxes = this.getComponentsInChildren(BackgroundParallax);
        //
        if (this.lockX || this.lockY)
            this.m_lock = this.node.worldPosition.clone();
    }

    start() {
        //NOTE: This event must add from Start to get event!
        view.on('canvas-resize', () => {
            this.onCanvasResize(false);
            this.onUpdateBackground();
        });
        this.onCanvasResize(true);
        this.onUpdateBackground();
        //
        this.m_target = this.node.worldPosition.clone();
    }

    lateUpdate(dt: number) {
        if (this.player != null) {
            let target = v3();
            if (this.m_stop) {
                target = this.m_finishPos;
                this.m_target = this.m_target.lerp(target, this.smoothTime);
                this.node.worldPosition = this.m_target;
            }
            else {
                target = this.player.worldPosition.clone();
                //
                //if (this.m_syncY)
                //    this.m_targetY = target.y;
                //else {
                //    if ((this.m_targetY - target.y) > 100)
                //        this.m_targetY = target.y;
                //    target.y = this.m_targetY + 300;
                //}
                //
                //LOCK:
                if (this.lockX)
                    target.x = this.m_lock.x;
                if (this.lockY)
                    target.y = this.m_lock.y;
                //
                //LIMIT:
                if (this.limit) {
                    if (target.x > this.limitMax.x)
                        target.x = this.limitMax.x;
                    else
                        if (target.x < this.limitMin.x)
                            target.x = this.limitMin.x;

                    if (target.y > this.limitMax.y)
                        target.y = this.limitMax.y;
                    else
                        if (target.y < this.limitMin.y)
                            target.y = this.limitMin.y;
                }
                //
                target.x += this.offset.x;
                target.y += this.offset.y;
                //
                this.m_target = this.m_target.lerp(target, this.smoothTime);
                this.node.worldPosition = this.m_target;
            }
        }
        //
        if (this.paralax) {
            this.m_parallaxes.forEach(element => {
                element.excute();
            });
        }
    }

    onCanvasResize(Force: Boolean) {
        if (!this.othorScreen && !this.rectScreen)
            return;
        //
        const screenSize = screen.windowSize;
        const viewScaleX = view.getScaleX();
        const viewScaleY = view.getScaleY();
        let w = screenSize.width / viewScaleX;
        let h = screenSize.height / viewScaleY;
        //
        if (w < h) {
            //Portrait
            if (this.othorScreen)
                this.m_camera.orthoHeight = this.m_orthoHeight * this.othorPortrait;
            if (this.rectScreen)
                this.m_camera.rect = this.rectPortrait;
        }
        else {
            //Landscape
            if (this.othorScreen)
                this.m_camera.orthoHeight = this.m_orthoHeight * this.othorLandscape;
            if (this.rectScreen)
                this.m_camera.rect = this.rectLandScape;
        }
    }

    onUpdateBackground() {
        if (this.background == null)
            return;
        let ratio = 540 / this.m_camera.orthoHeight;
        this.background.scale = new Vec3(2 / ratio, 2 / ratio, 1);
    }

    onPlayerFlag() {
        Tween.stopAllByTarget(this.node);
        this.node.eulerAngles = v3();
        if (this.getComponent(AudioSource) != null)
            this.getComponent(AudioSource).stop();
    }

    onFinish(position: Vec3) {
        this.m_stop = true;
        this.m_finishPos = position.clone();
        this.m_target = this.node.worldPosition;
        Tween.stopAllByTarget(this.node);
        this.node.eulerAngles = v3();
        if (this.getComponent(AudioSource) != null)
            this.getComponent(AudioSource).stop();
    }

    onPlayerX4(active: boolean) {
        if (active) {
            let rotate1 = tween(this.node).to(0.025, { eulerAngles: v3(0, 0, 0.5) });
            let rotate2 = tween(this.node).to(0.025, { eulerAngles: v3(0, 0, -0.5) });
            tween(this.node).sequence(rotate1, rotate2).repeatForever().start();
        }
    }

    onPlayerGround(targetY: number) {
        //this.m_targetY = targetY;
    }

    onPlayerBubble() {
        this.m_syncY = true;
    }

    onPlayerNormal() {
        this.m_syncY = false;
    }

    onTargetSwitch(target: Node) {
        this.player = target;
    }
}
