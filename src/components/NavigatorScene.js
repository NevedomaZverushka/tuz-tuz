import React from 'react';
import {ViroARScene, ViroConstants, ViroDirectionalLight, ViroAmbientLight} from "react-viro";

export default class NavigatorScene extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isTrackingGood: null,
        }
    }

    onTrackingUpdated = (state, reason) => {
        const {isTrackingGood} = this.state;
        const {updateTrackingStatus, updateInitialHeading,
            onTrackingLost, onTrackingRecovered,
        } = this.props.arSceneNavigator.viroAppProps;

        if (state === ViroConstants.TRACKING_UNAVAILABLE && isTrackingGood !== null) {
            console.log('tracking unavailable');

            if (isTrackingGood === true) {
                onTrackingLost()
            }

            this.setState({isTrackingGood: false});
        } else if (state === ViroConstants.TRACKING_LIMITED && isTrackingGood !== null) {
            console.log('tracking limited');

            if (isTrackingGood === false) {
                onTrackingRecovered()
            }

            this.setState({isTrackingGood: true});
        } else if (state === ViroConstants.TRACKING_NORMAL) {
            console.log('tracking normal');

            if (isTrackingGood === null) {
                updateTrackingStatus(true, true)
                updateInitialHeading();
                console.log('tracking init')
            } else if (isTrackingGood === false) {
                onTrackingRecovered();
            }

            this.setState({isTrackingGood: true});
        }

        // if (reason === ViroConstants.TRACKING_REASON_EXCESSIVE_MOTION) {
        //     console.log('too much motion');
        // } else if (reason === ViroConstants.TRACKING_REASON_INSUFFICIENT_FEATURES ) {
        //     console.log('bad scene for camera');
        // }
    }

    onCameraTransformUpdate = ({cameraTransform}) => {
        //console.log(cameraTransform.rotation[1]);
    }


    render() {
        const {waypoint} = this.props.arSceneNavigator.viroAppProps;
        return <ViroARScene
            onTrackingInitialized={this.onTrackingInitialized}
            onTrackingUpdated={this.onTrackingUpdated}
            onCameraTransformUpdate={this.onCameraTransformUpdate}
        >
            <ViroAmbientLight color="#FFFFFF" />
            <ViroDirectionalLight
                color="#ffffff"
                direction={[0, -1, 1]}
            />
            {this.state.isTrackingGood && waypoint}
        </ViroARScene>
    }

}
