<template>
    <b-container>
        <b-row class="justify-content-md-center mt-sm-2" align-h="start">
            <b-col>
                <SetName/>
            </b-col>
            <b-col>
                <SystemStats/>
            </b-col>
        </b-row>
        <b-row class="justify-content-md-center mt-sm-2" align-h="center">
            <b-col>
                <MessageBox/>
            </b-col>
        </b-row>
        <b-row class="justify-content-md-center mt-sm-2" align-h="bottom">
            <b-col>
                <SendMessage/>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import SetName from './components/SetName.vue'
import SystemStats from './components/SystemStats.vue'
import SendMessage from './components/SendMessage.vue'
import MessageBox from './components/MessageBox.vue'

export default {
    name: 'App',
    components: {
        SetName,
        SystemStats,
        SendMessage,
        MessageBox,
    },
}
</script>

<style>

</style>
