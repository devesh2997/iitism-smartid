import React from 'react'
import {Label} from 'reactstrap'
const UserDumpInfo = ({ userdump }) => {
  return (
    <div>
      <Label>Admission Number : {userdump.admn_no}</Label>
      <br />
      <Label>
        Name :{' '}
        {userdump.first_name +
          ' ' +
          userdump.middle_name +
          ' ' +
          userdump.last_name}
      </Label>
      <br />
      <Label>Branch ID : {userdump.branch_id}</Label>
      <br />
      <Label>Course ID : {userdump.course_id}</Label>
      <br />
      <Label>Email: {userdump.email}</Label>
      <br />
      <Label>Mobile Number : {userdump.mobile_no}</Label>
      <br />
    </div>
  )
}

export default UserDumpInfo
