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

describe('Trips API resources page \n', () => {

	before(function() {
		return runServer(TEST_DATABASE_URL);
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
				  res.body.should.have.length.of.at.least(1);
				  return Trip.count();
				})
				.then(function(count) {
					// res.body.should.have.length.of(count);
					res.body.length.should.equal(count);
				});
    	});
    });

});

