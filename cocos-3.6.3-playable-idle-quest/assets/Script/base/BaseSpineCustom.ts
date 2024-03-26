import { _decorator, CCString, sp } from 'cc';
import { BaseSpine } from './BaseSpine';
const { ccclass, property } = _decorator;
const { spine } = sp;

@ccclass('BaseSpineCustom')
export class BaseSpineCustom extends BaseSpine {

    @property(sp.SkeletonData)
    spineData: sp.SkeletonData = null;

    @property(CCString)
    spineSkin: string = "1";

    @property(CCString)
    spineWeapon: string = "w1";

    protected onLoad(): void {
        this.SetSpine(this.spineData);
        this.SetSkin(this.spineSkin, this.spineWeapon);
    }

    //

    public SetSpine(Data: sp.SkeletonData): void {
        if (Data == null)
            return;
        //
        this.spineData = Data;
        this.spine.skeletonData = Data;
    }

    public SetSkin(Skin: string, Weapon: string = ''): void {
        this.spineSkin = Skin;
        this.spineWeapon = Weapon;
        //
        let BaseSkin = new spine.Skin('base-char');
        let BaseData = this.spine._skeleton.data;
        //
        if (Skin != null && Skin != "" && Skin != '')
            BaseSkin.addSkin(BaseData.findSkin(this.spineSkin));
        if (Weapon != null && Weapon != "" && Weapon != '')
            BaseSkin.addSkin(BaseData.findSkin(this.spineWeapon))
        //
        this.spine._skeleton.setSkin(BaseSkin);
        this.spine._skeleton.setSlotsToSetupPose();
        this.spine.getState().apply(this.spine._skeleton);
        //
        //console.log("[Skin] " + this.node.name + " Changed!");
    }
}