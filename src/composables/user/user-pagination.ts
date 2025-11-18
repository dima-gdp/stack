import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import type { User } from '@/types/user'
import { INITIAL_PAGE_SIZE } from '@/constants/user.ts'

export function useUserPagination(users: Ref<User[]>, initialPageSize = INITIAL_PAGE_SIZE) {
  const currentPage = ref(1)
  const pageSize = ref(initialPageSize)

  const totalPages = computed(() => {
    return Math.ceil(users.value.length / pageSize.value)
  })

  const paginationStart = computed(() => {
    return (currentPage.value - 1) * pageSize.value + 1
  })

  const paginationEnd = computed(() => {
    const end = currentPage.value * pageSize.value
    return end > users.value.length ? users.value.length : end
  })

  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return users.value.slice(start, end)
  })

  function calculateVisiblePages(current: number, total: number): (number | string)[] {
    const pages: (number | string)[] = []

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(total)
      } else if (current >= total - 3) {
        pages.push(1)
        pages.push('...')
        for (let i = total - 4; i <= total; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(total)
      }
    }

    return pages
  }

  const visiblePages = computed(() => {
    return calculateVisiblePages(currentPage.value, totalPages.value)
  })

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function resetCurrentPage() {
    currentPage.value = 1
  }

  // Сброс страницы при изменении размера страницы
  watch(pageSize, () => {
    resetCurrentPage()
  })

  return {
    currentPage,
    pageSize,
    totalPages,
    paginationStart,
    paginationEnd,
    paginatedUsers,
    visiblePages,
    goToPage,
    resetCurrentPage,
  }
}
