import React, { Component } from 'react';
import Pizzicato from 'pizzicato';

import './App.css';

const randomArray = ({numberOfValues, min, max}) => (
  [...new Array(numberOfValues)].map(() => Math.floor(Math.random() * (max - min)) + min)
)

const delay = time => new Promise(res=> setTimeout(() => res(), time));

const barStyle = {
  width: `100%`,
  display: 'flex'
}

const Bar = (props) => (
  <div className="bar" style={{
    ...barStyle,
    background: props.color,
    height: `${props.height}vh`,
  }} />
);

class App extends Component {
  state = {
    speed: 2,
    done: false,
    active: false,
    toSort: randomArray({
      numberOfValues: 200,
      min: 1,
      max: 100
    }),
    sineWave: new Pizzicato.Sound({ 
      source: 'wave', 
      options: {
        frequency: 440
      }
    })
  }

  reset() {
    this.setState({
      done: false,
      active: false,
      toSort: randomArray({
        numberOfValues: 200,
        min: 1,
        max: 100
      }),
    })
  }

  start() {
    this.setState({ active: true })

    this.sort()
  }

  swap(i, j) {
    const toSort = this.state.toSort

    const tmp = toSort[i];
    toSort[i] = toSort[j];
    toSort[j] = tmp;

    this.setState({      
      toSort: toSort
    })
  }

  async sort() {
    this.state.sineWave.play();
    this.put_array_in_heap_order();
    let end = this.state.toSort.length - 1;
    while(end > 0) {
      await this.swap(0, end);
      await this.sift_element_down_heap(0, end);
      this.state.sineWave.frequency = (end*22050)/440
      this.state.sineWave.play();
      await delay(this.state.speed, this);
      end -= 1
      this.state.sineWave.stop();
    }

    this.setState({
      done: true,
      active: false
    })

    this.state.sineWave.stop();
  }

  put_array_in_heap_order() {
      let i;
      i = this.state.toSort.length / 2 - 1;
      i = Math.floor(i);
      while (i >= 0) {
        this.sift_element_down_heap(i, this.state.toSort.length);
        i -= 1;
      }
  }

  sift_element_down_heap(i, max) {
      let i_big;
      let c1;
      let c2;
      while(i < max) {
          i_big = i;
          c1 = 2*i + 1;
          c2 = c1 + 1;
          if (c1 < max && this.state.toSort[c1] > this.state.toSort[i_big])
              i_big = c1;
          if (c2 < max && this.state.toSort[c2] > this.state.toSort[i_big])
              i_big = c2;
          if (i_big === i) return;
          this.swap(i, i_big);
          i = i_big;
      }
  }

  render() {
    return (
      
      <div className="App">
        { this.state.done
          ? (
            <button className="Button" onClick={() => this.reset() }>Reset</button>
          )
          : (
            <button disabled={this.state.active} className="Button" onClick={() => this.start()  }>Start</button>
          )
        }

        <div className="Cols">
          {( this.state.toSort.map((value, index) =>
            (<Bar key={index} color={`hsla(${(value*255)/100}, 100%, 50%, 1)`} height={value} />)
          ))}
        </div>
      </div>
    );
  }
}

export default App;
