<script setup lang="ts">
import { ref } from 'vue'
import { ZButton } from 'ztools-ui-components/common/Button'
import { ZDrawer, ZDrawerContent } from 'ztools-ui-components/common/Drawer'
import type { DrawerPlacement } from 'ztools-ui-components/common/Drawer'

type DrawerDemoVariant =
  | 'basic'
  | 'placement'
  | 'controlled'
  | 'uncontrolled'
  | 'content'
  | 'mask'
  | 'display'
  | 'resizable'

const props = withDefaults(
  defineProps<{
    variant?: DrawerDemoVariant
  }>(),
  {
    variant: 'basic'
  }
)

const basicShow = ref(false)
const placementShow = ref(false)
const controlledShow = ref(false)
const contentShow = ref(false)
const noMaskShow = ref(false)
const transparentMaskShow = ref(false)
const displayIfShow = ref(false)
const displayShowShow = ref(false)
const resizableShow = ref(false)
const uncontrolledMounted = ref(false)
const currentPlacement = ref<DrawerPlacement>('right')
const drawerWidth = ref(320)
const drawerHeight = ref(260)
const placements: DrawerPlacement[] = ['left', 'right', 'top', 'bottom']

function openPlacement(placement: DrawerPlacement): void {
  currentPlacement.value = placement
  placementShow.value = true
}
</script>

