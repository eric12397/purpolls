import React from 'react'
import PollList from "./polls/PollList"
import { motion } from 'framer-motion';

class Home extends React.Component {
  render() {

    return (
      <motion.div
        animate={{opacity: 1, y: 0}}
        exit={{opacity: 0, y: '100vh'}}
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