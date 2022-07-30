module.exports = {
	api: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'http://192.168.1.60:3001/api/v1' : `PRODUCTION API URL`
}