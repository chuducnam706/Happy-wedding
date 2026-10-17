/**
 * Romantic Wedding Background Music Manager
 * Supports:
 * 1. YouTube links (via official YouTube IFrame Player API)
 * 2. Uploaded audio files (.mp3, .wav, .m4a)
 * 3. Direct audio URL (.mp3)
 * 4. Fallback acoustic harp synth (Canon in D)
 */

import { MusicTrack, extractYouTubeId } from '../data/weddingData';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

class WeddingAudioManager {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private noteIndex = 0;
  private customAudio: HTMLAudioElement | null = null;
  private ytPlayer: any = null;
  private isYtApiLoading = false;
  private isYtReady = false;

  private currentTrack: MusicTrack = {
    id: 'default-yt',
    title: 'Until I Found You / Ánh Nắng Của Anh (YouTube)',
    artist: 'Nhạc cưới YouTube',
    youtubeId: 'kYJqRkX57gI', // Beautiful acoustic wedding melody
    type: 'youtube',
  };

  private listeners: Array<(isPlaying: boolean, track: MusicTrack) => void> = [];

  // Canon in D / Romantic Wedding Progression (Notes in Hz)
  private melodyNotes = [
    293.66, 369.99, 440.00, 587.33,
    220.00, 277.18, 329.63, 440.00,
    246.94, 293.66, 369.99, 493.88,
    185.00, 220.00, 277.18, 369.99,
    196.00, 246.94, 293.66, 392.00,
    146.83, 185.00, 220.00, 293.66,
    196.00, 246.94, 293.66, 493.88,
    220.00, 277.18, 329.63, 440.00,
    587.33, 739.99, 880.00, 739.99,
    440.00, 554.37, 659.25, 554.37,
    493.88, 587.33, 739.99, 587.33,
    369.99, 440.00, 554.37, 440.00
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadYouTubeApi();
    }
  }

  private loadYouTubeApi() {
    if (window.YT && window.YT.Player) {
      this.isYtReady = true;
      return;
    }
    if (this.isYtApiLoading) return;
    this.isYtApiLoading = true;

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      document.head.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      this.isYtReady = true;
      this.initYouTubePlayer();
    };
  }

  private initYouTubePlayer() {
    if (!this.isYtReady || !window.YT) return;

    let container = document.getElementById('youtube-wedding-player-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'youtube-wedding-player-container';
      container.style.position = 'fixed';
      container.style.bottom = '-9999px';
      container.style.right = '-9999px';
      container.style.width = '1px';
      container.style.height = '1px';
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      document.body.appendChild(container);
    }

    const hostDiv = document.createElement('div');
    hostDiv.id = 'youtube-player-host';
    container.innerHTML = '';
    container.appendChild(hostDiv);

    const videoId = this.currentTrack.youtubeId || 'kYJqRkX57gI';

    try {
      this.ytPlayer = new window.YT.Player('youtube-player-host', {
        height: '1',
        width: '1',
        videoId: videoId,
        playerVars: {
          autoplay: this.isPlaying ? 1 : 0,
          loop: 1,
          playlist: videoId,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (event: any) => {
            if (this.isPlaying && this.currentTrack.type === 'youtube') {
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
            if (event.data === 1) {
              this.isPlaying = true;
              this.notify();
            } else if (event.data === 2) {
              this.isPlaying = false;
              this.notify();
            } else if (event.data === 0) {
              event.target.playVideo(); // loop
            }
          },
          onError: () => {
            // If YouTube video restricts embed, fallback to synth
            console.warn('YouTube embed restricted, using acoustic synth fallback');
            this.startSynth();
          },
        },
      });
    } catch (e) {
      console.warn('Failed to init YT.Player:', e);
    }
  }

  public init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
  }

  public subscribe(listener: (isPlaying: boolean, track: MusicTrack) => void) {
    this.listeners.push(listener);
    listener(this.isPlaying, this.currentTrack);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.isPlaying, this.currentTrack));
  }

  public setTrack(track: MusicTrack, autoPlay: boolean = true) {
    const wasPlaying = this.isPlaying;
    this.pause();
    this.currentTrack = track;

    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }

    if (track.type === 'youtube') {
      const vid = track.youtubeId || extractYouTubeId(track.url || '');
      if (vid) {
        this.currentTrack.youtubeId = vid;
        if (this.ytPlayer && typeof this.ytPlayer.loadVideoById === 'function') {
          this.ytPlayer.loadVideoById(vid);
          if (autoPlay || wasPlaying) {
            this.ytPlayer.playVideo();
            this.isPlaying = true;
          }
        } else {
          this.initYouTubePlayer();
        }
      }
    }

    if (autoPlay || wasPlaying) {
      this.play();
    } else {
      this.notify();
    }
  }

  public getCurrentTrack(): MusicTrack {
    return this.currentTrack;
  }

  public play() {
    this.init();

    // 1. YouTube track
    if (this.currentTrack.type === 'youtube') {
      if (this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
        try {
          this.ytPlayer.playVideo();
          this.isPlaying = true;
          this.notify();
          return;
        } catch {
          // fallback
        }
      } else {
        this.initYouTubePlayer();
        this.isPlaying = true;
        this.notify();
        return;
      }
    }

    // 2. Audio URL / File track
    if (this.currentTrack.type !== 'synth' && this.currentTrack.url) {
      if (!this.customAudio) {
        this.customAudio = new Audio(this.currentTrack.url);
        this.customAudio.loop = true;
      } else if (this.customAudio.src !== this.currentTrack.url) {
        this.customAudio.src = this.currentTrack.url;
        this.customAudio.load();
      }

      this.customAudio
        .play()
        .then(() => {
          this.isPlaying = true;
          this.notify();
        })
        .catch(() => {
          this.startSynth();
        });
      return;
    }

    // 3. Synth
    this.startSynth();
  }

  private startSynth() {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    this.isPlaying = true;
    this.noteIndex = 0;
    this.scheduleNextNote();
    this.notify();
  }

  private playTone(freq: number, duration: number = 1.2) {
    if (!this.audioCtx || !this.isPlaying) return;

    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  private scheduleNextNote = () => {
    if (!this.isPlaying) return;

    const freq = this.melodyNotes[this.noteIndex % this.melodyNotes.length];
    this.playTone(freq, 1.4);

    if (this.noteIndex % 4 === 0) {
      this.playTone(freq / 2, 2.0);
    }

    this.noteIndex++;
    this.timerId = window.setTimeout(this.scheduleNextNote, 420);
  };

  public pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }
    if (this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
      try {
        this.ytPlayer.pauseVideo();
      } catch {
        // ignore
      }
    }
    this.notify();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const weddingAudio = new WeddingAudioManager();
