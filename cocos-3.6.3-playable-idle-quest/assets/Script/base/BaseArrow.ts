import { _decorator, CCFloat, Component, director, Node, v3, Vec3 } from 'cc';
import GameEvent from '../GameEvent';
import CameraMovement from '../game/CameraMovement';
import { BasePlayer } from './BasePlayer';
const { ccclass, property } = _decorator;

@ccclass('BaseArrow')
export class BaseArrow extends Component {
    @property(CCFloat)
    offsetPosY: number = 40;

    @property([BasePlayer])
    Player: BasePlayer[] = [];

    @property([Node])
    Arrow: Node[] = [];

    @property([Node])
    UI: Node[] = [];

    @property(CameraMovement)
    camera: CameraMovement = null;

    playerCurrent: BasePlayer = null;
    arrowCurrent: Node = null;
    uiCurrent: Node = null;

    start() {
        this.playerCurrent = this.Player[0];
        this.arrowCurrent = this.Arrow[0];
        this.uiCurrent = this.UI[0];
        //
        this.Player[0].Control
        for (let index = 1; index < this.Player.length; index++)
            this.Player[index].Control = false;
        //
        this.Arrow[0].active = true;
        for (let index = 1; index < this.Arrow.length; index++)
            this.Arrow[index].active = false;
        //
        this.UI[0].active = true;
        for (let index = 1; index < this.UI.length; index++)
            this.UI[index].active = false;
        //
        this.camera.onTargetSwitch(this.playerCurrent.node);
        //
        director.on(GameEvent.PLAYER_SWITCH, this.onSwitch, this);
    }

    lateUpdate(deltaTime: number) {
        if (this.playerCurrent == null)
            return;
        var PosCurrent = this.playerCurrent.node.worldPosition;
        PosCurrent.add(v3(0, this.offsetPosY, 0));
        this.node.worldPosition = PosCurrent;
    }

    //

    private onSwitch(SwitchIndex: number) {
        this.playerCurrent.Control = false;
        this.arrowCurrent.active = false;
        this.uiCurrent.active = false;
        //
        this.playerCurrent = this.Player[SwitchIndex];
        this.arrowCurrent = this.Arrow[SwitchIndex];
        this.uiCurrent = this.UI[SwitchIndex];
        //
        this.playerCurrent.Control = true;
        this.arrowCurrent.active = true;
        this.uiCurrent.active = true;
        //
        this.camera.onTargetSwitch(this.playerCurrent.node);
    }
}