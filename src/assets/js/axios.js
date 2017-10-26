import axios from 'axios';
import qs from 'qs'
import store from '@/vuex/store';


const $axios = (url, config, callback, method = "get") => {
    const options = {
        method,
        url,
    }
    if (method === 'get') {
        options.params = config
    } else if (method === 'post') {
        options.data = qs.stringify(config)
    }

    axios(options).then((response) => {
        const res = response.data;

        // 账号未登录
        if (res.status == '102002') {
            store.state.endday = 0
            window.location.hash = "/login";
            return;
        };
        // 账号首次登录
        if (res.status == '102005') {
            store.state.firstlogin = true;
            return;
        };

        callback(response)
    }).catch(function(err) {
        console.log(err);
    });;
}
export default $axios;