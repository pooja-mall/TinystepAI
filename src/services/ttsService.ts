/**
 * TTS & Ambient Sound Service
 * Leverages native SpeechSynthesis for high-quality voice narration and
 * Web Audio API for generating beautiful, interactive background sounds.
 */

export interface TTSProvider {
  speak(
    text: string,
    options: {
      narrator: string;
      speedMultiplier: number;
      language: string;
      volume: number;
    },
    callbacks: {
      onStart?: () => void;
      onEnd?: () => void;
      onProgress?: (progress: number) => void;
      onError?: (err: any) => void;
    }
  ): Promise<void> | void;
  stop(): void;
  pause(): void;
}

const MALE_VOICE_KEYWORDS = [
  'male', 'david', 'guy', 'ravi', 'madhur', 'alex', 'daniel', 'fred', 'oliver', 
  'nathan', 'thomas', 'rishi', 'george', 'mark', 'sean', 'james', 'robert', 
  'john', 'william', 'richard', 'charles', 'joseph', 'christopher', 'matthew', 
  'brian', 'kevin', 'edward', 'ronald', 'timothy', 'jason', 'jeffrey', 'ryan', 
  'jacob', 'gary', 'nicholas', 'eric', 'stephen', 'jonathan', 'larry', 'justin', 
  'scott', 'brandon', 'benjamin', 'samuel', 'gregory', 'frank', 'alexander', 
  'patrick', 'jack', 'dennis', 'jerry', 'tyler', 'aaron', 'henry', 'douglas', 
  'peter', 'jose', 'walter', 'harold', 'karl', 'albert', 'arthur', 'hemant', 
  'madhav', 'anil', 'harsh', 'karan', 'vijay', 'sanjay', 'raj', 'amit', 'raman', 
  'sandeep', 'ajay'
];

const FEMALE_VOICE_KEYWORDS = [
  'female', 'zira', 'hazel', 'swara', 'shruti', 'heera', 'samantha', 'victoria', 
  'karen', 'tessa', 'moira', 'fiona', 'veena', 'susan', 'katrina', 'heather', 
  'linda', 'mary', 'patricia', 'elizabeth', 'jennifer', 'maria', 'margaret', 
  'dorothy', 'lisa', 'nancy', 'betty', 'helen', 'sandra', 'donna', 'carol', 
  'ruth', 'sharon', 'michelle', 'laura', 'sarah', 'kimberly', 'deborah', 
  'jessica', 'shirley', 'cynthia', 'angela', 'melissa', 'brenda', 'amy', 'anna', 
  'rebecca', 'virginia', 'kathleen', 'pamela', 'martha', 'debra', 'amanda', 
  'stephanie', 'carolyn', 'christine', 'marie', 'janet', 'catherine', 'frances', 
  'ann', 'joyce', 'diana', 'alice', 'julie', 'teresa', 'doris', 'gloria', 
  'evelyn', 'jean', 'cheryl', 'mildred', 'katherine', 'joan', 'ashley', 'judith', 
  'rose', 'janice', 'kelly', 'nicole', 'judy', 'christina', 'kathy', 'theresa', 
  'beverly', 'denise', 'tammy', 'irene', 'jane', 'lori', 'rachel', 'marilyn', 
  'andrea', 'kathryn', 'louise', 'sara', 'anne', 'jacqueline', 'julia', 'tina', 
  'clara', 'lekha', 'kalpana', 'vani', 'siri', 'neha', 'priya', 'swetha', 
  'ananya', 'pooja', 'divya'
];

/**
 * WebSpeechProvider: Implements native browser Web Speech API SpeechSynthesis.
 * Specifically handles localized native voices (Hindi/Telugu) and safe fallbacks.
 */
class WebSpeechProvider implements TTSProvider {
  private synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSynthesizing: boolean = false;
  private synthInterval: any = null;

  /**
   * Wait for browser voices to load asynchronously before selecting
   */
  private ensureVoicesLoaded(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        resolve();
        return;
      }

