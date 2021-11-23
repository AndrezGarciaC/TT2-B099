import { MathfieldElement } from "mathlive";
import React, { useRef, useEffect } from "react";

function MathField(props) {

    const MathInput = ({ id, onChange, ...rest }) => {
        const ref = useRef();
        useEffect(() => {
            const mfe = new MathfieldElement({ virtualKeyboardMode: "manual" });
            ref.current?.appendChild(mfe);
             mfe.value = props.datos[`${props.name}`].formula;
            mfe.addEventListener("change", onChange);
        }, []);

        return <div ref={ref} {...rest} />
            ;

    };

    return (
        <MathInput className="border form-control"
            onChange={ev => props.setDatos({
                ...props.datos, [props.name]: {
                    ...props.datos[props.name],
                    'formula': ev.target.value
                }
            })}
        />
    );
}

export default MathField;
