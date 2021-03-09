<template>
<div class="carousel">
    <div class="main">
        <p>注意！请及时刷新浏览器！有缓存！</p>
        <p>注意！请及时刷新浏览器！有缓存！</p>
        <p>注意！请及时刷新浏览器！有缓存！</p>
    </div>
</div>
</template>

<script>
export default {

}
</script>

<style scoped>
.carousel {
	height:100%;
	overflow:hidden;
	margin:auto;
	position:relative;
    display: inline-block;
    margin-left: 20px;
}
@keyframes anis {
 100% {
	transform:translateY(-100px)
  }
}
.main {
   animation:anis 5s linear infinite;
   color: #f35626;
}
.main:hover {
	animation-play-state:paused;
}

</style>