import { _decorator, CCBoolean, CCFloat, Component, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseHealth')
export class BaseHealth extends Component {

    @property(CCFloat)
    healthBase: number = 100;

    healthCurrent: number = 0;

    @property(UITransform)
    mask: UITransform = null;

    maskSizeXFull: number = 0;

    protected onLoad(): void {
        this.healthCurrent = this.healthBase;
        this.maskSizeXFull = this.mask.contentSize.x;
    }

    //

    public SetHealthBase(HealthBase: number): void {
        if (HealthBase < 0)
            this.healthBase = 0;
        else
            this.healthBase = HealthBase;
        //
        this.SetHealthMask();
    }

    public SetHealthBaseAdd(HealthBaseAdd: number): void {
        if (this.healthBase + HealthBaseAdd < 0)
            this.healthBase = 0;
        else
            this.healthBase += HealthBaseAdd;
        //
        this.SetHealthMask();
    }

    public GetHealthBase(): number {
        return this.healthBase;
    }

    //

    public SetHealth(Health: number): void {
        if (Health > this.healthBase)
            this.healthCurrent = Health;
        else
            if (Health < 0)
                this.healthCurrent = 0;
            else
                this.healthCurrent = Health;
        //
        this.SetHealthMask();
    }

    public SetHealthAdd(HealthAdd: number): void {
        if (this.healthCurrent + HealthAdd > this.healthBase)
            this.healthCurrent = this.healthBase;
        else
            if (this.healthCurrent + HealthAdd < 0)
                this.healthCurrent = 0;
            else
                this.healthCurrent += HealthAdd;
        //
        this.SetHealthMask();
    }

    private SetHealthMask(): void {
        var MaskSize = this.mask.contentSize.clone();
        MaskSize.x = this.maskSizeXFull * (this.healthCurrent / this.healthBase);
        this.mask.contentSize = MaskSize;
    }

    public GetHealth(): number {
        return this.healthCurrent;
    }
}