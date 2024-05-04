class UnhandledRejectionHandler {
  static catch() {
    process.on('unhandledRejection', (error) => {
      console.error(`Unhandled Rejection Errors: ${error}`);
      process.exit(1);
    })
  }
}

module.exports = UnhandledRejectionHandler