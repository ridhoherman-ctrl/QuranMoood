/**
 * Decodes a base64 string into a Uint8Array.
 */
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decodes raw PCM data into an AudioBuffer.
 */
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Helper class to manage PCM Audio playback
 */
export class PcmPlayer {
  private audioContext: AudioContext | null = null;
  private source: AudioBufferSourceNode | null = null;

  async play(base64Data: string, sampleRate = 24000) {
    this.stop(); // Stop any existing playback

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate,
    });

    const uint8Array = decode(base64Data);
    const audioBuffer = await decodeAudioData(uint8Array, this.audioContext, sampleRate, 1);

    this.source = this.audioContext.createBufferSource();
    this.source.buffer = audioBuffer;
    this.source.connect(this.audioContext.destination);
    this.source.start();

    return new Promise<void>((resolve) => {
      if (this.source) {
        this.source.onended = () => resolve();
      } else {
        resolve();
      }
    });
  }

  stop() {
    if (this.source) {
      try {
        this.source.stop();
      } catch (e) {
        // Ignore errors if already stopped
      }
      this.source = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}