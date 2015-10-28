call phonegap plugin remove cordova.android.tts.plugin
call phonegap plugin add ../androidTTS
call phonegap plugin remove cordova.android.speech.plugin
call phonegap plugin add ../androidSpeech
adb uninstall fr.omegasolutions.jarvis
phonegap build && phonegap run --verbose