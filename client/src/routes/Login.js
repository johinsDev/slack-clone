import React from 'react';
import { withFormik } from 'formik';
import {
  Button, Input, Container, Header, Form,
} from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import { compose } from 'ramda';
import gql from 'graphql-tag';

import MessageError from '../components/MessageError';


const Login = (props) => {
  const {
    values: { email, password },
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
  } = props;

  return (
    <Container text>
      <Header as="h2">
        Login
      </Header>
      <Form>
        <Form.Field error={!!errors.email}>
          <Input
            name="email"
            value={email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Email"
            fluid
          />
        </Form.Field>
        <Form.Field error={!!errors.password}>
          <Input
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={password}
            type="password"
            placeholder="Password"
            fluid
          />
        </Form.Field>
        <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
          Submit
        </Button>
      </Form>
      {Object.keys(errors).length ? (
        <MessageError errors={errors} />
      ) : null}
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
    handleSubmit: async ({ email, password }, { props, setSubmitting, setErrors }) => {
      const { mutate } = props;
      const response = await mutate({
        variables: { email, password },
      });
      setSubmitting(false);
      const {
        ok, token, refreshToken, errors,
      } = response.data.login;

      if (ok) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        props.history.push('/');
      }
      if (errors) {
        const errMap = [];
        errors.forEach((err) => {
          errMap[err.path] = err.message;
        });
        setErrors(errMap);
      }
    },
  }),
)(Login);
