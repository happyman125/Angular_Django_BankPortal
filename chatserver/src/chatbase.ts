/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as dotenv from 'dotenv';
const c = require('@google/chatbase'); 

dotenv.config();

export class Chatbase {
    private chatbaseApiKey: string;
    private chatbaseVersion: string;
    private chatbasePlatform: string;
    private chatbaseName: string;

    constructor() {
        this.chatbaseApiKey = process.env.MY_CHATBASE_KEY;
        this.chatbaseVersion = process.env.MY_CHATBASE_VERSION;
        this.chatbasePlatform = 'Web';
        this.chatbaseName = process.env.MY_CHATBASE_BOT_NAME;

        c.setVersion(this.chatbaseVersion);
        c.setPlatform(this.chatbasePlatform);
        c.setApiKey(this.chatbaseApiKey, this.chatbaseName);
    }

    /**
     * Log the User Msg in Chatbase
     * @param {Object} Finetuned response object retrieved from Dialogflow
     */
    public logUserChatbase(response: any) {
        if (response.isFallback) {
            c.newMessage()
            .setTimestamp(response.posted)
            .setAsTypeUser()
            .setMessage(response.text)
            .setIntent(response.intentName)
            .setUserId('user-' + response.session)
            .setCustomSessionId(response.session)
            .setAsHandled()
            .send()
            .then(msg => console.log(msg.getCreateResponse()))
            .catch(err => console.error('user', err));
        } else {
            c.newMessage()
            .setTimestamp(response.posted)
            .setAsTypeUser()
            .setMessage(response.text)
            .setIntent(response.intentName)
            .setUserId('user-' + response.session)
            .setCustomSessionId(response.session)
            .setAsNotHandled()
            .send()
            .then(msg => console.log(msg.getCreateResponse()))
            .catch(err => console.error('user', err));
        }
    }
    /**
     * Log the Chatbot Answer in Chatbase
     * @param {Object} Finetuned response object retrieved from Dialogflow
     */
    public logBotChatbase(response: any) {
        c.newMessage()
        .setTimestamp(response.posted)
        .setAsTypeAgent()
        .setMessage(response.intent)
        .setCustomSessionId(response.session)
        .setUserId('user-' + response.session)
        .setAsHandled()
        .send()
        .then(msg => {
            console.log(msg);
        })
        .catch(err => console.error('bot', err));
    }
}

export let chatbase = new Chatbase();