import React from 'react'
import PollList from "./polls/PollList"
import { UncontrolledAlert } from 'reactstrap';
import { motion } from 'framer-motion';

class Home extends React.Component {
  render() {
    let welcomeMsg = '';
    if (this.props.location.state !== undefined) {
      welcomeMsg =  
      <UncontrolledAlert className="alert">
        {this.props.location.state.message}
      </UncontrolledAlert>
    }
                          
    return (
      <motion.div
        
        animate={{opacity: 1, y: 0}}
        exit={{opacity: 0, y: '100vh'}}
        transition={ pageTransition } 
      >
        { welcomeMsg }
        <PollList />
      </motion.div>
      
    )
  }
}

const pageTransition = {
  transition: 'linear',
}

export default Home