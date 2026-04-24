<script setup lang="ts">
</script>

<template>
  <div class="home-view">
    <div class="hero">
      <h1 class="hero-title">ZTools UI</h1>
      <p class="hero-subtitle">为 ZTools 插件生态打造的 Vue 3 组件库</p>
      <div class="hero-actions">
        <router-link to="/docs" class="hero-btn primary">阅读文档</router-link>
        <router-link to="/components" class="hero-btn">浏览组件</router-link>
      </div>
    </div>

    <div class="features">
      <div class="feature-card">
        <h3>主题感知</h3>
        <p>自动适配亮暗模式、主题色、平台和窗口材质</p>
      </div>
      <div class="feature-card">
        <h3>宿主集成</h3>
        <p>封装了与 ZTools 宿主的交互，开箱即用</p>
      </div>
      <div class="feature-card">
        <h3>按需加载</h3>
        <p>支持 Tree Shaking 和组件自动导入</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 24px 40px;
}

.hero {
  text-align: center;
  max-width: 600px;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  color: var(--primary-color);
  margin-bottom: 12px;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 32px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.hero-btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  border: 2px solid var(--control-border);
  background: var(--control-bg);
  color: var(--text-color);
  transition: all 0.2s;
  cursor: pointer;
}

.hero-btn:hover {
  background: var(--hover-bg);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.hero-btn.primary {
  background: var(--primary-color);
  color: var(--text-on-primary);
  border-color: var(--primary-color);
}

.hero-btn.primary:hover {
  opacity: 0.9;
}

.features {
  display: flex;
  gap: 20px;
  margin-top: 64px;
  max-width: 800px;
  width: 100%;
}

.feature-card {
  flex: 1;
  padding: 20px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.feature-card h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-color);
}

.feature-card p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}
</style>
