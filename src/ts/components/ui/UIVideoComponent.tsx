import * as React from 'react';
import {UIVideoControlsComponent} from "./UIVideoControlsComponent";

export enum VideoSourceType{
    video_mp4,
    video_webm,
    videi_ogg
}

export interface VideoSource {
    source: string,
    type: VideoSourceType,
    codecs?: string
}

export interface Props {
    width?: number,
    height?: number,
    controls?: boolean,
    autoPlay?: boolean,
    loop?: boolean,
    sources: VideoSource[]
}

export interface State {
    currentVolume: number,
    duration: number,
    currentTime: number,
    progressEnd: number,
    soundLevel: number,
    soundLevelSave: number,
    adv: boolean,
    hideControls: boolean,
    muted: boolean,
}

export class UIVideoComponent extends React.Component<Props, State> {
    state: State = {
        currentVolume: 0,
        duration: 0,
        currentTime: 0,
        progressEnd: 0,
        soundLevel: 100,
        soundLevelSave: 100,
        adv: false,
        hideControls: false,
        muted: false
    };

    static defaultProps: Props = {} as Props;

    private player: HTMLVideoElement;
    private playerContainer: HTMLDivElement;
    private interval: any = null;

    componentDidMount() {
        this.events();

        if (this.playerContainer) {
            this.playerContainer.addEventListener('mouseenter', this.handlerMouseEnter);
            this.playerContainer.addEventListener('mouseleave', this.handlerMouseLeave);
            // this.playerContainer.addEventListener('mousemove', this.handlerMouseMove);
        }
    }

    componentWillUnmount() {
        this.playerContainer.removeEventListener('mouseenter', this.handlerMouseEnter);
        this.playerContainer.removeEventListener('mouseleave', this.handlerMouseLeave);
        // this.playerContainer.removeEventListener('mousemove', this.handlerMouseMove);
    }

    private handlerMouseMove = (): void => {
        console.log('move');
    };

    private handlerMouseEnter = (): void => {
        this.setState({
            hideControls: false
        } as State);
    };

    private handlerMouseLeave = (event): void => {
        if (!this.player.paused) {
            this.setState({
                hideControls: true
            } as State);
        }
    };

    private events(): void {
        if (this.player) {
            this.player.addEventListener('play', () => {
                this.interval = setInterval(() => {
                    this.setState({
                        currentTime: +this.player.currentTime
                    } as State);
                }, 100);
            });

            this.player.addEventListener('loadeddata', () => {
                this.setState({
                    duration: this.player.duration
                } as State);
            });

            this.player.addEventListener("progress", () => {
                let currentTime: number = this.player.currentTime;
                let buffer: TimeRanges = this.player.buffered;

                if (buffer.length > 0 && this.state.duration > 0) {
                    let currentBuffer: number = 0;

                    for (let i = 0; i < buffer.length; i++) {
                        if (buffer.start(i) <= currentTime && currentTime <= buffer.end(i)) {
                            currentBuffer = i;
                            break;
                        }
                    }

                    this.setState({
                        progressEnd: buffer.end(currentBuffer)
                    } as State);
                }
            }, false);
        }
    }

    private getVideoType(source: VideoSource): string {
        let videoType: string = "video/mp4;";

        switch (source.type) {
            case VideoSourceType.videi_ogg:
                videoType = 'video/ogg;';
                break;
            case VideoSourceType.video_webm:
                videoType = 'video/webm;';
                break;
        }

        if (source.codecs) {
            videoType += ' codecs="' + source.codecs + '"';
        }

        return videoType;
    }

    private getSources(): JSX.Element[] {
        return this.props.sources.map((src: VideoSource, i: number) => {
            return (<source src={src.source} type={this.getVideoType(src)} key={i}/>)
        });
    }

    private handlerSeekBarChange = (value: number): void => {
        this.player.currentTime = value;

        this.setState({
            currentTime: value
        } as State);
    };

    private drawAdv(): JSX.Element {
        return (
            <div className="ui-video-player-adv">

            </div>
        )
    }

    private handlerChangeSoundLevel = (value: number): void => {
        this.player.volume = value / 100;
        this.player.muted = false;

        this.setState({
            soundLevel: value,
            soundLevelSave: value,
            muted: false
        } as State);
    };

    private handlerSoundsToggler = (): void => {
        if (this.player.muted) {
            this.player.muted = false;

            this.setState({
                muted: false,
                soundLevel: this.state.soundLevelSave
            } as State);
        } else {
            this.player.muted = true;

            this.setState({
                muted: true,
                soundLevel: 0
            } as State);
        }
    };

    private handlerPlayStop = (adv?): void => {
        if (this.player.paused) {
            this.player.play();

            if (adv) {
                this.setState({
                    adv: false
                } as State);
            }
        } else {
            this.player.pause();

            clearInterval(this.interval);

            if (adv) {
                this.setState({
                    adv: true
                } as State);
            }
        }
    };

    public render() {
        return (
            <div
                className="ui-video-player-component"
                style={{
                    width: this.props.width?this.props.width+'px':'100%'
                }}
                ref={(playerContainer)=>{
                    this.playerContainer = playerContainer;
                }}
            >
                <video
                    width="100%"
                    height={this.props.height?this.props.height:''}
                    ref={(player)=>{
                        this.player = player;
                    }}
                    onClick={this.handlerPlayStop}
                >
                    {this.getSources()}

                </video>

                <UIVideoControlsComponent
                    played={this.player? this.player.paused : true}
                    mute={this.player? this.state.muted:true}
                    duration={this.state.duration}
                    currentTime={this.state.currentTime}
                    handlerPlayStop={this.handlerPlayStop}
                    handlerChangeCurrentTime={this.handlerSeekBarChange}
                    handlerToggleSound={this.handlerSoundsToggler}
                    handlerChangeSoundLevel={this.handlerChangeSoundLevel}
                    progressEnd={this.state.progressEnd}
                    hide={this.state.hideControls}
                    soundLevel={this.state.soundLevel}
                />
            </div>
        );
    }
}