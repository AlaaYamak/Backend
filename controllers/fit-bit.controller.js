const FitBitOAuth = require('../helpers/FitBitOAuth');
const FitBit = require('../models/FitBit');

class FitBitController {
  oAuth = new FitBitOAuth();

  connect = async (req, res, next) => {
    try {
      const {userId} = req.user;
      const {code, redirectUrl} = req.body;
      const {accessToken, refreshToken, fitBitUserId, scopes} = await this.oAuth.getAccessToken(code, redirectUrl);
      const isUserHasAccessToken = await FitBit.findOne({user: userId});
      if(isUserHasAccessToken) {
        isUserHasAccessToken.accessToken = accessToken;
        isUserHasAccessToken.scopes = scopes;
        isUserHasAccessToken.refreshToken = refreshToken;
        isUserHasAccessToken.fitBitUserId = fitBitUserId;
        await isUserHasAccessToken.save();
      }
      else {
        const FitBitDocument = new FitBit({
          accessToken,
          refreshToken,
          fitBitUserId,
          scopes,
          user: userId
        });
        await FitBitDocument.save();
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
    try {
      const {userId} = req.user;
      const isUserHasAccess = await FitBit.findOne({
        user: userId
      });
  
      if(!isUserHasAccess) {
        throw new Error('You are not connected to Fit Bit');
      }
      const activates = [];
      for(let i = 0; i < isUserHasAccess.scopes.length; i++) {
        const scopeUrl = `https://api.fitbit.com/1/user/${isUserHasAccess.fitBitUserId}/${isUserHasAccess.scopes[i]}`;
        activates.push(this.oAuth.getData(scopeUrl, isUserHasAccess.accessToken));
      }
      const result = await Promise.all(activates);
      res.status(200).json({
        state: 'Success',
        message: 'Your fit bit data is retrieved successfully',
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
      await FitBit.deleteOne({user: userId});
      res.status(204).json();
    }
    catch(error) {
      next(error);
    }
  };
};

module.exports = FitBitController;