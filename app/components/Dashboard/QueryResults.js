import React, { Component } from 'react'
import { Table, Button } from 'reactstrap'

const QueryResults = ({ userdumps, init }) => {
  if (userdumps.length === 0) return <div />
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
            <th>mobile</th>
          </tr>
        </thead>
        <tbody>
          {userdumps.map((userdump, idx) => (
            <UserdumpItem userdump={userdump} idx={idx} key={idx} init={init}/>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

class UserdumpItem extends Component {
  onInit = event => {
    this.props.init(this.props.userdump)
  }
  render () {
    let { userdump, idx } = this.props
    return (
      <tr key={idx}>
        <td>{idx + 1}</td>
        <td>
          <Button color='primary' onClick={this.onInit}>
            Init
          </Button>
        </td>
        <td>{userdump.admn_no}</td>
        <td>{userdump.first_name}</td>
        <td>{userdump.middle_name}</td>
        <td>{userdump.last_name}</td>
        <td>{userdump.auth_id}</td>
        <td>{userdump.branch_id}</td>
        <td>{userdump.course_id}</td>
        <td>{userdump.email}</td>
        <td>{userdump.mobile_no}</td>
      </tr>
    )
  }
}

export default QueryResults
