import React, { Component } from 'react'
import styles from './Userdump.css'
import { userdumpService } from '../_services/userdump.service'

import CSVReader from 'react-csv-reader'

import { Table } from 'reactstrap'

export default class Userdump extends Component {
  constructor (props) {
    super(props)
    this.state = { loading: true, userdumps: [] }
  }

  componentWillMount () {
    userdumpService
      .getAll()
      .then(data =>
        this.setState({ userdumps: JSON.parse(JSON.stringify(data.userdumps)) })
      )
  }

  handleForce = async csvdata => {
    // console.log(csvdata)
    let count = 0
    let data = []
    for (let i in csvdata) {
      let row = csvdata[i]
      if (row.length === 9) {
        // console.log(row)
        let userdump = {}
        userdump['admn_no'] = row[0]
        userdump['first_name'] = row[1]
        userdump['middle_name'] = row[2]
        userdump['last_name'] = row[3]
        userdump['auth_id'] = row[4]
        userdump['branch_id'] = row[5]
        userdump['course_id'] = row[6]
        userdump['email'] = row[7]
        userdump['mobile_no'] = row[8]
        data.push(userdump)
        count++
      }
    }
    const body = { count, data }
    let res = await userdumpService.bulkUpload(JSON.stringify(body))
    console.log(res)
  }
  render () {
    let { loading, userdumps } = this.state
    return (
      <div>
        <CSVReader
          cssClass='csv-reader-input'
          label='Select CSV file'
          onFileLoaded={this.handleForce}
          onError={this.handleDarkSideForce}
          inputId='ObiWan'
          inputStyle={{ color: 'red' }}
        />
        <Table striped responsive>
          <thead>
            <tr>
              <th>#</th>
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
              <UserdumpItem userdump={userdump} idx={idx} key={idx} />
            ))}
          </tbody>
        </Table>
      </div>
    )
  }
}

class UserdumpItem extends Component {
  render () {
    let { userdump, idx } = this.props
    return (
      <tr key={idx}>
        <td>{idx + 1}</td>
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
