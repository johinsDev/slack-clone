import React from 'react';
import {
  Button, Input, Container, Header, Form,
} from 'semantic-ui-react';
import { withFormik } from 'formik';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'ramda';

import MessageError from '../components/MessageError';

const Register = (props) => {
  const {
    values, handleChange, handleBlur, handleSubmit, isSubmitting, errors,
  } = props;

  return (
    <Container text>
      <Header as="h2">
        Register
      </Header>
      <Form>
        <Form.Field error={!!errors.username}>
          <Input
            name="username"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Username"
            fluid
          />
        </Form.Field>
        <Form.Field error={!!errors.email}>
          <Input
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Email"
            fluid
          />
        </Form.Field>
        <Form.Field error={!!errors.password}>
          <Input
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
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

const registerMutation = gql`
  mutation RegisterMutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) { 
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default compose(
  graphql(registerMutation),
  withFormik({
    mapPropsToValues: () => ({ email: '', password: '', username: '' }),
    handleSubmit: async (values, { props, setSubmitting, setErrors }) => {
      const { mutate } = props;
      const { email, password, username } = values;
      const response = await mutate({
        variables: { email, password, username },
      });
      setSubmitting(false);
      const { ok, errors } = response.data.register;

      if (ok) {
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
)(Register);
