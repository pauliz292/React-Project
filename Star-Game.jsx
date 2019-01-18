// React Game

// Write JavaScript here and press Ctrl+Enter to execute

var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

const Stars = (props) => {
	return (
  	<div className="col-5">
  	 	{_.range(props.numberOfStars).map(i => 
      	<i className="fa fa-star" key={i} />
      )}
  	</div>
  );
}

const Button = (props) => {
	let button;
  
  switch(props.answerIsCorrect) {
  	case true:
    		button = <button className="btn btn-success" onClick={props.acceptAnswer}> <i className="fa fa-check" /> </button>;
      break;
    case false:
    		button = <button className="btn btn-danger" > <i className="fa fa-times" /> </button>;
      break;
    default:
    		button = <button className="btn btn-primary"
        	onClick={props.checkAnswer} 
        	disabled={props.selectedNumbers.length === 0}> = </button>;
      break;
  }

	return (
  	<div className="col-2 text-center">
  	 	{button}
      <br/><br />
      <button className="btn btn-warning btn-sm" 
      	disable={props.numberOfRedraws === 0}
        onClick={props.redraw}>
        {props.numberOfRedraws}
      </button>
  	</div>
  );
}

const Answer = (props) => {
	return (
  	<div className="col-5">
  	  {props.selectedNumbers.map((number, i) => 
      	<span key={i} onClick={() => props.unSelectNumber(number)}>{number}</span>
      )}
  	</div>
  );
}

const Numbers = (props) => {
	const numberClassName = (number) => {
  	if (props.usedNumbers.indexOf(number) >= 0) {
    	return 'used';
    }
    if (props.selectedNumbers.indexOf(number) >= 0) {
    	return 'selected';
    }
  }

	return (
  	<div className="card text-center">
  	  <div>
  	    {Numbers.list.map((number, i) => 
        	<span key={i} className={numberClassName(number)} 
          onClick={() => props.selectNumber(number)}>
          	{number}
          </span>
        )}
  	  </div>
  	</div>
  );
}
Numbers.list = _.range(1, 10);

const DoneFrame = (props) => {
	return (
		<div className="text-center">
    <hr />
		  <h3>{props.doneStatus}</h3>
      <br />
      <button className="btn btn-default" onClick={props.resetGame}>
        Play Again
      </button>
		</div>
  );
}

class Game extends React.Component{
	static randomNumber = () => 1 + Math.floor(Math.random()*9);
  
  static init = () => ({
  	selectedNumbers: [],
    numberOfStars: Game.randomNumber(),
    answerIsCorrect: null,
    usedNumbers: [],
    numberOfRedraws: 3,
    doneStatus: null
  })

	state = Game.init();
  
  selectNumber = (clickedNumber) => {
  	if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) { return; }
  	this.setState(prevState => ({
    	answerIsCorrect: null,
    	selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
    }));
  }
  
  unSelectNumber = (clickedNumber) => {
  	this.setState(prevState => ({
    	answerIsCorrect: null,
    	selectedNumbers: prevState.selectedNumbers.filter(number => number !== clickedNumber)
    }));
  }
  
  checkAnswer = () => {
  	this.setState(prevState => ({
    	answerIsCorrect: prevState.numberOfStars === prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }));
  }
  
  acceptAnswer = () => {
  	this.setState(prevState => ({
    	usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      answerIsCorrect: null,
      numberOfStars: Game.randomNumber()
    }), this.updateDoneStatus );
  }
  
  redraw = () => {
  	if (this.state.numberOfRedraws === 0) { return; }
  	this.setState(prevState => ({
    	numberOfStars: Game.randomNumber(),
      answerIsCorrect: null,
      selectedNumbers: [],
      numberOfRedraws: prevState.numberOfRedraws - 1
    }), this.updateDoneStatus );
  }
  
  possibleAnswers = ({ numberOfStars, usedNumbers }) => {
  	const possibleNumbers = _.range(1,10).filter(number => 
    	usedNumbers.indexOf(number) === -1
    );
    
    return possibleCombinationSum(possibleNumbers, numberOfStars);
  }
  
  updateDoneStatus = () => {
  	this.setState(prevState => {
    	if (prevState.usedNumbers.length === 9) {
      	return { doneStatus: 'Great Game!' };
      }
      if (prevState.numberOfRedraws === 0 && !this.possibleAnswers(prevState)) {
      	return { doneStatus: 'Game Over!' };
      }
    });
  }
  
  resetGame = () => {
  	this.setState(Game.init());
  }

	render () {
  	const {selectedNumbers, 
    	numberOfStars, 
    	answerIsCorrect, 
      usedNumbers, 
      numberOfRedraws,
      doneStatus,
    } = this.state;
    
  	return (
    	<div className="container">
    	  <h2>Play Nine</h2>
        <hr />
        <div className="row">
           	<Stars numberOfStars={numberOfStars}/>
        		<Button selectedNumbers={selectedNumbers} 
            	numberOfRedraws={numberOfRedraws}
            	checkAnswer={this.checkAnswer} 
              answerIsCorrect={answerIsCorrect}
              acceptAnswer={this.acceptAnswer}
              redraw={this.redraw}/>
        		<Answer selectedNumbers={selectedNumbers} unSelectNumber={this.unSelectNumber}/>
        </div>
        <br />
        { doneStatus ?
        	<DoneFrame doneStatus={doneStatus} resetGame={this.resetGame}/> :
          <Numbers selectedNumbers={selectedNumbers} selectNumber={this.selectNumber} usedNumbers={usedNumbers} />
        }
        <br />
        
    	</div>
    );
  };
}

class App extends React.Component{
	render () {
  	return (
    	<div>
    	  <Game />
    	</div>
    );
  };
}

ReactDOM.render(<App />, mountNode);