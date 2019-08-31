/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/

module.exports = {
  theme: {
    gradients: theme => ({
      // Array definition (defaults to linear gradients).
      'purple-gradient':      ['30deg', theme('colors.purple.500'), theme('colors.purple.900')],
      'topaz-dark': ['30deg', theme('colors.orange.700'), theme('colors.pink.600')],
      'emerald':    ['to right', theme('colors.green.400'), theme('colors.teal.500')],
      'fireopal':   ['to right', '#40E0D0', '#FF8C00', '#FF0080'],
      'relay':      ['to top left', '#3A1C71', '#D76D77', '#FFAF7B'],

      // Object definition.
      'mono-circle': {
          type: 'radial',
          colors: ['circle', '#CCC', '#000']
      },
  }),
    // colors: {
    //   // "blue": "#007bff",
    //   // "indigo": "#6610f2",
    //   // "pink": "#e83e8c",
    //   // "red": "#EA6969",
    //   // "orange": "#fd7e14",
    //   // "yellow": "#E9AE60",
    //   // "green": "#34BE7E",
    //   // "teal": "#20c997",
    //   // "cyan": "#17a2b8",
    //   // "white": "#ffffff",
    //   // "gray": "#6c757d",
    //   // "gray-dark": "#343a40",
    //   // "primary": "#20293B",
    //   // "secondary": "#7C89A6",
    //   // "success": "#34BE7E",
    //   // "info": "#5E49FD",
    //   // "warning": "#E9AE60",
    //   // "danger": "#EA6969",
    //   // "light": "#DFE6EE",
    //   // "dark": "#0f1319",
    //   // "darkblue-100": "#45577D",
    //   // "darkblue-200": "#3F5073",
    //   // "darkblue-300": "#3A4969",
    //   // "darkblue-400": "#354361",
    //   // "darkblue-500": "#313E59",
    //   // "darkblue-600": "#2D3952",
    //   // "darkblue-700": "#29334A",
    //   // "darkblue-800": "#242E42",
    //   // "darkblue-900": "#20293B",
    //   // "brightblue-100": "#A2B3D9",
    //   // "brightblue-200": "#8F9EBF",
    //   // "brightblue-300": "#7C89A6",
    //   // "darkblue": "#45577D",
    //   // "brightblue": "#8F9EBF",
    //   // "coral": "#F68797",
    //   // "red": "#EA6969",
    //   // "yellow": "#E9AE60",
    //   // "green": "#34BE7E",
    // }
  },
  variants: {
    gradients: ['responsive', 'hover']
  },
  plugins: [
    require('tailwindcss-plugins/gradients')
  ]
}
