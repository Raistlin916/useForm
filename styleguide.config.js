const path = require('path')
const fs = require('fs')

module.exports = {
  title: 'React useForm',
  pagePerSection: true,
  sections: [
    {
      name: 'Introduction',
      content: 'docs/introduction.md'
    },
    {
      name: 'Documentation',
      sections: [
        {
          name: 'Installation',
          content: 'docs/installation.md',
          description: 'The description for the installation section'
        },
        {
          name: 'Configuration',
          content: 'docs/configuration.md'
        },
        {
          name: 'Live Demo',
          external: true,
          href: 'http://example.com'
        }
      ]
    },
    {
      name: 'Example',
      components: 'example/**/index.js',
      exampleMode: 'expand',
      usageMode: 'expand',
      sectionDepth: 1
    }
  ],
  theme: {
    color: {
      link: '#4B4E6A',
      linkHover: '#2B3847',
      baseBackground: '#fff',
      border: '#D0DAE4',
      sidebarBackground: '#fff'
    },
    fontFamily: {
      base: '"Source Sans Pro", sans-serif'
    }
  },
  updateExample(props, exampleFilePath) {
    const { settings, lang } = props
    if (typeof settings.file === 'string') {
      const filepath = path.resolve(exampleFilePath, settings.file)
      settings.static = true
      delete settings.file
      return {
        content: fs.readFileSync(filepath, 'utf8'),
        settings,
        lang
      }
    }
    return props
  }
}
