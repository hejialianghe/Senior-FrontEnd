<template>
<div class="carousel">
        <Marquee>
            <MarqueeItem>Please manually refresh this page for new updates!</MarqueeItem>
        </Marquee>    
</div>
</template>

<script>
import Marquee from './Marquee/Marquee'
import MarqueeItem from './Marquee/Marquee-item'
export default {
    components:{
        Marquee,
        MarqueeItem
    }
}
</script>

<style scoped>
.carousel {
    height:2.2rem;
    display: inline-block;
    color: #3eaf7c;
}
</style>