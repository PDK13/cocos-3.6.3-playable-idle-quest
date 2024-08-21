import { _decorator, CCBoolean, CCInteger, Component, director, Input, Label, Node } from 'cc';
import GameEvent from '../GameEvent';
const { ccclass, property } = _decorator;

@ccclass('PlayerStat')
export class PlayerStat extends Component {

    static instance: PlayerStat = null;

    static PLAYER_ATK_UPDATE: string = 'PLAYER_ATK_UPDATE';
    static PLAYER_HP_UPDATE: string = 'PLAYER_HP_UPDATE';

    @property(CCBoolean)
    fake: boolean = false;

    @property(CCInteger)
    coinCurent: number = 1000;

    @property(CCInteger)
    gemCurent: number = 5;

    @property(CCInteger)
    public atkCurrent: number = 0; //+100

    @property(CCInteger)
    public hpCurrent: number = 0; //+1000

    @property(CCBoolean)
    upgrateAllow: boolean = true;

    @property(CCInteger)
    atkPrice: number = 100;

    @property(CCInteger)
    hpPrice: number = 100;

    @property(Node)
    groupStatAtk: Node = null;

    @property(Node)
    groupStatHp: Node = null;

    @property(Node)
    panelCoin: Node = null;

    @property(Node)
    panelGem: Node = null;

    coinLabel: Label = null;
    gemLabel: Label = null;
    atkValueLabel: Label = null;
    atkPriceLabel: Label = null;
    hpValueLabel: Label = null;
    hpPriceLabel: Label = null;

    protected onLoad(): void {
        PlayerStat.instance = this;
        //
        this.coinLabel = this.panelCoin.getChildByName('value').getComponent(Label);
        this.gemLabel = this.panelGem.getChildByName('value').getComponent(Label);
        //
        this.atkValueLabel = this.groupStatAtk.getChildByName('value').getComponent(Label);
        this.atkPriceLabel = this.groupStatAtk.getChildByName('price').getComponent(Label);
        //
        this.hpValueLabel = this.groupStatHp.getChildByName('value').getComponent(Label);
        this.hpPriceLabel = this.groupStatHp.getChildByName('price').getComponent(Label);
        //
        director.on(GameEvent.MONSTER_DEAD, this.onMonsterDead, this);
        //
        if (this.fake) {
            this.groupStatAtk.getChildByName('btn-upgrade').on(Input.EventType.TOUCH_START, this.onDirectorStore, this);
            this.groupStatHp.getChildByName('btn-upgrade').on(Input.EventType.TOUCH_START, this.onDirectorStore, this);
            return;
        }
        //
        if (this.upgrateAllow) {
            this.groupStatAtk.getChildByName('btn-upgrade').on(Input.EventType.TOUCH_START, this.onAtkUpgrade, this);
            this.groupStatHp.getChildByName('btn-upgrade').on(Input.EventType.TOUCH_START, this.onHpUpgrade, this);
        }
    }

    protected start(): void {
        this.coinLabel.string = this.coinCurent.toString();
        this.gemLabel.string = this.gemCurent.toString();
        this.SetStatUpdate();
    }

    //

    private onDirectorStore(): void {
        director.emit(GameEvent.GAME_RETRY);
    }

    private onMonsterDead(): void {
        this.SetCoinAdd(100);
    }

    private onAtkUpgrade(): void {
        if (this.coinCurent < this.atkPrice)
            return;
        //
        this.atkCurrent += 1;
        this.atkPrice += 100;
        this.SetCoinAdd(-this.atkPrice);
        this.SetStatUpdate();
        //
        director.emit(PlayerStat.PLAYER_ATK_UPDATE);
    }

    private onHpUpgrade(): void {
        if (this.coinCurent < this.hpPrice)
            return;
        //
        this.hpCurrent += 1;
        this.hpPrice += 100;
        this.SetCoinAdd(-this.hpPrice);
        this.SetStatUpdate();
        //
        director.emit(PlayerStat.PLAYER_HP_UPDATE);
    }

    //

    private SetCoinAdd(Add: number): void {
        if (this.coinCurent + Add < 0)
            this.coinCurent = 0;
        else
            this.coinCurent += Add;
        //
        this.coinLabel.string = this.coinCurent.toString();
        //
        this.SetStatUpdate();
    }

    private SetStatUpdate(): void {
        this.groupStatAtk.getChildByName('btn-upgrade').active = this.coinCurent >= this.atkPrice;
        this.groupStatAtk.getChildByName('btn-none').active = this.coinCurent < this.atkPrice;
        //
        this.groupStatHp.getChildByName('btn-upgrade').active = this.coinCurent >= this.hpPrice;
        this.groupStatHp.getChildByName('btn-none').active = this.coinCurent < this.hpPrice;
        //
        this.atkValueLabel.string = (this.atkCurrent + 100).toString();
        this.atkPriceLabel.string = this.atkPrice.toString();
        //
        this.hpValueLabel.string = (this.hpCurrent + 1000).toString();
        this.hpPriceLabel.string = this.hpPrice.toString();
    }
}