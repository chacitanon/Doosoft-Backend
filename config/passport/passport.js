const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const db = require("../../models");

const option = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};
const jwtStrategy = new Strategy(option, async (payload, done) => {
  const targetAdmin = await db.Admin.findOne({ where: { id: payload.id } });

  if (targetAdmin) {
    done(null, targetAdmin);
  } else {
    done(null, false);
  }
});

passport.use("jwt-auth", jwtStrategy);