<template>
    <b-form inline @submit="onSubmit">
        <b-input-group>
            <b-form-input
                id="set_name"
                v-model="message"
                type="text"
                placeholder="Wpisz imię..."
                class="mb-2 mb-sm-0"
                required
            ></b-form-input>
            <b-input-group-append>
                <b-button type="submit" variant="primary">Ustaw</b-button>
            </b-input-group-append>
        </b-input-group>
    </b-form>
</template>

<script>

import WebSocket from '../services/WebSocket';

export default {
    name: 'SetName',
    data() {
        return {
            message: '',
        }
    },
    mounted() {
        let that = this;

        WebSocket.listenToMessages(function (message) {
            if (message.type !== 4) {
                return;
            }

            that.message = message.sender;
        });
    },
    methods: {
        onSubmit(event) {
            event.preventDefault()

            WebSocket.setName(this.message);
        },
    },
}
</script>

<style scoped>

</style>
