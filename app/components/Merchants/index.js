import React from 'react'

import { merchantService } from '../../_services/merchants.service'

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
import AddMerchant from './AddMerchant'

export default class Merchants extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      merchants: [],
      success: undefined
    }
  }

  componentWillMount () {
    this.getData()
  }

  getData = () => {
    this.setState({ loading: true })
    merchantService.getAll().then(data => {
      console.log(data)
      this.setState({
        loading: false,
        merchants: JSON.parse(JSON.stringify(data.merchants))
      })
    })
  }

  render () {
    let { loading, merchants } = this.state
    return (
      <div style={{ margin: '50px' }}>
        <AddMerchant refresh={this.getData} />
        {!loading && (
          <Card style={{ marginTop: '20px' }}>
            <CardHeader>List of merchants.</CardHeader>
            <CardBody>
              {merchants.length === 0 && (
                <div>No merchants are registered at the moment.</div>
              )}
              {merchants.length !== 0 && (
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Business Name</th>
                      <th>First Name</th>
                      <th>Middle Name</th>
                      <th>Last Name</th>
                      <th>email</th>
                      <th>Mobile no.</th>
                      <th>balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchants.map((merchant, idx) => (
                      <MerchantItem merchant={merchant} idx={idx} key={idx} />
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

class MerchantItem extends React.Component {
  render () {
    let { merchant, idx } = this.props
    return (
      <tr key={idx}>
        <td>{idx + 1}</td>
        <td>{merchant.business_name}</td>
        <td>{merchant.first_name}</td>
        <td>{merchant.middle_name}</td>
        <td>{merchant.last_name}</td>
        <td>{merchant.email}</td>
        <td>{merchant.mobile_no}</td>
        <td>{merchant.balance}</td>
      </tr>
    )
  }
}
