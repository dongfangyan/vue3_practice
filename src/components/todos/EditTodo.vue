<template>
    <div>
      <input type="text" 
      :value="todoTitle" 
      @input="onInputChange" 
       @keyup.enter = "addTodo"
      v-bind="$attrs">
    </div>
</template>
<script>

export default {
    props: {
      todoTitle: {
           type: String,
           default: ''
       }
    },
    methods: {
        onInputChange(e) {
            console.log('onInputChange')
            this.$emit('update:todoTitle', e.target.value)
        },
        addTodo(){
            console.log('innerHeight')
            //  this.$emit('addTodo')
        }
    }
}
</script>
<style scoped>

</style>
