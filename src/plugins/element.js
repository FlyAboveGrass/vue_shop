import Vue from 'vue'
import { 
    Button, Form, FormItem, Input, Avatar,
    Message
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Avatar)

// element的消息弹窗组件
Vue.prototype.$message = Message
Vue.component(Message.name, Message) // Vue.use(Message)的方式会让页面刷新也触发一次message

