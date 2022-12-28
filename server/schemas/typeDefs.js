const typeDefs = `#graphql
    type User {
        _id: ID
        username: String!
        email: String!
        password: String!
        savedBooks: [Book!]
    }

    type Book {
        _id: ID
        authors: [String]
        title: String!
        description: String!
        bookId: String!
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        user(_id: ID, username: String!): User
        me: User
    }

    type Mutation {
        createUser(username: String!, email: String!, password: String!):  Auth
        login(email: String!, password: String!): Auth
    }
`;

module.exports = typeDefs;


// saveBook(bookId: String!): Book
// deleteBook(bookId: String!): Book