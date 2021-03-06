import React from 'react';
import { Link } from 'react-scroll';
import './LoggingPoints.css';

const SCROLL_OFFSET_PX = -80;
const SCROLL_DURATION = 250;

// TODO: convert to a named function component
function LoggingPoints(props) {
  const {
    loggingPointData,
    loggingPointClicked,
    allSelectedFiles
  } = props;

  return loggingPointData.map((element, index) => {
    let isActive = false;
    if (allSelectedFiles) {
      allSelectedFiles.forEach(file => {
        if (
          file.fileName === element.fileName &&
          file.lineNumber === element.lineNumber &&
          file.methodName === element.methodName
        ) {
          isActive = true;
        }
      });
    }

    // consider using the `classNames` function from react-classnames to add multiple
    // you could do something like `className={classNames(shouldHighlight && highlightedClass, fileNameClass)}`

    // Instead of using `<Link to={whatever} />`, look into scrolling manually in your `handleClick`, using
    // something like this:
    //
    // scroller.scrollTo('myScrollToElement', {
    //   duration: SCROLL_DURATION,
    //   smooth: "easeInOutQuint",
    //   containerId: 'containerElement',
    //   ...
    // })
    // (see https://github.com/fisshy/react-scroll)
    //
    // Create a `<LoggingPointLink />` component or something, that will let you have a custom click handler.

    return (
      <Link
        key={index}
        smooth={true}
        duration={SCROLL_DURATION}
        containerId="containerElement"
        className={`LoggingPoint ${isActive ? 'LoggingPoint--active' : ''}`}
        to={`${element.lineNumber}`}
        offset={SCROLL_OFFSET_PX}
        onClick={() =>
          loggingPointClicked(
            element.fileName,
            element.lineNumber,
            element.methodName
          )
        }
      >
        <span className="fileName">
          {element.fileName}:{element.lineNumber}
        </span>
        <span>{element.methodName} </span>
      </Link>
    );
  });
}

export default LoggingPoints;
