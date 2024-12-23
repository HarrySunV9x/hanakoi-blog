export default {
  '*': {
    theme: {
      breadcrumb: false
    }
  },
  index: {
    title: 'Home',
    type: 'page'
  },
  blog: {
    title: 'Blog',
    type: 'page'
  },
  todolist: {
    title: 'Todo',
    type: 'page',
    contact: {
      display: 'hidden'
    },
    href: '/todolist'
  }
}