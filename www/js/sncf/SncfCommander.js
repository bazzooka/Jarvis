import commands from './commands.json';
import agent from 'superagent';

import { authentification } from './auth';

const SNCF_BASE_URL = `https://api.sncf.com/v1/coverage/sncf`;

let SncfCommander = {
  baseUrl: `https://132359bd-1767-4aaa-971a-2c4cddcd6f7f:@api.sncf.com/v1/`,
  code: "50914410",
  repeatInterval: null,

  getFinalUrl: function() {
    return (this.baseUrl);
  },

  getCommandes(){
    return commands.commandes;
  },

  loadPlugin: function() {
    return {
      commands: commands.commandes,
      module: "sncf"
    }
  },

  getPosition: function(params) {
    return new Promise((resolve, reject) => {
      agent('GET', `${SNCF_BASE_URL}/places`)
      .auth(authentification.login, authentification.pass)
      .query({q: params.text})
      .end((err, res) => {
        // Pas de places
        if(!res.body.places || res.body.places.length === 0){
          reject(new Error('no places'));
        }
        if(!params.onlyStop){
          resolve(res.body.places[0]);
        } else {
          for(let i = 0, l = res.body.places.length; i < l; i++){
            if(res.body.places[i]['embedded_type'] === 'stop_area'){
              resolve(res.body.places[i]);
              return true;
            }
          }
          resolve(res.body.places[0]);
        }
      })
    });
  },

  getJourney: function(params){
    let me = this;
    return new Promise ( (resolve, reject) => {
      agent('GET', `${SNCF_BASE_URL}/journeys`)
      .auth(authentification.login, authentification.pass)
      .query({from: params.depart})
      .query({to: params.destination})
      .query({datetime: params.datetime})
      .end((err,res) => {
        if(err){
          return reject(err);
        }
        if(res.body.journeys.length > 0){
          const journey = res.body.journey[0];
          let speak =
          let response = {
            speak: `Monsieur j'ai un départ prévu pour ${me.getTimeFromSncf(journey.departure_date_time).hour} heure ${me.getTimeFromSncf(journey.departure_date_time).minute}`;

          }
          return resolve(res.body);
        }

      })
    })
  },

  padLeft: function(text, paddingSize, paddingText){
    let str = text.toString();
    while (str.length < paddingSize){
      str = paddingText + str;
    }
    return str;
  },

  getTimeFromSncf: function(d){
    return {
      year: d.slice(0, 4),
      month: d.slice(4, 6),
      day: d.slice(6, 8),
      hour: d.slice(9, 11),
      minute: d.slice(11, 13),
      second: d.slice(13, 15)
    }
  },

  formatSncfName: function(name){
    const nom = name.match(/(.*)(\(.*\))/i);

    if(nom.length === 1){
      return nom[0];
    }
    return nom[1];
  },

  // sendCommand: function(callback, key, repeat = 1){
  executeCommande: function(command, order, callback) {
    const d = new Date();
    let start = "",
    finish = "";
    // switch (command.com.id) {
    //   case "sncf_hor_depart":
    //     const datetime = `${d.getFullYear()}${this.padLeft(d.getMonth()+1, 2, '0')}${this.padLeft(d.getDate(), 2, '0')}T${this.padLeft(d.getHours(), 2, '0')}${this.padLeft(d.getMinutes(), 2, '0')}00`;
    //     Promise.all([
    //       this.getPosition({text: command.parameters.text[0], onlyStop: true}),
    //       this.getPosition({text: command.parameters.text[1], onlyStop: true})
    //     ]).then((results) => {
    //       start = results[1];
    //       finish = results[0];
    //       return this.getJourney({depart: results[1], destination: results[0], datetime: datetime})
    //     }).then((res) => {
    //       console.log(res);
    //       const
    //         startTime = this.getTimeFromSncf(res.journeys[0].departure_date_time),
    //         endTime = this.getTimeFromSncf(res.journeys[0].arrival_date_time);
    //
    //       callback(null, `Monieur, votre train partira de ${this.formatSncfName(start.name)} à ${startTime.hour} heure ${startTime.minute} et arrivera à ${this.formatSncfName(finish.name)} à ${endTime.hour} heure ${endTime.minute}`);
    //     })
    //     break;
    // }
  },

  executeCommand: function(command, params){
    const d = new Date();
    const datetime = `${d.getFullYear()}${this.padLeft(d.getMonth()+1, 2, '0')}${this.padLeft(d.getDate(), 2, '0')}T${this.padLeft(d.getHours(), 2, '0')}${this.padLeft(d.getMinutes(), 2, '0')}00`;
    if('nextTrainFromTo' === command){
      return this.getJourney({
        depart: params.result.parameters.origin,
        destination: params.result.parameters.target,
        datetime: datetime
      })
    }
  },
};

module.exports = SncfCommander;
