<template>
    <b-form inline @submit="onSubmit">
        <b-input-group class="w-100">
            <b-form-input
                ref="send_message"
                id="send_message"
                v-model="message"
                type="text"
                placeholder="Napisz wiadomość..."
                required
            ></b-form-input>
            <b-input-group-append>
                <b-button type="submit" variant="primary">Wyślij</b-button>
            </b-input-group-append>
        </b-input-group>
    </b-form>
</template>

<script>

import WebSocket from '../services/WebSocket';

export default {
    name: 'SendMessage',
    data() {
        return {
            message: '',
        }
    },
    mounted() {
        this.focusInput();
    },
    methods: {
        onSubmit(event) {
            event.preventDefault()

            WebSocket.sendMessage(this.message);

            this.message = '';
        },
        focusInput() {
            this.$refs.send_message.$el.focus();
        },
    },
}
</script>

<style scoped>

</style>
