import React from 'react'
import { FaUserEdit } from 'react-icons/fa';

export class ProfilePicChanger extends React.Component {

  handleChange = (event) => {
    this.props.uploadImage(event)
  }

  render() {
    return (
      <React.Fragment>
        <label for="profile-pic-upload" style={ customUpload } >
          <FaUserEdit style={{ fontSize: '1.5rem'}}/>
        </label>
        <input id="profile-pic-upload" type="file" onChange={this.handleChange}/>
      </React.Fragment>
    )
  }
}

const customUpload = {
  display: 'inline-block',
  cursor: 'pointer'
}

export default ProfilePicChanger