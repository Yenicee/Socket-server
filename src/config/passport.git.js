import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import userModel from '../dao/models/users.model';

const initialPassport = () => {

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.30058fc48d5c685e',                        
        clientSecret: '93430801ed767973555f088bdd0032f15b14d00f',
        callbackURL: 'http://localhost:8081/api/sessions/github-callback',
        scope: ['user:email']                             

    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            const email = profile.emails[0].value; 

            const user = await userModel.findOne({ email });
            if (!user) {
                //esto es para crear una cuenta de cero 
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email,
                    password: ''
                };
                const result = await usersModel.create(newUser);
                return done(null, result);

            } else {
                return done(null, user);
            }

        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user); //req.user
    })
}

export default initialPassport;