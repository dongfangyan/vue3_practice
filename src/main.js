import { createApp, createRenderer, h } from 'vue'
import App from './App.vue'
import './index.css'
import CanvasApp from './CanvasApp.vue'
import EditTodo from './components/todos/EditTodo.vue'
import Todos from './components/todos/Todos.vue'
import Dashboard from './components/Dashboard.vue'
import NotFound from './components/NotFound.vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { createStore } from 'vuex'

const router = createRouter({
    mode: 'history',
    history: createWebHistory('/base-directory'),
    routes: [
        {path: '/',component: Dashboard},
        {path: '/todos',component: Todos},
        {path: '/:pathMatch(.*)*',name:"not-found", component: NotFound},
    ],
    scrollBehavior(to, from, savedPosition) {
        //{x:10, y:10} now{left:10, top:10}
        if(savedPosition) {
            return savedPosition
        } else {
            return {top: 0}
        }
    }
})

const store = createStore({
    state() {
        return {
            count: 1
        }
    },
    mutations: {
        add(state) {
            state.count++;
        }
    }
})

//特性：动态路由
router.addRoute({
    path: '/about',
    name: 'about',
    component: () => import('./components/About.vue')
})

router.addRoute({
    path: '/about/info',
    component: {
        render() {
            return h('div', 'info page')
        }
    }
})

// composition


 createApp(App)
 .use(router)
 .use(store)
 .component('comp',{
   render () {
     return h('div', 'I am comp')
   }
 })
 .component('EditTodo',EditTodo)
 .directive('highlight',{
     beforeMount(el, bingding, vnode) {
         el.style.background = bingding.value
     }
 })
 .mount('#app')

//自定义渲染器
 const nodeOps = {
    createElement(tag){
       return {tag}
// // 处理元素创建逻辑
},
 insert(child, parent,anchor) {
// // 处理元素插入逻辑
// // 1.如果是子元素，不是真实dom，此时只需要将数据保存到前面虚拟对象上即可

 child.parent = parent
  if(!parent.childs) {
    parent.childs = [child]
} else{
        parent.childs.push(child)
     }
// //2.如果是真实dom元素，在这里会事canvas，需要绘制
 if (parent.nodeType == 1) {
  draw(child)
//    //事件处理
   if(child.onClick) {
     canvas.addEventListener('click', () => {
         child.onClick()
         setTimeout(() => {
            draw(child)
       }, 0);
     })
  }
}
 return
 },
     remove: child => {},
    createText: text => {},
    createComment: text => {},
    setText: (node, text) => {},
    setElementText: (el,text) => {},
    parentNode: node => {},
    nextSibling: node => {},
    querySelector: selector => {},
    setScopeId(el, id) {},
    cloneNode(el) {},
    insertStaticContent(content, parant, anchor, isSVG) {},
    patchProp(el,key,prevValue, nextValue) {
        //属性更新
        el[key] = nextValue
    }
}

const d2a = (n) => {
    return n * Math.PI / 180;
}

//绘制方法
const draw = (el,noClear) => {
    if(!noClear){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    if(el.tag == 'pieChart'){
        let { data, r, x, y} = el;
        let total = data.reduce((memo, current) => memo + current.count,0)
        let start = 0,
            end = 0;
        data.forEach(item => {
            end += item.count / total* 360;
            drawPieChart(start, end, item.color, x, y, r);
            drawPieChartText(item.name, (start+end) / 2, x, y, r);
            start = end;
        })
    }
    el.childs && el.childs.forEach(child => draw(child,true))
}

const drawPieChart = (start, end, color, cx, cy, r) => {
    let x = cx + Math.cos(d2a(start)) * r;
    let y = cy + Math.sin(d2a(start)) * r;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(x,y);
    ctx.arc(cx, cy, r, d2a(start), d2a(end), false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

const drawPieChartText = (val, position, cx, cy, r) => {
    ctx.beginPath();
    let x = cx + Math.cos(d2a(position)) * r/1.25 -20;
    let y = cy + Math.sin(d2a(position)) * r/1.25;
    ctx.fillStyle = "#000";
    ctx.font = '20px 微软雅黑';
    ctx.fillText(val,x,y)
    ctx.closePath();
}

const renderer = createRenderer (nodeOps)
// renderer.createApp(CanvasApp)
let ctx, canvas
function createCanvasApp (App){
    const app = renderer.createApp(App)
    const mount = app.mount
    app.mount = function(selector) {
        canvas = document.createElement('canvas')
        ctx = canvas.getContext('2d')
        canvas.width = 600
        canvas.height = 600
        document.querySelector(selector).appendChild(canvas)
        //执行默认mount
        mount(canvas) 
    }
    return app
}

createCanvasApp(CanvasApp).mount('#app')