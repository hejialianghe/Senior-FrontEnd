<template>
<div class="carousel">
        <Marquee>
            <MarqueeItem>友情提示：有缓存，请及时刷新浏览器！</MarqueeItem>
            <MarqueeItem>友情提示：有缓存，请及时刷新浏览器！</MarqueeItem>
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