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

</template>

<script>
import { reactive,computed,onMounted, onUnmounted, ref, watch,toRefs, h } from 'vue'
import Composition from './Composition.vue'
import ModelButton from './ModelButton.vue'
import VmodelTest  from './VmodelTest.vue'
import Emits from './Emits.vue'
import Functional from './Functional.vue'
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
    RenderTest: {
      props:{
      counter: {
        type: Number,
        default: 0
      },
      Functional
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