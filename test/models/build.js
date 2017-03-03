const mongoose = require('mongoose');
const {expect} = require('chai');
const sinon = require('sinon');
require('sinon-mongoose');

const Build = require('../../models/Build');
const User = require('../../models/User');

UserMock = function () {
  const UserMock = sinon.mock(new User({ email: 'test@gmail.com', password: 'root' }));
  const user = UserMock.object;

  return user;
}

describe('Build Model', () => {
  it('should create a new build', (done) => {
    // create a user first, and use it
    const UserMock = sinon.mock(new User({ email: 'test@gmail.com', password: 'root' }));
    const user = UserMock.object;
    user.save();

    const BuildMock = sinon.mock(new Build({
      name: 'my build',
      draft: 0,
      desc: 'my build description',
      category: 'balancers',
      createdBy: user._id,
      updatedBy: user._id,
      ownedBy: user._id
    }));

    const build = BuildMock.object;

    BuildMock
      .expects('save')
      .yields(null);

    build.save(function (err, result) {
      BuildMock.verify();
      BuildMock.restore();
      UserMock.restore();
      UserMock.restore();
      expect(err).to.be.null;
      done();
    });
  });

  // it('should return error if build is not created', (done) => {
  //   const BuildMock = sinon.mock(new Build({ email: 'test@gmail.com', password: 'root' }));
  //   const build = BuildMock.object;
  //   const expectedError = {
  //     name: 'ValidationError'
  //   };
  //
  //   BuildMock
  //     .expects('save')
  //     .yields(expectedError);
  //
  //   build.save((err, result) => {
  //     BuildMock.verify();
  //     BuildMock.restore();
  //     expect(err.name).to.equal('ValidationError');
  //     expect(result).to.be.undefined;
  //     done();
  //   });
  // });

  // it('should not create a build with the unique email', (done) => {
  //   const BuildMock = sinon.mock(Build({ email: 'test@gmail.com', password: 'root' }));
  //   const build = BuildMock.object;
  //   const expectedError = {
  //     name: 'MongoError',
  //     code: 11000
  //   };
  //
  //   BuildMock
  //     .expects('save')
  //     .yields(expectedError);
  //
  //   build.save((err, result) => {
  //     BuildMock.verify();
  //     BuildMock.restore();
  //     expect(err.name).to.equal('MongoError');
  //     expect(err.code).to.equal(11000);
  //     expect(result).to.be.undefined;
  //     done();
  //   });
  // });

  // it('should find build by email', (done) => {
  //   const BuildMock = sinon.mock(Build);
  //   const expectedBuild = {
  //     _id: '5700a128bd97c1341d8fb365',
  //     email: 'test@gmail.com'
  //   };
  //
  //   BuildMock
  //     .expects('findOne')
  //     .withArgs({ email: 'test@gmail.com' })
  //     .yields(null, expectedBuild);
  //
  //   Build.findOne({ email: 'test@gmail.com' }, (err, result) => {
  //     BuildMock.verify();
  //     BuildMock.restore();
  //     expect(result.email).to.equal('test@gmail.com');
  //     done();
  //   })
  // });
});
