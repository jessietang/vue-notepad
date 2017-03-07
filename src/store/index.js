import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const getDtate = () => {
    const date = new Date(),
        month = date.getMonth() + 1;
    return date.getFullYear() + '-' + month + '-' + date.getDate();

}

const localEvents = function(item){
    this.get = function(){
        return JSON.parse(localStorage.getItem(item))
    }
    this.set = function(obj){
        localStorage.setItem(item,JSON.stringify(obj))
    }
    this.clear = function(){
        localStorage.removeItem(item)
    }
}

const local = new localEvents('myNotes');

const state = local.get() || {
    events: [],
    count: 0
}

const mutations = {
    ADD_EVENT(state, obj){
        state.count++;
        obj.id = state.count;
        state.events.unshift(obj);
        local.set(state); // 把整个state存储在本地
        console.log(local.get());
    },
    EVENT_CANCEL(state, id){
        for(let i=0; i<state.events.length; i++){
            if(state.events[i].id === id){
                state.events[i].type = 3;
                var item = state.events[i];
                state.events.splice(i,1);
                break;
            }
        }
        state.events.unshift(item);
        local.set(state);
    },
    EVENT_DONE(state,id){
        for(let i=0; i<state.events.length; i++){
            if(state.events[i].id === id){
                state.events[i].type = 2;
                state.events[i].time = getDtate();
                var item = state.events[i];
                state.events.splice(i, 1);
                break;
            }
        }
        state.events.unshift(item);
        local.set(state);
    },
    EVENT_TODO(state,id){
        for(let i=0; i<state.events.length; i++){
            if(state.events[i].id === id){
                state.events[i].type = 1;
                var item = state.events[1];
                state.events.splice(i,1);
                break;
            }
        }
        state.events.unshift(item);
        local.set(state);
    },
    EVENT_CLEAR(state){
        state.events = []; //最开始没有写这个，然后点击清除后页面还是之前的样子，刷新页面才会清除
        local.clear();
    },
    EVENT_DELETE(state,info){
        state.events.filter(function(obj,i){
            if(obj.id === info.id){
                state.events.splice(i,1);
            }
        });
        local.set(state);
    },
    EDITDATA(state,info){
        state.events.filter(function(d){
            if(d.id === info.id){
                d.content = info.content;
            }
        })
        local.set(state);
    }
}

const actions = {
    addEvent({commit},obj){
        commit('ADD_EVENT', obj)
    },
    eventCancel({commit},id){
        commit('EVENT_CANCEL', id)
    },
    eventDone({commit},id){
        commit('EVENT_DONE', id)
    },
    eventTodo({commit}, id){
        commit('EVENT_TODO', id)
    },
    eventClear({commit}){
        commit('EVENT_CLEAR')
    },
    eventDelete({commit},info){
        commit('EVENT_DELETE', info)
    },
    editData({commit},info){
        commit('EDITDATA', info)
    }
}

export default new Vuex.Store({
    state,
    mutations,
    actions
})
