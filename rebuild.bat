REM call phonegap plugin remove cordova.android.speech.plugin
REM call phonegap plugin add ../androidSpeech

REM call phonegap plugin remove cordova.android.tts.plugin
REM call phonegap plugin add ../androidTTS

call phonegap plugin remove cordova.android.sms.plugin
REM call phonegap plugin remove com.red_folder.phonegap.plugin.backgroundservice
REM call phonegap plugin add https://github.com/Red-Folder/bgs-core.git
call phonegap plugin add ../androidSMS

adb uninstall fr.omegasolutions.jarvis
phonegap build && phonegap run --verbose