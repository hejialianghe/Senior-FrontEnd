<template>
  <div
    class="theme-container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar" />
    <div class="sidebar-mask" @click="toggleSidebar(false)"></div>

    <Sidebar :items="sidebarItems" @toggle-sidebar="toggleSidebar">
      <slot name="sidebar-top" #top />
      <slot name="sidebar-bottom" #bottom />
    </Sidebar>

    <Home v-if="$page.frontmatter.home" />

    <Page v-else :sidebar-items="sidebarItems">
      <slot name="page-top" #top />
      <slot name="page-bottom" #bottom />
    </Page>
    <footer class="footer">
    <div class="container">
      <p class="text-center">© 2024 web全栈体系. All Rights Reserved.（所有文章未经授权禁止转载、摘编、复制或建立镜像，如有违反，追究法律责任。）</p>
      <p class="text-center"><a href="https://beian.miit.gov.cn" target="_blank">豫ICP备19041317号-1</a></p>
    </div>
  </footer>
  </div>
</template>

<script>
import Home from '@theme/components/Home.vue'
import Navbar from '@theme/components/Navbar.vue'
import Page from '@theme/components/Page.vue'
import Sidebar from '@theme/components/Sidebar.vue'
import { resolveSidebarItems } from '../util'
import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
//  sentry异常监控
Sentry.init({
  dsn: 'https://39616798988c45a88e52d89282f7dcd1@o522017.ingest.sentry.io/5632836',
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
})

export default {
  components: { Home, Page, Sidebar, Navbar },

  data() {
    return {
      isSidebarOpen: false,
    }
  },
  beforeMount() {
    // 百度埋点
    var _hmt = _hmt || []
    var hm = document.createElement('script')
    hm.src = 'https://hm.baidu.com/hm.js?a56e4bf87056c895a1e9e9d38298da40'
    var s = document.getElementsByTagName('body')[0]
    s.appendChild(hm)

    if (location.origin.indexOf('gitee') >= 0) {
      location.href = 'https://senior-frontend.pages.dev'
    }
  },
  computed: {
    shouldShowNavbar() {
      const { themeConfig } = this.$site
      const { frontmatter } = this.$page
      if (frontmatter.navbar === false || themeConfig.navbar === false) {
        return false
      }
      return (
        this.$title ||
        themeConfig.logo ||
        themeConfig.repo ||
        themeConfig.nav ||
        this.$themeLocaleConfig.nav
      )
    },

    shouldShowSidebar() {
      const { frontmatter } = this.$page
      return (
        !frontmatter.home &&
        frontmatter.sidebar !== false &&
        this.sidebarItems.length
      )
    },

    sidebarItems() {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      )
    },

    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass
      return [
        {
          'no-navbar': !this.shouldShowNavbar,
          'sidebar-open': this.isSidebarOpen,
          'no-sidebar': !this.shouldShowSidebar,
        },
        userPageClass,
      ]
    },
  },

  mounted() {
    this.$router.afterEach(() => {
      this.isSidebarOpen = false
    })
  },

  methods: {
    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen
      this.$emit('toggle-sidebar', this.isSidebarOpen)
    },

    // side swipe
    onTouchStart(e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      }
    },

    onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x
      const dy = e.changedTouches[0].clientY - this.touchStart.y
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true)
        } else {
          this.toggleSidebar(false)
        }
      }
    },
  },
}
</script>

<style scoped >
.footer {
  background-color: #000;
  color: #fff;
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.text-center {
  text-align: center;
}
</style>
