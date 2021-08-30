<template>
    <div>
      <!-- 新增todo -->
      <EditTodo
      v-model:todo-title="newTodo"
      @keyup.enter.stop = "addTodo"
      autofocus
      placeholder="新增今日待办"
      autocomplete="off"
      ></EditTodo>
      <!-- todo列表 -->
      <ul>
         <TodoItem v-for="todo in filtersTodos" 
         :key="todo.id" :todo="todo"
         v-model:edited-todo="editedTodo"
         @remove-todo="removeTodo">
          </TodoItem>
      </ul>
      <!--过滤--->
       <Filter :items="filterItems" v-model="visibility"></Filter>

       <!--回退到看板-->
       <button @click="backToDash">dashboard</button>
    </div>
</template>
<script>
import {reactive, toRefs, computed, watch} from 'vue'
import TodoItem from './TodoItem.vue'
import Filter from './Filter.vue';
import {useTodos} from './useTodos'
import {useFilter} from './useFilter'
import {useRouter,useRoute, onBeforeRouteLeave} from 'vue-router'


// 缓存操作
const todoStorage = {
  fetch() {
    let todos = JSON.parse(localStorage.getItem('vue3-todos') || '[]')
    todos.forEach((todo, index) => {
      todo.id = index + 1
    });
    return todos
  },
  save(todos) {
     localStorage.setItem('vue3-todos',JSON.stringify(todos))
  },

}

export default {
   components: {
     TodoItem,
      Filter
   },
    setup () {
      const todoState = reactive({
           newTodo: '',
           editedTodo: null //正在编辑的todo
      })

    const {todos, addTodo, removeTodo} = useTodos(todoState) 
      const filterState = useFilter(todos)
  
  //获取路由器实例
 const router = useRouter();
 //route 是响应式对象，可监控器变化
 const route =  useRoute();
 watch(
   () => route.query,
   (query) => {
     console.log(query)
   }
 )

 onBeforeRouteLeave((to, from) => {
   const answer = window.confirm('你确定离开当前页面')
   if(!answer) {
     return false
   }
 })
       return {
         ...toRefs(todoState),
        ...toRefs(filterState),
        addTodo,
        removeTodo,
        backToDash () {
          router.push('/')
        }
    }
    }
}
</script>
<style scoped>

</style>