<template>
  <div class="drawer-demo">
    <template v-if="props.variant === 'basic'">
      <div class="drawer-demo__column">
        <ZButton type="primary" @click="basicShow = true">打开抽屉</ZButton>
        <span class="drawer-demo__value">默认从右侧滑出，点击遮罩或关闭按钮收起。</span>
      </div>
      <ZDrawer v-model:show="basicShow">
        <ZDrawerContent title="基础抽屉" closable>
          <p>Drawer 适合承载设置面板、详情信息和局部流程。</p>
          <p>组件支持受控 / 非受控显示、遮罩、Esc 关闭和焦点管理。</p>
        </ZDrawerContent>
      </ZDrawer>
    </template>

    <template v-else-if="props.variant === 'placement'">
      <div class="drawer-demo__row">
        <ZButton v-for="placement in placements" :key="placement" @click="openPlacement(placement)">
          {{ placement }}
        </ZButton>
      </div>
      <ZDrawer v-model:show="placementShow" :placement="currentPlacement">
        <ZDrawerContent :title="`placement: ${currentPlacement}`" closable>
          <p>通过 placement 控制抽屉出现方向。</p>
        </ZDrawerContent>
      </ZDrawer>
    </template>

    <template v-else-if="props.variant === 'controlled'">
      <div class="drawer-demo__column">
        <div class="drawer-demo__row">
          <ZButton type="primary" @click="controlledShow = true">打开受控抽屉</ZButton>
          <ZButton @click="controlledShow = false">外部关闭</ZButton>
        </div>
        <span class="drawer-demo__value">show: {{ controlledShow }}</span>
      </div>
      <ZDrawer :show="controlledShow" :show-mask="false" @update:show="controlledShow = $event">
        <ZDrawerContent title="受控模式" closable>
          <p>使用 show 和 update:show 完全由外部状态驱动。</p>
        </ZDrawerContent>
      </ZDrawer>
    </template>

    <template v-else-if="props.variant === 'uncontrolled'">
      <div class="drawer-demo__column">
        <ZButton @click="uncontrolledMounted = true">打开非受控抽屉</ZButton>
        <span class="drawer-demo__value">点击后挂载 default-show 的非受控抽屉，页面加载时不会自动打开。</span>
      </div>
      <ZDrawer v-if="uncontrolledMounted" default-show :block-scroll="false" @after-leave="uncontrolledMounted = false">
        <ZDrawerContent title="非受控模式" closable>
          <p>使用 default-show 设置挂载后的初始状态，后续显示状态由组件内部维护。</p>
        </ZDrawerContent>
      </ZDrawer>
    </template>

    <template v-else-if="props.variant === 'content'">
      <ZButton type="primary" @click="contentShow = true">打开结构化内容</ZButton>
      <ZDrawer v-model:show="contentShow" width="360px">
        <ZDrawerContent
          title="任务详情"
          closable
          header-class="drawer-demo__header-accent"
          :body-content-style="{ display: 'grid', gap: '12px' }"
        >
          <div class="drawer-demo__card">
            <strong>标题区域</strong>
            <span>DrawerContent 提供 header / body / footer 分区。</span>
          </div>
          <div class="drawer-demo__card">
            <strong>样式透传</strong>
            <span>支持 headerClass、bodyContentStyle、footerStyle 等参数。</span>
          </div>
          <template #footer>
            <ZButton @click="contentShow = false">取消</ZButton>
            <ZButton type="primary" @click="contentShow = false">确认</ZButton>
          </template>
        </ZDrawerContent>
      </ZDrawer>
    </template>

    <template v-else-if="props.variant === 'mask'">
      <div class="drawer-demo__row">
        <ZButton @click="noMaskShow = true">无遮罩</ZButton>
        <ZButton @click="transparentMaskShow = true">透明遮罩</ZButton>
      </div>
      <ZDrawer v-model:show="noMaskShow" :show-mask="false" width="300px">
        <ZDrawerContent title="无遮罩" closable>
          <p>showMask=false 时不会渲染遮罩，并禁用有效的焦点锁定。</p>
        </ZDrawerContent>
      </ZDrawer>
      <ZDrawer v-model:show="transparentMaskShow" show-mask="transparent" width="300px">
        <ZDrawerContent title="透明遮罩" closable>
          <p>透明遮罩保留点击关闭区域，但不显示暗色背景。</p>
        </ZDrawerContent>
      </ZDrawer>
    </template>

    <template v-else-if="props.variant === 'display'">
      <div class="drawer-demo__row">
        <ZButton @click="displayIfShow = true">displayDirective="if"</ZButton>
        <ZButton @click="displayShowShow = true">displayDirective="show"</ZButton>
      </div>
      <ZDrawer v-model:show="displayIfShow" display-directive="if">
        <ZDrawerContent title="v-if 渲染" closable>
          <p>关闭后内容节点会卸载。</p>
        </ZDrawerContent>
      </ZDrawer>
      <ZDrawer v-model:show="displayShowShow" display-directive="show">
        <ZDrawerContent title="v-show 渲染" closable>
          <p>关闭后内容节点会保留，只切换显示状态。</p>
        </ZDrawerContent>
      </ZDrawer>
    </template>

    <template v-else-if="props.variant === 'resizable'">
      <div class="drawer-demo__column">
        <ZButton type="primary" @click="resizableShow = true">打开可调整抽屉</ZButton>
        <span class="drawer-demo__value">宽度: {{ drawerWidth }}px / 高度: {{ drawerHeight }}px</span>
      </div>
      <ZDrawer
        v-model:show="resizableShow"
        resizable
        :width="drawerWidth"
        :height="drawerHeight"
        :min-width="240"
        :max-width="520"
        :min-height="180"
        :max-height="420"
        @update:width="drawerWidth = $event"
        @update:height="drawerHeight = $event"
      >
        <ZDrawerContent title="可调整尺寸" closable>
          <p>拖拽抽屉内侧边缘可调整宽度或高度，并受 min/max 限制。</p>
        </ZDrawerContent>
      </ZDrawer>
    </template>
  </div>
</template>

<style scoped>
.drawer-demo,
.drawer-demo__column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.drawer-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.drawer-demo__value {
  font-size: 13px;
  color: var(--text-secondary);
}

.drawer-demo__card {
  display: grid;
  gap: 4px;
  padding: 12px;
  border: 1px solid var(--control-border);
  border-radius: 10px;
  background: var(--control-bg);
}

.drawer-demo__card span {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

:deep(.drawer-demo__header-accent) {
  color: var(--primary-color);
}
</style>
