cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "runs": true
    },
    {
        "file": "plugins/cordova.android.speech.plugin/www/androidSpeech.js",
        "id": "cordova.android.speech.plugin.androidSpeech",
        "clobbers": [
            "cordova.plugins.androidSpeech"
        ]
    },
    {
        "file": "plugins/cordova.android.tts.plugin/www/androidTTS.js",
        "id": "cordova.android.tts.plugin.androidTTS",
        "clobbers": [
            "cordova.plugins.androidTTS"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.0.0",
    "cordova.android.speech.plugin": "0.1",
    "cordova.android.tts.plugin": "0.1"
}
// BOTTOM OF METADATA
});