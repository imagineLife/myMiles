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

// generate an object represnting a Trip.
// can be used to generate seed data for db
// or request.body data
function generateTripData() {
  return {
    milesTraveled: parseInt(faker.helpers.replaceSymbolWithNumber('#'),10),
    date: faker.date.past(),
    user: '59b33583d89da114036d8b2e'
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
		return runServer(TEST_DATABASE_URL, 8081);
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

		// it('should return all existing Trips', function() {
		// 	// strategy:
		// 	//    1. get back all Trips returned by by GET request to `/trips`
		// 	//    2. prove res has right status, data type
		// 	//    3. prove the number of Trips we got back is equal to number
		// 	//       in db.
		// 	//
		// 	// need to have access to mutate and access `res` across
		// 	// `.then()` calls below, so declare it here so can modify in place
  //     // NOTE res, so that subsequent (.then) blocks can access the same /trips response obj (_res).
		// 	let res;
		// 	return chai.request(app)
		// 		.get('/api/trips')
		// 		.then(function(_res) {
		// 		  res = _res;
		// 		  res.should.have.status(200);
		// 		  // otherwise our db seeding didn't work
		// 		  res.body.should.have.lengthOf.at.least(1);
		// 		  return Trip.count();
		// 		})
		// 		.then(function(count) {
		// 			res.body.should.have.lengthOf(count);
		// 		});
  //   	});

//NEW TEST, get trips of logged-in-user
    // it.only('should return all trips of a user', function() {
      
    // });
  });

	describe('POST endpoint', function() {
		// strategy: make a POST request with data,
		// then prove that the trip we get back has
		// right keys, and that `id` is there (which means
		// the data was inserted into db)
		it('should add a new trip', function() {

		  const newTrip = generateTripData();

		  return chai.request(app)
		    .post('/api/trips')
		    .send(newTrip)
		    .then(function(res) {
		      res.should.have.status(201);
		      res.should.be.json;
		      res.body.should.be.a('object');
		      res.body.should.include.keys(
            'milesTraveled', 'date', 'user', 'id');
            // 'milesTraveled', 'date', 'id');
		      normalizeResDate(res.body.date).should.equal(normalizeDbDate(newTrip.date));
		      // cause Mongo should have created id on insertion
		      res.body.id.should.not.be.null;
		      res.body.milesTraveled.should.equal(newTrip.milesTraveled);
          console.log('added trip to trips table');
		      return Trip.findById(res.body.id);
		    })
        .then((trip) => {
          let tripUser = trip.user;
          let tripID = trip._id;
          console.log('*** Trip userID is ',tripUser, 'and TRIP id is ',tripID);
          return trip;
        })
		    .then(function(trip) {
		      const representedTrip = trip.apiRepr();
		      normalizeResDate(representedTrip.date).should.equal(normalizeResDate(newTrip.date));
		      representedTrip.milesTraveled.should.equal(newTrip.milesTraveled);
		    });
		});
	});

  describe('PUT endpoint', function() {

    // strategy:
    //  1. Get an existing Trip from db
    //  2. Make a PUT request to update that Trip
    //  3. Prove Trip returned by request contains data we sent
    //  4. Prove Trip in db is correctly updated
    it('should update fields you send over', function() {
      const updateData = {
        milesTraveled: 12,
        date: new Date()
      };

      return Trip
        .findOne()
        .exec()
        .then(function(trip) {
          updateData.id = trip.id;

          // make request then inspect it to make sure it reflects
          // data we sent
          return chai.request(app)
            .put(`/api/trips/${trip.id}`)
            .send(updateData);
        })
        .then(function(res) {
          res.should.have.status(201);

          return Trip.findById(updateData.id).exec();
        })
        .then(function(trip) {
		      normalizeResDate(updateData.date).should.equal(normalizeResDate(updateData.date));
          trip.milesTraveled.should.equal(updateData.milesTraveled);
        });
      });
  });

  describe('DELETE endpoint', function() {
    // strategy:
    //  1. get a Trip
    //  2. make a DELETE request for that Trip's id
    //  3. assert that response has right status code
    //  4. prove that Trip with the id doesn't exist in db anymore
    it('delete a trip by id', function() {

      let trip;

      return Trip
        .findOne()
        .exec()
        .then(function(_trip) {
          trip = _trip;
          return chai.request(app).delete(`/api/trips/${trip.id}`);
        })
        .then(function(res) {
          res.should.have.status(204);
          return Trip.findById(trip.id).exec();
        })
        .then(function(_trip) {
          // when a variable's value is null, chaining `should`
          // doesn't work. so `_trip.should.be.null` would raise
          // an error. `should.be.null(_trip)` is how we can
          // make assertions about a null value.
          should.not.exist(_trip);
        });
    });
  });

});

