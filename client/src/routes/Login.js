import React from 'react';
import { withFormik } from 'formik';
import {
  Button, Input, Container, Header,
} from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import { compose } from 'ramda';
import gql from 'graphql-tag';

const Login = (props) => {
  const {
    values: { email, password },
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = props;

  return (
    <Container text>
      <Header as="h2">
        Login
      </Header>
      <Input
        name="email"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Email"
        fluid
      />
      <Input
        name="password"
        onChange={handleChange}
        onBlur={handleBlur}
        value={password}
        type="password"
        placeholder="Password"
        fluid
      />
      <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
        Submit
      </Button>
    </Container>
  );
};

const loginMutation = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

export default compose(
  graphql(loginMutation),
  withFormik({
    mapPropsToValues: () => ({ email: '', password: '' }),
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = 'Required';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = 'Invalid email address';
      }
      return errors;
    },
    handleSubmit: async ({ email, password }, { props, setSubmitting }) => {
      const { mutate } = props;
      const response = await mutate({
        variables: { email, password },
      });
      setSubmitting(false);
      const { ok, token, refreshToken } = response.data.login;
      if (ok) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
      }
    },
  }),
)(Login);
