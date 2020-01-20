
/**
 * Module Dependencies
 */

const spawn = require('child_process').spawn
const EventEmitter = require('events').EventEmitter
const stream = require('stream')

/**
 * Configure.
 */

const PDFINFO_PATH = process.env.PDFINFO_PATH || 'pdfinfo'

/**
 * Initialize a new `PDF`.
 *
 * @param {String} path path to pdf
 * @param {Object} opts options for `pdfinfo(1)`
 * @return {PDF} for chaining...
 * @api public
 */

class PDF extends EventEmitter {

  constructor (path, opts) {

    super()

    if (path instanceof stream) {

      // handle streams
      this._input = '-'
      this._stream = path

    } else {

      this._input = path

    }

    this._options = opts || []

    this.errors = true

    return this

  }

  /**
   * Executes spawn process.
   *
   * @param {Function} next callback
   * @return {PDF} for chaining...
   * @api private
   */

  exec (next) {

    const self = this

    if (!this._input) return next.call(self, new Error('No input specified'))

    const pdfInfo = spawn(PDFINFO_PATH, this._options.concat([this._input]))

    pdfInfo.stdin.on('error', next)
    pdfInfo.stdout.on('error', next)

    const _data = []

    let totalBytes = 0

    if (this._input === '-') {

      // we're handling streams
      this._stream.pipe(process.stdin)

    }

    function onData (data) {

      totalBytes += data.length

      _data.push(data)

      self.emit('data', data.toString())

    }

    function onClose () {

      const buf = Buffer.concat(_data, totalBytes)
      const data = parse(buf.toString())

      if (data) {

        next.call(self, null, map(data))

      } else if (self.errors) {

        next.call(self, new Error('File is not a PDF'))

      } else {

        next.call(self, null, {})

      }

      self.emit('close')

    }

    function onExit () {

      pdfInfo.kill()

      self.emit('exit')

    }

    pdfInfo.stdout.on('data', onData)

    pdfInfo.on('close', onClose)
    pdfInfo.on('exit', onExit)

    return this

  }

}

/**
 * Alias for `#exec()`
 *
 * @param {Function} next callback
 * @return {PDF} for chaining...
 * @api public
 */

PDF.prototype.info = PDF.prototype.exec

/**
 * Parses meta info.
 *
 * @param {String} str meta content
 * @return {Array} parsed pdf meta attributes
 * @api private
 */

function parse (str) {

  if (!str) return

  const meta = []
  const lines = str.split(/\n/g)

  for (const i in lines) {

    const _attr = lines[i].split(/:\s+/)
    const val = _attr[1]

    let key = _attr[0]

    if (key && val) {

      key = key.toLowerCase().replace(/\s/g, '_')

      const attr = pretty(key, val)

      meta.push(attr)

    }

  }

  return meta

}

/**
 * Maps parsed meta array to object.
 *
 * @param {Array} results parsed meta results
 * @return {Object} parsed meta attributes as object
 * @api private
 */

function map (results) {

  const meta = {}

  if (results) {

    for (const i in results) {

      const attr = results[i]

      meta[attr.k] = attr.v

    }

  }

  return meta

}

/**
 * Converts parsed attribute into something pretty.
 *
 * @param {String} key meta attribue name
 * @param {String} val meta attribute value
 * @return {Object} converted meta attribute value
 * @api private
 */

function pretty (key, val) {

  const type = {}

  // rename attributes
  switch (key) {

    case 'creationdate':
      type.k = 'created'
      break

    case 'moddate':
      type.k = 'modified'
      break

    default:
      type.k = key

  }

  // Convert 'no' = false / 'none' = null
  type.v = val === 'no' ? false : (val === 'none' ? null : val)

  // Convert string to number
  if (typeof type.v === 'string' && !isNaN(Number(type.v))) {

    type.v = Number(type.v)

  }

  return type

}

/**
 * Expose `PDF`.
 */

module.exports = PDF
