import { gql } from '@apollo/client';

export const GET_USER = gql`
    query user($email: String!) {
        user(email: $email) {
            _id
            username
            email
            savedBooks {
                _id
                authors
                title
                description
                bookId
                image
                link
            }
        }
    }
`;


export const GET_ME = gql`
    {
        me {
            _id
            username
            email
            savedBooks {
                _id
                authors
                title
                description
                bookId
                image
                link
            }
        }
    }
`;