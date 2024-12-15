const Alexa = require('ask-sdk-core');
const permissions = require('./permissions');
const messages = require('./constants');
const logic = require('./api-connection');

const LaunchRequest = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.speak(messages.WELCOME_MSG)
            .reprompt(messages.WHAT_DO_YOU_WANT)
            .getResponse();
    },
};

const EnterWorkIntent = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'EnterWorkIntent'
        );
    },
    async handle(handlerInput) {
        const person = handlerInput.requestEnvelope.context.System.person;
        console.log('recieved person', person);
        const consentToken = handlerInput.requestEnvelope.context.System.apiAccessToken;
        console.log('access token recieved', consentToken);
       
        if (person) {
            const personId = person.personId;
            console.log("Received personId: ", personId);
            
        } else {
            return handlerInput.responseBuilder
                .speak(messages.PROFILE_NOT_RECOGNIZED)
                .reprompt(messages.PROFILE_NOT_RECOGNIZED)
                .getResponse();
        }

        try {
            const client = handlerInput.serviceClientFactory.getUpsServiceClient();
            const profileName = await client.getPersonsProfileName();
            console.log("recieved person name", profileName);
            
            let response;
            if (profileName == null) {
                response = handlerInput.responseBuilder.speak(messages.NAME_MISSING)
                    .getResponse();
            } else {
                const clockInResponse = await logic.getClockIn(profileName);
                console.log(JSON.stringify(clockInResponse));
                const speechText = `${clockInResponse}`;
                response = handlerInput.responseBuilder.speak(speechText)
                    .getResponse();
            }
            return response;
        } catch (error) {
            if (error.name !== 'ServiceError') {
                const response = handlerInput.responseBuilder.speak(messages.ERROR).getResponse();
                return response;
            }
            throw error;
        }
    }
};

const LeaveWorkIntent = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'LeaveWorkIntent'
        );
    },
    async handle(handlerInput) {
        const person = handlerInput.requestEnvelope.context.System.person;
        const consentToken = handlerInput.requestEnvelope.context.System.apiAccessToken;
        
        if (person) {
            const personId = person.personId;
            console.log("Received personId: ", personId);
        } else {
            return handlerInput.responseBuilder
                .speak(messages.PROFILE_NOT_RECOGNIZED)
                .reprompt(messages.PROFILE_NOT_RECOGNIZED)
                .getResponse();
        }

        try {
            const client = handlerInput.serviceClientFactory.getUpsServiceClient();
            console.log('Given name successfully retrieved, now responding to user.', client);
            const profileName = await client.getPersonsProfileName();
            console.log("recieved given name", profileName);

            let response;
            if (profileName == null) {
                response = handlerInput.responseBuilder.speak(messages.NAME_MISSING)
                    .getResponse();
            } else {
                const clockOutResponse = await logic.getClockOut(profileName);
                console.log(JSON.stringify(clockOutResponse));
                const speechText = `${clockOutResponse}`;
                response = handlerInput.responseBuilder.speak(speechText)
                    .getResponse();
            }
            return response;
        } catch (error) {
            if (error.name !== 'ServiceError') {
                const response = handlerInput.responseBuilder.speak(messages.ERROR).getResponse();
                return response;
            }
            throw error;
        }
    }
};

const SessionEndedRequest = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const UnhandledIntent = {
    canHandle() {
        return true;
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(messages.UNHANDLED)
            .reprompt(messages.UNHANDLED)
            .getResponse();
    },
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {

        return handlerInput.responseBuilder
            .speak(messages.UNHANDLED)
            .reprompt(messages.UNHANDLED)
            .getResponse();
    },    
};


const HelpIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(messages.HELP_MSG)
            .reprompt(messages.HELP_MSG)
            .getResponse();
    },
};

const CancelIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.CancelIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(messages.GOODBYE)
            .getResponse();
    },
};

const StopIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.StopIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(messages.STOP)
            .getResponse();
    },
};

const ProfileError = {
    canHandle(handlerInput, error) {
        return error.name === 'ServiceError';
    },
    handle(handlerInput, error) {
        if (error.statusCode === 403) {
            return handlerInput.responseBuilder
                .speak(messages.NOTIFY_MISSING_PERMISSIONS)
                .withAskForPermissionsConsentCard(permissions.NAME_PERMISSIONS)
                .getResponse();
        }
        return handlerInput.responseBuilder
            .speak(messages.API_FAILURE)
            .reprompt(messages.API_FAILURE)
            .getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Esta skill no acepta este tipo de peticiones, porfavor, puede preguntar para fichar o desfichar';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequest,
        EnterWorkIntent,
        LeaveWorkIntent,
        SessionEndedRequest,
        HelpIntent,
        CancelIntent,
        StopIntent,
        UnhandledIntent,
        FallbackIntentHandler
    )
    .addErrorHandlers(
        ProfileError,
        ErrorHandler
    )
    .withApiClient(new Alexa.DefaultApiClient())
    .withCustomUserAgent('sample/fichaje-semic/v1.2')
    .lambda();