/* eslint-env node, mocha */

const chai = require('chai')
// const fs = require('fs')
const path = require('path')
const PDF = require('..')
const assert = require('chai').assert

chai.should()

describe('#PDF', function () {

  it('should return title', done => {

    const pdf = new PDF(path.resolve(__dirname, './pdf/basic.pdf'))

    pdf.info((err, meta) => {

      if (err) return done(err)

      meta.title.should.equal('basic')

      done()

    })

  })

  it('should return pages', done => {

    const pdf = new PDF(path.resolve(__dirname, './pdf/pages.pdf'))

    pdf.info((err, meta) => {

      if (err) return done(err)

      meta.pages.should.equal(6)

      done()

    })

  })

  it('should return tagged', done => {

    const pdf = new PDF(path.resolve(__dirname, './pdf/pages.pdf'))

    pdf.info((err, meta) => {

      if (err) return done(err)

      meta.tagged.should.equal(false)

      done()

    })

  })

  it('should throw error when a file is not a PDF', done => {

    const pdf = new PDF(path.resolve(__dirname, './pdf/dummy.txt'))

    pdf.info((err, meta) => {

      err.should.be.instanceof(Error)

      done()

    })

  })

  it('should not crash when a file is not a PDF', done => {

    const pdf = new PDF(path.resolve(__dirname, './pdf/dummy.txt'))

    pdf.errors = false

    pdf.info((err, meta) => {

      if (err) return done(err)

      assert(meta, 'object')

      done()

    })

  })

  /*
  it('should return title from stream', done => {

    const stream = fs.createReadStream(path.resolve(__dirname, './pdf/basic.pdf'))
    const pdf = new PDF(stream)

    pdf.info((err, meta) => {

      console.log('err', err)

      if (err) return done(err)

      meta.title.should.equal('basic')

      done()

    })

  })
  */

})
