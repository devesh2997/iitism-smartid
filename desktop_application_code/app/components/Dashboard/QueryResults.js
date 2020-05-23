import React, { Component } from 'react'
import { Table, Button } from 'reactstrap'

const QueryResults = ({ users, init }) => {
  if (users.length === 0) return <div />
  return (
    <div style={{ marginTop: '20px' }}>
      <Table striped responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Action</th>
            <th>Admission Number</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Last Name</th>
            <th>auth_id</th>
            <th>branch_id</th>
            <th>course_id</th>
            <th>email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <UserItem user={user} idx={idx} key={idx} init={init}/>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

class UserItem extends Component {
  onInit = event => {
    this.props.init(this.props.user)
  }
  render () {
    let { user, idx } = this.props
    return (
      <tr key={idx}>
        <td>{idx + 1}</td>
        <td>
          <Button color='primary' onClick={this.onInit}>
            Init
          </Button>
        </td>
        <td>{user.id}</td>
        <td>{user.first_name}</td>
        <td>{user.middle_name}</td>
        <td>{user.last_name}</td>
        <td>{user.auth_id}</td>
        <td>{user.branch_id}</td>
        <td>{user.course_id}</td>
        <td>{user.email}</td>
      </tr>
    )
  }
}

export default QueryResults
