import React from 'react';
import './SourceCodeContainer.css';
import { Link, Element, Events, animateScroll as scroll, scroller } from 'react-scroll'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.scrollToTop = this.scrollToTop.bind(this);
  }

  componentDidMount() {
    Events.scrollEvent.register('begin', () => {
      console.log("begin", arguments);
    });
    Events.scrollEvent.register('end', () => {
      console.log("end", arguments);
    });
  }

  scrollToTop() {
    scroll.scrollToTop();
  }
  
  scrollToWithContainer() {
    let goToContainer = new Promise((resolve, reject) => {

      Events.scrollEvent.register('end', () => {
        resolve();
        Events.scrollEvent.remove('end');
      });

      scroller.scrollTo('scroll-container', {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart'
      });
    });

    goToContainer.then(() =>
      scroller.scrollTo('scroll-container-second-element', {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        containerId: 'scroll-container'
      })
    );
  }

  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }

  render() {

    const containerElements = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];

    const containerLinksMarkup = containerElements.map(elem => {
      return (
        <Link 
          activeClass="active" 
          to={elem} 
          spy={true} 
          smooth={true} 
          duration={250} 
          containerId="containerElement" 
          style={{ display: 'inline-block', margin: '20px' }}>
          Go to {elem}
        </Link>
      );
    });

    const containerElementsMarkup = containerElements.map(elem => {
      return (
        <Element name={elem} style={{marginBottom: '200px'}}>{elem} in container</Element>
      )
    })

    return (
      <div>
          <nav className="navbar navbar-default navbar-fixed-top">
            <div className="container-fluid">
              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="nav navbar-nav">
                </ul>
              </div>
            </div>
          </nav>
          {containerLinksMarkup}
          <Element 
            name="test7" 
            className="element" 
            id="containerElement" 
            style={{
              position: 'relative',
              height: '200px',
              overflow: 'scroll',
              marginBottom: '100px'
            }}>
            {containerElementsMarkup}
          </Element>
      </div>
    );
  }
};

export default App;

