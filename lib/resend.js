import { Resend } from 'resend';
export const resend = new Resend(process.env.RESEND_API_KEY);

import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
  Heading,
  Section,
} from '@react-email/components';

export const ShiftExchangeReqEmail = ({
  requesterName,
  shiftDate,
  shiftTime,
  requestLink,
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container} align="left">
        <Heading style={heading}>Shift Exchange Request</Heading>
        <Section style={section}>
          <Text style={text}>
            {requesterName} has requested you to take over their shift:
          </Text>
          <Text style={text}>
            <strong>Date:</strong> {shiftDate}
          </Text>
          <Text style={text}>
            <strong>Time:</strong> {shiftTime}
          </Text>
          <Button href={requestLink} style={button}>
            Respond to Request
          </Button>
        </Section>
      </Container>
    </Body>
  </Html>
);

export const ShiftExchangeResponseEmail = ({
  responderName,
  status,
  shiftDate,
  shiftTime,
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container} align="left">
        <Heading style={heading}>Shift Exchange Update</Heading>
        <Section style={section}>
          <Text style={text}>
            {responderName} has {status} your shift exchange request.
          </Text>
          <Text style={text}>
            <strong>Date:</strong> {shiftDate}
          </Text>
          <Text style={text}>
            <strong>Time:</strong> {shiftTime}
          </Text>
          {status === 'ACCEPTED' && (
            <Text style={text}>The shift has been reassigned accordingly.</Text>
          )}
          {status === 'rejected' && (
            <Text style={text}>The shift remains assigned to you.</Text>
          )}
        </Section>
      </Container>
    </Body>
  </Html>
);

export const UserVerificationEmail = ({ firstName, verificationUrl }) => (
  <Html>
    <Head />
    <Body style={main}>
      {/* <Container style={{ ...container, textAlign: 'left', alignItems: 'left' }} align="left"> */}
      <Container style={container} align="left">
        <Heading style={heading}>Welcome {firstName}!</Heading>
        <Section style={section}>
          <Text style={text}>
            {"You've been invited to join the employee portal."}
          </Text>
          <Text style={text}>
            <strong>
              Click the button below to complete your registration{' '}
            </strong>
          </Text>
          <Button href={verificationUrl} style={button}>
            Sign in portal
          </Button>
          <Text style={text}>
            {
              "If you weren't expecting this invitation, please ignore this email."
            }
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Shared email styles
const main = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  textAlign: 'left',
  direction: 'ltr', // left-to-right direction
};

const container = {
  padding: '20px 0',
  width: '100%',
  maxWidth: '600px',
  textAlign: 'left',
  alignItems: 'left',
};

const section = {
  padding: '14px 0',
  textAlign: 'left',
};

const text = {
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left',
  margin: '0',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'left',
  margin: '0',
};

const button = {
  backgroundColor: '#8e49ff',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  padding: '8px 16px',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  margin: '10px 0',
};
