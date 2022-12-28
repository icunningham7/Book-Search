const { GraphQLError } = require('graphql');

const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, { user = null, _id, username }) => {
            return User.findOne({
                $or: [{ _id }, { username }],
              });
        },
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('savedBooks');
            }
            throw new GraphQLError('You need to be logged in!', {
                extensions: {
                    code: 'UNAUTHENTICATED'
                }
            });
        },
    },

    Mutation: {
        createUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new GraphQLError('No user found with this email address', {
                    extensions: {
                        code: 'UNAUTHENTICATED'
                    }
                });
            }

            const correctPW = await user.isCorrectPassword(password);

            if (!correctPW) {
                throw new GraphQLError('Incorrect credentials', {
                    extensions: {
                        code: 'UNAUTHENTICATED'
                    }
                });
            }

            const token = signToken(user);

            return { token, user };
        },
    }
};

module.exports = resolvers;

// saveBook: async (parent, { bookId }, context) => {
//     if (context.user) {
//         const book = await 
//     }
// }