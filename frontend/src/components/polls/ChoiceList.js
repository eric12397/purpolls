import React from 'react'
import ChoiceItem from './ChoiceItem'

class ChoiceList extends React.Component {
	render() {
		return this.props.choices.map(choice => (
			<ChoiceItem 
        key={ choice.id } 
        choice={ choice } 
        pollId={ this.props.pollId }
        vote={ this.props.vote }
      />
		))
  
	}
}


export default ChoiceList