export const types = {
    // audio: {
        // audio: [
        //     {
        //         type: 'Oscillator',
        //     },
        //     {
        //         type: 'Gain',
        //     },
        //     {
        //         type: 'Filter',
        //     },
        //     {
        //         type: 'Speaker',
        //     },
        // ],
        // synthar: [
        //     // {
        //     //     type: 'Kick',
        //     // },
        //     // {
        //     //     type: 'FM Synth',
        //     // },
        // ],
        // data: [
        //     {
        //         type: 'LFO',
        //     },
        //     {
        //         type: 'Envelope',
        //     }
        // ],
        // triggers: [
        //     {
        //         type: 'SequencerNode',
        //     }
        // ],
        // 'Ljud analys': [
        //     {
        //         type: 'Ljudvåg',
        //     },
        // ]
    // },
    graphics: {
        '3D - Shapes': [
            {
                type: 'Cube',
                isModifier: false,
            },
            {
                type: 'Sphere',
                isModifier: false,
            },
            {
                type: 'Particles',
                isModifier: false,
            },
        ],
        'Procedural Texture (Material)': [
            {
                type: 'Circle',
                isModifier: false,
            },
            {
                type: 'Voronoi',
                isModifier: false,
            },
            {
                type: 'LavaNoise',
                isModifier: false,
            },
            
        ],
        'Modifiers' : [
            {
                type: 'Color',
                isModifier: true,
            },
            {
                type: 'OrbitDriver',
                isModifier: true,
            },
            {
                type: 'RotationDriver',
                isModifier: true,
            },
            {
                type: 'ParamDriver',
                isModifier: true,
            },
            {
                type: 'Form',
                isModifier: true,
            },
            
        ],
        'Ljus': [
            // {
            //     type: 'Directional Light',
            //     isModifier: false,
            // },
            {
                type: 'Point Light',
                isModifier: false,
            },
        ],
        'Textures': [
            {
                type: 'Texture Selector',
                isModifier: true,
            },
        ]
    }
};

export const spaceTypes = {
    graphics: {
        '3d-shapes': [
            {
                type: 'Planet',
                isModifier: false,
            },
            {
                type: 'Particles',
                isModifier: false,
            },
        ],
        'Modifiers': [
            {
                type: 'Size Modifier',
                isModifier: true,
            },
            {
                type: 'Texture Selector',
                isModifier: true,
            },
            {
                type: 'Space Orbit',
                isModifier: true,
            },
            {
                type: 'Rotation Modifier',
                isModifier: true,
            },
        ]
    }
}

export const chemistryTypes = {
    graphics: {
        '3d-shapes': [
            {
                type: 'Cube',
                isModifier: false,
            },
            {
                type: 'Sphere',
                isModifier: false,
            },
            {
                type: 'Particles',
                isModifier: false,
            },
        ]
    }
}