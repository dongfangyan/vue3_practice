<template>
<p>{{counter}}</p>
<p>{{doubleCounter}}</p>
<p>{{msg2}}</p>
<p ref="desc"></p>
<!--- composition -->
<Composition></Composition>
<!-- Teleport: ModalButton -->
<ModelButton></ModelButton>

<!--Emit选项-->
<Emits @my-click="onClick"></Emits>

<!--实例方法定义组件-->
<comp></comp>

<!--v-model的使用 -->
<VmodelTest v-model:counter="counter"></VmodelTest>
<!--等效于-->
<!-- <VmodelTest :counter="counter" @update:counter="counter"></VmodelTest> -->

<!-- render api 发生变化 -->
<RenderTest v-model:counter="counter">
  <template>title</template>
  <template v-slot:content>content.....</template>
</RenderTest>

<!-- 函数式组件 -->
<Functional level="3">z这个一个动态h元素</Functional>

<!-- 异步组件 -->
<AsyncPage />

<!-- 自定义指令 -->
<p v-highlight="'green'">highlight this text!!!</p>

<!--编程方式发送和监听事件 -->
<button @click="sendMsg">emit event</button>

</template>

<script>
import { reactive,computed,onMounted, onUnmounted, ref, watch,toRefs, h, defineAsyncComponent } from 'vue'
import Composition from './Composition.vue'
import ModelButton from './ModelButton.vue'
import VmodelTest  from './VmodelTest.vue'
import Emits from './Emits.vue'
import Functional from './Functional.vue'

//事件派发和监听
import mitt from 'mitt'

export const emitter = mitt()

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: {
    Composition,
    ModelButton,
    Emits,
    VmodelTest,
     Functional,
      AsyncPage: defineAsyncComponent(() => import("./NextPage.vue")),//Vue 3.x 中，异步组件的导入需要使用辅助函数defineAsyncComponent来进行显式声明
    RenderTest: {
      props:{
      counter: {
        type: Number,
        default: 0
      },
    },
      render() {
        this.$slots.default()
        this.$slots.content()
        return h('div',[
          h ('div', { onClick: this.onClick}, [
            `I am RenderTest: ${this.counter}`,
            this.$slots.default(),
            this.$slots.content()
          ])
        ]);
      },
    },
  },
 setup() {
   const {counter,doubleCounter} = useCounter()
   const msg2 = ref('some message')
   const desc = ref(null)
   watch(counter,(val,oldVal) =>{
     const p = desc.value
     p.textContent = `conter change from ${oldVal} to ${val}`
   })
   return {counter,doubleCounter,msg2,desc}
 },
 methods: {
   onClick() {
     this.$emit('update:counter',this.counter + 1)
   },
   sendMsg(){
    emitter.emit('someEvent', 'fooo')
   }
 }
}

function useCounter() {
  const data = reactive({
     counter: 1,
     doubleCounter: computed(() => data.counter*2)
   })
   let timer
   onMounted(() => {
  timer = setInterval(() => {
      data.counter++
   },1000);
   });

onUnmounted(() => {
  clearInterval(timer)
});

return toRefs(data);
}
</script>