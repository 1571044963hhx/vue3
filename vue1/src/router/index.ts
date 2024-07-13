import {createRouter,createWebHashHistory} from 'vue-router'
import { addrouter } from './routes'
import {constantRoute} from './routes'

let router = createRouter({
    history:createWebHashHistory(),
    routes:[...constantRoute,addrouter],
    scrollBehavior(){
        return{
            left:0,
            top:0
        }
    }
})
export default router