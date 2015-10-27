call phonegap plugin remove cordova.android.tts.plugin
call phonegap plugin add ../androidTTS
adb uninstall fr.omegasolutions.jarvis
phonegap build && phonegap run --verbose