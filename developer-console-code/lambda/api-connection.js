const axios = require('axios');
const { parseString } = require('xml2js');

module.exports = {
    getClockIn(profileName){
        let data = `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:djan="django.soap.clocking">
                <soapenv:Header/>
                <soapenv:Body>
                    <djan:clockIn>
                        <djan:token>Put your token here</djan:token>
                        <djan:name>${profileName}</djan:name>
                    </djan:clockIn>
                </soapenv:Body>
            </soapenv:Envelope>`;

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://fichajesemic.herokuapp.com/api/clocking/soap_service/',
            headers: { 
                'Content-Type': 'application/xml'
            },
            data: data
        };

        return axios.request(config)
            .then((response) => {
                return new Promise((resolve, reject) => {
                 parseString(response.data, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                      const clockInResponse = result['soap11env:Envelope']['soap11env:Body'][0]['tns:clockInResponse'][0]['tns:clockInResult'][0]['s0:response'][0];
                      resolve(clockInResponse);
                    }
                 });
              });
            })
            .catch((error) => {
                console.log(error);
            });
    },
    
    getClockOut(profileName) {
        let data = `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:djan="django.soap.clocking">
                <soapenv:Header/>
                <soapenv:Body>
                    <djan:clockOut>
                        <djan:token>Put your token here</djan:token>
                        <djan:name>${profileName}</djan:name>
                    </djan:clockOut>
                </soapenv:Body>
            </soapenv:Envelope>`;

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://fichajesemic.herokuapp.com/api/clocking/soap_service/',
            headers: { 
                'Content-Type': 'application/xml'
            },
            data: data
        };
        
        return axios.request(config)
            .then((response) => {
                return new Promise((resolve, reject) => {
                 parseString(response.data, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                      const clockOutResponse = result['soap11env:Envelope']['soap11env:Body'][0]['tns:clockOutResponse'][0]['tns:clockOutResult'][0]['s0:response'][0];
                      resolve(clockOutResponse);
                    }
                 });
              });
            })
            .catch((error) => {
                console.log(error);
            });

    },

}
