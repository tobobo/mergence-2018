export function midiToFrequency(pitch) {
  return 2 ** ((pitch - 69) / 12) * 440;
}

export default {};
