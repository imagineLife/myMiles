exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/trips';
                      // 'mongodb://tripTaker:takingTrips247@ds023463.mlab.com:23463/loggedtrips';
exports.TEST_DATABASE_URL = (
	process.env.TEST_DATABASE_URL ||
	'mongodb://localhost/trips');
exports.PORT = process.env.PORT || 8080;