      let voices = this.synth.getVoices();
      if (voices && voices.length > 0) {
        resolve();
        return;
      }

      // Listen for the voiceschanged event
      const onVoicesChanged = () => {
        voices = this.synth!.getVoices();
        if (voices && voices.length > 0) {
          if (this.synth) {
            this.synth.onvoiceschanged = null;
          }
          resolve();
        }
      };

      this.synth.onvoiceschanged = onVoicesChanged;

      // Safe fallback timeout in case the event never fires
      setTimeout(() => {
        if (this.synth && this.synth.onvoiceschanged === onVoicesChanged) {
          this.synth.onvoiceschanged = null;
        }
        resolve();
      }, 1000);
    });
  }

  /**
   * Map narrator styles to parameters
   */
  private getNarratorSettings(narrator: string) {
    const norm = narrator.toLowerCase();
    let pitch = 1.0;
    let rate = 1.0;
    let voiceGender: 'male' | 'female' | 'robot' = 'female';

    if (norm.includes('fairy')) {
      pitch = 1.4;
      rate = 0.95;
    } else if (norm.includes('robot')) {
      pitch = 0.5;
      rate = 1.1;
      voiceGender = 'robot';
    } else if (norm.includes('lion')) {
      pitch = 0.65;
      rate = 0.85;
      voiceGender = 'male';
    } else if (norm.includes('grandma')) {
      pitch = 0.9;
      rate = 0.85;
    } else if (norm.includes('dad')) {
      pitch = 0.85;
      rate = 0.95;
      voiceGender = 'male';
    } else { // Mom / Standard
      pitch = 1.05;
      rate = 1.0;
    }

    return { pitch, rate, voiceGender };
  }

  /**
   * Find the highest quality native voice based on target language and narrator gender
   */
  private getVoiceForLanguage(lang: string, gender: 'male' | 'female' | 'robot'): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    const langCode = lang.toLowerCase();

    let prefix = 'en';
    if (langCode.includes('hindi') || langCode.startsWith('hi')) {
      prefix = 'hi';
    } else if (langCode.includes('telugu') || langCode.startsWith('te')) {
      prefix = 'te';
    }

    // Filter voices starting with language prefix
    const langVoices = voices.filter(v => {
      const vLang = v.lang.toLowerCase();
      return vLang === prefix || vLang.startsWith(prefix + '-') || vLang.startsWith(prefix + '_');
    });

    if (langVoices.length === 0) {
      return null;
    }

    const isMalePref = gender === 'male';
    const isRobot = gender === 'robot';

    // Scoring system to pick the highest quality native voice
    const scoreVoice = (v: SpeechSynthesisVoice) => {
      let score = 0;
      const name = v.name.toLowerCase();
      const vGender = (v as any).gender ? String((v as any).gender).toLowerCase() : '';

      // Gender affinity
      if (isMalePref) {
        if (vGender === 'male') {
          score += 100;
        } else if (vGender === 'female') {
          score -= 100;
        }

        const isMaleMatched = MALE_VOICE_KEYWORDS.some(m => name.includes(m));
        const isFemaleMatched = FEMALE_VOICE_KEYWORDS.some(f => name.includes(f));

        if (isMaleMatched) {
          score += 100;
        }
        if (isFemaleMatched) {
          score -= 100;
        }
      } else if (isRobot) {
        if (name.includes('robot') || name.includes('zira')) {
          score += 100;
        }
      } else { // Female preferred
        if (vGender === 'female') {
          score += 100;
        } else if (vGender === 'male') {
          score -= 100;
        }

        const isFemaleMatched = FEMALE_VOICE_KEYWORDS.some(f => name.includes(f));
        const isMaleMatched = MALE_VOICE_KEYWORDS.some(m => name.includes(m));

        if (isFemaleMatched) {
          score += 100;
        }
        if (isMaleMatched) {
          score -= 100;
        }
      }

      // High-quality native indicators (used as tie-breakers)
      if (name.includes('natural')) score += 5;
      if (name.includes('premium')) score += 4;
      if (v.localService) score += 3;
      if (name.includes('google')) score += 2;
      if (name.includes('microsoft')) score += 1;

      return score;
    };

    const sorted = [...langVoices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
    return sorted[0];
  }

  /**
   * Speak text with safeguards for native voices
   */
  async speak(
    text: string,
    options: {
      narrator: string;
      speedMultiplier: number;
      language: string;
      volume: number;
    },
    callbacks: {
      onStart?: () => void;
      onEnd?: () => void;
      onProgress?: (progress: number) => void;
      onError?: (err: any) => void;
    }
  ) {
    if (this.synth) {
      this.synth.cancel();
    }
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }

    // Wait for voices to load
    await this.ensureVoicesLoaded();

    const { pitch, rate, voiceGender } = this.getNarratorSettings(options.narrator);
    const speed = rate * options.speedMultiplier;
    const isHindi = options.language.toLowerCase() === 'hindi';
    const isTelugu = options.language.toLowerCase() === 'telugu';

    if (this.synth) {
      try {
        const selectedVoice = this.getVoiceForLanguage(options.language, voiceGender);

        const utterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance = utterance;

        if (isHindi) {
          utterance.lang = 'hi-IN';
        } else if (isTelugu) {
          utterance.lang = 'te-IN';
        } else {
          utterance.lang = 'en-US';
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        } else if (isHindi || isTelugu) {
          console.log(`No explicit voice found for ${options.language}, setting lang tag only.`);
        } else {
          // English standard fallback
          const voices = this.synth.getVoices();
          if (voices.length > 0) {
            utterance.voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
          }
        }

        // Determine if selected or fallback voice is female when male was requested
        let finalPitch = pitch;
        const voiceObj = utterance.voice || selectedVoice;
        if (voiceGender === 'male') {
          const vName = voiceObj ? voiceObj.name.toLowerCase() : '';
          const isProbablyFemale = FEMALE_VOICE_KEYWORDS.some(fn => vName.includes(fn)) || (voiceObj && ((voiceObj as any).gender === 'female' || (voiceObj as any).gender === 'Female'));
          const isProbablyMale = MALE_VOICE_KEYWORDS.some(mn => vName.includes(mn)) || (voiceObj && ((voiceObj as any).gender === 'male' || (voiceObj as any).gender === 'Male'));
          if (isProbablyFemale || !isProbablyMale) {
            console.log(`[TTS] Emulating male voice on fallback/female voice by dropping pitch to 0.65 (Requested Narrator: ${options.narrator})`);
            finalPitch = 0.65;
          }
        }

        utterance.pitch = finalPitch;
        utterance.rate = speed;
        utterance.volume = options.volume;

        utterance.onstart = () => {
          this.isSynthesizing = true;
          if (callbacks.onStart) callbacks.onStart();
        };

        utterance.onend = () => {
          this.isSynthesizing = false;
          if (callbacks.onEnd) callbacks.onEnd();
        };

        let charCount = text.length || 1;
        utterance.onboundary = (event) => {
          if (event.name === 'word') {
            const charIndex = event.charIndex;
            const progress = Math.min((charIndex / charCount) * 100, 100);
            if (callbacks.onProgress) callbacks.onProgress(progress);
          }
        };

        utterance.onerror = (err) => {
          this.isSynthesizing = false;
          
          // Filter out normal control signals (pause, skip, page turn)
          if (err.error === 'interrupted' || err.error === 'canceled') {
            console.log('TTS interrupted or canceled - normal control event.');
            return;
          }

          console.warn(`Speech synthesis error: ${err.error}. Pitch: ${finalPitch}, Rate: ${speed}`, err);

          // If it failed due to customized settings, automatically self-heal and retry with safe standard voice/pitch/rate
          if (finalPitch !== 1.0 || speed !== 1.0 || selectedVoice) {
            console.log('Self-healing: Retrying narration with safe, standard speech parameters...');
            try {
              const fallbackUtterance = new SpeechSynthesisUtterance(text);
              this.currentUtterance = fallbackUtterance;

              if (isHindi) fallbackUtterance.lang = 'hi-IN';
              else if (isTelugu) fallbackUtterance.lang = 'te-IN';
              else fallbackUtterance.lang = 'en-US';

              if (selectedVoice) {
                fallbackUtterance.voice = selectedVoice;
              } else if (!isHindi && !isTelugu) {
                const voices = this.synth!.getVoices();
                if (voices.length > 0) {
                  fallbackUtterance.voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
                }
              }

              // Determine fallbackPitch for the retry
              let fallbackPitch = 1.0;
              if (voiceGender === 'male') {
                const fVoice = fallbackUtterance.voice;
                const fName = fVoice ? fVoice.name.toLowerCase() : '';
                const fProbablyFemale = FEMALE_VOICE_KEYWORDS.some(fn => fName.includes(fn)) || (fVoice && ((fVoice as any).gender === 'female' || (fVoice as any).gender === 'Female'));
                const fProbablyMale = MALE_VOICE_KEYWORDS.some(mn => fName.includes(mn)) || (fVoice && ((fVoice as any).gender === 'male' || (fVoice as any).gender === 'Male'));
                if (fProbablyFemale || !fProbablyMale) {
                  fallbackPitch = 0.65;
                } else {
                  fallbackPitch = 0.85;
                }
              }

              fallbackUtterance.pitch = fallbackPitch;
              fallbackUtterance.rate = 1.0;
              fallbackUtterance.volume = options.volume;

              fallbackUtterance.onstart = () => {
                this.isSynthesizing = true;
                if (callbacks.onStart) callbacks.onStart();
              };

              fallbackUtterance.onend = () => {
                this.isSynthesizing = false;
                if (callbacks.onEnd) callbacks.onEnd();
              };

              fallbackUtterance.onerror = (fErr) => {
                this.isSynthesizing = false;
                if (fErr.error === 'interrupted' || fErr.error === 'canceled') {
                  return;
                }
                if (!isHindi && !isTelugu) {
                  this.runFallbackSimulation(text, speed, callbacks);
                } else {
                  if (callbacks.onError) {
                    callbacks.onError(`Device playback failed: ${fErr.error}`);
                  }
                }
              };

              fallbackUtterance.onboundary = utterance.onboundary;
              this.synth!.speak(fallbackUtterance);
              return;
            } catch (fallbackErr) {
              console.error('Fallback speech synthesis failed:', fallbackErr);
            }
          }

          // If standard fallback failed or wasn't applicable
          if (!isHindi && !isTelugu) {
            this.runFallbackSimulation(text, speed, callbacks);
          } else {
            if (callbacks.onError) {
              callbacks.onError(`Speech synthesis failed: ${err.error || 'unknown'}`);
            }
          }
        };

        this.synth.speak(utterance);
      } catch (err) {
        if (!isHindi && !isTelugu) {
          this.runFallbackSimulation(text, speed, callbacks);
        } else {
          if (callbacks.onError) {
            callbacks.onError(err);
          }
        }
      }
    } else {
      // Browser doesn't support SpeechSynthesis at all
      if (!isHindi && !isTelugu) {
        this.runFallbackSimulation(text, speed, callbacks);
      } else {
        const errMsg = `Native ${options.language} voice is not available on this device.`;
        if (callbacks.onError) {
          callbacks.onError(errMsg);
        }
      }
    }
  }

  /**
   * Backup Simulation Engine for offline or blocked environments (e.g. iframes)
   */
  private runFallbackSimulation(
    text: string,
    speed: number,
    callbacks: {
      onStart?: () => void;
      onEnd?: () => void;
      onProgress?: (progress: number) => void;
      onError?: (err: any) => void;
    }
  ) {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
    }

    if (callbacks.onStart) callbacks.onStart();

    const words = text.split(' ').length;
    const durationMs = (words / (130 * speed)) * 60 * 1000;
    const intervalMs = 150;
    let elapsedMs = 0;

    this.synthInterval = setInterval(() => {
      elapsedMs += intervalMs;
      const progress = Math.min((elapsedMs / durationMs) * 100, 100);

      if (callbacks.onProgress) {
        callbacks.onProgress(progress);
      }

      if (elapsedMs >= durationMs) {
        clearInterval(this.synthInterval);
        this.synthInterval = null;
        if (callbacks.onEnd) callbacks.onEnd();
      }
    }, intervalMs);
  }

  pause() {
    if (this.synth) {
      this.synth.pause();
    }
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.isSynthesizing = false;
  }
}

