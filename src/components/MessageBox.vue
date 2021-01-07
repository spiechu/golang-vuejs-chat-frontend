<template>
    <div>
        <Chat class="message-box"
            :participants="participants"
            :myself="myself"
            :messages="messages"
            :chat-title="chatTitle"
            :placeholder="placeholder"
            :colors="colors"
            :border-style="borderStyle"
            :hide-close-button="hideCloseButton"
            :close-button-icon-size="closeButtonIconSize"
            :submit-icon-size="submitIconSize"
            :submit-image-icon-size="submitImageIconSize"
            :load-more-messages="toLoad.length > 0 ? loadMoreMessages : null"
            :async-mode="asyncMode"
            :scroll-bottom="scrollBottom"
            :display-header="true"
            :send-images="false"
            :profile-picture-config="profilePictureConfig"
            :timestamp-config="timestampConfig"
            :link-options="linkOptions"
            :accept-image-types="'.png, .jpeg'"
            @onImageClicked="onImageClicked"
            @onImageSelected="onImageSelected"
            @onMessageSubmit="onMessageSubmit"
            @onType="onType"
            @onClose="onClose"/>
    </div>
</template>

<script>

import WebSocket from '../services/WebSocket';
import {Chat} from 'vue-quick-chat'
import 'vue-quick-chat/dist/vue-quick-chat.css';

export default {
    components: {
        Chat,
    },
    name: 'MessageBox',
    data() {
        return {
            participants: [],
            myself: {},
            messages: [],
            chatTitle: 'Najprostszy chat napisany w GO + VueJS',
            placeholder: '',
            colors: {
                header: {
                    bg: '#d30303',
                    text: '#fff'
                },
                message: {
                    myself: {
                        bg: '#fff',
                        text: '#bdb8b8'
                    },
                    others: {
                        bg: '#fb4141',
                        text: '#fff'
                    },
                    messagesDisplay: {
                        bg: '#f7f3f3'
                    }
                },
                submitIcon: '#b91010',
                submitImageIcon: '#b91010',
            },
            borderStyle: {
                topLeft: "10px",
                topRight: "10px",
                bottomLeft: "10px",
                bottomRight: "10px",
            },
            hideCloseButton: true,
            submitIconSize: 0,
            submitImageIconSize: 0,
            closeButtonIconSize: "0px",
            asyncMode: false,
            toLoad: [],
            scrollBottom: {
                messageSent: true,
                messageReceived: true,
            },
            displayHeader: true,
            profilePictureConfig: {
                others: true,
                myself: true,
                styles: {
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%'
                }
            },
            timestampConfig: {
                format: 'HH:mm',
                relative: false
            },
            // there are other options, you can check them here
            // https://soapbox.github.io/linkifyjs/docs/options.html
            linkOptions: {
                myself: {
                    className: 'myLinkClass',
                    events: {
                        click: function (e) {
                            alert('Link clicked!');
                            console.log(e);
                        },
                        mouseover: function (e) {
                            alert('Link hovered!');
                            console.log(e);
                        }
                    },
                    format: function (value, type) {
                        if (type === 'url' && value.length > 50) {
                            value = value.slice(0, 50) + '…';
                        }
                        return value;
                    }
                },
                others: {
                    className: 'othersLinkClass',
                    events: {
                        click: function (e) {
                            alert('Link clicked!');
                            console.log(e);
                        },
                        mouseover: function (e) {
                            alert('Link hovered!');
                            console.log(e);
                        }
                    },
                    format: function (value, type) {
                        if (type === 'url' && value.length > 50) {
                            value = value.slice(0, 50) + '…';
                        }
                        return value;
                    }
                }
            }
        }
    },
    methods: {
        onType: function (event) {
            console.log('on type');
            console.log(event);
        },
        loadMoreMessages(resolve) {
            setTimeout(() => {
                resolve(this.toLoad); //We end the loading state and add the messages
                //Make sure the loaded messages are also added to our local messages copy or they will be lost
                this.messages.unshift(...this.toLoad);
                this.toLoad = [];
            }, 1000);
        },
        onMessageSubmit: function (message) {
            /*
            * example simulating an upload callback.
            * It's important to notice that even when your message wasn't send
            * yet to the server you have to add the message into the array
            */
            this.messages.push(message);

            /*
            * you can update message state after the server response
            */
            // timeout simulating the request
            setTimeout(() => {
                message.uploaded = true
            }, 2000)
        },
        onClose() {
            this.visible = false;
        },
        onImageSelected(files, message) {
            let src = 'https://149364066.v2.pressablecdn.com/wp-content/uploads/2017/03/vue.jpg'
            this.messages.push(message);
            /**
             * This timeout simulates a requisition that uploads the image file to the server.
             * It's up to you implement the request and deal with the response in order to
             * update the message status and the message URL
             */
            setTimeout((res) => {
                message.uploaded = true
                message.src = res.src
            }, 3000, {src});
        },
        onImageClicked(message) {
            /**
             * This is the callback function that is going to be executed when some image is clicked.
             * You can add your code here to do whatever you need with the image clicked. A common situation is to display the image clicked in full screen.
             */
            console.log('Image clicked', message.src)
        }
    },
    created() {
        let that = this;
        //   let counter = 1;

        WebSocket.listenToMessages(function (message) {
            if (message.type === 4) {
                that.myself = {
                    name: message.sender,
                    id: message.senderID,
                    profilePicture: 'https://cdn0.iconfinder.com/data/icons/unigrid-flat-human-vol-2/90/011_101_anonymous_anonym_hacker_vendetta_user_human_avatar-512.png'
                };

                return;
            }

            if (message.type === 3) {
                let participants = [];
                let innerData = JSON.parse(message.body);

                for (const [key, value] of Object.entries(innerData)) {
                    if (key == that.myself.id) {
                        continue;
                    }

                    participants.push({
                        name: value,
                        id: parseInt(key, 10),
                        profilePicture: 'https://cdn0.iconfinder.com/data/icons/unigrid-flat-human-vol-2/90/011_101_anonymous_anonym_hacker_vendetta_user_human_avatar-512.png'
                    });
                }

                that.participants = participants;

                return;
            }

            if (!(message.type === 0 || message.type === 1)) {
                return;
            }

            if (message.type === 0) {
                console.log(that.myself.id);
                console.log(message.senderID);

                that.messages.push({
                    content: message.body,
                    myself: that.myself.id == message.senderID,
                    participantId: message.senderID,
                    timestamp: new Date().toISOString(),
                    type: 'text'
                });

                return;
            }

            if (message.type === 1) {
                that.messages.push({
                    content: message.body,
                    myself: that.myself.id == message.senderID,
                    participantId: message.senderID,
                    timestamp: new Date().toISOString(),
                    type: 'text'
                });
            }
        });
    },
}
</script>

<style scoped>
.message-box {
    max-height: 500px;
}

.message-box >>> .message-container {
    height: 500px;
}
</style>
