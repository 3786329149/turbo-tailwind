import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
/**
 * 我这里暂时把 @repo/tailwind-config 中的配置  比如 App.tsx 中使用的 className="text-blue-1000" === @theme{--color-blue-1000 } =>  #2a8af6 
 * 放到了@repo/shadcn-ui/globals.css 进行导入 `@import "@repo/tailwind-config";`
 * 如果想要这里使用 @repo/tailwind-config 也可以的， 但是需要确保  @repo/shadcn-ui/globals.css 里面没有重复导入
 * 否则会报错 例如：  @tailwind base; 只能导入一次
 */

// 这里主要使用的是 
// import './globals.css'

// 引入 shadcn-ui 的全局样式(里面也会引入 tailwindcss)
import '@repo/shadcn-ui/globals.css'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
