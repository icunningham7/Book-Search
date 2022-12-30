const typeDefs = `#graphql
    type User {
        _id: ID
        username: String!
        email: String!
        password: String!
        bookCount: Int
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

    input BookInput {
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
        user(email: String!): User
        me: User
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        saveBook(input: BookInput!): User
        deleteBook(bookId: String!): User
    }
`;

module.exports = typeDefs;