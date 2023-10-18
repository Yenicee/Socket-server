import mongoose from "mongoose";
//import mongoosePaginate from 'mongoose-paginate-v2';

const usersCollection ='users';

const usersShema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String
});

const userModel = mongoose.model(usersCollection, usersShema);

export default userModel;
