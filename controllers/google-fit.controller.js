const OAuth = require('../helpers/OAuth');
const GoogleFit = require('../models/GoogleFit');

class GoogleFitController {
  connect = async (req, res, next) => {
    /*
      1) Get Access token from google
      2) store access token and scopes in the database
    */

    try {
      const {userId} = req.user;
      const {code, redirectUrl} = req.body;
      const {accessToken, scopes} = await OAuth.getAccessToken(code, redirectUrl);
      const isUserHasAccessToken = await GoogleFit.findOne({user: userId});
      if(isUserHasAccessToken) {
        isUserHasAccessToken.accessToken = accessToken;
        isUserHasAccessToken.scopes = scopes
        await isUserHasAccessToken.save();
      }
      else {
        const googleFitDocument = new GoogleFit({
          accessToken,
          scopes,
          user: userId
        });
        await googleFitDocument.save();
      }
      res.status(200).json({
        state: 'Success',
        message: 'Connected successfully',
        data: []
      })
    }
    catch(error) {
      next(error);
    }
  };

  fetch = async (req, res, next) => {
    /*
      1) use the access token to retrieve the data from google fit
    */

    try {
      const {userId} = req.user;
      const isUserHasAccess = await GoogleFit.findOne({
        user: userId
      });
  
      if(!isUserHasAccess) {
        throw new Error('You are not connected to Google Fit');
      }
      
      const activates = [];
      for(let i = 0; i < isUserHasAccess.scopes.length; i++) {
        activates.push(OAuth.getData(isUserHasAccess.scopes[i], isUserHasAccess.accessToken));
      }
      const result = await Promise.all(activates);
      res.status(200).json({
        state: 'Success',
        message: 'Your google fit data is retrieved successfully',
        data: result
      });
    }
    catch(error) {
      next(error);
    }

  }; 

  disconnect = async (req, res, next) => {
    try {
      const userId = req.user.userId; 
      await GoogleFit.deleteOne({user: userId});
      res.status(204).json();
    }
    catch(error) {
      next(error);
    }
  };
}

module.exports = GoogleFitController;