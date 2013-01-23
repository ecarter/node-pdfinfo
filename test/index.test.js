
var PDF = require('..');

describe('#PDF', function(){

  it('should return pdf title', function(done){
    var pdf = PDF(__dirname + '/pdf/basic.pdf');

    pdf.exec(function(err, meta){
      if (err) return done(err);
      meta.title.should.equal('basic');
      done();
    })
  });

})
