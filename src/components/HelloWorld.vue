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
</template>

<script>
import { reactive,computed,onMounted, onUnmounted, ref, watch,toRefs } from 'vue'
import Composition from './Composition.vue'
import ModelButton from './ModelButton.vue'
import Emits from './Emits.vue'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: {
    Composition,
    ModelButton,
    Emits
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
     console.log("click me!");
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