import React from 'react';
import { withFormik } from "formik";
import { Button, Input, Container, Header } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import { compose } from 'ramda';
import gql from 'graphql-tag';

class Login extends React.Component {
  render() {
    const { values: { email, password }, handleChange, handleBlur, handleSubmit, isSubmitting } = this.props;

    return (
      <Container text>
        <Header as="h2">Login</Header>
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
        <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>Submit</Button>
      </Container>
    );
  }
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
    mapPropsToValues: props => ({ email: '', password: '' }),
    handleSubmit: async ({ email, password }, { props, setSubmitting }) => {
      const response = await props.mutate({
        variables: { email, password }
      });
      setSubmitting(false);
      const { ok, token, refreshToken } = response.data.login;
      console.log(response);
      if (ok) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
      }
    }
  })
)(Login);
