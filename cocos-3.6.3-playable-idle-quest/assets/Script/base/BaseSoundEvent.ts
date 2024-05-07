import { _decorator, AudioSource, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseSoundEvent')
export class BaseSoundEvent extends Component {
    onLoad(){
        window.director = director;
        director.on("onVolumeChanged", this.onVolumeChanged, this);
        this.onVolumeChanged(window.isMute);
    }

    onDestroy(){
        director.off("onVolumeChanged", this.onVolumeChanged, this);
    }

    onVolumeChanged(mute: boolean)
    {
        let audioSources = this.getComponentsInChildren(AudioSource);
        audioSources.forEach(e => {
            e.volume = mute ? 0 : 1;
        });
    }
}