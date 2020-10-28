import React from 'react'
import PollList from "../polls/PollList"
import { motion } from 'framer-motion';

class Home extends React.Component {
  render() {

    return (
      <motion.div
        exit={{opacity: 0}}
        transition={ pageTransition } 
      >
        <PollList />
      </motion.div>
      
    )
  }
}

const pageTransition = {
  transition: 'linear',
}

export default Home