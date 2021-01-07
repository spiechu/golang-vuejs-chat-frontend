<template>
    <div id="system-stats" class="text-monospace">
        Uptime {{ uptime }}, Users {{ usersCount }}, Sys {{ sys }} MB, TA {{ totalAlloc }} MB, GR {{ goRoutines }}
    </div>
</template>

<script>

import WebSocket from '../services/WebSocket';

export default {
    name: 'SystemStats',
    data() {
        return {
            uptime: '',
            usersCount: '',
            sys: '',
            totalAlloc: '',
            goRoutines: '',
        }
    },
    created() {
        let that = this;

        WebSocket.listenToMessages(function (message) {
            if (message.type !== 2) {
                return;
            }

            let innerObject = JSON.parse(message.body);

            that.uptime = innerObject.ServerStartedAt;
            that.usersCount = innerObject.ActiveUsersCount;
            that.sys = innerObject.Sys;
            that.totalAlloc = innerObject.TotalAlloc;
            that.goRoutines = innerObject.NumGoRoutines;
        });
    },
}
</script>

<style scoped>
#system-stats {
    font-size: 10pt;
}
</style>
