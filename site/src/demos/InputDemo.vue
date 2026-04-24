<script setup lang="ts">
import { ref } from 'vue'
import { Input } from 'ztools-ui-components/common/Input'

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
        <Input v-model="text" placeholder="请输入内容" />
        <span class="input-demo__value">当前值: {{ text }}</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'clearable'">
      <div class="input-demo__column">
        <Input v-model="clearableText" placeholder="请输入内容" clearable />
        <span class="input-demo__value">当前值: {{ clearableText || '空' }}</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'affix'">
      <div class="input-demo__grid">
        <Input v-model="searchText" placeholder="搜索插件">
          <template #prefix>搜索</template>
        </Input>
        <Input model-value="readonly value" readonly>
          <template #suffix>只读</template>
        </Input>
      </div>
    </template>

    <template v-else-if="props.variant === 'size'">
      <div class="input-demo__grid">
        <Input model-value="Small" size="small" />
        <Input model-value="Medium" size="medium" />
        <Input model-value="Large" size="large" />
      </div>
    </template>

    <template v-else-if="props.variant === 'state'">
      <div class="input-demo__grid">
        <Input model-value="readonly value" readonly />
        <Input model-value="disabled value" disabled />
        <Input v-model="password" type="password" placeholder="请输入密码" />
      </div>
    </template>

    <template v-else-if="props.variant === 'textarea'">
      <Input v-model="textareaText" type="textarea" placeholder="请输入多行内容" />
    </template>

    <template v-else-if="props.variant === 'validation'">
      <div class="input-demo__grid">
        <Input model-value="ztools-ui" status="success" message="名称可用" />
        <Input model-value="ztools" status="warning" message="建议使用更明确的名称" />
        <Input v-model="username" status="error" message="至少输入 3 个字符" />
      </div>
    </template>

    <template v-else-if="props.variant === 'word-limit'">
      <Input v-model="limitedText" type="textarea" :maxlength="30" show-word-limit placeholder="请输入 30 字以内的内容" />
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
