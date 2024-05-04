class GlobalErrorHandler {
	static catch(error, req, res, next) {
		if(!error.statusCode) {
			error.statusCode = 500;
		}

		if(process.env.NODE_ENV?.toLowerCase() === "development") {
			res.status(error.statusCode).json({
        state: 'Fail',
        messages: error.message,
        stack: error.stack
      })
		}
		else {
      res.status(error.statusCode).json({
        state: 'Fail',
        messages: error.message,
      })
		}
	};
}

module.exports = GlobalErrorHandler;
