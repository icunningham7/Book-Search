const { GraphQLError } = require('graphql');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, { email }) => {
            const userData = await User.findOne({ email: email });
            return userData;
        },
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ email: context.user.email });
                return userData;
            } else {
                throw new GraphQLError('You need to be logged in!', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                        user: context.user
                    }
                });
            }
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email: email });

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
        saveBook: async (parent, { input }, context) => {
            if (context.user) {
                const userData = await User.findOneAndUpdate(
                    { email: context.user.email },
                    { $addToSet: { savedBooks: input } },
                    { new: true }
                );
                return userData;
            }
            throw new GraphQLError('You need to be logged in!', {
                extensions: {
                    code: 'UNAUTHENTICATED'
                }
            });
        },
        deleteBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const userData = await User.findOneAndUpdate(
                    { email: context.user.email },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );
                return userData;
            }
            throw new GraphQLError('You need to be logged in!', {
                extensions: {
                    code: 'UNAUTHENTICATED'
                }
            });
        },
    }
};

module.exports = resolvers;

