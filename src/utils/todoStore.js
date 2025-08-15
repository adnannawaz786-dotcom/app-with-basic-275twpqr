
// Priority levels for todos
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
}

// Status types for todos
export const STATUS_TYPES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
}

// Category types for todos
export const CATEGORY_TYPES = {
  WORK: 'work',
  PERSONAL: 'personal',
  SHOPPING: 'shopping',
  HEALTH: 'health',
  OTHER: 'other'
}

// Generate unique ID for todos
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Default todo structure
const createTodo = (text, options = {}) => ({
  id: generateId(),
  text: text.trim(),
  completed: false,
  status: options.status || STATUS_TYPES.PENDING,
  priority: options.priority || PRIORITY_LEVELS.MEDIUM,
  category: options.category || CATEGORY_TYPES.OTHER,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  dueDate: options.dueDate || null,
  description: options.description || '',
  tags: options.tags || []
})

// Zustand store for todo management
export const useTodoStore = create(
  persist(
    (set, get) => ({
      // State
      todos: [],
      filter: 'all', // 'all', 'active', 'completed'
      sortBy: 'createdAt', // 'createdAt', 'priority', 'dueDate', 'alphabetical'
      sortOrder: 'desc', // 'asc', 'desc'
      searchQuery: '',
      selectedCategory: 'all',
      selectedPriority: 'all',

      // Actions
      addTodo: (text, options) => {
        if (!text || !text.trim()) return

        const newTodo = createTodo(text, options)
        set((state) => ({
          todos: [newTodo, ...state.todos]
        }))
      },

      removeTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id)
        }))
      },

      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  completed: !todo.completed,
                  status: !todo.completed ? STATUS_TYPES.COMPLETED : STATUS_TYPES.PENDING,
                  updatedAt: new Date().toISOString()
                }
              : todo
          )
        }))
      },

      updateTodo: (id, updates) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  ...updates,
                  updatedAt: new Date().toISOString()
                }
              : todo
          )
        }))
      },

      updateTodoText: (id, text) => {
        if (!text || !text.trim()) return

        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  text: text.trim(),
                  updatedAt: new Date().toISOString()
                }
              : todo
          )
        }))
      },

      updateTodoPriority: (id, priority) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  priority,
                  updatedAt: new Date().toISOString()
                }
              : todo
          )
        }))
      },

      updateTodoStatus: (id, status) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  status,
                  completed: status === STATUS_TYPES.COMPLETED,
                  updatedAt: new Date().toISOString()
                }
              : todo
          )
        }))
      },

      updateTodoCategory: (id, category) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  category,
                  updatedAt: new Date().toISOString()
                }
              : todo
          )
        }))
      },

      clearCompleted: () => {
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed)
        }))
      },

      clearAll: () => {
        set(() => ({
          todos: []
        }))
      },

      // Filter actions
      setFilter: (filter) => {
        set(() => ({ filter }))
      },

      setSearchQuery: (query) => {
        set(() => ({ searchQuery: query }))
      },

      setSelectedCategory: (category) => {
        set(() => ({ selectedCategory: category }))
      },

      setSelectedPriority: (priority) => {
        set(() => ({ selectedPriority: priority }))
      },

      // Sort actions
      setSortBy: (sortBy) => {
        set(() => ({ sortBy }))
      },

      setSortOrder: (sortOrder) => {
        set(() => ({ sortOrder }))
      },

      // Bulk actions
      toggleAllTodos: () => {
        const { todos } = get()
        const allCompleted = todos.every((todo) => todo.completed)

        set(() => ({
          todos: todos.map((todo) => ({
            ...todo,
            completed: !allCompleted,
            status: !allCompleted ? STATUS_TYPES.COMPLETED : STATUS_TYPES.PENDING,
            updatedAt: new Date().toISOString()
          }))
        }))
      },

      duplicateTodo: (id) => {
        const { todos } = get()
        const todoToDuplicate = todos.find((todo) => todo.id === id)
        
        if (todoToDuplicate) {
          const duplicatedTodo = {
            ...todoToDuplicate,
            id: generateId(),
            text: `${todoToDuplicate.text} (Copy)`,
            completed: false,
            status: STATUS_TYPES.PENDING,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }

          set((state) => ({
            todos: [duplicatedTodo, ...state.todos]
          }))
        }
      }
    }),
    {
      name: 'todo-storage',
      version: 1
    }
  )
)

