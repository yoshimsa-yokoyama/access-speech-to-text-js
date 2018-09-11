// Place your API key to access google cloud services. API key can be created on Google Cloud Platform Console
// It is recommended to limit access to API keys (Otherwise anyone can use your key to access google cloud services).
// For example, limit accesses by HTTP referrers of your choice. Settings also can be done on Google Cloud Console.
export const API_KEY = ''

// Speech-to-Text request settings
// all settings are in "https://cloud.google.com/speech-to-text/docs/reference/rest/v1/speech/recognize"
export const LANG_CODE = 'ja-JP'          // language which you want to analyse
export const AUDIO_ENCODING = 'LINEAR16'  // not necessary to send this if your file is either WAV or FLAC
export const SPEECH_CONTEXT_PHRASES = []
export const MAX_ALT = 1                  // numbers of result alternatives to be returnd
export const PROFANITY_FILTER_FLAG = false
export const ENABLE_WORDTIME_OFFSETS = false
