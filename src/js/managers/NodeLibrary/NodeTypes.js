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
                title: 'Partiklar',
                type: 'Particles',
                isModifier: false,
            },
            {
                title: 'Solen',
                type: 'Sun',
                isModifier: false,
            },
        ],
        'Modifiers': [
            {
                title: 'Planet storlek',
                type: 'Size Modifier',
                isModifier: true,
            },
            {
                title: 'Planet textur',
                type: 'Texture Selector',
                isModifier: true,
            },
            {
                type: 'Planet Position',
                isModifier: true,
            },
            {
                type: 'Planet Rotation',
                isModifier: true,
            },
            {
                type: 'Form',
                isModifier: true,
            },
            {
                type: 'Color',
                isModifier: true,
            }
        ]
    }
}

export const chemistryTypes = {
    graphics: {
        '3d-shapes': [
            {
                type: 'Atom',
                isModifier: false,
            },
        ],
        'Modifiers': [
            {
                type: 'Protons',
                isModifier: true,
            },
            {
                type: 'Neutrons',
                isModifier: true,
            },
            {
                type: 'Electrons',
                isModifier: true,
            },
        ]
    }
}