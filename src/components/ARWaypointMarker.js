import React from 'react';
import {Viro3DObject} from "react-viro";

export default function ARWaypointMarker(props) {
    const {rotation, point, scale} = props;
    // const ref = React.useRef()
    //
    // if (ref.current) {
    //     ref.current.getTransformAsync()
    //         .then(data => console.log(data));
    //
    // }
    return <Viro3DObject
        //ref={ref}
        source={require("./res/obj/arrow.obj")}
        resources={[require('./res/obj/arrow.mtl')]}
        type="OBJ"
        transformBehaviors={["billboard"]}

        scale={scale ?? [1, 1, 1]}
        position={point ?? [0, 0, 0]}
        rotation={rotation ?? [0, 0, 0]}/>
};
