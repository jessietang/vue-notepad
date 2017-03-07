<template>
    <div class="event-content">
        <div class="event-tab" @click="changeCollapse(0, $event)">未完成
            <span :class="{'close-span':!collapse[0].show}"></span>
        </div>
        <div class="event-box" :style="{'height':'auto','display':'block'}">
            <ul>
                <li class="event-list" v-for="item in getTodo">
                    <input type="checkbox" @click="moveDone(item.id)">
                    <div>{{item.content}}</div>
                    <button class="cancel-btn" @click="moveCancel(item.id)">取消</button>
                </li>
            </ul>
        </div>

        <div class="event-tab" @click="changeCollapse(1, $event)">已完成
            <span :class="{'close-span':!collapse[1].show}"></span>
        </div>
        <div class="event-box">
            <ul>
                <li class="event-list" v-for="item in getDone">
                    <input type="checkbox" checked @click="moveTodo(item.id)">
                    <div>{{item.content}}</div>
                    <span class="event-time">{{item.time}}</span>
                </li>
            </ul>
        </div>

        <div class="event-tab" @click="changeCollapse(2, $event)">已取消
            <span :class="{'close-span':!collapse[2].show}"></span>
        </div>
        <div class="event-box">
            <ul>
                <li class="event-list" v-for="item in getCancel">
                    <div class="event-delete">{{item.content}}</div>
                    <button class="cancel-btn" @click="moveTodo(item.id)">恢复</button>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                collapse: [
                    {show: true},/*true表示是展开的*/
                    {show: true},
                    {show: true}
                ]
            }
        },
        computed: {
            getTodo() {
                let self = this;
                return self.$store.state.events.filter(function(obj){
                    if(obj.type === 1){
                        return obj;
                    }
                });
            },
            getDone() {
                let self = this;
                return self.$store.state.events.filter((obj) => obj.type === 2)
            },
            getCancel() {
                let self = this;
                return self.$store.state.events.filter((obj) => obj.type === 3)
            }
        },
        methods: {
            changeCollapse(num ,event) {
                const show = this.collapse[num].show;
                if(show){
                    this.closeCollapse(event);
                }else{
                    this.openCollapse(event);
                }
                this.collapse[num].show = !show;
            },
            closeCollapse(event) {
                /*target：触发事件的元素。
                 currentTarget：事件绑定的元素。
                 两者在没有冒泡的情况下，是一样的值，但在用了事件委托的情况下，就不一样了*/
                /*nextSibling：节点的后一个节点，如果该节点是最后一个节点，则为null。
                注意有可能拿到的节点是文本节点[通过nodeType来判断]，与预期的不符，要进行处理一下。
                 nextElementSibling：返回后一个元素节点，后一个节点必须是Element，注意IE9以下浏览器不支持。*/
                let divElement = event.currentTarget.nextElementSibling,
                    ulElement = divElement.getElementsByTagName('ul')[0];

                /*难点一：点击折叠面板title,要动画实现sliderUp和sliderDown，但是div高度auto，使用transition： height .3s无效。
                 解决方法：点击时候获取div高度值，赋值给style.height，然后再改变高度为0，这样transition才会生效。*/

                // offsetHeight = height + border
                divElement.style.height = ulElement.offsetHeight + 'px';
                setTimeout(function(){
                    divElement.style.height = '0px';
                    setTimeout(function(){
                        divElement.style.display = 'none';
                    }, 300)
                }, 10)
            },
            openCollapse(event) {
                let divElement = event.currentTarget.nextElementSibling,
                    ulElement = divElement.getElementsByTagName('ul')[0];
                divElement.style.display = 'block';
                // offsetHeight = height + border
                divElement.style.height = ulElement.offsetHeight + 'px';
                setTimeout(function(){
                    divElement.style.height = 'auto';
                }, 300);
            },
            moveCancel(id) { // 移至已取消
                this.$store.dispatch('eventCancel', id)
            },
            moveDone(id) { // 移至已完成
                this.$store.dispatch('eventDone', id)
            },
            moveTodo(id){ // 移至未完成
                this.$store.dispatch('eventTodo', id)
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .event-content {
        .event-tab {
            position: relative;
            height: 44px;
            line-height: 44px;
            padding-left: 20px;
            border-bottom: 1px solid #fff;
            box-sizing: border-box;
            color: #fff;
            cursor: pointer;
            background: #00a2ff;
            span {
                position: absolute;
                right: 20px;
                top: 15px;
                width: 10px;
                height: 10px;
                content: '';
                border: {
                    top: 3px solid #fff;
                    right: 3px solid #fff;
                }
                transform: rotate(135deg);
                transition: transform .3s;
                &.close-span {
                    transform: rotate(45deg);
                }
            }
        }
        .event-box {
            list-style: none;
            overflow: hidden;
            border: {
                left: 1px solid #eee;
                right: 1px solid #eee;
            }
            transition: height .3s;
            .event-list {
                position: relative;
                min-height: 44px;
                line-height: 25px;
                padding: 10px 100px 10px 50px;
                box-sizing: border-box;
                border-bottom: 1px solid #eee;
                input[type=checkbox] {
                    position: absolute;
                    left: 15px;
                    top: 12px;
                    width: 20px;
                    height: 20px;
                }
                .cancel-btn {
                    position: absolute;
                    right: 10px;
                    top: 7px;
                    width: 50px;
                    height: 30px;
                    line-height: 30px;
                    padding: 0;
                    background: #fff;
                    border: 1px solid #c0ccda;
                    color: #1f2d3d;
                    font-size: 12px;
                }
                .event-time {
                    position: absolute;
                    right: 10px;
                    top: 0;
                    line-height: 44px;
                    font-size: 12px;
                    color: #aaa;
                }
                .event-delete {
                    text-decoration: line-through;
                    color: #999;

                }
            }
        }
    }
</style>
