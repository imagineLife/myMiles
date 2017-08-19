const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');

const should = chai.should();
const app = server.app;

chai.use(chaiHttp);

describe('testing index page', () => {
	it('shows up', (done) => {
		chai.request(app)
		.get('/')
		.end((err, resp) => {
			resp.should.have.status(200);
			resp.should.be.html;
			done();
		})
	})
});