import React, { Component } from 'react'
import { userdumpService } from '../_services/userdump.service'

import CSVReader from 'react-csv-reader'

import { Table } from 'reactstrap'
import { Card, CardBody, CardHeader } from 'reactstrap'
import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  InputGroup,
  InputGroupText,
  Alert
} from 'reactstrap'

export default class Userdump extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      userdumps: [],
      success: undefined,
      createdRecordsCount: undefined,
      errorCount: undefined
    }
  }

  componentWillMount () {
    this.setState({ loading: true })
    this.getData()
  }

  getData = () => {
    userdumpService.getAll().then(data =>
      this.setState({
        loading: false,
        userdumps: JSON.parse(JSON.stringify(data.userdumps))
      })
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
    this.setState({
      loading: true,
      createdRecordsCount: undefined,
      errorCount: undefined,
      success: undefined
    })
    let res = await userdumpService.bulkUpload(JSON.stringify(body))
    this.setState({
      loading: false,
      success: res.success,
      createdRecordsCount: res.createdRecordsCount,
      errorCount: res.errorCount
    })
    console.log(res)
  }
  render () {
    let { loading, userdumps } = this.state

    return (
      <div style={{ margin: '50px' }}>
        <Card>
          <CardHeader>Bulk Upload user data</CardHeader>
          <CardBody>
            <Form>
              <InputGroup>
                <InputGroupText>Select CSV file : </InputGroupText>
                <span style={{ marginLeft: '20px' }}>
                  {' '}
                  <CSVReader
                    cssClass='csv-reader-input'
                    label=''
                    onFileLoaded={this.handleForce}
                    onError={this.handleDarkSideForce}
                    inputId='ObiWan'
                    inputStyle={{ color: 'red' }}
                  />
                </span>
              </InputGroup>
            </Form>
            <div style={{ marginTop: '20px' }}>
              {this.state.success === false && (
                <Alert color='danger'>Some Error Occurred.</Alert>
              )}
              {this.state.createdRecordsCount > 0 && (
                <Alert color='success'>
                  Successfully uploaded user data. Total records created :{' '}
                  {this.state.createdRecordsCount}
                </Alert>
              )}
              {this.state.errorCount > 0 && (
                <Alert color='warning'>
                  Error occurred while creating some records. Total records with
                  errors : {this.state.errorCount}
                </Alert>
              )}
            </div>
          </CardBody>
        </Card>
        {loading && <div>Loading...</div>}
        {!loading && (
          <Card style={{ marginTop: '20px' }}>
            <CardHeader>
              List of users issued SmartIDs but not initialised in our system.
            </CardHeader>
            <CardBody>
              {userdumps.length === 0 && (
                <div>No user data has been uploaded yet.</div>
              )}
              {userdumps.length !== 0 && (
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
              )}
            </CardBody>
          </Card>
        )}
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
