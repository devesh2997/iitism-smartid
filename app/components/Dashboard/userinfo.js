import React from 'react'
import {Label} from 'reactstrap'
const UserInfo = ({ user }) => {
  return (
    <div>
      <Label>Admission Number : {user.admn_no}</Label>
      <br />
      <Label>
        Name :{' '}
        {user.first_name +
          ' ' +
          user.middle_name +
          ' ' +
          user.last_name}
      </Label>
      <br />
      <Label>Branch ID : {user.branch_id}</Label>
      <br />
      <Label>Course ID : {user.course_id}</Label>
      <br />
      <Label>Email: {user.email}</Label>
      <br />
      <Label>Mobile Number : {user.mobile_no}</Label>
      <br />
      <Label>Balance : {user.balance}</Label>
      <br />
    </div>
  )
}

export default UserInfo
