/*
Safe window is a proxy object of window
It has the same functionality as window,
however changing its properties won't affect
the global window object.
*/

function SafeWindow () {
  Object.keys(window).forEach(key => {
    Object.defineProperty(this, key,
      { get: () => {
        const value = window[key]
        if (typeof value === "function"){
          return value.bind(window)
        }
        if (key === "window") return this
        return value
      },
        set: value=>{ window[key] = value }
      }
    )
  })
}
SafeWindow.prototype = Window.prototype;

// We create a global instance of safe window, so that imports-loader
// Can refer to it
const safeWindow = window[process.env.WOOPRA_WINDOW_KEY] = new SafeWindow()

//The goal is to import Woopra in such a way that it doesn't pollute the global window, hence why we pass an instance of SafeWindow to imports-loader
require(`imports-loader?this=>${process.env.WOOPRA_WINDOW_KEY},window=>${process.env.WOOPRA_WINDOW_KEY}!wpt/wpt.min.js`)

// We delete the global reference since imports-loader no longer needs it
delete window[process.env.WOOPRA_WINDOW_KEY]

export default safeWindow.WoopraTracker
