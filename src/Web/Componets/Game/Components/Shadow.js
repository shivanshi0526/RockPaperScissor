import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { createItemsArray } from '../data';

export default function VictoryShadow() {
    const divArray = createItemsArray(['One', 'Two', 'Three']);

    return (
        <>
            <TransitionGroup className='shadowGroup'>
                {divArray.map(({ name, nodeRef }, index) => {
                    return (
                        <CSSTransition
                            key={index}
                            in={true}
                            appear
                            nodeRef={nodeRef}
                            timeout={1250}
                            classNames={`shadowAnimate${name}`}
                        >
                            <div ref={nodeRef}></div>
                        </CSSTransition>
                    );
                })}
            </TransitionGroup>
        </>
    );
}
