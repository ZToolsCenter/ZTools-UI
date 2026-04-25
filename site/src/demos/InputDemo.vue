<script setup lang="ts">
import { ref } from 'vue'
import { ZInput } from 'ztools-ui-components/common/Input'

type InputDemoVariant = 'basic' | 'clearable' | 'affix' | 'size' | 'state' | 'textarea' | 'validation' | 'word-limit'

const props = withDefaults(
  defineProps<{
    variant?: InputDemoVariant
  }>(),
  {
    variant: 'basic'
  }
)

const text = ref('ztools-ui')
const clearableText = ref('可清空内容')
const searchText = ref('插件搜索')
const password = ref('')
const textareaText = ref('这是一段多行文本内容')
const username = ref('ab')
const limitedText = ref('ztools-ui')
</script>

<template>
  <div class="input-demo">
    <template v-if="props.variant === 'basic'">
      <div class="input-demo__column">
        <ZInput v-model="text" placeholder="请输入内容" />
        <span class="input-demo__value">当前值: {{ text }}</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'clearable'">
      <div class="input-demo__column">
        <ZInput v-model="clearableText" placeholder="请输入内容" clearable />
        <span class="input-demo__value">当前值: {{ clearableText || '空' }}</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'affix'">
      <div class="input-demo__grid">
        <ZInput v-model="searchText" placeholder="搜索插件">
          <template #prefix>搜索</template>
        </ZInput>
        <ZInput model-value="readonly value" readonly>
          <template #suffix>只读</template>
        </ZInput>
      </div>
    </template>

    <template v-else-if="props.variant === 'size'">
      <div class="input-demo__grid">
        <ZInput model-value="Small" size="small" />
        <ZInput model-value="Medium" size="medium" />
        <ZInput model-value="Large" size="large" />
      </div>
    </template>

    <template v-else-if="props.variant === 'state'">
      <div class="input-demo__grid">
        <ZInput model-value="readonly value" readonly />
        <ZInput model-value="disabled value" disabled />
        <ZInput v-model="password" type="password" placeholder="请输入密码" />
      </div>
    </template>

    <template v-else-if="props.variant === 'textarea'">
      <ZInput v-model="textareaText" type="textarea" placeholder="请输入多行内容" />
    </template>

    <template v-else-if="props.variant === 'validation'">
      <div class="input-demo__grid">
        <ZInput model-value="ztools-ui" status="success" message="名称可用" />
        <ZInput model-value="ztools" status="warning" message="建议使用更明确的名称" />
        <ZInput v-model="username" status="error" message="至少输入 3 个字符" />
      </div>
    </template>

    <template v-else-if="props.variant === 'word-limit'">
      <ZInput v-model="limitedText" type="textarea" :maxlength="30" show-word-limit placeholder="请输入 30 字以内的内容" />
    </template>
  </div>
</template>

<style scoped>
.input-demo,
.input-demo__column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-demo__grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-demo__value {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
