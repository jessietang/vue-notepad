<template>
    <div id="app">
         <!--使用v-on绑定自定义事件-->
        <!--<n-header v-on:tools="changePages"></n-header>-->
        <n-header @tools="changePages"></n-header>
        <section class="container">
            <n-add></n-add>
            <n-list></n-list>
            <n-sidebar :is-show="tools" @cleardialog="clearData" @opentable="openTable"></n-sidebar>
        </section>
        <n-dialog :is-show="dialog" :msg="tips" @cancel="cancelDialog" @sure="sureDialog"></n-dialog>
        <!--<n-dialog v-bind:is-show="dialog" v-bind:msg="tips" v-on:cancel="cancelDialog" v-on:sure="sureDialog"></n-dialog>-->
        <n-table :is-show="table" @deletedialog="deleteDialog"></n-table>
    </div>
</template>

<script>
    import nHeader from './components/header.vue';
    import nAdd from './components/event_add.vue';
    import nTable from './components/event_table.vue';
    import nList from './components/event_list.vue';
    import nSidebar from './components/sidebar.vue';
    import nDialog from './components/dialog.vue';

    export default {
        data() {
            return {
                tools: false,
                dialog: false,
                dialog_type: '',
                tips: '',
                table: false,
                del_info: {
                    index: 0,
                    id: 0
                }
            }
        },
        components: {
            nHeader,
            nAdd,
            nSidebar,
            nDialog,
            nTable,
            nList
        },
        methods: {
            changePages(){
                if(this.table){
                    this.table = !this.table;
                }else{
                    this.tools = !this.tools
                }
            },
            clearData(){
                this.dialog = true;
                this.dialog_type = 'clear';
                this.tips = '清空后无法恢复，确认清空吗？';
            },
            cancelDialog(){
                this.dialog = false;
            },
            sureDialog(){
                const self = this;
                switch(self.dialog_type){
                    case 'clear':
                        self.$store.dispatch('eventClear');
                        break;
                    case 'delete':
                        self.$store.dispatch('eventDelete',self.del_info);
                        break;
                }

                this.dialog = false;

            },
            openTable(){
                this.table = true;
            },
            deleteDialog(index, id){
                this.dialog = true;
                this.dialog_type = 'delete';
                this.tips = '删除后无法恢复，确认删除吗？';
                this.del_info = {
                    index: index,
                    id: id
                }
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    html,body,ul,li,input{
        margin:0;
        padding:0;
    }
    body{
        font-size: 16px;
        font-family: "Helvetica Neue", Helvetica, "microsoft yahei", arial, STHeiTi, sans-serif;
    }
    input,button{
        -webkit-tap-highlight-color: transparent;
    }
    input[type=text]{
        -webkit-appearance: none;
    }
    button{
        padding:7px 0;
        outline: none;
        text-align: center;
        border-radius: 4px;
        box-sizing: border-box;
        font:{
            size:inherit;
            family: inherit;
        }
        cursor: pointer;
    }
    body,#app{
        width:100%;
        overflow-x: hidden;
    }
    ul{
        list-style: none;
    }
    .container{
        width:100%;
        padding: 0 10px;
        max-width:800px;
        margin:auto;
        box-sizing: border-box;
        &.hide{
            display: none;
        }
    }


</style>
