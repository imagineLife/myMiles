const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');
const faker = require('faker');
const mongoose = require('mongoose');

const {Trip} = require('../models');
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

// generate an object represnting a Trip.
// can be used to generate seed data for db
// or request.body data
function generateTripData() {
  return {
    milesTraveled: parseInt(faker.helpers.replaceSymbolWithNumber('#'),10),
    date: faker.date.past()
  }
}

// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure  ata from one test does not stick
// around for next one
function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Trips API resources page \n', () => {

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedTripData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	})

	describe('GET endpoint', function() {

		it('should return all existing Trips', function() {
			// strategy:
			//    1. get back all Trips returned by by GET request to `/trips`
			//    2. prove res has right status, data type
			//    3. prove the number of Trips we got back is equal to number
			//       in db.
			//
			// need to have access to mutate and access `res` across
			// `.then()` calls below, so declare it here so can modify in place
			let res;
			return chai.request(app)
				.get('/trips')
				.then(function(_res) {
				  // res, so that subsequent (.then) blocks can access /trips response obj (_res).
				  res = _res;
				  res.should.have.status(200);
				  // otherwise our db seeding didn't work
				  res.body.should.have.lengthOf.at.least(1);
				  return Trip.count();
				})
				.then(function(count) {
					res.body.should.have.lengthOf(count);
				});
    	});
    });

	describe('POST endpoint', function() {
		// strategy: make a POST request with data,
		// then prove that the trip we get back has
		// right keys, and that `id` is there (which means
		// the data was inserted into db)
		it('should add a new trip', function() {

		  const newTrip = generateTripData();

		  return chai.request(app)
		    .post('/trips')
		    .send(newTrip)
		    .then(function(res) {
		      res.should.have.status(201);
		      res.should.be.json;
		      res.body.should.be.a('object');
		      res.body.should.include.keys(
		        'milesTraveled', 'date');
		      // console.log(typeof(res.body.date));
		      // console.log(typeof(newTrip.date));
		      normalizeResDate(res.body.date).should.equal(normalizeDbDate(newTrip.date));
		      // cause Mongo should have created id on insertion
		      res.body.id.should.not.be.null;
		      res.body.milesTraveled.should.equal(newTrip.milesTraveled);
		      return Trip.findById(res.body.id);
		    })
		    .then(function(trip) {
		      const representedTrip = trip.apiRepr();
		      // representedTrip.date.should.equal(newTrip.date);
		      representedTrip.milesTraveled.should.equal(newTrip.milesTraveled);
		    });
		});
	});

});

