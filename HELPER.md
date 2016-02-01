## Launch recognize
- Commande :
> cordova.plugins.androidSpeech.startRecognize(function(){console.log(arguments);}, function(){console.log(arguments);}, 0, "Test", "fr-FR")

- Retour :
> ["augmenter le son de la télé","augmente le son de la télé","augmenter le son de la Télé","augmente le son de la Télé","augmentez le son de la télé"]

## Launch speak
> cordova.plugins.androidTTS.speak(function(){console.log(arguments);}, function(){console.log(arguments);}, "Bonjour")


curl 'https://api.api.ai/api/query?v=20150910&query=Comment%20%C3%A7a%20va%20%3F&lang=fr&sessionId=76807131-4a05-4895-9f6b-7a2791a371ed&timezone=Europe/Paris' -H 'Authorization:Bearer 554e644973a04516af4ed2ac336a377e' -H 'ocp-apim-subscription-key:84375a96-b0ff-4963-aa76-8e6340ed4894'
