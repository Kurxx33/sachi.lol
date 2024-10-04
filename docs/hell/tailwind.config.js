module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        main: 'white',
        alt: 'red',
        available: 'springgreen',
        unavailable: 'red',
        background: '#000000',
        paleRed: '#ec8b8b',
        red: '#b90000',
        yellow: '#c3c3c3',
        purple: '#ec8b8b',
        grey: '#c3c3c3',
        atts: '#914e4e',
        hsted: '#c3c3c3',
        lightBlue: '#98F5FF',
        hoverBlue: '#8a0000',
        glowRed: 'rgba(255, 0, 0, 0.6)',
      },
      fontFamily: {
        topaz: ['TopazPlus', 'monospace'],
        vcr: ['VCR OSD Mono', 'monospace'],
        zpix: ['Zpix', 'monospace'],
      },
      fontSize: {
        ascii: '5px',
        bigascii: '4px',
      },
      cursor: {
        red: 'url("/res/cur/red.cur"), crosshair',
      },
    },
  },
  variants: {},
  plugins: [],
}
