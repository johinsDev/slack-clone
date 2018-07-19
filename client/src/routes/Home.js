import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const user = u => (
  <h1 key={u.id}>
    {u.email}
  </h1>
);

const Home = ({ data: { allUsers = [] } }) => allUsers.map(user);

const allUsersQuery = gql`
  {
    allUsers {
      id
      email
    }
  }
`;

export default graphql(allUsersQuery)(Home);
