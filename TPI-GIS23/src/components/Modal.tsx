import React, { FC, ReactElement } from 'react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    consultLayer: Object;
}

export default function Modal(props: ModalProps): ReturnType<FC> {

    // const consultLayer: String = JSON.parse(JSON.stringify(props.consultLayer));
    return (
        <div className={`${"modal"} ${props.open ? "display-block" : "display-none"}`}>
            <div className="modal-main">
                <div className="modal-head">
                    <h1>Resultados</h1>
                </div>
                <div className="modal-body">
                    {(Object.keys(props.consultLayer) as (keyof typeof props.consultLayer)[]).forEach((key, index) => {
                        
                        console.log(props.consultLayer[key]);
                        return (
                            <div key={index}>
                                <h2>{key}</h2>
                                <p>{props.consultLayer[key]}</p>
                            </div>
                        );
                    
                    })}
                </div>
                <div className="btn-container">
                    <button type="button" className="btn" onClick={props.onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}