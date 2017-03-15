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
    width: number,
    height?: number,
    controls?: boolean,
    autoPlay?: boolean,
    loop?: boolean,
    sources: VideoSource[]
}

export interface State {
    adv: boolean,
    currentVolume: number,
    duration: number,
    currentTime: number
}

export class UIVideoComponent extends React.Component<Props, State> {
    state: State = {
        adv: false,
        currentVolume: 0,
        duration: 0,
        currentTime: 0
    };

    static defaultProps: Props = {} as Props;

    private player: HTMLVideoElement;
    private playerContainer;

    componentDidMount() {
        this.events();
    }

    private events(): void {
        if (this.player) {
            this.player.addEventListener('playing', () => {
                setInterval(() => {
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
                    width: this.props.width+'px'
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
                    duration={this.state.duration}
                    currentTime={this.state.currentTime}
                    playStop={this.handlerPlayStop}
                    changeCurrentTime={this.handlerSeekBarChange}
                />
            </div>
        );
    }
}