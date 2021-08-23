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
    </div>
</template>
<script>
import {reactive, toRefs, computed} from 'vue'
import TodoItem from './TodoItem.vue'
import Filter from './Filter.vue';
import {useTodos} from './useTodos'
import {useFilter} from './useFilter'


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

       return {
         ...toRefs(todoState),
        ...toRefs(filterState),
        addTodo,
        removeTodo
    }
    }
}
</script>
<style scoped>

</style>
