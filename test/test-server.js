const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');

const {Trip} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

const should = chai.should();

chai.use(chaiHttp);

describe('Trip API resources', () => {

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	after(function() {
		return closeServer();
	})

	it('index page should show up', (done) => {
		chai.request(app)
		.get('/')
		.end((err, resp) => {
			resp.should.have.status(200);
			resp.should.be.html;
			done();
		})
	})

});