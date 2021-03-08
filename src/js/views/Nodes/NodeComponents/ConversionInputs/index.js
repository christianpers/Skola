import InputComponent from '../InputComponent';
import './index.scss';

export default class ConversionInputs {
    constructor(definition, parentEl, ) {
        /* EXAMPLE
        {
            name: 'X',
            disabled: false,
            hideMinMax: false,
            applyCallback: fn,
            inputs: [
                {
                    name: 'test',
                    inputSettings: {},
                    conversionFn: () => return 0
                }
            ]
        }
        */
        this._inputs = new Map();
        

        this._inputCallback = this._inputCallback.bind(this);
        this._onInputApply = this._onInputApply.bind(this);

        this._applyCallback = definition.applyCallback;

        const conversionContainer = document.createElement('conversion-inputs');
        parentEl.appendChild(conversionContainer);
        definition.inputs.forEach((t, i) => {
            const input = new InputComponent(conversionContainer, t.name, t.inputSettings, this._onInputApply, definition.disabled, i > 0, this._inputCallback);
            this._inputs.set(t.name, { input, conversionFn: t.conversionFn, isMaster: t.isMaster });

            if (t.isMaster) {
                this._masterInput = input;
            }
        });
    }

    _onInputApply(value, name) {
        this._applyCallback(this._masterInput.getValue());
    }

    _inputCallback(value, name) {
        for (let key of this._inputs.keys()) {
            if (key !== name) {
                const obj = this._inputs.get(key);
                obj.input.setValue(obj.conversionFn(value));
            }
        }
    }

    setValue(value) {
        for (let obj of this._inputs.values()) {
            obj.input.setValue(obj.conversionFn(value));
        }
    }

    getValue() {
        return this._masterInput.getValue();
    }

    show() {
        for (let obj of this._inputs.values()) {
            obj.input.show();
        }
    }

    hide() {
        for (let obj of this._inputs.values()) {
            obj.input.hide();
        }
    }
}