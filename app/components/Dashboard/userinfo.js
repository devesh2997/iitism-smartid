import React from 'react'
import { Container, Col, Row } from 'reactstrap'
import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  InputGroup,
  InputGroupText
} from 'reactstrap'
const UserInfo = ({ user }) => {
  return (
    <Container>
      <Row>
        <Col>Admission Number : </Col>
        <Col>{user.admn_no}</Col>
      </Row>
      <Row>
        <Col>Name : </Col>
        <Col>
          {user.first_name + ' ' + user.middle_name + ' ' + user.last_name}
        </Col>
      </Row>
      <Row>
        <Col>Branch ID : </Col>
        <Col>{user.branch_id}</Col>
      </Row>
      <Row>
        <Col>Course ID : </Col>
        <Col>{user.course_id}</Col>
      </Row>
      <Row>
        <Col>Email : </Col>
        <Col>{user.email}</Col>
      </Row>
      <Row>
        <Col>Balance : </Col>
        <Col>{user.balance}</Col>
      </Row>
    </Container>
  )
}

export default UserInfo
