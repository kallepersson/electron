const {remote, shell} = require('electron')
const fs = require('fs')
const path = require('path')
const URL = require('url')
const electronPath = path.relative(process.cwd(), remote.process.execPath)

function initialize () {
  Array.from(document.querySelectorAll('a[href]')).forEach(link => {
    // safely add `?utm_source=default_app
    let url = URL.parse(link.getAttribute('href'), true)
    url.query = Object.assign(url.query, {utm_source: 'default_app'})
    url = URL.format(url)

    link.addEventListener('click', (e) => {
      e.preventDefault()
      shell.openExternal(url)
    })
  })

  document.querySelector('.electron-version').innerText = `Electron v${process.versions.electron}`
  document.querySelector('.chrome-version').innerText = `Chromium v${process.versions.chrome}`
  document.querySelector('.node-version').innerText = `Node v${process.versions.node}`
  document.querySelector('.v8-version').innerText = `v8 v${process.versions.v8}`
  document.querySelector('.command-example').innerText = `${electronPath} path-to-app`

  function getOcticonSvg (name) {
    const octiconPath = path.resolve(__dirname, 'node_modules', 'octicons', 'build', 'svg', `${name}.svg`)
    if (fs.existsSync(octiconPath)) {
      const content = fs.readFileSync(octiconPath, 'utf8')
      const div = document.createElement('div')
      div.innerHTML = content
      return div
    }
    return null
  }

  function loadSVG (element) {
    for (const cssClass of element.classList) {
      if (cssClass.startsWith('octicon-')) {
        const icon = getOcticonSvg(cssClass.substr(8))
        if (icon) {
          icon.classList = element.classList
          element.parentNode.insertBefore(icon, element)
          element.remove()
          break
        }
      }
    }
  }

  for (const element of document.querySelectorAll('.octicon')) {
    loadSVG(element)
  }
}

function onReadyStateChange () {
  if (document.readyState === 'complete') {
    document.removeEventListener('readystatechange', onReadyStateChange)
    initialize()
  }
}

document.addEventListener('readystatechange', onReadyStateChange)