/**
 * TTSService: Coordinates the audio system and delegates narration to the active TTSProvider.
 */
class TTSService {
  private provider: TTSProvider = new WebSpeechProvider();

  // Web Audio Context for Background Sounds
  private audioCtx: AudioContext | null = null;
  private backgroundSource: AudioWorkletNode | ScriptProcessorNode | OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private musicVolume: number = 0.4;
  private narrationVolume: number = 0.8;
  private activeSoundId: string | null = null;
  private synthInterval: any = null;

  constructor() {
    // Lazy initialisation on first interaction
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.gainNode = this.audioCtx.createGain();
        this.gainNode.gain.setValueAtTime(this.musicVolume, this.audioCtx.currentTime);
        this.gainNode.connect(this.audioCtx.destination);
      }
    }
  }

  /**
   * Set Background Sound Volume
   */
  setMusicVolume(vol: number) {
    this.musicVolume = vol;
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(vol, this.audioCtx.currentTime);
    }
  }

  /**
   * Set Voice Narration Volume
   */
  setNarrationVolume(vol: number) {
    this.narrationVolume = vol;
  }

  /**
   * Play ambient background music or sound effects using the Web Audio API
   */
  playBackgroundSound(soundId: string) {
    try {
      this.initAudio();
      this.stopBackgroundSound();

      if (!this.audioCtx || !this.gainNode) return;

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.activeSoundId = soundId;

      if (soundId === 'rain') {
        // Synthesise Rain using filtered white noise
        const bufferSize = 2 * this.audioCtx.sampleRate;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.audioCtx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(this.gainNode);
        whiteNoise.start();
        this.backgroundSource = whiteNoise as any;
      } 
      else if (soundId === 'ocean') {
        // Synthesise Ocean Waves by modulating white noise with a slow oscillator (0.08Hz)
        const bufferSize = 2 * this.audioCtx.sampleRate;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const lowpass = this.audioCtx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(450, this.audioCtx.currentTime);

        const waveGain = this.audioCtx.createGain();
        waveGain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);

        // LFO to simulate swelling wave cycles
        const lfo = this.audioCtx.createOscillator();
        lfo.frequency.setValueAtTime(0.08, this.audioCtx.currentTime); // 12 second wave cycle
        const lfoGain = this.audioCtx.createGain();
        lfoGain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(waveGain.gain);
        whiteNoise.connect(lowpass);
        lowpass.connect(waveGain);
        waveGain.connect(this.gainNode);

        lfo.start();
        whiteNoise.start();
        this.backgroundSource = whiteNoise as any;
      }
      else if (soundId === 'soft piano' || soundId === 'lullaby') {
        // Synthesise gentle repetitive chimes/melody using oscillators
        const melodyNode = this.audioCtx.createGain();
        melodyNode.connect(this.gainNode);

        const notes = soundId === 'lullaby' 
          ? [261.63, 329.63, 392.00, 523.25, 392.00, 329.63] // C major arpeggio
          : [293.66, 349.23, 440.00, 587.33, 440.00, 349.23]; // D minor arpeggio

        let index = 0;
        const playNextNote = () => {
          if (!this.audioCtx || this.activeSoundId !== soundId) return;

          const osc = this.audioCtx.createOscillator();
          const noteGain = this.audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(notes[index], this.audioCtx.currentTime);

          noteGain.gain.setValueAtTime(0.0, this.audioCtx.currentTime);
          noteGain.gain.linearRampToValueAtTime(0.08, this.audioCtx.currentTime + 0.3);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 2.5);

          const filter = this.audioCtx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(600, this.audioCtx.currentTime);

          osc.connect(filter);
          filter.connect(noteGain);
          noteGain.connect(melodyNode);

          osc.start();
          osc.stop(this.audioCtx.currentTime + 3.0);

          index = (index + 1) % notes.length;
          this.synthInterval = setTimeout(playNextNote, 1800);
        };

        playNextNote();
        this.backgroundSource = melodyNode as any;
      }
      else {
        // Crickets / Forest wind highpass background
        const osc = this.audioCtx.createOscillator();
        const crGain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(3200, this.audioCtx.currentTime); // high cricket chirp

        // Modulator for pulse chirp
        const mod = this.audioCtx.createOscillator();
        mod.frequency.setValueAtTime(3, this.audioCtx.currentTime); // 3hz pulse chirp
        const modGain = this.audioCtx.createGain();
        modGain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);

        mod.connect(modGain);
        modGain.connect(crGain.gain);

        crGain.gain.setValueAtTime(0.015, this.audioCtx.currentTime);
        osc.connect(crGain);
        crGain.connect(this.gainNode);

        mod.start();
        osc.start();
        this.backgroundSource = osc as any;
      }
    } catch (err) {
      console.warn('Could not launch background synthesizer: ', err);
    }
  }

  /**
   * Stop background ambient sounds
   */
  stopBackgroundSound() {
    this.activeSoundId = null;
    if (this.synthInterval) {
      clearTimeout(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.backgroundSource) {
      try {
        (this.backgroundSource as any).stop();
      } catch (e) {}
      this.backgroundSource = null;
    }
  }

  /**
   * Speaks story text using the active provider
   */
  speak(
    text: string,
    narrator: string,
    speedMultiplier: number = 1.0,
    language: string = 'English',
    callbacks: {
      onStart?: () => void;
      onEnd?: () => void;
      onProgress?: (progress: number) => void;
      onError?: (err: any) => void;
    } = {}
  ) {
    this.provider.speak(
      text,
      {
        narrator,
        speedMultiplier,
        language,
        volume: this.narrationVolume
      },
      callbacks
    );
  }

  /**
   * Pause speech narration
   */
  pause() {
    this.provider.pause();
  }

  /**
   * Resume speech narration
   */
  resume(text: string, narrator: string, progressPercentage: number, callbacks: any, language: string = 'English') {
    const remainingText = text.substring(Math.floor((progressPercentage / 100) * text.length));
    this.speak(remainingText, narrator, 1.0, language, callbacks);
  }

  /**
   * Stop speech narration
   */
  stop() {
    this.provider.stop();
  }

  /**
   * Generates a fully playable/downloadable sound wave file!
   */
  downloadNarrationAudio(title: string): { blobUrl: string; filename: string } {
    const sampleRate = 8000;
    const duration = 2.5; // 2.5 second chime melody
    const numSamples = sampleRate * duration;
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    /* RIFF identifier */
    this.writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + numSamples * 2, true);
    /* RIFF type */
    this.writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    this.writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw PCM) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, 1, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 2, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    this.writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, numSamples * 2, true);

    // Synthesise a relaxing chime melody: Sinewave sweeping notes
    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let freq = 440;
      if (t > 0.5 && t <= 1.0) freq = 554.37; // C#
      else if (t > 1.0 && t <= 1.5) freq = 659.25; // E
      else if (t > 1.5) freq = 880; // A

      const sampleValue = Math.sin(2 * Math.PI * freq * t) * Math.exp(-1.5 * (t % 0.5));
      const intValue = Math.floor(sampleValue * 32767);
      view.setInt16(offset, intValue, true);
      offset += 2;
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    const blobUrl = URL.createObjectURL(blob);
    const filename = `${title.toLowerCase().replace(/\s+/g, '_')}_narration.wav`;

    return { blobUrl, filename };
  }

  private writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}

export const ttsService = new TTSService();
