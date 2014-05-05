# node-pdfinfo

A simple api for reading pdf meta info via [xpdf's](http://www.foolabs.com/xpdf) `pdfinfo(1)`.

## Requires

* [Node.js](http://nodejs.org)
* [npm](http://npmjs.org) _node package manager_
* [xpdf](http://www.foolabs.com/xpdf) / `pdfinfo(1)`

## Install

    $ git clone https://github.com/ecarter/node-pdfinfo.git
    $ cd node-pdfinfo
    $ npm install

## Example

    var PDF = require('pdfinfo');

    var pdf = PDF('test/pdf/basic.pdf');

    pdf.info(function(err, meta){
      if (err) throw err;
      console.log('pdf info', meta)
    })

You can also pass a readable stream into the first argument instead of a file.

## License

MIT

