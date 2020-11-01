import Vue from 'vue'
import { Button, Form, FormItem, Avatar, Input, Message, Container, Header,
            Aside, Main, Menu, Submenu, MenuItemGroup, MenuItem, Breadcrumb,
            BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination,
            Dialog, MessageBox, Tag, Tree, Select, Option, Cascader, Alert, Tabs, TabPane,
            Step, Steps, Checkbox, CheckboxGroup, Upload,
            Timeline, TimelineItem 
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Avatar)
Vue.use(Input)

// 页面的主体布局
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)

Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)

// 将弹框组件全局挂在到Vue原形实例
Vue.prototype.$message = Message
Vue.component(Message.name, Message) // Vue.use(Message)的方式会让页面刷新也触发一次message

// 确认框
Vue.prototype.$confirm = MessageBox.confirm
Vue.component(MessageBox.name, MessageBox)
