import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        endday:-1,
        eid:'',
        importclient:false,
        importseat:false,
        hash_code:'',  //线索导入的hashcode
        steponemark:true,
        steptwomark:false,
        stepthreemark:false,
        all:0,
        already:0,
        getper:null,
        changebox:false,
        firstlogin:false,
        closable:true,
        mask_closable:true,
        clientlist:[],
        clienttotal:0,
        seatlist:[],
        seattotal:0
    },
    actions: {
        
    },
    mutations: {
        
    },
    getters: {
       
    }
});