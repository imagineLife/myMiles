const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const {Trip} = require('../trips/models');
const {User} = require('../users/models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

const should = chai.should();

chai.use(chaiHttp);

//These 2 normalize fns align date-types for testing
// Returns integer representation of date
// object (mongo stores dates as objects)
function normalizeDbDate(dbDate) {
    return dbDate.getTime();
}

// Returns integer representation of date
// string (response gives Date as string)
function normalizeResDate(resDate) {
    return Date.parse(resDate);
}

// used to put randomish documents in db
// so we have data to work with and assert about.
// we use the Faker library to automatically
// generate placeholder values for author, title, content
// and then we insert that data into mongo
function seedTripData() {
  console.info('seeding Trip data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateTripData());
  }
  // this will return a promise
  return Trip.insertMany(seedData);
}


function seedUserData() {
  console.info('seeding User data');
  const seedData = [];
  seedData.push(generateUserData());
  // this will return a promise
  return User.insertMany(seedData);
}

// generate an object represnting a Trip.
// can be used to generate seed data for db
// or request.body data
function generateTripData() {
  return {
    milesTraveled: parseInt(faker.helpers.replaceSymbolWithNumber('#'),10),
    date: faker.date.past()
    // user: '59b33583d89da114036d8b2e'
  }
}

function generateUserData(){
  return {
    firstName : "testFirstGoesHere",
    lastName: "testLastGoesHere",
    username: "testUsernameGoesHere",
    password: "$2a$10$O4zYhxYd/9aKUfQg6M9y2e48kXA/W3Tu24TePZ/9NdqCvtLbnm76S"
  }
}

// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure  ata from one test does not stick
// around for next one
var newUser;

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

function createCredentials(){
  const loginCredentials = {
    username: "testUsernameGoesHere",
    password: "ReadyToDie"
  };
  return loginCredentials;
}


describe('Trips API resources page \n', () => {

  var curUser;

	before(function() {
		return runServer(TEST_DATABASE_URL, 8081);
	});

	beforeEach(function(done) {
    
    seedUserData();
    // seedTripData();
	  // newUser = await createCredentials();
   //  return newUser;
    seedTripData();

   const test = chai.request(app)
   .post('/api/auth/login')
      .set('Authorization','Basic dGVzdFVzZXJuYW1lR29lc0hlcmU6UmVhZHlUb0RpZQ==')
      .send(createCredentials())
      .then((data) => {
        User
          .findOne({"username": "testUsernameGoesHere"})
          .then((user)=> {
            user.authToken = data.body.authToken;
            curUser = user;
            done();
          })
      });
  });

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	})

	describe('GET endpoint', function() {

//get trips of logged-in-user
    it('should view protected "add" page', function() {
        const test = chai.request(app)
        .get('/trips')
        .then((res)=>{
          res.unauthorized.should.equal(false);
        });
    })

  })

	describe('POST endpoint', function() {
		// strategy: make a POST request with data,
		// then prove that the trip we get back has
		// right keys, and that `id` is there (which means
		// the data was inserted into db)
		it('should view protected "add" page', function() {
      const newTrip = generateTripData();

      const test = chai.request(app)
      .get('/add')
      .then((res)=>{
        res.unauthorized.should.equal(false);
      });


		});
	});

});

