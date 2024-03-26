import { _decorator, Component, Node, EventTarget, input, Input, KeyCode, director, CCBoolean, Button } from 'cc';
import GameEvent from '../GameEvent';
import Loader from '../Loader';
const { ccclass, property } = _decorator;

@ccclass('PlayerInput')
export class PlayerInput extends Component {

    @property(CCBoolean)
    loop = false;

    @property(CCBoolean)
    directStore = false;

    @property(Node)
    buttonLeft: Node = null;

    @property(Node)
    buttonRight: Node = null;

    @property(Node)
    buttonJump: Node = null;

    @property(Node)
    buttonFire: Node = null;

    @property(Node)
    buttonSmashDown: Node = null;

    m_inputActive: boolean = false;
    m_keyLeftActive: boolean = false;
    m_keyRightActive: boolean = false;
    m_jumpActive: boolean = false;
    m_fireActive: boolean = false;

    onLoad() {
        if (this.directStore)
            return;
        if (this.loop) {
            this.buttonRight.getChildByName('hand').active = Loader.finish;
            if (Loader.finish)
                return;
        }
        input.on(Input.EventType.KEY_DOWN, this.onKeyPressed, this);
        input.on(Input.EventType.KEY_UP, this.onKeyReleased, this);
        //
        this.buttonJump.on(Input.EventType.TOUCH_START, this.onJumpStart, this);
        this.buttonJump.on(Input.EventType.TOUCH_END, this.onJumpEnd, this);
        this.buttonJump.on(Input.EventType.TOUCH_CANCEL, this.onJumpEnd, this);

        this.buttonLeft.on(Input.EventType.TOUCH_START, this.onLeftStart, this);
        this.buttonLeft.on(Input.EventType.TOUCH_END, this.onLeftEnd, this);
        this.buttonLeft.on(Input.EventType.TOUCH_CANCEL, this.onLeftEnd, this);

        this.buttonRight.on(Input.EventType.TOUCH_START, this.onRightStart, this);
        this.buttonRight.on(Input.EventType.TOUCH_END, this.onRightEnd, this);
        this.buttonRight.on(Input.EventType.TOUCH_CANCEL, this.onRightEnd, this);

        // this.buttonFire.on(Input.EventType.TOUCH_START, this.onFireStart, this);
        // this.buttonFire.on(Input.EventType.TOUCH_END, this.onFireEnd, this);
        // this.buttonFire.on(Input.EventType.TOUCH_CANCEL, this.onFireEnd, this);
    }

    onJumpStart() {
        this.m_jumpActive = true;
    }

    onJumpEnd() {
        this.m_jumpActive = false;
    }

    onFireStart() {
        this.m_fireActive = true;
    }

    onFireEnd() {
        this.m_fireActive = false;
        director.emit(GameEvent.PLAYER_FIRE, false);
    }

    onLeftStart() {
        this.m_keyLeftActive = true;
    }

    onLeftEnd() {
        this.m_keyLeftActive = false;
        if (!this.m_keyRightActive)
            director.emit(GameEvent.PLAYER_MOVE_STOP);
    }

    onRightStart() {
        this.m_keyRightActive = true;
    }

    onRightEnd() {
        this.m_keyRightActive = false;
        if (!this.m_keyLeftActive)
            director.emit(GameEvent.PLAYER_MOVE_STOP);
    }

    onKeyPressed(event) {
        let keyCode = event.keyCode;
        switch (keyCode) {
            case KeyCode.ARROW_LEFT:
                this.m_keyLeftActive = true;
                break;
            case KeyCode.ARROW_RIGHT:
                this.m_keyRightActive = true;
                break;
            case KeyCode.SPACE:
            case KeyCode.ARROW_UP:
                this.m_jumpActive = true;
                break;
            case KeyCode.KEY_S:
                this.m_fireActive = true;
                this.fireOnclick();
                break;
            case KeyCode.KEY_D:
                this.m_fireActive = true;
                this.smashDownOnClick();
                break;
        }
    }

    onKeyReleased(event) {
        let keyCode = event.keyCode;
        switch (keyCode) {
            case KeyCode.ARROW_LEFT:
                this.m_keyLeftActive = false;
                if (!this.m_keyRightActive)
                    director.emit(GameEvent.PLAYER_MOVE_STOP);
                break;
            case KeyCode.ARROW_RIGHT:
                this.m_keyRightActive = false;
                if (!this.m_keyLeftActive)
                    director.emit(GameEvent.PLAYER_MOVE_STOP);
                break;
            case KeyCode.SPACE:
            case KeyCode.ARROW_UP:
                this.m_jumpActive = false;
                break;
            case KeyCode.KEY_S:
                this.m_fireActive = false;
                break;
            case KeyCode.KEY_D:
                this.m_fireActive = false;
                break;
        }
    }

    update(dt: number) {
        if (this.m_keyLeftActive && this.buttonLeft.activeInHierarchy)
            director.emit(GameEvent.PLAYER_MOVE_LEFT);
        else if (this.m_keyRightActive && this.buttonRight.activeInHierarchy)
            director.emit(GameEvent.PLAYER_MOVE_RIGHT);

        if (this.m_jumpActive && this.buttonJump.activeInHierarchy)
            director.emit(GameEvent.PLAYER_JUMP);

        // if(this.m_fireActive)
        //     director.emit(GameEvent.PLAYER_FIRE, true);
    }

    fireOnclick() {
        if (this.directStore || Loader.finish) {
            this.buttonFire.getComponent(Button).interactable = false;
            return;
        }
        director.emit(GameEvent.PLAYER_FIRE, false);
    }

    smashDownOnClick() {
        if (this.directStore || Loader.finish) {
            this.buttonSmashDown.getComponent(Button).interactable = false;
            return;
        }
        director.emit(GameEvent.PLAYER_SMASH_DOWN, false);
    }
}