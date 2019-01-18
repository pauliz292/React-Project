const Card = (props) => {
	return (
  	<div>
  	  <img src={props.avatar_url} width="75px"/>
      <div>
        <div>{props.name}</div>
        <div>{props.company}</div>
      </div>
  	</div>
  );
}

const CardList = (props) => {
	return (
  	<div>
    <h3>Profiles</h3>
  		{props.cards.map(card => <Card key={card.id} {...card} />)}
  	</div>
  );
}

class Form extends React.Component {
	state = {
  	userName: ''
  }
	handleSubmit = (event) => {
  	event.preventDefault();
    const url = 'https://api.github.com/users/' + this.state.userName;
    axios.get(url)
    .then(resp => {
      this.props.onSubmit(resp.data);
      this.setState({ userName: '' });
    });
  };
	render () {
  	return (
  		<form onSubmit={this.handleSubmit}>
  		  <input type="text" value={this.state.userName}
        onChange={(event) => this.setState({ userName: event.target.value })}
        placeholder="Github Username"/>
        <button type="submit">Add</button>
  		</form>
    );
  }
}

class App extends React.Component {
	state = {
  	cards: []
  };
  
  addCard = (cardInfo) => {
    this.setState(prevState => ({
    	cards: prevState.cards.concat(cardInfo)
    }));
  };
  
	render () {
  	return (
    	<div>
    	  <Form onSubmit={this.addCard}/>
        <CardList cards={this.state.cards}/>
    	</div>
    );
  }
}

ReactDOM.render(<App />, mountNode);