<template>
  <img :src="avatarSrc" :alt="name" :class="avatarClass" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { avatar, name, large } = defineProps<{
  avatar: string | null
  name: string
  large?: boolean
}>()

const avatarClass = computed(() => (large ? 'avatar-large' : 'avatar'))

function getDefaultAvatar(name: string): string {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
  const initial = name.charAt(0).toUpperCase()
  const colorIndex = name.charCodeAt(0) % colors.length
  const color = colors[colorIndex]!

  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='${encodeURIComponent(color)}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='white'%3E${initial}%3C/text%3E%3C/svg%3E`
}

const avatarSrc = computed(() => avatar || getDefaultAvatar(name))
</script>

<style scoped>
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 15px;
  display: block;
}
</style>
