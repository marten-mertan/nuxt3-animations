// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
  ],

  devtools: { enabled: true },

  app: {
    baseURL: '/nuxt3-animations/',
    // @ts-expect-error Nuxt app config does not officially support trailingSlash yet
    trailingSlash: true,
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Nuxt3 Animations Test',

      /**
       * Метатеги, фавиконки и т.п
       * Для генерации фавиконок - https://realfavicongenerator.net/
       */

      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'title', content: 'Nuxt3 Animations Test' },
        { name: 'description', content: 'Nuxt3 Animations Test description' },
        { name: 'author', content: 'Mertan' },
        { name: 'msapplication-TileColor', content: '#e7609e' },
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/nuxt3-animations/favicons/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/nuxt3-animations/favicons/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/nuxt3-animations/favicons/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/nuxt3-animations/favicons/apple-touch-icon.png' },
        { rel: 'manifest', href: '/nuxt3-animations/favicons/site.webmanifest' },
        { rel: 'mask-icon', href: '/nuxt3-animations/favicons/safari-pinned-tab.svg', color: '#e7609e' },
      ],
    },
  },

  css: [
    '~/assets/scss/vendors.scss',
    '~/assets/scss/common.scss',
  ],

  routeRules: {
    '/**': {
      prerender: true,
    },
  },

  compatibilityDate: '2025-03-09',

  nitro: {
    preset: 'github_pages',
    prerender: {
      crawlLinks: true,
      autoSubfolderIndex: true,
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/shared.scss" as *;',
        },
      },
    },
    // Добавляем настройки для обработки .vue-файлов с TypeScript
    vue: {
      script: {
        defineModel: true, // Поддержка defineModel для TS
        propsDestructure: true, // Поддержка деструктуризации пропсов
      },
    },
    // Оптимизация обработки TypeScript
    esbuild: {
      target: 'esnext', // Устанавливаем современную цель для TS
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true, // Если используете декораторы
        },
      },
    },
  },

  // Добавляем настройки TypeScript
  typescript: {
    strict: true,
    shim: false,
    typeCheck: true,
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },
})
