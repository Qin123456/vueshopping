import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Header, Aside, Main, Container, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Col, Row, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Container)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(Tag)
