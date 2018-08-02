import React from 'react';
import { withFormik } from 'formik';
import {
  Button, Input, Container, Header, Form,
} from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import { compose } from 'ramda';
import gql from 'graphql-tag';

import MessageError from '../components/MessageError';


const CreateTeam = (props) => {
  const {
    values: { name },
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
  } = props;

  return (
    <Container text>
      <Header as="h2">
        Create a team
      </Header>
      <Form>
        <Form.Field error={!!errors.name}>
          <Input
            name="name"
            value={name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Name"
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
  mutation CreateTeamMutation($name: String!) {
    createTeam(name: $name) {
      ok
      team {
        id
      }
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
    mapPropsToValues: () => ({ name: '' }),
    handleSubmit: async ({ name }, { props, setSubmitting, setErrors }) => {
      const { mutate } = props;

      let response = null;

      try {
        response = await mutate({
          variables: { name },
        });
        setSubmitting(false);
      } catch (err) {
        this.props.history.push('/login');
        return;
      }

      const {
        ok, errors, team,
      } = response.data.createTeam;

      if (ok) {
        props.history.push(`/view-team/${team.id}`);
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
)(CreateTeam);
