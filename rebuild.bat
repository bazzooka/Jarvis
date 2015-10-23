REM call phonegap plugin remove cordova.android.tts.plugin
REM call phonegap plugin add ../androidTTS &
adb uninstall fr.omegasolutions.jarvis
phonegap build && phonegap run --verbose