// Computed selectors
export const useFilteredTodos = () => {
  const {
    todos,
    filter,
    searchQuery,
    selectedCategory,
    selectedPriority,
    sortBy,
    sortOrder
  } = useTodoStore()

  let filteredTodos = [...todos]

  // Filter by completion status
  if (filter === 'active') {
    filteredTodos = filteredTodos.filter((todo) => !todo.completed)
  } else if (filter === 'completed') {
    filteredTodos = filteredTodos.filter((todo) => todo.completed)
  }

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filteredTodos = filteredTodos.filter(
      (todo) =>
        todo.text.toLowerCase().includes(query) ||
        todo.description.toLowerCase().includes(query) ||
        todo.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }

  // Filter by category
  if (selectedCategory !== 'all') {
    filteredTodos = filteredTodos.filter((todo) => todo.category === selectedCategory)
  }

  // Filter by priority
  if (selectedPriority !== 'all') {
    filteredTodos = filteredTodos.filter((todo) => todo.priority === selectedPriority)
  }

  // Sort todos
  filteredTodos.sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'alphabetical':
        comparison = a.text.localeCompare(b.text)
        break
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        comparison = priorityOrder[b.priority] - priorityOrder[a.priority]
        break
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) comparison = 0
        else if (!a.dueDate) comparison = 1
        else if (!b.dueDate) comparison = -1
        else comparison = new Date(a.dueDate) - new Date(b.dueDate)
        break
      case 'createdAt':
      default:
        comparison = new Date(a.createdAt) - new Date(b.createdAt)
        break
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  return filteredTodos
}

// Statistics selector
export const useTodoStats = () => {
  const todos = useTodoStore((state) => state.todos)

  return {
    total: todos.length,
    completed: todos.filter((todo) => todo.completed).length,
    active: todos.filter((todo) => !todo.completed).length,
    highPriority: todos.filter((todo) => todo.priority === PRIORITY_LEVELS.HIGH).length,
    overdue: todos.filter((todo) => {
      if (!todo.dueDate || todo.completed) return false
      return new Date(todo.dueDate) < new Date()
    }).length,
    byCategory: Object.values(CATEGORY_TYPES).reduce((acc, category) => {
      acc[category] = todos.filter((todo) => todo.category === category).length
      return acc
    }, {}),
    byPriority: Object.values(PRIORITY_LEVELS).reduce((acc, priority) => {
      acc[priority] = todos.filter((todo) => todo.priority === priority).length
      return acc
    }, {})
  }
}

// Utility functions
export const getPriorityColor = (priority) => {
  switch (priority) {
    case PRIORITY_LEVELS.HIGH:
      return 'text-red-600 bg-red-50 border-red-200'
    case PRIORITY_LEVELS.MEDIUM:
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case PRIORITY_LEVELS.LOW:
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export const getCategoryColor = (category) => {
  switch (category) {
    case CATEGORY_TYPES.WORK:
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case CATEGORY_TYPES.PERSONAL:
      return 'text-purple-600 bg-purple-50 border-purple-200'
    case CATEGORY_TYPES.SHOPPING:
      return 'text-green-600 bg-green-50 border-green-200'
    case CATEGORY_TYPES.HEALTH:
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((date - now) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Tomorrow'
  if (diffInDays === -1) return 'Yesterday'
  if (diffInDays > 1 && diffInDays <= 7) return `In ${diffInDays} days`
  if (diffInDays < -1 && diffInDays >= -7) return `${Math.abs(diffInDays)} days ago`
  
  return date.toLocaleDateString()
}

export const isOverdue = (dueDate, completed = false) => {
  if (!dueDate || completed) return false
  return new Date(dueDate) < new Date()
}