import React from 'react';
import Modal from 'react-native-modalbox';

export default function Popup(props) {
    const { children, visible, style, onClose } = props;
    return(
        <Modal backdrop={false} position={"bottom"} isOpen={visible} style={style} onClosed={onClose}>
            {children}
        </Modal>
    )
}
