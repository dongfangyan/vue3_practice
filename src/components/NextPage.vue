<template>
    <div>
      this is NextPage
    </div>
</template>
<script>
import {emitter} from './HelloWorld.vue'
export default {
  mounted (){
    console.log(emitter)
     emitter.on('someEvent', msg => {
       console.log(msg)
     })
  }
}
</script>

